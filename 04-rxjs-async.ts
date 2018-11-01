var requestStream = just('https://api.github.com/users');

requestStream.subscribe(requestUrl => {
  var responseStream = fromPromise(jQuery.getJSON(requestUrl));

  responseStream.subscribe(response => {
    console.log(response);
  })
})
