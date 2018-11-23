// All changes here will automatically refresh browser via webpack :)

import { of, from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import * as $ from 'jquery';

let refreshButton = document.querySelector('.refresh');

let requestStream$ = of('https://api.github.com/users');

let responseStream$ = requestStream$.pipe(
  flatMap(requestUrl => from($.getJSON(requestUrl)))
);

let createSuggestionStream = (responseStream$: any) => {
  return responseStream$.pipe(
    map(
      (listUser: any) => listUser[Math.floor(Math.random() * listUser.length)]
    )
  );
};

let suggestion1Stream$ = createSuggestionStream(responseStream$);
let suggestion2Stream$ = createSuggestionStream(responseStream$);
let suggestion3Stream$ = createSuggestionStream(responseStream$);

let renderSuggestion = (userData: any, selector: any) => {
  let element = document.querySelector(selector);
  let usernameEl = element.querySelector('.username');
  usernameEl.href = userData.html_url;
  usernameEl.textContent = userData.login;
  let imgEl = element.querySelector('img');
  imgEl.src = userData.avatar_url;
};

suggestion1Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion1');
});

suggestion2Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion2');
});

suggestion3Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion3');
});
