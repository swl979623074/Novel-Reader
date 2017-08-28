const log = console.log;
const path = require('path');

const basePath = path.join(__dirname);
const desc = require(path.join(basePath,'description.js'));
const tool = require(path.join(basePath,'tool.js'));

class ConfigOper {
	constructor(config){
		this.config = config;
	}
	handleCmd(oper){
		let cmdArr = oper.split(':')[1].split(' ');
		let cmdComponent = [];
		cmdArr.forEach((val)=>{
			if(!Object.is('',val)){
				val = val.toLowerCase();
				cmdComponent.push(val);
			}
		})
		let param = cmdComponent[1];
		if(!Object.is(param,null)){
			if(Object.is(param,'pn')){
				cmdComponent[1] = 'pagenumber';
			}
			if(Object.is(param,'ps')){
				cmdComponent[1] = 'pagesize';
			}
		}
		
		if(Object.is('set',cmdComponent[0]) && Object.is('pagesize',cmdComponent[1]) && cmdComponent[2]){
			this.setPageSize(cmdComponent[2]);
		}else if(Object.is('set',cmdComponent[0]) && Object.is('pagenumber',cmdComponent[1]) && cmdComponent[2]){
			this.setPageNumber(cmdComponent[2]);
		}else if(Object.is('show',cmdComponent[0]) && Object.is('pagesize',cmdComponent[1])){
			this.showPageSize();
		}else if(Object.is('show',cmdComponent[0]) && Object.is('pagenumber',cmdComponent[1])){
			this.showPageNumber();
		}else{
			log(desc.invalidCmd());
		}
	}
	setPageSize(size){
		if(!tool.isNotNumber(size)){
			this.config.showLength = size * 2;
			log(`\u001b[32mSet Success\u001b[39m`)
		}else{
			log(`\u001b[31mpagesize must be a Number Object\u001b[39m`)
		}
	}

	setPageNumber(num){
		if(!tool.isNotNumber(num)){
			this.config.position = num * this.config.showLength;
			log(`\u001b[32mSet Success\u001b[39m`)
		}else{
			log(`\u001b[31mpagesize must be a Number Object\u001b[39m`)
		}
	}

	showPageSize () {
		let size = parseInt(this.config.showLength) || 1024;
		log(`pagesize: ${size / 2}`)
	}

	showPageNumber () {
		let postion = parseInt(this.config.position);
		let size = parseInt(this.config.showLength);
		let pageNumber = parseInt(postion / size);
		log(`pageNmber: ${pageNumber}`)
	}
}

module.exports = ConfigOper;