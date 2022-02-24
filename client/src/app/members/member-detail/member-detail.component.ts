import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member.model';
import { Message } from 'src/app/models/message.model';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
	selector: 'app-member-detail',
	templateUrl: './member-detail.component.html',
	styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  activeTab: TabDirective;
  messages: Message[] = [];

	constructor(private memberService: MembersService, 
              private route: ActivatedRoute, 
              private messageService: MessageService) {}

	ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.member = data.member;
      }
    )

    this.route.queryParams.subscribe(
      (params) => {
        params.tab ? this.SelectTab(params.tab) : this.SelectTab(0);
      }
    );

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages = this.GetImages();
  }

  GetImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      });
    }

    return imageUrls;
  }

  LoadMessages() {
    this.messageService.GetMessageThread(this.member.username).subscribe(
      (messages) => {
        this.messages = messages;
      }
    )
  }

  OnTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.LoadMessages();
    }
  }

  SelectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
}
