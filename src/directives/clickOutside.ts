import { assertIsNode } from "@/utilities/main";
import { type Directive } from "vue";

interface OutsideAwareElement extends Element {
    clickOutsideEvent?: (this: HTMLElement, event: MouseEvent) => void;
}

export const clickOutside: Directive<OutsideAwareElement, VoidFunction> = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = (event: MouseEvent) => {
            const target = event.target;
            assertIsNode(target);
            if (!(el === target || el.contains(target))) {
                binding.value();
            }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: (el) => {
        if (el.clickOutsideEvent !== undefined) {
            document.body.removeEventListener("click", el.clickOutsideEvent);
        }
    },
};
