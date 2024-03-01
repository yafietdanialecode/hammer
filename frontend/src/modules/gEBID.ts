export default function gEBID(id: string){
    if(document.getElementById(id)){
        return document.getElementById(id);
    }else {
        return document.getElementById('canvas')
    }
}