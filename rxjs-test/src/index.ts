// All changes here will automatically refresh browser via webpack :)

import { of } from 'rxjs';

const requestStream = of('https://api.github.com/users');

let responseStream = requestStream.flatMap(requestUrl =>
  fromPromise(jQuery.getJSON(requestUrl))
);

responseStream.subscribe(response => {
  console.log(response);
});
