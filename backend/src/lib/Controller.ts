import {Express} from 'express';
import OutCome from './OutCome';
import { RENDERING_TYPES } from './types/controller-types';
import fs from 'node:fs';

export default class Controller {

    private path = "/";
    private app: Express;

    constructor(path: string, app: Express){
        this.path = path;
        this.app = app;
    }

    public async renderPage(type: RENDERING_TYPES, path?: string): Promise<OutCome>{
        
        /**
         * this is the object who contains the info object
         */
        
        let outcome = new OutCome();
        
        if(type && path){
            if(type == 'file')
                // first check the file exists
                await fs.open(path, null, null)
            
        }else {
            console.log("Controller.renderPage() > please provide nessecery parameters]");
            outcome.setStatus(503);
            outcome.setFileSize(0);
            outcome.setMessage("Look Like There Is A Problem In the code itself invalid arguments provided for Controller.renderPage()")
            
        }

        
        return outcome;
    }
}