import { CANVAS } from "../id-storage/constants.config";
import Elem from "./Elem";

export default function focusOn(id: string){
    if(Elem.id(id)){
        Elem.id(id)?.focus({ preventScroll: true });
    }else {
        Elem.id(CANVAS)?.focus({ preventScroll: true })
    }
}