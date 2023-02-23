import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

let speech = new SpeechSynthesisUtterance();

function readText(txt){ speech.text = txt; speech.rate =1; speech.volume = 1; speech.pitch =1; speech.lang="en-US"; window.speechSynthesis.speak(speech); }

export interface Clarification {
  request: string;
  response: string;
  timestamp?: number;
}

@Component({
  selector: 'app-clarifications',
  templateUrl: './clarifications.component.html',
  styleUrls: ["./clarifications.component.scss"]
})

export class ClarificationsComponent implements OnInit {
  isNewClStarted: boolean = false;
  isContinueExistingCl: boolean = false;
  isRename: boolean = false;
  isFeedback: boolean = false;
  isDelete: boolean = false;
  isInitialLanding: boolean = true;
  clarificationArray: Clarification[] = [];
  chatstarted: boolean = false;

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
    this.clarificationArray = this.sharingService.getSelectedClarificationArray();
  }

  showUserGuideData(data: string) {
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

  readMesg(text: string) {
    readText(text);
  }

  stopRead() {
    window.speechSynthesis.cancel();
  }
}