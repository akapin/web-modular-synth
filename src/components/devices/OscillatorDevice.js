import { fabric } from 'fabric';
import Block from '@/components/Block';
import * as Tone from 'tone';

export default fabric.util.createClass(Block, {
  type: 'OscillatorDevice',

  initialize(options) {
    this.callSuper('initialize', {
      ...options.position,
      canvas: options.canvas,
      component: new Tone.Oscillator(),
    });
  },
});
