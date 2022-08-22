function tag (str) {
    return `((?<=\\((\\s|·)*)${str}(?=(\\s|·)))`
}

var options = {
    font: "1em monospace",
    tabWidth: 4,
    colorText: "rgb(208,208,208)",
    colorTextBack: "rgb(48,48,48)",
    colorSelection: "white",
    colorSelectionBack: "gray",
    colorKeyword: "rgb(128,128,128)",
    colorKeywordBack: "transparent",
    colorBracketMatch: "white",
    colorBracketMatchBack: "rgb(75,75,75)",
    colorStringAndComment: "rgb(128,128,128)",
    keywords: [`${tag('hruler')}|${tag('bold')}|${tag('italic')}|${tag('clist')}|${tag('eitem')}|${tag('xitem')}|${tag('yitem')}|${tag('comment')}|${tag('tree')}|${tag('node')}|${tag('name')}|${tag('branches')}|${tag('title')}|${tag('heading1')}|${tag('heading2')}|${tag('heading3')}|${tag('heading4')}|${tag('heading5')}|${tag('heading6')}|${tag('paragraph')}|${tag('hyperlink')}|${tag('address')}|${tag('target')}|${tag('bcode')}|${tag('icode')}|${tag('bquote')}|${tag('olist')}|${tag('ulist')}|${tag('litem')}`],
    stringsAndComments: "(\"([^\"\\\\\\n]|(\\\\.))*((\")|(\\n)|($)))",
    hilightMatchingBraces: false,
    spaceDots: true
}

