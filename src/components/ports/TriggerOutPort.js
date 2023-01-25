import { fabric } from 'fabric';
import TriggerPort from '@/components/ports/TriggerPort';

export default fabric.util.createClass(TriggerPort, {
  type: 'TriggerOutPort',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);
    this.set({
      left: 85,
      top: 45,
      portType: 'out',
    });
  },
});
