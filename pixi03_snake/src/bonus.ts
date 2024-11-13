import { Snake } from "./snake";

export class Bonus {
  x: number = 0;
  y: number = 0;
  remainingLifetime: number = 0;

  type: number = 0;

  constructor(x: number, y: number, lifetime: number, type: number) {
    this.x = x;
    this.y = y;
    this.remainingLifetime = lifetime;
    this.type = type;
  }

  public update(delta: number) {
    this.remainingLifetime -= delta;
  }

  public apply(snake: Snake) {
    console.log(`Applying bonus of type ${this.type} to snake`);
    switch (this.type) {
      case 0:
        snake.grow();
        snake.score += 2;
        break;
      case 1:
        snake.grow();
        snake.grow();
        snake.score += 1;
        break;
      case 2:
        snake.grow();
        snake.score += 2;
        break;
      case 3:
        snake.grow();
        snake.score += 3;
        break;
    }
  }

}