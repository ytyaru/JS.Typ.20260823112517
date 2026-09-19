import {Ag} from './ag.js';
import {Cls,Fn} from './fn.js';
class Obj {
    static getTag(v) {return Object.prototype.toString.call(v).slice(8, -1)}
    static getFlag(v) {
        const is = null!==v && 'object'===typeof v;
        const ary = Array.isArray(v);
        const proto = is ? Object.getPrototypeOf(v) : null;
        const plain = is && Object.prototype===proto;
        const none = is && null===proto;
        const boxed = this.#boxed(v,is);
        const des = Des.getFlag(v,is);
        const ins = Ins.getFlag(v,is,proto,plain,this.getTag(v),ary,boxed);
        //return this.#get(v,is,ary,plain,none,boxed,des,ins);
        return this.#get(v,is,ary,(is && Object.prototype===proto && !none && !boxed.is && !des.is && !ins.is),none,boxed,des,ins);
    }
    static #get(v,is,ary,plain,none,boxed,des,ins) { return {
        is,
        ary,
        plain,
        none,
        proto: is && !ary && !plain && !none && !boxed.is && !des.is && !ins.is,
        boxed,
        des,
        ins,
    } }
    static #boxed(v,is) { return {
        is: is && [Boolean,Number,String].some(C=>v instanceof C),
        bln: is && (v instanceof Boolean),
        num: is && (v instanceof Number),
        str: is && (v instanceof String),
    } }
}
const g = 'Get';
const s = 'Set';
class Des {
    static N = Object.freeze({
        D: 'Descriptor',
        v: 'Value',
        m: Fn.N.m,
        d: 'Data',
        a: 'Access',
        g, s, gs:g+s,
    });

    static getFlag(v,is) {
        const keys = is ? Object.getOwnPropertyNames(v) : [];
        // 許可される全キー
        const allowedKeys = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'];
        // 存在チェック。getter/setterは片方だけ作成されると、作成されなかったほうが勝手に作成され値がundefinedになる仕様に対応した。但しvalueはundefinedという値が代入されうるため存在確認として使わない。
        const hasValue = keys.includes('value');
        const hasWritable = keys.includes('writable');
        const hasGet = keys.includes('get') && v.get !== undefined;
        const hasSet = keys.includes('set') && v.set !== undefined;
        const i = (!is || (keys.length === 0) || (!keys.every(key => allowedKeys.includes(key)))) ? false : true; 
        /*
//        return this.#get((i && ((hasValue || hasWritable) && (hasGet || hasSet)))
        return this.#get(v, (i && ((hasValue || hasWritable) && (hasGet || hasSet)), hasValue, hasGet, hasSet)
            || (i && (hasGet && 'function'!==typeof v.get && v.get !== undefined))
            || (i && (hasSet && 'function'!==typeof v.set && v.set !== undefined))
//            || (i && (hasGet && !tis.fn(v.get) && v.get !== undefined))
//            || (i && (hasSet && !tis.fn(v.set) && v.set !== undefined))
            || (i && (!hasValue && !hasWritable && !hasGet && !hasSet))
            );
        */
        const isData = (hasValue || hasWritable) && !hasGet && !hasSet;
        const isAccess = (hasGet || hasSet) && !hasValue && !hasWritable;
        const isEmpty = !hasValue && !hasWritable && !hasGet && !hasSet;
        return this.#get(
            v, 
            i && (isData || isAccess || isEmpty || 
                (hasGet && 'function'!==typeof v.get && v.get !== undefined) || 
                (hasSet && 'function'!==typeof v.set && v.set !== undefined)), 
            hasValue, 
            hasGet, 
            hasSet
        );
    }
//    static #get(is) { return {
    static #get(v, is, hasValue, hasGet, hasSet) { return {
        is,
        d: {is: is && !(hasGet || hasSet),
            v: is && hasValue && 'function'!==typeof v.value,
            m: is && hasValue && 'function'===typeof v.value,
        },
        a: {is: is && (hasGet || hasSet),
            hasG: is && hasGet, // g or gs
            hasS: is && hasSet, // s or gs
            g: is && hasGet && !hasSet,
            s: is && hasSet && !hasGet,
            gs: is && (hasGet && hasSet),
        },
    } }
}
class Ins {
    static getFlag(v,is,proto,plain,tag,ary,boxed) {
        const ctor = proto?.constructor;
        const s = Fn.getCode(ctor);
        const es6 = is && this.#isEs6(proto, ctor, s);
        const es5 = is && this.#isEs5(proto, ctor, s);
        const native = is && !plain && !ary && !boxed.is && 'Object'!==tag && !es6 && !es5;
        return {is:es6||es5||native, es6, es5, native}
    }
    static #isEs6(proto, ctor, s) {return (typeof ctor !== 'function') ? false : Cls.isEs6(ctor, s)}
    static #isEs5(proto, ctor, s) {return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (Cls.isEs6(ctor,s) || Fn.isNative(ctor, s)) ? false : (Cls.isEs5(ctor,s) || (proto !== Object.prototype && proto !== Function.prototype));}
    /*
    static isEs6(proto, ctor) {return (typeof ctor !== 'function') ? false : Cls.isEs6(ctor, Fn.getCode(ctor))}
    static isEs5(proto, ctor) {
        const s = Fn.getCode(ctor);
        return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (Cls.isEs6(ctor,s) || Fn.isNative(ctor, Fn.getCode(ctor))) ? false : (Cls.isEs5(ctor,s) || (proto !== Object.prototype && proto !== Function.prototype));
    }
    //static isEs5(proto, ctor) {return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (Cls.isEs6(ctor) || Fn.isNative(ctor, Fn.getCode(ctor))) ? false : (Cls.isEs5(ctor) || (proto !== Object.prototype && proto !== Function.prototype));}
    */
}
export {Obj,Des,Ins}
