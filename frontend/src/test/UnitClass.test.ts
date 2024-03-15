import Unit from "../modules/unit";
import Test from "./Test";


export default class UnitClassTest extends Test {

    options = { output: 'log' };

    constructor(options?: { output: 'log' }) {
        super(options);
    }

    test_px(){
        const tests = {
            test1: {
                in: 5,
                out: '5px'
            },
            test2: {
                in: 0,
                out: '0px'
            },
            test3: {
                in: -6,
                out: '-6px'
            },
            test4: {
                in: 9.353,
                out: '9.353px'
            }
        }
        
        const output = this.test(Unit.px, tests);
        if(this.options.output == 'return' || this.options.output == 'both')
            return output
    }
}