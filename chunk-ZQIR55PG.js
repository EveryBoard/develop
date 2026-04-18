import {
  CurrentGameService
} from "./chunk-TOVTU7AD.js";
import {
  MessageDisplayer,
  PickGameComponent
} from "./chunk-T3FXKB4S.js";
import {
  Router
} from "./chunk-3SNUTSIQ.js";
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
} from "./chunk-FIMNEZBT.js";

// src/app/components/normal-component/online-game-selection/online-game-selection.component.ts
var OnlineGameSelectionComponent = class _OnlineGameSelectionComponent {
  router = inject(Router);
  currentGameService = inject(CurrentGameService);
  messageDisplayer = inject(MessageDisplayer);
  pickGame(pickedGame) {
    return __async(this, null, function* () {
      const canUserJoin = this.currentGameService.canUserCreate();
      if (canUserJoin.isSuccess()) {
        yield this.router.navigate(["/play", pickedGame]);
      } else {
        this.messageDisplayer.criticalMessage(canUserJoin.getReason());
      }
    });
  }
  static \u0275fac = function OnlineGameSelectionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OnlineGameSelectionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OnlineGameSelectionComponent, selectors: [["app-online-game-selection"]], decls: 1, vars: 0, consts: [[3, "pickGame"]], template: function OnlineGameSelectionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-pick-game", 0);
      \u0275\u0275listener("pickGame", function OnlineGameSelectionComponent_Template_app_pick_game_pickGame_0_listener($event) {
        return ctx.pickGame($event);
      });
      \u0275\u0275elementEnd();
    }
  }, dependencies: [PickGameComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OnlineGameSelectionComponent, [{
    type: Component,
    args: [{ selector: "app-online-game-selection", imports: [PickGameComponent], template: '<app-pick-game (pickGame)="pickGame($event)"></app-pick-game>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OnlineGameSelectionComponent, { className: "OnlineGameSelectionComponent", filePath: "src/app/components/normal-component/online-game-selection/online-game-selection.component.ts", lineNumber: 15 });
})();

export {
  OnlineGameSelectionComponent
};
//# sourceMappingURL=chunk-ZQIR55PG.js.map
