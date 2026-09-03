const safeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v
getTag = v => Object.prototype.toString.call(v).slice(8, -1),
CORE = {
  Null: {name:'Null', is: v=>null===v},
  Undefined: {name:'Undefined', is: v=>undefined===v},
  Boolean: {name:'Boolean', is: v=>'boolean'===typeof v,
  Finite: {name:'Finite', is: v=>Number.isFinite(v) && safeNum(v),
  Integer: {name:'Integer', is: v=>Number.isSafeInteger(v),
  BigInt: {name:'BigInt', is: v=>'bigint'===typeof v,
  String: {name:'String', is: v=>'string'===typeof v,
  Symbol: {name:'Symbol', is: v=>'symbol'===typeof v,
  NaN: {name:'NaN', is: v=>Number.isNaN(v),
  Infinity: {name:'Infinity', is: v=>[Infinity, -Infinity].some(x => x === v)},
  PositiveInfinity: {name:'PositiveInfinity', is: v=>Infinity === v},
  NegativeInfinity: {name:'NegativeInfinity', is: v=>-Infinity === v},
  OverInteger: {name:'OverInteger', is: v=>Number.isInteger(v) && !safeNum(v)},
  OverFinite: {name:'OverFinite', is: v=>Number.isFinite(v) && !safeNum(v)},
  Array: {name:'Array', is: v=>Array.isArray(v)},
  Callable: {name:'Callable', is: v=>'function'===typeof v},
  Object: {name:'Object', is: v=>null!==v && 'object'===typeof v},
}, 
OBJ = {
  HasNotPrototypeObject: {name:'HasNotPrototypeObject', is: (v,proto)=>null===proto},
  BoxedPrimitive: {name:'BoxedPrimitive', is: v=>[Boolean,Number,String].some(C=>v instanceof C)},
  PlainObject: {name:'PlainObject', is: (v,proto)=>Object.prototype===proto},
  Descriptor: {name:'Descriptor', is: desNm=>desNm},
  ES6Instance: {name:'ES6Instance', is: (v,proto,ctor)=>ObjTys._isEs6Ins(proto, ctor)},
  ES5Instance: {name:'ES5Instance', is: (v,proto,ctor)=>ObjTys._isEs5Ins(v, proto, ctor)},
  NativeInstance: {name:'NativeInstance', is: (v,tag)=>(!isPlain && 'Object'!==tag && !isInsEs6 && !isInsEs5)},
  PrototypedObject: {name:'PrototypedObject', },
};
CLS = {
  ES6: {name:'ES6', is: (v,s)=>FnTys._isEs6Cls(v,s)},
  ES5: {name:'ES5', is: (v,s)=>FnTys._isEs5Cls(v,s)},
  Native: {name:'Native', is: (v,s)=>FnTys._isNative(v,s) && FnTys._isNativeClass(v)},
}
FN = {
  Bound: {name:'Bound', is: (v,s)=>FnTys._isBound(v,s)},
  Native: {name:'Native', is: (v,s)=>FnTys._isNative(v,s)},
  Arrow: {name:'Arrow', is: (v,s)=>FnTys._isArrow(v,s)},
  Method: {name:'Method', is: (v,s)=>FnTys._isMethod(v,s)},
  /*
  Other: (v,s)=>{
    const ag = FnAgTys.name(v,s);
    return !ag && !v.name ? 'AnonymousFunction' : `${ag}Function`;
  },
  */
}, 
export {safeNum,getTag,CORE,OBJ,CLS,FN};
