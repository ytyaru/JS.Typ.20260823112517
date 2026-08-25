import {Tys} from './tys.js';
// Type Object is/error
export class Tyo {
    static get is() {return Tyois}
    static get er() {return Tyoer}
}
class Tyois {
    static some(v) {
        const N = Tys.name(v);
        return TyoisFn._some(N) || ['Method'].some(n=>N.endsWith(n)) || ['PlainObject','Array'].some(n=>n===N) || ['Descriptor','Class','Instance'].some(n=>N.startsWith(n+'<'));
    }
    static obj(v) {return 'PlainObject'===Tys.name(v)}
    static ary(v) {return Array.isArray(v)}
    static get cls() {return TyoisCls}
    static get ins() {return TyoisIns}
    static get des() {return TyoisDes}
    static get fn() {return TyoisFn}
    static get md() {return TyoisMd}
}
class TyoisCls {
    static some(v) {
        const N = Tys.name(v);
        return ['','ES5.','Native'].some(n=>N.startsWith(`${n}Class<`));
    }
    static es6(v) {return Tys.name(v).startsWith('Class<')}
    static es5(v) {return Tys.name(v).startsWith('ES5.Class<')}
    static native(v) {return Tys.name(v).startsWith('NativeClass<')}
}
class TyoisIns {
    static some(v,C) {
        const N = Tys.name(v);
        return ['','ES5.','Native'].some(n=>N.startsWith(`${n}Instance<`)) && (C ? v instanceof C: true);
    }
    static es6(v,C) {return Tys.name(v).startsWith('Instance<') && (C ? v instanceof C: true)}
    static es5(v,C) {return Tys.name(v).startsWith('ES5.Instance<') && (C ? v instanceof C: true)}
    static native(v,C) {return Tys.name(v).startsWith('NativeInstance<') && (C ? v instanceof C: true)}
}

