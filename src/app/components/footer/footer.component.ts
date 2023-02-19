import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"], 

})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  public userInput: string;

  constructor(public chatService: ChatService) {}

  ngOnInit() {}

  sendMessage() {
    this.chatService.sendMessage(this.userInput);
    this.userInput = '';
  }
}
