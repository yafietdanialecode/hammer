import gEBID from "./gEBID";

export function top(id: string){
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().top
    }else {
        return false;
    }
}

export function right(id: string){
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().right
    }else {
        return false;
    }
}

export function bottom(id: string){
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().bottom
    }else {
        return false;
    }
}


export function left(id: string){
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().left
    }else {
        return false;
    }
}

export function width(id: string){
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().width
    }else {
        return false;
    }
}


export function height(id: string){
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().height
    }else {
        return false;
    }
}