import {
  Router,
  RouterLink
} from "./chunk-VZWZQOY5.js";
import {
  ConnectedUserService
} from "./chunk-2UAGI2IP.js";
import "./chunk-Y4TVVAIH.js";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-CIU2KL3F.js";
import "./chunk-KI3WLQMB.js";
import "./chunk-6LTRXF6Y.js";
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
  ɵɵi18nApply,
  ɵɵi18nEnd,
  ɵɵi18nExp,
  ɵɵi18nStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XHN637UA.js";

// src/app/components/normal-component/verify-account/verify-account.component.ts
var _c0 = () => ["/lobby"];
function VerifyAccountComponent_Conditional_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275i18n(1, 6);
    \u0275\u0275elementEnd();
  }
}
function VerifyAccountComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "p", 15);
    \u0275\u0275i18n(2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 16)(4, "p", 17);
    \u0275\u0275i18n(5, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 18);
    \u0275\u0275listener("click", function VerifyAccountComponent_Conditional_4_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.finalizeEmailVerification());
    });
    \u0275\u0275i18n(7, 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 19)(9, "p", 17);
    \u0275\u0275i18n(10, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 20);
    \u0275\u0275listener("click", function VerifyAccountComponent_Conditional_4_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendEmailVerification());
    });
    \u0275\u0275i18n(12, 5);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, VerifyAccountComponent_Conditional_4_Conditional_13_Template, 2, 0, "p", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275i18nExp(ctx_r1.emailAddress);
    \u0275\u0275i18nApply(2);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(ctx_r1.success ? 13 : -1);
  }
}
function VerifyAccountComponent_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 15);
    \u0275\u0275i18n(2, 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "form", 24)(4, "div", 25)(5, "div", 26);
    \u0275\u0275element(6, "input", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 26)(8, "button", 28);
    \u0275\u0275listener("click", function VerifyAccountComponent_Conditional_5_Conditional_0_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.pickUsername(ctx_r1.usernameForm.value));
    });
    \u0275\u0275i18n(9, 8);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("formGroup", ctx_r1.usernameForm);
  }
}
function VerifyAccountComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275i18nStart(1, 9);
    \u0275\u0275element(2, "a", 29);
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(1, _c0));
  }
}
function VerifyAccountComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, VerifyAccountComponent_Conditional_5_Conditional_0_Template, 10, 1, "div", 22);
    \u0275\u0275conditionalCreate(1, VerifyAccountComponent_Conditional_5_Conditional_1_Template, 3, 2, "div", 23);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.success ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.success ? 1 : -1);
  }
}
function VerifyAccountComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
var VerifyAccountComponent = class _VerifyAccountComponent {
  connectedUserService = inject(ConnectedUserService);
  router = inject(Router);
  verificationType = null;
  success = false;
  triedToFinalize = false;
  errorMessage;
  emailAddress;
  userSubscription;
  usernameForm = new FormGroup({
    username: new FormControl()
  });
  ngOnInit() {
    return __async(this, null, function* () {
      this.userSubscription = this.connectedUserService.subscribeToUser((user) => __async(this, null, function* () {
        this.emailAddress = user.email.get();
        if (user.username.isAbsent()) {
          this.verificationType = "enter-username";
        } else {
          this.verificationType = "send-email";
          if (this.triedToFinalize && user.verified === false) {
            this.errorMessage = $localize`You have not verified your email! Click on the link in the verification email.`;
          }
          if (user.verified) {
            yield this.router.navigate(["/lobby"]);
          }
        }
      }));
    });
  }
  pickUsername(formContent) {
    return __async(this, null, function* () {
      const result = yield this.connectedUserService.setUsername(formContent.username);
      if (result.isSuccess()) {
        this.success = true;
      } else {
        this.errorMessage = result.getReason();
      }
    });
  }
  sendEmailVerification() {
    return __async(this, null, function* () {
      const result = yield this.connectedUserService.sendEmailVerification();
      if (result.isSuccess()) {
        this.success = true;
      } else {
        this.errorMessage = result.getReason();
      }
    });
  }
  finalizeEmailVerification() {
    return __async(this, null, function* () {
      this.triedToFinalize = true;
      yield this.connectedUserService.reloadUser();
      window.open(window.location.href, "_self");
    });
  }
  ngOnDestroy() {
    if (this.userSubscription != null && this.userSubscription.unsubscribe != null) {
      this.userSubscription.unsubscribe();
    }
  }
  static \u0275fac = function VerifyAccountComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifyAccountComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifyAccountComponent, selectors: [["app-verify-account"]], decls: 7, vars: 3, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6996804354508674341$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_0 = goog.getMsg("Account verification");
      i18n_0 = MSG_EXTERNAL_6996804354508674341$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Account verification`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_7355165359487316105$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_1 = goog.getMsg("In order to finalize your account, you must click on the link that you should have received on your email address ({$interpolation}). The email could be in your spam folder.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ emailAddress }}" } });
      i18n_1 = MSG_EXTERNAL_7355165359487316105$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`In order to finalize your account, you must click on the link that you should have received on your email address (${"\uFFFD0\uFFFD"}:INTERPOLATION:). The email could be in your spam folder.`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_4295852829952528556$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_2 = goog.getMsg("Once you have verified your email, click on the following button:");
      i18n_2 = MSG_EXTERNAL_4295852829952528556$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Once you have verified your email, click on the following button:`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_881022283381326299$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_3 = goog.getMsg("Finalize email verification");
      i18n_3 = MSG_EXTERNAL_881022283381326299$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Finalize email verification`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_921630192161780240$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_4 = goog.getMsg("If you have not received the verification email, click on the following button:");
      i18n_4 = MSG_EXTERNAL_921630192161780240$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`If you have not received the verification email, click on the following button:`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_4592546836544908536$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_5 = goog.getMsg("Send verification email again");
      i18n_5 = MSG_EXTERNAL_4592546836544908536$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Send verification email again`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_8940072639524140983$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_6 = goog.getMsg("The email has been sent");
      i18n_6 = MSG_EXTERNAL_8940072639524140983$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`The email has been sent`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_5248717555542428023$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_7 = goog.getMsg("Username");
      i18n_7 = MSG_EXTERNAL_5248717555542428023$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Username`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_141258547622133215$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_8 = goog.getMsg("In order to finalize your account, you must choose a username.");
      i18n_8 = MSG_EXTERNAL_141258547622133215$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`In order to finalize your account, you must choose a username.`;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_293336831363270094$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_9 = goog.getMsg("Pick username");
      i18n_9 = MSG_EXTERNAL_293336831363270094$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`Pick username`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_4530736686557621621$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_10 = goog.getMsg("Your account has now been finalized, you can go back to the {$startLink}list of games{$closeLink}.", { "closeLink": "\uFFFD/#2\uFFFD", "startLink": "\uFFFD#2\uFFFD" }, { original_code: { "closeLink": "</a>", "startLink": `<a [routerLink]="['/lobby']">` } });
      i18n_10 = MSG_EXTERNAL_4530736686557621621$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_VERIFY_ACCOUNT_VERIFY_ACCOUNT_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`Your account has now been finalized, you can go back to the ${"\uFFFD#2\uFFFD"}:START_LINK:list of games${"\uFFFD/#2\uFFFD"}:CLOSE_LINK:.`;
    }
    return [i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_8, i18n_9, i18n_10, [1, "box"], [1, "message", "is-info"], [1, "message-header"], ["id", "verificationEmail", 1, "message-body"], [1, "message", "is-danger"], [1, "block"], [1, "block", "level-left"], [1, "level-item"], ["id", "finalizeVerification", 1, "button", "is-primary", "level-item", "is-small", 3, "click"], [1, "level-left"], ["id", "sendEmail", 1, "button", "is-warning", "level-item", "is-small", 3, "click"], ["id", "success", 1, "help", "is-success"], ["id", "askUsername", 1, "message-body"], ["id", "success", 1, "message-body"], [3, "formGroup"], [1, "field", "has-addons"], [1, "control"], ["id", "username", "type", "text", "placeholder", i18n_7, "name", "username", "required", "", "formControlName", "username", 1, "input"], ["id", "pickUsername", 1, "button", "is-info", 3, "click"], [3, "routerLink"], ["id", "errorMessage", 1, "message-body"]];
  }, template: function VerifyAccountComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "div", 12);
      \u0275\u0275i18n(3, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, VerifyAccountComponent_Conditional_4_Template, 14, 2, "div", 13);
      \u0275\u0275conditionalCreate(5, VerifyAccountComponent_Conditional_5_Template, 2, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, VerifyAccountComponent_Conditional_6_Template, 3, 1, "div", 14);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.verificationType === "send-email" ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.verificationType === "enter-username" ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessage ? 6 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerifyAccountComponent, [{
    type: Component,
    args: [{ selector: "app-verify-account", imports: [ReactiveFormsModule, RouterLink], template: `<div class="box">
    <div class="message is-info">
        <div class="message-header"
             i18n>Account verification</div>

        @if (verificationType === 'send-email') {
            <div class="message-body"
                 id="verificationEmail">
                <p class="block"
                   i18n>In order to finalize your account, you must click on the link that you should have received on your email address ({{ emailAddress }}). The email could be in your spam folder.</p>
                <div class="block level-left">
                    <p class="level-item"
                       i18n>Once you have verified your email, click on the following button:</p>
                    <button id="finalizeVerification"
                            class="button is-primary level-item is-small"
                            (click)="finalizeEmailVerification()"
                            i18n>Finalize email verification</button>
                </div>
                <div class="level-left">
                    <p class="level-item"
                       i18n>If you have not received the verification email, click on the following button:</p>
                    <button id="sendEmail"
                            class="button is-warning level-item is-small"
                            (click)="sendEmailVerification()"
                            i18n>Send verification email again</button>
                </div>
                @if (success) {
                    <p id="success"
                       class="help is-success"
                       i18n>The email has been sent</p>
                }
            </div>
        }

        @if (verificationType === 'enter-username') {
            @if (!success) {
                <div id="askUsername"
                     class="message-body">
                    <div class="block"
                         i18n>In order to finalize your account, you must choose a username.</div>
                    <form [formGroup]="usernameForm">
                        <div class="field has-addons">
                            <div class="control">
                                <input id="username"
                                       class="input"
                                       type="text"
                                       i18n-placeholder
                                       placeholder="Username"
                                       name="username"
                                       required
                                       formControlName="username"/>
                            </div>
                            <div class="control">
                                <button class="button is-info"
                                        id="pickUsername"
                                        (click)="pickUsername(usernameForm.value)"
                                        i18n>Pick username</button>
                            </div>
                        </div>
                    </form>
                </div>
            }
            @if (success) {
                <div id="success"
                     class="message-body"
                     i18n>Your account has now been finalized, you can go back to the <a [routerLink]="['/lobby']">list of games</a>.</div>
            }
        }
    </div>
    @if (errorMessage) {
        <div class="message is-danger">
            <div class="message-body"
                 id="errorMessage">{{ errorMessage }}</div>
        </div>
    }
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifyAccountComponent, { className: "VerifyAccountComponent", filePath: "src/app/components/normal-component/verify-account/verify-account.component.ts", lineNumber: 21 });
})();
export {
  VerifyAccountComponent
};
//# sourceMappingURL=verify-account.component-BK2D3YUS.js.map
