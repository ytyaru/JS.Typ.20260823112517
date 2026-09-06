import {Tys} from './tys.js';
import {Typis} from './typ.js';
import {Tyois} from './tyo.js';
import {Tydis} from './tyd.js';
import {FnObj} from './fn-obj.js';

const owTp = FnObj.mkEr(Typis, 'isT.p.some(v)');
const owTo = FnObj.mkEr(Tyois, 'isT.o.some(v)');
const owTd = FnObj.mkEr(Tydis, 'isT.d.some(v)');

export const isT = Object.freeze({
    get p() { return Typis; },
    get o() { return Tyois; },
    get d() { return Tydis; },
});

export const owT = Object.freeze({
    get p() { return owTp; },
    get o() { return owTo; },
    get d() { return owTd; },
});

export const tof = v => Tys.name(v);
