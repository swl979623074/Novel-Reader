const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname);

let isNotNumber = (str) => {
	let len = str.length;
	let flag = false;
	[...str].forEach((val,index,arr) => {
		let unicode = arr.join('').charCodeAt(index);
		if(!(unicode >= 48 && unicode <= 57)){	//判断数字
			flag = true;
		}
	})
	return flag;
}

let showAppOperateInstructions = () => {
	console.log(`操作说明：\n\tu\t上一页\n\td(or enter)\t下一页\n\tq\t结束`);
}

let promiseIter = function (promises) {
    return new Promise((resolve, reject) => {
        nextPromise(0, promises);
        function nextPromise(index, promises) {
            let length = promises.length;
            if (index >= length) {
                resolve();
            }
            promises[index]()
                .then(() => {
                    nextPromise(index + 1, promises);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    });
}

let setHistory = (history) => {
	let savePath = path.join(basePath,'..','config','history.json');
	fs.writeFile(savePath,JSON.stringify(history),(err)=>{
		if(err){
			throw err;
		}
	})
}

exports.isNotNumber = isNotNumber;
exports.showAppOperateInstructions = showAppOperateInstructions;
exports.promiseIter = promiseIter;
exports.setHistory = setHistory;