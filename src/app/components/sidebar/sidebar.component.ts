import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharingService } from "src/app/services/sharing.service";
import { ClarificationService } from '../../services/clarification.service';
import { Router } from "@angular/router";

declare interface RouteInfo {
  id: number;
  path: string;
  title: string;
  icon: string;
  class: string;
}
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: any[];
  newChatStarted: boolean = true;
  existingChatId: string;
  clarificationList: any[] = [];
  constructor(private sharingService: SharingService,
    private clarificationService: ClarificationService,
    private router: Router) {
  }

  subscription: any;

  ngOnInit() {
    // this.sharingService.addChat$.subscribe(
    //   status => {
    //     if (status) {
    //       this.getMenuItem();
    //     }
    //   }
    // );
    this.getMenuItem();
    this.newChatStarted ? localStorage.setItem('newChatStarted', 'true') : localStorage.setItem('newChatStarted', 'false');
  }

  async getClarificationListData() {
    this.clarificationList = [];
    await this.clarificationService.getClarificationList()
      .then((response) => {
        if (response?.status === 'success' && response?.data?.clarificationList?.length > 0) {
          const clarificationList = response.data.clarificationList;
          clarificationList.forEach(element => {
            if (element && element['_id']) {
              const menuItemObj = {
                menuId: element['_id'],
                menuTitle: element.title,
              }
              this.clarificationList.push(menuItemObj);
            }
          });
        }
      });
    return this.clarificationList;
  }

  async getMenuItem() {
    this.menuItems = [];
    // const arr = JSON.parse(localStorage.getItem('chats'));
    const menuItemsData = await this.getClarificationListData();
    if (menuItemsData?.length > 0) {
      menuItemsData?.forEach(data => {
        if (data) {
          this.menuItems?.push(
            {
              id: data.menuId,
              path: `clarification/${data.menuId}`,
              title: data.menuTitle,
              icon: "icon-world",
              class: ""
            }
          );
        }
      });
    }
  }

  clickNewChat() {
    this.newChatStarted = true;
    this.newChatStarted ? localStorage.setItem('newChatStarted', 'true') : localStorage.setItem('newChatStarted', 'false');
    localStorage.setItem('chatId', '');
    this.existingChatId = '';
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sharingService.getAddChatFalse().subscribe();

  }

  clickExistingClarification(clarificationId: string) {
    this.newChatStarted = false;
    this.newChatStarted ? localStorage.setItem('newChatStarted', 'true') : localStorage.setItem('newChatStarted', 'false');
    localStorage.setItem('chatId', clarificationId);
    this.existingChatId = clarificationId;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sharingService.getAddChatTrue().subscribe();
    this.getSelectedClarificationData(clarificationId);
  }

  getSelectedClarificationData(clarificationId) {
    let conversationArray = [];
    this.clarificationService.getSelectedClarification(clarificationId)
      .then((data) => {
        if (data?.status === 'success' && data?.clarificationData?.conversation?.length > 0) {
          conversationArray = data.clarificationData.conversations;
        }
      });
    this.sharingService.setSelectedClarificationConversation(conversationArray);
  }

  editExistingClarificationTitle(clarificationId: string, title: string) {
    this.editExistingclarificationData(clarificationId, title);
    this.getMenuItem();
  }

  deleteExistingClarification(clarificationId: string) {
    // const arr = JSON.parse(localStorage.getItem('chats'));
    // const newarr = arr?.filter((item) => item.id !== id);
    // newarr?.forEach((element, index) => {
    //   if (element?.id) {
    //     delete element.id;
    //     element.id = index + 1;
    //   }
    // });
    // localStorage.setItem('chats', JSON.stringify(newarr));
    this.deleteExistingclarificationData(clarificationId);
    this.getMenuItem();
    this.router.navigate(['clarification'])
  }

  editExistingclarificationData(clarificationId: string, title: string) {
    this.clarificationService.updateClarificationTitle(clarificationId, title)
      .then((res) => {
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  deleteExistingclarificationData(clarificationId: string) {
    this.clarificationService.deleteClarification(clarificationId)
      .then((res) => {
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
