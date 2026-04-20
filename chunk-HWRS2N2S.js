import {
  Directive,
  ElementRef,
  inject,
  setClassMetadata,
  ɵɵdefineDirective
} from "./chunk-YYRXZMOY.js";

// src/app/pipes-and-directives/autofocus.directive.ts
var AutofocusDirective = class _AutofocusDirective {
  element = inject(ElementRef);
  ngOnInit() {
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 1);
  }
  static \u0275fac = function AutofocusDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AutofocusDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _AutofocusDirective, selectors: [["", "autofocus", ""]] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AutofocusDirective, [{
    type: Directive,
    args: [{ selector: "[autofocus]" }]
  }], null, null);
})();

export {
  AutofocusDirective
};
//# sourceMappingURL=chunk-HWRS2N2S.js.map
