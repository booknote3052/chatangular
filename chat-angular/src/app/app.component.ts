import { Component } from '@angular/core';
import { ChatService } from './chat.service';

import io from 'socket.io-client';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = new FormControl();
  title = 'chat-angular';
  user: string;
  room: string;
  isShow: boolean;
  messageText: string;
  typingArray: Array<{ user: string, message: string }> = [];
  messageArray: Array<{ user: string, message: string }> = [];

  constructor(private _chatservice: ChatService) {
    this._chatservice.newUserJoined()
      .subscribe(data => this.messageArray.push(data));


    this._chatservice.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this._chatservice.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));

    this._chatservice.typingnewMessageReceived()
      .subscribe(data => this.typingArray.push(data));

    this._chatservice.typingAdd(this.isShow);

    this._chatservice.typingDel(this.isShow);

    this._chatservice.isShow.subscribe({
      next: (p) => {
        this.isShow = p;
      }
    });
  }
  typing() {
    this._chatservice.typingMessage({ user: this.user, room: this.room, message: this.name.value });


  }
  join() {
    this._chatservice.joinRoom({ user: this.user, room: this.room });
  }
  leave() {
    this._chatservice.leaveRoom({ user: this.user, room: this.room });
  }
  sendMessage() {
    this._chatservice.sendMessage({ user: this.user, room: this.room, message: this.name.value });
  }

}
