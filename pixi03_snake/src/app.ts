import { Application, Sprite, Assets, Text, TextStyle, BitmapText, Spritesheet } from 'pixi.js';
import { GameMap } from './gamemap';
import { KeyboardController } from './keyboard-controller';
import { Snake, SnakeBodyPart, SnakeBodyPartType, SnakeDirection } from './snake';

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

const terrainSheet: Spritesheet = await Assets.load('terrainspritesheet.json');

// Store a dictionary of indices (1-5) to texture names (E.g. terrain_01.png)
const terrainTextureNames: string[] = [];
// The texture names are taken from object key properties in sheet.textures
for (let key in terrainSheet.textures) {
  terrainTextureNames.push(key);
}

const snakeSheet: Spritesheet = await Assets.load('snakesspritesheet.json');
const snakeTextureNames: string[] = [];
for (let key in snakeSheet.textures) {
  snakeTextureNames.push(key);
}

// Generate the terrain map (randomly)
const maxTerrainCount = terrainTextureNames.length;

let gameMap: GameMap = new GameMap(40, 30);
for (let i = 0; i < gameMap.width; i++) {
  for (let j = 0; j < gameMap.height; j++) {
    gameMap.tiles[i][j] = Math.floor(Math.random() * maxTerrainCount);
    let gameSprite = new Sprite(terrainSheet.textures[terrainTextureNames[gameMap.tiles[i][j]]]);

    gameSprite.x = i * 32 + 50;
    gameSprite.y = j * 32 + 50;

    app.stage.addChild(gameSprite);
  }
}

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
    fontSize: 24,
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
  text: 'Use the gamepad direction stick (or keyb. WASD) to move the snake',
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

let snake: Snake = new Snake(snakeSheet, snakeTextureNames);
snake.body.push({ x: 10, y: 10, type: SnakeBodyPartType.head_up, direction: SnakeDirection.up } as SnakeBodyPart);
snake.body.push({ x: 10, y: 11, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up } as SnakeBodyPart);
snake.body.push({ x: 10, y: 12, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up } as SnakeBodyPart);
snake.body.push({ x: 10, y: 13, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up } as SnakeBodyPart);
snake.body.push({ x: 10, y: 14, type: SnakeBodyPartType.tail_up, direction: SnakeDirection.up } as SnakeBodyPart);

const snakeSprites = snake.updateSprites();
for (let i = 0; i < snakeSprites.length; i++) {
  app.stage.addChild(snakeSprites[i]);
}


app.ticker.maxFPS = 15;

// Listen for frame updates
app.ticker.add((ticker) => {

  // fpsText.text = `FPS: ${Math.round(ticker.FPS)}`;
  fpsText.text = `FPS: ${ticker.FPS.toFixed(2)}`;

  if (keyboardController.keys.up.pressed) {
    messagesText.text = "Up pressed";
    snake.pullUp();
    updateSnakeInStage(snake);
  }

  if (keyboardController.keys.down.pressed) {
    messagesText.text = "Down pressed";
    snake.pullDown();
    updateSnakeInStage(snake);
  }
  if (keyboardController.keys.left.pressed) {
    messagesText.text = "Left pressed";
    snake.pullLeft();
    updateSnakeInStage(snake);
  }

  if (keyboardController.keys.right.pressed) {
    messagesText.text = "Right pressed";
    snake.pullRight();
    updateSnakeInStage(snake);
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
        snake.pullRight();
        updateSnakeInStage(snake);
      }
      if (gp.axes[0] < -0.5) {
        messagesText.text = "Left pressed";
        snake.pullLeft();
        updateSnakeInStage(snake);
      }
      if (gp.axes[1] > 0.5) {
        messagesText.text = "Down pressed";
        snake.pullDown();
        updateSnakeInStage(snake);
      }
      if (gp.axes[1] < -0.5) {
        messagesText.text = "Up pressed";
        snake.pullUp();
        updateSnakeInStage(snake);
      }
    }
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


function updateSnakeInStage(snake: Snake) {
  const oldSprites = snake.sprites();
  for (let i = 0; i < oldSprites.length; i++) {
    app.stage.removeChild(oldSprites[i]);
  }
  const snakeSprites = snake.updateSprites();
  for (let i = 0; i < snakeSprites.length; i++) {
    app.stage.addChild(snakeSprites[i]);
  }
}