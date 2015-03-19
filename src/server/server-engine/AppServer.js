let EventEmitter = require('event').EventEmitter;

class AppServer extends EventEmitter {

    run() {
        this.process = this.spawnServer();

        if (typeof this.handleOutData === 'function')
            this.process.stdout.on('data', this.handleOutData.bind(this));

        if (typeof this.handleOutError === 'function')
            this.process.stderr.on('data', this.handleOutError.bind(this));

        if (typeof this.handleClose === 'function')
            this.process.on('close', this.handleClose.bind(this));
    }

    handleClose(code, signal) {
        if (code === 0) {
            if (signal)
                console.info('Server closed - got signal', signal);
            else
                console.info('Server closed successfully');
        } else
            console.error('Server exited with code', code);
    }
}

module.exports = AppServer;