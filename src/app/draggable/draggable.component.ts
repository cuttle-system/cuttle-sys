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

  checkPlaces(elementCoords) {
    let closestElement = null;
    let minDistance = Number.MAX_VALUE;
    // console.log(document.querySelectorAll(':hover'));
    // console.log(document.elementsFromPoint(elementCoords.x, elementCoords.y));
    document.querySelectorAll('app-rules-constructor .CodeMirror-line > span > span').forEach(placeElement => {
      const coords = placeElement.getBoundingClientRect();
      const distance = Math.hypot(coords.x - Number(elementCoords.x), coords.y - Number(elementCoords.y));
      // const distance = Math.hypot(coords.x - Number(elementCoords.x), coords.y - Number(elementCoords.y));

      if (minDistance > distance) {
        minDistance = distance;
        closestElement = placeElement;
      }
      if (minDistance > distance) {

      }
    });
    return {element: closestElement, distance: minDistance};
  }

  onEntered(event) {
    // console.log('entered: ', event);
  }

  onMoved(event) {
    // console.log('moved: ', event);
    const centerCoords = this.getCenterCoords(event.source._rootElement);
    // console.log([centerCoords.x, centerCoords.y]);
    const found = this.checkPlaces(centerCoords);
    if (found.distance < 20) {
      console.log(found.element);
    }
    // // console.log(document.elementFromPoint(centerCoords.x + event.x, centerCoords.y + event.y));
  }

  onStarted(event) {
    // console.log('started: ', event);
  }

  onEnded(event) {
    // console.log('ended: ', event);
    event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
  }

}
