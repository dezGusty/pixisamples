import { Application, Sprite, Assets, Text, TextStyle, BitmapText, Spritesheet } from 'pixi.js';
import { GameMap } from './gamemap';
import { KeyboardController } from './keyboard-controller';
import { Snake } from './snake';
import { Game } from './game';
import { GamepadController } from './gamepad-controller';
import { Maybe } from './maybe';
import { Bonus } from './bonus';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application();


const bodyElement: Maybe<HTMLElement> = new Maybe<HTMLElement>(document.querySelector('body'));

// Wait for the Renderer to be available
await app.init({ background: '#102229', resizeTo: bodyElement.value() });

console.log('App started, size: ' + app.screen.width + 'x' + app.screen.height);

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

const bonusSheet: Spritesheet = await Assets.load('bonusspritesheet.json');
const bonusTextureNames: string[] = [];
for (let key in bonusSheet.textures) {
  bonusTextureNames.push(key);
}

let bonusSprites: Sprite[] = [];

// Generate the terrain map (randomly)
const maxTerrainCount = terrainTextureNames.length;

let gameMap: GameMap = new GameMap(28, 12);
for (let i = 0; i < gameMap.width; i++) {
  for (let j = 0; j < gameMap.height; j++) {
    gameMap.tiles[i][j] = Math.floor(Math.random() * maxTerrainCount);
    let gameSprite = new Sprite(terrainSheet.textures[terrainTextureNames[gameMap.tiles[i][j]]]);

    gameSprite.x = i * 32;
    gameSprite.y = j * 32;

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

const gameSpeedText = new BitmapText({
  text: 'Speed: 1',
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

gameSpeedText.x = 10;
gameSpeedText.y = 35;
app.stage.addChild(gameSpeedText);

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
const gamepadController = new GamepadController();

let game: Game = new Game(gameMap, keyboardController, gamepadController, snakeSheet, snakeTextureNames);
game.start();

const snakeSprites = game.snake.updateSprites();
for (let i = 0; i < snakeSprites.length; i++) {
  app.stage.addChild(snakeSprites[i]);
}

app.ticker.maxFPS = 60;

// Listen for frame updates
app.ticker.add((ticker) => {

  fpsText.text = `FPS: ${Math.round(ticker.FPS)}`;
  // fpsText.text = `FPS: ${ticker.FPS.toFixed(1)}, stage items: ${app.stage.children.length}`;

  if (game.update(ticker.deltaMS)) {
    updateSnakeInStage(game.snake);
    updateBonusesInStage(game.bonuses);
  }

  gameSpeedText.text = `Speed: ${game.speed()}, Length: ${game.snake.body.length}`;
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

function updateBonusesInStage(bonuses: Bonus[]) {

  for (let i = 0; i < bonusSprites.length; i++) {
    app.stage.removeChild(bonusSprites[i]);
  }

  bonusSprites = [];
  for (let i = 0; i < bonuses.length; i++) {
    const typeIndex = bonuses[i].type;
    if (typeIndex < bonusTextureNames.length) {
      let bonusSprite = new Sprite(bonusSheet.textures[bonusTextureNames[typeIndex]]);
      bonusSprite.x = bonuses[i].x * 32;
      bonusSprite.y = bonuses[i].y * 32;
      bonusSprites.push(bonusSprite);
    } else {
      console.log(`Invalid bonus type index: ${typeIndex}`);
    }
  }

  for (let i = 0; i < bonusSprites.length; i++) {
    app.stage.addChild(bonusSprites[i]);
  }
}