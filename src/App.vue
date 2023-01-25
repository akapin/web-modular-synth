<script>
import { fabric } from 'fabric';
import * as Tone from 'tone';
import ContextMenu from '@/components/ContextMenu';
import MasterDevice from '@/components/devices/MasterDevice';
import { toRaw } from 'vue';

const PROPS_SIDEBAR_WIDTH = 300;

export default {
  name: 'App',

  data() {
    this.canvas = null;
    return {
      selectedDevice: null,
      isStarted: false,
      contextMenu: null,
    };
  },

  computed: {
    selectedDeviceProps() {
      try {
        return this.selectedDevice.component.get();
      } catch (ignore) {
        return {};
      }
    },

    selectedDeviceIns() {
      if (!this.selectedDevice.signalInPort) {
        return '';
      }

      return [...this.selectedDevice.signalInPort.cords]
        .map((it) => it.fromPort?.group.getDeviceName())
        .join(', ');
    },

    selectedDeviceOuts() {
      if (!this.selectedDevice.signalOutPort) {
        return '';
      }

      return [...this.selectedDevice.signalOutPort.cords]
        .map((it) => it.toPort?.group.getDeviceName())
        .join(', ');
    },
  },

  methods: {
    createCanvas() {
      this.canvas = new fabric.Canvas('c', {
        width: window.innerWidth,
        height: window.innerHeight,
        fireRightClick: true,
        stopContextMenu: true,
        preserveObjectStacking: true,
      });
      this.canvas.selection = false;
    },

    addDevices() {
      const master = new MasterDevice({
        position: { top: 100, left: 550 },
        canvas: this.canvas,
      });

      this.canvas.add(master);
    },

    addListeners() {
      window.addEventListener('keydown', (event_) => {
        if (
            event_.code === 'Delete' &&
          this.selectedDevice &&
          this.selectedDevice.getDeviceName() !== 'Channel'
        ) {
          this.selectedDevice.destroy();
          this.canvas.remove(toRaw(this.selectedDevice));
          this.selectedDevice = null;
        }
      });

      window.addEventListener('resize', () => {
        this.canvas.setWidth(window.innerWidth - PROPS_SIDEBAR_WIDTH);
        this.canvas.setHeight(window.innerHeight);
      });

      this.canvas.on('device:selected', (device) => {
        this.canvas.setWidth(window.innerWidth - PROPS_SIDEBAR_WIDTH);
        this.selectedDevice = device;
      });

      this.canvas.on('context-menu-item:clicked', () => {
        this.hideContextMenu();
      });

      this.canvas.on('mouse:move', (event_) => {
        if (!this.canvas.cordBeingMoved) {
          return;
        }

        this.canvas.cordBeingMoved.setEndCoords(event_.pointer.x, event_.pointer.y);
        this.canvas.renderAll();
      });

      this.canvas.on('mouse:down', (event_) => {
        if (this.contextMenu && event_.target !== this.contextMenu) {
          this.hideContextMenu();
        }

        const isPortTarget =
          this.canvas.cordBeingMoved &&
          (event_.target === this.canvas.cordBeingMoved.fromPort ||
              event_.target === this.canvas.cordBeingMoved.toPort);

        if (this.canvas.cordBeingMoved && (!event_.target || isPortTarget)) {
          this.canvas.cordBeingMoved.remove(this.canvas);
          this.canvas.cordBeingMoved = null;
          return;
        }

        const RIGHT_MOUSE_BUTTON_CODE = 3;

        if (event_.button === RIGHT_MOUSE_BUTTON_CODE && !event_.target) {
          this.showContextMenu(event_);
        }
      });
    },

    showContextMenu(event_) {
      this.contextMenu = new ContextMenu({
        left: event_.pointer.x,
        top: event_.pointer.y,
      });
      this.canvas.add(this.contextMenu);
    },

    hideContextMenu() {
      this.canvas.remove(this.contextMenu);
      this.contextMenu = null;
    },

    start() {
      Tone.start();
      this.createCanvas();
      this.addDevices();
      this.addListeners();
      this.isStarted = true;
    },
  },
};
</script>

<template>
  <div class="container">
    <button v-if="!isStarted" @click="start">START</button>
    <canvas id="c"></canvas>
    <div v-if="selectedDevice" class="sidebar">
      <div>
        <span class="property-name">Name: </span>
        <span>{{ selectedDevice.getDeviceName() }}</span>
      </div>
      <div v-if="selectedDevice.signalOutPort">
        <span class="property-name">OUTS: </span>
        <span>{{ selectedDeviceOuts }}</span>
      </div>
      <div v-if="selectedDevice.signalInPort">
        <span class="property-name">INS: </span>
        <span>{{ selectedDeviceIns }}</span>
      </div>
      <template v-if="selectedDevice.component">
        <template v-for="prop of Object.keys(selectedDeviceProps)">
          <div :key="prop">
            <span class="property-name">{{ prop }}: </span>
            <span>
              {{
                typeof selectedDevice.component[prop] === 'Signal'
                  ? selectedDevice.component[prop]
                  : selectedDevice.component[prop].value
              }}
            </span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.sidebar {
  flex-grow: 1;
  background-color: honeydew;
  padding: 1rem;
  font-size: 20px;
}

.property-name {
  font-weight: bold;
}

button {
  z-index: 999;
  width: 300px;
  height: 150px;
  position: fixed;
  font-size: 3rem;
  padding: 2rem;
  left: calc(50% - 150px);
  top: calc(50% - 75px);
  cursor: pointer;
}
</style>
