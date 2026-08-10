import {
  DemoCardWrapperComponent
} from "./chunk-INOMGJLE.js";
import "./chunk-X3SKXGUG.js";
import {
  RulesConfigurationComponent,
  ViewConfigComponent
} from "./chunk-Y7DJQ77X.js";
import {
  BaseWrapperComponent,
  GameWrapper,
  GameWrapperMessages
} from "./chunk-WRBXPLKP.js";
import {
  ConfigRoomService
} from "./chunk-HBBH2Y2X.js";
import {
  GameService
} from "./chunk-GUQ34RTS.js";
import {
  ChatComponent,
  EloComponent,
  FirstPlayer,
  GameDuration,
  GameType,
  Status
} from "./chunk-4JEG2DLE.js";
import "./chunk-KDJSPPLR.js";
import "./chunk-NRQGL3YK.js";
import {
  GameInfo,
  GameNode,
  MessageDisplayer,
  Player,
  PlayerNumberMap,
  PlayerOrNone
} from "./chunk-PQXFXFT5.js";
import "./chunk-4HQW7IWY.js";
import {
  FaIconComponent,
  faBackwardStep,
  faFlag,
  faRepeat
} from "./chunk-5NDDVV6Y.js";
import {
  Router,
  RouterLink
} from "./chunk-MC3HRXVP.js";
import {
  AuthUser,
  ConnectedUserService
} from "./chunk-RWYRC6Z5.js";
import "./chunk-4D3V7D3R.js";
import {
  Debug
} from "./chunk-7IUA2OKB.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  RangeValueAccessor,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-DR33J2Q3.js";
import {
  MGPOptional,
  MGPValidation,
  Set,
  Utils
} from "./chunk-KTC3UZQD.js";
import {
  DecimalPipe,
  NgClass
} from "./chunk-EAKNFFYB.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  Input,
  Output,
  Pipe,
  Subject,
  Subscription,
  ViewChild,
  __async,
  __publicField,
  __superGet,
  inject,
  input,
  output,
  setClassMetadata,
  takeUntil,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵi18n,
  ɵɵi18nApply,
  ɵɵi18nEnd,
  ɵɵi18nExp,
  ɵɵi18nStart,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuerySignal
} from "./chunk-AC6ULWDE.js";

// node_modules/async-mutex/index.mjs
var E_TIMEOUT = new Error("timeout while waiting for mutex to become available");
var E_ALREADY_LOCKED = new Error("mutex already locked");
var E_CANCELED = new Error("request for lock canceled");
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Semaphore = class {
  constructor(_value, _cancelError = E_CANCELED) {
    this._value = _value;
    this._cancelError = _cancelError;
    this._queue = [];
    this._weightedWaiters = [];
  }
  acquire(weight = 1, priority = 0) {
    if (weight <= 0)
      throw new Error(`invalid weight ${weight}: must be positive`);
    return new Promise((resolve, reject) => {
      const task = { resolve, reject, weight, priority };
      const i = findIndexFromEnd(this._queue, (other) => priority <= other.priority);
      if (i === -1 && weight <= this._value) {
        this._dispatchItem(task);
      } else {
        this._queue.splice(i + 1, 0, task);
      }
    });
  }
  runExclusive(callback_1) {
    return __awaiter$2(this, arguments, void 0, function* (callback, weight = 1, priority = 0) {
      const [value, release] = yield this.acquire(weight, priority);
      try {
        return yield callback(value);
      } finally {
        release();
      }
    });
  }
  waitForUnlock(weight = 1, priority = 0) {
    if (weight <= 0)
      throw new Error(`invalid weight ${weight}: must be positive`);
    if (this._couldLockImmediately(weight, priority)) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        if (!this._weightedWaiters[weight - 1])
          this._weightedWaiters[weight - 1] = [];
        insertSorted(this._weightedWaiters[weight - 1], { resolve, priority });
      });
    }
  }
  isLocked() {
    return this._value <= 0;
  }
  getValue() {
    return this._value;
  }
  setValue(value) {
    this._value = value;
    this._dispatchQueue();
  }
  release(weight = 1) {
    if (weight <= 0)
      throw new Error(`invalid weight ${weight}: must be positive`);
    this._value += weight;
    this._dispatchQueue();
  }
  cancel() {
    this._queue.forEach((entry) => entry.reject(this._cancelError));
    this._queue = [];
  }
  _dispatchQueue() {
    this._drainUnlockWaiters();
    while (this._queue.length > 0 && this._queue[0].weight <= this._value) {
      this._dispatchItem(this._queue.shift());
      this._drainUnlockWaiters();
    }
  }
  _dispatchItem(item) {
    const previousValue = this._value;
    this._value -= item.weight;
    item.resolve([previousValue, this._newReleaser(item.weight)]);
  }
  _newReleaser(weight) {
    let called = false;
    return () => {
      if (called)
        return;
      called = true;
      this.release(weight);
    };
  }
  _drainUnlockWaiters() {
    if (this._queue.length === 0) {
      for (let weight = this._value; weight > 0; weight--) {
        const waiters = this._weightedWaiters[weight - 1];
        if (!waiters)
          continue;
        waiters.forEach((waiter) => waiter.resolve());
        this._weightedWaiters[weight - 1] = [];
      }
    } else {
      const queuedPriority = this._queue[0].priority;
      for (let weight = this._value; weight > 0; weight--) {
        const waiters = this._weightedWaiters[weight - 1];
        if (!waiters)
          continue;
        const i = waiters.findIndex((waiter) => waiter.priority <= queuedPriority);
        (i === -1 ? waiters : waiters.splice(0, i)).forEach(((waiter) => waiter.resolve()));
      }
    }
  }
  _couldLockImmediately(weight, priority) {
    return (this._queue.length === 0 || this._queue[0].priority < priority) && weight <= this._value;
  }
};
function insertSorted(a, v) {
  const i = findIndexFromEnd(a, (other) => v.priority <= other.priority);
  a.splice(i + 1, 0, v);
}
function findIndexFromEnd(a, predicate) {
  for (let i = a.length - 1; i >= 0; i--) {
    if (predicate(a[i])) {
      return i;
    }
  }
  return -1;
}
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Mutex = class {
  constructor(cancelError) {
    this._semaphore = new Semaphore(1, cancelError);
  }
  acquire() {
    return __awaiter$1(this, arguments, void 0, function* (priority = 0) {
      const [, releaser] = yield this._semaphore.acquire(1, priority);
      return releaser;
    });
  }
  runExclusive(callback, priority = 0) {
    return this._semaphore.runExclusive(() => callback(), 1, priority);
  }
  isLocked() {
    return this._semaphore.isLocked();
  }
  waitForUnlock(priority = 0) {
    return this._semaphore.waitForUnlock(1, priority);
  }
  release() {
    if (this._semaphore.isLocked())
      this._semaphore.release();
  }
  cancel() {
    return this._semaphore.cancel();
  }
};

// src/app/components/normal-component/timer/timer.component.ts
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TimerComponent_1;
function TimerComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "button", 3);
    \u0275\u0275listener("click", function TimerComponent_Conditional_5_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addTime());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 4);
    \u0275\u0275element(3, "path", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.player().getHTMLClass("-bg-darker"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" \xA0", ctx_r1.timeToAdd());
  }
}
var _a;
var TimerComponent = (_a = class {
  cdr = inject(ChangeDetectorRef);
  player = input.required(...ngDevMode ? [{ debugName: "player" }] : []);
  debugName = input.required(...ngDevMode ? [{ debugName: "debugName" }] : []);
  timeToAdd = input.required(...ngDevMode ? [{ debugName: "timeToAdd" }] : []);
  dangerTimeLimit = input.required(...ngDevMode ? [{ debugName: "dangerTimeLimit" }] : []);
  active = input.required(...ngDevMode ? [{ debugName: "active" }] : []);
  canAddTime = input.required(...ngDevMode ? [{ debugName: "canAddTime" }] : []);
  remainingSeconds;
  displayedSec;
  displayedMinute;
  timeoutHandle = null;
  updateHandle = null;
  isPaused = true;
  isSet = false;
  started = false;
  startTime;
  outOfTimeAction = output();
  addTimeToOpponent = output();
  cssClasses = TimerComponent_1.SAFE_TIME;
  // Set the duration (in seconds, floating number) for a non-started timer
  setDuration(seconds) {
    Utils.assert(this.started === false, "Should not set a timer that has already been started (" + this.debugName() + ")!");
    this.isSet = true;
    this.changeDuration(seconds);
  }
  changeDuration(seconds) {
    Utils.assert(this.isPaused, "Should not change duration of a clock while it is running");
    this.remainingSeconds = seconds;
    this.displayDuration();
  }
  subtract(seconds) {
    this.changeDuration(this.remainingSeconds - seconds);
  }
  displayDuration() {
    this.displayedSec = Math.floor(this.remainingSeconds % 60);
    this.displayedMinute = Math.floor((this.remainingSeconds - this.displayedSec) / 60);
    this.cdr.detectChanges();
  }
  start() {
    Utils.assert(this.isSet, "Should not start a timer that has not been set!");
    Utils.assert(this.started === false, "Should not start timer that has already been started (" + this.debugName() + ")");
    this.started = true;
    this.resume();
  }
  resume() {
    Utils.assert(this.isPaused && this.started, "Should only resume timers that are started and paused!");
    this.startTime = Date.now() / 1e3;
    const remainingTimeOnResume = this.remainingSeconds;
    this.isPaused = false;
    this.timeoutHandle = setTimeout(() => {
      this.onEndReached();
    }, remainingTimeOnResume * 1e3);
    this.countSeconds();
  }
  onEndReached() {
    this.isPaused = true;
    this.started = false;
    this.clearTimeouts();
    this.changeDuration(0);
    this.outOfTimeAction.emit();
  }
  countSeconds() {
    this.updateHandle = setTimeout(() => {
      this.updateShownTime();
    }, 300);
  }
  isIdle() {
    const isUnstarted = this.started === false;
    return isUnstarted || this.isPaused;
  }
  pause() {
    const debugName = this.debugName();
    Utils.assert(this.started, "Should not pause not started timer (" + debugName + ")");
    Utils.assert(this.isPaused === false, "Should not pause already paused timer (" + debugName + ")");
    this.clearTimeouts();
    this.isPaused = true;
    this.updateShownTime();
  }
  stop() {
    Utils.assert(this.started, "Should only stop timer that are started!");
    if (this.isPaused === false) {
      this.pause();
    }
    this.started = false;
    this.isSet = false;
  }
  isStarted() {
    return this.started;
  }
  getTimeClass() {
    if (this.active() === false) {
      return TimerComponent_1.PASSIVE_STYLE;
    }
    if (this.remainingSeconds < this.dangerTimeLimit()) {
      if (this.remainingSeconds % 2 < 1) {
        return TimerComponent_1.DANGER_TIME_ODD;
      } else {
        return TimerComponent_1.DANGER_TIME_EVEN;
      }
    } else {
      return TimerComponent_1.SAFE_TIME;
    }
  }
  updateShownTime() {
    const nowSeconds = Date.now() / 1e3;
    this.remainingSeconds -= nowSeconds - this.startTime;
    this.cssClasses = this.getTimeClass();
    this.startTime = nowSeconds;
    this.displayDuration();
    if (this.isPaused === false) {
      this.countSeconds();
    }
  }
  clearTimeouts() {
    if (this.updateHandle != null) {
      window.clearTimeout(this.updateHandle);
      this.updateHandle = null;
    }
    if (this.timeoutHandle != null) {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }
  addTime() {
    this.addTimeToOpponent.emit();
  }
  ngOnDestroy() {
    this.clearTimeouts();
  }
}, TimerComponent_1 = _a, __publicField(_a, "DANGER_TIME_EVEN", "has-background-danger has-text-white"), __publicField(_a, "DANGER_TIME_ODD", "has-background-warning has-text-white"), __publicField(_a, "PASSIVE_STYLE", "has-text-passive is-italic"), __publicField(_a, "SAFE_TIME", ""), __publicField(_a, "\u0275fac", function TimerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _a)();
}), __publicField(_a, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _a, selectors: [["app-timer"]], inputs: { player: [1, "player"], debugName: [1, "debugName"], timeToAdd: [1, "timeToAdd"], dangerTimeLimit: [1, "dangerTimeLimit"], active: [1, "active"], canAddTime: [1, "canAddTime"] }, outputs: { outOfTimeAction: "outOfTimeAction", addTimeToOpponent: "addTimeToOpponent" }, decls: 6, vars: 9, consts: [[1, "level", "columns", "is-gapless", 3, "ngClass"], [1, "level-item", "column"], [1, "is-size-3", "has-text-weight-bold", "data-remaining-time", 3, "ngClass"], [1, "button", "is-medium", "data-add-time", "has-text-black", "my-2", 2, "width", "6em", 3, "click", "ngClass"], ["viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "svg-inline-fa"], ["d", "M21.9208 13.265C21.9731 12.8507 22 12.4285 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.4354 22 12.8643 21.9722 13.285 21.9182M12 6V12L15.7384 13.8692M19 22V16M16 19H22", "stroke", "#000000", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"]], template: function TimerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, TimerComponent_Conditional_5_Template, 5, 2, "div", 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", ctx.getTimeClass())("ngClass", ctx.player().getHTMLClass("-bg"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx.player().getHTMLClass("-fg"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx.displayedMinute, ":", \u0275\u0275pipeBind2(4, 6, ctx.displayedSec, "2.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.canAddTime() ? 5 : -1);
  }
}, dependencies: [NgClass, DecimalPipe], encapsulation: 2, changeDetection: 0 })), _a);
TimerComponent = TimerComponent_1 = __decorate([
  Debug.log
], TimerComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TimerComponent, [{
    type: Component,
    args: [{ selector: "app-timer", changeDetection: ChangeDetectionStrategy.OnPush, imports: [NgClass, DecimalPipe], template: `<div [ngClass]="getTimeClass()"
     class="level columns is-gapless"
     [ngClass]="player().getHTMLClass('-bg')">
    <div class="level-item column">
        <span class="is-size-3 has-text-weight-bold data-remaining-time"
              [ngClass]="player().getHTMLClass('-fg')">
            {{ displayedMinute }}:{{ displayedSec | number:'2.0-0' }}
        </span>
    </div>
    @if (canAddTime()) {
        <div class="level-item column">
            <button class="button is-medium data-add-time has-text-black my-2"
                    [ngClass]="player().getHTMLClass('-bg-darker')"
                    style="width: 6em"
                    (click)="addTime()">
                <svg class="svg-inline-fa"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"><path d="M21.9208 13.265C21.9731 12.8507 22 12.4285 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.4354 22 12.8643 21.9722 13.285 21.9182M12 6V12L15.7384 13.8692M19 22V16M16 19H22" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                &nbsp;{{ timeToAdd() }}</button>
            </div>
        }
    </div>
` }]
  }], null, { player: [{ type: Input, args: [{ isSignal: true, alias: "player", required: true }] }], debugName: [{ type: Input, args: [{ isSignal: true, alias: "debugName", required: true }] }], timeToAdd: [{ type: Input, args: [{ isSignal: true, alias: "timeToAdd", required: true }] }], dangerTimeLimit: [{ type: Input, args: [{ isSignal: true, alias: "dangerTimeLimit", required: true }] }], active: [{ type: Input, args: [{ isSignal: true, alias: "active", required: true }] }], canAddTime: [{ type: Input, args: [{ isSignal: true, alias: "canAddTime", required: true }] }], outOfTimeAction: [{ type: Output, args: ["outOfTimeAction"] }], addTimeToOpponent: [{ type: Output, args: ["addTimeToOpponent"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TimerComponent, { className: "TimerComponent", filePath: "src/app/components/normal-component/timer/timer.component.ts", lineNumber: 16 });
})();

// src/app/pipes-and-directives/human-duration.pipe.ts
var HumanDurationPipe = class _HumanDurationPipe {
  transform(duration) {
    const seconds = duration % 60;
    const minutes = (duration - seconds) % 3600 / 60;
    const hours = (duration - minutes * 60 - seconds) / 3600;
    const text = [];
    if (hours > 1) {
      text.push($localize`${hours} hours`);
    } else if (hours === 1) {
      text.push($localize`1 hour`);
    }
    if (minutes > 1) {
      text.push($localize`${minutes} minutes`);
    } else if (minutes === 1) {
      text.push($localize`1 minute`);
    }
    if (seconds > 1) {
      text.push($localize`${seconds} seconds`);
    } else if (seconds === 1) {
      text.push($localize`1 second`);
    }
    if (text.length === 0) {
      return $localize`0 seconds`;
    } else if (text.length === 1) {
      return text[0];
    } else {
      const first = text.slice(0, -1).join(", ");
      const second = text.slice(-1)[0];
      return $localize`${first} and ${second}`;
    }
  }
  static \u0275fac = function HumanDurationPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HumanDurationPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "humanDuration", type: _HumanDurationPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HumanDurationPipe, [{
    type: Pipe,
    args: [{ name: "humanDuration" }]
  }], null, null);
})();

