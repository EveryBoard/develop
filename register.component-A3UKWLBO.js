import {
  ToggleVisibilityDirective
} from "./chunk-ZH4GPEZQ.js";
import {
  FaIconComponent,
  faEye
} from "./chunk-DTAE6QI4.js";
import {
  Router,
  RouterLink
} from "./chunk-GUMZAMYX.js";
import {
  ConnectedUserService
} from "./chunk-MKTESROA.js";
import {
  AutofocusDirective
} from "./chunk-HWRS2N2S.js";
import "./chunk-ASNDRGRI.js";
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
} from "./chunk-OJTN7ELL.js";
import "./chunk-VWERQGBR.js";
import {
  NgClass
} from "./chunk-XUYKWQYA.js";
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
} from "./chunk-YYRXZMOY.js";

// src/app/components/normal-component/register/register.component.ts
var _c0 = () => ["/login"];
function RegisterComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 36);
    \u0275\u0275i18n(2, 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 37);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
var RegisterComponent = class _RegisterComponent {
  connectedUserService = inject(ConnectedUserService);
  router = inject(Router);
  faEye = faEye;
  errorMessage;
  registrationForm = new FormGroup({
    email: new FormControl(),
    username: new FormControl(),
    password: new FormControl()
  });
  registerWithEmail() {
    return __async(this, null, function* () {
      const username = this.registrationForm.value.username;
      const email = this.registrationForm.value.email;
      const password = this.registrationForm.value.password;
      if (username == null || email == null || password == null) {
        this.errorMessage = $localize`There are missing fields in the registration form, please check that you filled in all fields.`;
      } else {
        const registrationResult = yield this.connectedUserService.doRegister(username, email, password);
        if (registrationResult.isSuccess()) {
          const emailResult = yield this.connectedUserService.sendEmailVerification();
          if (emailResult.isSuccess()) {
            yield this.router.navigate(["/verify-account"]);
          } else {
            this.errorMessage = emailResult.getReason();
          }
        } else {
          this.errorMessage = registrationResult.getReason();
        }
      }
    });
  }
  registerWithGoogle() {
    return __async(this, null, function* () {
      const result = yield this.connectedUserService.doGoogleLogin();
      if (result.isSuccess()) {
        yield this.router.navigate(["/verify-account"]);
      } else {
        this.errorMessage = result.getReason();
      }
    });
  }
  getPasswordHelpClass() {
    const password = this.registrationForm.value.password;
    if (password == null || password === "") {
      return "";
    }
    if (password.length < 6) {
      return "is-danger";
    }
    return "is-success";
  }
  canRegister() {
    const password = this.registrationForm.value.password ?? "";
    const email = this.registrationForm.value.email ?? "";
    const username = this.registrationForm.value.username ?? "";
    if (email === "" || username === "" || password === "" || password.length < 6) {
      return false;
    }
    return true;
  }
  static \u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegisterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], decls: 55, vars: 7, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_0 = goog.getMsg("Email");
      i18n_0 = MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Email`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_5248717555542428023$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_1 = goog.getMsg("Username");
      i18n_1 = MSG_EXTERNAL_5248717555542428023$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Username`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_2 = goog.getMsg("Password");
      i18n_2 = MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Password`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_2218572265318708454$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_3 = goog.getMsg("Registering");
      i18n_3 = MSG_EXTERNAL_2218572265318708454$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Registering`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_4 = goog.getMsg("Email");
      i18n_4 = MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`Email`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_9018459935889527317$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_5 = goog.getMsg("A confirmation email will be sent to validate your account.");
      i18n_5 = MSG_EXTERNAL_9018459935889527317$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`A confirmation email will be sent to validate your account.`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_5248717555542428023$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_6 = goog.getMsg("Username");
      i18n_6 = MSG_EXTERNAL_5248717555542428023$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Username`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_7 = goog.getMsg("Password");
      i18n_7 = MSG_EXTERNAL_1431416938026210429$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Password`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_8783355485855708287$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_8 = goog.getMsg("The password should be at least 6 characters long");
      i18n_8 = MSG_EXTERNAL_8783355485855708287$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`The password should be at least 6 characters long`;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_3301086086650990787$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_9 = goog.getMsg("Register");
      i18n_9 = MSG_EXTERNAL_3301086086650990787$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`Register`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_3204200407244124341$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_10 = goog.getMsg("Register with Google");
      i18n_10 = MSG_EXTERNAL_3204200407244124341$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`Register with Google`;
    }
    let i18n_11;
    if (false) {
      const MSG_EXTERNAL_3412247232926911550$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_11 = goog.getMsg("Have an account?");
      i18n_11 = MSG_EXTERNAL_3412247232926911550$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_11;
    } else {
      i18n_11 = $localize`Have an account?`;
    }
    let i18n_12;
    if (false) {
      const MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_12 = goog.getMsg("Log in");
      i18n_12 = MSG_EXTERNAL_2336550011721758066$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_12;
    } else {
      i18n_12 = $localize`Log in`;
    }
    let i18n_13;
    if (false) {
      const MSG_EXTERNAL_6535780676661833462$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_13 = goog.getMsg("Registration error");
      i18n_13 = MSG_EXTERNAL_6535780676661833462$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_REGISTER_REGISTER_COMPONENT_TS_13;
    } else {
      i18n_13 = $localize`Registration error`;
    }
    return [i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, i18n_9, i18n_10, i18n_11, i18n_12, i18n_13, [1, "box"], [1, "title"], [3, "formGroup"], [1, "field", "is-horizontal"], [1, "field-label", "is-normal"], ["for", "email", 1, "label"], [1, "field-body"], [1, "field"], [1, "control"], ["id", "email", "formControlName", "email", "name", "email", "placeholder", i18n_0, "type", "email", "autofocus", "", "required", "", 1, "input"], [1, "help"], ["for", "username", 1, "label"], ["id", "username", "formControlName", "username", "name", "username", "placeholder", i18n_1, "type", "text", "required", "", 1, "input"], ["for", "password", 1, "label"], [1, "control", "has-icons-right", "is-expanded"], ["id", "password", "formControlName", "password", "name", "password", "placeholder", i18n_2, "type", "password", "required", "", 1, "input"], [1, "icon", "is-small", "is-right"], ["toggleVisibility", "", 1, "clickable-icon", 3, "icon"], ["id", "passwordHelp", 1, "help", 3, "ngClass"], ["id", "registerButton", 1, "button", "is-primary", "is-fullwidth", 3, "click", "disabled"], [1, "field-body", "is-fullwidth"], ["role", "alert", 1, "message", "is-danger", "is-fullwidth"], ["id", "googleButton", "type", "submit", 1, "button", "is-fullwidth", 3, "click"], [1, "help", "level-right"], [3, "routerLink"], [1, "message-header"], ["id", "errorMessage", 1, "message-body"]];
  }, template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 11)(1, "p", 12);
      \u0275\u0275i18n(2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "form", 13)(4, "div", 14)(5, "div", 15)(6, "label", 16);
      \u0275\u0275i18n(7, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 17)(9, "div", 18)(10, "div", 19);
      \u0275\u0275element(11, "input", 20);
      \u0275\u0275elementStart(12, "p", 21);
      \u0275\u0275i18n(13, 2);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(14, "div", 14)(15, "div", 15)(16, "label", 22);
      \u0275\u0275i18n(17, 3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 17)(19, "div", 18)(20, "div", 19);
      \u0275\u0275element(21, "input", 23);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "div", 14)(23, "div", 15)(24, "label", 24);
      \u0275\u0275i18n(25, 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 17)(27, "div", 18)(28, "div", 25);
      \u0275\u0275element(29, "input", 26);
      \u0275\u0275elementStart(30, "span", 27);
      \u0275\u0275element(31, "fa-icon", 28);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p", 29);
      \u0275\u0275i18n(33, 5);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(34, "div", 14);
      \u0275\u0275element(35, "div", 15);
      \u0275\u0275elementStart(36, "div", 17)(37, "div", 18)(38, "div", 19)(39, "button", 30);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_39_listener() {
        return ctx.registerWithEmail();
      });
      \u0275\u0275i18n(40, 6);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(41, "div", 14);
      \u0275\u0275element(42, "div", 15);
      \u0275\u0275elementStart(43, "div", 31);
      \u0275\u0275conditionalCreate(44, RegisterComponent_Conditional_44_Template, 5, 1, "div", 32);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 14);
      \u0275\u0275element(46, "div", 15);
      \u0275\u0275elementStart(47, "div", 17)(48, "button", 33);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_48_listener() {
        return ctx.registerWithGoogle();
      });
      \u0275\u0275i18n(49, 7);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(50, "p", 34);
      \u0275\u0275elementContainerStart(51);
      \u0275\u0275i18n(52, 8);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementStart(53, "a", 35);
      \u0275\u0275i18n(54, 9);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("formGroup", ctx.registrationForm);
      \u0275\u0275advance(28);
      \u0275\u0275property("icon", ctx.faEye);
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", ctx.getPasswordHelpClass());
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", !ctx.canRegister());
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.errorMessage ? 44 : -1);
      \u0275\u0275advance(9);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(6, _c0));
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName, AutofocusDirective, FaIconComponent, ToggleVisibilityDirective, NgClass, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterComponent, [{
    type: Component,
    args: [{ selector: "app-register", imports: [ReactiveFormsModule, AutofocusDirective, FaIconComponent, ToggleVisibilityDirective, NgClass, RouterLink], template: `<div class="box">
    <p class="title"
       i18n>Registering</p>
    <form [formGroup]="registrationForm">
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
                               formControlName="email"
                               name="email"
                               i18n-placeholder
                               placeholder="Email"
                               type="email"
                               autofocus
                               required/>
                        <p class="help"
                           i18n>A confirmation email will be sent to validate your account.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label"
                       for="username"
                       i18n>Username</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <input id="username"
                               class="input"
                               formControlName="username"
                               name="username"
                               i18n-placeholder
                               placeholder="Username"
                               type="text"
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
                               formControlName="password"
                               name="password"
                               i18n-placeholder
                               placeholder="Password"
                               type="password"
                               required/>
                        <span class="icon is-small is-right">
                            <fa-icon [icon]="faEye"
                                     class="clickable-icon"
                                     toggleVisibility></fa-icon>
                        </span>
                        <p id="passwordHelp"
                           class="help"
                           [ngClass]="getPasswordHelpClass()"
                           i18n>The password should be at least 6 characters long</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal"></div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <button id="registerButton"
                                class="button is-primary is-fullwidth"
                                (click)="registerWithEmail()"
                                [disabled]="!canRegister()"
                                i18n>Register</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal"></div>
            <div class="field-body is-fullwidth">
                @if (errorMessage) {
                    <div class="message is-danger is-fullwidth"
                         role="alert">
                        <div class="message-header"
                             i18n>Registration error</div>
                        <div id="errorMessage"
                             class="message-body">{{ errorMessage }}</div>
                    </div>
                }
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal"></div>
            <div class="field-body">
                <button id="googleButton"
                        class="button is-fullwidth"
                        type="submit"
                        (click)="registerWithGoogle()"
                        i18n>Register with Google</button>
            </div>
        </div>
        <p class="help level-right">
            <ng-container i18n>Have an account?</ng-container>
            <a [routerLink]="['/login']"
               i18n>Log in</a>
        </p>
    </form>
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src/app/components/normal-component/register/register.component.ts", lineNumber: 20 });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=register.component-A3UKWLBO.js.map
