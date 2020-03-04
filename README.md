# bookmark.ts

Bookmark.ts is the simplest version of [Bookmark.js](https://bespoyasov.ru/bookmark) but recreated in clear TypeScript.

[![version](https://img.shields.io/badge/version-1.1f1-default.svg?style=flat-square)](https://github.com/tomasci/bookmarkts)

| -                                         | Bookmark.ts   |Bookmark.js    |
| -                                         | -             |-              |
| dependencies                              | no            | jQuery        |
| make BM tree                              | yes           | yes           |
| show tree onHover beside scrollbar        | yes           | yes           |
| activates onScroll                        | yes           | yes           |
| scrollbar associate with links in panel   | yes           | yes           |
| active links (shows where user now)       | no*           | yes           |
| auto-naming (I think no need in that)     | no            | yes           |
| hash in browser search bar (/uri#hash)    | no*           | yes           |

`*` features can be added later.

## Installation

1. clone repo
2. go to repo folder and find `build` folder
3. in `build\assets` you can find `styles` and `js` folders
4. copy from `styles` file named `bookmark.css` to your styles folder
5. copy from `js` file named `bookmark.js` to your scripts folder
6. open your `layout/template/view` and before `</head>` add next:
~~~~
<link rel="preload" href="PATH_TO_YOUR_STYLES/bookmark.css" as="style">
<link rel="preload" href="PATH_TO_YOUR_SCRIPTS/bookmark.js" as="script">
<link rel="stylesheet" href="PATH_TO_YOUR_STYLES/bookmark.css">
~~~~
7. before `</body>` add next:
~~~~
<script src="PATH_TO_YOUR_SCRIPTS/bookmark.js" charset="utf-8" defer></script>
~~~~
8. Okay, installation now complete.

Don't forget to change `PATH_TO_YOUR_STYLES` and `PATH_TO_YOUR_SCRIPTS` to your paths.

## Using

To add new bookmark into panel just follow next steps:
* to any element `e.g. h1,h2.. p, div, etc` add class `bookmark` and
* in the same element add `data-bookmark-title="Your_title_here"`

Don't forget to change `Your_title_here` to your title.