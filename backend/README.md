# Hammer BACKEND

## Files Architecture & Purpose
- Files & Directories 
    - `.env` = for environment variables [not visible in github]
    - `.gitignore` = files and directories those wll not be pushed to git repository
    - `package.json` = typical package manager file
    - `README.md` = High level explanation of app
    - `/src` = server side source code
        - `main.ts` = app running script
        - `main.test.ts` = full test script
        - `/controllers` = endpoint req/res/next handlers
        - `/lib` = modules, classes and other scripts
        - `/services` = microservices those can work independently from the app
        - `/tests` = test scripts for each file and endpoints
    - `/bin` = compiled code [ created at runtime ]
    - `/node_modules` = typical node packages storage [ created at runtime ]