import { PAGES_DATATYPE } from "../id-storage/constants.config";

export default class Elem {

    static isPage(id: string){
        return this.id(id)!.getAttribute('data-type') === PAGES_DATATYPE;
    }

    static id(id: string){
        if(document.getElementById(id)){
            return document.getElementById(id);
        }else {
            return document.getElementById('canvas')
        }
    }
    
    static setAttribute(id: string, key: string, value: string){
        if(Elem.id(id)){
            Elem.id(id)!.setAttribute(key, value);
        }else {
            return false
        }
    }

    // to set multiple attributes for element
    static setMAttribute(id: string, kv: any){
        if(Elem.id(id)){
            Object.keys(kv).forEach((key: string) => {
                Elem.id(id)!.setAttribute(key, kv[key]);
            })
        }
    }

}