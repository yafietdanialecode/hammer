import Elem from "../lib/modules/Elem";

const InputSection = (props: any) => {
    if(props.type == 'color-and-text'){
        return ( 
            <label className="label">
            <span>{props.label}</span>
            <div className="section-tools"><input
            onChange={(e: any) => Elem.id(props.element)!.style[props.applyTo] = e.target.value}
            type="color"/> <input onChange={(e: any) => Elem.id(props.element)!.style[props.applyTo] = e.target.value} type="text" /></div>
          </label> );
    }else if(props.type == 'text'){
        return ( 
            <label className="label">
            <span>{props.label}</span>
            <input type="text" />
          </label> );    
    }else if(props.type == 'selection'){
        return (
        <label className="label">
        <span>{props.label}</span>
        <select>
            {props.options.map((each: any) => <option key={each.key} value={each.value}>{each.name}</option>)}
        </select>
      </label>
        )
    }
}
 
export default InputSection;