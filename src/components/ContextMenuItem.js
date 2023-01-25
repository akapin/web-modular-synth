import { fabric } from 'fabric';

export default fabric.util.createClass(fabric.Group, {
  type: 'ContextMenuItem',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);

    this.set({
      left: options.left,
      top: options.top,
      width: 150,
      height: 25,
      hasBorders: false,
      hasControls: false,
      selectable: false,
    });

    this.text = options.text;

    this.arrangeGroupElements();
    this.addListeners();
  },

  arrangeGroupElements() {
    const rect = new fabric.Rect({
      left: this.left,
      top: this.top,
      fill: '#2f2f2f',
      width: this.width,
      height: this.height,
      stroke: 'lightblue',
      strokeWidth: 1,
    });

    const TEXT_LEFT_OFFSET = 15;
    const TEXT_TOP_OFFSET = 4;

    const text = new fabric.Text(this.text, {
      left: this.left + TEXT_LEFT_OFFSET,
      top: this.top + TEXT_TOP_OFFSET,
      fontFamily: 'Arial',
      fontSize: 14,
      textAlign: 'center',
      fill: 'white',
    });

    this.addWithUpdate(rect);
    this.addWithUpdate(text);
  },

  addListeners() {
    this.on('mousedown', (event_) => {
      const { canvas } = event_.target;

      const component = new this.Component({
        position: { top: this.group.top, left: this.group.left },
        canvas,
      });

      canvas.add(component);
      canvas.fire('context-menu-item:clicked');
    });
  },
});
