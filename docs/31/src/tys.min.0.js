export class Tys {// Type string name
    static name(v) {
        if (null===v)return'Null';
        if (undefined===v)return'Undefined';
        if (Array.isArray(v))return'Array';
        const to=typeof v,name=this._name(v);
        return'function'===to?FnTys.name(v):'object'===to?this._obj(v,name):'Number'===name?this._num(v,name):name;
    }
    static _name(v){return Object.prototype.toString.call(v).slice(8,-1)}
    static _num(v,name){
        return Number.isNaN(v)?'NaN':Infinity===v?'Infinity':-Infinity===v?'-Infinity':Number.isSafeInteger(v)?'Integer':Number.isFinite(v)?'Finite':name;
    }
    static _obj(v,name){
        const proto=Object.getPrototypeOf(v);
        if(null===proto)return'HasNotPrototypeObject';
        if([Boolean,Number,String].some(C=>v instanceof C))return`BoxedPrimitive<${v.constructor.name}>`;
        const des=DesTys.name(v);
        if(des)return des;
        const isPlain=Object.prototype===proto,ctor=proto.constructor;
        const isEs6Ins=this._isEs6Ins(proto,ctor),isEs5Ins=this._isEs5Ins(v,proto,ctor);
        return !isPlain&&'Object'!==name&&!isEs6Ins&&!isEs5Ins
            ?`NativeInstance<${name}>`
            :isEs6Ins||isEs5Ins
            ?`${isEs5Ins?'ES5.':''}Instance<${ctor.name||'(Anonymous)'}>`
            :'PrototypedObject';
    }
    static _isEs6Ins(proto,ctor){return typeof ctor==='function'&&FnTys._isEs6Cls(ctor)}
    static _isEs5Ins(v,proto,ctor){
        return typeof ctor==='function'&&ctor!==Object&&ctor!==Function&&!FnTys._isEs6Cls(ctor)&&!FnTys._isNative(ctor,Function.prototype.toString.call(ctor))&&(FnTys._isEs5Cls(ctor)||proto!==Object.prototype&&proto!==Function.prototype);
    }
}
class DesTys {
    static is(v){
        const keys=Object.getOwnPropertyNames(v);
        if(!keys.length||!keys.every(k=>['value','writable','get','set','configurable','enumerable'].includes(k)))return false;
        const hasValue=keys.includes('value'),hasWritable=keys.includes('writable'),hasGet=keys.includes('get')&&v.get!==undefined,hasSet=keys.includes('set')&&v.set!==undefined;
        return (hasValue||hasWritable)&&(hasGet||hasSet)
            ||hasGet&&typeof v.get!=='function'
            ||hasSet&&typeof v.set!=='function'
            ||!(hasValue||hasWritable||hasGet||hasSet)
            ?false:this._naming(v,hasValue,hasGet,hasSet);
    }
    static _naming(v,hasValue,hasGet,hasSet){
        return hasGet||hasSet
            ?hasGet&&hasSet?'Accessor':hasGet?'Getter':'Setter'
            :hasValue&&typeof v.value==='function'?'Method':'Value';
    }
    static name(v){
        const type=this.is(v);
        return type?`Descriptor<${type}>`:'';
    }
}
class FnTys {// クラスと関数を分け、関数を更に細分化する
    static name(v){
        const s=Function.prototype.toString.call(v),e=this._isEs6Cls(v,s),i=this._isEs5Cls(v,s);
        if(e||i)return`${i?'ES5.':''}Class<${v.name||'(Anonymous)'}>`;
        if(this._isBound(v,s))return`BoundFunction<${v.name.replace(/bound /,'')}>`;
        if(this._isNative(v,s))return`Native${this._isNativeClass(v)?'Class':'Function'}<${v.name}>`;
        if(this._isArrow(v,s))return`${FnAgTys.name(v,s)}ArrowFunction`;
        if(this._isMethod(v,s))return`${FnAgTys.name(v,s)}Method`;
        const ag=FnAgTys.name(v,s);
        return!ag&&!v.name?'AnonymousFunction':`${ag}Function`;
    }
    static _isEs6Cls(v,s){
        s||=(s=Function.prototype.toString.call(v));
        return/^\s*(?:\/\*[\s\S]*?\*\/\s*)*class\b/.test(s);
    }
    static _isEs5Cls(v,s){
        s||=(s=Function.prototype.toString.call(v));
        if(this._isEs6Cls(v,s)||this._isNative(v,s)||this._isArrow(v,s))return false;
        const proto=v.prototype;
        if(!proto||typeof proto!=='object')return false;
        const isCtorSelf=proto.constructor===v;
        if(!isCtorSelf)return false;
        const keys=Object.getOwnPropertyNames(proto),hasCustomProps=keys.length>1||keys.length===1&&keys[0]!=='constructor';
        const cleanS=s
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm,'')
            .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,'""')
            .replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g,'//');
        return hasCustomProps||/\bthis\./.test(cleanS)||/^[A-Z]/.test(v.name||'');
    }
    static _isNative(v,s){return s.includes('[native code]')}
    static _isNativeClass(v){return v.prototype!==undefined&&typeof v.prototype==='object'}
    static _isBound(v,s){return v.name.startsWith('bound ')}
    static _isArrow(v,s){return!v.hasOwnProperty('prototype')&&s.includes('=>')}
    static _isMethod(v,s){
        const cleanSrc=s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm,'');
        return!/\bfunction\b/.test(cleanSrc)&&!s.includes('=>');
    }
}
class FnAgTys {
    static name(v,s){
        if(typeof v!=='function')return'';
        const cName=v.constructor?.name;
        if(cName==='AsyncGeneratorFunction')return'AsyncGenerator';
        if(cName==='GeneratorFunction')return'Generator';
        if(cName==='AsyncFunction')return'Async';
        s||=(s=Function.prototype.toString.call(v));
        const cleanStr=s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm,'').trim(),a=cleanStr.startsWith('async')||cleanStr.includes('async '),g=s.includes('*');
        return a&&g?'AsyncGenerator':g?'Generator':a?'Async':'';
    }
}
