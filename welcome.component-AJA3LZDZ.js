import {
  CurrentGameService
} from "./chunk-V3YLFQIL.js";
import "./chunk-6YYLMVEQ.js";
import {
  GameInfo,
  MessageDisplayer,
  PickGameComponent
} from "./chunk-PS6FUQ5F.js";
import {
  ThemeService
} from "./chunk-4HQW7IWY.js";
import {
  FaIconComponent,
  faBookOpen,
  faDesktop,
  faNetworkWired
} from "./chunk-5NDDVV6Y.js";
import {
  Router,
  RouterLink
} from "./chunk-MC3HRXVP.js";
import "./chunk-OH7GNXKT.js";
import "./chunk-4D3V7D3R.js";
import "./chunk-NCTOIZLG.js";
import {
  MGPOptional
} from "./chunk-KTC3UZQD.js";
import "./chunk-EAKNFFYB.js";
import {
  Component,
  __async,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵi18n,
  ɵɵi18nEnd,
  ɵɵi18nStart,
  ɵɵinterpolate2,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-AC6ULWDE.js";

// src/app/components/normal-component/welcome/welcome.component.ts
function WelcomeComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 29);
    \u0275\u0275listener("click", function WelcomeComponent_Conditional_30_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeInfo());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 30)(3, "header", 31)(4, "p", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 33);
    \u0275\u0275listener("click", function WelcomeComponent_Conditional_30_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeInfo());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "section", 34)(8, "div", 35)(9, "div", 36)(10, "p", 37);
    \u0275\u0275element(11, "img", 38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 16)(13, "div", 21);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 35)(16, "div", 36)(17, "a", 39);
    \u0275\u0275listener("click", function WelcomeComponent_Conditional_30_Template_a_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createGame(ctx_r1.gameInfoDetails.get().urlName));
    });
    \u0275\u0275element(18, "fa-icon", 40);
    \u0275\u0275text(19, "\xA0 ");
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275i18n(21, 8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 36)(23, "a", 41);
    \u0275\u0275listener("click", function WelcomeComponent_Conditional_30_Template_a_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createLocalGame(ctx_r1.gameInfoDetails.get().urlName));
    });
    \u0275\u0275element(24, "fa-icon", 40);
    \u0275\u0275text(25, "\xA0 ");
    \u0275\u0275elementStart(26, "span");
    \u0275\u0275i18n(27, 9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 36)(29, "a", 42);
    \u0275\u0275listener("click", function WelcomeComponent_Conditional_30_Template_a_click_29_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createTutorial(ctx_r1.gameInfoDetails.get().urlName));
    });
    \u0275\u0275element(30, "fa-icon", 40);
    \u0275\u0275text(31, "\xA0 ");
    \u0275\u0275elementStart(32, "span");
    \u0275\u0275i18n(33, 10);
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.gameInfoDetails.get().name);
    \u0275\u0275advance(6);
    \u0275\u0275property("src", \u0275\u0275interpolate2("assets/images/", ctx_r1.theme, "/", ctx_r1.gameInfoDetails.get().urlName, ".png"), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.gameInfoDetails.get().description, " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("icon", ctx_r1.iconOnlineGame);
    \u0275\u0275advance(6);
    \u0275\u0275property("icon", ctx_r1.iconLocalGame);
    \u0275\u0275advance(6);
    \u0275\u0275property("icon", ctx_r1.iconTutorial);
  }
}
var WelcomeComponent = class _WelcomeComponent {
  router = inject(Router);
  messageDisplayer = inject(MessageDisplayer);
  currentGameService = inject(CurrentGameService);
  numberOfColumns = 5;
  games = [];
  theme;
  iconOnlineGame = faNetworkWired;
  iconLocalGame = faDesktop;
  iconTutorial = faBookOpen;
  gameInfoDetails = MGPOptional.empty();
  constructor() {
    this.theme = inject(ThemeService).getTheme();
    const allGames = GameInfo.getAllGames();
    let column = 0;
    for (let i = 0; i < allGames.length; i++) {
      if (i < this.numberOfColumns) {
        this.games.push([]);
      }
      this.games[column].push(allGames[i]);
      column = (column + 1) % this.numberOfColumns;
    }
  }
  createGame(game) {
    return __async(this, null, function* () {
      const canCreateGame = this.currentGameService.canUserCreate();
      if (canCreateGame.isSuccess()) {
        if (game == null) {
          return this.router.navigate(["/play"]);
        } else {
          return this.router.navigate(["/play", game]);
        }
      } else {
        this.messageDisplayer.criticalMessage(canCreateGame.getReason());
        return false;
      }
    });
  }
  createLocalGame(game) {
    return __async(this, null, function* () {
      return this.router.navigate(["/local", game, "config"]);
    });
  }
  createTutorial(game) {
    return this.router.navigate(["/tutorial", game]);
  }
  pickGame(game) {
    this.gameInfoDetails = GameInfo.getByUrlName(game);
  }
  closeInfo() {
    this.gameInfoDetails = MGPOptional.empty();
  }
  static \u0275fac = function WelcomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WelcomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WelcomeComponent, selectors: [["app-welcome"]], decls: 32, vars: 1, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_5723949445116321937$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_0 = goog.getMsg("EveryBoard");
      i18n_0 = MSG_EXTERNAL_5723949445116321937$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`EveryBoard`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_3969439762814028035$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_1 = goog.getMsg("EveryBoard is a website to play and learn the rules of various abstract strategy games with perfect information.{$lineBreak} Such games are games that do not include any randomness, agility, or hidden information. These games are played by two players, turn by turn.", { "lineBreak": "\uFFFD#6\uFFFD\uFFFD/#6\uFFFD" }, { original_code: { "lineBreak": "<br/>" } });
      i18n_1 = MSG_EXTERNAL_3969439762814028035$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`EveryBoard is a website to play and learn the rules of various abstract strategy games with perfect information.${"\uFFFD#6\uFFFD\uFFFD/#6\uFFFD"}:LINE_BREAK: Such games are games that do not include any randomness, agility, or hidden information. These games are played by two players, turn by turn.`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_6017042194813294080$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_2 = goog.getMsg("Play online");
      i18n_2 = MSG_EXTERNAL_6017042194813294080$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Play online`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_2009811124619716606$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_3 = goog.getMsg("Create an online game");
      i18n_3 = MSG_EXTERNAL_2009811124619716606$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Create an online game`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_7868391487776969346$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_4 = goog.getMsg("See all online games");
      i18n_4 = MSG_EXTERNAL_7868391487776969346$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`See all online games`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_2615338817912103674$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_5 = goog.getMsg("Play offline");
      i18n_5 = MSG_EXTERNAL_2615338817912103674$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Play offline`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_8564202903947049539$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_6 = goog.getMsg("Play");
      i18n_6 = MSG_EXTERNAL_8564202903947049539$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Play`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_6899134966533859260$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_7 = goog.getMsg("Learn");
      i18n_7 = MSG_EXTERNAL_6899134966533859260$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Learn`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_6017042194813294080$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_8 = goog.getMsg("Play online");
      i18n_8 = MSG_EXTERNAL_6017042194813294080$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`Play online`;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_2615338817912103674$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_9 = goog.getMsg("Play offline");
      i18n_9 = MSG_EXTERNAL_2615338817912103674$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`Play offline`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_3468367367164457633$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_10 = goog.getMsg("Learn the rules");
      i18n_10 = MSG_EXTERNAL_3468367367164457633$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_WELCOME_WELCOME_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`Learn the rules`;
    }
    return [i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, i18n_9, i18n_10, [1, "hero"], [1, "hero-body"], [1, "title"], [1, "subtitle"], [1, "columns", "mb-0"], [1, "column"], [1, "card", "mb-0"], [1, "card-header"], [1, "card-header-title"], [1, "card-content"], [1, "content"], ["id", "createOnlineGame", 1, "button", "is-medium", "is-fullwidth", "is-primary", "mb-1", 3, "click"], ["id", "seeGameList", "routerLink", "/lobby", 1, "button", "is-medium", "is-fullwidth", "is-primary"], [1, "content", "has-text-centered"], ["routerLink", "/local", 1, "button", "is-medium", "is-fullwidth", "is-primary", "mb-1"], ["routerLink", "/tutorial", 1, "button", "is-medium", "is-fullwidth", "is-primary"], ["id", "gameInfoModal", 1, "modal", "is-active"], ["id", "foo", 3, "pickGame"], ["id", "modalBackground", 1, "modal-background", 3, "click"], [1, "modal-card"], [1, "modal-card-head", "is-primary"], [1, "modal-card-title"], ["id", "closeInfo", "aria-label", "close", 1, "delete", 3, "click"], [1, "modal-card-body"], [1, "columns"], [1, "column", "is-one-third"], [1, "image"], [3, "src"], ["id", "play-online", 1, "button", "is-fullwidth", 3, "click"], [3, "icon"], ["id", "play-offline", 1, "button", "is-fullwidth", 3, "click"], ["id", "play-tutorial", 1, "button", "is-fullwidth", 3, "click"]];
  }, template: function WelcomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 11)(1, "div", 12)(2, "p", 13);
      \u0275\u0275i18n(3, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 14);
      \u0275\u0275i18nStart(5, 1);
      \u0275\u0275element(6, "br");
      \u0275\u0275i18nEnd();
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 15)(8, "div", 16)(9, "div", 17)(10, "header", 18)(11, "p", 19);
      \u0275\u0275i18n(12, 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 20)(14, "div", 21)(15, "button", 22);
      \u0275\u0275listener("click", function WelcomeComponent_Template_button_click_15_listener() {
        return ctx.createGame();
      });
      \u0275\u0275i18n(16, 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "button", 23);
      \u0275\u0275i18n(18, 4);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(19, "div", 16)(20, "div", 17)(21, "header", 18)(22, "p", 19);
      \u0275\u0275i18n(23, 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 20)(25, "div", 24)(26, "button", 25);
      \u0275\u0275i18n(27, 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "button", 26);
      \u0275\u0275i18n(29, 7);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275conditionalCreate(30, WelcomeComponent_Conditional_30_Template, 34, 8, "div", 27);
      \u0275\u0275elementStart(31, "app-pick-game", 28);
      \u0275\u0275listener("pickGame", function WelcomeComponent_Template_app_pick_game_pickGame_31_listener($event) {
        return ctx.pickGame($event);
      });
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(30);
      \u0275\u0275conditional(ctx.gameInfoDetails.isPresent() ? 30 : -1);
    }
  }, dependencies: [RouterLink, FaIconComponent, PickGameComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WelcomeComponent, [{
    type: Component,
    args: [{ selector: "app-welcome", imports: [RouterLink, FaIconComponent, PickGameComponent], template: '<section class="hero">\n    <div class="hero-body">\n        <p class="title"\n           i18n>EveryBoard</p>\n        <p class="subtitle"\n           i18n>EveryBoard is a website to play and learn the rules of various abstract strategy games with perfect information.<br/>\n            Such games are games that do not include any randomness, agility, or hidden information.\n            These games are played by two players, turn by turn.</p>\n        </div>\n        <div class="columns mb-0">\n            <div class="column">\n                <div class="card mb-0">\n                    <header class="card-header">\n                        <p class="card-header-title"\n                           i18n>Play online</p>\n                    </header>\n                    <div class="card-content">\n                        <div class="content">\n                            <button id="createOnlineGame"\n                                    (click)="createGame()"\n                                    class="button is-medium is-fullwidth is-primary mb-1"\n                                    i18n>Create an online game</button>\n                            <button id="seeGameList"\n                                    class="button is-medium is-fullwidth is-primary"\n                                    routerLink="/lobby"\n                                    i18n>See all online games</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class="column">\n                <div class="card mb-0">\n                    <header class="card-header">\n                        <p class="card-header-title"\n                           i18n>Play offline</p>\n                    </header>\n                    <div class="card-content">\n                        <div class="content has-text-centered">\n                            <button class="button is-medium is-fullwidth is-primary mb-1"\n                                    routerLink="/local"\n                                    i18n>Play</button>\n                            <button class="button is-medium is-fullwidth is-primary"\n                                    routerLink="/tutorial"\n                                    i18n>Learn</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        @if (gameInfoDetails.isPresent()) {\n            <div id="gameInfoModal"\n                 class="modal is-active">\n                <div id="modalBackground"\n                     class="modal-background"\n                     (click)="closeInfo()"></div>\n                <div class="modal-card">\n                    <header class="modal-card-head is-primary">\n                        <p class="modal-card-title">{{ gameInfoDetails.get().name }}</p>\n                        <button id="closeInfo"\n                                class="delete"\n                                aria-label="close"\n                                (click)="closeInfo()"></button>\n                    </header>\n                    <section class="modal-card-body">\n                        <div class="columns">\n                            <div class="column is-one-third">\n                                <p class="image"><img src="assets/images/{{ theme }}/{{ gameInfoDetails.get().urlName }}.png"></p>\n                            </div>\n                            <div class="column">\n                                <div class="content">\n                                    {{ gameInfoDetails.get().description }}\n                                </div>\n                            </div>\n                        </div>\n                        <div class="columns">\n                            <div class="column is-one-third">\n                                <a id="play-online"\n                                   class="button is-fullwidth"\n                                   (click)="createGame(gameInfoDetails.get().urlName)">\n                                    <fa-icon [icon]="iconOnlineGame"></fa-icon>&nbsp;\n                                    <span i18n>Play online</span>\n                                </a>\n                            </div>\n                            <div class="column is-one-third">\n                                <a id="play-offline"\n                                   class="button is-fullwidth"\n                                   (click)="createLocalGame(gameInfoDetails.get().urlName)">\n                                    <fa-icon [icon]="iconLocalGame"></fa-icon>&nbsp;\n                                    <span i18n>Play offline</span>\n                                </a>\n                            </div>\n                            <div class="column is-one-third">\n                                <a id="play-tutorial"\n                                   class="button is-fullwidth"\n                                   (click)="createTutorial(gameInfoDetails.get().urlName)">\n                                    <fa-icon [icon]="iconTutorial"></fa-icon>&nbsp;\n                                    <span i18n>Learn the rules</span>\n                                </a>\n                            </div>\n                        </div>\n                    </section>\n                </div>\n            </div>\n        }\n\n        <app-pick-game id="foo"\n                       (pickGame)="pickGame($event)"></app-pick-game>\n    </section>\n' }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WelcomeComponent, { className: "WelcomeComponent", filePath: "src/app/components/normal-component/welcome/welcome.component.ts", lineNumber: 18 });
})();
export {
  WelcomeComponent
};
//# sourceMappingURL=welcome.component-AJA3LZDZ.js.map
