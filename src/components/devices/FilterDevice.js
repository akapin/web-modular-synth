import { fabric } from 'fabric';
import Block from '@/components/Block';
import * as Tone from 'tone';

export default fabric.util.createClass(Block, {
  type: 'AmplitudeEnvelopeDevice',

  initialize(options) {
    const defaultDeviceSettings = { frequency: 1500, type: 'lowpass' };

    this.callSuper('initialize', {
      ...options.position,
      canvas: options.canvas,
      component: new Tone.Filter(
        options?.deviceSettings?.frequency || defaultDeviceSettings.frequency,
        options?.deviceSettings?.type || defaultDeviceSettings.type
      ),
      exposedComponentProperties: ['frequency', 'type'],
    });
  },
});
