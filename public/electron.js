const electron = require('electron');
// Module to control application life.
const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
// Module to create native browser window.
//const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 768, webPreferences: { nodeIntegration: true, webSecurity: false }});


    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}
const template = [
  {
     label: 'File',
     submenu: [
       {
         label: 'Load PDF',
         accelerator: 'CommandOrControl+O',
         click(item, focusedWindow) {
           if (focusedWindow) {
             return getFileFromUser(focusedWindow);
           }

           const newWindow = createWindow();

           newWindow.on('show', () => {
             getFileFromUser(newWindow);
           });
         },
       }, // “Save File” and “Export HTML” menus are defined here.
        {
           label: 'Save Annotations',
           click(item, focusedWindow) {
             if (focusedWindow) {
               return saveFile(focusedWindow);
             }

           },
        },
        {
          label: 'Load Schema',
          click(item, focusedWindow) {
            if (focusedWindow) {
              return getSchemaFileFromUser(focusedWindow);
            }

            const newWindow = createWindow();

            newWindow.on('show', () => {
              getSchemaFileFromUser(newWindow);
            });
          },
        } // “Save File” and “Export HTML” menus are defined here.
     ]
  },
   {
      label: 'Edit',
      submenu: [
         {
            role: 'undo'
         },
         {
            role: 'redo'
         },
         {
            type: 'separator'
         },
         {
            role: 'cut'
         },
         {
            role: 'copy'
         },
         {
            role: 'paste'
         }
      ]
   },
   {
      label: 'Annotate',
      submenu: [
        {
          label: 'Auto',
          click(item, focusedWindow) {
            if (focusedWindow) {
              return autoAnnotate(focusedWindow);
            }

          },
        }, // “Save File” and “Export HTML” menus are defined here.
         {
            label: 'Reset',
            click(item, focusedWindow) {
              if (focusedWindow) {
                //return saveFile(focusedWindow);
              }

            },
         }
      ]
   },
   {
      label: 'View',
      submenu: [
         {
            role: 'reload'
         },
         {
            role: 'toggledevtools'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom'
         },
         {
            role: 'zoomin'
         },
         {
            role: 'zoomout'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   },

   {
      role: 'window',
      submenu: [
         {
            role: 'minimize'
         },
         {
            role: 'close'
         }
      ]
   },

   {
      role: 'help',
      submenu: [
         {
            label: 'Learn More'
         }
      ]
   }
]

//replicate default macOS application menu
if (process.platform === 'darwin') {
  const name = 'PDFnotTron';
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: 'about',
      },
      { type: 'separator' },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      { type: 'separator' },
      {
        label: `Hide ${name}`,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      { type: 'separator' },
      {
        label: `Quit ${name}`,
        accelerator: 'Command+Q',
        click() { app.quit(); },
      },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

async function getFileFromUser(targetWindow) {
  const filesAsync = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'PDF Documents', extensions: ['pdf'] }
    ]
  });
  const files = await filesAsync;
  //console.log(files.filePaths);
  if (files) {
    openFile(targetWindow, files.filePaths[0]);
  }
};

async function getSchemaFileFromUser(targetWindow) {
  const filesAsync = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'JSON Documents', extensions: ['json'] }
    ]
  });
  const files = await filesAsync;
  //console.log(files.filePaths);
  if (files) {
    openSchemaFile(targetWindow, files.filePaths[0]);
  }
};

const openSchemaFile = exports.openSchemaFile = (targetWindow, file) => {

  //const content = fs.readFileSync(file);
  //startWatchingFile(targetWindow, file);
  //app.addRecentDocument(file);
  //targetWindow.setRepresentedFilename(file);
  var content = {};


  //const exists = fs.existsSync(fullpath);
  //if (exists) {
  //  console.log("exists")
  //  highlights = fs.readFileSync(fullpath, 'utf-8');
  //}
  try {
    content = JSON.parse(fs.readFileSync(file));
  } catch (err) {
    //console.log(err);
  }
  //console.log(JSON.stringify(highlights));
  targetWindow.webContents.send('schema-file-opened', content);

};

const openFile = exports.openFile = (targetWindow, file) => {

  const content = fs.readFileSync(file);
  //startWatchingFile(targetWindow, file);
  //app.addRecentDocument(file);
  //targetWindow.setRepresentedFilename(file);
  var highlights = {};
  highlights.highlights = [];
  const fullpath = path.join(app.getPath('appData'), 'pdfnottron', path.basename(file) + ".json")
  console.log(fullpath);

  //const exists = fs.existsSync(fullpath);
  //if (exists) {
  //  console.log("exists")
  //  highlights = fs.readFileSync(fullpath, 'utf-8');
  //}
  try {
    highlights = JSON.parse(fs.readFileSync(fullpath));
  } catch (err) {
    //console.log(err);
  }
  //console.log(JSON.stringify(highlights));
  targetWindow.webContents.send('file-opened', file, content, highlights);

};

const saveFile = (targetWindow) => {
  const app_path = path.join(app.getPath('appData'), 'pdfnottron');
  targetWindow.webContents.send('save-file', app_path);

  const options = {
    type: 'question',
    buttons: ['Ok'],
    defaultId: 2,
    title: 'Save',
    message: 'Annotations Saved',
    detail: app_path,
  };

  dialog.showMessageBox(null, options, (response, checkboxChecked) => {
    console.log(response);
    console.log(checkboxChecked);
  });
}

const autoAnnotate = (targetWindow) => {

  targetWindow.webContents.send('auto-annotate');

}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
