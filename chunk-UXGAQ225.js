import {
  BaseComponent,
  GameInfo,
  MessageDisplayer,
  Player,
  PlayerOrNone
} from "./chunk-MOTGNXJP.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-GUMZAMYX.js";
import {
  MGPOptional,
  MGPValidation,
  Utils
} from "./chunk-VWERQGBR.js";
import {
  Component,
  ViewChild,
  ViewContainerRef,
  __async,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵdefineComponent,
  ɵɵgetInheritedFactory,
  ɵɵqueryAdvance,
  ɵɵviewQuerySignal
} from "./chunk-YYRXZMOY.js";

// src/app/jscaip/RulesConfigUtil.ts
var RulesConfigUtils = class {
  /**
   * Returns the default config for that game. The game should exist.
   * It can be MGPOptional.empty() in case there is no configurability for this game.
   */
  static getGameDefaultConfig(gameName) {
    const gameInfos = GameInfo.getByUrlName(gameName);
    return gameInfos.get().getRulesConfig();
  }
};

// src/app/components/wrapper-components/BaseWrapperComponent.ts
var BaseWrapperComponent = class extends BaseComponent {
  activatedRoute = inject(ActivatedRoute);
  getGameUrlName() {
    return Utils.getNonNullable(this.activatedRoute.snapshot.paramMap.get("game"));
  }
  getGameName() {
    return GameInfo.getByUrlName(this.getGameUrlName()).map((info) => info.name);
  }
  getRulesConfigDescription() {
    const urlName = this.getGameUrlName();
    return this.getRulesConfigDescriptionByName(urlName);
  }
  getRulesConfigDescriptionByName(gameName) {
    const gameInfos = GameInfo.getByUrlName(gameName);
    if (gameInfos.isAbsent()) {
      return MGPOptional.empty();
    } else {
      return gameInfos.get().getRulesConfigDescription();
    }
  }
  getStateProvider() {
    return GameInfo.getStateProvider(this.getGameUrlName());
  }
};

