import {safeNum,getTag,CORE,OBJ,CLS,FN} from './core.js';
import {FnTys} from './fn-tys.js';
import {DesTys} from './des-tys.js';
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
export {tof};

