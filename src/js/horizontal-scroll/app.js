/*!
 Horizontal scroll 3.0
 license: MIT
 Copyright © 2019 Albert Khabibullin. All rights reserved.
 https://github.com/iscars/horizontal-scroll
*/

const sliders = document.querySelectorAll('[data-name="slider"]')
const duration = 300

document.addEventListener("DOMContentLoaded", () => {
    if (!sliders.length) return
    sliders.forEach(slider => new Slider(slider))
})


class Slider {
    constructor(slider) {
        this.slider = slider
        this.scroller = this.slider.querySelector('[data-name="slider_scroller"]')
        this.scrollerWidth = this.scroller.scrollWidth
        this.items = this.slider.querySelectorAll('[data-name="slider_item"]')
        this.itemsWidths = Object.values(this.items).map( item => item.offsetWidth)
        this.btnPrevious = this.slider.querySelector('[data-name="slider_previous"]')
        this.btnNext = this.slider.querySelector('[data-name="slider_next"]')
        this.componentMount()
    }

    componentMount() {
        this.checkShowButtons()
        window.addEventListener("resize", () => this.checkShowButtons())
        this.scroller.addEventListener("scroll", () => this.checkShowButtons())
        this.btnNext.addEventListener("click", () => this.checkScrollNext())
        this.btnPrevious.addEventListener("click", () => this.checkScrollPrevious())
    }

    checkShowButtons() {
        const scrollerVisibleWidth = this.scroller.offsetWidth
        const scrollerScrollLeft = this.scroller.scrollLeft

        if (this.scrollerWidth - scrollerVisibleWidth > 0
            && (scrollerScrollLeft + scrollerVisibleWidth + 1) < this.scrollerWidth) {
            this.btnNext.classList.add('visible')
        } else {
            this.btnNext.classList.remove('visible')
        }

        if (this.scrollerWidth - scrollerVisibleWidth > 0 && scrollerScrollLeft > 0) {
            this.btnPrevious.classList.add('visible')
        } else {
            this.btnPrevious.classList.remove('visible')
        }
    }

    checkScrollNext() {
        const scrollerVisibleWidth = this.scroller.offsetWidth
        const scrollerScrollLeft = this.scroller.scrollLeft
        const scrollerScrollRight = scrollerScrollLeft + scrollerVisibleWidth
        const nextItemIndex = getNextItem(scrollerScrollLeft, scrollerScrollRight, this.itemsWidths, this.items)
        const possibleScroll = this.scrollerWidth - scrollerVisibleWidth + 1
        const nextItem = (nextItemIndex !== this.items.length) ? this.items[nextItemIndex].offsetLeft : null

        function getNextItem(left, right, widths, items) {
            let availableWidth = 0, visibleWidth = 0, i = 0

            do {
                availableWidth += widths[i]
                i++
            } while (right >= availableWidth && i < widths.length)

            i = i - 1

            for (let j = 0; j < i; j++) {
                visibleWidth += widths[j]
            }

            return (visibleWidth <= left) ? i + 1 : i // Возникают проблемы вычислений для элементов, размеры которых
            // зависят от шрифтов. Все элементы имеют дробные значения и округляются до целого. В результате
            // 79.68 + 81.73 округляется как 80 + 82 = 162. В то время как scrollLeft получает значение 161.41 и
            // округляет до 161. Результатом является
            // зацикливание на одном элементе, отказ прокрутки вправо.
            // 1. Подобные ошибки возникают меньше при использовании универсальных шрифтов для разных ОС. Например Arial
            // не воспринимается OSX правильно.
            // 2. Установить диапазон погрешности, изменить условие на (visibleWidth - n <= left), где n - кол-во
            // пикселей погрешности. Чем дальше влево прокрутка, тем больше погрешность.
        }

        if (possibleScroll < nextItem || nextItemIndex === this.items.length) {
            this.prepareScrolling(possibleScroll)
        } else {
            this.prepareScrolling(nextItem)
        }
    }

    checkScrollPrevious() {
        const scrollerVisibleWidth = this.scroller.offsetWidth
        const scrollerScrollLeft = this.scroller.scrollLeft
        const firstVisible = getFirstVisible(scrollerScrollLeft, this.itemsWidths)
        const prevItemIndex = getPrevItem(scrollerVisibleWidth, firstVisible, this.itemsWidths)
        const nextItem = this.items[prevItemIndex].offsetLeft
        this.prepareScrolling(nextItem)

        function getFirstVisible(scrollLeft, widths) {
            let first = 0, i = 0

            while (first < scrollLeft) {
                first += widths[i]
                i++
            }

            return i
        }

        function getPrevItem(visibleScroll, firstVisible, widths) {
            let i = firstVisible, possible = 0

            if (widths[i - 1] >= visibleScroll) {
                return i - 1
            }
            else {
                do {
                    i--
                    possible += widths[i]
                } while (possible < visibleScroll && i > -1)
                return i + 1
            }
        }
    }

    prepareScrolling(offsetLeft) {
        const start = this.scroller.scrollLeft
        const distance = offsetLeft - start
        this.animateScrolling(start, distance)

        this.btnPrevious.disabled = true
        this.btnNext.disabled = true

        setTimeout( () => {
            this.btnPrevious.disabled = false
            this.btnNext.disabled = false
        }, duration + 50)
    }

    animateScrolling(start, distance) {
        let currentTime = 0
        const increment = 20

        Math.easeInOutQuad = (t, b, c, d) => {
            t /= d/2
            if (t < 1) return c/2*t*t + b
            t--
            return -c/2 * (t*(t-2) - 1) + b
        }

        const doScroll = () => {
            currentTime += increment
            this.scroller.scrollLeft = Math.easeInOutQuad(currentTime, start, distance, duration)
            if (currentTime < duration) {
                setTimeout(doScroll, increment)
            }
        }

        doScroll()
    }
}