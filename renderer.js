// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const level = require('level')

var db = level('my-db')



// 2) Put a key & value
db.put('name', 'Level', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error

  // 3) Fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // Ta da!
    console.log('name=' + value)
  })
})

async function test0() {
  for (let i = 0; i < 100; i++) {
    await db.put(i, i * i);
  }
}
test0()

let viewer = document.getElementById("viewer")
let s = `<tr>
<th>key</th>
<th>value</th>
</tr>`

db.close();
// viewer.innerHTML = s

const { ipcRenderer } = require('electron')

const selectDirBtn = document.getElementById('selectFolder')

selectDirBtn.addEventListener('click', (event) => {
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', (event, path) => {
  // document.getElementById('selected-file').innerHTML = `You selected: ${path}`
  console.log(path.filePaths[0])
  let p = String(path.filePaths[0])
  console.log(p)

  let db1 = level(p)
  db1.createReadStream()
    .on('data', function (data) {
      // console.log(data.key, '=', data.value)
      viewer.innerHTML += `<tr><td>${data.key}</td><td>${data.value}</td></tr>`

    })

})
