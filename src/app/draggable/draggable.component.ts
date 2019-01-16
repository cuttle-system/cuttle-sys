import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.scss']
})
export class DraggableComponent implements OnInit {
  @Input() draggableName: String;
  @Input() draggableTitle: String;
  dragging = false;

  constructor(private el: ElementRef) { }

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

  checkPlaces(elementCoords) {
    let closestElement = null;
    let minDistance = Number.MAX_VALUE;
    // console.log(document.querySelectorAll(':hover'));
    // console.log(document.elementsFromPoint(elementCoords.x, elementCoords.y));
    document.querySelectorAll('app-rules-constructor .CodeMirror-line > span > span').forEach(placeElement => {
      const coords = <DOMRect>placeElement.getBoundingClientRect();
      const distance = Math.hypot(coords.x - Number(elementCoords.x), coords.y - Number(elementCoords.y));
      // const distance = Math.hypot(coords.x - Number(elementCoords.x), coords.y - Number(elementCoords.y));

      placeElement.classList.remove('draggable-constructor-selected-before');
      placeElement.classList.remove('draggable-constructor-selected-after');
      if (minDistance > distance) {
        minDistance = distance;
        closestElement = placeElement;
      }
    });
    if (closestElement !== null) {
      if (closestElement.previousSibling !== null) {
        closestElement.previousSibling.classList.add('draggable-constructor-selected-after');
      }
      closestElement.classList.add('draggable-constructor-selected-before');
    }
    return {element: closestElement, distance: minDistance};
  }

  onEntered(event) {
    // console.log('entered: ', event);
  }

  onMoved(event) {
    const centerCoords = this.getCenterCoords(event.source._rootElement);
    const found = this.checkPlaces(centerCoords);
    if (found.distance < 20) {
      console.log(found.element);
    }
  }

  onStarted(event) {
    this.wrapTextWithSpans();
    // console.log('started: ', event);
  }

  onEnded(event) {
    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
    const codeMirror = document.querySelector('#configurationCodeEditor .CodeMirror').CodeMirror;
    codeMirror.setValue(codeMirror.getValue());
    codeMirror.getDoc().undo();
    console.log();
  }

}
