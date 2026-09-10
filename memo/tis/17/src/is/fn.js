import {Ag} from './ag.js';
class Cls {
    static getFlag(v,s) { 
        const es6 = this.isEs6(v,s);
        const es5 = this.isEs5(v,s);
        const native = Fn._isNative(v,s) && this.isNative(v);
        return {is:es6 || es5 || native, es6, es5, native};
    } }
    static isEs6(v,s) {
        if (!s) s = Function.prototype.toString.call(v); // Instance判定時に呼び出す時用に必要
        // Bunの最適化やコメントに対応した正規表現で class 構文か判定
        return /^\s*class\b/.test(s);
    }
    static isEs5(v,s) {
        if (!s) s = Function.prototype.toString.call(v);
        if (this._isEs6Cls(v,s) || Fn._isNative(v,s) || Fn._isArrow(v,s)) return false;
        
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
    static getCode(v){
        return Function.prototype.toString.call(v)
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '').trim() // コメント削除
            .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""') // 文字列リテラル（'' , "" , ``）を空文字に置換
            .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '//'); // 正規表現リテラルを除外
    }
    static getFlag(v) {
        const is = 'function'===typeof v;
        if (!is) return {is:false};
        const s = this.getCode(v);
        const r = {cls:Cls.getFlag(v,s)};
        const bound = !cls.is && v.name?.startsWith('bound ');
        const native = !cls.is && !bound && s.includes('[native code]');
        const arrow = !cls.is && !bound && !native && !v.hasOwnProperty('prototype') && s.includes('=>');
        const method = !cls.is && !bound && !native && !arrow && /\bfunction\b/.test(s) ? false : !s.includes('=>');
        const fn = !cls.is && !native && !bound && !method;
        const sy = (!ag.a && !ag.g);
        const ag = Ag.getFlag(v);
        // isがfalseなら詳細も全てfalseのはずなので不要なのだが。
        r.fn = {
            is,
            bound,
            native,
            arrow: {
                is: arrow,
                a: arrow &&  ag.a,
                s: arrow && !ag.a,
            },
            es5: {
                is: fn,
                s: {
                    is: fn && sy,
                    n: fn && !!v.name && sy,
                    a: fn && !!v.name && sy,
                },
                a: fn && ag.a,
                g: fn && ag.g,
                ag: fn && ag.a && ag.g,
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
    }
    static _isNative(v,s) {return s.includes('[native code]');}
    static _isArrow(v,s) {
        // アロー関数は prototype プロパティを持たない特徴を利用
        // ※ただし一部のBuiltinやメソッドと競合しないよう補助的に判定
        return !v.hasOwnProperty('prototype') && s.includes('=>');
    }
}
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
