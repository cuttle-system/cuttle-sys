export class WebsocketClient {
  private connection: WebSocket = null;
  private isConnected = false;
  private messageQueue: string[] = [];
  private callbacks = {};
  private handlers = {};

  private addMessageCallback(type: string, callback) {
    if (typeof this.callbacks[type] === 'undefined') {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(callback);
  }

  addMessageHandler(type: string, callback) {
    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = [];
    }
    this.handlers[type].push(callback);
  }

  sendMessage(type: string, message: object, callback): void {
    const messageObject = {type, ...message};
    this.addMessageCallback(type, callback);
    if (this.isConnected) {
      this.send(JSON.stringify(messageObject));
    } else {
      this.messageQueue.push(JSON.stringify(messageObject));
    }
  }

  send(message: string): void {
    console.log('send: ', JSON.parse(message));
    this.connection.send(message);
  }

  private onOpen(): void {
    console.log('Websocket connection opened');
    this.isConnected = true;
    for (const message of this.messageQueue.reverse()) {
      this.send(message);
    }
    this.messageQueue = [];
  }

  private onError(error): void {
    console.log('An internal websocket error occurred: ', error);
  }

  private onMessage(message): void {
    try {
      const json = JSON.parse(message.data);
      console.log('receive: ', json);
      if (typeof this.callbacks[json.type] !== 'undefined') {
        for (const callback of this.callbacks[json.type]) {
          callback(json);
        }
        this.callbacks[json.type] = [];
      }
      if (typeof this.handlers[json.type] !== 'undefined') {
        for (const handler of this.handlers[json.type]) {
          handler(json);
        }
        this.handlers[json.type] = [];
      }
    } catch (e) {
      console.error(e);
      console.log('Invalid JSON: ', message.data);
      return;
    }
  }

  private connectionChecker() {
    if (this.connection.readyState !== 1) {
      console.log('Websocket connection dropped');
    }
  }

  constructor(connectionString: string) {
    console.log('Initializing Websocket connection');
    this.connection = new WebSocket(connectionString);
    this.connection.onopen = () => this.onOpen();
    this.connection.onerror = (error) => this.onError(error);
    this.connection.onmessage = (message) => this.onMessage(message);

    const Socket = window['WebSocket'] || window['MozWebSocket'];
    if (!Socket) {
      console.log('This browser does not support WebSockets');
      return;
    }

    setInterval(() => this.connectionChecker(), 3000);
  }
}

