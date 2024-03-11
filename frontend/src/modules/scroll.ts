import Elem from "./Elem";

export default class Scroll {

    static left(id: string){
        if(Elem.id(id)){
            return Elem.id(id)!.scrollLeft;
        }else {
            return 0;
        }
    }

    static top(id: string){
        if(Elem.id(id)){
            return Elem.id(id)!.scrollTop;
        }else {
            return 0;
        }
    }

}
