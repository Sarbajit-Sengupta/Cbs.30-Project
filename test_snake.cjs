const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'Help Unity Snake game.html'), 'utf8')
  .match(/<script>([\s\S]*?)<\/script>/)[1];
let keydown;
const canvas = {width: 400, height: 400, getContext: () => ({clearRect() {}, fillRect() {}})};
const state = {document: {getElementById: () => canvas, addEventListener: (_, fn) => keydown = fn},
  requestAnimationFrame() {}};
vm.createContext(state);
vm.runInContext(source, state);
let prevented = 0;
function press(which) {keydown({which, preventDefault() {prevented++;}});}
press(38); // right -> up is legal
press(37); // a second turn before moving would reverse right -> left
assert.equal(state.snake.dx, 0);
assert.equal(state.snake.dy, -16);
for (let i = 0; i < 4; i++) state.loop();
assert.equal(state.snake.x, 160);
assert.equal(state.snake.y, 144);
press(37); // after moving, up -> left is legal
assert.equal(state.snake.dx, -16);
assert.equal(state.snake.dy, 0);
press(65); // unrelated keys retain browser behavior
assert.equal(prevented, 3);
console.log('Snake queued-turn regression passed');
