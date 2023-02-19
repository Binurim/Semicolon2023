import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) {}

  public sendMessage(userInput: any) {
    console.log(userInput);
    return this.http.post(`blah`, {});
  }
  
  public getReply() {
    return this.http.get(`blah`, {});
  }
}