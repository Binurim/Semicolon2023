import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharingService } from "src/app/services/sharing.service";

declare interface RouteInfo {
  id: number;
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  // {
  //   path: "/dashboard",
  //   title: "Dashboard",
  //   rtlTitle: "لوحة القيادة",
  //   icon: "icon-chart-pie-36",
  //   class: ""
  // },
  // {
  //   path: "/icons",
  //   title: "Icons",
  //   rtlTitle: "الرموز",
  //   icon: "icon-atom",
  //   class: ""
  // },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   rtlTitle: "خرائط",
  //   icon: "icon-pin",
  //   class: "" },
  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   rtlTitle: "إخطارات",
  //   icon: "icon-bell-55",
  //   class: ""
  // },

  // {
  //   path: "/user",
  //   title: "User Profile",
  //   rtlTitle: "ملف تعريفي للمستخدم",
  //   icon: "icon-single-02",
  //   class: ""
  // },
  // {
  //   path: "/tables",
  //   title: "Table List",
  //   rtlTitle: "قائمة الجدول",
  //   icon: "icon-puzzle-10",
  //   class: ""
  // },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   rtlTitle: "طباعة",
  //   icon: "icon-align-center",
  //   class: ""
  // },
  // {
  //   path: "/rtl",
  //   title: "RTL Support",
  //   rtlTitle: "ار تي ال",
  //   icon: "icon-world",
  //   class: ""
  // }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: any[];
  newChatStarted: boolean = true;
  existingChatId: string;
  constructor(private sharingService: SharingService) {
  }

  subscription: any;

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.sharingService.addChat$.subscribe(
      status => { 
        if(status) {
          this.getMenuItem();
        }
      }
    );
    this.getMenuItem();
    this.newChatStarted? localStorage.setItem('newChatStarted', 'true'): localStorage.setItem('newChatStarted', 'false');
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  getMenuItem() {
    this.menuItems = [];
    const arr = JSON.parse(localStorage.getItem('chats'));
    arr?.forEach(item => {
      if(item) {
        this.menuItems?.push(
          {
                id: item.id,
                path: `chat/${item.id}`,
                title: item.title,
                icon: "icon-world",
                class: ""
          }
        );
      }
    });
  }

  clickNewChat() {
    this.newChatStarted = true;
    this.newChatStarted? localStorage.setItem('newChatStarted', 'true'): localStorage.setItem('newChatStarted', 'false');
    localStorage.setItem('chatId', '');
    this.existingChatId = '';
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sharingService.getAddChatFalse().subscribe();
    
  }

  clickExistingChat(id: number) {
    this.newChatStarted = false;
    this.newChatStarted? localStorage.setItem('newChatStarted', 'true'): localStorage.setItem('newChatStarted', 'false');
    localStorage.setItem('chatId', id.toString());
    this.existingChatId = id.toString();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.sharingService.getAddChatTrue().subscribe();
    
  }

  deleteExistingChat(id: number) {
    const arr = JSON.parse(localStorage.getItem('chats'));
    const newarr = arr?.filter((item) => item.id !== id);
    newarr?.forEach((element, index) => {
      if(element?.id) {
        delete element.id;
        element.id = index+1;
      }
    });
    localStorage.setItem('chats', JSON.stringify(newarr));
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
