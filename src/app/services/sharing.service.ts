import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()

export class SharingService {
    private addChatSource = new BehaviorSubject<string>('false');
    public addChat$ = this.addChatSource.asObservable();
    conversationArray: any[] = [];

  constructor() {
    this.addChat$.subscribe(status => window.localStorage.setItem('addChat', status));
  }

//   getAddChat(): Observable<string> {
//     let chatStatus = window.localStorage.getItem('addChat');
//     chatStatus = (chatStatus === 'false' || chatStatus == null) ? 'true' : 'false';
//     this.addChatSource.next(chatStatus);
//     return this.addChat$;
//   }

getAddChatTrue(): Observable<string> {
    let chatStatus = 'true';
    this.addChatSource.next(chatStatus);
    return this.addChat$;
  }

  getAddChatFalse(): Observable<string> {
    let chatStatus = 'false';
    this.addChatSource.next(chatStatus);
    return this.addChat$;
  }

  setSelectedClarificationConversation(val:any) {
    this.conversationArray = val;
  }

  getSelectedClarificationConversation() {
    return this.conversationArray;
  }

  
}