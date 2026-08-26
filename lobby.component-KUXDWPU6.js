import {
  ChatComponent,
  EloComponent,
  Status
} from "./chunk-GDSUWAIX.js";
import "./chunk-LRCRBTCF.js";
import {
  OnlineGameSelectionComponent
} from "./chunk-OJEV33IP.js";
import "./chunk-BHAARBTV.js";
import {
  CurrentGameService,
  GameActionFailure
} from "./chunk-7S3G2JAM.js";
import {
  BackendService
} from "./chunk-CDWEGVYY.js";
import {
  GameInfo,
  MessageDisplayer
} from "./chunk-IRXKBJB2.js";
import "./chunk-FEVFFL6C.js";
import "./chunk-PC6ZDXKZ.js";
import {
  Router
} from "./chunk-VZWZQOY5.js";
import "./chunk-4NSDYNM6.js";
import "./chunk-2UAGI2IP.js";
import {
  Debug
} from "./chunk-Y4TVVAIH.js";
import "./chunk-CIU2KL3F.js";
import {
  MGPMap
} from "./chunk-KI3WLQMB.js";
import {
  NgClass
} from "./chunk-6LTRXF6Y.js";
import {
  Component,
  Injectable,
  Subscription,
  __async,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵi18n,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XHN637UA.js";

// src/app/services/ActiveConfigRoomsService.ts
var AbstractActiveConfigRoomsService = class {
};
var ActiveConfigRoomsService = class _ActiveConfigRoomsService extends AbstractActiveConfigRoomsService {
  backendService = inject(BackendService);
  subscribe(callback) {
    const activeRooms = new MGPMap();
    const updateSubscription = this.backendService.setCallback("ConfigRoomUpdate", (message) => {
      activeRooms.put(message.getArgument("gameId"), message.getArgument("configRoom"));
      callback(activeRooms);
    });
    const deleteSubscription = this.backendService.setCallback("ConfigRoomDeleted", (message) => {
      activeRooms.delete(message.getArgument("gameId"));
      callback(activeRooms);
    });
    return new Subscription(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ActiveConfigRoomsService_BaseFactory;
    return function ActiveConfigRoomsService_Factory(__ngFactoryType__) {
      return (\u0275ActiveConfigRoomsService_BaseFactory || (\u0275ActiveConfigRoomsService_BaseFactory = \u0275\u0275getInheritedFactory(_ActiveConfigRoomsService)))(__ngFactoryType__ || _ActiveConfigRoomsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActiveConfigRoomsService, factory: _ActiveConfigRoomsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActiveConfigRoomsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/components/normal-component/lobby/lobby.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _forTrack0 = ($index, $item) => $item.id;
function LobbyComponent_For_26_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const configRoom_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", configRoom_r2.chosenOpponent.name, " ");
  }
}
function LobbyComponent_For_26_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 7);
    \u0275\u0275elementContainerEnd();
  }
}
function LobbyComponent_For_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 25);
    \u0275\u0275listener("click", function LobbyComponent_For_26_Template_tr_click_0_listener() {
      const configRoom_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.joinGame(configRoom_r2));
    });
    \u0275\u0275elementStart(1, "td", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 27);
    \u0275\u0275text(4);
    \u0275\u0275element(5, "app-elo", 28);
    \u0275\u0275text(6, ")");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 29);
    \u0275\u0275conditionalCreate(8, LobbyComponent_For_26_Conditional_8_Template, 1, 1)(9, LobbyComponent_For_26_Conditional_9_Template, 2, 0, "ng-container");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 30);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const configRoom_r2 = ctx.$implicit;
    const \u0275$index_51_r4 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("id", \u0275\u0275interpolate1("part-", \u0275$index_51_r4));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getGameName(configRoom_r2));
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("part-of-", configRoom_r2.creator.name));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", configRoom_r2.creator.name, " (");
    \u0275\u0275advance();
    \u0275\u0275property("elo", configRoom_r2.creatorElo);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(configRoom_r2.chosenOpponent ? 8 : 9);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(configRoom_r2.status);
  }
}
var LobbyComponent = class LobbyComponent2 {
  router = inject(Router);
  messageDisplayer = inject(MessageDisplayer);
  activeConfigRoomsService = inject(ActiveConfigRoomsService);
  currentGameService = inject(CurrentGameService);
  backendService = inject(BackendService);
  activeConfigRooms = new MGPMap();
  activeConfigRoomsSubscription;
  // initialized in ngOnInit
  currentGameSubscription;
  // initialized in ngOnInit
  lobbySubscription;
  // initialized in ngOnInit
  errorSubscription;
  // initialized in ngOnInit
  currentTab = "games";
  createTabClasses = [];
  ngOnInit() {
    return __async(this, null, function* () {
      this.activeConfigRoomsSubscription = this.activeConfigRoomsService.subscribe((rooms) => {
        this.activeConfigRooms = rooms;
      });
      this.currentGameSubscription = this.currentGameService.subscribeToCurrentGame((observed) => {
        this.createTabClasses = [];
        if (observed.isPresent()) {
          this.createTabClasses = ["disabled-tab"];
        }
      });
      this.lobbySubscription = yield this.backendService.subscribeToLobby();
      this.errorSubscription = this.backendService.setCallback("Error", (message) => __async(this, null, function* () {
        yield this.onError(message.getArgument("reason"));
      }));
    });
  }
  onError(error) {
    return __async(this, null, function* () {
      switch (error) {
        case "already-subscribed":
          this.messageDisplayer.criticalMessage(GameActionFailure.YOU_ALREADY_HAVE_ANOTHER_TAB());
          yield this.router.navigate(["/"]);
          break;
        default:
          this.messageDisplayer.criticalMessage(GameActionFailure.UNEXPECTED_BACKEND_ERROR(error));
          yield this.router.navigate(["/"]);
          break;
      }
    });
  }
  ngOnDestroy() {
    return __async(this, null, function* () {
      this.lobbySubscription.unsubscribe();
      this.activeConfigRoomsSubscription.unsubscribe();
      this.currentGameSubscription.unsubscribe();
      this.errorSubscription.unsubscribe();
    });
  }
  getActiveConfigRooms() {
    const all = [];
    for (const [id, data] of this.activeConfigRooms) {
      all.push(__spreadValues({ id }, data));
    }
    return all;
  }
  getGameName(configRoom) {
    return GameInfo.getByUrlName(configRoom.gameName).get().name;
  }
  joinGame(configRoom) {
    return __async(this, null, function* () {
      const gameId = configRoom.id;
      const gameName = configRoom.gameName;
      const gameStarted = configRoom.status === Status.STARTED;
      const canUserJoin = this.currentGameService.canUserJoin(gameId, gameStarted);
      if (canUserJoin.isSuccess()) {
        yield this.router.navigate(["/play", gameName, gameId]);
      } else {
        this.messageDisplayer.criticalMessage(canUserJoin.getReason());
      }
    });
  }
  selectTab(tab) {
    if (tab === "create") {
      const canUserCreate = this.currentGameService.canUserCreate();
      if (canUserCreate.isSuccess()) {
        this.currentTab = tab;
      } else {
        this.messageDisplayer.criticalMessage(canUserCreate.getReason());
      }
    } else {
      this.currentTab = tab;
    }
  }
  getVisibility(tab) {
    if (this.currentTab === tab) {
      return "";
    } else {
      return "is-hidden";
    }
  }
  static \u0275fac = function LobbyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || LobbyComponent2)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: LobbyComponent2, selectors: [["app-lobby"]], decls: 33, vars: 4, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_7656395805241225659$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_0 = goog.getMsg("Games");
      i18n_0 = MSG_EXTERNAL_7656395805241225659$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Games`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_5674286808255988565$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_1 = goog.getMsg("Create");
      i18n_1 = MSG_EXTERNAL_5674286808255988565$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Create`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_2299187798995800780$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_2 = goog.getMsg("Chat");
      i18n_2 = MSG_EXTERNAL_2299187798995800780$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Chat`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_4643591148728960560$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_3 = goog.getMsg("Game");
      i18n_3 = MSG_EXTERNAL_4643591148728960560$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Game`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_3710582909570607859$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_4 = goog.getMsg("First player");
      i18n_4 = MSG_EXTERNAL_3710582909570607859$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`First player`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_4060021930998903329$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_5 = goog.getMsg("Second player");
      i18n_5 = MSG_EXTERNAL_4060021930998903329$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Second player`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_5611592591303869712$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_6 = goog.getMsg("Status");
      i18n_6 = MSG_EXTERNAL_5611592591303869712$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Status`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_689957366051097321$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_7 = goog.getMsg("Waiting for opponent");
      i18n_7 = MSG_EXTERNAL_689957366051097321$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOBBY_LOBBY_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Waiting for opponent`;
    }
    return [i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, [1, "tabs", "is-toggle", "is-fullwidth"], ["ngClass", "if (currentTab === 'games') 'is-active'"], ["id", "tab-games", 3, "click"], ["ngClass", "if (currentTab === 'create') 'is-active'"], ["id", "tab-create", 3, "click", "ngClass"], ["ngClass", "if (currentTab === 'chat') 'is-active'"], ["id", "tab-chat", 3, "click"], ["id", "game-list-tab", 1, "box", 3, "ngClass"], [1, "table-container"], [1, "table", "is-fullwidth", "is-hoverable", "is-striped"], ["scope", "col", 1, "th"], [3, "id"], ["id", "game-creator-tab", 1, "box", 3, "ngClass"], ["id", "online-game-selection"], ["id", "chat-tab", 1, "columns", 3, "ngClass"], [1, "column", "is-12"], ["id", "chat", 1, "box"], [3, "click", "id"], [1, "td", "data-game-name"], [1, "td", 3, "id"], [3, "elo"], [1, "td"], [1, "td", "data-status"]];
  }, template: function LobbyComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 8)(1, "ul")(2, "li", 9)(3, "a", 10);
      \u0275\u0275listener("click", function LobbyComponent_Template_a_click_3_listener() {
        return ctx.selectTab("games");
      });
      \u0275\u0275i18n(4, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "li", 11)(6, "a", 12);
      \u0275\u0275listener("click", function LobbyComponent_Template_a_click_6_listener() {
        return ctx.selectTab("create");
      });
      \u0275\u0275i18n(7, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "li", 13)(9, "a", 14);
      \u0275\u0275listener("click", function LobbyComponent_Template_a_click_9_listener() {
        return ctx.selectTab("chat");
      });
      \u0275\u0275i18n(10, 2);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(11, "div", 15)(12, "div", 16)(13, "table", 17)(14, "thead")(15, "tr")(16, "th", 18);
      \u0275\u0275i18n(17, 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "th", 18);
      \u0275\u0275i18n(19, 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "th", 18);
      \u0275\u0275i18n(21, 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "th", 18);
      \u0275\u0275i18n(23, 6);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "tbody");
      \u0275\u0275repeaterCreate(25, LobbyComponent_For_26_Template, 12, 9, "tr", 19, _forTrack0);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(27, "div", 20);
      \u0275\u0275element(28, "app-online-game-selection", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "div", 22)(30, "div", 23)(31, "div", 24);
      \u0275\u0275element(32, "app-chat");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("ngClass", ctx.createTabClasses);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngClass", ctx.getVisibility("games"));
      \u0275\u0275advance(14);
      \u0275\u0275repeater(ctx.getActiveConfigRooms());
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", ctx.getVisibility("create"));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", ctx.getVisibility("chat"));
    }
  }, dependencies: [NgClass, OnlineGameSelectionComponent, ChatComponent, EloComponent], encapsulation: 2 });
};
LobbyComponent = __decorate([
  Debug.log
], LobbyComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LobbyComponent, [{
    type: Component,
    args: [{ selector: "app-lobby", imports: [NgClass, OnlineGameSelectionComponent, ChatComponent, EloComponent], template: `<div class="tabs is-toggle is-fullwidth">
    <ul>
        <li ngClass="if (currentTab === 'games') 'is-active'">
            <a id="tab-games"
               (click)="selectTab('games')"
               i18n>Games</a>
        </li>
        <li ngClass="if (currentTab === 'create') 'is-active'">
            <a id="tab-create"
               [ngClass]="createTabClasses"
               (click)="selectTab('create')"
               i18n>Create</a>
        </li>
        <li ngClass="if (currentTab === 'chat') 'is-active'">
            <a id="tab-chat"
               (click)="selectTab('chat')"
               i18n>Chat</a>
        </li>
    </ul>
