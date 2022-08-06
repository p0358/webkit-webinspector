#!/usr/bin/env node

const connect = require('connect'),
      serveStatic = require('serve-static'),
      st = require('connect-static-transform'),
      path = require('path'),
      fs = require('fs');

let version = 'latest';
let proto = 'iOS/16.0';
let port = 8080;

for (const arg of process.argv.slice(2)) {
    if (['v7', 'v8', 'latest', 'old'].includes(arg)) {
        version = arg;
    } else if (arg.startsWith('proto=')) {
        proto = arg.substr(6);
    } else {
        port = arg;
    }
}

const staticPath = path.join(__dirname, 'lib', 'WebInspectorUI', version);
const protoPath = path.join(__dirname, 'lib', 'WebInspectorUI', version, 'Protocol', 'Legacy', proto, 'InspectorBackendCommands.js'); //Protocol/Legacy/iOS/13.4/InspectorBackendCommands.js
if (!fs.existsSync(staticPath))
    console.error('Inspector version does not exist');
else if (!fs.existsSync(protoPath))
    console.error('Such protocol version does not exist');
else
    console.log('Using version:', version, 'protocol:', proto, 'port:', port);

connect()
    .use(st({
        root: staticPath,
        match: /Main\.html/,
        transform: function (path, text, send) {
            let protoVersionScript = `
                <script>
                    InspectorFrontendHost.backendCommandsURL = "Protocol/Legacy/${proto}/InspectorBackendCommands.js";
                </script>
            `;
            let newText = text.replace(/(<script src="Base\/BrowserInspectorFrontendHost\.js"><\/script>)/, '$1' + protoVersionScript);
            send(newText, {'Content-Type': 'text/html'});
        }
    }))
    .use(st({
        root: staticPath,
        match: /.*Base\/BrowserInspectorFrontendHost\.js/,
        transform: function (path, text, send) {
            let newText = text.replace(/(this\._contextMenu \= )(WI\.SoftContextMenu\(items\)\;)/, '$1new $2');
            send(newText, {'Content-Type': 'text/javascript'});
        }
    }))
    .use(serveStatic(staticPath))
    .listen(port);
