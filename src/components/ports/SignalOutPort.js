import { fabric } from 'fabric';
import SignalPort from '@/components/ports/SignalPort';

export default fabric.util.createClass(SignalPort, {
  type: 'SignalOutPort',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      left: 85,
      top: 19,
      portType: 'out',
    });
  },
});
