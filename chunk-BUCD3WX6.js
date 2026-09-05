import {
  ChatService
} from "./chunk-2ONO4K2X.js";
import {
  FaIconComponent,
  faReply
} from "./chunk-PC6ZDXKZ.js";
import {
  Debug
} from "./chunk-Y4TVVAIH.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ReactiveFormsModule,
  ɵNgNoValidate
} from "./chunk-CIU2KL3F.js";
import {
  formatDate
} from "./chunk-6LTRXF6Y.js";
import {
  Component,
  Input,
  Pipe,
  ViewChild,
  __async,
  inject,
  input,
  setClassMetadata,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefinePipe,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵi18n,
  ɵɵi18nApply,
  ɵɵi18nExp,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuerySignal
} from "./chunk-XHN637UA.js";

// src/app/domain/ConfigRoom.ts
var FirstPlayer;
(function(FirstPlayer2) {
  FirstPlayer2.CREATOR = "Creator";
  FirstPlayer2.RANDOM = "Random";
  FirstPlayer2.CHOSEN_OPPONENT = "ChosenOpponent";
})(FirstPlayer || (FirstPlayer = {}));
var GameType;
(function(GameType2) {
  GameType2.STANDARD = "Standard";
  GameType2.BLITZ = "Blitz";
  GameType2.CUSTOM = "Custom";
})(GameType || (GameType = {}));
var GameDuration;
(function(GameDuration2) {
  GameDuration2.STANDARD_MOVE_DURATION = 2 * 60;
  GameDuration2.STANDARD_GAME_DURATION = 30 * 60;
  GameDuration2.BLITZ_MOVE_DURATION = 30;
  GameDuration2.BLITZ_GAME_DURATION = 15 * 60;
})(GameDuration || (GameDuration = {}));
var Status;
(function(Status2) {
  Status2.CREATED = "Created";
  Status2.CONFIG_PROPOSED = "ConfigProposed";
  Status2.STARTED = "Started";
  Status2.FINISHED = "Finished";
})(Status || (Status = {}));

