const InputSection = (props: any) => {
    if(props.type == 'color-and-text'){
        return ( 
            <label className="label">
            <span>{props.label}</span>
            <div className="section-tools"><input type="color"/> <input type="text" /></div>
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