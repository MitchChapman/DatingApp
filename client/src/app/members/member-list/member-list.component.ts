import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
import { UserModel } from 'src/app/models/user.model';
import { UserParams } from 'src/app/models/userParams';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { take } from 'rxjs/operators'

@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
	members: Member[];
	pagination: Pagination;
	userParams: UserParams;
	user: UserModel;
	genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

	constructor(private memberService: MembersService) {
		this.userParams = this.memberService.GetUserParams();
	}

	ngOnInit(): void {
    	this.LoadMembers();
  	}

	LoadMembers() {
		this.memberService.SetUserParams(this.userParams);
		this.memberService.GetMembers(this.userParams).subscribe(
			(response) => {
				this.members = response.result;
				this.pagination = response.pagination;
			}
		);
	}

	ResetFilters() {
		this.userParams = this.memberService.ResetUserParams();
		this.LoadMembers();
	}

	PageChanged(event: any) {
		this.userParams.pageNumber = event.page;
		this.memberService.SetUserParams(this.userParams);
		this.LoadMembers();
	}
}