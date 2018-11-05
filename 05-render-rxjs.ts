// In this lesson we will render to the DOM (Document Object Model)

import { of, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import * as $ from 'jquery';

var refreshButton = document.querySelector('.refresh');

var requestStream = of('https://api.github.com/users');

var responseStream = requestStream.pipe(flatMap(requestUrl =>
  from($.getJSON(requestUrl))
));
