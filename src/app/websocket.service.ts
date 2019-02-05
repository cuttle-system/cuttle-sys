import { Injectable } from '@angular/core';
import { WebsocketClient} from './websocket-client';
import { environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: WebsocketClient;

  sendMessage(type: string, message: object, callback): void {
    this.client.sendMessage(type, message, callback);
  }

  onMessageRecieved(type: string, callback) {
    this.client.addMessageHandler(type, callback);
  }

  private errorMessageHandler(json) {
    console.log('An error occurred');
    console.log(json);
  }

  constructor() {
    this.client = new WebsocketClient(environment.websocketUrl);
    this.client.addMessageHandler('error', this.errorMessageHandler);
  }
}
