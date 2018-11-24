// In this lesson we will render to the DOM (Document Object Model)

import { of, from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import * as $ from 'jquery';

// Selector for refresh element
let refreshButton = document.querySelector('.refresh');

// Will create an observable of GitHub users
let requestStream$ = of('https://api.github.com/users');

// flatMap() is an alias for mergeMap(), see https://www.learnrxjs.io/operators/transformation/mergemap.html
// Here we flatten the requestStream$ of GitHub users to an observable of GitHub users in JSON
let responseStream$ = requestStream$.pipe(
  flatMap(requestUrl => from($.getJSON(requestUrl)))
);

// Returns responseStream$ where the users are randomly mapped into an array
let createSuggestionStream = (responseStream$: any) => {
  return responseStream$.pipe(
    map(
      (listUser: any) => listUser[Math.floor(Math.random() * listUser.length)]
    )
  );
};

// Each stream will be an individual observable stream of GitHub users in a random order
let suggestion1Stream$ = createSuggestionStream(responseStream$);
let suggestion2Stream$ = createSuggestionStream(responseStream$);
let suggestion3Stream$ = createSuggestionStream(responseStream$);

// Get name and image URL from the GitHub response
let renderSuggestion = (userData: any, selector: any) => {
  let element = document.querySelector(selector);
  let usernameEl = element.querySelector('.username');
  usernameEl.href = userData.html_url;
  usernameEl.textContent = userData.login;
  let imgEl = element.querySelector('img');
  imgEl.src = userData.avatar_url;
};

// Returns one user from the stream of random users
suggestion1Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion1');
});

suggestion2Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion2');
});

suggestion3Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion3');
});
