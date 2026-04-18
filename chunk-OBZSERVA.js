import {
  BackendService
} from "./chunk-EGSFCPXZ.js";
import {
  Debug
} from "./chunk-6Q2SZNEY.js";
import {
  Injectable,
  __async,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-FIMNEZBT.js";

// src/app/services/ChatService.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractChatService = class {
};
var ChatService = class ChatService2 extends AbstractChatService {
  backendService = inject(BackendService);
  subscribeToMessages(callback) {
    return this.backendService.setCallback("ChatMessage", (message) => {
      callback(message.getArgument("message"));
    });
  }
  sendMessage(message) {
    return __async(this, null, function* () {
      yield this.backendService.send(["ChatSend", { message }]);
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ChatService_BaseFactory;
    return function ChatService_Factory(__ngFactoryType__) {
      return (\u0275ChatService_BaseFactory || (\u0275ChatService_BaseFactory = \u0275\u0275getInheritedFactory(ChatService2)))(__ngFactoryType__ || ChatService2);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: ChatService2, factory: ChatService2.\u0275fac, providedIn: "root" });
};
ChatService = __decorate([
  Debug.log
], ChatService);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ChatService
};
//# sourceMappingURL=chunk-OBZSERVA.js.map
