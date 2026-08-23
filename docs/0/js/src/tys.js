class Tys {// Type string name
    name(v) {
        if (null===v) return 'Null';
        if (undefined===v) return 'Undefined';
        if ('function'===typeof v) return this._fun(v);
        const name = this._name(v);
        if ('Number'===name) return this._num(v, name);
        if ('Object'===name) return this._obj(v, name);
        return name;
    }
    _name(v) {return Object.prototype.toString.call(value).slice(8, -1);}
    _num(v, name) {// "number"でなく以下のようにする。
        if (Number.isNaN(v)) return 'NaN';
        if (Infinity===v) return 'Infinity';
        if (-Infinity===v) return '-Infinity';
        if (Number.isSafeNumber(v)) return 'Integer';
        if (Number.isFinite(v)) return 'Finite';
        return name;
    }
    _fun(v) {return this._isEsCls(v) ? `Class<${v.constructor.name}>` : `Function`;}// 関数またはクラス(コンストラクタ)
    _isEsCls(v) {return Function.prototype.toString.call(v).startsWith('class\b')}
    _obj(v, name) {
        const proto = Object.getPrototypeOf(v);
        if (null===proto) return `HasNotPrototypeObject`;
        if ([Boolean,Number,String].some(C=>v instanceof C)) {return `BoxedPrimitive<${v.constructor.name}>`}
        if (this._isDes(v)) return 'Descriptor';
        if (Object.prototype===proto) return `PlainObject`;
        if (this._isIns(v,proto)) return `Instance<${proto.constructor.name}>`;
        // Object.create()で拡張されたりnew Function()で生成されたES5以前の擬似クラスインスタンスなど上記以外全て。
        return name;
    }
    _isDes(v) {// Descriptor
        const keys = Object.keys(v);
        const isDescriptor = keys.length > 0 && keys.every(key => 
            ['value', 'writable', 'get', 'set', 'configurable', 'enumerable'].includes(key)
        ) && (keys.includes('value') || keys.includes('writable') || keys.includes('get') || keys.includes('set'));
    }
    _isIns(v,proto) {// Instance
        const ctor = proto.constructor;
        return 'function'===typeof ctor && this._isEsCls(ctor);
    }
}
