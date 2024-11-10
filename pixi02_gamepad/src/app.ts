import { Application, Sprite, Assets, Text, TextStyle, BitmapText, Spritesheet } from 'pixi.js';
import { GameMap } from './gamemap';
import { KeyboardController } from './keyboard-controller';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application();


// Wait for the Renderer to be available
await app.init({ background: '#102229', resizeTo: window });
// const stats = new Stats(app.renderer);

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.canvas);

// load the texture we need
const texture = await Assets.load('SumWarsIcon_128x128.png');

// This creates a texture from the image
let logo = new Sprite(texture);

// Setup the position of the bunny
logo.x = app.renderer.width / 2;
logo.y = app.renderer.height / 2;

// Rotate around the center
logo.anchor.x = 0.5;
logo.anchor.y = 0.5;

const sheet: Spritesheet = await Assets.load('terrainspritesheet.json');

// Store a dictionary of indices (1-5) to texture names (E.g. terrain_01.png)
const terrainTextureNames: string[] = [];
// The texture names are taken from object key properties in sheet.textures
for (let key in sheet.textures) {
  terrainTextureNames.push(key);
}

const maxTerrainCount = terrainTextureNames.length;

let gameMap: GameMap = new GameMap(40, 30);
for (let i = 0; i < gameMap.width; i++) {
  for (let j = 0; j < gameMap.height; j++) {
    gameMap.tiles[i][j] = Math.floor(Math.random() * maxTerrainCount);
    let gameSprite = new Sprite(sheet.textures[terrainTextureNames[gameMap.tiles[i][j]]]);

    gameSprite.x = i * 32 + 50;
    gameSprite.y = j * 32 + 50;

    app.stage.addChild(gameSprite);
  }
}

app.stage.addChild(logo);

await Assets.load('./GustysSerpentsFontL.xml');

const fpsText = new BitmapText({
  text: 'FPS: 0',
  style: {
    fontFamily: 'GustysSerpents',
    fontSize: 18,
    align: 'left',
  },
});

const positionText = new BitmapText({
  text: 'Position: 01234',
  style: {
    fontFamily: 'GustysSerpents',
    fontSize: 18,
    align: 'left',
  },
});


const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 18,
  fill: { color: '#ffffff', alpha: 1 },
  stroke: { color: '#4a1850', width: 5, join: 'round' },
});

fpsText.x = 10;
fpsText.y = 10;
app.stage.addChild(fpsText);

positionText.x = 10;
positionText.y = 35;
app.stage.addChild(positionText);

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
messagesText.y = 60;
app.stage.addChild(messagesText);

const keyboardController = new KeyboardController();
const speedMultiplier = 3.8;

// Listen for frame updates
app.ticker.add((ticker) => {

  fpsText.text = `FPS: ${Math.round(ticker.FPS)}`;
  positionText.text = `Pos: ${logo.x}, ${logo.y}`;

  // Validate logo bounds
  if (logo.x < 50) {
    logo.x = 50;
  }
  if (logo.x > 32 * 40 + 50) {
    logo.x = 32 * 40 + 50;
  }
  if (logo.y < 50) {
    logo.y = 50;
  }
  if (logo.y > 32 * 30 + 50) {
    logo.y = 32 * 30 + 50;
  }

  // each frame we spin the logo around a bit
  logo.rotation += 0.01 * ticker.deltaTime;

  if (keyboardController.keys.up.pressed) {
    messagesText.text = "Up pressed";
    logo.y -= 1.8 * ticker.deltaTime * speedMultiplier;
  }
  if (keyboardController.keys.down.pressed) {
    messagesText.text = "Down pressed";
    logo.y += 1.8 * ticker.deltaTime * speedMultiplier;
  }
  if (keyboardController.keys.left.pressed) {
    messagesText.text = "Left pressed";
    logo.x -= 1.8 * ticker.deltaTime * speedMultiplier;
  }
  if (keyboardController.keys.right.pressed) {
    messagesText.text = "Right pressed";
    logo.x += 1.8 * ticker.deltaTime * speedMultiplier;
  }

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
        logo.x += 1.8 * ticker.deltaTime * speedMultiplier;
      }
      if (gp.axes[0] < -0.5) {
        messagesText.text = "Left pressed";
        logo.x -= 1.8 * ticker.deltaTime * speedMultiplier;
      }
      if (gp.axes[1] > 0.5) {
        messagesText.text = "Down pressed";
        logo.y += 1.8 * ticker.deltaTime * speedMultiplier;
      }
      if (gp.axes[1] < -0.5) {
        messagesText.text = "Up pressed";
        logo.y -= 1.8 * ticker.deltaTime * speedMultiplier;
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