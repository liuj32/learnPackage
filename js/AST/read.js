#!/usr/bin/env node

const recast = require('recast')
const TNT = recast.types.namedTypes

recast.run( function(ast, printSource){
	recast.visit(ast, {
		visitFunctionDeclaration: function({node}) {
			// if(TNT.ExpressionStatement.check(node)){
			// 	console.log('this is statement')
			// }
			console.log(node)
			TNT.FunctionDeclaration.assert(node)
			return false
		}		
	});
})

/**
 * node 代表一条语句: 例如一个函数定义
 * 
 * visitFunctionDeclaration 便利文件里的函数定义其他的类型就过滤掉
 */