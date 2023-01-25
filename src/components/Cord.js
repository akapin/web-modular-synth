import { fabric } from 'fabric';

export default fabric.util.createClass(fabric.Line, {
  type: 'Cord',

  initialize(options = {}) {
    const coords = [options.x1, options.y1, options.x2, options.y2];
    this.callSuper('initialize', coords, options, true);

    this.set({
      stroke: 'skyblue',
      strokeWidth: 5,
      hasBorders: false,
      hasControls: false,
      selectable: false,
      evented: false,
    });

    this.fromPort = options.fromPort || null;
    this.toPort = options.toPort || null;
    this.startedFromType = options.startedFromType;
  },

  setEndCoords(x, y) {
    this.set({
      x2: x,
      y2: y,
    });
  },

  setStartCoords(x, y) {
    this.set({
      x1: x,
      y1: y,
    });
  },

  remove(canvas) {
    if (this.fromPort) {
      this.fromPort.cords.delete(this);
    }

    if (this.toPort) {
      this.toPort.cords.delete(this);
    }

    canvas.remove(this);
  },
});
