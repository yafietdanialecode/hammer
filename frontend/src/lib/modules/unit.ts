
/**
 * 
 * All Unit Conversion are in this class
 */
export default class Unit {

    // int > int + px
    static px(value: number): string {
        return value + 'px';
    }
    
    // int > int + vw
    static vw(value: number): string {
        return value + 'vw';
    }

    // int > int + vh
    static vh(value: number): string {
        return value + 'vh';
    }

    // int > int + %
    static p(value: number): string {
        return value + '%';
    }
}

