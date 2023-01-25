import { fabric } from 'fabric';
import Block from '@/components/Block';
import * as Tone from 'tone';

export default fabric.util.createClass(Block, {
  type: 'MasterDevice',

  initialize(options) {
    const defaultDeviceSettings = { volume: 0, pan: 0 };

    this.callSuper('initialize', {
      ...options.position,
      canvas: options.canvas,
      component: new Tone.Channel(
        options?.deviceSettings?.volume || defaultDeviceSettings.volume,
        options?.deviceSettings?.pan || defaultDeviceSettings.pan
      ),
    });
  },
});
