import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import { Photo } from 'src/app/models/photo.model';
import { UserModel } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-photo-editor',
	templateUrl: './photo-editor.component.html',
	styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
	@Input() member: Member;
	uploader: FileUploader;
	hasBaseDropZoneOver: boolean = false;
	baseUrl = environment.apiUrl;
	user: UserModel;

	constructor(private accountService: AccountService, private memberService: MembersService) {
		this.accountService.currentUser$.pipe(
			take(1)
		)
		.subscribe(
			(user) => {
				this.user = user;
			}
		)
	}

	ngOnInit(): void {
		this.InitialiseUploader();
	}

	FileOverBase(event: any) {
		this.hasBaseDropZoneOver = event;
	}

	SetMainPhoto(photo: Photo) {
		this.memberService.SetMainPhoto(photo.id).subscribe(
			() => {
				this.user.photoUrl = photo.url;
				this.accountService.SetCurrentUser(this.user);
				this.member.photoUrl = photo.url;
				this.member.photos.forEach(p => {
					if (p.isMain) {
						p.isMain = false;
					}
					if (p.id === photo.id) {
						p.isMain = true;
					}
				})
			}
		);
	}

	DeletePhoto(photoId: number) {
		this.memberService.DeletePhoto(photoId).subscribe(
			() => {
				this.member.photos = this.member.photos.filter(x => x.id !== photoId);
			}
		)
	}

	InitialiseUploader() {
		this.uploader = new FileUploader({
			url: `${this.baseUrl}users/add-photo`,
			authToken: `Bearer ${this.user.token}`,
			isHTML5: true,
			allowedFileType: ['image'],
			removeAfterUpload: true,
			autoUpload: false,
			maxFileSize: 10 * 1024 * 1024
		});

		this.uploader.onAfterAddingFile = (file) => {
			file.withCredentials = false;
		}

		this.uploader.onSuccessItem = (item, response, status, headers) => {
			if (response) {
				const photo = JSON.parse(response);
				this.member.photos.push(photo);
			}
		}
	}
}
