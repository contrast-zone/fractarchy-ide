var navigate = function (divName) {
    function setNav(divNav) {
        divNav.innerHTML = drawNav(nodeTree, 0, divNav.clientHeight, 4);
        if (divNav.scrollWidth > divNav.clientWidth)
            divNav.innerHTML = drawNav(nodeTree, 0, divNav.clientHeight, 4);

        for (var i = 0; i < cursor.length; i++)
            select(i);
    }

    function select (ndx, sel) {
        var dn = document.getElementById ("divNav" + ndx);
        
        if (dn.children[1])
            for (var i = 0; i < dn.children[1].children.length; i++) {
                item = dn.children[1].children[i];
                if (item.hi) {
                    item.style.backgroundColor='gray';
                    item.style.color='white';
                } else {
                    item.style.backgroundColor='rgb(64,64,64)';
                    item.style.color='rgb(192,192,192)';
                }
                
                if (cursor[ndx] === i) {
                    item.style.backgroundColor='rgb(192,192,192)';
                    item.style.color='rgb(64,64,64)';
                }
            }
        
        if (sel !== undefined) {
            cursor[ndx] = sel;
            cursor.splice(ndx + 1);
        }
    }
        
    function getNode (node, path) {
        if (!node) node = nodeTree;
        
        if (path)
            if (!path[1]) {
                return node[path[0] + 1][2];
            } else {
                return getNode(node, path[1])[path[0] + 1][2];
            }
        else
            return nodeTree;
    }

    function drawNav (node, ptr, h, bord, path, ndx) {
        if (!ndx) ndx = 0;
        
            var node = (getNode (nodeTree, path));
            
        if (h > 0 && node && node.length > 1 && ndx <= cursor.length) {
            var newn = drawNav ([]/*node[ptr + 1][2]*/, 0, h, bord, [(cursor[ndx]?cursor[ndx]:0), path], ndx + 1);
            
            var list = ""
            
            for (var i = 1; i < node.length; i++) {
                txt = node[i][1][0][1][1];
                txt = txt.substr(1, txt.length - 2);
                list += `
                    <div
                        onmouseenter="this.hi=true; nav.select(${ndx})"
                        onmouseleave="this.hi=false; nav.select(${ndx})"
                        onclick="
                            nav.select(${ndx}, ${i - 1});
                            document.getElementById('divNav${ndx + 1}').outerHTML=nav.drawNav ([], 0, ${h}, ${bord}, ${JSON.stringify([i - 1, path])}, ${ndx + 1});
                            nav.setNav(divNav);
                            nav.select(${ndx}, ${i - 1});
                            nav.onSelect (${JSON.stringify([i - 1, path])});
                        "
                    >` + txt + "</div>";
            }
            
            var branch =
                    
                    `<div style=" color: rgb(128,128,128); font: 9pt monospace; stroke-width: 1px; margin: auto; margin-left: 0px; margin-right: 0px;">
                        &nbsp;&nbsp;&nbsp;&nbsp;· · ·<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;</br>
                        · · ·&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;
                        </br>&nbsp;&nbsp;&nbsp;&nbsp;· · ·
                    </div>`;
                    `<svg xmlns="http://www.w3.org/2000/svg" height="49" width="49" style="stroke-width: 1px; margin: auto; margin-left: 0px; margin-right: 0px;">
                        <line x1="4.5" y1="24.5" x2="24.5" y2="24.5" stroke="rgb(32,32,32)"/>
                        <circle cx="4.5" cy="24.5" r="4" stroke="black" stroke-width="0" fill="rgb(32,32,32)" />
                        <line x1="24.5" y1="4.5" x2="24.5" y2="45" stroke="rgb(32,32,32)"/>
                        <line x1="24" y1="4.5" x2="44.5" y2="4.5" stroke="rgb(32,32,32)"/>
                        <circle cx="44.5" cy="4.5" r="4" stroke="black" stroke-width="0" fill="rgb(32,32,32)" />
                        <!--line x1="24.5" y1="24.5" x2="44.5" y2="24.5" stroke="rgb(32,32,32)"/-->
                        <!--circle cx="44.5" cy="24.5" r="4" stroke="black" stroke-width="0" fill="rgb(32,32,32)" /-->
                        <line x1="24" y1="44.5" x2="44.5" y2="44.5" stroke="rgb(32,32,32)"/>
                        <circle cx="44.5" cy="44.5" r="4" stroke="black" stroke-width="0" fill="rgb(32,32,32)" />
                    </svg>`;

            
            return `
                   <div id="divNav` + ndx + `" style="color: inherit; background-color: inherit; font: inherit; display: flex; flex: 1 1 0; height: ` + h + `px; position: relative;">`
                + (ndx > 0? branch: "<div hidden></div>")
                + `<div id="nav${ndx}" style="overflow-y: auto; background-color: rgb(64,64,64); width: 140px; margin: 1px; margin-right: 1px; border: ` + bord + `px solid rgb(32,32,32); display:flex; flex-direction: column;">` + list + `</div>`
                + newn
                + `</div>`
                
        } else {
            return `<div id="divNav` + ndx + `"/>`;
        }
    }
    
    var cursor = [0];
    var nodeTree = undefined;   
    var divNav = document.getElementById (divName);
    setNav (divNav);

    return {
        select: select,
        setNav: setNav,
        drawNav: drawNav,
        getNode: getNode,
        refresh: function () {
            setNav(divNav);
        },
        setValue: function (value) {
            nodeTree = value;
            cursor = [0];
            setNav(divNav);
        },
        setOnSelect: function (fn) {
            this.onSelect = fn;
        }
    }
}
