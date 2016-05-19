const packager = require('electron-packager');

let options = {
    arch: 'all',
    dir: './',
    platform: 'win32',
    'app-version': '1.0.0'
}

let appPaths = './';

packager(options, function (err, appPaths) { 
    if(err) console.log(err);
    else {
        console.log('done');
    }
})