// src/app/components/wrapper-components/game-creation/game-creation.component.ts
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _forTrack0 = ($index, $item) => $item.name;
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "div", 70)(2, "p");
    \u0275\u0275i18n(3, 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 64)(5, "div", 40)(6, "button", 71);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Conditional_11_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.goToLobby());
    });
    \u0275\u0275i18n(7, 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 40)(9, "button", 72);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Conditional_11_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.playLocally());
    });
    \u0275\u0275i18n(10, 16);
    \u0275\u0275elementEnd()()()()();
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_For_12_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 81);
    \u0275\u0275i18n(1, 20);
    \u0275\u0275elementEnd();
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 77);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_For_12_Template_tr_click_0_listener() {
      const candidate_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.selectOpponent(candidate_r5.name));
    });
    \u0275\u0275elementStart(1, "td", 78);
    \u0275\u0275text(2);
    \u0275\u0275element(3, "app-elo", 79);
    \u0275\u0275text(4, ")");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 80);
    \u0275\u0275conditionalCreate(6, GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_For_12_Conditional_6_Template, 2, 0, "button", 81);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const candidate_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("id", \u0275\u0275interpolate1("presenceOf_", candidate_r5.name))("ngClass", ctx_r2.viewInfo.candidateClasses[candidate_r5.name]);
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r2.viewInfo.chosenOpponent === candidate_r5.name ? "selected_" + candidate_r5.name : "candidate_" + candidate_r5.name);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", candidate_r5.name, " (");
    \u0275\u0275advance();
    \u0275\u0275property("elo", candidate_r5.elo);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.viewInfo.chosenOpponent !== candidate_r5.name ? 6 : -1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 17);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementStart(2, "div", 73)(3, "table", 74)(4, "thead")(5, "tr")(6, "th", 75);
    \u0275\u0275i18n(7, 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 75);
    \u0275\u0275i18n(9, 19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "tbody");
    \u0275\u0275repeaterCreate(11, GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_For_12_Template, 7, 7, "tr", 76, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r2.viewInfo.candidates);
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 21);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r2.viewInfo.chosenOpponent);
    \u0275\u0275i18nApply(1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 22);
    \u0275\u0275elementContainerEnd();
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61)(1, "div", 45)(2, "label", 82);
    \u0275\u0275elementContainerStart(3);
    \u0275\u0275i18n(4, 23);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementStart(5, "output");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "humanDuration");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 47);
    \u0275\u0275element(9, "input", 83);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 45)(11, "label", 84);
    \u0275\u0275i18nStart(12, 24);
    \u0275\u0275element(13, "output");
    \u0275\u0275pipe(14, "humanDuration");
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 47);
    \u0275\u0275element(16, "input", 85);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 2, ctx_r2.viewInfo.moveDuration || 0));
    \u0275\u0275advance(8);
    \u0275\u0275i18nExp(\u0275\u0275pipeBind1(14, 4, ctx_r2.viewInfo.gameDuration || 0));
    \u0275\u0275i18nApply(12);
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Conditional_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-demo-card", 69);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("demoNodeInfo", ctx_r2.getConfigDemo());
  }
}
function GameCreationComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 40)(2, "div", 41)(3, "h1", 42);
    \u0275\u0275i18n(4, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "form", 43)(6, "fieldset", 44)(7, "div", 45)(8, "label", 46);
    \u0275\u0275i18n(9, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 47);
    \u0275\u0275conditionalCreate(11, GameCreationComponent_Conditional_0_Conditional_1_Conditional_11_Template, 11, 0, "div", 48)(12, GameCreationComponent_Conditional_0_Conditional_1_Conditional_12_Template, 13, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 49)(14, "div", 40)(15, "button", 50);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectFirstPlayer(ctx_r2.FirstPlayer.RANDOM));
    });
    \u0275\u0275i18n(16, 2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 40)(18, "button", 51);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectFirstPlayer(ctx_r2.FirstPlayer.CREATOR));
    });
    \u0275\u0275i18n(19, 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 40)(21, "button", 52);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectFirstPlayer(ctx_r2.FirstPlayer.CHOSEN_OPPONENT));
    });
    \u0275\u0275conditionalCreate(22, GameCreationComponent_Conditional_0_Conditional_1_Conditional_22_Template, 2, 1, "ng-container")(23, GameCreationComponent_Conditional_0_Conditional_1_Conditional_23_Template, 2, 0, "ng-container");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 53)(25, "div", 40)(26, "div", 54);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_div_click_26_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectGameType(ctx_r2.GameType.STANDARD));
    });
    \u0275\u0275elementStart(27, "div", 55)(28, "span");
    \u0275\u0275i18n(29, 4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 56)(31, "div", 57)(32, "div", 58)(33, "p");
    \u0275\u0275elementContainerStart(34);
    \u0275\u0275i18n(35, 5);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementStart(36, "strong");
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "humanDuration");
    \u0275\u0275elementEnd();
    \u0275\u0275element(39, "br");
    \u0275\u0275elementContainerStart(40);
    \u0275\u0275i18nStart(41, 6);
    \u0275\u0275element(42, "strong");
    \u0275\u0275pipe(43, "humanDuration");
    \u0275\u0275i18nEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(44, "div", 40)(45, "div", 59);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_div_click_45_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectGameType(ctx_r2.GameType.BLITZ));
    });
    \u0275\u0275elementStart(46, "div", 55)(47, "span");
    \u0275\u0275i18n(48, 7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 56)(50, "div", 57)(51, "div", 58)(52, "p");
    \u0275\u0275elementContainerStart(53);
    \u0275\u0275i18n(54, 8);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementStart(55, "strong");
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "humanDuration");
    \u0275\u0275elementEnd();
    \u0275\u0275element(58, "br");
    \u0275\u0275elementContainerStart(59);
    \u0275\u0275i18nStart(60, 9);
    \u0275\u0275element(61, "strong");
    \u0275\u0275pipe(62, "humanDuration");
    \u0275\u0275i18nEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(63, "div", 40)(64, "button", 60);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_64_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectGameType(ctx_r2.GameType.CUSTOM));
    });
    \u0275\u0275i18n(65, 10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(66, GameCreationComponent_Conditional_0_Conditional_1_Conditional_66_Template, 17, 6, "div", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "div", 62)(68, "app-rules-configuration", 63);
    \u0275\u0275listener("updateCallback", function GameCreationComponent_Conditional_0_Conditional_1_Template_app_rules_configuration_updateCallback_68_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onRulesConfigUpdate($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "div", 64)(70, "div", 40)(71, "button", 65);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_71_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.proposeConfig());
    });
    \u0275\u0275i18n(72, 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(73, "div", 40)(74, "button", 66);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_74_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.changeConfig());
    });
    \u0275\u0275i18n(75, 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div", 40)(77, "button", 67);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_1_Template_button_click_77_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cancelGameCreation());
    });
    \u0275\u0275i18n(78, 13);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(79, "div", 40)(80, "div", 68);
    \u0275\u0275conditionalCreate(81, GameCreationComponent_Conditional_0_Conditional_1_Conditional_81_Template, 1, 1, "app-demo-card", 69);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275i18nExp(ctx_r2.getGameName().getOrElse(""));
    \u0275\u0275i18nApply(4);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r2.configFormGroup);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r2.viewInfo.canEditConfig);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.viewInfo.candidates.length === 0 ? 11 : 12);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", ctx_r2.viewInfo.firstPlayerClasses[ctx_r2.FirstPlayer.RANDOM]);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r2.viewInfo.firstPlayerClasses[ctx_r2.FirstPlayer.CREATOR]);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r2.viewInfo.firstPlayerClasses[ctx_r2.FirstPlayer.CHOSEN_OPPONENT]);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.chosenOpponent ? 22 : 23);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", ctx_r2.viewInfo.gameTypeClasses[ctx_r2.GameType.STANDARD]);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 23, ctx_r2.GameDuration.STANDARD_MOVE_DURATION));
    \u0275\u0275advance(6);
    \u0275\u0275i18nExp(\u0275\u0275pipeBind1(43, 25, ctx_r2.GameDuration.STANDARD_GAME_DURATION));
    \u0275\u0275i18nApply(41);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.viewInfo.gameTypeClasses[ctx_r2.GameType.BLITZ]);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(57, 27, ctx_r2.GameDuration.BLITZ_MOVE_DURATION));
    \u0275\u0275advance(6);
    \u0275\u0275i18nExp(\u0275\u0275pipeBind1(62, 29, ctx_r2.GameDuration.BLITZ_GAME_DURATION));
    \u0275\u0275i18nApply(60);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.viewInfo.gameTypeClasses[ctx_r2.GameType.CUSTOM]);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.viewInfo.showCustomTime ? 66 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("rulesConfigDescription", ctx_r2.rulesConfigDescription())("creatorMode", true)("rulesConfigToDisplay", ctx_r2.getRulesConfigToDisplay())("editable", ctx_r2.viewInfo.canEditConfig || false);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !(ctx_r2.viewInfo.canProposeConfig && ctx_r2.rulesConfig.isPresent()));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r2.viewInfo.canReviewConfig === false);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r2.getConfigDemo() !== void 0 ? 81 : -1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 41)(2, "p", 42);
    \u0275\u0275i18n(3, 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275i18nStart(5, 26);
    \u0275\u0275element(6, "br");
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275i18nExp(ctx_r2.getGameName().getOrElse(""));
    \u0275\u0275i18nApply(3);
    \u0275\u0275advance(3);
    \u0275\u0275i18nExp(ctx_r2.viewInfo.creator);
    \u0275\u0275i18nApply(5);
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275i18n(1, 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r2.viewInfo.creator);
    \u0275\u0275i18nApply(1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275i18n(1, 33);
    \u0275\u0275elementEnd();
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275i18n(1, 34);
    \u0275\u0275elementEnd();
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-demo-card", 89);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("demoNodeInfo", ctx_r2.getConfigDemo());
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 40)(2, "div", 41)(3, "p", 42);
    \u0275\u0275i18n(4, 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 86)(6, "p");
    \u0275\u0275i18n(7, 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ul")(9, "li");
    \u0275\u0275conditionalCreate(10, GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_10_Template, 2, 1, "span");
    \u0275\u0275conditionalCreate(11, GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_11_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(12, GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_12_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "li");
    \u0275\u0275i18nStart(14, 29);
    \u0275\u0275element(15, "strong");
    \u0275\u0275pipe(16, "humanDuration");
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "li");
    \u0275\u0275i18nStart(18, 30);
    \u0275\u0275element(19, "strong");
    \u0275\u0275pipe(20, "humanDuration");
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd()();
    \u0275\u0275element(21, "app-rules-configuration", 87);
    \u0275\u0275elementStart(22, "button", 88);
    \u0275\u0275listener("click", function GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.acceptConfig());
    });
    \u0275\u0275i18n(23, 31);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(24, "div", 40)(25, "div", 41);
    \u0275\u0275conditionalCreate(26, GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Conditional_26_Template, 1, 1, "app-demo-card", 89);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275i18nExp(ctx_r2.getGameName().getOrElse(""));
    \u0275\u0275i18nApply(4);
    \u0275\u0275advance(3);
    \u0275\u0275i18nExp(ctx_r2.viewInfo.creator)(ctx_r2.viewInfo.gameTypeName);
    \u0275\u0275i18nApply(7);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.viewInfo.firstPlayer === ctx_r2.FirstPlayer.CREATOR ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.firstPlayer === ctx_r2.FirstPlayer.CHOSEN_OPPONENT ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.firstPlayer === ctx_r2.FirstPlayer.RANDOM ? 12 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275i18nExp(\u0275\u0275pipeBind1(16, 13, ctx_r2.viewInfo.moveDuration || 0));
    \u0275\u0275i18nApply(14);
    \u0275\u0275advance(4);
    \u0275\u0275i18nExp(\u0275\u0275pipeBind1(20, 15, ctx_r2.viewInfo.gameDuration || 0));
    \u0275\u0275i18nApply(18);
    \u0275\u0275advance();
    \u0275\u0275property("rulesConfigDescription", ctx_r2.rulesConfigDescription())("creatorMode", false)("editable", false)("rulesConfigToDisplay", ctx_r2.getRulesConfigToDisplay());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.getConfigDemo() !== void 0 ? 26 : -1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, GameCreationComponent_Conditional_0_Conditional_2_Conditional_1_Template, 7, 2, "div")(2, GameCreationComponent_Conditional_0_Conditional_2_Conditional_2_Template, 27, 17, "div", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.creatorIsModifyingConfig ? 1 : 2);
  }
}
function GameCreationComponent_Conditional_0_Conditional_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 36);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r2.viewInfo.creator);
    \u0275\u0275i18nApply(1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275i18n(1, 37);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r2.viewInfo.creator)(ctx_r2.viewInfo.chosenOpponent);
    \u0275\u0275i18nApply(1);
  }
}
function GameCreationComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "div", 90)(2, "div", 91)(3, "p");
    \u0275\u0275i18n(4, 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 70)(6, "p");
    \u0275\u0275conditionalCreate(7, GameCreationComponent_Conditional_0_Conditional_3_Conditional_7_Template, 2, 1, "ng-container")(8, GameCreationComponent_Conditional_0_Conditional_3_Conditional_8_Template, 2, 2, "ng-container");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r2.viewInfo.creatorIsModifyingConfig ? 7 : 8);
  }
}
function GameCreationComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, GameCreationComponent_Conditional_0_Conditional_1_Template, 82, 31, "div", 38);
    \u0275\u0275conditionalCreate(2, GameCreationComponent_Conditional_0_Conditional_2_Template, 3, 1, "div");
    \u0275\u0275conditionalCreate(3, GameCreationComponent_Conditional_0_Conditional_3_Template, 9, 1, "div", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.userIsCreator ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.userIsChosenOpponent ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.viewInfo.userIsObserver ? 3 : -1);
  }
}
var GameCreationComponentMessages = class {
  static GAME_DOES_NOT_EXIST_OR_UNKNOWN = () => $localize`The game you tried to join does not exist. Its config room may have existed in the past, but its creator left before the game actually started.`;
};
var GameCreationComponent = class GameCreationComponent2 extends BaseWrapperComponent {
  router = inject(Router);
  connectedUserService = inject(ConnectedUserService);
  configRoomService = inject(ConfigRoomService);
  formBuilder = inject(FormBuilder);
  messageDisplayer = inject(MessageDisplayer);
  cdr = inject(ChangeDetectorRef);
  /*
   * Lifecycle:
   * 1. Creator chooses config and opponent
   * 2. Creator click on "proposing the config"
   * 3a. Chosen opponent accepts the config -> game starts
   * 3b. Creator clicks on "modifying config" -> back to 1, with the current config and opponent
   *
   * PageCreationComponent is always a child of OnlineGame component (one to one)
   * they need common data so that the parent calculates/retrieves the data then share it
   * with the game creation component
   */
  GameType = GameType;
  GameDuration = GameDuration;
  FirstPlayer = FirstPlayer;
  gameId = input.required(...ngDevMode ? [{ debugName: "gameId" }] : []);
  rulesConfigDescription = input.required(...ngDevMode ? [{ debugName: "rulesConfigDescription" }] : []);
  // notify that the game has started, a thing evaluated with the configRoom doc game status
  gameStartNotification = output();
  gameStarted = false;
  viewInfo = {
    userIsCreator: false,
    userIsChosenOpponent: false,
    userIsObserver: false,
    gameType: GameType.STANDARD,
    gameTypeClasses: { "Standard": ["is-selected", "is-primary"], "Blitz": [], "Custom": [] },
    firstPlayer: FirstPlayer.RANDOM,
    firstPlayerClasses: { "Creator": [], "Random": ["is-selected", "is-primary"], "ChosenOpponent": [] },
    candidateClasses: {},
    candidates: []
  };
  currentConfigRoom = null;
  candidates = [];
  // Subscription
  ngUnsubscribe = new Subject();
  configRoomSubscription = new Subscription();
  navigateThereAfterGameCanceled = ["/lobby"];
  configFormGroup;
  allDocDeleted = false;
  // Provided by RulesConfigurationComponent
  rulesConfig = MGPOptional.empty();
  configDemo = void 0;
  ngOnInit() {
    return __async(this, null, function* () {
      this.checkInputs();
      this.createForms();
      yield this.joinAndSubscribeToConfigRoom();
      this.subscribeToFormElements();
    });
  }
  checkInputs() {
    const user = this.connectedUserService.user;
    Utils.assert(user.isPresent(), "GameCreationComponent should not be called without connected user");
    Utils.assert(user.get() !== AuthUser.NOT_CONNECTED, "GameCreationComponent should not be created with an empty userName");
    Utils.assert(this.gameId() !== "", "GameCreationComponent should not be created with an empty gameId");
  }
  createForms() {
    this.configFormGroup = this.formBuilder.group({
      firstPlayer: [FirstPlayer.RANDOM, Validators.required],
      moveDuration: [GameDuration.STANDARD_MOVE_DURATION, Validators.required],
      gameDuration: [GameDuration.STANDARD_GAME_DURATION, Validators.required],
      gameType: [GameType.STANDARD, Validators.required],
      chosenOpponent: ["", Validators.required]
    });
  }
  joinAndSubscribeToConfigRoom() {
    return __async(this, null, function* () {
      this.configRoomSubscription = yield this.configRoomService.join(this.gameId(), (configRoom) => this.onConfigRoomUpdate(configRoom), () => this.onGameCancelled(), (candidate) => this.onCandidateJoined(candidate), (user) => this.onCandidateLeft(user), (error) => void this.onError(error));
    });
  }
  onError(error) {
    return __async(this, null, function* () {
      switch (error) {
        case "already-subscribed":
          this.messageDisplayer.criticalMessage($localize`You already have another tab open.`);
          yield this.router.navigate(["/"]);
          break;
        case "unknown-game":
        case "game-does-not-exist":
          const message = GameCreationComponentMessages.GAME_DOES_NOT_EXIST_OR_UNKNOWN();
          yield this.router.navigate(["/notFound", message], { skipLocationChange: true });
          break;
        default:
          this.messageDisplayer.criticalMessage($localize`Unexpected error from backend: ${error}`);
          yield this.router.navigate(["/"]);
          break;
      }
    });
  }
  onGameCancelled() {
    return __async(this, null, function* () {
      this.messageDisplayer.infoMessage($localize`The game has been cancelled.`);
      yield this.router.navigate(["/"]);
    });
  }
  getForm(name) {
    return Utils.getNonNullable(this.configFormGroup.get(name));
  }
  subscribeToFormElements() {
    this.getForm("chosenOpponent").valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((opponent) => {
      if (this.viewInfo.chosenOpponent !== void 0) {
        this.viewInfo.candidateClasses[this.viewInfo.chosenOpponent] = [];
      }
      this.viewInfo.candidateClasses[opponent] = ["is-selected"];
      this.viewInfo.chosenOpponent = opponent;
      const status = Utils.getNonNullable(this.currentConfigRoom).status;
      const configProposed = status === Status.CONFIG_PROPOSED;
      this.viewInfo.canProposeConfig = configProposed === false && opponent !== "";
    });
    this.getForm("gameType").valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((gameType) => {
      this.viewInfo.gameTypeClasses[this.viewInfo.gameType] = [];
      this.viewInfo.gameTypeClasses[gameType] = ["is-primary", "is-selected"];
      this.viewInfo.gameType = gameType;
      this.viewInfo.showCustomTime = gameType === GameType.CUSTOM;
    });
    this.getForm("moveDuration").valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((moveDuration) => {
      this.viewInfo.moveDuration = moveDuration;
    });
    this.getForm("gameDuration").valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((gameDuration) => {
      this.viewInfo.gameDuration = gameDuration;
    });
    this.getForm("firstPlayer").valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((firstPlayer) => {
      this.viewInfo.firstPlayerClasses[this.viewInfo.firstPlayer] = [];
      this.viewInfo.firstPlayerClasses[firstPlayer] = ["is-primary", "is-selected"];
      this.viewInfo.firstPlayer = firstPlayer;
    });
  }
  updateViewInfo(configRoom) {
    const authUser = this.connectedUserService.user.get();
    this.viewInfo.canReviewConfig = configRoom.status === Status.CONFIG_PROPOSED;
    this.viewInfo.canEditConfig = configRoom.status !== Status.CONFIG_PROPOSED;
    this.viewInfo.userIsCreator = this.userIsCreator(configRoom);
    this.viewInfo.userIsChosenOpponent = authUser.id === configRoom.chosenOpponent?.id;
    this.viewInfo.userIsObserver = this.viewInfo.userIsChosenOpponent === false && this.viewInfo.userIsCreator === false;
    this.viewInfo.creatorIsModifyingConfig = configRoom.status !== Status.CONFIG_PROPOSED;
    this.viewInfo.showCustomTime = this.getForm("gameType").value === GameType.CUSTOM;
    this.viewInfo.creator = configRoom.creator.name;
    this.viewInfo.candidates = this.candidates.map((c) => {
      return {
        name: c.user.name,
        elo: c.elo
      };
    });
    if (this.userIsCreator(configRoom)) {
      this.setDataForCreator(configRoom);
    } else {
      this.viewInfo.moveDuration = configRoom.moveDuration;
      this.viewInfo.gameDuration = configRoom.gameDuration;
      this.viewInfo.gameType = configRoom.gameType;
      this.viewInfo.chosenOpponent = configRoom.chosenOpponent?.name;
      this.viewInfo.firstPlayer = configRoom.firstPlayer;
    }
    switch (configRoom.gameType) {
      case GameType.CUSTOM:
        this.viewInfo.gameTypeName = $localize`custom`;
        break;
      case GameType.BLITZ:
        this.viewInfo.gameTypeName = $localize`blitz`;
        break;
      case GameType.STANDARD:
        this.viewInfo.gameTypeName = $localize`standard`;
        break;
    }
    this.cdr.detectChanges();
  }
  setDataForCreator(configRoom) {
    this.viewInfo.moveDuration = this.viewInfo.moveDuration ?? configRoom.moveDuration;
    this.viewInfo.gameDuration = this.viewInfo.gameDuration ?? configRoom.gameDuration;
    let opponent = this.viewInfo.chosenOpponent;
    if (opponent == null || opponent === "") {
      opponent = configRoom.chosenOpponent?.name ?? "";
    } else {
      const chosenOpponentIsCandidate = this.candidates.some((candidate) => {
        return candidate.user.name === opponent;
      });
      if (chosenOpponentIsCandidate === false) {
        opponent = "";
      }
    }
    this.getForm("chosenOpponent").setValue(opponent);
  }
  selectFirstPlayer(firstPlayer) {
    this.getForm("firstPlayer").setValue(firstPlayer);
  }
  selectGameType(gameType) {
    if (gameType === GameType.STANDARD) {
      this.getForm("moveDuration").setValue(GameDuration.STANDARD_MOVE_DURATION);
      this.getForm("gameDuration").setValue(GameDuration.STANDARD_GAME_DURATION);
    } else if (gameType === GameType.BLITZ) {
      this.getForm("moveDuration").setValue(GameDuration.BLITZ_MOVE_DURATION);
      this.getForm("gameDuration").setValue(GameDuration.BLITZ_GAME_DURATION);
    }
    this.getForm("gameType").setValue(gameType);
  }
  selectOpponent(opponentName) {
    return __async(this, null, function* () {
      const opponent = this.getUserFromName(opponentName);
      return this.configRoomService.selectOpponent(opponent);
    });
  }
  getUserFromName(username) {
    const candidate = this.candidates.find((c) => c.user.name === username);
    return Utils.getNonNullable(candidate).user;
  }
  changeConfig() {
    return __async(this, null, function* () {
      return this.configRoomService.reviewConfig();
    });
  }
  proposeConfig() {
    return __async(this, null, function* () {
      const gameType = this.getForm("gameType").value;
      const moveDuration = this.getForm("moveDuration").value;
      const firstPlayer = this.getForm("firstPlayer").value;
      const gameDuration = this.getForm("gameDuration").value;
      return this.configRoomService.proposeConfig({
        gameType,
        firstPlayer,
        moveDuration,
        gameDuration,
        rulesConfig: this.rulesConfig.getOrElse({})
      });
    });
  }
  cancelGameCreation() {
    return __async(this, null, function* () {
      this.allDocDeleted = true;
      return this.onGameCanceled();
    });
  }
  onConfigRoomUpdate(configRoom) {
    return __async(this, null, function* () {
      const oldConfigRoom = this.currentConfigRoom;
      this.currentConfigRoom = configRoom;
      if (configRoom.rulesConfig !== null) {
        this.onRulesConfigUpdate(MGPOptional.of(configRoom.rulesConfig));
      }
      if (this.chosenOpponentJustLeft(oldConfigRoom, configRoom) && this.userIsCreator(configRoom)) {
        const userName = Utils.getNonNullable(oldConfigRoom?.chosenOpponent).name;
        this.messageDisplayer.infoMessage($localize`${userName} left the game, please pick another opponent.`);
      }
      this.updateViewInfo(configRoom);
      if (this.isGameStarted(configRoom)) {
        Debug.display("GameCreationComponent", "onCurrentConfigRoomUpdate", "the game has started");
        this.onGameStarted();
      }
    });
  }
  onCandidateJoined(candidate) {
    this.candidates.push(candidate);
    this.updateViewInfo(Utils.getNonNullable(this.currentConfigRoom));
  }
  onCandidateLeft(user) {
    this.candidates = this.candidates.filter((c) => c.user.id !== user.id);
    this.updateViewInfo(Utils.getNonNullable(this.currentConfigRoom));
  }
  chosenOpponentJustLeft(oldConfigRoom, newConfigRoom) {
    if (oldConfigRoom == null) {
      return false;
    } else {
      const thereWasAChosenOpponent = oldConfigRoom.chosenOpponent != null;
      const thereIsNoLongerChosenOpponent = newConfigRoom.chosenOpponent == null;
      return thereWasAChosenOpponent && thereIsNoLongerChosenOpponent;
    }
  }
  onGameCanceled() {
    return __async(this, null, function* () {
      this.messageDisplayer.infoMessage($localize`The game has been canceled!`);
      yield this.router.navigate(this.navigateThereAfterGameCanceled);
    });
  }
  isGameStarted(configRoom) {
    Utils.assert(configRoom != null, "configRoom should not be null (isGameStarted)");
    const status = Utils.getNonNullable(configRoom).status;
    return status === Status.STARTED || status === Status.FINISHED;
  }
  onGameStarted() {
    const configRoom = Utils.getNonNullable(this.currentConfigRoom);
    this.gameStartNotification.emit(configRoom);
    this.gameStarted = true;
  }
  userIsCreator(configRoom) {
    const currentUserId = this.connectedUserService.user.get().id;
    return currentUserId === configRoom.creator.id;
  }
  acceptConfig() {
    return this.configRoomService.acceptConfig();
  }
  // Only public because of tests
  onRulesConfigUpdate(rulesConfig) {
    this.rulesConfig = rulesConfig;
    if (this.rulesConfig.isPresent()) {
      this.setConfigDemo(this.rulesConfig.get());
    }
  }
  setConfigDemo(config) {
    const stateProvider = this.getStateProvider();
    if (stateProvider.isPresent()) {
      const state = stateProvider.get()(config);
      const node = new GameNode(state);
      this.configDemo = {
        click: MGPOptional.empty(),
        name: this.getGameUrlName(),
        title: this.getGameUrlName(),
        node
      };
      this.cdr.detectChanges();
    }
  }
  getConfigDemo() {
    return this.configDemo;
  }
  ngOnDestroy() {
    return __async(this, null, function* () {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      this.configRoomSubscription.unsubscribe();
    });
  }
  goToLobby() {
    return __async(this, null, function* () {
      yield this.cancelGameCreation();
    });
  }
  playLocally() {
    return __async(this, null, function* () {
      const urlName = this.getGameUrlName();
      this.navigateThereAfterGameCanceled = ["/local", urlName, "config"];
      yield this.cancelGameCreation();
    });
  }
  getRulesConfigToDisplay() {
    return this.currentConfigRoom?.rulesConfig;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275GameCreationComponent_BaseFactory;
    return function GameCreationComponent_Factory(__ngFactoryType__) {
      return (\u0275GameCreationComponent_BaseFactory || (\u0275GameCreationComponent_BaseFactory = \u0275\u0275getInheritedFactory(GameCreationComponent2)))(__ngFactoryType__ || GameCreationComponent2);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: GameCreationComponent2, selectors: [["app-game-creation"]], inputs: { gameId: [1, "gameId"], rulesConfigDescription: [1, "rulesConfigDescription"] }, outputs: { gameStartNotification: "gameStartNotification" }, features: [\u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_776412486154662569$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_0 = goog.getMsg("Creation of a game of {$interpolation} ", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getGameName().getOrElse('') }}" } });
      i18n_0 = MSG_EXTERNAL_776412486154662569$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Creation of a game of ${"\uFFFD0\uFFFD"}:INTERPOLATION: `;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_4247449258896721566$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_1 = goog.getMsg("Opponents");
      i18n_1 = MSG_EXTERNAL_4247449258896721566$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`Opponents`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_7709161982270147002$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_2 = goog.getMsg("Random first player");
      i18n_2 = MSG_EXTERNAL_7709161982270147002$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`Random first player`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_5246623381325349376$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_3 = goog.getMsg("You start");
      i18n_3 = MSG_EXTERNAL_5246623381325349376$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`You start`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_8926567047186783072$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_4 = goog.getMsg("Standard time");
      i18n_4 = MSG_EXTERNAL_8926567047186783072$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`Standard time`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_3120304451891406993$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_5 = goog.getMsg("Maximal turn duration: ");
      i18n_5 = MSG_EXTERNAL_3120304451891406993$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Maximal turn duration: `;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_7706583339650523116$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_6 = goog.getMsg("Maximal game duration: {$startTagStrong}{$interpolation} per player{$closeTagStrong}", { "closeTagStrong": "\uFFFD/#42\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagStrong": "\uFFFD#42\uFFFD" }, { original_code: { "closeTagStrong": "</strong>", "interpolation": "{{ GameDuration.STANDARD_GAME_DURATION | humanDuration }}", "startTagStrong": "<strong>" } });
      i18n_6 = MSG_EXTERNAL_7706583339650523116$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Maximal game duration: ${"\uFFFD#42\uFFFD"}:START_TAG_STRONG:${"\uFFFD0\uFFFD"}:INTERPOLATION: per player${"\uFFFD/#42\uFFFD"}:CLOSE_TAG_STRONG:`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_4073116770334354573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_7 = goog.getMsg("Blitz");
      i18n_7 = MSG_EXTERNAL_4073116770334354573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`Blitz`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_3120304451891406993$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_8 = goog.getMsg("Maximal turn duration: ");
      i18n_8 = MSG_EXTERNAL_3120304451891406993$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`Maximal turn duration: `;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_9162865005165634141$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_9 = goog.getMsg("Maximal game duration: {$startTagStrong}{$interpolation} per player{$closeTagStrong}", { "closeTagStrong": "\uFFFD/#61\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagStrong": "\uFFFD#61\uFFFD" }, { original_code: { "closeTagStrong": "</strong>", "interpolation": "{{ GameDuration.BLITZ_GAME_DURATION | humanDuration }}", "startTagStrong": "<strong>" } });
      i18n_9 = MSG_EXTERNAL_9162865005165634141$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`Maximal game duration: ${"\uFFFD#61\uFFFD"}:START_TAG_STRONG:${"\uFFFD0\uFFFD"}:INTERPOLATION: per player${"\uFFFD/#61\uFFFD"}:CLOSE_TAG_STRONG:`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_3154403333894623756$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_10 = goog.getMsg("Custom time");
      i18n_10 = MSG_EXTERNAL_3154403333894623756$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`Custom time`;
    }
    let i18n_11;
    if (false) {
      const MSG_EXTERNAL_1612262766071402559$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_11 = goog.getMsg("Propose configuration");
      i18n_11 = MSG_EXTERNAL_1612262766071402559$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_11;
    } else {
      i18n_11 = $localize`Propose configuration`;
    }
    let i18n_12;
    if (false) {
      const MSG_EXTERNAL_326145407473587685$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_12 = goog.getMsg("Change configuration");
      i18n_12 = MSG_EXTERNAL_326145407473587685$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_12;
    } else {
      i18n_12 = $localize`Change configuration`;
    }
    let i18n_13;
    if (false) {
      const MSG_EXTERNAL_6482290849972032593$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_13 = goog.getMsg("Cancel game");
      i18n_13 = MSG_EXTERNAL_6482290849972032593$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_13;
    } else {
      i18n_13 = $localize`Cancel game`;
    }
    let i18n_14;
    if (false) {
      const MSG_EXTERNAL_2561597132169540579$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_14 = goog.getMsg("Potential opponents will appear here. If no one comes, you can:");
      i18n_14 = MSG_EXTERNAL_2561597132169540579$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_14;
    } else {
      i18n_14 = $localize`Potential opponents will appear here. If no one comes, you can:`;
    }
    let i18n_15;
    if (false) {
      const MSG_EXTERNAL_1406698782162165226$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_15 = goog.getMsg("Look for other games");
      i18n_15 = MSG_EXTERNAL_1406698782162165226$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_15;
    } else {
      i18n_15 = $localize`Look for other games`;
    }
    let i18n_16;
    if (false) {
      const MSG_EXTERNAL_5070629625537228486$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_16 = goog.getMsg("Play against AI");
      i18n_16 = MSG_EXTERNAL_5070629625537228486$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_16;
    } else {
      i18n_16 = $localize`Play against AI`;
    }
    let i18n_17;
    if (false) {
      const MSG_EXTERNAL_5056292777668083757$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_17 = goog.getMsg("Click on the opponent against which you would like to play.");
      i18n_17 = MSG_EXTERNAL_5056292777668083757$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_17;
    } else {
      i18n_17 = $localize`Click on the opponent against which you would like to play.`;
    }
    let i18n_18;
    if (false) {
      const MSG_EXTERNAL_8953033926734869941$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_18 = goog.getMsg("Name");
      i18n_18 = MSG_EXTERNAL_8953033926734869941$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_18;
    } else {
      i18n_18 = $localize`Name`;
    }
    let i18n_19;
    if (false) {
      const MSG_EXTERNAL_3193976279273491157$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_19 = goog.getMsg("Actions");
      i18n_19 = MSG_EXTERNAL_3193976279273491157$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_19;
    } else {
      i18n_19 = $localize`Actions`;
    }
    let i18n_20;
    if (false) {
      const MSG_EXTERNAL_8698515801873408462$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_20 = goog.getMsg("Pick");
      i18n_20 = MSG_EXTERNAL_8698515801873408462$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_20;
    } else {
      i18n_20 = $localize`Pick`;
    }
    let i18n_21;
    if (false) {
      const MSG_EXTERNAL_4770126879401093519$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_21 = goog.getMsg("{$interpolation} starts", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ viewInfo.chosenOpponent }}" } });
      i18n_21 = MSG_EXTERNAL_4770126879401093519$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_21;
    } else {
      i18n_21 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: starts`;
    }
    let i18n_22;
    if (false) {
      const MSG_EXTERNAL_4492847529610715272$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_22 = goog.getMsg("The opponent starts");
      i18n_22 = MSG_EXTERNAL_4492847529610715272$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_22;
    } else {
      i18n_22 = $localize`The opponent starts`;
    }
    let i18n_23;
    if (false) {
      const MSG_EXTERNAL_3120304451891406993$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_23 = goog.getMsg("Maximal turn duration: ");
      i18n_23 = MSG_EXTERNAL_3120304451891406993$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_23;
    } else {
      i18n_23 = $localize`Maximal turn duration: `;
    }
    let i18n_24;
    if (false) {
      const MSG_EXTERNAL_1429600981801634363$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_24 = goog.getMsg("Maximal game duration: {$startTagOutput}{$interpolation} per player{$closeTagOutput}", { "closeTagOutput": "\uFFFD/#13\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagOutput": "\uFFFD#13\uFFFD" }, { original_code: { "closeTagOutput": "</output>", "interpolation": "{{ (viewInfo.gameDuration || 0) | humanDuration }}", "startTagOutput": "<output>" } });
      i18n_24 = MSG_EXTERNAL_1429600981801634363$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_24;
    } else {
      i18n_24 = $localize`Maximal game duration: ${"\uFFFD#13\uFFFD"}:START_TAG_OUTPUT:${"\uFFFD0\uFFFD"}:INTERPOLATION: per player${"\uFFFD/#13\uFFFD"}:CLOSE_TAG_OUTPUT:`;
    }
    let i18n_25;
    if (false) {
      const MSG_EXTERNAL_5522972794872799919$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_25 = goog.getMsg("Configuration proposal for {$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getGameName().getOrElse('') }}" } });
      i18n_25 = MSG_EXTERNAL_5522972794872799919$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_25;
    } else {
      i18n_25 = $localize`Configuration proposal for ${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
    }
    let i18n_26;
    if (false) {
      const MSG_EXTERNAL_2780955113181857992$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_26 = goog.getMsg("You have been selected as the opponent.{$lineBreak} {$interpolation} is modifying the configuration.", { "interpolation": "\uFFFD0\uFFFD", "lineBreak": "\uFFFD#6\uFFFD\uFFFD/#6\uFFFD" }, { original_code: { "interpolation": "{{ viewInfo.creator }}", "lineBreak": "<br/>" } });
      i18n_26 = MSG_EXTERNAL_2780955113181857992$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_26;
    } else {
      i18n_26 = $localize`You have been selected as the opponent.${"\uFFFD#6\uFFFD\uFFFD/#6\uFFFD"}:LINE_BREAK: ${"\uFFFD0\uFFFD"}:INTERPOLATION: is modifying the configuration.`;
    }
    let i18n_27;
    if (false) {
      const MSG_EXTERNAL_5522972794872799919$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_27 = goog.getMsg("Configuration proposal for {$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getGameName().getOrElse('') }}" } });
      i18n_27 = MSG_EXTERNAL_5522972794872799919$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_27;
    } else {
      i18n_27 = $localize`Configuration proposal for ${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
    }
    let i18n_28;
    if (false) {
      const MSG_EXTERNAL_2032730969268750136$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_28 = goog.getMsg("{$interpolation} proposes to play a {$interpolation_1} game", { "interpolation": "\uFFFD0\uFFFD", "interpolation_1": "\uFFFD1\uFFFD" }, { original_code: { "interpolation": "{{ viewInfo.creator }}", "interpolation_1": "{{ viewInfo.gameTypeName }}" } });
      i18n_28 = MSG_EXTERNAL_2032730969268750136$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_28;
    } else {
      i18n_28 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: proposes to play a ${"\uFFFD1\uFFFD"}:INTERPOLATION_1: game`;
    }
    let i18n_29;
    if (false) {
      const MSG_EXTERNAL_1508821206984160310$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_29 = goog.getMsg("a turn lasts at most {$startTagStrong}{$interpolation} {$closeTagStrong}", { "closeTagStrong": "\uFFFD/#15\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagStrong": "\uFFFD#15\uFFFD" }, { original_code: { "closeTagStrong": "</strong>", "interpolation": "{{ (viewInfo.moveDuration || 0) | humanDuration }}", "startTagStrong": "<strong>" } });
      i18n_29 = MSG_EXTERNAL_1508821206984160310$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_29;
    } else {
      i18n_29 = $localize`a turn lasts at most ${"\uFFFD#15\uFFFD"}:START_TAG_STRONG:${"\uFFFD0\uFFFD"}:INTERPOLATION: ${"\uFFFD/#15\uFFFD"}:CLOSE_TAG_STRONG:`;
    }
    let i18n_30;
    if (false) {
      const MSG_EXTERNAL_9188800046108267218$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_30 = goog.getMsg("the game lasts at most {$startTagStrong}{$interpolation} per player{$closeTagStrong}", { "closeTagStrong": "\uFFFD/#19\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagStrong": "\uFFFD#19\uFFFD" }, { original_code: { "closeTagStrong": "</strong>", "interpolation": "{{ (viewInfo.gameDuration || 0) | humanDuration }}", "startTagStrong": "<strong>" } });
      i18n_30 = MSG_EXTERNAL_9188800046108267218$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_30;
    } else {
      i18n_30 = $localize`the game lasts at most ${"\uFFFD#19\uFFFD"}:START_TAG_STRONG:${"\uFFFD0\uFFFD"}:INTERPOLATION: per player${"\uFFFD/#19\uFFFD"}:CLOSE_TAG_STRONG:`;
    }
    let i18n_31;
    if (false) {
      const MSG_EXTERNAL_1012784993066568401$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_31 = goog.getMsg("Accept and start");
      i18n_31 = MSG_EXTERNAL_1012784993066568401$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_31;
    } else {
      i18n_31 = $localize`Accept and start`;
    }
    let i18n_32;
    if (false) {
      const MSG_EXTERNAL_9182183814884195467$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_32 = goog.getMsg("{$interpolation} plays first", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ viewInfo.creator }}" } });
      i18n_32 = MSG_EXTERNAL_9182183814884195467$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_32;
    } else {
      i18n_32 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: plays first`;
    }
    let i18n_33;
    if (false) {
      const MSG_EXTERNAL_8496859383343230204$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_33 = goog.getMsg("you play first");
      i18n_33 = MSG_EXTERNAL_8496859383343230204$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_33;
    } else {
      i18n_33 = $localize`you play first`;
    }
    let i18n_34;
    if (false) {
      const MSG_EXTERNAL_8194858011161710862$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_34 = goog.getMsg("the first player is selected randomly");
      i18n_34 = MSG_EXTERNAL_8194858011161710862$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_34;
    } else {
      i18n_34 = $localize`the first player is selected randomly`;
    }
    let i18n_35;
    if (false) {
      const MSG_EXTERNAL_7265061399015519876$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_35 = goog.getMsg("One moment...");
      i18n_35 = MSG_EXTERNAL_7265061399015519876$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_35;
    } else {
      i18n_35 = $localize`One moment...`;
    }
    let i18n_36;
    if (false) {
      const MSG_EXTERNAL_5882690723658471875$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_36 = goog.getMsg("{$interpolation} is configuring the game.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ viewInfo.creator }}" } });
      i18n_36 = MSG_EXTERNAL_5882690723658471875$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_36;
    } else {
      i18n_36 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: is configuring the game.`;
    }
    let i18n_37;
    if (false) {
      const MSG_EXTERNAL_8713611467100971426$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_37 = goog.getMsg("{$interpolation} has proposed a configuration to {$interpolation_1}.", { "interpolation": "\uFFFD0\uFFFD", "interpolation_1": "\uFFFD1\uFFFD" }, { original_code: { "interpolation": "{{ viewInfo.creator }}", "interpolation_1": "{{ viewInfo.chosenOpponent }}" } });
      i18n_37 = MSG_EXTERNAL_8713611467100971426$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_GAME_CREATION_GAME_CREATION_COMPONENT_TS_37;
    } else {
      i18n_37 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: has proposed a configuration to ${"\uFFFD1\uFFFD"}:INTERPOLATION_1:.`;
    }
    return [i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, i18n_9, i18n_10, i18n_11, i18n_12, i18n_13, i18n_14, i18n_15, i18n_16, i18n_17, i18n_18, i18n_19, i18n_20, i18n_21, i18n_22, i18n_23, i18n_24, i18n_25, i18n_26, i18n_27, i18n_28, i18n_29, i18n_30, i18n_31, i18n_32, i18n_33, i18n_34, i18n_35, i18n_36, i18n_37, [1, "columns", "is-vcentered", "is-align-items-stretch"], [1, "box"], [1, "column"], [1, "box", "is-fullheight"], [1, "title"], [3, "formGroup"], [3, "disabled"], [1, "field"], [1, "label"], [1, "control"], [1, "message"], [1, "columns", "is-gapless", "mb-2"], ["id", "firstPlayerRandom", 1, "button", "is-fullwidth", 3, "click", "ngClass"], ["id", "firstPlayerCreator", 1, "button", "is-fullwidth", 3, "click", "ngClass"], ["id", "firstPlayerOpponent", 1, "button", "is-fullwidth", 3, "click", "ngClass"], [1, "columns", "is-gapless"], ["id", "gameTypeStandard", 1, "button", "is-fullwidth", "dropdown", "is-hoverable", 3, "click", "ngClass"], [1, "dropdown-trigger"], ["role", "menu", 1, "dropdown-menu"], [1, "dropdown-content"], [1, "dropdown-item"], ["id", "gameTypeBlitz", 1, "button", "is-fullwidth", "dropdown", "is-hoverable", 3, "click", "ngClass"], ["id", "gameTypeCustom", 1, "button", "is-fullwidth", 3, "click", "ngClass"], ["id", "customTime"], [1, "mt-2"], ["id", "rulesConfigurationComponent", 3, "updateCallback", "rulesConfigDescription", "creatorMode", "rulesConfigToDisplay", "editable"], [1, "columns", "is-gapless", "mt-2"], ["id", "proposeConfig", 1, "button", "is-fullwidth", "is-success", 3, "click", "disabled"], ["id", "reviewConfig", 1, "button", "is-fullwidth", 3, "click", "disabled"], ["id", "cancel", 1, "button", "is-fullwidth", "is-danger", 3, "click"], [1, "is-fullheight"], ["id", "demoCard", 1, "box", "is-fullheight", 3, "demoNodeInfo"], [1, "message-body"], ["id", "go-to-lobby", 1, "button", "is-fullwidth", 3, "click"], ["id", "play-against-ai", 1, "button", "is-fullwidth", 3, "click"], ["id", "chooseOpponent", 1, "table-container", "mt-2"], [1, "table", "is-fullwidth", "is-hoverable", "is-striped"], ["scope", "col", 1, "th"], [3, "id", "ngClass"], [3, "click", "id", "ngClass"], [1, "td", 3, "id"], [3, "elo"], [1, "td"], [1, "button", "is-primary"], ["for", "moveDuration", 1, "label"], ["step", "10", "min", "10", "max", "300", "name", "moveDuration", "formControlName", "moveDuration", "type", "range", 1, "slider", "is-circle", "is-primary"], ["for", "gameDuration", 1, "label"], ["step", "10", "min", "10", "max", "3600", "name", "gameDuration", "formControlName", "gameDuration", "type", "range", 1, "slider", "is-circle", "is-primary"], [1, "content"], [3, "rulesConfigDescription", "creatorMode", "editable", "rulesConfigToDisplay"], ["id", "acceptConfig", 1, "button", "is-primary", "is-fullwidth", "mt-2", 3, "click"], ["id", "demoCard", 3, "demoNodeInfo"], [1, "message", "is-primary"], [1, "message-header"]];
  }, template: function GameCreationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, GameCreationComponent_Conditional_0_Template, 4, 3, "div");
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.viewInfo ? 0 : -1);
    }
  }, dependencies: [
    ReactiveFormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    RangeValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    FormGroupDirective,
    FormControlName,
    NgClass,
    RulesConfigurationComponent,
    DemoCardWrapperComponent,
    EloComponent,
    HumanDurationPipe
  ], encapsulation: 2 });
};
GameCreationComponent = __decorate2([
  Debug.log
], GameCreationComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameCreationComponent, [{
    type: Component,
    args: [{ selector: "app-game-creation", imports: [
      ReactiveFormsModule,
      NgClass,
      RulesConfigurationComponent,
      DemoCardWrapperComponent,
      EloComponent,
      HumanDurationPipe
    ], template: `@if (viewInfo) {
    <div>
        @if (viewInfo.userIsCreator) {
            <div class="columns is-vcentered is-align-items-stretch">
                <div class="column">
                    <div class="box is-fullheight">
                        <h1 class="title"
                            i18n>Creation of a game of {{ getGameName().getOrElse('') }} </h1>
                        <form [formGroup]="configFormGroup">
                            <fieldset [disabled]="!viewInfo.canEditConfig">
                                <div class="field">
                                    <label class="label"
                                           i18n>Opponents</label>
                                    <div class="control">
                                        @if (viewInfo.candidates.length === 0) {
                                            <div class="message">
                                                <div class="message-body">
                                                    <p i18n>Potential opponents will appear here. If no one comes, you can:</p>
                                                    <div class="columns is-gapless mt-2">
                                                        <div class="column">
                                                            <button id="go-to-lobby"
                                                                    class="button is-fullwidth"
                                                                    (click)="goToLobby()"
                                                                    i18n>Look for other games</button>
                                                        </div>
                                                        <div class="column">
                                                            <button id="play-against-ai"
                                                                    class="button is-fullwidth"
                                                                    (click)="playLocally()"
                                                                    i18n>Play against AI</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        } @else {
                                            <ng-container i18n>Click on the opponent against which you would like to play.</ng-container>
                                            <div class="table-container mt-2"
                                                 id="chooseOpponent">
                                                <table class="table is-fullwidth is-hoverable is-striped">
                                                    <thead>
                                                        <tr>
                                                            <th class="th"
                                                                scope="col"
                                                                i18n>Name</th>
                                                            <th class="th"
                                                                scope="col"
                                                                i18n>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        @for (candidate of viewInfo.candidates; track candidate.name) {
                                                            <tr id="presenceOf_{{ candidate.name }}"
                                                                [ngClass]="viewInfo.candidateClasses[candidate.name]"
                                                                (click)="selectOpponent(candidate.name)">
                                                                <td [id]="viewInfo.chosenOpponent === candidate.name ? ('selected_' + candidate.name) : ('candidate_' + candidate.name)"
                                                                    class="td">{{ candidate.name }} (<app-elo [elo]="candidate.elo"/>)</td>
                                                                <td class="td">
                                                                    @if (viewInfo.chosenOpponent !== candidate.name) {
                                                                        <button class="button is-primary"
                                                                                i18n>Pick</button>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div class="columns is-gapless mb-2">
                                    <div class="column">
                                        <button class="button is-fullwidth"
                                                id="firstPlayerRandom"
                                                [ngClass]="viewInfo.firstPlayerClasses[FirstPlayer.RANDOM]"
                                                (click)="selectFirstPlayer(FirstPlayer.RANDOM)"
                                                i18n>Random first player</button>
                                    </div>
                                    <div class="column">
                                        <button class="button is-fullwidth"
                                                id="firstPlayerCreator"
                                                [ngClass]="viewInfo.firstPlayerClasses[FirstPlayer.CREATOR]"
                                                (click)="selectFirstPlayer(FirstPlayer.CREATOR)"
                                                i18n>You start</button>
                                    </div>
                                    <div class="column">
                                        <button class="button is-fullwidth"
                                                id="firstPlayerOpponent"
                                                [ngClass]="viewInfo.firstPlayerClasses[FirstPlayer.CHOSEN_OPPONENT]"
                                                (click)="selectFirstPlayer(FirstPlayer.CHOSEN_OPPONENT)">
                                            @if (viewInfo.chosenOpponent) {
                                                <ng-container i18n>{{ viewInfo.chosenOpponent }} starts</ng-container>
                                            } @else {
                                                <ng-container i18n>The opponent starts</ng-container>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div class="columns is-gapless">
                                    <div class="column">
                                        <div class="button is-fullwidth dropdown is-hoverable"
                                             id="gameTypeStandard"
                                             [ngClass]="viewInfo.gameTypeClasses[GameType.STANDARD]"
                                             (click)="selectGameType(GameType.STANDARD)">
                                            <div class="dropdown-trigger">
                                                <span i18n>Standard time</span>
                                            </div>
                                            <div class="dropdown-menu"
                                                 role="menu">
                                                <div class="dropdown-content">
                                                    <div class="dropdown-item">
                                                        <p>
                                                            <ng-container i18n>Maximal turn duration: </ng-container>
                                                            <strong>{{ GameDuration.STANDARD_MOVE_DURATION | humanDuration }}</strong><br/>
                                                            <ng-container i18n>Maximal game duration: <strong>{{ GameDuration.STANDARD_GAME_DURATION | humanDuration }} per player</strong></ng-container>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column">
                                        <div class="button is-fullwidth dropdown is-hoverable"
                                             id="gameTypeBlitz"
                                             [ngClass]="viewInfo.gameTypeClasses[GameType.BLITZ]"
                                             (click)="selectGameType(GameType.BLITZ)">
                                            <div class="dropdown-trigger">
                                                <span i18n>Blitz</span>
                                            </div>
                                            <div class="dropdown-menu"
                                                 role="menu">
                                                <div class="dropdown-content">
                                                    <div class="dropdown-item">
                                                        <p>
                                                            <ng-container i18n>Maximal turn duration: </ng-container>
                                                            <strong>{{ GameDuration.BLITZ_MOVE_DURATION | humanDuration }}</strong><br/>
                                                            <ng-container i18n>Maximal game duration: <strong>{{ GameDuration.BLITZ_GAME_DURATION | humanDuration }} per player</strong></ng-container>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column">
                                        <button class="button is-fullwidth"
                                                id="gameTypeCustom"
                                                [ngClass]="viewInfo.gameTypeClasses[GameType.CUSTOM]"
                                                (click)="selectGameType(GameType.CUSTOM)"
                                                i18n>Custom time</button>
                                    </div>
                                </div>
                                @if (viewInfo.showCustomTime) {
                                    <div id="customTime">
                                        <div class="field">
                                            <label class="label"
                                                   for="moveDuration">
                                                <ng-container i18n>Maximal turn duration: </ng-container>
                                                <output>{{ (viewInfo.moveDuration || 0) | humanDuration }}</output>
                                            </label>
                                            <div class="control">
                                                <input class="slider is-circle is-primary"
                                                       step="10"
                                                       min="10"
                                                       max="300"
                                                       name="moveDuration"
                                                       formControlName="moveDuration"
                                                       type="range">
                                            </div>
                                        </div>
                                        <div class="field">
                                            <label class="label"
                                                   for="gameDuration"
                                                   i18n>Maximal game duration: <output>{{ (viewInfo.gameDuration || 0) | humanDuration }} per player</output></label>
                                            <div class="control">
                                                <input class="slider is-circle is-primary"
                                                       step="10"
                                                       min="10"
                                                       max="3600"
                                                       name="gameDuration"
                                                       formControlName="gameDuration"
                                                       type="range">
                                            </div>
                                        </div>
                                    </div>
                                }
                            </fieldset>
                            <div class="mt-2">
                                <app-rules-configuration id="rulesConfigurationComponent"
                                                         [rulesConfigDescription]="rulesConfigDescription()"
                                                         [creatorMode]="true"
                                                         [rulesConfigToDisplay]="getRulesConfigToDisplay()"
                                                         [editable]="viewInfo.canEditConfig || false"
                                                         (updateCallback)="onRulesConfigUpdate($event)">
                                </app-rules-configuration>
                            </div>
                            <div class="columns is-gapless mt-2">
                                <div class="column">
                                    <button class="button is-fullwidth is-success"
                                            [disabled]="!(viewInfo.canProposeConfig && rulesConfig.isPresent())"
                                            (click)="proposeConfig()"
                                            id="proposeConfig"
                                            i18n>Propose configuration</button>
                                </div>
                                <div class="column">
                                    <button class="button is-fullwidth"
                                            id="reviewConfig"
                                            [disabled]="viewInfo.canReviewConfig === false"
                                            (click)="changeConfig()"
                                            i18n>Change configuration</button>
                                </div>
                                <div class="column">
                                    <button class="button is-fullwidth is-danger"
                                            id="cancel"
                                            (click)="cancelGameCreation()"
                                            i18n>Cancel game</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="column">
                    <div class="is-fullheight">
                        @if (getConfigDemo() !== undefined) {
                            <app-demo-card id="demoCard"
                                           class="box is-fullheight"
                                           [demoNodeInfo]="getConfigDemo()!"></app-demo-card>
                        }
                    </div>
                </div>
            </div>
        }
        @if (viewInfo.userIsChosenOpponent) {
            <div>
                @if (viewInfo.creatorIsModifyingConfig) {
                    <div>
                        <div class="box is-fullheight">
                            <p class="title"
                               i18n>Configuration proposal for {{ getGameName().getOrElse('') }}</p>
                            <p i18n>You have been selected as the opponent.<br/>
                                {{ viewInfo.creator }} is modifying the configuration.</p>
                    </div>
                </div>
                } @else {
                    <div class="columns is-vcentered is-align-items-stretch">
                        <div class="column">
                            <div class="box is-fullheight">
                                <p class="title"
                                   i18n>Configuration proposal for {{ getGameName().getOrElse('') }}</p>
                                <div class="content">
                                    <p i18n>{{ viewInfo.creator }} proposes to play a {{ viewInfo.gameTypeName }} game</p>
                                    <ul>
                                        <li>
                                            @if (viewInfo.firstPlayer === FirstPlayer.CREATOR) {
                                                <span i18n>{{ viewInfo.creator }} plays first</span>
                                            }
                                            @if (viewInfo.firstPlayer === FirstPlayer.CHOSEN_OPPONENT) {
                                                <span i18n>you play first</span>
                                            }
                                            @if (viewInfo.firstPlayer === FirstPlayer.RANDOM) {
                                                <span i18n>the first player is selected randomly</span>
                                            }
                                        </li>
                                        <li i18n>a turn lasts at most <strong>{{ (viewInfo.moveDuration || 0) | humanDuration }} </strong></li>
                                        <li i18n>the game lasts at most <strong>{{ (viewInfo.gameDuration || 0) | humanDuration }} per player</strong></li>
                                    </ul>
                                    <app-rules-configuration [rulesConfigDescription]="rulesConfigDescription()"
                                                             [creatorMode]="false"
                                                             [editable]="false"
                                                             [rulesConfigToDisplay]="getRulesConfigToDisplay()">
                                    </app-rules-configuration>
                                    <button class="button is-primary is-fullwidth mt-2"
                                            (click)="acceptConfig()"
                                            id="acceptConfig"
                                            i18n>Accept and start</button>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="box is-fullheight">
                                @if (getConfigDemo() !== undefined) {
                                    <app-demo-card id="demoCard"
                                                   [demoNodeInfo]="getConfigDemo()!"></app-demo-card>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        }
        @if (viewInfo.userIsObserver) {
            <div class="box">
                <div class="message is-primary">
                    <div class="message-header">
                        <p i18n>One moment...</p>
                    </div>
                    <div class="message-body">
                        <p>
                            @if (viewInfo.creatorIsModifyingConfig) {
                                <ng-container i18n>{{ viewInfo.creator }} is configuring the game.</ng-container>
                            } @else {
                                <ng-container i18n>{{ viewInfo.creator }} has proposed a configuration to {{ viewInfo.chosenOpponent }}.</ng-container>
                            }
                        </p>
                    </div>
                </div>
            </div>
        }
    </div>
}
` }]
  }], null, { gameId: [{ type: Input, args: [{ isSignal: true, alias: "gameId", required: true }] }], rulesConfigDescription: [{ type: Input, args: [{ isSignal: true, alias: "rulesConfigDescription", required: true }] }], gameStartNotification: [{ type: Output, args: ["gameStartNotification"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GameCreationComponent, { className: "GameCreationComponent", filePath: "src/app/components/wrapper-components/game-creation/game-creation.component.ts", lineNumber: 62 });
})();

// src/app/components/wrapper-components/online-game-wrapper/OGWCRequestManagerService.ts
var OGWCRequestManagerService = class _OGWCRequestManagerService {
  connectedUserService = inject(ConnectedUserService);
  static requestInfos = {
    "TakeBack": {
      requestType: "TakeBack",
      textForRequest: () => $localize`Ask to take back one move`,
      textForReply: () => $localize`Your opponent is asking for a take back.`,
      name: () => $localize`take back`,
      icon: faBackwardStep
    },
    "Draw": {
      requestType: "Draw",
      textForRequest: () => $localize`Propose a draw`,
      textForReply: () => $localize`Your opponent is proposing a draw.`,
      name: () => $localize`draw`,
      icon: faFlag
    },
    "Rematch": {
      requestType: `Rematch`,
      textForRequest: () => $localize`Propose a rematch`,
      textForReply: () => $localize`Your opponent is proposing a rematch.`,
      name: () => $localize`rematch`,
      icon: faRepeat
    }
  };
  requestAwaitingReply = MGPOptional.empty();
  lastDeniedRequest = MGPOptional.empty();
  forbiddenRequests = new Set();
  onGameStart() {
    this.requestAwaitingReply = MGPOptional.empty();
    this.lastDeniedRequest = MGPOptional.empty();
    this.forbiddenRequests = new Set();
  }
  onReceivedMove() {
    this.forbiddenRequests = new Set();
    this.lastDeniedRequest = MGPOptional.empty();
  }
  onReceivedRequest(request) {
    Utils.assert(this.requestAwaitingReply.isAbsent(), "Should not receive two requests in a row!");
    this.requestAwaitingReply = MGPOptional.of(request);
    this.forbiddenRequests = new Set();
    this.lastDeniedRequest = MGPOptional.empty();
  }
  /**
   * Called when a reply is received.
   * @returns true if the request has been accepted and must be handled by the OGWC
   */
  onReceivedReply(reply) {
    return __async(this, null, function* () {
      this.requestAwaitingReply = MGPOptional.empty();
      if (reply.accept) {
        return true;
      } else {
        const user = this.connectedUserService.user.get().toMinimalUser();
        if (reply.user.id !== user.id) {
          this.lastDeniedRequest = MGPOptional.of(reply.requestType);
          this.forbiddenRequests = this.forbiddenRequests.addElement(reply.requestType);
        }
        return false;
      }
    });
  }
  canMakeRequest(request) {
    if (this.requestAwaitingReply.isPresent())
      return false;
    if (this.forbiddenRequests.contains(request))
      return false;
    return true;
  }
  getUnrespondedRequestFrom(user) {
    if (this.requestAwaitingReply.isPresent() && this.requestAwaitingReply.get().user.id === user.id) {
      return MGPOptional.of(this.requestAwaitingReply.get().requestType);
    } else {
      return MGPOptional.empty();
    }
  }
  getCurrentRequest() {
    return this.requestAwaitingReply;
  }
  deniedRequest() {
    return this.lastDeniedRequest;
  }
  static \u0275fac = function OGWCRequestManagerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OGWCRequestManagerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OGWCRequestManagerService, factory: _OGWCRequestManagerService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OGWCRequestManagerService, [{
    type: Injectable
  }], null, null);
})();

