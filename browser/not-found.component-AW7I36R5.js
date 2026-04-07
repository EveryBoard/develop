import {
  ActivatedRoute
} from "./chunk-3SNUTSIQ.js";
import "./chunk-62WCQMZP.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵi18n,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-FIMNEZBT.js";

// src/app/components/normal-component/not-found/not-found.component.ts
var NotFoundComponent = class _NotFoundComponent {
  message;
  constructor() {
    this.message = inject(ActivatedRoute).snapshot.paramMap.get("message") ?? $localize`This page does not exist.`;
  }
  static \u0275fac = function NotFoundComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotFoundComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotFoundComponent, selectors: [["app-not-found"]], decls: 5, vars: 1, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6595008830732269870$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_NOT_FOUND_NOT_FOUND_COMPONENT_TS_0 = goog.getMsg("Not found");
      i18n_0 = MSG_EXTERNAL_6595008830732269870$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_NOT_FOUND_NOT_FOUND_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Not found`;
    }
    return [i18n_0, [1, "message", "is-danger"], [1, "message-header"], [1, "message-body"]];
  }, template: function NotFoundComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 1)(1, "div", 2);
      \u0275\u0275i18n(2, 0);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 3);
      \u0275\u0275text(4);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.message);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotFoundComponent, [{
    type: Component,
    args: [{ selector: "app-not-found", template: '<div class="message is-danger">\n    <div class="message-header"\n         i18n>Not found</div>\n    <div class="message-body">{{ message }}</div>\n</div>\n' }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotFoundComponent, { className: "NotFoundComponent", filePath: "src/app/components/normal-component/not-found/not-found.component.ts", lineNumber: 8 });
})();
export {
  NotFoundComponent
};
//# sourceMappingURL=not-found.component-AW7I36R5.js.map
