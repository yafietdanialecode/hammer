import Elem from "./Elem";

export default class Style {

    static top(id: string, value?: any): number {
        // if value provided
        if(value){
            Elem.id(id)!.style.top = value;
        }

        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().top
        }
        return 0;
    }

    static right(id: string, value?: any): number{
        // if value provided
        if(value){
            Elem.id(id)!.style.right = value;
        }

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

    static left(id: string, value?: any): number{

        // if value provided
        if(value){
            Elem.id(id)!.style.left = value;
        }

        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().left
        }
        return 0;
    }

    static width(id: string, value?: any): number{
        // if value provided
        if(value){
            Elem.id(id)!.style.width = value;
        }
        if(Elem.id(id)){
            let element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().width
        }
        return 0;
    }

    static height(id: string, value?: any): number{
        // if value provided
        if(value){
            Elem.id(id)!.style.height = value;
        }
        if(Elem.id(id)){
            const element = Elem.id(id) as HTMLElement;
            return element.getBoundingClientRect().height
        }
        return 0;
    }

    static zIndex(id: string, value?: any): number {
        // if value provided
        if(value){
            Elem.id(id)!.style.zIndex = value;
        }
        if(Elem.id(id)){
            const element: HTMLElement = Elem.id(id)!;
            const z: number = parseInt(getComputedStyle(element).zIndex);
            return z;
        }
        return 0;
    }

    static backgroundColor(id: string, value?: any){

        // if this is for setting
        if(value){
            Elem.id(id)!.style.backgroundColor = value;
        }

        if(Elem.id(id)){
            return Elem.id(id)!.style.backgroundColor;
        }else {
            return '#fff'
        }
    }

    static background(id: string, value?: any){

        // if this is for setting
        if(value){
            Elem.id(id)!.style.background = value;
        }

        if(Elem.id(id)){
            return Elem.id(id)!.style.background;
        }else {
            return '#fff'
        }
    }
    
    static color (id: string, value?: any) {
        // if this is setting
        if(value) {
            Elem.id(id)!.style.color = value;
        }
        return getComputedStyle(Elem.id(id)!)
    }

    static borderRadius(id: string, value?: any){
        // if this is setting
        if(value){
            Elem.id(id)!.style.borderRadius = value;
        }

        return getComputedStyle(Elem.id(id)!).borderRadius
    }

    static fontSize(id: string, value?: any){
        // if this is setting
        if(value){
            Elem.id(id)!.style.fontSize = value;
        }

        return Elem.id(id)!.style.fontSize
    }

    static textAlign(id: string, value?: 'center' | 'left' | 'right' | 'justify'){
        // if value passed
        if(value){
            Elem.id(id)!.style.textAlign = value;
        }

        return Elem.id(id)!.style.textAlign;
    }
}
