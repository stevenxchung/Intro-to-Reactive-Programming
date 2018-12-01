// Detecting double clicks

import { fromEvent, interval } from 'rxjs';
import { buffer, throttle, map, filter } from 'rxjs/operators';

// Select the button and h4 element and store it as a variable
const button = document.querySelector('button');
const label = document.querySelector('h4');

// Initialize click stream observable as clickStream$
const clickStream$ = fromEvent(button, 'click');

// We can chain clickStream$ with pipe() and use a variety of operations
const doubleClickStream$ = clickStream$.pipe(
  // Here we observe the stream and check to see if there are two clicks which occurred in 250 ms
  buffer(clickStream$.pipe(throttle(val => interval(250)))),
  map(arr => arr.length),
  filter(len => len === 2)
);

// If there is two clicks within 250 ms, set the text in h4
doubleClickStream$.subscribe(event => {
  label.textContent = 'Double Clicked!';
});

// For the first second, no double clicks will count and the text will be set
doubleClickStream$.pipe(throttle(val => interval(1000))).subscribe(suggestion => {
  label.textContent = 'First Try!';
});
