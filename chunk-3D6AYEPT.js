import {
  __async,
  __commonJS
} from "./chunk-FIMNEZBT.js";

// lib/dist/MGPFallible.js
var require_MGPFallible = __commonJS({
  "lib/dist/MGPFallible.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MGPFallibleTestUtils = exports.MGPFallible = void 0;
    var Comparable_1 = require_Comparable();
    var MGPOptional_1 = require_MGPOptional();
    var MGPFallible = class {
      static success(value) {
        return new MGPFallibleSuccess(value);
      }
      static failure(reason) {
        return new MGPFallibleFailure(reason);
      }
      constructor() {
      }
      equals(other) {
        if (this.isFailure()) {
          return other.isFailure() && this.getReason() === other.getReason();
        }
        if (other.isFailure()) {
          return false;
        }
        return (0, Comparable_1.comparableEquals)(this.get(), other.get());
      }
    };
    exports.MGPFallible = MGPFallible;
    var MGPFallibleSuccess = class extends MGPFallible {
      value;
      __nominal;
      // For strict typing
      constructor(value) {
        super();
        this.value = value;
      }
      isSuccess() {
        return true;
      }
      isFailure() {
        return false;
      }
      get() {
        return this.value;
      }
      getReason() {
        throw new Error("Cannot get failure reason from a success");
      }
      getReasonOr(value) {
        return value;
      }
      toOptional() {
        return MGPOptional_1.MGPOptional.of(this.value);
      }
      map(f) {
        return MGPFallible.success(f(this.value));
      }
      toString() {
        return `MGPFallible.success(${this.value})`;
      }
    };
    var MGPFallibleFailure = class extends MGPFallible {
      reason;
      __nominal;
      // For strict typing
      constructor(reason) {
        super();
        this.reason = reason;
      }
      isSuccess() {
        return false;
      }
      isFailure() {
        return true;
      }
      get() {
        throw new Error("Value is absent from failure, with the following reason: " + this.reason);
      }
      getReason() {
        return this.reason;
      }
      getReasonOr(_value) {
        return this.getReason();
      }
      toOptional() {
        return MGPOptional_1.MGPOptional.empty();
      }
      map(f) {
        return this.toOtherFallible();
      }
      toString() {
        return `MGPFallible.failure(${this.reason})`;
      }
      toOtherFallible() {
        return MGPFallible.failure(this.reason);
      }
    };
    var MGPFallibleTestUtils = class {
      static expectToBeSuccess(fallible, value) {
        expect(fallible.isSuccess()).toBeTrue();
        if (value != null) {
          expect(fallible.get()).toBe(value);
        }
      }
      static expectToBeFailure(fallible, reason) {
        expect(fallible.isFailure()).toBeTrue();
        expect(fallible.getReason()).toBe(reason);
      }
    };
    exports.MGPFallibleTestUtils = MGPFallibleTestUtils;
  }
});

// lib/dist/MGPValidation.js
var require_MGPValidation = __commonJS({
  "lib/dist/MGPValidation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MGPValidationTestUtils = exports.MGPValidation = void 0;
    var MGPFallible_1 = require_MGPFallible();
    var MGPValidation;
    (function(MGPValidation2) {
      MGPValidation2.SUCCESS = MGPFallible_1.MGPFallible.success(void 0);
      function ofFallible(fallible) {
        if (fallible.isSuccess()) {
          return MGPValidation2.SUCCESS;
        } else {
          return MGPValidation2.failure(fallible.getReason());
        }
      }
      MGPValidation2.ofFallible = ofFallible;
      function failure(reason) {
        return MGPFallible_1.MGPFallible.failure(reason);
      }
      MGPValidation2.failure = failure;
    })(MGPValidation || (exports.MGPValidation = MGPValidation = {}));
    var MGPValidationTestUtils = class {
      static expectToBeSuccess(fallible, context) {
        if (context != null) {
          expect(fallible.isSuccess()).withContext(context).toBeTrue();
        } else {
          expect(fallible.isSuccess()).toBeTrue();
        }
      }
      static expectToBeFailure(fallible, reason) {
        expect(fallible.isFailure()).toBeTrue();
        expect(fallible.getReason()).toBe(reason);
      }
    };
    exports.MGPValidationTestUtils = MGPValidationTestUtils;
  }
});

