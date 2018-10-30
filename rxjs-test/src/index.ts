// All changes here will automatically refresh browser via webpack :)

import { fromEvent, interval } from 'rxjs';
import { buffer, throttle, map, filter } from 'rxjs/operators';

let button = document.querySelector('button');
let label = document.querySelector('h4');

let clickStream = fromEvent(button, 'click');
let doubleClickStream = clickStream.pipe(
  buffer(clickStream.pipe(throttle(val => interval(250)))),
  map(arr => arr.length),
  filter(len => len === 2)
);

doubleClickStream.subscribe(event => {
  label.textContent = 'Double Clicked!';
});

doubleClickStream.pipe(throttle(val => interval(1000))).subscribe(suggestion => {
  label.textContent = 'First Try!';
});
