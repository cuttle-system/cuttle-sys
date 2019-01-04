import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  connectionId: string;

  constructor() { }

  setConnectionId(connectionId: string): void {
    this.connectionId = connectionId;
  }
}
