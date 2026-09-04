const safeNum = v => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v,
getTag = v => Object.prototype.toString.call(v).slice(8, -1),
CORE = {
  Null: {name:'Null', path:'d.nul', is: v=>null===v},
  Undefined: {name:'Undefined', path:'d.und', is: v=>undefined===v},
  Boolean: {name:'Boolean', path:'p.bln', is: v=>'boolean'===typeof v},
  Finite: {name:'Finite', path:'p.fin', is: v=>Number.isFinite(v) && safeNum(v)},
  Integer: {name:'Integer', path:'p.int', is: v=>Number.isSafeInteger(v)},
  BigInt: {name:'BigInt', path:'p.big', is: v=>'bigint'===typeof v},
  String: {name:'String', path:'p.str', is: v=>'string'===typeof v},
  Symbol: {name:'Symbol', path:'p.sym', is: v=>'symbol'===typeof v},
  NaN: {name:'NaN', path:'d.num.nan', is: v=>Number.isNaN(v)},
  Infinity: {name:'Infinity', path:'d.num.inf', is: v=>[Infinity, -Infinity].some(x => x === v)},
  PositiveInfinity: {name:'PositiveInfinity', path:'d.num.pinf', is: v=>Infinity === v},
  NegativeInfinity: {name:'NegativeInfinity', path:'d.num.ninf', is: v=>-Infinity === v},
  OverInteger: {name:'OverInteger', path:'d.num.oint', is: v=>Number.isInteger(v) && !safeNum(v)},
  OverFinite: {name:'OverFinite', path:'d.num.ofin', is: v=>Number.isFinite(v) && !safeNum(v)},
  Array: {name:'Array', path:'o.ary', is: v=>Array.isArray(v)},
  Callable: {name:'Callable', is: v=>'function'===typeof v},
  Object: {name:'Object', is: v=>null!==v && 'object'===typeof v},
}, 
OBJ = {
  HasNotPrototypeObject: {name:'HasNotPrototypeObject', path:'d.obj.hasNotProto', is: (v,proto)=>null===proto},
  BoxedPrimitive: {name:'BoxedPrimitive', path:'d.obj.boxed', is: v=>[Boolean,Number,String].some(C=>v instanceof C)},
  PlainObject: {name:'PlainObject', path:'o.obj', is: (v,proto)=>Object.prototype===proto},
  Descriptor: {name:'Descriptor', path:'o.des', is: desNm=>desNm},
  ES6Instance: {name:'ES6Instance', path:'o.ins.es6', is: (v,proto,ctor)=>ObjTys._isEs6Ins(proto, ctor)},
  ES5Instance: {name:'ES5Instance', path:'o.ins.es5', is: (v,proto,ctor)=>ObjTys._isEs5Ins(v, proto, ctor)},
  NativeInstance: {name:'NativeInstance', path:'o.ins.native', is: (v,tag)=>(!isPlain && 'Object'!==tag && !isInsEs6 && !isInsEs5)},
  PrototypedObject: {name:'PrototypedObject', path:'d.obj.prototyped', is: null},
},
CLS = {
  ES6: {name:'ES6', path:'o.cls.es6', is: (v,s)=>FnTys._isEs6Cls(v,s)},
  ES5: {name:'ES5', path:'o.cls.es5', is: (v,s)=>FnTys._isEs5Cls(v,s)},
  Native: {name:'Native', path:'o.cls.native', is: (v,s)=>FnTys._isNative(v,s) && FnTys._isNativeClass(v)},
},
/*
MD = {
  Async: (v,s)=>
  Generator: (v,s)=>
  AsyncGenerator: (v,s)=>
  Sync: (v,s)=>
}
*/
FN = {
  Bound: {name:'Bound', path:'o.fn.bound', is: (v,s)=>FnTys._isBound(v,s)},
  Native: {name:'Native', path:'o.fn.native', is: (v,s)=>FnTys._isNative(v,s)},
  Arrow: {name:'Arrow', path:'o.fn.arrow', is: (v,s)=>FnTys._isArrow(v,s)},
  Method: {name:'Method', path:'o.md', is: (v,s)=>FnTys._isMethod(v,s)},
  Anonymouse: {name:'Anonymouse', path:'o.fn.anonymouse', is: (v,ag)=>!ag && !v.name},
  /*
  Other: (v,s)=>{
    const ag = FnAgTys.name(v,s);
    return !ag && !v.name ? 'AnonymousFunction' : `${ag}Function`;
  },
  */
}; 
export {safeNum,getTag,CORE,OBJ,CLS,FN};
