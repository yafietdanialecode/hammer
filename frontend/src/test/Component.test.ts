import { PAGES_DATATYPE } from "../lib/id-storage/constants.config";
import Component from "../lib/modules/Component";
import Test from "./Test.test";


export default class ComponentClassTest extends Test {

    constructor (options: { output: 'log' | 'return' | 'both' }){
        super(options);
    }

    test_name(){
        // inputs
        const page = document.createElement('div');
        page.setAttribute('data-type', PAGES_DATATYPE);
        const pageWithName = document.createElement('div');
        page.setAttribute('data-type', PAGES_DATATYPE);
        page.setAttribute('data-name', 'Home Page');
        const h1 = document.createElement('h1');
        const h2 = document.createElement('h2');
        const h3 = document.createElement('h3');
        const h4 = document.createElement('h4');
        const h5 = document.createElement('h5');
        const h6 = document.createElement('h6');
        const image = document.createElement('img');
        const text = document.createElement('span');
        const button = document.createElement('button');
        const input = document.createElement('input');
        const paragraph = document.createElement('p');
        
        // tests
        const tests = {
            test_1: {
                in: page,
                out: 'Page'
            },
            test_2: {
                in: pageWithName,
                out: 'Home Page'
            },
            test_3: {
                in: h1,
                out: 'Heading 1'
            },
            test_4: {
                in: h2,
                out: 'Heading 2'
            },
            test_5: {
                in: h3,
                out: 'Heading 3'
            },
            test_6: {
                in: h4,
                out: 'Heading 4'
            },
            test_7: {
                in: h5,
                out: 'Heading 5'
            },
            test_8: {
                in: h6,
                out: "Heading 6"
            },
            test_9: {
                in: image,
                out: 'Image'
            },
            test_10: {
                in: text,
                out: "Text"
            },
            test_11: {
                in: paragraph,
                out: "Paragraph"
            },
            test_12: {
                in: button,
                out: "Button"
            },
            test_13: {
                in: input,
                out: "Input"
            },
            test_14: {
                in: null,
                out: 'UNKNOWN COMPONENT'
            }
        }

        // checks amount
        const currentChecksAmount = 13;
        
        const correctAmount = Object.keys(tests).length == currentChecksAmount

        if(correctAmount){
            this.test(Component.name, tests);
        }else {
            console.log("Test Amounts Are Not Correct");
        }
    }

}