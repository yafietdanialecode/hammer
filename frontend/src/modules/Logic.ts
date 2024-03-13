
class Logic {

    public ROOT_ID = 'root'
    public CANVAS_ID = 'canvas';
    public CANVA_ELEMENT_EXCEPTION = [
        'selected-elements-wrapper', 
        'select',
        'canvas'
    ];


    constructor(root: string, options: any) {
        this.CANVAS_ID = options.CANVAS_ID;
        this.ROOT_ID = root;
    }

    selectAll(exceptions: string[], selectElementsMethod: any){
        let elements = document.getElementById('canvas')?.querySelectorAll('*');
        let res: any = [];
        elements!.forEach((each: any) => {
            if(exceptions.every((id: any) => id !== each.id)){
                res.push(each.id);
            }
        })
        selectElementsMethod(res);
    }


}

export default Logic;