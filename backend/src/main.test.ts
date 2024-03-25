

/**
 * - Main Test Class is the main test function that runs all tests 
 *   if all passed return "All Operational" as response.
 * - All Server Works if all tests passed
 */
export default class MainTest {

    constructor () {
        /**
         * Rules Of Constructor
         */
    }

    start() {
        // running unit tests
        const test_1 = true; // test name = running test

        if(
            test_1 // check for each tests to be true
        ){
            return true;
        }else {
            return false;
        }
    }
}