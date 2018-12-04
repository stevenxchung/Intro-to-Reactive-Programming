// There is a small bug previously when hitting refresh, it does not clear right away
// We fix this by using startWith()

import { of, from, fromEvent } from 'rxjs';
import {
  flatMap,
  map,
  merge,
  startWith,
  shareReplay,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import * as $ from 'jquery';

// Initialize selectors
const refreshButton = document.querySelector('.refresh');
const closeButton1 = document.querySelector('.close1');
const closeButton2 = document.querySelector('.close2');
const closeButton3 = document.querySelector('.close3');

// Initialize click observables
const refreshClickStream$ = fromEvent(refreshButton, 'click');
const close1Clicks$ = fromEvent(closeButton1, 'click');
const close2Clicks$ = fromEvent(closeButton2, 'click');
const close3Clicks$ = fromEvent(closeButton3, 'click');

// Initialize observable stream
const startupRequestStream$ = of('https://api.github.com/users');

// Set requestOnRefreshStream$ to be an observable of random GitHub users
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

// Merges startupRequestStream$ with requestOnRefreshStream$ and maps values to JSON object
const responseStream$ = startupRequestStream$.pipe(
  merge(requestOnRefreshStream$),
  flatMap(requestUrl => from($.getJSON(requestUrl))),
  tap(val => {
    console.log('In startupRequestStream$ pipe!');
    console.log(val)
  }),
  shareReplay(1)
);

// ----u---------->
//   startWith(N)
// N---u---------->
// -------N---N--->
//     merge
// N---u--N---N-u->

// Function that returns an array of randomly ordered GitHub users
const getRandomUser = (listUsers: any) => {
  return listUsers[Math.floor(Math.random() * listUsers.length)];
};

// Returns responseStream$ merged with refreshClickStream$ and closeClickStream$
const createSuggestionStream = (responseStream$: any, closeClickStream$: any) => {
  return responseStream$.pipe(
    map(
      (listUser: any) => listUser[Math.floor(Math.random() * listUser.length)]
    ),
    startWith(null),
    merge(refreshClickStream$.pipe(map(ev => null))),
    merge(
      closeClickStream$.pipe(
        withLatestFrom(responseStream$, (x: any, R: any) => getRandomUser(R))
      )
    )
  );
};

// Set up suggestionStream$
const suggestion1Stream$ = createSuggestionStream(responseStream$, close1Clicks$);
const suggestion2Stream$ = createSuggestionStream(responseStream$, close2Clicks$);
const suggestion3Stream$ = createSuggestionStream(responseStream$, close3Clicks$);

// Renders user's name and photo to the DOM
const renderSuggestion = (suggestedUser: any, selector: any) => {
  const suggestionEl = document.querySelector(selector);
  if (suggestedUser === null) {
    $(selector).hide();
  } else {
    // Using vanilla JS did not show for some reason
    $(selector).show();
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
