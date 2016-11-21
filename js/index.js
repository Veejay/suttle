const { ipcRenderer } = require('electron')

const directoryPicker = document.querySelector('.directory-picker')

directoryPicker.addEventListener('change', (event) => {
  const paths = event.target.files
  const directoryPath = paths[0].path
  ipcRenderer.send('directory:list', directoryPath)
  ipcRenderer.once('directory:list', (event, entries) => {
    const items = entries.reduce((acc, entry) => {
      acc += `
      <li class="directory-entry">
        <i class="fa fa-2x fa-file-video-o"></i> ${entry}
      </li><button class="downloader" data-file="${entry}">Download subtitle</button>
      `
      return acc
    }, '')
    document.querySelector('div.file-list ul').innerHTML = items
  })
})

const container = document.querySelector('div.file-list')

container.addEventListener('click', (event) => {
  if (Object.is(event.target.tagName, 'BUTTON')) {
    const button = event.target
    const fileName = button.dataset.file
    ipcRenderer.send('download:subtitle', fileName)
  }
})

ipcRenderer.on('download:subtitle', (event, path) => {
  console.log(`Downloaded the subtitle to ${path}`)
})
