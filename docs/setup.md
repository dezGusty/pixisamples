# Set-up steps

A quick set-up process for using PixiJS with Vite, adapted from [here](https://doc.babylonjs.com/guidedLearning/usingVite)

```sh
npm i vite
npm i pixi.js
```

(Optionally)

```sh
npm i pixi-stats
```

(TODO: npm i -D pixi.js ?)

```sh
npm init vite
```

> pixi01
Vanilla, Typescript

```sh
cd pixi01
npm i
npm run dev
```

Stop the server (CTRL + C)

Delete everything inside the `public` and `src` folders (contents, not folders themselves)

Create a new file inside `src` called `app.ts`

Use boilerplate from <https://pixijs.download/release/docs/index.html>

```ts
import { Application, Sprite, Assets } from 'pixi.js';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application();

// Wait for the Renderer to be available
await app.init();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.canvas);

// load the texture we need
const texture = await Assets.load('bunny.png');

// This creates a texture from a 'bunny.png' image
const bunny = new Sprite(texture);

// Setup the position of the bunny
bunny.x = app.renderer.width / 2;
bunny.y = app.renderer.height / 2;

// Rotate around the center
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// Add the bunny to the scene we are building
app.stage.addChild(bunny);

// Listen for frame updates
app.ticker.add(() => {
    // each frame we spin the bunny around a bit
    bunny.rotation += 0.01;
});
```

Edit the `index.html` file to:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pixi 01</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/app.ts"></script>
  </body>
</html>
```

Create a PNG picture named `bunny.png` and place it in the `public` folder.
Reload the page in a browser (re-run `npm run dev` if needed).
