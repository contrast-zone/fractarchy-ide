module.exports = {
    save: function (fileName, contents) {
        try { 
            require ("fs").writeFileSync (fileName, contents); 
            return true;
        } catch (error) { 
            return false;
        } 

        /*
        require("fs").writeFile(fileName, contents, err => {
            if (err) {
                //console.error(err);
            }
            // file written successfully
        });
        */
    }
};

