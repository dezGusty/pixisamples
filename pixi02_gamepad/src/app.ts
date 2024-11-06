import { Application, Sprite, Assets, WebGLRenderer, Text, TextStyle } from 'pixi.js';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application<WebGLRenderer<HTMLCanvasElement>>();


// Wait for the Renderer to be available
await app.init({ background: '#102229', resizeTo: window });
// const stats = new Stats(app.renderer);

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.canvas);

// load the texture we need
const texture = await Assets.load('SumWarsIcon_128x128.png');

// This creates a texture from the image
const logo = new Sprite(texture);

// Setup the position of the bunny
logo.x = app.renderer.width / 2;
logo.y = app.renderer.height / 2;

// Rotate around the center
logo.anchor.x = 0.5;
logo.anchor.y = 0.5;

// Add the bunny to the scene we are building
app.stage.addChild(logo);

const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 18,
  fill: { color: '#ffffff', alpha: 1 },
  stroke: { color: '#4a1850', width: 5, join: 'round' },
});

const fpsText = new Text({
  text: 'FPS: 0',
  style,
});

fpsText.x = 10;
fpsText.y = 10;
app.stage.addChild(fpsText);

const instructionsText = new Text({
  text: 'Use the gamepad direction stick to move the logo. Press buttons 0, 1, 2, 3 to see messages',
  style,
});
instructionsText.x = 280;
instructionsText.y = 10;
app.stage.addChild(instructionsText);

const messagesText = new Text({
  text: '',
  style,
});
messagesText.x = 10;
messagesText.y = 40;
app.stage.addChild(messagesText);

// Listen for frame updates
app.ticker.add((ticker) => {

  fpsText.text = `FPS: ${Math.round(ticker.FPS)}`;

  // each frame we spin the bunny around a bit
  logo.rotation += 0.01 * ticker.deltaTime;

  const gamepads = navigator.getGamepads();
  if (gamepads) {
    const gp = gamepads[0];
    if (gp) {
      if (gp.buttons[0].pressed) {
        messagesText.text = "Button 0 pressed";
      }
      if (gp.buttons[2].pressed) {
        messagesText.text = "Button 2 pressed";
      }
      if (gp.buttons[1].pressed) {
        messagesText.text = "Button 1 pressed";
      }
      if (gp.buttons[3].pressed) {
        messagesText.text = "Button 3 pressed";
      }

      if (gp.axes[0] > 0.5) {
        messagesText.text = "Right pressed";
        logo.x += 1.8 * ticker.deltaTime;
      }
      if (gp.axes[0] < -0.5) {
        messagesText.text = "Left pressed";
        logo.x -= 1.8 * ticker.deltaTime;
      }
      if (gp.axes[1] > 0.5) {
        messagesText.text = "Down pressed";
        logo.y += 1.8 * ticker.deltaTime;
      }
      if (gp.axes[1] < -0.5) {
        messagesText.text = "Up pressed";
        logo.y -= 1.8 * ticker.deltaTime;
      }
    }

    return;
  }

});

window.addEventListener("gamepadconnected", (e) => {
  let message: string = `Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`;
  console.log(message);
  messagesText.text = message;
});

window.addEventListener("gamepaddisconnected", (e) => {
  let message: string = `Gamepad disconnected from index ${e.gamepad.index}: ${e.gamepad.id}`;
  console.log(message);
  messagesText.text = message;
});