// src/app/components/wrapper-components/online-game-wrapper/OGWCTimeManagerService.ts
var OGWCTimeManagerService = class _OGWCTimeManagerService {
  // The move timers of each player
  moveTimers;
  // Initialized by setTimers
  // The game timers of each player
  gameTimers;
  // Initialized by setTimers
  // All timers managed by this time manager
  allTimers;
  // Initialized by setTimers
  // The configRoom, which is set when starting the game. We need it to know the maximal game and move durations.
  configRoom = MGPOptional.empty();
  // The players, as we need to map between minimal users and player values
  players = [MGPOptional.empty(), MGPOptional.empty()];
  // The game time taken by each player since the beginning of the part
  takenGameTime = PlayerNumberMap.of(0, 0);
  // The game time added to each player
  extraGameTime = PlayerNumberMap.of(0, 0);
  // The move time available for each player. Distinct from the timers so it stays constant within a move
  availableMoveTime = PlayerNumberMap.of(0, 0);
  // The time at which the current move started
  lastMoveStart = MGPOptional.empty();
  // Whether we are synchronized with the server, i.e., we received all events of the past
  synchronized = false;
  // Whether the game is finished
  gameEnd = false;
  setTimers(moveTimers, gameTimers) {
    this.moveTimers = moveTimers;
    this.gameTimers = gameTimers;
    this.allTimers = moveTimers.concat(gameTimers);
  }
  // At the beginning of a game, set up timers and remember when the game started
  onGameStart(configRoom, game, players) {
    this.configRoom = MGPOptional.of(configRoom);
    this.players = players;
    this.lastMoveStart = MGPOptional.of(game.beginning);
    this.gameEnd = false;
    for (const player of Player.PLAYERS) {
      this.takenGameTime.put(player, 0);
      this.extraGameTime.put(player, 0);
      this.availableMoveTime.put(player, this.getMoveDuration());
      this.gameTimers[player.getValue()].setDuration(this.getGameDuration());
      this.moveTimers[player.getValue()].setDuration(this.getMoveDuration());
    }
    for (const timer of this.allTimers) {
      timer.start();
      timer.pause();
    }
  }
  getGameDuration() {
    return this.configRoom.get().gameDuration;
  }
  getMoveDuration() {
    return this.configRoom.get().moveDuration;
  }
  onReceivedAction(action) {
    switch (action.action) {
      case "AddMoveTime":
        this.addMoveTime(this.playerOfMinimalUser(action.user));
        break;
      case "AddGameTime":
        this.addGameTime(this.playerOfMinimalUser(action.user));
        break;
      case "EndGame":
        this.onGameEnd();
        break;
      case "StartGame":
        break;
      default:
        Utils.expectToBe(action.action, "Sync");
        this.onSync();
        break;
    }
  }
  playerOfMinimalUser(user) {
    if (this.players[0].equalsValue(user)) {
      return Player.ZERO;
    } else {
      Utils.assert(this.players[1].equalsValue(user), "MinimalUser should match a player");
      return Player.ONE;
    }
  }
  onReceivedMove(move) {
    const player = this.playerOfMinimalUser(move.user);
    const moveTime = move.timestamp;
    const takenMoveTime = this.getSecondsElapsedSinceLastMoveStart(moveTime);
    this.lastMoveStart = MGPOptional.of(moveTime);
    this.takenGameTime.add(player, takenMoveTime);
    this.availableMoveTime.subtract(player, takenMoveTime);
    const nextPlayer = player.getOpponent();
    this.availableMoveTime.put(nextPlayer, this.getMoveDuration());
    const nextPlayerTakenGameTime = this.takenGameTime.get(nextPlayer);
    const nextPlayerAdaptedGameTime = this.getGameDuration() - nextPlayerTakenGameTime;
    this.gameTimers[nextPlayer.getValue()].changeDuration(nextPlayerAdaptedGameTime);
  }
  getSecondsElapsedSinceLastMoveStart(currentTime) {
    return currentTime - this.lastMoveStart.get();
  }
  // Stops all timers that are running
  onGameEnd() {
    this.gameEnd = true;
    for (const timer of this.allTimers) {
      if (timer.isStarted()) {
        timer.stop();
      }
    }
    this.updateTimers();
  }
  // Called when we are becoming in sync with the server
  onSync() {
    this.synchronized = true;
  }
  // Pause all timers before receiving events
  beforeEvent() {
    this.pauseAllTimers();
  }
  // Continue the current player timer after receiving events
  afterEvent(currentPlayer, currentTime) {
    if (this.synchronized === false) {
      return;
    }
    this.updateTimers();
    if (this.gameEnd === false) {
      const drift = this.getSecondsElapsedSinceLastMoveStart(currentTime);
      this.moveTimers[currentPlayer.getValue()].subtract(drift);
      this.gameTimers[currentPlayer.getValue()].subtract(drift);
      this.resumeTimers(currentPlayer);
    }
  }
  // Resumes the timers of player. Public for testing purposes only.
  resumeTimers(player) {
    this.moveTimers[player.getValue()].resume();
    this.gameTimers[player.getValue()].resume();
  }
  // Add move time to the opponent of a player
  addMoveTime(player) {
    const secondsToAdd = 30;
    this.availableMoveTime.add(player.getOpponent(), secondsToAdd);
  }
  // Add time to the game timer of the opponent of a player
  addGameTime(player) {
    const secondsToAdd = 5 * 60;
    this.extraGameTime.add(player.getOpponent(), secondsToAdd);
  }
  // Update timers with the available time
  updateTimers() {
    for (const player of Player.PLAYERS) {
      this.moveTimers[player.getValue()].changeDuration(this.availableMoveTime.get(player));
      const playerTakenGameTime = this.takenGameTime.get(player);
      const gameTime = this.getGameDuration() + this.extraGameTime.get(player) - playerTakenGameTime;
      this.gameTimers[player.getValue()].changeDuration(gameTime);
    }
  }
  // Pauses all timers that are running
  pauseAllTimers() {
    for (const timer of this.allTimers) {
      if (timer.isIdle() === false) {
        timer.pause();
      }
    }
  }
  static \u0275fac = function OGWCTimeManagerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OGWCTimeManagerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OGWCTimeManagerService, factory: _OGWCTimeManagerService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OGWCTimeManagerService, [{
    type: Injectable
  }], null, null);
})();

