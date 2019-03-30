import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConnectionService} from '../connection.service';
import { faSlidersH, faToolbox, faFile} from '@fortawesome/free-solid-svg-icons';
import {CodeService} from '../code.service';
import {WebsocketService} from '../websocket.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {
  private sub: any;
  loaded = false;

  faSlidersH = faSlidersH;
  faToolbox = faToolbox;
  faFile = faFile;

  constructor(public codeService: CodeService,
              public connectionService: ConnectionService,
              private websocketService: WebsocketService,
              private route: ActivatedRoute) { }

  handleResize() {
    // document.querySelectorAll('.file-code-list').forEach(list => {
    //   console.log(list);
    //   console.log('here');
    //   (<HTMLElement>list).style.height = window.innerHeight - document.querySelector('.navbar').clientHeight - 50 + 'px';
    // });
    (<HTMLElement>document.querySelector('.editor')).style.height
      = window.innerHeight - document.querySelector('.navbar').clientHeight + 'px';
    (<HTMLElement>document.querySelector('.translated-file')).style.height
      = (<HTMLElement>document.querySelector('.editor')).clientHeight
      - document.querySelector('.configuration-file').clientHeight - 2 + 'px';
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    if (!this.loaded) {
      this.loaded = true;
      this.handleResize();
    }
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.connectionService.setConnectionId(params['connectionId']);
    });
  }

}
