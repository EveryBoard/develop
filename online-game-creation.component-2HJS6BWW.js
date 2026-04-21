import {
  GameWrapperMessages
} from "./chunk-UXGAQ225.js";
import {
  GameService
} from "./chunk-BWCW77C2.js";
import {
  CurrentGameService,
  GameActionFailure
} from "./chunk-WDBNWPFQ.js";
import "./chunk-AJLFJ5O3.js";
import {
  GameInfo,
  MessageDisplayer
} from "./chunk-MOTGNXJP.js";
import "./chunk-7JWLDCZD.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-GUMZAMYX.js";
import {
  ConnectedUserService
} from "./chunk-MKTESROA.js";
import "./chunk-HWRS2N2S.js";
import "./chunk-ASNDRGRI.js";
import {
  Utils
} from "./chunk-VWERQGBR.js";
import "./chunk-XUYKWQYA.js";
import {
  Component,
  __async,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵi18n
} from "./chunk-YYRXZMOY.js";

// src/app/components/normal-component/online-game-creation/online-game-creation.component.ts
var OnlineGameCreationComponent = class _OnlineGameCreationComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  connectedUserService = inject(ConnectedUserService);
  currentGameService = inject(CurrentGameService);
  messageDisplayer = inject(MessageDisplayer);
  gameService = inject(GameService);
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.createGameAndRedirectOrShowError(this.extractGameFromURL());
    });
  }
  extractGameFromURL() {
    return Utils.getNonNullable(this.route.snapshot.paramMap.get("game"));
  }
  createGameAndRedirectOrShowError(game) {
    return __async(this, null, function* () {
      const authUser = this.connectedUserService.user.get();
      Utils.assert(authUser.isConnected(), "User must be connected and have a username to reach this page");
      if (this.gameExists(game) === false) {
        yield this.router.navigate(["/notFound", GameWrapperMessages.NO_MATCHING_GAME(game)], { skipLocationChange: true });
        return;
      }
      const canCreateOnlineGame = this.currentGameService.canUserCreate();
      if (canCreateOnlineGame.isSuccess()) {
        const gameId = yield this.gameService.createGame(game);
        if (gameId.isFailure()) {
          const error = gameId.getReason();
          this.messageDisplayer.criticalMessage(GameActionFailure.UNEXPECTED_BACKEND_ERROR(error));
          yield this.router.navigate(["/"]);
        } else {
          yield this.router.navigate(["/play", game, gameId.get()]);
        }
      } else {
        this.messageDisplayer.infoMessage(canCreateOnlineGame.getReason());
        yield this.router.navigate(["/"]);
      }
    });
  }
  gameExists(gameName) {
    const optionalGameInfo = GameInfo.getByUrlName(gameName);
    return optionalGameInfo.isPresent();
  }
  static \u0275fac = function OnlineGameCreationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OnlineGameCreationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OnlineGameCreationComponent, selectors: [["app-online-game-creation"]], decls: 2, vars: 0, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_7017932994058745268$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ONLINE_GAME_CREATION_ONLINE_GAME_CREATION_COMPONENT_TS_0 = goog.getMsg("Creating online game, please wait, it should not take long.");
      i18n_0 = MSG_EXTERNAL_7017932994058745268$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_ONLINE_GAME_CREATION_ONLINE_GAME_CREATION_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Creating online game, please wait, it should not take long.`;
    }
    return [i18n_0];
  }, template: function OnlineGameCreationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "p");
      \u0275\u0275i18n(1, 0);
      \u0275\u0275domElementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OnlineGameCreationComponent, [{
    type: Component,
    args: [{
      selector: "app-online-game-creation",
      template: "<p i18n>Creating online game, please wait, it should not take long.</p>"
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OnlineGameCreationComponent, { className: "OnlineGameCreationComponent", filePath: "src/app/components/normal-component/online-game-creation/online-game-creation.component.ts", lineNumber: 17 });
})();
export {
  OnlineGameCreationComponent
};
//# sourceMappingURL=online-game-creation.component-2HJS6BWW.js.map
