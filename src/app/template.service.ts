import { Injectable } from '@angular/core';
import {WebsocketService} from './websocket.service';
import {ConnectionService} from './connection.service';
import {Template} from './template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  templates: Template[] = [];

  constructor(private connectionService: ConnectionService,
              private websocketService: WebsocketService) {
    this.updateTemplates();
  }

  updateTemplates() {
    this.websocketService.sendMessage('getTemplates', {connectionId: this.connectionService.connectionId}, (message) => {
      console.log(message);
      this.templates = message.templates;
    });
  }
}
