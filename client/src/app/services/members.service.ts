import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';


@Injectable({
	providedIn: 'root',
})
export class MembersService {

  baseUrl: string = environment.apiUrl;
  members: Member[] = [];

	constructor(private httpClient: HttpClient) {}

  GetMembers() {
    if(this.members.length > 0) {
      return of(this.members);
    }
    return this.httpClient.get<Member[]>(
      `${this.baseUrl}users`
    ).pipe(
      map(
        (members) => {
          this.members = members;
          return this.members;
        }
      )
    )
  }

  GetMember(username: string) {
    const member = this.members.find(member => member.username === username);
    if (member !== undefined) {
      return of(member);
    }
    return this.httpClient.get<Member>(
      `${this.baseUrl}users/${username}`
    )
  }

  UpdateMember(member: Member) {
    return this.httpClient.put(
      `${this.baseUrl}users`,
      member
    ).pipe(
      map(
        () => {
          const index = this.members.indexOf(member);
          this.members[index] = member;
        }
      )
    );
  }

  SetMainPhoto(photoId: number) {
    return this.httpClient.put(
      `${this.baseUrl}users/set-main-photo/${photoId}`,
      null
    )
  }

  DeletePhoto(photoId: number) {
    return this.httpClient.delete(
      `${this.baseUrl}users/delete-photo/${photoId}`
    )
  }
}