// lib/dist/Utils.js
var require_Utils = __commonJS({
  "lib/dist/Utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Utils = void 0;
    var MGPValidation_1 = require_MGPValidation();
    var Utils = class _Utils {
      /**
       * The error logger is called in order to log errors when they arise.
       * It should be set by the codebase relying on this, for example by doing:
       * Utils.logError = myErrorLogger;
       */
      static logError = (_kind, message, _data) => {
        return MGPValidation_1.MGPValidation.failure(message);
      };
      static expectToBe(value, expected, message) {
        if (value !== expected) {
          if (message !== void 0) {
            throw new Error(message);
          }
          throw new Error(`A default switch case did not observe the correct value, expected ${expected}, but got ${value} instead.`);
        }
      }
      static expectToBeMultiple(value, expectedValues) {
        for (const expected of expectedValues) {
          if (value === expected) {
            return;
          }
        }
        throw new Error(`A default switch case did not observe the correct value, expected a value among ${expectedValues}, but got ${value} instead.`);
      }
      static getNonNullable(value) {
        if (value == null) {
          throw new Error(`Expected value not to be null or undefined, but it was.`);
        } else {
          return value;
        }
      }
      static assert(condition, message, data) {
        if (condition === false) {
          _Utils.logError("Assertion failure", message, data);
          if (data === void 0) {
            throw new Error(`Assertion failure: ${message}`);
          } else {
            throw new Error(`Assertion failure: ${message} (${JSON.stringify(data)})`);
          }
        }
      }
      static identity(thing) {
        return thing;
      }
    };
    exports.Utils = Utils;
  }
});

// lib/dist/Encoder.js
var require_Encoder = __commonJS({
  "lib/dist/Encoder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EncoderTestUtils = exports.Encoder = void 0;
    var Utils_1 = require_Utils();
    var Encoder = class _Encoder {
      static fromFunctions(toJSON, fromJSON) {
        return new class extends _Encoder {
          encode(value) {
            return toJSON(value);
          }
          decode(encoded) {
            return fromJSON(encoded);
          }
        }();
      }
      static identity() {
        function identity(x) {
          return x;
        }
        return _Encoder.fromFunctions(identity, identity);
      }
      static constant(constant, onlyValue) {
        return new class extends _Encoder {
          encode(_value) {
            return constant;
          }
          decode(_encoded) {
            return onlyValue;
          }
        }();
      }
      static tuple(encoders, encode, decode) {
        return new class extends _Encoder {
          encode(value) {
            const fields = encode(value);
            const encoded = {};
            Object.keys(fields).forEach((key) => {
              encoded[key] = encoders[key].encode(fields[key]);
            });
            return encoded;
          }
          decode(encoded) {
            const fields = {};
            Object.keys(encoders).reverse().forEach((key) => {
              const field = encoded[key];
              fields[key] = encoders[key].decode(field);
            });
            return decode(Object.values(fields));
          }
        }();
      }
      /**
       * This creates a "sum" encoder, i.e., it encodes values of either type T and U and V and ...
       */
      static disjunction(typePredicates, encoders) {
        Utils_1.Utils.assert(typePredicates.length === encoders.length, "typePredicates and encoders should have same length");
        return new class extends _Encoder {
          encode(value) {
            let indexClass = 0;
            for (const identifier of typePredicates) {
              if (identifier(value) === true) {
                return {
                  type: indexClass,
                  encoded: encoders[indexClass].encode(value)
                };
              }
              indexClass++;
            }
            throw new Error(`cannot encode value: ${value}`);
          }
          decode(encoded) {
            const type_ = Utils_1.Utils.getNonNullable(encoded)["type"];
            const content = Utils_1.Utils.getNonNullable(encoded)["encoded"];
            return encoders[type_].decode(content);
          }
        }();
      }
      static list(encoder) {
        return new class extends _Encoder {
          encode(list) {
            return list.map((t) => {
              const encodedCoord = encoder.encode(t);
              Utils_1.Utils.assert(Array.isArray(encodedCoord) === false, "This encoder should not encode as array");
              return encodedCoord;
            });
          }
          decode(encoded) {
            const casted = encoded;
            return casted.map(encoder.decode);
          }
        }();
      }
    };
    exports.Encoder = Encoder;
    var EncoderTestUtils = class {
      static expectToBeBijective(encoder, value) {
        const encoded = encoder.encode(value);
        const decoded = encoder.decode(encoded);
        expect(decoded).withContext(`Expected decoded value (${decoded}) to be ${value}`).toEqual(value);
      }
    };
    exports.EncoderTestUtils = EncoderTestUtils;
  }
});

