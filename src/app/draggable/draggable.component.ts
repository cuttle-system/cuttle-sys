import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {CodeService} from '../code.service';
import {Draggable} from './draggable';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.scss']
})
export class DraggableComponent implements OnInit {
  @Input() draggableName: String;
  @Input() draggableTitle: String;
  dragging = false;
  private found: { distance: number; sourceCodeIndex: number; element: any } = null;

  constructor(private codeService: CodeService, private el: ElementRef) { }

  ngOnInit() {}

  getCenterCoords(element) {
    const bounding = element.getBoundingClientRect();
    return {
      x: bounding.x + bounding.width / 2,
      y: bounding.y + bounding.height / 2,
    };
  }

  wrapTextWithSpans() {
    document.querySelectorAll('app-rules-constructor .CodeMirror-line > span').forEach(lineElement => {
      for (let i = 0; i < lineElement.childNodes.length; ++i) {
        if (lineElement.childNodes[i].nodeType === Node.TEXT_NODE) {
          const textValue = lineElement.childNodes[i].nodeValue;
          const symbols = textValue.split(' ');
          lineElement.childNodes[i].remove();
          for (let j = symbols.length - 1; j >= 0; --j) {
            const textSpan = document.createElement('span');
            textSpan.innerHTML = symbols[j];
            if (j === symbols.length - 1 && symbols[j] === '') {
              continue;
            }
            if (j < symbols.length - 1) {
              textSpan.innerHTML += ' ';
            }
            lineElement.insertBefore(textSpan, lineElement.childNodes.item(i));
          }
        }
      }
    });
  }

  findAncestor(el, cls) {
    while (el && (el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  checkPlaces(elementCoords) {
    let closestElement = null;
    let placeElementPart = null;
    let minDistance = Number.MAX_VALUE;
    let sourceCode = '';
    let sourceCodeIndex = -1;
    let codeMirrorElement = null;
    let codeMirrorLine = null;
    let savedSourceCode = '';

    document.querySelectorAll('app-rules-constructor .CodeMirror-line > span > span').forEach(placeElement => {
      const currentCodeMirrorElement = this.findAncestor(placeElement, 'CodeMirror');
      const currentCodeMirrorLine = this.findAncestor(placeElement, 'CodeMirror-line');
      if (currentCodeMirrorLine !== codeMirrorLine) {
        if (codeMirrorLine !== null) {
          sourceCode += '\n';
        }
        codeMirrorLine = currentCodeMirrorLine;
      }
      if (currentCodeMirrorElement !== codeMirrorElement) {
        codeMirrorElement = currentCodeMirrorElement;
        codeMirrorLine = null;
        sourceCode = '';
      }
      const coords = <DOMRect>placeElement.getBoundingClientRect();
      const left_distance = Math.hypot(coords.x - Number(elementCoords.x), coords.y - Number(elementCoords.y));
      const right_distance = Math.hypot(
        coords.x + coords.width - Number(elementCoords.x), coords.y + coords.height - Number(elementCoords.y));

      placeElement.classList.remove('draggable-constructor-selected-before');
      placeElement.classList.remove('draggable-constructor-selected-after');
      if (minDistance > left_distance) {
        minDistance = left_distance;
        placeElementPart = 'left';
        sourceCodeIndex = sourceCode.length;
        closestElement = placeElement;
        savedSourceCode = sourceCode;
      }
      sourceCode += placeElement.innerHTML;
      if (minDistance > right_distance) {
        minDistance = right_distance;
        placeElementPart = 'right';
        sourceCodeIndex = sourceCode.length;
        closestElement = placeElement;
        savedSourceCode = sourceCode;
      }
    });
    if (closestElement !== null && minDistance < 20) {
      if (placeElementPart === 'right') {
        closestElement.classList.add('draggable-constructor-selected-after');
      } else {
        closestElement.classList.add('draggable-constructor-selected-before');
      }
    }
    // console.log('\'' + savedSourceCode + '\'');
    let found = {element: null, sourceCodeIndex: -1, distance: 0};
    if (minDistance < 20) {
      found = {element: closestElement, sourceCodeIndex, distance: minDistance};
      console.log(found);
    }
    return found;
  }

  onMoved(event) {
    const centerCoords = this.getCenterCoords(event.source._rootElement);
    const found = this.checkPlaces(centerCoords);
    this.found = found;
  }

  onStarted(event) {
    this.wrapTextWithSpans();
  }

  resetCodeMirrors() {
    const codeMirrorContainer = document.querySelector('#configurationCodeEditor');
    codeMirrorContainer.querySelectorAll('CodeMirror').forEach(codeMirrorElement => {
      const codeMirror = (codeMirrorElement as any).CodeMirror as any;
      codeMirror.setValue(codeMirror.getValue());
      codeMirror.getDoc().undo();
    });
  }

  onEnded(event) {
    this.resetCodeMirrors();
    if (this.found.sourceCodeIndex > 0) {
      const codeMirrorElement = this.findAncestor(this.found.element, 'CodeMirror') as any;
      const sourceCode = codeMirrorElement.CodeMirror.getValue();
      const srcIndex = (this.findAncestor(codeMirrorElement, 'ngx-codemirror') as any).getAttribute('data-src-index');
      this.codeService.currentConfigurationCode.srcs[srcIndex].code = sourceCode.slice(this.found.sourceCodeIndex);
      Draggable.insertDraggable({srcs: this.codeService.currentConfigurationCode.srcs, srcIndex}, this.draggableName);
      this.codeService.currentConfigurationCode.srcs.splice(srcIndex, 0, {
        code: sourceCode.slice(0, this.found.sourceCodeIndex),
        codeMirror: true});
      codeMirrorElement.CodeMirror.setValue(sourceCode.slice(this.found.sourceCodeIndex));
    }
    this.resetCodeMirrors();

    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
    this.found = null;
  }

}
