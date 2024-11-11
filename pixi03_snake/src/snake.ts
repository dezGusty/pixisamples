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

  protected pullCommon() {
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
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

  public pullUp() {
    if (this.body.length <= 0) {
      return;
    }

    this.pullCommon();

    if (this.body.length > 1) {
      switch (this.body[1].type) {
        case SnakeBodyPartType.body_straight_left:
          this.body[0].type = SnakeBodyPartType.body_turn_up_right;
          break;
        case SnakeBodyPartType.body_straight_right:
          this.body[0].type = SnakeBodyPartType.body_turn_up_left;
          break;
      }
    }

    this.body[0].type = SnakeBodyPartType.head_up;
    this.body[0].y -= 1;
  }

  public pullDown() {
    if (this.body.length <= 0) {
      return;
    }

    this.pullCommon();
    this.body[0].type = SnakeBodyPartType.head_down;
    this.body[0].y += 1;
  }

  public pullLeft() {
    if (this.body.length <= 0) {
      return;
    }

    this.pullCommon();
    this.body[0].type = SnakeBodyPartType.head_left;
    this.body[0].x -= 1;
  }

  public pullRight() {
    if (this.body.length <= 0) {
      return;
    }

    this.pullCommon();
    this.body[0].type = SnakeBodyPartType.head_right;
    this.body[0].x += 1;
  }



}