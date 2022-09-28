var editor = (function (obj) {
    return {
        edit: obj.edit,
        hilight: obj.hilight
    }
}) (
    (function () {
        function tag (str) {
            return `((?<=\\((\\s|·)*)${str}(?=(\\s|·)))`
        }

        var opt = {
            font: "1em monospace",
            tabWidth: 4,
            colorText: "rgb(208,208,208)",
            colorTextBack: "transparent",
            colorSelection: "white",
            colorSelectionBack: "gray",
            colorKeyword: "rgb(128,128,128)",
            colorKeywordBack: "transparent",
            colorStringAndComment: "rgb(128,128,128)",
            colorStringAndCommentBack: "transparent",
            colorBracketMatch: "white",
            colorBracketMatchBack: "rgb(80,80,80)",
            keywords: [`${tag('hruler')}|${tag('bold')}|${tag('italic')}|${tag('clist')}|${tag('eitem')}|${tag('xitem')}|${tag('yitem')}|${tag('comment')}|${tag('tree')}|${tag('node')}|${tag('name')}|${tag('branches')}|${tag('title')}|${tag('heading1')}|${tag('heading2')}|${tag('heading3')}|${tag('heading4')}|${tag('heading5')}|${tag('heading6')}|${tag('paragraph')}|${tag('hyperlink')}|${tag('address')}|${tag('target')}|${tag('bcode')}|${tag('icode')}|${tag('bquote')}|${tag('olist')}|${tag('ulist')}|${tag('litem')}|${tag('image')}|${tag('source')}`],
            stringsAndComments: "(\"([^\"\\\\\\n]|(\\\\.))*((\")|(\\n)|($)))",
            hilightMatchingBraces: false,
            spaceDots: true,
            spaceDotColor: "rgb(128,128,128)"
        }

        edit = function (node, options) {
            "use strict";
            if (!options)
                options = opt;
                /*{
                    font: "8pt monospace",
                    tabWidth: 4,
                    colorText: "rgb(208,208,208)",
                    colorTextBack: "black",
                    colorSelection: "white",
                    colorSelectionBack: "gray",
                    colorKeyword: "rgb(104,104,104)",
                    colorKeywordBack: "transparent",
                    colorStringAndComment: "rgb(104,104,104)",
                    colorStringAndCommentBack: "transparent",
                    colorBracketMatch: "white",
                    colorBracketMatchBack: "rgb(75,75,75)",
                    keywords: ["\\bRULE\\b|\\bREWRITE\\b|\\bREAD\\b|\\bWRITE\\b|\\bVAR\\b"],
                    stringsAndComments: "(\"([^\"\\\\\\n]|(\\\\.))*((\")|(\\n)|($)))",
                    hilightMatchingBraces: true,
                    spaceDots: false
                }
                */

            var ww, hh;
            var rndid = Math.round (Math.random () * 32768);
            var ed = document.getElementById(node);

            ed.innerHTML = 

            `
            <div id="container${rndid}" style="position: relative; width: inherit; height: inherit; overflow: auto; visibility: inherit;">
              <div id="backdrop${rndid}" style = "z-index: 1; width: inherit; height: inherit; overflow: hidden;">
                <div id="hilights${rndid}" style="wrap: none; font: ${options.font}; white-space: pre; color: ${options.colorText}; background-color: ${options.colorTextBack}; width: inherit; height: inherit; overflow: hidden; margin: 0; padding:4px;">
                </div>
              </div>
              <textarea class="cls${rndid}" id="input${rndid}" spellcheck="false" autocomplete="off" wrap="off" style="z-index: 0; width: inherit; height: inherit; border-style: none; border-radius: 0; outline: none; resize: none; box-sizing: border-box; display: block; background-color: transparent; color: transparent; caret-color: white; font: ${options.font}; margin: 0; padding:4px; position: absolute; top: 0; left: 0;">
              </textarea>
            </div>
            `

            var input = document.getElementById(`input${rndid}`);
            var hilights = document.getElementById(`hilights${rndid}`);
            var backdrop = document.getElementById(`backdrop${rndid}`);
            var container = document.getElementById(`container${rndid}`);
            
            var style=document.createElement('style');
            style.innerHTML = `
                .cls${rndid}::selection {
                    background-color: var(--selbackcolor);
                    color: var(--selcolor);
                }
            ` 
            document.head.appendChild(style);
            input.style.setProperty('--selbackcolor', options.colorSelectionBack)
            input.style.setProperty('--selcolor', options.colorSelection)
            
            container.style.width = "inherit";
            container.style.height = "inherit";

            function getCoords (text, offset) {
                var i, ch, row = 1, col = 1, maxCol = 1;
                if (text.length > 0)
                    for (i = 0; i < offset && i < text.length; i += 1) {
                        ch = text.charCodeAt(i);
                        if (ch === 13 || ch === 10) {
                            if (ch === 13 && text.charCodeAt (i + 1) === 10)
                                i += 1;

                            row += 1;
                            col = 1;
                            
                        } else
                          col += 1;
                      
                        maxCol = Math.max (maxCol, col);
                    }
                
                return {row: row, col: col, maxCol: maxCol};
            }

            function findLine (text, ln, cl) {
                if (!cl) cl = 0;
                var i = 0, ch, row = 1, col = 1;
                if (text.length > 0) {
                    for (i = 0; (row < ln || (row === ln && col < cl)) && i < text.length; i += 1) {
                        ch = text.charCodeAt(i);
                        if (ch === 13 || ch === 10) {
                            if (ch === 13 && text.charCodeAt (i + 1) === 10)
                                i += 1;

                            row += 1;
                            col = 1;
                            
                        } else
                          col += 1;
                    }
                    
                    if (row > ln) i--;
                    if (i < 0) i = 0;
                    if (i > text.length) i = text.length;
                }
                
                return i;
            }
            
            function hilightAll() {
                if (updateall) {
                    var text = input.value;
                    text = hilight (input.value);
                    text += "     <br/><br/><br/><br/><br/> ";

                    // scroll fix
                    text = text
                    .replace(/\n$/g, '<br/>')
                    .replace(/\n/g, '     <br/>');

                    hilights.innerHTML = text;

                    updateall = false;
                }
            }
            
            function hilightVisible() {
                var text = input.value;

                var nlines = getCoords (text, text.length).row;
                var ntop = Math.floor (nlines * input.scrollTop / input.scrollHeight);
                var nbot = Math.ceil (nlines * (input.scrollTop + input.clientHeight) / input.scrollHeight + 1);
                var ntopoff = findLine (text, ntop);
                var nbotoff = Math.min (findLine (text, nbot), input.value.length);
                
                text = text.substring (ntopoff, nbotoff);            
                text = hilight (text, true);
                text = input.value.substring (0, ntopoff) + text + input.value.substring (nbotoff, input.value.length);
                text += "     <br/><br/><br/><br/><br/> ";
                
                // scroll fix
                text = text
                .replace(/\n$/g, '<br/>')
                .replace(/\n/g, '     <br/>');

                hilights.innerHTML = text;
            }
            
            function hilight(text, nobraces, nocontents) {
                if (options.spaceDots)
                    text = text.replaceAll("    ", "·   ").replaceAll("·   (", "· · (");
                    

                if (!nobraces) {
                    text = prepareBraces (text, "(", ")");
                    text = prepareBraces (text, "[", "]");
                    text = prepareBraces (text, "{", "}");
                }
                            
                if (!nocontents) {
                    text = text
                    .replaceAll(/&/g, '&amp;')
                    .replaceAll(/</g, '&lt;')
                    .replaceAll(/>/g, '&gt;');

                    text = hilightContents (text);
                }

                if (!nobraces) {
                    text = hilightBraces (text, "(", ")");
                    text = hilightBraces (text, "[", "]");
                    text = hilightBraces (text, "{", "}");
                }
                
                text = hilightDots(text);
                
                return text;
            }
            
            function hilightDots (text) {
                var reg = new RegExp(/(·\s*)+/, "g");
                var result;
                var text1 = "";
                var pos1 = 0;
                while((result = reg.exec(text)) !== null) {
                    text1 += text.substring(pos1, result.index);
                    text1 += `<span style="color:${options.spaceDotColor}">` + result[0] + '</span>';
                    pos1 = result.index + result[0].length;
                }
                text1 += text.substring(pos1, text.length);
                
                return text1;
            }

            function hilightContents (text) {
                var reg = new RegExp(options.stringsAndComments, "g");
                var result;
                var text1 = "";
                var pos1 = 0;
                while((result = reg.exec(text)) !== null) {
                    text1 += hilightKeywords (text.substring(pos1, result.index));
                    text1 += `<span style="color:${options.colorStringAndComment}; background-color:${options.colorStringAndCommentBack};">` + result[0] + '</span>';
                    pos1 = result.index + result[0].length;
                }
                text1 += hilightKeywords (text.substring(pos1, text.length));
                
                return text1;
            }

            function hilightKeywords (text) {
                for (var i = 0; i < options.keywords.length; i++) {
                    var reg = new RegExp(options.keywords[i], "g");
                    var result;
                    var text1 = "";
                    var pos1 = 0;
                    while((result = reg.exec(text)) !== null) {
                        text1 += text.substring(pos1, result.index);
                        text1 += `<span style="color: ${options.colorKeyword}; background-color: ${options.colorKeywordBack}; font-weight: bold;">${result[0]}</span>`;
                        pos1 = result.index + result[0].length;
                    }
                    text1 += text.substring(pos1, text.length);
                    text = text1;
                }
                
                return text1;
            }
            
            function prepareBraces (text, open, close) {
                var st = input.selectionStart;
                var en = input.selectionEnd;
                var found, i1, i2;
                
                if (st === en) {
                    if (st === text.length || ("({[".indexOf (text.substr(st, 1)) === -1 && "}])".indexOf (text.substr(st, 1)) === -1))
                        st--;
                      
                    if (text.substr(st, 1) === open) {
                        var i = st, nb = 0;
                        do {
                            if (text.substr(i, 1) == open)
                                nb++;
                            else if (text.substr(i, 1) == close)
                                nb--;
                        
                            i++;
                        } while (i < text.length && nb !== 0);

                        if (nb === 0) {
                            found = true;
                            i1 = st;
                            i2 = i - 1;
                        }
                        
                    } else if (text.substr(st, 1) === close) {
                        var i = st, nb = 0;
                        do {
                            if (text.substr(i, 1) == open)
                                nb--;
                            else if (text.substr(i, 1) == close)
                                nb++;
                          
                            i--;
                        } while (i > -1 && nb !== 0);
                      
                        if (nb === 0) {
                            found = true;
                            i1 = i + 1;
                            i2 = st;
                        }
                    }
                }
                

                if (found) {
                    var p0 = text.substring(0, i1);
                    var p1 = text.substring(i1 + 1, i2);
                    var p2 = text.substring(i2 + 1, text.length)
                    text = p0 + `${open}\0x0000 ` + p1 + ` \0x0000${close}` + p2;
                }
                
                return text;
            }
            
            function hilightBraces (text, open, close) {
                return text
                .replaceAll(`${open}\0x0000 `, `<span style="color: ${options.colorBracketMatch}; background-color: ${options.colorBracketMatchBack};">${open}</span>`)
                .replaceAll(` \0x0000${close}`, `<span style="color: ${options.colorBracketMatch}; background-color: ${options.colorBracketMatchBack};">${close}</span>`);
            }

            function handleKeyPress (e) {
                function tabRight (sel) {
                    var c = sel;
                    var i = c;
                    while (i >= -1) {
                        i--;
                        if (input.value.substr (i, 1) === "\n" || i === -1) {
                            i++
                            var n = options.tabWidth - ((c - i) % options.tabWidth);

                            document.execCommand("insertText", false, " ".repeat (n));

                            for (i = c; i < input.value.length; i++)
                                if (input.value.charAt(i) === "\n")
                                    return i + 1;
                                    
                            return input.value.length;
                        }
                    }
                }
                
                function tabLeft (sel) {
                    var c = sel;
                    var i = c;
                    while (i >= -1) {
                        i--;
                        if (input.value.substr (i, 1) === "\n" || i === -1) {
                            i++;

                            input.selectionStart = i;

                            for (var j = 0; j < options.tabWidth && i + j < input.value.length; j++)
                                if (" \t\v".indexOf (input.value.substr (i + j, 1)) === -1)
                                    break;
                                    
                            if (j > 0) {
                                input.selectionEnd = i + j;

                                document.execCommand("delete");
                            }
                            
                            input.selectionStart = (c - j > i ? c - j: i);
                            input.selectionEnd = input.selectionStart;
                            
                            for (i = c; i < input.value.length; i++)
                                if (input.value.charAt(i) === "\n")
                                    return i + 1;
                                    
                            return input.value.length;
                        }
                    }
                }
                
                if (event.key === 'z') {
                    if (e.ctrlKey) {
                        setTimeout (() => {
                            centerSel ();
                        }, 50);
                    }

                } else if (event.key === 'Z') {
                    if (e.ctrlKey) {
                        setTimeout (() => {
                            centerSel ();
                        }, 50);
                    }
                    
                }

                if (e.key === "Enter") {
                    e.preventDefault ();
                    
                    var c = input.selectionStart;
                    var i = c;
                    while (i >= 0) {
                        i--;
                        if (input.value.substr (i, 1) === "\n" || i === -1) {
                            var pre = "";
                            var j = i + 1;
                            while (j < c && j < input.value.length && " \t\v".indexOf (input.value.substr (j, 1)) > -1) {
                                pre += input.value.substr (j, 1);
                                j++;
                            }
                                    
                            document.execCommand("insertText", false, '\n' + pre);
                            input.blur ();
                            input.focus ();

                            return;
                        }
                    }
                    
                } else if (e.key === "Tab") {
                    e.preventDefault ();
                    
                    if (input.selectionStart == input.selectionEnd) {
                        if (e.shiftKey) {
                            tabLeft (input.selectionStart);
                            
                        } else {
                            tabRight (input.selectionStart);
                            
                        }
                    } else {
                        var lineStarts = [];
                        
                        for (i = input.selectionStart - 1; i >= 0; i--)
                            if (input.value.charAt(i) === "\n") {
                                lineStarts.push (i + 1);
                                break;
                            }
                            
                        if (i === -1)
                            lineStarts.push (0);
                            
                        for (i = input.selectionStart; i < input.selectionEnd - 1; i++)
                            if (input.value.charAt(i) === "\n")
                                lineStarts.push (i + 1);
                        
                        for (i = input.selectionEnd - 1; i < input.value.length; i++)
                            if (input.value.charAt(i) === "\n") {
                                lineStarts.push (i + 1);
                                break;
                            }
                        
                        if (i === input.value.length) {
                            var farEnd = true;
                            lineStarts.push (i);
                        }

                        if (e.shiftKey) {
                            var ins = "";
                            for (var i = 0; i < lineStarts.length - 1; i++) {
                                for (var j = 0; j < options.tabWidth && lineStarts[i] + j < input.value.length; j++)
                                    if (" \t\v".indexOf (input.value.substr (lineStarts[i] + j, 1)) === -1)
                                        break;
                                        
                                ins += input.value.substring (lineStarts[i] + j, lineStarts[i + 1])
                            }

                            input.selectionStart = lineStarts[0];
                            input.selectionEnd = lineStarts[lineStarts.length - 1];

                            if (!!window.chrome)
                                document.execCommand("insertHTML", false, ins);
                            
                            else
                                document.execCommand("insertText", false, ins);
                            
                            input.selectionStart = lineStarts[0];
                            //input.selectionEnd = lineStarts[0] + ins.length;
                        
                        } else {
                            var ins = "";
                            for (var i = 0; i < lineStarts.length - 1; i++) {
                                ins += " ".repeat (options.tabWidth) + input.value.substring (lineStarts[i], lineStarts[i + 1])
                            }

                            input.selectionStart = lineStarts[0];
                            input.selectionEnd = lineStarts[lineStarts.length - 1];

                            if (!!window.chrome)
                                document.execCommand("insertHTML", false, ins);
                            
                            else
                                document.execCommand("insertText", false, ins);
                            
                            input.selectionStart = lineStarts[0];
                            //input.selectionEnd = lineStarts[0] + ins.length;
                        }
                        
                        centerSel();
                    }
                }
            }

            function centerSel () {
                var coord = getCoords (input.value, input.value.length);
                var nlines = coord.row;
                var nCols = coord.maxCol;
                var ln = Math.floor ((input.scrollHeight) / nlines);
                var cl = Math.floor ((input.scrollWidth) / nCols);
                var top = getCoords (input.value, input.selectionStart).row;
                var left = getCoords (input.value, input.selectionStart).col;
                input.scrollLeft = left * cl - input.clientWidth / 2;
                input.scrollTop = top * ln - input.clientHeight / 2;
            }
            
            function handleResize () {
                
                container.style.width = "0px";
                container.style.height = "0px";
                //container.style.visibility = "hidden";
                
                setTimeout (function () {
                    hh = ed.clientHeight;
                    ww = ed.clientWidth;

                    container.style.height = hh + "px";
                    container.style.width = ww + "px";
                    handleScroll ();
                    //container.style.visibility = "visible";
                }, 0);
                
            }
            
            function handleSelectionChange () {
                const activeElement = document.activeElement
                if (activeElement && activeElement.id === `input${rndid}`) {
                    if (options.hilightMatchingBraces)
                        updateBraces();

                    hilights.scrollTop = input.scrollTop;
                    hilights.scrollLeft = input.scrollLeft;
                }
            }
            
            function handleInput () {
                hilightVisible ();

                hilights.scrollTop = input.scrollTop;
                hilights.scrollLeft = input.scrollLeft;
            }
            
            function handleScroll () {
                if (options.hilightMatchingBraces)
                    updateBraces(true);
                
                else
                    hilightVisible ();

                hilights.scrollTop = input.scrollTop;
                hilights.scrollLeft = input.scrollLeft;
            }
            
            function updateBraces (visible) {
                var text = input.value;
                var st = input.selectionStart;
                if (st === text.length || ("({[".indexOf (text.substr(st, 1)) === -1 && "}])".indexOf (text.substr(st, 1)) === -1))
                    st--;
                  
                if (!("({[".indexOf (text.substr(st, 1)) === -1 && "}])".indexOf (text.substr(st, 1)) === -1)) {
                    matchingbr = true;
                    updateall = true;
                    hilightAll ();
                    
                } else if (matchingbr) {
                    matchingbr = false
                    updateall = true;
                    hilightAll ();
                    
                } else if (visible){
                    hilightVisible ();
                }
            }
            
            function handleMouseMove (e) {
                if (e.offsetX >= input.offsetWidth - 8 || e.offsetY >= input.offsetHeight - 8)
                    input.style.cursor = "default";
                else
                    input.style.cursor = "text";
            }

            document.addEventListener('selectionchange', handleSelectionChange);

            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleKeyPress);
            input.addEventListener('scroll', handleScroll);

            ed.addEventListener('resize', handleResize);
            window.addEventListener('resize', handleResize);
            ed.addEventListener('mousemove', handleMouseMove);

            setTimeout (function () {
                handleResize();
            }, 0);
                    
            input.value = "";
            var matchingbr = false;
            var updateall = true;
            var curCol = 0;

            return {
                getValue: function () {
                    return input.value;
                },
                setValue: function (value) {
                    input.value = value;

                    input.scrollTop = 0;
                    input.scrollLeft = 0;
                    input.selectionStart = 0;
                    input.selectionEnd = 0;

                    handleScroll ();

                },
                getSelectionStart () {
                    return input.selectionStart;
                },
                getSelectionEnd () {
                    return input.selectionEnd;
                },
                setSelectionStart (v) {
                    input.selectionStart = v;
                },
                setSelectionEnd (v) {
                    input.selectionEnd = v;
                },
                setFocus: function () {
                    input.focus ();
                },
                getInput: function () {
                    return input;
                }
            }
        };
        
        hilight = function (text, options) {
            "use strict";

            if (!options)
                options = opt;

            function hilightAll() {
                text = hilight (text);

                // scroll fix
                text = text
                .replace(/\n$/g, '<br/>')
                .replace(/\n/g, '<br/>');

                return text;
            }
            
            function hilight(text) {
                if (options.spaceDots)
                    text = text.replaceAll("    ", "·   ").replaceAll("·   (", "· · (");
                    

                text = text
                .replaceAll(/&/g, '&amp;')
                .replaceAll(/</g, '&lt;')
                .replaceAll(/>/g, '&gt;');

                text = hilightContents (text);
                text = hilightDots(text);
                
                return text;
            }
            
            function hilightDots (text) {
                var reg = new RegExp(/(·\s*)+/, "g");
                var result;
                var text1 = "";
                var pos1 = 0;
                while((result = reg.exec(text)) !== null) {
                    text1 += text.substring(pos1, result.index);
                    text1 += `<span style="color:${options.spaceDotColor}">` + result[0] + '</span>';
                    pos1 = result.index + result[0].length;
                }
                text1 += text.substring(pos1, text.length);
                
                return text1;
            }

            function hilightContents (text) {
                var reg = new RegExp(options.stringsAndComments, "g");
                var result;
                var text1 = "";
                var pos1 = 0;
                while((result = reg.exec(text)) !== null) {
                    text1 += hilightKeywords (text.substring(pos1, result.index));
                    text1 += `<span style="color:${options.colorStringAndComment}; background-color:${options.colorStringAndCommentBack};">` + result[0] + '</span>';
                    pos1 = result.index + result[0].length;
                }
                text1 += hilightKeywords (text.substring(pos1, text.length));
                
                return text1;
            }

            function hilightKeywords (text) {
                for (var i = 0; i < options.keywords.length; i++) {
                    var reg = new RegExp(options.keywords[i], "g");
                    var result;
                    var text1 = "";
                    var pos1 = 0;
                    while((result = reg.exec(text)) !== null) {
                        text1 += text.substring(pos1, result.index);
                        text1 += `<span style="color: ${options.colorKeyword}; background-color: ${options.colorKeywordBack}; font-weight: bold;">${result[0]}</span>`;
                        pos1 = result.index + result[0].length;
                    }
                    text1 += text.substring(pos1, text.length);
                    text = text1;
                }
                
                return text1;
            }
            
            return `<div style="wrap: none; font: ${options.font}; white-space: pre; color: ${options.colorText}; background-color: ${options.colorTextBack}; width: inherit; height: inherit; overflow: hidden; margin: 0; padding:4px;">${hilightAll ()}</div>`;
        }
        
        return {
            edit: edit,
            hilight: hilight
        }
    })()
);

