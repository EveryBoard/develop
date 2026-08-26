import {
  MessageDisplayer
} from "./chunk-IRXKBJB2.js";
import {
  ConnectedUserService
} from "./chunk-2UAGI2IP.js";
import {
  MGPFallible,
  MGPMap,
  MGPOptional,
  Utils
} from "./chunk-KI3WLQMB.js";
import {
  Injectable,
  Subscription,
  __async,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XHN637UA.js";

// src/app/firebaseConfig.ts
var firebaseConfig = {
  apiKey: "AIzaSyCgOzdBWz58aFnjCFGzH_KiLMtA8PXaQhc",
  authDomain: "everyboard-dev.firebaseapp.com",
  projectId: "everyboard-dev",
  storageBucket: "everyboard-dev.appspot.com",
  messagingSenderId: "579824736515"
};

// src/environments/environment.ts
var environment = {
  production: true,
  test: false,
  root: "/",
  firebaseConfig,
  useEmulators: false,
  backendURL: "https://server-dev.everyboard.org"
};

// src/app/services/BackendService.ts
var BackendMessage = class {
  tag;
  args;
  constructor(tag, args) {
    this.tag = tag;
    this.args = args;
  }
  getArgument(name) {
    const value = this.getOptionalArgument(name);
    if (value == null) {
      throw new Error(`Trying to extract argument from server reply, but there were no such argument: ${name} (on a ${this.tag} message: arguments are ${JSON.stringify(this.args)})`);
    } else {
      return value;
    }
  }
  getOptionalArgument(name) {
    if (this.args == null) {
      throw new Error(`Trying to extract argument from server reply, but there were no argument: ${name} (on a ${this.tag} message)`);
    }
    const value = this.args[name];
    return value;
  }
};
var AbstractBackendService = class {
  callbacks = new MGPMap();
  subscribeToGame(gameId) {
    return this.subscribeTo("SubscribeGame", gameId);
  }
  subscribeToConfigRoom(gameId) {
    return this.subscribeTo("SubscribeConfigRoom", gameId);
  }
  subscribeToLobby() {
    return this.subscribeTo("SubscribeLobby");
  }
  sendAndWaitForReply(message, replyTag) {
    return __async(this, null, function* () {
      yield this.send(message);
      return this.waitForMessage(replyTag);
    });
  }
  waitForMessage(tag) {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        const onMessage = (message) => {
          this.removeCallback(tag);
          this.removeCallback("Error");
          if (message.tag === "Error") {
            resolve(MGPFallible.failure(message.getArgument("reason")));
          } else {
            resolve(MGPFallible.success(message));
          }
        };
        this.setCallback(tag, onMessage);
        this.setCallback("Error", onMessage);
      });
    });
  }
  setCallback(tag, callback) {
    if (this.callbacks.containsKey(tag)) {
      throw new Error(`registering a callback which already exists (${tag}), this is likely not what we need!`);
    }
    this.callbacks.set(tag, callback);
    return new Subscription(() => this.removeCallback(tag));
  }
  receive(message) {
    const callback = this.callbacks.get(message.tag);
    if (callback.isPresent()) {
      callback.get()(message);
    } else {
      console.warn("MESSAGE WITHOUT CALLBACK: " + JSON.stringify(message));
    }
  }
  removeCallback(tag) {
    this.callbacks.delete(tag);
  }
};
var BackendService = class _BackendService extends AbstractBackendService {
  connectedUserService = inject(ConnectedUserService);
  messageDisplayer = inject(MessageDisplayer);
  webSocket = MGPOptional.empty();
  connectionPromise;
  resolveConnection;
  nextConnectionAttemptTime = 1;
  disconnectRequested = false;
  pageIsUnloading = false;
  // Upon the "pagehide" event, we need to disconnect
  // This arises for example when we navigate away from the page in the same tab (e.g., by entering another URL)
  // It is necessary to disconnect at that time because otherwise the websocket may remain open for too long
  // and then if we load EveryBoard in the same tab, we may get an already-subscribed error
  disconnectOnPageHide = () => {
    this.pageIsUnloading = true;
    if (this.webSocket.isPresent()) {
      this.disconnect();
    }
  };
  constructor() {
    super();
    this.connectionPromise = new Promise((resolve) => {
      this.resolveConnection = resolve;
    });
    window.addEventListener("pagehide", this.disconnectOnPageHide);
  }
  waitForConnection() {
    return this.connectionPromise;
  }
  connect() {
    return __async(this, null, function* () {
      Utils.assert(this.webSocket.isAbsent(), "Should not connect twice to WebSocket!");
      const token = yield this.connectedUserService.getIdToken();
      return new Promise((resolve) => {
        const ws = new WebSocket(environment.backendURL.replace(/^http/, "ws") + "/ws", ["Authorization", token]);
        let timeout = MGPOptional.empty();
        const reconnect = () => {
          if (timeout.isPresent()) {
            return;
          }
          this.messageDisplayer.criticalMessage($localize`Connection to server failed or closed, trying again in ${this.nextConnectionAttemptTime} seconds...`);
          timeout = MGPOptional.of(setTimeout(() => __async(this, null, function* () {
            const subscription = yield this.connect();
            resolve(subscription);
          }), this.nextConnectionAttemptTime * 1e3));
          this.nextConnectionAttemptTime *= 2;
        };
        ws.onopen = () => {
          if (this.pageIsUnloading) {
            ws.close();
            resolve(new Subscription());
            return;
          }
          if (timeout.isPresent()) {
            window.clearTimeout(timeout.get());
            timeout = MGPOptional.empty();
          }
          this.webSocket = MGPOptional.of(ws);
          this.nextConnectionAttemptTime = 1;
          this.resolveConnection();
          resolve(new Subscription(() => this.disconnect()));
        };
        ws.onerror = (_error) => {
          if (this.webSocket.isPresent()) {
            this.webSocket.get().close();
          }
          this.webSocket = MGPOptional.empty();
          reconnect();
        };
        ws.onclose = () => {
          this.webSocket = MGPOptional.empty();
          if (this.disconnectRequested) {
            this.disconnectRequested = false;
            return;
          }
          reconnect();
        };
        ws.onmessage = (ev) => {
          Utils.assert(typeof ev.data === "string", `Received malformed WebSocket message (not a string): ${JSON.stringify(ev.data)}`);
          const json = Utils.getNonNullable(JSON.parse(ev.data));
          Utils.assert(
            typeof json === "object",
            // i.e., an array
            `Received malformed WebSocket message (not an object): ${JSON.stringify(json)}`
          );
          const tag = json[0];
          const args = json[1];
          Utils.assert(tag != null && typeof tag === "string", `Received malformed WebSocket message (missing tag): ${JSON.stringify(json)}`);
          this.receive(new BackendMessage(tag, args));
        };
      });
    });
  }
  subscribeTo(subscription, gameId) {
    return __async(this, null, function* () {
      if (gameId === void 0) {
        yield this.send([subscription]);
      } else {
        yield this.send([subscription, { gameId }]);
      }
      return new Subscription(() => __async(this, null, function* () {
        return this.send(["Unsubscribe"]);
      }));
    });
  }
  send(message) {
    return __async(this, null, function* () {
      yield this.waitForConnection();
      this.webSocket.get().send(JSON.stringify(message));
    });
  }
  disconnect() {
    Utils.assert(this.webSocket.isPresent(), "Should not disconnect from unconnected WebSocket!");
    this.disconnectRequested = true;
    this.webSocket.get().close();
    this.webSocket = MGPOptional.empty();
    this.connectionPromise = new Promise((resolve) => {
      this.resolveConnection = resolve;
    });
  }
  ngOnDestroy() {
    window.removeEventListener("pagehide", this.disconnectOnPageHide);
    this.disconnectOnPageHide();
  }
  static \u0275fac = function BackendService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BackendService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BackendService, factory: _BackendService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BackendService, [{
    type: Injectable,
    args: [{
      // This ensures that this is a singleton service, which is very important for this one
      // because we want only a single websocket connection, shared among all other services
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  environment,
  BackendService
};
//# sourceMappingURL=chunk-CDWEGVYY.js.map
