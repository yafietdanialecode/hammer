import EC from "./exception-checker";
import { IRREMOVABLE_ELEMENTS } from "./id-storage/constants.config";
import Elem from "./modules/Elem";

// Element Delete: Helps to remove elements carefully from the dom
export default class ED {
    
    // this deletes a single element by id
    static rm(id: string, redirect_to: string, changeSelection: any)
    {
        // deletes the element if it exists in the dom
        if(Elem.id(id) && EC.ne(id, IRREMOVABLE_ELEMENTS)){        
            Elem.id(id)!.remove();
        }
        changeSelection(redirect_to)
    }

    // remove multiple helps to remove multiple elements from the dom carefully
    static rmm(ids: string[], redirect_to: string, changeSelection: any, resetSelectedElements: any)
    {
        ids.map((id: string) => {
            // if the deleted elements exist they will be removed
            if(Elem.id(id) && EC.ne(id, IRREMOVABLE_ELEMENTS)){
                Elem.id(id)!.remove();
            }
        })
        resetSelectedElements([])
        changeSelection(redirect_to)
    }
}