#!/usr/bin/env node

var fs = require('fs');
var unzip = require('unzip');
require('./extend-buffer-tostring-encodings')(require('iconv-lite'));

var argv = require('optimist')
    .usage('Unzip: Non-ascii filenames will be decoded by given encoding.\nUsage: $0 [--list] [--enc <encoding>] <zipFileName>')
    .options('l', {
        boolean: true,
        alias: 'list',
        describe: 'list files in zipFileName'
    })
    .options('enc', {
        alias: 'e',
        describe: 'filename encoding'
    })
    .demand(1)
    .argv;


var zipPath = argv._[0];
var enc = argv.enc || 'utf8';

fs.createReadStream(zipPath)
.pipe(unzip.Parse())
.on('entry', function (entry) {
    var fileName = entry.path;
    var fileName2 = entry.pathRaw.toString(enc);
    var type = entry.type; // 'Directory' or 'File'
    var size = entry.size;

    console.log(fileName2);

    if (!argv.list) {
        if (type == 'Directory') {
            fs.mkdirSync(fileName2);
        }
        else {
            entry.pipe(fs.createWriteStream(fileName2));
        }
    }
    entry.autodrain();
});
