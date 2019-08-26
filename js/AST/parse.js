// 给你一把"螺丝刀"——recast
const recast = require("recast");

// 你的"机器"——一段代码
// 我们使用了很奇怪格式的代码，想测试是否能维持代码结构
	const code = `export.add = () => {}`
	const code1 = 'a'+'b'   // ExpressionStatement
// 用螺丝刀解析机器
const ast = recast.parse(code);

// ast可以处理很巨大的代码文件
// 但我们现在只需要代码块的第一个body，即add函数
const add  = ast.program.body[0]

console.log(add)

/**
 * add函数拆解流程:

FunctionDeclaration {  //函数定义对象
	id{  //函数名，即add

	}
	params{   //他的参数，即[a, b]

	}
	body {   //大括号的一堆东西
		BlockStatement {  //块状域用来表示{return a+b}
			ReturnStatement{ //返回域用来表示return a+b
				BinaryExpression{ //二项式域用来表示a+b
					//被分成了三部分: left, operator, right

				}
			}
		}
	}
}


 */