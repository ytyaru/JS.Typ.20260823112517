import {Tys} from './tys.js';
import {Typ} from './typ.js';
import {Tyo} from './tyo.js';
import {Tyd} from './tyd.js';
class isT {
    static get p() {return Typ.is}
    static get o() {return Tyo.is}
    static get d() {return Tyd.is}
}
class owT {
    static get p() {return Typ.er}
    static get o() {return Tyo.er}
    static get d() {return Tyd.er}
}
const tof = v=>Tys.name(v);
export {isT,owT,tof};
