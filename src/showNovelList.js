let path = require('path');
let fs = require('fs');

let basePath = path.join(__dirname);
let bookDir = path.join(basePath,'..','book');

let getFile = (resolve,reject,showBookList,novelList) => {
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
							novelList.push(val);
						}
					})
					showBookList(resolve,novelList);
				}else{
					reject(`\u001b[32mNo Novel In Here \u001b[39m`);
				}	
			})
		}
	})
}

let showBookList = (resolve,novelList) => {
	console.log(`Novel List：`);
	novelList.forEach((value,index) => {
		console.log(`\t${index+1}. ${value.slice(0,value.indexOf('.'))}`);
	})
	resolve();
}

let run = (resolve,reject,novelList) => {
	getFile(resolve,reject,showBookList,novelList)
}

module.exports = run;
