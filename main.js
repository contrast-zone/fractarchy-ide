const https = require('https');

var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');

var files = require ("./src/file-funcs.js");

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
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);
