import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConnectionService} from '../connection.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  private sub: any;

  constructor(public connectionService: ConnectionService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.connectionService.setConnectionId(params['connectionId']);
    });
  }

}
