import {
  DemoCardWrapperComponent
} from "./chunk-HZDSVAMR.js";
import "./chunk-F7TXPG54.js";
import "./chunk-KFBG3L4Y.js";
import "./chunk-RCK4B5LT.js";
import {
  GameInfo,
  GameNode
} from "./chunk-RF4KHUBP.js";
import "./chunk-4HQW7IWY.js";
import "./chunk-5NDDVV6Y.js";
import "./chunk-MC3HRXVP.js";
import "./chunk-4D3V7D3R.js";
import "./chunk-NCTOIZLG.js";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  RangeValueAccessor,
  ReactiveFormsModule,
  ɵNgNoValidate
} from "./chunk-DR33J2Q3.js";
import {
  MGPOptional
} from "./chunk-KTC3UZQD.js";
import "./chunk-EAKNFFYB.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵi18n,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-AC6ULWDE.js";

// src/app/components/normal-component/demo-page/demo-page.component.ts
var _forTrack0 = ($index, $item) => $item.name + "-" + $item.title;
function DemoPageComponent_For_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 8)(2, "p", 9);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 10)(5, "figure", 11);
    \u0275\u0275element(6, "app-demo-card", 12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const game_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(game_r1.title);
    \u0275\u0275advance(3);
    \u0275\u0275property("demoNodeInfo", game_r1);
  }
}
function DemoPageComponent_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275repeaterCreate(1, DemoPageComponent_For_11_For_2_Template, 7, 2, "div", 7, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(column_r2);
  }
}
var DemoPageComponent = class _DemoPageComponent {
  cdr = inject(ChangeDetectorRef);
  numberOfColumns = new FormControl(5);
  columns = [];
  constructor() {
    this.fillColumns(this.numberOfColumns.value);
    this.numberOfColumns.valueChanges.subscribe((columns) => {
      this.fillColumns(columns);
      this.cdr.detectChanges();
    });
  }
  fillColumns(numberOfColumns) {
    const demoNodes = this.getDemoNodes();
    let column = 0;
    let i = 0;
    this.columns = [];
    for (const node of demoNodes) {
      if (i < numberOfColumns) {
        this.columns.push([]);
      }
      this.columns[column].push(node);
      i++;
      column = (column + 1) % numberOfColumns;
    }
  }
  getDemoNodes() {
    const allGames = GameInfo.getAllGames();
    const demoNodes = [];
    for (const gameInfo of allGames) {
      const steps = gameInfo.tutorial.tutorial;
      const rules = gameInfo.rules;
      const defaultConfig = gameInfo.getRulesConfig();
      for (const step of steps) {
        const nodeFromStep = this.getNodeFromStep(step, rules, defaultConfig, gameInfo.urlName);
        demoNodes.push(nodeFromStep);
      }
    }
    return demoNodes;
  }
  getNodeFromStep(step, rules, defaultConfig, name) {
    const state = step.state;
    const stepConfig = step.config.getOrElse(defaultConfig);
    if (step.hasSolution()) {
      const solution = step.getSolution();
      if (typeof solution === "string") {
        return {
          node: new GameNode(state),
          config: stepConfig,
          click: MGPOptional.of(solution),
          title: step.title,
          name
        };
      } else {
        const move = solution;
        const legalityStatus = rules.isLegal(move, state, stepConfig);
        const resultingState = rules.applyLegalMove(move, state, stepConfig, legalityStatus.get());
        const parent = new GameNode(state);
        const node = new GameNode(resultingState, MGPOptional.of(parent), MGPOptional.of(move));
        return {
          node,
          config: stepConfig,
          click: MGPOptional.empty(),
          title: step.title,
          name
        };
      }
    } else {
      return {
        node: new GameNode(state),
        config: stepConfig,
        click: MGPOptional.empty(),
        title: step.title,
        name
      };
    }
  }
  static \u0275fac = function DemoPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DemoPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DemoPageComponent, selectors: [["app-demo-page"]], decls: 12, vars: 2, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_1735231057781616406$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_DEMO_PAGE_DEMO_PAGE_COMPONENT_TS_0 = goog.getMsg("Number of columns: ");
      i18n_0 = MSG_EXTERNAL_1735231057781616406$$SRC_APP_COMPONENTS_NORMAL_COMPONENT_DEMO_PAGE_DEMO_PAGE_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Number of columns: `;
    }
    return [i18n_0, [1, "field"], ["for", "numberOfColumns", 1, "label"], [1, "control"], ["step", "1", "min", "1", "max", "10", "type", "range", 1, "slider", "is-circle", "is-primary", 3, "formControl"], [1, "columns"], [1, "column"], [1, "card"], [1, "card-header"], [1, "card-header-title"], [1, "card-image", "game-card"], [1, "image"], [3, "demoNodeInfo"]];
  }, template: function DemoPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "form")(1, "div", 1)(2, "label", 2);
      \u0275\u0275elementContainerStart(3);
      \u0275\u0275i18n(4, 0);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementStart(5, "output");
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 3);
      \u0275\u0275element(8, "input", 4);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(9, "div", 5);
      \u0275\u0275repeaterCreate(10, DemoPageComponent_For_11_Template, 3, 0, "div", 6, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.numberOfColumns.value);
      \u0275\u0275advance(2);
      \u0275\u0275property("formControl", ctx.numberOfColumns);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.columns);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, RangeValueAccessor, NgControlStatus, NgControlStatusGroup, FormControlDirective, FormsModule, NgForm, DemoCardWrapperComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DemoPageComponent, [{
    type: Component,
    args: [{ selector: "app-demo-page", changeDetection: ChangeDetectionStrategy.OnPush, imports: [ReactiveFormsModule, FormsModule, DemoCardWrapperComponent], template: `<form>
    <div class="field">
        <label class="label"
               for="numberOfColumns">
            <ng-container i18n>Number of columns: </ng-container>
            <output>{{ numberOfColumns.value }}</output>
        </label>
        <div class="control">
            <input class="slider is-circle is-primary"
                   step="1"
                   min="1"
                   max="10"
                   [formControl]="numberOfColumns"
                   type="range">
        </div>
    </div>
</form>
<div class="columns">
    @for (column of columns; track $index) {
        <div class="column">
            @for (game of column; track game.name + '-' + game.title) {
                <div class="card">
                    <div class="card-header">
                        <p class="card-header-title">{{ game.title }}</p>
                    </div>
                    <div class="card-image game-card">
                        <figure class="image">
                            <app-demo-card [demoNodeInfo]="game"></app-demo-card>
                        </figure>
                    </div>
                </div>
            }
        </div>
    }
</div>
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DemoPageComponent, { className: "DemoPageComponent", filePath: "src/app/components/normal-component/demo-page/demo-page.component.ts", lineNumber: 22 });
})();
export {
  DemoPageComponent
};
//# sourceMappingURL=demo-page.component-6G6YM2TS.js.map
