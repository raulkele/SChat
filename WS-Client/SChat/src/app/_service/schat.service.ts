import { Injectable } from '@angular/core';
import { CONFIG } from '../core/config';
import io from 'socket.io-client';
import { Observable, of } from 'rxjs';
import { Message } from '../_models/message';
import * as CryptoJS from 'crypto-js';


@Injectable()
export class SChatService {
  private url = CONFIG.APIUrl;
  private socket: any;
  private activeChaters = 0;
  private key: string;
  private chatId: string;
  private messages: Message[] = [];
  public messages$: Observable<Message[]>;

  constructor() {
    this.messages$ = of(this.messages);
  }

  public initSocket(chatId: string): void {
    console.log('initing socket');
    this.chatId = chatId;
    this.socket = io(this.url, {query: {token: chatId}});
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('disconnect', (reason) => {
      console.log('disconnected');
      console.log('reason for DC', reason);
    });
    this.socket.on('connect_error', (err) => {
      console.log('connect error', err);
    });
    this.socket.on('connections', (response) => {
      this.activeChaters = response;
      console.log('Active Chatters: ', this.activeChaters);
    });
    this.socket.on('events', (response) => {
      console.log(response);
    });
    this.socket.on('message', (response) => {
      console.log('got message', response);
      const message = response.data.data;
      const textMsg = CryptoJS.AES.decrypt(message, this.key).toString(CryptoJS.enc.Utf8);
      this.messages.push({message: textMsg, sender: 1});

    });

    this.socket.on('messageSent', (response) => {
      console.log('message successfully sent!');
      const textMsg = CryptoJS.AES.decrypt(response, this.key).toString(CryptoJS.enc.Utf8);
      this.messages.push({message: textMsg, sender: 0});

    });

    this.socket.on('key', (response) => {
      console.log('key event', response);
      this.key = response;
    });
  }

  public sendMessage(message: string): void {
    const msg = CryptoJS.AES.encrypt(message, this.key).toString();
    this.socket.emit('send_message', msg);
  }
}
