import {
  BackendService
} from "./chunk-EMU3IHRO.js";
import {
  Debug
} from "./chunk-NCTOIZLG.js";
import {
  Injectable,
  Subscription,
  __async,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-AC6ULWDE.js";

// src/app/services/GameService.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractGameService = class {
  /** Give the current player resignation in a game */
  resign() {
    return __async(this, null, function* () {
      return this.gameAction(["Resign"]);
    });
  }
  /** Notify the timeout of a player in a game */
  notifyTimeout(loser) {
    return __async(this, null, function* () {
      return this.gameAction(["NotifyTimeout", { timeoutedPlayer: loser.getValue() }]);
    });
  }
  propose(proposition) {
    return __async(this, null, function* () {
      return this.gameAction(["Propose", { proposition }]);
    });
  }
  accept(proposition) {
    return __async(this, null, function* () {
      return this.gameAction(["Accept", { proposition }]);
    });
  }
  reject(proposition) {
    return __async(this, null, function* () {
      return this.gameAction(["Reject", { proposition }]);
    });
  }
  /** Propose a draw to the opponent */
  proposeDraw() {
    return __async(this, null, function* () {
      return this.propose("Draw");
    });
  }
  /** Accept the draw request of the opponent */
  acceptDraw() {
    return __async(this, null, function* () {
      return this.accept("Draw");
    });
  }
  /** Reject a draw request from the opponent */
  rejectDraw() {
    return __async(this, null, function* () {
      return this.reject("Draw");
    });
  }
  /** Propose a rematch to the opponent */
  proposeRematch() {
    return __async(this, null, function* () {
      return this.propose("Rematch");
    });
  }
  /** Accept a rematch request from the opponent */
  acceptRematch() {
    return __async(this, null, function* () {
      return this.accept("Rematch");
    });
  }
  /** Reject a rematch request from the opponent */
  rejectRematch() {
    return __async(this, null, function* () {
      return this.reject("Rematch");
    });
  }
  /** Ask to take back one of our moves */
  askTakeBack() {
    return __async(this, null, function* () {
      return this.propose("TakeBack");
    });
  }
  /** Accept that opponent takes back a move */
  acceptTakeBack() {
    return __async(this, null, function* () {
      return this.accept("TakeBack");
    });
  }
  /** Reject that opponent takes back a move */
  rejectTakeBack() {
    return __async(this, null, function* () {
      return this.reject("TakeBack");
    });
  }
  /** Add game time to the opponent */
  addGameTime() {
    return __async(this, null, function* () {
      return this.gameAction(["AddTime", { kind: "Game" }]);
    });
  }
  /** Add move time to the opponent */
  addMoveTime() {
    return __async(this, null, function* () {
      return this.gameAction(["AddTime", { kind: "Move" }]);
    });
  }
  /** Play a move */
  addMove(move) {
    return __async(this, null, function* () {
      return this.gameAction(["Move", { move }]);
    });
  }
  /** End the game after a move */
  endGame(winner) {
    return __async(this, null, function* () {
      return this.gameAction(["EndGame", { winner: winner.getValue() }]);
    });
  }
};
var GameService = class GameService2 extends AbstractGameService {
  backendService = inject(BackendService);
  subscribeTo(gameId, gameUpdate, gameEvent, error) {
    return __async(this, null, function* () {
      const gameUpdateSubscription = this.backendService.setCallback("GameUpdate", (message) => {
        void gameUpdate(message.getArgument("game"));
      });
      const gameEventSubscription = this.backendService.setCallback("GameEvent", (message) => {
        void gameEvent(message.getArgument("event"), message.getArgument("serverTime"));
      });
      const gameSubscription = yield this.backendService.subscribeToGame(gameId);
      const errorSubscription = this.backendService.setCallback("Error", (message) => {
        error(message.getArgument("reason"));
      });
      return new Subscription(() => {
        gameSubscription.unsubscribe();
        gameUpdateSubscription.unsubscribe();
        gameEventSubscription.unsubscribe();
        errorSubscription.unsubscribe();
      });
    });
  }
  createGame(gameName) {
    return __async(this, null, function* () {
      const response = yield this.backendService.sendAndWaitForReply(["Create", { gameName }], "GameCreated");
      if (response.isFailure()) {
        return response.toOtherFallible();
      } else {
        return response.map((message) => message.getArgument("gameId"));
      }
    });
  }
  gameAction(action) {
    return __async(this, null, function* () {
      return this.backendService.send(action);
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275GameService_BaseFactory;
    return function GameService_Factory(__ngFactoryType__) {
      return (\u0275GameService_BaseFactory || (\u0275GameService_BaseFactory = \u0275\u0275getInheritedFactory(GameService2)))(__ngFactoryType__ || GameService2);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: GameService2, factory: GameService2.\u0275fac, providedIn: "root" });
};
GameService = __decorate([
  Debug.log
], GameService);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  GameService
};
//# sourceMappingURL=chunk-LUIC4ATP.js.map
