import { Component, OnInit, ViewChild } from "@angular/core";
import { SharingService } from "src/app/services/sharing.service";
import { ChatService } from './../../services/chat.service';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"], 

})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  textMsg: string;
  chats: any[] = [];
  id: number = 0;
  subscription: any;
  public userInput: string;
  constructor(private sharingDataSer: SharingService, public chatService: ChatService) {}

  ngOnInit() {
  }

  async sendMessage() {
    if (this.textMsg.trim() === '') {
      return;
    }
    try {
      this.chats = JSON.parse(localStorage.getItem('chats'))? JSON.parse(localStorage.getItem('chats')): [];
      this.id = this.chats?.length + 1;
      if(localStorage.getItem('newChatStarted') == 'true') {
        this.chats.push({id: this.id, title: this.textMsg, sendMsgs: [this.textMsg]});
        localStorage.setItem('chatId', this.id.toString());
        this.id++;
      } else {
        const chatId = Number(localStorage.getItem('chatId'));
        const msgs = JSON.parse(localStorage.getItem('chats'))? (JSON.parse(localStorage.getItem('chats')))[chatId-1]?.sendMsgs: [];
        msgs.push(this.textMsg);
        this.chats[chatId-1].sendMsgs = msgs;
      }
      localStorage.setItem('chats', JSON.stringify(this.chats));
      localStorage.setItem('newChatStarted', 'false');
      this.textMsg = '';

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.sharingDataSer.getAddChatTrue().subscribe();
      
    } catch (err) {
      console.log(err);
    }
  }

  // sendMessage() {
  //   this.chatService.sendMessage(this.userInput);
  //   this.userInput = '';
  // }
}
