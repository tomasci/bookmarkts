// bookmark.ts
// skyparadise.org, evgenyberezin.com

window.onload = function() {
    new Bookmark({
        hoverZoneTimeout: 100,
        scrollPosition: "center",
        scrollBehavior: "smooth",
        showPanelOnScroll: true,
        showPanelOnScrollTimeout: 700,
        mobileSupport: false
    })
}

interface Settings {
    hoverZoneTimeout: number,
    scrollPosition: ScrollLogicalPosition
    scrollBehavior: ScrollBehavior,
    showPanelOnScroll: boolean
    showPanelOnScrollTimeout: number,
    mobileSupport: boolean,
}

class Bookmark {
    private settings: Settings
    private body: HTMLElement
    private bm_panel: HTMLElement
    private bm_panel_container: HTMLElement
    private bm_hzone: HTMLElement
    private isScrolling: number
    private mouse_over_panel: boolean
    private bookmark_cache: HTMLElement[] = null
    private last_hash: string

    constructor(user_settings: Settings) {
        this.settings = user_settings
        this.body = document.body

        if (this.CheckMobile()) {
            // mobile
            if (this.settings.mobileSupport) {
                this.Init()
            }
        } else {
            // not mobile
            this.Init()
        }
    }

    private Init(): void {
        if (this.SelectAllBookmarks().length > 0) { // check for empty
            this.CreateHoverZone()
            this.CreatePanel()
            this.OnScrollEvent()
            this.GetBrowserHash()
        }
    }

    // create hover zone
    private CreateHoverZone(): void {
        let hzone: HTMLElement = document.createElement('div')
        hzone.classList.add('bookmark-hoverzone')
        hzone.addEventListener('mouseenter', (e: Event) => this.HandleHoverZone(e, this))
        this.bm_hzone = hzone
        this.body.appendChild(this.bm_hzone)
    }

    // create panel
    private CreatePanel(): void {
        let panel: HTMLElement = document.createElement('div')
        panel.classList.add("bookmark-panel")
        panel.addEventListener('mouseleave', (e: Event) => this.HandlePanelZone(e, this))
        panel.addEventListener('mouseover', (e: Event) => {
            this.mouse_over_panel = true
        })

        let container: HTMLElement = document.createElement('div')
        container.classList.add('bookmark-panel-container')
        panel.appendChild(container)

        this.bm_panel = panel
        this.bm_panel_container = container

        this.LoadStructure(this.bm_panel_container)
        this.body.appendChild(this.bm_panel)
    }

    // select all bookmarks in document
    private SelectAllBookmarks(): HTMLElement[] {
        if (this.bookmark_cache == null) {
            let bms: NodeList = document.querySelectorAll(".bookmark")
            let cache: HTMLElement[] = []
            bms.forEach((node: HTMLElement) => {
                if ("bookmarkTitle" in node.dataset && node.dataset.bookmarkTitle != "") {
                    cache.push(node)
                }
            })
            this.bookmark_cache = cache
        }

        return this.bookmark_cache
    }

    // add each bookmark as link to container
    private LoadStructure(container: HTMLElement): void {
        let bms: HTMLElement[] = this.SelectAllBookmarks()

        bms.forEach((node: HTMLElement, i: number) => {
            container.appendChild(this.MakeAnchor(node, i))
        })
    }

    // make link from bookmark
    private MakeAnchor(node: HTMLElement, i: number): HTMLElement {
        let anchor: HTMLAnchorElement = document.createElement('a')
        anchor.innerText = node.dataset.bookmarkTitle

        let hash: string = "#bookmark-" + i
        anchor.href = hash

        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault()
            this.ScrollToElement(node) // guaranteed scroll to element when click in panel
            window.location.hash = hash
            this.last_hash = hash
        })

        anchor.style.top = this.GetAnchorPosition(node) + '%'

        return anchor
    }

    private ScrollToElement(node: HTMLElement): void {
        node.scrollIntoView({block: this.settings.scrollPosition, behavior: this.settings.scrollBehavior})
    }

    // event listener for hovering
    private HandleHoverZone(e: Event, self: this): void {
        self.ShowPanel(true)
    }

    // event listener for leaving 
    private HandlePanelZone(e: Event, self: this): void {
        self.ShowPanel(false)
    }

    // show - true, hide - false
    private ShowPanel(state: boolean): void {
        if (state) {
            this.bm_hzone.style.display = "none"
            this.bm_panel.classList.add('bookmark-show')
        } else {
            this.bm_panel.classList.remove('bookmark-show')
            this.mouse_over_panel = false

            setTimeout(() => {
                this.bm_hzone.style.display = "block"
            }, this.settings.hoverZoneTimeout)
        }
    }

    // get total document height
    private GetDocumentHeight(): number {
        let body: HTMLElement = document.body
        let html: HTMLElement = document.documentElement
        let height: number = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        return height
    }

    // get element coords
    private GetElementPosition(node: HTMLElement): {top: number, left: number} {
        // according to https://learn.javascript.ru/coordinates-document
        let rect: DOMRect = node.getBoundingClientRect()

        let position: {top: number, left: number} = {
            top: rect.top + pageYOffset,
            left: rect.left + pageXOffset
        }

        return position
    }

    // calculate anchor coords in panel using total document height and block position
    private GetAnchorPosition(node: HTMLElement): number {
        let height: number = this.GetDocumentHeight()
        let nodepos: {top: number, left: number} = this.GetElementPosition(node)
        let anchorpos: number = (nodepos.top * 90) / height // 100% is absolutely height of block, but Title can be bigger and padding also, so 90% is great.
        
        return anchorpos
    }

    // show and hide panel onScroll
    private OnScrollEvent(): void {
        // according to https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
        document.addEventListener('scroll', (e: Event) => {
            window.clearTimeout(this.isScrolling)

            // when scroll - show
            this.ShowPanel(true)

            this.isScrolling = setTimeout(() => {
                // if mouse not over panel than hide
                if (!this.mouse_over_panel) {
                    this.ShowPanel(false)
                }
            }, this.settings.showPanelOnScrollTimeout)
        })
    }

    // get hash after load (it's for sharing, also it is watch for url changes and works when hash changed by user)
    private GetBrowserHash(): void {
        let hash: string = window.location.hash
        let splitted_hash: string[] = hash.split('-')

        if (this.last_hash == hash) {
            return
        }
        
        if (splitted_hash[0] == '#bookmark') {
            let nodes: HTMLElement[] = this.SelectAllBookmarks()

            if (Number(splitted_hash[1]) < nodes.length) {
                this.ScrollToElement(nodes[splitted_hash[1]])
            }
        }

        window.addEventListener('hashchange', (e: Event) => {
            this.GetBrowserHash()
        })
    }

    // check is mobile device
    private CheckMobile(): boolean {
        // according to https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
    }
}