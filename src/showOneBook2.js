const fs = require('fs');
const readline = require('readline');
const path = require('path');

const log = console.log;
const basePath = path.join(__dirname);
const configPath = path.join(basePath,'..','config','history.json');

const tool = require(path.join(basePath,'tool.js'));

let config = require(configPath);
let bookPath = config['selected'];
let history = config[bookPath] || {};
if(Object.is(config[bookPath],undefined)){
	config[bookPath] = history;
}

const clear = () => process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');

let firstFlip = true;

let readBook = (bookPath) => {
	fs.open(bookPath,'r',(err,fd)=>{
		if(err)
			throw err;
		else{
			let rl = readline.createInterface(process.stdin,process.stdout);
			rl.on('line',(line)=>{
				clear();
				if(Object.is('d',line) || Object.is('',line)){
					showWord(fd,'d');
				}else if(Object.is('u',line)){
					showWord(fd,'u');
				}else if(Object.is('q',line)){
					fs.writeFile(configPath,JSON.stringify(config),(err)=>{
						if(err){
							throw err;
						}
					})
					rl.close();
				}else{
					log(`\u001b[31m Error: Invalid Command \u001b[39m`)
				}
			})
		}
	})
}

let showWord = (fd,direction) => {
	let buffer = new Buffer(history.showLength);
	let [begin,end,step] = [0,buffer.byteLength,buffer.byteLength];
	
	if(firstFlip){
		firstFlip = false;
	}else{
		let pos = history.position || 0;
		if(Object.is(direction,'u') && pos > 0){
			pos -= step;
		}
		if(Object.is(direction,'d')){
			pos += step;
		}
		history.position = pos;
	}
	
	fs.read(fd,buffer,begin,end,history.position,(err,bytesRead,buffer)=>{
		if(err){ 
			console.log(err); 
			return; 
		} 
		console.log(buffer.toString()); 		
	})
}

let setConfig = (resolve,reject) => {
	let rl = readline.createInterface(process.stdin,process.stdout);
	let defaultLength = history.showLength / 2 || 521;
	rl.setPrompt(`User> Please Set Show Word Size Each Time: <${defaultLength}> `);
	rl.prompt();
	rl.on('line',(line)=>{
		let flag = false;
		if(Object.is('',line)){
			history.showLength = defaultLength * 2;
			flag = true;
		}else{
			let len = parseInt(line);
			if(Object.is('q',line)){
				rl.close();
				clear();
			}else if(tool.isNotNumber(line)){
				log(`\u001b[31m Warn: Please Input A Number \u001b[39m`);
			}else{
				history.showLength = parseInt(line) * 2;
				flag = true;
			}
		}
		if(Object.is(true,flag)){
			rl.close();
			tool.showAppOperateInstructions();
			return resolve()
		}
	})
}

let run = (bookPath) => {
	let promise = new Promise((resolve,reject)=>{
		setConfig(resolve,reject);
	}).then(()=>{
		readBook(bookPath);
	}).catch((err)=>{
		throw err;
	})
}


module.exports = run;



