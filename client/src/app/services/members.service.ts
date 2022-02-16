import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';


@Injectable({
	providedIn: 'root',
})
export class MembersService {

  baseUrl: string = environment.apiUrl;

	constructor(private httpClient: HttpClient) {}

  GetMembers() {
    return this.httpClient.get<Member[]>(
      `${this.baseUrl}users`
    )
  }

  GetMember(username: string) {
    return this.httpClient.get(
      `${this.baseUrl}users/${username}`
    )
  }
}