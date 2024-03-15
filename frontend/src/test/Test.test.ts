

export default class Test {
    
    options = { output: 'log' };

    constructor(options?: { output: 'log' | 'return' | 'both' }){
        if(options) // if this option is provided
            this.options = options;
    }

    test(method: any, tests: any ){
        
        let result = true;
        Object.keys(tests).map((each_test: any) => {
            const output = method(tests[each_test].in) === tests[each_test].out;
            if(!output){ // if we found a fail 
                result = false;
                console.log("Failed This: in:" + tests[each_test].in + "\nout:" + tests[each_test].out)
                console.log(each_test);
            }else {
                console.log('✅ ' + each_test + ' passed')
            }
        })

        const log = result ? '✅ All Test Passed' : '❌ Test Failed';

        switch(this.options.output){
            case 'log':
                console.log(log);
                break;
            case 'return':
                return result;
                break;
            case 'both':
                console.log(log);
                return result;
                break;
            default:
                console.log("[ERROR]: Test doesn't handle the process: \n Location: src/test/Test.ts/Test.ts()");
        }
    }
}