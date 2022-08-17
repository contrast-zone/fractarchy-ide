var hilight = function (text, options) {
    "use strict";

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
            text1 += `<span style="color:gray">` + result[0] + '</span>';
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
            text1 += `<span style="color:${options.colorStringAndComment}">` + result[0] + '</span>';
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
    
    return hilightAll ();
}