</div>

<div id="game-list-tab"
     class="box"
     [ngClass]="getVisibility('games')">
    <div class="table-container">
        <table class="table is-fullwidth is-hoverable is-striped">
            <thead>
                <tr>
                    <th class="th"
                        scope="col"
                        i18n>Game</th>
                    <th class="th"
                        scope="col"
                        i18n>First player</th>
                    <th class="th"
                        scope="col"
                        i18n>Second player</th>
                    <th class="th"
                        scope="col"
                        i18n>Status</th>
                </tr>
            </thead>
            <tbody>
                @for (configRoom of getActiveConfigRooms(); track configRoom.id; let i = $index) {
                    <tr id="part-{{ i }}"
                        (click)="joinGame(configRoom)">
                        <td class="td data-game-name">{{ getGameName(configRoom) }}</td>
                        <td class="td"
                            id="part-of-{{ configRoom.creator.name}}">{{ configRoom.creator.name }} (<app-elo [elo]="configRoom.creatorElo"/>)</td>
                        <td class="td">
                            @if (configRoom.chosenOpponent) {
                                {{ configRoom.chosenOpponent.name }}
                            } @else {
                                <ng-container i18n>Waiting for opponent</ng-container>
                            }
                        </td>
                        <td class="td data-status">{{ configRoom.status }}</td>
                    </tr>
                }
            </tbody>
        </table>
    </div>
</div>

<div id="game-creator-tab"
     class="box"
     [ngClass]="getVisibility('create')">
    <app-online-game-selection id="online-game-selection"></app-online-game-selection>
</div>

<div id="chat-tab"
     class="columns"
     [ngClass]="getVisibility('chat')">
    <div class="column is-12">
        <div id="chat"
             class="box">
            <app-chat></app-chat>
        </div>
    </div>
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LobbyComponent, { className: "LobbyComponent", filePath: "src/app/components/normal-component/lobby/lobby.component.ts", lineNumber: 32 });
})();
export {
  LobbyComponent
};
//# sourceMappingURL=lobby.component-KUXDWPU6.js.map
