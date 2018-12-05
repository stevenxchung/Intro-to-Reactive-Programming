// In this lesson we will explore how to share network requests with RxJS merge

import { of, from, fromEvent } from 'rxjs';
import {
  flatMap,
  map,
  merge,
  startWith,
  shareReplay,
  tap
} from 'rxjs/operators';
import * as $ from 'jquery';

// Initialize selectors
const refreshButton = document.querySelector('.refresh');

// Initialize observables
const refreshClickStream$ = fromEvent(refreshButton, 'click');
const startupRequestStream$ = of('https://api.github.com/users');

// requestOnRefreshStream$ will be an observable stream of GitHub users in random order
const requestOnRefreshStream$ = refreshClickStream$.pipe(
  map(ev => {
    const randomOffset = Math.floor(Math.random() * 500);
    return 'https://api.github.com/users?since=' + randomOffset;
  })
);

//------a---b------c----->
//s---------------------->
// merge both data streams
//s-----a---b------c----->

// Combine startupRequestStream$ and requestOnRefreshStream$
const responseStream$ = startupRequestStream$.pipe(
  merge(requestOnRefreshStream$),
  flatMap(requestUrl => from($.getJSON(requestUrl))),
  tap(val => {
    console.log('In startupRequestStream$ pipe!');
  }),
  shareReplay(1)
);

// ----u---------->
//   startWith(N)
// N---u---------->
// -------N---N--->
//     merge
// N---u--N---N-u->

// Returns a responseStream$ merged with refreshClickStream$ and null
const createSuggestionStream = (responseStream$: any) => {
  return responseStream$.pipe(
    map(
      (listUser: any) => listUser[Math.floor(Math.random() * listUser.length)]
    ),
    startWith(null),
    merge(refreshClickStream$.pipe(map(ev => null)))
  );
};

// Set up suggestion streams
const suggestion1Stream$ = createSuggestionStream(responseStream$);
const suggestion2Stream$ = createSuggestionStream(responseStream$);
const suggestion3Stream$ = createSuggestionStream(responseStream$);

// Renders user's name and photo to the DOM
const renderSuggestion = (suggestedUser: any, selector: any) => {
  const suggestionEl = document.querySelector(selector);
  if (suggestedUser === null) {
    $(selector).hide()
  } else {
    // Using vanilla JS did not show for some reason
    $(selector).show()
    const usernameEl = suggestionEl.querySelector('.username');
    usernameEl.href = suggestedUser.html_url;
    usernameEl.textContent = suggestedUser.login;
    const imgEl = suggestionEl.querySelector('img');
    imgEl.src = '';
    imgEl.src = suggestedUser.avatar_url;
  }
};

// Takes users from the stream and passes it into renderSuggestion()
suggestion1Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion1');
});

suggestion2Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion2');
});

suggestion3Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion3');
});
