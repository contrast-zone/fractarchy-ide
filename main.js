var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    qs = require('querystring'),
    port = process.argv[2] || 8080,
    mimeTypes = {
      "html": "text/html",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "svg": "image/svg+xml",
      "json": "application/json",
      "js": "text/javascript",
      "css": "text/css"
    };

var files = require ("./src/file-funcs.js");

const options = {
  key: fs.readFileSync("./config/cert.key"),
  cert: fs.readFileSync("./config/cert.crt"),
};

//https.createServer(options, async function (request, response) {
http.createServer(async function (request, response) {
    var uri = url.parse(request.url).pathname, 
        filename = path.join(process.cwd(), uri);

    //console.log(filename);

    if (filename.split('/').pop() === "save-file") {
        switch (request.method) {
            case "POST": {
              const buffers = [];
              for await (const chunk of request) {
                  buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              
              var post = qs.parse(data)
              
              if (files.save(post.fdir + post.fname, post.fcontents))
                  response.end("File saved");
              else
                  response.end("Error saving '" + post.fdir + post.fname + "'");
            }
            default: {
              response.end();
            }        
        }
    }
    
    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {'Content-Type': 'text/html'});
            return response.end("404 Not Found: " + filename);
        }
     
        if (fs.statSync(filename).isDirectory()) 
          filename += '/index.html';
     
        fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
          
            var mimeType = mimeTypes[filename.split('.').pop()];
          
            if (!mimeType) {
                mimeType = 'text/plain';
            }
              
            response.writeHead(200, { "Content-Type": mimeType });
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