// lib/dist/MGPOptional.js
var require_MGPOptional = __commonJS({
  "lib/dist/MGPOptional.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MGPOptional = void 0;
    var Comparable_1 = require_Comparable();
    var Encoder_1 = require_Encoder();
    var MGPOptional = class _MGPOptional {
      static of(value) {
        return new MGPOptionalPresent(value);
      }
      static ofNullable(value) {
        if (value == null) {
          return _MGPOptional.empty();
        } else {
          return _MGPOptional.of(value);
        }
      }
      static empty() {
        return new MGPOptionalAbsent();
      }
      /**
       * Encodes a MGPOptional<T> using an encoder of T.
       * It will use the same encoding as T, and use null to encode an empty optional.
       */
      static getEncoder(encoderT) {
        return new class extends Encoder_1.Encoder {
          encode(opt) {
            if (opt.isPresent()) {
              return encoderT.encode(opt.get());
            } else {
              return null;
            }
          }
          decode(encoded) {
            if (encoded === null) {
              return _MGPOptional.empty();
            } else {
              return _MGPOptional.of(encoderT.decode(encoded));
            }
          }
        }();
      }
    };
    exports.MGPOptional = MGPOptional;
    var MGPOptionalAbsent = class extends MGPOptional {
      isPresent() {
        return false;
      }
      isAbsent() {
        return true;
      }
      get() {
        throw new Error("Value is absent");
      }
      getOrElse(defaultValue) {
        return defaultValue;
      }
      orElse(other) {
        return other;
      }
      equals(other) {
        return other.isAbsent();
      }
      equalsValue(_other) {
        return false;
      }
      toString() {
        return "MGPOptional.empty()";
      }
      map(f) {
        return MGPOptional.empty();
      }
    };
    var MGPOptionalPresent = class extends MGPOptional {
      value;
      constructor(value) {
        super();
        this.value = value;
      }
      isPresent() {
        return true;
      }
      isAbsent() {
        return false;
      }
      get() {
        return this.value;
      }
      getOrElse(_defaultValue) {
        return this.value;
      }
      orElse(_other) {
        return this;
      }
      equals(other) {
        return other.isPresent() && this.equalsValue(other.get());
      }
      equalsValue(other) {
        return (0, Comparable_1.comparableEquals)(other, this.value);
      }
      toString() {
        return `MGPOptional.of(${this.value})`;
      }
      map(f) {
        return MGPOptional.of(f(this.value));
      }
    };
  }
});

// lib/dist/JSON.js
var require_JSON = __commonJS({
  "lib/dist/JSON.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONParser = void 0;
    exports.isJSONPrimitive = isJSONPrimitive;
    var MGPOptional_1 = require_MGPOptional();
    function isJSONPrimitive(value) {
      if (typeof value === "string")
        return true;
      if (typeof value === "number")
        return true;
      if (typeof value === "boolean")
        return true;
      if (value === null)
        return true;
      return false;
    }
    var JSONParser = class _JSONParser {
      static toJSONValue(v) {
        if (isJSONPrimitive(v))
          return v;
        if (Array.isArray(v)) {
          const array = [];
          for (const item of v) {
            array.push(_JSONParser.toJSONValueWithoutArray(item));
          }
          return array;
        } else {
          return _JSONParser.toJSONObject(v);
        }
      }
      static toJSONObject(v) {
        const obj = {};
        for (const [key, value] of Object.entries(v)) {
          obj[key] = _JSONParser.toJSONValue(value);
        }
        return obj;
      }
      static toJSONValueWithoutArray(v) {
        if (isJSONPrimitive(v))
          return v;
        if (Array.isArray(v)) {
          throw Error(`this is array contained in another array, which is forbidden: ${v}`);
        } else {
          return _JSONParser.toJSONObject(v);
        }
      }
      // Try to parse a JSONValue and to return it. Fails with MGPOptional.empty otherwise.
      static parseJSONSafely(json) {
        try {
          return MGPOptional_1.MGPOptional.of(_JSONParser.toJSONValue(JSON.parse(json)));
        } catch {
          return MGPOptional_1.MGPOptional.empty();
        }
      }
    };
    exports.JSONParser = JSONParser;
  }
});

