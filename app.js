const path = require('path');
const fs = require('fs');
const readline = require('readline');

const basePath = path.join(__dirname);
const bookBasePath = path.join(basePath,'book');

const history = require(path.join(basePath,'config','history.json'))
const tool = require(path.join(basePath,'src','tool.js'));
const showNovalList = require(path.join(basePath,'src','showNovalList.js'));
const showSelectedBook = require(path.join(basePath,'src','showOneBook.js'));

let novalList = [];

let getAndShowNovalList = () => {
	return new Promise((resolve,reject)=>{
		fs.stat(bookBasePath,(err,stats)=>{
			if(err){
				reject(`${bookBasePath} is not exist`);
			}else{
				if(stats.isDirectory()){
					showNovalList(resolve,reject,novalList);
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
		rl.setPrompt(`Please Select One Noval: <1> `);
		rl.prompt();
		rl.on('line',(line) => {
			let flag = false;
			if(Object.is('',line)){
				flag = true;
				history['selected'] = novalList[0];	
			}else if(tool.isNotNumber(line)){
				console.log(`\u001b[31m#> Warn: Please Input A Number \u001b[39m`);
			}else{
				let [index,len] = [parseInt(line),novalList.length];
				if(index <= len){
					flag = true;
					history['selected'] = novalList[index-1];
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
	let deployPromise = [getAndShowNovalList,selectOneBook,showSelectedBook];
	tool.promiseIter(deployPromise).catch((err)=>{
		if(err)
			console.log(err)
	});
})();
















