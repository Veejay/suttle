const { app, BrowserWindow, ipcMain } = require('electron')
const pathname = require('path')
const url = require('url')
const SubtitleDownloader = require('./js/modules/subtitle_downloader.js')
const fs = require('fs')
const rimraf = require('rimraf')

const Directory = require('./js/modules/directory.js')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: pathname.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  ipcMain.on('directory:list', (event, path) => {
    const directory = new Directory(path)
    directory.findVideos().then(entries => {
      event.sender.send('directory:list', [...entries])
    })
  })

  ipcMain.on('download:subtitle', (event, path) => {
    const downloader = new SubtitleDownloader(path)
    const pathInfo = pathname.parse(path)
    const subtitlePath = pathname.join(pathInfo.dir, pathInfo.name)
    downloader.saveAs(subtitlePath).then(downloadPath => {
      fs.readdir(subtitlePath, (error, entries) => {
        if (error) {
          console.log(error)
        } else {
          entries.each(entry => {
            if (Object.is(pathname.extname(entry), '.srt')) {
              const info = pathname.parse(entry)
              const dir = info.dir
              dir.replace(/\/(.*)$/, '')
              fs.renameSync(entry, pathname.join(dir, info.base))
              console.log('Cleaning up')
              rimraf(subtitlePath)
              event.sender.send('download:subtitle', path)
            }
          })
        }
      })
    }).catch(error => console.log(error))
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
