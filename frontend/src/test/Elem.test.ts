import { CANVAS, UPPER_TOOLS } from "../id-storage/constants.config";
import Elem from "../modules/Elem";

(() => {

    let element = Elem.id(UPPER_TOOLS);
    if(element){
        if(element.id === UPPER_TOOLS){
            console.log('Test 1 Passed');
        }else {
            console.log('Test 1 Failed');
        }
    }else if(element.id === CANVAS) {
        console.log("Test 3 Passed ");
    }else {
        console.log("Test 4 Failed");
    }
})();