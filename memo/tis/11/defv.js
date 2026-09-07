export const defV = node => {
    let curr = node;
    while (curr) {
        if (curr._ && 'default' in curr._) {
            return curr._.default;
        }
        curr = curr._.parent;
    }
    return undefined;
};
