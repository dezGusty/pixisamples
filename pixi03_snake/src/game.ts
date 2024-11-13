import { Spritesheet } from "pixi.js";
import { areDirectionsOpposites, Snake, SnakeBodyPart, SnakeBodyPartType, SnakeDirection } from "./snake";
import { KeyboardController } from "./keyboard-controller";
import { GameMap } from "./gamemap";
import { GamepadController, GamepadInput4x } from "./gamepad-controller";
import { Critter } from "./critter";
import { Bonus } from "./bonus";

export class Game {

  public snake: Snake;

  private gameDelta: number = 0;
  private MAX_DELTA_MS = 250;
  private MIN_DELTA_MS = 33;
  private MAX_GAME_SPEED = 100;
  private MIN_GAME_SPEED = 1;

  private MIN_BONUSES = 1;
  private MAX_BONUSES = 3;

  private MIN_CRITTERS = 1;
  private MAX_CRITTERS = 5;

  private gameSpeed = 50;
  public speed() { return this.gameSpeed; }

  private solidBorders = false;
  private gamePaused = false;

  private critters: Critter[] = [];
  public bonuses: Bonus[] = [];
  public bonusTypesCount = 4;

  constructor(
    private gameMap: GameMap,
    private keyboardController: KeyboardController,
    private gamepadController: GamepadController,
    private snakeSheet: Spritesheet,
    private snakeTextureNames: string[]) {
    this.snake = new Snake(this.snakeSheet, this.snakeTextureNames);
    this.keyboardController.onKeyDown = (key: string) => { this.instantKeyHandler(key) };
  }

