const path = require('path');
const fs = require('fs');
const readline = require('readline');

const basePath = path.join(__dirname);
const bookBasePath = path.join(basePath,'book');

const history = require(path.join(basePath,'config','history.json'))
const tool = require(path.join(basePath,'src','tool.js'));
const showNovelList = require(path.join(basePath,'src','showNovelList.js'));
const showSelectedBook = require(path.join(basePath,'src','showOneBook.js'));

let novelList = [];

let getAndShowNovelList = () => {
	return new Promise((resolve,reject)=>{
		fs.stat(bookBasePath,(err,stats)=>{
			if(err){
				reject(`\u001b[31m${bookBasePath} is not exist\u001b[39m`);
			}else{
				if(stats.isDirectory()){
					showNovelList(resolve,reject,novelList);
				}else{
					reject(`${bookBasePath} must be a directory`) ;
				}
			}
		})
	}).catch((err) => {
		console.log(err);
	})
}

let selectOneBook = () => {
	return new Promise((resolve,reject)=>{
		let rl = readline.createInterface(process.stdin,process.stdout);
		rl.setPrompt(`\u001b[32mPlease Select One Novel: <1> \u001b[39m`);
		rl.prompt();
		rl.on('line',(line) => {
			let flag = false;
			if(Object.is('',line)){
				flag = true;
				history['selected'] = novelList[0];	
			}else if(tool.isNotNumber(line)){
				console.log(`\u001b[31m#> Warn: Please Input A Number \u001b[39m`);
			}else{
				let [index,len] = [parseInt(line),novelList.length];
				if(index <= len){
					flag = true;
					history['selected'] = novelList[index-1];
				}else{
					console.log(`\u001b[31m#> Warn: Invalid Input,Please Input A Number Again \u001b[39m`);
				}
			}
			if(flag){
				tool.setHistory(history);
				rl.close();
				resolve();
			}
		})
	}).catch((err) => {
		console.log(err);
	})
}

(()=>{
	let deployPromise = [getAndShowNovelList,selectOneBook,showSelectedBook];
	tool.promiseIter(deployPromise).catch((err)=>{
		if(err)
			console.log(err)
	});
})();
