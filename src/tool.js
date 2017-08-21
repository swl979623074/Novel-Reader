const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname);

class Tool{
	static isNotNumber(str){
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
	
	static promiseIter(promises){
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
	
	static setHistory(history){
		let savePath = path.join(basePath,'..','config','history.json');
		fs.writeFile(savePath,JSON.stringify(history),(err)=>{
			if(err){
				throw err;
			}
		})
	}
	
	static clear () {
		 process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
	}
}

module.exports = Tool;