const fs = require('fs');
const readline = require('readline');
const path = require('path');

const log = console.log;
const basePath = path.join(__dirname);
const historyPath = path.join(basePath,'..','config','history.json');

const tool = require(path.join(basePath,'tool.js'));
const desc = require(path.join(basePath,'description.js'));
const ConfigOper = require(path.join(basePath,'ConfigOper.js'));

let history = require(historyPath);

class ReadBook {
	constructor(){
		this.firstFlip = true;
		this.selectedBookName = history['selected'];
		this.bookPath = path.join(basePath,'..','book',this.selectedBookName);
		this.config = history[this.selectedBookName] || {};
		if(Object.is(this.config[this.selectedBookName],undefined)){
			history[this.selectedBookName] = this.config;
		}
		this.configOper = new ConfigOper(this.config);
	}
	readBook(resolve){
		fs.open(this.bookPath,'r',(err,fd)=>{
			if(err)
				throw err;
			else{
				let rl = readline.createInterface(process.stdin,process.stdout);
				rl.setPrompt(`${desc.helpPrompt()}`)
				rl.prompt();
				rl.setPrompt('')
				rl.on('line',(line)=>{
					tool.clear();
					if(Object.is('q',line)){
						tool.setHistory(history);
						rl.close();
						resolve();
					}else{
						this.handleCmd(fd,line);
					}
				})
			}
		})
	}
	showWord(fd,direction){
		let showLength = 1024;	//默认显示512个字符
		if(this.config.showLength){
			showLength = this.config.showLength;
		}else{
			this.config.showLength = showLength;
		}
		
		let buffer = new Buffer(showLength);
		let [begin,end,step] = [0,buffer.byteLength,buffer.byteLength];
		
		if(this.firstFlip){
			this.firstFlip = false;
		}else{
			let pos = 0;	//默认从0偏移位置显示
			if(this.config.position){
				pos = this.config.position;
			}else{
				this.config.position = pos;
			}
			
			if(Object.is(direction,'u') && pos > 0){
				pos -= step;
			}
			if(Object.is(direction,'d')){
				pos += step;
			}
			this.config.position = pos;
		}
		
		fs.read(fd,buffer,begin,end,this.config.position,(err,bytesRead,buffer)=>{
			if(err){ 
				console.log(err); 
				return; 
			} 
			console.log(buffer.toString()); 		
		})
	}
	handleCmd(fd,oper){
		oper = oper.trim();
		if(oper.startsWith(':')){
			this.configOper.handleCmd(oper);
		}else if(oper.startsWith('/')){
			desc.handleCmd(oper);
		}else{
			this.readCmd(fd,oper);
		}
	}
	readCmd(fd,oper){
		let opers = ['u','d','q',''];
		if(Object.is('',oper)){
			oper = 'd';
		}
		
		if(opers.indexOf(oper) > -1){
			this.showWord(fd,oper);
		}else{
			log(desc.invalidCmd());
		}
	}
	
}

let run = () => {
	return new Promise((resolve,reject)=>{
		let read = new ReadBook();
		read.readBook(resolve);
	}).catch((err)=>{
		if(err)
			throw err;
	})
	
}

module.exports = run;