export class Tys { // Type string name
    static name(v) {
        if (null === v) return 'Null';
        if (undefined === v) return 'Undefined';
        if (Array.isArray(v)) return 'Array';
        const to = typeof v;
        if ('function' === to) return FnTys.name(v);
        const name = this._name(v);
        return 'object' === to ? this._obj(v, name) : 'Number' === name ? this._num(v, name) : name;
    }
    static _name(v) { return Object.prototype.toString.call(v).slice(8, -1); }
    static _num(v, name) {
        return Number.isNaN(v) ? 'NaN' : Infinity === v ? 'Infinity' : -Infinity === v ? '-Infinity' : Number.isSafeInteger(v) ? 'Integer' : Number.isFinite(v) ? 'Finite' : name;
    }
    static _obj(v, name) {
        const proto = Object.getPrototypeOf(v);
        if (null === proto) return 'NonePrototypeObject';
        if ([Boolean, Number, String].some(C => v instanceof C)) { return `BoxedPrimitive<${v.constructor.name}>`; }
        const des = DesTys.name(v);
        if (des) return des;
        const isPlain = Object.prototype === proto;
        if (isPlain) return 'PlainObject';
        const ctor = proto.constructor;
        const isEs6Ins = this._isEs6Ins(proto, ctor);
        const isEs5Ins = this._isEs5Ins(v, proto, ctor);
        if (!isPlain && 'Object' !== name && !isEs6Ins && !isEs5Ins) return `NativeInstance<${name}>`;
        if (isEs6Ins || isEs5Ins) return `ES${isEs5Ins ? '5' : '6'}.Instance<${ctor.name || '(Anonymous)'}>`;
        return 'PrototypedObject';
    }
    static _isEs6Ins(proto, ctor) {
        if (typeof ctor !== 'function') return false;
        return FnTys._isEs6Cls(ctor);
    }
    static _isEs5Ins(v, proto, ctor) {
        return typeof ctor !== 'function' || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : (FnTys._isEs5Cls(ctor) || (proto !== Object.prototype && proto !== Function.prototype));
    }
}
class DesTys {
    static is(v) {
        const keys = Object.getOwnPropertyNames(v);
        if (keys.length === 0) return false;
        const allowedKeys = ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'];
        if (!keys.every(key => allowedKeys.includes(key))) return false;
        const hasValue = keys.includes('value');
        const hasWritable = keys.includes('writable');
        const hasGet = keys.includes('get') && v.get !== undefined;
        const hasSet = keys.includes('set') && v.set !== undefined;
        return (
            ((hasValue || hasWritable) && (hasGet || hasSet))
        || (hasGet && typeof v.get !== 'function' && v.get !== undefined)
        || (hasSet && typeof v.set !== 'function' && v.set !== undefined)
        || (!hasValue && !hasWritable && !hasGet && !hasSet)
        ) ? false : this._naming(v, hasValue, hasGet, hasSet);
    }
    static _naming(v, hasValue, hasGet, hasSet) {
        return (hasGet || hasSet) ? this._acc(hasGet, hasSet) : this._dat(v, hasValue);
    }
    static _acc(hasGet, hasSet) { return 'Access.' + ((hasGet && hasSet) ? 'GetSet' : (hasGet ? 'Get' : 'Set')); }
    static _dat(v, hasValue) { return 'Data.' + ((hasValue && typeof v.value === 'function') ? 'Method' : 'Value'); }
    static name(v) {
        const type = this.is(v);
        return type ? `Descriptor.${type}` : '';
    }
}
class FnTys {
    static name(v) {
        const s = this._removeComments(Function.prototype.toString.call(v)).trim();
        const [isEs6, isEs5] = [this._isEs6Cls(v, s), this._isEs5Cls(v, s)];
        if (isEs6 || isEs5) return `ES${isEs5 ? '5' : '6'}.Class<${v.name || '(Anonymous)'}>`;
        if (this._isBound(v, s)) return `BoundFunction<${v.name.replace(/bound /, '')}>`;
        if (this._isNative(v, s)) return `Native${(this._isNativeClass(v) ? 'Class' : 'Function')}<${v.name}>`;
        if (this._isArrow(v, s)) return `${FnAgTys.name(v, s)}ArrowFunction`;
        if (this._isMethod(v, s)) return `${FnAgTys.name(v, s)}Method`;
        const ag = FnAgTys.name(v, s);
        return `${(!ag && !v.name ? 'Anonymous' : ag)}Function`;
    }
    static _removeComments(s) { return s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''); }
    static _isEs6Cls(v, s) {
        if (!s) s = Function.prototype.toString.call(v);
        return /^\s*class\b/.test(s);
    }
    static _isEs5Cls(v, s) {
        if (!s) s = Function.prototype.toString.call(v);
        if (this._isEs6Cls(v, s) || this._isNative(v, s) || this._isArrow(v, s)) return false;
        const proto = v.prototype;
        if (!proto || typeof proto !== 'object') return false;
        const isCtorSelf = proto.constructor === v;
        if (!isCtorSelf) return false;
        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || (keys.length === 1 && keys[0] !== 'constructor');
        const cleanS = s.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, '');
        if (hasCustomProps || /\bthis\./.test(cleanS)) return true;
        const name = v.name || '';
        return /^[A-Z]/.test(name);
    }
    static _isNative(v, s) { return s.includes('[native code]'); }
    static _isNativeClass(v) { return v.prototype !== undefined && typeof v.prototype === 'object'; }
    static _isBound(v, s) { return v.name.startsWith('bound '); }
    static _isArrow(v, s) { return !v.hasOwnProperty('prototype') && s.includes('=>'); }
    static _isMethod(v, s) { return /\bfunction\b/.test(s) ? false : !s.includes('=>'); }
}
class FnAgTys {
    static name(v, s) {
        const cName = v.constructor?.name;
        if (cName === 'AsyncGeneratorFunction') return 'AsyncGenerator';
        if (cName === 'GeneratorFunction') return 'Generator';
        if (cName === 'AsyncFunction') return 'Async';
        const isAsync = /^\s*(?:static\s+)?async\b/.test(s);
        const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);
        return isAsync && isGenerator ? 'AsyncGenerator' : isGenerator ? 'Generator' : isAsync ? 'Async' : '';
    }
}
