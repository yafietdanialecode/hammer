import gEBID from "./gEBID";


export function gScrLeft(id: string){
    if(gEBID(id)){
        return gEBID(id)!.scrollLeft;
    }else {
        return 0;
    }
}

export function gScrlTop(id: string){
    if(gEBID(id)){
        return gEBID(id)!.scrollTop;
    }else {
        return 0;
    }
}