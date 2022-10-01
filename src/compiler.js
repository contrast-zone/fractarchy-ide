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
                    "open": `<h1 style="overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h1>'
                },
                "heading2": {
                    "open": `<h2 style="overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h2>'
                },
                "heading3": {
                    "open": `<h3 style="overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h3>'
                },
                "heading4": {
                    "open": `<h4 style="overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h4>'
                },
                "heading5": {
                    "open": `<h5 style="overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h5>'
                },
                "heading6": {
                    "open": `<h6 style="overflow: hidden; color: ${env.ovalForeColor2}; border-bottom: 1px solid ${env.ovalForeColor2};">`,
                    "close": '</h6>'
                },
                "paragraph": {
                    "open": '<p>',
                    "close": '</p>'
                },
                "bquote": {
                    "open": `<blockquote style="border-left: 0.2em solid ${env.ovalForeColor}; margin-left: 0px; padding-left: 0.7em;">`,
                    "close": '</blockquote>'
                },
                "icode": {
                    "open": `<code style="/*background-color: rgb(180,180,180);*/ border: 1px solid ${env.ovalForeColor}; white-space: pre-wrap; font-size: 0.9em;">`,
                    "close": '</code>'
                },
                "bcode": {
                    "open": `<code><pre style="/*background-color: rgb(180,180,180);*/ border: 1px solid ${env.ovalForeColor}; overflow-x: auto; font-size: 0.9em;">`,
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
                },
                "clist": {
                    "open": '<ul style="list-style-type: none; margin:0; padding-left:1em">',
                    "close": '</ul>'
                },
                "eitem": {
                    "open": '<li><b>☐</b>&nbsp;&nbsp;',
                    "close": '</li>'
                },
                "xitem": {
                    "open": '<li><b>☒</b>&nbsp;&nbsp;',
                    "close": '</li>'
                },
                "yitem": {
                    "open": '<li><b>☑</b>&nbsp;&nbsp;',
                    "close": '</li>'
                },
                "image": {
                    "open": '<img src="$source$" width="100%">',
                    "close": '</img>'
                }
            }
            
            function stripQuotes (txt) {
                return txt.substring (1, txt.length - 1);
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
                            if (tmpmap === "hyperlink") {
                                txt += map["open"].replace("$address$", stripQuotes (node[0][1][1])).replace("$target$", stripQuotes (node[0][2][1]));
                            
                            } else if (tmpmap === "image") {
                                if (stripQuotes (node[1][1]).substring(0, 7) === "http://" || stripQuotes (node[1][1]).substring(0, 8) === "https://") {
                                    txt += map["open"].replace("$source$", stripQuotes (node[1][1]));
                                    
                                } else if (baseUrl.substring(0, 1) === "/") {
                                    txt += map["open"].replace("$source$", "open-file?fname=" + encodeURIComponent (baseUrl + "/" + stripQuotes (node[1][1])));
                                } else {
                                    txt += map["open"].replace("$source$", baseUrl + "/" + stripQuotes (node[1][1]));
                                }
                            
                            } else {
                                txt += map["open"];
                            }
                                
                            for (var i = 1; i < node.length; i++) {
                                if (tmpmap === "icode" || tmpmap === "bcode") {
                                    txt += stripQuotes (node[i]);

                                } else {
                                    txt += getNode (node[i]);
                                }
                                
                                if (tmpmap === "bcode")
                                    txt += "\n";
                                    
                                else if (i < node.length - 1) {
                                    if (node[i + 1] !== ":" && node[i + 1] !== "," && node[i + 1] !== "." && node[i + 1] !== "...")
                                        txt += " ";
                                }
                            }
                            txt += map["close"];
                        }
                    } 
                } else {
                    txt += node;
                }
                
                return txt;
            }
            
            //width = 1920 / window.innerWidth * 480;
            //var ret = `<section style="overflow: hidden;">` + getNode(node) + `</div>`;
            //return ret;
            
            return getNode (node) + (fromPrint? "": "<br/>");
        }

                    
        function tree2html (topNode, baseUrl, width, env) {
            function getNode (topNode, margin) {
                if (!margin) margin = 0;
                var ret = "";
                var node = topNode;
                
                for (var i = 1; i < node.length; i++) {
                    numberOfNodes++;
                    //ret += `<div style="background-color: rgb(208,208,208); width: ${width}em; border-radius: 2em; border: 0.2em solid rgb(64,64,64); padding: 1em; margin: 1em; margin-left: ` + margin + `;">`
                    ret += `<div style="background-color: ${env.ovalBackColor}; color: ${env.ovalForeColor}; width: ${width}em; border-radius: 2em; border: 0.2em solid rgb(64,64,64); padding: 1em; /*margin: 1em; margin-left: ` + margin + `;*/">`
                        + node2html (node[i][1], baseUrl, true, env)
                    
                    if (node[i][2])
                        ret += getNode (node[i][2]);//tree2html (node[i][2]);
                    ret += `</div>`;
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