// lib/dist/Comparable.js
var require_Comparable = __commonJS({
  "lib/dist/Comparable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isComparableObject = isComparableObject;
    exports.isComparableJSON = isComparableJSON;
    exports.isComparableValue = isComparableValue;
    exports.comparableEquals = comparableEquals;
    var JSON_1 = require_JSON();
    function comparableEqualsStrict(a, b) {
      if (a != null && b != null && typeof a === "object") {
        if (a.equals != null) {
          const comparableValue = a;
          const otherComparable = b;
          return comparableValue.equals(otherComparable);
        } else {
          const aJSON = a;
          const bJSON = b;
          for (const key of Object.keys(aJSON)) {
            if (key in bJSON) {
              if (comparableEqualsStrict(aJSON[key], bJSON[key]) === false) {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        }
      } else {
        return a === b;
      }
    }
    function isComparableObject(value) {
      return typeof value === "object" && value != null && value["equals"] != null;
    }
    function isComparableJSON(value) {
      if (typeof value === "object") {
        for (const key in value) {
          if (value[key] != null && isComparableValue(value[key]) === false) {
            return false;
          }
        }
        return value != null && value.constructor.prototype === Object.prototype;
      } else {
        return false;
      }
    }
    function isComparableValue(value) {
      return value == null || isComparableObject(value) || (0, JSON_1.isJSONPrimitive)(value) || isComparableJSON(value);
    }
    function comparableEquals(a, b) {
      if (isComparableValue(a) && isComparableValue(b)) {
        return comparableEqualsStrict(a, b);
      } else {
        throw new Error(`Comparing non comparable objects: ${a.constructor.name} and ${b.constructor.name}`);
      }
    }
  }
});

// lib/dist/ArrayUtils.js
var require_ArrayUtils = __commonJS({
  "lib/dist/ArrayUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArrayUtils = void 0;
    var Comparable_1 = require_Comparable();
    var Utils_1 = require_Utils();
    var ArrayUtils = class _ArrayUtils {
      static create(width, initValue) {
        const array = [];
        for (let x = 0; x < width; x++) {
          array.push(initValue);
        }
        return array;
      }
      static copy(array) {
        return array.map((t) => t);
      }
      static sortByDescending(array, by) {
        array.sort((t1, t2) => {
          const v1 = by(t1);
          const v2 = by(t2);
          if (v1 < v2) {
            return 1;
          } else if (v1 > v2) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      static equals(t1, t2) {
        if (t1.length !== t2.length) {
          return false;
        }
        for (let i = 0; i < t1.length; i++) {
          if ((0, Comparable_1.comparableEquals)(t1[i], t2[i]) === false)
            return false;
        }
        return true;
      }
      static isPrefix(prefix, list) {
        if (prefix.length > list.length)
          return false;
        return _ArrayUtils.equals(prefix, list.slice(0, prefix.length));
      }
      /**
       * range(n) returns the list [0, 1, 2, ..., n-1]
       * Enables doing *ngFor="let x in ArrayUtils.range(5)" in an Angular template
       */
      static range(n) {
        const range = [];
        for (let i = 0; i < n; i++) {
          range.push(i);
        }
        return range;
      }
      /**
       * A method that can be used to sort an array with the smallest number first with xs.sort(ArrayUtils.smallerFirst);
       */
      static smallerFirst(a, b) {
        return a - b;
      }
      /**
       * Gets a random element from an array.
       * Throws if the array is empty.
       */
      static getRandomElement(array) {
        Utils_1.Utils.assert(array.length > 0, "ArrayUtils.getRandomElement must be called on an array containing elements");
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
      }
      /**
       * Gets the maximum elements of an array, according to a given metric.
       * Returns an array containing all the maximal values
       */
      static maximumsBy(array, metric) {
        let maximums = [];
        let maxMetricValue = -Infinity;
        for (const element of array) {
          const currentMetricValue = metric(element);
          if (currentMetricValue >= maxMetricValue) {
            if (currentMetricValue > maxMetricValue) {
              maximums = [];
            }
            maxMetricValue = currentMetricValue;
            maximums.push(element);
          }
        }
        return maximums;
      }
      /**
       * Counts the number of element in an array that have the provided value
       */
      static count(array, value) {
        return _ArrayUtils.countByPredicate(array, (element) => (0, Comparable_1.comparableEquals)(element, value));
      }
      static countByPredicate(array, predicate) {
        let total = 0;
        for (const element of array) {
          if (predicate(element)) {
            total++;
          }
        }
        return total;
      }
      static contains(array, value) {
        for (const element of array) {
          if ((0, Comparable_1.comparableEquals)(value, element)) {
            return true;
          }
        }
        return false;
      }
      /**
       * Check whether the first argument is strictly smaller than the second, element-wise
       */
      static isLessThan(inferior, superior) {
        Utils_1.Utils.assert(inferior.length > 0 && superior.length > 0, "ArrayUtils.isLessThan/isGreaterThan should have two non-empty list as parameter");
        const maximumIndex = Math.min(inferior.length, superior.length);
        for (let i = 0; i < maximumIndex; i++) {
          if (superior[i] !== inferior[i]) {
            return inferior[i] < superior[i];
          }
        }
        return false;
      }
      /**
       * Check whether the first argument is strictly greater than the second, element-wise.
       */
      static isGreaterThan(superior, inferior) {
        return _ArrayUtils.isLessThan(inferior, superior);
      }
      /**
       * Return the minimal array (comparing element-wise) between two arrays.
       */
      static min(left, right) {
        if (_ArrayUtils.isLessThan(left, right)) {
          return left;
        } else {
          return right;
        }
      }
      /**
       * Return the maximal array (comparing element-wise) between two arrays.
       */
      static max(left, right) {
        if (_ArrayUtils.isGreaterThan(left, right)) {
          return left;
        } else {
          return right;
        }
      }
      static map(list, mapper) {
        const result = [];
        for (const element of list) {
          result.push(mapper(element));
        }
        return result;
      }
    };
    exports.ArrayUtils = ArrayUtils;
  }
});

// lib/dist/Combinatorics.js
var require_Combinatorics = __commonJS({
  "lib/dist/Combinatorics.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Combinatorics = void 0;
    var Utils_1 = require_Utils();
    var Combinatorics = class {
      static getCombinations(elements, size) {
        Utils_1.Utils.assert(size <= elements.length, "cannot compute combinations for less elements than needed");
        return this.getSubsetsOfSize(elements, size).map((subset) => {
          return this.getPermutations(subset);
        }).reduce((accumulator, combinations) => {
          return accumulator.concat(combinations);
        });
      }
      static getPermutations(elements) {
        const length = elements.length;
        const result = [elements.slice()];
        const c = new Array(length).fill(0);
        let i = 1;
        while (i < length) {
          if (c[i] < i) {
            const k = i % 2 && c[i];
            const element = elements[i];
            elements[i] = elements[k];
            elements[k] = element;
            ++c[i];
            i = 1;
            result.push(elements.slice());
          } else {
            c[i] = 0;
            ++i;
          }
        }
        return result;
      }
      static getSubsetsOfSize(elements, size) {
        function subsets(length, start) {
          if (elements.length <= start || length < 1) {
            return [[]];
          } else {
            const results = [];
            while (start <= elements.length - length) {
              const first = elements[start];
              for (const subset of subsets(length - 1, start + 1)) {
                subset.push(first);
                results.push(subset);
              }
              ++start;
            }
            return results;
          }
        }
        return subsets(size, 0);
      }
    };
    exports.Combinatorics = Combinatorics;
  }
});

// lib/dist/MathUtils.js
var require_MathUtils = __commonJS({
  "lib/dist/MathUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MathUtils = void 0;
    var MathUtils = class _MathUtils {
      /**
       * Returns the greatest common divisor between two numbers a and b.
       * Uses the euclidean algorithm. Negative inputs are supported.
       */
      static gcd(a, b) {
        if (b === 0) {
          return Math.abs(a);
        } else {
          return _MathUtils.gcd(b, a % b);
        }
      }
    };
    exports.MathUtils = MathUtils;
  }
});

// lib/dist/Sets.js
var require_Sets = __commonJS({
  "lib/dist/Sets.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sets = void 0;
    var Comparable_1 = require_Comparable();
    var Sets = class {
      static toComparableObjectSet(list) {
        const result = [];
        list.forEach((other) => {
          if (result.some((el) => el.equals(other)) === false) {
            result.push(other);
          }
        });
        return result;
      }
      static toComparableSet(list) {
        const result = [];
        list.forEach((other) => {
          if (result.some((el) => (0, Comparable_1.comparableEquals)(el, other)) === false) {
            result.push(other);
          }
        });
        return result;
      }
    };
    exports.Sets = Sets;
  }
});

// lib/dist/Set.js
var require_Set = __commonJS({
  "lib/dist/Set.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Set = void 0;
    var ArrayUtils_1 = require_ArrayUtils();
    var Comparable_1 = require_Comparable();
    var MGPOptional_1 = require_MGPOptional();
    var Sets_1 = require_Sets();
    var Set = class _Set {
      values;
      constructor(values) {
        if (values === void 0) {
          this.values = [];
        } else {
          this.values = Sets_1.Sets.toComparableSet(values);
        }
      }
      provideInstance(values) {
        const { constructor } = Object.getPrototypeOf(this);
        return new constructor(values);
      }
      equals(other) {
        if (other.size() !== this.size()) {
          return false;
        }
        for (const coord of this) {
          if (other.contains(coord) === false) {
            return false;
          }
        }
        return true;
      }
      size() {
        return this.values.length;
      }
      toString() {
        const result = ArrayUtils_1.ArrayUtils.map(this.values, (v) => {
          if (v == null) {
            return "null";
          } else {
            return v.toString();
          }
        });
        return "[" + result.join(", ") + "]";
      }
      contains(element) {
        return ArrayUtils_1.ArrayUtils.contains(this.values, element);
      }
      toList() {
        return ArrayUtils_1.ArrayUtils.copy(this.values);
      }
      getAnyElement() {
        if (this.size() > 0) {
          return MGPOptional_1.MGPOptional.of(this.values[0]);
        } else {
          return MGPOptional_1.MGPOptional.empty();
        }
      }
      isEmpty() {
        return this.values.length === 0;
      }
      hasElements() {
        return this.isEmpty() === false;
      }
      findAnyCommonElement(other) {
        for (const element of other) {
          if (this.contains(element)) {
            return MGPOptional_1.MGPOptional.of(element);
          }
        }
        return MGPOptional_1.MGPOptional.empty();
      }
      /**
       * @param other the "reference" set
       * @returns an empty optional is nothing miss in this set; the first element missing as an optional if there is one
       */
      getMissingElementFrom(other) {
        for (const element of other) {
          if (this.contains(element) === false) {
            return MGPOptional_1.MGPOptional.of(element);
          }
        }
        return MGPOptional_1.MGPOptional.empty();
      }
      [Symbol.iterator]() {
        return this.values.values();
      }
      union(otherSet) {
        const values = this.toList().concat(otherSet.toList());
        return this.provideInstance(values);
      }
      unionList(list) {
        return this.provideInstance(list.concat(this.values));
      }
      addElement(element) {
        return this.provideInstance(this.values.concat([element]));
      }
      filter(f) {
        return this.provideInstance(this.toList().filter(f));
      }
      removeElement(element) {
        return this.filter((e) => (0, Comparable_1.comparableEquals)(e, element) === false);
      }
      map(mapper) {
        const result = ArrayUtils_1.ArrayUtils.map(this.values, mapper);
        return new _Set(result);
      }
      flatMap(f) {
        let result = new _Set();
        for (const element of this) {
          result = result.union(f(element));
        }
        return result;
      }
      intersection(other) {
        let result = this.provideInstance();
        for (const element of other) {
          if (this.contains(element)) {
            result = result.addElement(element);
          }
        }
        return result;
      }
    };
    exports.Set = Set;
  }
});

