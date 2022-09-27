module.exports = {
    open: function (fileName) {
        const fs = require('fs');
        try { 
            return fs.readFileSync (fileName); 
            
        } catch (error) { 
            return false;
        } 
    },
    
    save: function (fileName, contents) {
        const fs = require('fs');
        try { 
            fs.writeFileSync (fileName, contents); 
            return true;
            
        } catch (error) { 
            return false;
        } 
    },
    
    readDir: function (folder) {
        const fs = require('fs');
        var flist = [];
        
        if (folder === "") folder = "/";
        
        try {
            var fnames = fs.readdirSync(folder);
        } catch (e) {
            console.log(e)
            return "Error reading directory: '" + folder + "'";
        }
        
        fnames = fnames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

        fnames.forEach(file => {
            var stats = fs.lstatSync(folder + "/" + file);
            var fsize = Math.round (stats.size / 1024);
            var mtime = stats.mtime.toISOString().split('T')[0] + " " + stats.mtime.toISOString().split('T')[1].substring(0, 8);

            flist.push ({fname: file, fsize: fsize + "kb", mtime: mtime, isDir: stats.isDirectory()});
        });
        
        return flist;
    },
    
    getAbsolutePath: function (fileName) {
        resolve = require('path').resolve;
        return resolve(fileName);
    },
    
    getHomeDir: function () {
        var os = require('os');
        return os.homedir();
    }
};

