# webkit-webinspector
Standalone Webkit WebInspector frontend extracted from Webkit [sources](http://trac.webkit.org/browser/trunk/Source/WebInspectorUI).

You can use this tool to remotely debug a page on iOS device without a Mac computer and Apple tooling.

Note that you need to use a WebKit browser on your PC in order to load the inspector properly:
* Windows: https://playwright.azureedge.net/builds/webkit/1508/webkit-win64.zip (open Playwright.exe after unpacking)
* Linux: try Epiphany, WebKitGTK or WPE
* Mac: use Safari

## Screenshots

<p float="left" align="middle">
  <img src="https://user-images.githubusercontent.com/5182588/183248629-dadf0a22-8b00-475c-9dad-03340f109e09.png" width="30%" />
  <img src="https://user-images.githubusercontent.com/5182588/183248791-6cbd8e13-5bba-4055-bd08-0a02382b184b.png" width="63%"  /> 
</p>


## Prerequisite
To debug iOS devices you need to have [ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy) installed and running. This tool is able to redirect the raw WebKit inspector websocket using USB and expose it on the network, which is very convenient for us. Follow its installation instructions in order to get your device configured and the tool running and ensure you successfully got a log entry like `Connected :9222 to iPhone` in its console:
```
>ios_webkit_debug_proxy
Listing devices on :9221
Connected :9222 to iPhone (aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)
```

## Usage
To start static server, run

    node server.js

By default server will start on 8080, you can change server port providing the command-line argument, e.g. `./server.js 8000`. Press CTRL+C to quit.

You can switch between versions using `vX` argument, allowed values are v7, v8, old, latest (default value).

    ./server v7
    
You can switch between **protocol versions** using `proto=X` argument. Check out `lib/WebInspectorUI/latest/Protocol/Legacy` folder for allowed values.

    ./server proto=iOS/15.4

Now just navigate to `http://localhost:8080/Main.html?ws=localhost:9222/devtools/page/1` **in your WebKit browser**.

`ws=...` part can be taken from `http://localhost:9222`, "frontend" page of ios-webkit-debug-proxy tool:
```html
<html><head><title>iPhone</title></head><body>Inspectable pages for <a title="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">iPhone</a>:<p><ol>
<li value="1"><a href="/devtools/devtools.html?ws=localhost:9222/devtools/page/1" title="">about:blank</a></li>
</ol></body></html>
```
