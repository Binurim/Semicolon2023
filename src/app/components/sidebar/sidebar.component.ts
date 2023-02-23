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
  isEditEnable: boolean = false;
  isDeleteEnable: boolean = false;
  menuItemTitle: string = '';
  constructor(
    private sharingService: SharingService,
    private clarificationService: ClarificationService,
    private notifyService: NotificationService,
    private utilityService: UtilityService,
    private router: Router) {

      this.router.events.subscribe(data=> {
        this.sharingService.setClarificationId((window.location.href.toString().split('/'))[5]);
      })
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

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sharingService.getAddChatFalse().subscribe();

    // localStorage.setItem('chatId', '');
    // this.existingChatId = '';
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    // this.subscription = this.sharingService.getAddChatFalse().subscribe();
    this.isEditEnable = false;
    this.isDeleteEnable = false;
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

  clickExistingClarification(clarificationId: string, title: string) {
     this.menuItemTitle = title;
    this.newChatStarted = false;
    this.newChatStarted ? localStorage.setItem('newChatStarted', 'true') : localStorage.setItem('newChatStarted', 'false');

    this.existingChatId = clarificationId;
    this.utilityService.getSelectedClarificationData(clarificationId);
    
    this.sharingService.setClarificationId(clarificationId);
  }

  onEdit() {
    this.isEditEnable = true;
  }

  cancelEdit(){
    this.isEditEnable = false;
  }

  onDelete() {
    this.isDeleteEnable = true;
  }

  cancelDelete(){
    this.isDeleteEnable = false;
  }

  async editExistingClarificationTitle(clarificationId: string, title: string) {
    this.utilityService.editExistingclarificationData(clarificationId, title);
    await this.getMenuItem();
    this.isEditEnable = false;
  }

  async deleteExistingClarification(clarificationId: string) {
    this.utilityService.deleteExistingclarificationData(clarificationId);
    await this.getMenuItem();
    this.router.navigate(['clarification'])
    this.isDeleteEnable = false;
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
