import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parse} from '../src/js/parser';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}');
    });
    it('is parsing a simple variable declaration correctly', () => {
        let res = parse(parseCode('let a = 1;').body);
        assert.deepEqual(res, [{line: 1, type: 'variable declaration', name: 'a', condition: '', value: '1'}]);
    });
    it('is parsing a simple variable declaration without init correctly', () => {
        let res = parse(parseCode('let a;').body);
        assert.deepEqual(res, [{line: 1, type: 'variable declaration', name: 'a', condition: '', value: ''}]);
    });
    it('is parsing a variable declaration with unary expression correctly', () => {
        let res = parse(parseCode('let a = -1;').body);
        assert.deepEqual(res, [{line: 1, type: 'variable declaration', name: 'a', condition: '', value: '-1'}]);
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple assignment expression correctly', () => {
        let res = parse(parseCode('x=x+2;').body);
        assert.deepEqual(res,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: 'x + 2'}]);
    });

    it('is parsing an assignment expression with member correctly', () => {
        let res = parse(parseCode('x=a[5]*2;').body);
        assert.deepEqual(res,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: 'a[5] * 2'}]);
    });

    it('is parsing an update expression correctly', () => {
        let res = parse(parseCode('x++;').body);
        assert.deepEqual(res,
            [{line: 1, type: 'update expression', name: '', condition: '', value: 'x++'}]);
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple function declaration correctly', () => {
        let res = parse(parseCode('function f(){}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'function declaration', name: 'f', condition: '', value: ''}]); });

    it('is parsing a function declaration with parameters correctly', () => {
        let res = parse(parseCode('function f(x,y){}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'function declaration', name: 'f', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'x', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'y', condition: '', value: ''}]); });

    it('is parsing a function declaration with return correctly', () => {
        let res = parse(parseCode('function f()\n{return 0;}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'function declaration', name: 'f', condition: '', value: ''},
                {line: 2, type: 'return statement', name: '', condition: '', value: '0'},]); });
});

describe('The javascript parser', () => {
    it('is parsing a while loop correctly', () => {
        let res = parse(parseCode('while(x){}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'while statement', name: '', condition: 'x', value: ''}]);
    });

    it('is parsing a while loop with binary expression correctly', () => {
        let res = parse(parseCode('while(x>2){}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'while statement', name: '', condition: 'x > 2', value: ''}]);
    });

    it('is parsing a while loop with body correctly', () => {
        let res = parse(parseCode('while(x>2)\n{--x;\n}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'while statement', name: '', condition: 'x > 2', value: ''},
                {line: 2, type: 'update expression', name: '', condition: '', value: '--x'}]);
    });
});

describe('The javascript parser', () => {
    it('is parsing an if statement correctly', () => {
        let res = parse(parseCode('if(x){}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'if statement', name: '', condition: 'x', value: ''}]); });
    it('is parsing an if statement with else correctly', () => {
        let res = parse(parseCode('if(x)\n{}else\n{y=5}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'if statement', name: '', condition: 'x', value: ''},
                {line: 3, type: 'else statement', name: '', condition: '', value: ''},
                {line: 3, type: 'assignment expression', name: 'y', condition: '', value: '5'}]); });

    it('is parsing an if statement with else if correctly', () => {
        let res = parse(parseCode('if(x)\n{}else if(y){}\nelse\n{z=5}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'if statement', name: '', condition: 'x', value: ''},
                {line: 2, type: 'else if statement', name: '', condition: 'y', value: ''},
                {line: 4, type: 'else statement', name: '', condition: '', value: ''},
                {line: 4, type: 'assignment expression', name: 'z', condition: '', value: '5'}]); });
});

describe('The javascript parser', () => {
    it('is parsing an if statement with body correctly', () => {
        let res = parse(parseCode('if(x)\n{y=5}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'if statement', name: '', condition: 'x', value: ''},
                {line: 2, type: 'assignment expression', name: 'y', condition: '', value: '5'}]); });
});

describe('The javascript parser', () => {
    it('is parsing a complex binary expression correctly #1', () => {
        let res = parse(parseCode('x=y+z+3;').body);
        assert.deepEqual(res,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: '(y + z) + 3'}]); });
    it('is parsing a complex binary expression correctly #2', () => {
        let res = parse(parseCode('x=y+(z+3);').body);
        assert.deepEqual(res,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: 'y + (z + 3)'}]); });
    it('is parsing a complex binary expression correctly #3', () => {
        let res = parse(parseCode('x=(y+5)*(z+3);').body);
        assert.deepEqual(res,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: '(y + 5) * (z + 3)'}]); });
});

describe('The javascript parser', () => {
    it('is parsing a for loop correctly', () => {
        let res = parse(parseCode('for(i=0;i<10;i++){}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'for statement', name: '', condition: 'i=0;i < 10;i++', value: ''}]);
    });
    it('is parsing a for loop with body correctly', () => {
        let res = parse(parseCode('for(i=0;i<10;i=i+2){\nx=x+2;}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'for statement', name: '', condition: 'i=0;i < 10;i=i + 2', value: ''},
                {line: 2, type: 'assignment expression', name: 'x', condition: '', value: 'x + 2'}]);
    });
    it('is parsing a while loop with body correctly', () => {
        let res = parse(parseCode('while(x>2)\n{--x;\n}').body);
        assert.deepEqual(res,
            [{line: 1, type: 'while statement', name: '', condition: 'x > 2', value: ''},
                {line: 2, type: 'update expression', name: '', condition: '', value: '--x'}]);
    });
});
