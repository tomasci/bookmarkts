// bookmark.ts
// skyparadise.org, evgenyberezin.com

window.onload = function() {
    new Bookmark({
        hoverZoneTimeout: 100,
        scrollPosition: "center",
        scrollBehavior: "smooth",
        showPanelOnScroll: true
    })
}

interface Settings {
    hoverZoneTimeout: number
    scrollPosition: ScrollLogicalPosition
    scrollBehavior: ScrollBehavior,
    showPanelOnScroll: boolean
}

class Bookmark {
    private settings: Settings
    private body: HTMLElement
    private bm_panel: HTMLElement
    private bm_panel_container: HTMLElement
    private bm_hzone: HTMLElement
    private isScrolling: number
    private mouse_over_panel: boolean

    constructor(user_settings: Settings) {
        this.settings = user_settings
        this.body = document.body
        this.CreateHoverZone()
        this.CreatePanel()
        this.OnScrollEvent()
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

        let container = document.createElement('div')
        container.classList.add('bookmark-panel-container')
        panel.appendChild(container)

        this.bm_panel = panel
        this.bm_panel_container = container

        this.LoadStructure(this.bm_panel_container)
        this.body.appendChild(this.bm_panel)
    }

    // select all bookmarks in document
    private SelectAllBookmarks(): NodeList {
        let bms: NodeList = document.querySelectorAll(".bookmark")
        return bms
    }

    // add each bookmark as link to container
    private LoadStructure(container: HTMLElement): void {
        let bms = this.SelectAllBookmarks()
        bms.forEach((node: HTMLElement) => {
            container.appendChild(this.MakeAnchor(node))
        })
    }

    // make link from bookmark
    private MakeAnchor(node: HTMLElement): HTMLElement {
        let anchor = document.createElement('a')
        anchor.innerText = node.dataset.bookmarkTitle
        anchor.href = "#"

        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault()
            node.scrollIntoView({block: this.settings.scrollPosition, behavior: this.settings.scrollBehavior})
        })

        anchor.style.top = this.GetAnchorPosition(node) + '%'

        return anchor
    }

    // event listener for hovering
    private HandleHoverZone(e: Event, self: this): void {
        self.ShowPanel()
    }

    // event listener for leaving 
    private HandlePanelZone(e: Event, self: this): void {
        self.HidePanel()
    }

    // show panel, when hover
    private ShowPanel(): void {
        this.bm_hzone.style.display = "none"
        this.bm_panel.classList.add('bookmark-show')
    }

    // and hide on leaving
    private HidePanel(): void {
        this.bm_panel.classList.remove('bookmark-show')

        setTimeout(() => {
            this.bm_hzone.style.display = "block"
        }, this.settings.hoverZoneTimeout)
    }

    // get total document height
    private GetDocumentHeight(): number {
        let body = document.body
        let html = document.documentElement
        let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        return height
    }

    // get element coords
    private GetElementPosition(node: HTMLElement): {top: number, left: number} {
        // from https://learn.javascript.ru/coordinates-document
        let rect: DOMRect = node.getBoundingClientRect()

        let position: {top: number, left: number} = {
            top: rect.top + pageYOffset,
            left: rect.left + pageXOffset
        }

        return position
    }

    // calculate anchor coords in panel using total document height and block position
    private GetAnchorPosition(node: HTMLElement): number {
        let height = this.GetDocumentHeight()
        let nodepos: {top: number, left: number} = this.GetElementPosition(node)
        let anchorpos = (nodepos.top * 90) / height // 100% is absolutely height of block, but Title can be bigger and padding also, so 90% is great.
        
        return anchorpos
    }

    private OnScrollEvent(): void {
        // from https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
        document.addEventListener('scroll', (e: Event) => {
            window.clearTimeout(this.isScrolling)

            // when scroll - show
            this.ShowPanel()

            this.isScrolling = setTimeout(() => {
                // if mouse not over panel than hide
                if (!this.mouse_over_panel) {
                    this.HidePanel()
                }
            }, 700)
        })
    }
}