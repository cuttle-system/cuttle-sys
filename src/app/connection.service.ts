import { Injectable } from '@angular/core';
import {WebsocketService} from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  connectionId: string;

  constructor(private websocketService: WebsocketService) { }

  setConnectionId(connectionId: string): void {
    this.connectionId = connectionId;
    this.websocketService.sendMessage('getFilesList', {connectionId: this.connectionId}, () => {});
  }
}
