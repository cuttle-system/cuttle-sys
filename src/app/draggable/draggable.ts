export class Draggable {
  private static draggables: {[key: string]: Draggable} = {
    'if-statement': new Draggable( [
      {code: 'if', type: false, class: 'inline-block draggable-if-statement'},
      {code: '', codeMirror: true, class: 'inline-block'}
    ]),
    'else-statement': new Draggable([
      {code: 'else', codeMirror: false, class: 'draggable-else-statement'}
    ])
  };

  static insertDraggable(target, draggableName) {
    this.draggables[draggableName].insertTo(target);
  }

  constructor(private srcMap) {}

  insertTo(target) {
    console.log(target.srcIndex);
    target.srcs.splice(target.srcIndex, 0, ...this.srcMap);
    console.log(target.srcs);
  }
}
