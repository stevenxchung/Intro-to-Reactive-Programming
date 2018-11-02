// Here we will explore async requests and responses with RxJS

var requestStream = just('https://api.github.com/users');

var responseStream = requestStream.flatMap(requestUrl =>
  fromPromise(jQuery.getJSON(requestUrl))
);

responseStream.subscribe(response => {
  console.log(response);
});
