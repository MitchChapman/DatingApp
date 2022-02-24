import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message.model';
import { Pagination } from '../models/pagination.model';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container = 'Unread'
  pageNumber = 1;
  pageSize = 5;
  loading: boolean = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.LoadMessages();
  }

  LoadMessages() {
    this.loading = true;
    this.messageService.GetMessages(this.pageNumber, this.pageSize, this.container).subscribe(
    (response) => {
      this.messages = response.result;
      this.pagination = response.pagination
      this.loading = false;
    }
    );
  }

  DeleteMessage(id: number) {
    this.messageService.DeleteMessage(id).subscribe(
      () => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
      }
    )
  }

  PageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.LoadMessages();
    }
  }
}
