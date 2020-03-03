// bookmark.ts
// skyparadise.org, evgenyberezin.com

window.onload = function() {
    new Bookmark({
        hoverZoneTimeout: 100,
        scrollPosition: "center",
        scrollBehavior: "smooth"
    })
}

interface Settings {
    hoverZoneTimeout: number
    scrollPosition: ScrollLogicalPosition
    scrollBehavior: ScrollBehavior
}

class Bookmark {
    private settings: Settings
    private body: HTMLElement
    private bm_panel: HTMLElement
    private bm_panel_container: HTMLElement
    private bm_hzone: HTMLElement

    constructor(settings: Settings) {
        this.settings = settings
        this.body = document.body
        this.CreateHoverZone()
        this.CreatePanel()
    }

    // create hover zone
    private CreateHoverZone() {
        let hzone: HTMLElement = document.createElement('div')
        hzone.classList.add('bookmark-hoverzone')
        hzone.addEventListener('mouseenter', (e: Event) => this.HandleHoverZone(e, this))
        this.bm_hzone = hzone
        this.body.appendChild(this.bm_hzone)
    }

    // create panel
    private CreatePanel() {
        let panel: HTMLElement = document.createElement('div')
        panel.classList.add("bookmark-panel")
        panel.addEventListener('mouseleave', (e: Event) => this.HandlePanelZone(e, this))

        let container = document.createElement('div')
        container.classList.add('bookmark-panel-container')
        panel.appendChild(container)

        this.bm_panel = panel
        this.bm_panel_container = container

        this.LoadStructure(this.bm_panel_container)
        this.body.appendChild(this.bm_panel)
    }

    // select all bookmarks in document
    private SelectAllBookmarks() {
        let bms: NodeList = document.querySelectorAll(".bookmark")
        return bms
    }

    // add each bookmark as link to container
    private LoadStructure(container: HTMLElement) {
        let bms = this.SelectAllBookmarks()
        bms.forEach((node: HTMLElement) => {
            container.appendChild(this.MakeAnchor(node))
        })
    }

    // make link from bookmark
    private MakeAnchor(node: HTMLElement) {
        let anchor = document.createElement('a')
        anchor.innerText = node.dataset.bookmarkTitle
        anchor.href = "#"

        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault()
            node.scrollIntoView({block: this.settings.scrollPosition, behavior: this.settings.scrollBehavior})
        })

        return anchor
    }

    // event listener for hovering
    private HandleHoverZone(e: Event, self: this) {
        self.ShowPanel()
    }

    // event listener for leaving 
    private HandlePanelZone(e: Event, self: this) {
        self.HidePanel()
    }

    // show panel, when hover
    private ShowPanel() {
        this.bm_hzone.style.display = "none"
        this.bm_panel.classList.add('bookmark-show')
    }

    // and hide on leaving
    private HidePanel() {
        this.bm_panel.classList.remove('bookmark-show')

        setTimeout(() => {
            this.bm_hzone.style.display = "block"
        }, this.settings.hoverZoneTimeout)
    }
}