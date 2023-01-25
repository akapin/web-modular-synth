import { fabric } from 'fabric';
import Port from '@/components/ports/Port';

export default fabric.util.createClass(Port, {
  type: 'TriggerPort',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      stroke: 'green',
    });
    this.addListeners();
  },

  addListeners() {
    const onConnect = (fromPort) => {
      fromPort.group.setTriggerConnection();
    };

    const onDisconnect = (fromPort) => {
      fromPort.group.removeTriggerConnection();
    };

    this.addMouseDownListener(onConnect, onDisconnect);
  },
});
