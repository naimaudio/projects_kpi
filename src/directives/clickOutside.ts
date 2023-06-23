import { type Directive } from "vue"

interface OutsideAwareElement extends Element {
    clickOutsideEvent?: (event: MouseEvent) => void
}

export const clickOutside: Directive<OutsideAwareElement, VoidFunction> = {
    beforeMount: (el, binding, vnode) => {
        el.clickOutsideEvent = (event: MouseEvent) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value()
            }
        }
        document.body.addEventListener("click", el.clickOutsideEvent)
    },
    unmounted: (el) => {
        document.body.removeEventListener("click", el.clickOutsideEvent)
    },
}
