import {Ag} from './ag.js';
class Cls {
    static getFlag(is,v,s) { 
        const es6 = is && this.isEs6(v,s);
        const es5 = is && this.isEs5(v,s);
        const native = is && Fn.isNative(v,s) && this.isNative(v);
        return {is:es6 || es5 || native, es6, es5, native};
    }
    static isEs6(v,s) {
        if (!s) s = Function.prototype.toString.call(v); // Instance判定時に呼び出す時用に必要
        // Bunの最適化やコメントに対応した正規表現で class 構文か判定
        return /^\s*class\b/.test(s);
    }
    static isEs5(v,s) {
        if (!s) s = Function.prototype.toString.call(v);
        //if (this._isEs6Cls(v,s) || Fn.isNative(v,s) || Fn.isArrow(v,s)) return false;
        if (Cls.isEs6(v,s) || Fn.isNative(v,s) || Fn.isArrow(v,s)) return false;
        
        const proto = v.prototype;
        if (!proto || typeof proto !== 'object') return false;
//        if (!proto || !tis.obj(proto)) return false;
        
        const isCtorSelf = proto.constructor === v;
        if (!isCtorSelf) return false;

        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor');

        if (hasCustomProps || /\bthis\./.test(s)) return true;

        const name = v.name || '';
        return /^[A-Z]/.test(name);
    }
//    static _isNative(v,s) {return s.includes('[native code]');}
//    static #isNativeClass(v) {
    static isNative(v) {
        // 組込コンストラクタ（Map, Array, Dateなど）は prototype を持ち、それがオブジェクトである
        return v.prototype !== undefined && typeof v.prototype === 'object';
//        return v.prototype !== undefined && tis.obj(v.prototype);
    }
}
class Fn {// クラスと関数を分け、関数を更に細分化する
    static N = Object.freeze({
        a: 'Arrow',
        A: 'Anonymouse',
//        a: 'Async',
//        g: 'Generator',
//        s: 'Sync',
        b: 'Bound',
        c: 'Class',
        i: 'Instance',
        n: 'Native',
        f: 'Function',
        m: 'Method',
        es5: 'ES5',
        es6: 'ES6',
    });
    static getCode(v){
        return Function.prototype.toString.call(v)
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').trim() // コメント削除
            .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
            .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//'); // 正規表現リテラルを除外
    }
    static getFlag(v) {
        const is = 'function'===typeof v;
        const s = is ? this.getCode(v) : '';
        const cls = Cls.getFlag(is,v,s);
        //if (!is) return {is:false,cls:Cls.getFlag(is,v,s),...this.#getFnMd(is,cls,bound,native,arrow,es5,md,sy,ag)};
        //if (!is) return {is:false,cls:Cls.getFlag(is,v),...this.#getFnMd(Array(9).fill(false))};
        //if (!is) return {is:false,cls:Cls.getFlag(is,v),...this.#getFnMd(false,cls)};
//        if (!is) return {is,cls,...this.#getFnMd(false,cls,...Array(7).fill(false))};
//        if (!is) return {is,cls,...this.#getFnMd(false,cls,false,false,false,false,false,false,false)};
//        if (!is) return {is,cls,...this.#getFnMd(false,cls,...Array(6).fill(false))};
        if (!is) return {is,cls,...this.#getFnMd(v,false,cls,false,false,false,false,false,false)};
//        const s = this.getCode(v);
//        const cls = Cls.getFlag(is,v,s);
//        const r = {is,cls};
        const bound = !cls.is && v.name?.startsWith('bound ');
        const native = !cls.is && !bound && s.includes('[native code]');
        const arrow = !cls.is && !bound && !native && !v.hasOwnProperty('prototype') && s.includes('=>');
        const md = !cls.is && !bound && !native && !arrow && /\bfunction\b/.test(s) ? false : !s.includes('=>');
        const es5 = !cls.is && !native && !bound && !arrow && !md;
        const ag = Ag.getFlag(v);
        //const sy = (!ag.a && !ag.g);
//        const sy = ag.s;
//        return {is,cls,...this.#getFnMd(v,is,cls,bound,native,arrow,es5,md,sy,ag)};
        return {is,cls,...this.#getFnMd(v,is,cls,bound,native,arrow,es5,md,ag)};
        /*
        // isがfalseなら詳細も全てfalseのはずなので不要なのだが。
        r.fn = {
            is: is && !cls.is,
            bound,
            native,
            arrow: {
                is: arrow,
                a: arrow &&  ag.a,
                s: arrow && !ag.a,
            },
            es5: {
                is: es5,
                s: {
                    is: es5 && sy,
                    n: es5 && !!v.name && sy,
                    a: es5 && !!v.name && sy,
                },
                a: es5 && ag.a,
                g: es5 && ag.g,
                ag: es5 && ag.a && ag.g,
            },
        }
        r.md = {
            is: md,
            s: md && sy,
            a: md && ag.a,
            g: md && ag.g,
            ag: md && ag.a && ag.g,
        }
        return r;
        */
    }
    static #getFnMd(v,is,cls,bound,native,arrow,es5,md,ag) { return {
        fn: this.#getFn(v,is,cls,bound,native,arrow,es5,ag),
        md: this.#getMd(md,ag),
    } }
//    static #getFn(v,is,cls,bound,native,arrow,es5,ag) { console.log(is, cls.is, cls); return {
    static #getFn(v,is,cls,bound,native,arrow,es5,ag) { return {
        is: is && !cls.is,
//        is: true===is && false===cls.is,
        bound,
        native,
        arrow: {
            is: arrow,
            a: arrow &&  ag.a,
            s: arrow && !ag.a,
        },
        es5: {
            is: es5,
            s: {
                is: es5 && ag.s,
                n: es5 && !!v.name && ag.s,
                a: es5 &&  !v.name && ag.s,
            },
            a: es5 && ag.a,
            g: es5 && ag.g,
            ag: es5 && ag.a && ag.g,
        },
    } }
    static #getMd(md,ag) { return {
        is: md,
        s: md && ag.s,
        a: md && ag.a,
        g: md && ag.g,
        ag: md && ag.ag,
    } }

