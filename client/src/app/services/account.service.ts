import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';

@Injectable({
	providedIn: 'root',
})
export class AccountService {

  baseUrl: string = environment.apiUrl;
  private currentUserSource = new ReplaySubject<UserModel>(1);
  currentUser$ = this.currentUserSource.asObservable();

	constructor(private httpClient: HttpClient) {}

  Login(model: any) {
    return this.httpClient.post(
      `${this.baseUrl}account/login`,
      model
    )
    .pipe(
      map(
        (response: UserModel) => {
          const user = response;
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        }
      )
    )
  }

  Register(model: any) {
    return this.httpClient.post(
      `${this.baseUrl}account/register`,
      model
    )
    .pipe(
      map(
        (user: UserModel) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        }
      )
    )
  }

  SetCurrentUser(user: UserModel) {
  this.currentUserSource.next(user);
  }

  Logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}