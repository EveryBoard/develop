import {
  GameWrapperMessages
} from "./chunk-JNEFX2J6.js";
import {
  GameService
} from "./chunk-NIMJEEIT.js";
import {
  CurrentGameService,
  GameActionFailure
} from "./chunk-UVMX2VD6.js";
import "./chunk-A7TTRA4O.js";
import {
  GameInfo,
  MessageDisplayer
} from "./chunk-L7LMCVVT.js";
import "./chunk-YOYRPYWO.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-3SNUTSIQ.js";
import {
  ConnectedUserService
} from "./chunk-6DPJ5FZV.js";
import "./chunk-VPL3GBHU.js";
import "./chunk-6Q2SZNEY.js";
import {
  require_dist
} from "./chunk-3D6AYEPT.js";
import "./chunk-62WCQMZP.js";
import {
  Component,
  __async,
  __toESM,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵi18n
} from "./chunk-FIMNEZBT.js";

// src/app/components/normal-component/online-game-creation/online-game-creation.component.ts
var import_lib = __toESM(require_dist());
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
    return import_lib.Utils.getNonNullable(this.route.snapshot.paramMap.get("game"));
  }
  createGameAndRedirectOrShowError(game) {
    return __async(this, null, function* () {
      const authUser = this.connectedUserService.user.get();
      import_lib.Utils.assert(authUser.isConnected(), "User must be connected and have a username to reach this page");
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
//# sourceMappingURL=online-game-creation.component-BLVNQBDN.js.map
