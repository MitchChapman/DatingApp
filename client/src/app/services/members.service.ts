import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { PaginatedResult } from '../models/pagination.model';
import { UserModel } from '../models/user.model';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';


@Injectable({
	providedIn: 'root',
})
export class MembersService {

  baseUrl: string = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: UserModel;
  userParams: UserParams;

	constructor(private httpClient: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(
			(user) => {
				this.user = user;
				this.userParams = new UserParams(user);
			}
		)
  }

  GetUserParams() {
    return this.userParams;
  }

  SetUserParams(newParameters: UserParams) {
    this.userParams = newParameters;
  }

  ResetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  GetMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response) {
      return of(response);
    }

    let params = this.GetPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    
    return this.GetPaginatedResult<Member[]>(`${this.baseUrl}users`, params).pipe(
      map(
        (response) => {
          this.memberCache.set(Object.values(userParams).join('-'), response);
          return response;
        }
      )
    );
  }

  GetMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((previousArray, currentElement) => previousArray.concat(currentElement.result), [])
      .find((member: Member) => member.username === username);

    if(member) {
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

  private GetPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.httpClient.get<T>(
      `${url}`,
      { observe: 'response', params }
    ).pipe(
      map(
        (response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }
      )
    );
  }

  private GetPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }

  AddLike(username: string) {
    return this.httpClient.post(
      `${this.baseUrl}likes/${username}`,
      {}
    )
  }

  GetLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = this.GetPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.GetPaginatedResult<Partial<Member[]>>(`${this.baseUrl}likes`, params);
  }
}