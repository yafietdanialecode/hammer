import Elem from "../lib/modules/Elem";

const InputSection = (props: any) => {
    if(props.type == 'color-and-text'){
        if(props.applyTo == 'stroke'){
            return ( 
                <label className="label">
                <span>{props.label}</span>
                <div className="section-tools"><input
                onChange={(e: any) => {
                    function rgbToHex(rgb: string) {
                        const hex = parseInt(rgb, 10).toString(16);
                        return hex.length === 1 ? "0" + hex : hex;
                    }
                    
                    const r = rgbToHex(e.target.value.slice(1, 3));
                    const g = rgbToHex(e.target.value.slice(3, 5));
                    const b = rgbToHex(e.target.value.slice(5, 7));
                    
                    const childs = Elem.id(props.element)!.querySelectorAll('*');  
                    childs.forEach((child: any) => child.setAttribute('stroke', "#" + r + g + b))
                              
                }}
                type="color"/> <input 
                onChange={() => 
                {
                    const childs = Elem.id(props.element)!.querySelectorAll('*');  
                    childs.forEach((child: any) => child.setAttribute('stroke', props.value))          

                }} type="text" /></div>
              </label> );
        }else {
            return ( 
                <label className="label">
                <span>{props.label}</span>
                <div className="section-tools"><input
                value={props.value}
                onChange={(e: any) => {
                    Elem.id(props.element)!.style[props.applyTo] = e.target.value            
                }}
                type="color"/> <input value={props.value} onChange={(e: any) => Elem.id(props.element)!.style[props.applyTo] = e.target.value} type="text" /></div>
              </label> );
        }
    }else if(props.type == 'text'){
        return ( 
            <label className="label">
            <span>{props.label}</span>
            <input
            value={props.value}
            onChange={(e: any) => Elem.id(props.element)!.style[props.applyTo] = e.target.value}
            type="text" />
          </label> );    
    }else if(props.type == 'selection'){
        return (
        <label className="label">
        <span>{props.label}</span>
        <select 
        value={props.value}
        onChange={(e: any) => Elem.id(props.element)!.style[props.applyTo] = e.target.value}>
            {props.options.map((each: any) => <option key={each.key} value={each.value}>{each.name}</option>)}
        </select>
      </label>
        )
    }

}
 
export default InputSection;
