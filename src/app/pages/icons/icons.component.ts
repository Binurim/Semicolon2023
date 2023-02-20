import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ["./icons.component.scss"]
})
export class IconsComponent implements OnInit {
  isNewClStarted: boolean = false;
  isContinueExistingCl: boolean = false;
  isRename: boolean = false;
  isFeedback: boolean = false;
  isDelete: boolean = false;
  isInitialLanding: boolean = true;
  messages: [] = [];
  chatstarted: boolean = false;
  movies = [{name: 'asd', description:'sdfgh'}]
  favoriteMovies = [{name: 'fvb', description:'dfvgbh'}]

  constructor(private sharingService: SharingService) { }


  ngOnInit() {
    this.sharingService.addChat$.subscribe(
      status => {
        if (status) {
          this.chatstarted = status == 'true';
          if(!this.chatstarted) {
            this.isNewClStarted = false;
            this.isContinueExistingCl = false;
            this.isRename = false;
            this.isFeedback = false;
            this.isDelete = false;
            this.isInitialLanding = true;
          }
          this.createChat();
        }
      }
    );
  }

  createChat() {
    const arr = JSON.parse(localStorage.getItem('chats'));
    if (arr) {
      this.messages = arr[Number(localStorage.getItem('chatId')) - 1]?.sendMsgs;
    }
  }

  showUserGuideData(data: string) {
    console.log('data', data);
    switch (data) {
      case 'newCl': {
        this.isNewClStarted = true;
        this.isContinueExistingCl = false;
        this.isRename = false;
        this.isFeedback = false;
        this.isDelete = false;
        this.isInitialLanding = false;
        break;
      }
      case 'continueEx': {
        this.isContinueExistingCl = true;
        this.isNewClStarted = false;
        this.isRename = false;
        this.isFeedback = false;
        this.isDelete = false;
        this.isInitialLanding = false;
        break;
      }
      case 'rename': {
        this.isRename = true;
        this.isNewClStarted = false;
        this.isContinueExistingCl = false;
        this.isFeedback = false;
        this.isDelete = false;
        this.isInitialLanding = false;
        break;
      }
      case 'feedback': {
        this.isFeedback = true;
        this.isNewClStarted = false;
        this.isContinueExistingCl = false;
        this.isRename = false;
        this.isDelete = false; 
        this.isInitialLanding = false;
        break;
      }
      case 'delete': {
        this.isDelete = true;
        this.isNewClStarted = false;
        this.isContinueExistingCl = false;
        this.isRename = false;
        this.isFeedback = false;
        this.isInitialLanding = false;
        break;
      }
      default: {
        this.isNewClStarted = false;
        this.isContinueExistingCl = false;
        this.isRename = false;
        this.isFeedback = false;
        this.isDelete = false;
        this.isInitialLanding = true;
        break;
      }
    }
  }

  back() {
    this.isNewClStarted = false;
    this.isContinueExistingCl = false;
    this.isRename = false;
    this.isFeedback = false;
    this.isDelete = false;
    this.isInitialLanding = true;
  }
}