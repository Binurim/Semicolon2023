import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
 selector: 'app-icons',
 templateUrl: './icons.component.html',
 styleUrls: ["./icons.component.scss"]
})
export class IconsComponent implements OnInit {

  constructor(private sharingService: SharingService) {}
  
  messages: [] = [];
  chatstarted: boolean = false;

  ngOnInit() {
    this.sharingService.addChat$.subscribe(
      status => { 
        if(status) {
          this.chatstarted = status == 'true';
          this.createChat();
        }
      }
    );
  }

  createChat() {
    const arr = JSON.parse(localStorage.getItem('chats'));
    if(arr) {
      this.messages = arr[Number(localStorage.getItem('chatId'))-1]?.sendMsgs;
    }
  }
}