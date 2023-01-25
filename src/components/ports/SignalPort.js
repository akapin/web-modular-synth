import { fabric } from 'fabric';
import Port from '@/components/ports/Port';
import { toRaw } from 'vue';

export default fabric.util.createClass(Port, {
  type: 'SignalPort',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      stroke: 'yellow',
    });
    this.addListeners();
  },

  addListeners() {
    const onConnect = (fromPort, toPort) => {
      fromPort.group.setSignalConnection(fromPort.group, toPort.group);
    };

    const onDisconnect = (fromPort, toPort) => {
      toRaw(fromPort.group.component).disconnect(
        toRaw(toPort.group.component)
      );
    };

    this.addMouseDownListener(onConnect, onDisconnect);
  },
});
