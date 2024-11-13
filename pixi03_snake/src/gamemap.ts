// Define a class for the game map
// The game map is a 2D array of tiles

import { Sprite } from "pixi.js";
import { Maybe } from "./maybe";

export class GameMap {
  public tiles: number[][] = [];
  public sprites: Maybe<Sprite>[][] = [];

  public get width():number { return this._width; }

  public get height():number { return this._height; }

  constructor(private _width: number, private _height: number) {
    for (let i = 0; i < _width; i++) {
      this.tiles[i] = [];
      this.sprites[i] = [];
      for (let j = 0; j < _height; j++) {
        this.tiles[i][j] = 0;
        this.sprites[i][j] = Maybe.None<Sprite>();
      }
    }
  }
};