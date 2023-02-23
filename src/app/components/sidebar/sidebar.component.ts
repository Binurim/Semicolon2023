import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharingService } from "src/app/services/sharing.service";
import { ClarificationService } from '../../services/clarification.service';
import { Router } from "@angular/router";
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';

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
  constructor(
    private sharingService: SharingService,
    private clarificationService: ClarificationService,
    private notifyService: NotificationService,
    private utilityService: UtilityService,
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

  async getMenuItem() {
    this.menuItems = [];
    const menuItemsData = await this.utilityService.getClarificationListData();
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

  async clickNewClarification() {
    this.newChatStarted = true;
    this.newChatStarted ? localStorage.setItem('newChatStarted', 'true') : localStorage.setItem('newChatStarted', 'false');
    await this.addNewClarificationToTheList();
    // localStorage.setItem('chatId', '');
    // this.existingChatId = '';
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    // this.subscription = this.sharingService.getAddChatFalse().subscribe();

  }

  addNewClarificationToTheList() {
    const newClarificationObj = { title: "New Clarification" };
    let clarificationId = '';
    this.clarificationService.createNewClarification(newClarificationObj)
      .then((res) => {
        if (res?.status === "success" && res?.data?.newClarification) {
          clarificationId = res.data.newClarification['_id'];
        }
        this.router.navigate([`clarification/${clarificationId}`]);
        this.sharingService.setIsNewClarificationClicked(true);
        this.sharingService.setClarificationId(clarificationId);
        this.getMenuItem();
      })
      .catch((err) => {
        this.notifyService.showError("Error Occured while adding new clarification title !!", "Notification");
        this.sharingService.setIsNewClarificationClicked(false);
        this.sharingService.setClarificationId('');
        console.log('err', err);
      });
    this.newChatStarted = false;
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
    this.utilityService.getSelectedClarificationData(clarificationId);
  }

  async editExistingClarificationTitle(clarificationId: string, title: string) {
    this.utilityService.editExistingclarificationData(clarificationId, title);
    await this.getMenuItem();
  }

  async deleteExistingClarification(clarificationId: string) {
    this.utilityService.deleteExistingclarificationData(clarificationId);
    await this.getMenuItem();
    this.router.navigate(['clarification'])
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
