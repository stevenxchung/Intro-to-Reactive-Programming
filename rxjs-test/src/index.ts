// All changes here will automatically refresh browser via webpack :)

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

let streamA = of(3, 4);
let streamB = streamA.pipe(map(a => 10 * a));

streamB.subscribe(b => console.log(b))