// src/app/components/normal-component/chat/chat.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _c0 = ["chatDiv"];
var _c1 = () => ({ standalone: true });
function ChatComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 2);
    \u0275\u0275elementContainerEnd();
  }
}
function ChatComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 3);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r0.unreadMessagesText);
    \u0275\u0275i18nApply(1);
  }
}
function ChatComponent_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function ChatComponent_Conditional_4_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.scrollToBottom());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.unreadMessagesText, " \u2193");
  }
}
function ChatComponent_Conditional_4_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "b", 10);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ":");
    \u0275\u0275elementStart(5, "span", 11);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const msg_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" [", ctx_r0.formatTimestamp(msg_r4.timestamp), "] ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(msg_r4.sender.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(msg_r4.content);
  }
}
function ChatComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, ChatComponent_Conditional_4_Conditional_1_Template, 2, 1, "button", 7);
    \u0275\u0275elementStart(2, "div", 8, 0);
    \u0275\u0275listener("scroll", function ChatComponent_Conditional_4_Template_div_scroll_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.updateCurrentScrollPosition());
    });
    \u0275\u0275repeaterCreate(4, ChatComponent_Conditional_4_For_5_Template, 7, 3, "p", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.showUnreadMessagesButton ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.chat);
  }
}
function ChatComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 12);
    \u0275\u0275listener("onSubmit", function ChatComponent_Conditional_5_Template_form_onSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.sendMessage());
    });
    \u0275\u0275elementStart(1, "div", 13)(2, "div", 14)(3, "input", 15, 1);
    \u0275\u0275twoWayListener("ngModelChange", function ChatComponent_Conditional_5_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.userMessage, $event) || (ctx_r0.userMessage = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 17)(8, "button", 18);
    \u0275\u0275listener("click", function ChatComponent_Conditional_5_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.sendMessage());
    });
    \u0275\u0275element(9, "fa-icon", 19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 20)(11, "p")(12, "strong");
    \u0275\u0275i18n(13, 4);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const message_r6 = \u0275\u0275reference(4);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.userMessage);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(4, _c1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", message_r6.value.length, "/128");
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx_r0.faReply);
  }
}
var ChatComponent = class ChatComponent2 {
  chatService = inject(ChatService);
  userMessage = "";
  connected = false;
  chat = [];
  readMessages = 0;
  unreadMessagesText = "";
  showUnreadMessagesButton = false;
  visible = true;
  faReply = faReply;
  isNearBottom = true;
  notYetScrolled = true;
  chatDiv = viewChild("chatDiv", ...ngDevMode ? [{ debugName: "chatDiv" }] : []);
  chatSubscription;
  ngOnInit() {
    this.loadChatContent();
  }
  loadChatContent() {
    this.chatSubscription = this.chatService.subscribeToMessages((message) => {
      this.onMessageReceived(message);
    });
  }
  ngOnDestroy() {
    this.chatSubscription.unsubscribe();
  }
  ngAfterViewChecked() {
    this.scrollToBottomIfNeeded();
  }
  onMessageReceived(message) {
    this.chat.push(message);
    const nbMessages = this.chat.length;
    if (this.visible && this.isNearBottom) {
      this.readMessages = nbMessages;
      this.updateUnreadMessagesText(0);
      this.scrollToBottom();
    } else {
      this.updateUnreadMessagesText(nbMessages - this.readMessages);
    }
  }
  updateUnreadMessagesText(unreadMessages) {
    if (this.visible && this.isNearBottom === false) {
      this.showUnreadMessagesButton = true;
    } else {
      this.showUnreadMessagesButton = false;
    }
    if (unreadMessages === 0) {
      this.unreadMessagesText = $localize`no new message`;
      this.showUnreadMessagesButton = false;
    } else if (unreadMessages === 1) {
      this.unreadMessagesText = $localize`1 new message`;
    } else {
      this.unreadMessagesText = $localize`${unreadMessages} new messages`;
    }
  }
  scrollToBottomIfNeeded() {
    if (this.visible) {
      if (this.isNearBottom || this.notYetScrolled) {
        this.scrollToBottom();
      }
    }
  }
  updateCurrentScrollPosition() {
    const threshold = 10;
    const position = this.chatDiv().nativeElement.scrollTop + this.chatDiv().nativeElement.offsetHeight;
    const height = this.chatDiv().nativeElement.scrollHeight;
    this.isNearBottom = position > height - threshold;
  }
  scrollToBottom() {
    const chatDiv = this.chatDiv();
    if (chatDiv == null) {
      return;
    }
    this.updateUnreadMessagesText(0);
    this.scrollTo(chatDiv.nativeElement.scrollHeight);
    this.notYetScrolled = false;
  }
  // public for testing purpose only
  scrollTo(position) {
    this.chatDiv().nativeElement.scroll({
      top: position,
      left: 0,
      behavior: "smooth"
    });
  }
  sendMessage() {
    return __async(this, null, function* () {
      const content = this.userMessage;
      this.userMessage = "";
      yield this.chatService.sendMessage(content);
    });
  }
  switchChatVisibility() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
      this.updateUnreadMessagesText(0);
      this.scrollToBottom();
      this.readMessages = this.chat.length;
    }
  }
  formatTimestamp(timestamp) {
    return formatDate(timestamp, "HH:mm:ss", "en-US");
  }
  static \u0275fac = function ChatComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ChatComponent2)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: ChatComponent2, selectors: [["app-chat"]], viewQuery: function ChatComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.chatDiv, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, decls: 6, vars: 3, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_8447591012079458095$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_0 = goog.getMsg("Hide chat");
      i18n_0 = MSG_EXTERNAL_8447591012079458095$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Hide chat`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_2548478019706423370$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_1 = goog.getMsg("Show chat ({$interpolation})", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ unreadMessagesText }}" } });
      i18n_1 = MSG_EXTERNAL_2548478019706423370$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Show chat (${"\uFFFD0\uFFFD"}:INTERPOLATION:)`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_8403075591877274055$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_2 = goog.getMsg("Type your message here");
      i18n_2 = MSG_EXTERNAL_8403075591877274055$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Type your message here`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_2187377168518132372$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_3 = goog.getMsg("Be polite");
      i18n_3 = MSG_EXTERNAL_2187377168518132372$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_CHAT_CHAT_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Be polite`;
    }
    return [["chatDiv", ""], ["message", ""], i18n_0, i18n_1, i18n_3, ["id", "switchChatVisibilityButton", 1, "button", "is-primary", "is-fullwidth", 3, "click"], ["id", "chatForm"], ["id", "scrollToBottomIndicator", 1, "notification", "button", "is-info", "is-fullwidth"], ["id", "chatDiv", 1, "is-fullwidth", "block", 2, "overflow-y", "scroll", "max-height", "50vh", 3, "scroll"], ["id", "scrollToBottomIndicator", 1, "notification", "button", "is-info", "is-fullwidth", 3, "click"], [1, "chat-sender"], [1, "chat-message"], ["id", "chatForm", 3, "onSubmit"], [1, "field", "has-addons", "is-fullwidth"], [1, "control", "is-expanded"], ["id", "message", "type", "text", "placeholder", i18n_2, "maxlength", "128", "value", "", 1, "input", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "help"], [1, "control"], ["type", "submit", "id", "send", 1, "button", "is-primary", 3, "click"], [1, "clickable-icon", 3, "icon"], [1, "content", "is-small"]];
  }, template: function ChatComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div")(1, "button", 5);
      \u0275\u0275listener("click", function ChatComponent_Template_button_click_1_listener() {
        return ctx.switchChatVisibility();
      });
      \u0275\u0275conditionalCreate(2, ChatComponent_Conditional_2_Template, 2, 0, "ng-container")(3, ChatComponent_Conditional_3_Template, 2, 1, "ng-container");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, ChatComponent_Conditional_4_Template, 6, 1, "div");
      \u0275\u0275conditionalCreate(5, ChatComponent_Conditional_5_Template, 14, 5, "form", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.visible ? 2 : 3);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.visible ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.visible ? 5 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormsModule, NgModel, NgForm, FaIconComponent], encapsulation: 2 });
};
ChatComponent = __decorate([
  Debug.log
], ChatComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatComponent, [{
    type: Component,
    args: [{ selector: "app-chat", imports: [ReactiveFormsModule, FormsModule, FaIconComponent], template: '<div>\n    <button id="switchChatVisibilityButton"\n            class="button is-primary is-fullwidth"\n            (click)="switchChatVisibility()">\n        @if (visible) {\n            <ng-container i18n>Hide chat</ng-container>\n        } @else {\n            <ng-container i18n>Show chat ({{ unreadMessagesText }})</ng-container>\n        }\n    </button>\n\n    @if (visible) {\n        <div>\n            @if (showUnreadMessagesButton) {\n                <button id="scrollToBottomIndicator"\n                        class="notification button is-info is-fullwidth"\n                        (click)="scrollToBottom()">{{ unreadMessagesText }} &darr;</button>\n            }\n            <div #chatDiv\n                 id="chatDiv"\n                 class="is-fullwidth block"\n                 style="overflow-y:scroll; max-height: 50vh;"\n                 (scroll)="updateCurrentScrollPosition()">\n                @for (msg of chat; track $index) {\n                    <p>\n                        [{{ formatTimestamp(msg.timestamp) }}] <b class="chat-sender">{{ msg.sender.name }}</b>:<span class="chat-message">{{ msg.content }}</span>\n                    </p>\n                }\n            </div>\n        </div>\n    }\n\n    @if (visible) {\n        <form id="chatForm"\n              (onSubmit)="sendMessage()">\n            <div class="field has-addons is-fullwidth">\n                <div class="control is-expanded">\n                    <input class="input"\n                           #message\n                           id="message"\n                           type="text"\n                           placeholder="Type your message here"\n                           i18n-placeholder\n                           maxlength="128"\n                           value=""\n                           [(ngModel)]="userMessage"\n                           [ngModelOptions]="{standalone: true}"/>\n                    <p class="help">{{ message.value.length }}/128</p>\n                </div>\n                <div class="control">\n                    <button class="button is-primary"\n                            type="submit"\n                            id="send"\n                            (click)="sendMessage()">\n                        <fa-icon [icon]="faReply"\n                                 class="clickable-icon"></fa-icon>\n                    </button>\n                </div>\n            </div>\n            <div class="content is-small">\n                <p><strong i18n>Be polite</strong></p>\n            </div>\n        </form>\n    }\n</div>\n' }]
  }], null, { chatDiv: [{ type: ViewChild, args: ["chatDiv", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatComponent, { className: "ChatComponent", filePath: "src/app/components/normal-component/chat/chat.component.ts", lineNumber: 18 });
})();

// src/app/pipes-and-directives/elo.pipe.ts
var EloPipe = class _EloPipe {
  transform(value) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).format(value);
  }
  static \u0275fac = function EloPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EloPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "elo", type: _EloPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EloPipe, [{
    type: Pipe,
    args: [{ name: "elo" }]
  }], null, null);
})();

// src/app/components/normal-component/elo/elo.component.ts
var EloComponent = class _EloComponent {
  elo = input.required(...ngDevMode ? [{ debugName: "elo" }] : []);
  static \u0275fac = function EloComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EloComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EloComponent, selectors: [["app-elo"]], inputs: { elo: [1, "elo"] }, decls: 2, vars: 3, template: function EloComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275text(0);
      \u0275\u0275pipe(1, "elo");
    }
    if (rf & 2) {
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(1, 1, ctx.elo()));
    }
  }, dependencies: [EloPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EloComponent, [{
    type: Component,
    args: [{
      selector: "app-elo",
      template: `{{ elo() | elo }}`,
      imports: [EloPipe]
    }]
  }], null, { elo: [{ type: Input, args: [{ isSignal: true, alias: "elo", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EloComponent, { className: "EloComponent", filePath: "src/app/components/normal-component/elo/elo.component.ts", lineNumber: 10 });
})();

export {
  FirstPlayer,
  GameType,
  GameDuration,
  Status,
  ChatComponent,
  EloComponent
};
//# sourceMappingURL=chunk-BUCD3WX6.js.map
