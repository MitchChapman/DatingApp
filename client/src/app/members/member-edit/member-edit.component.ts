import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member.model';
import { UserModel } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

  member: Member;
  user: UserModel
  @ViewChild('editForm') form: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any) {
    if (this.form.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberService: MembersService,
              private toastrService: ToastrService) {
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
    this.LoadMember();
  }

  LoadMember() {
    this.memberService.GetMember(this.user.username).subscribe(
      (member) => {
        this.member = member;
      }
    );
  }

  UpdateMember() {
    this.memberService.UpdateMember(this.member).subscribe(
      () => {
        this.toastrService.success('Profile updated successfully');
        this.form.reset(this.member);
      }
    );
  }
}
