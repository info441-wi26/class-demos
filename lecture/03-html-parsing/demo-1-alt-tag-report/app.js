import parser from 'node-html-parser'
import {promises as fs} from 'fs'

let url = 'https://ischool.uw.edu';
let res = await fetch(url);
let htmlText = await res.text();

let html = parser.parse(htmlText);
let imgs = html.querySelectorAll('img')

console.log(imgs[0].attrs)


// let fileContents = await fs.readFile('./index.html');
// fileContents = fileContents.toString();

// let html = parser.parse(fileContents);
// console.log(html.querySelectorAll('img'))
