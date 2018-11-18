export {parse};

const parseFunc = {
    ExpressionStatement: parseExpressionStatement,
    FunctionDeclaration: parseFunctionDeclaration,
    VariableDeclaration: parseVariableDeclaration,
    WhileStatement: parseWhileStatement,
    IfStatement: parseIfStatement,
    ReturnStatement: parseReturnStatement,
    BinaryExpression: parseBinaryExpression,
    UnaryExpression: parseUnaryExpression,
    UpdateExpression: parseUpdateExpression,
    BlockStatement: parseBlockStatement,
    MemberExpression: parseMemberExpression,
    ForStatement: parseForStatement,
    Identifier: parseIdentifier,
    Literal: parseLiteral,
    AssignmentExpression: parseAssignmentExpression
};

function parseFunctionDeclaration(exp){
    const func = [];
    func.push({line: exp.loc.start.line, type:'function declaration',name: exp.id.name, condition: '', value:''});
    for(let param of exp.params){
        const paramRow = {line: exp.loc.start.line, type: 'variable declaration', name: param.name, condition: '', value: '' };
        func.push(paramRow);
    }

    const funcBody = parseExp(exp.body);
    return func.concat(funcBody);
}

function parseVariableDeclaration(exp){
    const vars=[];
    for(let varDec of exp.declarations){
        let val = '';
        if(varDec.init != null)
            val = parseExp(varDec.init);
        vars.push({line: exp.loc.start.line, type: 'variable declaration', name: varDec.id.name, condition: '', value: val});
    }

    return vars;
}

function parseExpressionStatement(exp){
    if(exp.expression.type === 'AssignmentExpression'){
        return [
            {line: exp.loc.start.line,
                type:'assignment expression',
                name:parseExp(exp.expression.left),
                condition:'',
                value:parseExp(exp.expression.right)}
        ];
    }
    else{
        return [
            {line: exp.loc.start.line,
                type:'update expression',
                name:'',
                condition:'',
                value:parseExp(exp.expression).name}
        ];
    }
}

function parseWhileStatement(exp){
    const parsed = [];
    parsed.push({line: exp.loc.start.line, type:'while statement',name: '', condition: parseExp(exp.test), value:''});
    const parsedBody = parseExp(exp.body);
    for(let arg of parsedBody){
        parsed.push(arg);
    }

    return parsed;
}

function parseIfStatement(exp){
    const parsed = [];
    parsed.push({line: exp.loc.start.line, type:'if statement',name: '', condition: parseExp(exp.test), value:''});
    const parsedThen = parseExp(exp.consequent);
    for(let arg of parsedThen){
        parsed.push(arg);
    }
    if(exp.alternate != null){
        const parsedElse = parseExp(exp.alternate);
        if(parsedElse[0].type === 'if statement')
            parsedElse[0].type = 'else if statement';
        else
            parsed.push({line: exp.alternate.loc.start.line, type:'else statement',name: '', condition: '', value:''});
        for(let arg of parsedElse){
            parsed.push(arg);
        }
    }

    return parsed;
}

function parseReturnStatement(exp){
    return [
        {line: exp.loc.start.line,
            type:'return statement',
            name:'',
            condition:'',
            value:parseExp(exp.argument)}
    ];
}

function parseBinaryExpression(exp){
    let res = '';
    if(exp.left.type === 'BinaryExpression'){
        res += '(' + parseExp(exp.left) + ')';
    }
    else{
        res += parseExp(exp.left);
    }
    res += ' ' + exp.operator + ' ';
    if(exp.right.type === 'BinaryExpression'){
        res += '(' + parseExp(exp.right) + ')';
    }
    else{
        res += parseExp(exp.right);
    }
    return res;
}

function parseUnaryExpression(exp){
    return exp.operator + '' + parseExp(exp.argument);
}

function parseAssignmentExpression(exp){
    return parseExp(exp.left)+ '' + exp.operator + '' + parseExp(exp.right);
}

function parseBlockStatement(exp){
    let parsedArray = [];
    for(let arg of exp.body){
        let parsedRows = parseExp(arg);
        for(let row of parsedRows){
            parsedArray.push(row);
        }
    }
    return parsedArray;
}

function parseMemberExpression(exp){
    return parseExp(exp.object) + '[' + parseExp(exp.property) + ']';
}

function parseIdentifier(exp){
    return exp.name;
}

function parseLiteral(exp){
    return exp.raw;
}

function parseUpdateExpression(exp){
    let name = '';
    exp.prefix ? name = exp.operator + parseExp(exp.argument): name = parseExp(exp.argument) + exp.operator;
    return {line:exp.loc.start.line, type:'update expression',name: name, condition: '', value:''};
}

function parseForStatement(exp){
    const parsed = [];
    let cond = parseExp(exp.init)+';'+parseExp(exp.test)+';';
    let update = parseExp(exp.update);
    exp.update.type === 'AssignmentExpression' ? cond += update : cond += update.name;
    parsed.push({line: exp.loc.start.line, type:'for statement',name: '', condition: cond, value:''});
    const parsedBody = parseExp(exp.body);
    for(let arg of parsedBody){
        parsed.push(arg);
    }

    return parsed;
}

/*function parseExp4 (exp) {
    switch(exp.type){
    case 'MemberExpression': return parseMemberExpression(exp);
    case 'ForStatement': return parseForStatement(exp);
    case 'UpdateExpression': return parseUpdateExpression(exp);
    }
}

function parseExp3 (exp) {
    switch(exp.type){
    case 'UnaryExpression': return parseUnaryExpression(exp);
    case 'ReturnStatement': return parseReturnStatement(exp);
    case 'BlockStatement': return parseBlockStatement(exp.body);
    default: return parseExp4(exp);
    }
}

function parseExp2 (exp) {
    switch(exp.type){
    case 'Identifier': return exp.name;
    case 'BinaryExpression': return parseBinaryExpression(exp);
    case 'Literal': return exp.raw;
    default: return parseExp3(exp);
    }
}

function parseExp1 (exp) {
    switch(exp.type){
    case 'FunctionDeclaration': return parseFunctionDeclaration(exp);
    case 'VariableDeclaration': return parseVariableDeclaration(exp);
    case 'ExpressionStatement': return parseExpressionStatement(exp.expression);
    default: return parseExp2(exp);

    }
}*/

function parseExp (exp) {
    if(exp === undefined || exp === ''){
        return;
    }

    let func = parseFunc[exp.type];
    return func ? func(exp) : null;


    /*switch(exp.type){
    case 'WhileStatement': return parseWhileStatement(exp);
    case 'IfStatement': return parseIfStatement(exp);
    default: return parseExp1(exp);
    }*/
}

function parse(parsedBody){
    let parsedArray = [];
    for(let exp of parsedBody){
        let parsedRows = parseExp(exp);
        for(let row of parsedRows){
            parsedArray.push(row);
        }
    }
    return parsedArray;
}