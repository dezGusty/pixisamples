import { Spritesheet } from "pixi.js";
import { Snake, SnakeBodyPart, SnakeBodyPartType, SnakeDirection } from "./snake";
import { KeyboardController } from "./keyboard-controller";
import { GameMap } from "./gamemap";

export class Game {

  public snake: Snake;

  private gameDelta: number = 0;
  private maxDelta = 250;

  private solidBorders = false;

  constructor(
    private gameMap: GameMap,
    private keyboardController: KeyboardController,
    private snakeSheet: Spritesheet,
    private snakeTextureNames: string[]) {
    this.snake = new Snake(this.snakeSheet, this.snakeTextureNames);
  }

  public start() {
    this.snake = new Snake(this.snakeSheet, this.snakeTextureNames);
    this.snake.alive = true;

    this.snake.body.push({ x: 10, y: 10, type: SnakeBodyPartType.head_up, direction: SnakeDirection.up } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 11, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 12, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 13, type: SnakeBodyPartType.body_straight_up, direction: SnakeDirection.up } as SnakeBodyPart);
    this.snake.body.push({ x: 10, y: 14, type: SnakeBodyPartType.tail_up, direction: SnakeDirection.up } as SnakeBodyPart);
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

  public update(delta: number): boolean {
    let somethingChanged = false;
    if (!this.snake.alive) {
      return somethingChanged;
    }

    // Keyboard controller actions.
    if (this.keyboardController.keys.up.pressed) {
      if (this.snake.direction !== SnakeDirection.down) {
        this.snake.direction = SnakeDirection.up;
      }
    }

    if (this.keyboardController.keys.down.pressed) {
      if (this.snake.direction !== SnakeDirection.up) {
        this.snake.direction = SnakeDirection.down;
      }
    }

    if (this.keyboardController.keys.left.pressed) {
      if (this.snake.direction !== SnakeDirection.right) {
        this.snake.direction = SnakeDirection.left;
      }
    }

    if (this.keyboardController.keys.right.pressed) {
      if (this.snake.direction !== SnakeDirection.left) {
        this.snake.direction = SnakeDirection.right;
      }
    }

    // Gamepad controller actions.
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      const gp = gamepads[0];
      if (gp) {
        if (gp.axes[0] > 0.5) {
          this.snake.direction = SnakeDirection.right;
        }
        if (gp.axes[0] < -0.5) {
          this.snake.direction = SnakeDirection.left;
        }
        if (gp.axes[1] > 0.5) {
          this.snake.direction = SnakeDirection.down;
        }
        if (gp.axes[1] < -0.5) {
          this.snake.direction = SnakeDirection.up;
        }
      }
    }

    this.gameDelta += delta;
    if (this.gameDelta >= this.maxDelta) {
      this.gameDelta = 0;
      this.moveSnake();
      this.checkCollision();
      somethingChanged = true;
    }

    return somethingChanged;
  }

}