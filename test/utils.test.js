import assert from 'node:assert';
import { countActive } from '../src/utils.js';

assert.strictEqual(countActive([{actif:true}, {actif:false}, {actif:true}]), 2);
assert.strictEqual(countActive([]), 0);

console.log('All tests passed.');
