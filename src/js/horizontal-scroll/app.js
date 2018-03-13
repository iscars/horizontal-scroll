/*!
 Horizontal scroll 2.0
 license: MIT
 Copyright © 2017 Albert Khabibullin. All rights reserved.
 https://github.com/iscars/horizontal-scroll
*/

const tabBar = document.querySelector('[data-name="tabBar"]')

if (tabBar) { // Init
    var SCROLLER = tabBar.querySelector('[data-name="tabBarScroller"]') // Scroller
    var scrollerWidth = SCROLLER.scrollWidth

    let tabBarItems = tabBar.querySelectorAll('[data-name="tabBarItem"]') // Items
    tabBarItems = Array.prototype.slice.call(tabBarItems)
    var arrItemsWidth = tabBarItems.map( (item, i) => {
        item.setAttribute('id', `tabBarItem${i}`)
        return item.offsetWidth

    })

    var btnBack = tabBar.querySelector('[data-name="tabBarBtnBack"]') // Buttons
    var btnForward = tabBar.querySelector('[data-name="tabBarBtnForward"]')

    showButtons() // Check the need for visible buttons
    window.onresize = () => showButtons()
    SCROLLER.onscroll = () => showButtons()
}

function showButtons() {
    let visibleScroll = SCROLLER.offsetWidth;
    let scrollLeft = SCROLLER.scrollLeft;

    (scrollerWidth - visibleScroll > 0 && (scrollLeft + visibleScroll + 1) < scrollerWidth) ?
        btnForward.setAttribute('style', 'visibility: visible; opacity: 1;') :
        btnForward.setAttribute('style', 'visibility: hidden; opacity: 0;');

    (scrollerWidth - visibleScroll > 0 && scrollLeft > 0) ?
        btnBack.setAttribute('style', 'visibility: visible; opacity: 1;') :
        btnBack.setAttribute('style', 'visibility: hidden; opacity: 0;')
}

btnForward.onclick = (ev) => { // Forward
    ev && ev.preventDefault && ev.preventDefault()
    let visibleScroll = SCROLLER.offsetWidth
    let scrollLeft = SCROLLER.scrollLeft
    let scrollRight = scrollLeft + visibleScroll
    let nextItem = getNextItem(scrollLeft, scrollRight)
    let nextItemId = `tabBarItem${nextItem}`
    let possibleScroll = scrollerWidth - visibleScroll + 1
    let nextItemLeft = document.getElementById(nextItemId).offsetLeft;

    (possibleScroll < nextItemLeft) ?
        scrollToId(nextItemId, possibleScroll) :
        scrollToId(nextItemId)
}

btnBack.onclick = (ev) => { // Back
    ev && ev.preventDefault && ev.preventDefault()
    let visibleScroll = SCROLLER.offsetWidth
    let scrollLeft = SCROLLER.scrollLeft
    let firstVisible = getFirstVisible(scrollLeft)
    let prevItem = getPrevItem(visibleScroll, firstVisible)
    let prevItemId = `tabBarItem${prevItem}`
    scrollToId(prevItemId)
}

function getNextItem(scrollLeft, scrollRight) {
    let visibleItems = 0,
        beforeItems = 0,
        i = 0
    do {
        visibleItems += arrItemsWidth[i]
        i++
    } while (scrollRight >= visibleItems && i < arrItemsWidth.length)
    i--
    for (let j = 0; j < i; j++) {
        beforeItems += arrItemsWidth[j]
    }
    beforeItems = beforeItems - 1;
    (beforeItems <= scrollLeft) ? i++ : i
    return i
}

function getFirstVisible(scrollLeft) {
    let first = 0, i = 0
    while (first < scrollLeft) {
        first += arrItemsWidth[i]
        i++
    }

    return i
}

function getPrevItem(visibleScroll, firstVisible) {
    let i = firstVisible, possible = 0

    if (arrItemsWidth[i - 1] >= visibleScroll) {
        return i - 1
    }
    else {
        do {
            i--
            possible += arrItemsWidth[i]
        } while (possible < visibleScroll && i > -1)
        return i + 1
    }
}

function scrollToId(id, possibleScroll) {
    let duration = 400
    let offsetLeft = (possibleScroll) ? possibleScroll : document.getElementById(id).offsetLeft
    animateScroll(SCROLLER, offsetLeft, duration)

    btnBack.setAttribute('disabled', true)
    btnForward.setAttribute('disabled', true)
    setTimeout( () => {
        btnBack.removeAttribute('disabled')
        btnForward.removeAttribute('disabled')
    }, duration + 50)
}

function animateScroll(element, to, duration) {
    let start = element.scrollLeft,
        change = to - start,
        currentTime = 0,
        increment = 20
    let doScroll = () => {
        currentTime += increment
        let val = Math.easeInOutQuad(currentTime, start, change, duration)
        element.scrollLeft = val
        if (currentTime < duration) {
            setTimeout(doScroll, increment)
        }
    }
    Math.easeInOutQuad = (t, b, c, d) => {
        t /= d/2
        if (t < 1) return c/2*t*t + b
        t--
        return -c/2 * (t*(t-2) - 1) + b
    }
    doScroll()
}