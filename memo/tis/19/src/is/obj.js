import {Ag} from './ag.js';
import {Cls,Fn} from './fn.js';
class Obj {
    static getTag(v) {return Object.prototype.toString.call(v).slice(8, -1)}
    static getFlag(v) {
        const is = null!==v && 'object'===typeof v;
//        if (!is) return {is}
//        if (!is) return this.#get(is,nul,plain,none,proto,boxed,des,ins);
        const ary = Array.isArray(v);
        const proto = is ? Object.getPrototypeOf(v) : null;
        const plain = is && Object.prototype===proto;
        const none = is && null===proto;
        //const boxed = this.#boxed(is,v);
        const boxed = this.#boxed(v,is);
        const des = Des.getFlag(is,v);
        const ins = Ins.getFlag(v,is,proto,plain,this.getTag(v),ary,boxed);
        return this.#get(v,is,ary,plain,none,boxed,des,ins);
        /*
        return this.#get(v,'object'===typeof v,null===v,plain,none,boxed,des,ins);
        return {
            is: 'object'===typeof v,
            nul: null===v,
            plain,
            none,
            proto: is && !plain && !none && !boxed.is && !des.is && !ins.is,
            boxed,
            des,
            ins,
        };
        */
    }
    static #get(v,is,ary,plain,none,boxed,des,ins) { return {
//    static #get(v,is,nul,plain,none,boxed,des,ins) { return {
//        is: 'object'===typeof v,
//        nul: null===v,
//        is: null!==v && 'object'===typeof v,
        is,
        ary,
        plain,
        none,
        proto: is && !ary && !plain && !none && !boxed.is && !des.is && !ins.is,
        boxed,
        des,
        ins,
    } }
//    static #boxed(v,is) { console.log(v,is);return {
    static #boxed(v,is) { return {
        is: is && [Boolean,Number,String].some(C=>v instanceof C),
        bln: is && (v instanceof Boolean),
        num: is && (v instanceof Number),
        str: is && (v instanceof String),
    } }
    /*
    static #boxed(v) { return {
        is: v=>[Boolean,Number,String].some(C=>v instanceof C),
        bln: v=>v instanceof Boolean,
        num: v=>v instanceof Number,
        str: v=>v instanceof String,
    } }
    static boxed(v) { const is = [Boolean,Number,String].some(C=>v instanceof C); return is ? ({
        is,
        bln: v=>v instanceof Boolean,
        num: v=>v instanceof Number,
        str: v=>v instanceof String,
    }) : ({is}) }
    static getFlag(v) {
        const proto = Object.getPrototypeOf(v);
        if (null===proto) return 'NonePrototypeObject';
        if ([Boolean,Number,String].some(C=>v instanceof C)) {return `BoxedPrimitive<${v.constructor.name}>`}
        const des = DesTys.name(v);
        if (des) return des;
        const isPlain = Object.prototype===proto;
        if (isPlain) return `PlainObject`;
        const ctor = proto.constructor;
        const isEs6Ins = Ins.isEs6(proto, ctor);
        const isEs5Ins = Ins.isEs5(proto, ctor);
        if (!isPlain && 'Object'!==name && !isEs6Ins && !isEs5Ins) return `NativeInstance<${name}>`;
        if (isEs6Ins || isEs5Ins) return `${isEs5Ins ? 'ES5.' : ''}Instance<${ctor.name || '(Anonymous)'}>`
        return 'PrototypedObject';
    }
    */
}
const g = 'Get';
const s = 'Set';
class Des {
    static N = Object.freeze({
        v: 'Value',
        m: Fn.N.m,
        d: 'Data',
        a: 'Access',
        g, s, gs:g+s,
    });