// lib/dist/MGPMap.js
var require_MGPMap = __commonJS({
  "lib/dist/MGPMap.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReversibleMap = exports.MGPMap = void 0;
    var Comparable_1 = require_Comparable();
    var MGPOptional_1 = require_MGPOptional();
    var Set_1 = require_Set();
    var Utils_1 = require_Utils();
    var MGPMap = class _MGPMap {
      map;
      isImmutable;
      static from(record) {
        const keys = Object.keys(record);
        const map = new _MGPMap();
        for (const key of keys) {
          map.set(key, record[key]);
        }
        return map;
      }
      constructor(map = [], isImmutable = false) {
        this.map = map;
        this.isImmutable = isImmutable;
      }
      makeImmutable() {
        this.isImmutable = true;
      }
      get(key) {
        for (const keymap of this.map) {
          if ((0, Comparable_1.comparableEquals)(keymap.key, key)) {
            return MGPOptional_1.MGPOptional.of(keymap.value);
          }
        }
        return MGPOptional_1.MGPOptional.empty();
      }
      getAnyPair() {
        if (this.size() > 0) {
          return MGPOptional_1.MGPOptional.of(this.map[0]);
        } else {
          return MGPOptional_1.MGPOptional.empty();
        }
      }
      [Symbol.iterator]() {
        const entries = this.map;
        let index = 0;
        return {
          /* istanbul ignore next */
          [Symbol.iterator]() {
            return this;
          },
          next() {
            if (index < entries.length) {
              const entry = entries[index];
              index += 1;
              return { value: [entry.key, entry.value], done: false };
            }
            return { value: void 0, done: true };
          }
        };
      }
      clear() {
        this.assertImmutability("clear");
        this.map = [];
      }
      putAll(m) {
        this.assertImmutability("putAll");
        for (const entry of m.map) {
          this.put(entry.key, entry.value);
        }
      }
      assertImmutability(methodCalled) {
        Utils_1.Utils.assert(this.isImmutable === false, "Cannot call " + methodCalled + " on immutable map!");
      }
      put(key, value) {
        this.assertImmutability("put");
        for (const entry of this.map) {
          if ((0, Comparable_1.comparableEquals)(entry.key, key)) {
            const oldValue = entry.value;
            entry.value = value;
            return MGPOptional_1.MGPOptional.of(oldValue);
          }
        }
        this.map.push({ key, value });
        return MGPOptional_1.MGPOptional.empty();
      }
      containsKey(key) {
        return this.map.some((entry) => (0, Comparable_1.comparableEquals)(entry.key, key));
      }
      size() {
        return this.map.length;
      }
      getKeyList() {
        return this.map.map((entry) => entry.key);
      }
      getValueList() {
        return this.map.map((entry) => entry.value);
      }
      getKeySet() {
        return new Set_1.Set(this.getKeyList());
      }
      filter(predicate) {
        const filtered = new _MGPMap();
        for (const keyValue of this.map) {
          if (predicate(keyValue.key, keyValue.value)) {
            filtered.set(keyValue.key, keyValue.value);
          }
        }
        return filtered;
      }
      replace(key, newValue) {
        this.assertImmutability("replace");
        const oldValue = this.get(key);
        if (oldValue.isAbsent()) {
          throw new Error("No Value to replace for key " + key.toString() + "!");
        } else {
          this.put(key, newValue);
          return newValue;
        }
      }
      set(key, firstValue) {
        this.assertImmutability("set");
        if (this.containsKey(key)) {
          throw new Error("Key " + key.toString() + " already exists in map!");
        } else {
          this.map.push({ key, value: firstValue });
        }
      }
      delete(key) {
        this.assertImmutability("delete");
        for (let i = 0; i < this.map.length; i++) {
          const entry = this.map[i];
          if ((0, Comparable_1.comparableEquals)(entry.key, key)) {
            const oldValue = this.map[i].value;
            const beforeDeleted = this.map.slice(0, i);
            const afterDeleted = this.map.slice(i + 1);
            this.map = beforeDeleted.concat(afterDeleted);
            return oldValue;
          }
        }
        throw new Error('No value to delete for key "' + key.toString() + '"!');
      }
      getCopy() {
        const newMap = new this.constructor();
        for (const key of this.getKeyList()) {
          newMap.set(key, this.get(key).get());
        }
        return newMap;
      }
      equals(other) {
        const thisKeySet = this.getKeySet();
        const otherKeySet = other.getKeySet();
        if (thisKeySet.equals(otherKeySet) === false) {
          return false;
        }
        for (const key of thisKeySet) {
          const thisValue = this.get(key).get();
          const otherValue = other.get(key);
          Utils_1.Utils.assert(otherValue.isPresent(), "value is absent in a map even though its key is present!");
          if ((0, Comparable_1.comparableEquals)(thisValue, otherValue.get()) === false) {
            return false;
          }
        }
        return true;
      }
    };
    exports.MGPMap = MGPMap;
    var ReversibleMap = class _ReversibleMap extends MGPMap {
      reverse() {
        const reversedMap = new _ReversibleMap();
        for (const key of this.getKeyList()) {
          const value = this.get(key).get();
          if (reversedMap.containsKey(value)) {
            const newSet = reversedMap.get(value).get().addElement(key);
            reversedMap.put(value, newSet);
          } else {
            const newSet = new Set_1.Set([key]);
            reversedMap.set(value, newSet);
          }
        }
        return reversedMap;
      }
    };
    exports.ReversibleMap = ReversibleMap;
  }
});

