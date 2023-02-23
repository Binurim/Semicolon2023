import { Component, OnInit, ViewChild } from "@angular/core";
import { SharingService } from "src/app/services/sharing.service";
import { ClarificationService } from '../../services/clarification.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],

})
export class FooterComponent implements OnInit {
  inputClarification: string;
  chats: any[] = [];
  id: number = 0;
  subscription: any;
  showFeedbackButton: boolean = false;
  clarificationId: string = '';
  public userInput: string;
  constructor(
    private router: Router,
    private sharingService: SharingService,
    public clarificationService: ClarificationService,
    public notifyService: NotificationService) { }

  ngOnInit() {
  }

  async sendMessage() {
    if (this.inputClarification.trim() === '') {
      return;
    }
    try {

      // this.chats = JSON.parse(localStorage.getItem('chats'))? JSON.parse(localStorage.getItem('chats')): [];
      // this.id = this.chats?.length + 1;
      // if(localStorage.getItem('newChatStarted') == 'true') { 
      //   this.showFeedbackButton = true;
      //   this.chats.push({id: this.id, title: this.textMsg, sendMsgs: [this.textMsg]});
      //   localStorage.setItem('chatId', this.id.toString());
      //   this.id++;
      // } else {
      //   this.showFeedbackButton = true;
      //   const chatId = Number(localStorage.getItem('chatId'));
      //   const msgs = JSON.parse(localStorage.getItem('chats'))? (JSON.parse(localStorage.getItem('chats')))[chatId-1]?.sendMsgs: [];
      //   msgs.push(this.textMsg);
      //   this.chats[chatId-1].sendMsgs = msgs;
      // }
      // localStorage.setItem('chats', JSON.stringify(this.chats));
      // localStorage.setItem('newChatStarted', 'false');
      // this.textMsg = '';

      // if (this.subscription) {
      //   this.subscription.unsubscribe();
      // }
      // this.subscription = this.sharingService.getAddChatTrue().subscribe();
      this.sendClarification(this.sharingService.getClarificationId());
      if (this.sharingService.getIsNewClarificationClicked()) {
        this.sendClarification(this.sharingService.getClarificationId());
      } else {
        await this.addNewClarificationToTheList();
        //id comes as empty.. need to check it-------------------------------
        // this.sendClarification(this.sharingService.getClarificationId());
      }
    } catch (err) {
      console.log(err);
    }
  }

  async addNewClarificationToTheList() {
    let clarificationId = '';
    const newClarificationObj = { title: "New Clarification" };
    this.clarificationService.createNewClarification(newClarificationObj)
      .then((res) => {
        if (res?.status === "success" && res?.data?.newClarification) {
          clarificationId = res.data.newClarification['_id'];
        }
        this.router.navigate([`clarification/${clarificationId}`]);
        this.sharingService.setIsNewClarificationClicked(false);
        this.sharingService.setClarificationId(clarificationId);
        //need to implement getMenuItem part for sidebar.
      })
      .catch((err) => {
        this.notifyService.showError("Error Occured while adding new clarification title !!", "Notification");
        console.log('err', err);
        this.sharingService.setIsNewClarificationClicked(false);
        this.sharingService.setClarificationId('');
      });
  }

  sendClarification(clarificationId: string) {
    const requestObj = { request: this.inputClarification };
    this.clarificationService.updateExistingClarification(clarificationId, requestObj)
      .then((res) => {
        this.inputClarification = '';
      })
      .catch((err) => {
        this.notifyService.showError("Error Occured while modifying the Clarification !!",
          "Notification");
        console.log('err', err);
      });
  }


  sendFeedback() {
  }
}
