import {
  BackendService
} from "./chunk-RZWI2MDK.js";
import {
  Debug
} from "./chunk-Y4TVVAIH.js";
import {
  Injectable,
  Subscription,
  __async,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-XHN637UA.js";

// src/app/services/ConfigRoomService.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractConfigRoomService = class {
};
var ConfigRoomService = class ConfigRoomService2 extends AbstractConfigRoomService {
  backendService = inject(BackendService);
  join(gameId, configRoomUpdate, configRoomDeleted, candidateJoined, candidateLeft, error) {
    return __async(this, null, function* () {
      const gameSubscription = yield this.backendService.subscribeToConfigRoom(gameId);
      const configRoomSubscription = this.backendService.setCallback("ConfigRoomUpdate", (message) => {
        configRoomUpdate(message.getArgument("configRoom"));
      });
      const configRoomDeletionSubscription = this.backendService.setCallback("ConfigRoomDeleted", (_message) => {
        configRoomDeleted();
      });
      const candidateJoinedSubscription = this.backendService.setCallback("CandidateJoined", (message) => {
        candidateJoined({ user: message.getArgument("candidate"), elo: message.getArgument("elo") });
      });
      const candidateLeftSubscription = this.backendService.setCallback("CandidateLeft", (message) => {
        candidateLeft(message.getArgument("candidate"));
      });
      const errorSubscription = this.backendService.setCallback("Error", (message) => {
        error(message.getArgument("reason"));
      });
      return new Subscription(() => {
        configRoomSubscription.unsubscribe();
        configRoomDeletionSubscription.unsubscribe();
        candidateJoinedSubscription.unsubscribe();
        candidateLeftSubscription.unsubscribe();
        errorSubscription.unsubscribe();
        gameSubscription.unsubscribe();
      });
    });
  }
  /** Propose a config to the opponent */
  proposeConfig(proposal) {
    return __async(this, null, function* () {
      yield this.backendService.send(["ProposeConfig", { config: proposal }]);
    });
  }
  /** Select an opponent */
  selectOpponent(opponent) {
    return __async(this, null, function* () {
      yield this.backendService.send(["SelectOpponent", { opponent }]);
    });
  }
  /** Review a config proposed to the opponent */
  reviewConfig() {
    return __async(this, null, function* () {
      yield this.backendService.send(["ReviewConfig"]);
    });
  }
  /** Accept a game config */
  acceptConfig() {
    return __async(this, null, function* () {
      yield this.backendService.send(["AcceptConfig"]);
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ConfigRoomService_BaseFactory;
    return function ConfigRoomService_Factory(__ngFactoryType__) {
      return (\u0275ConfigRoomService_BaseFactory || (\u0275ConfigRoomService_BaseFactory = \u0275\u0275getInheritedFactory(ConfigRoomService2)))(__ngFactoryType__ || ConfigRoomService2);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: ConfigRoomService2, factory: ConfigRoomService2.\u0275fac, providedIn: "root" });
};
ConfigRoomService = __decorate([
  Debug.log
], ConfigRoomService);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfigRoomService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ConfigRoomService
};
//# sourceMappingURL=chunk-BOBJTCLG.js.map
