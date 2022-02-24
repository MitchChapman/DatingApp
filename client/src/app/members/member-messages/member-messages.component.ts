import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages: Message[];
  @Input() username: string;
  messageContent: string;
  @ViewChild('messageForm') messageForm: NgForm;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  SendMessage() {
    this.messageService.SendMessage(this.username, this.messageContent).subscribe(
      (message) => {
        this.messages.push(message);
        this.messageForm.reset();
      }
    );
  }
}
