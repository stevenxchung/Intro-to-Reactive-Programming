// Why use rxjs?
// We us RxJS because it allows you to specify the dynamic behavior of a value completely at the time of declaration

// Here we cannot specify the dynamic behavior of a value completely at the time of declaration
let a = 3;
let b = 10 * a;
console.log(b); // 30

// The value of b is still 30
a = 4;
console.log(b) // 30

// b is not a constant so the result has been changed from 30 to 44
b = 11 * a;
console.log(b) // 44

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

// When using RxJS, we can now specify the dynamic behavior of a value completely at the time of declaration. If we want the output to be 30 and 40 we simply add a 4 to the of() method.
let streamA = of(3, 4);
let streamB = streamA.pipe(map(a => 10 * a));

streamB.subscribe(b => console.log(b))
