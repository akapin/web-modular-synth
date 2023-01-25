import { fabric } from 'fabric';
import TriggerPort from '@/components/ports/TriggerPort';

export default fabric.util.createClass(TriggerPort, {
  type: 'TriggerInPort',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      left: 2,
      top: 45,
      portType: 'in',
    });
  },
});
