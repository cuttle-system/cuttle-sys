import { Component, OnInit } from '@angular/core';
import {CodeService} from '../code.service';

@Component({
  selector: 'app-rules-constructor',
  templateUrl: './rules-constructor.component.html',
  styleUrls: ['./rules-constructor.component.scss']
})
export class RulesConstructorComponent implements OnInit {

  constructor(public codeService: CodeService) { }

  ngOnInit() {
  }

}
