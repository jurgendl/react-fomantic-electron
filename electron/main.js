import {app, BrowserWindow, Menu, ShareMenu, clipboard, nativeTheme} from 'electron';
import path from 'path';
import {fileURLToPath} from 'url';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('App is packaged?', app.isPackaged);

    // vite → NODE_ENV=development
// vite build → NODE_ENV=production
// vite preview → NODE_ENV=production
console.log('NODE_ENV',process.env.NODE_ENV);

const dev = isDev;

//if(dev) console.log("process", process);
if(dev) console.log("__dirname", __dirname);// electron
if(dev) console.log("__filename", __filename);// electron\main.js

// Handling Squirrel Events
//
// Squirrel will spawn your app with command line flags on first run, updates, and uninstalls. it is very important that your app handle these events as early as possible, and quit immediately after handling them. Squirrel will give your app a short amount of time (~15sec) to apply these operations and quit.
//
// The electron-squirrel-startup module will handle the most common events for you, such as managing desktop shortcuts. Just add the following to the top of your main.js and you're good to go:
//
// Notice that the first time the installer launches your app, your app will see a --squirrel-firstrun flag. This allows you to do things like showing up a splash screen or presenting a settings UI. Another thing to be aware of is that, since the app is spawned by squirrel and squirrel acquires a file lock during installation, you won't be able to successfully check for app updates till a few seconds later when squirrel releases the lock.
function handleSquirrelEvent() {
    if (process.argv.length === 1) return false;

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;
        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {
            //
        }
        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
}

let mainWindow;

function createWindow() {
    // ----------------------------------------------------------------
    // Run a command, e.g., `ls` or `dir`
    /*exec('dir', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
        if (stderr) {
            console.error(`Errors: ${stderr}`);
        }
    });*/
    // ----------------------------------------------------------------

    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1000,
        autoHideMenuBar: !dev,
        icon: 'icon.png',
        darkTheme: false,
        maximizable: true,
        webPreferences: {
            preload: path.join(__dirname, '../electron/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

    nativeTheme.themeSource = 'light'; // light, dark

    if(false)
    if (process.platform === 'darwin') {
        const shareMenu = new ShareMenu({
            text: 'Online version',
            url: 'https://www.electronjs.org/',
        });

        const menu = Menu.buildFromTemplate([
            {
                label: 'Menu',
                submenu: [
                    {
                        label: 'Online version',
                        click: () => {
                            shareMenu.popup({window: mainWindow});
                        },
                    },
                ],
            },
        ]);
        Menu.setApplicationMenu(menu);
    } else {
        // Fallback for unsupported platforms
        const menu = Menu.buildFromTemplate([
            {
                label: 'Menu',
                submenu: [
                    {
                        label: 'Online version',
                        click: () => {
                            clipboard.writeText('https://www.electronjs.org/');
                            console.log('Link copied to clipboard!');
                        },
                    },
                ],
            },
        ]);
        Menu.setApplicationMenu(menu);
    }

    // Open the DevTools.
    if(dev) mainWindow.webContents.openDevTools(); // this is optional thing, use it if you see a devTool window opened
}

console.log('Main process starting');

// this should be placed at top of main.js to handle setup events quickly
if (!handleSquirrelEvent()) {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
        //additional logic here
    }).then(createWindow);

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

console.log('Main process started');