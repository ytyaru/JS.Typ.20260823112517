const ANO = 'Anonymous',
NTV = 'Native',
FN = 'Function',
MD = 'Method',
CLS = 'Class',
INS = 'Instance',
ARW = 'Arrow',
AS = 'Async',
SY = 'Sync',
GEN = 'Generator',
DES = 'Descriptor',
O = 'Object',
P = 'Primitive',
DGR = 'Danger',
PT = 'rototype';

const CINm = (i, k, C) => i + k + (C ? `<${C.name || '(' + ANO + ')'}>` : '');
const CNm = (n, C) => CINm(n, CLS, C);
const INm = (n, C) => CINm(n, INS, C);
const DNm = (k, i = '') => DES + `${k}${i}`;
const DDNm = (i) => DNm('.Data', i);
const DANm = (i) => DNm('.Access', i);

export const TYPE_MAP = {
    p_bln: 'Boolean',
    p_int: 'Integer',
    p_fin: 'Finite',
    p_big: 'BigInt',
    p_str: 'String',
    p_sym: 'Symbol',
    p:     P,

    o_obj: 'Plain' + O,
    o_ary: 'Array',
    o_fn_arrow_a: AS + ARW + FN,
    o_fn_arrow_s: SY + ARW + FN,
    o_fn_arrow:   ARW + FN,
    o_fn_bound:   'Bound' + FN,
    o_fn_native:  NTV + FN,
    o_fn_a:       AS + FN,
    o_fn_g:       GEN + FN,
    o_fn_ag:      AS + GEN + FN,
    o_fn_s:       SY + FN,
    o_fn_anonymous: ANO + FN,
    o_fn:         FN,
    
    o_cls_es6:    (v, C) => CNm('ES6.', C),
    o_cls_es5:    (v, C) => CNm('ES5.', C),
    o_cls_native: (v, C) => CNm(NTV, C),
    o_cls:        CLS,
    
    o_ins_es6:    (v, C) => INm('ES6.', C),
    o_ins_es5:    (v, C) => INm('ES5.', C),
    o_ins_native: (v, C) => INm(NTV, C),
    o_ins:        INS,
    
    o_des_d_v:    DDNm('.Value'),
    o_des_d_m:    DDNm('.Method'),
    o_des_d:      DDNm(),
    o_des_a_g:    DANm('.Get'),
    o_des_a_s:    DANm('.Set'),
    o_des_a_gs:   DANm('.GetSet'),
    o_des_a:      DANm(),
    o_des:        DES,
    
    o_md_a:       AS + MD,
    o_md_g:       GEN + MD,
    o_md_ag:      AS + GEN + MD,
    o_md_s:       SY + MD,
    o_md:         MD,
    o:            O,

    d_und:        'Undefined',
    d_nul:        'Null',
    d_num_nan:    'NaN',
    d_num_inf:    'Infinity',
    d_num_pinf:   'PositiveInfinity',
    d_num_ninf:   'NegativeInfinity',
    d_num_oint:   'OverInteger',
    d_num_ofin:   'OverFinite',
    d_num:        DGR + 'Number',
    d_obj_boxed:  'Boxed' + P,
    d_obj_noneProto: 'NoneP' + PT + O,
    d_obj_prototyped: 'P' + PT + 'd' + O,
    d_obj:        DGR + O,
    d:            DGR
};
