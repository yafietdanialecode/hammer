import Controller from '../lib/Controller';
import { Express } from 'express';

export default class Get extends Controller {

    constructor(path: string, app: Express) {
        super(path, app);

        //  ../
        this.renderPage('plain', '/');
    }
}