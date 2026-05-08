import {
  BackendService
} from "./chunk-PANQZTM3.js";
import {
  AuthUser,
  ConnectedUserService
} from "./chunk-J7P7OM4C.js";
import {
  MGPMap,
  MGPOptional,
  MGPValidation
} from "./chunk-VWERQGBR.js";
import {
  Injectable,
  ReplaySubject,
  Subscription,
  __async,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-AC6ULWDE.js";

// src/app/services/CurrentGameService.ts
var GameActionFailure = class {
  static YOU_ARE_ALREADY_PLAYING = () => $localize`You are already playing in another game.`;
  static YOU_ARE_ALREADY_CREATING = () => $localize`You are already the creator of another game.`;
  static YOU_ARE_ALREADY_CHOSEN_OPPONENT = () => $localize`You are already the chosen opponent in another game.`;
  static YOU_ARE_ALREADY_CANDIDATE = () => $localize`You are already candidate in another game.`;
  static YOU_ARE_ALREADY_OBSERVING = () => $localize`You are already observing another game.`;
  static YOU_ALREADY_HAVE_ANOTHER_TAB = () => $localize`You already have another tab open.`;
  static UNEXPECTED_BACKEND_ERROR(error) {
    return $localize`Unexpected error from backend: ${error}`;
  }
};
var AbstractCurrentGameService = class _AbstractCurrentGameService {
  static roleToMessage = new MGPMap([
    { key: "Candidate", value: GameActionFailure.YOU_ARE_ALREADY_CANDIDATE },
    { key: "ChosenOpponent", value: GameActionFailure.YOU_ARE_ALREADY_CHOSEN_OPPONENT },
    { key: "Creator", value: GameActionFailure.YOU_ARE_ALREADY_CREATING },
    { key: "Player", value: GameActionFailure.YOU_ARE_ALREADY_PLAYING },
    { key: "Observer", value: GameActionFailure.YOU_ARE_ALREADY_OBSERVING }
  ]);
  currentGameRS;
  currentGameObs;
  currentGameInitialized = false;
  currentGame = MGPOptional.empty();
  constructor() {
    this.currentGameRS = new ReplaySubject(1);
    this.currentGameObs = this.currentGameRS.asObservable();
  }
  clearCurrentGame() {
    this.currentGame = MGPOptional.empty();
    this.currentGameRS.next(MGPOptional.empty());
  }
  changeCurrentGame(newCurrentGame) {
    this.currentGameInitialized = true;
    this.currentGame = newCurrentGame;
    this.currentGameRS.next(newCurrentGame);
  }
  subscribeToCurrentGame(callback) {
    return this.currentGameObs.subscribe(callback);
  }
  canUserCreate() {
    if (this.currentGame.isAbsent()) {
      return MGPValidation.SUCCESS;
    } else {
      const message = _AbstractCurrentGameService.roleToMessage.get(this.currentGame.get().role).get()();
      return MGPValidation.failure(message);
    }
  }
  canUserJoin(gameId, gameStarted) {
    if (this.currentGame.isAbsent() || this.currentGame.get().id === gameId) {
      return MGPValidation.SUCCESS;
    } else {
      if (gameStarted && this.currentGame.get().role === "Observer") {
        return MGPValidation.SUCCESS;
      } else {
        const message = CurrentGameService.roleToMessage.get(this.currentGame.get().role).get()();
        return MGPValidation.failure(message);
      }
    }
  }
  getCurrentGame() {
    return new Promise((resolve) => {
      let subscription = new Subscription();
      subscription = this.currentGameObs.subscribe((observed) => {
        resolve(observed);
        subscription.unsubscribe();
      });
    });
  }
};
var CurrentGameService = class _CurrentGameService extends AbstractCurrentGameService {
  backendService = inject(BackendService);
  connectedUserService = inject(ConnectedUserService);
  authSubscription;
  currentGameSubscription = new Subscription();
  backendSubscription = new Subscription();
  constructor() {
    super();
    this.authSubscription = this.connectedUserService.subscribeToUser((user) => __async(this, null, function* () {
      yield this.onUserUpdate(user);
    }));
  }
  onUserUpdate(user) {
    return __async(this, null, function* () {
      if (user === AuthUser.NOT_CONNECTED || user.verified === false) {
        this.currentGameSubscription.unsubscribe();
        this.backendSubscription.unsubscribe();
        this.clearCurrentGame();
      } else {
        this.currentGameSubscription = this.backendService.setCallback("CurrentGameUpdate", (message) => {
          this.onCurrentGameUpdate(message.getOptionalArgument("currentGame"));
        });
        this.backendSubscription = yield this.backendService.connect();
      }
    });
  }
  onCurrentGameUpdate(newCurrentGame) {
    const previousCurrentGame = this.currentGame;
    const stayedNull = newCurrentGame == null && previousCurrentGame.isAbsent() && this.currentGameInitialized;
    const stayedItselfAsNonNull = newCurrentGame != null && previousCurrentGame.equalsValue(newCurrentGame);
    const valueChanged = stayedNull === false && stayedItselfAsNonNull === false;
    if (valueChanged) {
      this.changeCurrentGame(MGPOptional.ofNullable(newCurrentGame));
    }
  }
  ngOnDestroy() {
    this.currentGameSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.backendSubscription.unsubscribe();
  }
  static \u0275fac = function CurrentGameService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CurrentGameService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CurrentGameService, factory: _CurrentGameService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CurrentGameService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  GameActionFailure,
  CurrentGameService
};
//# sourceMappingURL=chunk-QCBHFNZW.js.map
