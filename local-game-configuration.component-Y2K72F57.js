import {
  DemoCardWrapperComponent
} from "./chunk-GBTA7FBD.js";
import "./chunk-XTZNU4BO.js";
import {
  RulesConfigurationComponent
} from "./chunk-AKHUHDLZ.js";
import {
  BaseWrapperComponent
} from "./chunk-TAGMRNDS.js";
import {
  GameNode
} from "./chunk-Y6RVREXG.js";
import "./chunk-7JWLDCZD.js";
import "./chunk-DTAE6QI4.js";
import {
  Router
} from "./chunk-GUMZAMYX.js";
import "./chunk-HWRS2N2S.js";
import "./chunk-ASNDRGRI.js";
import "./chunk-OJTN7ELL.js";
import {
  MGPOptional,
  Utils,
  comparableEquals
} from "./chunk-VWERQGBR.js";
import "./chunk-XUYKWQYA.js";
import {
  ChangeDetectorRef,
  Component,
  __async,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵi18n,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-YYRXZMOY.js";

// src/app/components/wrapper-components/local-game-configuration/local-game-configuration.component.ts
function LocalGameConfigurationComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-demo-card", 11);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("demoNodeInfo", ctx_r0.getConfigDemo());
  }
}
var LocalGameConfigurationComponent = class _LocalGameConfigurationComponent extends BaseWrapperComponent {
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  configDemo;
  rulesConfig = MGPOptional.empty();
  setConfigDemo(config) {
    const stateProvider = this.getStateProvider();
    if (stateProvider.isPresent()) {
      const node = new GameNode(stateProvider.get()(MGPOptional.of(config)));
      this.configDemo = {
        title: this.getGameName().get(),
        click: MGPOptional.empty(),
        name: this.getGameUrlName(),
        node
      };
      this.cdr.detectChanges();
    }
  }
  getConfigDemo() {
    return this.configDemo;
  }
  updateConfig(rulesConfig) {
    return __async(this, null, function* () {
      this.rulesConfig = rulesConfig;
      if (rulesConfig.isPresent()) {
        this.setConfigDemo(rulesConfig.get());
        if (Object.keys(rulesConfig.get()).length === 0) {
          yield this.startGame();
        }
      }
    });
  }
  startGame() {
    return __async(this, null, function* () {
      Utils.assert(this.rulesConfig.isPresent(), "Cannot start the game without having chosen a config");
      const rulesConfig = this.rulesConfig.get();
      if (Object.keys(rulesConfig).length === 0) {
        return this.router.navigate(["/local", this.getGameUrlName()]);
      }
      const defaultConfig = this.getRulesConfigDescription().get().getDefaultConfig().config;
      if (comparableEquals(rulesConfig, defaultConfig)) {
        return this.router.navigate(["/local", this.getGameUrlName()]);
      } else {
        const queryParams = Object.fromEntries(Object.entries(rulesConfig).map((configElement) => {
          return [configElement[0], JSON.stringify(configElement[1])];
        }));
        return this.router.navigate(["/local", this.getGameUrlName()], { queryParams });
      }
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275LocalGameConfigurationComponent_BaseFactory;
    return function LocalGameConfigurationComponent_Factory(__ngFactoryType__) {
      return (\u0275LocalGameConfigurationComponent_BaseFactory || (\u0275LocalGameConfigurationComponent_BaseFactory = \u0275\u0275getInheritedFactory(_LocalGameConfigurationComponent)))(__ngFactoryType__ || _LocalGameConfigurationComponent);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LocalGameConfigurationComponent, selectors: [["app-local-game-configuration"]], features: [\u0275\u0275InheritDefinitionFeature], decls: 15, vars: 5, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_5171566373349249449$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_CONFIGURATION_LOCAL_GAME_CONFIGURATION_COMPONENT_TS_0 = goog.getMsg("Start with this configuration");
      i18n_0 = MSG_EXTERNAL_5171566373349249449$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_LOCAL_GAME_CONFIGURATION_LOCAL_GAME_CONFIGURATION_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Start with this configuration`;
    }
    return [i18n_0, [1, "columns", "is-vcentered", "is-align-items-stretch"], [1, "column"], [1, "box", "is-fullheight"], [1, "title"], ["id", "rules-config-component", 3, "updateCallback", "rulesConfigDescriptionOptional", "editable"], [1, "field", "is-horizontal"], [1, "field-body"], [1, "field"], [1, "control"], ["id", "start-game-with-config", 1, "button", "is-primary", "is-fullwidth", "mt-2", 3, "click", "disabled"], ["id", "demo-card", 3, "demoNodeInfo"]];
  }, template: function LocalGameConfigurationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "p", 4);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "app-rules-configuration", 5);
      \u0275\u0275listener("updateCallback", function LocalGameConfigurationComponent_Template_app_rules_configuration_updateCallback_5_listener($event) {
        return ctx.updateConfig($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9)(10, "button", 10);
      \u0275\u0275listener("click", function LocalGameConfigurationComponent_Template_button_click_10_listener() {
        return ctx.startGame();
      });
      \u0275\u0275i18n(11, 0);
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(12, "div", 2)(13, "div", 3);
      \u0275\u0275conditionalCreate(14, LocalGameConfigurationComponent_Conditional_14_Template, 1, 1, "app-demo-card", 11);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.getGameName().getOrElse(""));
      \u0275\u0275advance();
      \u0275\u0275property("rulesConfigDescriptionOptional", ctx.getRulesConfigDescription())("editable", true);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", ctx.rulesConfig.isAbsent());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.getConfigDemo() !== void 0 ? 14 : -1);
    }
  }, dependencies: [RulesConfigurationComponent, DemoCardWrapperComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalGameConfigurationComponent, [{
    type: Component,
    args: [{ selector: "app-local-game-configuration", imports: [RulesConfigurationComponent, DemoCardWrapperComponent], template: `<div class="columns is-vcentered is-align-items-stretch">

    <div class="column">
        <div class="box is-fullheight">
            <p class="title">{{ getGameName().getOrElse('') }}</p>
            <app-rules-configuration id="rules-config-component"
                                     [rulesConfigDescriptionOptional]="getRulesConfigDescription()"
                                     [editable]="true"
                                     (updateCallback)="updateConfig($event)">
            </app-rules-configuration>

            <div class="field is-horizontal">
                <div class="field-body">
                    <div class="field">
                        <div class="control">
                            <button id="start-game-with-config"
                                    class="button is-primary is-fullwidth mt-2"
                                    [disabled]="rulesConfig.isAbsent()"
                                    (click)="startGame()"
                                    i18n>Start with this configuration</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="column">
        <div class="box is-fullheight">
            @if (getConfigDemo() !== undefined) {
                <app-demo-card id="demo-card"
                               [demoNodeInfo]="getConfigDemo()"></app-demo-card>
            }
        </div>
    </div>

</div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LocalGameConfigurationComponent, { className: "LocalGameConfigurationComponent", filePath: "src/app/components/wrapper-components/local-game-configuration/local-game-configuration.component.ts", lineNumber: 24 });
})();
export {
  LocalGameConfigurationComponent
};
//# sourceMappingURL=local-game-configuration.component-Y2K72F57.js.map
