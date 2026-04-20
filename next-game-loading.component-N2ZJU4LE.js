import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵi18n
} from "./chunk-YYRXZMOY.js";

// src/app/components/normal-component/next-game-loading/next-game-loading.component.ts
var NextGameLoadingComponent = class _NextGameLoadingComponent {
  static \u0275fac = function NextGameLoadingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NextGameLoadingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NextGameLoadingComponent, selectors: [["app-next-game-loading"]], decls: 2, vars: 0, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6005801113696805305$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_NEXT_GAME_LOADING_NEXT_GAME_LOADING_COMPONENT_TS_0 = goog.getMsg("The replay game is loading, please wait, it should not take long.");
      i18n_0 = MSG_EXTERNAL_6005801113696805305$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_NEXT_GAME_LOADING_NEXT_GAME_LOADING_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`The replay game is loading, please wait, it should not take long.`;
    }
    return [i18n_0];
  }, template: function NextGameLoadingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "p");
      \u0275\u0275i18n(1, 0);
      \u0275\u0275domElementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NextGameLoadingComponent, [{
    type: Component,
    args: [{ selector: "app-next-game-loading", template: "<p i18n>The replay game is loading, please wait, it should not take long.</p>\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NextGameLoadingComponent, { className: "NextGameLoadingComponent", filePath: "src/app/components/normal-component/next-game-loading/next-game-loading.component.ts", lineNumber: 7 });
})();
export {
  NextGameLoadingComponent
};
//# sourceMappingURL=next-game-loading.component-N2ZJU4LE.js.map
