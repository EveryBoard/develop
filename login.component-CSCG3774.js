import {
  ToggleVisibilityDirective
} from "./chunk-GA4KICJI.js";
import {
  FaIconComponent,
  faEye
} from "./chunk-5NDDVV6Y.js";
import {
  Router,
  RouterLink
} from "./chunk-MC3HRXVP.js";
import {
  AuthUser,
  ConnectedUserService
} from "./chunk-OH7GNXKT.js";
import {
  AutofocusDirective
} from "./chunk-4D3V7D3R.js";
import "./chunk-NCTOIZLG.js";
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
} from "./chunk-DR33J2Q3.js";
import "./chunk-KTC3UZQD.js";
import "./chunk-EAKNFFYB.js";
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
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵi18n,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-AC6ULWDE.js";

// src/app/components/normal-component/login/login.component.ts
var _c0 = () => ["/register"];
var _c1 = () => ["/reset-password"];
function LoginComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 30);
    \u0275\u0275i18n(2, 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 31);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
var LoginComponent = class _LoginComponent {
  router = inject(Router);
  connectedUserService = inject(ConnectedUserService);
  faEye = faEye;
  errorMessage;
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });
  userSubscription;
  ngOnInit() {
    this.userSubscription = this.connectedUserService.subscribeToUser((user) => __async(this, null, function* () {
      if (user !== AuthUser.NOT_CONNECTED) {
        yield this.redirect();
      }
    }));
  }
  loginWithEmail(value) {
    return __async(this, null, function* () {
      const result = yield this.connectedUserService.doEmailLogin(value.email, value.password);
      if (result.isFailure()) {
        this.errorMessage = result.getReason();
      }
    });
  }
  loginWithGoogle() {
    return __async(this, null, function* () {
      const result = yield this.connectedUserService.doGoogleLogin();
      if (result.isFailure()) {
        this.errorMessage = result.getReason();
      }
    });
  }
  redirect() {
    return __async(this, null, function* () {
      return this.router.navigate(["/lobby"]);
    });
  }
  canLogin() {
    const email = this.loginForm.value.email ?? "";
    const password = this.loginForm.value.password ?? "";
    if (email === "" || password === "") {
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 49, vars: 8, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_0 = goog.getMsg("Email");
      i18n_0 = MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Email`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_1 = goog.getMsg("Password");
      i18n_1 = MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Password`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_2 = goog.getMsg("Log in");
      i18n_2 = MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Log in`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_3 = goog.getMsg("Email");
      i18n_3 = MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Email`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_4 = goog.getMsg("Password");
      i18n_4 = MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`Password`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_5 = goog.getMsg("Log in");
      i18n_5 = MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Log in`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_4917036382252417719$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_6 = goog.getMsg("Log in with Google");
      i18n_6 = MSG_EXTERNAL_4917036382252417719$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Log in with Google`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_850080272338290812$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_7 = goog.getMsg("No account?");
      i18n_7 = MSG_EXTERNAL_850080272338290812$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`No account?`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_3301086086650990787$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_8 = goog.getMsg("Register");
      i18n_8 = MSG_EXTERNAL_3301086086650990787$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`Register`;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_2012659005494284050$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_9 = goog.getMsg("Forgot your password?");
      i18n_9 = MSG_EXTERNAL_2012659005494284050$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`Forgot your password?`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_4371680625121499898$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_10 = goog.getMsg("Reset your password");
      i18n_10 = MSG_EXTERNAL_4371680625121499898$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`Reset your password`;
    }
    let i18n_11;
    if (false) {
      const MSG_EXTERNAL_77522255637065336$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_11 = goog.getMsg("Connection error");
      i18n_11 = MSG_EXTERNAL_77522255637065336$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_LOGIN_LOGIN_COMPONENT_TS_11;
    } else {
      i18n_11 = $localize`Connection error`;
    }
    return [i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, i18n_9, i18n_10, i18n_11, [1, "box"], [1, "title"], [3, "formGroup"], [1, "field", "is-horizontal"], [1, "field-label", "is-normal"], ["for", "email", 1, "label"], [1, "field-body"], [1, "field"], [1, "control"], ["id", "email", "type", "text", "placeholder", i18n_0, "formControlName", "email", "name", "email", "type", "email", "autofocus", "", "required", "", 1, "input"], ["for", "password", 1, "label"], [1, "control", "has-icons-right", "is-expanded"], ["id", "password", "type", "password", "placeholder", i18n_1, "formControlName", "password", "name", "password", "required", "", 1, "input"], [1, "icon", "is-small", "is-right"], ["toggleVisibility", "", 1, "clickable-icon", 3, "icon"], ["id", "loginButton", 1, "button", "is-primary", "is-fullwidth", 3, "click", "disabled"], ["id", "googleButton", "type", "submit", 1, "button", "is-fullwidth", 3, "click"], ["role", "alert", 1, "message", "is-danger"], [1, "help", "level-right"], [3, "routerLink"], [1, "message-header"], ["id", "errorMessage", 1, "message-body"]];
  }, template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 10)(1, "p", 11);
      \u0275\u0275i18n(2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "form", 12)(4, "div", 13)(5, "div", 14)(6, "label", 15);
      \u0275\u0275i18n(7, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 16)(9, "div", 17)(10, "div", 18);
      \u0275\u0275element(11, "input", 19);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(12, "div", 13)(13, "div", 14)(14, "label", 20);
      \u0275\u0275i18n(15, 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 16)(17, "div", 17)(18, "div", 21);
      \u0275\u0275element(19, "input", 22);
      \u0275\u0275elementStart(20, "span", 23);
      \u0275\u0275element(21, "fa-icon", 24);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(22, "div", 13);
      \u0275\u0275element(23, "div", 14);
      \u0275\u0275elementStart(24, "div", 16)(25, "div", 17)(26, "div", 18)(27, "button", 25);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_27_listener() {
        return ctx.loginWithEmail(ctx.loginForm.value);
      });
      \u0275\u0275i18n(28, 3);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(29, "div", 13);
      \u0275\u0275element(30, "div", 14);
      \u0275\u0275elementStart(31, "div", 16)(32, "div", 17)(33, "div", 18)(34, "button", 26);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_34_listener() {
        return ctx.loginWithGoogle();
      });
      \u0275\u0275i18n(35, 4);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275conditionalCreate(36, LoginComponent_Conditional_36_Template, 5, 1, "div", 27);
      \u0275\u0275elementStart(37, "p", 28);
      \u0275\u0275elementContainerStart(38);
      \u0275\u0275i18n(39, 5);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275text(40, "\xA0 ");
      \u0275\u0275elementStart(41, "a", 29);
      \u0275\u0275i18n(42, 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "p", 28);
      \u0275\u0275elementContainerStart(44);
      \u0275\u0275i18n(45, 7);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275text(46, "\xA0 ");
      \u0275\u0275elementStart(47, "a", 29);
      \u0275\u0275i18n(48, 8);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("formGroup", ctx.loginForm);
      \u0275\u0275advance(18);
      \u0275\u0275property("icon", ctx.faEye);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", !ctx.canLogin());
      \u0275\u0275advance(9);
      \u0275\u0275conditional(ctx.errorMessage ? 36 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(6, _c0));
      \u0275\u0275advance(6);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(7, _c1));
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName, AutofocusDirective, FaIconComponent, ToggleVisibilityDirective, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", imports: [ReactiveFormsModule, AutofocusDirective, FaIconComponent, ToggleVisibilityDirective, RouterLink], template: `<div class="box">
    <p class="title"
       i18n>Log in</p>
    <form [formGroup]="loginForm">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label"
                       for="email"
                       i18n>Email</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <input id="email"
                               class="input"
                               type="text"
                               i18n-placeholder
                               placeholder="Email"
                               formControlName="email"
                               name="email"
                               type="email"
                               autofocus
                               required/>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label"
                       for="password"
                       i18n>Password</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control has-icons-right is-expanded">
                        <input id="password"
                               class="input"
                               type="password"
                               i18n-placeholder
                               placeholder="Password"
                               formControlName="password"
                               name="password"
                               required/>
                        <span class="icon is-small is-right">
                            <fa-icon [icon]="faEye"
                                     class="clickable-icon"
                                     toggleVisibility></fa-icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal"></div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <button id="loginButton"
                                class="button is-primary is-fullwidth"
                                (click)="loginWithEmail(loginForm.value)"
                                [disabled]="!canLogin()"
                                i18n>Log in</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal"></div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <button id="googleButton"
                                class="button is-fullwidth"
                                type="submit"
                                (click)="loginWithGoogle()"
                                i18n>Log in with Google</button>
                    </div>
                </div>
            </div>
        </div>
        @if (errorMessage) {
            <div class="message is-danger"
                 role="alert">
                <div class="message-header"
                     i18n>Connection error</div>
                <div class="message-body"
                     id="errorMessage">{{ errorMessage }}</div>
            </div>
        }
        <p class="help level-right">
            <ng-container i18n>No account?</ng-container>&nbsp;
            <a [routerLink]="['/register']"
               i18n>Register</a>
        </p>
        <p class="help level-right">
            <ng-container i18n>Forgot your password?</ng-container>&nbsp;
            <a [routerLink]="['/reset-password']"
               i18n>Reset your password</a>
        </p>
    </form>
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/components/normal-component/login/login.component.ts", lineNumber: 19 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=login.component-CSCG3774.js.map
