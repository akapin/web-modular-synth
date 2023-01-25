import { fabric } from 'fabric';
import Block from '@/components/Block';

export default fabric.util.createClass(Block, {
  type: 'KeyTriggerDevice',

  initialize(options) {
    this.callSuper('initialize', {
      ...options.position,
      canvas: options.canvas,
      name: 'KeyTrigger',
      component: null,
      signalInPortEnabled: false,
      signalOutPortEnabled: false,
      triggerInPortEnabled: false,
      triggerOutPortEnabled: true,
    });
  },
});
