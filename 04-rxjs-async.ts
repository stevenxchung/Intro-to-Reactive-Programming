// Here we will explore async requests and responses with RxJS

import { of, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

// Emit variable amount of values in a sequence, in this case it will be a stream of github users
const requestStream$ = of('https://api.github.com/users');

// flatMap() or mergeMap() will map request URLs to be an observable and emit values
const responseStream$ = requestStream$.pipe(
  flatMap(requestUrl => from(jQuery.getJSON(requestUrl)))
);

// By subscribing to responseStream$ we obtain an array of user objects
responseStream$.subscribe(response => {
  console.log(response);
});