// lib/dist/MGPUniqueList.js
var require_MGPUniqueList = __commonJS({
  "lib/dist/MGPUniqueList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MGPUniqueList = void 0;
    var Comparable_1 = require_Comparable();
    var Set_1 = require_Set();
    var Utils_1 = require_Utils();
    var MGPUniqueList = class extends Set_1.Set {
      equals(other) {
        if (other.size() !== this.size()) {
          return false;
        }
        for (let i = 0; i < this.size(); i++) {
          const otherValue = other.get(i);
          const thisValue = this.get(i);
          if ((0, Comparable_1.comparableEquals)(otherValue, thisValue) === false) {
            return false;
          }
        }
        return true;
      }
      get(index) {
        Utils_1.Utils.assert(index < this.values.length, "MGPUniqueList: index out of bounds: " + index);
        return this.values[index];
      }
      /**
        * Get element starting to count from the end (0 for the last)
        * @param index the index of the element to fetch, starting from the end (0 as last)
        */
      getFromEnd(index) {
        Utils_1.Utils.assert(index < this.values.length, "MGPUniqueList: index (from end) out of bounds: " + index);
        const lastIndex = this.values.length - 1;
        return this.get(lastIndex - index);
      }
    };
    exports.MGPUniqueList = MGPUniqueList;
  }
});

