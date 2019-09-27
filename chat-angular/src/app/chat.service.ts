import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { NgModule } from '@angular/core';



export class ChatService {
    public isShow: BehaviorSubject<boolean> = new BehaviorSubject(false);
    socket = io('http://localhost:3000');
    public toggleCreatorPopup(data) {

        this.isShow.next(data);
    }

    popupIsOpen(): Observable<any> {
        return this.isShow.asObservable();
    }
    joinRoom(data) {
        this.socket.emit('join', data);
    }
    Message(data) {
        this.socket.emit('message', data);
    }
    newUserJoined() {
        const observable = new Observable<{ user: string, message: string }>(observer => {
            this.socket.on('new user joined', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });

        return observable;
    }
    typingAdd(data) {
        this.socket.on('typingadd', (data: any) => {
            data.isShow = true;
            console.log(data.isShow);
            this.toggleCreatorPopup(data.isShow);
        });
    }
    typingDel(data) {
        this.socket.on('typingdel', (data: any) => {
            data.isShow = false;
            console.log(data.isShow);
            this.toggleCreatorPopup(data.isShow);
        });
    }
    leaveRoom(data) {
        this.socket.emit('leave', data);
    }

    userLeftRoom() {
        const observable = new Observable<{ user: string, message: string }>(observer => {
            this.socket.on('left room', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });

        return observable;
    }

    sendMessage(data) {
        this.socket.emit('message', data);
    }
    typingMessage(data) {

        this.socket.emit('typing', data);
    }
    typingnewMessageReceived() {
        const observable = new Observable<{ user: string, message: string }>(observer => {
            this.socket.on('typin', (data) => {
                observer.next(data);

            });
            return () => { this.socket.disconnect(); }
        });

        return observable;
    }
    newMessageReceived() {
        const observable = new Observable<{ user: string, message: string }>(observer => {
            this.socket.on('new message', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });

        return observable;
    }
}