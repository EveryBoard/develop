import {
  Directive,
  ElementRef,
  inject,
  setClassMetadata,
  ɵɵdefineDirective
} from "./chunk-FIMNEZBT.js";

// src/app/pipes-and-directives/toggle-visibility.directive.ts
var ToggleVisibilityDirective = class _ToggleVisibilityDirective {
  shown = false;
  input;
  constructor() {
    const element = inject(ElementRef);
    this.input = element.nativeElement.parentNode.previousSibling;
    element.nativeElement.addEventListener("click", (_) => {
      this.toggle();
    });
  }
  toggle() {
    this.shown = this.shown === false;
    if (this.shown) {
      this.input.setAttribute("type", "text");
    } else {
      this.input.setAttribute("type", "password");
    }
    this.input.focus();
  }
  static \u0275fac = function ToggleVisibilityDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToggleVisibilityDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _ToggleVisibilityDirective, selectors: [["", "toggleVisibility", ""]] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToggleVisibilityDirective, [{
    type: Directive,
    args: [{ selector: "[toggleVisibility]" }]
  }], () => [], null);
})();

export {
  ToggleVisibilityDirective
};
//# sourceMappingURL=chunk-2L5NJWNI.js.map
