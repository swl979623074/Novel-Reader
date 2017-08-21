class ShowCmdDesc{
	run(oper){
		oper = oper.toLowerCase();
		switch(oper){
			case '/help':this.displayHelpCmdDesc();break;
			case '/show':this.displayShowCmdDesc();break;
			case '/set':this.displaySetCmdDesc();break;
			case '/u':this.displayUpCmdDesc();break;
			case '/d':this.displayDownCmdDesc();break;
			case '/q':this.displayExitCmdDesc();break;
			default:Desc.invalidCmd;break;
		}
	}
	
	displayHelpCmdDesc(){
		let desc = `Novel Command List:\n\t/help\t帮助命令,'/'+命令查看命令详细使用\n\t:show [pagesize/pagenumber]	显示系统配置\n\t:set [pagesize/pagenumber]	设置系统配置\n\tq\t退回\n\tu\t上翻页\n\tq<enter>\t下翻页\n`;
		console.log(desc)
	}
	displaySetCmdDesc(){
		let desc = `set使用示例\n\t修改页数\t:set pagenumber 100`;
		console.log(desc)
	}
	displayShowCmdDesc(){
		let desc = `show使用示例\n\t显示页数\t:show pagenumber`;
		console.log(desc)
	}
	displayExitCmdDesc(){
		let desc = `q使用示例\n\t退出\tq`;
		console.log(desc)
	}
	displayUpCmdDesc(){
		let desc = `u使用示例\n\t向上翻页\tu`;
		console.log(desc)
	}
	displayDownCmdDesc(){
		let desc = `d使用示例\n\t向下翻页页数\td`;
		console.log(desc)
	}
}

class Desc{
	static helpPrompt(){
		return `\u001b[32mInput '/help' commend can get more help:<enter> \u001b[39m`;
	}
	
	static invalidCmd(){
		return `\u001b[31m Error: Invalid Command \u001b[39m`;
	}
	
	static handleCmd(oper){
		let show = new ShowCmdDesc();
		show.run(oper)
	}
}

module.exports = Desc;

