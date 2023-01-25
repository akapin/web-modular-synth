import { fabric } from 'fabric';
import SignalOutPort from '@/components/ports/SignalOutPort';
import SignalInPort from '@/components/ports/SignalInPort';
import TriggerOutPort from '@/components/ports/TriggerOutPort';
import TriggerInPort from '@/components/ports/TriggerInPort';
import { getPortCoords } from '@/helpers/helpers';
import Cord from '@/components/Cord';
import { toRaw } from 'vue';

// eslint-disable-next-line func-names
window.keyDownEventHandler = function (event_) {
  if (event_.code === 'KeyA') {
    for (const it of this.triggerOutPort.cords) {
      it.toPort.group.component.triggerAttackRelease('8t');
    }
  }
};

export default fabric.util.createClass(fabric.Group, {
  type: 'Block',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);

    this.set({
      width: 100,
      height: 70,
      hasBorders: false,
      hasControls: false,
      subTargetCheck: true,
    });

    this.component = options.component || null;
    this.componentName = options.name;
    this.canvas = options.canvas;
    this.isTriggerOutPortEnabled = options.isTriggerOutPortEnabled;
    this.isTriggerInPortEnabled = options.isTriggerInPortEnabled;
    this.exposedComponentProperties = options.exposedComponentProperties || [];
    this.keyDownHandler = window.keyDownEventHandler.bind(this);

    this.arrangeGroupElements();

    this.top = options.top;
    this.left = options.left;

    this.addListeners();
  },

  arrangeGroupElements() {
    this.rect = new fabric.Rect({
      fill: '#2f2f2f',
      width: this.width,
      height: this.height,
      hasBorders: false,
      hasControls: false,
      rx: 5,
      ry: 5,
    });

    this.text = new fabric.Text(this.getDeviceName(), {
      fontFamily: 'Arial',
      fontSize: 14,
      textAlign: 'center',
      fill: 'white',
      left: 20,
      top: 19,
    });

    this.addWithUpdate(this.rect);
    this.addWithUpdate(this.text);

    if (this.component && this.component.numberOfInputs > 0) {
      this.signalInPort = new SignalInPort();
      this.addWithUpdate(this.signalInPort);
    }

    if (
      this.component &&
      this.component.numberOfOutputs > 0 &&
      this.component.name !== 'Channel'
    ) {
      this.signalOutPort = new SignalOutPort();
      this.addWithUpdate(this.signalOutPort);
    }

    if (this.triggerOutPortEnabled) {
      this.triggerOutPort = new TriggerOutPort();
      this.addWithUpdate(this.triggerOutPort);
    }

    if (this.triggerInPortEnabled) {
      this.triggerInPort = new TriggerInPort();
      this.addWithUpdate(this.triggerInPort);
    }
  },

  addListeners() {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    this.on('moving', () => {
      for (const port of [this.signalInPort, this.triggerInPort]) {
        if (!port || port.cords.size === 0) {
          continue;
        }

        const coords = getPortCoords(port);

        for (const cord of port.cords) {
          if (cord.startedFromType === 'out') {
            cord.setEndCoords(coords.left, coords.top);
          } else if (cord.startedFromType === 'in') {
            cord.setStartCoords(coords.left, coords.top);
          }
        }
      }

      for (const port of [this.signalOutPort, this.triggerOutPort]) {
        if (!port || port.cords.size === 0) {
          continue;
        }

        const coords = getPortCoords(port);

        for (const cord of port.cords) {
          if (cord.startedFromType === 'out') {
            cord.setStartCoords(coords.left, coords.top);
          } else if (cord.startedFromType === 'in') {
            cord.setEndCoords(coords.left, coords.top);
          }
        }
      }
    });

    this.on('selected', () => {
      this.canvas.fire('device:selected', this);
    });
  },

  getDeviceName() {
    const SYMBOLS_TO_RENDER = 9;
    return (
      this.component?.name.slice(0, SYMBOLS_TO_RENDER) || this.componentName
    );
  },

  createCord(fromPort, toPort, startedFromType) {
    const fromPortCoords = getPortCoords(fromPort || toPort);
    const toPortCoords = getPortCoords(toPort || fromPort);

    const cord = new Cord({
      startedFromType,
      toPort,
      fromPort,
      x1: fromPortCoords.left,
      y1: fromPortCoords.top,
      x2: toPortCoords.left,
      y2: toPortCoords.top,
    });

    if (fromPort) {
      fromPort.addCord(cord);
    }

    if (toPort) {
      toPort.addCord(cord);
    }

    return cord;
  },

  connectSignalTo(toBlock) {
    const cord = this.createCord(
      this.signalOutPort,
      toBlock.signalInPort,
      'out'
    );
    this.canvas.add(cord);
    this.setSignalConnection(this, toBlock);
  },

  connectTriggerTo(toBlock) {
    const cord = this.createCord(
      this.triggerOutPort,
      toBlock.triggerInPort,
      'out'
    );
    this.canvas.add(cord);
    this.setTriggerConnection(this, toBlock);
  },

  setSignalConnection(fromBlock, toBlock) {
    if (toBlock.component.name === 'Channel') {
      fromBlock.component.connect(toBlock.component).toDestination();
    } else {
      const connectedComponent = toRaw(fromBlock.component).connect(
        toRaw(toBlock.component)
      );
      if (connectedComponent.start) {
        connectedComponent.start();
      }
    }
  },

  setTriggerConnection() {
    document.addEventListener('keydown', this.keyDownHandler);
  },

  removeTriggerConnection() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  destroy() {
    if (this.component) {
      toRaw(this.component).dispose();
      if (this.signalInPort) {
        for (const cord of this.signalInPort.cords) {
          cord.remove(this.canvas);
        }
      }

      if (this.signalOutPort) {
        for (const cord of this.signalOutPort.cords) {
          cord.remove(this.canvas);
        }
      }

      if (this.triggerInPort) {
        for (const cord of this.triggerInPort.cords) {
          cord.remove(this.canvas);
        }
      }

      if (this.triggerOutPort) {
        for (const cord of this.triggerOutPort.cords) {
          cord.remove(this.canvas);
        }
      }
    }
    this.removeTriggerConnection();
  },
});
