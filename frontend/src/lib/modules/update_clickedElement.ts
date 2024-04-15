import Elem from "./Elem";


export default class ClickedElement {
    
    private id = '';
    private tag = '';
    private style = {};
    private contentEditable = false;

    constructor(id: string){
        const element = Elem.id(id)!;
        this.id = element.id;
        this.tag = element.tagName;
        this.style = getComputedStyle(element);
        this.contentEditable = element.isContentEditable;
    }
    
    getFullData(type: 'obj' | 'json') {
        const response = {
            id: this.id,
            tag: this.tag,
            style: this.style,
            contentEditable: this.contentEditable
        }
        switch(type){
            case 'obj':
                return response;
                break;
            case 'json':
                return JSON.stringify(response);
                break;
            default:
                console.error('[ClickedElement.getFullData : please provide [json or obj] to get response')
            
        }
    }
}