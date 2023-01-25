import { fabric } from 'fabric';
import ContextMenuItem from '@/components/ContextMenuItem';
import KeyTriggerDevice from '@/components/devices/KeyTriggerDevice';
import OscillatorDevice from '@/components/devices/OscillatorDevice';
import AmplitudeEnvelopeDevice from '@/components/devices/AmplitudeEnvelopeDevice';
import FilterDevice from '@/components/devices/FilterDevice';

const AVAILABLE_COMPONENTS_MAP = {
  KeyTrigger: KeyTriggerDevice,
  Oscillator: OscillatorDevice,
  AmplitudeEnvelope: AmplitudeEnvelopeDevice,
  Filter: FilterDevice,
};

export default fabric.util.createClass(fabric.Group, {
  type: 'ContextMenu',

  initialize(options = {}) {
    this.callSuper('initialize', [], options, true);

    this.set({
      left: options.left,
      top: options.top,
      hasBorders: false,
      hasControls: false,
      selectable: false,
      subTargetCheck: true,
    });

    this.arrangeGroupElements();
  },

  arrangeGroupElements() {
    let counter = 0;

    for (const [componentName, component] of Object.entries(
      AVAILABLE_COMPONENTS_MAP
    )) {
      const item = new ContextMenuItem({
        left: this.left,
        top: this.top + counter,
        text: componentName,
        Component: component,
      });
      this.addWithUpdate(item);
      counter += item.height;
    }
  },
});
