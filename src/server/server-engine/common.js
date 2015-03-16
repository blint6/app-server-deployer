let fs = require('fs');
let spawn = require('child_process').spawn;
let Promise = require('rsvp').Promise;
Tail = require('tail').Tail;

function check(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                if (err.message.match(/no such file/)) {
                    // No directory
                    fs.mkdir(path, err => {
                        if (err) reject(Error('Could not create server directory', err));
                        else resolve();
                    });
                } else {
                    reject(Error(`Invalid server directory ${path}`, err));
                }
            } else {
                // Directory exists
                if (files.length)
                    reject(Error(`Server directory is not empty (${path})`, err))
                else
                    resolve();
            }
        });
    });
}

function installJar(engine, path, jar) {
    return check(path)
        .then(() => new Promise((resolve, reject) => {
            let extract = spawn('jar', ['xf', jar], {
                cwd: path
            });

            extract.stdout.on('data', data => {
                console.debug(jar, 'extract:', data);
            });

            extract.stderr.on('data', data => {
                console.error('Error while extracting', jar, ':', data);
            });

            extract.on('close', code => {
                if (code === 0)
                    resolve();
                else
                    reject(Error(`${jar} extract failed with code ${code}`));
            });
        }));
}

function wrap(server) {
    return server;
}

function install(engine, path, options) {
    Promise.resolve(engine(path, options))
        .then(wrap);
}

module.exports.check = check;
module.exports.install = install;
