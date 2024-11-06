import { Application, Sprite, Assets, WebGLRenderer } from 'pixi.js';
import { Stats } from 'pixi-stats';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application<WebGLRenderer<HTMLCanvasElement>>();


// Wait for the Renderer to be available
await app.init({ background: '#102229', resizeTo: window });
// const stats = new Stats(app.renderer);
const stats = new Stats(app.renderer);
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.canvas);

// load the texture we need
const texture = await Assets.load('SumWarsIcon_128x128.png');

// This creates a texture from the image
const bunny = new Sprite(texture);

// Setup the position of the bunny
bunny.x = app.renderer.width / 2;
bunny.y = app.renderer.height / 2;

// Rotate around the center
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// Add the bunny to the scene we are building
app.stage.addChild(bunny);

// Listen for frame updates
app.ticker.add((delta) => {
  // each frame we spin the bunny around a bit
  bunny.rotation += 0.01 * delta.deltaTime;
});

window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
});

window.addEventListener("gamepaddisconnected", (e) => {
  console.log(
    "Gamepad disconnected from index %d: %s",
    e.gamepad.index,
    e.gamepad.id,
  );
});