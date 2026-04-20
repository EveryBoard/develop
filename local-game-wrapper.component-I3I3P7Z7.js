import {
  ViewConfigComponent
} from "./chunk-HXN6W32M.js";
import {
  GameWrapper,
  RulesConfigUtils
} from "./chunk-ZRCUNMSR.js";
import {
  AIStats,
  GameNodeStats,
  GameStatus,
  Player
} from "./chunk-7YJCR4E3.js";
import "./chunk-7JWLDCZD.js";
import "./chunk-DTAE6QI4.js";
import "./chunk-GUMZAMYX.js";
import "./chunk-HWRS2N2S.js";
import {
  Debug
} from "./chunk-ASNDRGRI.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-OJTN7ELL.js";
import {
  JSONParser,
  MGPOptional,
  MGPValidation,
  Utils,
  isJSONPrimitive
} from "./chunk-VWERQGBR.js";
import {
  NgClass
} from "./chunk-XUYKWQYA.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  __async,
  __publicField,
  __superGet,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵi18n,
  ɵɵi18nApply,
  ɵɵi18nExp,
  ɵɵinterpolate1,
  ɵɵinterpolate2,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-YYRXZMOY.js";

// src/app/components/wrapper-components/local-game-wrapper/local-game-wrapper.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LocalGameWrapperComponent_1;
var _c0 = (a0, a1) => [a0, a1];
var _forTrack0 = ($index, $item) => $item.name;
function LocalGameWrapperComponent_Conditional_2_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.winnerMessage.get());
  }
}
function LocalGameWrapperComponent_Conditional_2_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 24);
    \u0275\u0275i18n(1, 3);
    \u0275\u0275elementEnd();
  }
}
function LocalGameWrapperComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275conditionalCreate(1, LocalGameWrapperComponent_Conditional_2_Conditional_4_Conditional_1_Template, 2, 1, "p", 23);
    \u0275\u0275conditionalCreate(2, LocalGameWrapperComponent_Conditional_2_Conditional_4_Conditional_2_Template, 2, 0, "p", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.winnerMessage.isPresent() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.winnerMessage.isAbsent() ? 2 : -1);
  }
}
function LocalGameWrapperComponent_Conditional_2_For_6_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ai_r5 = ctx.$implicit;
    const player_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate2("player-", player_r4.getValue(), "-ai-", ai_r5.name))("value", ai_r5.name);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ai_r5.name);
  }
}
function LocalGameWrapperComponent_Conditional_2_For_6_Conditional_9_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const player_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate2("player-", player_r4.getValue(), "-option-", option_r7.name))("value", option_r7.name);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r7.name);
  }
}
function LocalGameWrapperComponent_Conditional_2_For_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function LocalGameWrapperComponent_Conditional_2_For_6_Conditional_9_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const player_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.aiOptions[player_r4.getValue()], $event) || (ctx_r1.aiOptions[player_r4.getValue()] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function LocalGameWrapperComponent_Conditional_2_For_6_Conditional_9_Template_select_change_1_listener() {
      \u0275\u0275restoreView(_r6);
      const player_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updatePlayer(player_r4));
    });
    \u0275\u0275elementStart(2, "option", 32);
    \u0275\u0275i18n(3, 6);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, LocalGameWrapperComponent_Conditional_2_For_6_Conditional_9_For_5_Template, 2, 5, "option", 29, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const player_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("ai-option-select-", player_r4.getValue()));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.aiOptions[player_r4.getValue()]);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.availableAIOptions(player_r4.getValue()));
  }
}
function LocalGameWrapperComponent_Conditional_2_For_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const player_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("score-", player_r4.getValue()))("ngClass", player_r4.getHTMLClass("-fg"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.gameComponent.getScoreString(player_r4));
  }
}
function LocalGameWrapperComponent_Conditional_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "p", 25);
    \u0275\u0275i18n(2, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "select", 27);
    \u0275\u0275listener("change", function LocalGameWrapperComponent_Conditional_2_For_6_Template_select_change_4_listener() {
      const player_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updatePlayer(player_r4));
    });
    \u0275\u0275twoWayListener("ngModelChange", function LocalGameWrapperComponent_Conditional_2_For_6_Template_select_ngModelChange_4_listener($event) {
      const player_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.playerSelection[player_r4.getValue()], $event) || (ctx_r1.playerSelection[player_r4.getValue()] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 28);
    \u0275\u0275i18n(6, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, LocalGameWrapperComponent_Conditional_2_For_6_For_8_Template, 2, 5, "option", 29, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, LocalGameWrapperComponent_Conditional_2_For_6_Conditional_9_Template, 6, 3, "div", 26);
    \u0275\u0275conditionalCreate(10, LocalGameWrapperComponent_Conditional_2_For_6_Conditional_10_Template, 2, 4, "p", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const player_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", player_r4.getHTMLClass("-bg"));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", player_r4.getHTMLClass("-fg"));
    \u0275\u0275advance();
    \u0275\u0275i18nExp(player_r4.getValue() + 1);
    \u0275\u0275i18nApply(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", \u0275\u0275interpolate1("player-select-", player_r4.getValue()));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.playerSelection[player_r4.getValue()]);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.gameComponent.availableAIs);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.players[player_r4.getValue()].equalsValue("human") === false ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.gameComponent.hasScores() ? 10 : -1);
  }
}
function LocalGameWrapperComponent_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_2_Conditional_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.gameComponent.pass());
    });
    \u0275\u0275i18n(1, 7);
    \u0275\u0275elementEnd();
  }
}
function LocalGameWrapperComponent_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_2_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.takeBack());
    });
    \u0275\u0275i18n(1, 8);
    \u0275\u0275elementEnd();
  }
}
function LocalGameWrapperComponent_Conditional_2_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275element(1, "br");
  }
  if (rf & 2) {
    const ai_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" ", ai_r10.name + ": " + ai_r10.getInfo(ctx_r1.gameComponent.node, ctx_r1.gameComponent.config), " ");
  }
}
function LocalGameWrapperComponent_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275repeaterCreate(1, LocalGameWrapperComponent_Conditional_2_Conditional_11_For_2_Template, 2, 1, null, null, _forTrack0);
    \u0275\u0275text(3);
    \u0275\u0275element(4, "br");
    \u0275\u0275text(5);
    \u0275\u0275element(6, "br");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.gameComponent.availableAIs);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Created ", ctx_r1.getCreatedNodes(), " nodes.");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Minimax time: ", ctx_r1.getMinimaxTime(), "ms.");
  }
}
function LocalGameWrapperComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "app-view-config", 15);
    \u0275\u0275elementStart(2, "p", 16);
    \u0275\u0275i18n(3, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, LocalGameWrapperComponent_Conditional_2_Conditional_4_Template, 3, 2, "div", 17);
    \u0275\u0275repeaterCreate(5, LocalGameWrapperComponent_Conditional_2_For_6_Template, 11, 8, "div", 18, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(7, LocalGameWrapperComponent_Conditional_2_Conditional_7_Template, 2, 0, "button", 19);
    \u0275\u0275conditionalCreate(8, LocalGameWrapperComponent_Conditional_2_Conditional_8_Template, 2, 0, "button", 20);
    \u0275\u0275elementStart(9, "button", 21);
    \u0275\u0275listener("click", function LocalGameWrapperComponent_Conditional_2_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.restartGame());
    });
    \u0275\u0275i18n(10, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, LocalGameWrapperComponent_Conditional_2_Conditional_11_Template, 7, 2, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rulesConfig", ctx_r1.rulesConfig)("rulesConfigDescription", ctx_r1.getRulesConfigDescription())("gameName", ctx_r1.getGameName().getOrElse(""));
    \u0275\u0275advance(2);
    \u0275\u0275i18nExp(ctx_r1.gameComponent.getTurn() + 1);
    \u0275\u0275i18nApply(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.endGame ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction2(8, _c0, ctx_r1.Player.of(0), ctx_r1.Player.of(1)));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.endGame === false && ctx_r1.gameComponent.canPass ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canTakeBack() ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.gameComponent.node.previousMove.isPresent() && ctx_r1.displayAIInfo() ? 11 : -1);
  }
}
var _a;
var LocalGameWrapperComponent = (_a = class extends GameWrapper {
  cdr = inject(ChangeDetectorRef);
  aiOptions = ["none", "none"];
  playerSelection = ["human", "human"];
  winnerMessage = MGPOptional.empty();
  rulesConfig;
  // Set in constructor and in ngAfterViewInit
  constructor() {
    super();
    this.players = [MGPOptional.of(this.playerSelection[0]), MGPOptional.of(this.playerSelection[1])];
    this.role = Player.ZERO;
  }
  getCreatedNodes() {
    return GameNodeStats.createdNodes;
  }
  getMinimaxTime() {
    return AIStats.aiTime;
  }
  ngAfterViewInit() {
    return __async(this, null, function* () {
      setTimeout(() => __async(this, null, function* () {
        const createdSuccessfully = yield this.createMatchingGameComponent();
        if (createdSuccessfully) {
          yield this.restartGame();
          this.cdr.detectChanges();
        }
      }), 1);
    });
  }
  createGameComponentAndSetConfig(componentType) {
    return __async(this, null, function* () {
      yield this.setConfigFromParams();
      yield __superGet(_a.prototype, this, "createGameComponentAndSetConfig").call(this, componentType);
    });
  }
  /**
   * Reads the URL to get the config from query parameters (e.g., /P4?width=5&height=5)
   * If the config is invalid, redirect to page that lets the user select the config.
   * Public for being able to trigger it from tests.
   */
  setConfigFromParams() {
    return __async(this, null, function* () {
      const params = this.activatedRoute.snapshot.queryParamMap;
      const noConfigIsProvided = params.keys.length === 0;
      const defaultConfig = RulesConfigUtils.getGameDefaultConfig(this.getGameUrlName());
      const gameIsNotConfigurable = defaultConfig.isAbsent();
      if (noConfigIsProvided || gameIsNotConfigurable) {
        this.rulesConfig = defaultConfig;
      } else {
        const rulesConfigDescription = this.getRulesConfigDescription().get();
        const config = {};
        this.rulesConfig = defaultConfig;
        for (const key of rulesConfigDescription.getFields()) {
          const paramValue = params.get(key);
          if (paramValue == null) {
            return this.redirectToConfiguration();
          } else {
            const value = JSONParser.parseJSONSafely(paramValue);
            if (value.isPresent()) {
              const actualValue = value.get();
              if (isJSONPrimitive(actualValue) && rulesConfigDescription.isValid(key, actualValue)) {
                config[key] = value.get();
              } else {
                return this.redirectToConfiguration();
              }
            } else {
              return this.redirectToConfiguration();
            }
          }
        }
        const areValidatorsValid = this.areGlobalValidatorsValid(rulesConfigDescription, config);
        if (areValidatorsValid === false) {
          return this.redirectToConfiguration();
        }
        this.rulesConfig = MGPOptional.of(config);
      }
    });
  }
  areGlobalValidatorsValid(rulesConfigDescription, config) {
    const validators = rulesConfigDescription.defaultConfigDescription.validators ?? [];
    for (const validator of validators) {
      const validation = validator(config);
      if (validation.isFailure()) {
        return false;
      }
    }
    return true;
  }
  redirectToConfiguration() {
    return __async(this, null, function* () {
      yield this.router.navigate(["/local", this.getGameUrlName(), "config"]);
    });
  }
  updatePlayer(player) {
    return __async(this, null, function* () {
      this.players[player.getValue()] = MGPOptional.of(this.playerSelection[player.getValue()]);
      if (this.playerSelection[1] === "human" && this.playerSelection[0] !== "human") {
        yield this.setInteractive(false);
        yield this.setRole(Player.ONE);
      } else {
        yield this.setInteractive(true);
        yield this.setRole(Player.ZERO);
      }
      yield this.proposeAIToPlay();
    });
  }
  onLegalUserMove(move) {
    return __async(this, null, function* () {
      const config = this.getConfig();
      this.gameComponent.node = this.gameComponent.rules.choose(this.gameComponent.node, move, config).get();
      yield this.applyNewMove();
    });
  }
  updateWrapper() {
    return __async(this, null, function* () {
      const config = this.getConfig();
      const gameStatus = this.gameComponent.rules.getGameStatus(this.gameComponent.node, config);
      if (gameStatus.isEndGame) {
        this.endGame = true;
        if (gameStatus.winner.isPlayer()) {
          const winner = $localize`Player ${gameStatus.winner.getValue() + 1}`;
          const loser = gameStatus.winner.getOpponent();
          const loserValue = loser.getValue();
          if (this.players[gameStatus.winner.getValue()].equalsValue("human")) {
            if (this.players[loserValue].equalsValue("human")) {
              this.winnerMessage = MGPOptional.of($localize`${winner} won`);
            } else {
              this.winnerMessage = MGPOptional.of($localize`You won`);
            }
          } else {
            if (this.players[loserValue].equalsValue("human")) {
              this.winnerMessage = MGPOptional.of($localize`You lost`);
            } else {
              this.winnerMessage = MGPOptional.of($localize`${this.players[gameStatus.winner.getValue()].get()} (Player ${gameStatus.winner.getValue() + 1}) won`);
            }
          }
        }
      }
      this.cdr.detectChanges();
    });
  }
  proposeAIToPlay() {
    return __async(this, null, function* () {
      const currentPlayerIsHuman = (yield this.hasSelectedAI()) === false;
      yield this.setInteractive(currentPlayerIsHuman);
      if (currentPlayerIsHuman === false) {
        const playingAI = this.getPlayingAI();
        if (playingAI.isPresent()) {
          setTimeout(() => __async(this, null, function* () {
            const config = this.getConfig();
            const gameIsOngoing = this.gameComponent.rules.getGameStatus(this.gameComponent.node, config) === GameStatus.ONGOING;
            if (gameIsOngoing) {
              yield this.doAIMove(playingAI.get().ai, playingAI.get().options);
            }
          }), LocalGameWrapperComponent_1.AI_TIMEOUT);
        }
      }
    });
  }
  /**
   * @returns false if the game is finished
   *          false if no AI is selected
   *          true if an AI is selected even if its option is not selected yet
   */
  hasSelectedAI() {
    return __async(this, null, function* () {
      const config = this.getConfig();
      if (this.gameComponent.rules.getGameStatus(this.gameComponent.node, config).isEndGame) {
        return false;
      }
      const playerIndex = this.gameComponent.getTurn() % 2;
      return this.playerSelection[playerIndex] !== "human";
    });
  }
  lastMoveWasAI() {
    const playerIndex = (this.gameComponent.getTurn() - 1) % 2;
    return this.playerSelection[playerIndex] !== "human";
  }
  getPlayingAI() {
    const playerIndex = this.gameComponent.getTurn() % 2;
    const aiOpt = this.getAI(playerIndex);
    if (aiOpt.isPresent()) {
      const ai = aiOpt.get();
      const optionsName = this.aiOptions[playerIndex];
      const matchingOptions = MGPOptional.ofNullable(ai.availableOptions.find((options) => {
        return options.name === optionsName;
      }));
      return matchingOptions.map((options) => {
        return { ai, options };
      });
    } else {
      return MGPOptional.empty();
    }
  }
  /**
   * @param playerIndex 0 or 1 (the index of the current player)
   * @returns MGPOptional.empty() if no AI is selected
   *          MGPOptional.of(some AI) if an AI is selected, even if AI has its options unchosen
   */
  getAI(playerIndex) {
    return MGPOptional.ofNullable(this.gameComponent.availableAIs.find((a) => {
      return this.players[playerIndex].equalsValue(a.name);
    }));
  }
  doAIMove(playingAI, options) {
    return __async(this, null, function* () {
      const ruler = this.gameComponent.rules;
      const config = this.getConfig();
      const gameStatus = ruler.getGameStatus(this.gameComponent.node, config);
      Utils.assert(gameStatus === GameStatus.ONGOING, "AI should not try to play when game is over!");
      const aiMove = playingAI.chooseNextMove(this.gameComponent.node, options, config);
      const nextNode = ruler.choose(this.gameComponent.node, aiMove, config);
      if (nextNode.isSuccess()) {
        this.gameComponent.hideLastMove();
        this.gameComponent.node = nextNode.get();
        yield this.applyNewMove();
        return MGPValidation.SUCCESS;
      } else {
        return this.handleAIError(playingAI, aiMove, nextNode.getReason());
      }
    });
  }
  applyNewMove() {
    return __async(this, null, function* () {
      const lastMoveWasAI = this.lastMoveWasAI();
      yield this.showNewMove(lastMoveWasAI);
      yield this.updateWrapper();
      yield this.proposeAIToPlay();
      this.cdr.detectChanges();
    });
  }
  handleAIError(playingAI, illegalMove, error) {
    return __async(this, null, function* () {
      this.messageDisplayer.criticalMessage($localize`The AI chose an illegal move! This is an unexpected situation that we logged, we will try to solve this as soon as possible. In the meantime, consider that you won!`);
      return Utils.logError("LocalGameWrapper", "AI chose illegal move", {
        game: this.getGameUrlName(),
        name: playingAI.name,
        move: illegalMove.toString(),
        reason: error
      });
    });
  }
  availableAIOptions(player) {
    return this.getAI(player).get().availableOptions;
  }
  canTakeBack() {
    if (this.players[0].equalsValue("human")) {
      return this.gameComponent.getTurn() > 0;
    } else if (this.players[1].equalsValue("human")) {
      return this.gameComponent.getTurn() > 1;
    } else {
      return false;
    }
  }
  takeBack() {
    return __async(this, null, function* () {
      this.gameComponent.node = this.gameComponent.node.parent.get();
      if (this.isTurnOfPlayingAI()) {
        Utils.assert(this.gameComponent.node.parent.isPresent(), "Cannot take back in first turn when AI is Player.ZERO");
        this.gameComponent.node = this.gameComponent.node.parent.get();
      }
      yield this.showCurrentState(false);
    });
  }
  isTurnOfPlayingAI() {
    return this.getPlayingAI().isPresent();
  }
  restartGame() {
    return __async(this, null, function* () {
      const config = this.getConfig();
      this.gameComponent.node = this.gameComponent.rules.getInitialNode(config);
      this.gameComponent.cancelMoveAttempt();
      this.gameComponent.hideLastMove();
      yield this.gameComponent.updateBoardAndRedraw(false);
      this.endGame = false;
      this.winnerMessage = MGPOptional.empty();
      yield this.proposeAIToPlay();
    });
  }
  getPlayer() {
    return "human";
  }
  onCancelMove(reason) {
    return __async(this, null, function* () {
      yield __superGet(_a.prototype, this, "onCancelMove").call(this, reason);
      if (this.gameComponent.node.previousMove.isPresent()) {
        const move = this.gameComponent.node.previousMove.get();
        yield this.gameComponent.showLastMove(move);
      }
    });
  }
  getConfig() {
    return this.rulesConfig;
  }
  displayAIInfo() {
    return localStorage.getItem("displayAIInfo") === "true";
  }
}, LocalGameWrapperComponent_1 = _a, __publicField(_a, "AI_TIMEOUT", 1500), __publicField(_a, "\u0275fac", function LocalGameWrapperComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _a)();
}), __publicField(_a, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _a, selectors: [["app-local-game-wrapper"]], features: [\u0275\u0275InheritDefinitionFeature], decls: 8, vars: 2, consts: () => {
  let i18n_0;
  if (false) {
    const MSG_EXTERNAL_7339426552397711569$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_0 = goog.getMsg("Turn n\xB0{$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ gameComponent.getTurn() + 1 }}" } });
    i18n_0 = MSG_EXTERNAL_7339426552397711569$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_0;
  } else {
    i18n_0 = $localize`Turn n°${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
  }
  let i18n_1;
  if (false) {
    const MSG_EXTERNAL_2981217201452500939$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_1 = goog.getMsg("Start a new game");
    i18n_1 = MSG_EXTERNAL_2981217201452500939$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_1;
  } else {
    i18n_1 = $localize`Start a new game`;
  }
  let i18n_2;
  if (false) {
    const MSG_EXTERNAL_8647687729200262691$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_2 = goog.getMsg("Draw");
    i18n_2 = MSG_EXTERNAL_8647687729200262691$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_2;
  } else {
    i18n_2 = $localize`Draw`;
  }
  let i18n_3;
  if (false) {
    const MSG_EXTERNAL_8534758003292610735$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_3 = goog.getMsg("Player {$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ player.getValue()+1 }}" } });
    i18n_3 = MSG_EXTERNAL_8534758003292610735$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_3;
  } else {
    i18n_3 = $localize`Player ${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
  }
  let i18n_4;
  if (false) {
    const MSG_EXTERNAL_7800061171704298797$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_4 = goog.getMsg("Human");
    i18n_4 = MSG_EXTERNAL_7800061171704298797$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_4;
  } else {
    i18n_4 = $localize`Human`;
  }
  let i18n_5;
  if (false) {
    const MSG_EXTERNAL_3795472118461355324$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_5 = goog.getMsg("Pick the options");
    i18n_5 = MSG_EXTERNAL_3795472118461355324$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_5;
  } else {
    i18n_5 = $localize`Pick the options`;
  }
  let i18n_6;
  if (false) {
    const MSG_EXTERNAL_6267418979719843573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_6 = goog.getMsg("Pass a turn");
    i18n_6 = MSG_EXTERNAL_6267418979719843573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_6;
  } else {
    i18n_6 = $localize`Pass a turn`;
  }
  let i18n_7;
  if (false) {
    const MSG_EXTERNAL_6128115494237258310$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_7 = goog.getMsg("Take back move");
    i18n_7 = MSG_EXTERNAL_6128115494237258310$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_WRAPPER_LOCAL_GAME_WRAPPER_COMPONENT_TS_7;
  } else {
    i18n_7 = $localize`Take back move`;
  }
  return [["board", ""], i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, [1, "columns", "is-vcentered", "is-align-items-stretch"], [1, "column", "is-one-quarter", "has-text-centered"], ["id", "infos", 1, "box", "is-fullheight"], [1, "column"], ["id", "board-highlight", 1, "p-5", "is-fullheight", 3, "ngClass"], ["id", "board", 1, "box", "is-fullheight"], [3, "rulesConfig", "rulesConfigDescription", "gameName"], [1, "subtitle"], ["id", "game-result", 1, "block"], [1, "px-2", "py-4", "mb-4", 3, "ngClass"], ["id", "pass-button", 1, "button", "is-primary", "is-fullwidth", "mb-1"], ["id", "take-back", 1, "button", "is-fullwidth", "mb-1"], ["id", "restart-button", 1, "button", "is-fullwidth", 3, "click"], ["id", "ai-info"], ["id", "winner", 1, "title"], ["id", "draw", 1, "title"], [1, "mb-2", "subtitle", 3, "ngClass"], [1, "select", "is-fullwidth"], [3, "change", "ngModelChange", "id", "ngModel"], ["selected", "", "value", "human"], [3, "id", "value"], [3, "id", "ngClass"], [3, "ngModelChange", "change", "id", "ngModel"], ["selected", "", "value", "none"], ["id", "pass-button", 1, "button", "is-primary", "is-fullwidth", "mb-1", 3, "click"], ["id", "take-back", 1, "button", "is-fullwidth", "mb-1", 3, "click"]];
}, template: function LocalGameWrapperComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10);
    \u0275\u0275conditionalCreate(2, LocalGameWrapperComponent_Conditional_2_Template, 12, 11, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 12)(4, "div", 13)(5, "div", 14);
    \u0275\u0275element(6, "div", null, 0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.gameComponent ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx.getBoardHighlight());
  }
}, dependencies: [ViewConfigComponent, NgClass, ReactiveFormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, FormsModule, NgModel], encapsulation: 2, changeDetection: 0 })), _a);
LocalGameWrapperComponent = LocalGameWrapperComponent_1 = __decorate([
  Debug.log
], LocalGameWrapperComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalGameWrapperComponent, [{
    type: Component,
    args: [{ selector: "app-local-game-wrapper", changeDetection: ChangeDetectionStrategy.OnPush, imports: [ViewConfigComponent, NgClass, ReactiveFormsModule, FormsModule], template: `<div class="columns is-vcentered is-align-items-stretch">
    <div class="column is-one-quarter has-text-centered">
        @if (gameComponent) {
            <div id="infos"
                 class="box is-fullheight">
                <app-view-config [rulesConfig]="rulesConfig"
                                 [rulesConfigDescription]="getRulesConfigDescription()"
                                 [gameName]="getGameName().getOrElse('')">
                </app-view-config>
                <p class="subtitle"
                   i18n>Turn n\xB0{{ gameComponent.getTurn() + 1 }}</p>
                @if (endGame) {
                    <div id="game-result"
                         class="block">
                        @if (winnerMessage.isPresent()) {
                            <p id="winner"
                               class="title">{{ winnerMessage.get() }}</p>
                        }
                        @if (winnerMessage.isAbsent()) {
                            <p id="draw"
                               class="title"
                               i18n>Draw</p>
                        }
                    </div>
                }
                @for (player of [Player.of(0), Player.of(1)]; track player) {
                    <div class="px-2 py-4 mb-4"
                         [ngClass]="player.getHTMLClass('-bg')">
                        <p class="mb-2 subtitle"
                           [ngClass]="player.getHTMLClass('-fg')"
                           i18n>Player {{ player.getValue()+1 }}</p>
                        <div class="select is-fullwidth">
                            <select id="player-select-{{ player.getValue() }}"
                                    (change)="updatePlayer(player)"
                                    [(ngModel)]="playerSelection[player.getValue()]">
                                <option selected
                                        value="human"
                                        i18n>Human</option>
                                @for (ai of gameComponent.availableAIs; track ai.name) {
                                    <option id="player-{{ player.getValue() }}-ai-{{ ai.name }}"
                                            [value]="ai.name">{{ ai.name }}</option>
                                }
                            </select>
                        </div>
                        @if (players[player.getValue()].equalsValue('human') === false) {
                            <div class="select is-fullwidth">
                                <select id="ai-option-select-{{ player.getValue() }}"
                                        [(ngModel)]="aiOptions[player.getValue()]"
                                        (change)="updatePlayer(player)">
                                    <option selected
                                            value="none"
                                            i18n>Pick the options</option>
                                    @for (option of availableAIOptions(player.getValue()); track option.name) {
                                        <option id="player-{{ player.getValue() }}-option-{{ option.name }}"
                                                [value]="option.name">{{ option.name }}</option>
                                    }
                                </select>
                            </div>
                        }
                        @if (gameComponent.hasScores()) {
                            <p id="score-{{ player.getValue() }}"
                               [ngClass]="player.getHTMLClass('-fg')">{{ gameComponent.getScoreString(player) }}</p>
                        }
                    </div>
                }
                @if (endGame === false && gameComponent.canPass) {
                    <button id="pass-button"
                            class="button is-primary is-fullwidth mb-1"
                            (click)="gameComponent.pass()"
                            i18n>Pass a turn</button>
                }
                @if (canTakeBack()) {
                    <button id="take-back"
                            class="button is-fullwidth mb-1"
                            (click)="takeBack()"
                            i18n>Take back move</button>
                }
                <button id="restart-button"
                        class="button is-fullwidth"
                        (click)="restartGame()"
                        i18n>Start a new game</button>
                @if (gameComponent.node.previousMove.isPresent() && displayAIInfo()) {
                    <div id="ai-info">
                        @for (ai of gameComponent.availableAIs; track ai.name) {
                            {{ ai.name + ': ' + ai.getInfo(gameComponent.node, gameComponent.config) }} <br/>
                        }
                        Created {{ getCreatedNodes() }} nodes.<br/>
                        Minimax time: {{ getMinimaxTime() }}ms.<br/>
                    </div>
                }
            </div>
        }
    </div>
    <div class="column">
        <div class="p-5 is-fullheight"
             id="board-highlight"
             [ngClass]="getBoardHighlight()">
            <div id="board"
                 class="box is-fullheight">
                <div #board></div>
            </div>
        </div>
    </div>
</div>
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LocalGameWrapperComponent, { className: "LocalGameWrapperComponent", filePath: "src/app/components/wrapper-components/local-game-wrapper/local-game-wrapper.component.ts", lineNumber: 29 });
})();
export {
  LocalGameWrapperComponent
};
//# sourceMappingURL=local-game-wrapper.component-I3I3P7Z7.js.map
