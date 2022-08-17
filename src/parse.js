var parsesexpr = (
    (function () {
        "use strict";
        
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
