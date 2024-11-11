// Map keyboard key codes to controller's state keys


export interface KeyState {
  pressed: boolean;
  doubleTap: boolean;
  timestamp: number;
}

// Class for handling keyboard inputs.
export class KeyboardController {

  public keys: Record<string, KeyState> = {
    'up': { pressed: false, doubleTap: false, timestamp: 0 },
    'left': { pressed: false, doubleTap: false, timestamp: 0 },
    'down': { pressed: false, doubleTap: false, timestamp: 0 },
    'right': { pressed: false, doubleTap: false, timestamp: 0 },
    'space': { pressed: false, doubleTap: false, timestamp: 0 },
  };

  public keyMap: Record<string, string> = {
    'Space': 'space',
    'KeyW': 'up',
    'ArrowUp': 'up',
    'KeyA': 'left',
    'ArrowLeft': 'left',
    'KeyS': 'down',
    'ArrowDown': 'down',
    'KeyD': 'right',
    'ArrowRight': 'right'
  };

  constructor() {

    // Register event listeners for keydown and keyup events.
    window.addEventListener('keydown', (event) => this.keydownHandler(event));
    window.addEventListener('keyup', (event) => this.keyupHandler(event));
  }

  keydownHandler(event: KeyboardEvent) {
    // console.log("keydown: " + event.code);

    const key = this.keyMap[event.code];
    if (!key) return;
    const now = Date.now();

    // If not already in the double-tap state, toggle the double tap state if the key was pressed twice within 300ms.
    this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 100;

    // Toggle on the key pressed state.
    this.keys[key].pressed = true;
  }

  keyupHandler(event: KeyboardEvent) {
    // console.log("keyup: " + event.code);
    const key = this.keyMap[event.code];
    if (!key) return;
    // Toggle off the key pressed state.
    this.keys[key].pressed = false;
    // Update the timestamp for the key.
    this.keys[key].timestamp = Date.now();
    if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
  }
}