// src/app/components/wrapper-components/GameWrapper.ts
var _c0 = ["board"];
var GameWrapperMessages = class {
  static NOT_YOUR_TURN = () => $localize`It is not your turn!`;
  static GAME_HAS_ENDED = () => $localize`This game has ended.`;
  static NO_MATCHING_GAME(gameName) {
    return $localize`This game (${gameName}) does not exist.`;
  }
};
var GameWrapper = class _GameWrapper extends BaseWrapperComponent {
  router = inject(Router);
  messageDisplayer = inject(MessageDisplayer);
  // This holds the #board html element
  boardRef = viewChild("board", ...ngDevMode ? [{ debugName: "boardRef", read: ViewContainerRef }] : [{ read: ViewContainerRef }]);
  gameComponent;
  players = [MGPOptional.empty(), MGPOptional.empty()];
  /**
   * The role of the player, i.e., ZERO if we are the first player, ONE if we are the second player,
   * and NONE if we are observing
   */
  role = PlayerOrNone.NONE;
  endGame = false;
  isMoveAttemptOngoing = false;
  Player = Player;
  getMatchingComponent(gameName) {
    const optionalGameInfo = GameInfo.getByUrlName(gameName);
    return optionalGameInfo.map((gameInfo) => gameInfo.component);
  }
  /**
   * This method is to be called only after view init.
   * It will create the game component and initialize its node.
   * It returns true if successful, or false if this is not a valid game.
   */
  createMatchingGameComponent() {
    return __async(this, null, function* () {
      const componentType = yield this.getMatchingComponentAndNavigateOutIfAbsent();
      if (componentType.isPresent()) {
        yield this.createGameComponentAndSetConfig(componentType.get());
        return true;
      } else {
        return false;
      }
    });
  }
  createGameComponentAndSetConfig(componentType) {
    return __async(this, null, function* () {
      yield this.createGameComponent(componentType);
      const config = this.getConfig();
      this.gameComponent.config = config;
      this.gameComponent.node = this.gameComponent.rules.getInitialNode(config);
      yield this.setRole(this.role);
      yield this.gameComponent.updateBoardAndRedraw(false);
    });
  }
  getMatchingComponentAndNavigateOutIfAbsent() {
    return __async(this, null, function* () {
      const urlName = this.getGameUrlName();
      const component = this.getMatchingComponent(urlName);
      if (component.isAbsent()) {
        yield this.router.navigate(["/notFound", GameWrapperMessages.NO_MATCHING_GAME(urlName)], { skipLocationChange: true });
        return MGPOptional.empty();
      } else {
        return component;
      }
    });
  }
  createGameComponent(component) {
    return __async(this, null, function* () {
      Utils.assert(this.boardRef != null, "Board element should be present");
      const componentRef = Utils.getNonNullable(this.boardRef()).createComponent(component);
      this.gameComponent = componentRef.instance;
      this.gameComponent.chooseMove = (m) => {
        return this.receiveValidMove(m);
      };
      this.gameComponent.canUserPlay = (elementName) => {
        return this.canUserPlay(elementName);
      };
      this.gameComponent.isPlayerTurn = () => {
        return this.isPlayerTurn();
      };
      this.gameComponent.cancelMoveOnWrapper = (reason) => {
        return this.onCancelMove(reason);
      };
    });
  }
  setRole(role) {
    return __async(this, null, function* () {
      this.role = role;
      if (role.isNone()) {
        this.gameComponent.setPointOfView(Player.ZERO);
      } else {
        this.gameComponent.setPointOfView(role);
      }
      yield this.showCurrentState(false);
    });
  }
  setInteractive(interactive, updateBoard = true) {
    return __async(this, null, function* () {
      const interactivityChanged = this.gameComponent.isInteractive() !== interactive;
      if (interactivityChanged) {
        this.gameComponent.setInteractive(interactive);
        if (updateBoard) {
          yield this.gameComponent.updateBoardAndRedraw(false);
        }
      }
    });
  }
  receiveValidMove(move) {
    return __async(this, null, function* () {
      const config = this.getConfig();
      const legality = this.gameComponent.rules.isLegal(move, this.gameComponent.node.gameState, config);
      if (legality.isFailure()) {
        yield this.gameComponent.cancelMove(legality.getReason());
        return MGPValidation.ofFallible(legality);
      }
      this.gameComponent.cancelMoveAttempt();
      this.isMoveAttemptOngoing = false;
      yield this.onLegalUserMove(move);
      return MGPValidation.SUCCESS;
    });
  }
  onCancelMove(_reason) {
    return __async(this, null, function* () {
      this.isMoveAttemptOngoing = false;
    });
  }
  getConfig() {
    const urlName = this.getGameUrlName();
    return RulesConfigUtils.getGameDefaultConfig(urlName);
  }
  canUserPlay(_clickedElementName) {
    return __async(this, null, function* () {
      if (this.isPlayerTurn() === false) {
        return MGPValidation.failure(GameWrapperMessages.NOT_YOUR_TURN());
      }
      if (this.endGame) {
        return MGPValidation.failure(GameWrapperMessages.GAME_HAS_ENDED());
      }
      if (this.isMoveAttemptOngoing === false) {
        this.gameComponent.hideLastMove();
        this.isMoveAttemptOngoing = true;
      }
      return MGPValidation.SUCCESS;
    });
  }
  isPlayerTurn() {
    if (this.role.isNone()) {
      return false;
    }
    if (this.gameComponent == null) {
      return false;
    }
    const turn = this.gameComponent.getTurn();
    const indexPlayer = turn % 2;
    const player = this.getPlayer();
    if (this.players[indexPlayer].isPresent()) {
      return this.players[indexPlayer].equalsValue(player);
    } else {
      return true;
    }
  }
  getBoardHighlight() {
    if (this.endGame) {
      return ["endgame-bg"];
    } else if (this.isPlayerTurn()) {
      const turn = this.gameComponent.getTurn();
      const player = Player.ofTurn(turn % 2);
      return [player.getHTMLClass("-bg")];
    } else {
      return [];
    }
  }
  /**
   * Called when there is a need to put the current board to original state, meaning:
   *     1. ongoing move attempt must be canceled (cancelMoveAttempt)
   *     2. any previous move must be hidden (hideLastMove)
   *     3. after the board is changed, we now show the correct previous move (showLastMove)
   * @param triggerAnimation a boolean set to true if there is a need to trigger the animation of the last move
   */
  showCurrentState(triggerAnimation) {
    return __async(this, null, function* () {
      this.gameComponent.cancelMoveAttempt();
      this.gameComponent.hideLastMove();
      if (this.gameComponent.node.previousMove.isPresent()) {
        yield this.showNewMove(triggerAnimation);
      } else {
        yield this.gameComponent.updateBoardAndRedraw(false);
      }
    });
  }
  /**
   * Used when a new move is done:
   *     1. by user click, locally
   *     2. by opponent online
   *     3. by the AI
   * @param triggerAnimation a boolean set to true if there is a need to trigger the animation of the last move
   */
  showNewMove(triggerAnimation) {
    return __async(this, null, function* () {
      yield this.gameComponent.updateBoard(triggerAnimation);
      yield this.gameComponent.showLastMoveAndRedraw();
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275GameWrapper_BaseFactory;
    return function GameWrapper_Factory(__ngFactoryType__) {
      return (\u0275GameWrapper_BaseFactory || (\u0275GameWrapper_BaseFactory = \u0275\u0275getInheritedFactory(_GameWrapper)))(__ngFactoryType__ || _GameWrapper);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GameWrapper, selectors: [["ng-component"]], viewQuery: function GameWrapper_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.boardRef, _c0, 5, ViewContainerRef);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, features: [\u0275\u0275InheritDefinitionFeature], decls: 0, vars: 0, template: function GameWrapper_Template(rf, ctx) {
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameWrapper, [{
    type: Component,
    args: [{
      template: ""
    }]
  }], null, { boardRef: [{ type: ViewChild, args: ["board", __spreadProps(__spreadValues({}, { read: ViewContainerRef }), { isSignal: true })] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GameWrapper, { className: "GameWrapper", filePath: "src/app/components/wrapper-components/GameWrapper.ts", lineNumber: 31 });
})();

export {
  RulesConfigUtils,
  BaseWrapperComponent,
  GameWrapperMessages,
  GameWrapper
};
//# sourceMappingURL=chunk-UXGAQ225.js.map
