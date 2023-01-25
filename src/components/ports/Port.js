import { fabric } from 'fabric';
import { getPortCoords } from '@/helpers/helpers';

export default fabric.util.createClass(fabric.Circle, {
  type: 'Port',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      stroke: options.stroke,
      fill: options.fill,
      top: options.top,
      left: options.left,
      strokeWidth: 2,
      radius: 6,
      hasBorders: false,
      hasControls: false,
    });

    this.cords = new Set();

    this.addMouseHoverListeners();
  },

  addMouseHoverListeners() {
    this.on('mouseover', (event_) => {
      this.set({
        hoverCursor: 'default',
        fill: this.stroke,
        strokeWidth: 3,
      });
      this.group.set({
        lockMovementX: true,
        lockMovementY: true,
      });
      event_.target.canvas.renderAll();
    });

    this.on('mouseout', (event_) => {
      this.set({
        strokeWidth: 2,
        fill: 'transparent',
      });
      this.group.set({
        lockMovementX: false,
        lockMovementY: false,
      });
      event_.target.canvas.renderAll();
    });
  },

  addCord(cord) {
    this.cords.add(cord);
  },

  addMouseDownListener(onConnect, onDisconnect) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    this.on('mousedown', (event_) => {
      const { canvas } = event_.target;
      const RIGHT_MOUSE_BUTTON_CODE = 3;

      if (
        event_.button === RIGHT_MOUSE_BUTTON_CODE &&
        !canvas.cordBeingMoved &&
        this.cords.size > 0
      ) {
        for (const cord of this.cords) {
          onDisconnect(cord.fromPort, cord.toPort);
          cord.remove(canvas);
        }
        return;
      }

      if (
        canvas.cordBeingMoved &&
        canvas.cordBeingMoved.fromPort &&
        canvas.cordBeingMoved.fromPort !== this
      ) {
        const coords = getPortCoords(this);
        canvas.cordBeingMoved.setEndCoords(coords.left, coords.top);
        this.addCord(canvas.cordBeingMoved);
        canvas.cordBeingMoved.toPort = this;

        if (canvas.cordBeingMoved.fromPort) {
          onConnect(
            canvas.cordBeingMoved.fromPort,
            canvas.cordBeingMoved.toPort
          );
        }

        canvas.cordBeingMoved = null;
      } else if (
        canvas.cordBeingMoved &&
        canvas.cordBeingMoved.toPort &&
        canvas.cordBeingMoved.toPort !== this
      ) {
        const coords = getPortCoords(this);
        canvas.cordBeingMoved.setEndCoords(coords.left, coords.top);
        this.addCord(canvas.cordBeingMoved);
        canvas.cordBeingMoved.fromPort = this;

        if (canvas.cordBeingMoved.toPort) {
          onConnect(
            canvas.cordBeingMoved.fromPort,
            canvas.cordBeingMoved.toPort
          );
        }

        canvas.cordBeingMoved = null;
      } else if (!canvas.cordBeingMoved) {
        let cord = null;
        if (this.portType === 'out') {
          cord = this.group.createCord(this, null, this.portType);
        } else if (this.portType === 'in') {
          cord = this.group.createCord(null, this, this.portType);
        }

        canvas.add(cord);
        canvas.cordBeingMoved = cord;
      }
    });
  },
});
