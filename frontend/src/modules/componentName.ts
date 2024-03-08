import gEBID from "./gEBID";


export default function componentName(id: string){
    if(gEBID(id)){
        let tagName = gEBID(id)!.tagName;
        let isPage = gEBID(id)!.getAttribute('data-type') === 'page' ? true : false;
        // let isButton = tagName === 'BUTTON';
        // let isDiv = tagName === 'DIV';
        // let isInput = tagName === 'INPUT';
        // let isText = false;
        switch(tagName.toLowerCase()){
            case "h1":
                return "Title"
                break;
            case 'h2':
                return "Article"
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