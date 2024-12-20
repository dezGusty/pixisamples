// Define a class for the game map
// The game map is a 2D array of tiles

import { Sprite } from "pixi.js";
import { Maybe } from "./maybe";

export class GameMap {
  public tiles: number[][] = [];
  public sprites: Maybe<Sprite>[][] = [];

  constructor(public width: number, public height: number) {
    for (let i = 0; i < width; i++) {
      this.tiles[i] = [];
      this.sprites[i] = [];
      for (let j = 0; j < height; j++) {
        this.tiles[i][j] = 0;
        this.sprites[i][j] = Maybe.None<Sprite>();
      }
    }
  }
};