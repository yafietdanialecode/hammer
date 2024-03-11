import Elem from "./Elem";

export default class Style {

    static top(id: string): number {
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().top
        }
        return 0;
    }

    static right(id: string): number{
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().right
        }
        return 0;
    }

    static bottom(id: string): number{
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().bottom
        }
        return 0;
    }

    static left(id: string): number{
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().left
        }
        return 0;
    }

    static width(id: string): number{
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().width
        }
        return 0;
    }

    static height(id: string): number{
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().height
        }
        return 0;
    }

}
