const fs = require('fs');
const archiver = require('archiver');


var output = fs.createWriteStream('dist.zip')
var archive = archiver('zip')

archive.pipe(output)
archive.directory('dist', '')
output.on('close', () => { console.log('dist.zip created successfully') })
archive.on('error', err => { console.error(err) })

archive.finalize()
