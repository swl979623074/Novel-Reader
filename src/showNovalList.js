let path = require('path');
let fs = require('fs');

let basePath = path.join(__dirname);
let bookDir = path.join(basePath,'..','book');

let getFile = (resolve,reject,showBookList,novalList) => {
	fs.access(bookDir,fs.constants.R_OK,(err)=>{
		if(err){
			reject(`The 'book' Folder Is Not Exist`);
		}else{
			fs.readdir(bookDir,(err,files)=>{
				let len = files.length;
				if(!err && len > 0){
					files.forEach((val)=>{
						let filePath = path.join(bookDir,val);
						let rs = fs.statSync(filePath).isFile();
						if(Object.is(true,rs)){
							novalList.push(val);
						}
					})
					showBookList(resolve,novalList);
				}else{
					reject(`\u001b[32m No Novel In Here \u001b[39m`);
				}	
			})
		}
	})
}

let showBookList = (resolve,novalList) => {
	console.log(`Noval List：`);
	novalList.forEach((value,index) => {
		console.log(`\t${index+1}. ${value.slice(0,value.indexOf('.'))}`);
	})
	resolve();
}

let run = (resolve,reject,novalList) => {
	getFile(resolve,reject,showBookList,novalList)
}

module.exports = run;
