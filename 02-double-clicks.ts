// Detecting double clicks

import { fromEvent, interval } from 'rxjs';
import { buffer, throttle, map, filter } from 'rxjs/operators';

// Select the button and h4 element and store it as a variable
const button = document.querySelector('button');
const label = document.querySelector('h4');

// Initialize clickStream observable
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
