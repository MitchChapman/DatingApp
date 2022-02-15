import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserModel } from './models/user.model';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.SetCurrentUser();
  }

  SetCurrentUser() {
    const user: UserModel = JSON.parse(localStorage.getItem('user'));
    this.accountService.SetCurrentUser(user);
  }
}