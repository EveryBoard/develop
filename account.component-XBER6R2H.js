import {
  RouterLink
} from "./chunk-GUMZAMYX.js";
import "./chunk-XUYKWQYA.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵi18n,
  ɵɵtext
} from "./chunk-YYRXZMOY.js";

// src/app/components/normal-component/account/account.component.ts
var AccountComponent = class _AccountComponent {
  static \u0275fac = function AccountComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccountComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccountComponent, selectors: [["app-account"]], decls: 11, vars: 0, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6153797048311741939$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ACCOUNT_ACCOUNT_COMPONENT_TS_0 = goog.getMsg("User settings");
      i18n_0 = MSG_EXTERNAL_6153797048311741939$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ACCOUNT_ACCOUNT_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`User settings`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_6838770899052870929$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ACCOUNT_ACCOUNT_COMPONENT_TS_1 = goog.getMsg("If you forgot your password or want to change it, click on the following button:");
      i18n_1 = MSG_EXTERNAL_6838770899052870929$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ACCOUNT_ACCOUNT_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`If you forgot your password or want to change it, click on the following button:`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_1636934520301910285$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ACCOUNT_ACCOUNT_COMPONENT_TS_2 = goog.getMsg("Reset password");
      i18n_2 = MSG_EXTERNAL_1636934520301910285$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ACCOUNT_ACCOUNT_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Reset password`;
    }
    return [i18n_0, i18n_1, i18n_2, [1, "hero-body"], [1, "title"], [1, "box"], [1, "block", "level-left"], [1, "level-item"], ["id", "reset", "routerLink", "/reset-password", 1, "button", "is-primary", "level-item", "is-small"]];
  }, template: function AccountComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 3)(1, "p", 4);
      \u0275\u0275i18n(2, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(3, "div", 5)(4, "p", 4);
      \u0275\u0275text(5, "Resetting password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 6)(7, "p", 7);
      \u0275\u0275i18n(8, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "button", 8);
      \u0275\u0275i18n(10, 2);
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccountComponent, [{
    type: Component,
    args: [{ selector: "app-account", imports: [RouterLink], template: '<div class="hero-body">\n    <p class="title"\n       i18n>User settings</p>\n</div>\n<div class="box">\n    <p class="title">Resetting password</p>\n    <div class="block level-left">\n        <p class="level-item"\n           i18n>If you forgot your password or want to change it, click on the following button:</p>\n        <button id="reset"\n                class="button is-primary level-item is-small"\n                routerLink="/reset-password"\n                i18n>Reset password</button>\n    </div>\n</div>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccountComponent, { className: "AccountComponent", filePath: "src/app/components/normal-component/account/account.component.ts", lineNumber: 9 });
})();
export {
  AccountComponent
};
//# sourceMappingURL=account.component-XBER6R2H.js.map
