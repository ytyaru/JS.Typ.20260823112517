import {Tys} from './tys.js';
import {Typis} from './typ.js'; // クラスではなく判定関数そのものをインポート
import {Tyois} from './tyo.js';
import {Tydis} from './tyd.js';
import {FnObj} from './fn-obj.js';

const owTp = FnObj.mkEr(Typis, 'isT.p.some(v)');
const owTo = FnObj.mkEr(Tyois, 'isT.o.some(v)');
const owTd = FnObj.mkEr(Tydis, 'isT.d.some(v)');
//const owTp = FnObj.mkEr(Typis, 'isT.p.some(v)');
//const owTo = FnObj.mkEr(Tyois, 'isT.o.some(v)');
//const owTd = FnObj.mkEr(Tydis, 'isT.d.some(v)');

class isT {
    static get p() {return Typis;}
    static get o() {return Tyois;}
    static get d() {return Tydis;}
}

class owT {
    static get p() {return owTp;}
    static get o() {return owTo;}
    static get d() {return owTd;}
}

const tof = v => Tys.name(v);

export {isT, owT, tof};
