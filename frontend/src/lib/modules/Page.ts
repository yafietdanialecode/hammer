/**
 * Page is a class for managing and manipulating a page component
 */

import { PAGES_DATATYPE } from "../id-storage/constants.config";

export default class Page {
    
    private page: {
        id: string,
        favicon: string,
        title: string,
        meta: object[],
        links: object[],
        scripts: object[],
        description: string, 
        keyWords: string[], // list of keywords related to this page
        lastUpdated: number, // time stamp of the last updated day
        dependencies: string[],
        style: object,
        locked: boolean,
        visible: boolean
    } = {
        id: '',
        favicon: '/favicon.ico',
        title: 'no title',
        meta: [],
        links: [],
        scripts: [],
        description: 'no description', 
        keyWords: [], // list of keywords related to this page
        lastUpdated: 0, // time stamp of the last updated day
        dependencies: [],
        style: {},
        locked: false,
        visible: true
    }

    constructor(page: HTMLElement){
        if(page.getAttribute('data-type') === PAGES_DATATYPE){
            this.page.visible = page!.style.visibility == 'visible' ? true : false;
        }
    }
}