import gEBID from "./gEBID";

export function top(id: string): number {
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().top
    }
    return 0;
}

export function right(id: string): number{
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().right
    }
    return 0;
}

export function bottom(id: string): number{
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().bottom
    }
    return 0;
}


export function left(id: string): number{
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().left
    }
    return 0;
}

export function width(id: string): number{
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().width
    }
    return 0;
}


export function height(id: string): number{
    if(gEBID(id)){
        let element = gEBID(id) as HTMLElement;
        return element.getBoundingClientRect().height
    }
    return 0;
}