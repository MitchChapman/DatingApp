import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member.model';
import { Pagination } from '../models/pagination.model';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate: string = 'liked';
  pageNumber=  1;
  pageSize = 5;
  pagination: Pagination;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.LoadLikes();
  }

  LoadLikes() {
    this.memberService.GetLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(
      (response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    );
  }

  PageChanged(event: any) {
    this.pageNumber = event.page;
    this.LoadLikes();
  }
}
