import {
  AutofocusDirective
} from "./chunk-4NSDYNM6.js";
import {
  ConnectedUserService
} from "./chunk-2UAGI2IP.js";
import "./chunk-Y4TVVAIH.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  ReactiveFormsModule,
  RequiredValidator
} from "./chunk-CIU2KL3F.js";
import {
  MGPOptional,
  Utils
} from "./chunk-KI3WLQMB.js";
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵi18n,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XHN637UA.js";

// src/app/components/normal-component/reset-password/reset-password.component.ts
var _c0 = () => ({ standalone: true });
function ResetPasswordComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275i18n(1, 4);
    \u0275\u0275elementEnd();
  }
}
function ResetPasswordComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19);
    \u0275\u0275i18n(2, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 20);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage.get());
  }
}
var ResetPasswordComponent = class _ResetPasswordComponent {
  connectedUserService = inject(ConnectedUserService);
  success = false;
  errorMessage = MGPOptional.empty();
  email = "";
  resetPassword() {
    return __async(this, null, function* () {
      Utils.assert(this.email !== "", "No email was entered, but it should not be possible to submit the form then!");
      this.errorMessage = MGPOptional.empty();
      this.success = false;
      const result = yield this.connectedUserService.sendPasswordResetEmail(this.email);
      if (result.isSuccess()) {
        this.success = true;
      } else {
        this.errorMessage = MGPOptional.of(result.getReason());
      }
    });
  }
  static \u0275fac = function ResetPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResetPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResetPasswordComponent, selectors: [["app-reset-password"]], decls: 17, vars: 6, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_0 = goog.getMsg("Email");
      i18n_0 = MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Email`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_2565164139557117651$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_1 = goog.getMsg("Password reset");
      i18n_1 = MSG_EXTERNAL_2565164139557117651$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Password reset`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_2 = goog.getMsg("Email");
      i18n_2 = MSG_EXTERNAL_4768749765465246664$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Email`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_2687175749283802253$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_3 = goog.getMsg("An email will be sent with instruction to reset your password.");
      i18n_3 = MSG_EXTERNAL_2687175749283802253$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`An email will be sent with instruction to reset your password.`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_1636934520301910285$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_4 = goog.getMsg("Reset password");
      i18n_4 = MSG_EXTERNAL_1636934520301910285$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`Reset password`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_6808826847039952270$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_5 = goog.getMsg("The email has been sent, please follow the instructions from that email.");
      i18n_5 = MSG_EXTERNAL_6808826847039952270$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`The email has been sent, please follow the instructions from that email.`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_1519954996184640001$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_6 = goog.getMsg("Error");
      i18n_6 = MSG_EXTERNAL_1519954996184640001$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_RESET_PASSWORD_RESET_PASSWORD_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Error`;
    }
    return [i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, [1, "box"], [1, "title"], [1, "field", "is-horizontal"], [1, "field-label", "is-normal"], ["for", "email", 1, "label"], [1, "field-body"], [1, "field"], [1, "control"], ["id", "email", "name", "email", "placeholder", i18n_0, "type", "email", "autofocus", "", "required", "", 1, "input", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "help"], ["id", "successMessage", 1, "help", "is-success"], ["id", "resetPasswordButton", 1, "button", "is-primary", "is-fullwidth", "block", 3, "click", "disabled"], ["role", "alert", 1, "message", "is-danger", "is-fullwidth"], [1, "message-header"], ["id", "errorMessage", 1, "message-body"]];
  }, template: function ResetPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 6)(1, "p", 7);
      \u0275\u0275i18n(2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 8)(4, "div", 9)(5, "label", 10);
      \u0275\u0275i18n(6, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 11)(8, "div", 12)(9, "div", 13)(10, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function ResetPasswordComponent_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p", 15);
      \u0275\u0275i18n(12, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(13, ResetPasswordComponent_Conditional_13_Template, 2, 0, "p", 16);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(14, "button", 17);
      \u0275\u0275listener("click", function ResetPasswordComponent_Template_button_click_14_listener() {
        return ctx.resetPassword();
      });
      \u0275\u0275i18n(15, 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(16, ResetPasswordComponent_Conditional_16_Template, 5, 1, "div", 18);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
      \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(5, _c0));
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.success ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.email === "");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.errorMessage.isPresent() ? 16 : -1);
    }
  }, dependencies: [ReactiveFormsModule, DefaultValueAccessor, NgControlStatus, RequiredValidator, AutofocusDirective, FormsModule, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetPasswordComponent, [{
    type: Component,
    args: [{ selector: "app-reset-password", imports: [ReactiveFormsModule, AutofocusDirective, FormsModule], template: `<div class="box">
    <p class="title"
       i18n>Password reset</p>
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
                           name="email"
                           [(ngModel)]="email"
                           [ngModelOptions]="{standalone: true}"
                           i18n-placeholder
                           placeholder="Email"
                           type="email"
                           autofocus
                           required/>
                    <p class="help"
                       i18n>An email will be sent with instruction to reset your password.</p>
                    @if (success) {
                        <p id="successMessage"
                           class="help is-success"
                           i18n>The email has been sent, please follow the instructions from that email.</p>
                    }
                </div>
            </div>
        </div>
    </div>
    <button id="resetPasswordButton"
            class="button is-primary is-fullwidth block"
            (click)="resetPassword()"
            [disabled]="email === ''"
            i18n>Reset password</button>
    @if (errorMessage.isPresent()) {
        <div class="message is-danger is-fullwidth"
             role="alert">
            <div class="message-header"
                 i18n>Error</div>
            <div id="errorMessage"
                 class="message-body">{{ errorMessage.get() }}</div>
        </div>
    }
</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResetPasswordComponent, { className: "ResetPasswordComponent", filePath: "src/app/components/normal-component/reset-password/reset-password.component.ts", lineNumber: 14 });
})();
export {
  ResetPasswordComponent
};
//# sourceMappingURL=reset-password.component-M4R3V3TW.js.map
