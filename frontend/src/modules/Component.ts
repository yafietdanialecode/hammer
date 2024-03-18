import Elem from "./Elem";

export default class Component {

    static name(element: HTMLElement){
        const id = element.id;
        if(Elem.id(id)){
            let tagName = Elem.id(id)!.tagName;
            let isPage = Elem.id(id)!.getAttribute('data-type') === 'page' ? true : false;
            // let isButton = tagName === 'BUTTON';
            // let isDiv = tagName === 'DIV';
            // let isInput = tagName === 'INPUT';
            // let isText = false;
            switch(tagName.toLowerCase()){
                case "h1":
                    return "Heading 1"
                    break;
                case 'h2':
                    return "Heading 2"
                    break;
                case 'h3':
                    return "Heading 3"
                    break;
                case 'h4':
                    return "Heading 4";
                    break;
                case 'h5':
                    return 'Heading 5';
                    break;
                case 'h6':
                    return 'Heading 6';
                    break;
                case 'img':
                    return 'Image';
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

        // if none of them handle this component
        return tagName.toLocaleUpperCase();

    }else {
            return 'UNKNOWN COMPONENT'
        }
    }
}
