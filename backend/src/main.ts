'use strict';

import express, { Express } from 'express';
import MainTest from './main.test';
import cors from 'cors';
import { env } from 'process';
import dotenv from 'dotenv';
console.clear();
// initialization
dotenv.config(); // dot env config before every thing
const app: Express = express(); // express app instance
const { DEV_PROTOCOL,
        DEV_PORT,
        DEV_HOST,
        PRO_PROTOCOL,
        PRO_PORT,
        PRO_HOST 
      }: any = env; // our environment variables
const ENVIRONMENT = process.argv[2] ? process.argv[2] : 'UNKNOWN';

// checking for every test validations
const isOperational = new MainTest().start();
isOperational ? console.log('✅ All Tests Passed') : console.log('❌ Test Failed');
isOperational ? console.log("🔃 Running App") : console.log("🚫 Stopping App");
isOperational ? console.log('--------------------') : process.exit(1);



// environment check
console.log("- checking environment...")
if(ENVIRONMENT !== "PRO" && ENVIRONMENT !== "DEV"){
    console.log('ENVIRONMENT: UNKNOWN')
    console.log('PLEASE SET ENVIRONMENT:')
    console.log('tsx ./src/main.ts [ENVIRONMENT_VALUE]')
    console.log('ENVIRONMENT: PRO [FOR PRODUCTION] DEV [FOR DEVELOPMENT]')
    process.exit(1)
}else {
    console.log('ENVIRONMENT: ' + ENVIRONMENT);
    console.log('RUNNING: ' + ENVIRONMENT)
}



// If environment checks passed codes below run
if(ENVIRONMENT === 'PRO')
{
    console.log('running the server for production environment')
    app.listen(PRO_PORT, PRO_HOST, () => console.log(`🚀 server listening on: ${PRO_PROTOCOL}://${PRO_HOST}:${PRO_PORT}`))
}else if(ENVIRONMENT === 'DEV')
{
    console.log('running the server for development environment')
    app.listen(DEV_PORT, DEV_HOST, () => console.log(`🚀 server listening on: ${DEV_PROTOCOL}://${DEV_HOST}:${DEV_PORT}`))    
}