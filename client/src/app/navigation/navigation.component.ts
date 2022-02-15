import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { AccountService } from '../services/account.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

  model: any = {};

	constructor(public accountService: AccountService) {}

	ngOnInit(): void {
  }

  Login() {
    console.log(this.model);
    this.accountService.Login(this.model).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  Logout() {
    this.accountService.Logout();
  }
}
