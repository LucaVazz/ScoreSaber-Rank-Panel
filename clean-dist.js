const del = require('del')


;(async () => {
    console.log('Cleaning dist...')
    const deletedPaths = await del(
        ['*.11ty.js', 'panel'],
        { cwd: './dist' }
    )
    console.log(`done. deleted:${['', ...deletedPaths].join('\n  - ')}`)
})()
