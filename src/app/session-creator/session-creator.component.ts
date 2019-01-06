import { Component, OnInit } from '@angular/core';
import {Template} from '../template';
import {Router} from '@angular/router';
import {TemplateService} from '../template.service';
import {WebsocketService} from '../websocket.service';

@Component({
  selector: 'app-session-creator',
  templateUrl: './session-creator.component.html',
  styleUrls: ['./session-creator.component.scss']
})
export class SessionCreatorComponent implements OnInit {

  constructor(public templateService: TemplateService,
              private websocketService: WebsocketService,
              private router: Router) { }

  createSession(template: Template) {
    this.websocketService.sendMessage('create', {template: template.id}, (message) => {
      this.router.navigate(['edit', message.connectionId]);
    });
  }

  ngOnInit() {
  }

}
