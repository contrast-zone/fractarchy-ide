var compiler = (function (obj) {
    return {
        node2html: obj.node2html,
        tree2html: obj.tree2html
    }
}) (
    (function () {
        function node2html (node, baseUrl, fromPrint, env) {
            "use strict";
            
            env = env || {ovalForeColor: "rgb(48,48,48)", ovalForeColor2: "rgb(72,72,72)"};

            var maps= {
                "newline": {
                    "open": `<br/>`,
                    "close": ''
                },
                "hruler": {
                    "open": `<hr style="border-top: 0.2em solid ${env.ovalForeColor2}; border-bottom: 0; border-left: 0; border-right: 0;">`,
                    "close": '</hr>'
                },
                "bold": {
                    "open": '<b>',
                    "close": '</b>'
                },
                "italic": {
                    "open": '<i>',
                    "close": '</i>'
                },
                "title": {
                    "open": `<h1 style="overflow: hidden; font-size: 3em; font-weight: bold; margin-top: 0em; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h1>'
                },
                "heading1": {
                    "open": `<h1 style="font-size: 2.5em; overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h1>'
                },
                "heading2": {
                    "open": `<h2 style="font-size: 2em; overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h2>'
                },
                "heading3": {
                    "open": `<h3 style="font-size: 1.5em; overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h3>'
                },
                "heading4": {
                    "open": `<h4 style="font-size: 1.17em; overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h4>'
                },
                "heading5": {
                    "open": `<h5 style="font-size: 1em; overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h5>'
                },
                "heading6": {
                    "open": `<h6 style="font-size: 0.83em; 0.83; overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h6>'
                },
                "paragraph": {
                    "open": '<p style="font-size: 1em; overflow: hidden;">',
                    "close": '</p>'
                },
                "bquote": {
                    "open": `<blockquote style="overflow: hidden; border-left: 0.2em solid ${env.ovalForeColor2}; margin-left: 0px; padding-left: 0.9em;">`,
                    "close": '</blockquote>'
                },
                "icode": {
                    "open": `<code style="/*background-color: rgb(180,180,180);*/ color: ${env.ovalForeColor}; border: 1px solid ${"rgb(128,128,128)"/*env.ovalForeColor*/}; white-space: pre-wrap; word-break: break-all; font-size: 0.9em;">`,
                    "close": '</code>'
                },
                "bcode": {
                    "open": `<code><pre style="/*background-color: rgb(180,180,180);*/ color: ${env.ovalForeColor}; border: 1px solid ${"rgb(128,128,128)"/*env.ovalForeColor*/}; overflow-x: auto; font-size: 0.9em;">`,
                    "close": '</pre></code>'
                },
                "olist": {
                    "open": '<ol style="font-size: 1em;">',
                    "close": '</ol>'
                },
                "ulist": {
                    "open": '<ul style="font-size: 1em;">',
                    "close": '</ul>'
                },
                "litem": {
                    "open": '<li>',
                    "close": '</li>'
                },
                "clist": {
                    "open": '<ul style="font-size: 1em;/*list-style: none; margin-left:0; padding-left:1em; text-indent-1em;*/">',
                    "close": '</ul>'
                },
                "eitem": {
                    "open": '<li style="list-style-type: \'☐  \'">',
                    "close": '</li>'
                },
                "xitem": {
                    "open": '<li style="list-style-type: \'☒  \'">',
                    "close": '</li>'
                },
                "yitem": {
                    "open": '<li style="list-style-type: \'☑  \'">',
                    "close": '</li>'
                },
                "hyperlink": {
                    "open": '<a href="$address$" target="$target$" style="/*white-space: pre-wrap; word-break: break-all;*/">',
                    "close": '</a>'
                },
                "image": {
                    "open": '<img src="$source$" width="100%">',
                    "close": '</img>'
                },
                "html": {
                    "open": '',
                    "close": ''
                }
            }
            
            function stripQuotes (txt) {
                if (txt.substring(0, 1) === "\"")
                    return txt.substring (1, txt.length - 1);
                else
                    return txt
            }
            
            function getNode (node) {
                var txt = "";
                
                if (Array.isArray (node)) {
                    if (node[0] === "node" || (Array.isArray (node[0]) && node[0][0] === "node")) {
                        if (Array.isArray (node[0]) && node[0][1])
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
                            if (tmpmap === "hyperlink" && !Array.isArray (node[0][1])) {
                                txt += map["open"].replace("$address$", stripQuotes (node[0][1])).replace("$target$", "_new");
                            
                            } else if (tmpmap === "image" && !Array.isArray (node[1])) {
                                if (stripQuotes (node[1]).substring(0, 7) === "http://" || stripQuotes (node[1]).substring(0, 8) === "https://") {
                                    txt += map["open"].replace("$source$", stripQuotes (node[1]));
                                    
                                } else if (baseUrl.substring(0, 1) === "/") {
                                    if (stripQuotes (node[1]).substring(0, 1) !== "/") {
                                        txt += map["open"].replace("$source$", "open-file?fname=" + /*encodeURIComponent*/ (baseUrl + "/" + stripQuotes (node[1])));
                                    
                                    } else {
                                        txt += map["open"].replace("$source$", "open-file?fname=" + /*encodeURIComponent*/ (stripQuotes (node[1])));
                                    }
                                } else {
                                    txt += map["open"].replace("$source$", baseUrl + "/" + stripQuotes (node[1]));
                                }
                            
                            } else {
                                txt += map["open"];
                            }
                                
                            for (var i = 1; i < node.length; i++) {
                                if (tmpmap === "html") {
                                    var sq = stripQuotes (node[i])
                                        .replaceAll (/<\s*script.*?\/>/g, ' ')
                                        .replaceAll (/<\s*script.*?>.*?<\/\s*script.*?>/g, ' ')
                                        .replaceAll (/on.*?=".*?"/g, '');
                                        
                                    if (baseUrl.substring(0, 1) === "/") {
                                        txt += sq
                                            .replaceAll (/src\s*=\s*"(?!\/)(?!.*http:\/\/)(?!.*https:\/\/)(.*?)"/g, ' src="open-file?fname=' + /*encodeURIComponent*/ (baseUrl + "/") + '$1"')
                                            .replaceAll (/src\s*=\s*"(?=\/)(?!.*http:\/\/)(?!.*https:\/\/)(.*?)"/g, ' src="open-file?fname=' + '$1"');
                                            
                                    } else {
                                        txt += sq.replaceAll (/src\s*=\s*"(?!\/)(?!.*http:\/\/)(?!.*https:\/\/)(.*?)"/g, ' src="' + baseUrl + '/$1"');
                                    }
                                    
                                } else if (tmpmap === "icode" || tmpmap === "bcode") {
                                    if (!Array.isArray (node[i]))
                                        txt += stripQuotes (node[i])
                                            .replaceAll(/&/g, '&amp;')
                                            .replaceAll(/</g, '&lt;')
                                            .replaceAll(/>/g, '&gt;')
                                            .replaceAll(" ", '&nbsp;')
                                            .replaceAll("-", '&#8209;');
                                } else if (tmpmap !== "image") {
                                    if (!Array.isArray (node[i])) {
                                        if (node[i].substring(0, 1) === "\"") {
                                            txt += stripQuotes (node[i])
                                                .replaceAll("&", '&amp;')
                                                .replaceAll("<", '&lt;')
                                                .replaceAll(">", '&gt;')
                                                .replaceAll(" ", '&nbsp;')
                                                .replaceAll("-", '&#8209;');
                                                
                                        } else {
                                            txt += node[i]
                                                //.replaceAll(/&/g, '&amp;')
                                                .replaceAll(/</g, '&lt;')
                                                .replaceAll(/>/g, '&gt;');
                                        }
                                    } else
                                        txt += getNode (node[i]);
                                }
                                
                                if (i < node.length - 1) {
                                    if (tmpmap === "bcode" /*|| tmpmap === "html"*/)
                                        txt += "\n";
                                    
                                    else if (node[i + 1] !== ":" && node[i + 1] !== "," && node[i + 1] !== "." && node[i + 1] !== "?" && node[i + 1] !== "???" && node[i + 1] !== "!" && node[i + 1] !== "!!!" && node[i + 1] !== "?!" && node[i + 1] !== "?!!" && node[i + 1] !== "...")
                                        txt += " ";
                                }
                            }
                            txt += map["close"];
                        }
                    } 
                } else if (node.substring(0, 1) === "\"") {
                    txt += stripQuotes (node)
                        .replaceAll("&", '&amp;')
                        .replaceAll("<", '&lt;')
                        .replaceAll(">", '&gt;')
                        .replaceAll(" ", '&nbsp;')
                        .replaceAll("-", '&#8209;');
                        
                } else {
                    txt += node
                        //.replaceAll(/&/g, '&amp;')
                        .replaceAll(/</g, '&lt;')
                        .replaceAll(/>/g, '&gt;');
                }
                
                return txt;
            }
            
            return (node? getNode (node) + (fromPrint? "": "<br/>"): "<br/>");
        }

                    
        function tree2html (topNode, baseUrl, width, env) {
            function getNode (topNode, margin) {
                if (!margin) margin = 0;
                var ret = "";
                var node = topNode;
                
                for (var i = 1; i < node.length; i++) {
                    numberOfNodes++;
                    if (node[i]) {
                        if (node[i][1])
                            ret += `<div style="background-color: ${env.ovalBackColor}; color: ${env.ovalForeColor}; width: ${width}em; border-radius: 2em; border: 0.2em solid rgb(78,78,78); padding: 1em; margin-bottom: 1em; /*margin: 1em; margin-left: ` + margin + `;*/">`
                                + node2html (node[i][1], baseUrl, true, env)
                        
                        if (node[i][2])
                            ret += getNode (node[i][2]);
                            
                        if (node[i][1])
                            ret += `</div>`;
                    }
                }
                
                return ret;
            }
            
            return getNode (topNode, "0.2em");
        }
        
        return {
            node2html: node2html,
            tree2html: tree2html
        }
    })()
);