  public start() {
    this.snake = new Snake(this.snakeSheet, this.snakeTextureNames);
    this.snake.alive = true;
    this.snake.direction = SnakeDirection.up;
    this.snake.cachedDirection = SnakeDirection.none;
    this.snake.nextDirection = SnakeDirection.none;

    this.snake.body.push({ x: 10, y: 10, type: SnakeBodyPartType.head_up, direction: SnakeDirection.up, spawned: true } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 11, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up, spawned: true } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 12, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up, spawned: false } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 13, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up, spawned: false } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 14, type: SnakeBodyPartType.tail_up, direction: SnakeDirection.up, spawned: false } as SnakeBodyPart);
  }

  public moveSnake() {
    switch (this.snake.direction) {
      case SnakeDirection.up:
        this.snake.pullUp();
        break;
      case SnakeDirection.down:
        this.snake.pullDown();
        break;
      case SnakeDirection.left:
        this.snake.pullLeft();
        break;
      case SnakeDirection.right:
        this.snake.pullRight();
        break;
    }
  }

  public checkCollision() {
    if (this.solidBorders) {
      if (this.snake.body[0].x < 0 || this.snake.body[0].x >= this.gameMap.width || this.snake.body[0].y < 0 || this.snake.body[0].y >= this.gameMap.height) {
        this.snake.alive = false;
        return;
      }
    } else {
      if (this.snake.body[0].x < 0) {
        this.snake.body[0].x = this.gameMap.width - 1;
      }
      if (this.snake.body[0].x >= this.gameMap.width) {
        this.snake.body[0].x = 0;
      }
      if (this.snake.body[0].y < 0) {
        this.snake.body[0].y = this.gameMap.height - 1;
      }
      if (this.snake.body[0].y >= this.gameMap.height) {
        this.snake.body[0].y = 0;
      }
    }

    for (let i = 1; i < this.snake.body.length; i++) {
      if (this.snake.body[0].x === this.snake.body[i].x && this.snake.body[0].y === this.snake.body[i].y) {
        this.snake.alive = false;
        return;
      }
    }
  }

  /**
   * Cache the snake direction up.
   */
  private cacheSnakeDirectionUp() {
    if (this.snake.cachedDirection === SnakeDirection.none) {
      if (this.snake.direction !== SnakeDirection.down && this.snake.direction !== SnakeDirection.up) {
        this.snake.cachedDirection = SnakeDirection.up;
      }
    } else {
      this.snake.nextDirection = SnakeDirection.up;
    }
  }

  private cacheSnakeDirectionDown() {
    if (this.snake.cachedDirection === SnakeDirection.none) {
      if (this.snake.direction !== SnakeDirection.up && this.snake.direction !== SnakeDirection.down) {
        this.snake.cachedDirection = SnakeDirection.down;
      }
    } else {
      this.snake.nextDirection = SnakeDirection.down;
    }
  }

  private cacheSnakeDirectionLeft() {
    if (this.snake.cachedDirection === SnakeDirection.none) {
      if (this.snake.direction !== SnakeDirection.right && this.snake.direction !== SnakeDirection.left) {
        this.snake.cachedDirection = SnakeDirection.left;
      }
    } else {
      this.snake.nextDirection = SnakeDirection.left;
    }
  }

  private cacheSnakeDirectionRight() {
    if (this.snake.cachedDirection === SnakeDirection.none) {
      if (this.snake.direction !== SnakeDirection.left && this.snake.direction !== SnakeDirection.right) {
        this.snake.cachedDirection = SnakeDirection.right;
      }
    } else {
      this.snake.nextDirection = SnakeDirection.right;
    }
  }

  private instantKeyHandler(key: string) {
    if (key === 'up') {
      this.cacheSnakeDirectionUp();
    } else if (key == 'down') {
      this.cacheSnakeDirectionDown();
    } else if (key == 'left') {
      this.cacheSnakeDirectionLeft();
    } else if (key == 'right') {
      this.cacheSnakeDirectionRight();
    } else if (key == 'space') {
      this.gamePaused = !this.gamePaused;
    }

  }

  private handleInput() {
    // Keyboard controller actions.
    if (//this.keyboardController.keys.up.pressed || 
      this.gamepadController.isDirectionPressed(GamepadInput4x.AxisUp)) {
      this.cacheSnakeDirectionUp();
    }

    if (//this.keyboardController.keys.down.pressed || 
      this.gamepadController.isDirectionPressed(GamepadInput4x.AxisDown)) {
      this.cacheSnakeDirectionDown();
    }


    if (//this.keyboardController.keys.left.pressed || 
      this.gamepadController.isDirectionPressed(GamepadInput4x.AxisLeft)) {
      this.cacheSnakeDirectionLeft();
    }

    if (//this.keyboardController.keys.right.pressed || 
      this.gamepadController.isDirectionPressed(GamepadInput4x.AxisRight)) {
      this.cacheSnakeDirectionRight();
    }
  }

  public update(delta: number): boolean {
    let somethingChanged = false;

    if (this.gamePaused) {
      return somethingChanged;
    }

    if (!this.snake.alive) {
      return somethingChanged;
    }

    this.handleInput();

    // Game speed control.
    // Game speed grows linearly from MIN_GAME_SPEED to MAX_GAME_SPEED.
    // This should result in a reduction of the delay between snake movements.
    if (this.keyboardController.keys['speed-up'].pushed) {
      this.keyboardController.popKeyState('speed-up');
      if (this.gameSpeed < this.MAX_GAME_SPEED) {
        this.gameSpeed = Math.min(this.gameSpeed + 5, this.MAX_GAME_SPEED);
      }
    }
    if (this.keyboardController.keys['speed-down'].pushed) {
      this.keyboardController.popKeyState('speed-down');
      if (this.gameSpeed > this.MIN_GAME_SPEED) {
        this.gameSpeed = Math.max(this.gameSpeed - 5, this.MIN_GAME_SPEED);
      }
    }

    const speedRatio = this.gameSpeed / (this.MAX_GAME_SPEED - this.MIN_GAME_SPEED);
    const targetSnakeDelta = this.MAX_DELTA_MS - (this.MAX_DELTA_MS - this.MIN_DELTA_MS) * speedRatio;

    this.gameDelta += delta;
    if (this.gameDelta >= targetSnakeDelta) {
      // move the snake according to the cached direction
      if (this.snake.cachedDirection !== SnakeDirection.none
        && !areDirectionsOpposites(this.snake.direction, this.snake.cachedDirection)) {
        this.snake.direction = this.snake.cachedDirection;
      }
      this.snake.cachedDirection = this.snake.nextDirection;
      this.snake.nextDirection = SnakeDirection.none;

      this.gameDelta = 0;
      this.moveSnake();
      this.checkCollision();

      // Move the critters
      for (let i = 0; i < this.critters.length; i++) {
        // this.critters[i].move();
      }

      somethingChanged = true;
    }

    // Check if the snake has eaten a bonus
    for (let i = 0; i < this.bonuses.length; i++) {
      if (this.snake.body[0].x === this.bonuses[i].x && this.snake.body[0].y === this.bonuses[i].y) {
        this.bonuses[i].apply(this.snake);
        this.bonuses[i].remainingLifetime = 0;
        somethingChanged = true;
      }
    }

    // Update the bonuses
    for (let i = 0; i < this.bonuses.length; i++) {
      this.bonuses[i].update(delta);
    }

    if (this.bonuses.filter(bonus => bonus.remainingLifetime <= 0).length  > 0) {
      somethingChanged = true;
    }

    this.bonuses = this.bonuses.filter(bonus => bonus.remainingLifetime > 0);

    // Check if new bonuses need to be added.
    if (this.bonuses.length < this.MAX_BONUSES) {
      let needMoreBonuses = false;
      if (this.bonuses.length < this.MIN_BONUSES) {
        // Guarantee that there is at least one bonus.
        needMoreBonuses = true;
      } else {
        // 1 in 10 chance of adding a new bonus.
        needMoreBonuses = Math.random() < 0.1;
      }

      if (needMoreBonuses) {
        this.gameMap.clearCollisionMap();
        this.gameMap.addSnakeToCollisionMap(this.snake);
        this.gameMap.addBonusesToCollisionMap(this.bonuses);

        let emptySpot = this.gameMap.findEmptySpotInCollisionMap();
        const bonusType = Math.floor(Math.random() * this.bonusTypesCount);
        this.bonuses.push(new Bonus(emptySpot.x, emptySpot.y, 10000, bonusType));
        somethingChanged = true;
      }
    }

    return somethingChanged;
  }

}