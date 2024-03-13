
/**
 * 
 * @param top = scrollTop
 * @param left = scrollLeft
 * @param right = scrollLeft + window.innerWidth - (other components width such as left tools)
 * @param bottom = scrollTop + window.innerHeight - (other components height such as upper tools)
 */

import { CANVAS, MULTIPLE_ELMENTS_WRAPPER, SELECT } from "../id-storage/constants.config";
import Elem from "../modules/Elem";
import Logic from "../modules/Logic";
import Style from "../modules/Style";

export default function screenVisibleElements (top: number, left: number, right: number, bottom: number){
    /**
     * so we need elements those exist between these scope
     * to do that the only requirement of elments are listed below
     */

    /**
     * to do this calculation
     * or to consider any elment as reference at least it's 
     * 1. top-left corner
     * 2. top-right corner
     * 3. bottom-left corner
     * 4. bottom-right corner 
     * must be located in this screenZone
     */

    
    const allElements = Elem.id(CANVAS)!.querySelectorAll('*');
    const ids: string[] = []; // elments whose corner (at least one of four corner of element) exist in screen points 
    const logic = new Logic('root', { CANVAS_ID: CANVAS }); // to filter out unwanted elments
    allElements.forEach((element: any) => {
        const id = element.id;
        /**
         * if element exists and it is not one of exceptions this will execute
         */
        if(Elem.id(id) && id.length > 0 && logic.notInExceptions(id, [ CANVAS, MULTIPLE_ELMENTS_WRAPPER, SELECT ])){
            
            // four positions of elment
            const T = Style.top(id);
            const L = Style.left(id);
            const R = Style.right(id);
            const B = Style.bottom(id);

            // some data points of elmenet (elment edges) | INFO: TL = top left corner, similar for others...
            const TL = { x: L, y: T};
            const TR = { x: R, y: T};
            const BL = { x: L, y: B};
            const BR = { x: R, y: B};

            // now we will check if one of cordinates is visible in screen points
            // checking if element top left corner exist inside screen positions
            // TLV = TL visiblity
            const TLV = ( (left < TL.x && top < TL.y) && (right > TL.x && bottom > TL.y));
            const TRV = ( (left < TR.x && top < TR.y ) && (bottom > TR.y && right > TR.x));
            const BLV = ( (left < BL.x && top < BL.y) && (right > BL.x && bottom > BL.y));
            const BRV = ( (left < BR.x && top < BR.y) && (right > BR.x && bottom > BR.y))


            TLV || TRV || BLV || BRV ? ids.push(id) : console.log('Empty');

            // if(TLV){
            //     ids.push(id);
            //     console.log('-------------- ' + id);  
            // console.log('TLV', TLV);  
            // console.log('Screen: ', { top, left, right, bottom });
            // console.log('Elment: ', TL);        
            //   console.log("-----------------" + id);
            // }

            // if(TRV){
            //     ids.push(id);
            //     console.log('-------------- ' + id);  
            // console.log('TRV', TRV);  
            // console.log('Screen: ', { top, left, right, bottom });
            // console.log('Elment: ', TR);        
            //   console.log("-----------------" + id);
            // }

            // if(BLV){
            //     ids.push(id);
            //     console.log('-------------- ' + id);  
            // console.log('BLV', BLV);  
            // console.log('Screen: ', { top, left, right, bottom });
            // console.log('Elment: ', BL);        
            //   console.log("-----------------" + id);
            // }

            // if(BRV){
            //     ids.push(id);
            //     console.log('-------------- ' + id);  
            // console.log('BRV', BRV);  
            // console.log('Screen: ', { top, left, right, bottom });
            // console.log('Elment: ', BR);        
            //   console.log("-----------------" + id);
            // }


        }
    })
    return ids;
}