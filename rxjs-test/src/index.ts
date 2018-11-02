// All changes here will automatically refresh browser via webpack :)

import { of, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import * as $ from 'jquery';

var requestStream = of('https://api.github.com/users');

var responseStream = requestStream.pipe(flatMap(requestUrl =>
  from($.getJSON(requestUrl))
));

responseStream.subscribe(response => {
  console.log(response);
});
