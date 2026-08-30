export class Is {
    static is(v) {
        if (v<0) return 'negative';
        if (0<v) return 'positive';
        if (0===v) return 'zero';
        return 'anothor';
    }
}

