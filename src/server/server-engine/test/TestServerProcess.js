/*eslint-disable no-process-exit*/

let serverName, sendIntervalId = null, sendInterval;

if (process.argv.length > 2)
    serverName = process.argv[2];
if (process.argv.length > 3)
    sendInterval = parseInt(process.argv[3]);

function print(str, strm = 'stdout') {
    process[strm].write(str);
}
function printLn(str, strm = 'stdout') {
    print(str + '\n', strm);
}

if (sendInterval && sendInterval > 0) {
    printLn('Initializing test server');

    let i = 0;
    sendIntervalId = setInterval(function () {
        printLn(i + ' Some data from ' + serverName);
        i += 1;
    }, sendInterval);
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function () {
    var chunk = process.stdin.read();

    if (chunk.match(/^error\r?\n?/)) {
        printLn('Sample error', 'stderr');
    } else if (chunk.match(/^stop\r?\n?/)) {
        printLn('Now stopping test server ' + serverName);
        process.stdin.removeAllListeners();

        if (sendIntervalId !== null)
            clearInterval(sendIntervalId);

        process.exit();
    } else if (chunk !== null) {
        print('Received: ' + chunk);
    }
});
