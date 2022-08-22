var parser = (function (obj) {
    return {
        parsesexpr: obj.parsesexpr,
        stringify: obj.stringify,
        getCoords: obj.getCoords
    }
}) (
    (function () {
        "use strict";
        var parsesexpr = (
            (function () {
                
                var parse = function (text, tmout) {
                    var ret;

                    ret = deepParse (text, 0);
                    
                    if (ret.err)
                        return ret;
                    
                    else if (ret.pos === text.length)
                        return flatten (ret.arr);
                    
                    else
                        return {err: "unexpected characters", pos: ret.pos};
                }

                var deepParse = function (text, pos) {
                    var lastToken = pos;
                    var arr = [null, null], array;
                    var i = skipWhitespace (text, pos);
                                
                    if (false && text.substr (i, 2) === "/*")
                        return {err: "unterminated comment", pos: i};
                    
                    else if (text.charAt(i) === "(")
                        i++;
                    
                    else
                        return {err: "expected '('", pos: i};
                    
                    do {
                        i = skipWhitespace (text, i);
                        if (false && text.substr (i, 2) === "/*")
                            return {err: "unterminated comment", pos: i};
                        
                        lastToken = i;
                        if (text.charAt (i) === "(") {
                            var ret = deepParse (text, i);
                            
                            if (ret.err)
                                return ret;
                            
                            arr = insert (arr, ret.arr);
                            i = ret.pos;
                            
                        } else if (text.charAt (i) === '"') {
                            do {
                                if (text.charAt (i) === "\\")
                                    i += 2;
                                
                                else
                                    i++;
                                
                            } while ('"\n'.indexOf (text.charAt (i)) === -1 && i < text.length);
                            
                            if (text.charAt (i) === '"') {
                                try {
                                    i++;
                                    arr = insert (arr, '"' + JSON.parse(text.substring (lastToken, i)) + '"');
                                    
                                } catch {
                                    return {err: "bad escaped character in string", pos: lastToken}
                                }
                                
                            } else
                                return {err: "unterminated string", pos: lastToken};
                            
                        } else {
                            while ('"() \t\n\r'.indexOf (text.charAt (i)) === -1 && text.substr(i, 2) !== "//" && i < text.length)
                                i++;
                            
                            if (i > lastToken)
                                arr = insert (arr, text.substring (lastToken, i));
                        }
                        
                        // if (arr[0] === null & arr[1] === null) arr = [null];
                        if (!array)                            array = arr;

                    } while (i > lastToken);
                    
                    if (text.charAt (i) === ")") {
                        i = skipWhitespace (text, i + 1);
                        if (false && text.substr (i, 2) === "/*")
                            return {err: "unterminated comment", pos: i};
                        
                        else
                            return {pos: i, arr: array};
                        
                    } else
                        return {err: "expected ')'", pos: i};
                }
                
                var insert = function (arr, node) {
                    arr[1] = [node, null];
                    
                    return arr[1];
                }
                
                var skipWhitespace = function (text, i) {
                    do {
                        var pos = i;
                        
                        while (i < text.length && " \t\n\r".indexOf(text.charAt(i)) > -1)
                            i++;

                        if (text.substr(i, 2) == "//") {
                            for (var j = i + 2; j < text.length && text.charAt(j) !== "\n"; j++);
                            if (j < text.length)
                                i = j + 1;
                            
                            else
                                i = j;

                        } else if (text.substr(i, 2) == "/*") {
                            for (var j = i + 2; j < text.length && text.substr(j, 2) !== "*/"; j++);
                            if (j < text.length)
                                i = j + 2;
                        }
                        
                    } while (i > pos);
                    
                    return i;
                }
                
                var flatten = function (node) {
                    var flat = []
                    while (Array.isArray (node)) {
                        if (Array.isArray (node[0]))
                            flat.push (flatten (node[0]));
                            
                        else
                            flat.push (node[0]);
                            
                        node = node[1]
                    }
                    
                    return flat
                }
                
                return parse;
            }) ()
        );

        var getCoords = function (text, offset) {
            var i, ch, row = 1, col = 1;
            if (text.length > 0)
                for (i = 0; i < offset; i += 1) {
                    ch = text.charCodeAt(i);
                    if (ch === 13 || ch === 10) {
                        if (ch === 13 && text.charCodeAt (i + 1) === 10)
                            i += 1;

                        row += 1;
                        col = 1;
                        
                    } else
                      col += 1;
                }
            
            return {row: row, col: col};
        };
                    
        var stringify = function (node, maxcols, indent, index) {
            var str = ""
            
            if (!indent) indent = "";
            if (!index) index = 0;
            
            var code = node[0] === "code";
            str += indent + "(\n";
            str += Array.isArray (node[0])? "": indent + "    ";
            var linechars = 0;
            for (var i = 0; i < node.length; i++) {
                if (Array.isArray (node[i])) {
                    str += ((i === 0 || Array.isArray (node[i - 1]))? "": "\n") + stringify (node[i], maxcols, indent + "    ", i);
                    str += Array.isArray (node[i + 1]) || i === node.length - 1? "": indent + "    ";
                    linechars = 0;
                    
                } else {
                    var part
                    if (node [i] === undefined)
                        part = "UNDEFINED";
                        
                    else if (node [i] === null)
                        part = "";
                        
                    else
                        part = node[i].replaceAll("\n", "\\n");
                     
                    if (code) {
                        str += (i > 0? indent + "    ": "") + part + "\n";
                    
                    } else {
                        if (linechars + part.length > maxcols) {
                           str += "\n" + indent + "    ";
                           str += part + " ";
                           linechars = part.length + 1;

                        } else {
                            str += part + " ";
                            linechars += part.length + 1;
                        }
                    }
                }
            }
            
            if (!Array.isArray (node[i - 1]) && !code) str += "\n";
            str += indent + ")\n";// + indent + "\n";
            
            return str;
        };
        
        return {
            parsesexpr: parsesexpr,
            stringify: stringify,
            getCoords: getCoords
        }
    })()
);

