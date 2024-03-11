
export default class Elem {

    static id(id: string){
        if(document.getElementById(id)){
            return document.getElementById(id);
        }else {
            return document.getElementById('canvas')
        }
    }

}