import {safeNum,getTag,CORE,OBJ,CLS,FN} from './core.js';
import {FnTys} from './fn-tys.js';
const nNm = v=>Number.isNaN(v) ? 'NaN' : Infinity===v ? 'Infinity' : -Infinity===v ? '-Infinity' : Number.isSafeInteger(v) ? 'Integer' : Number.isFinite(v) ? 'Finite' : false,
getBoxedName = (v) =>[Boolean, Number, String].some(C => v instanceof C) ? `BoxedPrimitive<${v.constructor.name}>` : null,
isInsEs6 = (proto, ctor)=>(typeof ctor !== 'function') ? false : FnTys._isEs6Cls(ctor),
//isInsEs5 = (proto, ctor)=>typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype)),
isInsEs5 = (proto, ctor)=>typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor)) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype)),
getInstanceName = (v, proto, ctor, tag) => {
    const isEs6 = isInsEs6(proto, ctor);
    const isEs5 = isInsEs5(proto, ctor);
    return (isEs6 || isEs5) ? `${isEs5 ? 'ES5.' : ''}Instance<${ctor.name || '(Anonymous)'}>` : 
        ('Object' !== tag) ? `NativeInstance<${tag}>` : null;
},
getHasObjNm = (v, tag, proto, boxed, des, inst) => boxed ? boxed :
    des ? des :
    (proto === Object.prototype) ? 'PlainObject' :
    inst ? inst : 'PrototypedObject',
oNm = (v, tag, proto) => proto === null ? 'HasNotPrototypeObject'
    : getHasObjNm(v, tag, proto, getBoxedName(v), DesTys.name(v), getInstanceName(v, proto, proto.constructor, tag)),
onNm = (v,to,tag)=>'object' === to ? oNm(v, tag, Object.getPrototypeOf(v))
    : 'Number' === tag ? nNm(v, tag) : tag,
foNm = (v,to,tag)=> 'function' === to ? FnTys.name(v)
    : onNm(v,to,getTag(v)),
tof = v => null === v ? 'Null' 
    : undefined === v ? 'Undefined' 
    : Array.isArray(v) ? 'Array' 
    : foNm(v, typeof v);
class DesTys {
    static is(v) {
//        if (v === null || typeof v !== 'object') return false;

        const keys = Object.getOwnPropertyNames(v);
        if (keys.length === 0) return false;

        // 許可される全キー
        const allowedKeys = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'];
        if (!keys.every(key => allowedKeys.includes(key))) return false;

        // 存在チェック。getter/setterは片方だけ作成されると、作成されなかったほうが勝手に作成され値がundefinedになる仕様に対応した。但しvalueはundefinedという値が代入されうるため存在確認として使わない。
        const hasValue = keys.includes('value');
        const hasWritable = keys.includes('writable');
        const hasGet = keys.includes('get') && v.get !== undefined;
        const hasSet = keys.includes('set') && v.set !== undefined;

        return (
        // データ記述子とアクセサ記述子の混在不可ルール
            ((hasValue || hasWritable) && (hasGet || hasSet))
        // 型チェック
        || (hasGet && typeof v.get !== 'function' && v.get !== undefined)
        || (hasSet && typeof v.set !== 'function' && v.set !== undefined)
        // いずれのキーも無ければディスクリプタではない
        || (!hasValue && !hasWritable && !hasGet && !hasSet)
        ) ? false : this._naming(v, hasValue, hasGet, hasSet);
        /*
        // データ記述子とアクセサ記述子の混在不可ルール
        if ((hasValue || hasWritable) && (hasGet || hasSet)) return false;

        // 型チェック
        if (hasGet && typeof v.get !== 'function' && v.get !== undefined) return false;
        if (hasSet && typeof v.set !== 'function' && v.set !== undefined) return false;

        // いずれのキーも無ければディスクリプタではない
        if (!hasValue && !hasWritable && !hasGet && !hasSet) return false;

        return this._naming(v, hasValue, hasGet, hasSet);
        */
    }
    static _naming(v, hasValue, hasGet, hasSet) {
        // 1. アクセサ系 (get または set がある場合)
//        if (hasGet || hasSet) {return (hasGet && hasSet) ? 'Accessor' : (hasGet ? 'Getter' : 'Setter');}
        // 2. データ系 (value または writable がある場合)
//        return (hasValue && typeof v.value === 'function') ? 'Method' : 'Value';
        return (hasGet || hasSet) ? ((hasGet && hasSet) ? 'Accessor' : (hasGet ? 'Getter' : 'Setter')) : ((hasValue && typeof v.value === 'function') ? 'Method' : 'Value');
    }
    static name(v) {
        const type = this.is(v);
        return type ? `Descriptor<${type}>` : '';
    }
}
export {tof};