// src/app/components/wrapper-components/online-game-wrapper/online-game-wrapper.component.ts
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _c0 = ["timerZeroGame"];
var _c1 = ["timerOneGame"];
var _c2 = ["timerZeroMove"];
var _c3 = ["timerOneMove"];
function OnlineGameWrapperComponent_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-game-creation", 28);
    \u0275\u0275listener("gameStartNotification", function OnlineGameWrapperComponent_Conditional_0_Conditional_0_Template_app_game_creation_gameStartNotification_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.startGame($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("gameId", ctx_r1.gameId)("rulesConfigDescription", ctx_r1.getRulesConfigDescription());
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275i18n(1, 6);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275i18n(1, 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r1.currentUser == null ? null : ctx_r1.currentUser.name);
    \u0275\u0275i18nApply(1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 52);
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Conditional_4_Conditional_1_Template, 2, 0, "span", 53)(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Conditional_4_Conditional_2_Template, 2, 1, "span", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r1.currentUser == null ? null : ctx_r1.currentUser.name) === ctx_r1.getPlayer().name ? 1 : 2);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "app-view-config", 50);
    \u0275\u0275elementStart(2, "p", 51);
    \u0275\u0275i18n(3, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Conditional_4_Template, 3, 1, "p", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("rulesConfig", ctx_r1.getConfig())("rulesConfigDescription", ctx_r1.getRulesConfigDescription())("gameName", ctx_r1.getGameName().getOrElse(""));
    \u0275\u0275advance(2);
    \u0275\u0275i18nExp(ctx_r1.getTurn() + 1);
    \u0275\u0275i18nApply(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.endGame === false ? 4 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34)(1, "span", 55);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " (");
    \u0275\u0275element(4, "app-elo", 56);
    \u0275\u0275text(5, ")");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.players[0].get().name);
    \u0275\u0275advance(2);
    \u0275\u0275property("elo", (ctx_r1.game == null ? null : ctx_r1.game.playerZeroElo) || 0);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.gameComponent.getScoreString(ctx_r1.Player.ZERO));
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 39)(1, "span", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " (");
    \u0275\u0275element(4, "app-elo", 56);
    \u0275\u0275text(5, ") ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.players[1].get().name);
    \u0275\u0275advance(2);
    \u0275\u0275property("elo", (ctx_r1.game == null ? null : ctx_r1.game.playerOneElo) || 0);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.gameComponent.getScoreString(ctx_r1.Player.ONE));
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p", 58);
    \u0275\u0275i18n(2, 8);
    \u0275\u0275elementEnd()();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275i18n(1, 9);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 60);
    \u0275\u0275i18n(1, 10);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 61);
    \u0275\u0275i18n(1, 11);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Conditional_1_Template, 2, 0, "p", 59);
    \u0275\u0275conditionalCreate(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Conditional_2_Template, 2, 0, "p", 60);
    \u0275\u0275conditionalCreate(3, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Conditional_3_Template, 2, 0, "p", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getDrawAccepter().name === ctx_r1.getPlayer().name ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getDrawAccepter().name !== ctx_r1.getPlayer().name && ctx_r1.isPlaying() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isPlaying() === false ? 3 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 62);
    \u0275\u0275i18n(1, 12);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 63);
    \u0275\u0275i18n(1, 13);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 64);
    \u0275\u0275i18n(1, 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r1.getWinner().name);
    \u0275\u0275i18nApply(1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Conditional_1_Template, 2, 0, "p", 62);
    \u0275\u0275conditionalCreate(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Conditional_2_Template, 2, 0, "p", 63);
    \u0275\u0275conditionalCreate(3, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Conditional_3_Template, 2, 1, "p", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getWinner().name === ctx_r1.getPlayer().name ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getLoser().name === ctx_r1.getPlayer().name && ctx_r1.isPlaying() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isPlaying() === false ? 3 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 62);
    \u0275\u0275i18n(1, 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r1.getLoser().name);
    \u0275\u0275i18nApply(1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 63);
    \u0275\u0275i18n(1, 16);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 64);
    \u0275\u0275i18n(1, 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r1.getLoser().name);
    \u0275\u0275i18nApply(1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Conditional_1_Template, 2, 1, "p", 62);
    \u0275\u0275conditionalCreate(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Conditional_2_Template, 2, 0, "p", 63);
    \u0275\u0275conditionalCreate(3, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Conditional_3_Template, 2, 1, "p", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getWinner().name === ctx_r1.getPlayer().name ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getLoser().name === ctx_r1.getPlayer().name && ctx_r1.isPlaying() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isPlaying() === false ? 3 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275i18n(1, 18);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275i18n(1, 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275i18nExp(ctx_r1.getLoser().name);
    \u0275\u0275i18nApply(1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_5_Conditional_1_Template, 2, 0, "p", 65);
    \u0275\u0275conditionalCreate(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_5_Conditional_2_Template, 2, 1, "p", 65);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getWinner().name !== ctx_r1.getPlayer().name && ctx_r1.isPlaying() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isPlaying() === false || ctx_r1.getWinner().name === ctx_r1.getPlayer().name ? 2 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_1_Template, 3, 0, "div");
    \u0275\u0275conditionalCreate(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_2_Template, 4, 3, "div");
    \u0275\u0275conditionalCreate(3, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_3_Template, 4, 3, "div");
    \u0275\u0275conditionalCreate(4, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_4_Template, 4, 3, "div");
    \u0275\u0275conditionalCreate(5, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Conditional_5_Template, 3, 2, "div");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.game.result === "HardDraw" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isAgreedDraw() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isWin() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isTimeout() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isResign() ? 5 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_For_5_Template_button_click_0_listener() {
      const request_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.propose(request_r6));
    });
    \u0275\u0275text(1);
    \u0275\u0275element(2, "fa-icon", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const request_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("id", \u0275\u0275interpolate1("propose", request_r6))("disabled", ctx_r1.requestAvailable(request_r6) === false);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.requestInfos[request_r6].textForRequest(), "\xA0\xA0");
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r1.requestInfos[request_r6].icon);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 69);
    \u0275\u0275listener("click", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.resign());
    });
    \u0275\u0275i18n(1, 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 70);
    \u0275\u0275listener("click", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.gameComponent.pass());
    });
    \u0275\u0275i18n(3, 21);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_For_5_Template, 3, 5, "button", 71, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r1.canResign() === false);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.canPass() === false);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.allRequests);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 66)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275element(3, "fa-icon", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 74);
    \u0275\u0275listener("click", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_1_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.accept());
    });
    \u0275\u0275i18n(5, 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 75);
    \u0275\u0275listener("click", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_1_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.reject());
    });
    \u0275\u0275i18n(7, 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.requestInfos[ctx_r1.getRequestAwaitingReplyFromUs().get()].textForReply(), "\xA0\xA0 ");
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r1.requestInfos[ctx_r1.getRequestAwaitingReplyFromUs().get()].icon);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67)(1, "p")(2, "span");
    \u0275\u0275i18nStart(3, 24);
    \u0275\u0275element(4, "fa-icon", 73);
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275property("icon", ctx_r1.requestInfos[ctx_r1.deniedRequest().get()].icon);
    \u0275\u0275i18nExp(ctx_r1.requestInfos[ctx_r1.deniedRequest().get()].name());
    \u0275\u0275i18nApply(3);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "p")(2, "span");
    \u0275\u0275i18nStart(3, 25);
    \u0275\u0275element(4, "fa-icon", 73);
    \u0275\u0275i18nEnd();
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275property("icon", ctx_r1.requestInfos[ctx_r1.getRequestAwaitingReplyFromOpponent().get()].icon);
    \u0275\u0275i18nExp(ctx_r1.requestInfos[ctx_r1.getRequestAwaitingReplyFromOpponent().get()].name());
    \u0275\u0275i18nApply(3);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_0_Template, 6, 2)(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_1_Template, 8, 2, "div", 66);
    \u0275\u0275conditionalCreate(2, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_2_Template, 5, 2, "div", 67);
    \u0275\u0275conditionalCreate(3, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Conditional_3_Template, 5, 2, "div", 68);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.mustReply() === false ? 0 : 1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.deniedRequest().isPresent() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getRequestAwaitingReplyFromOpponent().isPresent() ? 3 : -1);
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275i18n(1, 26);
    \u0275\u0275elementEnd();
  }
}
function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 29)(2, "div", 30)(3, "div", 31);
    \u0275\u0275conditionalCreate(4, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_4_Template, 5, 5, "div", 32);
    \u0275\u0275elementStart(5, "div", 33);
    \u0275\u0275conditionalCreate(6, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_6_Template, 6, 2, "p", 34);
    \u0275\u0275conditionalCreate(7, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_7_Template, 2, 1, "p", 35);
    \u0275\u0275elementStart(8, "app-timer", 36, 0);
    \u0275\u0275listener("outOfTimeAction", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_outOfTimeAction_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reachedOutOfTime(ctx_r1.Player.ZERO));
    })("addTimeToOpponent", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_addTimeToOpponent_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addGameTime());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "app-timer", 37, 1);
    \u0275\u0275listener("outOfTimeAction", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_outOfTimeAction_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reachedOutOfTime(ctx_r1.Player.ZERO));
    })("addTimeToOpponent", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_addTimeToOpponent_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addMoveTime());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 38);
    \u0275\u0275conditionalCreate(13, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_13_Template, 6, 2, "p", 39);
    \u0275\u0275conditionalCreate(14, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_14_Template, 2, 1, "p", 40);
    \u0275\u0275elementStart(15, "app-timer", 41, 2);
    \u0275\u0275listener("outOfTimeAction", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_outOfTimeAction_15_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reachedOutOfTime(ctx_r1.Player.ONE));
    })("addTimeToOpponent", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_addTimeToOpponent_15_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addGameTime());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "app-timer", 42, 3);
    \u0275\u0275listener("outOfTimeAction", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_outOfTimeAction_17_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reachedOutOfTime(ctx_r1.Player.ONE));
    })("addTimeToOpponent", function OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template_app_timer_addTimeToOpponent_17_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addMoveTime());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(19, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_19_Template, 6, 5, "div", 43);
    \u0275\u0275conditionalCreate(20, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_20_Template, 4, 3);
    \u0275\u0275conditionalCreate(21, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Conditional_21_Template, 2, 0, "button", 44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 45)(23, "div", 46)(24, "div", 47);
    \u0275\u0275element(25, "div", null, 4);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(27, "div", 48)(28, "div", 49);
    \u0275\u0275element(29, "app-chat");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.game !== null ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.players[0].isPresent() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.game !== null && ctx_r1.gameComponent && ctx_r1.gameComponent.hasScores() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("dangerTimeLimit", 60)("active", ctx_r1.game === null ? false : ctx_r1.getTurn() % 2 === 0)("canAddTime", ctx_r1.role === ctx_r1.Player.ONE && ctx_r1.endGame === false)("timeToAdd", ctx_r1.gameTimeMessage)("debugName", "ZERO game")("player", ctx_r1.Player.ZERO);
    \u0275\u0275advance(2);
    \u0275\u0275property("dangerTimeLimit", 15)("active", ctx_r1.game === null ? false : ctx_r1.getTurn() % 2 === 0)("canAddTime", ctx_r1.role === ctx_r1.Player.ONE && ctx_r1.endGame === false)("timeToAdd", ctx_r1.moveTimeMessage)("debugName", "ZERO move")("player", ctx_r1.Player.ZERO);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.players[1].isPresent() ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.game !== null && ctx_r1.gameComponent && ctx_r1.gameComponent.hasScores() ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("dangerTimeLimit", 60)("active", ctx_r1.game === null ? false : ctx_r1.getTurn() % 2 === 1)("canAddTime", ctx_r1.role === ctx_r1.Player.ZERO && ctx_r1.endGame === false)("timeToAdd", ctx_r1.gameTimeMessage)("debugName", "ONE game")("player", ctx_r1.Player.ONE);
    \u0275\u0275advance(2);
    \u0275\u0275property("dangerTimeLimit", 15)("active", ctx_r1.game === null ? false : ctx_r1.getTurn() % 2 === 1)("canAddTime", ctx_r1.role === ctx_r1.Player.ZERO && ctx_r1.endGame === false)("timeToAdd", ctx_r1.moveTimeMessage)("debugName", "ONE move")("player", ctx_r1.Player.ONE);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.endGame && ctx_r1.game !== null ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isPlaying() ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.endGame ? 21 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getBoardHighlight());
  }
}
function OnlineGameWrapperComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OnlineGameWrapperComponent_Conditional_0_Conditional_0_Template, 1, 2, "app-game-creation", 27);
    \u0275\u0275conditionalCreate(1, OnlineGameWrapperComponent_Conditional_0_Conditional_1_Template, 30, 33, "div");
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.gameStarted === false ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.gameStarted ? 1 : -1);
  }
}
var OnlineGameWrapperMessages = class {
  static CANNOT_PLAY_AS_OBSERVER = () => $localize`You are an observer in this game, you cannot play.`;
  static MUST_ANSWER_REQUEST = () => $localize`You must answer your opponent's request.`;
};
var OnlineGameWrapperComponent = class OnlineGameWrapperComponent2 extends GameWrapper {
  connectedUserService = inject(ConnectedUserService);
  gameService = inject(GameService);
  timeManager = inject(OGWCTimeManagerService);
  requestManager = inject(OGWCRequestManagerService);
  cdr = inject(ChangeDetectorRef);
  timerZeroGame = viewChild("timerZeroGame", ...ngDevMode ? [{ debugName: "timerZeroGame" }] : []);
  timerOneGame = viewChild("timerOneGame", ...ngDevMode ? [{ debugName: "timerOneGame" }] : []);
  timerZeroMove = viewChild("timerZeroMove", ...ngDevMode ? [{ debugName: "timerZeroMove" }] : []);
  timerOneMove = viewChild("timerOneMove", ...ngDevMode ? [{ debugName: "timerOneMove" }] : []);
  game = null;
  gameId;
  // Initialized in ngOnInit
  gameStarted = false;
  opponent = null;
  currentUser = null;
  isSynced = false;
  configRoom;
  gameSubscription = new Subscription();
  OFFLINE_FONT_COLOR = { color: "lightgrey" };
  gameTimeMessage = $localize`05:00`;
  moveTimeMessage = $localize`00:30`;
  requestInfos = OGWCRequestManagerService.requestInfos;
  allRequests = ["TakeBack", "Draw", "Rematch"];
  moveSentButNotReceivedYet = false;
  viewConfig = false;
  extractGameIdFromURL() {
    return Utils.getNonNullable(this.activatedRoute.snapshot.paramMap.get("id"));
  }
  isPlaying() {
    return this.isSynced && this.role.isPlayer();
  }
  getPlayer() {
    return this.connectedUserService.user.get().toMinimalUser();
  }
  redirectIfGameDoesNotExist() {
    return __async(this, null, function* () {
      const urlName = this.getGameUrlName();
      const gameExists = GameInfo.getByUrlName(urlName).isPresent();
      if (gameExists === false) {
        const message = GameWrapperMessages.NO_MATCHING_GAME(urlName);
        yield this.router.navigate(["/notFound", message], { skipLocationChange: true });
      }
    });
  }
  setGameIdOrRedirect() {
    this.gameId = this.extractGameIdFromURL();
    return this.redirectIfGameDoesNotExist();
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.setGameIdOrRedirect();
    });
  }
  startGame(configRoom) {
    return __async(this, null, function* () {
      Utils.assert(this.gameStarted === false, "Should not start already started game");
      this.configRoom = configRoom;
      this.gameStarted = true;
      setTimeout(() => __async(this, null, function* () {
        const createdSuccessfully = yield this.createMatchingGameComponent();
        this.timeManager.setTimers([this.timerZeroMove(), this.timerOneMove()], [this.timerZeroGame(), this.timerOneGame()]);
        Utils.assert(createdSuccessfully, "Game should be created successfully, otherwise game-creation would have redirected");
        Utils.assert(this.gameComponent !== null, "Game component should exist");
        this.gameComponent.config = configRoom.rulesConfig;
        yield this.subscribeToGameUpdates();
      }), 2);
    });
  }
  subscribeToGameUpdates() {
    return __async(this, null, function* () {
      const mutex = new Mutex();
      const onGameUpdate = (game) => {
        return mutex.runExclusive(() => __async(this, null, function* () {
          yield this.onGameUpdate(game);
        }));
      };
      const onGameEvent = (event, serverTime) => {
        return mutex.runExclusive(() => __async(this, null, function* () {
          yield this.onGameEvent(event, serverTime);
        }));
      };
      this.gameSubscription = yield this.gameService.subscribeTo(this.gameId, onGameUpdate, onGameEvent, (error) => this.onError(error));
    });
  }
  onError(reason) {
    this.messageDisplayer.criticalMessage($localize`Unexpected error from backend: ${reason}`);
  }
  onGameUpdate(game) {
    return __async(this, null, function* () {
      this.game = game;
      this.cdr.detectChanges();
    });
  }
  onGameStart() {
    return __async(this, null, function* () {
      const turn = this.gameComponent.getTurn();
      Utils.assert(turn === 0, "turn should always be 0 upon game start");
      yield this.initializePlayersData();
      this.timeManager.onGameStart(this.configRoom, Utils.getNonNullable(this.game), this.players);
      this.requestManager.onGameStart();
    });
  }
  onGameEvent(event, serverTime) {
    return __async(this, null, function* () {
      this.timeManager.beforeEvent();
      switch (event.eventType) {
        case "Move":
          yield this.onReceivedMove(event);
          break;
        case "Request":
          this.requestManager.onReceivedRequest(event);
          break;
        case "Reply":
          const mustHandle = yield this.requestManager.onReceivedReply(event);
          if (mustHandle) {
            yield this.handleReply(event);
          }
          break;
        default:
          Utils.expectToBe(event.eventType, "Action", "Event should be an action");
          if (event.action === "StartGame")
            yield this.onGameStart();
          if (event.action === "EndGame")
            yield this.onGameEnd();
          if (event.action === "Sync")
            this.isSynced = true;
          this.timeManager.onReceivedAction(event);
          break;
      }
      this.timeManager.afterEvent(Player.ofTurn(this.gameComponent.getTurn()), serverTime);
      this.cdr.detectChanges();
    });
  }
  handleReply(reply) {
    return __async(this, null, function* () {
      switch (reply.requestType) {
        case "TakeBack":
          const accepter = this.timeManager.playerOfMinimalUser(reply.user);
          yield this.takeBackToPreviousPlayerTurn(accepter.getOpponent());
          break;
        case "Rematch":
          if (this.isSynced === false) {
            break;
          }
          yield this.router.navigate(["/nextGameLoading"]);
          const urlName = this.getGameUrlName();
          yield this.router.navigate(["/play", urlName, reply.data]);
          break;
        case "Draw":
          break;
      }
    });
  }
  onGameEnd() {
    return __async(this, null, function* () {
      yield this.setInteractive(false);
      this.endGame = true;
      this.cdr.detectChanges();
    });
  }
  onReceivedMove(moveEvent) {
    return __async(this, null, function* () {
      if (this.moveSentButNotReceivedYet) {
        this.moveSentButNotReceivedYet = false;
      } else {
        const move = this.gameComponent.encoder.decode(moveEvent.move);
        this.gameComponent.hideLastMove();
        yield this.applyMove(move, this.isSynced);
      }
      yield this.setCurrentPlayerAccordingToCurrentTurn();
      this.timeManager.onReceivedMove(moveEvent);
      this.requestManager.onReceivedMove();
    });
  }
  getTurn() {
    return this.gameComponent.getTurn();
  }
  setCurrentPlayerAccordingToCurrentTurn() {
    return __async(this, null, function* () {
      this.currentUser = this.players[this.getTurn() % 2].get();
      yield this.setInteractive(this.currentUser.name === this.getPlayer().name, false);
    });
  }
  takeBackToPreviousPlayerTurn(player) {
    return __async(this, null, function* () {
      this.gameComponent.node = this.gameComponent.node.parent.get();
      if (this.gameComponent.getCurrentPlayer() !== player) {
        Utils.assert(this.gameComponent.getTurn() > 0, "Should not allow player that never moved to take back");
        this.gameComponent.node = this.gameComponent.node.parent.get();
      }
      yield this.setCurrentPlayerAccordingToCurrentTurn();
      const triggerAnimation = this.gameComponent.getTurn() === 0;
      yield this.showCurrentState(triggerAnimation);
    });
  }
  canResign() {
    Utils.assert(this.isPlaying(), "Non playing should not call canResign");
    if (this.endGame) {
      return false;
    }
    const hasOpponent = this.opponent != null;
    return hasOpponent;
  }
  requestAvailable(request) {
    switch (request) {
      case "TakeBack":
        return this.canAskTakeBack();
      case "Draw":
        return this.canProposeDraw();
      default:
        Utils.expectToBe(request, "Rematch");
        return this.canProposeRematch();
    }
  }
  mustReply() {
    return this.getRequestAwaitingReplyFromUs().isPresent();
  }
  getRequestAwaitingReplyFromUs() {
    Utils.assert(this.role.isPlayer(), "User should be playing");
    return this.requestManager.getUnrespondedRequestFrom(Utils.getNonNullable(this.opponent));
  }
  getRequestAwaitingReplyFromOpponent() {
    Utils.assert(this.role.isPlayer(), "User should be playing");
    return this.requestManager.getUnrespondedRequestFrom(Utils.getNonNullable(this.currentUser));
  }
  deniedRequest() {
    return this.requestManager.deniedRequest();
  }
  canPass() {
    Utils.assert(this.isPlaying(), "Non playing should not call canPass");
    if (this.endGame)
      return false;
    if (this.currentUser?.name !== this.getPlayer().name)
      return false;
    return this.gameComponent.canPass;
  }
  canAskTakeBack() {
    Utils.assert(this.isPlaying(), "Non playing should not call canAskTakeBack");
    Utils.assert(this.game != null, "should not call canAskTakeBack when game is not defined yet");
    if (this.endGame)
      return false;
    if (this.gameComponent.getTurn() <= this.role.getValue())
      return false;
    return this.requestManager.canMakeRequest("TakeBack");
  }
  canProposeDraw() {
    Utils.assert(this.isPlaying(), "Non playing should not call canProposeDraw");
    if (this.endGame)
      return false;
    return this.requestManager.canMakeRequest("Draw");
  }
  canProposeRematch() {
    return this.endGame && this.requestManager.canMakeRequest("Rematch");
  }
  canUserPlay(clickedElementName) {
    return __async(this, null, function* () {
      if (this.role.isNone()) {
        const message = OnlineGameWrapperMessages.CANNOT_PLAY_AS_OBSERVER();
        return MGPValidation.failure(message);
      }
      const result = yield __superGet(OnlineGameWrapperComponent2.prototype, this, "canUserPlay").call(this, clickedElementName);
      if (result.isFailure()) {
        return result;
      } else if (this.mustReply()) {
        return MGPValidation.failure(OnlineGameWrapperMessages.MUST_ANSWER_REQUEST());
      } else {
        return MGPValidation.SUCCESS;
      }
    });
  }
  initializePlayersData() {
    return __async(this, null, function* () {
      const game = Utils.getNonNullable(this.game);
      this.players = [
        MGPOptional.of(game.playerZero),
        MGPOptional.ofNullable(game.playerOne)
      ];
      yield this.setCurrentPlayerAccordingToCurrentTurn();
      yield this.setRealObserverRole();
    });
  }
  setRealObserverRole() {
    return __async(this, null, function* () {
      if (this.players[0].equalsValue(this.getPlayer())) {
        yield this.setRole(Player.ZERO);
        this.opponent = this.players[1].get();
      } else if (this.players[1].equalsValue(this.getPlayer())) {
        yield this.setRole(Player.ONE);
        this.opponent = this.players[0].get();
      } else {
        yield this.setRole(PlayerOrNone.NONE);
      }
    });
  }
  onLegalUserMove(move) {
    return __async(this, null, function* () {
      yield this.applyMove(move, false);
      const config = this.getConfig();
      const gameStatus = this.gameComponent.rules.getGameStatus(this.gameComponent.node, config);
      const encodedMove = this.gameComponent.encoder.encode(move);
      this.moveSentButNotReceivedYet = true;
      yield this.gameService.addMove(encodedMove);
      if (gameStatus.isEndGame) {
        yield this.gameService.endGame(gameStatus.winner);
      }
    });
  }
  applyMove(move, triggerAnimation) {
    return __async(this, null, function* () {
      const oldNode = this.gameComponent.node;
      const state = oldNode.gameState;
      const config = this.getConfig();
      const legality = this.gameComponent.rules.isLegal(move, state, config);
      Utils.assert(legality.isSuccess(), "OGWC.applyMove called with an illegal move");
      const stateAfterMove = this.gameComponent.rules.applyLegalMove(move, state, config, legality.get());
      this.gameComponent.node = new GameNode(stateAfterMove, MGPOptional.of(oldNode), MGPOptional.of(move));
      yield this.showNewMove(triggerAnimation);
    });
  }
  // Called by the resign button
  resign() {
    return __async(this, null, function* () {
      yield this.gameService.resign();
    });
  }
  // Called by the clocks
  reachedOutOfTime(player) {
    return __async(this, null, function* () {
      if (this.isPlaying() === false) {
        return;
      }
      yield this.gameService.notifyTimeout(player);
    });
  }
  // Called by the corresponding button
  propose(request) {
    return __async(this, null, function* () {
      Utils.assert(this.role.isPlayer(), "cannot propose request if not player");
      switch (request) {
        case "Rematch":
          return this.gameService.proposeRematch();
        case "Draw":
          return this.gameService.proposeDraw();
        default:
          Utils.expectToBe(request, "TakeBack");
          return this.gameService.askTakeBack();
      }
    });
  }
  // Called by the 'accept' button
  accept() {
    return __async(this, null, function* () {
      Utils.assert(this.role.isPlayer(), "cannot accept request if not player");
      const request = this.requestManager.getCurrentRequest().get().requestType;
      switch (request) {
        case "Rematch":
          return this.gameService.acceptRematch();
        case "Draw":
          return this.gameService.acceptDraw();
        default:
          Utils.expectToBe(request, "TakeBack");
          return this.gameService.acceptTakeBack();
      }
    });
  }
  // Called by the 'reject' button
  reject() {
    return __async(this, null, function* () {
      Utils.assert(this.role.isPlayer(), "cannot reject request if not player");
      const request = this.requestManager.getCurrentRequest().get().requestType;
      switch (request) {
        case "Rematch":
          return this.gameService.rejectRematch();
        case "Draw":
          return this.gameService.rejectDraw();
        default:
          Utils.expectToBe(request, "TakeBack");
          return this.gameService.rejectTakeBack();
      }
    });
  }
  // Called by the 'AddGameTime' button
  addGameTime() {
    return this.gameService.addGameTime();
  }
  // Called by the 'AddMoveTime' button
  addMoveTime() {
    return this.gameService.addMoveTime();
  }
  onCancelMove(reason) {
    return __async(this, null, function* () {
      yield __superGet(OnlineGameWrapperComponent2.prototype, this, "onCancelMove").call(this, reason);
      if (this.gameComponent.node.previousMove.isPresent()) {
        const move = this.gameComponent.node.previousMove.get();
        yield this.gameComponent.showLastMove(move);
      }
      this.cdr.detectChanges();
    });
  }
  ngOnDestroy() {
    return __async(this, null, function* () {
      this.gameSubscription.unsubscribe();
    });
  }
  getConfig() {
    return this.configRoom.rulesConfig;
  }
  isAgreedDraw() {
    const result = Utils.getNonNullable(this.game).result;
    return result === "AgreedDrawByZero" || result === "AgreedDrawByOne";
  }
  getDrawAccepter() {
    const result = Utils.getNonNullable(this.game).result;
    switch (result) {
      case "AgreedDrawByZero":
        return Utils.getNonNullable(this.game).playerZero;
      default:
        Utils.expectToBe(result, "AgreedDrawByOne");
        return Utils.getNonNullable(this.game).playerOne;
    }
  }
  isWin() {
    const result = Utils.getNonNullable(this.game).result;
    return result === "VictoryOfZero" || result === "VictoryOfOne";
  }
  isTimeout() {
    const result = Utils.getNonNullable(this.game).result;
    return result === "TimeoutOfZero" || result === "TimeoutOfOne";
  }
  isResign() {
    const result = Utils.getNonNullable(this.game).result;
    return result === "ResignOfZero" || result === "ResignOfOne";
  }
  getWinner() {
    const result = Utils.getNonNullable(this.game).result;
    switch (result) {
      case "VictoryOfOne":
      case "TimeoutOfZero":
      case "ResignOfZero":
        return Utils.getNonNullable(this.game).playerOne;
      default:
        Utils.expectToBeMultiple(result, ["VictoryOfZero", "TimeoutOfOne", "ResignOfOne"]);
        return Utils.getNonNullable(this.game).playerZero;
    }
  }
  getLoser() {
    const result = Utils.getNonNullable(this.game).result;
    switch (result) {
      case "VictoryOfOne":
      case "TimeoutOfZero":
      case "ResignOfZero":
        return Utils.getNonNullable(this.game).playerZero;
      default:
        Utils.expectToBeMultiple(result, ["VictoryOfZero", "TimeoutOfOne", "ResignOfOne"]);
        return Utils.getNonNullable(this.game).playerOne;
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275OnlineGameWrapperComponent_BaseFactory;
    return function OnlineGameWrapperComponent_Factory(__ngFactoryType__) {
      return (\u0275OnlineGameWrapperComponent_BaseFactory || (\u0275OnlineGameWrapperComponent_BaseFactory = \u0275\u0275getInheritedFactory(OnlineGameWrapperComponent2)))(__ngFactoryType__ || OnlineGameWrapperComponent2);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: OnlineGameWrapperComponent2, selectors: [["app-online-game-wrapper"]], viewQuery: function OnlineGameWrapperComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.timerZeroGame, _c0, 5);
      \u0275\u0275viewQuerySignal(ctx.timerOneGame, _c1, 5);
      \u0275\u0275viewQuerySignal(ctx.timerZeroMove, _c2, 5);
      \u0275\u0275viewQuerySignal(ctx.timerOneMove, _c3, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(4);
    }
  }, features: [\u0275\u0275ProvidersFeature([
    OGWCTimeManagerService,
    OGWCRequestManagerService
  ]), \u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: () => {
    let i18n_0;
    if (false) {
      const MSG_EXTERNAL_6130341002326455223$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_0 = goog.getMsg("Turn n\xB0{$interpolation}", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getTurn() + 1 }}" } });
      i18n_0 = MSG_EXTERNAL_6130341002326455223$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_0;
    } else {
      i18n_0 = $localize`Turn n°${"\uFFFD0\uFFFD"}:INTERPOLATION:`;
    }
    let i18n_1;
    if (false) {
      const MSG_EXTERNAL_5468318552081538104$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_1 = goog.getMsg("It is your turn.");
      i18n_1 = MSG_EXTERNAL_5468318552081538104$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_1;
    } else {
      i18n_1 = $localize`It is your turn.`;
    }
    let i18n_2;
    if (false) {
      const MSG_EXTERNAL_8760030364734366861$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_2 = goog.getMsg("It is {$interpolation}'s turn.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ currentUser?.name }}" } });
      i18n_2 = MSG_EXTERNAL_8760030364734366861$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_2;
    } else {
      i18n_2 = $localize`It is ${"\uFFFD0\uFFFD"}:INTERPOLATION:'s turn.`;
    }
    let i18n_3;
    if (false) {
      const MSG_EXTERNAL_8647687729200262691$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_3 = goog.getMsg("Draw");
      i18n_3 = MSG_EXTERNAL_8647687729200262691$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_3;
    } else {
      i18n_3 = $localize`Draw`;
    }
    let i18n_4;
    if (false) {
      const MSG_EXTERNAL_4830863788651301313$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_4 = goog.getMsg("You agreed to draw.");
      i18n_4 = MSG_EXTERNAL_4830863788651301313$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_4;
    } else {
      i18n_4 = $localize`You agreed to draw.`;
    }
    let i18n_5;
    if (false) {
      const MSG_EXTERNAL_5730736324595001106$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_5 = goog.getMsg("Your draw proposal has been accepted.");
      i18n_5 = MSG_EXTERNAL_5730736324595001106$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_5;
    } else {
      i18n_5 = $localize`Your draw proposal has been accepted.`;
    }
    let i18n_6;
    if (false) {
      const MSG_EXTERNAL_5277703651684233917$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_6 = goog.getMsg("Players agreed to draw.");
      i18n_6 = MSG_EXTERNAL_5277703651684233917$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_6;
    } else {
      i18n_6 = $localize`Players agreed to draw.`;
    }
    let i18n_7;
    if (false) {
      const MSG_EXTERNAL_7815479892408473764$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_7 = goog.getMsg("You won.");
      i18n_7 = MSG_EXTERNAL_7815479892408473764$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_7;
    } else {
      i18n_7 = $localize`You won.`;
    }
    let i18n_8;
    if (false) {
      const MSG_EXTERNAL_860662988722297223$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_8 = goog.getMsg("You lost.");
      i18n_8 = MSG_EXTERNAL_860662988722297223$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_8;
    } else {
      i18n_8 = $localize`You lost.`;
    }
    let i18n_9;
    if (false) {
      const MSG_EXTERNAL_6668034941058386771$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_9 = goog.getMsg("{$interpolation} won.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getWinner().name }}" } });
      i18n_9 = MSG_EXTERNAL_6668034941058386771$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_9;
    } else {
      i18n_9 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: won.`;
    }
    let i18n_10;
    if (false) {
      const MSG_EXTERNAL_3746325662952168223$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_10 = goog.getMsg("{$interpolation} has reached their time limit. You won.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getLoser().name }}" } });
      i18n_10 = MSG_EXTERNAL_3746325662952168223$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_10;
    } else {
      i18n_10 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: has reached their time limit. You won.`;
    }
    let i18n_11;
    if (false) {
      const MSG_EXTERNAL_7814033294193818165$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_11 = goog.getMsg("You reached your time limit.");
      i18n_11 = MSG_EXTERNAL_7814033294193818165$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_11;
    } else {
      i18n_11 = $localize`You reached your time limit.`;
    }
    let i18n_12;
    if (false) {
      const MSG_EXTERNAL_1902896811801320243$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_12 = goog.getMsg("{$interpolation} has reached their time limit.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getLoser().name }}" } });
      i18n_12 = MSG_EXTERNAL_1902896811801320243$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_12;
    } else {
      i18n_12 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: has reached their time limit.`;
    }
    let i18n_13;
    if (false) {
      const MSG_EXTERNAL_2826140657122926749$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_13 = goog.getMsg("You resigned.");
      i18n_13 = MSG_EXTERNAL_2826140657122926749$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_13;
    } else {
      i18n_13 = $localize`You resigned.`;
    }
    let i18n_14;
    if (false) {
      const MSG_EXTERNAL_1604630377871319246$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_14 = goog.getMsg("{$interpolation} has resigned.", { "interpolation": "\uFFFD0\uFFFD" }, { original_code: { "interpolation": "{{ getLoser().name }}" } });
      i18n_14 = MSG_EXTERNAL_1604630377871319246$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_14;
    } else {
      i18n_14 = $localize`${"\uFFFD0\uFFFD"}:INTERPOLATION: has resigned.`;
    }
    let i18n_15;
    if (false) {
      const MSG_EXTERNAL_3492340771384313804$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_15 = goog.getMsg("Resign");
      i18n_15 = MSG_EXTERNAL_3492340771384313804$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_15;
    } else {
      i18n_15 = $localize`Resign`;
    }
    let i18n_16;
    if (false) {
      const MSG_EXTERNAL_6267418979719843573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_16 = goog.getMsg("Pass a turn");
      i18n_16 = MSG_EXTERNAL_6267418979719843573$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_16;
    } else {
      i18n_16 = $localize`Pass a turn`;
    }
    let i18n_17;
    if (false) {
      const MSG_EXTERNAL_8905995985388209337$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_17 = goog.getMsg("Accept");
      i18n_17 = MSG_EXTERNAL_8905995985388209337$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_17;
    } else {
      i18n_17 = $localize`Accept`;
    }
    let i18n_18;
    if (false) {
      const MSG_EXTERNAL_7378878529334768232$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_18 = goog.getMsg("Reject");
      i18n_18 = MSG_EXTERNAL_7378878529334768232$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_18;
    } else {
      i18n_18 = $localize`Reject`;
    }
    let i18n_19;
    if (false) {
      const MSG_EXTERNAL_4369718706050623202$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_19 = goog.getMsg("Your {$interpolation} request has been rejected.\xA0\xA0{$startTagFaIcon}{$closeTagFaIcon}", { "closeTagFaIcon": "\uFFFD/#4\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagFaIcon": "\uFFFD#4\uFFFD" }, { original_code: { "closeTagFaIcon": "</fa-icon>", "interpolation": "{{ requestInfos[deniedRequest().get()].name() }}", "startTagFaIcon": '<fa-icon [icon]="requestInfos[deniedRequest().get()].icon">' } });
      i18n_19 = MSG_EXTERNAL_4369718706050623202$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_19;
    } else {
      i18n_19 = $localize`Your ${"\uFFFD0\uFFFD"}:INTERPOLATION: request has been rejected.  ${"\uFFFD#4\uFFFD"}:START_TAG_FA_ICON:${"\uFFFD/#4\uFFFD"}:CLOSE_TAG_FA_ICON:`;
    }
    let i18n_20;
    if (false) {
      const MSG_EXTERNAL_2588853901358121281$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_20 = goog.getMsg("Your request for a {$interpolation} has been sent.\xA0\xA0{$startTagFaIcon}{$closeTagFaIcon}", { "closeTagFaIcon": "\uFFFD/#4\uFFFD", "interpolation": "\uFFFD0\uFFFD", "startTagFaIcon": "\uFFFD#4\uFFFD" }, { original_code: { "closeTagFaIcon": "</fa-icon>", "interpolation": "{{ requestInfos[getRequestAwaitingReplyFromOpponent().get()].name() }}", "startTagFaIcon": '<fa-icon [icon]="requestInfos[getRequestAwaitingReplyFromOpponent().get()].icon">' } });
      i18n_20 = MSG_EXTERNAL_2588853901358121281$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_20;
    } else {
      i18n_20 = $localize`Your request for a ${"\uFFFD0\uFFFD"}:INTERPOLATION: has been sent.  ${"\uFFFD#4\uFFFD"}:START_TAG_FA_ICON:${"\uFFFD/#4\uFFFD"}:CLOSE_TAG_FA_ICON:`;
    }
    let i18n_21;
    if (false) {
      const MSG_EXTERNAL_4624707315308487849$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_21 = goog.getMsg("Go back to the game list");
      i18n_21 = MSG_EXTERNAL_4624707315308487849$$SRC_APP_COMPONENTS_WRAPPER_COMPONENTS_ONLINE_GAME_WRAPPER_ONLINE_GAME_WRAPPER_COMPONENT_TS_21;
    } else {
      i18n_21 = $localize`Go back to the game list`;
    }
    return [["timerZeroGame", ""], ["timerZeroMove", ""], ["timerOneGame", ""], ["timerOneMove", ""], ["board", ""], i18n_0, i18n_1, i18n_2, i18n_3, i18n_4, i18n_5, i18n_6, i18n_7, i18n_8, i18n_9, i18n_10, i18n_11, i18n_12, i18n_13, i18n_14, i18n_15, i18n_16, i18n_17, i18n_18, i18n_19, i18n_20, i18n_21, ["id", "gameCreation", 3, "gameId", "rulesConfigDescription"], ["id", "gameCreation", 3, "gameStartNotification", "gameId", "rulesConfigDescription"], ["id", "game", 1, "columns", "is-vcentered", "is-align-items-stretch"], [1, "column", "is-one-quarter", "has-text-centered"], [1, "box", "is-fullheight"], [1, "block"], [1, "block", "player0-bg"], ["id", "playerZeroIndicator", 1, "has-text-black", "player0-bg-darker", "is-size-5"], ["id", "scoreZeroIndicator", 1, "has-text-black"], ["id", "timer-zero-game", 1, "data-game-time", 3, "outOfTimeAction", "addTimeToOpponent", "dangerTimeLimit", "active", "canAddTime", "timeToAdd", "debugName", "player"], ["id", "timer-zero-move", 1, "data-move-time", 3, "outOfTimeAction", "addTimeToOpponent", "dangerTimeLimit", "active", "canAddTime", "timeToAdd", "debugName", "player"], [1, "block", "player1-bg"], ["id", "playerOneIndicator", 1, "has-text-black", "player1-bg-darker", "is-size-5"], ["id", "scoreOneIndicator", 1, "has-text-black"], ["id", "timer-one-game", 1, "data-game-time", 3, "outOfTimeAction", "addTimeToOpponent", "dangerTimeLimit", "active", "canAddTime", "timeToAdd", "debugName", "player"], ["id", "timer-one-move", 1, "data-move-time", 3, "outOfTimeAction", "addTimeToOpponent", "dangerTimeLimit", "active", "canAddTime", "timeToAdd", "debugName", "player"], ["id", "winnerIndicator", 1, "block"], ["id", "backToServerButton", "routerLink", "/lobby", 1, "button", "is-primary", "is-fullwidth", "mb-1"], [1, "column"], ["id", "board-highlight", 1, "box", "p-5", "is-fullheight", 3, "ngClass"], ["id", "board", 1, "box", "is-fullheight"], [1, "block", "mt-2"], ["id", "chat", 1, "box"], [3, "rulesConfig", "rulesConfigDescription", "gameName"], ["id", "turn-number", 1, "subtitle", "mb-2"], ["id", "currentPlayerIndicator", 1, "subtitle", "mb-2"], ["id", "playerTurn"], ["id", "opponentTurn"], ["id", "playerZeroName"], [3, "elo"], ["id", "playerOneName"], ["id", "hardDrawIndicator", 1, "title"], ["id", "youAgreedToDrawIndicator", 1, "title"], ["id", "yourOpponentAgreedToDrawIndicator", 1, "title"], ["id", "playersAgreedToDraw", 1, "title"], ["id", "youWonIndicator", 1, "title"], ["id", "youLostIndicator", 1, "title"], [1, "title"], ["id", "resignIndicator", 1, "title"], [1, "notification"], ["id", "requestRejected", 1, "notification", "is-danger"], ["id", "getRequestAwaitingReply", 1, "notification"], ["id", "resign", 1, "button", "is-fullwidth", "mb-1", "is-danger", 3, "click", "disabled"], ["id", "pass", 1, "button", "is-fullwidth", "mb-1", "is-success", 3, "click", "disabled"], [1, "button", "is-fullwidth", "mb-1", 3, "id", "disabled"], [1, "button", "is-fullwidth", "mb-1", 3, "click", "id", "disabled"], [3, "icon"], ["id", "accept", 1, "button", "is-fullwidth", "mb-1", "is-success", 3, "click"], ["id", "reject", 1, "button", "is-fullwidth", "mb-1", "is-danger", 3, "click"]];
  }, template: function OnlineGameWrapperComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, OnlineGameWrapperComponent_Conditional_0_Template, 2, 2);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.getGameName().isPresent() ? 0 : -1);
    }
  }, dependencies: [
    ChatComponent,
    EloComponent,
    FaIconComponent,
    GameCreationComponent,
    NgClass,
    RouterLink,
    TimerComponent,
    ViewConfigComponent
  ], encapsulation: 2, changeDetection: 0 });
};
OnlineGameWrapperComponent = __decorate3([
  Debug.log
], OnlineGameWrapperComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OnlineGameWrapperComponent, [{
    type: Component,
    args: [{ selector: "app-online-game-wrapper", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
      OGWCTimeManagerService,
      OGWCRequestManagerService
    ], imports: [
      ChatComponent,
      EloComponent,
      FaIconComponent,
      GameCreationComponent,
      NgClass,
      RouterLink,
      TimerComponent,
      ViewConfigComponent
    ], template: `@if (getGameName().isPresent()) {
    @if (gameStarted === false) {
        <app-game-creation id="gameCreation"
                           [gameId]="gameId"
                           [rulesConfigDescription]="getRulesConfigDescription()"
                           (gameStartNotification)="startGame($event)">
        </app-game-creation>
    }

    @if (gameStarted) {
        <div>
            <div id="game"
                 class="columns is-vcentered is-align-items-stretch">
                <div class="column is-one-quarter has-text-centered">
                    <div class="box is-fullheight">
                        @if (game !== null) {
                            <div class="block">
                                <app-view-config [rulesConfig]="getConfig()"
                                                 [rulesConfigDescription]="getRulesConfigDescription()"
                                                 [gameName]="getGameName().getOrElse('')">
                                </app-view-config>
                                <p class="subtitle mb-2"
                                   id="turn-number"
                                   i18n>Turn n\xB0{{ getTurn() + 1 }}</p>
                                @if (endGame === false) {
                                    <p class="subtitle mb-2"
                                       id="currentPlayerIndicator">
                                        @if (currentUser?.name === getPlayer().name) {
                                            <span id="playerTurn"
                                                  i18n>It is your turn.</span>
                                        } @else {
                                            <span id="opponentTurn"
                                                  i18n>It is {{ currentUser?.name }}'s turn.</span>
                                        }
                                    </p>
                                }
                            </div>
                        }
                        <div class="block player0-bg">
                            @if (players[0].isPresent()) {
                                <p id="playerZeroIndicator"
                                   class="has-text-black player0-bg-darker is-size-5"><span id="playerZeroName">{{ players[0].get().name }}</span> (<app-elo [elo]="game?.playerZeroElo || 0"/>)</p>
                            }
                            @if (game !== null && gameComponent && gameComponent.hasScores()) {
                                <p id="scoreZeroIndicator"
                                   class="has-text-black">{{ gameComponent.getScoreString(Player.ZERO) }}</p>
                            }
                            <app-timer #timerZeroGame
                                       id="timer-zero-game"
                                       [dangerTimeLimit]="60"
                                       [active]="(game === null) ? false : getTurn() % 2 === 0"
                                       [canAddTime]="role === Player.ONE && endGame === false"
                                       [timeToAdd]="gameTimeMessage"
                                       [debugName]="'ZERO game'"
                                       [player]="Player.ZERO"
                                       (outOfTimeAction)="reachedOutOfTime(Player.ZERO)"
                                       (addTimeToOpponent)="addGameTime()"
                                       class="data-game-time">
                            </app-timer>
                            <app-timer #timerZeroMove
                                       id="timer-zero-move"
                                       [dangerTimeLimit]="15"
                                       [active]="(game === null) ? false : getTurn() % 2 === 0"
                                       [canAddTime]="role === Player.ONE && endGame === false"
                                       [timeToAdd]="moveTimeMessage"
                                       [debugName]="'ZERO move'"
                                       [player]="Player.ZERO"
                                       (outOfTimeAction)="reachedOutOfTime(Player.ZERO)"
                                       (addTimeToOpponent)="addMoveTime()"
                                       class="data-move-time">
                            </app-timer>
                        </div>
                        <div class="block player1-bg">
                            @if (players[1].isPresent()) {
                                <p id="playerOneIndicator"
                                   class="has-text-black player1-bg-darker is-size-5"><span id="playerOneName">{{ players[1].get().name }}</span> (<app-elo [elo]="game?.playerOneElo || 0"/>) </p>
                            }
                            @if (game !== null && gameComponent && gameComponent.hasScores()) {
                                <p id="scoreOneIndicator"
                                   class="has-text-black">{{ gameComponent.getScoreString(Player.ONE) }}</p>
                            }
                            <app-timer #timerOneGame
                                       id="timer-one-game"
                                       [dangerTimeLimit]="60"
                                       [active]="(game === null) ? false : getTurn() % 2 === 1"
                                       [canAddTime]="role === Player.ZERO && endGame === false"
                                       [timeToAdd]="gameTimeMessage"
                                       [debugName]="'ONE game'"
                                       [player]="Player.ONE"
                                       (outOfTimeAction)="reachedOutOfTime(Player.ONE)"
                                       (addTimeToOpponent)="addGameTime()"
                                       class="data-game-time">
                            </app-timer>
                            <app-timer #timerOneMove
                                       id="timer-one-move"
                                       [dangerTimeLimit]="15"
                                       [active]="(game === null) ? false : getTurn() % 2 === 1"
                                       [canAddTime]="role === Player.ZERO && endGame === false"
                                       [timeToAdd]="moveTimeMessage"
                                       [debugName]="'ONE move'"
                                       [player]="Player.ONE"
                                       (outOfTimeAction)="reachedOutOfTime(Player.ONE)"
                                       (addTimeToOpponent)="addMoveTime()"
                                       class="data-move-time">
                            </app-timer>
                        </div>
                        @if (endGame && game !== null) {
                            <div class="block"
                                 id="winnerIndicator">
                                @if (game.result === 'HardDraw') {
                                    <div>
                                        <p class="title"
                                           id="hardDrawIndicator"
                                           i18n>Draw</p>
                                    </div>
                                }
                                @if (isAgreedDraw()) {
                                    <div>
                                        @if (getDrawAccepter().name === getPlayer().name) {
                                            <p class="title"
                                               id="youAgreedToDrawIndicator"
                                               i18n>You agreed to draw.</p>
                                        }
                                        @if ((getDrawAccepter().name !== getPlayer().name) && isPlaying()) {
                                            <p class="title"
                                               id="yourOpponentAgreedToDrawIndicator"
                                               i18n>Your draw proposal has been accepted.</p>
                                        }
                                        @if (isPlaying() === false) {
                                            <p class="title"
                                               id="playersAgreedToDraw"
                                               i18n>Players agreed to draw.</p>
                                        }
                                    </div>
                                }
                                @if (isWin()) {
                                    <div>
                                        @if (getWinner().name === getPlayer().name) {
                                            <p class="title"
                                               id="youWonIndicator"
                                               i18n>You won.</p>
                                        }
                                        @if ((getLoser().name === getPlayer().name) && isPlaying()) {
                                            <p class="title"
                                               id="youLostIndicator"
                                               i18n>You lost.</p>
                                        }
                                        @if (isPlaying() === false) {
                                            <p class="title"
                                               i18n>{{ getWinner().name }} won.</p>
                                        }
                                    </div>
                                }
                                @if (isTimeout()) {
                                    <div>
                                        @if (getWinner().name === getPlayer().name) {
                                            <p class="title"
                                               id="youWonIndicator"
                                               i18n>{{ getLoser().name }} has reached their time limit. You won.</p>
                                        }
                                        @if ((getLoser().name === getPlayer().name) && isPlaying()) {
                                            <p class="title"
                                               id="youLostIndicator"
                                               i18n>You reached your time limit.</p>
                                        }
                                        @if (isPlaying() === false) {
                                            <p class="title"
                                               i18n>{{ getLoser().name }} has reached their time limit.</p>
                                        }
                                    </div>
                                }
                                @if (isResign()) {
                                    <div>
                                        @if ((getWinner().name !== getPlayer().name) && isPlaying()) {
                                            <p class="title"
                                               id="resignIndicator"
                                               i18n>You resigned.</p>
                                        }
                                        @if (isPlaying() === false || getWinner().name === getPlayer().name) {
                                            <p class="title"
                                               id="resignIndicator"
                                               i18n>{{ getLoser().name }} has resigned.</p>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        @if (isPlaying()) {
                            @if (mustReply() === false) {
                                <button id="resign"
                                        class="button is-fullwidth mb-1 is-danger"
                                        (click)="resign()"
                                        [disabled]="canResign() === false"
                                        i18n>Resign</button>
                                <button id="pass"
                                        class="button is-fullwidth mb-1 is-success"
                                        (click)="gameComponent.pass()"
                                        [disabled]="canPass() === false"
                                        i18n>Pass a turn</button>
                                @for (request of allRequests; track request) {
                                    <button id="propose{{ request }}"
                                            class="button is-fullwidth mb-1"
                                            (click)="propose(request)"
                                            [disabled]="requestAvailable(request) === false">{{ requestInfos[request].textForRequest() }}&nbsp;&nbsp;<fa-icon [icon]="requestInfos[request].icon"></fa-icon></button>
                                }
                            } @else {
                                <div class="notification">
                                    <p>
                                        {{ requestInfos[getRequestAwaitingReplyFromUs().get()].textForReply() }}&nbsp;&nbsp;
                                        <fa-icon [icon]="requestInfos[getRequestAwaitingReplyFromUs().get()].icon"></fa-icon>
                                    </p>
                                    <button class="button is-fullwidth mb-1 is-success"
                                            id="accept"
                                            (click)="accept()"
                                            i18n>Accept</button>
                                    <button class="button is-fullwidth mb-1 is-danger"
                                            id="reject"
                                            (click)="reject()"
                                            i18n>Reject</button>
                                </div>
                            }
                            @if (deniedRequest().isPresent()) {
                                <div id="requestRejected"
                                     class="notification is-danger">
                                    <p><span i18n>Your {{ requestInfos[deniedRequest().get()].name() }} request has been rejected.&nbsp;&nbsp;<fa-icon [icon]="requestInfos[deniedRequest().get()].icon"></fa-icon></span></p>
                                </div>
                            }
                            @if (getRequestAwaitingReplyFromOpponent().isPresent()) {
                                <div id="getRequestAwaitingReply"
                                     class="notification">
                                    <p><span i18n>Your request for a {{ requestInfos[getRequestAwaitingReplyFromOpponent().get()].name() }} has been sent.&nbsp;&nbsp;<fa-icon [icon]="requestInfos[getRequestAwaitingReplyFromOpponent().get()].icon"></fa-icon></span></p>
                                </div>
                            }
                        }
                        @if (endGame) {
                            <button class="button is-primary is-fullwidth mb-1"
                                    id="backToServerButton"
                                    routerLink="/lobby"
                                    i18n>Go back to the game list</button>
                        }
                    </div>
                </div>
                <div class="column">
                    <div class="box p-5 is-fullheight"
                         id="board-highlight"
                         [ngClass]="getBoardHighlight()">
                        <div id="board"
                             class="box is-fullheight">
                            <div #board></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block mt-2">
                <div id="chat"
                     class="box">
                    <app-chat></app-chat>
                </div>
            </div>
        </div>
    }
}
` }]
  }], null, { timerZeroGame: [{ type: ViewChild, args: ["timerZeroGame", { isSignal: true }] }], timerOneGame: [{ type: ViewChild, args: ["timerOneGame", { isSignal: true }] }], timerZeroMove: [{ type: ViewChild, args: ["timerZeroMove", { isSignal: true }] }], timerOneMove: [{ type: ViewChild, args: ["timerOneMove", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OnlineGameWrapperComponent, { className: "OnlineGameWrapperComponent", filePath: "src/app/components/wrapper-components/online-game-wrapper/online-game-wrapper.component.ts", lineNumber: 61 });
})();
export {
  OnlineGameWrapperComponent,
  OnlineGameWrapperMessages
};
//# sourceMappingURL=online-game-wrapper.component-JWZ2KPAI.js.map
