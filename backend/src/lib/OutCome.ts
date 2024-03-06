
import { HTTP_VERBS, STATUS_CODE } from './types/http-types'; 

/**
 * Outcome is Object that will be send as outcome of client serving controller
 */
export default class OutCome {
        private status: STATUS_CODE = 503;
        private fileSize = 0;
        private clientInfo = {}
        private method: HTTP_VERBS = "GET";
        private path =  "/";
        private message = "";

        /**
         * getStatus
         */
        public getStatus(): STATUS_CODE {
            return this.status;
        }

        /**
         * setStatus
         */
        public setStatus(status: STATUS_CODE): void {
            this.status = status;
        }

        /**
         * getFileSize
         */
        public getFileSize(): number {
            return this.fileSize;
        }

        /**
         * setFileSize
         */
        public setFileSize(fileSize: number):void {
            this.fileSize = fileSize;
        }

        /**
         * getClintInfo
         */
        public getClientInfo(): object {
            return this.clientInfo;
        }

        /**
         * setClientInfo
         */
        public setClientInfo(clientInfo: object):void {
            this.clientInfo = clientInfo;
        }

        /**
         * getMethod
         */
        public getMethod(): HTTP_VERBS {
            return this.method;
        }

        /**
         * setMethod
         */
        public setMethod(method: HTTP_VERBS): void {
            this.method = method;
        }

        /**
         * getPath
         */
        public getPath(): string {
            return this.path;
        }

        /**
         * setPath
         */
        public setPath(path: string): void {
            this.path = path;
        }

        /**
         * getMessage
         */
        public getMessage(): string {
            return this.message;
        }

        /**
         * setMessage
         */
        public setMessage(message: string, err?: any): void {
            this.message = message;
            if(err)
             this.message = message + '\n' + err;
        }
}