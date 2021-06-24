import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from 'src/app/core/config';
import { Message } from 'src/app/_models/message';
import { SChatService } from 'src/app/_service/schat.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-schat',
  templateUrl: './schat.component.html',
  styleUrls: ['./schat.component.css']
})
export class SchatComponent implements OnInit {

  private chatId: string;

  public message: string;

  public messageList: Message[] = [];

  constructor(private sChatService: SChatService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    console.log('entered components');
    this.chatId = this.route.snapshot.params.id;
    if (!this.chatId || this.chatId === '' || this.chatId === 'new') {
      const uuid = uuidv4();
      this.router.navigate(['/', uuid]);
      this.sChatService.initSocket(uuid);
    } else{
      this.sChatService.initSocket(this.chatId);
    }
    this.sChatService.messages$.subscribe(msgList => {
      this.messageList = msgList;
    });
  }

  public sendMessage(): void {
    this.sChatService.sendMessage(this.message);
    this.message = '';
  }
}
