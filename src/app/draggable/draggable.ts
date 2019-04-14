export class Draggable {
  private static draggables: {[key: string]: Draggable} = {
    'if-statement': new Draggable( [
      [{code: 'if', type: false, removable: true, class: 'inline-block draggable-if-statement'},
       {code: '', codeMirror: true, removable: true, class: 'inline-block'}],
    ]),
    'else-statement': new Draggable([
      [{code: 'else', codeMirror: false, removable: true, class: 'inline-block draggable-else-statement'}]
    ]),
    'code-block': new Draggable( [
      [{code: '', codeMirror: true, removable: true, class: 'inline-block'}],
    ]),
  };

  static insertDraggable(target, draggableName: string): boolean {
    return this.draggables[draggableName].insertTo(target);
  }

  constructor(private srcMap) {}

  insertTo(target): boolean {
    console.log(target.srcIndex);
    if (Array.isArray(this.srcMap[0])) {
      target.lines.splice(target.srcIndex[0], 0, ...JSON.parse(JSON.stringify(this.srcMap)));
      return true;
    }
    target.lines[target.srcIndex[0]].splice(target.srcIndex[1], 0, ...JSON.parse(JSON.stringify(this.srcMap)));
    return false;
  }
}
