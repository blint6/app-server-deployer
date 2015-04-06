/*eslint-disable no-process-exit*/

let serverName, sendInterval;

if (process.argv.length > 2)
    serverName = process.argv[3];
if (process.argv.length > 3)
    sendInterval = parseInt(process.argv[4]);

function print(str) {
    process.stdout.write(str);
}
function printLn(str) {
    print(str + '\n');
}

if (sendInterval && sendInterval > 0) {

    printLn('Initializing test server');

    let i = 0;
    setInterval(function () {
        printLn(i + ' Some data from ' + serverName);
        i += 1;
    }, sendInterval);
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk === 'stop') {
        process.stdout.end('Now stopping test server ' + serverName, function () {
            process.exit(0);
        });
    } else if (chunk !== null) {
        print('Received: ' + chunk);
    }
});
