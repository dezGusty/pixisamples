import { Sprite, Spritesheet } from "pixi.js";
import { Maybe } from "./maybe";

export enum SnakeBodyPartType {
  head_up = 0,
  head_left = 1,
  head_down = 2,
  head_right = 3,
  body_straight_up = 4,
  body_straight_left = 5,
  body_straight_down = 6,
  body_straight_right = 7,
  body_turn_up_left = 8,
  body_turn_up_right = 9,
  body_turn_down_left = 10,
  body_turn_down_right = 11,
  tail_up = 12,
  tail_left = 13,
  tail_down = 14,
  tail_right = 15
}

export enum SnakeDirection {
  up = 0,
  left = 1,
  down = 2,
  right = 3
}

export class SnakeBodyPart {
  x: number = 0;
  y: number = 0;
  direction: SnakeDirection = SnakeDirection.up;
  type: SnakeBodyPartType = SnakeBodyPartType.head_up;
  sprite: Maybe<Sprite> = Maybe.None<Sprite>();
  constructor(x: number, y: number, type: SnakeBodyPartType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

export class Snake {

  public alive: boolean = true;
  public body: SnakeBodyPart[] = [];

  public direction: SnakeDirection = SnakeDirection.up;

  constructor(private snakeSheet: Spritesheet, private snakeTextureNames: string[]) {
    console.log('Snake created');
  }

  protected shiftSnakeBody() {
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
      this.body[i].type = this.body[i - 1].type;
      this.body[i].direction = this.body[i - 1].direction;
    }

    this.updateTailBodyPart();
  }

  public sprites(): Sprite[] {
    let sprites: Sprite[] = [];
    for (let i = 0; i < this.body.length; i++) {
      if (this.body[i].sprite.hasData()) {
        sprites.push(this.body[i].sprite.data as Sprite);
      }
    }
    return sprites;
  }

  public updateSprites(): Sprite[] {
    let sprites: Sprite[] = [];
    for (let i = 0; i < this.body.length; i++) {
      let snakeSprite = new Sprite(this.snakeSheet.textures[this.snakeTextureNames[this.body[i].type]]);
      snakeSprite.x = this.body[i].x * 32 + 50;
      snakeSprite.y = this.body[i].y * 32 + 50;
      sprites.push(snakeSprite);
      this.body[i].sprite = Maybe.Some(snakeSprite);
    }
    return sprites;
  }

  protected updateTailBodyPart() {
    if (this.body.length <= 1) {
      return;
    }

    let tail = this.body[this.body.length - 1];
    let direction = this.body[this.body.length - 2].direction;
    if (direction == SnakeDirection.up) {
      tail.type = SnakeBodyPartType.tail_up;
    } else if (direction == SnakeDirection.left) {
      tail.type = SnakeBodyPartType.tail_left;
    } else if (direction == SnakeDirection.down) {
      tail.type = SnakeBodyPartType.tail_down;
    } else {
      tail.type = SnakeBodyPartType.tail_right;
    }
  }

  public pullUp() {
    if (this.body.length <= 0) {
      return;
    }

    if (this.body[0].direction == SnakeDirection.down) {
      // disallowed
      return;
    }

    // Update the snake's future "neck" part based on the head's direction (old and new)
    if (this.body[0].direction == SnakeDirection.left) {
      this.body[0].type = SnakeBodyPartType.body_turn_up_right;
    } else if (this.body[0].direction == SnakeDirection.right) {
      this.body[0].type = SnakeBodyPartType.body_turn_up_left;
    } else {
      this.body[0].type = SnakeBodyPartType.body_straight_up;
    }

    this.shiftSnakeBody();

    this.body[0].type = SnakeBodyPartType.head_up;
    this.body[0].direction = SnakeDirection.up;
    this.body[0].y -= 1;
  }

  public pullDown() {
    if (this.body.length <= 0) {
      return;
    }

    if (this.body[0].direction == SnakeDirection.up) {
      // disallowed
      return;
    }

    // Update the snake's future "neck" part based on the head's direction (old and new)
    if (this.body[0].direction == SnakeDirection.left) {
      this.body[0].type = SnakeBodyPartType.body_turn_down_right;
    } else if (this.body[0].direction == SnakeDirection.right) {
      this.body[0].type = SnakeBodyPartType.body_turn_down_left;
    } else {
      this.body[0].type = SnakeBodyPartType.body_straight_down;
    }

    this.shiftSnakeBody();

    this.body[0].type = SnakeBodyPartType.head_down;
    this.body[0].direction = SnakeDirection.down;
    this.body[0].y += 1;
  }

  public pullLeft() {
    if (this.body.length <= 0) {
      return;
    }

    if (this.body[0].direction == SnakeDirection.right) {
      // disallowed
      return;
    }

    if (this.body[0].direction == SnakeDirection.up) {
      this.body[0].type = SnakeBodyPartType.body_turn_down_left;
    } else if (this.body[0].direction == SnakeDirection.down) {
      this.body[0].type = SnakeBodyPartType.body_turn_up_left;
    } else {
      this.body[0].type = SnakeBodyPartType.body_straight_left;
    }

    this.shiftSnakeBody();

    this.body[0].type = SnakeBodyPartType.head_left;
    this.body[0].direction = SnakeDirection.left;
    this.body[0].x -= 1;
  }

  public pullRight() {
    if (this.body.length <= 0) {
      return;
    }

    if (this.body[0].direction == SnakeDirection.left) {
      // disallowed
      return;
    }

    if (this.body[0].direction == SnakeDirection.up) {
      this.body[0].type = SnakeBodyPartType.body_turn_down_right;
    } else if (this.body[0].direction == SnakeDirection.down) {
      this.body[0].type = SnakeBodyPartType.body_turn_up_right;
    } else {
      this.body[0].type = SnakeBodyPartType.body_straight_right;
    }

    this.shiftSnakeBody();

    this.body[0].type = SnakeBodyPartType.head_right;
    this.body[0].direction = SnakeDirection.right;
    this.body[0].x += 1;
  }

  protected logSnake() {
    // Log the entire snake
    // console.log('Snake:');
    for (let i = 0; i < this.body.length; i++) {
      console.log(`Part ${i}: x=${this.body[i].x}, y=${this.body[i].y}, type=${this.body[i].type}, direction=${this.body[i].direction}`);
    }
  }


}