// lib/dist/NumberMap.js
var require_NumberMap = __commonJS({
  "lib/dist/NumberMap.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberMap = void 0;
    var MGPMap_1 = require_MGPMap();
    var MGPOptional_1 = require_MGPOptional();
    var NumberMap = class extends MGPMap_1.MGPMap {
      add(key, value) {
        const oldValue = this.get(key).get();
        return this.put(key, oldValue + value);
      }
      addOrSet(key, value) {
        if (this.containsKey(key)) {
          return this.add(key, value);
        } else {
          this.set(key, value);
          return MGPOptional_1.MGPOptional.of(value);
        }
      }
    };
    exports.NumberMap = NumberMap;
  }
});

// lib/dist/OptimizedSet.js
var require_OptimizedSet = __commonJS({
  "lib/dist/OptimizedSet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OptimizedSet = void 0;
    var Set_1 = require_Set();
    var OptimizedSet = class extends Set_1.Set {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      valueMap;
      constructor(values) {
        super();
        this.valueMap = [];
        this.values = [];
        if (values !== void 0) {
          for (const value of values) {
            this.add(value);
          }
        }
      }
      add(element) {
        const fields = this.toFields(element);
        let indirection = this.valueMap;
        for (const field of fields[0]) {
          if (indirection[field] === void 0) {
            indirection[field] = [];
          }
          indirection = indirection[field];
        }
        const finalField = fields[1];
        if (indirection[finalField] === void 0) {
          indirection[finalField] = true;
          this.values.push(element);
          return true;
        } else {
          return false;
        }
      }
      contains(element) {
        const fields = this.toFields(element);
        let indirection = this.valueMap;
        for (const field of fields[0]) {
          if (indirection[field] === void 0) {
            return false;
          }
          indirection = indirection[field];
        }
        const finalField = fields[1];
        return indirection[finalField] !== void 0;
      }
      [Symbol.iterator]() {
        return this.values.values();
      }
    };
    exports.OptimizedSet = OptimizedSet;
  }
});

