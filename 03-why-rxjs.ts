// Why use rxjs?
// We us RxJS because it allows you to specify the dynamic behavior of a value completely at the time of declaration

let a = 3;
let b = 10 * a;

console.log(b);

a = 4;
b = 11 * a;
console.log(b)