class TyoisDes {
    static some(v) {return Tys.name(v).startsWith('Descriptor<')}
    static get d() {return TyoisDesD}
    static get a() {return TyoisDesA}
}
class TyoisDesDA {
    static some(v, names) {
        const N = Tys.name(v);
        const ns = names.map(n=>`Descriptor<${n}>`);
        return ns.some(n=>n===N);
    }
}
// Data/Accessor
class TyoisDesD extends TyoisDesDA {
    static some(v) {return super.some(v, 'Value Method'.split(' '))}
    static v(v) {return 'Descriptor<Value>'===Tys.name(v)}
    static m(v) {return 'Descriptor<Method>'===Tys.name(v)}
}
class TyoisDesA extends TyoisDesDA {
    static some(v) {return super.some(v, 'Getter Setter Accessor'.split(' '))}
    static g(v) {return 'Descriptor<Getter>'===Tys.name(v)}
    static s(v) {return 'Descriptor<Setter>'===Tys.name(v)}
    static a(v) {return 'Descriptor<Accessor>'===Tys.name(v)}
}
class TyoisFn {
    static some(v) {
        const N = Tys.name(v);
//        if ('AnonymousBlankFunction'===N) return false;
        return N.endsWith('Function') || `Bound Native`.split(' ').some(n=>N.startsWith(n+'Function<'));
    }
    static bound(v) {return Tys.name(v).startsWith(`BoundFunction<`)}
    static native(v) {return Tys.name(v).startsWith(`NativeFunction<`)}
    static get arrow() {return TyoisArrFn}
    static a(v) {return 'AsyncFunction'===Tys.name(v)}
    static g(v) {return 'GeneratorFunction'===Tys.name(v)}
    static ag(v) {return 'AsyncGeneratorFunction'===Tys.name(v)}
    static s(v) {return 'Function'===Tys.name(v)}
    static anonymous(v) {return 'AnonymousFunction'===Tys.name(v)} // 関数か匿名ES5擬似クラスか識別不能。だが関数として判断する。理由は二つ。function構文で生成されていることと、クラスなら空にする動機がないはずだから。関数ならば一時的に何もしない関数をセットし、他の関数にセットし直させる時まで空処理させることもあり得る。よって擬似クラスよりは関数として判定する。どちらでもない第三の曖昧型として扱うと、空関数にしたつもりなのに関数でなく別の型として認識されてしまい扱いづらくなってしまう。
    static _some(N) {return N.endsWith('Function') || `Bound Native`.split(' ').some(n=>N.startsWith(n+'Function<'))}
}
class TyoisArrFn {
    static some(v) {return Tys.name(v).endsWith('ArrowFunction')}
    static a(v) {return 'AsyncArrowFunction'===Tys.name(v)}
    static s(v) {return 'ArrowFunction'===Tys.name(v)}
}
class TyoisMd {
    static some(v) {return Tys.name(v).endsWith('Method')}
    static a(v) {return 'AsyncMethod'===Tys.name(v)}
    static g(v) {return 'GeneratorMethod'===Tys.name(v)}
    static ag(v) {return 'AsyncGeneratorMethod'===Tys.name(v)}
    static s(v) {return 'Method'===Tys.name(v)}
}
// Error
class Tyoer {
    static some(v) {
        if (Tyois.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static obj(v) {return this._('obj', v);}
    static ary(v) {return this._('ary', v);}
//    static cls(v) {return this._('cls', v);}
//    static ins(v,C) {return this._('ins', v);}
    static get cls() {return TyoerCls;}
    static get ins() {return TyoerIns;}
    static get des() {return TyoerDes}
    static get fn() {return TyoerFn}
    static get md() {return TyoerMd}
    static _(n,v) {
        if (Tyois[n](v)) return true;
        throw new TypeError(`Expected: '${Tyois[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerCls {
    static some(v) {
        if (TyoisCls.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.cls.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static es6(v) {return this._('es6',v);}
    static es5(v) {return this._('es5',v);}
    static native(v) {return this._('native',v);}
    static _(n,v) {
        if (TyoisCls[n](v)) return true;
        throw new TypeError(`Expected: '${Tyois.cls[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerIns {
    static some(v,C) {
        if (TyoisIns.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.ins.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static es6(v) {return this._('es6',v);}
    static es5(v) {return this._('es5',v);}
    static native(v) {return this._('native',v);}
    static _(n,v) {
        if (TyoisIns[n](v)) return true;
        throw new TypeError(`Expected: '${Tyois.ins[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}


class TyoerDes {
    static some(v) {
        if (TyoisDes.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.des.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static get d() {return TyoisDesD}
    static get a() {return TyoisDesA}
}
class TyoerDesD extends TyoisDesDA {
    static some(v) {return super.some(v, 'Value Method'.split(' '))}
    static v(v) {return this._('v',v);}
    static m(v) {return this._('m',v);}
    static _(n,v) {
        if (TyoisDesD[n](v)) return true;
        throw new TypeError(`Expected: '${Tyois.des.d[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerDesA extends TyoisDesDA {
    static some(v) {return this._('some',v);}
    static g(v) {return this._('g',v);}
    static s(v) {return this._('s',v);}
    static a(v) {return this._('a',v);}
    static _(n,v) {
        if (TyoisDesA[n](v)) return true;
        throw new TypeError(`Expected: '${Tyois.des.a[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
// Error
class TyoerFn {
    static some(v) {
        if (TyoisFn.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.fn.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static bound() {return this._('bound',v)}
    static native() {return this._('native',v)}
    static get arrow() {return TyoerArrFn}
    static a() {return this._('a',v)}
    static g() {return this._('g',v)}
    static ag() {return this._('ag',v)}
    static s() {return this._('s',v)}
    static _(n,v) {
        if (TyoisFn[n](v)) return true;
        throw new TypeError(`Expected: '${TyoisFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerArrFn {
    static some(v) {
        if (TyoisArrFn.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.fn.arrow.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static a() {return this._('a',v)}
    static s() {return this._('s',v)}
    static _(n,v) {
        if (TyoisArrFn[n](v)) return true;
        throw new TypeError(`Expected: '${TyoisArrFn[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}
class TyoerMd {
    static some(v) {
        if (TyoisMd.some(v)) return true;
        throw new TypeError(`Expected: a value that makes 'Tyois.md.some(v)' return true.\nActual: ${Tys.name(v)}`);
    }
    static a() {return this._('a',v)}
    static g() {return this._('g',v)}
    static ag() {return this._('ag',v)}
    static s() {return this._('s',v)}
    static _(n,v) {
        if (TyoisMd[n](v)) return true;
        throw new TypeError(`Expected: '${TyoisMd[n].toString()}' like value.\nActual: ${Tys.name(v)}`);
    }
}

