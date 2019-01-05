import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConnectionService} from '../connection.service';
import { faSlidersH, faToolbox, faFile} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  private sub: any;

  faSlidersH = faSlidersH;
  faToolbox = faToolbox;
  faFile = faFile;

  constructor(public connectionService: ConnectionService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.connectionService.setConnectionId(params['connectionId']);
    });
  }

}