// lib/dist/TestUtils.js
var require_TestUtils = __commonJS({
  "lib/dist/TestUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestUtils = void 0;
    var MGPValidation_1 = require_MGPValidation();
    var Utils_1 = require_Utils();
    var TestUtils = class {
      static expectToThrowAndLog(func, error) {
        if (jasmine.isSpy(Utils_1.Utils.logError) === false) {
          spyOn(Utils_1.Utils, "logError").and.callFake((component, message) => MGPValidation_1.MGPValidation.failure(component + ": " + message));
        }
        expect(func).withContext("Expected Assertion failure: " + error).toThrowError("Assertion failure: " + error);
        expect(Utils_1.Utils.logError).toHaveBeenCalledWith("Assertion failure", error, void 0);
      }
    };
    exports.TestUtils = TestUtils;
  }
});

// lib/dist/TimeUtils.js
var require_TimeUtils = __commonJS({
  "lib/dist/TimeUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeUtils = void 0;
    var TimeUtils = class {
      static sleep(ms) {
        return __async(this, null, function* () {
          return new Promise((resolve) => {
            setTimeout(resolve, ms);
          });
        });
      }
    };
    exports.TimeUtils = TimeUtils;
  }
});

// lib/dist/index.js
var require_dist = __commonJS({
  "lib/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_ArrayUtils(), exports);
    __exportStar(require_Combinatorics(), exports);
    __exportStar(require_Comparable(), exports);
    __exportStar(require_Encoder(), exports);
    __exportStar(require_dist(), exports);
    __exportStar(require_JSON(), exports);
    __exportStar(require_MathUtils(), exports);
    __exportStar(require_MGPFallible(), exports);
    __exportStar(require_MGPMap(), exports);
    __exportStar(require_MGPOptional(), exports);
    __exportStar(require_Set(), exports);
    __exportStar(require_MGPUniqueList(), exports);
    __exportStar(require_MGPValidation(), exports);
    __exportStar(require_NumberMap(), exports);
    __exportStar(require_OptimizedSet(), exports);
    __exportStar(require_Sets(), exports);
    __exportStar(require_TestUtils(), exports);
    __exportStar(require_TimeUtils(), exports);
    __exportStar(require_Utils(), exports);
  }
});

export {
  require_dist
};
//# sourceMappingURL=chunk-3D6AYEPT.js.map
