/*eslint-disable no-process-exit*/

function printLn(str) {
    process.stdout.write(str + '\n');
}

printLn('Initializing test server');

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk === 'stop') {
        process.stdout.end('Now stopping test server', function () {
            process.exit(0);
        });
    } else if (chunk !== null) {
        printLn('Received: ' + chunk);
    }
});

setInterval(function () {
    printLn('Some data from the server');
}, 2000);
