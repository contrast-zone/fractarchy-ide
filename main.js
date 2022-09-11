const https = require('https');

var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');

var files = require ("./src/file-funcs.js");

var mimeTypes = {
      "html": "text/html",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "svg": "image/svg+xml",
      "json": "application/json",
      "js": "text/javascript",
      "css": "text/css"
    };

http.createServer(async function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;

    if (filename === "./")
    filename = "./index.html";

    if (filename === "./save-file") {
        switch (req.method) {
            case "POST": {
              const buffers = [];
              for await (const chunk of req) {
                  buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              
              var post = qs.parse(data)
              
              if (files.save(post.fdir + post.fname, post.fcontents))
                  res.end("saved");
              else
                  res.end("Error saving '" + post.fdir + post.fname + "'");
            }
            default: {
              res.end();
            }        
        }

    } else {
        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found: " + filename);
                console.log(filename);
            }
            /*
            if (filename.substring (filename.length - 3, filename.length) === "svg") {
                res.writeHead(200, {'Content-Type': mime.contentType(filename)});
                console.debug (mime.contentType(filename));
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
            }
            */
            var mimeType = mimeTypes[filename.split('.').pop()];
          
            if (!mimeType) {
                mimeType = 'text/plain';
            }
          
            res.writeHead(200, { "Content-Type": mimeType });
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);
