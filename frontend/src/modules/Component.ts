import Elem from "./Elem";

export default class Component {

    static name(id: string){
        if(Elem.id(id)){
            let tagName = Elem.id(id)!.tagName;
            let isPage = Elem.id(id)!.getAttribute('data-type') === 'page' ? true : false;
            // let isButton = tagName === 'BUTTON';
            // let isDiv = tagName === 'DIV';
            // let isInput = tagName === 'INPUT';
            // let isText = false;
            switch(tagName.toLowerCase()){
                case "h1":
                    return "Main Title"
                    break;
                case 'h2':
                    return "Subtitle"
                    break;
                case 'h3':
                case 'h4':
                case 'h5':
                case 'img':
                    return 'Image';
                    break;
                case 'h6':
                    return tagName.toLocaleUpperCase();
                    break;
                case 'span':
                    return 'Text';
                    break;
                case 'p':
                    return "Paragraph";
                    break;
                case 'button':
                    return "Button";
                    break;
                case 'input':
                    return "Input";
                    break;
            }
    
            // if page
            if(isPage)
                return "Page"
            
        }else {
            return "NULL"
        }
    }
}
