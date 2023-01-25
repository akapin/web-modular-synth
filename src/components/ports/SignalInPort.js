import { fabric } from 'fabric';
import SignalPort from '@/components/ports/SignalPort';

export default fabric.util.createClass(SignalPort, {
  type: 'SignalInPort',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      left: 2,
      top: 19,
      portType: 'in',
    });
  },
});