    static getFlag(is,v) {
//    static is(v) {
//        if (v === null || typeof v !== 'object') return false;

//        const keys = Object.getOwnPropertyNames(v);
        const keys = is ? Object.getOwnPropertyNames(v) : [];
//        if (keys.length === 0) return false;

        // 許可される全キー
        const allowedKeys = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'];
//        if (!keys.every(key => allowedKeys.includes(key))) return false;

        // 存在チェック。getter/setterは片方だけ作成されると、作成されなかったほうが勝手に作成され値がundefinedになる仕様に対応した。但しvalueはundefinedという値が代入されうるため存在確認として使わない。
        const hasValue = keys.includes('value');
        const hasWritable = keys.includes('writable');
        const hasGet = keys.includes('get') && v.get !== undefined;
        const hasSet = keys.includes('set') && v.set !== undefined;

        const i = (!is || (keys.length === 0) || (!keys.every(key => allowedKeys.includes(key)))) ? false : true; 
        return this.#get((i && ((hasValue || hasWritable) && (hasGet || hasSet)))
            || (i && (hasGet && !tis.fn(v.get) && v.get !== undefined))
            || (i && (hasSet && !tis.fn(v.set) && v.set !== undefined))
            || (i && (!hasValue && !hasWritable && !hasGet && !hasSet))
            );
        /*
        return (
        // データ記述子とアクセサ記述子の混在不可ルール
            ((hasValue || hasWritable) && (hasGet || hasSet))
        // 型チェック
        || (hasGet && !tis.fn(v.get) && v.get !== undefined)
        || (hasSet && !tis.fn(v.set) && v.set !== undefined)
//        || (hasGet && typeof v.get !== 'function' && v.get !== undefined)
//        || (hasSet && typeof v.set !== 'function' && v.set !== undefined)
        // いずれのキーも無ければディスクリプタではない
        || (!hasValue && !hasWritable && !hasGet && !hasSet)
        ) ? {is:false} : {
            is:true,
            d: {
                is: !(hasGet || hasSet)
                v: hasValue && 'function'!==typeof v.value,
                m: hasValue && 'function'===typeof v.value,
            },
            a: {
                is: (hasGet || hasSet),
                g: hasGet,
                s: hasSet,
                gs: (hasGet && hasSet),
            },
        };
        //) ? '' : `Descriptor<${this.#naming(v, hasValue, hasGet, hasSet)}>`;
        //) ? false : this._naming(v, hasValue, hasGet, hasSet);
        */
    }
    static #get(is) { return {
        is,
        d: {
            is: is && !(hasGet || hasSet),
            v: is && hasValue && 'function'!==typeof v.value,
            m: is && hasValue && 'function'===typeof v.value,
        },
        a: {
            is: is && (hasGet || hasSet),
            g: is && hasGet,
            s: is && hasSet,
            gs: is && (hasGet && hasSet),
        },
    } }
}
class Ins {
    static getFlag(v,is,proto,plain,tag,ary,boxed) {
        const es6 = is && this.isEs6(proto, proto?.constructor);
        const es5 = is && this.isEs5(proto, proto?.constructor);
//        const native = 'function'===typeof v && Fn.isNative(v,Fn.getCode(v)) && Cls.isNative(v);
        //const native = !plain && 'Object'!==tag && !es6 && !es5 && 'function'===typeof v && Fn.isNative(v,Fn.getCode(v)) && Cls.isNative(v);
        const native = is && !plain && !ary && !boxed.is && 'Object'!==tag && !es6 && !es5;
//        if (!isPlain && 'Object'!==name && !isEs6Ins && !isEs5Ins) return `NativeInstance<${name}>`;
        return {is:es6||es5||native, es6, es5, native}

//        if (!isPlain && 'Object'!==name && !isEs6Ins && !isEs5Ins) return `NativeInstance<${name}>`;
    }
/*
    static getFlag(v,is,proto) { return {
        es6: this.isEs6(proto, proto?.constructor),
        es5: this.isEs6(proto, proto?.constructor),
        native: 'function'===typeof v && Fn.isNative(v,Fn.getCode(v)) && Cls.isNative(v),
    } }
*/
//    static getFlag(v,is,proto) { return {
//        es6: this.isEs6(proto, proto.constructor),
//        es5: this.isEs6(proto, proto.constructor),
//        native: Fn.isNative(v,Fn.getCode(v)) && Cls.isNative(v),
//    } }
    static isEs6(proto, ctor) {return (typeof ctor !== 'function') ? false : Cls.isEs6(ctor, Fn.getCode(ctor))}
//    static #isEs6Ins(proto, ctor) {return !tis.fn(ctor) ? false : FnTys._isEs6Cls(ctor, getCode(ctor))}
//    static #isEs6Ins(proto, ctor) {return (typeof ctor !== 'function') ? false : FnTys._isEs6Cls(ctor, getCode(ctor))}
//    static #isEs6Ins(proto, ctor) {
//        if (typeof ctor !== 'function') return false;
//        return FnTys._isEs6Cls(ctor);
//    }
    static isEs5(proto, ctor) {return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (Cls.isEs6(ctor) || Fn.isNative(ctor, Fn.getCode(ctor))) ? false : (Cls.isEs5(ctor) || (proto !== Object.prototype && proto !== Function.prototype));}
//    static #isEs5Ins(proto, ctor) {
        //return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype));
//        return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, getCode(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype));
//        return !tis.fn(ctor) || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, getCode(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype));
//    }
}
export {Obj,Des,Ins}
