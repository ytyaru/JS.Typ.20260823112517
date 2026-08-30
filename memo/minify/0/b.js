export class Is {
    static is(v) {
        const c = [v<0, 0<v, 0===v];
        const i = c.findIndex(x=>x);
        return i<0 ? 'anothor' : c[i];
    }
}

