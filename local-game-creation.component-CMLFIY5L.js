import {
  PickGameComponent
} from "./chunk-ZOIQRIBO.js";
import "./chunk-4HQW7IWY.js";
import {
  Router
} from "./chunk-MC3HRXVP.js";
import "./chunk-4D3V7D3R.js";
import "./chunk-NCTOIZLG.js";
import "./chunk-KTC3UZQD.js";
import "./chunk-EAKNFFYB.js";
import {
  Component,
  __async,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener
} from "./chunk-AC6ULWDE.js";

// src/app/components/normal-component/local-game-creation/local-game-creation.component.ts
var LocalGameCreationComponent = class _LocalGameCreationComponent {
  router = inject(Router);
  pickGame(pickedGame) {
    return __async(this, null, function* () {
      yield this.router.navigate(["/local", pickedGame, "config"]);
    });
  }
  static \u0275fac = function LocalGameCreationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalGameCreationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LocalGameCreationComponent, selectors: [["app-local-game-creation"]], decls: 1, vars: 0, consts: [[3, "pickGame"]], template: function LocalGameCreationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-pick-game", 0);
      \u0275\u0275listener("pickGame", function LocalGameCreationComponent_Template_app_pick_game_pickGame_0_listener($event) {
        return ctx.pickGame($event);
      });
      \u0275\u0275elementEnd();
    }
  }, dependencies: [PickGameComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalGameCreationComponent, [{
    type: Component,
    args: [{ selector: "app-local-game-creation", imports: [PickGameComponent], template: '<app-pick-game (pickGame)="pickGame($event)"></app-pick-game>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LocalGameCreationComponent, { className: "LocalGameCreationComponent", filePath: "src/app/components/normal-component/local-game-creation/local-game-creation.component.ts", lineNumber: 11 });
})();
export {
  LocalGameCreationComponent
};
//# sourceMappingURL=local-game-creation.component-CMLFIY5L.js.map
