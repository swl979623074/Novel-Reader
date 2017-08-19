let obj = {'swl':{'tel':'12345678'}}

let sel = obj['ll'] || {};

if(Object.is(obj['ll'],undefined)){
	obj['ll'] = sel
}

sel['tel'] = '951236';

console.log(obj)

{"selected":"кОндаЗ.txt","123.txt":{"showLength":246,"position":301348}}