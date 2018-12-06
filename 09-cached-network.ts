// Let's enable the close button

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

const refreshButton = document.querySelector('.refresh');
const closeButton1 = document.querySelector('.close1');
const closeButton2 = document.querySelector('.close2');
const closeButton3 = document.querySelector('.close3');

const refreshClickStream = fromEvent(refreshButton, 'click');
const close1Clicks = fromEvent(closeButton1, 'click');
const close2Clicks = fromEvent(closeButton2, 'click');
const close3Clicks = fromEvent(closeButton3, 'click');

const startupRequestStream = of('https://api.github.com/users');

const requestOnRefreshStream = refreshClickStream.pipe(
  map(ev => {
    const randomOffset = Math.floor(Math.random() * 500);
    return 'https://api.github.com/users?since=' + randomOffset;
  })
);

//------a---b------c----->
//s---------------------->
// merge both data streams
//s-----a---b------c----->

const responseStream = startupRequestStream.pipe(
  merge(requestOnRefreshStream),
  flatMap(requestUrl => from($.getJSON(requestUrl))),
  tap(val => {
    console.log('In startupRequestStream pipe!');
  }),
  shareReplay(1)
);

// ----u---------->
//   startWith(N)
// N---u---------->
// -------N---N--->
//     merge
// N---u--N---N-u->

const getRandomUser = (listUsers: any) => {
  return listUsers[Math.floor(Math.random() * listUsers.length)];
};

const createSuggestionStream = (responseStream: any, closeClickStream: any) => {
  return responseStream.pipe(
    map(
      (listUser: any) => listUser[Math.floor(Math.random() * listUser.length)]
    ),
    startWith(null),
    merge(refreshClickStream.pipe(map(ev => null))),
    merge(
      closeClickStream.pipe(
        withLatestFrom(responseStream, (x: any, R: any) => getRandomUser(R))
      )
    )
  );
};

const suggestion1Stream$ = createSuggestionStream(responseStream, close1Clicks);
const suggestion2Stream$ = createSuggestionStream(responseStream, close2Clicks);
const suggestion3Stream$ = createSuggestionStream(responseStream, close3Clicks);

// Rendering
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

suggestion1Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion1');
});

suggestion2Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion2');
});

suggestion3Stream$.subscribe((user: any) => {
  renderSuggestion(user, '.suggestion3');
});
