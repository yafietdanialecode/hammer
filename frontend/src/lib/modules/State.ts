import Elem from "./Elem";
import Style from "./Style";

export default class State {

    static update(seleElement: string, set_elemPosition: any){
    // updating the position of element and size of element
    if(Elem.id(seleElement)!){
    set_elemPosition({
      l: Style.left(seleElement),
      t: Style.top(seleElement),
      b: Style.bottom(seleElement),
      r: Style.right(seleElement),
      h: Style.height(seleElement),
      w: Style.width(seleElement)
    })
  }
    }
}