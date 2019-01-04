import {Component, OnInit} from '@angular/core';
import {ConnectionService} from '../connection.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  newConnectionId: String = '';

  constructor(public connectionService: ConnectionService) {}

  ngOnInit() {
  }

}
