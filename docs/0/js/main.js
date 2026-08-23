window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const author = 'ytyaru';
    van.add(document.querySelector('main'), 
        van.tags.h1(van.tags.a({href:`https://github.com/${author}/JS.Typ.20260823112517/`}, 'Typ')),
        van.tags.p('JavaScriptの簡単な型チェックAPI。'),
//        van.tags.p(''),
    );
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make());

    const a = new Assertion();
    a.t(true);
    a.f(false);
    a.e(TypeError, `msg`, ()=>{throw new TypeError(`msg`)});
    a.fin();
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

