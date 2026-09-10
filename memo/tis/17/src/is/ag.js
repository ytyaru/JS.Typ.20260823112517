export class Ag {
    static N = Object.freeze({
        a: 'Async',
        g: 'Generator',
        s: 'Sync',
        f: 'Function',
        m: 'Method',
    });

    static getName(f, isSyncOff) {
        return f.ag ? Ag.N.a + Ag.N.g 
             : f.s ? (isSyncOff ? '' : Ag.N.s) 
             : f.a ? Ag.N.a : Ag.N.g;
             //: 'a g'.split(' ').map(n => [Ag.N[n], f[n]]).find(v => v[1])[0];
    }
    
    static getFlag(v, s) {
        const n = v.constructor?.name;
        return Ag.N.a + Ag.N.g + Ag.N.f === n ? this.#flg(true, true)
            : Ag.N.g + Ag.N.f === n ? this.#flg(false, true)
            : Ag.N.a + Ag.N.f === n ? this.#flg(true, false)
            : this.#isAgC(s);
    }

    static #isAgC(s) {
        const a = /^\s*(?:static\s+)?async\b/.test(s);
        const g = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);
        return this.#flg(a,g);
    }
    static #flg(a,g) { return {a, g, s:!a && !g, ag:a && g} }
}