//    static #getFn(is,cls,bound,native,arrow,es5,sy,ag) { console.log(is,cls,bound,native,arrow,es5,sy,ag);return {
    /*
    static #getFnMd(v,is,cls,bound,native,arrow,es5,md,sy,ag) { return {
        fn: this.#getFn(v,is,cls,bound,native,arrow,es5,sy,ag),
        md: this.#getMd(md,sy,ag),
    } }
    static #getFn(v,is,cls,bound,native,arrow,es5,sy,ag) { return {
        is: is && !cls.is,
        bound,
        native,
        arrow: {
            is: arrow,
            a: arrow &&  ag.a,
            s: arrow && !ag.a,
        },
        es5: {
            is: es5,
            s: {
                is: es5 && sy,
                n: es5 && !!v.name && sy,
                a: es5 && !!v.name && sy,
            },
            a: es5 && ag.a,
            g: es5 && ag.g,
            ag: es5 && ag.a && ag.g,
        },
    } }
    static #getMd(md,sy,ag) { return {
        is: md,
        s: md && sy,
        a: md && ag.a,
        g: md && ag.g,
        ag: md && ag.a && ag.g,
    } }
    static #get(is,cls,bound,native,arrow,es5,md) { return {

    } }
    */
    static isNative(v,s) {return s.includes('[native code]');}
    static isArrow(v,s) {
        // アロー関数は prototype プロパティを持たない特徴を利用
        // ※ただし一部のBuiltinやメソッドと競合しないよう補助的に判定
        return !v.hasOwnProperty('prototype') && s.includes('=>');
    }
}
export {Cls,Fn}
/*
N = Object.freeze({
    mod: {
        es6: 'ES6',
        es5: 'ES5',
        native: 'Native',
    }
    cls: {
        c: 'Class',
        i: 'Instance',
    },
    fn: {
        b: 'Bound',
        n: 'Native',
        a: 'Arrow',
    },
});
{
    cls: {
        is: 
        es6: ,
        es5: ,
        native: ,
    },
    fn:  {
        is: 
        bound: 
        native: 
        arrow: {
            is: ,
            a: ,
            s: ,
        },
        es5: {
            is: ,
            s: {
                is: 
                n: 
                a: 
            },
            a: ,
            g: ,
            ag: ,
        },
    },
    md:  {
        is: 
        s: ,
        a: ,
        g: ,
        ag: ,
    },
}

*/
