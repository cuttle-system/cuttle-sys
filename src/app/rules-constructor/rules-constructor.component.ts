import { Component, OnInit } from '@angular/core';
import {CodeService} from '../code.service';
import {faBackspace} from '@fortawesome/free-solid-svg-icons';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {Src} from '../src';

@Component({
  selector: 'app-rules-constructor',
  templateUrl: './rules-constructor.component.html',
  styleUrls: ['./rules-constructor.component.scss']
})
export class RulesConstructorComponent implements OnInit {
  faBackspace = faBackspace;

  constructor(public codeService: CodeService) { }

  ngOnInit() {
  }

  openDropdown($event: MouseEvent, draggableDropdown: NgbDropdown, src: Src) {
    if (src.removable) {
      $event.stopPropagation();
      draggableDropdown.open();
    }
  }

  closeDropdown($event: MouseEvent, draggableDropdown: NgbDropdown, src: Src) {
    if (src.removable) {
      $event.stopPropagation();
      draggableDropdown.close();
    }
  }

  deleteSrc(index: number[]) {
    if (this.codeService.currentConfigurationCode.lines[index[0]][index[1]].codeMirror) {
      if (index[1] === 0) {
        if (index[0] !== 0
          && this.codeService.currentConfigurationCode
              .lines[index[0] - 1][this.codeService.currentConfigurationCode.lines[index[0] - 1].length - 1].codeMirror
        ) {
          const value = this.codeService.currentConfigurationCode.lines[index[0]][index[1]].code;
          this.codeService.currentConfigurationCode
            .lines[index[0] - 1][this.codeService.currentConfigurationCode.lines[index[0] - 1].length - 1].code += value;
          this.codeService.currentConfigurationCode.lines[index[0]].splice(index[1], 1);
        }
      } else if (this.codeService.currentConfigurationCode.lines[index[0]][index[1] - 1].codeMirror) {
        const value = this.codeService.currentConfigurationCode.lines[index[0]][index[1]].code;
        this.codeService.currentConfigurationCode.lines[index[0]][index[1] - 1].code += value;
        this.codeService.currentConfigurationCode.lines[index[0]].splice(index[1], 1);
      }
    } else {
      this.codeService.currentConfigurationCode.lines[index[0]].splice(index[1], 1);
    }

    if (this.codeService.currentConfigurationCode.lines[index[0]].length === 0) {
      this.codeService.currentConfigurationCode.lines.splice(index[0], 1);
    }
  }
}
