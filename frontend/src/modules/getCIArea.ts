import gEBID from "./gEBID";
import { bottom, left, right, top } from "./getStyle";
import { gScrLeft, gScrlTop } from "./scroll";

export function getCIArea(
    start: { x: number, y: number},
    end: { x: number, y: number}
){
    let elements = gEBID('canvas')?.querySelectorAll('*');
    let ids = [];
    elements?.forEach((element: any) => {
        ids.push(element.id)
    });
    // filtering unwanted 
    let filteredIDList: any = [];
    ids.map((each: any) => {
        // check for unwanted ids
        if(each !== 'select'){ // b/c select element is inside canvas we have to escape it
            let x_lt: any = left(each) + gScrLeft('canvas'); // left position of element
            let y_t: any = top(each) + gScrlTop('canvas'); // top position of element
            let x_rt: any = right(each) + gScrLeft('canvas'); // right position of element
            let y_lb: any = bottom(each) + gScrlTop('canvas');
            let x1: any = start.x; // start selecting from left position
            let x2: any = end.x; // select upto this point of left position
            let y1: any = start.y; // start selecting from this top position
            let y2: any = end.y; // end selecting from this tiop position

            /**
             * the reverse selection maitainer is here
             * 
             */
            if(x1 > x2){
                let n = x1;
                x1 = x2;
                x2 = n;
            }
            if(y1 > y2){
                let n = y1;
                y1 = y2;
                y2 = n;
            }


            // now check there position
            // top-left matchs

            if(
                ((x_lt > x1 && x_lt < x2) && (y_t > y1 && y_t < y2)) ||
                ((x_rt > x1 && x_rt < x2) && (y_t > y1 && y_t < y2)) ||
                ((x_lt > x1 && x_lt < x2) && (y_lb > y1 && y_lb < y2)) ||
                ((x_rt > x1 && x_rt < x2) && (y_lb > y1 && y_lb < y2))
            )
            {
                filteredIDList.push(each)
            }
            // top-right matchs
            // bottom-left matchs
            // bottom-right matchs
        }
    })
    return filteredIDList;
}