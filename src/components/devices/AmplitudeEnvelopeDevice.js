import { fabric } from 'fabric';
import Block from '@/components/Block';
import * as Tone from 'tone';

export default fabric.util.createClass(Block, {
  type: 'AmplitudeEnvelopeDevice',

  initialize(options) {
    const defaultDeviceSettings = {
      attack: 0.1,
      decay: 0.2,
      sustain: 1,
      release: 0.8,
    };

    this.callSuper('initialize', {
      ...options.position,
      canvas: options.canvas,
      component: new Tone.AmplitudeEnvelope(
        options.deviceSettings || defaultDeviceSettings
      ),
      exposedComponentProperties: [],
      triggerInPortEnabled: true,
    });
  },
});
