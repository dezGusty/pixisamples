// Define a class for the game map
// The game map is a 2D array of tiles

import { Sprite } from "pixi.js";
import { Maybe } from "./maybe";
import { Snake } from "./snake";
import { Bonus } from "./bonus";

export class GameMap {
  public tiles: number[][] = [];
  public sprites: Maybe<Sprite>[][] = [];
  public collisionMap: number[][] = [];

  public get width(): number { return this._width; }

  public get height(): number { return this._height; }

  constructor(private _width: number, private _height: number) {
    this.initializeToSize(_width, _height);
  }

  public initializeToSize(mapWidth: number, mapHeight: number) {
    for (let i = 0; i < mapWidth; i++) {
      this.tiles[i] = [];
      this.collisionMap[i] = [];
      this.sprites[i] = [];
      for (let j = 0; j < mapHeight; j++) {
        this.tiles[i][j] = 0;
        this.collisionMap[i][j] = 0;
        this.sprites[i][j] = Maybe.None<Sprite>();
      }
    }
  }

  public addSnakeToCollisionMap(snake: Snake) {
    for (let i = 0; i < snake.body.length; i++) {
      this.collisionMap[snake.body[i].x][snake.body[i].y] = 1;
    }
  }

  public addBonusesToCollisionMap(bonuses: Bonus[]) {
    for (let i = 0; i < bonuses.length; i++) {
      this.collisionMap[bonuses[i].x][bonuses[i].y] = 3;
    }
  }


  public addCritterToCollisionMap(x: number, y: number) {
    this.collisionMap[x][y] = 2;
  }

  public clearCollisionMap() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.collisionMap[i][j] = 0;
      }
    }
  }

  public findEmptySpotInCollisionMap(): { x: number, y: number } {
    // Go through the entire matrix and move the available cells to an array
    let availableCells: { x: number, y: number }[] = [];
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.collisionMap[i][j] === 0) {
          availableCells.push({ x: i, y: j });
        }
      }
    }

    let randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }

};