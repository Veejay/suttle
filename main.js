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
  win = new BrowserWindow({ width: 800, height: 600, backgroundColor: '#222' })

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

  const readDirectory = (path) => {
    console.log('RELATIVE SUBTITLE DIRECTORY PATH: ', path)
    return new Promise((resolve, reject) => {
      fs.readdir(path, (error, entries) => {
        if (error) {
          reject(error)
        } else {
          resolve({entries, path})
        }
      })
    })
  }

  const findSubtitle = ({entries, path}) => {
    console.log('FILES IN DIRECTORY: ', entries)
    console.log('PATH TO SUBTITLE DIRECTORY', path)
    return new Promise((resolve, reject) => {
      for (let entry of entries) {
        if (Object.is(pathname.extname(entry), '.srt')) {
          resolve(pathname.join(path, entry))
        }
      }
      reject(new Error('No subtitle in this directory'))
    })
  }

  const renameSubtitle = (path, newPath) => {
    console.log('FORMER PATH TO SUBTITLE FILE: ', path)
    console.log('NEW PATH TO SUBTITLE FILE: ', newPath)
    return new Promise((resolve, reject) => {
      fs.rename(path, newPath, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(pathname.parse(path).dir)
        }
      })
    })
  }

  const cleanup = (path) => {
    return new Promise((resolve, reject) => {
      console.log('Cleaning up...')
      rimraf(path, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  ipcMain.on('download:subtitle', (event, videoPath) => {
    const downloader = new SubtitleDownloader(videoPath)
    console.log('PATH TO VIDEO FILE: ', videoPath)
    const pathInfo = pathname.parse(videoPath)
    // The directory extracted from the ZIP archive will be saved to DIR/NAME where
    // DIR is the directory of the video file and NAME is the name of the video file without extension
    const subtitlePath = pathname.join(pathInfo.dir, pathInfo.name)
    downloader
      .saveAs(subtitlePath)
      .then(readDirectory)
      .then(findSubtitle)
      .then(result => {
        console.log(result)
        return renameSubtitle(result, pathname.join(pathInfo.dir, `${pathname.basename(videoPath, '.mkv')}.srt`))
      })
      .then(cleanup)
      .then(done => {
        event.sender.send('download:subtitle', videoPath)
      }).catch(console.error)
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
