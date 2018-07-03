let childProcess = require('child_process'),
    express = require('express'),
    app = express();

function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

// Now we can run a script and invoke a callback when complete, e.g.
runScript('app.js', function (err) {
    console.log("HELLO", req.headers);
    if (err) throw err;
    app.use(express.static(__dirname + '/'));
    app.use(function (req, res, next) {
        if (req.secure) {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
    var server = app.listen(8000, function () {
        console.log('Listening on port %d', server.address().port);
    });
});
