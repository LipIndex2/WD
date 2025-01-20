
const fs = require('fs');
const ps = require('path');


const file = ps.join(__dirname, '..', '..', 'assets', 'script', 'proto', 'proto.d.ts');
const original = fs.readFileSync(file, { encoding: 'utf8' });
fs.writeFileSync(file, `
import { Long } from 'protobufjs/minimal.js';
import * as $protobuf from 'protobufjs/minimal.js';
declare global {\n ${original} \n} \n export {}
`,);




