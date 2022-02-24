import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';
import { MembersService } from '../services/members.service';

@Injectable({ providedIn: 'root' })
export class MemberDetailResolver implements Resolve<Member> {

    constructor(private memberService: MembersService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.memberService.GetMember(route.paramMap.get('username'));
    }
}