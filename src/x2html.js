function node2html (node) {
    "use strict";
    
    var maps= {
        "bold": {
            "open": '<b>',
            "close": '</b>'
        },
        "italic": {
            "open": '<i>',
            "close": '</i>'
        },
        "title": {
            "open": '<h1 style="font-size: 3em; font-weight: bold; margin-top: 0em;">',
            "close": '</h1>'
        },
        "heading1": {
            "open": '<h1>',
            "close": '</h1>'
        },
        "heading2": {
            "open": '<h2>',
            "close": '</h2>'
        },
        "heading3": {
            "open": '<h3>',
            "close": '</h3>'
        },
        "heading4": {
            "open": '<h4>',
            "close": '</h4>'
        },
        "heading5": {
            "open": '<h5>',
            "close": '</h5>'
        },
        "heading6": {
            "open": '<h6>',
            "close": '</h6>'
        },
        "paragraph": {
            "open": '<p>',
            "close": '</p>'
        },
        "bquote": {
            "open": '<blockquote style="border-left: 0.3em solid gray; margin-left: 0px; padding-left: 0.7em;">',
            "close": '</blockquote>'
        },
        "icode": {
            "open": '<code style="background-color: rgb(180,180,180); border: 1px solid black; white-space: pre-wrap;">',
            "close": '</code>'
        },
        "bcode": {
            "open": '<code><pre style="background-color: rgb(180,180,180); border: 1px solid black;">',
            "close": '</pre></code>'
        },
        "hyperlink": {
            "open": '<a href="$address$" target="$target$">',
            "close": '</a>'
        },
        "olist": {
            "open": '<ol>',
            "close": '</ol>'
        },
        "ulist": {
            "open": '<ul>',
            "close": '</ul>'
        },
        "litem": {
            "open": '<li>',
            "close": '</li>'
        }
    }
    
    function stripQuotes (txt) {
        return txt.substring (1, txt.length - 1);
    }
    
    function getNode (node) {
        var txt = "";
        
        if (Array.isArray (node)) {
            if (node[0] === "node" || Array.isArray (node[0]) && node[0][0] === "node") {
                txt += getNode (node[0][1]) + " ";
                
                for (var i = 1; i < node.length; i++) {
                    txt += getNode (node[i]) + " ";
                }

            } else {
                if (Array.isArray (node[0]) && node[0][0] === "hyperlink")
                    var tmpmap = "hyperlink";
                else
                    var tmpmap = node[0];
                
                var map = maps[tmpmap];
                    
                if (map) {
                    if (tmpmap === "hyperlink")
                        txt += map["open"].replace("$address$", stripQuotes (node[0][1][1])).replace("$target$", stripQuotes (node[0][2][1]));
                    
                    else
                        txt += map["open"];
                        
                    for (var i = 1; i < node.length; i++) {
                        if (tmpmap === "icode" || tmpmap === "bcode") {
                            txt += node[i].substring (1, node[i].length - 1);

                        } else {
                            txt += getNode (node[i]);
                        }
                        
                        if (tmpmap === "bcode")
                            txt += "\n";
                            
                        else if (i < node.length - 1)
                            txt += " ";
                    }
                    txt += map["close"];
                }
            } 
        } else {
            txt += node;
        }
        
        return txt;
    }
    
    return getNode (node);
}

            
function tree2html (topNode) {
    function getNode (topNode, margin) {
        if (!margin) margin = 0;
        var ret = "";
        var node = topNode;
        
        for (var i = 1; i < node.length; i++) {
            numberOfNodes++;
            ret += `<div style="background-color: rgb(208,208,208); width: 480px; border-radius: 48px; border: 4px solid rgb(64,64,64); padding: 8px; margin: 8px; margin-left: ` + margin + `px">`
                + node2html (node[i][1])
            
            if (node[i][2])
                ret += tree2html (node[i][2], 48);
            ret += `</div>`;
        }
        
        return ret;
    }
    
    return getNode (topNode);
}

