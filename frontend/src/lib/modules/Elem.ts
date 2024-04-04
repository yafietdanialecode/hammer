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

    static isWrapper(id: string){
        if(Elem.id(id)){
            return Elem.id(id)!.getAttribute('data-type') == 'mask'
        }else {
            return false
        }
    }

    // to set multiple attributes for element
    static setMAttribute(id: string, kv: any){
        if(Elem.id(id)){
            Object.keys(kv).forEach((key: any) => {
                Elem.id(id)!.setAttribute(key, kv[key]);
            })
        }
    }

    // existence of element checker
    static exists(id: string){
        if(this.id(id)!){
            return true;
        }else {
            return false;
        }
    }

    // contenteditable enabled or not
    static isContentEditable(id: string, value?: 'true' | 'false') {
        
        if(this.exists(id)){
                // if you need to set value
                if(value){
                    Elem.id(id)!.setAttribute('contenteditable', value);
                }
            return Elem.id(id)!.isContentEditable;
        }
    }
}