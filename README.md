# fractadocs

(v 0.1 - alpha)

**tags:** content-management-system, hierarchical-data-organizer, text-processing-toolkit, fractal-structure-inspired, parent-children-orbiting, zooming-elements-based

- - -

    // under construction //
        
![](media/ssh.png)

[online probe](https://contrast-zone.github.io/fractadocs/index.html)

    // under construction //

- - -

# introduction

Let me introduce you to Fractadocs, a content management system in a guise of hierarchical data organizer and text processing toolkit. As one might already guess, Fractadocs does things a bit differently. Some users will love it, some users will hate it, while some of us may even form mixed opinions given a plethora of affinity states. Distinctive design choices that were made in creation of Fractadocs are supposed to embark users on a brave adventure while discovering its carefully weighed virtues and flaws. Its coding fragment requires an open minded approach to be understood, while its graphical fragment requires a venturesome spirit to have fun with. This combination provides an unique balance between contents creation and contents navigation. Finally, a fair amount of user creativity will be the judge of Fractadocs fitness for particular purposes.

## 1. about fractadocs

Fractadocs is a hierarchical fractal-structure inspired, parent-children orbiting, and zooming-elements based text and graphics organizer. It can be used to manage the creation and modification of static digital content. Such purposes include organizing personal or business data and documentation, optionally exporting it to a local web site ready for publishing to the Internet.

### 1.1. use cases

Fractadocs **is suited** to be used as:

- static content pages creation platform
- mind map planner
- slide show composer
- text processing toolkit
- hierarchical data organizer
- personal knowledge base keeper
- multi-purpose documentation system
- ...

Fractadocs **is not suited** to be used for:

- dynamic content pages creation

## 2. skimming over features

Fractadocs user interface and functionality is imbued with symmetry. Although one may consider it unconventional, the symmetry was seriously taken into account upon shaping the direction of Fractadocs user interface features. Contents code pane (left) contrasts contents display pane (right), while browsing mode (initial) contrasts edit/print mode (alternate). Underneath the Fractadocs user interface, the backend core comprises structured document tree (SDT), thus forming a kind of hierarchical database of sub-documents.

### 2.1. browsing mode

The application starts in browsing mode. Browsing mode presents SDT fragments in orbitable and zoomable ovals that form a seamless dynamic fractal user interface. We navigate the entire fractal structure using only four kinds of gestures: (1) dragging inside the central oval area to pan its contents, (2) dragging orbiting ovals around the central oval to rotate them, (3) dragging any orbiting oval towards center to zoom it in, or (4) dragging central oval towards orbit to zoom it out.

### 2.2. edit/print mode

From browsing mode we can enter edit/print mode by clicking relevant icons. Edit/print mode detaches and shows the current oval in browsing mode. Prior to igniting edit/print mode, we may fold all the children ovals to the current oval. This action makes possible altering order and contents of sub-tree children. When we are done editing/printing, we exit the edit/print mode by clicking relevant icons. The interface then brings us back to browsing mode, when we may unfold the current oval (if we already folded it) back to the expanded tree form.

## 3. structured document tree reference

Composing contents in Fractadocs is consisted of coding main SDT file and importing graphical or other resources. Simple, yet powerful SDT markup, templating and coding capabilities serve as a Turing complete data definition platform. SDT file format is based on a minimalist s-expression based environment created specifically for purposes of Fractadocs, and it should bring an exciting "expert under the hub" atmosphere to the overall Fractadocs user experience.

Contents of SDT file is a s-expression. In computer programming, an S-expression (or symbolic expression, abbreviated as sexpr or sexp) is an expression in a like-named notation for nested list (tree-structured) data. S-expression is written as a list of elements inside parenthesis. Elements may include words or other s-expressions delimited by whitespace. Whitespaces in s-expressions include any number of space characters, tabs, and line splits. Initially, in a case of Fractadocs the first word to the left s-expression (also called head) is meant to identify a s-expression type. In example, s-expression like `(tree ... contents ...)` means that we assert `... contents ...` of a type `tree`, while in s-expression `(tree (node ... contents ...) (branches ... contents ...))` we nested `node` type and `branches` type s-expressions within `tree` type s-expression.

In Fractadocs, there exist a number of s-expression types which we will cover in the following sub-sections.

### 3.1. tree structure s-expressions

STD file format is structured in a following pattern:

    (
        tree
        (
            node
            ... node contents ...
        )
        (
            branches
            (
                tree
                ... tree contents recursively ...
            )
            (
                tree
                ... tree contents recursively ...
            )
            ... other tree items as branches ...
        )
    )

There is really not much to say about tree structure. The tree structure is a s-expression combined by `tree`, `node`, and `branches` type s-expressions. From the top, we start with `tree` type s-expression, nesting `node` type s-expression within. If we want the `node` to branch, we put a `branches` type s-expression next to it, to further enumerate branching using `tree` type s-expressions. We can nest `tree` type s-expressions recursively to any depth. When we reach the final nodes that don't branch further, we simply omit the `branches` s-expression.

During visualization, each `node` type s-expression is then rendered within its own oval, while orbiting child ovals are extracted from relative `branches` type s-expression.

### 3.2. document structure s-expressions

STD sub-documents are placed inside nodes from the tree structure in a following s-expression:

    (
        node
        ... sub-document contents ...
    )

Alternatively, sub-documents may be additionally written by the following s-expression:

    (
        (
            node
            (
                title ... description ...
            )
        )
        ... sub-document contents ...
    )

where `... description ...` is a list of words representing the node title. Title is specifically formatted in the largest font and placed at the top of each node representing sub-document. 

`... sub-document contents ...` from the above two patterns is a list of prose words that follow `node` head. Also, among a list of words, we can combine s-expressions of types from the following table:

    +----------------------------------------+---------------------------+
    !  s-expression type                     !  accepts contents         !
    +----------------------------------------+---------------------------+
    !  * ignored comments: `comment`         !  prose                    !
    !  * bold text: `bold`                   !  prose                    !
    !  * italic text: `italic`               !  prose                    !
    !  * title: `title`                      !  prose                    !
    !  * headings: `heading1` to `heading6`  !  prose                    !
    !  * paragraph: `paragraph`              !  prose                    !
    !  * block quote: `bquote`               !  prose                    !
    !  * unordered list: `ulist`             !                           !
    !      * unordered list item: `litem`    !  prose                    !
    !                                        !                           !
    !  * ordered list: `olist`               !                           !
    !      * ordered list item: `litem`      !  prose                    !
    !                                        !                           !
    !  * checklist: `clist`                  !                           !
    !      * empty box item: `eitem`         !  prose                    !
    !      * crossed box item: `xitem`       !  prose                    !
    !      * checked box item: `yitem`       !  prose                    !
    !                                        !                           !
    !  * hyperlink: `hyperlink`              !                           !
    !      * hyperlink address: `address`    !  quoted string            !
    !      * hyperlink target: `target`      !  quoted string            !
    !                                        !                           !
    !  * inline code: `icode`                !  quoted string            !
    !  * block code: `bcode`                 !  a list of quoted strings !
    !  * horizontal ruler: `hruler`          !                           !
    +----------------------------------------+---------------------------+

Sub-items from the above itemization are describing acceptable assertions within the items.

### 3.3. templating system s-expressions

    // under construction //
    
SDT file format is being evaluated as a kind of a term rewriting system. As such, it may be suited even for some advanced tasks naturally involving formula applications, like proof construction for different kinds of logic, truth table calculations, or combinatorial problem solving. Although these kinds of uses may seem intimidating at first, the decision of supporting them doesn't steepen a learning curve needed for basic SDT use. SDT file format may go as deep into content creation as users let it, from simple macro expansions to complex formula calculations. Finally, user range targeted by SDT file format spans anywhere between enthusiastic beginners ready to dive into mysteries of coding, and demanding experts who will know how to reach for advanced SDT capabilities.

While term rewriting used in SDT reach far beyond document templating, in this section we will cover only basic SDT templating capabilities that would be used to uniformly format SDT fragments. Readers interested in more thorough elaboration of the term rewriting used in SDT are invited to take a look at original [Lissy programming language project page]().

    // under construction //
    
## 4. licensing, owning a copy, and joining mailing list

Fractadocs is shared to public under [conditional Creative Commons Attribution 4.0 International License](LICENSE) by [Contrast Zone](https://github.com/contrast-zone/) productions. 

A copy of Fractadocs software bundle can be downloaded from [dedicated github pages](https://github.com/contrast-zone/fractadocs/).

To ask any questions about Fractadocs, to report a bug, or to track new releases, please refer to [Contrast Zone mailing list](https://groups.google.com/g/contrast-zone).

