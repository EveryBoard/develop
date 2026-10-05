import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZESDHCPZ.js";

// lib/dist/Utils.js
var Utils = class _Utils {
  /**
   * The error logger is called in order to log errors when they arise.
   * It should be set by the codebase relying on this, for example by doing:
   * Utils.logError = myErrorLogger;
   */
  static logError = (_kind, message, _data) => {
    return MGPValidation.failure(message);
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

// lib/dist/Encoder.js
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
        Object.keys(encoders).forEach((key) => {
          const field = encoded[key];
          fields[key] = encoders[key].decode(field);
        });
        const actualFields = Object.keys(encoders).map((k) => fields[k]);
        return decode(actualFields);
      }
    }();
  }
  /**
   * This creates a "sum" encoder, i.e., it encodes values of either type T and U and V and ...
   */
  static disjunction(typePredicates, encoders) {
    Utils.assert(typePredicates.length === encoders.length, "typePredicates and encoders should have same length");
    return new class extends _Encoder {
      encode(value) {
        let indexClass = 0;
        for (const identifier of typePredicates) {
          if (identifier(value)) {
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
        const type_ = Utils.getNonNullable(encoded)["type"];
        const content = Utils.getNonNullable(encoded)["encoded"];
        Utils.assert(type_ <= encoders.length, `Encoders.disjunction got invalid data: ${type_} is not an existing type`);
        return encoders[type_].decode(content);
      }
    }();
  }
  static list(encoder) {
    return new class extends _Encoder {
      encode(list) {
        return list.map((t) => {
          const encodedCoord = encoder.encode(t);
          Utils.assert(Array.isArray(encodedCoord) === false, "This encoder should not encode as array");
          return encodedCoord;
        });
      }
      decode(encoded) {
        Utils.assert(Array.isArray(encoded), `Encoders.list got invalid data ${encoded} is not an array`);
        const casted = encoded;
        return casted.map(encoder.decode);
      }
    }();
  }
};

// lib/dist/MGPOptional.js
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
    return new class extends Encoder {
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
    return comparableEquals(other, this.value);
  }
  toString() {
    return `MGPOptional.of(${this.value})`;
  }
  map(f) {
    return MGPOptional.of(f(this.value));
  }
};

// lib/dist/JSON.js
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
      return MGPOptional.of(_JSONParser.toJSONValue(JSON.parse(json)));
    } catch (e) {
      return MGPOptional.empty();
    }
  }
};

// lib/dist/Comparable.js
function comparableEqualsStrict(a, b) {
  if (a != null && b != null && typeof a === "object") {
    if (a.equals != null) {
      const comparableValue = a;
      const otherComparable = b;
      return comparableValue.equals(otherComparable);
    } else {
      const aJSON = a;
      const aKeys = Object.keys(a);
      const bJSON = b;
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) {
        return false;
      }
      for (const key of aKeys) {
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
    if (value === null) {
      return false;
    }
    for (const key of Object.keys(value)) {
      if (value[key] != null && isComparableValue(value[key]) === false) {
        return false;
      }
    }
    return value.constructor.prototype === Object.prototype || Array.isArray(value);
  } else {
    return false;
  }
}
function isComparableValue(value) {
  return value == null || isComparableObject(value) || isJSONPrimitive(value) || isComparableJSON(value);
}
function comparableEquals(a, b) {
  if (isComparableValue(a) && isComparableValue(b)) {
    return comparableEqualsStrict(a, b);
  } else {
    throw new Error(`Comparing non comparable objects: ${a.constructor.name} and ${b.constructor.name}`);
  }
}

// lib/dist/MGPFallible.js
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
    return comparableEquals(this.get(), other.get());
  }
};
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
    return MGPOptional.of(this.value);
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
    return MGPOptional.empty();
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

// lib/dist/MGPValidation.js
var MGPValidation;
(function(MGPValidation2) {
  MGPValidation2.SUCCESS = MGPFallible.success(void 0);
  function ofFallible(fallible) {
    if (fallible.isSuccess()) {
      return MGPValidation2.SUCCESS;
    } else {
      return MGPValidation2.failure(fallible.getReason());
    }
  }
  MGPValidation2.ofFallible = ofFallible;
  function failure(reason) {
    return MGPFallible.failure(reason);
  }
  MGPValidation2.failure = failure;
})(MGPValidation || (MGPValidation = {}));

// lib/dist/ArrayUtils.js
var ArrayUtils = class _ArrayUtils {
  /**
   * Create an array of size width containing initValue.
   * Watch out: initValue is repeated without copy,
   * so if it is an object that will be mutated,
   * it will also change the values of all fields.
   * General rule: don't mutate objects stored in such arrays.
   */
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
      if (comparableEquals(t1[i], t2[i]) === false)
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
   * Does not use a cryptographically secure random selection.
   */
  static getRandomElement(array) {
    Utils.assert(array.length > 0, "ArrayUtils.getRandomElement must be called on an array containing elements");
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  /**
   * Gets the maximum elements of an array, according to a given metric.
   * Returns an array containing all the maximal values
   */
  static maximumsBy(array, metric) {
    let maximums = [];
    let maxMetricValue = Number.NEGATIVE_INFINITY;
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
    return _ArrayUtils.countByPredicate(array, (element) => comparableEquals(element, value));
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
      if (comparableEquals(value, element)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Check whether the first argument is strictly smaller than the second, element-wise
   */
  static isLessThan(inferior, superior) {
    Utils.assert(inferior.length > 0 && superior.length > 0, "ArrayUtils.isLessThan/isGreaterThan should have two non-empty list as parameter");
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

// lib/dist/Sets.js
var Sets = class {
  static toComparableSet(list) {
    const result = [];
    list.forEach((other) => {
      if (result.some((el) => comparableEquals(el, other)) === false) {
        result.push(other);
      }
    });
    return result;
  }
};

// lib/dist/Set.js
var Set2 = class _Set {
  values;
  constructor(values) {
    if (values === void 0) {
      this.values = [];
    } else {
      this.values = Sets.toComparableSet(values);
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
    const result = ArrayUtils.map(this.values, (v) => {
      if (v == null) {
        return "null";
      } else {
        return v.toString();
      }
    });
    return "[" + result.join(", ") + "]";
  }
  contains(element) {
    return ArrayUtils.contains(this.values, element);
  }
  toList() {
    return ArrayUtils.copy(this.values);
  }
  getAnyElement() {
    if (this.size() > 0) {
      return MGPOptional.of(this.values[0]);
    } else {
      return MGPOptional.empty();
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
        return MGPOptional.of(element);
      }
    }
    return MGPOptional.empty();
  }
  /**
   * @param other the "reference" set
   * @returns an empty optional is nothing miss in this set; the first element missing as an optional if there is one
   */
  getMissingElementFrom(other) {
    for (const element of other) {
      if (this.contains(element) === false) {
        return MGPOptional.of(element);
      }
    }
    return MGPOptional.empty();
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
    return this.filter((e) => comparableEquals(e, element) === false);
  }
  map(mapper) {
    const result = ArrayUtils.map(this.values, mapper);
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

// lib/dist/MGPMap.js
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
      if (comparableEquals(keymap.key, key)) {
        return MGPOptional.of(keymap.value);
      }
    }
    return MGPOptional.empty();
  }
  getAnyPair() {
    if (this.size() > 0) {
      return MGPOptional.of(this.map[0]);
    } else {
      return MGPOptional.empty();
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
    Utils.assert(this.isImmutable === false, "Cannot call " + methodCalled + " on immutable map!");
  }
  put(key, value) {
    this.assertImmutability("put");
    for (const entry of this.map) {
      if (comparableEquals(entry.key, key)) {
        const oldValue = entry.value;
        entry.value = value;
        return MGPOptional.of(oldValue);
      }
    }
    this.map.push({ key, value });
    return MGPOptional.empty();
  }
  containsKey(key) {
    return this.map.some((entry) => comparableEquals(entry.key, key));
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
    return new Set2(this.getKeyList());
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
      if (comparableEquals(entry.key, key)) {
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
      Utils.assert(otherValue.isPresent(), "value is absent in a map even though its key is present!");
      if (comparableEquals(thisValue, otherValue.get()) === false) {
        return false;
      }
    }
    return true;
  }
};

// lib/dist/Combinatorics.js
var Combinatorics = class {
  static getCombinations(elements, size) {
    Utils.assert(size <= elements.length, "cannot compute combinations for less elements than needed");
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

// lib/dist/MathUtils.js
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

// lib/dist/ReversibleMap.js
var ReversibleMap = class _ReversibleMap extends MGPMap {
  reverse() {
    const reversedMap = new _ReversibleMap();
    for (const key of this.getKeyList()) {
      const value = this.get(key).get();
      if (reversedMap.containsKey(value)) {
        const newSet = reversedMap.get(value).get().addElement(key);
        reversedMap.put(value, newSet);
      } else {
        const newSet = new Set2([key]);
        reversedMap.set(value, newSet);
      }
    }
    return reversedMap;
  }
};

// lib/dist/MGPUniqueList.js
var MGPUniqueList = class extends Set2 {
  equals(other) {
    if (other.size() !== this.size()) {
      return false;
    }
    for (let i = 0; i < this.size(); i++) {
      const otherValue = other.get(i);
      const thisValue = this.get(i);
      if (comparableEquals(otherValue, thisValue) === false) {
        return false;
      }
    }
    return true;
  }
  get(index) {
    Utils.assert(index < this.values.length, "MGPUniqueList: index out of bounds: " + index);
    return this.values[index];
  }
  /**
    * Get element starting to count from the end (0 for the last)
    * @param index the index of the element to fetch, starting from the end (0 as last)
    */
  getFromEnd(index) {
    Utils.assert(index < this.values.length, "MGPUniqueList: index (from end) out of bounds: " + index);
    const lastIndex = this.values.length - 1;
    return this.get(lastIndex - index);
  }
};

// lib/dist/NumberMap.js
var NumberMap = class extends MGPMap {
  add(key, value) {
    const oldValue = this.get(key);
    Utils.assert(oldValue.isPresent(), `NumberMap.add called on an invalid key: ${key}`);
    return this.put(key, oldValue.get() + value);
  }
  addOrSet(key, value) {
    if (this.containsKey(key)) {
      return this.add(key, value);
    } else {
      this.set(key, value);
      return MGPOptional.of(value);
    }
  }
};

// lib/dist/OptimizedSet.js
var OptimizedSet = class extends Set2 {
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

// lib/dist/TimeUtils.js
var TimeUtils = class {
  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
};

// games/dist/jscaip/Move.js
var Move = class {
  __nominal;
  // For strict typing
};

// games/dist/jscaip/AI/AI.js
var MoveGenerator = class {
};
var AIStats = class {
  static aiTime = /* @__PURE__ */ new Map();
};

// games/dist/utils/Debug.js
var Debug = class _Debug {
  /**
   * Enables logging for a class or method programmatically.
   * For example, call `Debug.enableLog([true, false], 'YourClass', 'yourMethod')` in app.component.ts
   * `entryExit` is composed of two booleans: the first states if we want to log entry to a method,
   * the second if we want to log exit
   */
  static enableLog(entryExit, className, methodName) {
    const verbosityJSON = localStorage.getItem("verbosity");
    let verbosity = {};
    if (verbosityJSON != null) {
      verbosity = JSON.parse(verbosityJSON);
    }
    if (methodName === void 0) {
      verbosity[className] = entryExit;
    } else {
      verbosity[className + "." + methodName] = entryExit;
    }
    const stringifiedVerbosity = _Debug.getStringified(verbosity);
    localStorage.setItem("verbosity", stringifiedVerbosity);
  }
  static getStringified(o) {
    try {
      return JSON.stringify(o);
    } catch (e) {
      return "recursive and not stringifiable!";
    }
  }
  static isVerbose(name) {
    const verbosityJSON = localStorage.getItem("verbosity");
    if (verbosityJSON == null)
      return [false, false];
    try {
      const verbosity = JSON.parse(verbosityJSON);
      if (verbosity[name] == null)
        return [false, false];
      Utils.assert(Array.isArray(verbosity[name]), `malformed verbosity levels for ${name}: ${verbosity[name]}`);
      return verbosity[name];
    } catch (e) {
      throw new Error(`malformed verbosity object: ${verbosityJSON}`);
    }
  }
  static isMethodVerboseEntry(className, methodName) {
    return _Debug.isVerbose(className)[0] || _Debug.isVerbose(className + "." + methodName)[0];
  }
  static isMethodVerboseExit(className, methodName) {
    return _Debug.isVerbose(className)[1] || _Debug.isVerbose(className + "." + methodName)[1];
  }
  static display(className, methodName, message) {
    if (_Debug.isMethodVerboseEntry(className, methodName)) {
      console.log(`${className}.${methodName}: ${message}`);
    }
  }
  /**
   * Class decorator that enables logging for all methods of a class
   * Note: we could think that T should be typed `T extends { new(...args: unknown[]): unknown }`
   * but this would restrict the decorator to only be applied to classes with public constructors.
   */
  static log(constructor) {
    const className = constructor["name"];
    for (const propertyName of Object.getOwnPropertyNames(constructor["prototype"])) {
      const nullableDescriptor = Object.getOwnPropertyDescriptor(
        // eslint-disable-next-line dot-notation
        constructor["prototype"],
        propertyName
      );
      const descriptor = Utils.getNonNullable(nullableDescriptor);
      const isMethod = descriptor.value instanceof Function;
      Utils.assert(isMethod, "cannot add logging to properties that are not methods!");
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        if (_Debug.isMethodVerboseEntry(className, propertyName)) {
          const strArgs = Array.from(args).map(_Debug.getStringified).join(", ");
          console.log(`> ${className}.${propertyName}(${strArgs})`);
        }
        const result = originalMethod.apply(this, args);
        if (_Debug.isMethodVerboseExit(className, propertyName)) {
          console.log(`< ${className}.${propertyName} -> ${_Debug.getStringified(result)}`);
        }
        return result;
      };
      Object.defineProperty(constructor["prototype"], propertyName, descriptor);
    }
  }
};
window["enableLog"] = Debug.enableLog;

// games/dist/jscaip/Player.js
var PlayerNone = class _PlayerNone {
  static NONE = new _PlayerNone();
  value = 2;
  constructor() {
  }
  isPlayer() {
    return false;
  }
  isNone() {
    return true;
  }
  toString() {
    return "PLAYER_NONE";
  }
  equals(other) {
    return this === other;
  }
  getValue() {
    return this.value;
  }
};
var Player = class _Player {
  value;
  static ZERO = new _Player(0);
  static ONE = new _Player(1);
  static PLAYERS = [_Player.ZERO, _Player.ONE];
  static encoder = Encoder.tuple([Encoder.identity()], (player) => [player.getValue()], (fields) => _Player.of(fields[0]));
  static of(value) {
    switch (value) {
      case 0:
        return _Player.ZERO;
      default:
        Utils.expectToBe(value, 1);
        return _Player.ONE;
    }
  }
  static ofTurn(turn) {
    return turn % 2 === 0 ? _Player.ZERO : _Player.ONE;
  }
  constructor(value) {
    this.value = value;
  }
  isPlayer() {
    return true;
  }
  isNone() {
    return false;
  }
  toString() {
    switch (this) {
      case _Player.ZERO:
        return "PLAYER_ZERO";
      default:
        Utils.expectToBe(this, _Player.ONE, "Player should not be something else than Player.ZERO and Player.ONE");
        return "PLAYER_ONE";
    }
  }
  equals(other) {
    return this === other;
  }
  getScoreModifier() {
    if (this.value === 0) {
      return -1;
    } else {
      return 1;
    }
  }
  getYDirection() {
    return this.getScoreModifier();
  }
  getOpponent() {
    switch (this) {
      case _Player.ZERO:
        return _Player.ONE;
      default:
        Utils.expectToBe(this, _Player.ONE);
        return _Player.ZERO;
    }
  }
  getValue() {
    return this.value;
  }
  getHTMLClass(postfix) {
    return "player" + this.getValue() + postfix;
  }
};
var PlayerOrNone;
(function(PlayerOrNone2) {
  PlayerOrNone2.ZERO = Player.ZERO;
  PlayerOrNone2.ONE = Player.ONE;
  PlayerOrNone2.NONE = PlayerNone.NONE;
  PlayerOrNone2.encoder = new class extends Encoder {
    encode(player) {
      return player.getValue();
    }
    decode(encoded) {
      if (encoded === 2)
        return PlayerOrNone2.NONE;
      Utils.assert(encoded === 0 || encoded === 1, "Invalid encoded player: " + encoded);
      return Player.of(encoded);
    }
  }();
})(PlayerOrNone || (PlayerOrNone = {}));

// games/dist/jscaip/AI/BoardValue.js
var BoardValue = class _BoardValue {
  metrics;
  static max(left, right) {
    const max = ArrayUtils.max(left.metrics, right.metrics);
    return _BoardValue.multiMetric(max);
  }
  static min(left, right) {
    const min = ArrayUtils.min(left.metrics, right.metrics);
    return _BoardValue.multiMetric(min);
  }
  static getVictoryValueOf(player) {
    if (player === Player.ZERO) {
      return Number.NEGATIVE_INFINITY;
    } else {
      return Number.POSITIVE_INFINITY;
    }
  }
  static getPreVictoryValueOf(player) {
    if (player === Player.ZERO) {
      return Number.MIN_SAFE_INTEGER + 1;
    } else {
      return Number.MAX_SAFE_INTEGER - 1;
    }
  }
  static isVictoryValue(score) {
    return score === _BoardValue.getVictoryValueOf(Player.ZERO) || score === _BoardValue.getVictoryValueOf(Player.ONE);
  }
  static isPreVictoryValue(score) {
    return score === _BoardValue.getPreVictoryValueOf(Player.ZERO) || score === _BoardValue.getPreVictoryValueOf(Player.ONE);
  }
  /**
   * return the board value corresponding to the players' scores
   * @param playerZeroScore the positive score of player zero
   * @param playerOneScore the positive score of player one
   */
  static ofSingle(playerZeroScore, playerOneScore) {
    return _BoardValue.ofMultiple([playerZeroScore], [playerOneScore]);
  }
  /**
   * return the board value corresponding to the players' scores, as a number map
   */
  static ofPlayerNumberMap(map) {
    return _BoardValue.ofSingle(map.get(Player.ZERO), map.get(Player.ONE));
  }
  /**
   * return the board value corresponding to the players' scores
   * @param playerZeroScores the positive score list of player zero
   * @param playerOneScores the positive score list of player one
   */
  static ofMultiple(playerZeroScores, playerOneScores) {
    Utils.assert(playerZeroScores.length === playerOneScores.length, "both player should have the same number of metric");
    Utils.assert(playerZeroScores.length !== 0, "scores list should not be empty");
    const subValues = [];
    for (let i = 0; i < playerZeroScores.length; i++) {
      const playerZeroScore = playerZeroScores[i] * Player.ZERO.getScoreModifier();
      const playerOneScore = playerOneScores[i] * Player.ONE.getScoreModifier();
      subValues.push(playerZeroScore + playerOneScore);
    }
    return new _BoardValue(subValues);
  }
  static of(value) {
    return new _BoardValue([value]);
  }
  static multiMetric(metrics) {
    return new _BoardValue(metrics);
  }
  static isLessThan(left, right) {
    return ArrayUtils.isLessThan(left.metrics, right.metrics);
  }
  static isGreaterThan(left, right) {
    return ArrayUtils.isGreaterThan(left.metrics, right.metrics);
  }
  constructor(metrics) {
    this.metrics = metrics;
  }
  toMaximum() {
    const size = this.metrics.length;
    const maximums = ArrayUtils.create(size, _BoardValue.getVictoryValueOf(Player.ONE));
    return _BoardValue.multiMetric(maximums);
  }
  toMinimum() {
    const size = this.metrics.length;
    const minimums = ArrayUtils.create(size, _BoardValue.getVictoryValueOf(Player.ZERO));
    return _BoardValue.multiMetric(minimums);
  }
  equals(other) {
    return ArrayUtils.equals(this.metrics, other.metrics);
  }
};

// games/dist/jscaip/GameStatus.js
var GameStatus = class _GameStatus {
  isEndGame;
  winner;
  static ZERO_WON = new _GameStatus(true, Player.ZERO);
  static ONE_WON = new _GameStatus(true, Player.ONE);
  static DRAW = new _GameStatus(true, PlayerOrNone.NONE);
  static ONGOING = new _GameStatus(false, PlayerOrNone.NONE);
  static getVictory(player) {
    if (player === Player.ZERO) {
      return _GameStatus.ZERO_WON;
    } else {
      return _GameStatus.ONE_WON;
    }
  }
  static getDefeat(player) {
    if (player === Player.ZERO) {
      return _GameStatus.ONE_WON;
    } else {
      return _GameStatus.ZERO_WON;
    }
  }
  constructor(isEndGame, winner) {
    this.isEndGame = isEndGame;
    this.winner = winner;
  }
  toBoardValue() {
    if (this.winner.isPlayer()) {
      return BoardValue.of(BoardValue.getVictoryValueOf(this.winner));
    } else {
      return BoardValue.of(0);
    }
  }
};

// games/dist/jscaip/AI/GameNode.js
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GameNode_1;
var GameNodeStats = class {
  static createdNodes = 0;
};
var GameNode = class GameNode2 {
  static {
    GameNode_1 = this;
  }
  gameState;
  parent;
  previousMove;
  static ID = 0;
  id;
  // Used for debug purposes to uniquely identify nodes
  /**
   * The children of this node.
   * It is a map keyed with moves, with as value the child that corresponds
   * to applying that move to the current state.
   */
  children = new MGPMap();
  /**
   * A cache that AIs can use. It is up to the AIs to properly name and type the values in the cache.
   */
  cache = new MGPMap();
  constructor(gameState, parent = MGPOptional.empty(), previousMove = MGPOptional.empty()) {
    this.gameState = gameState;
    this.parent = parent;
    this.previousMove = previousMove;
    this.id = GameNode_1.ID++;
    GameNodeStats.createdNodes++;
  }
  /**
   * Returns the child corresponding to applying the given move to the current state,
   * or empty if it has not yet been calculated.
   */
  getChild(move) {
    return this.children.get(move);
  }
  /**
   * Checks whether this node has children
   */
  hasChildren() {
    return this.getChildren().length > 0;
  }
  /**
   * Returns all the children of the node
   */
  getChildren() {
    return this.children.getValueList();
  }
  /**
   * Adds a child to this node.
   */
  addChild(node) {
    Utils.assert(node.previousMove.isPresent(), "GameNode: addChild expects a node with a previous move");
    this.children.set(node.previousMove.get(), node);
  }
  /**
   * Represents the tree starting at this node as a DOT graph.
   * You can view the DOT graph with a tool like xdot,
   * or by pasting it on a website like https://dreampuf.github.io/GraphvizOnline/
   */
  showDot(rules, config, labelFn, max, level = 0, id = 0) {
    let buffer = "";
    if (level === 0) {
      buffer += "digraph G {\n";
    }
    const gameStatus = rules.getGameStatus(this, config);
    let winner = PlayerOrNone.NONE;
    if (gameStatus.isEndGame) {
      winner = gameStatus.winner;
    }
    let nextId = id + 1;
    const currentPlayer = this.gameState.getCurrentPlayer();
    let onlyLosses = true;
    if (max === void 0 || level < max) {
      const children = this.children.getValueList();
      for (const child of children) {
        const playerColor = this.getPlayerDotColor(this.gameState.getCurrentPlayer());
        buffer += `    node_${id} -> node_${nextId} [label="${child.previousMove.get()}"; color="${playerColor}"];
`;
        const result = child.showDot(rules, config, labelFn, max, level + 1, nextId);
        nextId = result.nextId;
        buffer += result.dot;
        if (result.winner === currentPlayer) {
          winner = result.winner;
          onlyLosses = false;
        }
        if (result.winner !== currentPlayer.getOpponent()) {
          onlyLosses = false;
        }
      }
    }
    if (onlyLosses && gameStatus === GameStatus.ONGOING) {
      onlyLosses = false;
    }
    let color = "white";
    if (winner.isPlayer()) {
      color = this.getPlayerDotColor(winner);
    }
    if (gameStatus === GameStatus.DRAW) {
      color = "gray";
    }
    let label = `#${this.gameState.turn}: ${this.id}`;
    if (labelFn !== void 0) {
      label += ` - ${labelFn(this)}`;
    }
    buffer += `    node_${id} [label="${label}", style=filled, fillcolor="${color}"];
`;
    if (level === 0) {
      buffer += "}";
    }
    return { dot: buffer, nextId, winner };
  }
  getPlayerDotColor(player) {
    switch (player) {
      case Player.ZERO:
        return "#994d00";
      default:
        Utils.expectToBe(player, Player.ONE);
        return "#ffc34d";
    }
  }
  /**
   * Get a value from the cache, or MGPOptional if it does not exist in the cache.
   */
  getCache(key) {
    return this.cache.get(key);
  }
  /**
   * Set or replace a value from the cache.
   */
  setCache(key, value) {
    if (this.cache.containsKey(key)) {
      this.cache.replace(key, value);
    } else {
      this.cache.set(key, value);
    }
  }
};
GameNode = GameNode_1 = __decorate([
  Debug.log
], GameNode);

// games/dist/jscaip/PlayerNumberTable.js
var PlayerNumberTable = class _PlayerNumberTable extends MGPMap {
  static of(playerZero, playerOne) {
    return new _PlayerNumberTable([
      { key: Player.ZERO, value: playerZero },
      { key: Player.ONE, value: playerOne }
    ]);
  }
  static ofSingle(playerZero, playerOne) {
    return _PlayerNumberTable.of([playerZero], [playerOne]);
  }
  add(player, index, value) {
    const list = ArrayUtils.copy(this.get(player).get());
    list[index] += value;
    return this.put(player, list);
  }
  concat(other) {
    const playerZeroStart = this.get(Player.ZERO).get();
    const playerOneStart = this.get(Player.ONE).get();
    const playerZeroEnd = other.get(Player.ZERO).get();
    const playerOneEnd = other.get(Player.ONE).get();
    return _PlayerNumberTable.of(playerZeroStart.concat(playerZeroEnd), playerOneStart.concat(playerOneEnd));
  }
};

// games/dist/jscaip/PlayerMap.js
var PlayerMap = class _PlayerMap {
  map;
  static ofValues(playerZeroValue, playerOneValue) {
    const map = new MGPMap([
      { key: Player.ZERO, value: playerZeroValue },
      { key: Player.ONE, value: playerOneValue }
    ]);
    return new _PlayerMap(map);
  }
  constructor(map) {
    this.map = map;
  }
  makeImmutable() {
    return this.map.makeImmutable();
  }
  equals(other) {
    return this.map.equals(other.map);
  }
  get(player) {
    return this.map.get(player).get();
  }
  put(player, value) {
    return this.map.put(player, value).get();
  }
};
var PlayerNumberMap = class _PlayerNumberMap extends PlayerMap {
  static of(playerZeroValue, playerOneValue) {
    const map = new MGPMap([
      { key: Player.ZERO, value: playerZeroValue },
      { key: Player.ONE, value: playerOneValue }
    ]);
    return new _PlayerNumberMap(map);
  }
  add(player, value) {
    const oldValue = this.get(player);
    return this.map.put(player, oldValue + value);
  }
  subtract(player, value) {
    const oldValue = this.get(player);
    return this.map.put(player, oldValue - value);
  }
  toTable() {
    return PlayerNumberTable.ofSingle(this.get(Player.ZERO), this.get(Player.ONE));
  }
  getCopy() {
    return new _PlayerNumberMap(this.map.getCopy());
  }
};

// games/dist/jscaip/AI/MCTS.js
var MCTS = class {
  name;
  moveGenerator;
  rules;
  // The exploration parameter influences the MCTS results.
  // It is chosen "empirically". The generally recommended value from Wikipedia is Math.sqrt(2),
  // but in our case it seems to work much better with a higher exploration parameter.
  // A higher exploration parameter steers MCTS towards exploring more unexplored playouts, vs. exploring its wins.
  explorationParameter = 80;
  // The longest a game can be before we decide to stop simulating it
  maxGameLength = 7 * 6;
  // Set to the number of moves in connect 4
  availableOptions = [];
  // An id unique to this MCTS, used to store/retrieve cached value in nodes without clashing with other AIs
  uniqueId;
  constructor(name, moveGenerator, rules) {
    this.name = name;
    this.moveGenerator = moveGenerator;
    this.rules = rules;
    this.uniqueId = Math.random().toString(36).substring(2, 8);
    for (let i = 1; i < 10; i++) {
      this.availableOptions.push({ name: `${i * i} seconds`, maxSeconds: i * i });
    }
  }
  /**
   * Performs the search, given a node representing a board.
   * The search is performed for at most `iterations` iterations.
   */
  chooseNextMove(root, options, config) {
    Utils.assert(this.rules.getGameStatus(root, config).isEndGame === false, "cannot search from a finished game");
    const player = root.gameState.getCurrentPlayer();
    const startTime = Date.now();
    const endTime = Date.now() + options.maxSeconds * 1e3;
    let iterations = 0;
    while (Date.now() < endTime) {
      const expansionResult = this.expand(this.select({ node: root, path: [root] }, player), config);
      const gameStatus = this.simulate(expansionResult.node, endTime, config);
      this.backpropagate(expansionResult.path, this.score(expansionResult.node, config, gameStatus, player));
      iterations++;
    }
    Debug.display("MCTS", "chooseNextMove", "root winRatio: " + this.winRatio(root));
    Debug.display("MCTS", "chooseNextMove", "children winRatio: " + root.getChildren().map((n) => n.id + ": " + this.winRatio(n)));
    const bestChildren = ArrayUtils.maximumsBy(root.getChildren(), (n) => this.winRatio(n));
    const bestChild = ArrayUtils.getRandomElement(bestChildren);
    const seconds = (Date.now() - startTime) / 1e3;
    Debug.display("MCTS", "chooseNextMove", `Computed ${iterations} in ${seconds} (rate: ${iterations / seconds} it/s)`);
    Debug.display("MCTS", "chooseNextMove", "Best child has a win ratio of: " + this.winRatio(bestChild));
    return bestChild.previousMove.get();
  }
  /**
   * Returns 1 for win, 0 for losses. Must return a result between 0 and 1 otherwise.
   */
  score(_node, _config, gameStatus, player) {
    switch (gameStatus) {
      case GameStatus.DRAW:
      case GameStatus.ONGOING:
        return 0.01;
      // Prefer ongoing/draw to loss
      default:
        if (gameStatus.winner === player)
          return 1;
        else
          return 0;
    }
  }
  /**
   * Computes the UCB value of a node.
   * The UCB (Upper-Confidence-Bound) is a value used to select nodes to explore.
   */
  adversarialUcb(node, parentSimulations, player) {
    const simulations = this.simulations(node);
    if (parentSimulations === 0 || simulations === 0) {
      return Number.POSITIVE_INFINITY;
    }
    const winRatio = this.wins(node) / simulations;
    const exploitation = node.gameState.getPreviousPlayer() === player ? winRatio : 1 - winRatio;
    return exploitation + this.explorationParameter * Math.sqrt(Math.log(parentSimulations) / simulations);
  }
  /**
   * Computes the win ratio for this node, as how many simulations have been won.
   */
  winRatio(node) {
    const simulations = this.simulations(node);
    if (simulations === 0) {
      return 1;
    }
    return this.wins(node) / simulations;
  }
  wins(node) {
    return this.getCounterFromCache(node, "wins");
  }
  simulations(node) {
    return this.getCounterFromCache(node, "simulations");
  }
  getCounterFromCache(node, name) {
    const cachedValue = node.getCache(this.uniqueId + name);
    if (cachedValue.isPresent()) {
      return cachedValue.get();
    } else {
      node.setCache(this.uniqueId + name, 0);
      return 0;
    }
  }
  /**
   * Selects the node that we will consider in this iteration.
   * This takes the first unexplored node it finds in a BFS fashion.
   * @returns the selected node
   */
  select(nodeAndPath, player) {
    const node = nodeAndPath.node;
    Debug.display("MCTS", "select", "Exploring node: " + node.id);
    if (node.hasChildren()) {
      const simulations = this.simulations(node);
      Debug.display("MCTS", "select", "UCB values: " + node.getChildren().map((n) => n.id + ": " + this.adversarialUcb(n, simulations, player)));
      const bestChildren = ArrayUtils.maximumsBy(node.getChildren(), (n) => this.adversarialUcb(n, simulations, player));
      const childToVisit = ArrayUtils.getRandomElement(bestChildren);
      Debug.display("MCTS", "select", "selecting children " + childToVisit.id);
      return this.select({ node: childToVisit, path: nodeAndPath.path.concat([childToVisit]) }, player);
    } else {
      Debug.display("MCTS", "select", "this is a leaf node, we select it");
      return nodeAndPath;
    }
  }
  /**
   * Expands a node, i.e., creates children to explore if needed, or returns the node directly.
   * @returns one of the created child, or the node itself if it is terminal
   */
  expand(nodeAndPath, config) {
    if (this.rules.getGameStatus(nodeAndPath.node, config).isEndGame) {
      return nodeAndPath;
    }
    const node = nodeAndPath.node;
    const moves = this.moveGenerator.getListMoves(node, config);
    Utils.assert(moves.length > 0, `${this.name}: move generator did not return any move on a non-finished game: ${this.moveGenerator.constructor.name}`);
    for (const move of moves) {
      node.addChild(this.play(node, move, config));
    }
    const pickedChild = ArrayUtils.getRandomElement(node.getChildren());
    return { node: pickedChild, path: nodeAndPath.path.concat([pickedChild]) };
  }
  /**
   * Simulate a game from the given node. Does not change anything in the node.
   * @returns the game status at the end of the simulation
   */
  simulate(node, endTime, config) {
    Debug.display("MCTS", "simulate", "simulate from node which has a last move of " + node.previousMove.get().toString());
    let current = node;
    let steps = 0;
    while (steps < this.maxGameLength && Date.now() < endTime) {
      const status = this.rules.getGameStatus(current, config);
      if (status.isEndGame) {
        Debug.display("MCTS", "simulate", `end game in ${steps} steps, winner is ${status.winner}`);
        return status;
      }
      steps++;
      current = this.playRandomStep(current, config);
    }
    return GameStatus.ONGOING;
  }
  /**
   * Picks a random move and play it
   * @returns the state after the move
   */
  playRandomStep(node, config) {
    const moves = this.moveGenerator.getListMoves(node, config);
    Utils.assert(moves.length > 0, "MoveGenerator gave empty list of moves for ongoing game to MCTS");
    const move = ArrayUtils.getRandomElement(moves);
    return this.play(node, move, config);
  }
  /**
   * Plays a move.
   * @returns the state after the move
   */
  play(node, move, config) {
    const legality = this.rules.isLegal(move, node.gameState, config);
    Utils.assert(legality.isSuccess(), "heuristic returned illegal move", { move: move.toString() });
    const childState = this.rules.applyLegalMove(move, node.gameState, config, legality.get());
    const childNode = new GameNode(childState, MGPOptional.of(node), MGPOptional.of(move));
    return childNode;
  }
  /**
   * Backpropagates the result of a simulation in a path from the simulated node to the root of the tree.
   * @returns nothing, as it modifies the nodes directly
   */
  backpropagate(path, score) {
    for (const node of path) {
      this.addSimulationResult(node, score);
      Debug.display("MCTS", "backpropagate", `backpropagate to node which now has ${this.wins(node) / this.simulations(node)}`);
    }
  }
  addSimulationResult(node, score) {
    const simulations = this.simulations(node) + 1;
    const wins = this.wins(node) + score;
    node.setCache(this.uniqueId + "wins", wins);
    node.setCache(this.uniqueId + "simulations", simulations);
  }
  getInfo(node) {
    const wins = this.getCounterFromCache(node, "wins");
    const simulations = this.getCounterFromCache(node, "simulations");
    return `wins/simulations=${wins}/${simulations}`;
  }
};

// games/dist/jscaip/AI/AbstractMinimax.js
var AbstractMinimax = class {
  name;
  rules;
  heuristic;
  moveGenerator;
  hashOverride;
  // States whether the minimax takes random moves from the list of best moves.
  useRandomness = false;
  // States whether alpha-beta pruning must be done. It probably is never useful to set it to false.
  prune = true;
  // States whether transposition tables should be used.
  // It's rare you don't want this, as you get 1-2 level extra in the same duration.
  useTranspositionTables = true;
  // The options of this minimax. Usually filled in by the constructor.
  availableOptions = [];
  // Can be set dynamically to stop the search early and return the current best results
  endSearchBy = MGPOptional.empty();
  transpositionTable = /* @__PURE__ */ new Map();
  constructor(name, rules, heuristic, moveGenerator, hashOverride) {
    this.name = name;
    this.rules = rules;
    this.heuristic = heuristic;
    this.moveGenerator = moveGenerator;
    this.hashOverride = hashOverride;
  }
  toString() {
    return this.name;
  }
  // Hash used for transposition tables
  hash(state) {
    if (this.hashOverride != null) {
      return this.hashOverride(state);
    }
    return JSON.stringify(state);
  }
  configureFromConfig(config) {
    this.useRandomness = config.useRandomness ?? this.useRandomness;
    this.prune = config.prune ?? this.prune;
    this.useTranspositionTables = config.useTranspositionTables ?? this.useTranspositionTables;
  }
  chooseNextMove(node, options, config) {
    const start = performance.now();
    try {
      return this.doChooseNextMove(node, options, config);
    } finally {
      const duration = performance.now() - start;
      const key = this.toString();
      const previous = AIStats.aiTime.get(key) ?? 0;
      AIStats.aiTime.set(key, previous + duration);
    }
  }
  // Performs an alpha-beta search to find the best move from the given node
  // @return empty when there is no best move (because the game or search has finished)
  alphaBeta(node, depth, alpha, beta, config) {
    if (depth < 1) {
      return MGPOptional.empty();
    } else if (this.rules.getGameStatus(node, config).isEndGame) {
      return MGPOptional.empty();
    }
    let ttKey = "";
    let ttEntry = void 0;
    const alphaOrig = alpha;
    const betaOrig = beta;
    if (this.useTranspositionTables) {
      ttKey = this.hash(node.gameState);
      ttEntry = this.transpositionTable.get(ttKey);
      if (ttEntry && ttEntry.depth >= depth) {
        switch (ttEntry.bound) {
          case "EXACT":
            this.setScore(node, ttEntry.score);
            return MGPOptional.of({ move: ttEntry.bestMove, score: ttEntry.score, complete: true });
          case "LOWER":
            alpha = BoardValue.max(alpha, ttEntry.score);
            break;
          case "UPPER":
            beta = BoardValue.min(beta, ttEntry.score);
            break;
        }
        if (BoardValue.isGreaterThan(alpha, beta) || alpha.equals(beta)) {
          this.setScore(node, ttEntry.score);
          return MGPOptional.of({ move: ttEntry.bestMove, score: ttEntry.score, complete: true });
        }
      }
    }
    let possibleMoves = this.getPossibleMoves(node, config);
    Utils.assert(possibleMoves.size() > 0, "Minimax " + this.name + " should give move, received none!");
    if (this.useTranspositionTables && ttEntry?.bestMove) {
      Utils.assert(possibleMoves.contains(ttEntry.bestMove), "TT bestMove " + ttEntry.bestMove.toString() + " is not in possible moves for state " + this.hash(node.gameState));
      possibleMoves.removeElement(ttEntry.bestMove);
      possibleMoves = new Set2([ttEntry.bestMove, ...possibleMoves]);
    }
    const search = this.getBestMoves(node, possibleMoves, depth, alpha, beta, config);
    const bestMove = this.getBestMoveAmong(search.bestMoves);
    Utils.assert(possibleMoves.contains(bestMove.move), "best child is not a possible move?!" + bestMove.move.toString());
    this.setScore(node, bestMove.score);
    if (this.useTranspositionTables && search.complete) {
      let bound;
      if (BoardValue.isLessThan(bestMove.score, alphaOrig) || bestMove.score.equals(alphaOrig)) {
        bound = "UPPER";
      } else if (BoardValue.isGreaterThan(bestMove.score, betaOrig) || bestMove.score.equals(betaOrig)) {
        bound = "LOWER";
      } else {
        bound = "EXACT";
      }
      this.transpositionTable.set(ttKey, {
        depth,
        score: bestMove.score,
        bound,
        bestMove: bestMove.move
      });
    }
    return MGPOptional.of({
      move: bestMove.move,
      score: bestMove.score,
      complete: search.complete
    });
  }
  getPossibleMoves(node, config) {
    const currentMoves = this.getMoves(node);
    if (currentMoves.isAbsent()) {
      const moves = this.moveGenerator.getListMoves(node, config);
      this.setMoves(node, new Set2(moves));
      return new Set2(moves);
    } else {
      return currentMoves.get();
    }
  }
  getBestMoves(node, possibleMoves, depth, alpha, beta, config) {
    let bestMoves = [];
    let complete = true;
    const currentPlayer = node.gameState.getCurrentPlayer();
    let extremumExpected = this.getExpectedExtremum(node, config);
    const newValueIsBetter = currentPlayer === Player.ZERO ? BoardValue.isLessThan : BoardValue.isGreaterThan;
    for (const move of possibleMoves) {
      if (this.endSearchBy.isPresent() && Date.now() > this.endSearchBy.get() && bestMoves.length > 0) {
        return { bestMoves, complete: false };
      }
      const child = this.getOrCreateChild(node, move, config);
      const bestMoveOptional = this.alphaBeta(child, depth - 1, alpha, beta, config);
      let bestMove;
      if (bestMoveOptional.isAbsent()) {
        bestMove = { move, score: this.getScore(child, config), complete: true };
      } else {
        bestMove = bestMoveOptional.get();
        bestMove = {
          move,
          score: bestMove.score,
          complete: bestMove.complete
        };
        complete = complete && bestMove.complete;
      }
      if (newValueIsBetter(bestMove.score, extremumExpected) || bestMoves.length === 0) {
        extremumExpected = bestMove.score;
        bestMoves = [bestMove];
      } else if (bestMove.score.equals(extremumExpected)) {
        bestMoves.push(bestMove);
      }
      if (this.prune && newValueIsBetter(extremumExpected, currentPlayer === Player.ZERO ? alpha : beta)) {
        break;
      }
      if (currentPlayer === Player.ZERO) {
        beta = BoardValue.min(extremumExpected, beta);
      } else {
        alpha = BoardValue.max(extremumExpected, alpha);
      }
    }
    return { bestMoves, complete };
  }
  getExpectedExtremum(node, config) {
    const childValue = this.getScore(node, config);
    const currentPlayer = node.gameState.getCurrentPlayer();
    if (currentPlayer === Player.ZERO) {
      return childValue.toMaximum();
    } else {
      return childValue.toMinimum();
    }
  }
  getBestMoveAmong(moves) {
    Utils.assert(moves.length > 0, "getBestChildAmong expects at least one child");
    if (this.useRandomness) {
      return ArrayUtils.getRandomElement(moves);
    } else {
      return moves[0];
    }
  }
  getOrCreateChild(node, move, config) {
    const child = node.getChild(move);
    if (child.isAbsent()) {
      const legality = this.rules.isLegal(move, node.gameState, config);
      const moveString = move.toString();
      Utils.assert(legality.isSuccess(), 'The minimax "' + this.name + '" has proposed an illegal move at turn ' + node.gameState.turn + " (" + moveString + '), refusal reason: "' + legality.getReasonOr("") + '", this should not happen.');
      const state = this.rules.applyLegalMove(move, node.gameState, config, legality.get());
      const newChild = new GameNode(state, MGPOptional.of(node), MGPOptional.of(move));
      node.addChild(newChild);
      this.setScore(newChild, this.computeBoardValue(newChild, config));
      return newChild;
    }
    return child.get();
  }
  setScore(node, score) {
    node.setCache(this.name + "-score", score);
  }
  getScore(node, config) {
    const score = node.getCache(this.name + "-score");
    if (score.isPresent()) {
      return score.get();
    } else {
      const boardValue = this.computeBoardValue(node, config);
      this.setScore(node, boardValue);
      return boardValue;
    }
  }
  computeBoardValue(node, config) {
    const gameStatus = this.rules.getGameStatus(node, config);
    if (gameStatus.isEndGame) {
      return gameStatus.toBoardValue();
    } else {
      return this.heuristic.getBoardValue(node, config);
    }
  }
  setMoves(node, moves) {
    node.setCache(this.name + "-moves", moves);
  }
  getMoves(node) {
    return node.getCache(this.name + "-moves");
  }
  getInfo(node, config) {
    return "BoardValue=" + this.heuristic.getBoardValue(node, config).metrics;
  }
};

// games/dist/jscaip/AI/IterativeDeepeningMinimax.js
var IterativeDeepeningMinimax = class extends AbstractMinimax {
  MAX_MINIMAX_LEVEL = 10;
  constructor(name, rules, heuristic, moveGenerator, hash) {
    super(name, rules, heuristic, moveGenerator, hash);
    for (let i = 1; i < this.MAX_MINIMAX_LEVEL; i++) {
      this.availableOptions.push({ name: `${i * i} seconds`, maxSeconds: i * i });
    }
  }
  doChooseNextMove(node, options, config) {
    Utils.assert(this.rules.getGameStatus(node, config).isEndGame === false, "Minimax has been asked to choose a move from a finished game");
    const boardValue = this.getExpectedExtremum(node, config);
    const start = Date.now();
    const endTime = Date.now() + options.maxSeconds * 1e3;
    this.endSearchBy = MGPOptional.of(endTime);
    let currentDepth = 1;
    let achievedDepth = 1;
    let bestMove = MGPOptional.empty();
    while (Date.now() < endTime) {
      const candidateOptional = this.alphaBeta(node, currentDepth, boardValue.toMinimum(), boardValue.toMaximum(), config);
      if (candidateOptional.isAbsent()) {
        break;
      }
      const candidate = candidateOptional.get();
      if (candidate.complete && Date.now() < this.endSearchBy.get()) {
        bestMove = MGPOptional.of(candidate.move);
        achievedDepth = currentDepth;
      }
      currentDepth++;
    }
    Utils.assert(bestMove.isPresent(), "best move should have been computed");
    console.log("achieved depth: " + achievedDepth + " in " + (Date.now() - start) + "ms");
    this.endSearchBy = MGPOptional.empty();
    return bestMove.get();
  }
};

// games/dist/jscaip/AI/MCTSWithHeuristic.js
var MCTSWithHeuristic = class extends MCTS {
  heuristic;
  constructor(name, moveGenerator, rules, heuristic) {
    super(name, moveGenerator, rules);
    this.heuristic = heuristic;
  }
  /**
   * Return a score which is the average of all metrics
   */
  score(node, config, gameStatus, player) {
    if (gameStatus === GameStatus.ONGOING) {
      const boardValue = this.heuristic.getBoardValue(node, config);
      const bounds = this.heuristic.getBounds(config);
      Utils.assert(boardValue.metrics.length === bounds.player0Best.metrics.length && boardValue.metrics.length === bounds.player1Best.metrics.length, `MCTSWithHeuristic ${this.name}: metrics and bound values should have the same shape`);
      let value = 0;
      for (let i = 0; i < boardValue.metrics.length; i++) {
        const player0Best = bounds.player0Best.metrics[i];
        const metric = boardValue.metrics[i];
        const player1Best = bounds.player1Best.metrics[i];
        const isOutOfBounds = metric < player0Best || player1Best < metric;
        const isPreVictory = BoardValue.isPreVictoryValue(metric);
        if (isOutOfBounds && isPreVictory === false) {
          console.warn(`MCTSWithHeuristic ${this.name} got a value outside its bounds: ${metric} is outside of [${player0Best}, ${player1Best}]`);
        }
        const boundedMetric = Math.max(player0Best, Math.min(metric, player1Best));
        const denom = player1Best - player0Best;
        if (denom === 0) {
          value += 0.5;
        } else {
          value += (boundedMetric - player0Best) / denom;
        }
      }
      value = value / boardValue.metrics.length;
      Utils.assert(0 <= value && value <= 1, `MCTSWithHeuristic ${this.name} got a value outside of [0,1]`);
      if (player === Player.ONE) {
        return value;
      } else {
        return 1 - value;
      }
    } else {
      return super.score(node, config, gameStatus, player);
    }
  }
};

// games/dist/jscaip/AI/Heuristic.js
var Heuristic = class {
};
var HeuristicWithBounds = class extends Heuristic {
};

// games/dist/jscaip/AI/Minimax.js
var PlayerMetricHeuristicWithBounds = class extends HeuristicWithBounds {
  // Yes, this is duplicated from PlayerMetricHeuristic, because we don't have multiple inheritance
  // and probably don't want to use mixins!
  getBoardValue(node, config) {
    const metrics = this.getMetrics(node, config);
    return BoardValue.ofMultiple(metrics.get(Player.ZERO).get(), metrics.get(Player.ONE).get());
  }
};
var Minimax = class extends AbstractMinimax {
  constructor(name, rules, heuristic, moveGenerator, hash) {
    super(name, rules, heuristic, moveGenerator, hash);
    for (let i = 1; i < 10; i++) {
      this.availableOptions.push({ name: `Level ${i}`, maxDepth: i });
    }
  }
  doChooseNextMove(node, options, config) {
    Utils.assert(this.rules.getGameStatus(node, config).isEndGame === false, "Minimax has been asked to choose a move from a finished game");
    const boardValue = this.getExpectedExtremum(node, config);
    return this.alphaBeta(node, options.maxDepth, boardValue.toMinimum(), boardValue.toMaximum(), config).get().move;
  }
};

// games/dist/jscaip/AI/AIConfigUtils.js
var AIInstanceRegistry = class {
  instances = /* @__PURE__ */ new Map();
  getOrCreate(config, strategy, factory) {
    let instancesForConfig = this.instances.get(config);
    if (instancesForConfig == null) {
      instancesForConfig = /* @__PURE__ */ new Map();
      this.instances.set(config, instancesForConfig);
    }
    const existing = instancesForConfig.get(strategy);
    if (existing != null) {
      return existing;
    }
    const ai = factory();
    instancesForConfig.set(strategy, ai);
    return ai;
  }
};
function createMinimaxFromConfig(rules, config) {
  const minimax = new Minimax(config.name, rules, config.heuristic(), config.moveGenerator(), config.hash);
  minimax.configureFromConfig(config);
  return minimax;
}
function createIterativeDeepeningMinimaxFromConfig(rules, config) {
  const minimax = new IterativeDeepeningMinimax(config.name, rules, config.heuristic(), config.moveGenerator(), config.hash);
  minimax.configureFromConfig(config);
  return minimax;
}
function createMCTSFromConfig(rules, config) {
  if (config.heuristic == null) {
    return new MCTS(config.name, config.moveGenerator(), rules);
  } else {
    return new MCTSWithHeuristic(config.name, config.moveGenerator(), rules, config.heuristic());
  }
}

// games/dist/utils/LocaleUtils.js
var LocaleUtils = class _LocaleUtils {
  static getNavigatorLanguage() {
    return navigator.language;
  }
  static getStoredLocale() {
    return localStorage.getItem("locale");
  }
  static getLocale() {
    const defaultLocale = "fr";
    const validLocales = ["en", "fr"];
    const foundLocale = _LocaleUtils.getStoredLocale() ?? _LocaleUtils.getNavigatorLanguage() ?? defaultLocale;
    const locale = foundLocale.slice(0, 2).toLowerCase();
    if (validLocales.some((validLocale) => validLocale === locale)) {
      return locale;
    } else {
      return defaultLocale;
    }
  }
};

// games/dist/config/ConfigLine.js
var ConfigLine = class {
  defaultValue;
  title;
  constructor(defaultValue, title) {
    this.defaultValue = defaultValue;
    this.title = title;
  }
};

// games/dist/config/BooleanConfig.js
var BooleanConfig = class extends ConfigLine {
  constructor(defaultValue, title) {
    super(defaultValue, title);
  }
  checkValidity(value) {
    if (typeof value === "boolean") {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure("BooleanConfig expects a boolean value");
    }
  }
};

// games/dist/config/EnumConfig.js
var EnumConfig = class extends ConfigLine {
  possibleValues;
  validator;
  constructor(value, title, possibleValues, validator = (_) => MGPValidation.SUCCESS) {
    super(value, title);
    this.possibleValues = possibleValues;
    this.validator = validator;
  }
  checkValidity(fieldValue) {
    if (typeof fieldValue !== "string") {
      return MGPValidation.failure("EnumConfig expects a string value");
    } else if (Object.keys(this.possibleValues).indexOf(fieldValue) === -1) {
      return MGPValidation.failure("This value is not among the possible values");
    } else {
      return this.validator(fieldValue);
    }
  }
};

// games/dist/config/NumberConfig.js
var NumberConfig = class extends ConfigLine {
  validator;
  constructor(defaultValue, title, validator) {
    super(defaultValue, title);
    this.validator = validator;
  }
  checkValidity(value) {
    if (typeof value === "number") {
      return this.validator(value);
    } else {
      return MGPValidation.failure("NumberConfig expects a number value");
    }
  }
};

// games/dist/config/RulesConfigDescription.js
var RulesConfigDescription = class _RulesConfigDescription {
  defaultConfigDescription;
  nonDefaultStandardConfigs;
  static EMPTY = new _RulesConfigDescription({
    name: () => $localize`Default`,
    config: {}
  });
  defaultConfig;
  constructor(defaultConfigDescription, nonDefaultStandardConfigs = []) {
    this.defaultConfigDescription = defaultConfigDescription;
    this.nonDefaultStandardConfigs = nonDefaultStandardConfigs;
    const config = {};
    for (const field of this.getFields()) {
      config[field] = defaultConfigDescription.config[field].defaultValue;
    }
    this.defaultConfig = {
      name: defaultConfigDescription.name,
      config
    };
    const defaultKeys = new Set2(Object.keys(defaultConfigDescription.config));
    for (const otherStandardConfig of nonDefaultStandardConfigs) {
      const key = new Set2(Object.keys(otherStandardConfig.config));
      Utils.assert(key.equals(defaultKeys), `Field missing in ${otherStandardConfig.name()} config!`);
    }
  }
  isCustomizable() {
    return this.getFields().length > 0;
  }
  getStandardConfigs() {
    return [this.defaultConfig].concat(this.nonDefaultStandardConfigs);
  }
  getDefaultConfig() {
    return this.defaultConfig;
  }
  getNonDefaultStandardConfigs() {
    return this.nonDefaultStandardConfigs;
  }
  getConfig(configName) {
    const rulesConfig = this.getStandardConfigs().filter((v) => v.name() === configName)[0];
    return rulesConfig.config;
  }
  getFields() {
    return Object.keys(this.defaultConfigDescription.config);
  }
  getFieldLocalizedName(field) {
    return this.defaultConfigDescription.config[field].title();
  }
  getFieldValidity(field, value) {
    if (value == null) {
      return MGPValidation.failure($localize`This value is mandatory`);
    }
    const configLine = this.defaultConfigDescription.config[field];
    if (configLine == null) {
      return MGPValidation.failure($localize`There is no such configuration element`);
    } else {
      return configLine.checkValidity(value);
    }
  }
  isValid(field, value) {
    return this.getFieldValidity(field, value).isSuccess();
  }
  getValidityError(field, value) {
    return this.getFieldValidity(field, value).getReason();
  }
};

// games/dist/config/RulesConfigDescriptionLocalizable.js
var RulesConfigDescriptionLocalizable = class {
  static WIDTH = () => $localize`Width`;
  static HEIGHT = () => $localize`Height`;
  static SIZE = () => $localize`Size`;
  static ALIGNMENT_SIZE = () => $localize`Number of aligned pieces needed to win`;
  static NUMBER_OF_DROPS = () => $localize`Number of pieces dropped per turn`;
  static NUMBER_OF_EMPTY_ROWS = () => $localize`Number of empty rows`;
  static NUMBER_OF_PIECES_ROWS = () => $localize`Number of pieces rows`;
  static TORIC = () => $localize`Toric`;
};

// games/dist/games/abalone/AbaloneFailure.js
var AbaloneFailure = class {
  static CANNOT_MOVE_MORE_THAN_N_PIECES = (n) => $localize`You cannot move more than ${n} of your pieces!`;
  static NOT_ENOUGH_PIECE_TO_PUSH = () => $localize`You don't have enough pieces to push that group!`;
  static CANNOT_PUSH_YOUR_OWN_PIECES = () => $localize`You cannot push this piece because it is blocked by one of yours!`;
  static MUST_ONLY_TRANSLATE_YOUR_PIECES = () => $localize`This line contains pieces of your opponent or empty spaces, which is forbidden.`;
  static TRANSLATION_IMPOSSIBLE = () => $localize`This move is impossible, some landing spaces are occupied.`;
  static LINE_AND_COORD_NOT_ALIGNED = () => $localize`This space is not aligned with the current line.`;
};

// games/dist/jscaip/Vector.js
var Vector = class _Vector {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  isSingleOrthogonalStep() {
    const isUnitary = Math.abs(this.x) + Math.abs(this.y) === 1;
    return this.isOrthogonal() && isUnitary;
  }
  isOrthogonal() {
    return this.x === 0 || this.y === 0;
  }
  isDiagonal() {
    return this.x !== 0 && Math.abs(this.x) === Math.abs(this.y);
  }
  isDiagonalOfLength(length) {
    return Math.abs(this.x) === length && Math.abs(this.y) === length;
  }
  toMinimalVector() {
    const greatestCommonDivisor = MathUtils.gcd(this.x, this.y);
    return new _Vector(this.x / greatestCommonDivisor, this.y / greatestCommonDivisor);
  }
  /**
    * @param otherVector the other vector to add to this
    * @param times the number of time you want to add it
    * @returns the vector that is the sum of this vector and otherVector * times
   */
  combine(otherVector, times = 1) {
    const newX = this.x + times * otherVector.x;
    const newY = this.y + times * otherVector.y;
    return new _Vector(newX, newY);
  }
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
  toHTMLClassName() {
    return this.toString().replace("_", "-");
  }
};

// games/dist/jscaip/Direction.js
var Direction = class extends Vector {
  isDown() {
    return this.y === 1;
  }
  isUp() {
    return this.y === -1;
  }
  isLeft() {
    return this.x === -1;
  }
  isRight() {
    return this.x === 1;
  }
  toInt() {
    if (this.x === 0 && this.y === -1)
      return 0;
    if (this.x === 1 && this.y === 0)
      return 1;
    if (this.x === 0 && this.y === 1)
      return 2;
    if (this.x === -1 && this.y === 0)
      return 3;
    if (this.x === -1 && this.y === -1)
      return 4;
    if (this.x === 1 && this.y === -1)
      return 5;
    if (this.x === -1 && this.y === 1)
      return 6;
    else
      return 7;
  }
  toString() {
    if (this.x === 0 && this.y === -1)
      return "UP";
    if (this.x === 1 && this.y === 0)
      return "RIGHT";
    if (this.x === 0 && this.y === 1)
      return "DOWN";
    if (this.x === -1 && this.y === 0)
      return "LEFT";
    if (this.x === -1 && this.y === -1)
      return "UP_LEFT";
    if (this.x === 1 && this.y === -1)
      return "UP_RIGHT";
    if (this.x === -1 && this.y === 1)
      return "DOWN_LEFT";
    else
      return "DOWN_RIGHT";
  }
};
var DirectionFactory = class {
  from(x, y) {
    for (const dir of this.all) {
      if (dir.x === x && dir.y === y)
        return MGPFallible.success(dir);
    }
    return MGPFallible.failure("Invalid x or y in direction construction");
  }
  fromDelta(dx, dy) {
    if (dx === 0 && dy === 0) {
      return MGPFallible.failure("Empty delta for direction");
    } else if (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0) {
      return this.from(Math.sign(dx), Math.sign(dy));
    }
    return MGPFallible.failure(DirectionFailure.DIRECTION_MUST_BE_LINEAR());
  }
  fromMove(start, end) {
    return this.fromDelta(end.x - start.x, end.y - start.y);
  }
  fromString(str) {
    switch (str) {
      case "UP":
        return this.from(0, -1);
      case "RIGHT":
        return this.from(1, 0);
      case "DOWN":
        return this.from(0, 1);
      case "LEFT":
        return this.from(-1, 0);
      case "UP_LEFT":
        return this.from(-1, -1);
      case "UP_RIGHT":
        return this.from(1, -1);
      case "DOWN_LEFT":
        return this.from(-1, 1);
      case "DOWN_RIGHT":
        return this.from(1, 1);
      default:
        return MGPFallible.failure(`Invalid direction string ${str}`);
    }
  }
  fromInt(int) {
    switch (int) {
      case 0:
        return this.from(0, -1);
      case 1:
        return this.from(1, 0);
      case 2:
        return this.from(0, 1);
      case 3:
        return this.from(-1, 0);
      case 4:
        return this.from(-1, -1);
      case 5:
        return this.from(1, -1);
      case 6:
        return this.from(-1, 1);
      case 7:
        return this.from(1, 1);
      default:
        return MGPFallible.failure(`Invalid int direction: ${int}`);
    }
  }
};
var DirectionFailure = class {
  static DIRECTION_MUST_BE_LINEAR = () => $localize`You must move in a straight line! You can only move orthogonally or diagonally!`;
};

// games/dist/jscaip/Ordinal.js
var Ordinal = class _Ordinal extends Direction {
  static UP = new _Ordinal(0, -1);
  static UP_RIGHT = new _Ordinal(1, -1);
  static RIGHT = new _Ordinal(1, 0);
  static DOWN_RIGHT = new _Ordinal(1, 1);
  static DOWN = new _Ordinal(0, 1);
  static DOWN_LEFT = new _Ordinal(-1, 1);
  static LEFT = new _Ordinal(-1, 0);
  static UP_LEFT = new _Ordinal(-1, -1);
  static factory = new class extends DirectionFactory {
    all = [
      _Ordinal.RIGHT,
      _Ordinal.DOWN_RIGHT,
      _Ordinal.DOWN,
      _Ordinal.DOWN_LEFT,
      _Ordinal.LEFT,
      _Ordinal.UP_LEFT,
      _Ordinal.UP,
      _Ordinal.UP_RIGHT
    ];
  }();
  static ORDINALS = _Ordinal.factory.all;
  static DIAGONALS = [
    _Ordinal.UP_RIGHT,
    _Ordinal.DOWN_RIGHT,
    _Ordinal.DOWN_LEFT,
    _Ordinal.UP_LEFT
  ];
  static ORTHOGONALS = [
    _Ordinal.UP,
    _Ordinal.RIGHT,
    _Ordinal.DOWN,
    _Ordinal.LEFT
  ];
  static encoder = Encoder.fromFunctions((dir) => {
    return dir.toString();
  }, (encoded) => {
    Utils.assert(typeof encoded === "string", "Invalid encoded direction");
    const fromString = _Ordinal.factory.fromString(encoded);
    return fromString.get();
  });
  getAngle() {
    switch (this) {
      case _Ordinal.RIGHT:
        return 0;
      case _Ordinal.DOWN_RIGHT:
        return 45;
      case _Ordinal.DOWN:
        return 90;
      case _Ordinal.DOWN_LEFT:
        return 135;
      case _Ordinal.LEFT:
        return 180;
      case _Ordinal.UP_LEFT:
        return 225;
      case _Ordinal.UP:
        return 270;
      default:
        Utils.expectToBe(this, _Ordinal.UP_RIGHT);
        return 315;
    }
  }
  getOpposite() {
    const opposite = _Ordinal.factory.from(-this.x, -this.y);
    return opposite.get();
  }
};

// games/dist/jscaip/Coord.js
var CoordFailure = class {
  static OUT_OF_RANGE(coord) {
    return `The coordinate ${coord.toString()} is not on the board`;
  }
};
var Coord = class _Coord extends Vector {
  static getEncoder(generator) {
    return Encoder.tuple([Encoder.identity(), Encoder.identity()], (coord) => [coord.x, coord.y], (fields) => generator(fields[0], fields[1]));
  }
  static encoder = _Coord.getEncoder((x, y) => new _Coord(x, y));
  constructor(x, y) {
    super(x, y);
  }
  getNext(dir, distance) {
    const combinedVector = this.combine(dir, distance);
    return new _Coord(combinedVector.x, combinedVector.y);
  }
  getNextToric(dir, boardWidth, boardHeight, distance) {
    const combinedVector = this.combine(dir, distance);
    const toricX = (combinedVector.x + boardWidth) % boardWidth;
    const toricY = (combinedVector.y + boardHeight) % boardHeight;
    return new _Coord(toricX, toricY);
  }
  getPrevious(dir, distance = 1) {
    return this.getNext(dir, -distance);
  }
  getLeft(dir) {
    const newX = this.x + dir.y;
    const newY = this.y + -dir.x;
    return new _Coord(newX, newY);
  }
  getRight(dir) {
    const newX = this.x + -dir.y;
    const newY = this.y + dir.x;
    return new _Coord(newX, newY);
  }
  isInRange(sizeX, sizeY) {
    if (this.x < 0) {
      return false;
    }
    if (this.y < 0) {
      return false;
    }
    if (sizeX <= this.x) {
      return false;
    }
    if (sizeY <= this.y) {
      return false;
    }
    return true;
  }
  isNotInRange(sizeX, sizeY) {
    if (this.x < 0) {
      return true;
    }
    if (this.y < 0) {
      return true;
    }
    if (sizeX <= this.x) {
      return true;
    }
    if (sizeY <= this.y) {
      return true;
    }
    return false;
  }
  getDirectionToward(c) {
    return Ordinal.factory.fromMove(this, c);
  }
  getOrthogonalDistance(c) {
    return Math.abs(this.x - c.x) + Math.abs(this.y - c.y);
  }
  getLinearDistanceToward(c, checkAlignment = true) {
    return this.getDistanceToward(c, checkAlignment);
  }
  // If asked not to check alignment, a knight move would count as 2
  getDistanceToward(c, checkAlignment = false) {
    Utils.assert(checkAlignment === false || c.isAlignedWith(this), "Cannot calculate distance with non aligned coords.");
    const dx = Math.abs(c.x - this.x);
    const dy = Math.abs(c.y - this.y);
    return Math.max(dx, dy);
  }
  isHexagonallyAlignedWith(coord) {
    const sdx = this.x - coord.x;
    const sdy = this.y - coord.y;
    if (sdx === sdy)
      return false;
    if (sdx === -sdy)
      return true;
    if (sdx * sdy === 0)
      return true;
    return false;
  }
  isAlignedWith(coord) {
    const dx = Math.abs(this.x - coord.x);
    const dy = Math.abs(this.y - coord.y);
    if (dx === dy)
      return true;
    if (dx * dy === 0)
      return true;
    return false;
  }
  isNeighborWith(coord) {
    if (this.isAlignedWith(coord)) {
      return this.getLinearDistanceToward(coord) === 1;
    } else {
      return false;
    }
  }
  getVectorToward(c) {
    const dx = c.x - this.x;
    const dy = c.y - this.y;
    return new Vector(dx, dy);
  }
  toVector() {
    return new Vector(this.x, this.y);
  }
  getCoordsToward(c, includeStart = false, includeEnd = false) {
    Utils.assert(c.isAlignedWith(this), "Should only call getCoordsToward on aligned coords");
    const coords = [];
    if (includeStart) {
      coords.push(this);
    }
    if (this.equals(c)) {
      return coords;
    }
    const dir = this.getDirectionToward(c).get();
    let coord = this.getNext(dir, 1);
    while (coord.equals(c) === false) {
      coords.push(coord);
      coord = coord.getNext(dir, 1);
    }
    if (includeEnd) {
      coords.push(coord);
    }
    return coords;
  }
  // [this, end]
  getAllCoordsToward(end) {
    return this.getCoordsToward(end, true, true);
  }
  equals(obj) {
    if (this === obj)
      return true;
    if (obj.x !== this.x)
      return false;
    return obj.y === this.y;
  }
  compareTo(c) {
    if (c.y === this.y) {
      if (c.x === this.x) {
        return 0;
      }
      return this.x < c.x ? -1 : 1;
    }
    return this.y < c.y ? -1 : 1;
  }
  toSVGPoint() {
    return this.x + "," + this.y;
  }
  scale(x, y) {
    return new _Coord(this.x * x, this.y * y);
  }
  /**
   * Ordinal as in both orthogonal and diagonal
   * @returns the list of coord that are considered as neighbor coords, here, the 8 ones
   */
  getOrdinalNeighbors() {
    return Ordinal.ORDINALS.map((direction) => this.getNext(direction));
  }
};

// games/dist/jscaip/HexaDirection.js
var HexaDirection = class _HexaDirection extends Direction {
  static UP = new _HexaDirection(0, -1);
  static UP_RIGHT = new _HexaDirection(1, -1);
  static RIGHT = new _HexaDirection(1, 0);
  static DOWN = new _HexaDirection(0, 1);
  static DOWN_LEFT = new _HexaDirection(-1, 1);
  static LEFT = new _HexaDirection(-1, 0);
  static factory = new class extends DirectionFactory {
    all = [
      _HexaDirection.UP,
      _HexaDirection.UP_RIGHT,
      _HexaDirection.RIGHT,
      _HexaDirection.DOWN,
      _HexaDirection.DOWN_LEFT,
      _HexaDirection.LEFT
    ];
  }();
  static encoder = Encoder.fromFunctions((direction) => {
    switch (direction) {
      case _HexaDirection.UP:
        return 0;
      case _HexaDirection.UP_RIGHT:
        return 1;
      case _HexaDirection.RIGHT:
        return 2;
      case _HexaDirection.DOWN:
        return 3;
      case _HexaDirection.DOWN_LEFT:
        return 4;
      default:
        Utils.expectToBe(direction, _HexaDirection.LEFT);
        return 5;
    }
  }, (encoded) => {
    Utils.assert(0 <= encoded && encoded <= 5, "Invalid encoded number for HexaDirection " + encoded);
    return _HexaDirection.factory.all[encoded];
  });
  getAngle() {
    switch (this) {
      case _HexaDirection.UP:
        return 0;
      case _HexaDirection.UP_RIGHT:
        return 60;
      case _HexaDirection.RIGHT:
        return 120;
      case _HexaDirection.DOWN:
        return 180;
      case _HexaDirection.DOWN_LEFT:
        return 240;
      default:
        Utils.expectToBe(this, _HexaDirection.LEFT);
        return 300;
    }
  }
  getOpposite() {
    const opposite = _HexaDirection.factory.from(-this.x, -this.y);
    return opposite.get();
  }
};

// games/dist/jscaip/MoveCoord.js
var MoveCoord = class extends Move {
  static getFallibleEncoder(generate) {
    return Encoder.tuple([Coord.encoder], (m) => [m.coord], (fields) => generate(fields[0]).get());
  }
  static getEncoder(generate) {
    return Encoder.tuple([Coord.encoder], (m) => [m.coord], (fields) => generate(fields[0]));
  }
  coord;
  constructor(x, y) {
    super();
    this.coord = new Coord(x, y);
  }
  equals(other) {
    return this === other || this.coord.equals(other.coord);
  }
};

// games/dist/games/abalone/AbaloneMove.js
var AbaloneMove = class _AbaloneMove extends MoveCoord {
  dir;
  lastPiece;
  static encoder = Encoder.tuple([Coord.encoder, HexaDirection.encoder, MGPOptional.getEncoder(Coord.encoder)], (m) => [m.coord, m.dir, m.lastPiece], (fields) => new _AbaloneMove(fields[0], fields[1], fields[2]));
  static ofSingleCoord(coord, dir) {
    Utils.assert(coord.isInRange(9, 9), CoordFailure.OUT_OF_RANGE(coord));
    return new _AbaloneMove(coord, dir, MGPOptional.empty());
  }
  static ofDoubleCoord(first, second, dir) {
    const coords = [first, second];
    ArrayUtils.sortByDescending(coords, _AbaloneMove.sortCoord);
    const direction = coords[1].getDirectionToward(coords[0]).get();
    const hexaDirectionOptional = HexaDirection.factory.fromDelta(direction.x, direction.y);
    Utils.assert(hexaDirectionOptional.isSuccess(), "Invalid direction");
    const hexaDirection = hexaDirectionOptional.get();
    if (hexaDirection.equals(dir)) {
      return _AbaloneMove.ofSingleCoord(coords[1], dir);
    } else if (hexaDirection.getOpposite().equals(dir)) {
      return _AbaloneMove.ofSingleCoord(coords[0], dir);
    }
    return new _AbaloneMove(coords[1], dir, MGPOptional.of(coords[0]));
  }
  static sortCoord(coord) {
    return coord.y * 9 + coord.x;
  }
  constructor(coord, dir, lastPiece) {
    super(coord.x, coord.y);
    this.dir = dir;
    this.lastPiece = lastPiece;
  }
  toString() {
    if (this.isSingleCoord()) {
      return "AbaloneMove(" + this.coord.x + ", " + this.coord.y + ", " + this.dir.toString() + ")";
    } else {
      return "AbaloneMove(" + this.coord.toString() + " > " + this.lastPiece.get().toString() + ", " + this.dir.toString() + ")";
    }
  }
  isSingleCoord() {
    return this.lastPiece.isAbsent();
  }
  equals(other) {
    return other.coord.equals(this.coord) && other.dir.equals(this.dir) && other.lastPiece.equals(this.lastPiece);
  }
  isTranslation() {
    return this.lastPiece.isPresent() && this.coord.getDirectionToward(this.lastPiece.get()).get().equals(this.dir) === false;
  }
};

// games/dist/jscaip/FourStatePiece.js
var FourStatePiece = class _FourStatePiece {
  player;
  reachable;
  static ZERO = new _FourStatePiece(Player.ZERO, true);
  static ONE = new _FourStatePiece(Player.ONE, true);
  static EMPTY = new _FourStatePiece(PlayerOrNone.NONE, true);
  static UNREACHABLE = new _FourStatePiece(PlayerOrNone.NONE, false);
  static ofPlayer(player) {
    switch (player) {
      case Player.ZERO:
        return _FourStatePiece.ZERO;
      default:
        Utils.expectToBe(player, Player.ONE);
        return _FourStatePiece.ONE;
    }
  }
  constructor(player, reachable) {
    this.player = player;
    this.reachable = reachable;
  }
  equals(other) {
    return this.player.equals(other.player) && this.reachable === other.reachable;
  }
  is(player) {
    return this.player === player;
  }
  isPlayer() {
    return this === _FourStatePiece.ZERO || this === _FourStatePiece.ONE;
  }
  isReachable() {
    return this.reachable;
  }
  getPlayer() {
    return this.player;
  }
};

// games/dist/jscaip/Rules.js
var SuperRules = class {
  constructor() {
  }
  /* The data that represent the status of the game at the current moment, including:
   * the board
   * the turn
   * the extra data that might be score of each player
   * the remaining piece that you can put on the board...
   */
  choose(node, move, config) {
    Debug.display("Rules", "choose", move.toString() + " was proposed");
    const legality = this.isLegal(move, node.gameState, config);
    if (legality.isFailure()) {
      Debug.display("Rules", "choose", "Move is illegal: " + legality.getReason());
      return MGPFallible.failure(legality.getReason());
    }
    const choice = node.getChild(move);
    if (choice.isPresent()) {
      Utils.assert(legality.isSuccess(), "Rules.choose: Move is illegal: " + legality.getReasonOr(""));
      Debug.display("Rules", "choose", "and this proposed move is found in the list, so it is legal");
      return MGPFallible.success(choice.get());
    }
    const resultingState = this.applyLegalMove(move, node.gameState, config, legality.get());
    const child = new GameNode(resultingState, MGPOptional.of(node), MGPOptional.of(move));
    return MGPFallible.success(child);
  }
  getInitialNode(config) {
    const initialState = this.getInitialState(config);
    return new GameNode(initialState);
  }
  getDefaultRulesConfig() {
    const rulesConfigDescription = this.getRulesConfigDescription();
    return rulesConfigDescription.getDefaultConfig().config;
  }
};
var ConfigurableRules = class extends SuperRules {
};
var Rules = class extends SuperRules {
  getRulesConfigDescription() {
    return RulesConfigDescription.EMPTY;
  }
};

// games/dist/jscaip/RulesFailure.js
var RulesFailure = class {
  static MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT = () => $localize`You have selected a piece of the opponent. You must pick one of your pieces.`;
  static MUST_CHOOSE_OWN_PIECE_NOT_EMPTY = () => $localize`You have selected an empty space, you must select one of your own pieces.`;
  static MUST_CLICK_ON_EMPTY_SPACE = () => $localize`You must click on an empty space.`;
  static MUST_CLICK_ON_EMPTY_SQUARE = () => $localize`You must click on an empty square.`;
  static SHOULD_LAND_ON_EMPTY_OR_OPPONENT_SPACE = () => $localize`Your landing space should be empty or contain a piece of the opponent.`;
  static CANNOT_SELF_CAPTURE = () => $localize`You cannot capture your own pieces.`;
  static CANNOT_PASS = () => $localize`You cannot pass your turn.`;
  static MUST_LAND_ON_EMPTY_SPACE = () => $localize`You must drop your piece on an empty space.`;
  static MUST_PASS = () => $localize`You must pass your turn.`;
  static MOVE_CANNOT_BE_STATIC = () => $localize`You must choose different starting and ending coordinates.`;
  static SOMETHING_IN_THE_WAY = () => $localize`There is a piece between the piece you chose and its landing space.`;
  static MUST_MOVE_ON_NEIGHBOR = () => $localize`You must move on a direct neighboring space.`;
};

// games/dist/utils/MGPValidator.js
var MGPValidators = class {
  static range(min, max) {
    return (value) => {
      if (value < min) {
        return MGPValidation.failure(MGPValidatorsFailure.VALUE_IS_TOO_SMALL(value, min));
      } else if (max < value) {
        return MGPValidation.failure(MGPValidatorsFailure.VALUE_IS_TOO_HIGH(value, max));
      } else {
        return MGPValidation.SUCCESS;
      }
    };
  }
};
var MGPValidatorsFailure = class {
  static VALUE_IS_TOO_SMALL = (v, m) => $localize`${v} is too small, the minimum is ${m}`;
  static VALUE_IS_TOO_HIGH = (v, m) => $localize`${v} is too big, the maximum is ${m}`;
};

// games/dist/jscaip/CoordSet.js
var CoordSet = class extends OptimizedSet {
  toFields(coord) {
    return [[coord.y], coord.x];
  }
};

// games/dist/jscaip/TableUtils.js
var TableUtils = class _TableUtils {
  static create(width, height, initValue) {
    const table = [];
    for (let y = 0; y < height; y++) {
      table.push(ArrayUtils.create(width, initValue));
    }
    return table;
  }
  static map(table, fun) {
    return table.map((row) => row.map(fun));
  }
  static copy(table) {
    return _TableUtils.map(table, (t) => t);
  }
  static equals(t1, t2) {
    if (t1.length !== t2.length)
      return false;
    for (let i = 0; i < t1.length; i++) {
      if (ArrayUtils.equals(t1[i], t2[i]) === false)
        return false;
    }
    return true;
  }
  static sum(board) {
    let sum = 0;
    for (const line of board) {
      for (const element of line) {
        sum += element;
      }
    }
    return sum;
  }
  static add(left, right) {
    const width = left[0].length;
    const height = left.length;
    Utils.assert(height === right.length, "Table should have same height");
    Utils.assert(width === right[0].length, "Table should have same width (left.length: " + width + ", right.length: " + right[0].length + ")");
    const sum = _TableUtils.create(width, height, 0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        sum[y][x] = left[y][x] + right[y][x];
      }
    }
    return sum;
  }
  static contains(table, element) {
    for (const array of table) {
      if (ArrayUtils.contains(array, element)) {
        return true;
      }
    }
    return false;
  }
  static count(table, element) {
    let total = 0;
    for (const array of table) {
      total += ArrayUtils.count(array, element);
    }
    return total;
  }
  /**
   * Return the column of the leftmost match in each line of this table
   */
  static getLeftmostMatchColumn(table, predicate) {
    const width = table[0].length;
    const height = table.length;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (predicate(table[y][x])) {
          return MGPOptional.of(x);
        }
      }
    }
    return MGPOptional.empty();
  }
  static find(table, predicate) {
    for (const line of table) {
      for (const element of line) {
        if (predicate(element)) {
          return MGPOptional.of(element);
        }
      }
    }
    return MGPOptional.empty();
  }
};
var TableWithPossibleNegativeIndices = class {
  // This cannot be represented by an array as it may have negative indices
  // which cannot be iterated over
  content = new MGPMap();
  get(coord) {
    const line = this.content.get(coord.y);
    if (line.isAbsent())
      return MGPOptional.empty();
    return line.get().get(coord.x);
  }
  set(coord, value) {
    const lineOpt = this.content.get(coord.y);
    let line;
    if (lineOpt.isPresent()) {
      line = lineOpt.get();
    } else {
      line = new MGPMap();
      this.content.set(coord.y, line);
    }
    line.set(coord.x, value);
  }
  [Symbol.iterator]() {
    const elements = [];
    const ys = this.content.getKeySet().toList();
    ys.sort(ArrayUtils.smallerFirst);
    for (const y of ys) {
      const line = this.content.get(y).get();
      const xs = line.getKeySet().toList();
      xs.sort(ArrayUtils.smallerFirst);
      for (const x of xs) {
        const content = line.get(x).get();
        elements.push({ x, y, content });
      }
    }
    return elements.values();
  }
};
var Table3DUtils = class {
  static create(depth, width, height, initValue) {
    const triTable = [];
    for (let z = 0; z < depth; z++) {
      triTable.push(TableUtils.create(width, height, initValue));
    }
    return triTable;
  }
};

// games/dist/jscaip/state/GameState.js
var GameState = class {
  turn;
  constructor(turn) {
    this.turn = turn;
  }
  getCurrentPlayer() {
    return Player.ofTurn(this.turn);
  }
  getPreviousOpponent() {
    return this.getCurrentPlayer();
  }
  getCurrentOpponent() {
    return this.turn % 2 === 1 ? Player.ZERO : Player.ONE;
  }
  getPreviousPlayer() {
    return this.getCurrentOpponent();
  }
};

// games/dist/jscaip/state/GameStateWithTable.js
var GameStateWithTable = class extends GameState {
  board;
  static setPieceAt(oldState, coord, value, stateAdapter) {
    const newBoard = oldState.getCopiedBoard();
    newBoard[coord.y][coord.x] = value;
    return stateAdapter(oldState, newBoard);
  }
  constructor(board, turn) {
    super(turn);
    this.board = board;
  }
  getPieceAt(coord) {
    Utils.assert(this.isOnBoard(coord), "Accessing coord not on board " + coord + ".");
    return this.getUnsafe(coord);
  }
  getUnsafe(coord) {
    return this.board[coord.y][coord.x];
  }
  hasPieceAt(coord, value) {
    return this.isOnBoard(coord) && comparableEquals(this.getUnsafe(coord), value);
  }
  hasInequalPieceAt(coord, value) {
    return this.isOnBoard(coord) && comparableEquals(this.getUnsafe(coord), value) === false;
  }
  getOptionalPieceAt(coord) {
    if (this.isOnBoard(coord)) {
      const value = this.getUnsafe(coord);
      return MGPOptional.of(value);
    } else {
      return MGPOptional.empty();
    }
  }
  getOptionalPieceAtXY(x, y) {
    const coord = new Coord(x, y);
    return this.getOptionalPieceAt(coord);
  }
  isOnBoard(coord) {
    const width = this.getWidth();
    const height = this.getHeight();
    return coord.isInRange(width, height);
  }
  isNotOnBoard(coord) {
    return this.isOnBoard(coord) === false;
  }
  getPieceAtXY(x, y) {
    return this.getPieceAt(new Coord(x, y));
  }
  forEachCoord(callback) {
    for (const { coord, content } of this.getCoordsAndContents()) {
      callback(coord, content);
    }
  }
  findMatchingCoord(predicate) {
    for (const { coord, content } of this.getCoordsAndContents()) {
      const result = predicate(coord, content);
      if (result) {
        return MGPOptional.of(coord);
      }
    }
    return MGPOptional.empty();
  }
  getCoordsAndContents() {
    const coordsAndContents = [];
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        const coord = new Coord(x, y);
        if (this.isOnBoard(coord)) {
          coordsAndContents.push({
            coord,
            content: this.getPieceAt(coord)
          });
        }
      }
    }
    return coordsAndContents;
  }
  allCoords() {
    const coords = [];
    this.forEachCoord((coord) => {
      coords.push(coord);
    });
    return coords;
  }
  getCopiedBoard() {
    return TableUtils.copy(this.board);
  }
  toPieceMap() {
    const map = new MGPMap();
    for (const coordAndContent of this.getCoordsAndContents()) {
      const key = coordAndContent.content;
      const value = coordAndContent.coord;
      if (map.containsKey(key)) {
        const oldValue = map.get(key).get();
        map.put(key, oldValue.addElement(value));
      } else {
        map.set(key, new CoordSet([value]));
      }
    }
    return map;
  }
  getWidth() {
    return this.board[0].length;
  }
  getHeight() {
    return this.board.length;
  }
  isHorizontalEdge(coord) {
    const maxY = this.getHeight() - 1;
    return coord.y === 0 || coord.y === maxY;
  }
  isVerticalEdge(coord) {
    const maxX = this.getWidth() - 1;
    return coord.x === 0 || coord.x === maxX;
  }
  isEdge(coord) {
    return this.isHorizontalEdge(coord) || this.isVerticalEdge(coord);
  }
  isCorner(coord) {
    return this.isHorizontalEdge(coord) && this.isVerticalEdge(coord);
  }
  countPieceInRow(piece, row) {
    let result = 0;
    for (let x = 0; x < this.getWidth(); x++) {
      if (comparableEquals(this.board[row][x], piece)) {
        result++;
      }
    }
    return result;
  }
  countPieceOnBoard(piece) {
    let result = 0;
    for (const coordAndContent of this.getCoordsAndContents()) {
      if (comparableEquals(coordAndContent.content, piece)) {
        result++;
      }
    }
    return result;
  }
  [Symbol.iterator]() {
    const linedUpElements = [];
    for (const lines of this.board) {
      linedUpElements.push(...lines);
    }
    return linedUpElements.values();
  }
};

// games/dist/jscaip/state/FourStatePieceGameStateWithTable.js
var FourStatePieceGameStateWithTable = class _FourStatePieceGameStateWithTable extends GameStateWithTable {
  getPlayerCoordsAndContent() {
    return this.getCoordsAndContents().filter((value) => {
      return value.content.isPlayer();
    }).map((value) => {
      return {
        coord: value.coord,
        content: value.content.getPlayer()
      };
    });
  }
  isPlayerAt(coord) {
    const piece = this.getPieceAt(coord);
    return piece.isPlayer();
  }
  hasPieceBelongingTo(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().is(player);
    } else {
      return false;
    }
  }
  coordIsOccupiedSquare(coord) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().isPlayer();
    } else {
      return false;
    }
  }
  isOnBoard(coord) {
    if (super.isOnBoard(coord)) {
      return this.getUnsafe(coord) !== FourStatePiece.UNREACHABLE;
    } else {
      return false;
    }
  }
  static of(oldState, newBoard) {
    return new _FourStatePieceGameStateWithTable(newBoard, oldState.turn);
  }
  incrementTurn() {
    return new _FourStatePieceGameStateWithTable(this.getCopiedBoard(), this.turn + 1);
  }
  setPieceAt(coord, value) {
    return GameStateWithTable.setPieceAt(this, coord, value, _FourStatePieceGameStateWithTable.of);
  }
};

// games/dist/games/abalone/AbaloneState.js
var AbaloneState = class extends FourStatePieceGameStateWithTable {
  getScores() {
    const scores = PlayerNumberMap.of(14, 14);
    for (const coordAndContent of this.getCoordsAndContents()) {
      const owner = coordAndContent.content.getPlayer();
      if (owner.isPlayer()) {
        scores.add(owner.getOpponent(), -1);
      }
    }
    return scores;
  }
};

// games/dist/games/abalone/AbaloneRules.js
var AbaloneRules = class _AbaloneRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Abalone`,
    config: {
      nbToCapture: new NumberConfig(6, () => $localize`Number of pieces to capture in order to win`, MGPValidators.range(1, 14)),
      maximumPushingGroupSize: new NumberConfig(3, () => $localize`Maximum pushing group size`, MGPValidators.range(1, 9))
    }
  }, [
    {
      name: () => $localize`Deadly Abalone`,
      config: {
        nbToCapture: 1,
        maximumPushingGroupSize: 9
      }
    }
  ]);
  static get() {
    if (_AbaloneRules.singleton.isAbsent()) {
      _AbaloneRules.singleton = MGPOptional.of(new _AbaloneRules());
    }
    return _AbaloneRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _AbaloneRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState() {
    const _ = FourStatePiece.EMPTY;
    const N = FourStatePiece.UNREACHABLE;
    const O = FourStatePiece.ZERO;
    const X = FourStatePiece.ONE;
    const board = [
      [N, N, N, N, X, X, X, X, X],
      [N, N, N, X, X, X, X, X, X],
      [N, N, _, _, X, X, X, _, _],
      [N, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, N],
      [_, _, O, O, O, _, _, N, N],
      [O, O, O, O, O, O, N, N, N],
      [O, O, O, O, O, N, N, N, N]
    ];
    return new AbaloneState(board, 0);
  }
  static isLegalRealPush(firstOpponent, move, state, pushingPieces, newBoard) {
    let opponentPieces = 0;
    const opponent = FourStatePiece.ofPlayer(state.getCurrentOpponent());
    const player = FourStatePiece.ofPlayer(state.getCurrentPlayer());
    while (opponentPieces < pushingPieces && state.hasPieceAt(firstOpponent, opponent)) {
      opponentPieces++;
      firstOpponent = firstOpponent.getNext(move.dir);
    }
    if (pushingPieces <= opponentPieces) {
      return MGPFallible.failure(AbaloneFailure.NOT_ENOUGH_PIECE_TO_PUSH());
    } else if (state.hasPieceAt(firstOpponent, FourStatePiece.EMPTY)) {
      newBoard[firstOpponent.y][firstOpponent.x] = opponent;
    } else if (state.hasPieceAt(firstOpponent, player)) {
      return MGPFallible.failure(AbaloneFailure.CANNOT_PUSH_YOUR_OWN_PIECES());
    }
    return MGPFallible.success(newBoard);
  }
  applyLegalMove(_move, state, _config, newBoard) {
    return new AbaloneState(newBoard, state.turn + 1);
  }
  isLegal(move, state, config) {
    const firstPieceValidity = this.getFirstPieceValidity(move, state);
    if (firstPieceValidity.isFailure()) {
      return firstPieceValidity.toOtherFallible();
    }
    if (move.isSingleCoord()) {
      return this.isLegalPush(move, state, config);
    } else {
      return this.isLegalSideStep(move, state);
    }
  }
  getFirstPieceValidity(move, state) {
    const firstPiece = state.getPieceAt(move.coord);
    if (firstPiece.isPlayer() === false) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    } else if (firstPiece === FourStatePiece.ofPlayer(state.getCurrentOpponent())) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  isLegalPush(move, state, config) {
    let pieces = 1;
    let tested = move.coord.getNext(move.dir);
    const player = FourStatePiece.ofPlayer(state.getCurrentPlayer());
    const empty = FourStatePiece.EMPTY;
    const newBoard = state.getCopiedBoard();
    newBoard[move.coord.y][move.coord.x] = empty;
    while (pieces <= config.maximumPushingGroupSize && state.hasPieceAt(tested, player)) {
      pieces++;
      tested = tested.getNext(move.dir);
    }
    if (pieces > config.maximumPushingGroupSize) {
      return MGPFallible.failure(AbaloneFailure.CANNOT_MOVE_MORE_THAN_N_PIECES(config.maximumPushingGroupSize));
    } else if (state.isNotOnBoard(tested)) {
      return MGPFallible.success(newBoard);
    }
    newBoard[tested.y][tested.x] = player;
    if (state.getPieceAt(tested) === empty) {
      return MGPFallible.success(newBoard);
    }
    return _AbaloneRules.isLegalRealPush(tested, move, state, pieces, newBoard);
  }
  isLegalSideStep(move, state) {
    let last = move.lastPiece.get();
    const alignment = move.coord.getDirectionToward(last).get();
    last = last.getNext(alignment);
    let tested = move.coord;
    const player = FourStatePiece.ofPlayer(state.getCurrentPlayer());
    const newBoard = state.getCopiedBoard();
    while (tested.equals(last) === false && state.isOnBoard(tested)) {
      if (state.getPieceAt(tested) !== player) {
        return MGPFallible.failure(AbaloneFailure.MUST_ONLY_TRANSLATE_YOUR_PIECES());
      }
      const landing = tested.getNext(move.dir);
      newBoard[tested.y][tested.x] = FourStatePiece.EMPTY;
      if (state.isOnBoard(landing)) {
        if (state.isPlayerAt(landing)) {
          return MGPFallible.failure(AbaloneFailure.TRANSLATION_IMPOSSIBLE());
        }
        if (state.getPieceAt(landing) === FourStatePiece.EMPTY) {
          newBoard[landing.y][landing.x] = player;
        }
      }
      tested = tested.getNext(alignment);
    }
    return MGPFallible.success(newBoard);
  }
  getGameStatus(node, config) {
    const scores = node.gameState.getScores();
    const nbToCapture = config.nbToCapture;
    if (nbToCapture <= scores.get(Player.ZERO)) {
      return GameStatus.ZERO_WON;
    } else if (nbToCapture <= scores.get(Player.ONE)) {
      return GameStatus.ONE_WON;
    } else {
      return GameStatus.ONGOING;
    }
  }
};

// games/dist/games/abalone/AbaloneMoveGenerator.js
var AbaloneMoveGenerator = class extends MoveGenerator {
  getListMoves(node, config) {
    const moves = [];
    const state = node.gameState;
    const player = state.getCurrentPlayer();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const first = coordAndContent.coord;
      if (state.getPieceAt(first).is(player) === false) {
        continue;
      }
      for (const dir of HexaDirection.factory.all) {
        const move = AbaloneMove.ofSingleCoord(first, dir);
        if (this.isAcceptablePush(move, state, config)) {
          moves.push(move);
        } else {
          continue;
        }
        for (const alignment of HexaDirection.factory.all) {
          for (let distance = 1; distance <= 2; distance++) {
            if (alignment.equals(dir)) {
              break;
            }
            const second = first.getNext(alignment, distance);
            if (state.isOnBoard(second)) {
              const translation = AbaloneMove.ofDoubleCoord(first, second, dir);
              if (AbaloneRules.get().isLegal(translation, state, config).isSuccess()) {
                moves.push(translation);
              }
            } else {
              break;
            }
          }
        }
      }
    }
    return new Set2(moves).toList();
  }
  isAcceptablePush(move, state, config) {
    const scores = state.getScores();
    const status = AbaloneRules.get().isLegal(move, state, config);
    if (status.isSuccess()) {
      const opponent = state.getCurrentOpponent();
      const newState = new AbaloneState(status.get(), state.turn + 1);
      const newScores = newState.getScores();
      if (scores.get(opponent) < newScores.get(opponent)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
};

// games/dist/jscaip/AI/PlayerMetricHeuristic.js
var PlayerMetricHeuristic = class extends Heuristic {
  getBoardValue(node, config) {
    const metrics = this.getMetrics(node, config);
    return BoardValue.ofMultiple(metrics.get(Player.ZERO).get(), metrics.get(Player.ONE).get());
  }
};

// games/dist/games/abalone/AbaloneScoreHeuristic.js
var AbaloneScoreHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    return node.gameState.getScores().toTable();
  }
};

// games/dist/games/apagos/ApagosFailure.js
var ApagosFailure = class {
  static PIECE_SHOULD_MOVE_DOWNWARD = () => $localize`Pieces should only move downward!`;
  static CANNOT_LAND_ON_A_FULL_SQUARE = () => $localize`That square is already full, you cannot put a piece in it!`;
  static NO_PIECE_OF_YOU_IN_CHOSEN_SQUARE = () => $localize`You have no pieces in that square, select one that contains at least one of your pieces!`;
  static NO_PIECE_REMAINING_TO_DROP = () => $localize`There are no remaining pieces of that color to drop!`;
  static NO_POSSIBLE_TRANSFER_REMAINS = () => $localize`There is no possible transfer from that square!`;
};

// games/dist/games/apagos/ApagosFullBoardHeuristic.js
var ApagosFullBoardHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const result = PlayerNumberTable.of([0, 0, 0, 0], [0, 0, 0, 0]);
    const board = node.gameState.board;
    const size = board.length;
    for (let i = 0; i < size; i++) {
      const levelDominant = board[size - 1 - i].getDominatingPlayer();
      if (levelDominant.isPlayer()) {
        result.add(levelDominant, i, 1);
      }
    }
    return result;
  }
};

// games/dist/games/apagos/ApagosMove.js
var ApagosMove = class _ApagosMove extends Move {
  landing;
  piece;
  starting;
  static encoder = Encoder.tuple([
    Encoder.identity(),
    MGPOptional.getEncoder(Player.encoder),
    MGPOptional.getEncoder(Encoder.identity())
  ], (m) => [m.landing, m.piece, m.starting], (fields) => new _ApagosMove(fields[0], fields[1], fields[2]));
  static drop(x, piece) {
    return new _ApagosMove(x, MGPOptional.of(piece), MGPOptional.empty());
  }
  static transfer(start, landing) {
    if (start <= landing) {
      return MGPFallible.failure(ApagosFailure.PIECE_SHOULD_MOVE_DOWNWARD());
    }
    const slideDown = new _ApagosMove(landing, MGPOptional.empty(), MGPOptional.of(start));
    return MGPFallible.success(slideDown);
  }
  constructor(landing, piece, starting) {
    super();
    this.landing = landing;
    this.piece = piece;
    this.starting = starting;
  }
  isDrop() {
    return this.piece.isPresent();
  }
  toString() {
    if (this.isDrop()) {
      return "ApagosMove.drop(" + this.piece.get().toString() + " on " + this.landing + ")";
    } else {
      return "ApagosMove.slideDown(" + this.starting.get() + " > " + this.landing + ")";
    }
  }
  equals(other) {
    if (this.landing !== other.landing)
      return false;
    if (this.starting.equals(other.starting) === false)
      return false;
    return this.piece.equals(other.piece);
  }
};

// games/dist/games/apagos/ApagosSquare.js
var ApagosSquare = class _ApagosSquare {
  containing;
  static from(nbZero, nbOne, nbTotal) {
    if (nbZero + nbOne > nbTotal) {
      return MGPFallible.failure("invalid starting space");
    }
    const containing = new MGPMap([
      { key: Player.ZERO, value: nbZero },
      { key: Player.ONE, value: nbOne },
      { key: PlayerOrNone.NONE, value: nbTotal }
    ]);
    containing.makeImmutable();
    const validSquare = new _ApagosSquare(containing);
    return MGPFallible.success(validSquare);
  }
  constructor(containing) {
    this.containing = containing;
  }
  isFull() {
    const nbZero = this.count(Player.ZERO);
    const nbOne = this.count(Player.ONE);
    const nbTotal = this.count(PlayerOrNone.NONE);
    return nbTotal <= nbZero + nbOne;
  }
  count(player) {
    return this.containing.get(player).get();
  }
  getCapacity() {
    return this.count(PlayerOrNone.NONE);
  }
  addPiece(piece) {
    let nbZero = this.count(Player.ZERO);
    let nbOne = this.count(Player.ONE);
    const nbTotal = this.count(PlayerOrNone.NONE);
    if (piece === Player.ZERO) {
      nbZero++;
    } else {
      nbOne++;
    }
    return _ApagosSquare.from(nbZero, nbOne, nbTotal).get();
  }
  subtractPiece(piece) {
    let nbZero = this.count(Player.ZERO);
    let nbOne = this.count(Player.ONE);
    const nbTotal = this.count(PlayerOrNone.NONE);
    if (piece === Player.ZERO) {
      nbZero--;
    } else {
      nbOne--;
    }
    return _ApagosSquare.from(nbZero, nbOne, nbTotal).get();
  }
  getDominatingPlayer() {
    const nbZero = this.count(Player.ZERO);
    const nbOne = this.count(Player.ONE);
    if (nbZero > nbOne) {
      return Player.ZERO;
    } else if (nbOne > nbZero) {
      return Player.ONE;
    } else {
      return PlayerOrNone.NONE;
    }
  }
  equals(other) {
    return this.containing.equals(other.containing);
  }
  toString() {
    const zero = this.containing.get(PlayerOrNone.ZERO).get();
    const one = this.containing.get(PlayerOrNone.ONE).get();
    const none = this.containing.get(PlayerOrNone.NONE).get();
    return `(${zero}, ${one}, ${none})`;
  }
};

// games/dist/games/apagos/ApagosState.js
var ApagosState = class _ApagosState extends GameState {
  board;
  remaining;
  /**
   * The representation works as follows: board is made of three rows:
   * - the first row contains the number of pieces from player 0, in each square
   * - the second row contains the number of pieces from player 1, in each square
   * - the third row contains the size of each square
   */
  static fromRepresentation(turn, board, nZero, nOne) {
    const squares = [];
    for (let x = 0; x < board[0].length; x++) {
      const localZeroCount = board[0][x];
      const localOneCount = board[1][x];
      const nbTotal = board[2][x];
      const square = ApagosSquare.from(localZeroCount, localOneCount, nbTotal).get();
      squares.push(square);
    }
    const remaining = PlayerNumberMap.of(nZero, nOne);
    return new _ApagosState(turn, squares, remaining);
  }
  constructor(turn, board, remaining) {
    super(turn);
    this.board = board;
    this.remaining = remaining;
    this.remaining.makeImmutable();
  }
  getPieceAt(x) {
    return this.board[x];
  }
  updateAt(x, newSquare) {
    const newBoard = [];
    for (let pos = 0; pos < this.board.length; pos++) {
      if (pos === x) {
        newBoard.push(newSquare);
      } else {
        newBoard.push(this.board[pos]);
      }
    }
    const remaining = this.getRemainingCopy();
    return new _ApagosState(this.turn, newBoard, remaining);
  }
  getRemainingCopy() {
    return this.remaining.getCopy();
  }
  getRemaining(piece) {
    return this.remaining.get(piece);
  }
  getMaxPiecesPerPlayer() {
    let numberOfPieces = 0;
    for (const square of this.board) {
      numberOfPieces += Math.floor(square.getCapacity() / 2) + 1;
    }
    return numberOfPieces;
  }
  equals(other) {
    return this.turn === other.turn && ArrayUtils.equals(other.board, this.board) && this.remaining.equals(other.remaining);
  }
  toString() {
    return `[${this.board.map((square) => square.toString()).join(", ")}]`;
  }
};

// games/dist/games/apagos/ApagosRules.js
var ApagosRules = class _ApagosRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Apagos`,
    config: {
      width: new NumberConfig(4, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(2, 7)),
      increment: new NumberConfig(2, () => $localize`Increment`, MGPValidators.range(0, 3))
    }
  });
  static get() {
    if (_ApagosRules.singleton.isAbsent()) {
      _ApagosRules.singleton = MGPOptional.of(new _ApagosRules());
    }
    return _ApagosRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _ApagosRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const width = config.width;
    const increment = config.increment;
    const zeroPieces = [];
    const onePieces = [];
    const sizes = [];
    let currentSize = 1;
    let numberOfPieces = 0;
    for (let x = 0; x < width; x++) {
      zeroPieces.push(0);
      onePieces.push(0);
      sizes.push(currentSize);
      numberOfPieces += Math.ceil(currentSize / 2);
      currentSize += increment;
    }
    return ApagosState.fromRepresentation(0, [
      zeroPieces,
      onePieces,
      sizes.reverse()
    ], numberOfPieces, numberOfPieces);
  }
  applyLegalMove(move, state, config, _info) {
    if (move.isDrop()) {
      return this.applyLegalDrop(move, state, config);
    } else {
      return this.applyLegalTransfer(move, state);
    }
  }
  applyLegalDrop(move, state, config) {
    const remaining = state.getRemainingCopy();
    remaining.add(move.piece.get(), -1);
    const nextTurnState = new ApagosState(state.turn + 1, state.board, remaining);
    const piece = move.piece.get();
    const newSquare = nextTurnState.getPieceAt(move.landing).addPiece(piece);
    if (move.landing === config.width - 1) {
      return nextTurnState.updateAt(move.landing, newSquare);
    } else {
      const descendingX = move.landing + 1;
      const descendingSquare = nextTurnState.getPieceAt(descendingX);
      const intermediaryState = nextTurnState.updateAt(move.landing, descendingSquare);
      return intermediaryState.updateAt(descendingX, newSquare);
    }
  }
  applyLegalTransfer(move, state) {
    const currentPlayer = state.getCurrentPlayer();
    const starting = move.starting.get();
    const newStartingSquare = state.getPieceAt(starting).subtractPiece(currentPlayer);
    const newLandingSquare = state.getPieceAt(move.landing).addPiece(currentPlayer);
    let resultingState = state.updateAt(starting, newStartingSquare);
    resultingState = resultingState.updateAt(move.landing, newLandingSquare);
    return new ApagosState(resultingState.turn + 1, resultingState.board, resultingState.remaining);
  }
  isLegal(move, state) {
    if (state.getPieceAt(move.landing).isFull()) {
      return MGPValidation.failure(ApagosFailure.CANNOT_LAND_ON_A_FULL_SQUARE());
    }
    if (move.isDrop()) {
      return this.isLegalDrop(move, state);
    } else {
      return this.isLegalSlideDown(move, state);
    }
  }
  isLegalDrop(move, state) {
    if (state.getRemaining(move.piece.get()) <= 0) {
      return MGPValidation.failure(ApagosFailure.NO_PIECE_REMAINING_TO_DROP());
    }
    return MGPValidation.SUCCESS;
  }
  isLegalSlideDown(move, state) {
    const currentPlayer = state.getCurrentPlayer();
    const startingSquare = state.getPieceAt(move.starting.get());
    if (startingSquare.count(currentPlayer) === 0) {
      return MGPValidation.failure(ApagosFailure.NO_PIECE_OF_YOU_IN_CHOSEN_SQUARE());
    }
    return MGPValidation.SUCCESS;
  }
  getGameStatus(node, config) {
    const width = config.width;
    const state = node.gameState;
    for (let x = 0; x < width; x++) {
      if (state.getPieceAt(x).isFull() === false) {
        return GameStatus.ONGOING;
      }
    }
    for (let x = width - 1; x >= 0; x--) {
      const dominating = state.getPieceAt(x).getDominatingPlayer();
      if (dominating.isPlayer()) {
        return GameStatus.getVictory(dominating);
      }
    }
    return GameStatus.DRAW;
  }
};

// games/dist/games/apagos/ApagosMoveGenerator.js
var ApagosMoveGenerator = class extends MoveGenerator {
  getListMoves(node, config) {
    const state = node.gameState;
    const moves = [];
    for (let x = 0; x < config.width; x++) {
      moves.push(ApagosMove.drop(x, Player.ZERO));
      moves.push(ApagosMove.drop(x, Player.ONE));
      for (let smallerX = 0; smallerX < x; smallerX++) {
        moves.push(ApagosMove.transfer(x, smallerX).get());
      }
    }
    function isLegal(move) {
      return ApagosRules.get().isLegal(move, state).isSuccess();
    }
    return moves.filter(isLegal);
  }
};

// games/dist/games/apagos/ApagosRightmostHeuristic.js
var ApagosRightmostHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const board = node.gameState.board;
    const size = board.length;
    const levelThreeDominant = board[size - 1].getDominatingPlayer();
    const result = PlayerNumberTable.of([0], [0]);
    if (levelThreeDominant.isPlayer()) {
      result.add(levelThreeDominant, 0, 1);
    }
    return result;
  }
};

// games/dist/games/checkers/common/CheckersFailure.js
var CheckersFailure = class {
  static ONLY_PROMOTED_PIECES_CAN_GO_BACKWARD = () => $localize`Only promoted pieces can go backward.`;
  static CANNOT_SKIP_CAPTURE = () => $localize`You must capture when it is possible!`;
  static MUST_FINISH_CAPTURING = () => $localize`You must finish this capture!`;
  static THIS_PIECE_CANNOT_MOVE = () => $localize`This piece cannot move!`;
  static FRISIAN_CAPTURE_MUST_BE_EVEN = () => $localize`Frisian capture must be of even length!`;
  static INVALID_FRISIAN_MOVE = () => $localize`This is an invalid orthogonal move, a frisian capture must be at least steps of 4. Look at the indicators to help you!`;
  static NORMAL_PIECES_CANNOT_MOVE_LIKE_THIS = () => $localize`Normal pieces cannot move like this!`;
  static FLYING_CAPTURE_IS_FORBIDDEN_FOR_NORMAL_PIECES = () => $localize`Flying capture is forbidden for normal pieces!`;
  static NO_PIECE_CAN_DO_LONG_JUMP = () => $localize`No piece is allowed to do a long jump`;
  static CANNOT_MOVE_ORTHOGONALLY = () => $localize`You cannot move orthogonally!`;
  static CANNOT_CAPTURE_TWICE_THE_SAME_SQUARE = () => $localize`You cannot capture the same square several times!`;
  static MUST_DO_LONGEST_CAPTURE = () => $localize`You must do the longest capture possible!`;
  static CANNOT_JUMP_OVER_SEVERAL_PIECES = () => $localize`You cannot jump over several pieces!`;
  static MOVE_CANNOT_CONTINUE_AFTER_NON_CAPTURE_MOVE = () => $localize`You have done a step after a capture. A move that starts with a capture can only contain captures.`;
};

// games/dist/games/checkers/common/CheckersMove.js
var CheckersMove = class _CheckersMove extends Move {
  coords;
  isStep;
  static of(coords, isStep) {
    return new _CheckersMove(coords, isStep);
  }
  static fromCapture(coords) {
    return new _CheckersMove(coords, false);
  }
  static fromStep(start, end) {
    return new _CheckersMove([start, end], true);
  }
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder), Encoder.identity()], (move) => [[...move.coords], move.isStep], (fields) => _CheckersMove.of(fields[0], fields[1]));
  constructor(coords, isStep) {
    super();
    this.coords = coords;
    this.isStep = isStep;
  }
  toString() {
    const coordStrings = this.coords.map((coord) => coord.toString());
    const coordString = coordStrings.join(", ");
    if (this.isStep) {
      return "CheckersStep(" + coordString + ")";
    } else {
      return "CheckersCapture(" + coordString + ")";
    }
  }
  getRelation(other) {
    return _CheckersMove.getRelation(this.coords, other.coords);
  }
  static getRelation(a, b) {
    const thisLength = a.length;
    const otherLength = b.length;
    if (thisLength > otherLength) {
      return "INEQUALITY";
    }
    const minimalLength = Math.min(thisLength, otherLength);
    for (let i = 0; i < minimalLength; i++) {
      if (a[i].equals(b[i]) === false)
        return "INEQUALITY";
    }
    if (thisLength === otherLength)
      return "EQUALITY";
    else
      return "PREFIX";
  }
  equals(other) {
    return this.getRelation(other) === "EQUALITY";
  }
  // If one of the two is prefix to the other ?
  isPrefix(other) {
    return this.getRelation(other) === "PREFIX";
  }
  getStartingCoord() {
    return this.coords[0];
  }
  getEndingCoord() {
    return this.coords[this.coords.length - 1];
  }
  getSteppedOverCoordsWithDuplicates() {
    let lastCoordOpt = MGPOptional.empty();
    const allJumpedOverCoords = [];
    for (const coord of this.coords) {
      if (lastCoordOpt.isPresent()) {
        const lastCoord = lastCoordOpt.get();
        const subJumpedOverCoords = lastCoord.getCoordsToward(coord);
        for (const jumpedOverCoord of subJumpedOverCoords) {
          allJumpedOverCoords.push(jumpedOverCoord);
        }
      }
      allJumpedOverCoords.push(coord);
      lastCoordOpt = MGPOptional.of(coord);
    }
    return allJumpedOverCoords;
  }
  getSteppedOverCoords() {
    return new MGPUniqueList(this.getSteppedOverCoordsWithDuplicates());
  }
  concatenate(move) {
    const lastLandingOfFirstMove = this.getEndingCoord();
    const startOfSecondMove = move.coords[0];
    Utils.assert(lastLandingOfFirstMove.equals(startOfSecondMove), "should not concatenate non-touching move");
    const firstPart = [...this.coords];
    const secondPart = [...move.coords].slice(1);
    return _CheckersMove.fromCapture(firstPart.concat(secondPart));
  }
};

// games/dist/games/checkers/common/CheckersState.js
var CheckersPiece = class _CheckersPiece {
  player;
  isPromoted;
  static ZERO = new _CheckersPiece(Player.ZERO, false);
  static ONE = new _CheckersPiece(Player.ONE, false);
  static ZERO_PROMOTED = new _CheckersPiece(Player.ZERO, true);
  static ONE_PROMOTED = new _CheckersPiece(Player.ONE, true);
  constructor(player, isPromoted) {
    this.player = player;
    this.isPromoted = isPromoted;
  }
  toString() {
    switch (this) {
      case _CheckersPiece.ZERO:
        return "u";
      case _CheckersPiece.ONE:
        return "v";
      case _CheckersPiece.ZERO_PROMOTED:
        return "O";
      default:
        Utils.expectToBe(this, _CheckersPiece.ONE_PROMOTED);
        return "X";
    }
  }
  equals(other) {
    return this === other;
  }
  /**
   * Returns a promoted version of this piece
   */
  promote() {
    if (this.player === Player.ZERO) {
      return _CheckersPiece.ZERO_PROMOTED;
    } else {
      return _CheckersPiece.ONE_PROMOTED;
    }
  }
};
var CheckersStack = class _CheckersStack {
  pieces;
  static EMPTY = new _CheckersStack([]);
  // The list of pieces is from top to bottom, hence [commander, its allies, its prisoners, more prisoners]
  constructor(pieces) {
    this.pieces = pieces;
  }
  isEmpty() {
    return this.pieces.length === 0;
  }
  isOccupied() {
    return this.pieces.length > 0;
  }
  isCommandedBy(player) {
    if (this.isEmpty()) {
      return false;
    }
    return this.getCommander().player === player;
  }
  getCommander() {
    return this.pieces[0];
  }
  getPiecesUnderCommander() {
    return new _CheckersStack(this.pieces.slice(1));
  }
  capturePiece(piece) {
    return new _CheckersStack(this.pieces.concat(piece));
  }
  addStackBelow(stack) {
    return new _CheckersStack(this.pieces.concat(stack.pieces));
  }
  getStackSize() {
    return this.pieces.length;
  }
  promoteCommander() {
    let commander = this.getCommander();
    if (commander.isPromoted) {
      return this;
    } else {
      commander = commander.promote();
      const remainingStack = this.getPiecesUnderCommander();
      const commandingStack = new _CheckersStack([commander]);
      return commandingStack.addStackBelow(remainingStack);
    }
  }
  get(index) {
    return this.pieces[index];
  }
  toString(length) {
    let leftFill = length - this.getStackSize();
    let result = "";
    while (leftFill > 0) {
      result += "_";
      leftFill--;
    }
    for (const piece of this.pieces) {
      result += piece.toString();
    }
    return result;
  }
};
var CheckersState = class _CheckersState extends GameStateWithTable {
  static SIZE = 7;
  constructor(board, turn) {
    super(board, turn);
  }
  getStacksOf(player) {
    const stackCoords = [];
    for (const coordAndContent of this.getCoordsAndContents()) {
      if (coordAndContent.content.isCommandedBy(player)) {
        stackCoords.push(coordAndContent.coord);
      }
    }
    return stackCoords;
  }
  set(coord, value) {
    const newBoard = this.getCopiedBoard();
    newBoard[coord.y][coord.x] = value;
    return new _CheckersState(newBoard, this.turn);
  }
  remove(coord) {
    return this.set(coord, CheckersStack.EMPTY);
  }
  incrementTurn() {
    return new _CheckersState(this.getCopiedBoard(), this.turn + 1);
  }
  getFinishLineOf(player) {
    if (player === Player.ZERO) {
      return 0;
    } else {
      return this.getHeight() - 1;
    }
  }
  coordIsCommandedBy(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().isCommandedBy(player);
    } else {
      return false;
    }
  }
  isEmptyAt(coord) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().isEmpty();
    } else {
      return false;
    }
  }
  getScores() {
    const zeroScore = this.getStacksOf(Player.ZERO).length;
    const oneScore = this.getStacksOf(Player.ONE).length;
    return PlayerNumberMap.of(zeroScore, oneScore);
  }
  toString() {
    let biggerStack = 1;
    const height = this.getHeight();
    const width = this.getWidth();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const newStackSize = this.getPieceAtXY(x, y).getStackSize();
        biggerStack = Math.max(biggerStack, newStackSize);
      }
    }
    const lines = [];
    for (let y = 0; y < height; y++) {
      const squares = [];
      for (let x = 0; x < width; x++) {
        squares.push(this.getPieceAtXY(x, y).toString(biggerStack));
      }
      lines.push(squares.join(" "));
    }
    return lines.join("\n");
  }
};
var EvenCheckersState = class extends CheckersState {
  static of(board, turn) {
    const state = new CheckersState(board, turn);
    state.forEachCoord((coord, content) => {
      if ((coord.x + coord.y) % 2 === 1) {
        Utils.assert(content.isEmpty(), `Invalid even checkers state contains a piece at (${coord.x}, ${coord.y})`);
      }
    });
    return state;
  }
};
var OddCheckersState = class extends CheckersState {
  static of(board, turn) {
    const state = new CheckersState(board, turn);
    state.forEachCoord((coord, content) => {
      if ((coord.x + coord.y) % 2 === 0) {
        Utils.assert(content.isEmpty(), `Invalid odd checkers state contains a piece at (${coord.x}, ${coord.y})`);
      }
    });
    return state;
  }
};

// games/dist/games/checkers/common/AbstractCheckersRules.js
var CheckersOptionLocalizable = class {
  static STACK_PIECES = () => $localize`Stack pieces instead of capturing them`;
  static MAXIMAL_CAPTURE = () => $localize`You must capture the highest number of pieces`;
  static SIMPLE_PIECE_CAN_CAPTURE_BACKWARDS = () => $localize`Simple pieces can capture backward`;
  static PROMOTED_PIECES_CAN_TRAVEL_LONG_DISTANCES = () => $localize`Promoted pieces can travel long distance`;
  static OCCUPY_EVEN_SQUARE = () => $localize`Occupy upper-left corner`;
  static FRISIAN_CAPTURE_ALLOWED = () => $localize`Can do frisian captures`;
  static CAN_PROMOTE_MID_CAPTURE = () => $localize`Piece that reaches the last line during a capture continues capturing as king`;
};
var AbstractCheckersRules = class extends ConfigurableRules {
  getInitialState(config) {
    const U = new CheckersStack([CheckersPiece.ZERO]);
    const V = new CheckersStack([CheckersPiece.ONE]);
    const _ = CheckersStack.EMPTY;
    const height = config.emptyRows + 2 * config.playerRows;
    const board = TableUtils.create(config.width, height, _);
    const occupiedSquare = config.occupyEvenSquare ? 0 : 1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < config.width; x++) {
        if ((x + y) % 2 === occupiedSquare) {
          if (y < config.playerRows) {
            board[y][x] = V;
          } else if (config.playerRows + config.emptyRows <= y) {
            board[y][x] = U;
          }
        }
      }
    }
    if (config.occupyEvenSquare) {
      return EvenCheckersState.of(board, 0);
    } else {
      return OddCheckersState.of(board, 0);
    }
  }
  /**
   * @param state the state from which you want the current player's capture
   * @param config the config
   * @returns all the complete captures, whether or not they are legal
   */
  getCompleteCaptures(state, config) {
    const player = state.getCurrentPlayer();
    return this.getCapturesOf(state, player, config);
  }
  getCapturesOf(state, player, config) {
    const captures = [];
    const playerPieces = state.getStacksOf(player);
    for (const playerPiece of playerPieces) {
      captures.push(...this.getPieceCaptures(state, playerPiece, config, []));
    }
    return captures;
  }
  getPieceCaptures(state, coord, config, capturedCoords) {
    let pieceMoves = [];
    const piece = state.getPieceAt(coord);
    const pieceOwner = piece.getCommander().player;
    const opponent = pieceOwner.getOpponent();
    const directions = this.getPieceDirections(state, coord, true, config);
    for (const direction of directions) {
      const captured = this.getFirstCapturableCoord(state, coord, direction, opponent, capturedCoords, config);
      if (captured.isPresent()) {
        const landings = this.getLandableCoords(state, coord, captured.get(), direction, config);
        for (const landing of landings) {
          const postCapture = this.applyCapture(state, coord, captured.get(), landing, config);
          const startOfMove = CheckersMove.fromCapture([coord, landing]);
          const newCapturedCoords = capturedCoords.concat(captured.get());
          const endsOfMoves = this.getPieceCaptures(postCapture.state, landing, config, newCapturedCoords);
          if (endsOfMoves.length === 0) {
            pieceMoves = pieceMoves.concat(startOfMove);
          } else {
            const mergedMoves = endsOfMoves.map((endMove) => {
              return startOfMove.concatenate(endMove);
            });
            pieceMoves = pieceMoves.concat(mergedMoves);
          }
        }
      }
    }
    return pieceMoves;
  }
  applyCapture(state, start, captured, landing, config) {
    const moved = state.getPieceAt(start);
    const pieceOwner = moved.getCommander().player;
    let fakePostCaptureState = state.remove(start);
    let landingPiece = moved;
    if (config.canStackPieces) {
      const capturedSpace = state.getPieceAt(captured);
      const remainingStack = capturedSpace.getPiecesUnderCommander();
      fakePostCaptureState = fakePostCaptureState.set(captured, remainingStack);
      landingPiece = moved.capturePiece(capturedSpace.getCommander());
    }
    if (config.canPromoteMidCapture && landing.y === state.getFinishLineOf(pieceOwner)) {
      landingPiece = landingPiece.promoteCommander();
    }
    fakePostCaptureState = fakePostCaptureState.set(landing, landingPiece);
    return { state: fakePostCaptureState, piece: landingPiece };
  }
  getFirstCapturableCoord(state, coord, direction, opponent, capturedCoords, config) {
    const isPromotedPiece = state.getPieceAt(coord).getCommander().isPromoted;
    if (config.promotedPiecesCanFly && isPromotedPiece) {
      return this.getFirstCapturableCoordForFlyingCapture(state, coord, direction, opponent, capturedCoords);
    } else {
      const nextCoord = coord.getNext(direction, 1);
      if (state.coordIsCommandedBy(nextCoord, opponent) && this.isPresentIn(nextCoord, capturedCoords) === false) {
        return MGPOptional.of(nextCoord);
      } else {
        return MGPOptional.empty();
      }
    }
  }
  getLandableCoords(state, coord, captured, direction, config) {
    let possibleLanding = this.getNextPossibleLanding(state, captured, direction);
    const possibleLandings = [];
    if (possibleLanding.isPresent()) {
      possibleLandings.push(possibleLanding.get());
      const isPromotedPiece = state.getPieceAt(coord).getCommander().isPromoted;
      if (config.promotedPiecesCanFly && isPromotedPiece) {
        possibleLanding = this.getNextPossibleLanding(state, possibleLanding.get(), direction);
        while (possibleLanding.isPresent()) {
          possibleLandings.push(possibleLanding.get());
          possibleLanding = this.getNextPossibleLanding(state, possibleLanding.get(), direction);
        }
      }
    }
    return possibleLandings;
  }
  getNextPossibleLanding(state, coord, direction) {
    const minimalisedDirection = direction.toMinimalVector();
    const nextPossibleLanding = coord.getNext(direction, 1);
    const distance = coord.getDistanceToward(nextPossibleLanding);
    let i = 0;
    while (i < distance) {
      coord = coord.getNext(minimalisedDirection, 1);
      if (state.isEmptyAt(coord) === false) {
        return MGPOptional.empty();
      }
      i++;
    }
    return MGPOptional.of(nextPossibleLanding);
  }
  isPresentIn(coord, coordList) {
    return coordList.some((c) => c.equals(coord));
  }
  getFirstCapturableCoordForFlyingCapture(state, coord, direction, opponent, capturedCoords) {
    const minimalisedDirection = direction.toMinimalVector();
    const nextCoord = coord.getNext(minimalisedDirection, 1);
    if (state.isNotOnBoard(nextCoord)) {
      return MGPOptional.empty();
    }
    if (state.getPieceAt(nextCoord).isEmpty()) {
      return this.getFirstCapturableCoordForFlyingCapture(state, nextCoord, minimalisedDirection, opponent, capturedCoords);
    } else if (state.getPieceAt(nextCoord).isCommandedBy(opponent)) {
      if (this.isPresentIn(nextCoord, capturedCoords)) {
        return MGPOptional.empty();
      } else {
        return MGPOptional.of(nextCoord);
      }
    } else {
      return MGPOptional.empty();
    }
  }
  getPieceDirections(state, coord, isCapture, config) {
    const piece = state.getPieceAt(coord);
    const pieceOwner = piece.getCommander().player;
    const verticalDirection = pieceOwner.getYDirection();
    const directions = [
      Ordinal.factory.fromDelta(-1, verticalDirection).get(),
      // left diagonal
      Ordinal.factory.fromDelta(1, verticalDirection).get()
      // right diagonal
    ];
    if (isCapture && config.frisianCaptureAllowed) {
      const frisianForward = new Vector(0, 2 * verticalDirection);
      directions.push(
        new Vector(-2, 0),
        // left frisian
        new Vector(2, 0),
        // right frisian
        frisianForward
      );
      if (config.simplePieceCanCaptureBackwards) {
        const frisianBackward = new Vector(0, -2 * verticalDirection);
        directions.push(frisianBackward);
      }
    }
    const isLegalCaptureBackward = isCapture && config.simplePieceCanCaptureBackwards;
    if (state.getPieceAt(coord).getCommander().isPromoted || isLegalCaptureBackward) {
      directions.push(
        Ordinal.factory.fromDelta(-1, -verticalDirection).get(),
        // down left diagonal
        Ordinal.factory.fromDelta(1, -verticalDirection).get()
      );
    }
    return directions;
  }
  getSteps(state, config) {
    const player = state.getCurrentPlayer();
    return this.getStepsOf(state, player, config);
  }
  getStepsOf(state, player, config) {
    const steps = [];
    const playerStacks = state.getStacksOf(player);
    for (const playerPiece of playerStacks) {
      steps.push(...this.getPieceSteps(state, playerPiece, config));
    }
    return steps;
  }
  getPieceSteps(state, coord, config) {
    const pieceMoves = [];
    const directions = this.getPieceDirections(state, coord, false, config);
    for (const direction of directions) {
      const isPromotedPiece = state.getPieceAt(coord).getCommander().isPromoted;
      if (config.promotedPiecesCanFly && isPromotedPiece) {
        let landing = coord;
        let previousJumpWasPossible = true;
        while (previousJumpWasPossible) {
          landing = landing.getNext(direction, 1);
          previousJumpWasPossible = state.isEmptyAt(landing);
          if (previousJumpWasPossible) {
            const newStep = CheckersMove.fromStep(coord, landing);
            pieceMoves.push(newStep);
          }
        }
      } else {
        const landing = coord.getNext(direction, 1);
        if (state.isEmptyAt(landing)) {
          const newStep = CheckersMove.fromStep(coord, landing);
          pieceMoves.push(newStep);
        }
      }
    }
    return pieceMoves;
  }
  applyLegalMove(move, state, config) {
    return this.applyMove(move, state, config).incrementTurn();
  }
  applyMove(move, state, config) {
    const moveStart = move.getStartingCoord();
    const moveEnd = move.getEndingCoord();
    let movingStack = state.getPieceAt(moveStart);
    let resultingState = state.remove(moveStart);
    if (move.isStep === false) {
      const capturedCoords = [];
      for (let i = 1; i < move.coords.length; i++) {
        const previousCoord = move.coords[i - 1];
        const landingCoord = move.coords[i];
        const capturedCoord = this.getCapturedCoord(previousCoord, landingCoord, resultingState);
        if (capturedCoord.isPresent()) {
          const captured = capturedCoord.get();
          Utils.assert(this.isPresentIn(captured, capturedCoords) === false, "A legal checkers move cannot capture the same coordinate twice.");
          capturedCoords.push(captured);
          const capturedSpace = resultingState.getPieceAt(captured);
          const capturedCommander = capturedSpace.getCommander();
          if (config.canStackPieces) {
            movingStack = movingStack.capturePiece(capturedCommander);
            const remainingStack = capturedSpace.getPiecesUnderCommander();
            resultingState = resultingState.set(captured, remainingStack);
          } else {
            resultingState = resultingState.set(captured, CheckersStack.EMPTY);
          }
        }
        if (config.canPromoteMidCapture && landingCoord.y === state.getFinishLineOf(state.getCurrentPlayer())) {
          movingStack = movingStack.promoteCommander();
        }
      }
    }
    resultingState = resultingState.set(moveEnd, movingStack);
    const finishLine = state.getFinishLineOf(state.getCurrentPlayer());
    const promotedMidCapture = config.canPromoteMidCapture && move.coords.some((c) => c.y === finishLine);
    if (moveEnd.y === finishLine || promotedMidCapture) {
      resultingState = resultingState.set(moveEnd, movingStack.promoteCommander());
    }
    return resultingState;
  }
  getCapturedCoord(start, end, state) {
    const capturedCoords = start.getCoordsToward(end).filter((coord) => state.getPieceAt(coord).isOccupied());
    Utils.assert(capturedCoords.length <= 1, "getCapturedCoord should only be called after single-capture validation.");
    if (capturedCoords.length === 1) {
      return MGPOptional.of(capturedCoords[0]);
    } else {
      return MGPOptional.empty();
    }
  }
  isLegal(move, state, config) {
    const moveOwnershipValidity = this.getMoveOwnershipValidity(move, state, config);
    if (moveOwnershipValidity.isFailure()) {
      return moveOwnershipValidity;
    }
    const moveValidity = this.isLegalSubMoveList(move, state, config);
    if (moveValidity.isFailure()) {
      return moveValidity;
    }
    const possibleCaptures = this.getCompleteCaptures(state, config);
    if (possibleCaptures.length === 0) {
      return MGPValidation.SUCCESS;
    } else {
      return this.isLegalCaptureChoice(move, state, possibleCaptures, config);
    }
  }
  getMoveOwnershipValidity(move, state, config) {
    const outOfRangeCoord = this.getMoveOutOfRangeCoord(move, config);
    if (outOfRangeCoord.isPresent()) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(outOfRangeCoord.get()));
    }
    const moveStart = move.getStartingCoord();
    if (state.getPieceAt(moveStart).isEmpty()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    const movedStack = state.getPieceAt(moveStart);
    const opponent = state.getCurrentOpponent();
    if (movedStack.isCommandedBy(opponent)) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    return MGPValidation.SUCCESS;
  }
  getMoveOutOfRangeCoord(move, config) {
    const configHeight = config.emptyRows + 2 * config.playerRows;
    for (const coord of move.coords) {
      if (coord.isNotInRange(config.width, configHeight)) {
        return MGPOptional.of(coord);
      }
    }
    return MGPOptional.empty();
  }
  isLegalSubMoveList(move, state, config) {
    let stack = state.getPieceAt(move.coords[0]);
    const isSimpleJump = move.coords.length === 2;
    let validationState = state.remove(move.coords[0]);
    const capturedCoords = [];
    const finishLine = state.getFinishLineOf(state.getCurrentPlayer());
    for (let i = 1; i < move.coords.length; i++) {
      const previousCoord = move.coords[i - 1];
      const landingCoord = move.coords[i];
      const subMoveValidity = this.getSubMoveValidity(stack, isSimpleJump, previousCoord, landingCoord, validationState, config);
      if (subMoveValidity.isFailure()) {
        return subMoveValidity;
      }
      const capturedCoord = this.getCapturedCoord(previousCoord, landingCoord, validationState);
      if (capturedCoord.isPresent()) {
        const captured = capturedCoord.get();
        if (this.isPresentIn(captured, capturedCoords)) {
          return MGPValidation.failure(CheckersFailure.CANNOT_CAPTURE_TWICE_THE_SAME_SQUARE());
        }
        capturedCoords.push(captured);
        if (config.canStackPieces) {
          const capturedStack = validationState.getPieceAt(captured);
          stack = stack.capturePiece(capturedStack.getCommander());
          validationState = validationState.set(captured, capturedStack.getPiecesUnderCommander());
        }
      }
      if (config.canPromoteMidCapture && landingCoord.y === finishLine) {
        stack = stack.promoteCommander();
      }
    }
    return MGPValidation.SUCCESS;
  }
  getSubMoveValidity(stack, isSimpleJump, start, end, state, config) {
    const landingPiece = state.getPieceAt(end);
    if (landingPiece.getStackSize() > 0) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    const directionValidity = this.getDirectionValidity(start, end, config);
    if (directionValidity.isFailure()) {
      return directionValidity;
    }
    const flownOverPlayers = this.getFlownOverPlayers(start, end, state);
    let isCapture;
    if (flownOverPlayers.length === 0) {
      if (isSimpleJump) {
        isCapture = false;
      } else {
        return MGPValidation.failure(CheckersFailure.MOVE_CANNOT_CONTINUE_AFTER_NON_CAPTURE_MOVE());
      }
    } else if (flownOverPlayers.length > 1) {
      return MGPValidation.failure(CheckersFailure.CANNOT_JUMP_OVER_SEVERAL_PIECES());
    } else {
      if (flownOverPlayers.some((player) => player.equals(state.getCurrentPlayer()))) {
        return MGPValidation.failure(RulesFailure.CANNOT_SELF_CAPTURE());
      }
      isCapture = true;
    }
    if (this.isNormalPieceGoingBackwardIllegaly(stack, start, end, state, config)) {
      return MGPValidation.failure(CheckersFailure.ONLY_PROMOTED_PIECES_CAN_GO_BACKWARD());
    }
    const flyLegality = this.getFlyLegality(stack, start, end, isCapture, config);
    if (flyLegality.isFailure()) {
      return flyLegality;
    }
    return MGPValidation.SUCCESS;
  }
  getDirectionValidity(start, end, config) {
    const direction = start.getDirectionToward(end);
    if (direction.isFailure()) {
      return MGPValidation.failure(direction.getReason());
    }
    if (direction.get().isOrthogonal()) {
      if (config.frisianCaptureAllowed) {
        const frisianSize = start.getDistanceToward(end);
        if (frisianSize % 2 === 1) {
          return MGPValidation.failure(CheckersFailure.FRISIAN_CAPTURE_MUST_BE_EVEN());
        } else if (frisianSize === 2) {
          return MGPValidation.failure(CheckersFailure.INVALID_FRISIAN_MOVE());
        }
      } else {
        return MGPValidation.failure(CheckersFailure.CANNOT_MOVE_ORTHOGONALLY());
      }
    }
    return MGPValidation.SUCCESS;
  }
  getFlownOverPlayers(start, end, state) {
    const fliedOverCoords = start.getCoordsToward(end);
    const fliedOverPieces = fliedOverCoords.map((coord) => state.getPieceAt(coord));
    const fliedOverOccupiedStacks = fliedOverPieces.filter((stack) => stack.isOccupied());
    return fliedOverOccupiedStacks.map((stack) => stack.getCommander().player);
  }
  /**
   * @param stepStart the start of the step
   * @param stepEnd the end of the step
   * @param state the state before the step
   * @param config the config
   */
  isNormalPieceGoingBackwardIllegaly(piece, stepStart, stepEnd, state, config) {
    const commander = piece.getCommander();
    if (commander.isPromoted) {
      return false;
    }
    const opponent = state.getCurrentOpponent();
    const moveDirection = stepStart.getDirectionToward(stepEnd).get().y;
    const distance = stepStart.getDistanceToward(stepEnd);
    const isBackward = moveDirection === opponent.getYDirection();
    if (isBackward) {
      if (distance === 1) {
        return true;
      } else if (config.simplePieceCanCaptureBackwards === false) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getFlyLegality(stack, stepStart, stepEnd, isCapture, config) {
    const distance = stepStart.getDistanceToward(stepEnd);
    if (isCapture) {
      if (distance === 2) {
        return MGPValidation.SUCCESS;
      }
      if (distance === 4 && config.frisianCaptureAllowed) {
        return MGPValidation.SUCCESS;
      }
    } else {
      if (distance === 1) {
        return MGPValidation.SUCCESS;
      }
    }
    if (config.promotedPiecesCanFly) {
      if (stack.getCommander().isPromoted) {
        return MGPValidation.SUCCESS;
      } else {
        if (isCapture) {
          return MGPValidation.failure(CheckersFailure.FLYING_CAPTURE_IS_FORBIDDEN_FOR_NORMAL_PIECES());
        } else {
          return MGPValidation.failure(CheckersFailure.NORMAL_PIECES_CANNOT_MOVE_LIKE_THIS());
        }
      }
    } else {
      return MGPValidation.failure(CheckersFailure.NO_PIECE_CAN_DO_LONG_JUMP());
    }
  }
  /**
  * @param move the chosen capture
  * @param possibleCaptures all possible captures
  * @param config the config
  * @returns whether or not this move is amongst the possible capture, based on global-capture group
  * The check aspect are only based on the rules mustMakeMaximalCapture and partialCapture rules
  */
  isLegalCaptureChoice(move, state, possibleCaptures, config) {
    if (move.isStep) {
      return MGPValidation.failure(CheckersFailure.CANNOT_SKIP_CAPTURE());
    }
    if (config.mustMakeMaximalCapture) {
      const legalCaptures = ArrayUtils.maximumsBy(possibleCaptures, (m) => m.coords.length);
      const captureSize = move.coords.length;
      const awaitedCaptureSize = legalCaptures[0].coords.length;
      if (captureSize === awaitedCaptureSize) {
        return MGPValidation.SUCCESS;
      } else if (legalCaptures.some((m) => move.isPrefix(m))) {
        return MGPValidation.failure(CheckersFailure.MUST_FINISH_CAPTURING());
      } else {
        Utils.assert(awaitedCaptureSize > captureSize, "capture is longer than it should!");
        return MGPValidation.failure(CheckersFailure.MUST_DO_LONGEST_CAPTURE());
      }
    } else {
      if (possibleCaptures.some((m) => m.equals(move))) {
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(CheckersFailure.MUST_FINISH_CAPTURING());
      }
    }
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const captures = this.getCompleteCaptures(state, config);
    if (captures.length > 0 || this.getSteps(state, config).length > 0) {
      return GameStatus.ONGOING;
    } else {
      return GameStatus.getVictory(state.getCurrentOpponent());
    }
  }
};

// games/dist/games/checkers/bashni/BashniRules.js
var BashniRules = class _BashniRules extends AbstractCheckersRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Bashni`,
    config: {
      playerRows: new NumberConfig(3, RulesConfigDescriptionLocalizable.NUMBER_OF_PIECES_ROWS, MGPValidators.range(1, 99)),
      emptyRows: new NumberConfig(2, RulesConfigDescriptionLocalizable.NUMBER_OF_EMPTY_ROWS, MGPValidators.range(1, 99)),
      width: new NumberConfig(8, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(2, 99)),
      canStackPieces: new BooleanConfig(true, CheckersOptionLocalizable.STACK_PIECES),
      mustMakeMaximalCapture: new BooleanConfig(false, CheckersOptionLocalizable.MAXIMAL_CAPTURE),
      simplePieceCanCaptureBackwards: new BooleanConfig(true, CheckersOptionLocalizable.SIMPLE_PIECE_CAN_CAPTURE_BACKWARDS),
      promotedPiecesCanFly: new BooleanConfig(true, CheckersOptionLocalizable.PROMOTED_PIECES_CAN_TRAVEL_LONG_DISTANCES),
      occupyEvenSquare: new BooleanConfig(false, CheckersOptionLocalizable.OCCUPY_EVEN_SQUARE),
      frisianCaptureAllowed: new BooleanConfig(false, CheckersOptionLocalizable.FRISIAN_CAPTURE_ALLOWED),
      canPromoteMidCapture: new BooleanConfig(true, CheckersOptionLocalizable.CAN_PROMOTE_MID_CAPTURE)
    }
  });
  static get() {
    if (_BashniRules.singleton.isAbsent()) {
      _BashniRules.singleton = MGPOptional.of(new _BashniRules());
    }
    return _BashniRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _BashniRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/checkers/common/CheckersControlHeuristic.js
var CheckersControlHeuristic = class extends PlayerMetricHeuristic {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getMetrics(node, config) {
    return this.getControlScore(node, config);
  }
  getControlScore(node, config) {
    const state = node.gameState;
    const controlScores = PlayerNumberTable.of([0], [0]);
    for (const player of Player.PLAYERS) {
      const numberOfMobileCoords = this.getNumberOfMobileCoords(state, player, config);
      controlScores.add(player, 0, numberOfMobileCoords);
    }
    return controlScores;
  }
  getNumberOfMobileCoords(state, player, config) {
    const potentialMoves = this.getCapturesAndSteps(state, player, config);
    const firstCoords = potentialMoves.map((move) => move.getStartingCoord());
    const uniqueFirstCoords = new CoordSet(firstCoords);
    return uniqueFirstCoords.size();
  }
  getCapturesAndSteps(state, player, config) {
    const captures = this.rules.getCapturesOf(state, player, config);
    const steps = this.rules.getStepsOf(state, player, config);
    return captures.concat(steps);
  }
};

// games/dist/games/checkers/common/CheckersControlPlusDominationHeuristic.js
var CheckersControlPlusDominationHeuristic = class extends CheckersControlHeuristic {
  getMetrics(node, config) {
    const controlValue = this.getControlScore(node, config);
    const dominatingPiecesCount = this.getDominatedPieceScore(node);
    return controlValue.concat(dominatingPiecesCount);
  }
  getDominatedPieceScore(node) {
    const dominatedPieces = PlayerNumberTable.of([0], [0]);
    const state = node.gameState;
    const width = state.getWidth();
    const height = state.getHeight();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const square = state.getPieceAtXY(x, y);
        if (square.getStackSize() > 0) {
          const stackSize = square.getStackSize();
          let pieceIndex = 0;
          const commander = square.getCommander().player;
          while (pieceIndex < stackSize && square.get(pieceIndex).player === commander) {
            pieceIndex++;
          }
          dominatedPieces.add(commander, 0, pieceIndex);
        }
      }
    }
    return dominatedPieces;
  }
};

// games/dist/games/checkers/common/CheckersMoveGenerator.js
var CheckersMoveGenerator = class extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const captures = this.getLegalCaptures(node.gameState, config);
    if (captures.length > 0) {
      return captures;
    } else {
      return this.rules.getSteps(node.gameState, config);
    }
  }
  getLegalCaptures(state, config) {
    const possibleCaptures = this.rules.getCompleteCaptures(state, config);
    if (config.mustMakeMaximalCapture) {
      return ArrayUtils.maximumsBy(possibleCaptures, (m) => m.coords.length);
    } else {
      return possibleCaptures;
    }
  }
};

// games/dist/games/checkers/common/CheckersScoreHeuristic.js
var CheckersScoreHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    return node.gameState.getScores().toTable();
  }
};

// games/dist/games/checkers/international-checkers/InternationalCheckersRules.js
var InternationalCheckersRules = class _InternationalCheckersRules extends AbstractCheckersRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`International Checkers`,
    config: {
      playerRows: new NumberConfig(4, RulesConfigDescriptionLocalizable.NUMBER_OF_PIECES_ROWS, MGPValidators.range(1, 99)),
      emptyRows: new NumberConfig(2, RulesConfigDescriptionLocalizable.NUMBER_OF_EMPTY_ROWS, MGPValidators.range(1, 99)),
      width: new NumberConfig(10, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(2, 99)),
      canStackPieces: new BooleanConfig(false, CheckersOptionLocalizable.STACK_PIECES),
      mustMakeMaximalCapture: new BooleanConfig(true, CheckersOptionLocalizable.MAXIMAL_CAPTURE),
      simplePieceCanCaptureBackwards: new BooleanConfig(true, CheckersOptionLocalizable.SIMPLE_PIECE_CAN_CAPTURE_BACKWARDS),
      promotedPiecesCanFly: new BooleanConfig(true, CheckersOptionLocalizable.PROMOTED_PIECES_CAN_TRAVEL_LONG_DISTANCES),
      occupyEvenSquare: new BooleanConfig(false, CheckersOptionLocalizable.OCCUPY_EVEN_SQUARE),
      frisianCaptureAllowed: new BooleanConfig(false, CheckersOptionLocalizable.FRISIAN_CAPTURE_ALLOWED),
      canPromoteMidCapture: new BooleanConfig(false, CheckersOptionLocalizable.CAN_PROMOTE_MID_CAPTURE)
    }
  });
  static get() {
    if (_InternationalCheckersRules.singleton.isAbsent()) {
      _InternationalCheckersRules.singleton = MGPOptional.of(new _InternationalCheckersRules());
    }
    return _InternationalCheckersRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _InternationalCheckersRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/checkers/lasca/LascaRules.js
var LascaRules = class _LascaRules extends AbstractCheckersRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Lasca`,
    config: {
      playerRows: new NumberConfig(3, RulesConfigDescriptionLocalizable.NUMBER_OF_PIECES_ROWS, MGPValidators.range(1, 99)),
      emptyRows: new NumberConfig(1, RulesConfigDescriptionLocalizable.NUMBER_OF_EMPTY_ROWS, MGPValidators.range(1, 99)),
      width: new NumberConfig(7, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(2, 99)),
      canStackPieces: new BooleanConfig(true, CheckersOptionLocalizable.STACK_PIECES),
      mustMakeMaximalCapture: new BooleanConfig(false, CheckersOptionLocalizable.MAXIMAL_CAPTURE),
      simplePieceCanCaptureBackwards: new BooleanConfig(false, CheckersOptionLocalizable.SIMPLE_PIECE_CAN_CAPTURE_BACKWARDS),
      promotedPiecesCanFly: new BooleanConfig(false, CheckersOptionLocalizable.PROMOTED_PIECES_CAN_TRAVEL_LONG_DISTANCES),
      occupyEvenSquare: new BooleanConfig(true, CheckersOptionLocalizable.OCCUPY_EVEN_SQUARE),
      frisianCaptureAllowed: new BooleanConfig(false, CheckersOptionLocalizable.FRISIAN_CAPTURE_ALLOWED),
      canPromoteMidCapture: new BooleanConfig(false, CheckersOptionLocalizable.CAN_PROMOTE_MID_CAPTURE)
    }
  });
  static get() {
    if (_LascaRules.singleton.isAbsent()) {
      _LascaRules.singleton = MGPOptional.of(new _LascaRules());
    }
    return _LascaRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _LascaRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/coerceo/CoerceoHeuristic.js
var CoerceoHeuristic = class extends PlayerMetricHeuristic {
  getPiecesMap(state) {
    const map = new MGPMap();
    const zeroPieces = [];
    const onePieces = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      const piece = state.getPieceAt(coord);
      if (piece === FourStatePiece.ZERO) {
        zeroPieces.push(coord);
      } else if (piece === FourStatePiece.ONE) {
        onePieces.push(coord);
      }
    }
    map.set(Player.ZERO, new CoordSet(zeroPieces));
    map.set(Player.ONE, new CoordSet(onePieces));
    return map;
  }
  getPiecesFreedomScore(state) {
    const piecesByFreedom = state.getPiecesByFreedom();
    return [
      this.getPlayerPiecesScore(piecesByFreedom.get(Player.ZERO).get()),
      this.getPlayerPiecesScore(piecesByFreedom.get(Player.ONE).get())
    ];
  }
  getPlayerPiecesScore(piecesScores) {
    const capturableScore = 1;
    const safeScore = 3;
    return safeScore * piecesScores[0] + capturableScore * piecesScores[1] + safeScore * piecesScores[2] + safeScore * piecesScores[3];
  }
};

// games/dist/games/coerceo/CoerceoCapturesAndFreedomHeuristic.js
var CoerceoCapturesAndFreedomHeuristic = class extends CoerceoHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const piecesScores = this.getPiecesFreedomScore(state);
    const scoreZero = 2 * state.captures.get(Player.ZERO) + piecesScores[0];
    const scoreOne = 2 * state.captures.get(Player.ONE) + piecesScores[1];
    return PlayerNumberTable.ofSingle(scoreZero, scoreOne);
  }
};

// games/dist/games/coerceo/CoerceoFailure.js
var CoerceoFailure = class {
  static INVALID_DISTANCE = () => $localize`Your piece must land on one of the closest six triangles with the same color as the triangle on which the piece is.`;
  static NOT_ENOUGH_TILES_TO_EXCHANGE = () => $localize`You do not have enough tiles to exchange in order to capture this piece. Pick one of your piece and move it.`;
  static FIRST_CLICK_SHOULD_NOT_BE_NULL = () => $localize`Your first click must be on the piece that you want to move, or on a piece of your opponent that you want to exchange against two tiles.`;
  static CANNOT_CAPTURE_FROM_EMPTY = () => $localize`You cannot capture from an empty space.`;
};

// games/dist/jscaip/MoveWithTwoCoords.js
var MoveWithTwoCoords = class extends Move {
  first;
  second;
  static getFallibleEncoder(generator) {
    return Encoder.tuple([Coord.encoder, Coord.encoder], (move) => [move.first, move.second], (fields) => generator(fields[0], fields[1]).get());
  }
  static getEncoder(generator) {
    return Encoder.tuple([Coord.encoder, Coord.encoder], (move) => [move.first, move.second], (fields) => generator(fields[0], fields[1]));
  }
  constructor(first, second) {
    super();
    this.first = first;
    this.second = second;
  }
  getFirst() {
    return this.first;
  }
  getSecond() {
    return this.second;
  }
  getCoords() {
    return [this.first, this.second];
  }
};

// games/dist/jscaip/MoveCoordToCoord.js
var MoveCoordToCoord = class extends MoveWithTwoCoords {
  constructor(start, end) {
    super(start, end);
    if (start.equals(end))
      throw new Error(RulesFailure.MOVE_CANNOT_BE_STATIC());
  }
  getDistance() {
    return this.getStart().getLinearDistanceToward(this.getEnd(), false);
  }
  getDirection() {
    return Ordinal.factory.fromMove(this.getStart(), this.getEnd());
  }
  getStart() {
    return this.getFirst();
  }
  getEnd() {
    return this.getSecond();
  }
  getMovedOverCoords() {
    return this.getStart().getAllCoordsToward(this.getEnd());
  }
  getJumpedOverCoords() {
    return this.getStart().getCoordsToward(this.getEnd());
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.getStart().equals(other.getStart()) === false)
      return false;
    return this.getEnd().equals(other.getEnd());
  }
  toString() {
    const start = this.getStart().toString();
    const end = this.getEnd().toString();
    return `${start} -> ${end}`;
  }
};

// games/dist/games/coerceo/CoerceoMove.js
var CoerceoStep = class _CoerceoStep {
  direction;
  str;
  static LEFT = new _CoerceoStep(new Vector(-2, 0), "LEFT");
  static UP_LEFT = new _CoerceoStep(Ordinal.UP_LEFT, "UP_LEFT");
  static UP_RIGHT = new _CoerceoStep(Ordinal.UP_RIGHT, "UP_RIGHT");
  static RIGHT = new _CoerceoStep(new Vector(2, 0), "RIGHT");
  static DOWN_LEFT = new _CoerceoStep(Ordinal.DOWN_LEFT, "DOWN_LEFT");
  static DOWN_RIGHT = new _CoerceoStep(Ordinal.DOWN_RIGHT, "DOWN_RIGHT");
  static STEPS = [
    _CoerceoStep.LEFT,
    _CoerceoStep.UP_LEFT,
    _CoerceoStep.UP_RIGHT,
    _CoerceoStep.RIGHT,
    _CoerceoStep.DOWN_LEFT,
    _CoerceoStep.DOWN_RIGHT
  ];
  static ofCoords(a, b) {
    const vector = a.getVectorToward(b);
    const stepIndex = _CoerceoStep.STEPS.findIndex((s) => s.direction.equals(vector));
    Utils.assert(stepIndex !== -1, CoerceoFailure.INVALID_DISTANCE());
    return _CoerceoStep.STEPS[stepIndex];
  }
  constructor(direction, str) {
    this.direction = direction;
    this.str = str;
  }
};
var CoerceoRegularMove = class _CoerceoRegularMove extends MoveCoordToCoord {
  static encoder = MoveCoordToCoord.getEncoder(_CoerceoRegularMove.of);
  static of(start, end) {
    const step = CoerceoStep.ofCoords(start, end);
    const move = _CoerceoRegularMove.ofMovement(start, step);
    return move;
  }
  static ofMovement(start, step) {
    const landingCoord = new Coord(start.x + step.direction.x, start.y + step.direction.y);
    return new _CoerceoRegularMove(start, landingCoord);
  }
  constructor(start, end) {
    super(start, end);
  }
  toString() {
    return "CoerceoRegularMove(" + this.getStart().toString() + " > " + this.getEnd().toString() + ")";
  }
  equals(other) {
    if (CoerceoMove.isTileExchange(other)) {
      return false;
    } else {
      return super.equals(other);
    }
  }
};
var CoerceoTileExchangeMove = class _CoerceoTileExchangeMove extends MoveCoord {
  static encoder = MoveCoord.getEncoder(_CoerceoTileExchangeMove.of);
  static of(capture) {
    return new _CoerceoTileExchangeMove(capture);
  }
  constructor(capture) {
    super(capture.x, capture.y);
  }
  toString() {
    return "CoerceoTileExchangeMove(" + this.coord.x + ", " + this.coord.y + ")";
  }
  equals(other) {
    if (CoerceoMove.isTileExchange(other)) {
      return other.coord.equals(this.coord);
    } else {
      return false;
    }
  }
};
var CoerceoMove;
(function(CoerceoMove2) {
  function isNormalMove(move) {
    return move instanceof CoerceoRegularMove;
  }
  CoerceoMove2.isNormalMove = isNormalMove;
  function isTileExchange(move) {
    return move instanceof CoerceoTileExchangeMove;
  }
  CoerceoMove2.isTileExchange = isTileExchange;
  CoerceoMove2.encoder = Encoder.disjunction([CoerceoMove2.isNormalMove, CoerceoMove2.isTileExchange], [CoerceoRegularMove.encoder, CoerceoTileExchangeMove.encoder]);
})(CoerceoMove || (CoerceoMove = {}));

// games/dist/games/coerceo/CoerceoMoveGenerator.js
var CoerceoMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    let moves = this.getListExchanges(node);
    moves = moves.concat(this.getListMovement(node));
    return moves;
  }
  getListExchanges(node) {
    const state = node.gameState;
    const player = state.getCurrentPlayer();
    const opponent = FourStatePiece.ofPlayer(state.getCurrentOpponent());
    if (state.tiles.get(player) < 2) {
      return [];
    }
    const exchanges = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content === opponent) {
        const move = CoerceoTileExchangeMove.of(coordAndContent.coord);
        exchanges.push(move);
      }
    }
    return exchanges;
  }
  getListMovement(node) {
    const movements = [];
    const state = node.gameState;
    const player = state.getCurrentPlayer();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const start = coordAndContent.coord;
      if (coordAndContent.content.is(player)) {
        const legalLandings = state.getLegalLandings(start);
        for (const end of legalLandings) {
          const move = CoerceoRegularMove.of(start, end);
          movements.push(move);
        }
      }
    }
    return movements;
  }
};

// games/dist/games/coerceo/CoerceoPiecesTilesFreedomHeuristic.js
var CoerceoPiecesTilesFreedomHeuristic = class extends CoerceoHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const metrics = PlayerNumberTable.of([0, 0, 0], [0, 0, 0]);
    const pieceMap = this.getPiecesMap(state);
    const piecesScores = this.getPiecesFreedomScore(state);
    const pieceIndex = 0;
    const tilesIndex = 1;
    const freedomIndex = 2;
    for (const owner of Player.PLAYERS) {
      const playerPieces = pieceMap.get(owner).get();
      metrics.add(owner, pieceIndex, playerPieces.size());
      metrics.add(owner, tilesIndex, state.tiles.get(owner));
      metrics.add(owner, freedomIndex, piecesScores[owner.getValue()]);
    }
    return metrics;
  }
};

// games/dist/jscaip/PieceThreat.js
var PieceThreat = class {
  directThreats;
  mover;
  constructor(directThreats, mover) {
    this.directThreats = directThreats;
    this.mover = mover;
  }
  equals(other) {
    return other.directThreats.equals(this.directThreats) && other.mover.equals(this.mover);
  }
};
var SandwichThreat = class extends PieceThreat {
  directThreat;
  constructor(directThreat, mover) {
    super(new CoordSet([directThreat]), mover);
    this.directThreat = directThreat;
  }
};

// games/dist/jscaip/Orthogonal.js
var Orthogonal = class _Orthogonal extends Direction {
  static UP = new _Orthogonal(0, -1);
  static RIGHT = new _Orthogonal(1, 0);
  static DOWN = new _Orthogonal(0, 1);
  static LEFT = new _Orthogonal(-1, 0);
  static factory = new class extends DirectionFactory {
    all = [
      _Orthogonal.RIGHT,
      _Orthogonal.DOWN,
      _Orthogonal.LEFT,
      _Orthogonal.UP
    ];
  }();
  static ORTHOGONALS = _Orthogonal.factory.all;
  static encoder = Encoder.fromFunctions((dir) => {
    return dir.toString();
  }, (encoded) => {
    Utils.assert(typeof encoded === "string", "Invalid encoded orthogonal");
    const fromString = _Orthogonal.factory.fromString(encoded);
    return fromString.get();
  });
  getOpposite() {
    const opposite = _Orthogonal.factory.from(-this.x, -this.y);
    return opposite.get();
  }
  rotateClockwise() {
    const rotated = _Orthogonal.factory.from(-this.y, this.x);
    return rotated.get();
  }
  toOrdinal() {
    switch (this) {
      case _Orthogonal.UP:
        return Ordinal.UP;
      case _Orthogonal.RIGHT:
        return Ordinal.RIGHT;
      case _Orthogonal.DOWN:
        return Ordinal.DOWN;
      default:
        Utils.expectToBe(this, _Orthogonal.LEFT);
        return Ordinal.LEFT;
    }
  }
  getAngle() {
    return this.toOrdinal().getAngle();
  }
};

// games/dist/jscaip/state/TriangularCheckerBoard.js
var TriangularCheckerBoard = class _TriangularCheckerBoard {
  static getDirections(c) {
    const left = Orthogonal.LEFT;
    const right = Orthogonal.RIGHT;
    if ((c.x + c.y) % 2 === 1) {
      const up = Orthogonal.UP;
      return [left, right, up];
    } else {
      const down = Orthogonal.DOWN;
      return [left, right, down];
    }
  }
  static getNeighbors(c) {
    return _TriangularCheckerBoard.getDirections(c).map((direction) => c.getNext(direction));
  }
  static getFakeNeighbors(c) {
    if ((c.x + c.y) % 2 === 1)
      return new Coord(c.x, c.y + 1);
    return new Coord(c.x, c.y - 1);
  }
  static getCommonNeighbor(a, b) {
    const aNeighbors = _TriangularCheckerBoard.getNeighbors(a);
    const bNeighbors = _TriangularCheckerBoard.getNeighbors(b);
    let i = 0;
    while (i < aNeighbors.length) {
      const aNeighbor = aNeighbors[i];
      let j = 0;
      while (j < bNeighbors.length) {
        const bNeighbor = bNeighbors[j];
        if (aNeighbor.equals(bNeighbor)) {
          return MGPOptional.of(aNeighbor);
        }
        j++;
      }
      i++;
    }
    return MGPOptional.empty();
  }
  static isSpaceDark(coord) {
    return (coord.x + coord.y) % 2 === 0;
  }
  static createBoard(size, empty, full) {
    const width = size * 2 - size % 2;
    const board = TableUtils.create(width, size, empty);
    const lineStartIndex = size - size % 2;
    for (let y = 0; y < size; y++) {
      const lineEndIndex = lineStartIndex + y * 2;
      for (let x = 0; x < width; x++) {
        const diagonalIndex = x + y;
        if (lineStartIndex <= diagonalIndex && diagonalIndex <= lineEndIndex) {
          board[y][x] = full;
        }
      }
    }
    return board;
  }
};

// games/dist/jscaip/state/TriangularGameState.js
var TriangularGameState = class _TriangularGameState extends GameStateWithTable {
  static getEmptyNeighbors(board, coord, empty) {
    const neighbors = [];
    for (const neighbor of TriangularCheckerBoard.getNeighbors(coord)) {
      if (neighbor.isInRange(board[0].length, board.length) && board[neighbor.y][neighbor.x] === empty) {
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }
  getEmptyNeighbors(coord, empty) {
    return _TriangularGameState.getEmptyNeighbors(this.board, coord, empty);
  }
};
var FourStatePieceTriangularGameState = class extends TriangularGameState {
  hasPieceBelongingTo(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().is(player);
    } else {
      return false;
    }
  }
};

// games/dist/games/coerceo/CoerceoState.js
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CoerceoState_1;
var CoerceoState = class CoerceoState2 extends FourStatePieceTriangularGameState {
  static {
    CoerceoState_1 = this;
  }
  tiles;
  captures;
  static NEIGHBORS_TILES_DIRECTIONS = [
    new Vector(0, -2),
    // UP
    new Vector(3, -1),
    // UP_RIGHT
    new Vector(3, 1),
    // DOWN_RIGHT
    new Vector(0, 2),
    // DOWN
    new Vector(-3, 1),
    // DOWN_LEFT
    new Vector(-3, -1)
    // UP_LEFT
  ];
  static getTilesUpperLeftCoord(tile) {
    const x = tile.x - tile.x % 3;
    let y = tile.y;
    if (x % 2 === 0) {
      y -= tile.y % 2;
    } else {
      y -= (tile.y + 1) % 2;
    }
    return new Coord(x, y);
  }
  getPresentNeighborEntrances(tileUpperLeft) {
    return [
      new Coord(tileUpperLeft.x + 1, tileUpperLeft.y - 1),
      // UP
      new Coord(tileUpperLeft.x + 3, tileUpperLeft.y + 0),
      // UP-RIGHT
      new Coord(tileUpperLeft.x + 3, tileUpperLeft.y + 1),
      // DOWN-RIGHT
      new Coord(tileUpperLeft.x + 1, tileUpperLeft.y + 2),
      // DOWN
      new Coord(tileUpperLeft.x - 1, tileUpperLeft.y + 1),
      // DOWN-LEFT
      new Coord(tileUpperLeft.x - 1, tileUpperLeft.y + 0)
      // UP-LEFT
    ].filter((c) => this.isOnBoard(c));
  }
  constructor(board, turn, tiles, captures) {
    super(board, turn);
    this.tiles = tiles;
    this.captures = captures;
    tiles.makeImmutable();
    captures.makeImmutable();
  }
  applyLegalMovement(move) {
    const start = move.getStart();
    const landing = move.getEnd();
    const newBoard = this.getCopiedBoard();
    newBoard[landing.y][landing.x] = FourStatePiece.ofPlayer(this.getCurrentPlayer());
    newBoard[start.y][start.x] = FourStatePiece.EMPTY;
    return new CoerceoState_1(newBoard, this.turn, this.tiles, this.captures);
  }
  doMovementCaptures(move) {
    const capturedCoords = this.getCapturedNeighbors(move.getEnd());
    let resultingState = this;
    for (const captured of capturedCoords) {
      resultingState = resultingState.capture(captured);
    }
    return resultingState;
  }
  getCapturedNeighbors(coord) {
    const opponent = this.getCurrentOpponent();
    const neighbors = TriangularCheckerBoard.getNeighbors(coord);
    return neighbors.filter((neighbor) => {
      if (this.isNotOnBoard(neighbor)) {
        return false;
      }
      if (this.getPieceAt(neighbor).is(opponent)) {
        return this.isSurrounded(neighbor);
      }
      return false;
    });
  }
  isSurrounded(coord) {
    const remainingFreedom = this.getEmptyNeighbors(coord, FourStatePiece.EMPTY);
    return remainingFreedom.length === 0;
  }
  capture(coord) {
    const newBoard = this.getCopiedBoard();
    const newCaptures = this.captures.getCopy();
    newBoard[coord.y][coord.x] = FourStatePiece.EMPTY;
    newCaptures.add(this.getCurrentPlayer(), 1);
    return new CoerceoState_1(newBoard, this.turn, this.tiles, newCaptures);
  }
  removeTilesIfNeeded(piece, countTiles) {
    let resultingState = this;
    const currentTile = CoerceoState_1.getTilesUpperLeftCoord(piece);
    if (this.isTileEmpty(currentTile) && this.isDeconnectable(currentTile)) {
      resultingState = this.deconnectTile(currentTile, countTiles);
      const neighbors = this.getPresentNeighborEntrances(currentTile);
      for (const neighbor of neighbors) {
        const spaceContent = resultingState.getPieceAt(neighbor);
        if (spaceContent === FourStatePiece.EMPTY) {
          resultingState = resultingState.removeTilesIfNeeded(neighbor, countTiles);
        } else if (spaceContent.is(this.getCurrentOpponent()) && resultingState.isSurrounded(neighbor)) {
          resultingState = resultingState.capture(neighbor);
        }
      }
    }
    return resultingState;
  }
  isTileEmpty(tileUpperLeft) {
    Utils.assert(this.getPieceAt(tileUpperLeft) !== FourStatePiece.UNREACHABLE, "Should not call isTileEmpty on removed tile");
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 3; x++) {
        const coord = tileUpperLeft.getNext(new Vector(x, y), 1);
        if (this.getPieceAt(coord) !== FourStatePiece.EMPTY) {
          return false;
        }
      }
    }
    return true;
  }
  isDeconnectable(tile) {
    const neighborsIndex = this.getPresentNeighborTilesRelativeIndices(tile);
    if (neighborsIndex.length > 3) {
      return false;
    }
    let holeCount = 0;
    for (let i = 1; i < neighborsIndex.length; i++) {
      if (this.areNeighbor(neighborsIndex[i - 1], neighborsIndex[i]) === false) {
        holeCount += 1;
      }
    }
    if (this.areNeighbor(neighborsIndex[0], neighborsIndex[neighborsIndex.length - 1]) === false) {
      holeCount += 1;
    }
    return holeCount <= 1;
  }
  areNeighbor(smallTileIndex, bigTileIndex) {
    return smallTileIndex + 1 === bigTileIndex || smallTileIndex === 0 && bigTileIndex === 5;
  }
  getPresentNeighborTilesRelativeIndices(tile) {
    const neighborsIndices = [];
    let firstIndex = MGPOptional.empty();
    for (let i = 0; i < 6; i++) {
      const vector = CoerceoState_1.NEIGHBORS_TILES_DIRECTIONS[i];
      const neighborTile = tile.getNext(vector, 1);
      if (this.hasInequalPieceAt(neighborTile, FourStatePiece.UNREACHABLE)) {
        if (firstIndex.isAbsent()) {
          firstIndex = MGPOptional.of(i);
        }
        neighborsIndices.push(i - firstIndex.get());
      }
    }
    return neighborsIndices;
  }
  deconnectTile(tileUpperLeft, countTiles) {
    const newBoard = this.getCopiedBoard();
    const x0 = tileUpperLeft.x;
    const y0 = tileUpperLeft.y;
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 3; x++) {
        newBoard[y0 + y][x0 + x] = FourStatePiece.UNREACHABLE;
      }
    }
    const newTiles = this.tiles.getCopy();
    if (countTiles) {
      newTiles.add(this.getCurrentPlayer(), 1);
    }
    return new CoerceoState_1(newBoard, this.turn, newTiles, this.captures);
  }
  getLegalLandings(coord) {
    const legalLandings = [];
    for (const step of CoerceoStep.STEPS) {
      const landing = coord.getNext(step.direction, 1);
      if (this.hasPieceAt(landing, FourStatePiece.EMPTY)) {
        legalLandings.push(landing);
      }
    }
    return legalLandings;
  }
  getPiecesByFreedom() {
    const playersScores = PlayerNumberTable.of([0, 0, 0, 0], [0, 0, 0, 0]);
    for (const coordAndContent of this.getCoordsAndContents()) {
      const owner = coordAndContent.content.getPlayer();
      if (owner.isPlayer()) {
        const nbFreedom = this.getEmptyNeighbors(coordAndContent.coord, FourStatePiece.EMPTY).length;
        playersScores.add(owner, nbFreedom, 1);
      }
    }
    return playersScores;
  }
};
CoerceoState = CoerceoState_1 = __decorate2([
  Debug.log
], CoerceoState);

// games/dist/games/coerceo/CoerceoPiecesThreatsTilesHeuristic.js
var CoerceoPiecesThreatsTilesHeuristic = class extends CoerceoHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const pieceMap = this.getPiecesMap(state);
    const threatMap = this.getThreatMap(state, pieceMap);
    const filteredThreatMap = this.filterThreatMap(threatMap, state);
    const safeIndex = 0;
    const threatenedIndex = 1;
    const tilesIndex = 2;
    const metrics = PlayerNumberTable.of([0, 0, 0], [0, 0, 0]);
    for (const owner of Player.PLAYERS) {
      for (const coord of pieceMap.get(owner).get()) {
        if (filteredThreatMap.get(coord).isPresent()) {
          metrics.add(owner, threatenedIndex, 1);
        } else {
          metrics.add(owner, safeIndex, 1);
        }
      }
      metrics.add(owner, tilesIndex, state.tiles.get(owner));
    }
    return metrics;
  }
  getThreatMap(state, pieces) {
    const threatMap = new MGPMap();
    for (const player of Player.PLAYERS) {
      for (const piece of pieces.get(player).get()) {
        const threat = this.getThreat(piece, state);
        if (threat.isPresent()) {
          threatMap.set(piece, threat.get());
        }
      }
    }
    return threatMap;
  }
  getThreat(coord, state) {
    const directThreatInfo = this.getDirectThreats(coord, state);
    let directThreats = directThreatInfo.directThreats;
    const uniqueFreedom = directThreatInfo.uniqueFreedom;
    const emptiableNeighborTile = directThreatInfo.emptiableNeighborTile;
    if (uniqueFreedom.isPresent()) {
      const movingThreats = [];
      for (const step of CoerceoStep.STEPS) {
        const movingThreat = uniqueFreedom.get().getNext(step.direction, 1);
        if (this.isMovingThreat(coord, movingThreat, state, directThreats)) {
          movingThreats.push(coord);
        }
      }
      if (movingThreats.length > 0) {
        const pieceThreat = new PieceThreat(new CoordSet(directThreats), new CoordSet(movingThreats));
        return MGPOptional.of(pieceThreat);
      }
    }
    if (emptiableNeighborTile.isPresent()) {
      directThreats = directThreats.filter((c) => c.equals(emptiableNeighborTile.get()));
      const directThreatsSet = new CoordSet(directThreats);
      const pieceThreat = new PieceThreat(directThreatsSet, new CoordSet([emptiableNeighborTile.get()]));
      return MGPOptional.of(pieceThreat);
    }
    return MGPOptional.empty();
  }
  getDirectThreats(coord, state) {
    let uniqueFreedom = MGPOptional.empty();
    let emptiableNeighborTile = MGPOptional.empty();
    const threatenerPlayer = state.getPieceAt(coord).getPlayer();
    const opponent = threatenerPlayer.getOpponent();
    const directThreats = [];
    const neighbors = TriangularCheckerBoard.getNeighbors(coord).filter((c) => state.isOnBoard(c));
    for (const directThreat of neighbors) {
      const threat = state.getPieceAt(directThreat);
      if (threat.is(opponent)) {
        directThreats.push(directThreat);
        if (this.tileCouldBeRemovedThisTurn(directThreat, state, opponent)) {
          emptiableNeighborTile = MGPOptional.of(directThreat);
        }
      } else if (threat === FourStatePiece.EMPTY) {
        if (uniqueFreedom.isPresent()) {
          return { directThreats: [], emptiableNeighborTile, uniqueFreedom: MGPOptional.empty() };
        } else {
          uniqueFreedom = MGPOptional.of(directThreat);
        }
      }
    }
    return { directThreats, emptiableNeighborTile, uniqueFreedom };
  }
  isMovingThreat(coord, movingThreat, state, directThreats) {
    const threatenerPlayer = state.getPieceAt(coord).getPlayer();
    const opponent = threatenerPlayer.getOpponent();
    return state.hasPieceBelongingTo(movingThreat, opponent) && directThreats.some((c) => c.equals(movingThreat)) === false;
  }
  tileCouldBeRemovedThisTurn(coord, state, OPPONENT) {
    const player = OPPONENT.getOpponent();
    const isTileRemovable = state.isDeconnectable(coord);
    if (isTileRemovable === false) {
      return false;
    }
    let uniqueThreat = MGPOptional.empty();
    const tileUpperLeft = CoerceoState.getTilesUpperLeftCoord(coord);
    for (let tileY = 0; tileY < 2; tileY++) {
      for (let tileX = 0; tileX < 3; tileX++) {
        const tileCoord = tileUpperLeft.getNext(new Vector(tileX, tileY), 1);
        if (state.getPieceAt(tileCoord).is(OPPONENT)) {
          if (this.pieceCouldLeaveTheTile(tileCoord, state)) {
            uniqueThreat = MGPOptional.of(tileCoord);
          } else {
            return false;
          }
        } else if (state.getPieceAt(tileCoord).is(player)) {
          return false;
        }
      }
    }
    return uniqueThreat.isPresent();
  }
  pieceCouldLeaveTheTile(piece, state) {
    const startingTileUpperLeft = CoerceoState.getTilesUpperLeftCoord(piece);
    for (const dir of CoerceoStep.STEPS) {
      const landing = piece.getNext(dir.direction, 1);
      const landingTileUpperLeft = CoerceoState.getTilesUpperLeftCoord(landing);
      if (startingTileUpperLeft.equals(landingTileUpperLeft) === false && state.hasPieceAt(landing, FourStatePiece.EMPTY)) {
        return true;
      }
    }
    return false;
  }
  filterThreatMap(threatMap, state) {
    const filteredThreatMap = new MGPMap();
    const threateneds = threatMap.getKeyList();
    const threatenedPlayerPieces = threateneds.filter((coord) => {
      return state.getPieceAt(coord).is(state.getCurrentPlayer());
    });
    const threatenedOpponentPieces = new CoordSet(threateneds.filter((coord) => {
      return state.getPieceAt(coord).is(state.getCurrentOpponent());
    }));
    for (const threatenedPiece of threatenedPlayerPieces) {
      const oldThreat = threatMap.get(threatenedPiece).get();
      let newThreat = MGPOptional.empty();
      for (const directOldThreat of oldThreat.directThreats) {
        if (threatenedOpponentPieces.contains(directOldThreat) === false) {
          const newMover = [];
          for (const mover of oldThreat.mover) {
            if (threatenedOpponentPieces.contains(mover) === false) {
              newMover.push(mover);
            }
          }
          if (newMover.length > 0) {
            const pieceThreat = new PieceThreat(oldThreat.directThreats, new CoordSet(newMover));
            newThreat = MGPOptional.of(pieceThreat);
          }
        }
      }
      if (newThreat.isPresent()) {
        filteredThreatMap.set(threatenedPiece, newThreat.get());
      }
    }
    for (const threatenedOpponentPiece of threatenedOpponentPieces) {
      const threatSet = threatMap.get(threatenedOpponentPiece).get();
      filteredThreatMap.set(threatenedOpponentPiece, threatSet);
    }
    return filteredThreatMap;
  }
};

// games/dist/games/coerceo/CoerceoRules.js
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CoerceoRules_1;
var CoerceoRules = class CoerceoRules2 extends ConfigurableRules {
  static {
    CoerceoRules_1 = this;
  }
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Coerceo`,
    config: {
      smallBoard: new BooleanConfig(false, () => $localize`Use small board`)
    }
  });
  static get() {
    if (CoerceoRules_1.singleton.isAbsent()) {
      CoerceoRules_1.singleton = MGPOptional.of(new CoerceoRules_1());
    }
    return CoerceoRules_1.singleton.get();
  }
  getInitialState(config) {
    const _ = FourStatePiece.EMPTY;
    const N = FourStatePiece.UNREACHABLE;
    const O = FourStatePiece.ZERO;
    const X = FourStatePiece.ONE;
    let board;
    if (config.smallBoard) {
      board = [
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, O, _, O, N, N, N],
        [_, _, O, _, _, _, O, _, _],
        [_, _, _, O, _, O, _, _, _],
        [_, _, _, X, _, X, _, _, _],
        [_, _, X, _, _, _, X, _, _],
        [N, N, N, X, _, X, N, N, N],
        [N, N, N, N, N, N, N, N, N]
      ];
    } else {
      board = [
        [N, N, N, N, N, N, O, _, O, N, N, N, N, N, N],
        [N, N, N, _, _, O, _, _, _, O, _, _, N, N, N],
        [_, X, _, X, _, _, O, _, O, _, _, X, _, X, _],
        [X, _, _, _, X, _, _, _, _, _, X, _, _, _, X],
        [_, X, _, X, _, _, _, _, _, _, _, X, _, X, _],
        [_, O, _, O, _, _, _, _, _, _, _, O, _, O, _],
        [O, _, _, _, O, _, _, _, _, _, O, _, _, _, O],
        [_, O, _, O, _, _, X, _, X, _, _, O, _, O, _],
        [N, N, N, _, _, X, _, _, _, X, _, _, N, N, N],
        [N, N, N, N, N, N, X, _, X, N, N, N, N, N, N]
      ];
    }
    return new CoerceoState(board, 0, PlayerNumberMap.of(0, 0), PlayerNumberMap.of(0, 0));
  }
  getRulesConfigDescription() {
    return CoerceoRules_1.RULES_CONFIG_DESCRIPTION;
  }
  applyLegalMove(move, state, _config, _info) {
    if (CoerceoMove.isTileExchange(move)) {
      return this.applyLegalTileExchange(move, state);
    } else {
      return this.applyLegalMovement(move, state);
    }
  }
  applyLegalTileExchange(move, state) {
    const newBoard = state.getCopiedBoard();
    const captured = move.coord;
    newBoard[captured.y][captured.x] = FourStatePiece.EMPTY;
    const currentPlayer = state.getCurrentPlayer();
    const newCaptures = state.captures.getCopy();
    newCaptures.add(currentPlayer, 1);
    const newTiles = state.tiles.getCopy();
    newTiles.add(currentPlayer, -2);
    const afterCapture = new CoerceoState(newBoard, state.turn, newTiles, newCaptures);
    const afterTileRemoval = afterCapture.removeTilesIfNeeded(captured, false);
    const resultingState = new CoerceoState(afterTileRemoval.getCopiedBoard(), afterTileRemoval.turn + 1, afterTileRemoval.tiles, afterTileRemoval.captures);
    return resultingState;
  }
  applyLegalMovement(move, state) {
    const afterMovement = state.applyLegalMovement(move);
    const afterTilesRemoved = afterMovement.removeTilesIfNeeded(move.getStart(), true);
    const afterCaptures = afterTilesRemoved.doMovementCaptures(move);
    const resultingState = new CoerceoState(afterCaptures.board, state.turn + 1, afterCaptures.tiles, afterCaptures.captures);
    return resultingState;
  }
  isLegal(move, state) {
    if (CoerceoMove.isTileExchange(move)) {
      return this.isLegalTileExchange(move, state);
    } else {
      return this.isLegalMovement(move, state);
    }
  }
  isLegalTileExchange(move, state) {
    if (state.tiles.get(state.getCurrentPlayer()) < 2) {
      return MGPValidation.failure(CoerceoFailure.NOT_ENOUGH_TILES_TO_EXCHANGE());
    }
    const captured = state.getPieceAt(move.coord);
    if (captured === FourStatePiece.UNREACHABLE || captured === FourStatePiece.EMPTY) {
      return MGPValidation.failure(CoerceoFailure.CANNOT_CAPTURE_FROM_EMPTY());
    }
    if (captured.is(state.getCurrentPlayer())) {
      return MGPValidation.failure(RulesFailure.CANNOT_SELF_CAPTURE());
    }
    return MGPValidation.SUCCESS;
  }
  isLegalMovement(move, state) {
    Utils.assert(state.getPieceAt(move.getStart()) !== FourStatePiece.UNREACHABLE, "Cannot start with a coord outside the board " + move.getStart().toString() + ".");
    Utils.assert(state.getPieceAt(move.getEnd()) !== FourStatePiece.UNREACHABLE, "Cannot end with a coord outside the board " + move.getEnd().toString() + ".");
    const starter = state.getPieceAt(move.getStart());
    if (starter === FourStatePiece.EMPTY) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (starter.is(state.getCurrentOpponent())) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    const lander = state.getPieceAt(move.getEnd());
    if (lander.is(state.getCurrentPlayer())) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    return MGPValidation.SUCCESS;
  }
  getGameStatus(node) {
    const state = node.gameState;
    const pieceMap = state.toPieceMap();
    if (pieceMap.get(FourStatePiece.ONE).isAbsent()) {
      return GameStatus.ZERO_WON;
    }
    if (pieceMap.get(FourStatePiece.ZERO).isAbsent()) {
      return GameStatus.ONE_WON;
    }
    return GameStatus.ONGOING;
  }
};
CoerceoRules = CoerceoRules_1 = __decorate3([
  Debug.log
], CoerceoRules);

// games/dist/config/RulesConfigDescriptions.js
var RulesConfigDescriptions = class {
  static GOBAN = new RulesConfigDescription({
    name: () => $localize`Default`,
    config: {
      width: new NumberConfig(19, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      height: new NumberConfig(19, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(1, 99))
    }
  });
};

// games/dist/jscaip/NInARowHelper.js
var AbstractNInARowHelper = class {
  getOwner;
  N;
  directions;
  doubleDirections;
  constructor(getOwner, N, directions) {
    this.getOwner = getOwner;
    this.N = N;
    this.directions = directions;
    const doubleDirections = [];
    for (const direction of directions) {
      if (doubleDirections.includes(direction) || doubleDirections.includes(direction.getOpposite())) {
        continue;
      } else {
        doubleDirections.push(direction);
      }
    }
    this.doubleDirections = new Set(doubleDirections);
  }
  getBoardValue(state) {
    let score = 0;
    for (const coordAndContent of state.getCoordsAndContents()) {
      const piece = coordAndContent.content;
      const coord = coordAndContent.coord;
      if (this.getOwner(piece, state).isPlayer()) {
        const squareScore = this.getSquareScore(state, coord);
        if (BoardValue.isVictoryValue(squareScore)) {
          return BoardValue.of(squareScore);
        } else {
          score += squareScore;
        }
      }
    }
    return BoardValue.of(score);
  }
  getSquareScore(state, coord) {
    const piece = state.getPieceAt(coord);
    const ally = this.getOwner(piece, state);
    Utils.assert(ally.isPlayer(), "getSquareScore should not be called with PlayerOrNone.NONE piece");
    const freeSpaceByDirs = new MGPMap();
    const alliesByDirs = new MGPMap();
    for (const dir of this.directions) {
      const freeSpaceAndAllies = this.getNumberOfFreeSpacesAndAllies(state, coord, dir, ally);
      freeSpaceByDirs.set(dir, freeSpaceAndAllies[0]);
      alliesByDirs.set(dir, freeSpaceAndAllies[1]);
    }
    const score = this.getScoreFromDirectionAlliesAndFreeSpaces(alliesByDirs, freeSpaceByDirs);
    return score * ally.getScoreModifier();
  }
  getScoreFromDirectionAlliesAndFreeSpaces(alliesByDirs, freeSpaceByDirs) {
    let score = 0;
    for (const dir of this.doubleDirections) {
      const directionAllies = alliesByDirs.get(dir).get();
      const oppositeDirectionAllies = alliesByDirs.get(dir.getOpposite()).get();
      const lineAllies = directionAllies + oppositeDirectionAllies;
      if (this.N <= lineAllies + 1) {
        return Number.POSITIVE_INFINITY;
      }
      const directionFreeSpaces = freeSpaceByDirs.get(dir).get();
      const oppositeDirectionFreeSpaces = freeSpaceByDirs.get(dir.getOpposite()).get();
      const lineFreeSpaces = directionFreeSpaces + oppositeDirectionFreeSpaces;
      if (this.N <= lineFreeSpaces + 1) {
        score += 2 + lineFreeSpaces - this.N;
      }
    }
    return score;
  }
  getNumberOfFreeSpacesAndAllies(state, i, dir, ally) {
    let freeSpaces = 0;
    let allies = 0;
    let allAlliesAreSideBySide = true;
    let coord = new Coord(i.x + dir.x, i.y + dir.y);
    let testedCoords = 1;
    const opponent = ally.getOpponent();
    while (state.isOnBoard(coord) && testedCoords < this.N) {
      const currentSpace = state.getPieceAt(coord);
      const currentOwner = this.getOwner(currentSpace, state);
      if (currentOwner === opponent) {
        return [freeSpaces, allies];
      }
      if (currentOwner === ally && allAlliesAreSideBySide) {
        allies++;
      } else {
        allAlliesAreSideBySide = false;
      }
      if (currentOwner !== opponent && currentOwner !== ally) {
        freeSpaces++;
      }
      coord = coord.getNext(dir);
      testedCoords++;
    }
    return [freeSpaces, allies];
  }
  getVictoriousCoord(state) {
    const coords = [];
    for (const coordAndContents of state.getCoordsAndContents()) {
      if (this.getOwner(coordAndContents.content, state).isPlayer()) {
        const coord = coordAndContents.coord;
        const squareScore = this.getSquareScore(state, coord);
        if (BoardValue.isVictoryValue(squareScore)) {
          coords.push(coord);
        }
      }
    }
    return coords;
  }
};
var NInARowHelper = class extends AbstractNInARowHelper {
  constructor(getOwner, N) {
    super(getOwner, N, Ordinal.ORDINALS);
  }
};

// games/dist/games/connect-six/ConnectSixMove.js
var ConnectSixFirstMove = class _ConnectSixFirstMove extends MoveCoord {
  static of(coord) {
    return new _ConnectSixFirstMove(coord.x, coord.y);
  }
  static encoder = MoveCoord.getEncoder(_ConnectSixFirstMove.of);
  constructor(x, y) {
    super(x, y);
  }
  toString() {
    return "ConnectSixFirstMove(" + this.coord.x + ", " + this.coord.y + ")";
  }
};
var ConnectSixDrops = class _ConnectSixDrops extends MoveWithTwoCoords {
  static encoder = MoveWithTwoCoords.getEncoder(_ConnectSixDrops.of);
  static of(first, second) {
    Utils.assert(first.equals(second) === false, "COORDS_SHOULD_BE_DIFFERENT");
    return new _ConnectSixDrops(first, second);
  }
  toString() {
    return "ConnectSixDrops(" + this.getFirst().toString() + ", " + this.getSecond().toString() + ")";
  }
  equals(other) {
    const thisFirst = this.getFirst();
    const otherFirst = other.getFirst();
    const thisSecond = this.getSecond();
    const otherSecond = other.getSecond();
    if (thisFirst.equals(otherFirst) && thisSecond.equals(otherSecond)) {
      return true;
    } else if (thisFirst.equals(otherSecond) && thisSecond.equals(otherFirst)) {
      return true;
    } else {
      return false;
    }
  }
};
var ConnectSixMove;
(function(ConnectSixMove2) {
  function isFirstMove(move) {
    return move instanceof ConnectSixFirstMove;
  }
  ConnectSixMove2.isFirstMove = isFirstMove;
  function isDrop(move) {
    return move instanceof ConnectSixDrops;
  }
  ConnectSixMove2.isDrop = isDrop;
  ConnectSixMove2.encoder = Encoder.disjunction([ConnectSixMove2.isFirstMove, ConnectSixMove2.isDrop], [ConnectSixFirstMove.encoder, ConnectSixDrops.encoder]);
})(ConnectSixMove || (ConnectSixMove = {}));

// games/dist/jscaip/state/PlayerOrNoneGameStateWithTable.js
var PlayerOrNoneGameStateWithTable = class extends GameStateWithTable {
  getPlayerCoordsAndContent() {
    return this.getCoordsAndContents().filter((value) => {
      return value.content.isPlayer();
    }).map((value) => {
      return {
        coord: value.coord,
        content: value.content
      };
    });
  }
  isEmptyAt(coord) {
    return this.hasPieceAt(coord, PlayerOrNone.NONE);
  }
};

// games/dist/games/connect-six/ConnectSixState.js
var ConnectSixState = class extends PlayerOrNoneGameStateWithTable {
};

// games/dist/games/connect-six/ConnectSixRules.js
var ConnectSixRules = class _ConnectSixRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = RulesConfigDescriptions.GOBAN;
  static get() {
    if (_ConnectSixRules.singleton.isAbsent()) {
      _ConnectSixRules.singleton = MGPOptional.of(new _ConnectSixRules());
    }
    return _ConnectSixRules.singleton.get();
  }
  static CONNECT_SIX_HELPER = new NInARowHelper(Utils.identity, 6);
  static getVictoriousCoords(state) {
    return _ConnectSixRules.CONNECT_SIX_HELPER.getVictoriousCoord(state);
  }
  getRulesConfigDescription() {
    return _ConnectSixRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const board = TableUtils.create(config.width, config.height, PlayerOrNone.NONE);
    return new ConnectSixState(board, 0);
  }
  applyLegalMove(move, state, _config, _info) {
    if (move instanceof ConnectSixDrops) {
      return this.applyLegalDrops(move, state);
    } else {
      return this.applyLegalFirstMove(move, state);
    }
  }
  applyLegalDrops(move, state) {
    const player = state.getCurrentPlayer();
    const first = move.getFirst();
    const second = move.getSecond();
    const newBoard = state.getCopiedBoard();
    newBoard[first.y][first.x] = player;
    newBoard[second.y][second.x] = player;
    return new ConnectSixState(newBoard, state.turn + 1);
  }
  applyLegalFirstMove(move, state) {
    const player = state.getCurrentPlayer();
    const newBoard = state.getCopiedBoard();
    newBoard[move.coord.y][move.coord.x] = player;
    return new ConnectSixState(newBoard, state.turn + 1);
  }
  isLegal(move, state) {
    if (move instanceof ConnectSixFirstMove) {
      Utils.assert(state.turn === 0, "ConnectSixFirstMove should only be used at first move");
      if (state.isNotOnBoard(move.coord)) {
        return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.coord));
      }
      return MGPValidation.SUCCESS;
    } else {
      Utils.assert(state.turn > 0, "ConnectSixDrops should only be used after first move");
      if (state.isNotOnBoard(move.getFirst())) {
        return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.getFirst()));
      } else if (state.isNotOnBoard(move.getSecond())) {
        return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.getSecond()));
      } else {
        return this.isLegalDrops(move, state);
      }
    }
  }
  isLegalDrops(move, state) {
    if (state.getPieceAt(move.getFirst()).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SQUARE());
    } else if (state.getPieceAt(move.getSecond()).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SQUARE());
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  getGameStatus(node) {
    const state = node.gameState;
    const victoriousCoord = _ConnectSixRules.CONNECT_SIX_HELPER.getVictoriousCoord(state);
    if (victoriousCoord.length > 0) {
      return GameStatus.getVictory(state.getCurrentOpponent());
    }
    if (TableUtils.contains(state.board, PlayerOrNone.NONE)) {
      return GameStatus.ONGOING;
    } else {
      return GameStatus.DRAW;
    }
  }
};

// games/dist/games/connect-six/ConnectSixAlignmentHeuristic.js
var ConnectSixAlignmentHeuristic = class extends Heuristic {
  getBoardValue(node, _config) {
    const state = node.gameState;
    let score = 0;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const squareScore = ConnectSixRules.CONNECT_SIX_HELPER.getSquareScore(state, coordAndContent.coord);
      score += squareScore;
    }
    return BoardValue.of(score);
  }
};

// games/dist/games/connect-six/ConnectSixMoveGenerator.js
var ConnectSixMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    if (node.gameState.turn === 0) {
      return this.getFirstMove(node.gameState);
    } else {
      return this.getListDrops(node);
    }
  }
  getFirstMove(state) {
    const width = state.getWidth();
    const height = state.getHeight();
    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);
    const center = new Coord(cx, cy);
    return [
      ConnectSixFirstMove.of(center)
    ];
  }
  getListDrops(node) {
    const availableFirstCoords = this.getAvailableCoords(node.gameState);
    const moves = [];
    for (const firstCoord of availableFirstCoords) {
      const board = node.gameState.getCopiedBoard();
      board[firstCoord.y][firstCoord.x] = node.gameState.getCurrentPlayer();
      const stateAfterFirstDrops = new ConnectSixState(board, node.gameState.turn);
      const availableSecondCoords = this.getAvailableCoords(stateAfterFirstDrops);
      for (const secondCoord of availableSecondCoords) {
        const newMove = ConnectSixDrops.of(firstCoord, secondCoord);
        moves.push(newMove);
      }
    }
    return new Set2(moves).toList();
  }
  getAvailableCoords(state) {
    const usefulCoord = this.getUsefulCoordsMap(state);
    const availableCoords = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      if (usefulCoord[coord.y][coord.x] && coordAndContent.content.isNone()) {
        availableCoords.push(coord);
      }
    }
    return availableCoords;
  }
  /**
   * This function returns a table on which table[y][x] is true only if:
   *     (x, y) is empty but has occupied neighbors
   */
  getUsefulCoordsMap(state) {
    const width = state.getWidth();
    const height = state.getHeight();
    const usefulCoord = TableUtils.create(width, height, false);
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      this.addNeighboringCoord(usefulCoord, coordAndContent.coord);
    }
    return usefulCoord;
  }
  /**
   * mark the space neighboring coord as "space that have an occupied neighbor"
   * @param usefulCoordTable a table of the board which each space mapped to true if it has an occupied neighbor
   * @param coord the coord to add to this map
   */
  addNeighboringCoord(usefulCoordTable, coord) {
    const usefulDistance = 1;
    const width = usefulCoordTable[0].length;
    const height = usefulCoordTable.length;
    const minX = Math.max(0, coord.x - usefulDistance);
    const minY = Math.max(0, coord.y - usefulDistance);
    const maxX = Math.min(width - 1, coord.x + usefulDistance);
    const maxY = Math.min(height - 1, coord.y + usefulDistance);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        usefulCoordTable[y][x] = true;
      }
    }
  }
};

// games/dist/games/conspirateurs/ConspirateursFailure.js
var ConspirateursFailure = class {
  static SIMPLE_MOVE_SHOULD_BE_OF_ONE_STEP = () => $localize`Your piece should land on a neighboring square.`;
  static CANNOT_DROP_WHEN_OUT_OF_PIECE = () => $localize`You cannot drop a piece during the moving phase.`;
  static CANNOT_MOVE_BEFORE_DROPPING_ALL_PIECES = () => $localize`You cannot move a piece before both players have dropped all of their pieces.`;
  static MUST_JUMP_OVER_PIECES = () => $localize`A jump must be made over a piece, not over an empty square.`;
  static MUST_DROP_IN_CENTRAL_ZONE = () => $localize`A drop must occur in the central zone of the board.`;
  static INVALID_JUMP = () => $localize`A jump must land two squares from its original position, and be done in a straight line in any direction.`;
  static SAME_LOCATION_VISITED_IN_JUMP = () => $localize`You are visiting the same location twice in a move, you are not allowed to do so.`;
};

// games/dist/games/conspirateurs/ConspirateursState.js
var ConspirateursState = class _ConspirateursState extends PlayerOrNoneGameStateWithTable {
  static WIDTH = 17;
  static HEIGHT = 17;
  static CENTRAL_ZONE_TOP_LEFT = new Coord(4, 6);
  static CENTRAL_ZONE_BOTTOM_RIGHT = new Coord(12, 10);
  static SHELTERS_INDICES = [0, 1, 3, 5, 7, 8, 9, 11, 13, 15, 16];
  static ALL_SHELTERS = new Set2(_ConspirateursState.SHELTERS_INDICES.flatMap((xOrY) => [
    new Coord(xOrY, 0),
    new Coord(xOrY, _ConspirateursState.HEIGHT - 1),
    new Coord(0, xOrY),
    new Coord(_ConspirateursState.WIDTH - 1, xOrY)
  ])).toList();
  isShelter(coord) {
    if (this.isVerticalEdge(coord)) {
      return _ConspirateursState.SHELTERS_INDICES.some((y) => coord.y === y);
    } else if (this.isHorizontalEdge(coord)) {
      return _ConspirateursState.SHELTERS_INDICES.some((x) => coord.x === x);
    } else {
      return false;
    }
  }
  isCentralZone(coord) {
    return _ConspirateursState.CENTRAL_ZONE_TOP_LEFT.x <= coord.x && coord.x <= _ConspirateursState.CENTRAL_ZONE_BOTTOM_RIGHT.x && _ConspirateursState.CENTRAL_ZONE_TOP_LEFT.y <= coord.y && coord.y <= _ConspirateursState.CENTRAL_ZONE_BOTTOM_RIGHT.y;
  }
  isDropPhase() {
    return this.turn < 40;
  }
  getSidePieces() {
    if (this.turn % 2 === 0) {
      return PlayerNumberMap.of(20 - this.turn / 2, 20 - this.turn / 2);
    } else {
      return PlayerNumberMap.of(20 - (this.turn - 1) / 2 - 1, 20 - (this.turn - 1) / 2);
    }
  }
};

// games/dist/games/conspirateurs/ConspirateursHeuristic.js
var ConspirateursHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const scores = PlayerNumberTable.of([0, 0], [0, 0]);
    const shelterCountIndex = 0;
    const distanceCountIndex = 1;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const coord = coordAndContent.coord;
      const player = coordAndContent.content;
      if (state.isShelter(coord)) {
        scores.add(player, shelterCountIndex, 1);
      } else {
        let minEmptyShelterDistance = state.getWidth() + state.getHeight();
        for (const shelter of ConspirateursState.ALL_SHELTERS) {
          if (state.getPieceAt(shelter).isNone()) {
            const distance = coord.getOrthogonalDistance(shelter);
            minEmptyShelterDistance = Math.min(minEmptyShelterDistance, distance);
          }
        }
        scores.add(player, distanceCountIndex, -minEmptyShelterDistance);
      }
    }
    return scores;
  }
};

// games/dist/games/conspirateurs/ConspirateursMove.js
var ConspirateursMoveDrop = class _ConspirateursMoveDrop extends MoveCoord {
  static encoder = MoveCoord.getEncoder(_ConspirateursMoveDrop.of);
  static of(coord) {
    return new _ConspirateursMoveDrop(coord);
  }
  constructor(coord) {
    super(coord.x, coord.y);
  }
  toString() {
    return `ConspirateursMoveDrop(${this.coord.toString()})`;
  }
  equals(other) {
    if (ConspirateursMove.isDrop(other)) {
      return this.coord.equals(other.coord);
    } else {
      return false;
    }
  }
};
var ConspirateursMoveSimple = class _ConspirateursMoveSimple extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_ConspirateursMoveSimple.from);
  static from(start, end) {
    if (start.isAlignedWith(end) && start.getLinearDistanceToward(end) === 1) {
      return MGPFallible.success(new _ConspirateursMoveSimple(start, end));
    } else {
      return MGPFallible.failure(ConspirateursFailure.SIMPLE_MOVE_SHOULD_BE_OF_ONE_STEP());
    }
  }
  constructor(start, end) {
    super(start, end);
  }
  toString() {
    return `ConspirateursMoveSimple(${this.getStart().toString()} -> ${this.getEnd().toString()})`;
  }
  equals(other) {
    if (ConspirateursMove.isSimple(other)) {
      return super.equals(other);
    } else {
      return false;
    }
  }
};
var ConspirateursMoveJump = class _ConspirateursMoveJump extends Move {
  coords;
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder)], (move) => [ArrayUtils.copy(move.coords)], (fields) => _ConspirateursMoveJump.from(fields[0]).get());
  static from(coords) {
    if (coords.length < 2) {
      return MGPFallible.failure("ConspirateursMoveJump requires at least one jump, so two coords");
    }
    for (let i = 1; i < coords.length; i++) {
      const jumpDirection = coords[i - 1].getDirectionToward(coords[i]);
      if (jumpDirection.isFailure()) {
        return MGPFallible.failure(ConspirateursFailure.INVALID_JUMP());
      }
      const jumpDistance = coords[i - 1].getLinearDistanceToward(coords[i]);
      if (jumpDistance !== 2) {
        return MGPFallible.failure(ConspirateursFailure.INVALID_JUMP());
      }
    }
    const uniqueCoords = new CoordSet(coords);
    if (uniqueCoords.size() === coords.length) {
      return MGPFallible.success(new _ConspirateursMoveJump(coords));
    } else {
      return MGPFallible.failure(ConspirateursFailure.SAME_LOCATION_VISITED_IN_JUMP());
    }
  }
  constructor(coords) {
    super();
    this.coords = coords;
  }
  addJump(target) {
    const coords = ArrayUtils.copy(this.coords);
    coords.push(target);
    return _ConspirateursMoveJump.from(coords);
  }
  getStartingCoord() {
    return this.coords[0];
  }
  getEndingCoord() {
    return this.coords[this.coords.length - 1];
  }
  getLandingCoords() {
    return this.coords.slice(1);
  }
  getJumpedOverCoords() {
    const jumpedOver = [];
    for (let i = 1; i < this.coords.length; i++) {
      const jumpDirection = this.coords[i - 1].getDirectionToward(this.coords[i]).get();
      jumpedOver.push(this.coords[i - 1].getNext(jumpDirection, 1));
    }
    return jumpedOver;
  }
  toString() {
    const jumps = this.coords.map((coord) => coord.toString()).reduce((coord1, coord2) => coord1 + " -> " + coord2);
    return `ConspirateursMoveJump(${jumps})`;
  }
  equals(other) {
    if (ConspirateursMove.isSimple(other) || ConspirateursMove.isDrop(other)) {
      return false;
    } else {
      if (other === this)
        return true;
      if (this.getStartingCoord().equals(other.getStartingCoord()) === false)
        return false;
      if (this.getEndingCoord().equals(other.getEndingCoord()) === false)
        return false;
      return true;
    }
  }
};
var ConspirateursMove;
(function(ConspirateursMove2) {
  function isDrop(move) {
    return move instanceof ConspirateursMoveDrop;
  }
  ConspirateursMove2.isDrop = isDrop;
  function isSimple(move) {
    return move instanceof ConspirateursMoveSimple;
  }
  ConspirateursMove2.isSimple = isSimple;
  function isJump(move) {
    return move instanceof ConspirateursMoveJump;
  }
  ConspirateursMove2.isJump = isJump;
  ConspirateursMove2.encoder = Encoder.disjunction([ConspirateursMove2.isDrop, ConspirateursMove2.isSimple, ConspirateursMove2.isJump], [ConspirateursMoveDrop.encoder, ConspirateursMoveSimple.encoder, ConspirateursMoveJump.encoder]);
})(ConspirateursMove || (ConspirateursMove = {}));

// games/dist/games/conspirateurs/ConspirateursRules.js
var ConspirateursRules = class _ConspirateursRules extends Rules {
  static NUMBER_OF_PIECES = 40;
  static singleton = MGPOptional.empty();
  static get() {
    if (_ConspirateursRules.singleton.isAbsent()) {
      _ConspirateursRules.singleton = MGPOptional.of(new _ConspirateursRules());
    }
    return _ConspirateursRules.singleton.get();
  }
  getInitialState() {
    const board = TableUtils.create(ConspirateursState.WIDTH, ConspirateursState.HEIGHT, PlayerOrNone.NONE);
    return new ConspirateursState(board, 0);
  }
  applyLegalMove(move, state, _config, _info) {
    const updatedBoard = state.getCopiedBoard();
    if (ConspirateursMove.isDrop(move)) {
      updatedBoard[move.coord.y][move.coord.x] = state.getCurrentPlayer();
    } else if (ConspirateursMove.isSimple(move)) {
      updatedBoard[move.getStart().y][move.getStart().x] = PlayerOrNone.NONE;
      updatedBoard[move.getEnd().y][move.getEnd().x] = state.getCurrentPlayer();
    } else {
      const start = move.getStartingCoord();
      const end = move.getEndingCoord();
      updatedBoard[start.y][start.x] = PlayerOrNone.NONE;
      updatedBoard[end.y][end.x] = state.getCurrentPlayer();
    }
    return new ConspirateursState(updatedBoard, state.turn + 1);
  }
  isLegal(move, state) {
    if (ConspirateursMove.isDrop(move)) {
      return this.dropLegality(move, state);
    } else if (ConspirateursMove.isSimple(move)) {
      return this.simpleMoveLegality(move, state);
    } else {
      return this.jumpLegality(move, state);
    }
  }
  dropLegality(move, state) {
    Utils.assert(state.isOnBoard(move.coord), "Move out of board");
    if (_ConspirateursRules.NUMBER_OF_PIECES <= state.turn) {
      return MGPValidation.failure(ConspirateursFailure.CANNOT_DROP_WHEN_OUT_OF_PIECE());
    }
    if (state.getPieceAt(move.coord).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    if (state.isCentralZone(move.coord) === false) {
      return MGPValidation.failure(ConspirateursFailure.MUST_DROP_IN_CENTRAL_ZONE());
    }
    return MGPValidation.SUCCESS;
  }
  simpleMoveLegality(move, state) {
    const startInRange = state.isOnBoard(move.getStart());
    const endInRange = state.isOnBoard(move.getEnd());
    Utils.assert(startInRange && endInRange, "Move out of board");
    if (state.turn < _ConspirateursRules.NUMBER_OF_PIECES) {
      return MGPValidation.failure(ConspirateursFailure.CANNOT_MOVE_BEFORE_DROPPING_ALL_PIECES());
    }
    const startPiece = state.getPieceAt(move.getStart());
    if (startPiece.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (startPiece === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    if (state.getPieceAt(move.getEnd()).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    return MGPValidation.SUCCESS;
  }
  jumpLegality(move, state) {
    for (const coord of move.coords) {
      if (state.isNotOnBoard(coord)) {
        return MGPFallible.failure(CoordFailure.OUT_OF_RANGE(coord));
      }
    }
    if (state.turn < _ConspirateursRules.NUMBER_OF_PIECES) {
      return MGPValidation.failure(ConspirateursFailure.CANNOT_MOVE_BEFORE_DROPPING_ALL_PIECES());
    }
    const startPiece = state.getPieceAt(move.getStartingCoord());
    if (startPiece.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (startPiece === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    for (const jumpedOver of move.getJumpedOverCoords()) {
      if (state.getPieceAt(jumpedOver).isNone()) {
        return MGPValidation.failure(ConspirateursFailure.MUST_JUMP_OVER_PIECES());
      }
    }
    for (const landing of move.getLandingCoords()) {
      if (state.getPieceAt(landing).isPlayer()) {
        return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
      }
    }
    return MGPValidation.SUCCESS;
  }
  jumpTargetsFrom(state, start) {
    const targets = [
      new Coord(start.x + 2, start.y),
      new Coord(start.x - 2, start.y),
      new Coord(start.x, start.y + 2),
      new Coord(start.x, start.y - 2),
      new Coord(start.x + 2, start.y + 2),
      new Coord(start.x + 2, start.y - 2),
      new Coord(start.x - 2, start.y + 2),
      new Coord(start.x - 2, start.y - 2)
    ];
    const validTargets = [];
    for (const target of targets) {
      if (state.isOnBoard(target)) {
        const move = ConspirateursMoveJump.from([start, target]);
        if (move.isSuccess()) {
          validTargets.push(target);
        }
      }
    }
    return validTargets;
  }
  nextJumps(jump, state) {
    const ending = jump.getEndingCoord();
    const nextJumps = [];
    for (const target of this.jumpTargetsFrom(state, ending)) {
      const move = jump.addJump(target);
      if (move.isSuccess() && this.jumpLegality(move.get(), state).isSuccess()) {
        nextJumps.push(move.get());
      }
    }
    return nextJumps;
  }
  jumpHasPossibleNextTargets(jump, state) {
    return this.nextJumps(jump, state).length > 0;
  }
  getGameStatus(node) {
    const protectedPieces = this.getProtectedPieces(node.gameState);
    for (const player of Player.PLAYERS) {
      if (protectedPieces.get(player) === 20) {
        return GameStatus.getVictory(player);
      }
    }
    return GameStatus.ONGOING;
  }
  getProtectedPieces(state) {
    const protectedPieces = PlayerNumberMap.of(0, 0);
    for (const shelter of ConspirateursState.ALL_SHELTERS) {
      const content = state.getPieceAt(shelter);
      if (content.isPlayer()) {
        protectedPieces.add(content, 1);
      }
    }
    return protectedPieces;
  }
};

// games/dist/games/conspirateurs/ConspirateursMoveGenerator.js
var ConspirateursMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    if (node.gameState.turn < ConspirateursRules.NUMBER_OF_PIECES) {
      return this.getListMovesDrop(node.gameState);
    } else {
      return this.getListMovesAfterDrop(node.gameState);
    }
  }
  getListMovesDrop(state) {
    const moves = [];
    const start = ConspirateursState.CENTRAL_ZONE_TOP_LEFT;
    const end = ConspirateursState.CENTRAL_ZONE_BOTTOM_RIGHT;
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        if (state.getPieceAtXY(x, y).isNone()) {
          moves.push(ConspirateursMoveDrop.of(new Coord(x, y)));
        }
      }
    }
    return moves;
  }
  getListMovesAfterDrop(state) {
    let moves = [];
    const currentPlayer = state.getCurrentPlayer();
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content === currentPlayer) {
        moves = moves.concat(this.getListSimpleMoves(state, coordAndContent.coord));
        moves = moves.concat(this.getListJumps(state, coordAndContent.coord));
      }
    }
    return moves;
  }
  getListSimpleMoves(state, coord) {
    const moves = [];
    const targets = [
      new Coord(coord.x + 1, coord.y),
      new Coord(coord.x - 1, coord.y),
      new Coord(coord.x, coord.y + 1),
      new Coord(coord.x, coord.y - 1),
      new Coord(coord.x + 1, coord.y + 1),
      new Coord(coord.x + 1, coord.y - 1),
      new Coord(coord.x - 1, coord.y + 1),
      new Coord(coord.x - 1, coord.y - 1)
    ].filter((c) => state.isOnBoard(c));
    for (const target of targets) {
      const move = ConspirateursMoveSimple.from(coord, target);
      if (move.isSuccess() && ConspirateursRules.get().simpleMoveLegality(move.get(), state).isSuccess()) {
        moves.push(move.get());
      }
    }
    return moves;
  }
  getListJumps(state, start) {
    let moves = new Set2();
    for (const firstTarget of ConspirateursRules.get().jumpTargetsFrom(state, start)) {
      const jump = ConspirateursMoveJump.from([start, firstTarget]).get();
      if (ConspirateursRules.get().jumpLegality(jump, state).isSuccess()) {
        moves = moves.addElement(jump);
        moves = moves.union(this.getListJumpStartingFrom(state, jump));
      }
    }
    return moves.toList();
  }
  getListJumpStartingFrom(state, jump) {
    const nextJumps = ConspirateursRules.get().nextJumps(jump, state);
    let jumps = new Set2(nextJumps);
    for (const nextJump of nextJumps) {
      jumps = jumps.union(this.getListJumpStartingFrom(state, nextJump));
    }
    return jumps;
  }
};

// games/dist/games/diaballik/DiaballikDistanceHeuristic.js
var DiaballikDistanceHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const ballsCloseness = new PlayerNumberTable();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const piece = coordAndContent.content;
      if (piece.holdsBall) {
        if (piece.owner === Player.ZERO) {
          ballsCloseness.set(Player.ZERO, [state.getHeight() - 1 - coordAndContent.coord.y]);
        } else {
          ballsCloseness.set(Player.ONE, [coordAndContent.coord.y]);
        }
      }
    }
    return ballsCloseness;
  }
};

// games/dist/games/diaballik/DiaballikFailure.js
var DiaballikFailure = class {
  static CANNOT_MOVE_WITH_BALL = () => $localize`You cannot move the piece holding the ball.`;
  static MUST_MOVE_BY_ONE_ORTHOGONAL_SPACE = () => $localize`You must move by exactly one orthogonal space.`;
  static PASS_PATH_OBSTRUCTED = () => $localize`The path of this pass is obstructed.`;
  static PASS_MUST_BE_IN_STRAIGHT_LINE = () => $localize`A pass must be done in a straight line, orthogonally or diagonally.`;
  static CAN_ONLY_DO_ONE_PASS = () => $localize`You can only perform one pass per turn.`;
  static CAN_ONLY_TRANSLATE_TWICE = () => $localize`You can only perform two translations per turn, not three.`;
  static CANNOT_PASS_TO_OPPONENT = () => $localize`You cannot pass the ball to the opponent. You must pick one of your pieces.`;
};

// games/dist/games/diaballik/DiaballikMove.js
var DiaballikBallPass = class _DiaballikBallPass extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_DiaballikBallPass.from);
  static from(start, end) {
    const direction = Ordinal.factory.fromMove(start, end);
    if (direction.isFailure()) {
      return MGPFallible.failure(DiaballikFailure.PASS_MUST_BE_IN_STRAIGHT_LINE());
    }
    return MGPFallible.success(new _DiaballikBallPass(start, end));
  }
  constructor(start, end) {
    super(start, end);
  }
  equals(other) {
    return other instanceof _DiaballikBallPass && super.equals(other);
  }
};
var DiaballikTranslation = class _DiaballikTranslation extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_DiaballikTranslation.from);
  static from(start, end) {
    const vector = start.getVectorToward(end);
    if (vector.isSingleOrthogonalStep()) {
      return MGPFallible.success(new _DiaballikTranslation(start, end));
    } else {
      return MGPFallible.failure(DiaballikFailure.MUST_MOVE_BY_ONE_ORTHOGONAL_SPACE());
    }
  }
  constructor(start, end) {
    super(start, end);
  }
  equals(other) {
    return other instanceof _DiaballikTranslation && super.equals(other);
  }
};
function isTranslation(subMove) {
  return subMove instanceof DiaballikTranslation;
}
function isBallPass(subMove) {
  return subMove instanceof DiaballikBallPass;
}
var DiaballikMove = class _DiaballikMove extends Move {
  first;
  second;
  third;
  static subMoveEncoder = Encoder.disjunction([isTranslation, isBallPass], [DiaballikTranslation.encoder, DiaballikBallPass.encoder]);
  static subMoveOptionalEncoder = MGPOptional.getEncoder(_DiaballikMove.subMoveEncoder);
  static encoder = Encoder.tuple([_DiaballikMove.subMoveEncoder, _DiaballikMove.subMoveOptionalEncoder, _DiaballikMove.subMoveOptionalEncoder], (move) => [move.first, move.second, move.third], (fields) => {
    return new _DiaballikMove(fields[0], fields[1], fields[2]);
  });
  static countPassesAndTranslations(subMove, passesAndTranslations) {
    if (subMove instanceof DiaballikBallPass) {
      passesAndTranslations.passes++;
    } else {
      passesAndTranslations.translations++;
    }
  }
  constructor(first, second, third) {
    super();
    this.first = first;
    this.second = second;
    this.third = third;
    if (third.isPresent()) {
      Utils.assert(second.isPresent(), "DiaballikMove should have two first actions to have a third one");
    }
    const passesAndTranslations = {
      passes: 0,
      translations: 0
    };
    _DiaballikMove.countPassesAndTranslations(first, passesAndTranslations);
    if (second.isPresent()) {
      _DiaballikMove.countPassesAndTranslations(second.get(), passesAndTranslations);
    }
    if (third.isPresent()) {
      _DiaballikMove.countPassesAndTranslations(third.get(), passesAndTranslations);
    }
    Utils.assert(passesAndTranslations.passes <= 1, "DiaballikMove should have at most one pass");
    Utils.assert(passesAndTranslations.translations <= 2, "DiaballikMove should have at most two translations");
  }
  toString() {
    return `DiaballikMove(${this.first.toString()}, ${this.second.toString()}, ${this.third.toString()})`;
  }
  equals(other) {
    if (this.first.equals(other.first) === false)
      return false;
    if (this.second.equals(other.second) === false)
      return false;
    if (this.third.equals(other.third) === false)
      return false;
    return true;
  }
  getSubMoves() {
    const subMoves = [this.first];
    if (this.second.isPresent()) {
      subMoves.push(this.second.get());
    }
    if (this.third.isPresent()) {
      subMoves.push(this.third.get());
    }
    return subMoves;
  }
};

// games/dist/games/diaballik/DiaballikState.js
var DiaballikPiece = class _DiaballikPiece {
  owner;
  holdsBall;
  static NONE = new _DiaballikPiece(PlayerOrNone.NONE, false);
  static ZERO = new _DiaballikPiece(Player.ZERO, false);
  static ZERO_WITH_BALL = new _DiaballikPiece(Player.ZERO, true);
  static ONE = new _DiaballikPiece(Player.ONE, false);
  static ONE_WITH_BALL = new _DiaballikPiece(Player.ONE, true);
  constructor(owner, holdsBall) {
    this.owner = owner;
    this.holdsBall = holdsBall;
  }
  equals(other) {
    return this === other;
  }
};
var DiaballikState = class extends GameStateWithTable {
  equals(other) {
    return TableUtils.equals(this.board, other.board);
  }
  isEmptyAt(coord) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().owner.isNone();
    } else {
      return false;
    }
  }
  coordIsOwnedBy(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().owner.equals(player);
    } else {
      return false;
    }
  }
  coordIsNotOwnedBy(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().owner.equals(player) === false;
    } else {
      return false;
    }
  }
};

// games/dist/games/diaballik/DiaballikRules.js
var VictoryOrDefeatCoords = class {
  winner;
  constructor(winner) {
    this.winner = winner;
  }
};
var VictoryCoord = class extends VictoryOrDefeatCoords {
  coord;
  constructor(winner, coord) {
    super(winner);
    this.coord = coord;
  }
};
var DefeatCoords = class extends VictoryOrDefeatCoords {
  allLoserPieces;
  opponentPiecesInContact;
  constructor(loser, allLoserPieces, opponentPiecesInContact) {
    super(loser.getOpponent());
    this.allLoserPieces = allLoserPieces;
    this.opponentPiecesInContact = opponentPiecesInContact;
  }
};
var DiaballikRules = class _DiaballikRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_DiaballikRules.singleton.isAbsent()) {
      _DiaballikRules.singleton = MGPOptional.of(new _DiaballikRules());
    }
    return _DiaballikRules.singleton.get();
  }
  getInitialState() {
    const O = DiaballikPiece.ZERO;
    const \u022E = DiaballikPiece.ZERO_WITH_BALL;
    const X = DiaballikPiece.ONE;
    const \u1E8A = DiaballikPiece.ONE_WITH_BALL;
    const _ = DiaballikPiece.NONE;
    const board = [
      [X, X, X, \u1E8A, X, X, X],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [O, O, O, \u022E, O, O, O]
    ];
    return new DiaballikState(board, 0);
  }
  isLegal(move, state) {
    let currentState = state;
    for (const subMove of move.getSubMoves()) {
      const start = subMove.getStart();
      if (state.isNotOnBoard(start)) {
        return MGPFallible.failure(CoordFailure.OUT_OF_RANGE(start));
      }
      const end = subMove.getEnd();
      if (state.isNotOnBoard(end)) {
        return MGPFallible.failure(CoordFailure.OUT_OF_RANGE(end));
      }
      const legality = this.isLegalSubMove(currentState, subMove);
      if (legality.isFailure()) {
        return legality;
      }
      currentState = legality.get();
    }
    return MGPFallible.success(currentState);
  }
  isLegalSubMove(state, subMove) {
    if (subMove instanceof DiaballikTranslation) {
      return this.isLegalTranslation(state, subMove);
    } else {
      return this.isLegalPass(state, subMove);
    }
  }
  isLegalTranslation(state, translation) {
    const start = translation.getStart();
    const startPiece = state.getPieceAt(start);
    if (startPiece.owner.isNone()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (startPiece.owner === state.getCurrentOpponent()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    if (startPiece.holdsBall) {
      return MGPFallible.failure(DiaballikFailure.CANNOT_MOVE_WITH_BALL());
    }
    const end = translation.getEnd();
    if (state.getPieceAt(end).owner.isPlayer()) {
      return MGPFallible.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    const updatedBoard = state.getCopiedBoard();
    updatedBoard[start.y][start.x] = DiaballikPiece.NONE;
    updatedBoard[end.y][end.x] = startPiece;
    const stateAfterTranslation = new DiaballikState(updatedBoard, state.turn);
    return MGPFallible.success(stateAfterTranslation);
  }
  isLegalPass(state, pass) {
    const start = pass.getStart();
    const startPiece = state.getPieceAt(start);
    if (startPiece.owner.isNone()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (startPiece.owner === state.getCurrentOpponent()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    Utils.assert(startPiece.holdsBall, "DiaballikRules: cannot pass without the ball");
    const end = pass.getEnd();
    const endPiece = state.getPieceAt(end);
    if (endPiece.owner.isNone()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (endPiece.owner === state.getCurrentOpponent()) {
      return MGPFallible.failure(DiaballikFailure.CANNOT_PASS_TO_OPPONENT());
    }
    const direction = Ordinal.factory.fromMove(start, end).get();
    const afterStart = start.getNext(direction);
    for (let coord = afterStart; coord.equals(end) === false; coord = coord.getNext(direction)) {
      if (state.getPieceAt(coord) !== DiaballikPiece.NONE) {
        return MGPFallible.failure(DiaballikFailure.PASS_PATH_OBSTRUCTED());
      }
    }
    const updatedBoard = state.getCopiedBoard();
    const withBall = updatedBoard[start.y][start.x];
    const withoutBall = updatedBoard[end.y][end.x];
    updatedBoard[start.y][start.x] = withoutBall;
    updatedBoard[end.y][end.x] = withBall;
    return MGPFallible.success(new DiaballikState(updatedBoard, state.turn));
  }
  applyLegalMove(_move, state, _config, stateAfterSubMoves) {
    return new DiaballikState(stateAfterSubMoves.board, state.turn + 1);
  }
  getGameStatus(node) {
    const state = node.gameState;
    const victoryOrDefeat = this.getVictoryOrDefeatCoords(state);
    if (victoryOrDefeat.isPresent()) {
      return GameStatus.getVictory(victoryOrDefeat.get().winner);
    } else {
      return GameStatus.ONGOING;
    }
  }
  getVictoryOrDefeatCoords(state) {
    const ballCoordZero = this.getBallCoordInRow(state, 0, Player.ZERO);
    if (ballCoordZero.isPresent()) {
      return MGPOptional.of(new VictoryCoord(Player.ZERO, ballCoordZero.get()));
    }
    const ballCoordOne = this.getBallCoordInRow(state, state.getHeight() - 1, Player.ONE);
    if (ballCoordOne.isPresent()) {
      return MGPOptional.of(new VictoryCoord(Player.ONE, ballCoordOne.get()));
    }
    const defeatCoords = this.getBlockerAndCoords(state);
    return defeatCoords;
  }
  getBallCoordInRow(state, y, player) {
    for (let x = 0; x < state.getHeight(); x++) {
      const piece = state.getPieceAtXY(x, y);
      if (piece.holdsBall && piece.owner === player) {
        return MGPOptional.of(new Coord(x, y));
      }
    }
    return MGPOptional.empty();
  }
  getBlockerAndCoords(state) {
    const blocking = PlayerMap.ofValues(this.getBlockerCoords(state, Player.ZERO), this.getBlockerCoords(state, Player.ONE));
    if (blocking.get(Player.ZERO).isPresent() && blocking.get(Player.ONE).isPresent()) {
      return blocking.get(state.getCurrentPlayer());
    } else if (blocking.get(Player.ZERO).isPresent()) {
      return blocking.get(Player.ZERO);
    } else if (blocking.get(Player.ONE).isPresent()) {
      return blocking.get(Player.ONE);
    } else {
      return MGPOptional.empty();
    }
  }
  getBlockerCoords(state, player) {
    let opponentsConnected = new CoordSet();
    const blockerCoords = [];
    for (let x = 0; x < state.getWidth(); x++) {
      const connectionInfos = this.getConnectedPieceCoord(x, opponentsConnected, state, player);
      opponentsConnected = connectionInfos.opponentsConnected;
      const coord = connectionInfos.coord;
      if (coord.isPresent()) {
        blockerCoords.push(coord.get());
      } else {
        return MGPOptional.empty();
      }
    }
    if (opponentsConnected.size() >= 3) {
      return MGPOptional.of(new DefeatCoords(player, blockerCoords, opponentsConnected.toList()));
    } else {
      return MGPOptional.empty();
    }
  }
  getConnectedPieceCoord(x, opponentsConnected, state, player) {
    for (let y = 0; y < state.getHeight(); y++) {
      const coord = new Coord(x, y);
      if (state.getPieceAt(coord).owner === player) {
        if (this.isConnectedOnTheLeft(coord, state, player)) {
          return {
            coord: MGPOptional.of(coord),
            opponentsConnected: this.addConnectedOpponents(coord, opponentsConnected, state, player)
          };
        } else {
          return { coord: MGPOptional.empty(), opponentsConnected };
        }
      }
    }
    return { coord: MGPOptional.empty(), opponentsConnected };
  }
  isConnectedOnTheLeft(coord, state, player) {
    if (coord.x === 0) {
      return true;
    }
    for (const direction of [Ordinal.LEFT, Ordinal.UP_LEFT, Ordinal.DOWN_LEFT]) {
      const neighbor = coord.getNext(direction);
      if (state.coordIsOwnedBy(neighbor, player)) {
        return true;
      }
    }
    return false;
  }
  addConnectedOpponents(coord, opponentsConnected, state, player) {
    for (const direction of Orthogonal.factory.all) {
      const neighbor = coord.getNext(direction);
      if (state.coordIsOwnedBy(neighbor, player.getOpponent())) {
        opponentsConnected = opponentsConnected.addElement(neighbor);
      }
    }
    return opponentsConnected;
  }
};

// games/dist/games/diaballik/DiaballikMoveGenerator.js
var DiaballikMoveInConstruction = class _DiaballikMoveInConstruction {
  subMoves;
  stateBefore;
  stateAfterSubMoves;
  hasPass;
  translations;
  static finalize(m) {
    return m.finalize();
  }
  constructor(subMoves, stateBefore, stateAfterSubMoves) {
    this.subMoves = subMoves;
    this.stateBefore = stateBefore;
    this.stateAfterSubMoves = stateAfterSubMoves;
    Utils.assert(this.subMoves.length <= 3, "DiaballikMoveInConstruction can have at most 3 submoves");
    let hasPass = false;
    let translations = 0;
    for (const subMove of subMoves) {
      if (subMove instanceof DiaballikBallPass) {
        Utils.assert(hasPass === false, "DiaballikMoveInConstruction can have at most one pass");
        hasPass = true;
      } else {
        Utils.assert(translations < 2, "DiaballikMoveInConstruction can have at most two translations");
        translations++;
      }
    }
    this.hasPass = hasPass;
    this.translations = translations;
  }
  equals(other) {
    return ArrayUtils.equals(this.subMoves, other.subMoves);
  }
  addIfLegal(subMove, listToAddTo) {
    const legality = DiaballikRules.get().isLegalSubMove(this.stateAfterSubMoves, subMove);
    if (legality.isSuccess()) {
      const newSubMoves = this.subMoves.concat([subMove]);
      this.sortIfNeeded(newSubMoves);
      const newMoveInConstruction = new _DiaballikMoveInConstruction(newSubMoves, this.stateBefore, legality.get());
      listToAddTo.push(newMoveInConstruction);
    }
  }
  sortIfNeeded(subMoves) {
    const firstTranslationIndex = this.getFirstTranslationIndex(subMoves);
    if (firstTranslationIndex.isAbsent()) {
      return;
    }
    const i = firstTranslationIndex.get();
    if (i + 1 >= subMoves.length || isTranslation(subMoves[i + 1]) === false) {
      return;
    }
    const firstTranslation = subMoves[i];
    const firstTranslationCoords = new CoordSet(firstTranslation.getCoords());
    const secondTranslation = subMoves[i + 1];
    const secondTranslationCoords = new CoordSet(secondTranslation.getCoords());
    const translationIntersect = firstTranslationCoords.intersection(secondTranslationCoords).size() > 0;
    if (translationIntersect) {
      return;
    }
    const compareStart = firstTranslation.getStart().compareTo(secondTranslation.getStart());
    const firstIsBigger = compareStart > 0;
    if (firstIsBigger) {
      subMoves[i] = secondTranslation;
      subMoves[i + 1] = firstTranslation;
    }
  }
  getFirstTranslationIndex(subMoves) {
    for (let i = 0; i < subMoves.length; i++) {
      if (isTranslation(subMoves[i])) {
        return MGPOptional.of(i);
      }
    }
    return MGPOptional.empty();
  }
  getPassEnd() {
    for (const subMove of this.subMoves) {
      if (subMove instanceof DiaballikBallPass) {
        return MGPOptional.of(subMove.getEnd());
      }
    }
    return MGPOptional.empty();
  }
  passPathContains(coord) {
    for (const subMove of this.subMoves) {
      if (subMove instanceof DiaballikBallPass) {
        const passPath = subMove.getJumpedOverCoords();
        return passPath.some((c) => c.equals(coord));
      }
    }
    return false;
  }
  getPreviousTranslation() {
    for (const subMove of this.subMoves) {
      if (subMove instanceof DiaballikTranslation) {
        return MGPOptional.of(subMove);
      }
    }
    return MGPOptional.empty();
  }
  /**
   * Checks if this move has a previous translation that is the opposite of (start, end)
   */
  hasOppositeTranslation(start, end) {
    if (this.translations > 0) {
      const previousTranslation = this.getPreviousTranslation().get();
      return previousTranslation.getStart().equals(end) && previousTranslation.getEnd().equals(start);
    } else {
      return false;
    }
  }
  finalize() {
    Utils.assert(this.subMoves.length > 0, "DiaballikMoveInConstruction can only be finalized if it contains something");
    const first = this.subMoves[0];
    let second = MGPOptional.empty();
    if (this.subMoves.length > 1) {
      second = MGPOptional.of(this.subMoves[1]);
    }
    let third = MGPOptional.empty();
    if (this.subMoves.length > 2) {
      third = MGPOptional.of(this.subMoves[2]);
    }
    const move = new DiaballikMove(first, second, third);
    Utils.assert(DiaballikRules.get().isLegal(move, this.stateBefore).isSuccess(), "DiaballikMoveGenerator should only generate legal moves");
    return move;
  }
};
var DiaballikMoveGenerator = class extends MoveGenerator {
  avoidDuplicates;
  constructor(avoidDuplicates = true) {
    super();
    this.avoidDuplicates = avoidDuplicates;
  }
  getListMoves(node, config) {
    const emptyMove = new DiaballikMoveInConstruction([], node.gameState, node.gameState);
    let movesInConstruction = [emptyMove];
    let moves = new Set2();
    for (let i = 0; i < 3; i++) {
      let nextMovesInConstruction = [];
      for (const move of movesInConstruction) {
        const newMovesInConstruction = this.addAllPossibleSubMoves(move);
        moves = moves.unionList(newMovesInConstruction.map(DiaballikMoveInConstruction.finalize));
        nextMovesInConstruction = nextMovesInConstruction.concat(newMovesInConstruction);
      }
      movesInConstruction = nextMovesInConstruction;
    }
    return this.removeDuplicates(node.gameState, moves, config);
  }
  removeDuplicates(state, moves, config) {
    if (this.avoidDuplicates === false) {
      return moves.toList();
    }
    let seenStates = new Set2();
    const movesToKeep = [];
    const rules = DiaballikRules.get();
    for (const move of moves) {
      const legalityInfo = DiaballikRules.get().isLegal(move, state);
      const stateAfterMove = rules.applyLegalMove(move, state, config, legalityInfo.get());
      if (seenStates.contains(stateAfterMove) === false) {
        movesToKeep.push(move);
        seenStates = seenStates.addElement(stateAfterMove);
      }
    }
    return movesToKeep;
  }
  addAllPossibleSubMoves(moveInConstruction) {
    const state = moveInConstruction.stateAfterSubMoves;
    const player = state.getCurrentPlayer();
    const nextMovesInConstruction = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      const piece = coordAndContent.content;
      if (piece.owner === player) {
        if (piece.holdsBall && moveInConstruction.hasPass === false) {
          for (const end of this.getPassEnds(state, coordAndContent.coord)) {
            const pass = DiaballikBallPass.from(coord, end).get();
            moveInConstruction.addIfLegal(pass, nextMovesInConstruction);
          }
        } else {
          const hasLessThanTwoTranslations = moveInConstruction.translations < 2;
          if (hasLessThanTwoTranslations) {
            for (const end of this.getTranslationEnds(state, coordAndContent.coord)) {
              const doesNotHaveOppositeTranslation = moveInConstruction.hasOppositeTranslation(coordAndContent.coord, end) === false;
              if (doesNotHaveOppositeTranslation || this.avoidDuplicates === false) {
                let keep = true;
                if (moveInConstruction.hasPass) {
                  const isPieceThatPassed = moveInConstruction.getPassEnd().equalsValue(coord);
                  const goesThroughPassPath = moveInConstruction.passPathContains(end);
                  keep = isPieceThatPassed || goesThroughPassPath;
                }
                if (keep || this.avoidDuplicates === false) {
                  const translation = DiaballikTranslation.from(coord, end).get();
                  moveInConstruction.addIfLegal(translation, nextMovesInConstruction);
                }
              }
            }
          }
        }
      }
    }
    return nextMovesInConstruction;
  }
  /**
   * Returns all legal pass ends for a pass starting at start
   */
  getPassEnds(state, start) {
    const player = state.getCurrentPlayer();
    const opponent = state.getCurrentOpponent();
    const ends = [];
    for (const direction of Ordinal.factory.all) {
      let coord = start.getNext(direction);
      while (state.coordIsNotOwnedBy(coord, opponent)) {
        const piece = state.getPieceAt(coord);
        if (piece.owner === player) {
          ends.push(coord);
          break;
        }
        coord = coord.getNext(direction);
      }
    }
    return ends;
  }
  /**
   * Returns all legal translation ends for a translation starting at start
   */
  getTranslationEnds(state, start) {
    const ends = [];
    for (const direction of Orthogonal.factory.all) {
      const end = start.getNext(direction);
      if (state.isEmptyAt(end)) {
        ends.push(end);
      }
    }
    return ends;
  }
};

// games/dist/games/diaballik/DiaballikFilteredMoveGenerator.js
var DiaballikFilteredMoveGenerator = class extends DiaballikMoveGenerator {
  moveLength;
  constructor(moveLength, avoidDuplicates = true) {
    super(avoidDuplicates);
    this.moveLength = moveLength;
    Utils.assert(1 <= moveLength && moveLength <= 3, "Diaballik moves should be of length [1,3]");
  }
  /**
   * Implemented similarly as DiaballikMoveGenerator, but only generates moves containing exactly 3 sub moves.
   */
  getListMoves(node, _config) {
    const emptyMove = new DiaballikMoveInConstruction([], node.gameState, node.gameState);
    let movesInConstruction = [emptyMove];
    for (let i = 0; i < this.moveLength; i++) {
      let nextMovesInConstruction = [];
      for (const move of movesInConstruction) {
        nextMovesInConstruction = nextMovesInConstruction.concat(this.addAllPossibleSubMoves(move));
      }
      movesInConstruction = nextMovesInConstruction;
    }
    return movesInConstruction.map(DiaballikMoveInConstruction.finalize);
  }
};

// games/dist/games/diam/DiamFailure.js
var DiamFailure = class {
  static NO_MORE_PIECES_OF_THIS_TYPE = () => $localize`You do not have any pieces of this type anymore.`;
  static SPACE_IS_FULL = () => $localize`You cannot play here: this space is already full.`;
  static TARGET_STACK_TOO_HIGH = () => $localize`You cannot add more pieces to the target stack, as it will contain more than 4 pieces.`;
  static MUST_SHIFT_TO_NEIGHBOR = () => $localize`To perform a shift, you must move the pieces to a neighboring space.`;
  static MUST_SELECT_PIECE_FIRST = () => $localize`You must first select either a piece from the side, or a stack of pieces to shift on the board.`;
};

// games/dist/games/diam/DiamPiece.js
var DiamPiece = class _DiamPiece {
  owner;
  otherPieceType;
  static encoder = Encoder.tuple([PlayerOrNone.encoder, Encoder.identity()], (piece) => [piece.owner, piece.otherPieceType], (fields) => _DiamPiece.of(fields[0], fields[1]));
  static EMPTY = new _DiamPiece(PlayerOrNone.NONE, false);
  static ZERO_FIRST = new _DiamPiece(Player.ZERO, false);
  static ZERO_SECOND = new _DiamPiece(Player.ZERO, true);
  static ONE_FIRST = new _DiamPiece(Player.ONE, false);
  static ONE_SECOND = new _DiamPiece(Player.ONE, true);
  static PLAYER_PIECES = [
    _DiamPiece.ZERO_FIRST,
    _DiamPiece.ZERO_SECOND,
    _DiamPiece.ONE_FIRST,
    _DiamPiece.ONE_SECOND
  ];
  static of(player, otherPieceType) {
    if (player === Player.ZERO) {
      if (otherPieceType)
        return _DiamPiece.ZERO_SECOND;
      return _DiamPiece.ZERO_FIRST;
    } else if (player === Player.ONE) {
      if (otherPieceType)
        return _DiamPiece.ONE_SECOND;
      return _DiamPiece.ONE_FIRST;
    }
    return _DiamPiece.EMPTY;
  }
  constructor(owner, otherPieceType) {
    this.owner = owner;
    this.otherPieceType = otherPieceType;
  }
  toString() {
    return `DiamPiece(${this.owner}, ${this.otherPieceType})`;
  }
  equals(other) {
    return this === other;
  }
};

// games/dist/games/diam/DiamMove.js
var DiamMove = class extends Move {
  isDrop() {
    return this instanceof DiamMoveDrop;
  }
  isShift() {
    return this instanceof DiamMoveShift;
  }
};
var DiamMoveDrop = class _DiamMoveDrop extends DiamMove {
  target;
  piece;
  static encoder = Encoder.tuple([Encoder.identity(), DiamPiece.encoder], (drop) => [drop.target, drop.piece], (fields) => new _DiamMoveDrop(fields[0], fields[1]));
  constructor(target, piece) {
    super();
    this.target = target;
    this.piece = piece;
    if (piece === DiamPiece.EMPTY) {
      throw new Error("Cannot drop an empty piece");
    }
  }
  getTarget() {
    return this.target;
  }
  equals(other) {
    if (other instanceof _DiamMoveDrop) {
      if (this.target !== other.target)
        return false;
      if (this.piece !== other.piece)
        return false;
      return true;
    }
    return false;
  }
  toString() {
    return `DiamMoveDrop(${this.target}, ${this.piece})`;
  }
};
var DiamMoveShift = class _DiamMoveShift extends DiamMove {
  start;
  moveDirection;
  static encoder = Encoder.tuple([Coord.encoder, Encoder.identity()], (shift) => [shift.start, shift.moveDirection === "clockwise"], (fields) => new _DiamMoveShift(fields[0], fields[1] ? "clockwise" : "counterclockwise"));
  static ofRepresentation(representationStart, moveDirection) {
    return new _DiamMoveShift(new Coord(representationStart.x, 3 - representationStart.y), moveDirection);
  }
  constructor(start, moveDirection) {
    super();
    this.start = start;
    this.moveDirection = moveDirection;
  }
  getTarget() {
    if (this.moveDirection === "clockwise") {
      return (this.start.x + 1) % 8;
    } else {
      return (this.start.x + 7) % 8;
    }
  }
  equals(other) {
    if (other instanceof _DiamMoveShift) {
      if (this.start.equals(other.start) === false)
        return false;
      if (this.moveDirection !== other.moveDirection)
        return false;
      return true;
    } else {
      return false;
    }
  }
  toString() {
    return `DiamMoveShift(${this.start}, ${this.moveDirection})`;
  }
};
var DiamMoveEncoder = Encoder.disjunction([
  (move) => move.isDrop(),
  (move) => move.isShift()
], [DiamMoveDrop.encoder, DiamMoveShift.encoder]);

// games/dist/games/diam/DiamState.js
var DiamState = class _DiamState extends GameStateWithTable {
  remainingPieces;
  static WIDTH = 8;
  static HEIGHT = 4;
  static ofRepresentation(representation, turn) {
    const board = representation.reverse();
    const pieces = [4, 4, 4, 4];
    for (let y = 0; y < _DiamState.HEIGHT; y++) {
      for (let x = 0; x < _DiamState.WIDTH; x++) {
        const piece = board[y][x];
        if (board[y][x] !== DiamPiece.EMPTY) {
          pieces[_DiamState.pieceIndex(piece)]--;
        }
      }
    }
    Utils.assert(pieces.every((remaining) => 0 <= remaining), "Invalid DiamState representation uses too many pieces");
    return new _DiamState(board, pieces, turn);
  }
  static pieceIndex(piece) {
    switch (piece) {
      case DiamPiece.ZERO_FIRST:
        return 0;
      case DiamPiece.ZERO_SECOND:
        return 1;
      case DiamPiece.ONE_FIRST:
        return 2;
      default:
        Utils.expectToBe(piece, DiamPiece.ONE_SECOND);
        return 3;
    }
  }
  constructor(board, remainingPieces, turn) {
    super(board, turn);
    this.remainingPieces = remainingPieces;
  }
  getRemainingPiecesOf(piece) {
    return this.remainingPieces[_DiamState.pieceIndex(piece)];
  }
  getStackHeight(x) {
    let size = 0;
    for (let y = 0; y < _DiamState.HEIGHT; y++) {
      if (this.getPieceAtXY(x, y) === DiamPiece.EMPTY) {
        break;
      }
      size++;
    }
    return size;
  }
};

// games/dist/games/diam/DiamRules.js
var DiamRules = class _DiamRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_DiamRules.singleton.isAbsent()) {
      _DiamRules.singleton = MGPOptional.of(new _DiamRules());
    }
    return _DiamRules.singleton.get();
  }
  getInitialState() {
    const _ = DiamPiece.EMPTY;
    const board = [
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _]
    ];
    return new DiamState(board, [4, 4, 4, 4], 0);
  }
  applyLegalMove(move, state, _config, _info) {
    if (move.isDrop()) {
      return this.applyLegalDrop(move, state);
    } else {
      return this.applyLegalShift(move, state);
    }
  }
  applyLegalDrop(drop, state) {
    const newBoard = TableUtils.copy(state.board);
    newBoard[state.getStackHeight(drop.target)][drop.target] = drop.piece;
    const newRemainingPieces = ArrayUtils.copy(state.remainingPieces);
    newRemainingPieces[DiamState.pieceIndex(drop.piece)] -= 1;
    return new DiamState(newBoard, newRemainingPieces, state.turn + 1);
  }
  applyLegalShift(shift, state) {
    const newBoard = TableUtils.copy(state.board);
    const targetX = shift.getTarget();
    let targetY = state.getStackHeight(targetX);
    let sourceY = shift.start.y;
    while (sourceY < DiamState.HEIGHT && state.getPieceAtXY(shift.start.x, sourceY) !== DiamPiece.EMPTY) {
      newBoard[targetY][targetX] = state.getPieceAtXY(shift.start.x, sourceY);
      newBoard[sourceY][shift.start.x] = DiamPiece.EMPTY;
      targetY++;
      sourceY++;
    }
    return new DiamState(newBoard, state.remainingPieces, state.turn + 1);
  }
  isLegal(move, state) {
    if (move.isDrop()) {
      return this.isDropLegal(move, state);
    } else {
      return this.isShiftLegal(move, state);
    }
  }
  isDropLegal(drop, state) {
    Utils.assert(drop.target < DiamState.WIDTH, "DiamMoveDrop out of board");
    Utils.assert(drop.piece.owner !== PlayerOrNone.NONE, "DiamMoveDrop cannot contain an empty piece");
    if (drop.piece.owner === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    if (state.getRemainingPiecesOf(drop.piece) === 0) {
      return MGPValidation.failure(DiamFailure.NO_MORE_PIECES_OF_THIS_TYPE());
    }
    return this.dropHeightValidity(drop, state);
  }
  dropHeightValidity(drop, state) {
    if (state.getStackHeight(drop.target) === DiamState.HEIGHT) {
      return MGPValidation.failure(DiamFailure.SPACE_IS_FULL());
    }
    return MGPValidation.SUCCESS;
  }
  isShiftLegal(shift, state) {
    const piece = state.getPieceAt(shift.start);
    if (piece.owner.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (piece.owner === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    return this.shiftHeightValidity(shift, state);
  }
  shiftHeightValidity(shift, state) {
    const movedHeight = state.getStackHeight(shift.start.x) - shift.start.y;
    const resultingHeight = state.getStackHeight(shift.getTarget()) + movedHeight;
    if (resultingHeight > DiamState.HEIGHT) {
      return MGPValidation.failure(DiamFailure.TARGET_STACK_TOO_HIGH());
    }
    return MGPValidation.SUCCESS;
  }
  getGameStatus(node) {
    const highestAlignment = this.findHighestAlignment(node.gameState);
    if (highestAlignment.isPresent()) {
      const winningPiece = node.gameState.getPieceAt(highestAlignment.get());
      Utils.assert(winningPiece.owner.isPlayer(), "highest alignment is owned by a player");
      return GameStatus.getVictory(winningPiece.owner);
    } else {
      return GameStatus.ONGOING;
    }
  }
  findHighestAlignment(state) {
    for (let x = 0; x < DiamState.WIDTH / 2; x++) {
      for (let y = DiamState.HEIGHT - 1; y > 0; y--) {
        const pieceHere = state.getPieceAtXY(x, y);
        const pieceThere = state.getPieceAtXY(x + DiamState.WIDTH / 2, y);
        if (pieceHere !== DiamPiece.EMPTY && pieceHere === pieceThere) {
          return MGPOptional.of(new Coord(x, y));
        }
      }
    }
    return MGPOptional.empty();
  }
  pieceCanMove(state, coord) {
    if (this.isShiftLegal(new DiamMoveShift(coord, "clockwise"), state).isSuccess()) {
      return true;
    } else if (this.isShiftLegal(new DiamMoveShift(coord, "counterclockwise"), state).isSuccess()) {
      return true;
    } else {
      return false;
    }
  }
};

// games/dist/games/diam/DiamMoveGenerator.js
var DiamMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const drops = this.getListDrops(state);
    const shifts = this.getListShifts(state);
    return drops.concat(shifts);
  }
  getListShifts(state) {
    const shifts = [];
    const shiftSources = this.getShiftSources(state);
    for (const shiftSource of shiftSources) {
      for (const shift of [new DiamMoveShift(shiftSource, "clockwise"), new DiamMoveShift(shiftSource, "counterclockwise")]) {
        if (DiamRules.get().shiftHeightValidity(shift, state).isSuccess()) {
          shifts.push(shift);
        }
      }
    }
    return shifts;
  }
  getListDrops(state) {
    const remainingPieces = this.getRemainingPiecesForCurrentPlayer(state);
    const drops = [];
    for (let x = 0; x < DiamState.WIDTH; x++) {
      for (const piece of remainingPieces) {
        const drop = new DiamMoveDrop(x, piece);
        if (DiamRules.get().dropHeightValidity(drop, state).isSuccess()) {
          drops.push(drop);
        }
      }
    }
    return drops;
  }
  getRemainingPiecesForCurrentPlayer(state) {
    const pieces = [];
    for (const piece of DiamPiece.PLAYER_PIECES) {
      if (this.currentPlayerCanDropPiece(state, piece)) {
        pieces.push(piece);
      }
    }
    return pieces;
  }
  currentPlayerCanDropPiece(state, piece) {
    return state.getCurrentPlayer() === piece.owner && state.getRemainingPiecesOf(piece) > 0;
  }
  getShiftSources(state) {
    const sources = [];
    const player = state.getCurrentPlayer();
    for (let y = 0; y < DiamState.HEIGHT; y++) {
      for (let x = 0; x < DiamState.WIDTH; x++) {
        if (state.getPieceAtXY(x, y).owner === player) {
          sources.push(new Coord(x, y));
        }
      }
    }
    return sources;
  }
};

// games/dist/games/dvonn/DvonnFailure.js
var DvonnFailure = class {
  static NOT_PLAYER_PIECE = () => $localize`You must select a piece or a stack of your color.`;
  static EMPTY_STACK = () => $localize`You must select a stack.`;
  static TOO_MANY_NEIGHBORS = () => $localize`This stack cannot be moved because all 6 of its neighbors are occupied. You must select a stack with strictly less than 6 neighbors.`;
  static CANT_REACH_TARGET = () => $localize`This stack cannot move because it could never land on another piece.`;
  static INVALID_MOVE_LENGTH = () => $localize`A stack must always be moved by as many spaces as there are pieces in the stack.`;
  static EMPTY_TARGET_STACK = () => $localize`The stack must land on an occupied space.`;
  static MUST_MOVE_IN_STRAIGHT_LINE = () => $localize`A stack must move in a straight line.`;
};

// games/dist/jscaip/HexagonalUtils.js
var HexagonalUtils = class {
  static getNeighbors(coord, distance = 1) {
    const result = [];
    for (const direction of HexaDirection.factory.all) {
      result.push(coord.getNext(direction, distance));
    }
    return result;
  }
  static areNeighbors(first, second) {
    for (const direction of HexaDirection.factory.all) {
      if (first.getNext(direction).equals(second)) {
        return true;
      }
    }
    return false;
  }
  static createBoard(size, empty, full) {
    const height = 2 * size;
    const width = 2 * height;
    const board = TableUtils.create(width, height, empty);
    const minimalAdi = size - size % 2;
    const maximalAdi = minimalAdi + width - 1;
    const minimalDdi = size - height + (size + 1) % 2;
    const maximalDdi = width - size - size % 2;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const adi = x + y;
        const ddi = x - y;
        if (minimalAdi <= adi && adi <= maximalAdi && minimalDdi <= ddi && ddi <= maximalDdi) {
          board[y][x] = full;
        }
      }
    }
    return board;
  }
};

// games/dist/jscaip/HexaLine.js
var HexaLine = class _HexaLine {
  offset;
  constant;
  static fromTwoCoords(coord1, coord2) {
    const x1 = coord1.x;
    const x2 = coord2.x;
    const y1 = coord1.y;
    const y2 = coord2.y;
    const s1 = x1 + y1;
    const s2 = x2 + y2;
    if (x1 === x2 && y1 !== y2 && s1 !== s2)
      return MGPOptional.of(_HexaLine.constantQ(x1));
    if (x1 !== x2 && y1 === y2 && s1 !== s2)
      return MGPOptional.of(_HexaLine.constantR(y1));
    if (x1 !== x2 && y1 !== y2 && s1 === s2)
      return MGPOptional.of(_HexaLine.constantS(s1));
    return MGPOptional.empty();
  }
  static constantQ(offset) {
    return new _HexaLine(offset, "q");
  }
  static constantR(offset) {
    return new _HexaLine(offset, "r");
  }
  static constantS(offset) {
    return new _HexaLine(offset, "s");
  }
  static areOnSameLine(coords) {
    if (coords.length < 2)
      return true;
    const lineOpt = _HexaLine.fromTwoCoords(coords[0], coords[1]);
    if (lineOpt.isAbsent())
      return false;
    const line = lineOpt.get();
    for (const coord of coords.slice(2)) {
      if (line.contains(coord) === false)
        return false;
    }
    return true;
  }
  constructor(offset, constant) {
    this.offset = offset;
    this.constant = constant;
  }
  toString() {
    return `Line(${this.constant}, ${this.offset})`;
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.offset !== other.offset)
      return false;
    if (this.constant !== other.constant)
      return false;
    return true;
  }
  contains(coord) {
    switch (this.constant) {
      case "q":
        return coord.x === this.offset;
      case "r":
        return coord.y === this.offset;
      case "s":
        return coord.x + coord.y === this.offset;
    }
  }
  getDirection() {
    switch (this.constant) {
      case "q":
        return HexaDirection.DOWN;
      case "r":
        return HexaDirection.RIGHT;
      case "s":
        return HexaDirection.DOWN_LEFT;
    }
  }
};

// games/dist/jscaip/state/HexagonalGameState.js
var HexagonalGameState = class extends GameStateWithTable {
  width;
  height;
  excludedSpaces;
  empty;
  constructor(turn, board, width, height, excludedSpaces, empty) {
    super(board, turn);
    this.width = width;
    this.height = height;
    this.excludedSpaces = excludedSpaces;
    this.empty = empty;
    Utils.assert(this.excludedSpaces.length < this.height / 2 + 1, "Invalid excluded spaces specification for HexagonalGameState.");
  }
  setAt(coord, v) {
    if (this.isOnBoard(coord)) {
      return this.setAtUnsafe(coord, v);
    } else {
      throw new Error("Setting coord not on board: " + coord + ".");
    }
  }
  equalsT(other, equal) {
    if (this === other) {
      return true;
    }
    if (this.width !== other.width) {
      return false;
    }
    if (this.height !== other.height) {
      return false;
    }
    if (equal(this.empty, other.empty) === false) {
      return false;
    }
    if (this.excludedSpaces.length !== other.excludedSpaces.length) {
      return false;
    }
    for (let i = 0; i < this.excludedSpaces.length; i++) {
      if (this.excludedSpaces[i] !== other.excludedSpaces[i]) {
        return false;
      }
    }
    return this.findMatchingCoord((coord, content) => {
      return equal(content, other.getPieceAt(coord)) === false;
    }).isAbsent();
  }
  allLines() {
    const lines = [];
    for (let i = 0; i < this.width; i++) {
      lines.push(HexaLine.constantQ(i));
    }
    for (let i = 0; i < this.height; i++) {
      lines.push(HexaLine.constantR(i));
    }
    for (let i = this.excludedSpaces.length; i < this.height + this.excludedSpaces.length; i++) {
      lines.push(HexaLine.constantS(i));
    }
    return lines;
  }
  getEntranceOnLine(line) {
    let x;
    let y;
    switch (line.constant) {
      case "q":
        if (this.excludedSpaces[line.offset] != null) {
          y = this.excludedSpaces[line.offset];
        } else {
          y = 0;
        }
        return this.findEntranceFrom(line, new Coord(line.offset, y));
      case "r":
        if (this.excludedSpaces[line.offset] != null) {
          x = this.excludedSpaces[line.offset];
        } else {
          x = 0;
        }
        return this.findEntranceFrom(line, new Coord(x, line.offset));
      case "s":
        if (line.offset < this.width) {
          return this.findEntranceFrom(line, new Coord(line.offset, 0));
        } else {
          return this.findEntranceFrom(line, new Coord(this.width - 1, line.offset - this.width + 1));
        }
    }
  }
  findEntranceFrom(line, start) {
    const dir = line.getDirection();
    let coord = start;
    for (let i = 0; i < Math.max(this.width, this.height); i++) {
      if (this.isOnBoard(coord)) {
        return coord;
      }
      coord = coord.getNext(dir);
    }
    const failure = Utils.logError("HexagonalGameState.findEntranceFrom", "could not find a board entrance, board must be invalid", { start: start.toString(), line: line.toString() });
    throw new Error(failure.getReason());
  }
};

// games/dist/games/dvonn/DvonnPieceStack.js
var DvonnPieceStack = class _DvonnPieceStack {
  owner;
  size;
  source;
  static encoder = Encoder.tuple([Encoder.identity(), Player.encoder, Encoder.identity()], (stack) => [stack.source, stack.owner, stack.size], (fields) => {
    return new _DvonnPieceStack(fields[1], fields[2], fields[0]);
  });
  static MAX_SIZE = 49;
  // The maximal possible size for a stack
  static EMPTY = new _DvonnPieceStack(PlayerOrNone.NONE, 0, false);
  static UNREACHABLE = new _DvonnPieceStack(PlayerOrNone.NONE, -1, false);
  static PLAYER_ZERO = new _DvonnPieceStack(Player.ZERO, 1, false);
  static PLAYER_ONE = new _DvonnPieceStack(Player.ONE, 1, false);
  static SOURCE = new _DvonnPieceStack(PlayerOrNone.NONE, 1, true);
  static append(stack1, stack2) {
    return new _DvonnPieceStack(stack1.owner, stack1.size + stack2.size, stack1.source || stack2.source);
  }
  constructor(owner, size, source) {
    this.owner = owner;
    this.size = size;
    this.source = source;
  }
  getOwner() {
    return this.owner;
  }
  belongsTo(player) {
    return this.owner === player;
  }
  containsSource() {
    return this.source;
  }
  isEmpty() {
    return this.size === 0;
  }
  hasPieces() {
    return this.isEmpty() === false;
  }
  getSize() {
    return this.size;
  }
  toString() {
    return "DvonnPieceStack(" + this.owner.toString() + ", " + this.size + ", " + this.source + ")";
  }
  equals(other) {
    return this.owner === other.owner && this.size === other.size && this.source === other.source;
  }
};

// games/dist/games/dvonn/DvonnState.js
var DvonnState = class _DvonnState extends HexagonalGameState {
  alreadyPassed;
  static WIDTH = 11;
  static HEIGHT = 5;
  static EXCLUDED_SPACES = [2, 1];
  /* Returns the following board:
   *     W B B B W W B D B
   *    B B W W W B B W B B
   *   B B B B W D B W W W W
   *    W W B W W B B B W W
   *     W D W B B W W W B
   */
  static balancedBoard() {
    const _ = DvonnPieceStack.UNREACHABLE;
    const O = DvonnPieceStack.PLAYER_ZERO;
    const X = DvonnPieceStack.PLAYER_ONE;
    const S = DvonnPieceStack.SOURCE;
    return [
      [_, _, O, X, X, X, O, O, X, S, X],
      [_, X, X, O, O, O, X, X, O, X, X],
      [X, X, X, X, O, S, X, O, O, O, O],
      [O, O, X, O, O, X, X, X, O, O, _],
      [O, S, O, X, X, O, O, O, X, _, _]
    ];
  }
  static isOnBoard(coord) {
    if (coord.isNotInRange(_DvonnState.WIDTH, _DvonnState.HEIGHT)) {
      return false;
    }
    return _DvonnState.balancedBoard()[coord.y][coord.x] !== DvonnPieceStack.UNREACHABLE;
  }
  static isNotOnBoard(coord) {
    return _DvonnState.isOnBoard(coord) === false;
  }
  constructor(board, turn, alreadyPassed) {
    super(turn, board, _DvonnState.WIDTH, _DvonnState.HEIGHT, _DvonnState.EXCLUDED_SPACES, DvonnPieceStack.EMPTY);
    this.alreadyPassed = alreadyPassed;
  }
  getAllPieces() {
    const pieces = [];
    for (let y = 0; y < _DvonnState.HEIGHT; y++) {
      for (let x = 0; x < _DvonnState.WIDTH; x++) {
        const coord = new Coord(x, y);
        if (this.coordHasPieces(coord)) {
          pieces.push(coord);
        }
      }
    }
    return pieces;
  }
  numberOfNeighbors(coord) {
    const neighbors = HexagonalUtils.getNeighbors(coord, 1);
    const occupiedNeighbors = neighbors.filter((c) => this.coordHasPieces(c));
    return occupiedNeighbors.length;
  }
  setAtUnsafe(coord, value) {
    const newBoard = TableUtils.copy(this.board);
    newBoard[coord.y][coord.x] = value;
    return new _DvonnState(newBoard, this.turn, this.alreadyPassed);
  }
  isOnBoard(coord) {
    if (coord.isNotInRange(this.width, this.height)) {
      return false;
    } else {
      return this.getUnsafe(coord) !== DvonnPieceStack.UNREACHABLE;
    }
  }
  coordHasPieces(coord) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().hasPieces();
    } else {
      return false;
    }
  }
};

// games/dist/games/dvonn/DvonnMove.js
var DvonnMove = class _DvonnMove extends MoveCoordToCoord {
  static PASS = new _DvonnMove(new Coord(-1, -1), new Coord(-2, -2));
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_DvonnMove.from);
  constructor(start, end) {
    super(start, end);
  }
  static from(start, end) {
    if (start.x === -1 && start.y === -1 && end.x === -2 && end.y === -2) {
      return MGPFallible.success(_DvonnMove.PASS);
    }
    if (DvonnState.isNotOnBoard(start)) {
      return MGPFallible.failure("Starting coord of DvonnMove must be on the board, not at " + start.toString());
    }
    if (DvonnState.isNotOnBoard(end)) {
      return MGPFallible.failure("End coord of DvonnMove must be on the board, not at " + start.toString());
    }
    if (start.y === end.y) {
      return MGPFallible.success(new _DvonnMove(start, end));
    } else if (start.x === end.x) {
      return MGPFallible.success(new _DvonnMove(start, end));
    } else if (start.x + start.y === end.x + end.y) {
      return MGPFallible.success(new _DvonnMove(start, end));
    } else {
      return MGPFallible.failure(DvonnFailure.MUST_MOVE_IN_STRAIGHT_LINE());
    }
  }
  toString() {
    if (this === _DvonnMove.PASS) {
      return "DvonnMove.PASS";
    }
    return "DvonnMove(" + this.getStart() + "->" + this.getEnd() + ")";
  }
  getDistance() {
    if (this.getStart().y === this.getEnd().y) {
      return Math.abs(this.getStart().x - this.getEnd().x);
    } else if (this.getStart().x === this.getEnd().x) {
      return Math.abs(this.getStart().y - this.getEnd().y);
    } else {
      return Math.abs(this.getStart().y - this.getEnd().y);
    }
  }
};

// games/dist/games/dvonn/DvonnRules.js
var DvonnRules = class _DvonnRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_DvonnRules.singleton.isAbsent()) {
      _DvonnRules.singleton = MGPOptional.of(new _DvonnRules());
    }
    return _DvonnRules.singleton.get();
  }
  getInitialState() {
    return new DvonnState(DvonnState.balancedBoard(), 0, false);
  }
  static getGameStatus(node) {
    const state = node.gameState;
    const scores = _DvonnRules.getScores(state);
    if (_DvonnRules.getMovablePieces(state).length === 0) {
      const scoresZero = scores.get(Player.ZERO);
      const scoresOne = scores.get(Player.ONE);
      if (scoresZero > scoresOne) {
        return GameStatus.ZERO_WON;
      } else if (scoresZero < scoresOne) {
        return GameStatus.ONE_WON;
      } else {
        return GameStatus.DRAW;
      }
    } else {
      return GameStatus.ONGOING;
    }
  }
  static getMovablePieces(state) {
    return _DvonnRules.getFreePieces(state).filter((c) => _DvonnRules.pieceHasTarget(state, c));
  }
  static getFreePieces(state) {
    return state.getAllPieces().filter((c) => state.getPieceAt(c).belongsTo(state.getCurrentPlayer()) && state.numberOfNeighbors(c) < 6);
  }
  static pieceHasTarget(state, coord) {
    const stackSize = state.getPieceAt(coord).getSize();
    const possibleTargets = HexagonalUtils.getNeighbors(coord, stackSize);
    return possibleTargets.find((c) => state.coordHasPieces(c)) !== void 0;
  }
  static pieceTargets(state, coord) {
    const stackSize = state.getPieceAt(coord).getSize();
    const possibleTargets = HexagonalUtils.getNeighbors(coord, stackSize);
    return possibleTargets.filter((c) => state.coordHasPieces(c));
  }
  static getScores(state) {
    let p0Score = 0;
    let p1Score = 0;
    state.getAllPieces().map((c) => {
      const stack = state.getPieceAt(c);
      if (stack.belongsTo(Player.ZERO)) {
        p0Score += stack.getSize();
      } else if (stack.belongsTo(Player.ONE)) {
        p1Score += stack.getSize();
      }
    });
    return PlayerNumberMap.of(p0Score, p1Score);
  }
  isMovablePiece(state, coord) {
    Utils.assert(state.isOnBoard(coord), "piece is not on the board");
    const stack = state.getPieceAt(coord);
    if (stack.getSize() < 1) {
      return MGPValidation.failure(DvonnFailure.EMPTY_STACK());
    }
    if (stack.belongsTo(state.getCurrentPlayer()) === false) {
      return MGPValidation.failure(DvonnFailure.NOT_PLAYER_PIECE());
    }
    if (6 <= state.numberOfNeighbors(coord)) {
      return MGPValidation.failure(DvonnFailure.TOO_MANY_NEIGHBORS());
    }
    if (_DvonnRules.pieceHasTarget(state, coord) === false) {
      return MGPValidation.failure(DvonnFailure.CANT_REACH_TARGET());
    }
    return MGPValidation.SUCCESS;
  }
  canOnlyPass(state) {
    return _DvonnRules.getMovablePieces(state).length === 0;
  }
  sourceCoords(state) {
    return state.getAllPieces().filter((c) => state.getPieceAt(c).containsSource());
  }
  markPiecesConnectedTo(state, coord, markBoard) {
    HexagonalUtils.getNeighbors(coord, 1).forEach((c) => {
      if (state.coordHasPieces(c) && markBoard[c.y][c.x] === false) {
        markBoard[c.y][c.x] = true;
        this.markPiecesConnectedTo(state, c, markBoard);
      }
    });
  }
  removeDisconnectedPieces(state) {
    const markBoard = TableUtils.create(DvonnState.WIDTH, DvonnState.HEIGHT, false);
    this.sourceCoords(state).forEach((c) => {
      markBoard[c.y][c.x] = true;
      this.markPiecesConnectedTo(state, c, markBoard);
    });
    let newState = state;
    newState.getAllPieces().forEach((c) => {
      if (markBoard[c.y][c.x] === false) {
        newState = newState.setAt(c, DvonnPieceStack.EMPTY);
      }
    });
    return newState;
  }
  applyLegalMove(move, state, _config, _info) {
    if (move === DvonnMove.PASS) {
      return new DvonnState(state.board, state.turn + 1, true);
    } else {
      const stack = state.getPieceAt(move.getStart());
      const targetStack = state.getPieceAt(move.getEnd());
      const newState = state.setAt(move.getStart(), DvonnPieceStack.EMPTY).setAt(move.getEnd(), DvonnPieceStack.append(stack, targetStack));
      const resultingState = this.removeDisconnectedPieces(new DvonnState(newState.board, state.turn + 1, false));
      return resultingState;
    }
  }
  isLegal(move, state, _config) {
    if (_DvonnRules.getMovablePieces(state).length === 0) {
      if (move === DvonnMove.PASS && state.alreadyPassed === false) {
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(RulesFailure.MUST_PASS());
      }
    } else if (move === DvonnMove.PASS) {
      return MGPValidation.failure(RulesFailure.CANNOT_PASS());
    }
    const pieceMovable = this.isMovablePiece(state, move.getStart());
    if (pieceMovable.isFailure()) {
      return pieceMovable;
    }
    const stack = state.getPieceAt(move.getStart());
    if (move.getDistance() !== stack.getSize()) {
      return MGPFallible.failure(DvonnFailure.INVALID_MOVE_LENGTH());
    }
    const targetStack = state.getPieceAt(move.getEnd());
    if (targetStack.isEmpty()) {
      return MGPFallible.failure(DvonnFailure.EMPTY_TARGET_STACK());
    }
    return MGPFallible.success(void 0);
  }
  getGameStatus(node) {
    return _DvonnRules.getGameStatus(node);
  }
};

// games/dist/games/dvonn/DvonnMaxStacksHeuristic.js
var DvonnMaxStacksHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const scores = DvonnRules.getScores(state);
    const metrics = new PlayerNumberTable();
    const pieces = state.getAllPieces();
    const numberOfStacks = pieces.length;
    for (const player of Player.PLAYERS) {
      const playerStacks = pieces.filter((c) => state.getPieceAt(c).belongsTo(player)).length;
      const oldScore = scores.get(player);
      metrics.set(player, [oldScore * playerStacks / numberOfStacks]);
    }
    return metrics;
  }
};

// games/dist/games/dvonn/DvonnMoveGenerator.js
var DvonnMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const lastMove = node.previousMove;
    const state = node.gameState;
    const moves = [];
    DvonnRules.getMovablePieces(state).forEach((start) => {
      return DvonnRules.pieceTargets(state, start).forEach((end) => {
        const move = DvonnMove.from(start, end).get();
        moves.push(move);
      });
    });
    if (moves.length === 0 && lastMove.equalsValue(DvonnMove.PASS) === false) {
      moves.push(DvonnMove.PASS);
    }
    return moves;
  }
};

// games/dist/games/dvonn/DvonnScoreHeuristic.js
var DvonnScoreHeuristic = class extends PlayerMetricHeuristicWithBounds {
  getMetrics(node, _config) {
    return DvonnRules.getScores(node.gameState).toTable();
  }
  // Min/max value: all pieces are controlled by one. There are 49 pieces
  getBounds(_config) {
    const numberOfPieces = 49;
    return {
      player0Best: BoardValue.ofSingle(numberOfPieces, 0),
      player1Best: BoardValue.ofSingle(0, numberOfPieces)
    };
  }
};

// games/dist/games/encapsule/EncapsuleFailure.js
var EncapsuleFailure = class {
  static PIECE_OUT_OF_STOCK = () => $localize`You do not have pieces of this type anymore.`;
  static INVALID_PLACEMENT = () => $localize`You must put your piece on an empty square or on a smaller piece.`;
  static NOT_DROPPABLE = () => $localize`You must pick your piece among the remaining ones.`;
  static INVALID_PIECE_SELECTED = () => $localize`You must pick one of your remaining pieces or one piece on the board that is the biggest of its square.`;
  static END_YOUR_MOVE = () => $localize`You are performing a move, you must select a landing square.`;
};

// games/dist/games/encapsule/EncapsulePiece.js
var EncapsulePiece = class _EncapsulePiece {
  size;
  owner;
  static encoder = Encoder.tuple([Encoder.identity(), Player.encoder], (piece) => [piece.size, piece.owner], (value) => _EncapsulePiece.ofSizeAndPlayer(value[0], value[1]));
  static NONE = new _EncapsulePiece(0, PlayerOrNone.NONE);
  static ofSizeAndPlayer(size, player) {
    if (player.isNone() || size === 0) {
      return _EncapsulePiece.NONE;
    } else {
      return new _EncapsulePiece(size, player);
    }
  }
  constructor(size, owner) {
    this.size = size;
    this.owner = owner;
  }
  getPlayer() {
    return this.owner;
  }
  getSize() {
    return this.size;
  }
  belongsTo(player) {
    return this.getPlayer() === player;
  }
  equals(other) {
    return this.size === other.size && this.owner.equals(other.owner);
  }
  toString() {
    return "size-" + this.size + "-" + this.getPlayer().toString();
  }
};

// games/dist/games/encapsule/EncapsuleMove.js
var EncapsuleMove = class _EncapsuleMove extends Move {
  startingCoord;
  landingCoord;
  piece;
  static encoder = Encoder.tuple([MGPOptional.getEncoder(Coord.encoder), Coord.encoder, MGPOptional.getEncoder(EncapsulePiece.encoder)], (move) => [move.startingCoord, move.landingCoord, move.piece], (fields) => new _EncapsuleMove(fields[0], fields[1], fields[2]));
  constructor(startingCoord, landingCoord, piece) {
    super();
    this.startingCoord = startingCoord;
    this.landingCoord = landingCoord;
    this.piece = piece;
  }
  static ofMove(startingCoord, landingCoord) {
    Utils.assert(startingCoord.equals(landingCoord) === false, "Starting coord and landing coord must be separate coords");
    return new _EncapsuleMove(MGPOptional.of(startingCoord), landingCoord, MGPOptional.empty());
  }
  static ofDrop(piece, landingCoord) {
    return new _EncapsuleMove(MGPOptional.empty(), landingCoord, MGPOptional.of(piece));
  }
  isDropping() {
    return this.startingCoord.isAbsent();
  }
  equals(other) {
    if (this === other)
      return true;
    if (other.landingCoord.equals(this.landingCoord) === false)
      return false;
    if (this.startingCoord.equals(other.startingCoord) === false)
      return false;
    return this.piece.equals(other.piece);
  }
  toString() {
    if (this.isDropping()) {
      return "EncapsuleMove(" + this.piece.get().toString() + " -> " + this.landingCoord + ")";
    } else {
      return "EncapsuleMove(" + this.startingCoord.get() + "->" + this.landingCoord + ")";
    }
  }
};

// games/dist/games/encapsule/EncapsuleState.js
var EncapsuleSizeToNumberMap = class extends NumberMap {
};
var EncapsuleState = class extends GameStateWithTable {
  remainingPieces;
  nbOfPieceSize;
  constructor(board, turn, remainingPieces, nbOfPieceSize) {
    super(board, turn);
    this.remainingPieces = remainingPieces;
    this.nbOfPieceSize = nbOfPieceSize;
    this.remainingPieces.get(Player.ZERO).makeImmutable();
    this.remainingPieces.get(Player.ONE).makeImmutable();
    this.remainingPieces.makeImmutable();
  }
  getRemainingPiecesCopy() {
    const playerZeroValue = this.remainingPieces.get(Player.ZERO).getCopy();
    const playerOneValue = this.remainingPieces.get(Player.ONE).getCopy();
    playerZeroValue.makeImmutable();
    playerOneValue.makeImmutable();
    return PlayerMap.ofValues(playerZeroValue, playerOneValue);
  }
  getRemainingPiecesOfPlayer(player) {
    return this.getRemainingPiecesCopy().get(player);
  }
  pieceBelongsToCurrentPlayer(piece) {
    return piece.belongsTo(this.getCurrentPlayer());
  }
  isDroppable(piece) {
    return this.pieceBelongsToCurrentPlayer(piece) && this.isInRemainingPieces(piece);
  }
  isInRemainingPieces(piece) {
    const playerPieces = this.remainingPieces.get(piece.getPlayer());
    const numberOfPieces = playerPieces.get(piece.getSize()).getOrElse(0);
    return numberOfPieces > 0;
  }
};
var EncapsuleSpace = class _EncapsuleSpace {
  pieces;
  static EMPTY = new _EncapsuleSpace(new MGPMap());
  constructor(pieces) {
    this.pieces = pieces;
    this.pieces.makeImmutable();
  }
  getOccupiedCircles() {
    return this.pieces.filter(this.isEmptyKeyValue);
  }
  isEmpty() {
    const occupiedCircles = this.getOccupiedCircles();
    return occupiedCircles.size() === 0;
  }
  isEmptyKeyValue(_, value) {
    return value.isPlayer();
  }
  toList() {
    const pieces = [];
    for (const size of this.pieces.getKeyList()) {
      const player = this.pieces.get(size).get();
      if (player.isPlayer()) {
        const newPiece = EncapsulePiece.ofSizeAndPlayer(size, player);
        pieces.push(newPiece);
      }
    }
    return pieces;
  }
  getBiggest() {
    const occupiedCircles = this.getOccupiedCircles();
    const occupiedSizes = occupiedCircles.getKeyList();
    const sortedSizes = ArrayUtils.maximumsBy(occupiedSizes, (value) => value);
    if (sortedSizes.length === 0) {
      return EncapsulePiece.NONE;
    } else {
      const biggestSize = sortedSizes[0];
      const biggestPlayer = this.pieces.get(biggestSize).get();
      return EncapsulePiece.ofSizeAndPlayer(biggestSize, biggestPlayer);
    }
  }
  tryToSuperposePiece(piece) {
    const biggestPresent = this.getBiggest().getSize();
    if (piece === EncapsulePiece.NONE) {
      throw new Error("Cannot move EMPTY on a space");
    }
    if (piece.getSize() > biggestPresent) {
      return MGPOptional.of(this.put(piece));
    } else {
      return MGPOptional.empty();
    }
  }
  removeBiggest() {
    const removedPiece = this.getBiggest();
    if (removedPiece === EncapsulePiece.NONE) {
      throw new Error("Cannot remove piece from empty space");
    }
    const size = removedPiece.getSize();
    const removedPieces = this.pieces.getCopy();
    removedPieces.delete(size);
    removedPieces.makeImmutable();
    const removedSpace = new _EncapsuleSpace(removedPieces);
    return { removedSpace, removedPiece };
  }
  put(piece) {
    if (piece === EncapsulePiece.NONE)
      throw new Error("Cannot put NONE on space");
    const biggest = this.getBiggest();
    Utils.assert(biggest.size < piece.size, "Cannot put a piece on top of a bigger one");
    const addedPieces = this.pieces.getCopy();
    addedPieces.put(piece.getSize(), piece.getPlayer());
    addedPieces.makeImmutable();
    return new _EncapsuleSpace(addedPieces);
  }
  belongsTo(player) {
    return this.getBiggest().getPlayer() === player;
  }
};

// games/dist/games/encapsule/EncapsuleRules.js
var __decorate4 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EncapsuleRules_1;
var EncapsuleRules = class EncapsuleRules2 extends ConfigurableRules {
  static {
    EncapsuleRules_1 = this;
  }
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Encapsule`,
    config: {
      nInARow: new NumberConfig(3, RulesConfigDescriptionLocalizable.ALIGNMENT_SIZE, MGPValidators.range(1, 99)),
      width: new NumberConfig(3, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(3, 99)),
      height: new NumberConfig(3, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(3, 99)),
      nbOfSizes: new NumberConfig(3, () => $localize`Number of different piece sizes`, MGPValidators.range(1, 8)),
      nbOfEachPiece: new NumberConfig(2, () => $localize`Number of pieces for each size`, MGPValidators.range(1, 9))
    }
  });
  static get() {
    if (EncapsuleRules_1.singleton.isAbsent()) {
      EncapsuleRules_1.singleton = MGPOptional.of(new EncapsuleRules_1());
    }
    return EncapsuleRules_1.singleton.get();
  }
  getInitialState(config) {
    const _ = new EncapsuleSpace(new MGPMap());
    const startingBoard = TableUtils.create(config.width, config.height, _);
    const initialPieces = this.getInitialEncapsulePieceMap(config);
    return new EncapsuleState(startingBoard, 0, initialPieces, config.nbOfSizes);
  }
  getRulesConfigDescription() {
    return EncapsuleRules_1.RULES_CONFIG_DESCRIPTION;
  }
  getInitialEncapsulePieceMap(config) {
    const playerZeroPiecesNumber = ArrayUtils.create(config.nbOfSizes, config.nbOfEachPiece);
    const playerOnePiecesNumber = ArrayUtils.create(config.nbOfSizes, config.nbOfEachPiece);
    return this.getEncapsulePieceMapFrom(playerZeroPiecesNumber, playerOnePiecesNumber);
  }
  getEncapsulePieceMapFrom(playerZeroPiecesNumber, playerOnePiecesNumber) {
    const playerZero = this.getSizeToNumberMap(playerZeroPiecesNumber);
    const playerOne = this.getSizeToNumberMap(playerOnePiecesNumber);
    return PlayerMap.ofValues(playerZero, playerOne);
  }
  getSizeToNumberMap(nbOfEachPieces) {
    const map = new EncapsuleSizeToNumberMap();
    for (let i = 0; i < nbOfEachPieces.length; i++) {
      const size = i + 1;
      const nbOfEachPiece = nbOfEachPieces[i];
      map.set(size, nbOfEachPiece);
    }
    return map;
  }
  getVictoriousCoords(state, config) {
    const helper = new NInARowHelper((piece) => piece.getBiggest().getPlayer(), config.nInARow);
    return helper.getVictoriousCoord(state);
  }
  isVictory(state, config) {
    const victoriousCoords = this.getVictoriousCoords(state, config);
    if (victoriousCoords.length > 0) {
      const coord = victoriousCoords[0];
      return MGPOptional.of(state.getPieceAt(coord).getBiggest().getPlayer());
    } else {
      return MGPOptional.empty();
    }
  }
  isLegal(move, state) {
    let movingPiece;
    if (move.isDropping()) {
      movingPiece = move.piece.get();
      const owner = movingPiece.getPlayer();
      if (owner.isNone()) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
      }
      if (owner === state.getCurrentOpponent()) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
      }
      if (state.isInRemainingPieces(movingPiece) === false) {
        return MGPFallible.failure(EncapsuleFailure.PIECE_OUT_OF_STOCK());
      }
    } else {
      const startingCoord = move.startingCoord.get();
      const startingSpace = state.getPieceAt(startingCoord);
      movingPiece = startingSpace.getBiggest();
      const owner = movingPiece.getPlayer();
      if (owner.isNone()) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
      }
      if (owner === state.getCurrentOpponent()) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
      }
    }
    const landingSpace = state.getPieceAt(move.landingCoord);
    const superpositionResult = landingSpace.tryToSuperposePiece(movingPiece);
    if (superpositionResult.isPresent()) {
      return MGPFallible.success(superpositionResult.get());
    }
    return MGPFallible.failure(EncapsuleFailure.INVALID_PLACEMENT());
  }
  applyLegalMove(move, state, _config, newLandingSpace) {
    const newBoard = state.getCopiedBoard();
    const currentPlayer = state.getCurrentPlayer();
    const newRemainingPiecesMap = state.getRemainingPiecesCopy();
    const newRemainingPiece = newRemainingPiecesMap.get(currentPlayer).getCopy();
    const newTurn = state.turn + 1;
    newBoard[move.landingCoord.y][move.landingCoord.x] = newLandingSpace;
    let movingPiece;
    if (move.isDropping()) {
      movingPiece = move.piece.get();
      newRemainingPiece.add(movingPiece.size, -1);
      newRemainingPiecesMap.put(currentPlayer, newRemainingPiece);
    } else {
      const startingCoord = move.startingCoord.get();
      const oldStartingSpace = newBoard[startingCoord.y][startingCoord.x];
      const removalResult = oldStartingSpace.removeBiggest();
      newBoard[startingCoord.y][startingCoord.x] = removalResult.removedSpace;
      movingPiece = removalResult.removedPiece;
    }
    return new EncapsuleState(newBoard, newTurn, newRemainingPiecesMap, state.nbOfPieceSize);
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const winner = this.isVictory(state, config);
    if (winner.isPresent()) {
      return GameStatus.getVictory(winner.get());
    } else {
      return GameStatus.ONGOING;
    }
  }
};
EncapsuleRules = EncapsuleRules_1 = __decorate4([
  Debug.log
], EncapsuleRules);

// games/dist/games/encapsule/EncapsuleMoveGenerator.js
var EncapsuleMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const moves = [];
    const state = node.gameState;
    const currentPlayer = state.getCurrentPlayer();
    const puttablePieces = state.getRemainingPiecesOfPlayer(currentPlayer).getKeyList();
    const width = state.getWidth();
    const height = state.getHeight();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      for (const pieceSize of puttablePieces) {
        const piece = EncapsulePiece.ofSizeAndPlayer(pieceSize, currentPlayer);
        const move = EncapsuleMove.ofDrop(piece, coord);
        const status = EncapsuleRules.get().isLegal(move, state);
        if (status.isSuccess()) {
          moves.push(move);
        }
      }
      if (coordAndContent.content.belongsTo(currentPlayer)) {
        for (let ly = 0; ly < height; ly++) {
          for (let lx = 0; lx < width; lx++) {
            const landingCoord = new Coord(lx, ly);
            if (landingCoord.equals(coord) === false) {
              const newMove = EncapsuleMove.ofMove(coord, landingCoord);
              const status = EncapsuleRules.get().isLegal(newMove, state);
              if (status.isSuccess()) {
                moves.push(newMove);
              }
            }
          }
        }
      }
    }
    return moves;
  }
};

// games/dist/games/epaminondas/EpaminondasHeuristic.js
var EpaminondasHeuristic = class extends Heuristic {
};

// games/dist/games/epaminondas/EpaminondasAttackHeuristic.js
var EpaminondasAttackHeuristic = class extends EpaminondasHeuristic {
  DOMINANCE_FACTOR = 20;
  DEFENSE_FACTOR = 5;
  TERRITORY_FACTOR = 2;
  OFFENSE_FACTOR = 10;
  CENTER_FACTOR = 5;
  MOBILITY_FACTOR = 0.12;
  getBoardValue(node, _config) {
    const state = node.gameState;
    const dominance = this.getDominance(state);
    const defense = this.getDefense(state);
    const territory = this.getTerritory(state);
    const center = this.getCenter(state);
    const winning = this.getOffense(state);
    const mobility = this.getMobility(state);
    return BoardValue.of(dominance + defense + territory + center + winning + mobility);
  }
  getDominance(state) {
    let score = 0;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      score += coordAndContent.content.getScoreModifier();
    }
    return score * this.DOMINANCE_FACTOR;
  }
  getDefense(state) {
    let score = 0;
    const width = state.getWidth();
    const height = state.getHeight();
    for (let x = 0; x < width; x++) {
      if (state.getPieceAtXY(x, height - 1) === Player.ZERO) {
        score += Player.ZERO.getScoreModifier();
      }
      if (state.getPieceAtXY(x, 0) === Player.ONE) {
        score += Player.ONE.getScoreModifier();
      }
    }
    return score * this.DEFENSE_FACTOR;
  }
  getTerritory(state) {
    let score = 0;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const owner = coordAndContent.content;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const coord = coordAndContent.coord.getNext(new Coord(dx, dy), 1);
          if (state.hasPieceAt(coord, owner)) {
            score += 1 * owner.getScoreModifier();
          } else if (state.hasPieceAt(coord, PlayerOrNone.NONE)) {
            score += 1 * owner.getScoreModifier();
          }
        }
      }
      score -= owner.getScoreModifier();
    }
    return score * this.TERRITORY_FACTOR;
  }
  getOffense(state) {
    let score = 0;
    const width = state.getWidth();
    const height = state.getHeight();
    for (let x = 0; x < width; x++) {
      if (state.getPieceAtXY(x, 0) === Player.ZERO) {
        score += Player.ZERO.getScoreModifier();
      }
      if (state.getPieceAtXY(x, height - 1) === Player.ONE) {
        score += Player.ONE.getScoreModifier();
      }
    }
    return score * this.OFFENSE_FACTOR;
  }
  getCenter(state) {
    let score = 0;
    const width = state.getWidth();
    const cx = (width - 1) / 2;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const owner = coordAndContent.content;
      score += owner.getScoreModifier() * Math.abs(coordAndContent.coord.x - cx);
    }
    return score * this.CENTER_FACTOR;
  }
  getMobility(state) {
    let score = 0;
    let biggestZero = 0;
    let biggestOne = 0;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const firstCoord = coordAndContent.coord;
      const owner = coordAndContent.content;
      for (const direction of Ordinal.ORDINALS) {
        let phalanxSize = 1;
        let nextCoord = firstCoord.getNext(direction, 1);
        while (state.hasPieceAt(nextCoord, owner)) {
          phalanxSize += 1;
          nextCoord = nextCoord.getNext(direction, 1);
        }
        let stepSize = 1;
        while (stepSize <= phalanxSize && state.hasPieceAt(nextCoord, PlayerOrNone.NONE)) {
          stepSize++;
          nextCoord = nextCoord.getNext(direction, 1);
        }
        score += stepSize * stepSize * owner.getScoreModifier();
        if (owner === Player.ZERO) {
          biggestZero = Math.max(biggestZero, stepSize);
        } else if (owner === Player.ONE) {
          biggestOne = Math.max(biggestOne, stepSize);
        }
      }
    }
    return (score + biggestZero * Player.ZERO.getScoreModifier() + biggestOne * Player.ONE.getScoreModifier()) * this.MOBILITY_FACTOR;
  }
};

// games/dist/games/epaminondas/EpaminondasFailure.js
var EpaminondasFailure = class {
  static PHALANX_IS_LEAVING_BOARD = () => $localize`The move distance of your phalanx puts it out of the board.`;
  static SOMETHING_IN_PHALANX_WAY = () => $localize`There is something in the way of your phalanx.`;
  static PHALANX_SHOULD_BE_GREATER_TO_CAPTURE = () => $localize`Your phalanx must be bigger than the one you are capturing.`;
  static PHALANX_CANNOT_JUMP_FURTHER_THAN_ITS_SIZE = (s, p) => $localize`You took a phalanx of size ${p} and moved it ${s} steps. Phalanx cannot move further than their sizes.`;
  static SQUARE_NOT_ALIGNED_WITH_PHALANX = () => $localize`This square is not aligned with the direction of the phalanx.`;
  static PHALANX_CANNOT_CONTAIN_PIECES_OUTSIDE_BOARD = () => $localize`A phalanx can't contain pieces outside of the board.`;
  static PHALANX_CANNOT_CONTAIN_EMPTY_SQUARE = () => $localize`A phalanx cannot contain an empty square.`;
  static PHALANX_CANNOT_CONTAIN_OPPONENT_PIECE = () => $localize`A phalanx cannot contain a piece of the opponent.`;
};

// games/dist/games/epaminondas/EpaminondasMove.js
var EpaminondasMove = class _EpaminondasMove extends MoveCoord {
  phalanxSize;
  stepSize;
  direction;
  static encoder = Encoder.tuple([Coord.encoder, Encoder.identity(), Encoder.identity(), Ordinal.encoder], (m) => [m.coord, m.phalanxSize, m.stepSize, m.direction], (fields) => new _EpaminondasMove(fields[0].x, fields[0].y, fields[1], fields[2], fields[3]));
  constructor(x, y, phalanxSize, stepSize, direction) {
    super(x, y);
    this.phalanxSize = phalanxSize;
    this.stepSize = stepSize;
    this.direction = direction;
    Utils.assert(phalanxSize > 0, "Must select minimum one piece (got " + phalanxSize + ").");
    Utils.assert(stepSize > 0, "Step size must be minimum one (got " + stepSize + ").");
    Utils.assert(stepSize <= phalanxSize, EpaminondasFailure.PHALANX_CANNOT_JUMP_FURTHER_THAN_ITS_SIZE(stepSize, phalanxSize));
  }
  toString() {
    return "EpaminondasMove(" + this.coord.toString() + ", m:" + this.phalanxSize + ", s:" + this.stepSize + ", " + this.direction.toString() + ")";
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.coord.equals(other.coord) === false)
      return false;
    if (this.phalanxSize !== other.phalanxSize)
      return false;
    if (this.stepSize !== other.stepSize)
      return false;
    return this.direction.equals(other.direction);
  }
};

// games/dist/games/epaminondas/EpaminondasState.js
var EpaminondasState = class extends PlayerOrNoneGameStateWithTable {
  doesOwnPiece(player) {
    for (const coordAndContent of this.getCoordsAndContents()) {
      if (coordAndContent.content === player) {
        return true;
      }
    }
    return false;
  }
};

// games/dist/games/epaminondas/EpaminondasRules.js
var EpaminondasRules = class _EpaminondasRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Epaminondas`,
    config: {
      width: new NumberConfig(14, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      emptyRows: new NumberConfig(8, RulesConfigDescriptionLocalizable.NUMBER_OF_EMPTY_ROWS, MGPValidators.range(1, 99)),
      rowsOfSoldiers: new NumberConfig(2, RulesConfigDescriptionLocalizable.NUMBER_OF_PIECES_ROWS, MGPValidators.range(1, 99))
    }
  });
  static get() {
    if (_EpaminondasRules.singleton.isAbsent()) {
      _EpaminondasRules.singleton = MGPOptional.of(new _EpaminondasRules());
    }
    return _EpaminondasRules.singleton.get();
  }
  static isLegal(move, state) {
    const phalanxValidity = this.getPhalanxValidity(state, move);
    if (phalanxValidity.isFailure()) {
      return MGPFallible.failure(phalanxValidity.getReason());
    }
    const landingStatus = this.getLandingStatus(state, move);
    if (landingStatus.isFailure()) {
      return landingStatus;
    }
    const newBoard = TableUtils.copy(landingStatus.get());
    const opponent = state.getCurrentOpponent();
    const captureValidity = _EpaminondasRules.getCaptureValidity(state, newBoard, move, opponent);
    if (captureValidity.isFailure()) {
      return captureValidity;
    }
    return MGPFallible.success(captureValidity.get());
  }
  static getPhalanxValidity(state, move) {
    let coord = move.coord;
    if (state.isNotOnBoard(coord)) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(coord));
    }
    const opponent = state.getCurrentOpponent();
    for (let soldierIndex = 0; soldierIndex < move.phalanxSize; soldierIndex++) {
      if (state.isNotOnBoard(coord)) {
        return MGPValidation.failure(EpaminondasFailure.PHALANX_CANNOT_CONTAIN_PIECES_OUTSIDE_BOARD());
      }
      const spaceContent = state.getPieceAt(coord);
      if (spaceContent.isNone()) {
        return MGPValidation.failure(EpaminondasFailure.PHALANX_CANNOT_CONTAIN_EMPTY_SQUARE());
      }
      if (spaceContent === opponent) {
        return MGPValidation.failure(EpaminondasFailure.PHALANX_CANNOT_CONTAIN_OPPONENT_PIECE());
      }
      coord = coord.getNext(move.direction, 1);
    }
    return MGPValidation.SUCCESS;
  }
  static getLandingStatus(state, move) {
    const newBoard = state.getCopiedBoard();
    const currentPlayer = state.getCurrentPlayer();
    let emptied = move.coord;
    let landingCoord = move.coord.getNext(move.direction, move.phalanxSize);
    let landingIndex = 0;
    while (landingIndex + 1 < move.stepSize) {
      newBoard[emptied.y][emptied.x] = PlayerOrNone.NONE;
      newBoard[landingCoord.y][landingCoord.x] = currentPlayer;
      if (state.isNotOnBoard(landingCoord)) {
        return MGPFallible.failure(EpaminondasFailure.PHALANX_IS_LEAVING_BOARD());
      }
      if (state.getPieceAt(landingCoord).isPlayer()) {
        return MGPFallible.failure(EpaminondasFailure.SOMETHING_IN_PHALANX_WAY());
      }
      landingIndex++;
      landingCoord = landingCoord.getNext(move.direction, 1);
      emptied = emptied.getNext(move.direction, 1);
    }
    if (state.isNotOnBoard(landingCoord)) {
      return MGPFallible.failure(EpaminondasFailure.PHALANX_IS_LEAVING_BOARD());
    }
    if (state.getPieceAt(landingCoord) === currentPlayer) {
      return MGPFallible.failure(RulesFailure.SHOULD_LAND_ON_EMPTY_OR_OPPONENT_SPACE());
    }
    newBoard[emptied.y][emptied.x] = PlayerOrNone.NONE;
    newBoard[landingCoord.y][landingCoord.x] = currentPlayer;
    return MGPFallible.success(newBoard);
  }
  static getCaptureValidity(oldState, board, move, opponent) {
    let capturedSoldier = move.coord.getNext(move.direction, move.phalanxSize + move.stepSize - 1);
    let captured = 0;
    while (oldState.hasPieceAt(capturedSoldier, opponent)) {
      if (captured > 0) {
        board[capturedSoldier.y][capturedSoldier.x] = PlayerOrNone.NONE;
      }
      captured++;
      if (move.phalanxSize <= captured) {
        return MGPFallible.failure(EpaminondasFailure.PHALANX_SHOULD_BE_GREATER_TO_CAPTURE());
      }
      capturedSoldier = capturedSoldier.getNext(move.direction, 1);
    }
    return MGPFallible.success(board);
  }
  getInitialState(config) {
    const _ = PlayerOrNone.NONE;
    const O = PlayerOrNone.ZERO;
    const X = PlayerOrNone.ONE;
    const upperBoard = TableUtils.create(config.width, config.rowsOfSoldiers, X);
    const middleBoard = TableUtils.create(config.width, config.emptyRows, _);
    const lowerBoard = TableUtils.create(config.width, config.rowsOfSoldiers, O);
    const board = upperBoard.concat(middleBoard).concat(lowerBoard);
    return new EpaminondasState(board, 0);
  }
  getRulesConfigDescription() {
    return _EpaminondasRules.RULES_CONFIG_DESCRIPTION;
  }
  isLegal(move, state) {
    return _EpaminondasRules.isLegal(move, state);
  }
  applyLegalMove(_move, state, _config, newBoard) {
    const resultingState = new EpaminondasState(newBoard, state.turn + 1);
    return resultingState;
  }
  getGameStatus(node, _config) {
    const state = node.gameState;
    const zerosInFirstLine = state.countPieceInRow(Player.ZERO, 0);
    const height = state.getHeight();
    const onesInLastLine = state.countPieceInRow(Player.ONE, height - 1);
    if (state.turn % 2 === 0) {
      if (zerosInFirstLine > onesInLastLine) {
        return GameStatus.ZERO_WON;
      }
    } else {
      if (onesInLastLine > zerosInFirstLine) {
        return GameStatus.ONE_WON;
      }
    }
    const doesZeroOwnPieces = state.doesOwnPiece(Player.ZERO);
    if (doesZeroOwnPieces === false) {
      return GameStatus.ONE_WON;
    }
    const doesOneOwnPieces = state.doesOwnPiece(Player.ONE);
    if (doesOneOwnPieces === false) {
      return GameStatus.ZERO_WON;
    }
    return GameStatus.ONGOING;
  }
};

// games/dist/games/epaminondas/EpaminondasMoveGenerator.js
var EpaminondasMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const player = node.gameState.getCurrentPlayer();
    const opponent = node.gameState.getCurrentOpponent();
    const empty = PlayerOrNone.NONE;
    let moves = [];
    const state = node.gameState;
    for (const coordAndContent of state.getCoordsAndContents()) {
      const firstCoord = coordAndContent.coord;
      if (coordAndContent.content === player) {
        for (const direction of Ordinal.ORDINALS) {
          let phalanxSize = 1;
          let nextCoord = firstCoord.getNext(direction, 1);
          while (state.hasPieceAt(nextCoord, player)) {
            phalanxSize += 1;
            nextCoord = nextCoord.getNext(direction, 1);
          }
          let stepSize = 1;
          while (stepSize <= phalanxSize && state.hasPieceAt(nextCoord, empty)) {
            const move = new EpaminondasMove(firstCoord.x, firstCoord.y, phalanxSize, stepSize, direction);
            moves = this.addMove(moves, move, state);
            stepSize++;
            nextCoord = nextCoord.getNext(direction, 1);
          }
          if (stepSize <= phalanxSize && state.hasPieceAt(nextCoord, opponent)) {
            const move = new EpaminondasMove(firstCoord.x, firstCoord.y, phalanxSize, stepSize, direction);
            moves = this.addMove(moves, move, state);
          }
        }
      }
    }
    return moves;
  }
  addMove(moves, move, state) {
    const legality = EpaminondasRules.isLegal(move, state);
    if (legality.isSuccess()) {
      moves.push(move);
    }
    return moves;
  }
};

// games/dist/games/epaminondas/EpaminondasPhalanxSizeAndFilterMoveGenerator.js
var EpaminondasPhalanxSizeAndFilterMoveGenerator = class extends EpaminondasMoveGenerator {
  getListMoves(node, config) {
    const moves = super.getListMoves(node, config);
    return this.orderMovesByPhalanxSizeAndFilter(moves, node.gameState);
  }
  orderMovesByPhalanxSizeAndFilter(moves, state) {
    ArrayUtils.sortByDescending(moves, (move) => {
      return move.phalanxSize;
    });
    return moves.slice(0, 40);
  }
};

// games/dist/games/epaminondas/EpaminondasPieceThenRowDominationThenAlignmentThenRowPresenceHeuristic.js
var EpaminondasPieceThenRowDominationThenAlignmentThenRowPresenceHeuristic = class extends EpaminondasHeuristic {
  getBoardValue(node, _config) {
    const width = node.gameState.getWidth();
    const height = node.gameState.getHeight();
    let pieces = 0;
    let alignement = 0;
    let rowDomination = 0;
    let presence = 0;
    for (let y = 0; y < height; y++) {
      let row = 0;
      const wasPresent = PlayerNumberMap.of(0, 0);
      for (let x = 0; x < width; x++) {
        const coord = new Coord(x, y);
        const player = node.gameState.getPieceAt(coord);
        if (player.isPlayer()) {
          const mod = player.getScoreModifier();
          pieces += mod;
          wasPresent.put(player, mod);
          row += mod;
          for (const dir of [Ordinal.UP_LEFT, Ordinal.UP, Ordinal.UP_RIGHT]) {
            let neighbor = coord.getNext(dir, 1);
            while (node.gameState.hasPieceAt(neighbor, player)) {
              alignement += mod;
              neighbor = neighbor.getNext(dir, 1);
            }
          }
        }
      }
      if (row !== 0) {
        rowDomination += Math.abs(row) / row;
      }
      presence += wasPresent.get(Player.ZERO) + wasPresent.get(Player.ONE);
    }
    return BoardValue.multiMetric([
      pieces,
      rowDomination,
      alignement,
      presence
    ]);
  }
};

// games/dist/games/epaminondas/EpaminondasPositionalHeuristic.js
var EpaminondasPositionalHeuristic = class extends Heuristic {
  getBoardValue(node, _config) {
    return BoardValue.of(this.getPieceCountThenSupportThenAdvancement(node.gameState));
  }
  getPieceCountThenSupportThenAdvancement(state) {
    const width = state.getWidth();
    const height = state.getHeight();
    const MAX_ADVANCEMENT_SCORE_TOTAL = 28 * width;
    const SCORE_BY_ALIGNMENT = MAX_ADVANCEMENT_SCORE_TOTAL + 1;
    const MAX_NUMBER_OF_ALIGNMENT = 24 * 16 + 4 * 15;
    const SCORE_BY_PIECE = MAX_NUMBER_OF_ALIGNMENT * SCORE_BY_ALIGNMENT + 1;
    let total = 0;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const coord = coordAndContent.coord;
      const player = coordAndContent.content;
      let avancement;
      let dirs;
      if (player === Player.ZERO) {
        avancement = height - coord.y;
        dirs = [Ordinal.UP_LEFT, Ordinal.UP, Ordinal.UP_RIGHT];
      } else {
        avancement = coord.y + 1;
        dirs = [Ordinal.DOWN_LEFT, Ordinal.DOWN, Ordinal.DOWN_RIGHT];
      }
      const mod = player.getScoreModifier();
      total += avancement * mod;
      total += SCORE_BY_PIECE * mod;
      for (const dir of dirs) {
        let neighbor = coord.getNext(dir, 1);
        while (state.hasPieceAt(neighbor, player)) {
          total += mod * SCORE_BY_ALIGNMENT;
          neighbor = neighbor.getNext(dir, 1);
        }
      }
    }
    return total;
  }
};

// games/dist/games/gipf/GipfFailure.js
var GipfFailure = class {
  static CAPTURE_MUST_BE_ALIGNED = () => $localize`You can only capture when 4 or more of your pieces are aligned, and it is not the case.`;
  static INVALID_CAPTURED_PIECES = () => $localize`You must select a valid capture that contains 4 pieces or more.`;
  static MISSING_CAPTURES = () => $localize`There are still possible captures to be done.`;
  static PLACEMENT_NOT_ON_BORDER = () => $localize`Pieces must be inserted in spaces on the edge of the board.`;
  static INVALID_PLACEMENT_DIRECTION = () => $localize`You must select a valid placement direction.`;
  static PLACEMENT_WITHOUT_DIRECTION = () => $localize`You must select a placement with a direction alongside the insertion space.`;
  static PLACEMENT_ON_COMPLETE_LINE = () => $localize`You cannot place a piece on a complete line.`;
  static AMBIGUOUS_CAPTURE_COORD = () => $localize`This piece belongs to two captures. Please select another piece in the capture you'd like to make.`;
  static NO_DIRECTIONS_AVAILABLE = () => $localize`You cannot insert a piece here, as all lines are full. Select another space.`;
};

// games/dist/jscaip/GipfProjectHelper.js
var GipfCapture = class _GipfCapture {
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder)], (move) => [move.capturedSpaces], (fields) => new _GipfCapture(fields[0]));
  static listEncoder = Encoder.list(_GipfCapture.encoder);
  capturedSpaces;
  constructor(captured) {
    Utils.assert(4 <= captured.length, "Cannot create a GipfCapture with less than 4 captured pieces");
    Utils.assert(HexaLine.areOnSameLine(captured), "Cannot create a GipfCapture with pieces that are not on the same line");
    this.capturedSpaces = ArrayUtils.copy(captured).sort((coord1, coord2) => {
      if (coord1.x === coord2.x) {
        Utils.assert(coord1.y !== coord2.y, "Cannot create a GipfCapture with duplicate coords");
        return coord1.y > coord2.y ? 1 : -1;
      } else {
        return coord1.x > coord2.x ? 1 : -1;
      }
    });
    let previous = MGPOptional.empty();
    for (const coord of this.capturedSpaces) {
      Utils.assert(previous.isAbsent() || previous.get().getLinearDistanceToward(coord) === 1, "Cannot create a GipfCapture with non-consecutive coords");
      previous = MGPOptional.of(coord);
    }
  }
  toString() {
    let str = "";
    for (const coord of this.capturedSpaces) {
      if (str !== "") {
        str += ",";
      }
      str += coord.toString();
    }
    return str;
  }
  size() {
    return this.capturedSpaces.length;
  }
  forEach(callback) {
    this.capturedSpaces.forEach(callback);
  }
  contains(coord) {
    for (const capturedSpace of this.capturedSpaces) {
      if (capturedSpace.equals(coord)) {
        return true;
      }
    }
    return false;
  }
  intersectsWith(capture) {
    return this.capturedSpaces.some((coord) => {
      return capture.contains(coord);
    });
  }
  getLine() {
    const line = HexaLine.fromTwoCoords(this.capturedSpaces[0], this.capturedSpaces[1]);
    return line.get();
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.capturedSpaces.length !== other.capturedSpaces.length) {
      return false;
    }
    for (let i = 0; i < this.capturedSpaces.length; i++) {
      if (this.capturedSpaces[i].equals(other.capturedSpaces[i]) === false) {
        return false;
      }
    }
    return true;
  }
};
var GipfProjectHelper = class _GipfProjectHelper {
  static getPossibleCaptureCombinationsFromPossibleCaptures(possibleCaptures) {
    const intersections = _GipfProjectHelper.computeIntersections(possibleCaptures);
    let captureCombinations = [[]];
    possibleCaptures.forEach((_capture, index) => {
      if (intersections[index].length === 0) {
        captureCombinations.forEach((combination) => {
          combination.push(index);
        });
      } else {
        const newCombinations = [];
        const intersectsWithFutureIndex = intersections[index].some((c) => c > index);
        for (const combination of captureCombinations) {
          const combinationIntersectsWithIndex = combination.some((c) => {
            return intersections[index].some((c2) => c === c2);
          });
          if (combinationIntersectsWithIndex) {
            newCombinations.push(ArrayUtils.copy(combination));
          } else if (intersectsWithFutureIndex) {
            newCombinations.push(ArrayUtils.copy(combination));
            combination.push(index);
            newCombinations.push(ArrayUtils.copy(combination));
          } else {
            combination.push(index);
            newCombinations.push(ArrayUtils.copy(combination));
          }
        }
        captureCombinations = newCombinations;
      }
    });
    return captureCombinations.map((combination) => {
      return combination.map((index) => {
        return possibleCaptures[index];
      });
    });
  }
  static computeIntersections(captures) {
    const intersections = [];
    captures.forEach((capture1, index1) => {
      intersections.push([]);
      captures.forEach((capture2, index2) => {
        if (index1 !== index2) {
          if (capture1.intersectsWith(capture2)) {
            intersections[index1].push(index2);
          }
        }
      });
    });
    return intersections;
  }
};

// games/dist/games/gipf/GipfMove.js
var GipfPlacement = class _GipfPlacement {
  coord;
  direction;
  static encoder = Encoder.tuple([Coord.encoder, MGPOptional.getEncoder(HexaDirection.encoder)], (placement) => [placement.coord, placement.direction], (fields) => new _GipfPlacement(fields[0], fields[1]));
  constructor(coord, direction) {
    this.coord = coord;
    this.direction = direction;
  }
  toString() {
    if (this.direction.isPresent()) {
      return this.coord.toString() + "@" + this.direction.get().toString();
    } else {
      return this.coord.toString();
    }
  }
  equals(other) {
    if (this.coord.equals(other.coord) === false) {
      return false;
    }
    return this.direction.equals(other.direction);
  }
};
var GipfMove = class _GipfMove extends Move {
  placement;
  initialCaptures;
  finalCaptures;
  static encoder = Encoder.tuple([GipfPlacement.encoder, GipfCapture.listEncoder, GipfCapture.listEncoder], (move) => [move.placement, move.initialCaptures, move.finalCaptures], (fields) => new _GipfMove(fields[0], fields[1], fields[2]));
  constructor(placement, initialCaptures, finalCaptures) {
    super();
    this.placement = placement;
    this.initialCaptures = initialCaptures;
    this.finalCaptures = finalCaptures;
  }
  toString() {
    return "GipfMove([" + this.capturesToString(this.initialCaptures) + "], " + this.placement.toString() + ", [" + this.capturesToString(this.finalCaptures) + "])";
  }
  capturesToString(captures) {
    let str = "";
    for (const capture of captures) {
      if (str !== "") {
        str += ",";
      }
      str += "[" + capture.toString() + "]";
    }
    return str;
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.placement.equals(other.placement) === false)
      return false;
    if (ArrayUtils.equals(this.initialCaptures, other.initialCaptures) === false)
      return false;
    if (ArrayUtils.equals(this.finalCaptures, other.finalCaptures) === false)
      return false;
    return true;
  }
};

// games/dist/jscaip/HexaOrientation.js
var HexaOrientation = class {
  startAngle;
  conversionMatrix;
  inverseConversionMatrix;
};
var PointyHexaOrientation = class _PointyHexaOrientation extends HexaOrientation {
  static INSTANCE = new _PointyHexaOrientation();
  startAngle = 0.5;
  conversionMatrix = [Math.sqrt(3), Math.sqrt(3) / 2, 0, 3 / 2];
  inverseConversionMatrix = [Math.sqrt(3) / 3, -1 / 3, 0, 2 / 3];
  constructor() {
    super();
  }
};
var FlatHexaOrientation = class _FlatHexaOrientation extends HexaOrientation {
  static INSTANCE = new _FlatHexaOrientation();
  startAngle = 0;
  conversionMatrix = [3 / 2, 0, Math.sqrt(3) / 2, Math.sqrt(3)];
  inverseConversionMatrix = [2 / 3, 0, -1 / 3, Math.sqrt(3) / 3];
  constructor() {
    super();
  }
  isOnBorder(state, coord) {
    return this.isOnTopRightBorder(state, coord) || this.isOnRightBorder(state, coord) || this.isOnBottomRightBorder(state, coord) || this.isOnBottomLeftBorder(state, coord) || this.isOnLeftBorder(state, coord) || this.isOnTopLeftBorder(state, coord);
  }
  isOnTopRightBorder(board, coord) {
    return coord.y === 0;
  }
  isOnRightBorder(board, coord) {
    return coord.x === board.width - 1;
  }
  isOnLeftBorder(board, coord) {
    return coord.x === 0;
  }
  isOnBottomLeftBorder(board, coord) {
    return coord.y === board.height - 1;
  }
  isOnTopLeftBorder(board, coord) {
    if (board.excludedSpaces[coord.y] != null) {
      return coord.x === board.excludedSpaces[coord.y];
    } else if (coord.y === board.excludedSpaces.length) {
      return coord.x === 0;
    } else {
      return false;
    }
  }
  isOnBottomRightBorder(board, coord) {
    if (board.excludedSpaces[board.height - 1 - coord.y] != null) {
      return board.width - 1 - coord.x === board.excludedSpaces[board.height - 1 - coord.y];
    } else if (board.height - 1 - coord.y === board.excludedSpaces.length) {
      return coord.x === board.width - 1;
    } else {
      return false;
    }
  }
  getAllBorders(state) {
    const coords = [];
    state.forEachCoord((coord, _content) => {
      if (this.isOnBorder(state, coord)) {
        coords.push(coord);
      }
    });
    return coords;
  }
  isTopCorner(board, coord) {
    return this.isOnTopLeftBorder(board, coord) && this.isOnTopRightBorder(board, coord);
  }
  isTopLeftCorner(board, coord) {
    return this.isOnTopLeftBorder(board, coord) && this.isOnLeftBorder(board, coord);
  }
  isTopRightCorner(board, coord) {
    return this.isOnTopRightBorder(board, coord) && this.isOnRightBorder(board, coord);
  }
  isBottomCorner(board, coord) {
    return this.isOnBottomLeftBorder(board, coord) && this.isOnBottomRightBorder(board, coord);
  }
  isBottomLeftCorner(board, coord) {
    return this.isOnBottomLeftBorder(board, coord) && this.isOnLeftBorder(board, coord);
  }
  isBottomRightCorner(board, coord) {
    return this.isOnBottomRightBorder(board, coord) && this.isOnRightBorder(board, coord);
  }
};

// games/dist/games/gipf/GipfState.js
var GipfState = class _GipfState extends HexagonalGameState {
  sidePieces;
  capturedPieces;
  constructor(board, turn, sidePieces, capturedPieces) {
    super(turn, board, 7, 7, [3, 2, 1], FourStatePiece.EMPTY);
    this.sidePieces = sidePieces;
    this.capturedPieces = capturedPieces;
  }
  getScores() {
    return this.capturedPieces;
  }
  equals(other) {
    if (this.turn !== other.turn)
      return false;
    if (this.sidePieces.equals(other.sidePieces) === false)
      return false;
    if (this.capturedPieces.equals(other.capturedPieces) === false)
      return false;
    return TableUtils.equals(this.board, other.board);
  }
  getNumberOfPiecesToPlace(player) {
    return this.sidePieces.get(player);
  }
  getNumberOfPiecesCaptured(player) {
    return this.capturedPieces.get(player);
  }
  setAtUnsafe(coord, v) {
    const newBoard = TableUtils.copy(this.board);
    newBoard[coord.y][coord.x] = v;
    return new _GipfState(newBoard, this.turn, this.sidePieces, this.capturedPieces);
  }
  isOnBoard(coord) {
    if (coord.isNotInRange(this.width, this.height)) {
      return false;
    } else {
      return this.getUnsafe(coord) !== FourStatePiece.UNREACHABLE;
    }
  }
};

// games/dist/games/gipf/GipfRules.js
var GipfRules = class _GipfRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_GipfRules.singleton.isAbsent()) {
      _GipfRules.singleton = MGPOptional.of(new _GipfRules());
    }
    return _GipfRules.singleton.get();
  }
  getInitialState() {
    const _ = FourStatePiece.EMPTY;
    const N = FourStatePiece.UNREACHABLE;
    const O = FourStatePiece.ZERO;
    const X = FourStatePiece.ONE;
    const board = [
      [N, N, N, X, _, _, O],
      [N, N, _, _, _, _, _],
      [N, _, _, _, _, _, _],
      [O, _, _, _, _, _, X],
      [_, _, _, _, _, _, N],
      [_, _, _, _, _, N, N],
      [X, _, _, O, N, N, N]
    ];
    return new GipfState(board, 0, PlayerNumberMap.of(12, 12), PlayerNumberMap.of(0, 0));
  }
  applyLegalMove(_move, _state, _config, computedState) {
    return new GipfState(computedState.board, computedState.turn + 1, computedState.sidePieces, computedState.capturedPieces);
  }
  static applyCaptures(captures, state) {
    let computedState = state;
    captures.forEach((capture) => {
      computedState = _GipfRules.applyCapture(capture, computedState);
    });
    return computedState;
  }
  static applyCapture(capture, state) {
    const player = state.getCurrentPlayer();
    let newState = state;
    const sidePieces = state.sidePieces.getCopy();
    const capturedPieces = state.capturedPieces.getCopy();
    capture.forEach((coord) => {
      const piece = state.getPieceAt(coord);
      newState = newState.setAt(coord, FourStatePiece.EMPTY);
      if (piece.is(player)) {
        sidePieces.add(player, 1);
      } else {
        capturedPieces.add(player, 1);
      }
    });
    return new GipfState(newState.board, state.turn, sidePieces, capturedPieces);
  }
  static getPlacements(state) {
    const placements = [];
    FlatHexaOrientation.INSTANCE.getAllBorders(state).forEach((entrance) => {
      if (state.getPieceAt(entrance) === FourStatePiece.EMPTY) {
        placements.push(new GipfPlacement(entrance, MGPOptional.empty()));
      } else {
        _GipfRules.getAllDirectionsForEntrance(state, entrance).forEach((dir) => {
          if (_GipfRules.isLineComplete(state, entrance, dir) === false) {
            placements.push(new GipfPlacement(entrance, MGPOptional.of(dir)));
          }
        });
      }
    });
    return placements;
  }
  static isLineComplete(state, start, dir) {
    return _GipfRules.nextGapInLine(state, start, dir).isAbsent();
  }
  static nextGapInLine(state, start, dir) {
    for (let cur = start; state.isOnBoard(cur); cur = cur.getNext(dir)) {
      if (state.getPieceAt(cur) === FourStatePiece.EMPTY) {
        return MGPOptional.of(cur);
      }
    }
    return MGPOptional.empty();
  }
  static applyPlacement(placement, state) {
    const player = state.getCurrentPlayer();
    let newState = state;
    let previousPiece = FourStatePiece.ofPlayer(state.getPreviousOpponent());
    if (placement.direction.isAbsent()) {
      const coord = placement.coord;
      if (state.getPieceAt(coord) !== FourStatePiece.EMPTY) {
        throw new Error("Apply placement called without direction while the coord is occupied");
      }
      newState = newState.setAt(coord, previousPiece);
    } else {
      let cur = placement.coord;
      while (newState.isOnBoard(cur) && previousPiece !== FourStatePiece.EMPTY) {
        const curPiece = state.getPieceAt(cur);
        newState = newState.setAt(cur, previousPiece);
        previousPiece = curPiece;
        cur = cur.getNext(placement.direction.get());
      }
    }
    const sidePieces = state.sidePieces.getCopy();
    sidePieces.add(player, -1);
    return new GipfState(newState.board, state.turn, sidePieces, state.capturedPieces);
  }
  getPiecesMoved(state, initialCaptures, placement) {
    const stateAfterCapture = _GipfRules.applyCaptures(initialCaptures, state);
    if (placement.direction.isAbsent()) {
      return [placement.coord];
    } else {
      const dir = placement.direction.get();
      const moved = [];
      moved.push(placement.coord);
      let cur = placement.coord.getNext(dir);
      while (stateAfterCapture.hasInequalPieceAt(cur, FourStatePiece.EMPTY)) {
        moved.push(cur);
        cur = cur.getNext(dir);
      }
      Utils.assert(stateAfterCapture.hasPieceAt(cur, FourStatePiece.EMPTY), "getPiecesMoved called with an invalid placement performed on a full line");
      moved.push(cur);
      return moved;
    }
  }
  static getAllDirectionsForEntrance(state, entrance) {
    if (FlatHexaOrientation.INSTANCE.isTopLeftCorner(state, entrance)) {
      return [HexaDirection.RIGHT, HexaDirection.DOWN, HexaDirection.UP_RIGHT];
    } else if (FlatHexaOrientation.INSTANCE.isTopCorner(state, entrance)) {
      return [HexaDirection.DOWN, HexaDirection.DOWN_LEFT, HexaDirection.RIGHT];
    } else if (FlatHexaOrientation.INSTANCE.isTopRightCorner(state, entrance)) {
      return [HexaDirection.DOWN_LEFT, HexaDirection.DOWN, HexaDirection.LEFT];
    } else if (FlatHexaOrientation.INSTANCE.isBottomLeftCorner(state, entrance)) {
      return [HexaDirection.UP_RIGHT, HexaDirection.UP, HexaDirection.RIGHT];
    } else if (FlatHexaOrientation.INSTANCE.isBottomCorner(state, entrance)) {
      return [HexaDirection.UP, HexaDirection.LEFT, HexaDirection.UP_RIGHT];
    } else if (FlatHexaOrientation.INSTANCE.isBottomRightCorner(state, entrance)) {
      return [HexaDirection.LEFT, HexaDirection.UP, HexaDirection.DOWN_LEFT];
    } else if (FlatHexaOrientation.INSTANCE.isOnTopLeftBorder(state, entrance)) {
      return [HexaDirection.RIGHT, HexaDirection.DOWN];
    } else if (FlatHexaOrientation.INSTANCE.isOnLeftBorder(state, entrance)) {
      return [HexaDirection.UP_RIGHT, HexaDirection.RIGHT];
    } else if (FlatHexaOrientation.INSTANCE.isOnBottomLeftBorder(state, entrance)) {
      return [HexaDirection.UP, HexaDirection.UP_RIGHT];
    } else if (FlatHexaOrientation.INSTANCE.isOnBottomRightBorder(state, entrance)) {
      return [HexaDirection.LEFT, HexaDirection.UP];
    } else if (FlatHexaOrientation.INSTANCE.isOnRightBorder(state, entrance)) {
      return [HexaDirection.LEFT, HexaDirection.DOWN_LEFT];
    } else if (FlatHexaOrientation.INSTANCE.isOnTopRightBorder(state, entrance)) {
      return [HexaDirection.DOWN_LEFT, HexaDirection.DOWN];
    } else {
      throw new Error("not a border");
    }
  }
  isLegal(move, state) {
    const initialCapturesValidity = this.capturesValidity(state, move.initialCaptures);
    if (initialCapturesValidity.isFailure()) {
      return initialCapturesValidity.toOtherFallible();
    }
    const stateAfterInitialCaptures = _GipfRules.applyCaptures(move.initialCaptures, state);
    const noMoreCaptureAfterInitialValidity = this.noMoreCapturesValidity(stateAfterInitialCaptures);
    if (noMoreCaptureAfterInitialValidity.isFailure()) {
      return noMoreCaptureAfterInitialValidity.toOtherFallible();
    }
    const placementValidity = this.placementValidity(stateAfterInitialCaptures, move.placement);
    if (placementValidity.isFailure()) {
      return placementValidity.toOtherFallible();
    }
    const stateAfterPlacement = _GipfRules.applyPlacement(move.placement, stateAfterInitialCaptures);
    const finalCapturesValidity = this.capturesValidity(stateAfterPlacement, move.finalCaptures);
    if (finalCapturesValidity.isFailure()) {
      return finalCapturesValidity.toOtherFallible();
    }
    const stateAfterFinalCaptures = _GipfRules.applyCaptures(move.finalCaptures, stateAfterPlacement);
    const noMoreCaptureAfterFinalValidity = this.noMoreCapturesValidity(stateAfterFinalCaptures);
    if (noMoreCaptureAfterFinalValidity.isFailure()) {
      return noMoreCaptureAfterFinalValidity.toOtherFallible();
    }
    return MGPFallible.success(stateAfterFinalCaptures);
  }
  capturesValidity(state, captures) {
    let updatedState = state;
    for (const capture of captures) {
      const validity = this.captureValidity(updatedState, capture);
      if (validity.isFailure()) {
        return validity;
      }
      updatedState = _GipfRules.applyCapture(capture, updatedState);
    }
    return MGPValidation.SUCCESS;
  }
  captureValidity(state, capture) {
    const player = state.getCurrentPlayer();
    const linePortionOpt = _GipfRules.getLinePortionWithFourPiecesOfPlayer(state, player, capture.getLine());
    if (linePortionOpt.isAbsent()) {
      return MGPValidation.failure(GipfFailure.CAPTURE_MUST_BE_ALIGNED());
    }
    const linePortion = linePortionOpt.get();
    const capturable = _GipfRules.getCapturable(state, linePortion);
    if (capturable.equals(capture)) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(GipfFailure.INVALID_CAPTURED_PIECES());
    }
  }
  static getLinePortionsWithFourPiecesOfPlayer(state, player) {
    const linePortions = [];
    state.allLines().forEach((line) => {
      const linePortion = _GipfRules.getLinePortionWithFourPiecesOfPlayer(state, player, line);
      if (linePortion.isPresent()) {
        linePortions.push(linePortion.get());
      }
    });
    return linePortions;
  }
  static getLinePortionWithFourPiecesOfPlayer(state, player, line) {
    let consecutives = 0;
    const coord = state.getEntranceOnLine(line);
    const dir = line.getDirection();
    let start = coord;
    for (let cur = coord; state.isOnBoard(cur); cur = cur.getNext(dir)) {
      if (state.getPieceAt(cur).is(player)) {
        if (consecutives === 0) {
          start = cur;
        }
        consecutives += 1;
      } else {
        consecutives = 0;
      }
      if (consecutives === 4) {
        return MGPOptional.of({ 0: start, 1: cur, 2: dir });
      }
    }
    return MGPOptional.empty();
  }
  noMoreCapturesValidity(state) {
    const player = state.getCurrentPlayer();
    const linePortions = _GipfRules.getLinePortionsWithFourPiecesOfPlayer(state, player);
    if (linePortions.length === 0) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(GipfFailure.MISSING_CAPTURES());
    }
  }
  placementValidity(state, placement) {
    const coordValidity = this.placementCoordValidity(state, placement.coord);
    if (coordValidity.isFailure()) {
      return coordValidity;
    }
    if (state.getPieceAt(placement.coord) !== FourStatePiece.EMPTY) {
      if (placement.direction.isAbsent()) {
        return MGPValidation.failure(GipfFailure.PLACEMENT_WITHOUT_DIRECTION());
      }
      if (_GipfRules.isLineComplete(state, placement.coord, placement.direction.get())) {
        return MGPValidation.failure(GipfFailure.PLACEMENT_ON_COMPLETE_LINE());
      }
      for (const dir of _GipfRules.getAllDirectionsForEntrance(state, placement.coord)) {
        if (dir === placement.direction.get()) {
          return MGPValidation.SUCCESS;
        }
      }
      return MGPValidation.failure(GipfFailure.INVALID_PLACEMENT_DIRECTION());
    }
    return MGPValidation.SUCCESS;
  }
  placementCoordValidity(state, coord) {
    if (FlatHexaOrientation.INSTANCE.isOnBorder(state, coord)) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(GipfFailure.PLACEMENT_NOT_ON_BORDER());
    }
  }
  static getCapturable(state, linePortion) {
    const capturable = [];
    const start = linePortion[0];
    const end = linePortion[1];
    const dir = linePortion[2];
    const oppositeDir = dir.getOpposite();
    let cur = start.getNext(oppositeDir);
    while (state.hasInequalPieceAt(cur, FourStatePiece.EMPTY)) {
      capturable.push(cur);
      cur = cur.getNext(oppositeDir);
    }
    for (let coord = start; coord.equals(end) === false; coord = coord.getNext(dir)) {
      capturable.push(coord);
    }
    for (let coord = end; state.hasInequalPieceAt(coord, FourStatePiece.EMPTY); coord = coord.getNext(dir)) {
      capturable.push(coord);
    }
    return new GipfCapture(capturable);
  }
  static getPossibleCaptures(state) {
    const player = state.getCurrentPlayer();
    const captures = [];
    _GipfRules.getLinePortionsWithFourPiecesOfPlayer(state, player).forEach((linePortion) => {
      captures.push(_GipfRules.getCapturable(state, linePortion));
    });
    return captures;
  }
  static getPlayerScore(state, player) {
    const piecesToPlay = state.getNumberOfPiecesToPlace(player);
    if (piecesToPlay === 0) {
      const captures = _GipfRules.getPossibleCaptures(state);
      if (captures.length === 0) {
        return MGPOptional.empty();
      }
    }
    const captured = state.getNumberOfPiecesCaptured(player);
    return MGPOptional.of(piecesToPlay + captured * 3);
  }
  static isGameOver(state) {
    const score0 = _GipfRules.getPlayerScore(state, Player.ZERO);
    const score1 = _GipfRules.getPlayerScore(state, Player.ONE);
    return score0.isAbsent() || score1.isAbsent();
  }
  getGameStatus(node) {
    const state = node.gameState;
    const score0 = _GipfRules.getPlayerScore(state, Player.ZERO);
    const score1 = _GipfRules.getPlayerScore(state, Player.ONE);
    if (score0.isAbsent()) {
      return GameStatus.ONE_WON;
    } else if (score1.isAbsent()) {
      return GameStatus.ZERO_WON;
    } else {
      return GameStatus.ONGOING;
    }
  }
};

// games/dist/games/gipf/GipfMoveGenerator.js
var GipfMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const moves = [];
    if (GipfRules.isGameOver(state)) {
      return moves;
    }
    this.getPossibleCaptureCombinations(state).forEach((initialCaptures) => {
      const stateAfterCapture = GipfRules.applyCaptures(initialCaptures, state);
      GipfRules.getPlacements(stateAfterCapture).forEach((placement) => {
        const stateAfterPlacement = GipfRules.applyPlacement(placement, stateAfterCapture);
        this.getPossibleCaptureCombinations(stateAfterPlacement).forEach((finalCaptures) => {
          const moveSimple = new GipfMove(placement, initialCaptures, finalCaptures);
          moves.push(moveSimple);
        });
      });
    });
    return moves;
  }
  getPossibleCaptureCombinations(state) {
    const possibleCaptures = GipfRules.getPossibleCaptures(state);
    return GipfProjectHelper.getPossibleCaptureCombinationsFromPossibleCaptures(possibleCaptures);
  }
};

// games/dist/games/gipf/GipfScoreHeuristic.js
var GipfScoreHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    return PlayerNumberTable.ofSingle(GipfRules.getPlayerScore(state, Player.ZERO).get(), GipfRules.getPlayerScore(state, Player.ONE).get());
  }
};

// games/dist/games/gos/AbstractGoHeuristic.js
var AbstractGoHeuristic = class extends PlayerMetricHeuristic {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getMetrics(node) {
    const goState = this.rules.markTerritoryAndCount(node.gameState);
    const goScore = goState.captured;
    const goKilled = this.getDeadStones(goState);
    return PlayerNumberTable.ofSingle(goScore.get(Player.ZERO) + 2 * goKilled.get(Player.ONE), goScore.get(Player.ONE) + 2 * goKilled.get(Player.ZERO));
  }
  getDeadStones(state) {
    const killed = PlayerNumberMap.of(0, 0);
    for (const coordAndContent of state.getCoordsAndContents()) {
      const piece = coordAndContent.content;
      if (piece.type === "dead") {
        killed.add(piece.player, 1);
      }
    }
    return killed;
  }
};

// games/dist/games/gos/GoMove.js
var GoMove = class _GoMove extends MoveCoord {
  static PASS = new _GoMove(-1, 0);
  static ACCEPT = new _GoMove(-2, 0);
  static encoder = MoveCoord.getEncoder(_GoMove.of);
  static of(coord) {
    return new _GoMove(coord.x, coord.y);
  }
  toString() {
    if (this === _GoMove.PASS) {
      return "GoMove.PASS";
    } else if (this === _GoMove.ACCEPT) {
      return "GoMove.ACCEPT";
    } else {
      return "GoMove(" + this.coord.x + ", " + this.coord.y + ")";
    }
  }
};

// games/dist/games/gos/GoPiece.js
var GoPiece = class _GoPiece {
  player;
  type;
  static DARK = new _GoPiece(Player.ZERO, "alive");
  static LIGHT = new _GoPiece(Player.ONE, "alive");
  static EMPTY = new _GoPiece(PlayerOrNone.NONE, "empty");
  static DEAD_DARK = new _GoPiece(Player.ZERO, "dead");
  static DEAD_LIGHT = new _GoPiece(Player.ONE, "dead");
  static DARK_TERRITORY = new _GoPiece(Player.ZERO, "territory");
  static LIGHT_TERRITORY = new _GoPiece(Player.ONE, "territory");
  static UNREACHABLE = new _GoPiece(PlayerOrNone.NONE, "unreachable");
  // For Triangular Go and Hexagonal Go
  static isReachable(piece) {
    return piece.isReachable();
  }
  constructor(player, type) {
    this.player = player;
    this.type = type;
  }
  equals(other) {
    return other === this;
  }
  toString() {
    switch (this) {
      case _GoPiece.DARK:
        return "GoPiece.DARK";
      case _GoPiece.LIGHT:
        return "GoPiece.LIGHT";
      case _GoPiece.EMPTY:
        return "GoPiece.EMPTY";
      case _GoPiece.DEAD_DARK:
        return "GoPiece.DEAD_DARK";
      case _GoPiece.DEAD_LIGHT:
        return "GoPiece.DEAD_LIGHT";
      case _GoPiece.DARK_TERRITORY:
        return "GoPiece.DARK_TERRITORY";
      case _GoPiece.UNREACHABLE:
        return "GoPiece.UNREACHABLE";
      default:
        Utils.assert(this === _GoPiece.LIGHT_TERRITORY, "Unexisting GoPiece");
        return "GoPiece.LIGHT_TERRITORY";
    }
  }
  static pieceBelongTo(piece, owner) {
    return owner === piece.player && piece.type !== "territory";
  }
  static ofPlayer(player) {
    if (player === Player.ZERO) {
      return _GoPiece.DARK;
    } else {
      return _GoPiece.LIGHT;
    }
  }
  isOccupied() {
    return this.type === "alive" || this.type === "dead";
  }
  isEmpty() {
    return this.type === "territory" || this.type === "empty";
  }
  isDead() {
    return this.type === "dead";
  }
  isTerritory() {
    return this.type === "territory";
  }
  getOwner() {
    return this.player;
  }
  nonTerritory() {
    Utils.assert(this.isEmpty(), 'Usually not false, if false, cover by test and return "this"');
    return _GoPiece.EMPTY;
  }
  isReachable() {
    return this.type !== "unreachable";
  }
};

// games/dist/games/gos/AbstractGoMoveGenerator.js
var __decorate5 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractGoMoveGenerator = class AbstractGoMoveGenerator2 extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const currentState = node.gameState;
    const playingMoves = this.getPlayingMovesList(currentState, config);
    if (currentState.phase.isPlaying() || currentState.phase.isPassed()) {
      playingMoves.push(GoMove.PASS);
      return playingMoves;
    } else {
      const markingMoves = this.getCountingMovesList(currentState, config);
      if (markingMoves.length === 0) {
        return [GoMove.ACCEPT];
      } else {
        return markingMoves;
      }
    }
  }
  getPlayingMovesList(state, config) {
    const choices = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      const content = coordAndContent.content;
      const newMove = new GoMove(coord.x, coord.y);
      if (content === GoPiece.EMPTY) {
        const legality = this.rules.isLegal(newMove, state, config);
        if (legality.isSuccess()) {
          choices.push(newMove);
        }
      }
    }
    return choices;
  }
  getCountingMovesList(currentState, config) {
    const choices = [];
    const correctBoard = this.getCorrectBoard(currentState).getCopiedBoard();
    const zoom = this.rules.getZoom(config);
    const groupDataFactory = this.rules.getGoGroupDataFactory(zoom);
    const groupsData = groupDataFactory.getGroupsDataWhere(correctBoard, (piece) => piece !== GoPiece.EMPTY && piece !== GoPiece.UNREACHABLE);
    for (const group of groupsData) {
      const coord = group.getCoords()[0];
      const correctContent = correctBoard[coord.y][coord.x];
      const actualContent = currentState.getPieceAt(coord);
      if (actualContent !== correctContent) {
        const move = new GoMove(coord.x, coord.y);
        choices.push(move);
        return choices;
      }
    }
    return choices;
  }
  getCorrectBoard(currentState) {
    const markAsDead = (piece) => {
      if (piece === GoPiece.DARK)
        return GoPiece.DEAD_DARK;
      if (piece === GoPiece.LIGHT)
        return GoPiece.DEAD_LIGHT;
      if (piece.isTerritory()) {
        return GoPiece.EMPTY;
      } else {
        return piece;
      }
    };
    const allDeadBoard = this.mapBoard(currentState.getCopiedBoard(), markAsDead);
    const allDeadState = currentState.withBoard(allDeadBoard);
    const territoryLikeGroups = this.rules.getTerritoryLikeGroup(allDeadState);
    return this.setAliveUniqueWrapper(allDeadState, territoryLikeGroups);
  }
  mapBoard(board, mapper) {
    const newBoard = [];
    for (let y = 0; y < board.length; y++) {
      newBoard[y] = [];
      for (let x = 0; x < board[0].length; x++) {
        newBoard[y][x] = mapper(board[y][x]);
      }
    }
    return newBoard;
  }
  setAliveUniqueWrapper(allDeadState, monoWrappedEmptyGroups) {
    let resultingState = allDeadState;
    let aliveCoords;
    for (const monoWrappedEmptyGroup of monoWrappedEmptyGroups) {
      aliveCoords = monoWrappedEmptyGroup.deadDarkCoords.concat(monoWrappedEmptyGroup.deadLightCoords);
      for (const aliveCoord of aliveCoords) {
        if (resultingState.isDead(aliveCoord)) {
          resultingState = this.rules.switchLiveness(aliveCoord, resultingState, 1);
        }
      }
    }
    return resultingState;
  }
};
AbstractGoMoveGenerator = __decorate5([
  Debug.log
], AbstractGoMoveGenerator);

// games/dist/games/gos/GoFailure.js
var GoFailure = class {
  static ILLEGAL_KO = () => $localize`This move is a ko, you must play somewhere else before you can play in this intersection again.`;
  static CANNOT_PASS_AFTER_PASSED_PHASE = () => $localize`We are in the counting phase, you must mark stones as dead or alive or accept the current board by passing your turn.`;
  static CANNOT_ACCEPT_BEFORE_COUNTING_PHASE = () => $localize`You cannot accept before the counting phase.`;
  static OCCUPIED_INTERSECTION = () => $localize`This intersection is already occupied.`;
  static OCCUPIED_SPACE = () => $localize`This space is already occupied.`;
  static CANNOT_COMMIT_SUICIDE = () => $localize`You cannot commit suicide.`;
};

// games/dist/jscaip/ScoreName.js
var ScoreName = class _ScoreName {
  zero;
  singular;
  plural;
  static POINTS = new _ScoreName(() => $localize`0 points`, () => $localize`1 point`, (n) => $localize`${n} points`);
  static CAPTURES = new _ScoreName(() => $localize`0 captures`, () => $localize`1 capture`, (n) => $localize`${n} captures`);
  static REMAINING_PIECES = new _ScoreName(() => $localize`0 remaining pieces`, () => $localize`1 remaining piece`, (n) => $localize`${n} remaining pieces`);
  static PIECES_TO_DROP = new _ScoreName(() => $localize`0 pieces to drop`, () => $localize`1 piece to drop`, (n) => $localize`${n} pieces to drop`);
  static PROTECTED_PIECES = new _ScoreName(() => $localize`0 protected pieces`, () => $localize`1 protected piece`, (n) => $localize`${n} protected pieces`);
  static PIECES_UNDER_CONTROL = new _ScoreName(() => $localize`0 pieces under control`, () => $localize`1 piece under control`, (n) => $localize`${n} pieces under control`);
  static STACKS_UNDER_CONTROL = new _ScoreName(() => $localize`0 stacks under control`, () => $localize`1 stack under control`, (n) => $localize`${n} stacks under control`);
  /**
   * A score name might be differently written for zero, one, or more than one "points".
   * Zero might be plural like in english, but different in another language, like french where it is singular.
   */
  constructor(zero, singular, plural) {
    this.zero = zero;
    this.singular = singular;
    this.plural = plural;
  }
  getString(count) {
    switch (count) {
      case 0:
        return this.zero();
      case 1:
        return this.singular();
      default:
        return this.plural(count);
    }
  }
};

// games/dist/games/gos/GoPhase.js
var GoPhase = class _GoPhase {
  static PLAYING = new _GoPhase();
  static PASSED = new _GoPhase();
  static COUNTING = new _GoPhase();
  static ACCEPT = new _GoPhase();
  static FINISHED = new _GoPhase();
  constructor() {
  }
  toString() {
    switch (this) {
      case _GoPhase.PLAYING:
        return "PLAYING";
      case _GoPhase.PASSED:
        return "PASSED";
      case _GoPhase.COUNTING:
        return "COUNTING";
      case _GoPhase.ACCEPT:
        return "ACCEPT";
      case _GoPhase.FINISHED:
        return "FINISHED";
    }
    return "";
  }
  isPlaying() {
    return this === _GoPhase.PLAYING;
  }
  isPassed() {
    return this === _GoPhase.PASSED;
  }
  isCounting() {
    return this === _GoPhase.COUNTING;
  }
  isAccept() {
    return this === _GoPhase.ACCEPT;
  }
  isFinished() {
    return this === _GoPhase.FINISHED;
  }
  allowsPass() {
    return this.isFinished() === false;
  }
  getScoreName() {
    if (this.isPlaying() || this.isPassed()) {
      return ScoreName.CAPTURES;
    } else {
      return ScoreName.POINTS;
    }
  }
};

// games/dist/games/gos/AbstractGoRules.js
var __decorate6 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractGoRules = class AbstractGoRules2 extends ConfigurableRules {
  playOnIntersection;
  constructor(playOnIntersection) {
    super();
    this.playOnIntersection = playOnIntersection;
  }
  getZoom(_config) {
    return 1;
  }
  getNewKo(move, newBoard, goLegalityInformation, config) {
    if (goLegalityInformation.uniqueCapture.isPresent()) {
      const captured = goLegalityInformation.uniqueCapture.get();
      const capturerCoord = move.coord;
      const capturer = newBoard[capturerCoord.y][capturerCoord.x];
      const maxZoom = this.getZoom(config);
      for (let zoom = 1; zoom <= maxZoom; zoom++) {
        const goGroupDataFactory = this.getGoGroupDataFactory(zoom);
        const capturersInfo = goGroupDataFactory.getGroupData(capturerCoord, newBoard);
        const capturersFreedoms = capturersInfo.emptyCoords;
        const capturersGroup = GoPiece.pieceBelongTo(capturer, Player.ZERO) ? capturersInfo.darkCoords : capturersInfo.lightCoords;
        if (capturersFreedoms.length === 1 && capturersFreedoms[0].equals(captured) && capturersGroup.length === 1) {
          return MGPOptional.of(captured);
        }
      }
    }
    return MGPOptional.empty();
  }
  markTerritoryAndCount(state) {
    const resultingBoard = state.getCopiedBoard();
    const emptyZones = this.getTerritoryLikeGroup(state);
    const captured = state.getCapturedCopy();
    for (const emptyZone of emptyZones) {
      const pointMaker = emptyZone.getWrapper();
      if (pointMaker === GoPiece.LIGHT) {
        captured.add(Player.ONE, emptyZone.emptyCoords.length);
        for (const territory of emptyZone.getCoords()) {
          resultingBoard[territory.y][territory.x] = GoPiece.LIGHT_TERRITORY;
        }
      } else {
        Utils.assert(pointMaker === GoPiece.DARK, "territory should be wrapped by dark or light, not by " + pointMaker.toString());
        captured.add(Player.ZERO, emptyZone.emptyCoords.length);
        for (const territory of emptyZone.getCoords()) {
          resultingBoard[territory.y][territory.x] = GoPiece.DARK_TERRITORY;
        }
      }
    }
    return state.withBoard(resultingBoard).withCaptures(captured);
  }
  removeAndSubtractTerritory(state) {
    const resultingBoard = state.getCopiedBoard();
    const captured = state.getCapturedCopy();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      if (coordAndContent.content.isTerritory()) {
        resultingBoard[coord.y][coord.x] = GoPiece.EMPTY;
        const owner = coordAndContent.content.getOwner();
        captured.add(owner, -1);
      }
    }
    return state.withBoard(resultingBoard).withCaptures(captured);
  }
  getEmptyZones(deadlessState) {
    return this.getGoGroupDataFactory(1).getGroupsDataWhere(deadlessState.getCopiedBoard(), (piece) => piece.isEmpty());
  }
  switchLiveness(groupCoord, switchedState, zoom) {
    const switchedBoard = switchedState.getCopiedBoard();
    const switchedPiece = switchedBoard[groupCoord.y][groupCoord.x];
    Utils.assert(switchedPiece.isOccupied(), `Can't switch emptyness aliveness`);
    const goGroupDataFactory = this.getGoGroupDataFactory(zoom);
    const group = goGroupDataFactory.getGroupData(groupCoord, switchedBoard);
    const captured = switchedState.getCapturedCopy();
    switch (group.color) {
      case GoPiece.DEAD_DARK:
        captured.add(Player.ONE, -2 * group.deadDarkCoords.length);
        for (const deadDarkCoord of group.deadDarkCoords) {
          switchedBoard[deadDarkCoord.y][deadDarkCoord.x] = GoPiece.DARK;
        }
        break;
      case GoPiece.DEAD_LIGHT:
        captured.add(Player.ZERO, -2 * group.deadLightCoords.length);
        for (const deadLightCoord of group.deadLightCoords) {
          switchedBoard[deadLightCoord.y][deadLightCoord.x] = GoPiece.LIGHT;
        }
        break;
      case GoPiece.LIGHT:
        captured.add(Player.ZERO, 2 * group.lightCoords.length);
        for (const lightCoord of group.lightCoords) {
          switchedBoard[lightCoord.y][lightCoord.x] = GoPiece.DEAD_LIGHT;
        }
        break;
      default:
        Utils.expectToBe(group.color, GoPiece.DARK);
        captured.add(Player.ONE, 2 * group.darkCoords.length);
        for (const darkCoord of group.darkCoords) {
          switchedBoard[darkCoord.y][darkCoord.x] = GoPiece.DEAD_DARK;
        }
        break;
    }
    return switchedState.withBoard(switchedBoard).withCaptures(captured);
  }
  isPass(move) {
    return move.equals(GoMove.PASS);
  }
  isAccept(move) {
    return move.equals(GoMove.ACCEPT);
  }
  isLegalDeadMarking(move, state) {
    return state.getPieceAt(move.coord).isOccupied() && (state.phase.isCounting() || state.phase.isAccept());
  }
  isLegalDrop(move, state, config) {
    if (this.isKo(move, state)) {
      return MGPFallible.failure(GoFailure.ILLEGAL_KO());
    }
    if (state.phase.isCounting() || state.phase.isAccept()) {
      state = this.resurrectStones(state);
    }
    const goLegalityInformation = this.applyCaptures(move, state, config);
    const postCaptureState = goLegalityInformation.postCaptureState;
    const droppedPieceHasFreedom = this.doesPieceHaveFreedoms(move.coord, postCaptureState.withPieceAt(move.coord, GoPiece.ofPlayer(postCaptureState.getCurrentPlayer())), config);
    if (droppedPieceHasFreedom) {
      return MGPFallible.success(goLegalityInformation);
    } else {
      return MGPFallible.failure(GoFailure.CANNOT_COMMIT_SUICIDE());
    }
  }
  doesPieceHaveFreedoms(coord, state, config) {
    const boardCopy = state.getCopiedBoard();
    boardCopy[coord.y][coord.x] = GoPiece.ofPlayer(state.getCurrentPlayer());
    const maxZoom = this.getZoom(config);
    for (let zoom = 1; zoom <= maxZoom; zoom++) {
      const goGroupDataFactory = this.getGoGroupDataFactory(zoom);
      const goGroupsData = goGroupDataFactory.getGroupData(coord, boardCopy);
      const isSuicide = goGroupsData.emptyCoords.length === 0;
      if (isSuicide) {
        return false;
      }
    }
    return true;
  }
  isKo(move, state) {
    if (state.koCoord.isPresent()) {
      return move.coord.equals(state.koCoord.get());
    } else {
      return false;
    }
  }
  /**
   * will remove captured pieces
   * will add captured pieces count to captures
   * will return an optional coord if there is a coord that is the only capture
   * (if there is strictly one capture, optional will be present, else it'll be absent)
   */
  applyCaptures(move, state, config) {
    const captureds = [];
    const maxZoom = this.getZoom(config);
    for (let zoom = 1; zoom <= maxZoom; zoom++) {
      const goGroupDataFactory = this.getGoGroupDataFactory(zoom);
      for (const direction of goGroupDataFactory.getDirections(move.coord)) {
        const captures = this.getCapturedInDirection(move.coord, direction, state, goGroupDataFactory);
        captureds.push(...captures);
      }
    }
    const capturedSet = new Set2(captureds);
    let resultingState = state;
    for (const captured of capturedSet) {
      resultingState = resultingState.withPieceAt(captured, GoPiece.EMPTY);
    }
    resultingState = resultingState.withAddedCaptures(resultingState.getCurrentPlayer(), capturedSet.size());
    return {
      postCaptureState: resultingState,
      uniqueCapture: capturedSet.size() === 1 ? MGPOptional.of(capturedSet.getAnyElement().get()) : MGPOptional.empty()
    };
  }
  getCapturedInDirection(coord, vector, state, goGroupDataFactory) {
    const neightbooringCoord = coord.getNext(vector);
    const copiedBoard = state.getCopiedBoard();
    if (this.isReachable(neightbooringCoord, state)) {
      const opponent = GoPiece.ofPlayer(state.getCurrentOpponent());
      if (state.getPieceAt(neightbooringCoord) === opponent) {
        Debug.display("GoRules", "getCapturedInDirection", "a group could be captured");
        const neightbooringGroup = goGroupDataFactory.getGroupData(neightbooringCoord, copiedBoard);
        const koCoord = state.koCoord;
        if (this.isCapturableGroup(neightbooringGroup, koCoord)) {
          Debug.display("GoRules", "getCapturedInDirection", {
            neightbooringGroupCoord: neightbooringGroup.getCoords(),
            message: "is capturable"
          });
          return neightbooringGroup.getCoords();
        }
      }
    }
    return [];
  }
  isReachable(coord, state) {
    return state.hasInequalPieceAt(coord, GoPiece.UNREACHABLE);
  }
  isCapturableGroup(groupData, koCoord) {
    if (groupData.color.isOccupied() && groupData.emptyCoords.length === 1) {
      return koCoord.equalsValue(groupData.emptyCoords[0]) === false;
    } else {
      return false;
    }
  }
  getTerritoryLikeGroup(state) {
    const emptyGroups = this.getEmptyZones(state);
    return emptyGroups.filter((currentGroup) => currentGroup.isMonoWrapped());
  }
  applyPass(state) {
    const originalPhase = state.phase;
    Utils.assert(originalPhase.isPlaying() || originalPhase.isPassed(), "Cannot pass in counting phase!");
    const newPhase = originalPhase.isPassed() ? GoPhase.COUNTING : GoPhase.PASSED;
    let passedState = state.incrementTurn().withKo(MGPOptional.empty()).withPhase(newPhase);
    if (originalPhase.isPassed()) {
      passedState = this.markTerritoryAndCount(passedState);
    }
    return passedState;
  }
  applyLegalAccept(state) {
    const phase = state.phase.isCounting() ? GoPhase.ACCEPT : GoPhase.FINISHED;
    return state.incrementTurn().withKo(MGPOptional.empty()).withPhase(phase);
  }
  applyNormalLegalMove(legalMove, goLegalityInformation, config) {
    let state = goLegalityInformation.postCaptureState;
    if (state.phase.isCounting() || state.phase.isAccept()) {
      state = this.resurrectStones(state);
    }
    const currentPlayer = state.getCurrentPlayer();
    const currentPlayerPiece = GoPiece.ofPlayer(currentPlayer);
    const postDropState = state.withPieceAt(legalMove.coord, currentPlayerPiece);
    const newKoCoord = this.getNewKo(legalMove, postDropState.getCopiedBoard(), goLegalityInformation, config);
    const newCaptured = state.captured;
    return postDropState.withCaptures(newCaptured).incrementTurn().withKo(newKoCoord).withPhase(GoPhase.PLAYING);
  }
  resurrectStones(state) {
    for (let y = 0; y < state.getHeight(); y++) {
      for (let x = 0; x < state.getWidth(); x++) {
        if (state.getPieceAtXY(x, y).isDead()) {
          state = this.switchLiveness(new Coord(x, y), state, 1);
        }
      }
    }
    return this.removeAndSubtractTerritory(state);
  }
  applyDeadMarkingMove(legalMove, state) {
    const territorylessState = this.removeAndSubtractTerritory(state);
    const switchedState = this.switchLiveness(legalMove.coord, territorylessState, 1);
    const resultingState = switchedState.incrementTurn().withKo(MGPOptional.empty()).withPhase(GoPhase.COUNTING);
    return this.markTerritoryAndCount(resultingState);
  }
  isLegal(move, state, config) {
    const defaultSuccess = MGPFallible.success({
      postCaptureState: state,
      uniqueCapture: MGPOptional.empty()
    });
    if (this.isPass(move)) {
      const playing = state.phase.isPlaying();
      const passed = state.phase.isPassed();
      Debug.display("GoRules", "isLegal", "at " + state.phase + (playing || passed ? " forbid" : " allowed") + " passing on " + state.getCopiedBoard());
      if (playing || passed) {
        return defaultSuccess;
      } else {
        return MGPFallible.failure(GoFailure.CANNOT_PASS_AFTER_PASSED_PHASE());
      }
    } else if (this.isAccept(move)) {
      const counting = state.phase.isCounting();
      const accept = state.phase.isAccept();
      if (counting || accept) {
        return defaultSuccess;
      } else {
        return MGPFallible.failure(GoFailure.CANNOT_ACCEPT_BEFORE_COUNTING_PHASE());
      }
    } else if (state.getPieceAt(move.coord).isOccupied()) {
      Debug.display("GoRules", "isLegal", "move is marking");
      const legal = this.isLegalDeadMarking(move, state);
      if (legal) {
        return defaultSuccess;
      } else {
        if (this.playOnIntersection) {
          return MGPFallible.failure(GoFailure.OCCUPIED_INTERSECTION());
        } else {
          return MGPFallible.failure(GoFailure.OCCUPIED_SPACE());
        }
      }
    } else {
      Debug.display("GoRules", "isLegal", "move is normal stuff: " + move.toString());
      return this.isLegalDrop(move, state, config);
    }
  }
  applyLegalMove(legalMove, state, config, infos) {
    if (this.isPass(legalMove)) {
      return this.applyPass(state);
    } else if (this.isAccept(legalMove)) {
      return this.applyLegalAccept(state);
    } else if (this.isLegalDeadMarking(legalMove, state)) {
      return this.applyDeadMarkingMove(legalMove, state);
    } else {
      return this.applyNormalLegalMove(legalMove, infos, config);
    }
  }
  getGameStatus(node) {
    const state = node.gameState;
    if (state.phase.isFinished()) {
      const captured = state.captured;
      const capturedZero = captured.get(Player.ZERO);
      const capturedOne = captured.get(Player.ONE);
      if (capturedOne < capturedZero) {
        return GameStatus.ZERO_WON;
      } else if (capturedZero < capturedOne) {
        return GameStatus.ONE_WON;
      } else {
        return GameStatus.DRAW;
      }
    } else {
      return GameStatus.ONGOING;
    }
  }
};
AbstractGoRules = __decorate6([
  Debug.log
], AbstractGoRules);

// games/dist/jscaip/BoardData.js
var __decorate7 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GroupDataFactory = class GroupDataFactory2 {
  getGroupData(coord, board) {
    const color = board[coord.y][coord.x];
    const groupDatas = this.getNewInstance(color);
    return this._getGroupDatas(coord, board, groupDatas);
  }
  _getGroupDatas(coord, board, groupDatas) {
    const color = board[coord.y][coord.x];
    groupDatas.addPawn(coord, color);
    if (color === groupDatas.color) {
      for (const direction of this.getDirections(coord)) {
        const nextCoord = coord.getNext(direction);
        if (nextCoord.isInRange(board[0].length, board.length)) {
          if (groupDatas.contains(nextCoord) === false) {
            groupDatas = this._getGroupDatas(nextCoord, board, groupDatas);
          }
        }
      }
    }
    return groupDatas;
  }
  getGroupsDataWhere(board, condition) {
    const groups = [];
    let coord;
    let group;
    let currentSpace;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        coord = new Coord(x, y);
        currentSpace = board[y][x];
        if (condition(currentSpace)) {
          if (groups.some((currentGroup) => currentGroup.selfContains(coord)) === false) {
            group = this.getGroupData(coord, board);
            groups.push(group);
          }
        }
      }
    }
    return groups;
  }
};
GroupDataFactory = __decorate7([
  Debug.log
], GroupDataFactory);
var GroupData = class {
  color;
  constructor(color) {
    this.color = color;
  }
  selfContains(coord) {
    const ownCoords = this.getCoords();
    return ownCoords.some((c) => c.equals(coord));
  }
  static insert(list, coord) {
    if (list.length === 0) {
      return [coord];
    } else {
      const first = list[0];
      if (coord.compareTo(first) < 0) {
        return [coord].concat(list);
      } else {
        return list.concat([coord]);
      }
    }
  }
};

// games/dist/games/gos/GoGroupsData.js
var GoGroupData = class extends GroupData {
  emptyCoords;
  darkCoords;
  lightCoords;
  deadDarkCoords;
  deadLightCoords;
  unreachableCoords;
  constructor(color, emptyCoords, darkCoords, lightCoords, deadDarkCoords, deadLightCoords, unreachableCoords) {
    super(color);
    this.emptyCoords = emptyCoords;
    this.darkCoords = darkCoords;
    this.lightCoords = lightCoords;
    this.deadDarkCoords = deadDarkCoords;
    this.deadLightCoords = deadLightCoords;
    this.unreachableCoords = unreachableCoords;
  }
  getCoords() {
    if (this.color === GoPiece.DARK) {
      return this.darkCoords;
    } else if (this.color === GoPiece.LIGHT) {
      return this.lightCoords;
    } else if (this.color === GoPiece.DEAD_DARK) {
      return this.deadDarkCoords;
    } else if (this.color === GoPiece.DEAD_LIGHT) {
      return this.deadLightCoords;
    } else {
      return this.emptyCoords;
    }
  }
  contains(coord) {
    const allCoords = this.darkCoords.concat(this.lightCoords).concat(this.emptyCoords).concat(this.deadDarkCoords).concat(this.deadLightCoords).concat(this.unreachableCoords);
    return allCoords.some((c) => c.equals(coord));
  }
  addPawn(coord, color) {
    Utils.assert(this.contains(coord) === false, "This group already contains " + coord.toString());
    switch (color) {
      case GoPiece.DARK:
        this.darkCoords = GroupData.insert(this.darkCoords, coord);
        break;
      case GoPiece.LIGHT:
        this.lightCoords = GroupData.insert(this.lightCoords, coord);
        break;
      case GoPiece.DEAD_DARK:
        this.deadDarkCoords = GroupData.insert(this.deadDarkCoords, coord);
        break;
      case GoPiece.DEAD_LIGHT:
        this.deadLightCoords = GroupData.insert(this.deadLightCoords, coord);
        break;
      case GoPiece.UNREACHABLE:
        this.unreachableCoords = GroupData.insert(this.unreachableCoords, coord);
        break;
      default:
        Utils.expectToBeMultiple(color, [
          GoPiece.EMPTY,
          GoPiece.DARK_TERRITORY,
          GoPiece.LIGHT_TERRITORY
        ]);
        this.emptyCoords = GroupData.insert(this.emptyCoords, coord);
    }
  }
  isMonoWrapped() {
    const darkWrapper = this.darkCoords.length + this.deadLightCoords.length === 0 ? 0 : 1;
    const lightWrapper = this.lightCoords.length + this.deadDarkCoords.length === 0 ? 0 : 1;
    return darkWrapper + lightWrapper === 1;
  }
  getWrapper() {
    const wrapperSizes = new MGPMap();
    wrapperSizes.set(GoPiece.EMPTY, this.emptyCoords.length);
    wrapperSizes.set(GoPiece.DARK, this.darkCoords.length + this.deadLightCoords.length);
    wrapperSizes.set(GoPiece.LIGHT, this.lightCoords.length + this.deadDarkCoords.length);
    wrapperSizes.put(this.color.nonTerritory(), 0);
    const nonEmptyWrapper = wrapperSizes.filter((_key, value) => value > 0);
    Utils.assert(nonEmptyWrapper.size() === 1, `Can't call getWrapper on non-mono-wrapped group`);
    return nonEmptyWrapper.getAnyPair().get().key;
  }
  getNeighborsEntryPoints() {
    const neighborsEntryPoints = [];
    if (this.color !== GoPiece.EMPTY && this.emptyCoords.length > 0) {
      neighborsEntryPoints.push(this.emptyCoords[0]);
    }
    if (this.color !== GoPiece.DARK && this.darkCoords.length > 0) {
      neighborsEntryPoints.push(this.darkCoords[0]);
    }
    if (this.color !== GoPiece.LIGHT && this.lightCoords.length > 0) {
      neighborsEntryPoints.push(this.lightCoords[0]);
    }
    if (this.color !== GoPiece.DEAD_DARK && this.deadDarkCoords.length > 0) {
      neighborsEntryPoints.push(this.deadDarkCoords[0]);
    }
    if (this.color !== GoPiece.DEAD_LIGHT && this.deadLightCoords.length > 0) {
      neighborsEntryPoints.push(this.deadLightCoords[0]);
    }
    return neighborsEntryPoints;
  }
};

// games/dist/games/gos/GoGroupDataFactory.js
var GoGroupDataFactory = class extends GroupDataFactory {
  getNewInstance(color) {
    return new GoGroupData(color, [], [], [], [], [], []);
  }
};
var OrthogonalGoGroupDataFactory = class extends GoGroupDataFactory {
  zoom;
  constructor(zoom) {
    super();
    this.zoom = zoom;
  }
  getDirections(_) {
    return Orthogonal.ORTHOGONALS.map((value) => new Vector(0, 0).combine(value, this.zoom));
  }
};
var TriangularGoGroupDataFactory = class extends GoGroupDataFactory {
  getDirections(coord) {
    return TriangularCheckerBoard.getDirections(coord);
  }
};
var HexagonalGoGroupDataFactory = class extends GoGroupDataFactory {
  getDirections(_) {
    return HexaDirection.factory.all;
  }
};

// games/dist/games/gos/GoState.js
var GoState = class _GoState extends GameStateWithTable {
  static of(oldState, newBoard) {
    return oldState.withBoard(newBoard);
  }
  koCoord;
  captured;
  phase;
  constructor(board, captured, turn, koCoord, phase) {
    super(board, turn);
    this.captured = captured;
    this.captured.makeImmutable();
    this.koCoord = koCoord;
    this.phase = phase;
  }
  getCapturedCopy() {
    return this.captured.getCopy();
  }
  static getStartingBoard(width, height) {
    return TableUtils.create(width, height, GoPiece.EMPTY);
  }
  isDead(coord) {
    return this.getPieceAt(coord).isDead();
  }
  isTerritory(coord) {
    return this.getPieceAt(coord).isTerritory();
  }
  withBoard(board) {
    return new _GoState(board, this.captured, this.turn, this.koCoord, this.phase);
  }
  incrementTurn() {
    return new _GoState(this.board, this.captured, this.turn + 1, this.koCoord, this.phase);
  }
  withCaptures(newCaptured) {
    return new _GoState(this.board, newCaptured, this.turn, this.koCoord, this.phase);
  }
  withAddedCaptures(player, captures) {
    const newCaptured = this.getCapturedCopy();
    newCaptured.add(player, captures);
    return this.withCaptures(newCaptured);
  }
  withKo(newKo) {
    return new _GoState(this.board, this.captured, this.turn, newKo, this.phase);
  }
  withPhase(newPhase) {
    return new _GoState(this.board, this.captured, this.turn, this.koCoord, newPhase);
  }
  withPieceAt(coord, value) {
    return GameStateWithTable.setPieceAt(this, coord, value, _GoState.of);
  }
};

// games/dist/jscaip/GobanUtils.js
var GobanUtils = class _GobanUtils {
  static getHoshis(width, height) {
    let hoshis = new Set2();
    if (width < 5 || height < 5) {
      return [];
    }
    const horizontalMiddle = _GobanUtils.getHorizontalCenter(width);
    const verticalMiddle = _GobanUtils.getVerticalCenter(height);
    const left = _GobanUtils.getHorizontalLeft(width);
    const up = _GobanUtils.getVerticalUp(height);
    const right = _GobanUtils.getHorizontalRight(width);
    const down = _GobanUtils.getVerticalDown(height);
    if (12 < height && height % 2 === 1) {
      hoshis = hoshis.addElement(new Coord(left, verticalMiddle)).addElement(new Coord(right, verticalMiddle));
    }
    if (12 < width && width % 2 === 1) {
      hoshis = hoshis.addElement(new Coord(horizontalMiddle, up)).addElement(new Coord(horizontalMiddle, down));
    }
    if (width % 2 === 1 && height % 2 === 1) {
      hoshis = hoshis.addElement(new Coord(horizontalMiddle, verticalMiddle));
    }
    hoshis = hoshis.addElement(new Coord(left, up)).addElement(new Coord(left, down)).addElement(new Coord(right, up)).addElement(new Coord(right, down));
    return hoshis.toList();
  }
  static getHorizontalLeft(width) {
    return width < 12 ? 2 : 3;
  }
  static getHorizontalCenter(width) {
    return Math.floor(width / 2);
  }
  static getHorizontalRight(width) {
    const left = _GobanUtils.getHorizontalLeft(width);
    return width - (left + 1);
  }
  static getVerticalUp(height) {
    return height < 12 ? 2 : 3;
  }
  static getVerticalCenter(height) {
    return Math.floor(height / 2);
  }
  static getVerticalDown(height) {
    const up = _GobanUtils.getVerticalUp(height);
    return height - (up + 1);
  }
};

// games/dist/games/gos/abstract-rectangular-go/AbstractRectangularGoRules.js
var AbstractRectangularGoRules = class extends AbstractGoRules {
  getZoom(config) {
    return config.zoom;
  }
  getInitialState(config) {
    const board = GoState.getStartingBoard(config.width, config.height);
    let turn = 0;
    const left = GobanUtils.getHorizontalLeft(config.width);
    const right = GobanUtils.getHorizontalRight(config.width);
    const up = GobanUtils.getVerticalUp(config.height);
    const down = GobanUtils.getVerticalDown(config.height);
    const horizontalCenter = GobanUtils.getHorizontalCenter(config.width);
    const verticalCenter = GobanUtils.getVerticalCenter(config.height);
    const orderedHandicaps = [
      new Coord(left, up),
      new Coord(right, down),
      new Coord(right, up),
      new Coord(left, down),
      new Coord(horizontalCenter, verticalCenter),
      new Coord(horizontalCenter, up),
      new Coord(horizontalCenter, down),
      new Coord(left, verticalCenter),
      new Coord(right, verticalCenter)
    ];
    if (1 <= config.handicap) {
      turn = 1;
    }
    for (let i = 0; i < config.handicap; i++) {
      const handicapToPut = orderedHandicaps[i];
      board[handicapToPut.y][handicapToPut.x] = GoPiece.DARK;
    }
    return new GoState(board, PlayerNumberMap.of(0, 0), turn, MGPOptional.empty(), GoPhase.PLAYING);
  }
  getGoGroupDataFactory(zoom) {
    return new OrthogonalGoGroupDataFactory(zoom);
  }
};

// games/dist/games/gos/go/GoRules.js
var GoRules = class _GoRules extends AbstractRectangularGoRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`19 x 19`,
    config: {
      width: new NumberConfig(19, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      height: new NumberConfig(19, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(1, 99)),
      handicap: new NumberConfig(0, () => $localize`Handicap`, MGPValidators.range(0, 9)),
      zoom: new NumberConfig(1, () => $localize`Zoom`, MGPValidators.range(1, 5)),
      showZooms: new BooleanConfig(false, () => $localize`Show zooms`)
    }
  }, [{
    name: () => $localize`13 x 13`,
    config: {
      width: 13,
      height: 13,
      handicap: 0,
      zoom: 1,
      showZooms: false
    }
  }, {
    name: () => $localize`9 x 9`,
    config: {
      width: 9,
      height: 9,
      handicap: 0,
      zoom: 1,
      showZooms: false
    }
  }]);
  static get() {
    if (_GoRules.singleton.isAbsent()) {
      _GoRules.singleton = MGPOptional.of(new _GoRules());
    }
    return _GoRules.singleton.get();
  }
  constructor() {
    super(true);
  }
  getRulesConfigDescription() {
    return _GoRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/gos/go/GoHeuristic.js
var GoHeuristic = class extends AbstractGoHeuristic {
  constructor() {
    super(GoRules.get());
  }
};

// games/dist/games/gos/go/GoMoveGenerator.js
var GoMoveGenerator = class extends AbstractGoMoveGenerator {
  constructor() {
    super(GoRules.get());
  }
};

// games/dist/games/gos/hexagonal-go/HexagonalGoRules.js
var HexagonalGoRules = class _HexagonalGoRules extends AbstractGoRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Standard`,
    config: {
      size: new NumberConfig(7, RulesConfigDescriptionLocalizable.SIZE, MGPValidators.range(1, 99))
    }
  });
  static get() {
    if (_HexagonalGoRules.singleton.isAbsent()) {
      _HexagonalGoRules.singleton = MGPOptional.of(new _HexagonalGoRules());
    }
    return _HexagonalGoRules.singleton.get();
  }
  constructor() {
    super(false);
  }
  getInitialState(config) {
    const size = config.size;
    const boardSize = size * 2 - 1;
    const maximumDiagonalIndex = 3 * size - 2;
    const board = TableUtils.create(boardSize, boardSize, GoPiece.UNREACHABLE);
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        const diagonalIndex = x + y;
        if (size - 2 < diagonalIndex && diagonalIndex < maximumDiagonalIndex) {
          board[y][x] = GoPiece.EMPTY;
        }
      }
    }
    return new GoState(board, PlayerNumberMap.of(0, 0), 0, MGPOptional.empty(), GoPhase.PLAYING);
  }
  getRulesConfigDescription() {
    return _HexagonalGoRules.RULES_CONFIG_DESCRIPTION;
  }
  getGoGroupDataFactory(_) {
    return new HexagonalGoGroupDataFactory();
  }
};

// games/dist/games/gos/hexagonal-go/HexagonalGoHeuristic.js
var HexagonalGoHeuristic = class extends AbstractGoHeuristic {
  constructor() {
    super(HexagonalGoRules.get());
  }
};

// games/dist/games/gos/hexagonal-go/HexagonalGoMoveGenerator.js
var HexagonalGoMoveGenerator = class extends AbstractGoMoveGenerator {
  constructor() {
    super(HexagonalGoRules.get());
  }
};

// games/dist/games/gos/triangular-go/TriangularGoRules.js
var TriangularGoRules = class _TriangularGoRules extends AbstractGoRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Standard`,
    config: {
      size: new NumberConfig(7, RulesConfigDescriptionLocalizable.SIZE, MGPValidators.range(1, 99)),
      hexagonal: new BooleanConfig(false, () => $localize`Hexagonal`)
    }
  });
  static get() {
    if (_TriangularGoRules.singleton.isAbsent()) {
      _TriangularGoRules.singleton = MGPOptional.of(new _TriangularGoRules());
    }
    return _TriangularGoRules.singleton.get();
  }
  constructor() {
    super(false);
  }
  getInitialState(config) {
    const size = config.size;
    let board;
    if (config.hexagonal) {
      board = HexagonalUtils.createBoard(size, GoPiece.UNREACHABLE, GoPiece.EMPTY);
    } else {
      board = TriangularCheckerBoard.createBoard(size, GoPiece.UNREACHABLE, GoPiece.EMPTY);
    }
    return new GoState(board, PlayerNumberMap.of(0, 0), 0, MGPOptional.empty(), GoPhase.PLAYING);
  }
  getRulesConfigDescription() {
    return _TriangularGoRules.RULES_CONFIG_DESCRIPTION;
  }
  getGoGroupDataFactory() {
    return new TriangularGoGroupDataFactory();
  }
};

// games/dist/games/gos/triangular-go/TriangularGoHeuristic.js
var TriangularGoHeuristic = class extends AbstractGoHeuristic {
  constructor() {
    super(TriangularGoRules.get());
  }
};

// games/dist/games/gos/triangular-go/TriangularGoMoveGenerator.js
var TriangularGoMoveGenerator = class extends AbstractGoMoveGenerator {
  constructor() {
    super(TriangularGoRules.get());
  }
};

// games/dist/games/gos/zoomed-go/ZoomedGoRules.js
var ZoomedGoRules = class _ZoomedGoRules extends AbstractRectangularGoRules {
  static singleton = MGPOptional.empty();
  static zoom(z) {
    return $localize`Zoom ${z}`;
  }
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => _ZoomedGoRules.zoom(3) + " " + $localize`(medium)`,
    config: {
      width: new NumberConfig(12, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      height: new NumberConfig(12, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(1, 99)),
      handicap: new NumberConfig(0, () => $localize`Handicap`, MGPValidators.range(0, 9)),
      zoom: new NumberConfig(3, () => $localize`Zoom`, MGPValidators.range(1, 5)),
      showZooms: new BooleanConfig(true, () => $localize`Show zooms`)
    }
  }, [
    {
      name: () => _ZoomedGoRules.zoom(2) + " " + $localize`(small)`,
      config: {
        width: 6,
        height: 6,
        handicap: 0,
        zoom: 2,
        showZooms: true
      }
    },
    {
      name: () => _ZoomedGoRules.zoom(2) + " " + $localize`(medium)`,
      config: {
        width: 10,
        height: 10,
        handicap: 0,
        zoom: 2,
        showZooms: true
      }
    },
    {
      name: () => _ZoomedGoRules.zoom(2) + " " + $localize`(large)`,
      config: {
        width: 14,
        height: 14,
        handicap: 0,
        zoom: 2,
        showZooms: true
      }
    },
    {
      name: () => _ZoomedGoRules.zoom(3) + " " + $localize`(small)`,
      config: {
        width: 6,
        height: 6,
        handicap: 0,
        zoom: 3,
        showZooms: true
      }
    },
    {
      name: () => _ZoomedGoRules.zoom(3) + " " + $localize`(large)`,
      config: {
        width: 18,
        height: 18,
        handicap: 0,
        zoom: 3,
        showZooms: true
      }
    }
  ]);
  static get() {
    if (_ZoomedGoRules.singleton.isAbsent()) {
      _ZoomedGoRules.singleton = MGPOptional.of(new _ZoomedGoRules());
    }
    return _ZoomedGoRules.singleton.get();
  }
  constructor() {
    super(true);
  }
  getRulesConfigDescription() {
    return _ZoomedGoRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/jscaip/DodecaHexaDirection.js
var DodecaHexaDirection = class _DodecaHexaDirection extends Direction {
  static DIRECTION_000 = new _DodecaHexaDirection(0, -1);
  static DIRECTION_030 = new _DodecaHexaDirection(1, -2);
  static DIRECTION_060 = new _DodecaHexaDirection(1, -1);
  static DIRECTION_090 = new _DodecaHexaDirection(2, -1);
  static DIRECTION_120 = new _DodecaHexaDirection(1, 0);
  static DIRECTION_150 = new _DodecaHexaDirection(1, 1);
  static DIRECTION_180 = new _DodecaHexaDirection(0, 1);
  static DIRECTION_210 = new _DodecaHexaDirection(-1, 2);
  static DIRECTION_240 = new _DodecaHexaDirection(-1, 1);
  static DIRECTION_270 = new _DodecaHexaDirection(-2, 1);
  static DIRECTION_300 = new _DodecaHexaDirection(-1, 0);
  static DIRECTION_330 = new _DodecaHexaDirection(-1, -1);
  static factory = new class extends DirectionFactory {
    all = [
      _DodecaHexaDirection.DIRECTION_000,
      _DodecaHexaDirection.DIRECTION_030,
      _DodecaHexaDirection.DIRECTION_060,
      _DodecaHexaDirection.DIRECTION_090,
      _DodecaHexaDirection.DIRECTION_120,
      _DodecaHexaDirection.DIRECTION_150,
      _DodecaHexaDirection.DIRECTION_180,
      _DodecaHexaDirection.DIRECTION_210,
      _DodecaHexaDirection.DIRECTION_240,
      _DodecaHexaDirection.DIRECTION_270,
      _DodecaHexaDirection.DIRECTION_300,
      _DodecaHexaDirection.DIRECTION_330
    ];
  }();
  static encoder = Encoder.fromFunctions((direction) => {
    switch (direction) {
      case _DodecaHexaDirection.DIRECTION_000:
        return 0;
      case _DodecaHexaDirection.DIRECTION_030:
        return 1;
      case _DodecaHexaDirection.DIRECTION_060:
        return 2;
      case _DodecaHexaDirection.DIRECTION_090:
        return 3;
      case _DodecaHexaDirection.DIRECTION_120:
        return 4;
      case _DodecaHexaDirection.DIRECTION_150:
        return 5;
      case _DodecaHexaDirection.DIRECTION_180:
        return 6;
      case _DodecaHexaDirection.DIRECTION_210:
        return 7;
      case _DodecaHexaDirection.DIRECTION_240:
        return 8;
      case _DodecaHexaDirection.DIRECTION_270:
        return 9;
      case _DodecaHexaDirection.DIRECTION_300:
        return 10;
      default:
        Utils.expectToBe(direction, _DodecaHexaDirection.DIRECTION_330);
        return 11;
    }
  }, (encoded) => {
    Utils.assert(0 <= encoded && encoded <= 11, "Invalid encoded number for DodecaHexaDirection " + encoded);
    return _DodecaHexaDirection.factory.all[encoded];
  });
  getAngle() {
    switch (this) {
      case _DodecaHexaDirection.DIRECTION_000:
        return 0;
      case _DodecaHexaDirection.DIRECTION_030:
        return 30;
      case _DodecaHexaDirection.DIRECTION_060:
        return 60;
      case _DodecaHexaDirection.DIRECTION_090:
        return 90;
      case _DodecaHexaDirection.DIRECTION_120:
        return 120;
      case _DodecaHexaDirection.DIRECTION_150:
        return 150;
      case _DodecaHexaDirection.DIRECTION_180:
        return 180;
      case _DodecaHexaDirection.DIRECTION_210:
        return 210;
      case _DodecaHexaDirection.DIRECTION_240:
        return 240;
      case _DodecaHexaDirection.DIRECTION_270:
        return 270;
      case _DodecaHexaDirection.DIRECTION_300:
        return 300;
      default:
        Utils.expectToBe(this, _DodecaHexaDirection.DIRECTION_330);
        return 330;
    }
  }
  getOpposite() {
    const opposite = _DodecaHexaDirection.factory.from(-this.x, -this.y);
    return opposite.get();
  }
  toString() {
    if (this.x === 1 && this.y === -2)
      return "DIRECTION_030";
    if (this.x === 2 && this.y === -1)
      return "DIRECTION_090";
    if (this.x === -1 && this.y === 2)
      return "DIRECTION_210";
    if (this.x === -2 && this.y === 1)
      return "DIRECTION_270";
    else
      return super.toString();
  }
};

// games/dist/games/hexodia/HexodiaRules.js
var HexodiaRules = class _HexodiaRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static helpers = new MGPMap();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Hexodia`,
    config: {
      size: new NumberConfig(12, RulesConfigDescriptionLocalizable.SIZE, MGPValidators.range(1, 99)),
      nInARow: new NumberConfig(6, RulesConfigDescriptionLocalizable.ALIGNMENT_SIZE, MGPValidators.range(1, 99)),
      numberOfDrops: new NumberConfig(2, RulesConfigDescriptionLocalizable.NUMBER_OF_DROPS, MGPValidators.range(1, 99))
    }
  });
  static get() {
    if (_HexodiaRules.singleton.isAbsent()) {
      _HexodiaRules.singleton = MGPOptional.of(new _HexodiaRules());
    }
    return _HexodiaRules.singleton.get();
  }
  static getHexodiaHelper(config) {
    return _HexodiaRules.getHexodiaHelperBySize(config.nInARow);
  }
  static getHexodiaHelperBySize(size) {
    if (_HexodiaRules.helpers.get(size).isAbsent()) {
      const helper = new AbstractNInARowHelper((piece) => piece.getPlayer(), size, DodecaHexaDirection.factory.all);
      _HexodiaRules.helpers.put(size, helper);
    }
    return _HexodiaRules.helpers.get(size).get();
  }
  static getVictoriousCoords(state, config) {
    return _HexodiaRules.getHexodiaHelper(config).getVictoriousCoord(state);
  }
  getRulesConfigDescription() {
    return _HexodiaRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const size = config.size;
    const boardSize = size * 2 - 1;
    const maximumDiagonalIndex = 3 * size - 2;
    const board = TableUtils.create(boardSize, boardSize, FourStatePiece.UNREACHABLE);
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        const diagonalIndex = x + y;
        if (size - 2 < diagonalIndex && diagonalIndex < maximumDiagonalIndex) {
          board[y][x] = FourStatePiece.EMPTY;
        }
      }
    }
    return new FourStatePieceGameStateWithTable(board, 0);
  }
  applyLegalMove(move, state) {
    const player = FourStatePiece.ofPlayer(state.getCurrentPlayer());
    const newBoard = state.getCopiedBoard();
    for (const coord of move.coords) {
      newBoard[coord.y][coord.x] = player;
    }
    return new FourStatePieceGameStateWithTable(newBoard, state.turn + 1);
  }
  isLegal(move, state, config) {
    const numberOfDrops = move.coords.size();
    if (state.turn === 0) {
      Utils.assert(numberOfDrops === 1, "HexodiaMove should only drop one piece at first turn");
    } else {
      const remainingSpaces = TableUtils.count(state.board, FourStatePiece.EMPTY);
      const requiredDrop = Math.min(remainingSpaces, config.numberOfDrops);
      Utils.assert(numberOfDrops === requiredDrop, "HexodiaMove should have exactly " + config.numberOfDrops + " drops (got " + numberOfDrops + ")");
    }
    return this.isLegalDrop(move, state);
  }
  isLegalDrop(move, state) {
    for (const coord of move.coords) {
      if (state.isNotOnBoard(coord)) {
        return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(coord));
      }
      if (state.getPieceAt(coord).isPlayer()) {
        return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SQUARE());
      }
    }
    return MGPValidation.SUCCESS;
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const victoriousCoord = _HexodiaRules.getVictoriousCoords(state, config);
    if (victoriousCoord.length > 0) {
      return GameStatus.getVictory(state.getCurrentOpponent());
    }
    if (TableUtils.contains(state.board, FourStatePiece.EMPTY)) {
      return GameStatus.ONGOING;
    } else {
      return GameStatus.DRAW;
    }
  }
};

// games/dist/games/hexodia/HexodiaAlignmentHeuristic.js
var HexodiaAlignmentHeuristic = class extends Heuristic {
  getBoardValue(node, config) {
    const state = node.gameState;
    let score = 0;
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const squareScore = HexodiaRules.getHexodiaHelper(config).getSquareScore(state, coordAndContent.coord);
      score += squareScore;
    }
    return BoardValue.of(score);
  }
};

// games/dist/games/hexodia/HexodiaMove.js
var HexodiaMove = class _HexodiaMove extends Move {
  coords;
  static of(coords) {
    return new _HexodiaMove(new CoordSet(coords));
  }
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder)], (move) => [move.coords.toList()], (value) => _HexodiaMove.of(value[0]));
  constructor(coords) {
    super();
    this.coords = coords;
  }
  toString() {
    return "HexodiaMove(" + this.coords.toList().map((coord) => coord.toString()).join(", ") + ")";
  }
  equals(other) {
    return this.coords.equals(other.coords);
  }
};

// games/dist/games/hexodia/HexodiaMoveGenerator.js
var HexodiaMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    if (node.gameState.turn === 0) {
      return this.getFirstMove(node.gameState);
    } else {
      return this.getListDrops(node);
    }
  }
  getFirstMove(state) {
    const width = state.getWidth();
    const height = state.getHeight();
    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);
    const center = new Coord(cx, cy);
    return [
      HexodiaMove.of([center])
    ];
  }
  getListDrops(node) {
    const availableFirstCoords = this.getAvailableCoords(node.gameState);
    const moves = [];
    for (const firstCoord of availableFirstCoords) {
      const board = node.gameState.getCopiedBoard();
      board[firstCoord.y][firstCoord.x] = FourStatePiece.ofPlayer(node.gameState.getCurrentPlayer());
      const stateAfterFirstDrops = new FourStatePieceGameStateWithTable(board, node.gameState.turn);
      const availableSecondCoords = this.getAvailableCoords(stateAfterFirstDrops);
      for (const secondCoord of availableSecondCoords) {
        const newMove = HexodiaMove.of([firstCoord, secondCoord]);
        moves.push(newMove);
      }
    }
    return new Set2(moves).toList();
  }
  getAvailableCoords(state) {
    const usefulCoordTable = this.getUsefulCoordsTable(state);
    const availableCoords = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      if (usefulCoordTable[coord.y][coord.x] && coordAndContent.content === FourStatePiece.EMPTY) {
        availableCoords.push(coord);
      }
    }
    return availableCoords;
  }
  /**
   * This function returns a table on which table[y][x] is true only if:
   *     (x, y) is empty but has occupied neighbors
   */
  getUsefulCoordsTable(state) {
    const width = state.getWidth();
    const height = state.getHeight();
    const usefulCoordTable = TableUtils.create(width, height, false);
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      this.addNeighboringCoord(usefulCoordTable, coordAndContent.coord);
    }
    return usefulCoordTable;
  }
  /**
   * mark the space neighboring coord as "space that have an occupied neighbor"
   * @param usefulCoordTable a map of the board which each space mapped to true if it has an occupied neighbor
   * @param coord the coord to add to this map
   */
  addNeighboringCoord(usefulCoordTable, coord) {
    const maxPossibleX = usefulCoordTable[0].length - 1;
    const maxPossibleY = usefulCoordTable.length - 1;
    const minX = Math.max(0, coord.x - 1);
    const minY = Math.max(0, coord.y - 1);
    const maxX = Math.min(maxPossibleX, coord.x + 1);
    const maxY = Math.min(maxPossibleY, coord.y + 1);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        usefulCoordTable[y][x] = true;
      }
    }
  }
};

// games/dist/games/hive/HiveFailure.js
var HiveFailure = class {
  static CANNOT_DROP_PIECE_YOU_DONT_HAVE = () => `You cannot drop a piece that you do not have in your reserve.`;
  static QUEEN_BEE_CAN_ONLY_MOVE_TO_DIRECT_NEIGHBORS = () => $localize`The queen bee can only move to one of its direct neighbors.`;
  static BEETLE_CAN_ONLY_MOVE_TO_DIRECT_NEIGHBORS = () => $localize`The beetle can only move to one of its direct neighbors.`;
  static GRASSHOPPER_MUST_MOVE_IN_STRAIGHT_LINE = () => $localize`The grasshopper must move in a straight line.`;
  static GRASSHOPPER_MUST_JUMP_OVER_PIECES = () => $localize`The grasshopper must jump over other pieces, without any empty spaces.`;
  static SPIDER_MUST_MOVE_ON_NEIGHBORING_SPACES = () => $localize`The spider must move on neighboring spaces.`;
  static SPIDER_CAN_ONLY_MOVE_WITH_DIRECT_CONTACT = () => $localize`The spider can only move around pieces that are in direct contact with it.`;
  static SPIDER_CANNOT_BACKTRACK = () => $localize`The spider cannot go twice through the same space in the same move.`;
  static QUEEN_BEE_MUST_BE_ON_BOARD_BEFORE_MOVE = () => $localize`The queen bee must be placed on the board before moving a piece.`;
  static THIS_PIECE_CANNOT_CLIMB = () => $localize`Only the beetle is allowed to climb over other pieces.`;
  static CANNOT_DISCONNECT_HIVE = () => $localize`You are not allowed to split the hive.`;
  static MUST_BE_ABLE_TO_SLIDE = () => $localize`This piece must be able to slide to its destination.`;
  static MUST_PLACE_QUEEN_BEE_LATEST_AT_FOURTH_TURN = () => $localize`You must place your queen bee at this turn!`;
  static CANNOT_DROP_NEXT_TO_OPPONENT = () => $localize`You cannot drop a piece next to one of your opponent's stack.`;
  static MUST_DROP_ON_EMPTY_SPACE = () => $localize`You must always drop your piece on an empty space.`;
  static MUST_BE_CONNECTED_TO_HIVE = () => $localize`The piece you are dropping must be connected to the hive.`;
};

// games/dist/games/hive/HivePiece.js
var HivePieceKindEncoder = Encoder.fromFunctions((value) => value, (json) => json);
var HivePiece = class _HivePiece {
  owner;
  kind;
  static encoder = Encoder.tuple([Player.encoder, HivePieceKindEncoder], (piece) => [piece.owner, piece.kind], (fields) => new _HivePiece(fields[0], fields[1]));
  constructor(owner, kind) {
    this.owner = owner;
    this.kind = kind;
  }
  toString() {
    return `${this.kind}_${this.owner.toString()}`;
  }
  equals(other) {
    return this.owner === other.owner && this.kind === other.kind;
  }
};
var HivePieceStack = class _HivePieceStack {
  pieces;
  static EMPTY = new _HivePieceStack([]);
  constructor(pieces) {
    this.pieces = pieces;
  }
  equals(other) {
    if (this.size() !== other.size())
      return false;
    return ArrayUtils.equals(this.pieces, other.pieces);
  }
  isEmpty() {
    return this.pieces.length === 0;
  }
  hasPieces() {
    return this.isEmpty() === false;
  }
  add(piece) {
    return new _HivePieceStack([piece, ...this.pieces]);
  }
  topPiece() {
    Utils.assert(this.hasPieces(), "HivePieceStack: cannot get top piece of an empty stack");
    return this.pieces[0];
  }
  removeTopPiece() {
    const pieces = [...this.pieces];
    pieces.shift();
    return new _HivePieceStack(pieces);
  }
  size() {
    return this.pieces.length;
  }
};

// games/dist/games/hive/HiveMove.js
var HiveDropMove = class _HiveDropMove extends MoveCoord {
  piece;
  static encoder = Encoder.tuple([HivePiece.encoder, Coord.encoder], (move) => [move.piece, move.coord], (fields) => new _HiveDropMove(fields[0], fields[1].x, fields[1].y));
  static of(piece, coord) {
    return new _HiveDropMove(piece, coord.x, coord.y);
  }
  constructor(piece, x, y) {
    super(x, y);
    this.piece = piece;
  }
  toString() {
    return `HiveDrop(${this.piece.toString()}, ${this.coord.toString()})`;
  }
  equals(other) {
    if (other instanceof _HiveDropMove) {
      return this.piece.equals(other.piece) && this.coord.equals(other.coord);
    }
    return false;
  }
};
var HiveCoordToCoordMove = class _HiveCoordToCoordMove extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_HiveCoordToCoordMove.from);
  static from(start, end) {
    if (start.equals(end)) {
      return MGPFallible.failure(RulesFailure.MOVE_CANNOT_BE_STATIC());
    }
    return MGPFallible.success(new _HiveCoordToCoordMove(start, end));
  }
  constructor(start, end) {
    super(start, end);
  }
  toString() {
    return `HiveMoveCoordToCoord(${this.getStart().toString()} -> ${this.getEnd().toString()})`;
  }
  equals(other) {
    if (other instanceof HiveSpiderMove) {
      return false;
    }
    if (other instanceof _HiveCoordToCoordMove) {
      return this.getStart().equals(other.getStart()) && this.getEnd().equals(other.getEnd());
    }
    return false;
  }
};
var HiveSpiderMove = class _HiveSpiderMove extends HiveCoordToCoordMove {
  coords;
  static encoder = Encoder.tuple([Coord.encoder, Coord.encoder, Coord.encoder, Coord.encoder], (move) => move.coords, (fields) => new _HiveSpiderMove(fields));
  static ofCoords(coords) {
    return new _HiveSpiderMove(coords);
  }
  constructor(coords) {
    super(coords[0], coords[3]);
    this.coords = coords;
  }
  toString() {
    const coords = this.coords.map((coord) => coord.toString()).join(", ");
    return `HiveMoveSpider(${coords})`;
  }
  equals(other) {
    if (other instanceof _HiveSpiderMove) {
      return this.getStart().equals(other.getStart()) && this.getEnd().equals(other.getEnd());
    }
    return false;
  }
};
var HivePassMove = class _HivePassMove extends Move {
  static encoder = Encoder.constant("HiveMovePass", new _HivePassMove());
  toString() {
    return "HiveMovePass";
  }
  equals(other) {
    return other instanceof _HivePassMove;
  }
};
function isInstanceOfHiveDropMove(value) {
  return value instanceof HiveDropMove;
}
function isInstanceOfHiveMoveSpider(value) {
  return value instanceof HiveSpiderMove;
}
function isInstanceOfHiveMoveCoordToCoord(value) {
  return value instanceof HiveCoordToCoordMove;
}
function isInstanceOfHiveMovePass(value) {
  return value instanceof HivePassMove;
}
var HiveMove;
(function(HiveMove2) {
  HiveMove2.PASS = new HivePassMove();
  function drop(piece, coord) {
    return HiveDropMove.of(piece, coord);
  }
  HiveMove2.drop = drop;
  function move(start, end) {
    return HiveCoordToCoordMove.from(start, end);
  }
  HiveMove2.move = move;
  function spiderMove(coords) {
    return HiveSpiderMove.ofCoords(coords);
  }
  HiveMove2.spiderMove = spiderMove;
  HiveMove2.encoder = Encoder.disjunction([
    isInstanceOfHiveDropMove,
    isInstanceOfHiveMoveSpider,
    isInstanceOfHiveMoveCoordToCoord,
    isInstanceOfHiveMovePass
  ], [HiveDropMove.encoder, HiveSpiderMove.encoder, HiveCoordToCoordMove.encoder, HivePassMove.encoder]);
})(HiveMove || (HiveMove = {}));

// games/dist/games/hive/HivePieceRules.js
var HivePieceRules = class _HivePieceRules {
  static INSTANCES = MGPOptional.empty();
  static of(piece) {
    if (_HivePieceRules.INSTANCES.isAbsent()) {
      _HivePieceRules.INSTANCES = MGPOptional.of({
        "QueenBee": HiveQueenBeeRules.get(),
        "Beetle": HiveBeetleRules.get(),
        "Grasshopper": HiveGrasshopperRules.get(),
        "Spider": HiveSpiderRules.get(),
        "SoldierAnt": HiveSoldierAntRules.get()
      });
    }
    return _HivePieceRules.INSTANCES.get()[piece.kind];
  }
  checkEmptyDestination(move, state) {
    if (state.getAt(move.getEnd()).hasPieces()) {
      return MGPValidation.failure(HiveFailure.THIS_PIECE_CANNOT_CLIMB());
    }
    return MGPValidation.SUCCESS;
  }
  canSlideBetweenNeighbors(state, start, end) {
    const startNeighbors = new CoordSet(HexagonalUtils.getNeighbors(start));
    const endNeighbors = new CoordSet(HexagonalUtils.getNeighbors(end));
    const commonNeighbors = startNeighbors.intersection(endNeighbors);
    for (const neighbor of commonNeighbors) {
      if (state.getAt(neighbor).isEmpty()) {
        return true;
      }
    }
    return false;
  }
};
var HiveQueenBeeRules = class _HiveQueenBeeRules extends HivePieceRules {
  static INSTANCE = MGPOptional.empty();
  static get() {
    if (this.INSTANCE.isAbsent()) {
      this.INSTANCE = MGPOptional.of(new _HiveQueenBeeRules());
    }
    return this.INSTANCE.get();
  }
  moveValidity(move, state) {
    if (HexagonalUtils.areNeighbors(move.getStart(), move.getEnd()) === false) {
      return MGPValidation.failure(HiveFailure.QUEEN_BEE_CAN_ONLY_MOVE_TO_DIRECT_NEIGHBORS());
    }
    if (this.canSlideBetweenNeighbors(state, move.getStart(), move.getEnd()) === false) {
      return MGPValidation.failure(HiveFailure.MUST_BE_ABLE_TO_SLIDE());
    }
    return this.checkEmptyDestination(move, state);
  }
  getPotentialMoves(coord, state) {
    const moves = [];
    for (const neighbor of HexagonalUtils.getNeighbors(coord)) {
      if (state.getAt(neighbor).isEmpty()) {
        moves.push(HiveCoordToCoordMove.from(coord, neighbor).get());
      }
    }
    return moves;
  }
};
var HiveBeetleRules = class _HiveBeetleRules extends HivePieceRules {
  static INSTANCE = MGPOptional.empty();
  static get() {
    if (this.INSTANCE.isAbsent()) {
      this.INSTANCE = MGPOptional.of(new _HiveBeetleRules());
    }
    return this.INSTANCE.get();
  }
  moveValidity(move, state) {
    if (HexagonalUtils.areNeighbors(move.getStart(), move.getEnd()) === false) {
      return MGPValidation.failure(HiveFailure.BEETLE_CAN_ONLY_MOVE_TO_DIRECT_NEIGHBORS());
    }
    return MGPValidation.SUCCESS;
  }
  getPotentialMoves(coord, state) {
    const moves = [];
    for (const neighbor of HexagonalUtils.getNeighbors(coord)) {
      moves.push(HiveCoordToCoordMove.from(coord, neighbor).get());
    }
    return moves;
  }
};
var HiveGrasshopperRules = class _HiveGrasshopperRules extends HivePieceRules {
  static INSTANCE = MGPOptional.empty();
  static get() {
    if (this.INSTANCE.isAbsent()) {
      this.INSTANCE = MGPOptional.of(new _HiveGrasshopperRules());
    }
    return this.INSTANCE.get();
  }
  moveValidity(move, state) {
    const direction = HexaDirection.factory.fromMove(move.getStart(), move.getEnd());
    if (direction.isFailure()) {
      return MGPValidation.failure(HiveFailure.GRASSHOPPER_MUST_MOVE_IN_STRAIGHT_LINE());
    }
    const jumpedCoords = move.getJumpedOverCoords();
    if (jumpedCoords.length === 0) {
      return MGPValidation.failure(HiveFailure.GRASSHOPPER_MUST_JUMP_OVER_PIECES());
    }
    for (const coord of jumpedCoords) {
      if (state.getAt(coord).isEmpty()) {
        return MGPValidation.failure(HiveFailure.GRASSHOPPER_MUST_JUMP_OVER_PIECES());
      }
    }
    return this.checkEmptyDestination(move, state);
  }
  getPotentialMoves(coord, state) {
    const moves = [];
    for (const direction of HexaDirection.factory.all) {
      const neighbor = coord.getNext(direction);
      if (state.getAt(neighbor).hasPieces()) {
        let end = neighbor;
        while (state.getAt(end).hasPieces()) {
          end = end.getNext(direction);
        }
        moves.push(HiveCoordToCoordMove.from(coord, end).get());
      }
    }
    return moves;
  }
};
var HiveSpiderRules = class _HiveSpiderRules extends HivePieceRules {
  static INSTANCE = MGPOptional.empty();
  static get() {
    if (this.INSTANCE.isAbsent()) {
      this.INSTANCE = MGPOptional.of(new _HiveSpiderRules());
    }
    return this.INSTANCE.get();
  }
  prefixLegality(coords, state) {
    let visited = new CoordSet();
    const stateWithoutMovedSpider = state.update().setAt(coords[0], HivePieceStack.EMPTY).increaseTurnAndFinalizeUpdate();
    for (let i = 1; i < coords.length; i++) {
      if (stateWithoutMovedSpider.getAt(coords[i]).hasPieces()) {
        return MGPValidation.failure(HiveFailure.THIS_PIECE_CANNOT_CLIMB());
      }
      if (HexagonalUtils.areNeighbors(coords[i - 1], coords[i]) === false) {
        return MGPValidation.failure(HiveFailure.SPIDER_MUST_MOVE_ON_NEIGHBORING_SPACES());
      }
      if (stateWithoutMovedSpider.haveCommonNeighbor(coords[i], coords[i - 1]) === false) {
        return MGPValidation.failure(HiveFailure.SPIDER_CAN_ONLY_MOVE_WITH_DIRECT_CONTACT());
      }
      if (this.canSlideBetweenNeighbors(stateWithoutMovedSpider, coords[i - 1], coords[i]) === false) {
        return MGPValidation.failure(HiveFailure.MUST_BE_ABLE_TO_SLIDE());
      }
      if (visited.contains(coords[i])) {
        return MGPValidation.failure(HiveFailure.SPIDER_CANNOT_BACKTRACK());
      }
      visited = visited.addElement(coords[i]);
    }
    return MGPValidation.SUCCESS;
  }
  moveValidity(move, state) {
    Utils.assert(move instanceof HiveSpiderMove, "HiveSpiderRules: move should be a spider move");
    const spiderMove = move;
    const prefixLegality = this.prefixLegality(spiderMove.coords, state);
    if (prefixLegality.isFailure()) {
      return prefixLegality;
    }
    return this.checkEmptyDestination(move, state);
  }
  getPotentialMoves(coord, state) {
    const stateWithoutMovedSpider = state.update().setAt(coord, HivePieceStack.EMPTY).increaseTurnAndFinalizeUpdate();
    let movesSoFar = [[coord]];
    for (let i = 0; i < 3; i++) {
      movesSoFar = movesSoFar.flatMap((move) => this.nextMoveStep(stateWithoutMovedSpider, move));
    }
    function makeMove(move) {
      return HiveSpiderMove.ofCoords(move);
    }
    const uniqueMoves = new Set2(movesSoFar.map(makeMove));
    return uniqueMoves.toList();
  }
  nextMoveStep(state, move) {
    const lastCoord = move[move.length - 1];
    function neighborsFilter(coord) {
      if (state.getAt(coord).hasPieces()) {
        return false;
      }
      if (move.find((c) => coord.equals(c)) !== void 0) {
        return false;
      }
      return state.haveCommonNeighbor(coord, lastCoord);
    }
    const possibleNeighbors = new CoordSet(HexagonalUtils.getNeighbors(lastCoord)).filter(neighborsFilter);
    return possibleNeighbors.toList().map((coord) => [...move, coord]);
  }
};
var HiveSoldierAntRules = class _HiveSoldierAntRules extends HivePieceRules {
  static INSTANCE = MGPOptional.empty();
  static get() {
    if (this.INSTANCE.isAbsent()) {
      this.INSTANCE = MGPOptional.of(new _HiveSoldierAntRules());
    }
    return this.INSTANCE.get();
  }
  pathExists(state, start, end) {
    let visited = new CoordSet();
    const worklist = [start];
    while (worklist.length > 0) {
      const coord = worklist.pop();
      if (visited.contains(coord)) {
        continue;
      }
      visited = visited.addElement(coord);
      if (coord.equals(end)) {
        return true;
      }
      for (const neighbor of HexagonalUtils.getNeighbors(coord)) {
        const isEmpty = state.getAt(neighbor).isEmpty();
        const hasOccupiedNeighbors = state.getOccupiedNeighbors(neighbor).size() > 0;
        const canSlide = this.canSlideBetweenNeighbors(state, coord, neighbor);
        if (isEmpty && hasOccupiedNeighbors && canSlide) {
          worklist.push(neighbor);
        }
      }
    }
    return false;
  }
  moveValidity(move, state) {
    if (this.pathExists(state, move.getStart(), move.getEnd()) === false) {
      return MGPValidation.failure(HiveFailure.MUST_BE_ABLE_TO_SLIDE());
    }
    return this.checkEmptyDestination(move, state);
  }
  getPotentialMoves(coord, state) {
    let moves = new Set2();
    for (const occupiedSpace of state.occupiedSpaces()) {
      if (occupiedSpace.equals(coord)) {
        continue;
      }
      for (const unoccupied of state.emptyNeighbors(occupiedSpace)) {
        moves = moves.addElement(HiveCoordToCoordMove.from(coord, unoccupied).get());
      }
    }
    return moves.toList();
  }
};

// games/dist/jscaip/state/OpenHexagonalGameState.js
var OpenHexagonalGameState = class extends GameState {
  pieces;
  width;
  height;
  constructor(pieces, turn) {
    super(turn);
    this.pieces = pieces;
    const scale = this.computeScale();
    this.width = scale.width;
    this.height = scale.height;
    this.pieces.makeImmutable();
  }
  getPieces() {
    return this.pieces;
  }
  getPieceCoords() {
    return this.pieces.getKeyList();
  }
  computeScale() {
    let minWidth = Number.POSITIVE_INFINITY;
    let maxWidth = Number.NEGATIVE_INFINITY;
    let minHeight = Number.POSITIVE_INFINITY;
    let maxHeight = Number.NEGATIVE_INFINITY;
    for (const coord of this.pieces.getKeyList()) {
      minWidth = Math.min(coord.x, minWidth);
      maxWidth = Math.max(coord.x, maxWidth);
      minHeight = Math.min(coord.y, minHeight);
      maxHeight = Math.max(coord.y, maxHeight);
    }
    return {
      width: maxWidth + 1 - minWidth,
      height: maxHeight + 1 - minHeight
    };
  }
  isOnBoard(coord) {
    return this.pieces.containsKey(coord);
  }
  getOccupiedNeighbors(coord) {
    const neighbors = new CoordSet(HexagonalUtils.getNeighbors(coord));
    return neighbors.filter((neighbor) => {
      return this.pieces.get(neighbor).isPresent();
    });
  }
  getGroups() {
    let visited = new CoordSet();
    let groups = new Set2();
    for (const coord of this.pieces.getKeyList()) {
      if (visited.contains(coord) === false) {
        let group = new CoordSet();
        let toVisit = new CoordSet([coord]);
        while (toVisit.hasElements()) {
          const nextCoord = toVisit.getAnyElement().get();
          toVisit = toVisit.removeElement(nextCoord);
          visited = visited.addElement(nextCoord);
          group = group.addElement(nextCoord);
          const occupiedNeighboors = this.getOccupiedNeighbors(nextCoord);
          const unvisitedOccupiedNeighboors = occupiedNeighboors.filter((neighbor) => visited.contains(neighbor) === false);
          toVisit = toVisit.union(unvisitedOccupiedNeighboors);
        }
        groups = groups.addElement(group);
      }
    }
    return groups;
  }
};

// games/dist/games/hive/HiveState.js
var HiveRemainingPieces = class _HiveRemainingPieces {
  pieces;
  static getInitial() {
    const pieces = new MGPMap();
    for (const player of Player.PLAYERS) {
      pieces.set(new HivePiece(player, "QueenBee"), 1);
      pieces.set(new HivePiece(player, "Beetle"), 2);
      pieces.set(new HivePiece(player, "Spider"), 2);
      pieces.set(new HivePiece(player, "Grasshopper"), 3);
      pieces.set(new HivePiece(player, "SoldierAnt"), 3);
    }
    pieces.makeImmutable();
    return new _HiveRemainingPieces(pieces);
  }
  constructor(pieces) {
    this.pieces = pieces;
  }
  equals(other) {
    return this.pieces.equals(other.pieces);
  }
  getQuantity(piece) {
    return this.pieces.get(piece).get();
  }
  hasRemaining(piece) {
    return this.getQuantity(piece) > 0;
  }
  getAny(player) {
    for (const piece of this.pieces.getKeyList()) {
      if (piece.owner === player && this.hasRemaining(piece)) {
        return MGPOptional.of(piece);
      }
    }
    return MGPOptional.empty();
  }
  remove(piece) {
    const remaining = this.pieces.get(piece).get();
    Utils.assert(remaining > 0, "HiveRemainingPieces cannot remove a non-remainingPiece");
    const newPieces = this.pieces.getCopy();
    newPieces.replace(piece, remaining - 1);
    return new _HiveRemainingPieces(newPieces);
  }
  toListOfStacks() {
    const remaining = [];
    for (const [piece, value] of this.pieces) {
      const pieces = [];
      for (let i = 0; i < value; i++) {
        pieces.push(piece);
      }
      remaining.push(new HivePieceStack(pieces));
    }
    return remaining;
  }
  getPlayerPieces(player) {
    const remaining = [];
    for (const [piece, value] of this.pieces) {
      if (piece.owner === player && value > 0) {
        remaining.push(piece);
      }
    }
    return remaining;
  }
};
var HiveStateUpdate = class _HiveStateUpdate {
  pieces;
  remainingPieces;
  queenBees;
  turn;
  static of(state) {
    return new _HiveStateUpdate(state.pieces, state.remainingPieces, state.queenBees, state.turn);
  }
  constructor(pieces, remainingPieces, queenBees, turn) {
    this.pieces = pieces;
    this.remainingPieces = remainingPieces;
    this.queenBees = queenBees;
    this.turn = turn;
  }
  setAt(coord, stack) {
    const queenBees = this.queenBees.getCopy();
    for (const player of Player.PLAYERS) {
      if (queenBees.get(player).equalsValue(coord)) {
        queenBees.delete(player);
      }
    }
    for (const piece of stack.pieces) {
      if (piece.kind === "QueenBee") {
        queenBees.put(piece.owner, coord);
      }
    }
    const pieces = this.pieces.getCopy();
    if (stack.isEmpty()) {
      pieces.delete(coord);
    } else {
      pieces.put(coord, stack);
    }
    return new _HiveStateUpdate(pieces, this.remainingPieces, queenBees, this.turn);
  }
  removeRemainingPiece(piece) {
    return new _HiveStateUpdate(this.pieces, this.remainingPieces.remove(piece), this.queenBees, this.turn);
  }
  increaseTurnAndFinalizeUpdate() {
    return new HiveState(this.pieces, this.remainingPieces, this.queenBees, this.turn + 1);
  }
};
var HiveState = class _HiveState extends OpenHexagonalGameState {
  remainingPieces;
  queenBees;
  static fromRepresentation(board, turn, vector = new Vector(0, 0)) {
    const pieces = new ReversibleMap();
    let remainingPieces = HiveRemainingPieces.getInitial();
    const queenBees = new MGPMap();
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        if (board[y][x].length > 0) {
          const adaptedCoord = new Coord(x, y).getNext(vector, 1);
          pieces.set(adaptedCoord, new HivePieceStack(board[y][x]));
          const queenBee = MGPOptional.ofNullable(board[y][x].find((piece) => piece.kind === "QueenBee"));
          if (queenBee.isPresent()) {
            queenBees.set(queenBee.get().owner, adaptedCoord);
          }
          for (const piece of board[y][x]) {
            remainingPieces = remainingPieces.remove(piece);
          }
        }
      }
    }
    return new _HiveState(pieces, remainingPieces, queenBees, turn);
  }
  constructor(pieces, remainingPieces, queenBees, turn) {
    super(pieces, turn);
    this.remainingPieces = remainingPieces;
    this.queenBees = queenBees;
    this.queenBees = queenBees.getCopy();
    for (const player of queenBees.getKeyList()) {
      const oldCoord = queenBees.get(player).get();
      this.queenBees.replace(player, oldCoord);
    }
    this.queenBees.makeImmutable();
  }
  update() {
    return HiveStateUpdate.of(this);
  }
  equals(other) {
    return this.pieces.equals(other.pieces) && this.remainingPieces.equals(other.remainingPieces) && this.queenBees.equals(other.queenBees) && this.turn === other.turn;
  }
  getAt(coord) {
    if (this.isOnBoard(coord)) {
      return this.pieces.get(coord).get();
    } else {
      return HivePieceStack.EMPTY;
    }
  }
  queenBeeLocation(player) {
    return this.queenBees.get(player);
  }
  hasQueenBeeOnBoard(player) {
    return this.queenBeeLocation(player).isPresent();
  }
  numberOfNeighbors(coord) {
    let neighbors = 0;
    for (const neighbor of HexagonalUtils.getNeighbors(coord)) {
      if (this.getAt(neighbor).hasPieces()) {
        neighbors += 1;
      }
    }
    return neighbors;
  }
  isDisconnected() {
    return this.getGroups().size() > 1;
  }
  occupiedSpaces() {
    return this.pieces.getKeyList();
  }
  emptyNeighbors(coord) {
    const result = [];
    for (const neighbor of HexagonalUtils.getNeighbors(coord)) {
      if (this.getAt(neighbor).isEmpty()) {
        result.push(neighbor);
      }
    }
    return result;
  }
  haveCommonNeighbor(first, second) {
    const occupiedNeighborsOfFirst = this.getOccupiedNeighbors(first);
    const occupiedNeighborsOfSecond = this.getOccupiedNeighbors(second);
    const commonNeighbor = occupiedNeighborsOfFirst.findAnyCommonElement(occupiedNeighborsOfSecond);
    return commonNeighbor.isPresent();
  }
};

// games/dist/games/hive/HiveRules.js
var HiveRules = class _HiveRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_HiveRules.singleton.isAbsent()) {
      _HiveRules.singleton = MGPOptional.of(new _HiveRules());
    }
    return _HiveRules.singleton.get();
  }
  getInitialState() {
    const board = [];
    return HiveState.fromRepresentation(board, 0);
  }
  applyLegalMove(move, state, _config, _info) {
    if (move instanceof HiveDropMove) {
      return this.applyLegalDrop(move, state);
    } else if (move instanceof HiveCoordToCoordMove) {
      return this.applyLegalMoveCoordToCoord(move, state);
    } else {
      return state.update().increaseTurnAndFinalizeUpdate();
    }
  }
  applyLegalDrop(drop, state) {
    const pieceStack = state.getAt(drop.coord);
    return state.update().setAt(drop.coord, pieceStack.add(drop.piece)).removeRemainingPiece(drop.piece).increaseTurnAndFinalizeUpdate();
  }
  applyLegalMoveCoordToCoord(move, state) {
    const sourcePieceStack = state.getAt(move.getStart());
    const destinationPieceStack = state.getAt(move.getEnd());
    return state.update().setAt(move.getStart(), sourcePieceStack.removeTopPiece()).setAt(move.getEnd(), destinationPieceStack.add(sourcePieceStack.topPiece())).increaseTurnAndFinalizeUpdate();
  }
  isLegal(move, state) {
    if (move instanceof HiveDropMove) {
      return this.isLegalDrop(move, state);
    } else if (move instanceof HiveCoordToCoordMove) {
      return this.isLegalMoveCoordToCoord(move, state);
    } else {
      if (this.shouldPass(state)) {
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(RulesFailure.CANNOT_PASS());
      }
    }
  }
  isLegalMoveCoordToCoord(move, state) {
    if (state.queenBeeLocation(state.getCurrentPlayer()).isPresent() === false) {
      return MGPValidation.failure(HiveFailure.QUEEN_BEE_MUST_BE_ON_BOARD_BEFORE_MOVE());
    }
    const stack = state.getAt(move.getStart());
    if (stack.isEmpty()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    const movedPiece = stack.topPiece();
    if (movedPiece.owner === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    const moveValidity = HivePieceRules.of(movedPiece).moveValidity(move, state);
    if (moveValidity.isFailure()) {
      return moveValidity;
    }
    const stateWithoutMovedPiece = state.update().setAt(move.getStart(), stack.removeTopPiece()).increaseTurnAndFinalizeUpdate();
    if (stateWithoutMovedPiece.isDisconnected()) {
      return MGPValidation.failure(HiveFailure.CANNOT_DISCONNECT_HIVE());
    }
    const newEnd = move.getEnd();
    if (stateWithoutMovedPiece.numberOfNeighbors(newEnd) === 0) {
      return MGPValidation.failure(HiveFailure.CANNOT_DISCONNECT_HIVE());
    }
    return MGPValidation.SUCCESS;
  }
  mustPlaceQueenBee(state) {
    return 6 <= state.turn && state.hasQueenBeeOnBoard(state.getCurrentPlayer()) === false;
  }
  isLegalDrop(move, state) {
    const player = state.getCurrentPlayer();
    if (move.piece.owner === player.getOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    if (state.remainingPieces.hasRemaining(move.piece) === false) {
      return MGPValidation.failure(HiveFailure.CANNOT_DROP_PIECE_YOU_DONT_HAVE());
    }
    if (move.piece.kind !== "QueenBee" && this.mustPlaceQueenBee(state)) {
      return MGPValidation.failure(HiveFailure.MUST_PLACE_QUEEN_BEE_LATEST_AT_FOURTH_TURN());
    }
    const neighborValidity = this.checkNeighborValidity(move, state);
    if (neighborValidity.isFailure()) {
      return neighborValidity;
    }
    if (state.getAt(move.coord).hasPieces()) {
      return MGPValidation.failure(HiveFailure.MUST_DROP_ON_EMPTY_SPACE());
    }
    return MGPValidation.SUCCESS;
  }
  checkNeighborValidity(move, state) {
    const player = state.getCurrentPlayer();
    let hasNeighbor = false;
    for (const neighbor of HexagonalUtils.getNeighbors(move.coord)) {
      const neighborStack = state.getAt(neighbor);
      if (neighborStack.hasPieces()) {
        hasNeighbor = true;
        if (state.turn !== 1 && neighborStack.topPiece().owner === player.getOpponent()) {
          return MGPValidation.failure(HiveFailure.CANNOT_DROP_NEXT_TO_OPPONENT());
        }
      }
    }
    if (state.turn !== 0 && hasNeighbor === false) {
      return MGPValidation.failure(HiveFailure.MUST_BE_CONNECTED_TO_HIVE());
    }
    return MGPValidation.SUCCESS;
  }
  getPossibleDropLocations(state) {
    const player = state.getCurrentPlayer();
    if (state.turn === 0) {
      return new CoordSet([new Coord(0, 0)]);
    }
    if (state.turn === 1) {
      return new CoordSet(HexagonalUtils.getNeighbors(new Coord(0, 0)));
    }
    const remainingPieceOpt = state.remainingPieces.getAny(player);
    if (remainingPieceOpt.isAbsent()) {
      return new CoordSet();
    }
    const remainingPiece = remainingPieceOpt.get();
    let locations = new CoordSet();
    for (const coord of state.occupiedSpaces()) {
      if (state.getAt(coord).topPiece().owner === player) {
        for (const neighbor of state.emptyNeighbors(coord)) {
          const move = HiveDropMove.of(remainingPiece, neighbor);
          if (this.isLegalDrop(move, state).isSuccess()) {
            locations = locations.addElement(neighbor);
          }
        }
      }
    }
    return locations;
  }
  getPossibleMovesFrom(state, coord) {
    const player = state.getCurrentPlayer();
    let moves = new Set2();
    const topPiece = state.getAt(coord).topPiece();
    if (topPiece.owner === player) {
      for (const move of HivePieceRules.of(topPiece).getPotentialMoves(coord, state)) {
        if (this.isLegalMoveCoordToCoord(move, state).isSuccess()) {
          moves = moves.addElement(move);
        }
      }
    }
    return moves;
  }
  getPossibleMovesOnBoard(state) {
    let moves = new Set2();
    for (const coord of state.occupiedSpaces()) {
      moves = moves.union(this.getPossibleMovesFrom(state, coord));
    }
    return moves;
  }
  shouldPass(state) {
    return this.getPossibleDropLocations(state).size() === 0 && this.getPossibleMovesOnBoard(state).size() === 0;
  }
  getGameStatus(node) {
    const state = node.gameState;
    const neighbors = PlayerNumberMap.of(0, 0);
    for (const player of Player.PLAYERS) {
      const queenBeeLocation = state.queenBeeLocation(player);
      if (queenBeeLocation.isPresent()) {
        neighbors.put(player, state.numberOfNeighbors(queenBeeLocation.get()));
      }
    }
    const neighborsZero = neighbors.get(Player.ZERO);
    const neighborsOne = neighbors.get(Player.ONE);
    if (neighborsZero === 6 && neighborsOne === 6) {
      return GameStatus.DRAW;
    } else if (neighborsZero === 6) {
      return GameStatus.getVictory(Player.ONE);
    } else if (neighborsOne === 6) {
      return GameStatus.getVictory(Player.ZERO);
    }
    return GameStatus.ONGOING;
  }
};

// games/dist/games/hive/HiveHeuristic.js
var HiveHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const scoreZero = this.queenBeeMobility(node.gameState, Player.ZERO);
    const scoreOne = this.queenBeeMobility(node.gameState, Player.ONE);
    return PlayerNumberTable.ofSingle(scoreZero, scoreOne);
  }
  queenBeeMobility(state, player) {
    const queenBee = state.queenBeeLocation(player);
    if (queenBee.isPresent()) {
      const possibleMoves = HiveRules.get().getPossibleMovesFrom(state, queenBee.get());
      return possibleMoves.size();
    } else {
      return 0;
    }
  }
};

// games/dist/games/hive/HiveMoveGenerator.js
var HiveMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const dropMoves = this.getListDrops(node.gameState);
    const movesOnBoard = this.getListOfOnBoardMoves(node.gameState);
    const moves = dropMoves.concat(movesOnBoard);
    if (moves.length === 0) {
      return [HiveMove.PASS];
    }
    return moves;
  }
  getListOfOnBoardMoves(state) {
    return HiveRules.get().getPossibleMovesOnBoard(state).toList();
  }
  getListDrops(state) {
    const drops = [];
    const player = state.getCurrentPlayer();
    const queenBee = new HivePiece(player, "QueenBee");
    for (const coord of HiveRules.get().getPossibleDropLocations(state)) {
      if (HiveRules.get().mustPlaceQueenBee(state)) {
        drops.push(HiveMove.drop(queenBee, coord));
      } else {
        for (const remaining of state.remainingPieces.getPlayerPieces(state.getCurrentPlayer())) {
          drops.push(HiveMove.drop(remaining, coord));
        }
      }
    }
    return drops;
  }
};

// games/dist/games/kamisado/KamisadoColor.js
var KamisadoColor = class _KamisadoColor {
  value;
  name;
  rgb;
  static ANY = new _KamisadoColor(0, "any", "#000");
  static ORANGE = new _KamisadoColor(1, "orange", "#d67421");
  static BLUE = new _KamisadoColor(2, "blue", "#006bac");
  static PURPLE = new _KamisadoColor(3, "purple", "#6f3787");
  static PINK = new _KamisadoColor(4, "pink", "#d2719e");
  static YELLOW = new _KamisadoColor(5, "yellow", "#e2c200");
  static RED = new _KamisadoColor(6, "red", "#d23339");
  static GREEN = new _KamisadoColor(7, "green", "#009157");
  static BROWN = new _KamisadoColor(8, "brown", "#562500");
  static of(value) {
    switch (value) {
      case 0:
        return _KamisadoColor.ANY;
      case 1:
        return _KamisadoColor.ORANGE;
      case 2:
        return _KamisadoColor.BLUE;
      case 3:
        return _KamisadoColor.PURPLE;
      case 4:
        return _KamisadoColor.PINK;
      case 5:
        return _KamisadoColor.YELLOW;
      case 6:
        return _KamisadoColor.RED;
      case 7:
        return _KamisadoColor.GREEN;
      default:
        Utils.expectToBe(value, 8, "Invalid value " + value + " for KamisadoColor");
        return _KamisadoColor.BROWN;
    }
  }
  constructor(value, name, rgb) {
    this.value = value;
    this.name = name;
    this.rgb = rgb;
  }
};

// games/dist/games/kamisado/KamisadoPiece.js
var KamisadoPiece = class _KamisadoPiece {
  player;
  color;
  constructor(player, color) {
    this.player = player;
    this.color = color;
  }
  static EMPTY = new _KamisadoPiece(PlayerOrNone.NONE, KamisadoColor.ANY);
  static of(player, value) {
    return new _KamisadoPiece(player, KamisadoColor.of(value));
  }
  static createPlayerColors(player) {
    return {
      ORANGE: new _KamisadoPiece(player, KamisadoColor.ORANGE),
      BLUE: new _KamisadoPiece(player, KamisadoColor.BLUE),
      PURPLE: new _KamisadoPiece(player, KamisadoColor.PURPLE),
      PINK: new _KamisadoPiece(player, KamisadoColor.PINK),
      YELLOW: new _KamisadoPiece(player, KamisadoColor.YELLOW),
      RED: new _KamisadoPiece(player, KamisadoColor.RED),
      GREEN: new _KamisadoPiece(player, KamisadoColor.GREEN),
      BROWN: new _KamisadoPiece(player, KamisadoColor.BROWN)
    };
  }
  static ZERO = _KamisadoPiece.createPlayerColors(Player.ZERO);
  static ONE = _KamisadoPiece.createPlayerColors(Player.ONE);
  equals(piece) {
    return piece.player === this.player && piece.color === this.color;
  }
  isEmpty() {
    return this.player.equals(PlayerOrNone.NONE);
  }
  belongsTo(player) {
    return this.player === player;
  }
};

// games/dist/games/kamisado/KamisadoBoard.js
var KamisadoBoard = class _KamisadoBoard {
  static INITIAL = _KamisadoBoard.getInitialBoard();
  static SIZE = 8;
  static COLORS = TableUtils.map([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [6, 1, 4, 7, 2, 5, 8, 3],
    [7, 4, 1, 6, 3, 8, 5, 2],
    [4, 3, 2, 1, 8, 7, 6, 5],
    [5, 6, 7, 8, 1, 2, 3, 4],
    [2, 5, 8, 3, 6, 1, 4, 7],
    [3, 8, 5, 2, 7, 4, 1, 6],
    [8, 7, 6, 5, 4, 3, 2, 1]
  ], KamisadoColor.of);
  static getColorAt(x, y) {
    return _KamisadoBoard.COLORS[y][x];
  }
  static getInitialBoard() {
    const _ = KamisadoPiece.EMPTY;
    return [
      [1, 2, 3, 4, 5, 6, 7, 8].map((value) => KamisadoPiece.of(Player.ONE, value)),
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [8, 7, 6, 5, 4, 3, 2, 1].map((value) => KamisadoPiece.of(Player.ZERO, value))
    ];
  }
};

// games/dist/games/kamisado/KamisadoFailure.js
var KamisadoFailure = class {
  static NOT_RIGHT_COLOR = () => $localize`This piece is not of the color you have to play.`;
  static DIRECTION_NOT_ALLOWED = () => $localize`You can only move forward, orthogonally or diagonally.`;
  static MOVE_BLOCKED = () => $localize`This move is blocked by another piece.`;
  static PLAY_WITH_SELECTED_PIECE = () => $localize`You must play with the selected piece.`;
};

// games/dist/games/kamisado/KamisadoState.js
var KamisadoState = class extends GameStateWithTable {
  colorToPlay;
  coordToPlay;
  alreadyPassed;
  static isOnBoard(coord) {
    return coord.isInRange(KamisadoBoard.SIZE, KamisadoBoard.SIZE);
  }
  constructor(turn, colorToPlay, coordToPlay, alreadyPassed, board) {
    super(TableUtils.copy(board), turn);
    this.colorToPlay = colorToPlay;
    this.coordToPlay = coordToPlay;
    this.alreadyPassed = alreadyPassed;
  }
  isEmptyAt(coord) {
    return this.hasPieceAt(coord, KamisadoPiece.EMPTY);
  }
  allPieceCoords() {
    const l = [];
    for (const coordAndContent of this.getCoordsAndContents()) {
      if (coordAndContent.content !== KamisadoPiece.EMPTY) {
        l.push(coordAndContent.coord);
      }
    }
    return l;
  }
};

// games/dist/games/kamisado/KamisadoMove.js
var KamisadoPassMove = class _KamisadoPassMove extends Move {
  static PASS = new _KamisadoPassMove();
  static encoder = Encoder.constant("PASS", _KamisadoPassMove.PASS);
  constructor() {
    super();
  }
  getDistance() {
    return 0;
  }
  equals(that) {
    return this === that;
  }
  toString() {
    return "KamisadoMove(PASS)";
  }
};
var KamisadoPieceMove = class _KamisadoPieceMove extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getEncoder(_KamisadoPieceMove.of);
  static of(start, end) {
    Utils.assert(KamisadoState.isOnBoard(start), "Starting coord of KamisadoMove must be on the board, not at " + start.toString());
    Utils.assert(KamisadoState.isOnBoard(end), "End coord of KamisadoMove must be on the board, not at " + end.toString());
    return new _KamisadoPieceMove(start, end);
  }
  constructor(start, end) {
    super(start, end);
  }
  equals(other) {
    if (other === this)
      return true;
    if (KamisadoMove.isPiece(other)) {
      if (other.getStart().equals(this.getStart()) === false)
        return false;
      return other.getEnd().equals(this.getEnd());
    } else {
      return false;
    }
  }
  toString() {
    return "KamisadoMove(" + this.getStart() + "->" + this.getEnd() + ")";
  }
};
function isPass(move) {
  return move instanceof KamisadoPassMove;
}
var KamisadoMove;
(function(KamisadoMove2) {
  KamisadoMove2.PASS = KamisadoPassMove.PASS;
  function of(start, end) {
    return KamisadoPieceMove.of(start, end);
  }
  KamisadoMove2.of = of;
  function isPiece(move) {
    return move instanceof KamisadoPieceMove;
  }
  KamisadoMove2.isPiece = isPiece;
  KamisadoMove2.encoder = Encoder.disjunction([KamisadoMove2.isPiece, isPass], [KamisadoPieceMove.encoder, KamisadoPassMove.encoder]);
})(KamisadoMove || (KamisadoMove = {}));

// games/dist/games/kamisado/KamisadoRules.js
var KamisadoRules = class _KamisadoRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_KamisadoRules.singleton.isAbsent()) {
      _KamisadoRules.singleton = MGPOptional.of(new _KamisadoRules());
    }
    return _KamisadoRules.singleton.get();
  }
  getInitialState() {
    return new KamisadoState(0, KamisadoColor.ANY, MGPOptional.empty(), false, KamisadoBoard.INITIAL);
  }
  static getColorMatchingPiece(state) {
    if (state.coordToPlay.isPresent()) {
      return [state.coordToPlay.get()];
    }
    return [
      new Coord(0, 7),
      new Coord(1, 7),
      new Coord(2, 7),
      new Coord(3, 7),
      new Coord(4, 7),
      new Coord(5, 7),
      new Coord(6, 7),
      new Coord(7, 7)
    ];
  }
  static getMovablePieces(state) {
    return _KamisadoRules.getColorMatchingPiece(state).filter((startCoord) => {
      for (const dir of this.playerDirections(state.getCurrentPlayer())) {
        const endCoord = startCoord.getNext(dir);
        if (state.isEmptyAt(endCoord)) {
          return true;
        }
      }
      return false;
    });
  }
  // Returns the directions allowed for the move of a player
  static playerDirections(player) {
    if (player === Player.ONE) {
      return [Ordinal.DOWN, Ordinal.DOWN_LEFT, Ordinal.DOWN_RIGHT];
    } else {
      return [Ordinal.UP, Ordinal.UP_LEFT, Ordinal.UP_RIGHT];
    }
  }
  // Check if a direction is allowed for a given player
  static directionAllowedForPlayer(dir, player) {
    if (player === Player.ZERO) {
      return dir.y < 0;
    } else {
      return dir.y > 0;
    }
  }
  // Check if the only possible move is to pass
  static mustPass(state) {
    return this.getMovablePieces(state).length === 0;
  }
  static getFurthestPiecePositions(state) {
    let furthest0 = 7;
    let furthest1 = 0;
    state.allPieceCoords().forEach((c) => {
      const piece = state.getPieceAt(c);
      Utils.assert(piece !== KamisadoPiece.EMPTY, "allPieceCoords failed to filter KamisadoPiece.EMPTY");
      if (piece.player === Player.ONE) {
        furthest1 = Math.max(furthest1, c.y);
      } else {
        furthest0 = Math.min(furthest0, c.y);
      }
    });
    return PlayerNumberMap.of(furthest0, furthest1);
  }
  static isLegal(move, state) {
    if (KamisadoMove.isPiece(move)) {
      const start = move.getStart();
      const end = move.getEnd();
      const colorToPlay = state.colorToPlay;
      const piece = state.getPieceAt(start);
      if (piece.isEmpty()) {
        return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
      }
      if (piece.belongsTo(state.getCurrentOpponent())) {
        return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
      }
      if (colorToPlay !== KamisadoColor.ANY && piece.color !== colorToPlay) {
        return MGPValidation.failure(KamisadoFailure.NOT_RIGHT_COLOR());
      }
      const endPiece = state.getPieceAt(end);
      if (endPiece.isEmpty() === false) {
        return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SPACE());
      }
      const directionOptional = Ordinal.factory.fromMove(start, end);
      if (directionOptional.isFailure()) {
        return MGPValidation.failure(KamisadoFailure.DIRECTION_NOT_ALLOWED());
      }
      const dir = directionOptional.get();
      if (_KamisadoRules.directionAllowedForPlayer(dir, state.getCurrentPlayer()) === false) {
        return MGPValidation.failure(KamisadoFailure.DIRECTION_NOT_ALLOWED());
      }
      let currentCoord = start;
      while (currentCoord.equals(end) === false) {
        currentCoord = currentCoord.getNext(dir);
        if (state.getPieceAt(currentCoord).isEmpty() === false) {
          return MGPValidation.failure(KamisadoFailure.MOVE_BLOCKED());
        }
      }
      return MGPValidation.SUCCESS;
    } else {
      return this.isLegalPass(state);
    }
  }
  static isLegalPass(state) {
    if (this.mustPass(state) && state.alreadyPassed === false) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(RulesFailure.CANNOT_PASS());
    }
  }
  // Returns the next coord that plays
  nextCoordToPlay(state, colorToPlay) {
    return MGPOptional.ofNullable(state.allPieceCoords().find((c) => {
      const piece = state.getPieceAt(c);
      return piece.player === state.getCurrentOpponent() && piece.color === colorToPlay;
    }));
  }
  // Apply the move by only relying on tryMove
  applyLegalMove(move, state, _config, _info) {
    if (KamisadoMove.isPiece(move)) {
      const start = move.getStart();
      const end = move.getEnd();
      const newBoard = state.getCopiedBoard();
      newBoard[end.y][end.x] = newBoard[start.y][start.x];
      newBoard[start.y][start.x] = KamisadoPiece.EMPTY;
      const newColorToPlay = KamisadoBoard.getColorAt(end.x, end.y);
      const nextCoord = this.nextCoordToPlay(state, newColorToPlay);
      const resultingState = new KamisadoState(state.turn + 1, newColorToPlay, nextCoord, false, newBoard);
      return resultingState;
    } else {
      const nextCoord = this.nextCoordToPlay(state, state.colorToPlay);
      const resultingState = new KamisadoState(state.turn + 1, state.colorToPlay, nextCoord, true, state.board);
      return resultingState;
    }
  }
  isLegal(move, state) {
    return _KamisadoRules.isLegal(move, state);
  }
  getGameStatus(node) {
    const state = node.gameState;
    const player = state.getCurrentPlayer();
    if (_KamisadoRules.mustPass(state) && state.alreadyPassed) {
      return GameStatus.getDefeat(player);
    }
    const furthest = _KamisadoRules.getFurthestPiecePositions(state);
    if (furthest.get(Player.ONE) === 7) {
      return GameStatus.ONE_WON;
    } else if (furthest.get(Player.ZERO) === 0) {
      return GameStatus.ZERO_WON;
    } else {
      return GameStatus.ONGOING;
    }
  }
};

// games/dist/games/kamisado/KamisadoHeuristic.js
var KamisadoHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const furthest = KamisadoRules.getFurthestPiecePositions(state);
    return PlayerNumberTable.ofSingle(7 - furthest.get(Player.ZERO), furthest.get(Player.ONE));
  }
};

// games/dist/games/kamisado/KamisadoMoveGenerator.js
var KamisadoMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const movablePieces = KamisadoRules.getMovablePieces(state);
    if (movablePieces.length === 0) {
      Utils.assert(state.alreadyPassed === false, "getListMovesFromState should not be called once game is ended.");
      return [KamisadoMove.PASS];
    } else {
      const moves = this.getListMovesFromNonBlockedState(state, movablePieces);
      ArrayUtils.sortByDescending(moves, (move) => move.getDistance());
      return moves;
    }
  }
  getListMovesFromNonBlockedState(state, movablePieces) {
    const moves = [];
    const player = state.getCurrentPlayer();
    for (const startCoord of movablePieces) {
      for (const dir of KamisadoRules.playerDirections(player)) {
        for (let stepSize = 1; stepSize < KamisadoBoard.SIZE; stepSize++) {
          const endCoord = startCoord.getNext(dir, stepSize);
          if (state.isEmptyAt(endCoord)) {
            const move = KamisadoMove.of(startCoord, endCoord);
            moves.push(move);
          } else {
            break;
          }
        }
      }
    }
    return moves;
  }
};

// games/dist/games/lines-of-action/LinesOfActionFailure.js
var LinesOfActionFailure = class {
  static INVALID_MOVE_LENGTH = () => $localize`Your move should have a length equal to the number of pieces that exist on the same line.`;
  static CANNOT_JUMP_OVER_OPPONENT = () => $localize`You cannot jump over the opponent's pieces.`;
  static PIECE_CANNOT_MOVE = () => $localize`This piece has no possible move, select another one.`;
};

// games/dist/games/lines-of-action/LinesOfActionState.js
var LinesOfActionState = class _LinesOfActionState extends PlayerOrNoneGameStateWithTable {
  static SIZE = 8;
  // board size
  static isOnBoard(coord) {
    return coord.isInRange(_LinesOfActionState.SIZE, _LinesOfActionState.SIZE);
  }
};

// games/dist/games/lines-of-action/LinesOfActionMove.js
var LinesOfActionMove = class _LinesOfActionMove extends MoveCoordToCoord {
  direction;
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_LinesOfActionMove.from);
  static from(start, end) {
    const directionOptional = Ordinal.factory.fromMove(start, end);
    if (directionOptional.isFailure()) {
      return MGPFallible.failure(directionOptional.getReason());
    }
    if (start.isNotInRange(LinesOfActionState.SIZE, LinesOfActionState.SIZE)) {
      return MGPFallible.failure("start coord is not in range");
    }
    if (end.isNotInRange(LinesOfActionState.SIZE, LinesOfActionState.SIZE)) {
      return MGPFallible.failure("end coord is not in range");
    }
    return MGPFallible.success(new _LinesOfActionMove(start, end, directionOptional.get()));
  }
  constructor(start, end, direction) {
    super(start, end);
    this.direction = direction;
    this.direction = Ordinal.factory.fromMove(start, end).get();
  }
  toString() {
    return "LinesOfActionMove(" + this.getStart() + "->" + this.getEnd() + ")";
  }
};

// games/dist/games/lines-of-action/LinesOfActionRules.js
var LinesOfActionRules = class _LinesOfActionRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_LinesOfActionRules.singleton.isAbsent()) {
      _LinesOfActionRules.singleton = MGPOptional.of(new _LinesOfActionRules());
    }
    return _LinesOfActionRules.singleton.get();
  }
  getInitialState() {
    const _ = PlayerOrNone.NONE;
    const O = PlayerOrNone.ZERO;
    const X = PlayerOrNone.ONE;
    const board = [
      [_, O, O, O, O, O, O, _],
      [X, _, _, _, _, _, _, X],
      [X, _, _, _, _, _, _, X],
      [X, _, _, _, _, _, _, X],
      [X, _, _, _, _, _, _, X],
      [X, _, _, _, _, _, _, X],
      [X, _, _, _, _, _, _, X],
      [_, O, O, O, O, O, O, _]
    ];
    return new LinesOfActionState(board, 0);
  }
  static getNumberOfGroups(state) {
    const groups = TableUtils.create(LinesOfActionState.SIZE, LinesOfActionState.SIZE, -1);
    const numGroups = PlayerNumberMap.of(0, 0);
    let highestGroup = 0;
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (groups[coordAndContent.coord.y][coordAndContent.coord.x] === -1) {
        if (coordAndContent.content.isPlayer()) {
          highestGroup += 1;
          _LinesOfActionRules.markGroupStartingAt(state, groups, coordAndContent.coord, highestGroup);
          numGroups.add(coordAndContent.content, 1);
        }
      }
    }
    return numGroups;
  }
  static markGroupStartingAt(state, groups, pos, id) {
    const stack = [pos];
    const player = state.getPieceAt(pos);
    while (stack.length > 0) {
      const coord = Utils.getNonNullable(stack.pop());
      if (groups[coord.y][coord.x] === -1) {
        const content = state.getPieceAt(coord);
        if (content === player) {
          groups[coord.y][coord.x] = id;
          for (const dir of Ordinal.ORDINALS) {
            const next = coord.getNext(dir);
            if (state.isOnBoard(next)) {
              stack.push(next);
            }
          }
        } else if (content.isNone()) {
          groups[coord.y][coord.x] = 0;
        }
      }
    }
  }
  applyLegalMove(move, state, _config, _info) {
    const board = state.getCopiedBoard();
    board[move.getStart().y][move.getStart().x] = PlayerOrNone.NONE;
    board[move.getEnd().y][move.getEnd().x] = state.getCurrentPlayer();
    return new LinesOfActionState(board, state.turn + 1);
  }
  static isLegal(move, state) {
    const piece = state.getPieceAt(move.getStart());
    if (piece.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (piece === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    if (move.getDistance() !== this.numberOfPiecesOnLine(state, move.getStart(), move.direction)) {
      return MGPValidation.failure(LinesOfActionFailure.INVALID_MOVE_LENGTH());
    }
    if (move.getJumpedOverCoords().some((c) => state.getPieceAt(c) === state.getCurrentOpponent())) {
      return MGPValidation.failure(LinesOfActionFailure.CANNOT_JUMP_OVER_OPPONENT());
    }
    if (state.getPieceAt(move.getEnd()) === state.getCurrentPlayer()) {
      return MGPValidation.failure(RulesFailure.SHOULD_LAND_ON_EMPTY_OR_OPPONENT_SPACE());
    }
    return MGPValidation.SUCCESS;
  }
  isLegal(move, state) {
    return _LinesOfActionRules.isLegal(move, state);
  }
  static numberOfPiecesOnLine(state, pos, dir) {
    let count = 0;
    for (const coord of _LinesOfActionRules.getLineCoords(pos, dir)) {
      if (state.getPieceAt(coord).isPlayer()) {
        count += 1;
      }
    }
    return count;
  }
  static getLineCoords(pos, dir) {
    const entranceAndDir = _LinesOfActionRules.getEntranceAndForwardDirection(pos, dir);
    let current = entranceAndDir[0];
    const forwardDirection = entranceAndDir[1];
    const coords = [];
    while (LinesOfActionState.isOnBoard(current)) {
      coords.push(current);
      current = current.getNext(forwardDirection);
    }
    return coords;
  }
  static getEntranceAndForwardDirection(pos, dir) {
    switch (dir) {
      case Ordinal.UP:
      case Ordinal.DOWN:
        return [new Coord(pos.x, 0), Ordinal.DOWN];
      case Ordinal.LEFT:
      case Ordinal.RIGHT:
        return [new Coord(0, pos.y), Ordinal.RIGHT];
      case Ordinal.UP_RIGHT:
      case Ordinal.DOWN_LEFT:
        return [new Coord(Math.max(0, pos.x + pos.y - 7), Math.min(7, pos.x + pos.y)), Ordinal.UP_RIGHT];
      default:
        Utils.expectToBeMultiple(dir, [Ordinal.UP_LEFT, Ordinal.DOWN_RIGHT]);
        return [
          new Coord(pos.x - Math.min(pos.x, pos.y), pos.y - Math.min(pos.x, pos.y)),
          Ordinal.DOWN_RIGHT
        ];
    }
  }
  static getVictory(state) {
    const groups = _LinesOfActionRules.getNumberOfGroups(state);
    const groupsZero = groups.get(Player.ZERO);
    const groupsOne = groups.get(Player.ONE);
    if (groupsZero === 1 && groupsOne === 1) {
      return MGPOptional.of(PlayerOrNone.NONE);
    } else if (groupsZero === 1) {
      return MGPOptional.of(Player.ZERO);
    } else if (groupsOne === 1) {
      return MGPOptional.of(Player.ONE);
    } else {
      return MGPOptional.empty();
    }
  }
  static possibleTargets(state, start) {
    let targets = new CoordSet();
    for (const dir of Ordinal.ORDINALS) {
      const numberOfPiecesOnLine = _LinesOfActionRules.numberOfPiecesOnLine(state, start, dir);
      const target = start.getNext(dir, numberOfPiecesOnLine);
      if (state.isOnBoard(target)) {
        const move = LinesOfActionMove.from(start, target).get();
        const legality = _LinesOfActionRules.isLegal(move, state);
        if (legality.isSuccess()) {
          targets = targets.addElement(target);
        }
      }
    }
    return targets;
  }
  getGameStatus(node) {
    const state = node.gameState;
    const groups = _LinesOfActionRules.getNumberOfGroups(state);
    const zero = groups.get(Player.ZERO);
    const one = groups.get(Player.ONE);
    if (zero === 1 && one > 1) {
      return GameStatus.ZERO_WON;
    } else if (zero > 1 && one === 1) {
      return GameStatus.ONE_WON;
    } else {
      return GameStatus.ONGOING;
    }
  }
};

// games/dist/games/lines-of-action/LinesOfActionHeuristic.js
var LinesOfActionHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const scores = LinesOfActionRules.getNumberOfGroups(state);
    return PlayerNumberTable.ofSingle(100 / scores.get(Player.ZERO), 100 / scores.get(Player.ONE));
  }
};

// games/dist/games/lines-of-action/LinesOfActionMoveGenerator.js
var LinesOfActionMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const moves = [];
    if (LinesOfActionRules.getVictory(state).isPresent()) {
      return moves;
    }
    for (let y = 0; y < LinesOfActionState.SIZE; y++) {
      for (let x = 0; x < LinesOfActionState.SIZE; x++) {
        const coord = new Coord(x, y);
        const piece = state.getPieceAt(coord);
        if (piece.isPlayer()) {
          for (const target of LinesOfActionRules.possibleTargets(state, coord)) {
            const move = LinesOfActionMove.from(coord, target).get();
            moves.push(move);
          }
        }
      }
    }
    return moves;
  }
};

// games/dist/games/lodestone/LodestoneFailure.js
var LodestoneFailure = class {
  static MUST_FLIP_LODESTONE = () => $localize`You must flip your lodestone before putting it back on the board.`;
  static MUST_PLACE_CAPTURES_ON_PRESSURE_PLATES = () => $localize`As long as there are pressure plates, you must place all the pieces that you have captured on them.`;
  static TARGET_IS_CRUMBLED = () => $localize`You must place your lodestone on a non-crumbled square!`;
  static TOO_MANY_CAPTURES_ON_SAME_PRESSURE_PLATE = () => $localize`You placed too many captures on the same pressure plate, which has not enough space left.`;
  static MUST_PLACE_CAPTURES = () => $localize`You must place your captures on the pressure plates, on the side of the board.`;
  static NO_CAPTURES_TO_PLACE_YET = () => $localize`You cannot place any capture now, you must first place your lodestone on the board!`;
};

// games/dist/games/lodestone/LodestoneMove.js
var LodestoneMove = class _LodestoneMove extends MoveCoord {
  direction;
  orientation;
  captures;
  static encoder = new class extends Encoder {
    encode(move) {
      return {
        coord: Coord.encoder.encode(move.coord),
        direction: move.direction,
        orientation: move.orientation,
        captures: move.captures
      };
    }
    decode(encoded) {
      const casted = encoded;
      Utils.assert(casted.coord != null, "Invalid encoded LodestoneMove");
      Utils.assert(casted.direction != null, "Invalid encoded LodestoneMove");
      Utils.assert(casted.orientation != null, "Invalid encoded LodestoneMove");
      Utils.assert(casted.captures != null, "Invalid encoded LodestoneMove");
      return new _LodestoneMove(Coord.encoder.decode(casted.coord), casted.direction, casted.orientation, casted.captures);
    }
  }();
  constructor(coord, direction, orientation, captures = { top: 0, bottom: 0, left: 0, right: 0 }) {
    super(coord.x, coord.y);
    this.direction = direction;
    this.orientation = orientation;
    this.captures = captures;
  }
  toString() {
    return `LodestoneMove(${this.coord.toString()}, ${this.direction}, ${this.orientation}, { top: ${this.captures.top}, bottom: ${this.captures.bottom}, left: ${this.captures.left}, right: ${this.captures.right} })`;
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.coord.equals(other.coord) === false)
      return false;
    if (this.orientation !== other.orientation)
      return false;
    if (this.direction !== other.direction)
      return false;
    if (this.captures.top !== other.captures.top)
      return false;
    if (this.captures.bottom !== other.captures.bottom)
      return false;
    if (this.captures.left !== other.captures.left)
      return false;
    if (this.captures.right !== other.captures.right)
      return false;
    return true;
  }
};

// games/dist/games/lodestone/LodestonePiece.js
var LodestonePieceNone = class _LodestonePieceNone {
  unreachable;
  static UNREACHABLE = new _LodestonePieceNone(true);
  static EMPTY = new _LodestonePieceNone(false);
  owner = PlayerOrNone.NONE;
  constructor(unreachable) {
    this.unreachable = unreachable;
  }
  isLodestone() {
    return false;
  }
  isPlayerPiece() {
    return false;
  }
  isEmpty() {
    return true;
  }
  isUnreachable() {
    return this.unreachable;
  }
  equals(other) {
    return this === other;
  }
};
var LodestonePiecePlayer = class _LodestonePiecePlayer {
  owner;
  static ZERO = new _LodestonePiecePlayer(Player.ZERO);
  static ONE = new _LodestonePiecePlayer(Player.ONE);
  static of(player) {
    if (player === Player.ZERO) {
      return _LodestonePiecePlayer.ZERO;
    } else {
      return _LodestonePiecePlayer.ONE;
    }
  }
  constructor(owner) {
    this.owner = owner;
  }
  isLodestone() {
    return false;
  }
  isPlayerPiece() {
    return true;
  }
  isEmpty() {
    return false;
  }
  isUnreachable() {
    return false;
  }
  equals(other) {
    return this === other;
  }
};
var LodestonePieceLodestone = class _LodestonePieceLodestone {
  owner;
  direction;
  orientation;
  static ZERO_PUSH_DIAGONAL = new _LodestonePieceLodestone(Player.ZERO, "push", "diagonal");
  static ZERO_PUSH_ORTHOGONAL = new _LodestonePieceLodestone(Player.ZERO, "push", "orthogonal");
  static ZERO_PULL_DIAGONAL = new _LodestonePieceLodestone(Player.ZERO, "pull", "diagonal");
  static ZERO_PULL_ORTHOGONAL = new _LodestonePieceLodestone(Player.ZERO, "pull", "orthogonal");
  static ONE_PUSH_DIAGONAL = new _LodestonePieceLodestone(Player.ONE, "push", "diagonal");
  static ONE_PUSH_ORTHOGONAL = new _LodestonePieceLodestone(Player.ONE, "push", "orthogonal");
  static ONE_PULL_DIAGONAL = new _LodestonePieceLodestone(Player.ONE, "pull", "diagonal");
  static ONE_PULL_ORTHOGONAL = new _LodestonePieceLodestone(Player.ONE, "pull", "orthogonal");
  static LODESTONES = {
    0: {
      "push": {
        "diagonal": _LodestonePieceLodestone.ZERO_PUSH_DIAGONAL,
        "orthogonal": _LodestonePieceLodestone.ZERO_PUSH_ORTHOGONAL
      },
      "pull": {
        "diagonal": _LodestonePieceLodestone.ZERO_PULL_DIAGONAL,
        "orthogonal": _LodestonePieceLodestone.ZERO_PULL_ORTHOGONAL
      }
    },
    1: {
      "push": {
        "diagonal": _LodestonePieceLodestone.ONE_PUSH_DIAGONAL,
        "orthogonal": _LodestonePieceLodestone.ONE_PUSH_ORTHOGONAL
      },
      "pull": {
        "diagonal": _LodestonePieceLodestone.ONE_PULL_DIAGONAL,
        "orthogonal": _LodestonePieceLodestone.ONE_PULL_ORTHOGONAL
      }
    }
  };
  constructor(owner, direction, orientation) {
    this.owner = owner;
    this.direction = direction;
    this.orientation = orientation;
  }
  static of(player, description) {
    return _LodestonePieceLodestone.LODESTONES[player.getValue()][description.direction][description.orientation];
  }
  isLodestone() {
    return true;
  }
  isPlayerPiece() {
    return false;
  }
  isEmpty() {
    return false;
  }
  isUnreachable() {
    return false;
  }
  equals(other) {
    return this === other;
  }
};

// games/dist/games/lodestone/LodestoneState.js
var LodestonePressurePlateGroup = class _LodestonePressurePlateGroup {
  plates;
  static of(sizes) {
    let plates = [];
    for (const size of sizes) {
      const newPlate = new LodestonePressurePlate(size, []);
      plates = plates.concat(newPlate);
    }
    return new _LodestonePressurePlateGroup(plates);
  }
  constructor(plates) {
    this.plates = plates;
  }
  getCrumbledPlates() {
    const fullPlates = [];
    for (const plate of this.plates) {
      if (plate.getRemainingSpaces() === 0) {
        fullPlates.push(plate);
      } else {
        return fullPlates;
      }
    }
    return fullPlates;
  }
  getCurrentPlate() {
    for (const plate of this.plates) {
      if (plate.getRemainingSpaces() > 0) {
        return MGPOptional.of(plate);
      }
    }
    return MGPOptional.empty();
  }
  getFollowingPlates() {
    const nextPlates = [];
    let currentPlateReached = false;
    for (const plate of this.plates) {
      if (currentPlateReached) {
        nextPlates.push(plate);
      } else if (plate.getRemainingSpaces() > 0) {
        currentPlateReached = true;
      }
    }
    return nextPlates;
  }
  getCurrentPlateWidth() {
    const currentPlate = this.getCurrentPlate();
    const emptyplate = new LodestonePressurePlate(0, []);
    return currentPlate.getOrElse(emptyplate).width;
  }
  /**
   * @returns the number of piece that can be put in that pressure plate group, all pressures plates included
   */
  getGroupRemainingSpaces() {
    const remainingSpaces = this.plates.map((plate) => plate.getRemainingSpaces());
    const totalRemainingSpaces = remainingSpaces.reduce((left, right) => left + right);
    return totalRemainingSpaces;
  }
  addCaptured(player, quantity) {
    if (quantity === 0) {
      return this;
    }
    const remainingSpaces = this.getGroupRemainingSpaces();
    Utils.assert(quantity <= remainingSpaces, `should never put more pieces than the plate can support (${remainingSpaces} > ${quantity})`);
    const fullPlates = this.getCrumbledPlates();
    const currentPlate = this.getCurrentPlate().get();
    const nextPlates = this.getFollowingPlates();
    const newPieces = ArrayUtils.copy(currentPlate.getPiecesCopy());
    const maxPiecesToPut = Math.min(quantity, currentPlate.getRemainingSpaces());
    for (let i = 0; i < maxPiecesToPut; i++) {
      newPieces.push(LodestonePiecePlayer.of(player));
      quantity--;
    }
    const newCurrentPlate = new LodestonePressurePlate(currentPlate.width, newPieces);
    const newGroup = new _LodestonePressurePlateGroup(fullPlates.concat(newCurrentPlate).concat(nextPlates));
    return newGroup.addCaptured(player, quantity);
  }
  getFillablePlateIndex() {
    let i = 0;
    for (const plate of this.plates) {
      if (plate.getRemainingSpaces() > 0) {
        return i;
      }
      i++;
    }
    return -1;
  }
};
var LodestonePressurePlate = class {
  width;
  pieces;
  static POSITIONS = ["top", "bottom", "left", "right"];
  constructor(width, pieces) {
    this.width = width;
    this.pieces = pieces;
  }
  getPieceAt(index) {
    if (index < this.pieces.length) {
      return this.pieces[index];
    } else {
      return LodestonePieceNone.EMPTY;
    }
  }
  getRemainingSpaces() {
    return this.width - this.pieces.length;
  }
  getPiecesCopy() {
    return ArrayUtils.copy(this.pieces);
  }
};
var LodestonePressurePlates;
(function(LodestonePressurePlates2) {
  function getInitialLodestonePressurePlates(sizes) {
    const newLodestonePressurePlates = {};
    for (const position of LodestonePressurePlate.POSITIONS) {
      newLodestonePressurePlates[position] = LodestonePressurePlateGroup.of(sizes);
    }
    return newLodestonePressurePlates;
  }
  LodestonePressurePlates2.getInitialLodestonePressurePlates = getInitialLodestonePressurePlates;
})(LodestonePressurePlates || (LodestonePressurePlates = {}));
var LodestoneState = class _LodestoneState extends GameStateWithTable {
  lodestones;
  pressurePlates;
  static SIZE = 8;
  static NUMBER_OF_PIECES = 24;
  static INITIAL_PRESSURE_PLATES = LodestonePressurePlates.getInitialLodestonePressurePlates([5, 3]);
  constructor(board, turn, lodestones, pressurePlates) {
    super(board, turn);
    this.lodestones = lodestones;
    this.pressurePlates = pressurePlates;
  }
  withBoard(board) {
    return new _LodestoneState(board, this.turn, this.lodestones, this.pressurePlates);
  }
  remainingSpaces() {
    const remaining = this.remainingSpacesDetails();
    return remaining.top + remaining.bottom + remaining.left + remaining.right;
  }
  remainingSpacesDetails() {
    const remaining = { top: 0, bottom: 0, left: 0, right: 0 };
    for (const position of LodestonePressurePlate.POSITIONS) {
      const pressurePlates = this.pressurePlates[position];
      const currentlyFillablePlateIndex = pressurePlates.getFillablePlateIndex();
      if (currentlyFillablePlateIndex === -1) {
        remaining[position] = 0;
      } else {
        remaining[position] = pressurePlates.getGroupRemainingSpaces();
      }
    }
    return remaining;
  }
  numberOfPieces() {
    const playerPieces = PlayerNumberMap.of(0, 0);
    for (let y = 0; y < _LodestoneState.SIZE; y++) {
      for (let x = 0; x < _LodestoneState.SIZE; x++) {
        const piece = this.getPieceAtXY(x, y);
        if (piece.isPlayerPiece()) {
          playerPieces.add(piece.owner, 1);
        }
      }
    }
    return playerPieces;
  }
  getScores() {
    const remainingPieces = this.numberOfPieces();
    return PlayerNumberMap.of(_LodestoneState.NUMBER_OF_PIECES - remainingPieces.get(Player.ONE), _LodestoneState.NUMBER_OF_PIECES - remainingPieces.get(Player.ZERO));
  }
  nextLodestoneDirection() {
    const currentPlayer = this.getCurrentPlayer();
    const lodestonePosition = this.lodestones.get(currentPlayer);
    if (lodestonePosition.isPresent()) {
      const piece = this.getPieceAt(lodestonePosition.get());
      Utils.assert(piece.isLodestone(), "Piece must be lodestone (invariant from LodestoneState)" + lodestonePosition.get());
      const lodestone = piece;
      const currentDirection = lodestone.direction;
      switch (currentDirection) {
        case "push":
          return MGPOptional.of("pull");
        case "pull":
          return MGPOptional.of("push");
      }
    } else {
      return MGPOptional.empty();
    }
  }
  coordIsOwnedBy(coord, player) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().owner.equals(player);
    } else {
      return false;
    }
  }
};

// games/dist/games/lodestone/LodestoneRules.js
var LodestoneRules = class _LodestoneRules extends Rules {
  static THREATENED_COORD_RANGE = MGPMap.from({
    top: {
      start: (indexPlate) => new Coord(0, indexPlate),
      direction: Ordinal.RIGHT
    },
    bottom: {
      start: (indexPlate) => new Coord(0, LodestoneState.SIZE - (indexPlate + 1)),
      direction: Ordinal.RIGHT
    },
    left: {
      start: (indexPlate) => new Coord(indexPlate, 0),
      direction: Ordinal.DOWN
    },
    right: {
      start: (indexPlate) => new Coord(LodestoneState.SIZE - (indexPlate + 1), 0),
      direction: Ordinal.DOWN
    }
  });
  static singleton = MGPOptional.empty();
  static get() {
    if (_LodestoneRules.singleton.isAbsent()) {
      _LodestoneRules.singleton = MGPOptional.of(new _LodestoneRules());
    }
    return _LodestoneRules.singleton.get();
  }
  getInitialState() {
    const _ = LodestonePieceNone.EMPTY;
    const O = LodestonePiecePlayer.ZERO;
    const X = LodestonePiecePlayer.ONE;
    const board = [
      [_, _, O, X, O, X, _, _],
      [_, O, X, O, X, O, X, _],
      [O, X, O, X, O, X, O, X],
      [X, O, X, _, _, O, X, O],
      [O, X, O, _, _, X, O, X],
      [X, O, X, O, X, O, X, O],
      [_, X, O, X, O, X, O, _],
      [_, _, X, O, X, O, _, _]
    ];
    const plates = LodestonePressurePlates.getInitialLodestonePressurePlates([5, 3]);
    return new LodestoneState(board, 0, new MGPMap(), plates);
  }
  applyLegalMove(move, state, _config, infos) {
    const currentPlayer = state.getCurrentPlayer();
    const opponent = currentPlayer.getOpponent();
    const board = TableUtils.copy(infos.board);
    const lodestones = state.lodestones.getCopy();
    lodestones.put(currentPlayer, move.coord);
    const pressurePlates = __spreadValues({}, state.pressurePlates);
    this.updatePressurePlates(board, pressurePlates, lodestones, opponent, move.captures);
    return new LodestoneState(board, state.turn + 1, lodestones, pressurePlates);
  }
  updatePressurePlates(board, pressurePlates, lodestones, opponent, captures) {
    for (const position of LodestonePressurePlate.POSITIONS) {
      pressurePlates[position] = this.updatePressurePlate(board, position, pressurePlates[position], lodestones, opponent, captures[position]);
    }
  }
  updatePressurePlate(board, position, pressurePlate, lodestones, opponent, captured) {
    if (pressurePlate.getCurrentPlate().isPresent()) {
      const newPressurePlate = pressurePlate.addCaptured(opponent, captured);
      const plateInfo = _LodestoneRules.THREATENED_COORD_RANGE.get(position).get();
      const length = newPressurePlate.getCrumbledPlates().length;
      for (let plateIndex = 0; plateIndex < length; plateIndex++) {
        const plateWidth = newPressurePlate.plates[plateIndex].width;
        this.removePressurePlate(board, plateInfo.start(plateIndex, plateWidth), plateInfo.direction, lodestones);
      }
      return newPressurePlate;
    } else {
      return pressurePlate;
    }
  }
  removePressurePlate(board, start, direction, lodestones) {
    for (
      let coord = start;
      // eslint-disable-next-line indent
      coord.isInRange(LodestoneState.SIZE, LodestoneState.SIZE);
      // eslint-disable-next-line indent
      coord = coord.getNext(direction)
    ) {
      for (const player of Player.PLAYERS) {
        if (lodestones.get(player).equalsValue(coord)) {
          lodestones.delete(player);
        }
      }
      board[coord.y][coord.x] = LodestonePieceNone.UNREACHABLE;
    }
  }
  isLegal(move, state) {
    const validityBeforeCaptures = this.isLegalWithoutCaptures(state, move.coord, move.direction);
    if (validityBeforeCaptures.isFailure()) {
      return MGPFallible.failure(validityBeforeCaptures.getReason());
    }
    const infos = this.applyMoveWithoutPlacingCaptures(state, move.coord, move);
    const numberOfCapturesInMove = move.captures.top + move.captures.bottom + move.captures.left + move.captures.right;
    const actualCaptures = Math.min(infos.captures.length, state.remainingSpaces());
    if (numberOfCapturesInMove !== actualCaptures) {
      return MGPFallible.failure(LodestoneFailure.MUST_PLACE_CAPTURES_ON_PRESSURE_PLATES());
    }
    for (const position of LodestonePressurePlate.POSITIONS) {
      const pressurePlate = state.pressurePlates[position];
      if (pressurePlate.getGroupRemainingSpaces() < move.captures[position]) {
        return MGPFallible.failure(LodestoneFailure.TOO_MANY_CAPTURES_ON_SAME_PRESSURE_PLATE());
      }
    }
    return MGPFallible.success(infos);
  }
  applyMoveWithoutPlacingCaptures(state, coord, lodestone) {
    let result;
    const board = TableUtils.copy(state.board);
    const previousLodestonePosition = state.lodestones.get(state.getCurrentPlayer());
    if (previousLodestonePosition.isPresent()) {
      const previousCoord = previousLodestonePosition.get();
      board[previousCoord.y][previousCoord.x] = LodestonePieceNone.EMPTY;
    }
    if (lodestone.direction === "pull") {
      result = this.applyPull(state, board, coord, lodestone.orientation);
    } else {
      result = this.applyPush(state, board, coord, lodestone.orientation);
    }
    result.board[coord.y][coord.x] = LodestonePieceLodestone.of(state.getCurrentPlayer(), lodestone);
    result.moved.push(coord);
    return result;
  }
  applyPull(state, board, lodestone, orientation) {
    const currentPlayer = state.getCurrentPlayer();
    const opponent = currentPlayer.getOpponent();
    const captures = [];
    const moved = [];
    const directions = orientation === "diagonal" ? Ordinal.DIAGONALS : Ordinal.ORTHOGONALS;
    for (const direction of directions) {
      let coord = lodestone.getNext(direction);
      while (state.isOnBoard(coord)) {
        const pieceOnTarget = board[coord.y][coord.x];
        const next = coord.getNext(direction);
        if (state.coordIsOwnedBy(next, currentPlayer)) {
          const pieceToMove = board[next.y][next.x];
          if (pieceToMove.isPlayerPiece()) {
            if (pieceOnTarget.isEmpty()) {
              moved.push(coord);
              board[coord.y][coord.x] = pieceToMove;
              moved.push(next);
              board[next.y][next.x] = LodestonePieceNone.EMPTY;
            } else if (pieceOnTarget.isPlayerPiece() && pieceOnTarget.owner === opponent) {
              captures.push(coord);
              board[coord.y][coord.x] = pieceToMove;
              moved.push(next);
              board[next.y][next.x] = LodestonePieceNone.EMPTY;
            }
          }
        }
        coord = coord.getNext(direction);
      }
    }
    return { board, captures, moved };
  }
  applyPush(state, board, lodestone, orientation) {
    const currentPlayer = state.getCurrentPlayer();
    const opponent = currentPlayer.getOpponent();
    const captures = [];
    const moved = [];
    const directions = orientation === "diagonal" ? Ordinal.DIAGONALS : Ordinal.ORTHOGONALS;
    for (const direction of directions) {
      const start = lodestone.getNext(direction, LodestoneState.SIZE);
      for (
        let coord = start;
        // eslint-disable-next-line indent
        coord.equals(lodestone) === false;
        // eslint-disable-next-line indent
        coord = coord.getPrevious(direction)
      ) {
        if (state.coordIsOwnedBy(coord, opponent)) {
          const pieceToMove = board[coord.y][coord.x];
          if (pieceToMove.isPlayerPiece()) {
            const next = coord.getNext(direction);
            if (state.isOnBoard(next)) {
              const pieceOnTarget = board[next.y][next.x];
              if (pieceOnTarget.isUnreachable()) {
                captures.push(coord);
                board[coord.y][coord.x] = LodestonePieceNone.EMPTY;
              } else if (pieceOnTarget.isEmpty()) {
                moved.push(next);
                board[next.y][next.x] = pieceToMove;
                moved.push(coord);
                board[coord.y][coord.x] = LodestonePieceNone.EMPTY;
              }
            } else {
              captures.push(coord);
              board[coord.y][coord.x] = LodestonePieceNone.EMPTY;
            }
          }
        }
      }
    }
    return { board, captures, moved };
  }
  isLegalWithoutCaptures(state, coord, direction) {
    const targetValidity = this.isTargetLegal(state, coord);
    if (targetValidity.isFailure()) {
      return targetValidity;
    }
    const nextLodestoneDirection = state.nextLodestoneDirection();
    const validLodestoneDirection = nextLodestoneDirection.isAbsent() || nextLodestoneDirection.equalsValue(direction);
    if (validLodestoneDirection === false) {
      return MGPValidation.failure(LodestoneFailure.MUST_FLIP_LODESTONE());
    }
    return MGPValidation.SUCCESS;
  }
  isTargetLegal(state, coord) {
    const targetContent = state.getPieceAt(coord);
    if (targetContent.isUnreachable()) {
      return MGPValidation.failure(LodestoneFailure.TARGET_IS_CRUMBLED());
    }
    if (targetContent.isPlayerPiece()) {
      return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SQUARE());
    }
    const player = state.getCurrentPlayer();
    if (targetContent.isLodestone() && targetContent.owner !== player) {
      return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SQUARE());
    }
    return MGPValidation.SUCCESS;
  }
  getGameStatus(node) {
    const state = node.gameState;
    const pieces = state.numberOfPieces();
    const piecesZero = pieces.get(Player.ZERO);
    const piecesOne = pieces.get(Player.ONE);
    if (piecesZero === 0 && piecesOne === 0) {
      return GameStatus.DRAW;
    } else if (piecesZero === 0) {
      return GameStatus.ONE_WON;
    } else if (piecesOne === 0) {
      return GameStatus.ZERO_WON;
    } else {
      return GameStatus.ONGOING;
    }
  }
};

// games/dist/games/lodestone/LodestoneMoveGenerator.js
var LodestoneMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    return this.flatMapEmptyCoords(state, (coord) => {
      const moves = [];
      for (const direction of this.nextDirection(state)) {
        const orientations = ["diagonal", "orthogonal"];
        for (const orientation of orientations) {
          const infos = LodestoneRules.get().applyMoveWithoutPlacingCaptures(state, coord, { direction, orientation });
          const captures = infos.captures;
          const numberOfCaptures = captures.length;
          for (const captureCombination of this.captureCombinations(state, numberOfCaptures)) {
            moves.push(new LodestoneMove(coord, direction, orientation, captureCombination));
          }
        }
      }
      return moves;
    });
  }
  captureCombinations(state, numberOfCaptures) {
    if (numberOfCaptures === 0) {
      return new Set2([{ top: 0, bottom: 0, left: 0, right: 0 }]);
    } else {
      let combinations = new Set2();
      const available = state.remainingSpacesDetails();
      const subCombinations = this.captureCombinations(state, numberOfCaptures - 1);
      for (const subCombination of subCombinations) {
        if (subCombination.top + 1 <= available.top) {
          combinations = combinations.addElement(__spreadProps(__spreadValues({}, subCombination), { top: subCombination.top + 1 }));
        }
        if (subCombination.bottom + 1 <= available.bottom) {
          combinations = combinations.addElement(__spreadProps(__spreadValues({}, subCombination), { bottom: subCombination.bottom + 1 }));
        }
        if (subCombination.left + 1 <= available.left) {
          combinations = combinations.addElement(__spreadProps(__spreadValues({}, subCombination), { left: subCombination.left + 1 }));
        }
        if (subCombination.right + 1 <= available.right) {
          combinations = combinations.addElement(__spreadProps(__spreadValues({}, subCombination), { right: subCombination.right + 1 }));
        }
      }
      if (combinations.size() === 0) {
        return subCombinations;
      }
      return combinations;
    }
  }
  flatMapEmptyCoords(state, f) {
    let moves = [];
    for (let y = 0; y < LodestoneState.SIZE; y++) {
      for (let x = 0; x < LodestoneState.SIZE; x++) {
        const coord = new Coord(x, y);
        const piece = state.getPieceAt(coord);
        if (piece.isEmpty() && piece.isUnreachable() === false) {
          moves = moves.concat(f(coord));
        } else if (piece.isLodestone() && piece.owner === state.getCurrentPlayer()) {
          moves = moves.concat(f(coord));
        }
      }
    }
    return moves;
  }
  nextDirection(state) {
    const nextDirection = state.nextLodestoneDirection();
    if (nextDirection.isPresent()) {
      return [nextDirection.get()];
    } else {
      return ["push", "pull"];
    }
  }
};

// games/dist/games/lodestone/LodestoneScoreHeuristic.js
var LodestoneScoreHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    return node.gameState.getScores().toTable();
  }
};

// games/dist/games/mancala/common/MancalaMove.js
var MancalaDistribution = class _MancalaDistribution {
  x;
  y;
  static encoder = Encoder.tuple([Encoder.identity(), Encoder.identity()], (distribution) => [distribution.x, distribution.y], (value) => _MancalaDistribution.of(value[0], value[1]));
  static of(x, y) {
    Utils.assert(0 <= x, "MancalaDistribution.x should be a positive integer!");
    Utils.assert(0 <= y, "MancalaDistribution.y should be a positive integer!");
    return new _MancalaDistribution(x, y);
  }
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    if (other === this)
      return true;
    if (other.x !== this.x)
      return false;
    return other.y === this.y;
  }
};
var MancalaMove = class _MancalaMove extends Move {
  distributions;
  static encoder = Encoder.tuple([Encoder.list(MancalaDistribution.encoder)], (move) => [move.distributions], (value) => _MancalaMove.of(value[0][0], value[0].slice(1)));
  static of(mandatoryDistribution, bonusDistributions = []) {
    const distributions = [mandatoryDistribution];
    distributions.push(...bonusDistributions);
    return new _MancalaMove(distributions);
  }
  constructor(distributions) {
    super();
    this.distributions = distributions;
    Utils.assert(distributions.length > 0, "Move should have distribution ");
  }
  add(move) {
    return _MancalaMove.of(this.distributions[0], this.distributions.slice(1).concat(move));
  }
  toString() {
    const distributions = this.distributions.map((move) => "(" + move.x + ", " + move.y + ")");
    return "MancalaMove([" + distributions.join(", ") + "])";
  }
  equals(other) {
    return ArrayUtils.equals(this.distributions, other.distributions);
  }
  getFirstDistribution() {
    return this.distributions[0];
  }
  [Symbol.iterator]() {
    return this.distributions.values();
  }
};

// games/dist/games/mancala/common/MancalaFailure.js
var MancalaFailure = class {
  static MUST_DISTRIBUTE_YOUR_OWN_HOUSES = () => $localize`You must distribute one of your houses.`;
  static MUST_CHOOSE_NON_EMPTY_HOUSE = () => $localize`You should choose a non-empty house to distribute.`;
  static SHOULD_DISTRIBUTE = () => $localize`You should feed but you do not.`;
};

// games/dist/games/mancala/common/MancalaState.js
var MancalaState = class _MancalaState extends GameStateWithTable {
  scores;
  static of(state, board) {
    return new _MancalaState(board, state.turn, state.getScoresCopy());
  }
  constructor(b, turn, scores) {
    super(b, turn);
    this.scores = scores;
  }
  setPieceAt(coord, value) {
    return GameStateWithTable.setPieceAt(this, coord, value, _MancalaState.of);
  }
  feedStore(player) {
    const newScore = this.getScoresCopy();
    newScore.add(player, 1);
    return new _MancalaState(this.getCopiedBoard(), this.turn, newScore);
  }
  feed(coord) {
    return this.addPieceAt(coord, 1);
  }
  addPieceAt(coord, value) {
    const previousValue = this.getPieceAt(coord);
    return this.setPieceAt(coord, previousValue + value);
  }
  getTotalRemainingSeeds() {
    return TableUtils.sum(this.board);
  }
  getScoresCopy() {
    return this.scores.getCopy();
  }
  /**
   * @param player the player that'll win point
   * @param coord the coord that'll get empty
   * @returns the resulting state in which 'player' emptied 'coord' to win all its seeds as point
   */
  capture(player, coord) {
    const capturedSeeds = this.getPieceAt(coord);
    const newScores = this.getScoresCopy();
    newScores.add(player, capturedSeeds);
    const result = new _MancalaState(this.getCopiedBoard(), this.turn, newScores);
    return result.setPieceAt(coord, 0);
  }
  equals(other) {
    if (TableUtils.equals(this.board, other.board) === false)
      return false;
    if (this.scores.equals(other.scores) === false)
      return false;
    return this.turn === other.turn;
  }
};

// games/dist/games/mancala/common/MancalaRules.js
var MancalaRules = class _MancalaRules extends ConfigurableRules {
  capturableValues;
  static FEED_ORIGINAL_HOUSE = () => $localize`Feed original house`;
  static MUST_FEED = () => $localize`You must feed`;
  static PASS_BY_PLAYER_STORE = () => $localize`Pass by player store`;
  static MULTIPLE_SOW = () => $localize`Continue distribution after last seed ends in store`;
  static CYCLICAL_LAP = () => $localize`Continue distribution until capture or empty house`;
  static SEEDS_BY_HOUSE = () => $localize`Seeds by house`;
  static NUMBER_OF_ROWS = () => $localize`Number of rows`;
  // These are the coordinates of the store. These are fake coordinates since the stores are not on the board
  static FAKE_STORE_COORD = new ReversibleMap([
    { key: Player.ZERO, value: new Coord(-1, -1) },
    { key: Player.ONE, value: new Coord(-1, 1) }
  ]);
  static isStarving(player, board, config) {
    return _MancalaRules.getAllCoordOf(player, config).every((coord) => {
      return board[coord.y][coord.x] <= 0;
    });
  }
  static getAllCoordOf(player, config) {
    const coords = [];
    const y0 = player === Player.ZERO ? config.numberOfRows : 0;
    for (let y = 0; y < config.numberOfRows; y++) {
      for (let x = 0; x < config.width; x++) {
        coords.push(new Coord(x, y + y0));
      }
    }
    return coords;
  }
  static getEmptyDistributionResult(state) {
    return {
      capturedSum: 0,
      captureMap: TableUtils.create(state.getWidth(), state.getHeight(), 0),
      endsUpInStore: false,
      filledCoords: [],
      passedByStoreNTimes: 0,
      resultingState: state
    };
  }
  static getInitialState(config) {
    const board = TableUtils.create(config.width, config.numberOfRows * 2, config.seedsByHouse);
    return new MancalaState(board, 0, PlayerNumberMap.of(0, 0));
  }
  constructor(capturableValues) {
    super();
    this.capturableValues = capturableValues;
  }
  isLegal(move, state, config) {
    let canStillPlay = true;
    for (const distribution of move) {
      Utils.assert(canStillPlay, "Cannot play after non kalah move");
      const distributionResult = this.isLegalDistribution(distribution, state, config);
      if (distributionResult.isFailure()) {
        return MGPValidation.ofFallible(distributionResult);
      } else {
        const previousDistributionResult = _MancalaRules.getEmptyDistributionResult(state);
        state = this.distributeHouse(distribution, previousDistributionResult, config).resultingState;
        canStillPlay = distributionResult.get();
      }
    }
    if (config.mustContinueDistributionAfterStore) {
      Utils.assert(canStillPlay === false, "Must continue playing after kalah move");
    }
    if (config.mustFeed) {
      const opponent = state.getCurrentOpponent();
      const opponentIsStarving = _MancalaRules.isStarving(opponent, state.board, config);
      const playerDoesEmbargo = this.canDistribute(state.getCurrentPlayer(), state, config);
      if (opponentIsStarving && playerDoesEmbargo) {
        return MGPValidation.failure(MancalaFailure.SHOULD_DISTRIBUTE());
      }
    }
    return MGPValidation.SUCCESS;
  }
  getInitialState(config) {
    return _MancalaRules.getInitialState(config);
  }
  /**
   * If the distribution is illegal, returns a failure including the failure reason
   * If the distribution is legal, return a MGPFallible of a boolean that is true if user can still play
   */
  isLegalDistribution(distribution, state, config) {
    if (state.getPieceAtXY(distribution.x, distribution.y) === 0) {
      return MGPFallible.failure(MancalaFailure.MUST_CHOOSE_NON_EMPTY_HOUSE());
    }
    const spaceOwner = this.getSpaceOwner(new Coord(distribution.x, distribution.y), config);
    if (spaceOwner === state.getCurrentOpponent()) {
      return MGPFallible.failure(MancalaFailure.MUST_DISTRIBUTE_YOUR_OWN_HOUSES());
    }
    const distributionResult = this.distributeMove(MancalaMove.of(distribution), state, config);
    const isStarving = _MancalaRules.isStarving(distributionResult.resultingState.getCurrentPlayer(), distributionResult.resultingState.board, config);
    return MGPFallible.success(distributionResult.endsUpInStore && isStarving === false);
  }
  /**
   * Apply the distribution part of the move.
   * Apply the capture that happened due to distribution (for example the passage in the store).
   * Should not increment the turn of the state.
   */
  distributeMove(move, state, config) {
    const player = state.getCurrentPlayer();
    const filledCoords = [];
    let distributionResult = {
      capturedSum: 0,
      captureMap: TableUtils.create(config.width, config.numberOfRows * 2, 0),
      endsUpInStore: false,
      passedByStoreNTimes: 0,
      filledCoords: [],
      resultingState: state
    };
    for (const distribution of move) {
      let houseToDistribute = new Coord(distribution.x, distribution.y);
      let mustDoOneMoreLap = true;
      while (mustDoOneMoreLap) {
        distributionResult = this.distributeHouse(houseToDistribute, distributionResult, config);
        const captures = distributionResult.resultingState.getScoresCopy();
        captures.add(player, distributionResult.passedByStoreNTimes);
        filledCoords.push(...distributionResult.filledCoords);
        houseToDistribute = distributionResult.filledCoords[distributionResult.filledCoords.length - 1];
        if (config.continueLapUntilCaptureOrEmptyHouse && distributionResult.endsUpInStore === false) {
          mustDoOneMoreLap = this.isHouseCapturableOrEmpty(houseToDistribute, distributionResult.resultingState) === false;
        } else {
          mustDoOneMoreLap = false;
        }
      }
    }
    return {
      endsUpInStore: distributionResult.endsUpInStore,
      filledCoords,
      passedByStoreNTimes: distributionResult.passedByStoreNTimes,
      resultingState: distributionResult.resultingState,
      capturedSum: 0,
      captureMap: distributionResult.captureMap
    };
  }
  isHouseCapturableOrEmpty(coord, state) {
    const houseContent = state.getPieceAt(coord);
    return houseContent === 1 || this.capturableValues.some((value) => value === houseContent);
  }
  mustMonsoon(postCaptureState, config) {
    const postCaptureBoard = postCaptureState.getCopiedBoard();
    const opponent = postCaptureState.getCurrentOpponent();
    const player = postCaptureState.getCurrentPlayer();
    if (config.mustFeed) {
      if (_MancalaRules.isStarving(player, postCaptureBoard, config) && this.canDistribute(opponent, postCaptureState, config) === false) {
        return [opponent];
      }
    } else {
      if (_MancalaRules.isStarving(opponent, postCaptureBoard, config)) {
        return [player];
      } else if (_MancalaRules.isStarving(player, postCaptureBoard, config)) {
        return [opponent];
      }
    }
    return [];
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const width = node.gameState.getWidth();
    const seedsByHouse = config.seedsByHouse;
    const halfOfTotalSeeds = width * seedsByHouse * config.numberOfRows;
    if (state.scores.get(Player.ZERO) > halfOfTotalSeeds) {
      return GameStatus.ZERO_WON;
    }
    if (state.scores.get(Player.ONE) > halfOfTotalSeeds) {
      return GameStatus.ONE_WON;
    }
    if (state.scores.get(Player.ZERO) === halfOfTotalSeeds && state.scores.get(Player.ONE) === halfOfTotalSeeds) {
      return GameStatus.DRAW;
    }
    return GameStatus.ONGOING;
  }
  applyLegalMove(move, state, config, _) {
    const distributionsResult = this.distributeMove(move, state, config);
    const captureResult = this.applyCapture(distributionsResult, config);
    let resultingState = captureResult.resultingState;
    const playerToMonsoon = this.mustMonsoon(resultingState, config);
    if (playerToMonsoon.length === 1) {
      const monsoonResult = this.monsoon(playerToMonsoon[0], captureResult);
      resultingState = monsoonResult.resultingState;
    } else if (playerToMonsoon.length === 2) {
      const monsoonResult = this.sharedMonsoon(captureResult);
      resultingState = monsoonResult.resultingState;
    }
    return new MancalaState(resultingState.board, resultingState.turn + 1, resultingState.scores);
  }
  /**
   * Simply distribute the group of seeds in (x, y)
   * Does not make the capture nor verify the legality of the move
   * Returns the coords of the filled houses
   */
  distributeHouse(distribution, previousLapResult, config) {
    let coord = new Coord(distribution.x, distribution.y);
    const initial = new Coord(distribution.x, distribution.y);
    let seedsInHand = previousLapResult.resultingState.getPieceAt(initial);
    let resultingState = previousLapResult.resultingState.setPieceAt(initial, 0);
    const player = resultingState.getCurrentPlayer();
    const filledCoords = [];
    let passedByStoreNTimes = 0;
    let previousDropWasStore = false;
    let endsUpInStore = false;
    let capturedSum = 0;
    while (seedsInHand > 0) {
      previousDropWasStore = endsUpInStore;
      endsUpInStore = false;
      const nextCoord = this.getNextCoord(coord, previousDropWasStore, previousLapResult.resultingState, config);
      endsUpInStore = nextCoord.isAbsent();
      if (endsUpInStore) {
        passedByStoreNTimes++;
        resultingState = resultingState.feedStore(player);
        seedsInHand--;
        filledCoords.push(_MancalaRules.FAKE_STORE_COORD.get(player).get());
      } else {
        coord = nextCoord.get();
        if (initial.equals(coord) === false || config.feedOriginalHouse) {
          const dropResult = this.getDropResult(seedsInHand, resultingState, coord);
          resultingState = dropResult.resultingState;
          previousLapResult.captureMap = TableUtils.add(previousLapResult.captureMap, dropResult.captureMap);
          capturedSum += dropResult.capturedSum;
          filledCoords.push(coord);
          seedsInHand--;
        }
      }
    }
    return {
      filledCoords,
      passedByStoreNTimes,
      endsUpInStore,
      resultingState,
      capturedSum,
      captureMap: previousLapResult.captureMap
    };
  }
  /**
   * @param config the config of the game
   * @param _seedsInHand the number of seed in hand at the drop moment
   * @param state the board on which a seed is going to be dropped
   * @param coord the coord to feed
   * @returns the result of the drop (updated)
   */
  getDropResult(_seedsInHand, state, coord) {
    return {
      capturedSum: 0,
      captureMap: TableUtils.create(state.getWidth(), state.getHeight(), 0),
      resultingState: state.feed(coord)
    };
  }
  getNextCoord(coord, previousDropWasStore, state, config) {
    const coordOwner = this.getSpaceOwner(coord, config);
    const horizontalDirection = coordOwner === Player.ONE ? Orthogonal.RIGHT : Orthogonal.LEFT;
    const nextCoord = coord.getNext(horizontalDirection);
    if (state.isOnBoard(nextCoord)) {
      return MGPOptional.of(nextCoord);
    }
    const isPlayerStore = state.getCurrentPlayer() === Player.ZERO ? nextCoord.x === -1 : nextCoord.x === config.width;
    if (config.passByPlayerStore && isPlayerStore && previousDropWasStore === false) {
      return MGPOptional.empty();
    }
    const newY = this.getOppositeY(coord, config);
    const newCoord = new Coord(coord.x, newY);
    return MGPOptional.of(newCoord);
  }
  getOppositeY(coord, config) {
    const coordOwner = this.getSpaceOwner(coord, config);
    const verticalDirection = coordOwner === Player.ONE ? Orthogonal.DOWN : Orthogonal.UP;
    const verticalFactor = 2 * Math.abs(config.numberOfRows - 0.5 - coord.y);
    return coord.y + verticalFactor * verticalDirection.y;
  }
  getStoreOwner(coord) {
    return _MancalaRules.FAKE_STORE_COORD.reverse().get(coord);
  }
  getSpaceOwner(coord, config) {
    const owner = this.getStoreOwner(coord);
    if (owner.isPresent()) {
      return owner.get().getAnyElement().get();
    } else {
      return coord.y < config.numberOfRows ? Player.ONE : Player.ZERO;
    }
  }
  doesDistribute(x, y, state, config) {
    const board = state.board;
    let pieceNeededToFeedStore;
    if (y === 0) {
      pieceNeededToFeedStore = state.getWidth() - x;
    } else {
      pieceNeededToFeedStore = x + 1;
    }
    const storeOffset = config.passByPlayerStore ? 1 : 0;
    const pieceNeededToFeedOpponent = pieceNeededToFeedStore + storeOffset;
    return pieceNeededToFeedOpponent <= board[y][x];
  }
  canDistribute(player, state, config) {
    for (const coord of _MancalaRules.getAllCoordOf(player, config)) {
      if (this.doesDistribute(coord.x, coord.y, state, config)) {
        return true;
      }
    }
    return false;
  }
  /**
    * Captures all the seeds of the monsooning player.
    * Returns the sum of all captured seeds.
    * Is called when a game is over because of starvation
    * Or for Ba-awa/Adi: when we drop below 9 pieces
    */
  monsoon(monsooningPlayer, postCaptureResult) {
    const state = postCaptureResult.resultingState;
    const resultingBoard = TableUtils.create(state.getWidth(), state.getHeight(), 0);
    const captured = state.getScoresCopy();
    const capturedSum = state.getTotalRemainingSeeds();
    const captureMap = TableUtils.add(postCaptureResult.captureMap, state.board);
    captured.add(monsooningPlayer, capturedSum);
    return {
      capturedSum,
      captureMap,
      resultingState: new MancalaState(resultingBoard, state.turn, captured)
    };
  }
  sharedMonsoon(postCaptureResult) {
    const state = postCaptureResult.resultingState;
    const resultingBoard = TableUtils.create(state.getWidth(), state.getHeight(), 0);
    const captured = state.getScoresCopy();
    const capturedSum = state.getTotalRemainingSeeds();
    const captureMap = TableUtils.add(postCaptureResult.captureMap, state.board);
    captured.add(Player.ZERO, Math.floor(capturedSum / 2));
    captured.add(Player.ONE, Math.floor(capturedSum / 2));
    return {
      capturedSum,
      captureMap,
      resultingState: new MancalaState(resultingBoard, state.turn, captured)
    };
  }
  isCapturableValue(value) {
    return this.capturableValues.some((capturableValue) => capturableValue === value);
  }
};

// games/dist/games/mancala/common/MancalaMoveGenerator.js
var MancalaMoveGenerator = class extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const moves = [];
    const state = node.gameState;
    for (const coord of MancalaRules.getAllCoordOf(state.getCurrentPlayer(), config)) {
      if (state.getPieceAt(coord) > 0) {
        const move = MancalaMove.of(MancalaDistribution.of(coord.x, coord.y));
        if (config.mustContinueDistributionAfterStore) {
          moves.push(...this.getPossibleMoveContinuations(state, coord.x, coord.y, move, config));
        } else {
          const legality = this.rules.isLegal(move, state, config);
          if (legality.isSuccess()) {
            moves.push(move);
          }
        }
      }
    }
    return moves;
  }
  getPossibleMoveContinuations(state, x, y, currentMove, config) {
    const moves = [];
    const previousDistributionResult = MancalaRules.getEmptyDistributionResult(state);
    const distributionResult = this.rules.distributeHouse(MancalaDistribution.of(x, y), previousDistributionResult, config);
    const stateAfterDistribution = distributionResult.resultingState;
    const isStarving = MancalaRules.isStarving(stateAfterDistribution.getCurrentPlayer(), stateAfterDistribution.board, config);
    const playerHasPieces = isStarving === false;
    if (distributionResult.endsUpInStore && playerHasPieces) {
      for (let i = 0; i < stateAfterDistribution.getWidth(); i++) {
        if (stateAfterDistribution.getPieceAtXY(i, y) > 0) {
          const move = currentMove.add(MancalaDistribution.of(i, y));
          moves.push(...this.getPossibleMoveContinuations(stateAfterDistribution, i, y, move, config));
        }
      }
      return moves;
    } else {
      return [currentMove];
    }
  }
};

// games/dist/games/mancala/awale/AwaleRules.js
var AwaleRules = class _AwaleRules extends MancalaRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Awalé`,
    config: {
      feedOriginalHouse: new BooleanConfig(false, MancalaRules.FEED_ORIGINAL_HOUSE),
      mustFeed: new BooleanConfig(true, MancalaRules.MUST_FEED),
      passByPlayerStore: new BooleanConfig(false, MancalaRules.PASS_BY_PLAYER_STORE),
      mustContinueDistributionAfterStore: new BooleanConfig(false, MancalaRules.MULTIPLE_SOW),
      continueLapUntilCaptureOrEmptyHouse: new BooleanConfig(false, MancalaRules.CYCLICAL_LAP),
      seedsByHouse: new NumberConfig(4, MancalaRules.SEEDS_BY_HOUSE, MGPValidators.range(1, 99)),
      width: new NumberConfig(6, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      numberOfRows: new NumberConfig(1, MancalaRules.NUMBER_OF_ROWS, MGPValidators.range(1, 99))
    }
  });
  static get() {
    if (_AwaleRules.singleton.isAbsent()) {
      _AwaleRules.singleton = MGPOptional.of(new _AwaleRules([2, 3]));
    }
    return _AwaleRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _AwaleRules.RULES_CONFIG_DESCRIPTION;
  }
  applyCapture(distributionResult, config) {
    const filledCoords = distributionResult.filledCoords;
    const landingCoord = filledCoords[filledCoords.length - 1];
    const resultingState = distributionResult.resultingState;
    return this.captureIfLegal(landingCoord.x, landingCoord.y, resultingState, config);
  }
  /**
   * Only called if piece is opponent's territory
   * If the condition to make a capture into the opponent's side are met
   * Captures and return the number of captured
   * Captures even if this could mean doing an illegal starvation
   */
  capture(x, y, state, config) {
    Utils.assert(this.coordIsInOpponentTerritory(x, y, state, config), "AwaleRules.capture cannot capture the players house");
    let resultingState = state;
    let target = resultingState.getOptionalPieceAtXY(x, y);
    let capturedSum = 0;
    const captureMap = TableUtils.create(config.width, 2 * config.numberOfRows, 0);
    if (this.isCapturableValue(target.get()) === false) {
      return { capturedSum: 0, captureMap, resultingState: state };
    }
    let direction = -1;
    let limit = -1;
    const player = state.getCurrentPlayer();
    if (player === Player.ONE) {
      direction = 1;
      limit = state.getWidth();
    }
    do {
      captureMap[y][x] = target.get();
      capturedSum += target.get();
      resultingState = resultingState.capture(player, new Coord(x, y));
      x += direction;
      target = resultingState.getOptionalPieceAtXY(x, y);
    } while (x !== limit && target.isPresent() && this.isCapturableValue(target.get()));
    return { capturedSum, captureMap, resultingState };
  }
  coordIsInOpponentTerritory(x, y, state, config) {
    if (state.isOnBoard(new Coord(x, y))) {
      return state.getCurrentPlayer() === Player.ZERO ? y < config.numberOfRows : config.numberOfRows <= y;
    } else {
      return false;
    }
  }
  captureIfLegal(x, y, state, config) {
    const player = state.getCurrentPlayer();
    const captureLessResult = {
      capturedSum: 0,
      resultingState: state,
      // Apply no capture
      captureMap: TableUtils.create(state.getWidth(), state.getHeight(), 0)
    };
    if (this.coordIsInOpponentTerritory(x, y, state, config)) {
      const captureResult = this.capture(x, y, state, config);
      const isStarving = MancalaRules.isStarving(player.getOpponent(), captureResult.resultingState.board, config);
      if (captureResult.capturedSum > 0 && isStarving) {
        return captureLessResult;
      } else {
        return captureResult;
      }
    } else {
      return captureLessResult;
    }
  }
};

// games/dist/games/mancala/awale/AwaleMoveGenerator.js
var AwaleMoveGenerator = class extends MancalaMoveGenerator {
  constructor() {
    super(AwaleRules.get());
  }
};

// games/dist/games/mancala/ba-awa/BaAwaRules.js
var BaAwaRules = class _BaAwaRules extends MancalaRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Ba-awa`,
    config: {
      feedOriginalHouse: new BooleanConfig(true, MancalaRules.FEED_ORIGINAL_HOUSE),
      mustFeed: new BooleanConfig(false, MancalaRules.MUST_FEED),
      passByPlayerStore: new BooleanConfig(false, MancalaRules.PASS_BY_PLAYER_STORE),
      mustContinueDistributionAfterStore: new BooleanConfig(false, MancalaRules.MULTIPLE_SOW),
      continueLapUntilCaptureOrEmptyHouse: new BooleanConfig(true, MancalaRules.CYCLICAL_LAP),
      seedsByHouse: new NumberConfig(4, MancalaRules.SEEDS_BY_HOUSE, MGPValidators.range(1, 99)),
      width: new NumberConfig(6, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      numberOfRows: new NumberConfig(1, MancalaRules.NUMBER_OF_ROWS, MGPValidators.range(1, 99)),
      splitFinalSeedsEvenly: new BooleanConfig(false, () => $localize`Split final seeds evenly`)
    }
  }, [{
    name: () => $localize`Even Ba-awa`,
    config: {
      feedOriginalHouse: true,
      mustFeed: false,
      passByPlayerStore: false,
      mustContinueDistributionAfterStore: false,
      continueLapUntilCaptureOrEmptyHouse: true,
      seedsByHouse: 4,
      width: 6,
      numberOfRows: 1,
      splitFinalSeedsEvenly: true
    }
  }]);
  static get() {
    if (_BaAwaRules.singleton.isAbsent()) {
      _BaAwaRules.singleton = MGPOptional.of(new _BaAwaRules([4]));
    }
    return _BaAwaRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _BaAwaRules.RULES_CONFIG_DESCRIPTION;
  }
  applyCapture(distributionResult) {
    const captureMap = TableUtils.copy(distributionResult.captureMap);
    const lastDrop = distributionResult.filledCoords[distributionResult.filledCoords.length - 1];
    if (distributionResult.endsUpInStore === false) {
      const lastHouseContent = distributionResult.resultingState.getPieceAt(lastDrop);
      if (this.isCapturableValue(lastHouseContent)) {
        const currentPlayer = distributionResult.resultingState.getCurrentPlayer();
        distributionResult.capturedSum += lastHouseContent;
        captureMap[lastDrop.y][lastDrop.x] += lastHouseContent;
        distributionResult.resultingState = distributionResult.resultingState.capture(currentPlayer, lastDrop);
      }
    }
    return {
      capturedSum: distributionResult.capturedSum,
      captureMap,
      resultingState: distributionResult.resultingState
    };
  }
  getDropResult(seedsInHand, state, coord) {
    let resultingState = state.feed(coord);
    const previousValue = resultingState.getPieceAt(coord);
    const captureMap = TableUtils.create(state.getWidth(), state.getHeight(), 0);
    if (previousValue === 4 && seedsInHand > 1) {
      captureMap[coord.y][coord.x] = 4;
      const houseOwner = Player.of(coord.y).getOpponent();
      resultingState = resultingState.capture(houseOwner, coord);
      return { capturedSum: 4, captureMap, resultingState };
    } else {
      return { capturedSum: 0, captureMap, resultingState };
    }
  }
  mustMonsoon(postCaptureState, config) {
    const mustMonsoon = super.mustMonsoon(postCaptureState, config);
    if (mustMonsoon.length > 0) {
      return mustMonsoon;
    } else {
      if (postCaptureState.getTotalRemainingSeeds() <= 8) {
        if (config.splitFinalSeedsEvenly) {
          return [Player.ZERO, Player.ONE];
        } else {
          return [Player.ZERO];
        }
      } else {
        return [];
      }
    }
  }
};

// games/dist/games/mancala/ba-awa/BaAwaMoveGenerator.js
var BaAwaMoveGenerator = class extends MancalaMoveGenerator {
  constructor() {
    super(BaAwaRules.get());
  }
};

// games/dist/games/mancala/common/MancalaScoreHeuristic.js
var MancalaScoreHeuristic = class extends PlayerMetricHeuristicWithBounds {
  getMetrics(node, _config) {
    return node.gameState.getScoresCopy().toTable();
  }
  getBounds(config) {
    const maxScore = config.width * 2 * config.seedsByHouse;
    return {
      player0Best: BoardValue.ofSingle(maxScore, 0),
      player1Best: BoardValue.ofSingle(0, maxScore)
    };
  }
};

// games/dist/games/mancala/kalah/KalahRules.js
var KalahRules = class _KalahRules extends MancalaRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Kalah`,
    config: {
      feedOriginalHouse: new BooleanConfig(true, MancalaRules.FEED_ORIGINAL_HOUSE),
      mustFeed: new BooleanConfig(false, MancalaRules.MUST_FEED),
      passByPlayerStore: new BooleanConfig(true, MancalaRules.PASS_BY_PLAYER_STORE),
      mustContinueDistributionAfterStore: new BooleanConfig(true, MancalaRules.MULTIPLE_SOW),
      continueLapUntilCaptureOrEmptyHouse: new BooleanConfig(false, MancalaRules.CYCLICAL_LAP),
      seedsByHouse: new NumberConfig(4, MancalaRules.SEEDS_BY_HOUSE, MGPValidators.range(1, 99)),
      width: new NumberConfig(6, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      numberOfRows: new NumberConfig(1, MancalaRules.NUMBER_OF_ROWS, MGPValidators.range(1, 99))
    }
  });
  static get() {
    if (_KalahRules.singleton.isAbsent()) {
      _KalahRules.singleton = MGPOptional.of(new _KalahRules([]));
    }
    return _KalahRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _KalahRules.RULES_CONFIG_DESCRIPTION;
  }
  applyCapture(distributionResult, config) {
    const distributedState = distributionResult.resultingState;
    const capturelessResult = {
      capturedSum: 0,
      captureMap: TableUtils.create(distributedState.getWidth(), distributedState.getHeight(), 0),
      resultingState: distributedState
    };
    if (distributionResult.endsUpInStore) {
      return capturelessResult;
    } else {
      const landingSpace = distributionResult.filledCoords[distributionResult.filledCoords.length - 1];
      const currentPlayer = distributionResult.resultingState.getCurrentPlayer();
      const oppositeY = this.getOppositeY(landingSpace, config);
      const landingSeeds = distributionResult.resultingState.getPieceAt(landingSpace);
      const parallelSeeds = distributionResult.resultingState.getPieceAtXY(landingSpace.x, oppositeY);
      if (this.getSpaceOwner(landingSpace, config) === currentPlayer && landingSeeds === 1 && parallelSeeds > 0) {
        const board = distributedState.getCopiedBoard();
        const capturedSum = board[0][landingSpace.x] + board[1][landingSpace.x];
        const captureMap = TableUtils.create(distributedState.getWidth(), distributedState.getHeight(), 0);
        captureMap[landingSpace.y][landingSpace.x] = board[landingSpace.y][landingSpace.x];
        captureMap[oppositeY][landingSpace.x] = board[oppositeY][landingSpace.x];
        const capturer = distributedState.getCurrentPlayer();
        let postCaptureState = distributedState.capture(capturer, landingSpace);
        const oppositeSpace = new Coord(landingSpace.x, oppositeY);
        postCaptureState = postCaptureState.capture(capturer, oppositeSpace);
        return {
          capturedSum,
          captureMap,
          resultingState: postCaptureState
        };
      } else {
        return capturelessResult;
      }
    }
  }
};

// games/dist/games/mancala/kalah/KalahMoveGenerator.js
var KalahMoveGenerator = class extends MancalaMoveGenerator {
  constructor() {
    super(KalahRules.get());
  }
};

// games/dist/games/martian-chess/MartianChessFailure.js
var MartianChessFailure = class {
  static MUST_CHOOSE_PIECE_FROM_YOUR_TERRITORY = () => $localize`You must pick a piece from your side of the board in order to move it.`;
  static CANNOT_CAPTURE_YOUR_OWN_PIECE_NOR_PROMOTE_IT = () => $localize`This is not a valid promotion nor a valid capture.`;
  static CANNOT_UNDO_LAST_MOVE = () => $localize`You cannot perform a move that is the reverse of the previous one.`;
};

// games/dist/games/martian-chess/MartianChessPiece.js
var MartianChessPiece = class _MartianChessPiece {
  value;
  static EMPTY = new _MartianChessPiece(0);
  static PAWN = new _MartianChessPiece(1);
  static DRONE = new _MartianChessPiece(2);
  static QUEEN = new _MartianChessPiece(3);
  static tryMerge(left, right) {
    const noEmptyPieces = left !== _MartianChessPiece.EMPTY && right !== _MartianChessPiece.EMPTY;
    Utils.assert(noEmptyPieces, "tryMerge cannot be called with empty pieces");
    const totalValue = left.value + right.value;
    if (totalValue === 2 || totalValue === 3) {
      return MGPOptional.of(_MartianChessPiece.of(totalValue));
    } else {
      return MGPOptional.empty();
    }
  }
  static of(value) {
    switch (value) {
      case _MartianChessPiece.DRONE.value:
        return _MartianChessPiece.DRONE;
      default:
        Utils.expectToBe(value, _MartianChessPiece.QUEEN.value);
        return _MartianChessPiece.QUEEN;
    }
  }
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  equals(other) {
    return this.getValue() === other.getValue();
  }
};

// games/dist/games/martian-chess/MartianChessState.js
var MartianChessCapture = class _MartianChessCapture {
  captures;
  static of(pieces) {
    const map = new MGPMap();
    for (const piece of pieces) {
      _MartianChessCapture.addToMap(map, piece);
    }
    return new _MartianChessCapture(map);
  }
  static addToMap(map, piece) {
    const oldValue = map.get(piece);
    if (oldValue.isPresent()) {
      map.replace(piece, oldValue.get() + 1);
    } else {
      map.set(piece, 1);
    }
  }
  constructor(captures) {
    this.captures = captures;
    captures.makeImmutable();
  }
  toValue() {
    let sum = 0;
    for (const [piece, value] of this.captures) {
      sum += piece.getValue() * value;
    }
    return sum;
  }
  add(piece) {
    const newMap = this.captures.getCopy();
    _MartianChessCapture.addToMap(newMap, piece);
    return new _MartianChessCapture(newMap);
  }
};
var MartianChessState = class _MartianChessState extends GameStateWithTable {
  lastMove;
  countDown;
  static WIDTH = 4;
  static HEIGHT = 8;
  static PLAYER_ZERO_TERRITORY = new Set2([4, 5, 6, 7]);
  static PLAYER_ONE_TERRITORY = new Set2([0, 1, 2, 3]);
  static isOnBoard(coord) {
    return coord.isInRange(_MartianChessState.WIDTH, _MartianChessState.HEIGHT);
  }
  static isNotOnBoard(coord) {
    return _MartianChessState.isOnBoard(coord) === false;
  }
  captured;
  constructor(board, turn, lastMove = MGPOptional.empty(), countDown = MGPOptional.empty(), captured) {
    super(board, turn);
    this.lastMove = lastMove;
    this.countDown = countDown;
    if (captured == null) {
      captured = new MGPMap([
        { key: Player.ZERO, value: MartianChessCapture.of([]) },
        { key: Player.ONE, value: MartianChessCapture.of([]) }
      ]);
    }
    captured.makeImmutable();
    this.captured = captured;
  }
  getPlayerTerritory(player) {
    if (player === Player.ZERO) {
      return _MartianChessState.PLAYER_ZERO_TERRITORY;
    } else {
      return _MartianChessState.PLAYER_ONE_TERRITORY;
    }
  }
  isTherePieceOnPlayerSide(piece) {
    const currentPlayer = this.getCurrentPlayer();
    const playerTerritory = this.getPlayerTerritory(currentPlayer);
    for (const y of playerTerritory) {
      for (let x = 0; x < _MartianChessState.WIDTH; x++) {
        if (this.getPieceAtXY(x, y) === piece) {
          return true;
        }
      }
    }
    return false;
  }
  getScoreOf(player) {
    return this.captured.get(player).get().toValue();
  }
  getEmptyTerritory() {
    if (this.isTerritoryEmpty(Player.ZERO)) {
      return MGPOptional.of(Player.ZERO);
    } else if (this.isTerritoryEmpty(Player.ONE)) {
      return MGPOptional.of(Player.ONE);
    } else {
      return MGPOptional.empty();
    }
  }
  isTerritoryEmpty(player) {
    const playerTerritory = this.getPlayerTerritory(player);
    for (const y of playerTerritory) {
      for (let x = 0; x < _MartianChessState.WIDTH; x++) {
        if (this.getPieceAtXY(x, y) !== MartianChessPiece.EMPTY) {
          return false;
        }
      }
    }
    return true;
  }
  isInOpponentTerritory(coord) {
    const opponent = this.getCurrentOpponent();
    const opponentTerritory = this.getPlayerTerritory(opponent);
    return opponentTerritory.contains(coord.y);
  }
  isInPlayerTerritory(coord) {
    const player = this.getCurrentPlayer();
    const playerTerritory = this.getPlayerTerritory(player);
    return playerTerritory.contains(coord.y);
  }
  getCapturesOf(player) {
    const capture = this.captured.get(player).get();
    return [
      capture.captures.get(MartianChessPiece.PAWN).getOrElse(0),
      capture.captures.get(MartianChessPiece.DRONE).getOrElse(0),
      capture.captures.get(MartianChessPiece.QUEEN).getOrElse(0)
    ];
  }
};

// games/dist/games/martian-chess/MartianChessMove.js
var MartianChessMoveFailure = class {
  static START_COORD_OUT_OF_RANGE = () => $localize`Start coord cannot be out of range`;
  static END_COORD_OUT_OF_RANGE = () => $localize`End coord cannot be out of range`;
  static PAWN_MUST_MOVE_ONE_DIAGONAL_STEP = () => $localize`Pawns must move one step diagonally.`;
  static DRONE_MUST_DO_TWO_ORTHOGONAL_STEPS = () => $localize`Drones must move one or two steps in any direction.`;
};
var MartianChessMove = class _MartianChessMove extends MoveCoordToCoord {
  calledTheClock;
  static encoder = Encoder.tuple([Coord.encoder, Coord.encoder, Encoder.identity()], (move) => [move.getStart(), move.getEnd(), move.calledTheClock], (f) => _MartianChessMove.from(f[0], f[1], f[2]).get());
  static from(start, end, calledTheClock = false) {
    if (MartianChessState.isNotOnBoard(start)) {
      return MGPFallible.failure(MartianChessMoveFailure.START_COORD_OUT_OF_RANGE());
    }
    if (MartianChessState.isNotOnBoard(end)) {
      return MGPFallible.failure(MartianChessMoveFailure.END_COORD_OUT_OF_RANGE());
    }
    if (end.equals(start)) {
      return MGPFallible.failure(RulesFailure.MOVE_CANNOT_BE_STATIC());
    }
    const dir = Ordinal.factory.fromDelta(end.x - start.x, end.y - start.y);
    if (dir.isFailure()) {
      return MGPFallible.failure(dir.getReason());
    }
    return MGPFallible.success(new _MartianChessMove(start, end, calledTheClock));
  }
  constructor(start, end, calledTheClock) {
    super(start, end);
    this.calledTheClock = calledTheClock;
  }
  toString() {
    const ending = this.calledTheClock ? ", CALL_THE_CLOCK" : "";
    return "MartianChessMove((" + this.getStart().x + ", " + this.getStart().y + ") -> (" + this.getEnd().x + ", " + this.getEnd().y + ")" + ending + ")";
  }
  equals(other) {
    if (super.equals(other) === false) {
      return false;
    } else {
      return this.calledTheClock === other.calledTheClock;
    }
  }
  isValidForPawn() {
    const vector = this.getStart().getVectorToward(this.getEnd());
    return vector.isDiagonalOfLength(1);
  }
  isValidForDrone() {
    const distance = this.getStart().getLinearDistanceToward(this.getEnd());
    return distance <= 2;
  }
  isUndoneBy(moveOpt) {
    if (moveOpt.isAbsent()) {
      return false;
    }
    const move = moveOpt.get();
    return move.getEnd().equals(this.getStart()) && move.getStart().equals(this.getEnd());
  }
};

// games/dist/games/martian-chess/MartianChessMoveGenerator.js
var MartianChessMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const currentPlayer = state.getCurrentPlayer();
    const playerTerritory = state.getPlayerTerritory(currentPlayer);
    let moves = [];
    for (const y of playerTerritory) {
      for (let x = 0; x < MartianChessState.WIDTH; x++) {
        const piece = state.getPieceAtXY(x, y);
        switch (piece) {
          case MartianChessPiece.PAWN:
            moves = moves.concat(this.getMovesForPawnAt(state, x, y));
            break;
          case MartianChessPiece.DRONE:
            moves = moves.concat(this.getMovesForDroneAt(state, x, y));
            break;
          case MartianChessPiece.QUEEN:
            moves = moves.concat(this.getMovesForQueenAt(state, x, y));
            break;
          default:
            break;
        }
      }
    }
    return moves;
  }
  getMovesForPawnAt(state, x, y) {
    const coord = new Coord(x, y);
    const landingCoords = [];
    for (const diagonal of Ordinal.DIAGONALS) {
      const landingCoord = coord.getNext(diagonal);
      if (MartianChessState.isOnBoard(landingCoord)) {
        landingCoords.push(landingCoord);
      }
    }
    return this.addLegalMoves(state, coord, landingCoords);
  }
  addLegalMoves(state, startingCoord, validLandingCoords) {
    const moves = [];
    const firstPiece = state.getPieceAt(startingCoord);
    const canPromoteDrone = state.isTherePieceOnPlayerSide(MartianChessPiece.DRONE) === false;
    const canPromoteQueen = state.isTherePieceOnPlayerSide(MartianChessPiece.QUEEN) === false;
    const last = state.lastMove;
    for (const landingCoord of validLandingCoords) {
      const landedPiece = state.getPieceAt(landingCoord);
      if (landedPiece === MartianChessPiece.EMPTY) {
        this.add(moves, MartianChessMove.from(startingCoord, landingCoord).get(), last);
      } else if (state.isInPlayerTerritory(landingCoord)) {
        const promotion = MartianChessPiece.tryMerge(landedPiece, firstPiece);
        if (promotion.isPresent()) {
          const promoted = promotion.get();
          const move = MartianChessMove.from(startingCoord, landingCoord).get();
          if (promoted === MartianChessPiece.DRONE && canPromoteDrone) {
            this.add(moves, move, last);
          } else if (promoted === MartianChessPiece.QUEEN && canPromoteQueen) {
            this.add(moves, move, last);
          }
        }
      } else {
        this.add(moves, MartianChessMove.from(startingCoord, landingCoord).get(), last);
      }
    }
    return moves;
  }
  add(moves, move, last) {
    const isCancelingLastMove = move.isUndoneBy(last);
    if (isCancelingLastMove === false) {
      moves.push(move);
    }
  }
  getMovesForDroneAt(state, x, y) {
    const coord = new Coord(x, y);
    const landingCoords = this.getLandingCoordsForLinearMove(coord, state, 2);
    return this.addLegalMoves(state, coord, landingCoords);
  }
  getLandingCoordsForLinearMove(startingCoord, state, maxDist) {
    const landingCoords = [];
    for (const dir of Ordinal.ORDINALS) {
      let dist = 1;
      let landingCoord = startingCoord.getNext(dir, dist);
      let possible = state.hasPieceAt(landingCoord, MartianChessPiece.EMPTY);
      while (possible) {
        landingCoords.push(landingCoord);
        dist++;
        landingCoord = startingCoord.getNext(dir, dist);
        possible = state.hasPieceAt(landingCoord, MartianChessPiece.EMPTY) && dist < maxDist;
      }
      if (state.getOptionalPieceAt(landingCoord).isPresent()) {
        landingCoords.push(landingCoord);
      }
    }
    return landingCoords;
  }
  getMovesForQueenAt(state, x, y) {
    const startingCoord = new Coord(x, y);
    const landingCoords = this.getLandingCoordsForQueen(startingCoord, state);
    return this.addLegalMoves(state, startingCoord, landingCoords);
  }
  getLandingCoordsForQueen(startingCoord, state) {
    return this.getLandingCoordsForLinearMove(startingCoord, state, MartianChessState.HEIGHT);
  }
};

// games/dist/games/martian-chess/MartianChessRules.js
var MartianChessRules = class _MartianChessRules extends Rules {
  static STARTING_COUNT_DOWN = MGPOptional.of(7);
  static singleton = MGPOptional.empty();
  static get() {
    if (_MartianChessRules.singleton.isAbsent()) {
      _MartianChessRules.singleton = MGPOptional.of(new _MartianChessRules());
    }
    return _MartianChessRules.singleton.get();
  }
  getInitialState() {
    const _ = MartianChessPiece.EMPTY;
    const A = MartianChessPiece.PAWN;
    const B = MartianChessPiece.DRONE;
    const C = MartianChessPiece.QUEEN;
    const board = [
      [C, C, B, _],
      [C, B, A, _],
      [B, A, A, _],
      [_, _, _, _],
      [_, _, _, _],
      [_, A, A, B],
      [_, A, B, C],
      [_, B, C, C]
    ];
    return new MartianChessState(board, 0, MGPOptional.empty());
  }
  applyLegalMove(move, state, _config, info) {
    const newBoard = state.getCopiedBoard();
    newBoard[move.getStart().y][move.getStart().x] = MartianChessPiece.EMPTY;
    const landingPiece = info.finalPiece;
    newBoard[move.getEnd().y][move.getEnd().x] = landingPiece;
    const captured = info.score;
    let countDown = state.countDown;
    if (countDown.isPresent()) {
      const isCapture = this.isCapture(move, state);
      if (isCapture) {
        countDown = _MartianChessRules.STARTING_COUNT_DOWN;
      } else {
        const previousRemainingTurn = state.countDown.get();
        countDown = MGPOptional.of(previousRemainingTurn - 1);
      }
    }
    if (move.calledTheClock) {
      countDown = _MartianChessRules.STARTING_COUNT_DOWN;
    }
    return new MartianChessState(newBoard, state.turn + 1, MGPOptional.of(move), countDown, captured);
  }
  isLegal(move, state) {
    this.assertNonDoubleClockCall(move, state);
    const moveLegality = this.isLegalMove(move, state);
    if (moveLegality.isFailure()) {
      return moveLegality.toOtherFallible();
    }
    if (move.isUndoneBy(state.lastMove)) {
      return MGPFallible.failure(MartianChessFailure.CANNOT_UNDO_LAST_MOVE());
    }
    if (this.isFieldPromotion(move, state)) {
      return this.isLegalFieldPromotion(move, state);
    }
    const landingPiece = state.getPieceAt(move.getStart());
    const captured = state.captured.getCopy();
    if (this.isCapture(move, state)) {
      const currentPlayer = state.getCurrentPlayer();
      let playerScore = captured.get(currentPlayer).get();
      const capturedPiece = state.getPieceAt(move.getEnd());
      playerScore = playerScore.add(capturedPiece);
      captured.replace(currentPlayer, playerScore);
      captured.makeImmutable();
    }
    const moveResult = { finalPiece: landingPiece, score: captured };
    return MGPFallible.success(moveResult);
  }
  assertNonDoubleClockCall(move, state) {
    const clockHadAlreadyBeenCalled = state.countDown.isPresent();
    const clockCalledThisTurn = move.calledTheClock;
    const doubleClockCall = clockHadAlreadyBeenCalled && clockCalledThisTurn;
    Utils.assert(doubleClockCall === false, "Should not call the clock twice");
  }
  isCapture(move, state) {
    const moveEndsInOpponentTerritory = state.isInOpponentTerritory(move.getEnd());
    const moveEndsOnPiece = state.getPieceAt(move.getEnd()) !== MartianChessPiece.EMPTY;
    return moveEndsInOpponentTerritory && moveEndsOnPiece;
  }
  isFieldPromotion(move, state) {
    const moveEndsInPlayerTerritory = state.isInPlayerTerritory(move.getEnd());
    const moveEndsOnPiece = state.getPieceAt(move.getEnd()) !== MartianChessPiece.EMPTY;
    return moveEndsInPlayerTerritory && moveEndsOnPiece;
  }
  isLegalFieldPromotion(move, state) {
    const optCreatedPiece = this.getPromotedPiece(move, state);
    if (optCreatedPiece.isAbsent()) {
      return MGPFallible.failure(MartianChessFailure.CANNOT_CAPTURE_YOUR_OWN_PIECE_NOR_PROMOTE_IT());
    }
    const createdPiece = optCreatedPiece.get();
    if (state.isTherePieceOnPlayerSide(createdPiece)) {
      return MGPFallible.failure(MartianChessFailure.CANNOT_CAPTURE_YOUR_OWN_PIECE_NOR_PROMOTE_IT());
    } else {
      const moveResult = {
        finalPiece: createdPiece,
        score: state.captured.getCopy()
      };
      return MGPFallible.success(moveResult);
    }
  }
  isLegalMove(move, state) {
    const moveStartsInPlayerTerritory = state.isInPlayerTerritory(move.getStart());
    if (moveStartsInPlayerTerritory === false) {
      return MGPValidation.failure(MartianChessFailure.MUST_CHOOSE_PIECE_FROM_YOUR_TERRITORY());
    }
    const movedPiece = state.getPieceAt(move.getStart());
    if (movedPiece === MartianChessPiece.EMPTY) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    } else if (movedPiece === MartianChessPiece.PAWN) {
      if (move.isValidForPawn()) {
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(MartianChessMoveFailure.PAWN_MUST_MOVE_ONE_DIAGONAL_STEP());
      }
    } else if (movedPiece === MartianChessPiece.DRONE) {
      if (move.isValidForDrone() === false) {
        return MGPValidation.failure(MartianChessMoveFailure.DRONE_MUST_DO_TWO_ORTHOGONAL_STEPS());
      }
    }
    for (const coord of move.getJumpedOverCoords()) {
      if (state.getPieceAt(coord) !== MartianChessPiece.EMPTY) {
        return MGPValidation.failure(RulesFailure.SOMETHING_IN_THE_WAY());
      }
    }
    return MGPValidation.SUCCESS;
  }
  getPromotedPiece(move, state) {
    const startPiece = state.getPieceAt(move.getStart());
    const endPiece = state.getPieceAt(move.getEnd());
    return MartianChessPiece.tryMerge(startPiece, endPiece);
  }
  getGameStatus(node) {
    const state = node.gameState;
    if (state.countDown.equalsValue(0)) {
      return this.getGameStatusScoreVictoryOr(state, GameStatus.DRAW);
    }
    const emptyTerritory = state.getEmptyTerritory();
    if (emptyTerritory.isPresent()) {
      const previousPlayer = state.getPreviousPlayer();
      const previousPlayerVictoryStatus = GameStatus.getVictory(previousPlayer);
      return this.getGameStatusScoreVictoryOr(state, previousPlayerVictoryStatus);
    }
    return GameStatus.ONGOING;
  }
  getGameStatusScoreVictoryOr(state, defaultStatus) {
    const scoreZero = state.getScoreOf(Player.ZERO);
    const scoreOne = state.getScoreOf(Player.ONE);
    if (scoreZero > scoreOne)
      return GameStatus.ZERO_WON;
    else if (scoreOne > scoreZero)
      return GameStatus.ONE_WON;
    else
      return defaultStatus;
  }
};

// games/dist/games/martian-chess/MartianChessScoreHeuristic.js
var MartianChessScoreHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const zeroScore = node.gameState.getScoreOf(Player.ZERO);
    const oneScore = node.gameState.getScoreOf(Player.ONE);
    return PlayerNumberTable.ofSingle(zeroScore, oneScore);
  }
};

// games/dist/games/new-game/NewGameState.js
var NewGameState = class extends GameState {
};

// games/dist/games/new-game/NewGameRules.js
var NewGameLegalityInfo = class {
};
var NewGameRules = class _NewGameRules extends Rules {
  /**
   * This is the singleton instance. You should keep this as is, except for adapting the class name.
   */
  static singleton = MGPOptional.empty();
  /**
   * This gets the singleton instance. Similarly, keep this as is.
   */
  static get() {
    if (_NewGameRules.singleton.isAbsent()) {
      _NewGameRules.singleton = MGPOptional.of(new _NewGameRules());
    }
    return _NewGameRules.singleton.get();
  }
  /**
   * This method returns the initial state of a game
   */
  getInitialState(config) {
    return new NewGameState(0);
  }
  /**
   * This method checks whether it is legal to apply a move to a state.
   * @param move the move
   * @param state the state on which to check the move legality
   * @returns a MGPFallible of the GameLegalityInfo, being a success if the move is legal,
   *   a failure containing the reason for the illegality of the move.
   */
  isLegal(move, state) {
    return MGPFallible.success(new NewGameLegalityInfo());
  }
  /**
   * This is the methods that applies the move to a state.
   * We know the move is legal because it has been checked with `isLegal`.
   * @param move the move to apply to the state
   * @param state the state on which to apply the move
   * @param info the info that had been returned by `isLegal`
   * @returns the resulting state, i.e., the state on which move has been applied
   */
  applyLegalMove(_move, state, _config, _info) {
    return new NewGameState(state.turn + 1);
  }
  /**
   * This method checks whether the game is in progress or finished.
   * @param node the node for which we check the game status
   * @returns a GameStatus (ZERO_WON, ONE_WON, DRAW, ONGOING)
   */
  getGameStatus(node, _config) {
    if (node.gameState.turn < 42) {
      return GameStatus.ONGOING;
    } else {
      return GameStatus.DRAW;
    }
  }
};

// games/dist/games/p4/P4Failure.js
var P4Failure = class {
  static COLUMN_IS_FULL = () => $localize`Please put your piece in an incomplete column.`;
};

// games/dist/games/p4/P4State.js
var P4State = class extends PlayerOrNoneGameStateWithTable {
};

// games/dist/games/p4/P4Rules.js
var __decorate8 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var P4Rules_1;
var P4Rules = class P4Rules2 extends ConfigurableRules {
  static {
    P4Rules_1 = this;
  }
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Four in a Row`,
    config: {
      width: new NumberConfig(7, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      height: new NumberConfig(6, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(1, 99))
    }
  });
  static get() {
    if (P4Rules_1.singleton.isAbsent()) {
      P4Rules_1.singleton = MGPOptional.of(new P4Rules_1());
    }
    return P4Rules_1.singleton.get();
  }
  P4_HELPER;
  constructor() {
    super();
    this.P4_HELPER = new NInARowHelper(Utils.identity, 4);
  }
  getRulesConfigDescription() {
    return P4Rules_1.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const board = TableUtils.create(config.width, config.height, PlayerOrNone.NONE);
    return new P4State(board, 0);
  }
  applyLegalMove(move, state, _config, _info) {
    const x = move.x;
    const board = state.getCopiedBoard();
    const y = P4Rules_1.get().getLowestUnoccupiedSpace(board, x);
    const turn = state.turn;
    board[y][x] = state.getCurrentPlayer();
    const resultingState = new P4State(board, turn + 1);
    return resultingState;
  }
  isLegal(move, state) {
    if (state.getPieceAtXY(move.x, 0).isPlayer()) {
      return MGPValidation.failure(P4Failure.COLUMN_IS_FULL());
    }
    return MGPValidation.SUCCESS;
  }
  getGameStatus(node) {
    const state = node.gameState;
    const victoriousCoord = this.P4_HELPER.getVictoriousCoord(state);
    if (victoriousCoord.length > 0) {
      return GameStatus.getVictory(state.getCurrentOpponent());
    }
    const width = state.getWidth();
    const height = state.getHeight();
    return state.turn === width * height ? GameStatus.DRAW : GameStatus.ONGOING;
  }
  getVictoriousCoords(state) {
    return this.P4_HELPER.getVictoriousCoord(state);
  }
  getLowestUnoccupiedSpace(board, x) {
    let y = 0;
    const height = board.length;
    while (y < height && board[y][x].isNone()) {
      y++;
    }
    return y - 1;
  }
};
P4Rules = P4Rules_1 = __decorate8([
  Debug.log
], P4Rules);

// games/dist/games/p4/P4Heuristic.js
var P4Heuristic = class extends HeuristicWithBounds {
  getBoardValue(node, _config) {
    const state = node.gameState;
    let score = 0;
    for (let x = 0; x < state.getWidth(); x++) {
      for (let y = state.getHeight() - 1; y !== -1 && state.board[y][x].isPlayer(); y--) {
        const squareScore = P4Rules.get().P4_HELPER.getSquareScore(state, new Coord(x, y));
        score += squareScore;
      }
    }
    return BoardValue.of(score);
  }
  // When there exists a minimal/maximal value for a heuristic, it is useful to know it.
  getBounds(config) {
    const max = 2 * config.width * config.height;
    return {
      player0Best: BoardValue.ofSingle(max, 0),
      player1Best: BoardValue.ofSingle(0, max)
    };
  }
};

// games/dist/games/p4/P4Move.js
var P4Move = class _P4Move extends Move {
  x;
  static encoder = Encoder.tuple([Encoder.identity()], (move) => [move.x], (value) => _P4Move.of(value[0]));
  static of(x) {
    Utils.assert(0 <= x, "P4Move should be a positive integer!");
    return new _P4Move(x);
  }
  constructor(x) {
    super();
    this.x = x;
  }
  equals(other) {
    return this.x === other.x;
  }
  toString() {
    return "P4Move(" + this.x + ")";
  }
};

// games/dist/games/p4/P4MoveGenerator.js
var __decorate9 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var P4MoveGenerator = class P4MoveGenerator2 extends MoveGenerator {
  getListMoves(node, config) {
    const state = node.gameState;
    const width = state.getWidth();
    const virtualCX = Math.floor((width - 1) / 2);
    return this.getUnorderedListMoves(node, config).sort((left, right) => {
      const distanceFromCenterLeft = Math.abs(left.x - virtualCX);
      const distanceFromCenterRight = Math.abs(right.x - virtualCX);
      return distanceFromCenterLeft - distanceFromCenterRight;
    });
  }
  getUnorderedListMoves(node, _config) {
    const state = node.gameState;
    const moves = [];
    for (let x = 0; x < state.getWidth(); x++) {
      if (state.getPieceAtXY(x, 0).isNone()) {
        const move = P4Move.of(x);
        moves.push(move);
      }
    }
    return moves;
  }
};
P4MoveGenerator = __decorate9([
  Debug.log
], P4MoveGenerator);

// games/dist/games/p4/P4OrderedMoveGenerator.js
var P4OrderedMoveGenerator = class extends P4MoveGenerator {
  getListMoves(node, config) {
    const halfWidth = (node.gameState.getWidth() - 1) / 2;
    function closestToCenterFirst(left, right) {
      const distanceFromCenterLeft = Math.abs(left.x - halfWidth);
      const distanceFromCenterRight = Math.abs(right.x - halfWidth);
      return distanceFromCenterLeft - distanceFromCenterRight;
    }
    return super.getListMoves(node, config).sort(closestToCenterFirst);
  }
};

// games/dist/games/pentago/PentagoFailure.js
var PentagoFailure = class {
  static CANNOT_ROTATE_NEUTRAL_BLOCK = () => $localize`If the quadrant to turn is neutral, please just use move without rotation.`;
  static MUST_CHOOSE_BLOCK_TO_ROTATE = () => $localize`No quadrant is neutral, you must pick a quadrant to rotate.`;
};

// games/dist/games/pentago/PentagoState.js
var PentagoState = class _PentagoState extends PlayerOrNoneGameStateWithTable {
  static SIZE = 6;
  static ROTATION_MAP = [
    [new Coord(-1, -1), new Coord(1, -1)],
    [new Coord(0, -1), new Coord(1, 0)],
    [new Coord(1, -1), new Coord(1, 1)],
    [new Coord(1, 0), new Coord(0, 1)],
    [new Coord(1, 1), new Coord(-1, 1)],
    [new Coord(0, 1), new Coord(-1, 0)],
    [new Coord(-1, 1), new Coord(-1, -1)],
    [new Coord(-1, 0), new Coord(0, -1)]
  ];
  static isOnBoard(coord) {
    return coord.isInRange(_PentagoState.SIZE, _PentagoState.SIZE);
  }
  neutralBlocks;
  constructor(board, turn) {
    super(board, turn);
    this.neutralBlocks = this.getBlocksNeutralities();
  }
  getBlocksNeutralities() {
    const neutralBlocks = [];
    for (let i = 0; i < 4; i++) {
      const blockNeutrality = this.getBlockNeutrality(i);
      if (blockNeutrality) {
        neutralBlocks.push(i);
      }
    }
    return neutralBlocks;
  }
  getBlockNeutrality(blockIndex) {
    const center = _PentagoState.getBlockCenter(blockIndex);
    const initialUp = this.getPieceAt(center.getNext(Ordinal.UP, 1));
    const initialDiagonal = this.getPieceAt(center.getNext(Ordinal.UP_LEFT, 1));
    if (this.getPieceAt(center.getNext(Ordinal.RIGHT, 1)) !== initialUp || this.getPieceAt(center.getNext(Ordinal.DOWN, 1)) !== initialUp || this.getPieceAt(center.getNext(Ordinal.LEFT, 1)) !== initialUp) {
      return false;
    }
    return this.getPieceAt(center.getNext(Ordinal.UP_RIGHT, 1)) === initialDiagonal && this.getPieceAt(center.getNext(Ordinal.DOWN_RIGHT, 1)) === initialDiagonal && this.getPieceAt(center.getNext(Ordinal.DOWN_LEFT, 1)) === initialDiagonal;
  }
  static getBlockCenter(blockIndex) {
    const cx = 1 + (blockIndex % 2 === 0 ? 0 : 3);
    const cy = 1 + (blockIndex < 2 ? 0 : 3);
    return new Coord(cx, cy);
  }
  applyLegalDrop(move) {
    const newBoard = this.getCopiedBoard();
    newBoard[move.coord.y][move.coord.x] = this.getCurrentPlayer();
    return new _PentagoState(newBoard, this.turn);
  }
  applyLegalMove(move) {
    const postDropState = this.applyLegalDrop(move);
    const newBoard = postDropState.getCopiedBoard();
    if (move.blockTurned.isPresent()) {
      const blockCenter = _PentagoState.getBlockCenter(move.blockTurned.get());
      const blockVector = blockCenter.toVector();
      if (move.turnedClockwise) {
        for (const translation of _PentagoState.ROTATION_MAP) {
          const oldCoord = translation[0].getNext(blockVector);
          const newCoord = translation[1].getNext(blockVector);
          const oldValue = postDropState.getPieceAt(oldCoord);
          newBoard[newCoord.y][newCoord.x] = oldValue;
        }
      } else {
        for (const translation of _PentagoState.ROTATION_MAP) {
          const oldCoord = translation[1].getNext(blockVector);
          const newCoord = translation[0].getNext(blockVector);
          const oldValue = postDropState.getPieceAt(oldCoord);
          newBoard[newCoord.y][newCoord.x] = oldValue;
        }
      }
    }
    return new _PentagoState(newBoard, this.turn + 1);
  }
  blockIsNeutral(blockIndex) {
    return this.neutralBlocks.includes(blockIndex);
  }
};

// games/dist/games/pentago/PentagoMove.js
var PentagoMove = class _PentagoMove extends MoveCoord {
  blockTurned;
  turnedClockwise;
  static encoder = Encoder.tuple([Coord.encoder, MGPOptional.getEncoder(Encoder.identity()), Encoder.identity()], (move) => [move.coord, move.blockTurned, move.turnedClockwise], (fields) => _PentagoMove.of(fields[0], fields[1], fields[2]));
  static of(coord, blockTurned, turnedClockwise) {
    return new _PentagoMove(coord.x, coord.y, blockTurned, turnedClockwise);
  }
  static withRotation(x, y, blockTurned, turnedClockwise) {
    Utils.assert(0 <= blockTurned && blockTurned <= 3, "This block does not exist: " + blockTurned);
    return new _PentagoMove(x, y, MGPOptional.of(blockTurned), turnedClockwise);
  }
  static rotationless(x, y) {
    return new _PentagoMove(x, y, MGPOptional.empty());
  }
  constructor(x, y, blockTurned, turnedClockwise = false) {
    super(x, y);
    this.blockTurned = blockTurned;
    this.turnedClockwise = turnedClockwise;
    Utils.assert(PentagoState.isOnBoard(this.coord), "The board is a " + PentagoState.SIZE + " space wide square, invalid coord: " + this.coord.toString());
  }
  toString() {
    if (this.blockTurned.isPresent()) {
      return "PentagoMove(" + this.coord.toString() + ", " + this.blockTurned.get() + ", " + (this.turnedClockwise ? "CLOCKWISE" : "ANTI-CLOCKWISE") + ")";
    } else {
      return "PentagoMove" + this.coord.toString();
    }
  }
  equals(other) {
    if (this.coord.equals(other.coord) === false)
      return false;
    if (this.blockTurned.equals(other.blockTurned) === false)
      return false;
    return this.turnedClockwise === other.turnedClockwise;
  }
};

// games/dist/games/pentago/PentagoMoveGenerator.js
var PentagoMoveGenerator = class _PentagoMoveGenerator extends MoveGenerator {
  static FIRST_TURN_MOVES = [
    PentagoMove.rotationless(0, 0),
    PentagoMove.rotationless(1, 0),
    PentagoMove.rotationless(2, 0),
    PentagoMove.rotationless(0, 1),
    PentagoMove.rotationless(1, 1),
    PentagoMove.rotationless(0, 2)
  ];
  getListMoves(node, _config) {
    const moves = [];
    const preDropNeutralBlocks = node.gameState.neutralBlocks;
    if (node.gameState.turn === 0) {
      return _PentagoMoveGenerator.FIRST_TURN_MOVES;
    }
    const legalDrops = this.getLegalDrops(node.gameState);
    for (const legalDrop of legalDrops) {
      const drop = PentagoMove.rotationless(legalDrop.x, legalDrop.y);
      const stateAfterDrop = node.gameState.applyLegalDrop(drop);
      const legalRotations = this.getLegalRotations(stateAfterDrop, preDropNeutralBlocks);
      for (const legalRotation of legalRotations) {
        moves.push(PentagoMove.withRotation(legalDrop.x, legalDrop.y, legalRotation[0], legalRotation[1]));
      }
      const mustRotate = stateAfterDrop.neutralBlocks.length === 0;
      if (mustRotate === false) {
        moves.push(drop);
      }
    }
    return moves;
  }
  getLegalDrops(state) {
    const legalDrops = [];
    for (let y = 0; y < PentagoState.SIZE; y++) {
      for (let x = 0; x < PentagoState.SIZE; x++) {
        const coord = new Coord(x, y);
        if (state.getPieceAt(coord).isNone()) {
          legalDrops.push(coord);
        }
      }
    }
    return legalDrops;
  }
  getLegalRotations(stateAfterDrop, blockNeutralBeforeDrop) {
    const mustRotate = stateAfterDrop.neutralBlocks.length === 0;
    const legalRotations = [];
    for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
      if (stateAfterDrop.blockIsNeutral(blockIndex) === false) {
        if (blockNeutralBeforeDrop.includes(blockIndex)) {
          if (mustRotate) {
            legalRotations.push([blockIndex, true]);
          }
        } else {
          legalRotations.push([blockIndex, true], [blockIndex, false]);
        }
      }
    }
    return legalRotations;
  }
};

// games/dist/games/pentago/PentagoRules.js
var PentagoRules = class _PentagoRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_PentagoRules.singleton.isAbsent()) {
      _PentagoRules.singleton = MGPOptional.of(new _PentagoRules());
    }
    return _PentagoRules.singleton.get();
  }
  getInitialState() {
    const initialBoard = TableUtils.create(PentagoState.SIZE, PentagoState.SIZE, PlayerOrNone.NONE);
    return new PentagoState(initialBoard, 0);
  }
  static VICTORY_SOURCE = [
    // [ firstCoordToTest, directionToTest, shouldLookTheSpaceBeforeAsWellAsSpaceAfter]
    [new Coord(1, 0), new Vector(1, 1), false],
    // 4 short diagonals
    [new Coord(0, 1), new Vector(1, 1), false],
    [new Coord(4, 0), new Vector(-1, 1), false],
    [new Coord(5, 1), new Vector(-1, 1), false],
    [new Coord(1, 1), new Vector(1, 1), true],
    // 2 long diagonals
    [new Coord(4, 1), new Vector(-1, 1), true],
    [new Coord(0, 1), new Vector(0, 1), true],
    // 6 verticals
    [new Coord(1, 1), new Vector(0, 1), true],
    [new Coord(2, 1), new Vector(0, 1), true],
    [new Coord(3, 1), new Vector(0, 1), true],
    [new Coord(4, 1), new Vector(0, 1), true],
    [new Coord(5, 1), new Vector(0, 1), true],
    [new Coord(1, 0), new Vector(1, 0), true],
    // 6 horizontal
    [new Coord(1, 1), new Vector(1, 0), true],
    [new Coord(1, 2), new Vector(1, 0), true],
    [new Coord(1, 3), new Vector(1, 0), true],
    [new Coord(1, 4), new Vector(1, 0), true],
    [new Coord(1, 5), new Vector(1, 0), true]
  ];
  applyLegalMove(move, state, _config, _info) {
    return state.applyLegalMove(move);
  }
  isLegal(move, state) {
    if (state.getPieceAt(move.coord).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    const postDropState = state.applyLegalDrop(move);
    if (postDropState.neutralBlocks.length === 0) {
      if (move.blockTurned.isAbsent()) {
        return MGPValidation.failure(PentagoFailure.MUST_CHOOSE_BLOCK_TO_ROTATE());
      }
    } else {
      if (move.blockTurned.isPresent()) {
        const blockTurned = move.blockTurned.get();
        if (postDropState.neutralBlocks.includes(blockTurned)) {
          return MGPValidation.failure(PentagoFailure.CANNOT_ROTATE_NEUTRAL_BLOCK());
        }
      }
    }
    return MGPValidation.SUCCESS;
  }
  getVictoryCoords(state) {
    let victoryCoords = [];
    for (const maybeVictory of _PentagoRules.VICTORY_SOURCE) {
      const firstValue = state.getPieceAt(maybeVictory[0]);
      const subVictory = [maybeVictory[0]];
      if (firstValue.isPlayer()) {
        let testedCoord = maybeVictory[0].getNext(maybeVictory[1]);
        let fourAligned = true;
        for (let i = 0; i < 3 && fourAligned; i++) {
          if (state.getPieceAt(testedCoord) !== firstValue) {
            fourAligned = false;
          } else {
            subVictory.push(testedCoord);
            testedCoord = testedCoord.getNext(maybeVictory[1]);
          }
        }
        if (fourAligned) {
          if (state.getPieceAt(testedCoord) === firstValue) {
            subVictory.push(testedCoord);
            victoryCoords = victoryCoords.concat(subVictory);
          }
          if (maybeVictory[2]) {
            const coordZero = maybeVictory[0].getPrevious(maybeVictory[1], 1);
            if (state.getPieceAt(coordZero) === firstValue) {
              subVictory.push(coordZero);
              victoryCoords = victoryCoords.concat(subVictory);
            }
          }
        }
      }
    }
    return victoryCoords;
  }
  getGameStatus(node) {
    const state = node.gameState;
    const victoryCoords = this.getVictoryCoords(state);
    const victoryFound = PlayerMap.ofValues(false, false);
    for (let i = 0; i < victoryCoords.length; i += 5) {
      victoryFound.put(state.getPieceAt(victoryCoords[i]), true);
    }
    if (victoryFound.get(Player.ZERO)) {
      if (victoryFound.get(Player.ONE)) {
        return GameStatus.DRAW;
      } else {
        return GameStatus.ZERO_WON;
      }
    }
    if (victoryFound.get(Player.ONE)) {
      return GameStatus.ONE_WON;
    }
    if (state.turn === PentagoState.SIZE * PentagoState.SIZE) {
      return GameStatus.DRAW;
    } else {
      return GameStatus.ONGOING;
    }
  }
};

// games/dist/games/pente/PenteState.js
var PenteState = class extends PlayerOrNoneGameStateWithTable {
  captures;
  constructor(board, captures, turn) {
    super(board, turn);
    this.captures = captures;
  }
};

// games/dist/games/pente/PenteRules.js
var PenteRules = class _PenteRules extends ConfigurableRules {
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Default`,
    config: {
      width: new NumberConfig(19, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      height: new NumberConfig(19, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(1, 99)),
      capturesNeededToWin: new NumberConfig(10, () => $localize`Captured stones needed to win`, MGPValidators.range(1, 123456)),
      nInARow: new NumberConfig(5, RulesConfigDescriptionLocalizable.ALIGNMENT_SIZE, MGPValidators.range(3, 99)),
      sizeOfSandwich: new NumberConfig(2, () => $localize`Size of captures`, MGPValidators.range(1, 99))
    }
  });
  static singleton = MGPOptional.empty();
  static get() {
    if (_PenteRules.singleton.isAbsent()) {
      _PenteRules.singleton = MGPOptional.of(new _PenteRules());
    }
    return _PenteRules.singleton.get();
  }
  getInitialState(config) {
    const board = TableUtils.create(config.width, config.height, PlayerOrNone.NONE);
    const cx = Math.floor(config.width / 2);
    const cy = Math.floor(config.height / 2);
    board[cy][cx] = PlayerOrNone.ONE;
    return new PenteState(board, PlayerNumberMap.of(0, 0), 0);
  }
  getRulesConfigDescription() {
    return _PenteRules.RULES_CONFIG_DESCRIPTION;
  }
  isLegal(move, state) {
    if (state.isNotOnBoard(move.coord)) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.coord));
    } else if (state.getPieceAt(move.coord).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SQUARE());
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  applyLegalMove(move, state, config, _info) {
    const player = state.getCurrentPlayer();
    const newBoard = state.getCopiedBoard();
    newBoard[move.coord.y][move.coord.x] = player;
    const capturedPieces = this.getCaptures(move.coord, state, config, player);
    for (const captured of capturedPieces) {
      newBoard[captured.y][captured.x] = PlayerOrNone.NONE;
    }
    const captures = state.captures.getCopy();
    captures.add(player, capturedPieces.length);
    return new PenteState(newBoard, captures, state.turn + 1);
  }
  getCaptures(coord, state, config, player) {
    const opponent = player.getOpponent();
    const captures = [];
    const sizeOfCapture = config.sizeOfSandwich;
    for (const direction of Ordinal.factory.all) {
      let i = 1;
      let potentialCapture = coord.getNext(direction, i);
      const captured = [potentialCapture];
      while (state.hasPieceAt(potentialCapture, opponent) && i < sizeOfCapture) {
        i++;
        potentialCapture = potentialCapture.getNext(direction, 1);
        captured.push(potentialCapture);
      }
      const sandwicher = coord.getNext(direction, sizeOfCapture + 1);
      if (state.hasPieceAt(potentialCapture, opponent) && i === sizeOfCapture && state.hasPieceAt(sandwicher, player)) {
        captures.push(...captured);
      }
    }
    return captures;
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const opponent = state.getCurrentOpponent();
    const capturesNeededToWin = config.capturesNeededToWin;
    if (capturesNeededToWin <= state.captures.get(opponent)) {
      return GameStatus.getVictory(opponent);
    }
    const victoriousCoord = this.getHelper(config).getVictoriousCoord(state);
    if (victoriousCoord.length > 0) {
      return GameStatus.getVictory(opponent);
    }
    if (this.stillHaveEmptySquare(state)) {
      return GameStatus.ONGOING;
    } else {
      return GameStatus.DRAW;
    }
  }
  getHelper(config) {
    return new NInARowHelper(Utils.identity, config.nInARow);
  }
  stillHaveEmptySquare(state) {
    const width = state.getWidth();
    const height = state.getHeight();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (state.board[y][x].isNone()) {
          return true;
        }
      }
    }
    return false;
  }
};

// games/dist/games/pente/PenteAlignmentHeuristic.js
var PenteAlignmentHeuristic = class extends Heuristic {
  getBoardValue(node, config) {
    return PenteRules.get().getHelper(config).getBoardValue(node.gameState);
  }
};

// games/dist/games/pente/PenteMove.js
var PenteMove = class _PenteMove extends MoveCoord {
  static encoder = MoveCoord.getEncoder(_PenteMove.of);
  static of(coord) {
    return new _PenteMove(coord.x, coord.y);
  }
  constructor(x, y) {
    super(x, y);
  }
  toString() {
    return `PenteMove(${this.coord.x}, ${this.coord.y})`;
  }
};

// games/dist/games/pente/PenteMoveGenerator.js
var PenteMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const moves = [];
    state.forEachCoord((coord, content) => {
      if (content.isNone()) {
        moves.push(PenteMove.of(coord));
      }
    });
    return moves;
  }
};

// games/dist/jscaip/Coord3D.js
var Coord3D = class _Coord3D extends Coord {
  z;
  static getCoord3DEncoder(generate) {
    return Encoder.tuple([Encoder.identity(), Encoder.identity(), Encoder.identity()], (coord) => [coord.x, coord.y, coord.z], (fields) => generate(fields[0], fields[1], fields[2]));
  }
  static of(x, y, z) {
    return new _Coord3D(x, y, z);
  }
  constructor(x, y, z) {
    super(x, y);
    this.z = z;
  }
  toString() {
    return "Coord3D" + this.toShortString();
  }
  toShortString() {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")";
  }
  equals(other) {
    if (this === other)
      return true;
    if (other.x !== this.x)
      return false;
    if (other.y !== this.y)
      return false;
    return other.z === this.z;
  }
  isHigherThan(other) {
    return this.z > other.z;
  }
};

// games/dist/games/pylos/PylosCoord.js
var PylosCoord = class _PylosCoord extends Coord3D {
  static coordEncoder = Coord3D.getCoord3DEncoder(_PylosCoord.of);
  static optionalEncoder = MGPOptional.getEncoder(_PylosCoord.coordEncoder);
  static of(x, y, z) {
    return new _PylosCoord(x, y, z);
  }
  constructor(x, y, z) {
    super(x, y, z);
    Utils.assert(0 <= x && x <= 3, `PylosCoord: Invalid X: ${x}.`);
    Utils.assert(0 <= y && y <= 3, `PylosCoord: Invalid Y: ${y}.`);
    Utils.assert(0 <= z && z <= 3, `PylosCoord: Invalid Z: ${z}.`);
    const floorSize = 4 - z;
    Utils.assert(this.isInRange(floorSize, floorSize), this.toString() + " is not in range.");
  }
  toString() {
    return "PylosCoord" + this.toShortString();
  }
  getLowerPieces() {
    if (this.z === 0)
      throw new Error(`PylosCoord: floor pieces don't have lower pieces.`);
    const lowerZ = this.z - 1;
    const upLeft = new _PylosCoord(this.x, this.y, lowerZ);
    const upRight = new _PylosCoord(this.x + 1, this.y, lowerZ);
    const downLeft = new _PylosCoord(this.x, this.y + 1, lowerZ);
    const downRight = new _PylosCoord(this.x + 1, this.y + 1, lowerZ);
    return [upLeft, upRight, downLeft, downRight];
  }
  getHigherCoords() {
    if (this.z === 3)
      throw new Error(`Top piece don't have lower pieces.`);
    const higherZ = this.z + 1;
    const upLeft = new Coord(this.x - 1, this.y - 1);
    const upRight = new Coord(this.x, this.y - 1);
    const downLeft = new Coord(this.x - 1, this.y);
    const downRight = new Coord(this.x, this.y);
    const levelSize = 4 - higherZ;
    return [upLeft, upRight, downLeft, downRight].filter((coord) => coord.isInRange(levelSize, levelSize)).map((c) => new _PylosCoord(c.x, c.y, higherZ));
  }
  getNextValid(dir) {
    const xyNext = new Coord(this.x, this.y).getNext(dir);
    const floorSize = 4 - this.z;
    if (xyNext.isNotInRange(floorSize, floorSize)) {
      return MGPOptional.empty();
    } else {
      return MGPOptional.of(new _PylosCoord(xyNext.x, xyNext.y, this.z));
    }
  }
};

// games/dist/games/pylos/PylosFailure.js
var PylosFailure = class {
  static MUST_MOVE_UPWARD = () => $localize`You must move your pieces upward.`;
  static SHOULD_HAVE_SUPPORTING_PIECES = () => $localize`Your piece must land on the board or on 4 other pieces.`;
  static CANNOT_MOVE_SUPPORTING_PIECE = () => $localize`You cannot move a supporting piece.`;
  static CANNOT_CAPTURE = () => $localize`You cannot capture.`;
  static INVALID_FIRST_CAPTURE = () => $localize`Your first capture is invalid.`;
  static INVALID_SECOND_CAPTURE = () => $localize`Your second capture is invalid.`;
};

// games/dist/games/pylos/PylosHeuristic.js
var PylosHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const ownershipMap = node.gameState.getPiecesRepartition();
    return ownershipMap.toTable();
  }
};

// games/dist/games/pylos/PylosMove.js
var PylosMoveFailure = class {
  static MUST_CAPTURE_MAXIMUM_TWO_PIECES = () => $localize`You must capture one or two pieces, not more.`;
};
var PylosMove = class _PylosMove extends Move {
  startingCoord;
  landingCoord;
  firstCapture;
  secondCapture;
  static encoder = Encoder.tuple([PylosCoord.optionalEncoder, PylosCoord.coordEncoder, PylosCoord.optionalEncoder, PylosCoord.optionalEncoder], (move) => [move.startingCoord, move.landingCoord, move.firstCapture, move.secondCapture], (fields) => _PylosMove.of(fields[0], fields[1], fields[2], fields[3]));
  static ofClimb(startingCoord, landingCoord, captures) {
    const startingCoordOpt = MGPOptional.of(startingCoord);
    const capturesOptionals = _PylosMove.checkCaptures(captures);
    const newMove = new _PylosMove(startingCoordOpt, landingCoord, capturesOptionals.firstCapture, capturesOptionals.secondCapture);
    Utils.assert(landingCoord.isHigherThan(startingCoord), PylosFailure.MUST_MOVE_UPWARD());
    return newMove;
  }
  static checkCaptures(captures) {
    let firstCapture = MGPOptional.empty();
    let secondCapture = MGPOptional.empty();
    if (captures.length > 0) {
      firstCapture = MGPOptional.of(captures[0]);
      if (captures.length > 1) {
        if (captures[1].equals(captures[0])) {
          throw new Error("PylosMove: should not capture twice same piece.");
        }
        secondCapture = MGPOptional.of(captures[1]);
        if (captures[1].isHigherThan(captures[0])) {
          firstCapture = MGPOptional.of(captures[1]);
          secondCapture = MGPOptional.of(captures[0]);
        }
        if (captures.length > 2) {
          throw new Error(PylosMoveFailure.MUST_CAPTURE_MAXIMUM_TWO_PIECES());
        }
      }
    }
    return { firstCapture, secondCapture };
  }
  static ofDrop(landingCoord, captures) {
    const startingCoord = MGPOptional.empty();
    const capturesOptionals = _PylosMove.checkCaptures(captures);
    return new _PylosMove(startingCoord, landingCoord, capturesOptionals.firstCapture, capturesOptionals.secondCapture);
  }
  static changeCapture(move, captures) {
    const capturesOptionals = _PylosMove.checkCaptures(captures);
    return new _PylosMove(move.startingCoord, move.landingCoord, capturesOptionals.firstCapture, capturesOptionals.secondCapture);
  }
  static of(startingCoord, landingCoord, firstCapture, secondCapture) {
    return new _PylosMove(startingCoord, landingCoord, firstCapture, secondCapture);
  }
  constructor(startingCoord, landingCoord, firstCapture, secondCapture) {
    super();
    this.startingCoord = startingCoord;
    this.landingCoord = landingCoord;
    this.firstCapture = firstCapture;
    this.secondCapture = secondCapture;
  }
  isClimb() {
    return this.startingCoord.isPresent();
  }
  toString() {
    const startingCoord = this.startingCoord.isAbsent() ? "-" : this.startingCoord.get().toShortString();
    const firstCapture = this.firstCapture.isAbsent() ? "-" : this.firstCapture.get().toShortString();
    const secondCapture = this.secondCapture.isAbsent() ? "-" : this.secondCapture.get().toShortString();
    return "PylosMove(" + startingCoord + ", " + this.landingCoord.toShortString() + ", " + firstCapture + ", " + secondCapture + ")";
  }
  equals(other) {
    if (other === this)
      return true;
    if (this.startingCoord.equals(other.startingCoord) === false)
      return false;
    if (this.landingCoord.equals(other.landingCoord) === false)
      return false;
    if (this.firstCapture.equals(other.firstCapture) === false)
      return false;
    if (this.secondCapture.equals(other.secondCapture) === false)
      return false;
    return true;
  }
};

// games/dist/games/pylos/PylosState.js
var PylosState = class _PylosState extends GameState {
  boards;
  static getLevelRange(z) {
    switch (z) {
      case 0:
        return [0, 1, 2, 3];
      case 1:
        return [0, 1, 2];
      default:
        Utils.expectToBe(z, 2);
        return [0, 1];
    }
  }
  constructor(boards, turn) {
    super(turn);
    this.boards = boards;
  }
  getPieceAt(coord) {
    return this.boards[coord.z][coord.y][coord.x];
  }
  applyLegalMove(move, increment = true) {
    const updateValues = [];
    updateValues.push({ coord: move.landingCoord, value: this.getCurrentPlayer() });
    if (move.startingCoord.isPresent()) {
      updateValues.push({ coord: move.startingCoord.get(), value: PlayerOrNone.NONE });
    }
    if (move.firstCapture.isPresent()) {
      updateValues.push({ coord: move.firstCapture.get(), value: PlayerOrNone.NONE });
    }
    if (move.secondCapture.isPresent()) {
      updateValues.push({ coord: move.secondCapture.get(), value: PlayerOrNone.NONE });
    }
    let turn;
    if (increment) {
      turn = this.turn + 1;
    } else {
      turn = this.turn;
    }
    return this.setBoardAtCoords(updateValues, turn);
  }
  setBoardAtCoords(coordValues, turn) {
    const newBoard = [
      TableUtils.copy(this.boards[0]),
      TableUtils.copy(this.boards[1]),
      TableUtils.copy(this.boards[2]),
      TableUtils.copy(this.boards[3])
    ];
    for (const coordValue of coordValues) {
      const coord = coordValue.coord;
      const value = coordValue.value;
      newBoard[coord.z][coord.y][coord.x] = value;
    }
    return new _PylosState(newBoard, turn);
  }
  isLandable(coord) {
    if (this.getPieceAt(coord).isPlayer()) {
      return false;
    }
    if (coord.z === 0)
      return true;
    const lowerPieces = coord.getLowerPieces();
    for (const lowerPiece of lowerPieces) {
      if (this.getPieceAt(lowerPiece).isNone()) {
        return false;
      }
    }
    return true;
  }
  isSupporting(coord) {
    if (coord.z === 3)
      return false;
    const higherPieces = coord.getHigherCoords();
    for (const higherPiece of higherPieces) {
      if (this.getPieceAt(higherPiece).isPlayer()) {
        return true;
      }
    }
    return false;
  }
  getPiecesRepartition() {
    const ownershipMap = PlayerNumberMap.of(0, 0);
    for (let z = 0; z < 3; z++) {
      for (let y = 0; y < 4 - z; y++) {
        for (let x = 0; x < 4 - z; x++) {
          const c = new PylosCoord(x, y, z);
          const v = this.getPieceAt(c);
          if (v.isPlayer()) {
            ownershipMap.add(v, 1);
          }
        }
      }
    }
    return ownershipMap;
  }
  removePieceAt(coord) {
    const removeCoord = {
      coord,
      value: PlayerOrNone.NONE
    };
    return this.setBoardAtCoords([removeCoord], this.turn);
  }
  dropCurrentPlayersPieceAt(coord) {
    const addedCoord = {
      coord,
      value: this.getCurrentPlayer()
    };
    return this.setBoardAtCoords([addedCoord], this.turn);
  }
  getFreeToMoves() {
    const freeToMove = [];
    const currentPlayer = this.getCurrentPlayer();
    for (let z = 0; z <= 2; z++) {
      const levelRange = _PylosState.getLevelRange(z);
      for (const y of levelRange) {
        for (const x of levelRange) {
          const coord = new PylosCoord(x, y, z);
          if (this.getPieceAt(coord).equals(currentPlayer) && this.isSupporting(coord) === false) {
            freeToMove.push(coord);
          }
        }
      }
    }
    return new Set2(freeToMove);
  }
};

// games/dist/games/pylos/PylosRules.js
var PylosRules = class _PylosRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_PylosRules.singleton.isAbsent()) {
      _PylosRules.singleton = MGPOptional.of(new _PylosRules());
    }
    return _PylosRules.singleton.get();
  }
  getInitialState() {
    const board0 = TableUtils.create(4, 4, PlayerOrNone.NONE);
    const board1 = TableUtils.create(3, 3, PlayerOrNone.NONE);
    const board2 = TableUtils.create(2, 2, PlayerOrNone.NONE);
    const board3 = [[PlayerOrNone.NONE]];
    const turn = 0;
    return new PylosState([board0, board1, board2, board3], turn);
  }
  static getStateInfo(state) {
    const freeToMove = [];
    const landable = [];
    for (let z = 0; z < 3; z++) {
      for (let y = 0; y < 4 - z; y++) {
        for (let x = 0; x < 4 - z; x++) {
          const c = new PylosCoord(x, y, z);
          if (state.getPieceAt(c) === state.getCurrentPlayer() && state.isSupporting(c) === false) {
            freeToMove.push(c);
          }
          if (state.isLandable(c)) {
            landable.push(c);
          }
        }
      }
    }
    return { freeToMove, landable };
  }
  static getClimbingMoves(stateInfo) {
    const moves = [];
    for (const startingCoord of stateInfo.freeToMove) {
      for (const landingCoord of stateInfo.landable) {
        if (landingCoord.isHigherThan(startingCoord) && landingCoord.getLowerPieces().some((c) => startingCoord.equals(c)) === false) {
          const newMove = PylosMove.ofClimb(startingCoord, landingCoord, []);
          moves.push(newMove);
        }
      }
    }
    return moves;
  }
  static getDropMoves(stateInfo) {
    const drops = [];
    for (const landableCoord of stateInfo.landable) {
      const newMove = PylosMove.ofDrop(landableCoord, []);
      drops.push(newMove);
    }
    return drops;
  }
  static canCapture(state, landingCoord) {
    const currentPlayer = state.getCurrentPlayer();
    for (const vertical of [Orthogonal.UP, Orthogonal.DOWN]) {
      const firstNeighbors = landingCoord.getNextValid(vertical);
      if (firstNeighbors.isPresent() && state.getPieceAt(firstNeighbors.get()) === currentPlayer) {
        for (const horizontal of [Orthogonal.LEFT, Orthogonal.RIGHT]) {
          const secondNeighbors = firstNeighbors.get().getNextValid(horizontal);
          if (secondNeighbors.isPresent() && state.getPieceAt(secondNeighbors.get()) === currentPlayer) {
            const thirdDirection = vertical.getOpposite();
            const thirdNeighbors = secondNeighbors.get().getNextValid(thirdDirection).get();
            if (state.getPieceAt(thirdNeighbors) === currentPlayer) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  static getPossibleCaptures(state) {
    let possibleCapturesSets = new Set2();
    const freeToMoveFirsts = state.getFreeToMoves();
    for (const freeToMoveFirst of freeToMoveFirsts) {
      possibleCapturesSets = possibleCapturesSets.addElement(new Set2([freeToMoveFirst]));
      const secondState = state.removePieceAt(freeToMoveFirst);
      const freeToMoveThens = secondState.getFreeToMoves();
      for (const freeToMoveThen of freeToMoveThens) {
        const captures = new Set2([freeToMoveFirst, freeToMoveThen]);
        possibleCapturesSets = possibleCapturesSets.addElement(captures);
      }
    }
    return possibleCapturesSets;
  }
  static isValidCapture(state, move, capture) {
    const currentPlayer = state.getCurrentPlayer();
    if (capture.equals(move.landingCoord) === false && state.getPieceAt(capture) !== currentPlayer) {
      return false;
    }
    const supportedPieces = capture.getHigherCoords().filter((coord) => state.getPieceAt(coord).isPlayer() && coord.equals(move.firstCapture.get()) === false);
    return supportedPieces.length === 0;
  }
  static getGameStatus(node) {
    const ownershipMap = node.gameState.getPiecesRepartition();
    if (ownershipMap.get(Player.ZERO) === 15) {
      return GameStatus.ONE_WON;
    } else if (ownershipMap.get(Player.ONE) === 15) {
      return GameStatus.ZERO_WON;
    } else {
      return GameStatus.ONGOING;
    }
  }
  applyLegalMove(move, state, _config, _info) {
    return state.applyLegalMove(move);
  }
  isLegal(move, state) {
    const startingCoordLegality = this.isLegalStartingCoord(move, state);
    if (startingCoordLegality.isFailure()) {
      return startingCoordLegality.toOtherFallible();
    }
    const stateWithLeftStartingCoord = startingCoordLegality.get();
    const landingCoordLegality = this.isLegalLandingCoord(move, stateWithLeftStartingCoord);
    if (landingCoordLegality.isFailure()) {
      return landingCoordLegality.toOtherFallible();
    }
    const stateAfterPieceLanding = landingCoordLegality.get();
    const capturesLegality = this.isLegalCaptures(move, stateAfterPieceLanding);
    if (capturesLegality.isFailure()) {
      return capturesLegality;
    }
    return MGPValidation.SUCCESS;
  }
  isLegalStartingCoord(move, initialState) {
    const opponent = initialState.getCurrentOpponent();
    if (move.startingCoord.isPresent()) {
      const startingCoord = move.startingCoord.get();
      const startingPiece = initialState.getPieceAt(startingCoord);
      if (startingPiece === opponent) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
      } else if (startingPiece.isNone()) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
      }
      const supportedPieces = startingCoord.getHigherCoords().filter((coord) => initialState.getPieceAt(coord).isPlayer());
      if (supportedPieces.length === 0) {
        const stateWithLeftStartingCoord = initialState.removePieceAt(move.startingCoord.get());
        return MGPFallible.success(stateWithLeftStartingCoord);
      } else {
        return MGPFallible.failure(PylosFailure.CANNOT_MOVE_SUPPORTING_PIECE());
      }
    }
    return MGPFallible.success(initialState);
  }
  isLegalLandingCoord(move, stateAfterClimbStart) {
    if (stateAfterClimbStart.getPieceAt(move.landingCoord).isPlayer()) {
      return MGPFallible.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    if (stateAfterClimbStart.isLandable(move.landingCoord)) {
      return MGPFallible.success(stateAfterClimbStart.dropCurrentPlayersPieceAt(move.landingCoord));
    } else {
      return MGPFallible.failure(PylosFailure.SHOULD_HAVE_SUPPORTING_PIECES());
    }
  }
  isLegalCaptures(move, postMoveState) {
    if (move.firstCapture.isAbsent()) {
      return MGPValidation.SUCCESS;
    }
    if (_PylosRules.canCapture(postMoveState, move.landingCoord) === false) {
      return MGPValidation.failure(PylosFailure.CANNOT_CAPTURE());
    }
    if (_PylosRules.isValidCapture(postMoveState, move, move.firstCapture.get())) {
      const afterFirstCapture = postMoveState.removePieceAt(move.firstCapture.get());
      if (move.secondCapture.isAbsent()) {
        return MGPValidation.SUCCESS;
      }
      if (_PylosRules.isValidCapture(afterFirstCapture, move, move.secondCapture.get())) {
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(PylosFailure.INVALID_SECOND_CAPTURE());
      }
    } else {
      return MGPValidation.failure(PylosFailure.INVALID_FIRST_CAPTURE());
    }
  }
  getGameStatus(node) {
    return _PylosRules.getGameStatus(node);
  }
};

// games/dist/games/pylos/PylosMoveGenerator.js
var PylosMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const result = [];
    const stateInfo = PylosRules.getStateInfo(state);
    const climbings = PylosRules.getClimbingMoves(stateInfo);
    const drops = PylosRules.getDropMoves(stateInfo);
    const moves = climbings.concat(drops);
    for (const move of moves) {
      const postMoveState = state.applyLegalMove(move, false);
      let possibleCaptures = new Set2();
      if (PylosRules.canCapture(postMoveState, move.landingCoord)) {
        possibleCaptures = PylosRules.getPossibleCaptures(postMoveState);
      } else {
        result.push(move);
      }
      for (const possiblesCapture of possibleCaptures) {
        const newMove = PylosMove.changeCapture(move, possiblesCapture.toList());
        result.push(newMove);
      }
    }
    return result;
  }
};

// games/dist/games/quarto/QuartoFailure.js
var QuartoFailure = class {
  static MUST_GIVE_A_PIECE = () => $localize`You must give a piece.`;
  static PIECE_ALREADY_ON_BOARD = () => $localize`That piece is already on the board.`;
  static CANNOT_GIVE_PIECE_IN_HAND = () => $localize`You cannot give the piece that was in your hands.`;
};

// games/dist/jscaip/AI/AlignmentHeuristic.js
var AlignmentStatus = class _AlignmentStatus {
  name;
  // There's no particular alignment
  static NOTHING = new _AlignmentStatus("NOTHING");
  // The player could win at this turn
  static PRE_VICTORY = new _AlignmentStatus("PRE_VICTORY");
  // The game is finished with a victory
  static VICTORY = new _AlignmentStatus("VICTORY");
  constructor(name) {
    this.name = name;
  }
  // Convert to a board value (only for heuristics, will not consider victories)
  toBoardValue(turn) {
    if (this === _AlignmentStatus.NOTHING) {
      return BoardValue.of(0);
    } else {
      Utils.assert(this === _AlignmentStatus.PRE_VICTORY, "alignment status can only be pre-victory or default");
      const player = Player.of(turn % 2);
      return BoardValue.of(BoardValue.getPreVictoryValueOf(player));
    }
  }
};
var AlignmentHeuristic = class extends Heuristic {
  calculateBoardValue(move, state) {
    this.startSearchingVictorySources();
    const boardInfo = {
      status: AlignmentStatus.NOTHING,
      victory: MGPOptional.empty(),
      preVictory: MGPOptional.empty(),
      sum: 0
    };
    while (this.hasNextVictorySource()) {
      const victorySource = this.getNextVictorySource();
      let newBoardInfo;
      if (boardInfo.status === AlignmentStatus.PRE_VICTORY) {
        newBoardInfo = this.searchVictoryOnly(victorySource, move, state);
      } else {
        newBoardInfo = this.getBoardInfo(victorySource, move, state, boardInfo);
      }
      if (newBoardInfo.status === AlignmentStatus.VICTORY) {
        return newBoardInfo;
      }
      boardInfo.status = newBoardInfo.status;
      boardInfo.sum = boardInfo.sum + newBoardInfo.sum;
      if (boardInfo.preVictory.isAbsent()) {
        boardInfo.preVictory = newBoardInfo.preVictory;
      }
    }
    return boardInfo;
  }
};

// games/dist/games/quarto/QuartoPiece.js
var QuartoPiece = class _QuartoPiece {
  value;
  static AAAA = new _QuartoPiece(0);
  static AAAB = new _QuartoPiece(1);
  static AABA = new _QuartoPiece(2);
  static AABB = new _QuartoPiece(3);
  static ABAA = new _QuartoPiece(4);
  static ABAB = new _QuartoPiece(5);
  static ABBA = new _QuartoPiece(6);
  static ABBB = new _QuartoPiece(7);
  static BAAA = new _QuartoPiece(8);
  static BAAB = new _QuartoPiece(9);
  static BABA = new _QuartoPiece(10);
  static BABB = new _QuartoPiece(11);
  static BBAA = new _QuartoPiece(12);
  static BBAB = new _QuartoPiece(13);
  static BBBA = new _QuartoPiece(14);
  static BBBB = new _QuartoPiece(15);
  static EMPTY = new _QuartoPiece(16);
  static pieces = [
    _QuartoPiece.AAAA,
    _QuartoPiece.AAAB,
    _QuartoPiece.AABA,
    _QuartoPiece.AABB,
    _QuartoPiece.ABAA,
    _QuartoPiece.ABAB,
    _QuartoPiece.ABBA,
    _QuartoPiece.ABBB,
    _QuartoPiece.BAAA,
    _QuartoPiece.BAAB,
    _QuartoPiece.BABA,
    _QuartoPiece.BABB,
    _QuartoPiece.BBAA,
    _QuartoPiece.BBAB,
    _QuartoPiece.BBBA,
    _QuartoPiece.BBBB
  ];
  static encoder = Encoder.fromFunctions((p) => p.value, _QuartoPiece.ofInt);
  static ofInt(piece) {
    if (0 <= piece && piece <= 15) {
      return _QuartoPiece.pieces[piece];
    } else if (piece === 16) {
      return _QuartoPiece.EMPTY;
    } else {
      throw new Error("Invalid piece (" + piece + ")");
    }
  }
  constructor(value) {
    this.value = value;
  }
  equals(other) {
    return this === other;
  }
  toString() {
    return "QuartoPiece(" + this.value + ")";
  }
  isRectangle() {
    return this.value % 4 < 2;
  }
};

// games/dist/games/quarto/QuartoState.js
var QuartoState = class _QuartoState extends GameStateWithTable {
  pieceInHand;
  constructor(b, turn, pieceInHand) {
    super(b, turn);
    this.pieceInHand = pieceInHand;
  }
  static isGivable(piece, board, pieceInHand) {
    if (piece === pieceInHand) {
      return false;
    }
    return _QuartoState.isAlreadyOnBoard(piece, board) === false;
  }
  static isAlreadyOnBoard(piece, board) {
    for (let indexY = 0; indexY < 4; indexY++) {
      for (let indexX = 0; indexX < 4; indexX++) {
        if (board[indexY][indexX] === piece) {
          return true;
        }
      }
    }
    return false;
  }
  getRemainingPieces() {
    const allPawn = QuartoPiece.pieces;
    const remainingPawns = [];
    for (const piece of allPawn) {
      if (_QuartoState.isGivable(piece, this.board, this.pieceInHand)) {
        remainingPawns.push(piece);
      }
    }
    return remainingPawns;
  }
};

// games/dist/games/quarto/QuartoRules.js
var QuartoCriterion = class _QuartoCriterion {
  subCriterion = [MGPOptional.empty(), MGPOptional.empty(), MGPOptional.empty(), MGPOptional.empty()];
  constructor(piece) {
    this.subCriterion[0] = MGPOptional.of((piece.value & 8) === 8);
    this.subCriterion[1] = MGPOptional.of((piece.value & 4) === 4);
    this.subCriterion[2] = MGPOptional.of((piece.value & 2) === 2);
    this.subCriterion[3] = MGPOptional.of((piece.value & 1) === 1);
  }
  /**
   * Merge with another criterion.
   * This will keep what both have in common
   * Returns true if at least one criterion is common, false otherwise
   */
  mergeWith(other) {
    let nonNull = 4;
    for (let i = 0; i < 4; i++) {
      if (this.subCriterion[i].equals(other.subCriterion[i]) === false) {
        this.subCriterion[i] = MGPOptional.empty();
      }
      if (this.subCriterion[i].isAbsent()) {
        nonNull--;
      }
    }
    return nonNull > 0;
  }
  mergeWithQuartoPiece(piece) {
    const criterion = new _QuartoCriterion(piece);
    return this.mergeWith(criterion);
  }
  areAllAbsent() {
    for (let i = 0; i < 4; i++) {
      if (this.subCriterion[i].isPresent()) {
        return false;
      }
    }
    return true;
  }
  // returns true if there is at least one sub-criterion in common between the two
  match(c) {
    for (let i = 0; i < 4; i++) {
      if (this.subCriterion[i].equals(c.subCriterion[i])) {
        return true;
      }
    }
    return false;
  }
  matchPiece(piece) {
    return this.match(new _QuartoCriterion(piece));
  }
  toString() {
    return "Criterion{" + this.subCriterion.map((b) => {
      if (b.isPresent()) {
        if (b.get()) {
          return "1";
        } else {
          return "0";
        }
      } else {
        return "x";
      }
    }).join(" ") + "}";
  }
};
var VictoryPattern = class {
  level;
  coordPattern;
  initialCoord;
  constructor(level, coordPattern, initialCoord) {
    this.level = level;
    this.coordPattern = coordPattern;
    this.initialCoord = initialCoord;
  }
  getCoords() {
    return this.coordPattern.map((element) => element.getNext(this.initialCoord));
  }
};
var VerticalVictoryPattern = class _VerticalVictoryPattern extends VictoryPattern {
  static VERTICAL = new CoordSet([
    new Coord(0, 0),
    new Coord(0, 1),
    new Coord(0, 2),
    new Coord(0, 3)
  ]);
  constructor(initialCoord) {
    super(1, _VerticalVictoryPattern.VERTICAL, initialCoord);
  }
  getAllPatterns(state) {
    const maxY = state.getHeight() - 4;
    return state.getCoordsAndContents().map((coordAndContent) => coordAndContent.coord).filter((coord) => coord.y <= maxY).map((coord) => new _VerticalVictoryPattern(coord));
  }
};
var HorizontalVictoryPattern = class _HorizontalVictoryPattern extends VictoryPattern {
  static HORIZONTAL = new CoordSet([
    new Coord(0, 0),
    new Coord(1, 0),
    new Coord(2, 0),
    new Coord(3, 0)
  ]);
  constructor(initialCoord) {
    super(1, _HorizontalVictoryPattern.HORIZONTAL, initialCoord);
  }
  getAllPatterns(state) {
    const maxX = state.getWidth() - 4;
    return state.getCoordsAndContents().map((coordAndContent) => coordAndContent.coord).filter((coord) => coord.x <= maxX).map((coord) => new _HorizontalVictoryPattern(coord));
  }
};
var DescendingDiagonalVictoryPattern = class _DescendingDiagonalVictoryPattern extends VictoryPattern {
  static DESCENDING_DIAGONAL = new CoordSet([
    new Coord(0, 0),
    new Coord(1, 1),
    new Coord(2, 2),
    new Coord(3, 3)
  ]);
  constructor(initialCoord) {
    super(1, _DescendingDiagonalVictoryPattern.DESCENDING_DIAGONAL, initialCoord);
  }
  getAllPatterns(state) {
    const maxX = state.getWidth() - 4;
    const maxY = state.getHeight() - 4;
    return state.getCoordsAndContents().map((coordAndContent) => coordAndContent.coord).filter((coord) => coord.x <= maxX && coord.y <= maxY).map((coord) => new _DescendingDiagonalVictoryPattern(coord));
  }
};
var AscendingDiagonalVictoryPattern = class _AscendingDiagonalVictoryPattern extends VictoryPattern {
  static ASCENDING_DIAGONAL = new CoordSet([
    new Coord(0, 0),
    new Coord(1, -1),
    new Coord(2, -2),
    new Coord(3, -3)
  ]);
  constructor(initialCoord) {
    super(1, _AscendingDiagonalVictoryPattern.ASCENDING_DIAGONAL, initialCoord);
  }
  getAllPatterns(state) {
    const maxX = state.getWidth() - 4;
    const minY = 3;
    const maxY = state.getHeight() - 1;
    return state.getCoordsAndContents().map((coordAndContent) => coordAndContent.coord).filter((coord) => coord.x <= maxX && minY <= coord.y && coord.y <= maxY).map((coord) => new _AscendingDiagonalVictoryPattern(coord));
  }
};
var SquareVictoryPattern = class _SquareVictoryPattern extends VictoryPattern {
  static SQUARE = new CoordSet([
    new Coord(0, 0),
    new Coord(0, 1),
    new Coord(1, 0),
    new Coord(1, 1)
  ]);
  constructor(initialCoord) {
    super(2, _SquareVictoryPattern.SQUARE, initialCoord);
  }
  getAllPatterns(state) {
    const maxX = state.getWidth() - 2;
    const maxY = state.getHeight() - 2;
    return state.getCoordsAndContents().map((coordAndContent) => coordAndContent.coord).filter((coord) => coord.x <= maxX && coord.y <= maxY).map((coord) => new _SquareVictoryPattern(coord));
  }
};
var QuartoRules = class _QuartoRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Quarto`,
    config: {
      playerZeroLevel: new NumberConfig(1, () => $localize`Player One Level`, MGPValidators.range(1, 2)),
      playerOneLevel: new NumberConfig(1, () => $localize`Player Two Level`, MGPValidators.range(1, 2))
    }
  });
  static get() {
    if (_QuartoRules.singleton.isAbsent()) {
      _QuartoRules.singleton = MGPOptional.of(new _QuartoRules());
    }
    return _QuartoRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _QuartoRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(_config) {
    const board = TableUtils.create(4, 4, QuartoPiece.EMPTY);
    return new QuartoState(board, 0, QuartoPiece.AAAA);
  }
  isOccupied(square) {
    return square !== QuartoPiece.EMPTY;
  }
  isLegal(move, state) {
    const x = move.coord.x;
    const y = move.coord.y;
    const pieceToGive = move.piece;
    const board = state.getCopiedBoard();
    const pieceInHand = state.pieceInHand;
    if (this.isOccupied(board[y][x])) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    if (pieceToGive === QuartoPiece.EMPTY) {
      if (state.turn === 15) {
        return MGPValidation.SUCCESS;
      }
      return MGPValidation.failure(QuartoFailure.MUST_GIVE_A_PIECE());
    }
    if (QuartoState.isAlreadyOnBoard(pieceToGive, board)) {
      return MGPValidation.failure(QuartoFailure.PIECE_ALREADY_ON_BOARD());
    }
    if (pieceInHand === pieceToGive) {
      return MGPValidation.failure(QuartoFailure.CANNOT_GIVE_PIECE_IN_HAND());
    }
    return MGPValidation.SUCCESS;
  }
  applyLegalMove(move, state, _config, _info) {
    const newBoard = state.getCopiedBoard();
    newBoard[move.coord.y][move.coord.x] = state.pieceInHand;
    const resultingState = new QuartoState(newBoard, state.turn + 1, move.piece);
    return resultingState;
  }
  updateBoardStatus(pattern, state, boardStatus) {
    if (boardStatus.status === AlignmentStatus.PRE_VICTORY) {
      if (this.isPatternVictorious(pattern, state)) {
        return {
          boardStatus: {
            status: AlignmentStatus.VICTORY,
            sensitiveSquares: new CoordSet()
          },
          isUpdated: true
        };
      } else {
        return { boardStatus, isUpdated: false };
      }
    } else {
      return this.searchForVictoryOrPreVictoryInPattern(pattern, state, boardStatus);
    }
  }
  isPatternVictorious(pattern, state) {
    const initialCoord = new Coord(pattern.initialCoord.x, pattern.initialCoord.y);
    let c = state.getPieceAt(initialCoord);
    const commonCrit = new QuartoCriterion(c);
    for (const coord of pattern.getCoords()) {
      if (this.isOccupied(c) === false || commonCrit.areAllAbsent()) {
        break;
      }
      c = state.getPieceAt(coord);
      commonCrit.mergeWithQuartoPiece(c);
    }
    if (this.isOccupied(c) && commonCrit.areAllAbsent() === false) {
      return true;
    } else {
      return false;
    }
  }
  searchForVictoryOrPreVictoryInPattern(pattern, state, boardStatus) {
    const patternInfos = this.getPatternInfos(pattern, state, boardStatus);
    if (patternInfos.boardStatus.isPresent()) {
      return { boardStatus: patternInfos.boardStatus.get(), isUpdated: false };
    }
    const commonCriterion = patternInfos.commonCriterion;
    const sensitiveCoord = patternInfos.sensitiveCoord;
    let isUpdated = false;
    if (commonCriterion.isPresent() && commonCriterion.get().areAllAbsent() === false) {
      if (sensitiveCoord.isAbsent()) {
        return {
          boardStatus: {
            status: AlignmentStatus.VICTORY,
            sensitiveSquares: new CoordSet()
          },
          isUpdated: true
        };
      } else {
        if (commonCriterion.get().matchPiece(state.pieceInHand)) {
          isUpdated = true;
          const coord = sensitiveCoord.get();
          boardStatus.sensitiveSquares = boardStatus.sensitiveSquares.addElement(coord);
          boardStatus.status = AlignmentStatus.PRE_VICTORY;
        }
      }
    }
    return { boardStatus, isUpdated };
  }
  getPatternInfos(pattern, state, boardStatus) {
    let sensitiveCoord = MGPOptional.empty();
    let commonCriterion = MGPOptional.empty();
    const coords = pattern.getCoords();
    for (const coord of coords) {
      const c = state.getPieceAt(coord);
      if (c === QuartoPiece.EMPTY) {
        if (sensitiveCoord.isAbsent()) {
          sensitiveCoord = MGPOptional.of(coord);
        } else {
          return {
            sensitiveCoord: MGPOptional.of(coord),
            commonCriterion,
            boardStatus: MGPOptional.of(boardStatus)
          };
        }
      } else {
        if (commonCriterion.isAbsent()) {
          commonCriterion = MGPOptional.of(new QuartoCriterion(c));
          Debug.display("QuartoRules", "getPatternInfos", "set commonCrit to " + commonCriterion.toString());
        } else {
          commonCriterion.get().mergeWithQuartoPiece(c);
          Debug.display("QuartoRules", "getPatternInfos", "update commonCrit: " + commonCriterion.toString());
        }
      }
    }
    return { commonCriterion, sensitiveCoord, boardStatus: MGPOptional.empty() };
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    let boardStatus = {
      status: AlignmentStatus.NOTHING,
      sensitiveSquares: new CoordSet()
    };
    const maxLevel = Math.max(config.playerZeroLevel, config.playerOneLevel);
    const patterns = this.getPatterns(maxLevel, state);
    const opponent = state.getCurrentPlayer();
    const player = opponent.getOpponent();
    let playerMadeAVictory = false;
    for (const pattern of patterns) {
      const boardStatusUpdate = this.updateBoardStatus(pattern, state, boardStatus);
      boardStatus = boardStatusUpdate.boardStatus;
      if (boardStatusUpdate.isUpdated && boardStatus.status === AlignmentStatus.VICTORY) {
        if (this.isOnlyPlayerVictory(pattern, config, opponent)) {
          return GameStatus.getVictory(opponent);
        } else if (this.isPlayerVictory(pattern, config, player)) {
          playerMadeAVictory = true;
        }
      }
    }
    if (playerMadeAVictory) {
      return GameStatus.getVictory(player);
    }
    if (state.turn === 16) {
      return GameStatus.DRAW;
    } else {
      return GameStatus.ONGOING;
    }
  }
  isPlayerVictory(pattern, config, player) {
    if (player === Player.ZERO) {
      return pattern.level <= config.playerZeroLevel;
    } else {
      return pattern.level <= config.playerOneLevel;
    }
  }
  isOnlyPlayerVictory(pattern, config, player) {
    return this.isPlayerVictory(pattern, config, player) && this.isPlayerVictory(pattern, config, player.getOpponent()) === false;
  }
  getPatterns(level, state) {
    const verticalInitialPattern = new VerticalVictoryPattern(new Coord(0, 0));
    const horizontalInitialPattern = new HorizontalVictoryPattern(new Coord(0, 0));
    const descendingDiagonalPattern = new DescendingDiagonalVictoryPattern(new Coord(0, 0));
    const ascendingDiagonalPattern = new AscendingDiagonalVictoryPattern(new Coord(0, 3));
    const initialPatterns = [
      verticalInitialPattern,
      horizontalInitialPattern,
      descendingDiagonalPattern,
      ascendingDiagonalPattern
    ];
    if (level >= 2) {
      const squareInitialPattern = new SquareVictoryPattern(new Coord(0, 0));
      initialPatterns.push(squareInitialPattern);
    }
    return initialPatterns.flatMap((pattern) => pattern.getAllPatterns(state));
  }
  getVictoriousCoords(state, config) {
    const maxPatternLevel = Math.max(config.playerZeroLevel, config.playerOneLevel);
    const patterns = this.getPatterns(maxPatternLevel, state);
    for (const pattern of patterns) {
      if (this.isPatternVictorious(pattern, state)) {
        return pattern.getCoords();
      }
    }
    return new Set2();
  }
};

// games/dist/games/quarto/QuartoHeuristic.js
var QuartoHeuristic = class extends Heuristic {
  getBoardValue(node, config) {
    const state = node.gameState;
    let boardStatus = {
      status: AlignmentStatus.NOTHING,
      sensitiveSquares: new CoordSet()
    };
    const maxLevel = Math.max(config.playerZeroLevel, config.playerOneLevel);
    const patterns = QuartoRules.get().getPatterns(maxLevel, state);
    for (const pattern of patterns) {
      boardStatus = QuartoRules.get().updateBoardStatus(pattern, state, boardStatus).boardStatus;
    }
    return boardStatus.status.toBoardValue(state.turn);
  }
};

// games/dist/games/quarto/QuartoMove.js
var QuartoMove = class _QuartoMove extends MoveCoord {
  piece;
  static encoder = Encoder.tuple([Coord.encoder, QuartoPiece.encoder], (m) => [m.coord, m.piece], (fields) => new _QuartoMove(fields[0].x, fields[0].y, fields[1]));
  constructor(x, y, piece) {
    super(x, y);
    this.piece = piece;
  }
  toString() {
    return "QuartoMove(" + this.coord.x + ", " + this.coord.y + ", " + this.piece.value + ")";
  }
  equals(other) {
    if (this === other)
      return true;
    if (other.coord.equals(this.coord) === false)
      return false;
    return this.piece === other.piece;
  }
};

// games/dist/games/quarto/QuartoMoveGenerator.js
var QuartoMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const listMoves = [];
    const state = node.gameState;
    const board = state.getCopiedBoard();
    const pawns = state.getRemainingPieces();
    const inHand = state.pieceInHand;
    let nextBoard;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (board[y][x] === QuartoPiece.EMPTY) {
          nextBoard = state.getCopiedBoard();
          nextBoard[y][x] = inHand;
          if (state.turn === 15) {
            const move = new QuartoMove(x, y, QuartoPiece.EMPTY);
            listMoves.push(move);
            return listMoves;
          }
          for (const remainingPiece of pawns) {
            const move = new QuartoMove(x, y, remainingPiece);
            listMoves.push(move);
          }
        }
      }
    }
    return listMoves;
  }
};

// games/dist/games/quebec-castles/QuebecCastlesMove.js
var QuebecCastlesTranslation = class _QuebecCastlesTranslation extends MoveCoordToCoord {
  static of(start, end) {
    return new _QuebecCastlesTranslation(start, end);
  }
  constructor(start, end) {
    super(start, end);
  }
  toString() {
    return "QuebecCastlesTranslation(" + this.getStart().toString() + " -> " + this.getEnd().toString() + ")";
  }
  equals(other) {
    if (other instanceof _QuebecCastlesTranslation) {
      return super.equals(other);
    } else {
      return false;
    }
  }
};
var QuebecCastlesDrop = class _QuebecCastlesDrop extends Move {
  coords;
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder)], (move) => [move.coords.toList()], (value) => _QuebecCastlesDrop.of(value[0]));
  static of(coords) {
    const asSet = new Set2(coords);
    return new _QuebecCastlesDrop(asSet);
  }
  constructor(coords) {
    super();
    this.coords = coords;
  }
  toString() {
    return "QuebecCastlesDrop(" + this.coords.toString() + ")";
  }
  equals(other) {
    if (other instanceof _QuebecCastlesDrop) {
      return this.coords.equals(other.coords);
    } else {
      return false;
    }
  }
};
var QuebecCastlesMove;
(function(QuebecCastlesMove2) {
  function isTranslation2(move) {
    return move instanceof QuebecCastlesTranslation;
  }
  QuebecCastlesMove2.isTranslation = isTranslation2;
  function isDrop(move) {
    return move instanceof QuebecCastlesDrop;
  }
  QuebecCastlesMove2.isDrop = isDrop;
  function drop(coords) {
    return QuebecCastlesDrop.of(coords);
  }
  QuebecCastlesMove2.drop = drop;
  function translation(start, end) {
    return QuebecCastlesTranslation.of(start, end);
  }
  QuebecCastlesMove2.translation = translation;
  QuebecCastlesMove2.encoder = Encoder.disjunction([
    QuebecCastlesMove2.isTranslation,
    QuebecCastlesMove2.isDrop
  ], [
    MoveCoordToCoord.getEncoder(QuebecCastlesTranslation.of),
    QuebecCastlesDrop.encoder
  ]);
})(QuebecCastlesMove || (QuebecCastlesMove = {}));

// games/dist/games/quebec-castles/QuebecCastlesState.js
var QuebecCastlesState = class _QuebecCastlesState extends PlayerOrNoneGameStateWithTable {
  castles;
  static of(oldState, newBoard) {
    return new _QuebecCastlesState(newBoard, oldState.turn, oldState.castles);
  }
  constructor(board, turn, castles) {
    super(board, turn);
    this.castles = castles;
    this.castles.makeImmutable();
  }
  incrementTurn() {
    return new _QuebecCastlesState(this.getCopiedBoard(), this.turn + 1, this.castles);
  }
  setPieceAt(coord, value) {
    return GameStateWithTable.setPieceAt(this, coord, value, _QuebecCastlesState.of);
  }
  isCastleAt(coord) {
    const castleZero = this.castles.get(Player.ZERO);
    const castleOne = this.castles.get(Player.ONE);
    return castleZero.equalsValue(coord) || castleOne.equalsValue(coord);
  }
};

// games/dist/games/quebec-castles/QuebecCastlesRules.js
var QuebecCastlesFailure = class {
  static INVALID_INVADER_DISTANCE = (distance) => $localize`Move distance must be 2 for invader, not ${distance}`;
  static INVALID_DEFENDER_DISTANCE = (distance) => $localize`Move distance must be 1 for defender, not ${distance}`;
  static MUST_DROP_IN_YOUR_TERRITORY = () => $localize`You must drop in your own territory`;
  static CANNOT_DROP_IN_MOVE_PHASE = () => $localize`You cannot drop in move phase`;
  static CANNOT_MOVE_IN_DROP_PHASE = () => $localize`You cannot move in drop phase`;
  static MUST_DROP_ALL_YOUR_PIECES = () => $localize`You must drop all your pieces`;
  static MUST_DROP_ALL_YOUR_REMAINING_PIECES = () => $localize`You must drop all your remaining pieces, not more not less`;
  static CANNOT_DROP_THAT_MANY_PIECES = () => $localize`You cannot drop that many pieces`;
  static MUST_DROP_ONE_BY_ONE = () => $localize`You must drop pieces one by one`;
  static CANNOT_LAND_OR_DROP_IN_YOUR_CASTLE = () => $localize`You cannot land or drop on your castle`;
  static PLACE_ONLY_ONE_CASTLE = () => $localize`You must only place your castle`;
  static CANNOT_PUT_THAT_MANY_PIECE_IN_THERE_FOR_INVADER = (max, line) => $localize`If you have ${line} line(s), you can only have ${max} pieces (as invader)`;
  static CANNOT_PUT_THAT_MANY_PIECE_IN_THERE_FOR_DEFENDER = (max, line) => $localize`If you have ${line} line(s), you can only have ${max} pieces (as defender)`;
  static TOO_MANY_LINES_FOR_TERRITORY = () => $localize`Too many lines for territory, your opponent lines would merge with yours!`;
};
var DropModes = {
  "AUTO": () => $localize`Automatic`,
  "PIECE_BY_PIECE": () => $localize`Piece by piece`,
  "BY_BATCH": () => $localize`By batch`
};
var QuebecCastlesRules = class _QuebecCastlesRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Quebec Castles`,
    config: {
      width: new NumberConfig(9, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(2, 20)),
      height: new NumberConfig(9, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(2, 20)),
      linesForTerritory: new NumberConfig(5, () => $localize`Lines for territory`, MGPValidators.range(1, 10)),
      invaders: new NumberConfig(14, () => $localize`Number of invaders`, MGPValidators.range(1, 123456)),
      defenders: new NumberConfig(9, () => $localize`Number of defenders`, MGPValidators.range(1, 123456)),
      isRhombic: new BooleanConfig(true, () => $localize`Is Rhombic`),
      playersPlaceCastle: new BooleanConfig(false, () => $localize`Place castle yourself`),
      dropMode: new EnumConfig("AUTO", () => $localize`Drop mode`, DropModes)
    },
    validators: [
      _QuebecCastlesRules.enoughLineForTerritory,
      _QuebecCastlesRules.enoughPlaceForDefenders,
      _QuebecCastlesRules.enoughPlaceForInvaders
    ]
  });
  static enoughLineForTerritory(config) {
    let height;
    if (config.isRhombic) {
      height = config.width + config.height - 2;
    } else {
      height = config.height;
    }
    if (config.linesForTerritory < height / 2) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(QuebecCastlesFailure.TOO_MANY_LINES_FOR_TERRITORY());
    }
  }
  static enoughPlaceForInvaders(config) {
    return _QuebecCastlesRules.isThereEnoughPlaceForPiece(Player.ZERO, config, config.invaders);
  }
  static enoughPlaceForDefenders(config) {
    return _QuebecCastlesRules.isThereEnoughPlaceForPiece(Player.ONE, config, config.defenders);
  }
  static get() {
    if (_QuebecCastlesRules.singleton.isAbsent()) {
      _QuebecCastlesRules.singleton = MGPOptional.of(new _QuebecCastlesRules());
    }
    return _QuebecCastlesRules.singleton.get();
  }
  static isThereEnoughPlaceForPiece(player, config, numberOfPiece) {
    const spaceForPiece = _QuebecCastlesRules.get().getValidDropCoords(player, config).length - 1;
    if (spaceForPiece < numberOfPiece) {
      const line = config.linesForTerritory;
      const failure = player === Player.ZERO ? QuebecCastlesFailure.CANNOT_PUT_THAT_MANY_PIECE_IN_THERE_FOR_INVADER(spaceForPiece, line) : QuebecCastlesFailure.CANNOT_PUT_THAT_MANY_PIECE_IN_THERE_FOR_DEFENDER(spaceForPiece, line);
      return MGPValidation.failure(failure);
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  getRulesConfigDescription() {
    return _QuebecCastlesRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const castles = this.getCastles(config);
    const board = TableUtils.create(config.width, config.height, PlayerOrNone.NONE);
    let state = new QuebecCastlesState(board, 0, castles);
    if (config.dropMode === "AUTO" && config.playersPlaceCastle === false) {
      state = this.fillBoard(state, config);
    }
    return state;
  }
  getCastles(config) {
    if (config.playersPlaceCastle) {
      const empty = MGPOptional.empty();
      return PlayerMap.ofValues(empty, empty);
    } else {
      const upperLeft = MGPOptional.of(new Coord(0, 0));
      const bottomRight = MGPOptional.of(new Coord(config.width - 1, config.height - 1));
      return PlayerMap.ofValues(bottomRight, upperLeft);
    }
  }
  fillBoard(state, config) {
    state = this.fillBoardFor(Player.ONE, state, config);
    state = this.fillBoardFor(Player.ZERO, state, config);
    return state;
  }
  fillBoardFor(player, state, config) {
    const initialCoords = this.getInitialCoords(player, state, config);
    for (const coord of initialCoords) {
      state = state.setPieceAt(coord, player);
    }
    return state;
  }
  getLineDirectionAndIndex(player, config) {
    const lineToFillRange = this.getLegalRangeIndex(player, config);
    if (player === Player.ZERO) {
      return { lineDirection: -1, lineToFillIndex: lineToFillRange.max };
    } else {
      return { lineDirection: 1, lineToFillIndex: lineToFillRange.min };
    }
  }
  getLineFirstCoord(line, pieceToDrop) {
    const availableSpaceEvenness = line.length % 2 === 0;
    const remainingSpace = line.length - pieceToDrop;
    const skipCenter = availableSpaceEvenness === false && pieceToDrop % 2 === 0;
    const indexStart = Math.floor(remainingSpace / 2);
    const coord = line[indexStart];
    return { coord, skipCenter };
  }
  getInitialCoords(player, state, config) {
    let pieceToDrop = this.getNumberOfPieces(player, config);
    const coordDirection = config.isRhombic ? Ordinal.UP_RIGHT : Ordinal.RIGHT;
    const lineDirectionAndIndex = this.getLineDirectionAndIndex(player, config);
    const lineDirection = lineDirectionAndIndex.lineDirection;
    let lineToFillIndex = lineDirectionAndIndex.lineToFillIndex;
    const coords = [];
    while (pieceToDrop > 0) {
      const availableSpaceAtLine = this.getAvailableSpacesAtLine(lineToFillIndex, state, config);
      if (pieceToDrop < availableSpaceAtLine.length) {
        const firstLineCoord = this.getLineFirstCoord(availableSpaceAtLine, pieceToDrop);
        let coord = firstLineCoord.coord;
        const skipCenter = firstLineCoord.skipCenter;
        coords.push(coord);
        pieceToDrop--;
        const center = availableSpaceAtLine[Math.floor(availableSpaceAtLine.length / 2)];
        while (pieceToDrop > 0) {
          coord = coord.getNext(coordDirection, 1);
          if (skipCenter && coord.equals(center)) {
            coord = coord.getNext(coordDirection, 1);
          }
          coords.push(coord);
          pieceToDrop--;
        }
      } else {
        coords.push(...availableSpaceAtLine);
        pieceToDrop -= availableSpaceAtLine.length;
      }
      lineToFillIndex += lineDirection;
    }
    return coords;
  }
  getAvailableSpacesAtLine(line, state, config) {
    let defaultAvailableSpace;
    let coord;
    let direction;
    const coords = [];
    if (config.isRhombic) {
      const xMax = config.width - 1;
      const yMax = config.height - 1;
      const max = xMax + yMax;
      defaultAvailableSpace = Math.min(line + 1, max + 1 - line);
      const xInitial = Math.max(line - yMax, 0);
      const yInitial = Math.min(line, yMax);
      coord = new Coord(xInitial, yInitial);
      direction = Ordinal.UP_RIGHT;
    } else {
      defaultAvailableSpace = config.width;
      coord = new Coord(0, line);
      direction = Ordinal.RIGHT;
    }
    while (defaultAvailableSpace > 0) {
      if (state.isCastleAt(coord) === false) {
        coords.push(coord);
      }
      coord = coord.getNext(direction);
      defaultAvailableSpace--;
    }
    return coords;
  }
  isDropPhase(state, config) {
    return this.getExpectedDropsThisTurn(state, config) > 0;
  }
  isLegal(move, state, config) {
    if (this.isDropPhase(state, config)) {
      return this.isLegalDrop(move, state, config);
    } else {
      return this.isLegalTranslation(move, state);
    }
  }
  getExpectedDropsThisTurn(state, config) {
    switch (config.dropMode) {
      case "PIECE_BY_PIECE":
        const totalPieceToDrop = config.defenders + config.invaders;
        if (state.turn < totalPieceToDrop) {
          return this.getExpectedDropsThisTurnForPieceByPiece(state, config);
        } else {
          return 0;
        }
      case "BY_BATCH":
        return this.getExpectedDropsThisTurnForBatch(state, config);
      default:
        if (this.mustPlaceCastle(state, config)) {
          return 1;
        } else {
          return 0;
        }
    }
  }
  getExpectedDropsThisTurnForPieceByPiece(state, config) {
    if (this.mustPlaceCastle(state, config)) {
      return 1;
    }
    const totalPieceToDrop = config.defenders + config.invaders;
    const totalPieceDropped = state.countPieceOnBoard(Player.ZERO) + state.countPieceOnBoard(Player.ONE);
    if (totalPieceDropped === totalPieceToDrop) {
      return 0;
    }
    Utils.assert(state.turn < totalPieceToDrop, "getExpectedDropsThisTurnForPieceByPiece should not be called after drop phase");
    let turnOfLastDrop = Math.min(config.defenders, config.invaders) * 2;
    if (config.playersPlaceCastle) {
      turnOfLastDrop += 2;
    }
    let dropBonus = 0;
    if (config.defenders < config.invaders) {
      turnOfLastDrop--;
      dropBonus = 1;
    }
    if (state.turn === turnOfLastDrop) {
      return Math.abs(config.defenders - config.invaders) + dropBonus;
    } else {
      return 1;
    }
  }
  getExpectedDropsThisTurnForBatch(state, config) {
    const toDrop = this.getNumberOfPieces(state.getCurrentPlayer(), config);
    if (state.turn < 2) {
      if (config.playersPlaceCastle) {
        return 1;
      } else {
        return toDrop;
      }
    } else if (state.turn < 4) {
      if (config.playersPlaceCastle) {
        return toDrop;
      }
    }
    return 0;
  }
  isLegalDrop(move, state, config) {
    if (QuebecCastlesMove.isTranslation(move)) {
      return MGPValidation.failure(QuebecCastlesFailure.CANNOT_MOVE_IN_DROP_PHASE());
    }
    if (this.mustPlaceCastle(state, config)) {
      return this.isLegalCastlePlacement(move, state, config);
    } else {
      return this.isLegalPieceDrop(move, state, config);
    }
  }
  mustPlaceCastle(state, config) {
    return state.turn < 2 && config.playersPlaceCastle;
  }
  isLegalCastlePlacement(move, state, config) {
    if (move.coords.size() === 1) {
      return this.getDropLegality(move.coords.getAnyElement().get(), state, config, false);
    } else {
      return MGPValidation.failure(QuebecCastlesFailure.PLACE_ONLY_ONE_CASTLE());
    }
  }
  isLegalPieceDrop(move, state, config) {
    if (config.dropMode === "PIECE_BY_PIECE") {
      if (this.isLastDrop(state, config)) {
        const player = state.getCurrentPlayer();
        const playerCount = state.countPieceOnBoard(player);
        const playerTotal = this.getNumberOfPieces(player, config);
        const remainToDrop = playerTotal - playerCount;
        if (move.coords.size() !== remainToDrop) {
          return MGPFallible.failure(QuebecCastlesFailure.MUST_DROP_ALL_YOUR_REMAINING_PIECES());
        }
      } else {
        if (move.coords.size() > 1) {
          return MGPFallible.failure(QuebecCastlesFailure.MUST_DROP_ONE_BY_ONE());
        }
      }
    } else if (config.dropMode === "BY_BATCH") {
      const numberToDrop = this.getNumberOfPieces(state.getCurrentPlayer(), config);
      if (move.coords.size() > numberToDrop) {
        return MGPFallible.failure(QuebecCastlesFailure.CANNOT_DROP_THAT_MANY_PIECES());
      }
      if (move.coords.size() < numberToDrop) {
        return MGPFallible.failure(QuebecCastlesFailure.MUST_DROP_ALL_YOUR_PIECES());
      }
    }
    for (const coord of move.coords) {
      const dropLegality = this.getDropLegality(coord, state, config, false);
      if (dropLegality.isFailure()) {
        return dropLegality;
      }
    }
    return MGPValidation.SUCCESS;
  }
  getNumberOfPieces(player, config) {
    return player === Player.ZERO ? config.defenders : config.invaders;
  }
  isLastDrop(state, config) {
    const opponent = state.getCurrentOpponent();
    const opponentCount = state.countPieceOnBoard(opponent);
    const opponentTotal = this.getNumberOfPieces(opponent, config);
    return opponentCount === opponentTotal;
  }
  getDropLegality(coord, state, config, isCastle) {
    if (state.isOnBoard(coord) === false) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(coord));
    }
    const landingSquare = state.getPieceAt(coord);
    if (landingSquare.isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SPACE());
    }
    const player = state.getCurrentPlayer();
    if (state.castles.get(player).equalsValue(coord) && isCastle === false) {
      return MGPValidation.failure(QuebecCastlesFailure.CANNOT_LAND_OR_DROP_IN_YOUR_CASTLE());
    }
    if (this.isDropInPlayerTerritory(coord, player, config)) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(QuebecCastlesFailure.MUST_DROP_IN_YOUR_TERRITORY());
    }
  }
  getValidDropCoords(player, config) {
    const drops = [];
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        const coord = new Coord(x, y);
        if (this.isDropInPlayerTerritory(coord, player, config)) {
          drops.push(coord);
        }
      }
    }
    return drops;
  }
  isValidDrop(state, coord, player, config) {
    if (this.isDropInPlayerTerritory(coord, player, config)) {
      return state.getPieceAt(coord).isNone() && state.isCastleAt(coord) === false;
    } else {
      return false;
    }
  }
  isDropInPlayerTerritory(coord, player, config) {
    const y = coord.y;
    let metric = 0;
    if (config.isRhombic) {
      const x = coord.x;
      metric = x + y;
    } else {
      metric = y;
    }
    const minMax = this.getLegalRangeIndex(player, config);
    return minMax.min <= metric && metric <= minMax.max;
  }
  getLegalRangeIndex(player, config) {
    const yMax = config.height - 1;
    if (config.isRhombic) {
      const xMax = config.width - 1;
      const max = xMax + yMax;
      return this.getLegalRangeFromMaximum(player, config, max);
    } else {
      return this.getLegalRangeFromMaximum(player, config, yMax);
    }
  }
  getLegalRangeFromMaximum(player, config, max) {
    return {
      min: player === Player.ZERO ? max + 1 - config.linesForTerritory : 0,
      max: player === Player.ZERO ? max : config.linesForTerritory - 1
    };
  }
  isLegalTranslation(move, state) {
    if (QuebecCastlesMove.isDrop(move)) {
      return MGPValidation.failure(QuebecCastlesFailure.CANNOT_DROP_IN_MOVE_PHASE());
    }
    const startValidity = this.getStartValidity(state, move.getStart());
    if (startValidity.isFailure()) {
      return startValidity;
    }
    const endValidity = this.getLandingValidity(state, move.getEnd());
    if (endValidity.isFailure()) {
      return endValidity;
    }
    const middleValidity = this.getMiddleValidity(state, move);
    if (middleValidity.isFailure()) {
      return middleValidity;
    }
    return MGPValidation.SUCCESS;
  }
  getStartValidity(state, start) {
    if (state.isOnBoard(start) === false) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(start));
    }
    const startPiece = state.getPieceAt(start);
    if (startPiece.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (startPiece === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    return MGPValidation.SUCCESS;
  }
  getLandingValidity(state, landing) {
    if (state.isOnBoard(landing) === false) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(landing));
    }
    const landingSquare = state.getPieceAt(landing);
    const currentPlayer = state.getCurrentPlayer();
    if (landingSquare.isPlayer() && landingSquare.equals(currentPlayer)) {
      return MGPValidation.failure(RulesFailure.CANNOT_SELF_CAPTURE());
    }
    const playerCastle = state.castles.get(currentPlayer).get();
    if (landing.equals(playerCastle)) {
      return MGPValidation.failure(QuebecCastlesFailure.CANNOT_LAND_OR_DROP_IN_YOUR_CASTLE());
    }
    return MGPValidation.SUCCESS;
  }
  getMiddleValidity(state, move) {
    const direction = move.getDirection();
    if (direction.isFailure()) {
      return MGPValidation.failure(DirectionFailure.DIRECTION_MUST_BE_LINEAR());
    }
    const distance = move.getDistance();
    if (state.getCurrentPlayer() === Player.ZERO) {
      if (distance !== this.getPlayerStepSize(Player.ZERO)) {
        return MGPValidation.failure(QuebecCastlesFailure.INVALID_DEFENDER_DISTANCE(distance));
      }
    } else {
      if (distance !== this.getPlayerStepSize(Player.ONE)) {
        return MGPValidation.failure(QuebecCastlesFailure.INVALID_INVADER_DISTANCE(distance));
      }
      const middle = move.getJumpedOverCoords();
      const middlePiece = state.getPieceAt(middle[0]);
      if (middlePiece !== PlayerOrNone.NONE) {
        return MGPValidation.failure(RulesFailure.SOMETHING_IN_THE_WAY());
      }
    }
    return MGPValidation.SUCCESS;
  }
  applyLegalMove(move, state, config) {
    if (this.isDropPhase(state, config)) {
      return this.applyLegalDrop(move, state, config);
    } else {
      return this.applyLegalNormalMove(move, state);
    }
  }
  applyLegalDrop(move, state, config) {
    const currentPlayer = state.getCurrentPlayer();
    if (this.mustPlaceCastle(state, config)) {
      const castles = PlayerMap.ofValues(state.castles.get(Player.ZERO), state.castles.get(Player.ONE));
      const castleCoord = move.coords.getAnyElement().get();
      castles.put(currentPlayer, MGPOptional.of(castleCoord));
      if (config.dropMode === "AUTO") {
        const adaptedDefaultConfig = __spreadProps(__spreadValues({}, this.getDefaultRulesConfig()), {
          width: config.width,
          height: config.height,
          isRhombic: config.isRhombic
        });
        const newState = this.placeCastlesAndMovePiece(state, castles, adaptedDefaultConfig);
        return new QuebecCastlesState(newState.board, state.turn + 1, castles);
      } else {
        return new QuebecCastlesState(state.board, state.turn + 1, castles);
      }
    } else {
      let resultingState = state;
      for (const drop of move.coords) {
        resultingState = resultingState.setPieceAt(drop, currentPlayer);
      }
      return resultingState.incrementTurn();
    }
  }
  placeCastlesAndMovePiece(state, castles, config) {
    const initialState = this.getInitialState(config);
    let newState = this.doCastlePlacement(initialState, castles, Player.ZERO);
    if (state.getCurrentPlayer() === Player.ZERO) {
      initialState.forEachCoord((coord, content) => {
        if (content === Player.ONE) {
          newState = newState.setPieceAt(coord, PlayerOrNone.NONE);
        }
      });
    } else {
      newState = this.doCastlePlacement(newState, castles, Player.ONE);
    }
    return newState;
  }
  doCastlePlacement(initialState, castles, player) {
    const actualCastle = castles.get(player).get();
    const defaultCastle = initialState.castles.get(player).get();
    if (initialState.getPieceAt(actualCastle).isPlayer()) {
      initialState = initialState.setPieceAt(actualCastle, PlayerOrNone.NONE);
      initialState = initialState.setPieceAt(defaultCastle, player);
    }
    return initialState;
  }
  applyLegalNormalMove(move, state) {
    const currentPlayer = state.getCurrentPlayer();
    return state.setPieceAt(move.getStart(), PlayerOrNone.NONE).setPieceAt(move.getEnd(), currentPlayer).incrementTurn();
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const defenderCastle = state.castles.get(Player.ONE);
    if (defenderCastle.isPresent() && state.getPieceAt(defenderCastle.get()).equals(PlayerOrNone.ZERO)) {
      return GameStatus.ZERO_WON;
    }
    const invader = state.castles.get(Player.ZERO);
    if (invader.isPresent() && state.getPieceAt(invader.get()).equals(PlayerOrNone.ONE)) {
      return GameStatus.ONE_WON;
    }
    const playerZeroPieces = state.countPieceOnBoard(Player.ZERO);
    if (this.isDropPhase(state, config) === false) {
      if (playerZeroPieces === 0) {
        return GameStatus.ONE_WON;
      }
      const playerOne = state.countPieceOnBoard(Player.ONE);
      if (playerOne === 0) {
        return GameStatus.ZERO_WON;
      }
    }
    return GameStatus.ONGOING;
  }
  getPlayerStepSize(player) {
    if (player === Player.ZERO) {
      return 1;
    } else {
      return 2;
    }
  }
  getPossibleMovesFor(coord, state) {
    const owner = state.getPieceAt(coord);
    const stepSize = this.getPlayerStepSize(owner);
    const moves = [];
    for (const direction of Ordinal.ORDINALS) {
      const step = coord.getNext(direction);
      if (state.isOnBoard(step)) {
        if (stepSize === 1) {
          if (this.getLandingValidity(state, step).isSuccess()) {
            moves.push(QuebecCastlesTranslation.of(coord, step));
          }
        } else {
          if (state.getPieceAt(step) === PlayerOrNone.NONE) {
            const landing = coord.getNext(direction, 2);
            if (this.getLandingValidity(state, landing).isSuccess()) {
              moves.push(QuebecCastlesTranslation.of(coord, landing));
            }
          }
        }
      }
    }
    return moves;
  }
};

// games/dist/games/quebec-castles/QuebecCastlesMoveGenerator.js
var QuebecCastlesMoveGenerator = class extends MoveGenerator {
  getListMoves(node, config) {
    const state = node.gameState;
    if (QuebecCastlesRules.get().isDropPhase(state, config)) {
      return this.getDropMoves(state, config);
    } else {
      return this.getNormalMoves(state, config);
    }
  }
  getDropMoves(state, config) {
    const player = state.getCurrentPlayer();
    const moves = [];
    const rules = QuebecCastlesRules.get();
    const nbOfDropsAwaited = rules.getExpectedDropsThisTurn(state, config);
    const mustPlaceCastle = rules.mustPlaceCastle(state, config);
    if (config.dropMode === "PIECE_BY_PIECE" || mustPlaceCastle) {
      const coords = [];
      const validDropCoords = rules.getValidDropCoords(player, config);
      for (const dropCoord of validDropCoords) {
        const piece = state.getPieceAt(dropCoord);
        if (piece.isNone() && state.castles.get(player).equalsValue(dropCoord) === false) {
          if (nbOfDropsAwaited === 1) {
            moves.push(QuebecCastlesDrop.of([dropCoord]));
          } else {
            coords.push(dropCoord);
            if (nbOfDropsAwaited === coords.length) {
              return [QuebecCastlesDrop.of(coords)];
            }
          }
        }
      }
    } else {
      const initialCoords = QuebecCastlesRules.get().getInitialCoords(player, state, config);
      const move = QuebecCastlesMove.drop(initialCoords);
      moves.push(move);
    }
    return moves;
  }
  getNormalMoves(state, config) {
    const player = state.getCurrentPlayer();
    const moves = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content.equals(player)) {
        const movesForCoord = QuebecCastlesRules.get().getPossibleMovesFor(coordAndContent.coord, state);
        moves.push(...movesForCoord);
      }
    }
    return moves;
  }
};

// games/dist/games/quixo/QuixoFailure.js
var QuixoFailure = class {
  static NO_INSIDE_CLICK = () => $localize`You must pick a space from the edge of the board.`;
};

// games/dist/games/quixo/QuixoState.js
var QuixoState = class _QuixoState extends PlayerOrNoneGameStateWithTable {
  applyLegalMove(move) {
    const newBoard = this.getCopiedBoard();
    const newTurn = this.turn + 1;
    let currentCoordToFill = move.coord;
    let nextCoordToSlide = move.coord.getNext(move.direction);
    while (this.isOnBoard(nextCoordToSlide)) {
      newBoard[currentCoordToFill.y][currentCoordToFill.x] = newBoard[nextCoordToSlide.y][nextCoordToSlide.x];
      currentCoordToFill = currentCoordToFill.getNext(move.direction);
      nextCoordToSlide = nextCoordToSlide.getNext(move.direction);
    }
    newBoard[currentCoordToFill.y][currentCoordToFill.x] = this.getCurrentPlayer();
    return new _QuixoState(newBoard, newTurn);
  }
};

// games/dist/games/quixo/QuixoRules.js
var QuixoRules = class _QuixoRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Quixo`,
    config: {
      width: new NumberConfig(5, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(1, 99)),
      height: new NumberConfig(5, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(1, 99))
    }
  });
  static QUIXO_HELPER = new NInARowHelper(Utils.identity, 5);
  static getVerticalCoords(node) {
    const currentOpponent = node.gameState.getCurrentOpponent();
    const verticalCoords = [];
    const state = node.gameState;
    for (let y = 0; y < state.getHeight(); y++) {
      if (state.getPieceAtXY(0, y) !== currentOpponent) {
        verticalCoords.push(new Coord(0, y));
      }
      if (state.getPieceAtXY(state.getWidth() - 1, y) !== currentOpponent) {
        verticalCoords.push(new Coord(state.getWidth() - 1, y));
      }
    }
    return verticalCoords;
  }
  static getHorizontalCenterCoords(node) {
    const currentOpponent = node.gameState.getCurrentOpponent();
    const horizontalCenterCoords = [];
    const state = node.gameState;
    for (let x = 1; x < state.getWidth() - 1; x++) {
      if (state.getPieceAtXY(x, 0) !== currentOpponent) {
        horizontalCenterCoords.push(new Coord(x, 0));
      }
      if (state.getPieceAtXY(x, state.getHeight() - 1) !== currentOpponent) {
        horizontalCenterCoords.push(new Coord(x, state.getHeight() - 1));
      }
    }
    return horizontalCenterCoords;
  }
  static getLinesSums(state) {
    const sums = PlayerMap.ofValues(new MGPMap([
      { key: "columns", value: new NumberMap() },
      { key: "rows", value: new NumberMap() },
      { key: "ascendingDiagonal", value: new NumberMap() },
      { key: "descendingDiagonal", value: new NumberMap() }
    ]), new MGPMap([
      { key: "columns", value: new NumberMap() },
      { key: "rows", value: new NumberMap() },
      { key: "ascendingDiagonal", value: new NumberMap() },
      { key: "descendingDiagonal", value: new NumberMap() }
    ]));
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const content = coordAndContent.content;
      const x = coordAndContent.coord.x;
      const y = coordAndContent.coord.y;
      sums.get(content).get("columns").get().addOrSet(x, 1);
      sums.get(content).get("rows").get().addOrSet(y, 1);
      sums.get(content).get("ascendingDiagonal").get().addOrSet(x + y, 1);
      sums.get(content).get("descendingDiagonal").get().addOrSet(x - y, 1);
    }
    return sums;
  }
  static getVictoriousCoords(state) {
    const victoriousCoord = _QuixoRules.QUIXO_HELPER.getVictoriousCoord(state);
    const opponentCoords = _QuixoRules.getPlayersCoords(victoriousCoord, state, state.getPreviousOpponent());
    const playerCoords = _QuixoRules.getPlayersCoords(victoriousCoord, state, state.getPreviousPlayer());
    if (opponentCoords.length === 0) {
      if (playerCoords.length === 0) {
        return [];
      } else {
        return playerCoords;
      }
    } else {
      return opponentCoords;
    }
  }
  static getPlayersCoords(coords, state, player) {
    return coords.filter((coord) => {
      return state.getPieceAt(coord).equals(player);
    });
  }
  static getFullestLine(playerLinesInfo) {
    let linesScores = playerLinesInfo.get("columns").get().getValueList();
    linesScores = linesScores.concat(playerLinesInfo.get("rows").get().getValueList());
    linesScores = linesScores.concat(playerLinesInfo.get("ascendingDiagonal").get().getValueList());
    linesScores = linesScores.concat(playerLinesInfo.get("descendingDiagonal").get().getValueList());
    return Math.max(...linesScores);
  }
  static get() {
    if (_QuixoRules.singleton.isAbsent()) {
      _QuixoRules.singleton = MGPOptional.of(new _QuixoRules());
    }
    return _QuixoRules.singleton.get();
  }
  getRulesConfigDescription() {
    return _QuixoRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const initialBoard = TableUtils.create(config.width, config.height, PlayerOrNone.NONE);
    return new QuixoState(initialBoard, 0);
  }
  getPossibleDirections(state, coord) {
    const possibleDirections = [];
    if (coord.x !== 0)
      possibleDirections.push(Orthogonal.LEFT);
    if (coord.y !== 0)
      possibleDirections.push(Orthogonal.UP);
    if (coord.x !== state.getWidth() - 1)
      possibleDirections.push(Orthogonal.RIGHT);
    if (coord.y !== state.getHeight() - 1)
      possibleDirections.push(Orthogonal.DOWN);
    return possibleDirections;
  }
  isValidCoord(state, coord) {
    Utils.assert(state.isOnBoard(coord), "Invalid coord for QuixoMove: " + coord.toString() + " is outside the board.");
    if (coord.x !== 0 && coord.x !== state.getWidth() - 1 && coord.y !== 0 && coord.y !== state.getHeight() - 1) {
      return MGPValidation.failure(QuixoFailure.NO_INSIDE_CLICK());
    }
    return MGPValidation.SUCCESS;
  }
  assertDirectionValidity(move, state) {
    const x = move.coord.x;
    const y = move.coord.y;
    const direction = move.direction;
    Utils.assert(x !== state.getWidth() - 1 || direction !== Orthogonal.RIGHT, `Invalid direction: piece on the right side can't be moved to the right.`);
    Utils.assert(y !== state.getHeight() - 1 || direction !== Orthogonal.DOWN, `Invalid direction: piece on the bottom side can't be moved down.`);
    Utils.assert(x !== 0 || direction !== Orthogonal.LEFT, `Invalid direction: piece on the left side can't be moved to the left.`);
    Utils.assert(y !== 0 || direction !== Orthogonal.UP, `Invalid direction: piece on the top side can't be moved up.`);
  }
  applyLegalMove(move, state, _config, _info) {
    return state.applyLegalMove(move);
  }
  isLegal(move, state) {
    const coordValidity = this.isValidCoord(state, move.coord);
    if (coordValidity.isFailure()) {
      return coordValidity;
    }
    this.assertDirectionValidity(move, state);
    if (state.getPieceAt(move.coord) === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  getGameStatus(node) {
    const state = node.gameState;
    const victoriousCoord = _QuixoRules.QUIXO_HELPER.getVictoriousCoord(state);
    const unreducedWinners = victoriousCoord.map((coord) => state.getPieceAt(coord));
    const winners = new Set2(unreducedWinners);
    if (winners.size() === 0) {
      return GameStatus.ONGOING;
    } else if (winners.size() === 1) {
      return GameStatus.getVictory(winners.getAnyElement().get());
    } else {
      return GameStatus.getVictory(state.getCurrentPlayer());
    }
  }
};

// games/dist/games/quixo/QuixoHeuristic.js
var QuixoHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const linesSums = QuixoRules.getLinesSums(state);
    const zerosFullestLine = QuixoRules.getFullestLine(linesSums.get(Player.ZERO));
    const onesFullestLine = QuixoRules.getFullestLine(linesSums.get(Player.ONE));
    return PlayerNumberTable.ofSingle(zerosFullestLine, onesFullestLine);
  }
};

// games/dist/games/quixo/QuixoMove.js
var QuixoMove = class _QuixoMove extends MoveCoord {
  direction;
  static encoder = Encoder.tuple([Coord.encoder, Orthogonal.encoder], (m) => [m.coord, m.direction], (fields) => new _QuixoMove(fields[0].x, fields[0].y, fields[1]));
  constructor(x, y, direction) {
    super(x, y);
    this.direction = direction;
  }
  toString() {
    return "QuixoMove(" + this.coord.x + ", " + this.coord.y + ", " + this.direction.toString() + ")";
  }
  equals(other) {
    if (other === this)
      return true;
    if (other.coord.equals(this.coord) === false)
      return false;
    return other.direction === this.direction;
  }
};

// games/dist/games/quixo/QuixoMoveGenerator.js
var QuixoMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const state = node.gameState;
    const moves = [];
    const verticalCoords = QuixoRules.getVerticalCoords(node);
    const horizontalCenterCoords = QuixoRules.getHorizontalCenterCoords(node);
    const coords = horizontalCenterCoords.concat(verticalCoords);
    for (const coord of coords) {
      const possibleDirections = QuixoRules.get().getPossibleDirections(state, coord);
      for (const possibleDirection of possibleDirections) {
        const newMove = new QuixoMove(coord.x, coord.y, possibleDirection);
        moves.push(newMove);
      }
    }
    return moves;
  }
};

// games/dist/games/reversis/common/ReversiFailure.js
var ReversiFailure = class {
  static NO_ELEMENT_SWITCHED = () => $localize`Your move should switch at least one piece.`;
};

// games/dist/games/reversis/common/ReversiMove.js
var ReversiMove = class _ReversiMove extends MoveCoord {
  static encoder = MoveCoord.getEncoder(_ReversiMove.of);
  static PASS = new _ReversiMove(-1, -1);
  static of(coord) {
    return new _ReversiMove(coord.x, coord.y);
  }
  toString() {
    return "ReversiMove(" + this.coord.x + ", " + this.coord.y + ")";
  }
};

// games/dist/games/reversis/common/ReversiState.js
var ReversiState = class extends PlayerOrNoneGameStateWithTable {
  getNeighboringPawnLike(searchedValue, center) {
    let coord;
    const result = [];
    for (let ny = -1; ny < 2; ny++) {
      for (let nx = -1; nx < 2; nx++) {
        coord = new Coord(center.x + nx, center.y + ny);
        if (this.isOnBoard(coord)) {
          if (this.board[coord.y][coord.x] === searchedValue) {
            result.push(coord);
          }
        }
      }
    }
    return result;
  }
  countScore() {
    const scores = PlayerNumberMap.of(0, 0);
    for (const coordAndContent of this.getPlayerCoordsAndContent()) {
      const spaceOwner = coordAndContent.content;
      scores.add(spaceOwner, 1);
    }
    return scores;
  }
};

// games/dist/games/reversis/common/AbstractReversiRules.js
var __decorate10 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReversiMoveWithSwitched = class {
  move;
  switched;
  constructor(move, switched) {
    this.move = move;
    this.switched = switched;
  }
};
var RectangularBoardMode = class {
  getNextCoord(coord, direction, _) {
    return coord.getNext(direction);
  }
};
var ToricBoardMode = class {
  getNextCoord(coord, direction, state) {
    return coord.getNextToric(direction, state.getWidth(), state.getHeight());
  }
};
var AbstractReversiRules = class AbstractReversiRules2 extends ConfigurableRules {
  toricBoardMode = new ToricBoardMode();
  rectangularBoardMode = new RectangularBoardMode();
  getBoardMode(config) {
    if (config.toric) {
      return this.toricBoardMode;
    } else {
      return this.rectangularBoardMode;
    }
  }
  getInitialState(config) {
    const board = TableUtils.create(config.width, config.height, PlayerOrNone.NONE);
    const downRightCenter = new Coord(Math.floor(config.width / 2), Math.floor(config.height / 2));
    board[downRightCenter.y - 1][downRightCenter.x - 1] = Player.ZERO;
    board[downRightCenter.y][downRightCenter.x] = Player.ZERO;
    board[downRightCenter.y - 1][downRightCenter.x] = Player.ONE;
    board[downRightCenter.y][downRightCenter.x - 1] = Player.ONE;
    return new ReversiState(board, 0);
  }
  applyLegalMove(move, state, _, info) {
    const turn = state.turn;
    const player = state.getCurrentPlayer();
    const board = state.getCopiedBoard();
    if (move.equals(ReversiMove.PASS)) {
      const sameBoardDifferentTurn = new ReversiState(board, turn + 1);
      return sameBoardDifferentTurn;
    }
    for (const s of info) {
      board[s.y][s.x] = player;
    }
    board[move.coord.y][move.coord.x] = player;
    const resultingState = new ReversiState(board, turn + 1);
    return resultingState;
  }
  getAllSwitchedCoords(move, player, state, config) {
    const switcheds = [];
    const opponent = player.getOpponent();
    const boardMode = this.getBoardMode(config);
    for (const direction of Ordinal.ORDINALS) {
      const firstSpace = boardMode.getNextCoord(move.coord, direction, state);
      if (state.hasPieceAt(firstSpace, opponent)) {
        const switchedInDir = this.getSandwicheds(player, direction, firstSpace, state, config);
        for (const switched of switchedInDir) {
          switcheds.push(switched);
        }
      }
    }
    return switcheds;
  }
  getSandwicheds(capturer, direction, start, state, config) {
    const boardMode = this.getBoardMode(config);
    const sandwichedsCoord = [start];
    let testedCoord = boardMode.getNextCoord(start, direction, state);
    while (state.isOnBoard(testedCoord) && testedCoord.equals(start) === false) {
      const testedCoordContent = state.getPieceAt(testedCoord);
      if (testedCoordContent === capturer) {
        return sandwichedsCoord;
      } else if (testedCoordContent.isNone()) {
        return [];
      } else {
        sandwichedsCoord.push(testedCoord);
        testedCoord = boardMode.getNextCoord(testedCoord, direction, state);
      }
    }
    return [];
  }
  isGameEnded(state, config) {
    return this.playerCanOnlyPass(state, config) && this.nextPlayerCanOnlyPass(state, config);
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const gameIsEnded = this.isGameEnded(state, config);
    if (gameIsEnded === false) {
      return GameStatus.ONGOING;
    }
    const scores = state.countScore();
    const diff = scores.get(Player.ONE) - scores.get(Player.ZERO);
    if (diff < 0) {
      return GameStatus.ZERO_WON;
    }
    if (diff > 0) {
      return GameStatus.ONE_WON;
    }
    return GameStatus.DRAW;
  }
  playerCanOnlyPass(state, config) {
    const currentPlayerChoices = this.getListMoves(state, config);
    return currentPlayerChoices.length === 1 && currentPlayerChoices[0].move.equals(ReversiMove.PASS);
  }
  nextPlayerCanOnlyPass(reversiState, config) {
    const nextBoard = reversiState.getCopiedBoard();
    const nextTurn = reversiState.turn + 1;
    const nextState = new ReversiState(nextBoard, nextTurn);
    return this.playerCanOnlyPass(nextState, config);
  }
  getListMoves(state, config) {
    const moves = [];
    const player = state.getCurrentPlayer();
    const opponent = state.getCurrentOpponent();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      if (state.getPieceAt(coord).isNone()) {
        const opponentNeighbors = state.getNeighboringPawnLike(opponent, coord);
        if (opponentNeighbors.length > 0) {
          const move = new ReversiMove(coord.x, coord.y);
          const result = this.getAllSwitchedCoords(move, player, state, config);
          if (result.length > 0) {
            for (const switched of result) {
              Utils.assert(player !== state.getPieceAt(switched), switched + "was already switched!");
            }
            moves.push(new ReversiMoveWithSwitched(move, result.length));
          }
        }
      }
    }
    if (moves.length === 0) {
      moves.push(new ReversiMoveWithSwitched(ReversiMove.PASS, 0));
    }
    return moves;
  }
  isLegal(move, state, config) {
    if (move.equals(ReversiMove.PASS)) {
      if (this.playerCanOnlyPass(state, config)) {
        return MGPFallible.success([]);
      } else {
        return MGPFallible.failure(RulesFailure.CANNOT_PASS());
      }
    }
    if (state.getPieceAt(move.coord).isPlayer()) {
      return MGPFallible.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SPACE());
    }
    const switched = this.getAllSwitchedCoords(move, state.getCurrentPlayer(), state, config);
    if (switched.length === 0) {
      return MGPFallible.failure(ReversiFailure.NO_ELEMENT_SWITCHED());
    } else {
      return MGPFallible.success(switched);
    }
  }
};
AbstractReversiRules = __decorate10([
  Debug.log
], AbstractReversiRules);

// games/dist/games/reversis/common/ReversiHeuristic.js
var ReversiHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const state = node.gameState;
    const metrics = PlayerNumberTable.of([0], [0]);
    for (const coordAndContent of state.getPlayerCoordsAndContent()) {
      const coord = coordAndContent.coord;
      const player = coordAndContent.content;
      const verticalBorder = state.isVerticalEdge(coord);
      const horizontalBorder = state.isHorizontalEdge(coord);
      const locationValue = (verticalBorder ? 4 : 1) * (horizontalBorder ? 4 : 1);
      metrics.add(player, 0, locationValue);
    }
    return metrics;
  }
};

// games/dist/games/reversis/common/ReversiMoveGenerator.js
var ReversiMoveGenerator = class extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const moves = this.rules.getListMoves(node.gameState, config);
    return moves.map((moveWithSwitched) => {
      return moveWithSwitched.move;
    });
  }
};

// games/dist/games/reversis/reversi/ReversiRules.js
var ReversiRules = class _ReversiRules extends AbstractReversiRules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_ReversiRules.singleton.isAbsent()) {
      _ReversiRules.singleton = MGPOptional.of(new _ReversiRules());
    }
    return _ReversiRules.singleton.get();
  }
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Reversi`,
    config: {
      width: new NumberConfig(8, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(3, 99)),
      height: new NumberConfig(8, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(3, 99)),
      toric: new BooleanConfig(false, RulesConfigDescriptionLocalizable.TORIC)
    }
  });
  getRulesConfigDescription() {
    return _ReversiRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/reversis/toric-reversi/ToricReversiRules.js
var ToricReversiRules = class _ToricReversiRules extends AbstractReversiRules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_ToricReversiRules.singleton.isAbsent()) {
      _ToricReversiRules.singleton = MGPOptional.of(new _ToricReversiRules());
    }
    return _ToricReversiRules.singleton.get();
  }
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Toric Reversi`,
    config: {
      width: new NumberConfig(8, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(3, 99)),
      height: new NumberConfig(8, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(3, 99)),
      toric: new BooleanConfig(true, RulesConfigDescriptionLocalizable.TORIC)
    }
  });
  getRulesConfigDescription() {
    return _ToricReversiRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/sahara/SaharaMobilityHeuristic.js
var SaharaMobilityHeuristic = class extends PlayerMetricHeuristic {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getMetrics(node, _config) {
    const zeroMobilities = this.getMobilities(node.gameState, Player.ZERO);
    const oneMobilities = this.getMobilities(node.gameState, Player.ONE);
    return PlayerNumberTable.of(oneMobilities, zeroMobilities);
  }
  /**
   * @returns a list of number sorted from biggest to smallest
   *          each of those number represents the number of moves that one piece must take to reach the closest ally
   *          hence, the higher is considered the worst, as POSITIVE_INFINITY means surrounded
   */
  getMobilities(state, player) {
    const mobilities = [];
    for (const coord of state.allCoords()) {
      if (state.hasPieceBelongingTo(coord, player)) {
        mobilities.push(this.countMovesToClosestAlly(state, coord));
      }
    }
    ArrayUtils.sortByDescending(mobilities, (mobility) => mobility);
    return mobilities;
  }
  countMovesToClosestAlly(state, coord) {
    let exploredCoords = new CoordSet([coord]);
    let newWaveOfNeighbors = this.getLandingCoords(state, new CoordSet([coord]));
    let depth = 1;
    while (newWaveOfNeighbors.size() > 0) {
      const numberOfAllies = newWaveOfNeighbors.filter((c) => state.getPieceAt(c).equals(state.getPieceAt(coord)));
      const emptyNeighbors = newWaveOfNeighbors.filter((c) => state.getPieceAt(c).equals(FourStatePiece.EMPTY));
      if (numberOfAllies.size() > 0) {
        return depth;
      } else if (emptyNeighbors.size() === 0) {
        newWaveOfNeighbors = new CoordSet();
      } else {
        exploredCoords = exploredCoords.union(emptyNeighbors);
        newWaveOfNeighbors = this.getLandingCoords(state, emptyNeighbors);
        newWaveOfNeighbors = newWaveOfNeighbors.filter((c) => exploredCoords.contains(c) === false);
        depth++;
      }
    }
    return Number.POSITIVE_INFINITY;
  }
  getLandingCoords(state, coords) {
    let neighboringCoords = new CoordSet();
    for (const currentCoord of coords) {
      const neighbors = this.rules.getValidLandingCoords(state, currentCoord);
      for (const neighbor of neighbors) {
        if (coords.contains(neighbor) === false) {
          neighboringCoords = neighboringCoords.addElement(neighbor);
        }
      }
    }
    return neighboringCoords;
  }
};

// games/dist/games/sahara/SaharaCapturedThenCapturedFreedomThenAllFreedomsHeuristic.js
var SaharaCapturedThenCapturedFreedomThenAllFreedomsHeuristic = class extends SaharaMobilityHeuristic {
  getMetrics(node, _config) {
    const capturedAndFreedomForZero = this.getCapturedAndFreedom(node.gameState, Player.ZERO);
    const capturedAndFreedomForOne = this.getCapturedAndFreedom(node.gameState, Player.ONE);
    const zeroFreedoms = this.rules.getBoardValuesFor(node.gameState, Player.ZERO);
    const oneFreedoms = this.rules.getBoardValuesFor(node.gameState, Player.ONE);
    return PlayerNumberTable.of([capturedAndFreedomForOne.captured ? 1 : 0, -capturedAndFreedomForOne.freedoms, ...zeroFreedoms], [capturedAndFreedomForZero.captured ? 1 : 0, -capturedAndFreedomForZero.freedoms, ...oneFreedoms]);
  }
  getCapturedAndFreedom(state, player) {
    for (const coord of state.allCoords()) {
      if (state.hasPieceBelongingTo(coord, player)) {
        if (this.countMovesToClosestAlly(state, coord) === Number.POSITIVE_INFINITY) {
          const freedoms = TriangularGameState.getEmptyNeighbors(state.board, coord, FourStatePiece.EMPTY).length;
          return { captured: true, freedoms };
        }
      }
    }
    return { captured: false, freedoms: 0 };
  }
};

// games/dist/games/sahara/SaharaFailure.js
var SaharaFailure = class {
  static CAN_ONLY_REBOUND_ON_BLACK = () => $localize`You can only rebound on dark spaces.`;
  static CAN_ONLY_REBOUND_ON_EMPTY_SPACE = () => $localize`You can only rebound on empty spaces.`;
  static MUST_CHOOSE_PYRAMID_FIRST = () => $localize`You must pick one of your pyramids first.`;
  static MUST_CHOOSE_OWN_PYRAMID = () => $localize`You must pick one of your pyramids.`;
  static THOSE_TWO_SPACES_ARE_NOT_NEIGHBORS = () => $localize`Those two spaces are not neighbors.`;
  static THOSE_TWO_SPACES_HAVE_NO_COMMON_NEIGHBOR = () => $localize`Those two spaces have no intermediary neighbor.`;
};

// games/dist/games/sahara/SaharaState.js
var SaharaState = class extends FourStatePieceTriangularGameState {
};

// games/dist/games/sahara/SaharaRules.js
var __decorate11 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SaharaRules_1;
var SaharaRules = class SaharaRules2 extends Rules {
  static {
    SaharaRules_1 = this;
  }
  static singleton = MGPOptional.empty();
  static get() {
    if (SaharaRules_1.singleton.isAbsent()) {
      SaharaRules_1.singleton = MGPOptional.of(new SaharaRules_1());
    }
    return SaharaRules_1.singleton.get();
  }
  getInitialState() {
    const size = 3;
    const N = FourStatePiece.UNREACHABLE;
    const O = FourStatePiece.ZERO;
    const X = FourStatePiece.ONE;
    const _ = FourStatePiece.EMPTY;
    const board = HexagonalUtils.createBoard(size, N, _);
    const start = (size + 1) % 2;
    const xEnd = 4 * size - (2 - start);
    const yEnd = size * 2 - 1;
    const first = size - size % 2;
    const second = first + 1;
    const third = first + 2 * size - 1;
    const fourth = third + 1;
    board[0][first] = O;
    board[0][second] = X;
    board[0][third] = O;
    board[0][fourth] = X;
    board[first - start][start] = X;
    board[second - start][start] = O;
    board[first - start][xEnd] = O;
    board[second - start][xEnd] = X;
    board[yEnd][first] = O;
    board[yEnd][second] = X;
    board[yEnd][third] = O;
    board[yEnd][fourth] = X;
    return new SaharaState(board, 0);
  }
  getStartingCoords(state, player) {
    const startingCoords = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content.is(player)) {
        startingCoords.push(coordAndContent.coord);
      }
    }
    return startingCoords;
  }
  getBoardValueByPiece(state, player) {
    const playersPiece = this.getStartingCoords(state, player);
    const playerFreedoms = new MGPMap();
    for (const piece of playersPiece) {
      const freedoms = TriangularGameState.getEmptyNeighbors(state.board, piece, FourStatePiece.EMPTY).length;
      playerFreedoms.set(piece, freedoms);
    }
    return playerFreedoms;
  }
  /**
   * @param state the evaluated state
   * @param player the player for which returned values apply
   * @returns a sorted table of the freedom of player's pieces
   */
  getBoardValuesFor(state, player) {
    const playerFreedomsMap = this.getBoardValueByPiece(state, player);
    const playerFreedomsValue = playerFreedomsMap.getValueList();
    ArrayUtils.sortByDescending(playerFreedomsValue, (value) => -value);
    return playerFreedomsValue;
  }
  applyLegalMove(move, state, _config, _info) {
    const board = state.getCopiedBoard();
    board[move.getEnd().y][move.getEnd().x] = board[move.getStart().y][move.getStart().x];
    board[move.getStart().y][move.getStart().x] = FourStatePiece.EMPTY;
    const resultingState = new SaharaState(board, state.turn + 1);
    return resultingState;
  }
  isLegal(move, state) {
    const coordsValidity = this.getCoordsValidity(move, state);
    if (coordsValidity.isFailure()) {
      return coordsValidity;
    }
    const movedPawn = state.getPieceAt(move.getStart());
    if (movedPawn.is(state.getCurrentPlayer()) === false) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    const landingSpace = state.getPieceAt(move.getEnd());
    if (landingSpace !== FourStatePiece.EMPTY) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    const commonNeighbor = TriangularCheckerBoard.getCommonNeighbor(move.getStart(), move.getEnd());
    if (commonNeighbor.isPresent()) {
      if (state.getPieceAt(commonNeighbor.get()) === FourStatePiece.EMPTY) {
        return MGPValidation.SUCCESS;
      } else {
        return MGPValidation.failure(SaharaFailure.CAN_ONLY_REBOUND_ON_EMPTY_SPACE());
      }
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  getCoordsValidity(move, state) {
    if (state.isNotOnBoard(move.getStart())) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.getStart()));
    } else if (state.isNotOnBoard(move.getEnd())) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.getEnd()));
    } else {
      return MGPValidation.SUCCESS;
    }
  }
  getGameStatus(node) {
    const board = node.gameState;
    const zeroFreedoms = this.getBoardValuesFor(board, Player.ZERO);
    const oneFreedoms = this.getBoardValuesFor(board, Player.ONE);
    return this.getGameStatusFromFreedoms(zeroFreedoms, oneFreedoms);
  }
  getLandingCoordsMatching(coord, state, premise) {
    const landings = new CoordSet(TriangularCheckerBoard.getNeighbors(coord).filter(premise));
    if (TriangularCheckerBoard.isSpaceDark(coord)) {
      return landings.toList();
    } else {
      let farLandings = new CoordSet(landings.toList());
      const emptyNeighbors = landings.filter((c) => state.getPieceAt(c).equals(FourStatePiece.EMPTY));
      for (const neighbor of emptyNeighbors) {
        const secondStepNeighbors = TriangularCheckerBoard.getNeighbors(neighbor).filter(premise);
        for (const secondStepNeighbor of secondStepNeighbors) {
          farLandings = farLandings.addElement(secondStepNeighbor);
        }
      }
      return farLandings.toList();
    }
  }
  getLegalLandingCoords(state, coord) {
    const isOnBoardAndEmpty = (c) => {
      return state.hasPieceAt(c, FourStatePiece.EMPTY);
    };
    return this.getLandingCoordsMatching(coord, state, isOnBoardAndEmpty);
  }
  getValidLandingCoords(state, coord) {
    const isOnBoardAndReachable = (c) => {
      return state.isOnBoard(c) && state.getPieceAt(c).equals(FourStatePiece.UNREACHABLE) === false;
    };
    return this.getLandingCoordsMatching(coord, state, isOnBoardAndReachable);
  }
  getGameStatusFromFreedoms(zeroFreedoms, oneFreedoms) {
    if (zeroFreedoms[0] === 0) {
      return GameStatus.ONE_WON;
    } else if (oneFreedoms[0] === 0) {
      return GameStatus.ZERO_WON;
    }
    return GameStatus.ONGOING;
  }
};
SaharaRules = SaharaRules_1 = __decorate11([
  Debug.log
], SaharaRules);

// games/dist/games/sahara/SaharaFreedomHeuristic.js
var SaharaFreedomHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    const zeroFreedoms = SaharaRules.get().getBoardValuesFor(node.gameState, Player.ZERO);
    const oneFreedoms = SaharaRules.get().getBoardValuesFor(node.gameState, Player.ONE);
    return PlayerNumberTable.of(zeroFreedoms, oneFreedoms);
  }
};

// games/dist/games/sahara/SaharaMove.js
var SaharaMove = class _SaharaMove extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_SaharaMove.from);
  static checkDistanceAndLocation(start, end) {
    const distance = start.getOrthogonalDistance(end);
    if (distance === 0) {
      return MGPValidation.failure(RulesFailure.MOVE_CANNOT_BE_STATIC());
    } else if (distance === 1) {
      const fakeNeighbors = TriangularCheckerBoard.getFakeNeighbors(start);
      if (end.equals(fakeNeighbors)) {
        return MGPValidation.failure(SaharaFailure.THOSE_TWO_SPACES_ARE_NOT_NEIGHBORS());
      }
    } else if (distance === 2) {
      if (TriangularCheckerBoard.isSpaceDark(start)) {
        return MGPValidation.failure(SaharaFailure.CAN_ONLY_REBOUND_ON_BLACK());
      }
      if (start.x === end.x) {
        return MGPValidation.failure(SaharaFailure.THOSE_TWO_SPACES_HAVE_NO_COMMON_NEIGHBOR());
      }
    } else {
      return MGPValidation.failure($localize`You can move one or two spaces, not ${distance}.`);
    }
    return MGPValidation.SUCCESS;
  }
  static from(start, end) {
    const validity = _SaharaMove.checkDistanceAndLocation(start, end);
    if (validity.isFailure()) {
      return validity.toOtherFallible();
    } else {
      return MGPFallible.success(new _SaharaMove(start, end));
    }
  }
  constructor(start, end) {
    super(start, end);
  }
  isSimpleStep() {
    const dx = Math.abs(this.getStart().x - this.getEnd().x);
    const dy = Math.abs(this.getStart().y - this.getEnd().y);
    return dx + dy === 1;
  }
  toString() {
    return "SaharaMove(" + this.getStart() + "->" + this.getEnd() + ")";
  }
};

// games/dist/games/sahara/SaharaMoveGenerator.js
var SaharaMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const moves = [];
    const board = node.gameState.getCopiedBoard();
    const player = node.gameState.getCurrentPlayer();
    const startingCoords = SaharaRules.get().getStartingCoords(node.gameState, player);
    for (const start of startingCoords) {
      const neighbors = TriangularGameState.getEmptyNeighbors(board, start, FourStatePiece.EMPTY);
      for (const neighbor of neighbors) {
        const newMove = SaharaMove.from(start, neighbor).get();
        board[neighbor.y][neighbor.x] = board[start.y][start.x];
        board[start.y][start.x] = FourStatePiece.EMPTY;
        moves.push(newMove);
        const upwardTriangle = (neighbor.y + neighbor.x) % 2 === 0;
        if (upwardTriangle) {
          const farNeighbors = TriangularGameState.getEmptyNeighbors(board, neighbor, FourStatePiece.EMPTY);
          for (const farNeighbor of farNeighbors) {
            if (farNeighbor.equals(start) === false) {
              const farMove = SaharaMove.from(start, farNeighbor).get();
              board[farNeighbor.y][farNeighbor.x] = board[neighbor.y][neighbor.x];
              board[neighbor.y][neighbor.x] = FourStatePiece.EMPTY;
              moves.push(farMove);
              board[neighbor.y][neighbor.x] = board[farNeighbor.y][farNeighbor.x];
              board[farNeighbor.y][farNeighbor.x] = FourStatePiece.EMPTY;
            }
          }
        }
        board[start.y][start.x] = board[neighbor.y][neighbor.x];
        board[neighbor.y][neighbor.x] = FourStatePiece.EMPTY;
      }
    }
    return moves;
  }
};

// games/dist/games/siam/SiamFailure.js
var SiamFailure = class {
  static NO_REMAINING_PIECE_TO_INSERT = () => $localize`You cannot insert a piece, all your pieces are already on the board.`;
  static NOT_ENOUGH_FORCE_TO_PUSH = () => $localize`You do not have enough strength to push.`;
  static MUST_MOVE_OR_ROTATE = () => $localize`You must move or rotate your piece.`;
  static ILLEGAL_PUSH = () => $localize`Your push is invalid: it is either not straight, is not pushing anything, or is leaving the board.`;
  static MUST_SELECT_VALID_DESTINATION = () => $localize`You must select a valid destination (highlighted on the board) for your piece`;
  static MUST_SELECT_ORIENTATION = () => $localize`You should select the orientation of your piece by clicking on one of the arrows.`;
};

// games/dist/games/siam/SiamMove.js
var SiamMove = class _SiamMove extends MoveCoord {
  direction;
  landingOrientation;
  static encoder = Encoder.tuple([
    Encoder.identity(),
    // x
    Encoder.identity(),
    // y
    MGPOptional.getEncoder(Orthogonal.encoder),
    // direction
    Orthogonal.encoder
    // orientation
  ], (m) => [m.coord.x, m.coord.y, m.direction, m.landingOrientation], (fields) => _SiamMove.of(fields[0], fields[1], fields[2], fields[3]));
  constructor(x, y, direction, landingOrientation) {
    super(x, y);
    this.direction = direction;
    this.landingOrientation = landingOrientation;
  }
  static of(x, y, direction, landingOrientation) {
    return new _SiamMove(x, y, direction, landingOrientation);
  }
  isRotation() {
    return this.direction.isAbsent();
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.coord.equals(other.coord) === false)
      return false;
    if (this.direction.equals(other.direction) === false)
      return false;
    return this.landingOrientation === other.landingOrientation;
  }
  toString() {
    const moveDirection = this.direction.isAbsent() ? "-" : this.direction.get().toString();
    return "SiamMove(" + this.coord.x + ", " + this.coord.y + ", " + moveDirection + ", " + this.landingOrientation + ")";
  }
};

// games/dist/games/siam/SiamPiece.js
var SiamPiece = class _SiamPiece {
  value;
  owner;
  direction;
  static EMPTY = new _SiamPiece(0, PlayerOrNone.NONE, MGPOptional.empty());
  static LIGHT_UP = new _SiamPiece(1, PlayerOrNone.ONE, MGPOptional.of(Orthogonal.UP));
  static LIGHT_RIGHT = new _SiamPiece(2, PlayerOrNone.ONE, MGPOptional.of(Orthogonal.RIGHT));
  static LIGHT_DOWN = new _SiamPiece(3, PlayerOrNone.ONE, MGPOptional.of(Orthogonal.DOWN));
  static LIGHT_LEFT = new _SiamPiece(4, PlayerOrNone.ONE, MGPOptional.of(Orthogonal.LEFT));
  static DARK_UP = new _SiamPiece(5, PlayerOrNone.ZERO, MGPOptional.of(Orthogonal.UP));
  static DARK_RIGHT = new _SiamPiece(6, PlayerOrNone.ZERO, MGPOptional.of(Orthogonal.RIGHT));
  static DARK_DOWN = new _SiamPiece(7, PlayerOrNone.ZERO, MGPOptional.of(Orthogonal.DOWN));
  static DARK_LEFT = new _SiamPiece(8, PlayerOrNone.ZERO, MGPOptional.of(Orthogonal.LEFT));
  static MOUNTAIN = new _SiamPiece(9, PlayerOrNone.NONE, MGPOptional.empty());
  static decode(value) {
    switch (value) {
      case 0:
        return _SiamPiece.EMPTY;
      case 1:
        return _SiamPiece.LIGHT_UP;
      case 2:
        return _SiamPiece.LIGHT_RIGHT;
      case 3:
        return _SiamPiece.LIGHT_DOWN;
      case 4:
        return _SiamPiece.LIGHT_LEFT;
      case 5:
        return _SiamPiece.DARK_UP;
      case 6:
        return _SiamPiece.DARK_RIGHT;
      case 7:
        return _SiamPiece.DARK_DOWN;
      case 8:
        return _SiamPiece.DARK_LEFT;
      case 9:
        return _SiamPiece.MOUNTAIN;
    }
  }
  static of(orientation, player) {
    if (player === Player.ZERO) {
      if (orientation === Orthogonal.UP)
        return _SiamPiece.DARK_UP;
      if (orientation === Orthogonal.RIGHT)
        return _SiamPiece.DARK_RIGHT;
      if (orientation === Orthogonal.DOWN)
        return _SiamPiece.DARK_DOWN;
      return _SiamPiece.DARK_LEFT;
    } else {
      if (orientation === Orthogonal.UP)
        return _SiamPiece.LIGHT_UP;
      if (orientation === Orthogonal.RIGHT)
        return _SiamPiece.LIGHT_RIGHT;
      if (orientation === Orthogonal.DOWN)
        return _SiamPiece.LIGHT_DOWN;
      return _SiamPiece.LIGHT_LEFT;
    }
  }
  constructor(value, owner, direction) {
    this.value = value;
    this.owner = owner;
    this.direction = direction;
  }
  belongsTo(player) {
    return this.owner.equals(player);
  }
  isEmptyOrMountain() {
    return this.owner.isNone();
  }
  isPlayer() {
    return this.isEmptyOrMountain() === false;
  }
  getOwner() {
    return this.owner;
  }
  getOptionalDirection() {
    return this.direction;
  }
  getDirection() {
    return this.getOptionalDirection().get();
  }
  equals(other) {
    return this === other;
  }
  toString() {
    switch (this) {
      case _SiamPiece.EMPTY:
        return "EMPTY";
      case _SiamPiece.LIGHT_UP:
        return "LIGHT_UP";
      case _SiamPiece.LIGHT_RIGHT:
        return "LIGHT_RIGHT";
      case _SiamPiece.LIGHT_DOWN:
        return "LIGHT_DOWN";
      case _SiamPiece.LIGHT_LEFT:
        return "LIGHT_LEFT";
      case _SiamPiece.DARK_UP:
        return "DARK_UP";
      case _SiamPiece.DARK_RIGHT:
        return "DARK_RIGHT";
      case _SiamPiece.DARK_DOWN:
        return "DARK_DOWN";
      case _SiamPiece.DARK_LEFT:
        return "DARK_LEFT";
      default:
        Utils.expectToBe(this, _SiamPiece.MOUNTAIN);
        return "MOUNTAIN";
    }
  }
};

// games/dist/games/siam/SiamState.js
var SiamState = class extends GameStateWithTable {
  countCurrentPlayerPawn() {
    const currentPlayer = this.getCurrentPlayer();
    return this.countPlayersPawn().get(currentPlayer);
  }
  countPlayersPawn() {
    const counts = PlayerNumberMap.of(0, 0);
    for (const coordAndContent of this.getCoordsAndContents()) {
      if (coordAndContent.content.getOwner().isPlayer()) {
        counts.add(coordAndContent.content.getOwner(), 1);
      }
    }
    return counts;
  }
};

// games/dist/games/siam/SiamRules.js
var __decorate12 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SiamRules_1;
var SiamLegalityInformation = class {
  resultingBoard;
  moved;
  constructor(resultingBoard, moved) {
    this.resultingBoard = resultingBoard;
    this.moved = moved;
  }
};
var SiamRules = class SiamRules2 extends ConfigurableRules {
  static {
    SiamRules_1 = this;
  }
  static singleton = MGPOptional.empty();
  static get() {
    if (SiamRules_1.singleton.isAbsent()) {
      SiamRules_1.singleton = MGPOptional.of(new SiamRules_1());
    }
    return SiamRules_1.singleton.get();
  }
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Siam`,
    config: {
      // minimum 3 so that there are spaces around the mountain
      width: new NumberConfig(5, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(3, 99)),
      height: new NumberConfig(5, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(3, 99)),
      numberOfPiece: new NumberConfig(5, () => $localize`Number of piece by player`, MGPValidators.range(1, 99)),
      // -1 on two ends because there will always be the first mountain
      numberOfBonusMountain: new NumberConfig(2, () => $localize`Number of bonus mountains`, MGPValidators.range(0, 98))
    }
  });
  getRulesConfigDescription() {
    return SiamRules_1.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const board = TableUtils.create(config.width, config.height, SiamPiece.EMPTY);
    const cy = Math.floor(config.height / 2);
    const cx = Math.floor(config.width / 2);
    board[cy][cx] = SiamPiece.MOUNTAIN;
    config.numberOfBonusMountain = Math.min(config.numberOfBonusMountain, config.width - 1);
    let numberOfBonusMountainDropped = 0;
    while (numberOfBonusMountainDropped < config.numberOfBonusMountain) {
      const mountainExcentricity = Math.ceil((numberOfBonusMountainDropped + 1) / 2);
      board[cy][cx + mountainExcentricity] = SiamPiece.MOUNTAIN;
      numberOfBonusMountainDropped++;
      if (numberOfBonusMountainDropped < config.numberOfBonusMountain) {
        board[cy][cx - mountainExcentricity] = SiamPiece.MOUNTAIN;
        numberOfBonusMountainDropped++;
      }
    }
    return new SiamState(board, 0);
  }
  getMoveValidity(move, state) {
    const startedOutside = state.isNotOnBoard(move.coord);
    if (move.isRotation()) {
      if (startedOutside) {
        return MGPFallible.failure($localize`You cannot rotate piece outside the board: ${move.toString()}`);
      }
    } else {
      const finishedOutside = state.isNotOnBoard(move.coord.getNext(move.direction.get()));
      if (finishedOutside) {
        if (startedOutside) {
          return MGPFallible.failure($localize`SiamMove should end or start on the board: ${move.toString()}`);
        }
        if (move.direction.get() !== move.landingOrientation) {
          return MGPFallible.failure($localize`SiamMove should have moveDirection and landingOrientation matching when a piece goes out of the board: ${move.toString()}`);
        }
      }
    }
    return MGPValidation.SUCCESS;
  }
  isInsertion(move, state) {
    return move.coord.x === -1 || move.coord.x === state.getWidth() || move.coord.y === -1 || move.coord.y === state.getHeight();
  }
  isLegal(move, state, config) {
    const moveValidity = this.getMoveValidity(move, state);
    if (moveValidity.isFailure()) {
      return moveValidity.toOtherFallible();
    }
    if (this.isInsertion(move, state) === false) {
      const movedPiece = state.getPieceAt(move.coord);
      if (movedPiece === SiamPiece.EMPTY) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
      } else if (movedPiece.belongsTo(state.getCurrentOpponent())) {
        return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
      }
    }
    if (move.isRotation()) {
      return this.isLegalRotation(move, state);
    } else {
      let movingPiece;
      if (this.isInsertion(move, state)) {
        const insertionInfo = this.isLegalInsertion(move.coord, state, config);
        if (insertionInfo.legal.isFailure()) {
          return MGPFallible.failure(insertionInfo.legal.getReason());
        }
        movingPiece = insertionInfo.insertedPiece;
      } else {
        movingPiece = state.getPieceAt(move.coord);
      }
      return this.isLegalForwarding(move, state, movingPiece);
    }
  }
  isLegalInsertion(coord, state, config) {
    const numberOnBoard = state.countCurrentPlayerPawn();
    const currentPlayer = state.getCurrentPlayer();
    const legal = numberOnBoard < config.numberOfPiece ? MGPValidation.SUCCESS : MGPValidation.failure(SiamFailure.NO_REMAINING_PIECE_TO_INSERT());
    const insertedPiece = this.getInsertedPiece(coord, currentPlayer, state.getWidth());
    return { insertedPiece, legal };
  }
  getInsertedPiece(entrance, player, width) {
    if (entrance.x === -1)
      return SiamPiece.of(Orthogonal.RIGHT, player);
    if (entrance.y === -1)
      return SiamPiece.of(Orthogonal.DOWN, player);
    if (entrance.x === width)
      return SiamPiece.of(Orthogonal.LEFT, player);
    return SiamPiece.of(Orthogonal.UP, player);
  }
  isLegalForwarding(move, state, firstPiece) {
    Utils.assert(firstPiece !== SiamPiece.MOUNTAIN && firstPiece !== SiamPiece.EMPTY, "forwarding must be done with player piece");
    const movedPieces = [];
    let movingPiece = SiamPiece.of(move.landingOrientation, state.getCurrentPlayer());
    const pushingDir = move.direction.get();
    let landingCoord = move.coord.getNext(pushingDir);
    if (state.hasInequalPieceAt(landingCoord, SiamPiece.EMPTY) && this.isStraight(firstPiece, move) === false) {
      return MGPFallible.failure(SiamFailure.ILLEGAL_PUSH());
    }
    let currentDirection = MGPOptional.of(pushingDir);
    const resistingDir = pushingDir.getOpposite();
    let totalForce = 0;
    const resultingBoard = state.getCopiedBoard();
    if (state.isOnBoard(move.coord)) {
      resultingBoard[move.coord.y][move.coord.x] = SiamPiece.EMPTY;
      movedPieces.push(move.coord);
    }
    let pushingPossible = state.isOnBoard(landingCoord) && movingPiece !== SiamPiece.EMPTY;
    while (pushingPossible) {
      if (currentDirection.equalsValue(pushingDir))
        totalForce++;
      else if (currentDirection.equalsValue(resistingDir))
        totalForce--;
      const tmpPiece = resultingBoard[landingCoord.y][landingCoord.x];
      if (tmpPiece === SiamPiece.MOUNTAIN)
        totalForce -= 0.9;
      resultingBoard[landingCoord.y][landingCoord.x] = movingPiece;
      movedPieces.push(landingCoord);
      movingPiece = tmpPiece;
      landingCoord = landingCoord.getNext(pushingDir);
      currentDirection = movingPiece.getOptionalDirection();
      pushingPossible = state.isOnBoard(landingCoord) && movingPiece !== SiamPiece.EMPTY && totalForce > 0;
    }
    if (state.isNotOnBoard(landingCoord)) {
      if (currentDirection.equalsValue(pushingDir))
        totalForce++;
      else if (currentDirection.equalsValue(resistingDir))
        totalForce--;
    }
    if (totalForce <= 0) {
      return MGPFallible.failure(SiamFailure.NOT_ENOUGH_FORCE_TO_PUSH());
    }
    return MGPFallible.success(new SiamLegalityInformation(resultingBoard, movedPieces));
  }
  isStraight(piece, move) {
    const pieceDirection = piece.getDirection();
    return move.direction.equalsValue(pieceDirection) && pieceDirection === move.landingOrientation;
  }
  isLegalRotation(rotation, state) {
    const coord = rotation.coord;
    const currentPiece = state.getPieceAt(coord);
    const currentPlayer = state.getCurrentPlayer();
    if (currentPiece.getDirection() === rotation.landingOrientation) {
      return MGPFallible.failure(SiamFailure.MUST_MOVE_OR_ROTATE());
    }
    const resultingBoard = state.getCopiedBoard();
    resultingBoard[coord.y][coord.x] = SiamPiece.of(rotation.landingOrientation, currentPlayer);
    return MGPFallible.success(new SiamLegalityInformation(resultingBoard, [coord]));
  }
  applyLegalMove(_move, state, _config, info) {
    const newBoard = TableUtils.copy(info.resultingBoard);
    const newTurn = state.turn + 1;
    const resultingState = new SiamState(newBoard, newTurn);
    return resultingState;
  }
  getScoreFromShortestDistances(zeroShortestDistance, oneShortestDistance, currentPlayer) {
    if (zeroShortestDistance === Number.POSITIVE_INFINITY)
      zeroShortestDistance = 6;
    if (oneShortestDistance === Number.POSITIVE_INFINITY)
      oneShortestDistance = 6;
    const zeroScore = 6 - zeroShortestDistance;
    const oneScore = 6 - oneShortestDistance;
    if (zeroScore === oneScore) {
      return currentPlayer.getScoreModifier();
    } else if (zeroScore > oneScore) {
      return -10 * (zeroScore + 1) + (oneScore + 1);
    } else {
      return 10 * (oneScore + 1) - (zeroScore + 1);
    }
  }
  getMountainsRowsAndColumns(state) {
    const rows = [];
    const columns = [];
    let nbMountain = 0;
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content === SiamPiece.MOUNTAIN) {
        if (rows.includes(coordAndContent.coord.y) === false) {
          rows.push(coordAndContent.coord.y);
        }
        if (columns.includes(coordAndContent.coord.x) === false) {
          columns.push(coordAndContent.coord.x);
        }
        nbMountain++;
      }
    }
    return { rows, columns, nbMountain };
  }
  getWinner(state, move, nbMountain, config) {
    if (nbMountain === config.numberOfBonusMountain) {
      return this.getPusher(state, move.get());
    } else {
      return PlayerOrNone.NONE;
    }
  }
  getPusher(state, finishingMove) {
    const moveStarterCoord = finishingMove.coord;
    let moveStarterPiece;
    if (state.isOnBoard(moveStarterCoord)) {
      const moveStarterDir = finishingMove.landingOrientation;
      moveStarterPiece = state.getPieceAt(moveStarterCoord.getNext(moveStarterDir));
    } else {
      moveStarterPiece = this.getInsertedPiece(moveStarterCoord, state.getCurrentOpponent(), state.getWidth());
    }
    const pushingDirection = moveStarterPiece.getDirection();
    const pusherCoord = this.getPusherCoord(state, pushingDirection, moveStarterCoord);
    const winner = state.getPieceAt(pusherCoord).getOwner();
    Debug.display("SiamRules", "getPusher", moveStarterCoord.toString() + " belong to " + state.getCurrentOpponent().getValue() + ", " + pusherCoord.toString() + " belong to " + winner.getValue() + ", " + winner.getValue() + " win");
    return winner;
  }
  getPusherCoord(state, pushingDirection, pusher) {
    let pushed = pusher.getNext(pushingDirection);
    let lastCorrectPusher = pusher;
    while (state.isOnBoard(pushed)) {
      pusher = pushed;
      pushed = pushed.getNext(pushingDirection);
      const pushingPiece = state.getPieceAt(pusher);
      if (pushingPiece !== SiamPiece.MOUNTAIN && pushingPiece.getDirection() === pushingDirection) {
        lastCorrectPusher = pusher;
      }
    }
    return lastCorrectPusher;
  }
  getPushers(state, mountainsColumn, mountainsRow, config) {
    let pushers = [];
    const lineDirections = [];
    for (const x of mountainsColumn) {
      let direction = Orthogonal.DOWN;
      let fallingCoord = new Coord(x, config.height - 1);
      lineDirections.push({ direction, fallingCoord });
      direction = Orthogonal.UP;
      fallingCoord = new Coord(x, 0);
      lineDirections.push({ direction, fallingCoord });
    }
    for (const y of mountainsRow) {
      let direction = Orthogonal.LEFT;
      let fallingCoord = new Coord(0, y);
      lineDirections.push({ direction, fallingCoord });
      direction = Orthogonal.RIGHT;
      fallingCoord = new Coord(config.width - 1, y);
      lineDirections.push({ direction, fallingCoord });
    }
    for (const lineDirection of lineDirections) {
      const fallingCoord = lineDirection.fallingCoord;
      const direction = lineDirection.direction;
      pushers = this.addPotentialDirectionPusher(state, fallingCoord, direction, pushers, config);
    }
    return pushers;
  }
  addPotentialDirectionPusher(state, fallingCoord, direction, pushers, config) {
    const directionClosestPusher = this.getLineClosestPusher(state, fallingCoord, direction, config);
    if (directionClosestPusher.isAbsent()) {
      return pushers;
    }
    const pusher = directionClosestPusher.get();
    const distance = pusher.distance;
    const pusherCoord = pusher.coord;
    pushers.push({
      coord: pusherCoord,
      distance
      // : distance + malus
    });
    return pushers;
  }
  getInitialLineInfo(state, fallingCoord, direction) {
    return {
      resistance: direction.getOpposite(),
      previousPiece: state.getPieceAt(fallingCoord),
      closestPusher: {
        coord: fallingCoord,
        distance: 1
      },
      almostPusher: MGPOptional.empty(),
      pusherFound: false,
      mountainEncountered: false,
      missingForce: 0
    };
  }
  getLineClosestPusher(state, fallingCoord, direction, config) {
    let lineInfo = this.getInitialLineInfo(state, fallingCoord, direction);
    while (state.isOnBoard(lineInfo.closestPusher.coord) && lineInfo.pusherFound === false) {
      lineInfo = this.updateLineInfo(state, lineInfo, direction);
    }
    if (lineInfo.pusherFound === false && lineInfo.almostPusher.isPresent()) {
      lineInfo.closestPusher.distance++;
      lineInfo.missingForce -= 1;
      while (lineInfo.closestPusher.coord.equals(lineInfo.almostPusher.get()) === false) {
        lineInfo.closestPusher.coord = lineInfo.closestPusher.coord.getNext(direction);
        lineInfo.closestPusher.distance--;
      }
    }
    if (state.isNotOnBoard(lineInfo.closestPusher.coord)) {
      lineInfo.missingForce -= 1;
      if (state.countCurrentPlayerPawn() === config.numberOfPiece) {
        return MGPOptional.empty();
      }
    }
    if (lineInfo.missingForce > 0) {
      return MGPOptional.empty();
    }
    return MGPOptional.of(lineInfo.closestPusher);
  }
  updateLineInfo(state, lineInfo, direction) {
    const currentPiece = state.getPieceAt(lineInfo.closestPusher.coord);
    if (currentPiece.isEmptyOrMountain()) {
      if (currentPiece === SiamPiece.MOUNTAIN) {
        lineInfo.missingForce += 0.9;
        lineInfo.mountainEncountered = true;
      } else {
        lineInfo.closestPusher.distance++;
      }
    } else {
      const playerOrientation = currentPiece.getDirection();
      if (playerOrientation === direction) {
        if (lineInfo.mountainEncountered) {
          lineInfo.missingForce -= 1;
          if (lineInfo.missingForce <= 0) {
            lineInfo.pusherFound = true;
            lineInfo.closestPusher.coord = lineInfo.closestPusher.coord.getNext(direction);
          }
        }
      } else if (playerOrientation === lineInfo.resistance) {
        lineInfo.missingForce += 1;
        if (lineInfo.mountainEncountered === false) {
          lineInfo.closestPusher.distance++;
        }
      } else {
        if (lineInfo.mountainEncountered) {
          lineInfo.almostPusher = MGPOptional.of(lineInfo.closestPusher.coord);
          if (lineInfo.previousPiece !== SiamPiece.EMPTY) {
            lineInfo.closestPusher.distance++;
          }
        } else {
          lineInfo.closestPusher.distance++;
        }
      }
    }
    lineInfo.previousPiece = currentPiece;
    lineInfo.closestPusher.coord = lineInfo.closestPusher.coord.getPrevious(direction);
    return lineInfo;
  }
  getInsertions(state, config) {
    let moves = [];
    const maxX = config.width - 1;
    const maxY = config.height - 1;
    for (let x = 1; x < maxX; x++) {
      moves = moves.concat(this.getInsertionsAt(state, x, 0, config));
      moves = moves.concat(this.getInsertionsAt(state, x, maxY, config));
    }
    for (let y = 1; y < maxY; y++) {
      moves = moves.concat(this.getInsertionsAt(state, 0, y, config));
      moves = moves.concat(this.getInsertionsAt(state, maxX, y, config));
    }
    moves = moves.concat(this.getInsertionsAt(state, 0, 0, config));
    moves = moves.concat(this.getInsertionsAt(state, 0, maxY, config));
    moves = moves.concat(this.getInsertionsAt(state, maxX, 0, config));
    moves = moves.concat(this.getInsertionsAt(state, maxX, maxY, config));
    return moves;
  }
  getInsertionsAt(state, x, y, config) {
    const moves = [];
    for (const direction of Orthogonal.ORTHOGONALS) {
      const entrance = new Coord(x, y).getPrevious(direction);
      if (state.isNotOnBoard(entrance)) {
        for (const orientation of Orthogonal.ORTHOGONALS) {
          const move = SiamMove.of(entrance.x, entrance.y, MGPOptional.of(direction), orientation);
          Utils.assert(this.getMoveValidity(move, state).isSuccess(), "SiamRules.getInsertionsAt should only construct valid insertions");
          const legality = this.isLegal(move, state, config);
          if (legality.isSuccess()) {
            moves.push(move);
          }
        }
      }
    }
    return moves;
  }
  getMovesFrom(state, piece, x, y) {
    const coord = new Coord(x, y);
    let moves = this.getRotationMovesAt(coord, piece);
    for (const direction of Orthogonal.ORTHOGONALS) {
      const landingCoord = coord.getNext(direction);
      moves = moves.concat(this.getForwardMovesBetween(state, coord, landingCoord));
    }
    return moves;
  }
  getMovesBetween(state, piece, start, end) {
    if (start.equals(end)) {
      return this.getRotationMovesAt(start, piece);
    } else {
      const directionOpt = Orthogonal.factory.fromMove(start, end);
      if (directionOpt.isSuccess() && start.getLinearDistanceToward(end) === 1) {
        return this.getForwardMovesBetween(state, start, end);
      } else {
        return [];
      }
    }
  }
  getRotationMovesAt(coord, piece) {
    const moves = [];
    const currentOrientation = piece.getDirection();
    for (const direction of Orthogonal.ORTHOGONALS) {
      if (direction !== currentOrientation) {
        const newMove = SiamMove.of(coord.x, coord.y, MGPOptional.empty(), direction);
        moves.push(newMove);
      }
    }
    return moves;
  }
  getForwardMovesBetween(state, start, end) {
    const moves = [];
    let orientations;
    const direction = Orthogonal.factory.fromMove(start, end).get();
    const piece = state.getPieceAt(start);
    if (state.isOnBoard(end)) {
      orientations = Orthogonal.ORTHOGONALS;
    } else {
      orientations = [direction];
    }
    for (const orientation of orientations) {
      const move = SiamMove.of(start.x, start.y, MGPOptional.of(direction), orientation);
      const legality = this.isLegalForwarding(move, state, piece);
      if (legality.isSuccess()) {
        moves.push(move);
      }
    }
    return moves;
  }
  getGameStatus(node, config) {
    const mountainsInfo = this.getMountainsRowsAndColumns(node.gameState);
    const winner = this.getWinner(node.gameState, node.previousMove, mountainsInfo.nbMountain, config);
    if (winner.isPlayer()) {
      return GameStatus.getVictory(winner);
    } else {
      return GameStatus.ONGOING;
    }
  }
};
SiamRules = SiamRules_1 = __decorate12([
  Debug.log
], SiamRules);

// games/dist/games/siam/SiamHeuristic.js
var SiamHeuristic = class extends Heuristic {
  getBoardValue(node, config) {
    const boardValueInfo = this.getBoardValueInfo(node.gameState, config);
    return BoardValue.of(boardValueInfo.boardValue);
  }
  getBoardValueInfo(state, config) {
    const mountainsInfo = SiamRules.get().getMountainsRowsAndColumns(state);
    const mountainsRow = mountainsInfo.rows;
    const mountainsColumn = mountainsInfo.columns;
    const pushers = SiamRules.get().getPushers(state, mountainsColumn, mountainsRow, config);
    let zeroShortestDistance = Number.POSITIVE_INFINITY;
    let oneShortestDistance = Number.POSITIVE_INFINITY;
    const currentPlayer = state.getCurrentPlayer();
    for (const pusher of pushers) {
      if (state.isOnBoard(pusher.coord)) {
        const piece = state.getPieceAt(pusher.coord);
        if (piece.belongsTo(Player.ZERO)) {
          zeroShortestDistance = Math.min(zeroShortestDistance, pusher.distance);
        } else {
          oneShortestDistance = Math.min(oneShortestDistance, pusher.distance);
        }
      } else {
        if (currentPlayer === Player.ZERO) {
          zeroShortestDistance = Math.min(zeroShortestDistance, pusher.distance);
        } else {
          oneShortestDistance = Math.min(oneShortestDistance, pusher.distance);
        }
      }
    }
    const boardValue = SiamRules.get().getScoreFromShortestDistances(zeroShortestDistance, oneShortestDistance, currentPlayer);
    return { shortestZero: zeroShortestDistance, shortestOne: oneShortestDistance, boardValue };
  }
};

// games/dist/games/siam/SiamMoveGenerator.js
var SiamMoveGenerator = class extends MoveGenerator {
  getListMoves(node, config) {
    let moves = [];
    const currentPlayer = node.gameState.getCurrentPlayer();
    for (const coordAndContent of node.gameState.getCoordsAndContents()) {
      const piece = coordAndContent.content;
      if (piece.belongsTo(currentPlayer)) {
        moves = moves.concat(SiamRules.get().getMovesFrom(node.gameState, piece, coordAndContent.coord.x, coordAndContent.coord.y));
      }
    }
    if (node.gameState.countCurrentPlayerPawn() < config.numberOfPiece) {
      for (const insertion of SiamRules.get().getInsertions(node.gameState, config)) {
        if (insertion.direction.get().getOpposite() === insertion.landingOrientation) {
          continue;
        } else if (node.gameState.isEdge(insertion.coord) && insertion.direction.get() !== insertion.landingOrientation) {
          continue;
        } else {
          moves.push(insertion);
        }
      }
    }
    return moves;
  }
};

// games/dist/games/six/SixFailure.js
var SixFailure = class {
  static CANNOT_MOVE_YET = () => $localize`You cannot move yet. Pick a space where you will put a new piece.`;
  static MUST_CUT = () => $localize`Several groups are of the same size, you must pick the one to keep.`;
  static CANNOT_CHOOSE_TO_KEEP = () => $localize`You cannot choose which part to keep when one is smaller than the other.`;
  static CAN_NO_LONGER_DROP = () => $localize`You cannot put new pieces anymore. Pick a piece to move.`;
  static MUST_CAPTURE_BIGGEST_GROUPS = () => $localize`You must choose one of the biggest groups to keep it.`;
  static CANNOT_KEEP_EMPTY_COORD = () => $localize`You cannot pick an empty space. Pick one of the biggest groups.`;
  static MUST_DROP_NEXT_TO_OTHER_PIECE = () => $localize`You must put this piece next to another piece.`;
};

// games/dist/games/six/SixState.js
var SixState = class _SixState extends OpenHexagonalGameState {
  /**
    * @param board the representation of the board
    * @param turn the turn of the board
    * @param origin the coord of the board[0][0] space
    * (useful if the upper left coord is in (-5, -9) or (512, 129))
    * @returns the state created from that board
   */
  static ofRepresentation(board, turn, origin = new Vector(0, 0)) {
    const pieces = new ReversibleMap();
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        if (board[y][x] !== PlayerOrNone.NONE) {
          const adapted = new Coord(x, y).getNext(origin);
          pieces.set(adapted, board[y][x]);
        }
      }
    }
    return new _SixState(pieces, turn);
  }
  movePiece(move) {
    const pieces = this.pieces.getCopy();
    pieces.delete(move.start.get());
    pieces.set(move.landing, this.getCurrentPlayer());
    return new _SixState(pieces, this.turn);
  }
  toRepresentation() {
    const board = TableUtils.create(this.width, this.height, PlayerOrNone.NONE);
    for (const piece of this.pieces.getKeyList()) {
      const pieceValue = this.getPieceAt(piece);
      board[piece.y][piece.x] = pieceValue;
    }
    return board;
  }
  isIllegalLandingZone(landing, start) {
    if (this.pieces.containsKey(landing)) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    if (this.isCoordConnected(landing, start)) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(SixFailure.MUST_DROP_NEXT_TO_OTHER_PIECE());
    }
  }
  isCoordConnected(coord, except) {
    for (const neighbor of HexagonalUtils.getNeighbors(coord)) {
      if (this.pieces.containsKey(neighbor) && except.equalsValue(neighbor) === false) {
        return true;
      }
    }
    return false;
  }
  getPieceAt(coord) {
    if (this.isOnBoard(coord)) {
      return this.pieces.get(coord).get();
    } else {
      return PlayerOrNone.NONE;
    }
  }
  applyLegalDrop(coord) {
    const pieces = this.pieces.getCopy();
    pieces.put(coord, this.getCurrentPlayer());
    return new _SixState(pieces, this.turn + 1);
  }
  applyLegalTranslation(move, kept) {
    const stateAfterMove = this.movePiece(move);
    if (kept.size() > 0) {
      const newPieces = new ReversibleMap();
      for (const coord of kept) {
        newPieces.set(coord, stateAfterMove.getPieceAt(coord));
      }
      return new _SixState(newPieces, this.turn + 1);
    } else {
      return new _SixState(stateAfterMove.pieces, this.turn + 1);
    }
  }
  countPiecesOnBoard() {
    const pieces = this.pieces.reverse();
    const zeroPieces = pieces.get(Player.ZERO).getOrElse(new CoordSet());
    const onePieces = pieces.get(Player.ONE).getOrElse(new CoordSet());
    return PlayerNumberMap.of(zeroPieces.size(), onePieces.size());
  }
  countPiecesToDrop(config) {
    const total = config.piecesPerPlayer + 1;
    const piecesOnBoard = this.countPiecesOnBoard();
    return PlayerNumberMap.of(total - piecesOnBoard.get(Player.ZERO), total - piecesOnBoard.get(Player.ONE));
  }
  switchPiece(coord) {
    const newPieces = this.pieces.getCopy();
    const oldPiece = this.getPieceAt(coord);
    Utils.assert(oldPiece.isPlayer(), "Cannot switch piece if there is no piece!", { coord: coord.toString() });
    newPieces.replace(coord, oldPiece.getOpponent());
    return new _SixState(newPieces, this.turn);
  }
  equals(other) {
    return this.turn === other.turn && this.pieces.equals(other.pieces);
  }
};

// games/dist/games/six/SixRules.js
var __decorate13 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SixRules_1;
var SixRules = class SixRules2 extends ConfigurableRules {
  static {
    SixRules_1 = this;
  }
  static singleton = MGPOptional.empty();
  currentVictorySource;
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Six`,
    config: {
      piecesPerPlayer: new NumberConfig(20, () => $localize`Number of pieces to drop per player`, MGPValidators.range(5, 99))
    }
  });
  static get() {
    if (SixRules_1.singleton.isAbsent()) {
      SixRules_1.singleton = MGPOptional.of(new SixRules_1());
    }
    return SixRules_1.singleton.get();
  }
  getRulesConfigDescription() {
    return SixRules_1.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState() {
    const board = [[Player.ZERO], [Player.ONE]];
    return SixState.ofRepresentation(board, 0);
  }
  isInDropPhase(state, config) {
    const totalDroppablePieces = 2 * config.piecesPerPlayer;
    return state.turn < totalDroppablePieces;
  }
  applyLegalMove(move, state, config, kept) {
    if (this.isInDropPhase(state, config)) {
      return state.applyLegalDrop(move.landing);
    } else {
      return state.applyLegalTranslation(move, kept);
    }
  }
  isLegal(move, state, config) {
    const landingLegality = state.isIllegalLandingZone(move.landing, move.start);
    if (landingLegality.isFailure()) {
      return landingLegality.toOtherFallible();
    }
    if (this.isInDropPhase(state, config)) {
      return this.isLegalDrop(move, state);
    } else {
      return this.isLegalPhaseTwoMove(move, state);
    }
  }
  getLegalLandings(state) {
    let neighbors = new CoordSet();
    for (const piece of state.getPieceCoords()) {
      for (const dir of HexaDirection.factory.all) {
        const neighbor = piece.getNext(dir, 1);
        if (state.getPieceAt(neighbor).isNone()) {
          neighbors = neighbors.addElement(neighbor);
        }
      }
    }
    return neighbors.toList();
  }
  isLegalDrop(move, state) {
    if (move.isDrop() === false) {
      return MGPFallible.failure(SixFailure.CANNOT_MOVE_YET());
    }
    return MGPFallible.success(new CoordSet(state.getPieceCoords()));
  }
  isLegalPhaseTwoMove(move, state) {
    if (move.isDrop()) {
      return MGPFallible.failure(SixFailure.CAN_NO_LONGER_DROP());
    }
    const pieceOwner = state.getPieceAt(move.start.get());
    if (pieceOwner.isNone()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    } else if (pieceOwner === state.getCurrentOpponent()) {
      return MGPFallible.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    const stateAfterMove = state.movePiece(move);
    const groupsAfterMove = stateAfterMove.getGroups();
    if (this.isSplit(groupsAfterMove)) {
      const biggerGroups = this.getLargestGroups(groupsAfterMove);
      if (biggerGroups.size() === 1) {
        if (move.keep.isPresent()) {
          return MGPFallible.failure(SixFailure.CANNOT_CHOOSE_TO_KEEP());
        } else {
          return MGPFallible.success(biggerGroups.getAnyElement().get());
        }
      } else {
        return this.moveKeepBiggerGroup(move.keep, biggerGroups, stateAfterMove);
      }
    } else {
      return MGPFallible.success(new CoordSet());
    }
  }
  isSplit(groups) {
    return groups.size() > 1;
  }
  getLargestGroups(groups) {
    let biggerSize = 0;
    let biggerGroups = new Set2();
    for (const group of groups) {
      const groupSize = group.size();
      if (groupSize > biggerSize) {
        biggerSize = groupSize;
        biggerGroups = new Set2([group]);
      } else if (groupSize === biggerSize) {
        biggerGroups = biggerGroups.addElement(group);
      }
    }
    return biggerGroups;
  }
  moveKeepBiggerGroup(keep, biggerGroups, state) {
    if (keep.isAbsent()) {
      return MGPFallible.failure(SixFailure.MUST_CUT());
    }
    if (state.getPieces().get(keep.get()).isAbsent()) {
      return MGPFallible.failure(SixFailure.CANNOT_KEEP_EMPTY_COORD());
    }
    const keptCoord = keep.get();
    for (const subGroup of biggerGroups) {
      if (subGroup.contains(keptCoord)) {
        return MGPFallible.success(subGroup);
      }
    }
    return MGPFallible.failure(SixFailure.MUST_CAPTURE_BIGGEST_GROUPS());
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const previousPlayer = state.getPreviousPlayer();
    if (node.previousMove.isPresent()) {
      const shapeVictory = this.getShapeVictory(node.previousMove.get(), state);
      if (shapeVictory.length === 6) {
        return GameStatus.getVictory(previousPlayer);
      }
    }
    if (this.isInDropPhase(state, config)) {
      return GameStatus.ONGOING;
    } else {
      const pieces = state.countPiecesOnBoard();
      const zeroPieces = pieces.get(Player.ZERO);
      const onePieces = pieces.get(Player.ONE);
      if (zeroPieces < 6 && onePieces < 6) {
        if (zeroPieces < onePieces) {
          return GameStatus.ONE_WON;
        } else if (onePieces < zeroPieces) {
          return GameStatus.ZERO_WON;
        } else {
          return GameStatus.DRAW;
        }
      } else if (zeroPieces < 6) {
        return GameStatus.getDefeat(Player.ZERO);
      } else if (onePieces < 6) {
        return GameStatus.getDefeat(Player.ONE);
      } else {
        return GameStatus.ONGOING;
      }
    }
  }
  startSearchingVictorySources() {
    this.currentVictorySource = {
      typeSource: "LINE",
      index: -1
    };
  }
  getShapeVictory(lastMove, state) {
    this.startSearchingVictorySources();
    while (this.hasNextVictorySource()) {
      this.getNextVictorySource();
      const shapeVictory = this.searchVictoryOnly(this.currentVictorySource, lastMove, state);
      if (shapeVictory.length === 6) {
        return shapeVictory;
      }
    }
    return [];
  }
  hasNextVictorySource() {
    return this.currentVictorySource.typeSource !== "CIRCLE" || this.currentVictorySource.index !== 5;
  }
  getNextVictorySource() {
    const source = this.currentVictorySource;
    if (source.index === 5) {
      let newType;
      switch (this.currentVictorySource.typeSource) {
        case "LINE":
          newType = "TRIANGLE_CORNER";
          break;
        case "TRIANGLE_CORNER":
          newType = "TRIANGLE_EDGE";
          break;
        default:
          newType = "CIRCLE";
          break;
      }
      this.currentVictorySource = {
        typeSource: newType,
        index: 0
      };
    } else {
      let increment = 1;
      if (this.currentVictorySource.typeSource === "LINE") {
        increment = 2;
      }
      this.currentVictorySource = {
        typeSource: this.currentVictorySource.typeSource,
        index: this.currentVictorySource.index + increment
      };
    }
    return this.currentVictorySource;
  }
  searchVictoryOnly(victorySource, move, state) {
    const lastDrop = move.landing;
    switch (victorySource.typeSource) {
      case "LINE":
        return this.searchVictoryOnlyForLine(victorySource.index, lastDrop, state);
      case "CIRCLE":
        return this.searchVictoryOnlyForCircle(victorySource.index, lastDrop, state);
      case "TRIANGLE_CORNER":
        return this.searchVictoryOnlyForTriangleCorner(victorySource.index, lastDrop, state);
      default:
        return this.searchVictoryOnlyForTriangleEdge(victorySource.index, lastDrop, state);
    }
  }
  searchVictoryOnlyForCircle(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    const initialDirection = HexaDirection.factory.all[index];
    const victory = [lastDrop];
    let testCoord = lastDrop.getNext(initialDirection, 1);
    while (victory.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece !== previousPlayer) {
        return [];
      }
      const dirIndex = (index + victory.length) % 6;
      victory.push(testCoord);
      const dir = HexaDirection.factory.all[dirIndex];
      testCoord = testCoord.getNext(dir, 1);
    }
    return victory;
  }
  searchVictoryOnlyForLine(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    let dir = HexaDirection.factory.all[index];
    let testCoord = lastDrop.getNext(dir, 1);
    const victory = [lastDrop];
    let twoDirectionCovered = false;
    while (victory.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece === previousPlayer) {
        victory.push(testCoord);
      } else {
        if (twoDirectionCovered) {
          return [];
        } else {
          twoDirectionCovered = true;
          dir = dir.getOpposite();
          testCoord = testCoord.getNext(dir, victory.length);
        }
      }
      testCoord = testCoord.getNext(dir, 1);
    }
    return victory;
  }
  searchVictoryOnlyForTriangleCorner(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    let edgeDirection = HexaDirection.factory.all[index];
    const victory = [lastDrop];
    let testCoord = lastDrop.getNext(edgeDirection, 1);
    while (victory.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece !== previousPlayer) {
        return [];
      }
      if (victory.length % 2 === 0) {
        const dirIndex = (index + victory.length) % 6;
        edgeDirection = HexaDirection.factory.all[dirIndex];
      }
      victory.push(testCoord);
      testCoord = testCoord.getNext(edgeDirection, 1);
    }
    return victory;
  }
  searchVictoryOnlyForTriangleEdge(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    let edgeDirection = HexaDirection.factory.all[index];
    const victory = [lastDrop];
    let testCoord = lastDrop.getNext(edgeDirection, 1);
    while (victory.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece !== previousPlayer) {
        return [];
      }
      victory.push(testCoord);
      if (victory.length % 2 === 0) {
        const dirIndex = (index + victory.length) % 6;
        edgeDirection = HexaDirection.factory.all[dirIndex];
      }
      testCoord = testCoord.getNext(edgeDirection, 1);
    }
    return victory;
  }
};
SixRules = SixRules_1 = __decorate13([
  Debug.log
], SixRules);

// games/dist/games/six/SixHeuristic.js
var SixHeuristic = class extends AlignmentHeuristic {
  VERBOSE = false;
  currentVictorySource;
  getBoardValue(node, config) {
    const move = node.previousMove;
    const state = node.gameState;
    const previousPlayer = state.getPreviousPlayer();
    const victoryValue = BoardValue.getVictoryValueOf(previousPlayer);
    let shapeInfo = {
      status: AlignmentStatus.NOTHING,
      victory: MGPOptional.empty(),
      preVictory: MGPOptional.empty(),
      sum: 0
    };
    if (move.isPresent()) {
      shapeInfo = this.calculateBoardValue(move.get(), state);
    }
    if (shapeInfo.status === AlignmentStatus.VICTORY) {
      return BoardValue.of(victoryValue);
    }
    if (SixRules.get().isInDropPhase(state, config) === false) {
      const pieces = state.countPiecesOnBoard();
      return BoardValue.ofPlayerNumberMap(pieces);
    }
    if (shapeInfo.status === AlignmentStatus.PRE_VICTORY) {
      return BoardValue.of(BoardValue.getPreVictoryValueOf(previousPlayer));
    }
    return BoardValue.of(shapeInfo.sum * previousPlayer.getScoreModifier());
  }
  startSearchingVictorySources() {
    this.currentVictorySource = {
      typeSource: "LINE",
      index: -1
    };
  }
  hasNextVictorySource() {
    return this.currentVictorySource.typeSource !== "CIRCLE" || this.currentVictorySource.index !== 5;
  }
  getNextVictorySource() {
    const source = this.currentVictorySource;
    if (source.index === 5) {
      let newType;
      switch (this.currentVictorySource.typeSource) {
        case "LINE":
          newType = "TRIANGLE_CORNER";
          break;
        case "TRIANGLE_CORNER":
          newType = "TRIANGLE_EDGE";
          break;
        default:
          newType = "CIRCLE";
          break;
      }
      this.currentVictorySource = {
        typeSource: newType,
        index: 0
      };
    } else {
      let increment = 1;
      if (this.currentVictorySource.typeSource === "LINE") {
        increment = 2;
      }
      this.currentVictorySource = {
        typeSource: this.currentVictorySource.typeSource,
        index: this.currentVictorySource.index + increment
      };
    }
    return this.currentVictorySource;
  }
  searchVictoryOnly(victorySource, move, state) {
    const lastDrop = move.landing;
    switch (victorySource.typeSource) {
      case "LINE":
        return this.searchVictoryOnlyForLine(victorySource.index, lastDrop, state);
      case "CIRCLE":
        return this.searchVictoryOnlyForCircle(victorySource.index, lastDrop, state);
      case "TRIANGLE_CORNER":
        return this.searchVictoryOnlyForTriangleCorner(victorySource.index, lastDrop, state);
      default:
        return this.searchVictoryOnlyForTriangleEdge(victorySource.index, lastDrop, state);
    }
  }
  searchVictoryOnlyForCircle(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    const initialDirection = HexaDirection.factory.all[index];
    const testedCoords = [lastDrop];
    let testCoord = lastDrop.getNext(initialDirection, 1);
    while (testedCoords.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece !== previousPlayer) {
        return {
          status: AlignmentStatus.PRE_VICTORY,
          victory: MGPOptional.empty(),
          preVictory: MGPOptional.empty(),
          sum: 0
        };
      }
      const dirIndex = (index + testedCoords.length) % 6;
      testedCoords.push(testCoord);
      const dir = HexaDirection.factory.all[dirIndex];
      testCoord = testCoord.getNext(dir, 1);
    }
    return {
      status: AlignmentStatus.VICTORY,
      victory: MGPOptional.of(testedCoords),
      preVictory: MGPOptional.empty(),
      sum: 0
    };
  }
  searchVictoryOnlyForLine(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    let dir = HexaDirection.factory.all[index];
    let testCoord = lastDrop.getNext(dir, 1);
    const victory = [lastDrop];
    let twoDirectionCovered = false;
    while (victory.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece === previousPlayer) {
        victory.push(testCoord);
      } else {
        if (twoDirectionCovered) {
          return {
            status: AlignmentStatus.PRE_VICTORY,
            victory: MGPOptional.empty(),
            preVictory: MGPOptional.empty(),
            sum: 0
          };
        } else {
          twoDirectionCovered = true;
          dir = dir.getOpposite();
          testCoord = testCoord.getNext(dir, victory.length - 1);
        }
      }
      testCoord = testCoord.getNext(dir, 1);
    }
    return {
      status: AlignmentStatus.VICTORY,
      victory: MGPOptional.of(victory),
      preVictory: MGPOptional.empty(),
      sum: 0
    };
  }
  searchVictoryOnlyForTriangleCorner(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    let edgeDirection = HexaDirection.factory.all[index];
    const testedCoords = [lastDrop];
    let testCoord = lastDrop.getNext(edgeDirection, 1);
    while (testedCoords.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece !== previousPlayer) {
        return {
          status: AlignmentStatus.PRE_VICTORY,
          victory: MGPOptional.empty(),
          preVictory: MGPOptional.empty(),
          sum: 0
        };
      }
      if (testedCoords.length % 2 === 0) {
        const dirIndex = (index + testedCoords.length) % 6;
        edgeDirection = HexaDirection.factory.all[dirIndex];
      }
      testedCoords.push(testCoord);
      testCoord = testCoord.getNext(edgeDirection, 1);
    }
    return {
      status: AlignmentStatus.VICTORY,
      victory: MGPOptional.of(testedCoords),
      preVictory: MGPOptional.empty(),
      sum: 0
    };
  }
  searchVictoryOnlyForTriangleEdge(index, lastDrop, state) {
    const previousPlayer = state.getPreviousPlayer();
    let edgeDirection = HexaDirection.factory.all[index];
    const testedCoords = [lastDrop];
    let testCoord = lastDrop.getNext(edgeDirection, 1);
    while (testedCoords.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece !== previousPlayer) {
        return {
          status: AlignmentStatus.PRE_VICTORY,
          victory: MGPOptional.empty(),
          preVictory: MGPOptional.empty(),
          sum: 0
        };
      }
      testedCoords.push(testCoord);
      if (testedCoords.length % 2 === 0) {
        const dirIndex = (index + testedCoords.length) % 6;
        edgeDirection = HexaDirection.factory.all[dirIndex];
      }
      testCoord = testCoord.getNext(edgeDirection, 1);
    }
    return {
      status: AlignmentStatus.VICTORY,
      victory: MGPOptional.of(testedCoords),
      preVictory: MGPOptional.empty(),
      sum: 0
    };
  }
  getBoardInfo(victorySource, move, state, boardInfo) {
    const lastDrop = move.landing;
    switch (victorySource.typeSource) {
      case "CIRCLE":
        return this.getBoardInfoForCircle(victorySource.index, lastDrop, state, boardInfo);
      case "LINE":
        return this.getBoardInfoForLine(victorySource.index, lastDrop, state, boardInfo);
      case "TRIANGLE_CORNER":
        return this.getBoardInfoForTriangleCorner(victorySource.index, lastDrop, state, boardInfo);
      default:
        return this.getBoardInfoForTriangleEdge(victorySource.index, lastDrop, state, boardInfo);
    }
  }
  getBoardInfoForCircle(index, lastDrop, state, boardInfo) {
    const previousOpponent = state.getPreviousOpponent();
    const initialDirection = HexaDirection.factory.all[index];
    const testedCoords = [lastDrop];
    let testCoord = lastDrop.getNext(initialDirection, 1);
    let subSum = 0;
    let lastEmpty = MGPOptional.empty();
    while (testedCoords.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece === previousOpponent) {
        return boardInfo;
      }
      const dirIndex = (index + testedCoords.length) % 6;
      testedCoords.push(testCoord);
      const dir = HexaDirection.factory.all[dirIndex];
      if (testedPiece.isNone()) {
        subSum += 0.16;
        lastEmpty = MGPOptional.of(testCoord);
      } else {
        subSum++;
      }
      testCoord = testCoord.getNext(dir, 1);
    }
    return this.getBoardInfoResult(subSum, lastEmpty, testedCoords, boardInfo);
  }
  getBoardInfoResult(subSum, lastEmpty, testedCoords, boardInfo) {
    let preVictory = boardInfo.preVictory;
    if (subSum === 4.16) {
      if (preVictory.isPresent() && preVictory.equals(lastEmpty) === false) {
        return {
          status: AlignmentStatus.PRE_VICTORY,
          victory: MGPOptional.empty(),
          preVictory: MGPOptional.empty(),
          sum: 0
        };
      } else {
        preVictory = lastEmpty;
      }
    } else if (subSum === 5) {
      return {
        status: AlignmentStatus.VICTORY,
        victory: MGPOptional.of(testedCoords),
        preVictory: MGPOptional.empty(),
        sum: 0
      };
    }
    return {
      status: boardInfo.status,
      victory: MGPOptional.empty(),
      preVictory,
      sum: boardInfo.sum + subSum
    };
  }
  getBoardInfoForLine(index, lastDrop, state, boardInfo) {
    const dir = HexaDirection.factory.all[index];
    let testedCoord = lastDrop.getPrevious(dir, 5);
    let testedCoords = [];
    let encountered = [];
    let lastEmpty = MGPOptional.empty();
    for (let i = 0; i < 6; i++) {
      const empty = this.updateEncounterAndReturnLastEmpty(state, testedCoord, encountered);
      if (empty.isPresent()) {
        lastEmpty = empty;
      }
      testedCoords.push(testedCoord);
      testedCoord = testedCoord.getNext(dir, 1);
    }
    let status = boardInfo.status;
    let preVictory = boardInfo.preVictory;
    let nbTested = 0;
    let finalSubSum = 0;
    while (nbTested < 6) {
      const subSum = encountered.reduce((a, b) => a + b);
      if (subSum === 5.16 && status === AlignmentStatus.NOTHING) {
        if (preVictory.isPresent()) {
          Utils.assert(preVictory.equals(lastEmpty) === false, "Impossible to have point aligned with different line to a same point");
          status = AlignmentStatus.PRE_VICTORY;
        } else {
          preVictory = lastEmpty;
        }
      }
      finalSubSum = Math.max(finalSubSum, subSum);
      testedCoords = testedCoords.slice(1, 6);
      testedCoords.push(testedCoord);
      encountered = encountered.slice(1, 6);
      const newEmpty = this.updateEncounterAndReturnLastEmpty(state, testedCoord, encountered);
      if (newEmpty.isPresent()) {
        lastEmpty = newEmpty;
      }
      nbTested++;
      testedCoord = testedCoord.getNext(dir, 1);
    }
    const newBoardInfo = {
      status,
      victory: MGPOptional.of(testedCoords),
      preVictory,
      sum: finalSubSum
    };
    return this.getBoardInfoResult(finalSubSum, lastEmpty, testedCoords, newBoardInfo);
  }
  updateEncounterAndReturnLastEmpty(state, testedCoord, encountered) {
    const previousOpponent = state.getPreviousOpponent();
    switch (state.getPieceAt(testedCoord)) {
      case previousOpponent:
        encountered.push(-7);
        return MGPOptional.empty();
      case PlayerOrNone.NONE:
        encountered.push(0.16);
        return MGPOptional.of(testedCoord);
      default:
        encountered.push(1);
        return MGPOptional.empty();
    }
  }
  getBoardInfoForTriangleCorner(index, lastDrop, state, boardInfo) {
    const previousOpponent = state.getPreviousOpponent();
    let edgeDirection = HexaDirection.factory.all[index];
    const testedCoords = [lastDrop];
    let testCoord = lastDrop.getNext(edgeDirection, 1);
    let subSum = 0;
    let lastEmpty = MGPOptional.empty();
    while (testedCoords.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece === previousOpponent) {
        return boardInfo;
      }
      if (testedPiece.isNone()) {
        subSum += 0.16;
        lastEmpty = MGPOptional.of(testCoord);
      } else {
        subSum++;
      }
      if (testedCoords.length % 2 === 0) {
        const dirIndex = (index + testedCoords.length) % 6;
        edgeDirection = HexaDirection.factory.all[dirIndex];
      }
      testedCoords.push(testCoord);
      testCoord = testCoord.getNext(edgeDirection, 1);
    }
    return this.getBoardInfoResult(subSum, lastEmpty, testedCoords, boardInfo);
  }
  getBoardInfoForTriangleEdge(index, lastDrop, state, boardInfo) {
    const previousOpponent = state.getPreviousOpponent();
    let edgeDirection = HexaDirection.factory.all[index];
    const testedCoords = [lastDrop];
    let testCoord = lastDrop.getNext(edgeDirection, 1);
    let subSum = 0;
    let lastEmpty = MGPOptional.empty();
    while (testedCoords.length < 6) {
      const testedPiece = state.getPieceAt(testCoord);
      if (testedPiece === previousOpponent) {
        return boardInfo;
      }
      if (testedPiece.isNone()) {
        subSum += 0.16;
        lastEmpty = MGPOptional.of(testCoord);
      } else {
        subSum++;
      }
      testedCoords.push(testCoord);
      if (testedCoords.length % 2 === 0) {
        const dirIndex = (index + testedCoords.length) % 6;
        edgeDirection = HexaDirection.factory.all[dirIndex];
      }
      testCoord = testCoord.getNext(edgeDirection, 1);
    }
    return this.getBoardInfoResult(subSum, lastEmpty, testedCoords, boardInfo);
  }
};

// games/dist/games/six/SixMove.js
var SixMove = class _SixMove extends Move {
  start;
  landing;
  keep;
  static encoder = Encoder.tuple([MGPOptional.getEncoder(Coord.encoder), Coord.encoder, MGPOptional.getEncoder(Coord.encoder)], (move) => [move.start, move.landing, move.keep], (fields) => _SixMove.of(fields[0], fields[1], fields[2]));
  static of(start, landing, keep) {
    return new _SixMove(start, landing, keep);
  }
  static ofDrop(landing) {
    return new _SixMove(MGPOptional.empty(), landing, MGPOptional.empty());
  }
  static ofTranslation(start, landing) {
    return new _SixMove(MGPOptional.of(start), landing, MGPOptional.empty());
  }
  static ofCut(start, landing, keep) {
    return new _SixMove(MGPOptional.of(start), landing, MGPOptional.of(keep));
  }
  constructor(start, landing, keep) {
    super();
    this.start = start;
    this.landing = landing;
    this.keep = keep;
    Utils.assert(start.equalsValue(landing) === false, "Translation cannot be static!");
    Utils.assert(start.isAbsent() || start.equals(keep) === false, "Cannot keep starting coord, since it will always be empty after move!");
  }
  isDrop() {
    return this.start.isAbsent();
  }
  isCut() {
    return this.keep.isPresent();
  }
  toString() {
    if (this.isDrop()) {
      return "SixMove(" + this.landing.toString() + ")";
    } else if (this.isCut()) {
      return "SixMove(" + this.start.get().toString() + " > " + this.landing + ", keep: " + this.keep.get().toString() + ")";
    } else {
      return "SixMove(" + this.start.get().toString() + " > " + this.landing + ")";
    }
  }
  equals(other) {
    if (this.landing.equals(other.landing) === false) {
      return false;
    }
    if (this.start.equals(other.start) === false) {
      return false;
    }
    return this.keep.equals(other.keep);
  }
};

// games/dist/games/six/SixMoveGenerator.js
var __decorate14 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SixMoveGenerator = class SixMoveGenerator2 extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const legalLandings = this.rules.getLegalLandings(node.gameState);
    const totalDroppablePieces = 2 * config.piecesPerPlayer;
    if (node.gameState.turn < totalDroppablePieces) {
      return this.getListDrops(legalLandings);
    } else {
      return this.getTranslations(node.gameState, legalLandings);
    }
  }
  getTranslations(state, legalLandings) {
    const allPieces = state.getPieces().reverse();
    const currentPlayer = state.getCurrentPlayer();
    const playerPieces = allPieces.get(currentPlayer).get();
    return this.getTranslationsFrom(state, playerPieces, legalLandings);
  }
  getTranslationsFrom(state, starts, landings) {
    const translations = [];
    for (const start of starts) {
      for (const landing of landings) {
        const move = SixMove.ofTranslation(start, landing);
        if (state.isCoordConnected(landing, MGPOptional.of(start))) {
          const stateAfterMove = state.movePiece(move);
          const groupsAfterMove = stateAfterMove.getGroups();
          if (this.rules.isSplit(groupsAfterMove)) {
            const largestGroups = this.rules.getLargestGroups(groupsAfterMove);
            if (largestGroups.size() === 1) {
              translations.push(SixMove.ofTranslation(start, landing));
            } else {
              for (const group of largestGroups) {
                const subGroup = group.getAnyElement().get();
                const cut = SixMove.ofCut(start, landing, subGroup);
                translations.push(cut);
              }
            }
          } else {
            translations.push(move);
          }
        }
      }
    }
    return translations;
  }
  getListDrops(legalLandings) {
    const drops = [];
    for (const landing of legalLandings) {
      const drop = SixMove.ofDrop(landing);
      drops.push(drop);
    }
    return drops;
  }
};
SixMoveGenerator = __decorate14([
  Debug.log
], SixMoveGenerator);

// games/dist/games/six/SixFilteredMoveGenerator.js
var SixFilteredMoveGenerator = class extends SixMoveGenerator {
  heuristic = new SixHeuristic();
  getTranslations(state, legalLandings) {
    const safelyMovablePieceOrFirstOne = this.getSafelyMovablePieceOrFirstOne(state);
    return this.getTranslationsFrom(state, safelyMovablePieceOrFirstOne, legalLandings);
  }
  getSafelyMovablePieceOrFirstOne(state) {
    const allPieces = state.getPieces().reverse();
    const currentPlayer = state.getCurrentPlayer();
    const playerPieces = allPieces.get(currentPlayer).get();
    const firstPiece = playerPieces.getAnyElement().get();
    const safePieces = [];
    for (const playerPiece of playerPieces) {
      if (this.isPieceBlockingAVictory(state, playerPiece) === false) {
        safePieces.push(playerPiece);
      }
    }
    if (safePieces.length === 0) {
      return new CoordSet([firstPiece]);
    } else {
      return new CoordSet(safePieces);
    }
  }
  isPieceBlockingAVictory(state, playerPiece) {
    const hypotheticalState = state.switchPiece(playerPiece);
    const fakeDropMove = SixMove.ofDrop(playerPiece);
    this.heuristic.startSearchingVictorySources();
    while (this.heuristic.hasNextVictorySource()) {
      this.heuristic.currentVictorySource = this.heuristic.getNextVictorySource();
      const boardInfo = this.heuristic.searchVictoryOnly(this.heuristic.currentVictorySource, fakeDropMove, hypotheticalState);
      if (boardInfo.status === AlignmentStatus.VICTORY) {
        return true;
      }
    }
    return false;
  }
};

// games/dist/games/squarz/SquarzFailure.js
var SquarzFailure = class {
  static MAX_DISTANCE_IS_N = (n) => $localize`You jumped too far! The maximum size of a jump is ${n} step!`;
};

// games/dist/games/squarz/SquarzHeuristic.js
var SquarzHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node) {
    return node.gameState.getScores().toTable();
  }
};

// games/dist/games/squarz/SquarzMove.js
var SquarzMove = class _SquarzMove extends MoveCoordToCoord {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_SquarzMove.from);
  static from(start, end) {
    const distance = start.getDistanceToward(end);
    if (distance === 0) {
      return MGPFallible.failure(RulesFailure.MOVE_CANNOT_BE_STATIC());
    } else {
      return MGPFallible.success(new _SquarzMove(start, end));
    }
  }
  isDuplication() {
    const distance = this.getDistance();
    return distance === 1;
  }
  isJump() {
    const distance = this.getDistance();
    return distance > 1;
  }
};

// games/dist/games/squarz/SquarzMoveGenerator.js
var SquarzMoveGenerator = class extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const player = node.gameState.getCurrentPlayer();
    const jumps = [];
    const duplicationMap = new MGPMap();
    for (const coordAndContent of node.gameState.getCoordsAndContents()) {
      if (coordAndContent.content.equals(player)) {
        const coordMoves = this.rules.getPossiblesMoves(node.gameState, coordAndContent.coord, config);
        const coordJumps = [];
        const coordDuplications = [];
        coordMoves.forEach((m) => {
          if (m.isDuplication())
            coordDuplications.push(m);
          else
            coordJumps.push(m);
        });
        jumps.push(...coordJumps);
        for (const duplication of coordDuplications) {
          duplicationMap.put(duplication.getEnd(), duplication);
        }
      }
    }
    const duplications = duplicationMap.getValueList();
    return jumps.concat(duplications);
  }
};

// games/dist/games/squarz/SquarzState.js
var SquarzState = class _SquarzState extends PlayerOrNoneGameStateWithTable {
  static of(oldState, newBoard) {
    return new _SquarzState(newBoard, oldState.turn);
  }
  getDominantPlayer() {
    const scores = this.getScores();
    const scoreZero = scores.get(Player.ZERO);
    const scoreOne = scores.get(Player.ONE);
    if (scoreZero === scoreOne) {
      return PlayerOrNone.NONE;
    } else if (scoreZero < scoreOne) {
      return PlayerOrNone.ONE;
    } else {
      return PlayerOrNone.ZERO;
    }
  }
  setPieceAt(coord, value) {
    return GameStateWithTable.setPieceAt(this, coord, value, _SquarzState.of);
  }
  getScores() {
    const scores = PlayerNumberMap.of(0, 0);
    for (const coordAndContent of this.getCoordsAndContents()) {
      const piece = coordAndContent.content;
      if (piece.isPlayer()) {
        scores.add(piece, 1);
      }
    }
    return scores;
  }
  hasMovablePieceAt(coord, jumpSize) {
    for (let y = -jumpSize; y <= jumpSize; y++) {
      for (let x = -jumpSize; x <= jumpSize; x++) {
        const landingCoord = new Coord(coord.x + x, coord.y + y);
        if (this.isEmptyAt(landingCoord)) {
          return true;
        }
      }
    }
    return false;
  }
};

// games/dist/games/squarz/SquarzRules.js
var SquarzRules = class _SquarzRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_SquarzRules.singleton.isAbsent()) {
      _SquarzRules.singleton = MGPOptional.of(new _SquarzRules());
    }
    return _SquarzRules.singleton.get();
  }
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Squarz`,
    config: {
      width: new NumberConfig(8, RulesConfigDescriptionLocalizable.WIDTH, MGPValidators.range(3, 99)),
      height: new NumberConfig(8, RulesConfigDescriptionLocalizable.HEIGHT, MGPValidators.range(3, 99)),
      jumpSize: new NumberConfig(2, () => $localize`Jump Size`, MGPValidators.range(2, 99))
    }
  });
  getRulesConfigDescription() {
    return _SquarzRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState(config) {
    const width = config.width;
    const height = config.height;
    const board = TableUtils.create(width, height, PlayerOrNone.NONE);
    board[0][0] = Player.ZERO;
    board[height - 1][width - 1] = Player.ZERO;
    board[height - 1][0] = Player.ONE;
    board[0][width - 1] = Player.ONE;
    return new SquarzState(board, 0);
  }
  isLegal(move, state, config) {
    const distance = move.getDistance();
    const jumpSize = config.jumpSize;
    if (jumpSize < distance) {
      return MGPValidation.failure(SquarzFailure.MAX_DISTANCE_IS_N(jumpSize));
    }
    const start = state.getPieceAt(move.getStart());
    const opponent = state.getCurrentOpponent();
    if (start === opponent) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    if (start.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    const landing = state.getPieceAt(move.getEnd());
    if (landing.isNone()) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
  }
  applyLegalMove(move, state) {
    const start = move.getStart();
    const end = move.getEnd();
    const moveDistance = start.getDistanceToward(end);
    const player = state.getCurrentPlayer();
    const opponent = state.getCurrentOpponent();
    let resultingState = state.setPieceAt(end, player);
    if (moveDistance > 1) {
      resultingState = resultingState.setPieceAt(start, PlayerOrNone.NONE);
    }
    for (const direction of Ordinal.ORDINALS) {
      const neighbor = end.getNext(direction, 1);
      if (resultingState.hasPieceAt(neighbor, opponent)) {
        resultingState = resultingState.setPieceAt(neighbor, player);
      }
    }
    return new SquarzState(resultingState.board, resultingState.turn + 1);
  }
  getGameStatus(node, config) {
    const jumpSize = config.jumpSize;
    const state = node.gameState;
    const currentPlayer = state.getCurrentPlayer();
    if (this.canPlayerMove(state, currentPlayer, jumpSize)) {
      return GameStatus.ONGOING;
    } else {
      return this.getDominantPlayerVictory(state);
    }
  }
  canPlayerMove(state, player, jumpSize) {
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content.equals(player)) {
        if (state.hasMovablePieceAt(coordAndContent.coord, jumpSize)) {
          return true;
        }
      }
    }
    return false;
  }
  getPossiblesMoves(state, coord, config) {
    const moves = [];
    const jumpSize = config.jumpSize;
    for (let y = -jumpSize; y <= jumpSize; y++) {
      for (let x = -jumpSize; x <= jumpSize; x++) {
        const landingCoord = new Coord(coord.x + x, coord.y + y);
        if (state.isEmptyAt(landingCoord)) {
          moves.push(SquarzMove.from(coord, landingCoord).get());
        }
      }
    }
    return moves;
  }
  getDominantPlayerVictory(state) {
    const winner = state.getDominantPlayer();
    if (winner.isPlayer()) {
      return GameStatus.getVictory(winner);
    } else {
      return GameStatus.DRAW;
    }
  }
};

// games/dist/games/tafl/TaflPawn.js
var TaflPawn = class _TaflPawn {
  owner;
  king;
  static UNOCCUPIED = new _TaflPawn(PlayerOrNone.NONE, false);
  static PLAYER_ONE_KING = new _TaflPawn(PlayerOrNone.ONE, true);
  static PLAYER_ONE_PAWN = new _TaflPawn(PlayerOrNone.ONE, false);
  static PLAYER_ZERO_KING = new _TaflPawn(PlayerOrNone.ZERO, true);
  static PLAYER_ZERO_PAWN = new _TaflPawn(PlayerOrNone.ZERO, false);
  constructor(owner, king) {
    this.owner = owner;
    this.king = king;
  }
  isKing() {
    return this.king;
  }
  getOwner() {
    return this.owner;
  }
  equals(other) {
    return this === other;
  }
};

// games/dist/games/tafl/TaflPieceHeuristic.js
var TaflPieceHeuristic = class extends PlayerMetricHeuristicWithBounds {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getMetrics(node, config) {
    const state = node.gameState;
    const zeroPawnsCount = this.rules.getPlayerListPawns(Player.ZERO, state).length;
    const onePawnsCount = this.rules.getPlayerListPawns(Player.ONE, state).length;
    return this.getHeuristicValue(config, zeroPawnsCount, onePawnsCount).toTable();
  }
  getHeuristicValue(config, zeroPawnsCount, onePawnsCount) {
    const invader = this.rules.getInvader(config);
    const scoreZero = this.getScoreFor(Player.ZERO, invader, zeroPawnsCount);
    const scoreOne = this.getScoreFor(Player.ONE, invader, onePawnsCount);
    return PlayerNumberMap.of(scoreZero, scoreOne);
  }
  getScoreFor(player, invader, pawnsCount) {
    let mult;
    if (player === Player.ZERO) {
      if (invader === Player.ZERO) {
        mult = 1;
      } else {
        mult = 2;
      }
    } else {
      if (invader === Player.ZERO) {
        mult = 2;
      } else {
        mult = 1;
      }
    }
    return pawnsCount * mult;
  }
  getBounds(config) {
    const maxPawns = PlayerNumberMap.of(24, 13);
    const invader = this.rules.getInvader(config);
    const zeroPawnsCount = maxPawns.get(invader);
    const onePawnsCount = maxPawns.get(invader.getOpponent());
    const player0HeuristicValue = this.getHeuristicValue(config, zeroPawnsCount, 0);
    const player0Best = BoardValue.ofPlayerNumberMap(player0HeuristicValue);
    const player1HeuristicValue = this.getHeuristicValue(config, 0, onePawnsCount);
    const player1Best = BoardValue.ofPlayerNumberMap(player1HeuristicValue);
    return { player0Best, player1Best };
  }
};

// games/dist/games/tafl/TaflPieceAndInfluenceHeuristic.js
var TaflPieceAndInfluenceHeuristic = class extends TaflPieceHeuristic {
  getBoardValue(node, config) {
    const gameStatus = this.rules.getGameStatus(node, config);
    if (gameStatus.isEndGame) {
      return gameStatus.toBoardValue();
    }
    const state = node.gameState;
    const empty = TaflPawn.UNOCCUPIED;
    const pieceMap = this.getPiecesMap(state);
    const threatMap = this.getThreatMap(node, pieceMap);
    const filteredThreatMap = this.filterThreatMap(threatMap, state);
    let threatenedPiece = 0;
    let safePiece = 0;
    let totalInfluence = 0;
    for (const owner of Player.PLAYERS) {
      for (const coord of pieceMap.get(owner).get()) {
        if (filteredThreatMap.get(coord).isPresent()) {
          threatenedPiece += owner.getScoreModifier();
        } else {
          safePiece += owner.getScoreModifier();
          let influence = 0;
          for (const dir of Orthogonal.ORTHOGONALS) {
            let testedCoord = coord.getNext(dir, 1);
            while (state.hasPieceAt(testedCoord, empty)) {
              influence++;
              testedCoord = testedCoord.getNext(dir, 1);
            }
          }
          totalInfluence += influence * owner.getScoreModifier();
        }
      }
    }
    return BoardValue.multiMetric([
      safePiece,
      threatenedPiece,
      totalInfluence
    ]);
  }
  getPiecesMap(state) {
    const empty = TaflPawn.UNOCCUPIED;
    const zeroPieces = [];
    const onePieces = [];
    for (let y = 0; y < state.getHeight(); y++) {
      for (let x = 0; x < state.getWidth(); x++) {
        const coord = new Coord(x, y);
        const piece = state.getPieceAt(coord);
        if (piece !== empty) {
          const owner = state.getAbsoluteOwner(coord);
          if (owner === Player.ZERO) {
            zeroPieces.push(coord);
          } else {
            onePieces.push(coord);
          }
        }
      }
    }
    const map = new MGPMap([
      { key: Player.ZERO, value: new CoordSet(zeroPieces) },
      { key: Player.ONE, value: new CoordSet(onePieces) }
    ]);
    return map;
  }
  getThreatMap(node, pieces) {
    const threatMap = new MGPMap();
    for (const player of Player.PLAYERS) {
      for (const piece of pieces.get(player).get()) {
        const threats = this.getThreats(piece, node.gameState);
        if (this.isThreatReal(piece, node.gameState, threats)) {
          threatMap.set(piece, new Set2(threats));
        }
      }
    }
    return threatMap;
  }
  getThreats(coord, state) {
    const owner = state.getAbsoluteOwner(coord);
    Utils.assert(owner.isPlayer(), "TaflPieceAndInfluenceHeuristic.getThreats should be called with an occupied coordinate");
    const threatenerPlayer = owner.getOpponent();
    const threats = [];
    for (const dir of Orthogonal.ORTHOGONALS) {
      const directThreat = coord.getPrevious(dir, 1);
      if (this.isAThreat(directThreat, state, threatenerPlayer)) {
        const movingThreats = [];
        for (const captureDirection of Orthogonal.ORTHOGONALS) {
          if (captureDirection === dir.getOpposite()) {
            continue;
          }
          let futureCapturer = coord.getNext(dir, 1);
          while (state.hasPieceAt(futureCapturer, TaflPawn.UNOCCUPIED)) {
            futureCapturer = futureCapturer.getNext(captureDirection);
          }
          if (state.hasOwnerAt(futureCapturer, threatenerPlayer) && coord.getNext(dir, 1).equals(futureCapturer) === false) {
            movingThreats.push(futureCapturer);
          }
        }
        threats.push(new SandwichThreat(directThreat, new CoordSet(movingThreats)));
      }
    }
    return threats;
  }
  isAThreat(coord, state, opponent) {
    if (state.isNotOnBoard(coord)) {
      return false;
    }
    if (state.getAbsoluteOwner(coord) === opponent) {
      return true;
    }
    if (this.rules.isThrone(state, coord)) {
      if (opponent === Player.ONE) {
        return true;
      } else {
        return state.getPieceAt(coord) === TaflPawn.UNOCCUPIED;
      }
    }
    return false;
  }
  isThreatReal(coord, state, threats) {
    if (threats.length === 0) {
      return false;
    }
    if (state.getPieceAt(coord).isKing()) {
      return threats.length === 3;
    } else {
      for (const threat of threats) {
        if (threat.mover.size() > 0) {
          return true;
        }
      }
      return false;
    }
  }
  filterThreatMap(threatMap, state) {
    const filteredThreatMap = new MGPMap();
    const threateneds = threatMap.getKeyList();
    const threatenedPlayerPieces = threateneds.filter((coord) => {
      return state.getAbsoluteOwner(coord) === state.getCurrentPlayer();
    });
    const threatenedOpponentPieces = new CoordSet(threateneds.filter((coord) => {
      return state.getAbsoluteOwner(coord) === state.getCurrentOpponent();
    }));
    for (const threatenedPiece of threatenedPlayerPieces) {
      const oldThreatSet = threatMap.get(threatenedPiece).get();
      const newThreatSet = [];
      for (const threat of oldThreatSet) {
        if (threatenedOpponentPieces.contains(threat.directThreat) === false) {
          const newMover = [];
          for (const mover of threat.mover) {
            if (threatenedOpponentPieces.contains(mover) === false) {
              newMover.push(mover);
            }
          }
          if (newMover.length > 0) {
            newThreatSet.push(new SandwichThreat(threat.directThreat, new CoordSet(newMover)));
          }
        }
      }
      if (newThreatSet.length > 0) {
        filteredThreatMap.set(threatenedPiece, new Set2(newThreatSet));
      }
    }
    for (const threatenedOpponentPiece of threatenedOpponentPieces) {
      const threatSet = threatMap.get(threatenedOpponentPiece).get();
      filteredThreatMap.set(threatenedOpponentPiece, threatSet);
    }
    return filteredThreatMap;
  }
};

// games/dist/games/tafl/TaflPieceAndControlHeuristic.js
var TaflPieceAndControlHeuristic = class extends TaflPieceAndInfluenceHeuristic {
  getBoardValue(node, config) {
    const metrics = this.getControlScoreAndPieceScores(node, config);
    return BoardValue.multiMetric([
      metrics.safeScore,
      metrics.threatenedScore,
      metrics.controlScore
    ]);
  }
  getControlScoreAndPieceScores(node, config) {
    const state = node.gameState;
    const pieceMap = this.getPiecesMap(state);
    const threatMap = this.getThreatMap(node, pieceMap);
    const filteredThreatMap = this.filterThreatMap(threatMap, state);
    const metrics = { safeScore: 0, threatenedScore: 0, controlScore: 0 };
    for (const owner of Player.PLAYERS) {
      let controlledSquares = new CoordSet();
      for (const coord of pieceMap.get(owner).get()) {
        if (filteredThreatMap.get(coord).isPresent()) {
          metrics.threatenedScore += owner.getScoreModifier();
        } else {
          metrics.safeScore += owner.getScoreModifier();
          for (const dir of Orthogonal.ORTHOGONALS) {
            let testedCoord = coord.getNext(dir, 1);
            while (state.hasPieceAt(testedCoord, TaflPawn.UNOCCUPIED)) {
              controlledSquares = controlledSquares.addElement(testedCoord);
              testedCoord = testedCoord.getNext(dir, 1);
            }
          }
        }
      }
      for (const controlled of controlledSquares) {
        const controlledValue = this.getControlledPieceValue(controlled, state);
        metrics.controlScore += owner.getScoreModifier() * controlledValue;
      }
    }
    return metrics;
  }
  getControlledPieceValue(coord, state) {
    let value = 1;
    if (state.isHorizontalEdge(coord)) {
      value *= state.getWidth();
    }
    if (state.isVerticalEdge(coord)) {
      value *= state.getWidth();
    }
    return value;
  }
};

// games/dist/games/tafl/TaflEscapeThenPieceThenControlHeuristic.js
var TaflEscapeThenPieceThenControlHeuristic = class extends TaflPieceAndControlHeuristic {
  getBoardValue(node, config) {
    const metrics = this.getControlScoreAndPieceScores(node, config);
    const stepForEscape = this.getStepForEscapeMetric(node.gameState);
    return BoardValue.multiMetric([
      stepForEscape,
      metrics.safeScore,
      metrics.threatenedScore,
      metrics.controlScore
    ]);
  }
  getStepForEscapeMetric(state) {
    const defender = state.getPieceAt(this.rules.getKingCoord(state).get()).getOwner();
    const stepForEscape = this.getStepForEscape(state) * defender.getScoreModifier();
    if (stepForEscape === -1) {
      return BoardValue.getPreVictoryValueOf(defender.getOpponent());
    } else {
      return -1 * stepForEscape;
    }
  }
  getStepForEscape(state) {
    const king = this.rules.getKingCoord(state).get();
    return this._getStepForEscape(state, 1, [king], []).getOrElse(-1);
  }
  _getStepForEscape(state, step, previousGen, handledCoords) {
    const nextGen = this.getNextGen(state, previousGen, handledCoords);
    if (nextGen.length === 0) {
      return MGPOptional.empty();
    }
    if (nextGen.some((coord) => state.isExternalThrone(coord))) {
      return MGPOptional.of(step);
    } else {
      step++;
      handledCoords.push(...nextGen);
      return this._getStepForEscape(state, step, nextGen, handledCoords);
    }
  }
  getNextGen(state, previousGen, handledCoords) {
    const newGen = [];
    for (const piece of previousGen) {
      for (const dir of Orthogonal.ORTHOGONALS) {
        let landing = piece.getNext(dir, 1);
        while (state.hasPieceAt(landing, TaflPawn.UNOCCUPIED)) {
          if (handledCoords.every((coord) => coord.equals(landing) === false)) {
            newGen.push(landing);
          }
          landing = landing.getNext(dir, 1);
        }
      }
    }
    return newGen;
  }
};

// games/dist/games/tafl/TaflFailure.js
var TaflFailure = class {
  static LANDING_ON_OCCUPIED_SQUARE = () => $localize`You cannot land on an occupied square.`;
  static THRONE_IS_LEFT_FOR_GOOD = () => $localize`Once you left the central throne, you cannot return to it.`;
  static SOLDIERS_CANNOT_SIT_ON_THRONE = () => $localize`Soldiers cannot sit on the throne.`;
  static MOVE_MUST_BE_ORTHOGONAL = () => $localize`Tafl moves must be orthogonal.`;
};

// games/dist/games/tafl/TaflMove.js
var TaflMove = class extends MoveCoordToCoord {
  static isValidDirection(start, end) {
    const dir = start.getDirectionToward(end);
    if (dir.isFailure() || dir.get().isDiagonal()) {
      return MGPValidation.failure(TaflFailure.MOVE_MUST_BE_ORTHOGONAL());
    }
    return MGPValidation.SUCCESS;
  }
  constructor(start, end) {
    super(start, end);
    const maximalDistance = this.getMaximalDistance();
    Utils.assert(start.isInRange(maximalDistance, maximalDistance), "Starting coord of TaflMove must be on the board, not at " + start.toString() + ".");
    Utils.assert(end.isInRange(maximalDistance, maximalDistance), "Landing coord of TaflMove must be on the board, not at " + end.toString() + ".");
  }
  toString() {
    return "TaflMove(" + this.getStart() + "->" + this.getEnd() + ")";
  }
};

// games/dist/games/tafl/TaflMoveGenerator.js
var __decorate15 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TaflMoveGenerator = class TaflMoveGenerator2 extends MoveGenerator {
  rules;
  constructor(rules) {
    super();
    this.rules = rules;
  }
  getListMoves(node, config) {
    const state = node.gameState;
    const currentPlayer = state.getCurrentPlayer();
    const listMoves = this.rules.getPlayerListMoves(currentPlayer, state, config);
    return this.orderMoves(state, listMoves, config);
  }
  orderMoves(state, listMoves, config) {
    const king = this.rules.getKingCoord(state).get();
    const invader = this.rules.getInvader(config);
    if (state.getCurrentPlayer() === invader) {
      ArrayUtils.sortByDescending(listMoves, (move) => {
        return -move.getEnd().getOrthogonalDistance(king);
      });
    } else {
      ArrayUtils.sortByDescending(listMoves, (move) => {
        if (move.getStart().equals(king)) {
          if (state.isExternalThrone(move.getEnd())) {
            return 2;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      });
    }
    return listMoves;
  }
};
TaflMoveGenerator = __decorate15([
  Debug.log
], TaflMoveGenerator);

// games/dist/jscaip/RelativePlayer.js
var RelativePlayer = class _RelativePlayer {
  value;
  static NONE = new _RelativePlayer("NONE");
  static OPPONENT = new _RelativePlayer("OPPONENT");
  static PLAYER = new _RelativePlayer("PLAYER");
  constructor(value) {
    this.value = value;
  }
};

// games/dist/games/tafl/TaflState.js
var TaflState = class extends GameStateWithTable {
  isCentralThrone(coord) {
    return coord.equals(this.getCentralThrone());
  }
  getCentralThrone() {
    const center = (this.getSize() - 1) / 2;
    return new Coord(center, center);
  }
  getRelativeOwner(player, coord) {
    const owner = this.getAbsoluteOwner(coord);
    let relativeOwner;
    if (owner.isNone()) {
      relativeOwner = RelativePlayer.NONE;
    } else if (player === owner) {
      relativeOwner = RelativePlayer.PLAYER;
    } else {
      relativeOwner = RelativePlayer.OPPONENT;
    }
    return relativeOwner;
  }
  getAbsoluteOwner(coord) {
    const piece = this.getPieceAt(coord);
    return piece.getOwner();
  }
  getSize() {
    return this.getHeight();
  }
  hasOwnerAt(coord, owner) {
    const optional = this.getOptionalPieceAt(coord);
    if (optional.isPresent()) {
      return optional.get().getOwner().equals(owner);
    } else {
      return false;
    }
  }
  isExternalThrone(coord) {
    return this.isCorner(coord);
  }
};

// games/dist/games/tafl/TaflRules.js
var TaflRules = class extends ConfigurableRules {
  generateMove;
  static CAN_RETURN_TO_CASTLE = () => $localize`Central throne is left for good`;
  static EDGE_ARE_KING_S_ENNEMY = () => $localize`Edges are king's ennemy`;
  static CENTRAL_THRONE_CAN_SURROUND_KING = () => $localize`Central throne can surround king`;
  static KING_FAR_FROM_HOME_CAN_BE_SANDWICHED = () => $localize`King far from home can be sandwiched`;
  static INVADER_STARTS = () => $localize`Invader starts`;
  constructor(generateMove) {
    super();
    this.generateMove = generateMove;
  }
  isLegal(move, state, config) {
    const player = state.getCurrentPlayer();
    const validity = this.getMoveValidity(player, move, state, config);
    if (validity.isFailure()) {
      return MGPValidation.failure(validity.getReason());
    }
    return MGPValidation.SUCCESS;
  }
  getMoveValidity(player, move, state, config) {
    const owner = state.getRelativeOwner(player, move.getStart());
    if (owner === RelativePlayer.NONE) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (owner === RelativePlayer.OPPONENT) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    }
    const landingCoordOwner = state.getRelativeOwner(player, move.getEnd());
    if (landingCoordOwner !== RelativePlayer.NONE) {
      return MGPValidation.failure(TaflFailure.LANDING_ON_OCCUPIED_SQUARE());
    }
    if (this.isThrone(state, move.getEnd())) {
      if (state.getPieceAt(move.getStart()).isKing()) {
        if (state.isCentralThrone(move.getEnd()) && config.canReturnToCastle === false) {
          return MGPValidation.failure(TaflFailure.THRONE_IS_LEFT_FOR_GOOD());
        }
      } else {
        return MGPValidation.failure(TaflFailure.SOLDIERS_CANNOT_SIT_ON_THRONE());
      }
    }
    const dir = move.getStart().getDirectionToward(move.getEnd()).get();
    const dist = move.getStart().getOrthogonalDistance(move.getEnd());
    let inspectedCoord = move.getStart().getNext(dir);
    for (let i = 1; i < dist; i++) {
      if (state.getPieceAt(inspectedCoord) !== TaflPawn.UNOCCUPIED) {
        return MGPValidation.failure(RulesFailure.SOMETHING_IN_THE_WAY());
      }
      inspectedCoord = inspectedCoord.getNext(dir);
    }
    return MGPValidation.SUCCESS;
  }
  isThrone(state, coord) {
    if (state.isExternalThrone(coord)) {
      return true;
    } else {
      return state.isCentralThrone(coord);
    }
  }
  tryCapture(player, landingPawn, d, state, config) {
    const threatened = landingPawn.getNext(d);
    if (state.isNotOnBoard(threatened)) {
      return MGPOptional.empty();
    }
    const threatenedPawnOwner = state.getRelativeOwner(player, threatened);
    if (threatenedPawnOwner !== RelativePlayer.OPPONENT) {
      return MGPOptional.empty();
    }
    if (state.getPieceAt(threatened).isKing()) {
      return this.captureKing(player, landingPawn, d, state, config);
    }
    return this.capturePawn(player, landingPawn, d, state);
  }
  captureKing(player, landingPiece, d, state, config) {
    const kingCoord = landingPiece.getNext(d);
    const { backCoord, back, backInRange, left, leftCoord, right, rightCoord } = this.getSurroundings(kingCoord, d, player, state);
    if (backInRange === false) {
      return this.captureKingAgainstTheWall(left, right, kingCoord, config);
    }
    if (back === RelativePlayer.NONE && this.isThrone(state, backCoord)) {
      return this.captureKingAgainstThrone(state, backCoord, kingCoord, left, right, config);
    }
    if (back === RelativePlayer.PLAYER) {
      return this.captureKingWithAtLeastASandwich(state, kingCoord, left, leftCoord, right, rightCoord, config);
    }
    return MGPOptional.empty();
  }
  getSurroundings(c, d, player, state) {
    const backCoord = c.getNext(d);
    const backInRange = state.isOnBoard(backCoord);
    const back = backInRange ? state.getRelativeOwner(player, backCoord) : RelativePlayer.NONE;
    const leftCoord = c.getLeft(d);
    const leftInRange = state.isOnBoard(leftCoord);
    const left = leftInRange ? state.getRelativeOwner(player, leftCoord) : RelativePlayer.NONE;
    const rightCoord = c.getRight(d);
    const rightInRange = state.isOnBoard(rightCoord);
    const right = rightInRange ? state.getRelativeOwner(player, rightCoord) : RelativePlayer.NONE;
    return {
      backCoord,
      back,
      backInRange,
      leftCoord,
      left,
      rightCoord,
      right
    };
  }
  captureKingAgainstTheWall(left, right, kingCoord, config) {
    let nbInvaders = left === RelativePlayer.PLAYER ? 1 : 0;
    nbInvaders += right === RelativePlayer.PLAYER ? 1 : 0;
    if (nbInvaders === 2 && config.edgesAreKingsEnnemy) {
      return MGPOptional.of(kingCoord);
    }
    return MGPOptional.empty();
  }
  captureKingAgainstThrone(state, backCoord, kingCoord, left, right, config) {
    if (state.isExternalThrone(backCoord)) {
      if (config.kingFarFromHomeCanBeSandwiched) {
        return MGPOptional.of(kingCoord);
      }
    } else {
      const kingHasOpponentOnItsLeft = left === RelativePlayer.PLAYER;
      const kingHasOpponentOnItsRight = right === RelativePlayer.PLAYER;
      const kingHasThreeOpponentAround = kingHasOpponentOnItsLeft || kingHasOpponentOnItsRight;
      if (config.centralThroneCanSurroundKing && kingHasThreeOpponentAround) {
        return MGPOptional.of(kingCoord);
      }
    }
    return MGPOptional.empty();
  }
  capturePawn(player, coord, direction, state) {
    const threatenedPieceCoord = coord.getNext(direction);
    const backCoord = threatenedPieceCoord.getNext(direction);
    let back = RelativePlayer.NONE;
    if (state.isOnBoard(backCoord)) {
      back = state.getRelativeOwner(player, backCoord);
    }
    if (back === RelativePlayer.NONE) {
      if (this.isThrone(state, backCoord) === false) {
        Debug.display("TaflRules", "capturePawn", "cannot capture a piece without an ally; " + threatenedPieceCoord + "threatened by " + player + `'s piece in ` + coord + " coming from this direction (" + direction.x + ", " + direction.y + ")cannot capture a piece without an ally behind");
        return MGPOptional.empty();
      }
      Debug.display("TaflRules", "capturePawn", "piece captured by 1 opponent and 1 throne; " + threatenedPieceCoord + "threatened by " + player + `'s piece in ` + coord + " coming from this direction (" + direction.x + ", " + direction.y + ")");
      return MGPOptional.of(threatenedPieceCoord);
    }
    if (back === RelativePlayer.PLAYER) {
      Debug.display("TaflRules", "capturePawn", "piece captured by 2 opponents; " + threatenedPieceCoord + "threatened by " + player + `'s piece in ` + coord + " coming from this direction (" + direction.x + ", " + direction.y + ")");
      return MGPOptional.of(threatenedPieceCoord);
    }
    Debug.display("TaflRules", "capturePawn", "no captures; " + threatenedPieceCoord + "threatened by " + player + `'s piece in ` + coord + " coming from this direction (" + direction.x + ", " + direction.y + ")");
    return MGPOptional.empty();
  }
  captureKingWithAtLeastASandwich(state, kingCoord, left, leftCoord, right, rightCoord, config) {
    if (this.kingTouchCentralThrone(state, kingCoord) === false && config.kingFarFromHomeCanBeSandwiched) {
      return MGPOptional.of(kingCoord);
    }
    const throneCanSurrond = config.centralThroneCanSurroundKing;
    const leftIsThrone = this.isThrone(state, leftCoord);
    const leftCanSurround = left === RelativePlayer.PLAYER || leftIsThrone && throneCanSurrond;
    const rightIsThrone = this.isThrone(state, rightCoord);
    const rightCanSurround = right === RelativePlayer.PLAYER || rightIsThrone && throneCanSurrond;
    if (leftCanSurround && rightCanSurround) {
      return MGPOptional.of(kingCoord);
    }
    return MGPOptional.empty();
  }
  kingTouchCentralThrone(state, kingCoord) {
    const centralThrone = state.getCentralThrone();
    return kingCoord.getOrthogonalDistance(centralThrone) <= 1;
  }
  applyLegalMove(move, state, config, _info) {
    const turn = state.turn;
    const board = state.getCopiedBoard();
    const player = state.getCurrentPlayer();
    const start = move.getStart();
    const end = move.getEnd();
    board[end.y][end.x] = board[start.y][start.x];
    board[start.y][start.x] = TaflPawn.UNOCCUPIED;
    for (const d of Orthogonal.ORTHOGONALS) {
      const captured = this.tryCapture(player, move.getEnd(), d, state, config);
      if (captured.isPresent()) {
        board[captured.get().y][captured.get().x] = TaflPawn.UNOCCUPIED;
      }
    }
    return new TaflState(board, turn + 1);
  }
  getGameStatus(node, config) {
    const state = node.gameState;
    const winner = this.getWinner(state, config);
    if (winner.isPresent()) {
      return GameStatus.getVictory(winner.get());
    }
    return GameStatus.ONGOING;
  }
  getWinner(state, config) {
    const optionalKingCoord = this.getKingCoord(state);
    if (optionalKingCoord.isAbsent()) {
      Debug.display("TaflRules", "getWinner", "The king is dead, victory to invader");
      return MGPOptional.of(this.getInvader(config));
    }
    const kingCoord = optionalKingCoord.get();
    if (state.isExternalThrone(kingCoord)) {
      Debug.display("TaflRules", "getWinner", "The king escape, victory to defender");
      return MGPOptional.of(this.getDefender(config));
    }
    if (this.isPlayerImmobilized(Player.ZERO, state, config)) {
      Debug.display("TaflRules", "getWinner", "Zero has no move, victory to one");
      return MGPOptional.of(Player.ONE);
    }
    if (this.isPlayerImmobilized(Player.ONE, state, config)) {
      Debug.display("TaflRules", "getWinner", "One has no move, victory to zero");
      return MGPOptional.of(Player.ZERO);
    }
    Debug.display("TaflRules", "getWinner", "no victory");
    return MGPOptional.empty();
  }
  getKingCoord(state) {
    const size = state.getSize();
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (state.getPieceAtXY(x, y).isKing()) {
          return MGPOptional.of(new Coord(x, y));
        }
      }
    }
    return MGPOptional.empty();
  }
  getInvader(config) {
    return config.invaderStarts ? Player.ZERO : Player.ONE;
  }
  getDefender(config) {
    return this.getInvader(config).getOpponent();
  }
  isPlayerImmobilized(player, state, config) {
    return this.getPlayerListMoves(player, state, config).length === 0;
  }
  getPlayerListMoves(player, state, config) {
    const listMoves = [];
    const listPawns = this.getPlayerListPawns(player, state);
    for (const piece of listPawns) {
      const pawnDestinations = this.getPossibleDestinations(piece, state, config);
      for (const destination of pawnDestinations) {
        const newMove = this.generateMove(piece, destination).get();
        listMoves.push(newMove);
      }
    }
    return listMoves;
  }
  getPlayerListPawns(player, state) {
    const size = state.getSize();
    const listPawn = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const piece = new Coord(x, y);
        const owner = state.getAbsoluteOwner(piece);
        if (owner === player) {
          listPawn.push(piece);
        }
      }
    }
    return listPawn;
  }
  getPossibleDestinations(start, state, config) {
    const destinations = [];
    let foundDestination;
    const pieceIsKing = state.getPieceAt(start).isKing();
    for (const dir of Orthogonal.ORTHOGONALS) {
      foundDestination = start.getNext(dir, 1);
      while (state.hasPieceAt(foundDestination, TaflPawn.UNOCCUPIED)) {
        if (state.isExternalThrone(foundDestination)) {
          if (pieceIsKing) {
            destinations.push(foundDestination);
          }
        } else if (state.isCentralThrone(foundDestination)) {
          if (pieceIsKing && config.canReturnToCastle) {
            destinations.push(foundDestination);
          }
        } else {
          destinations.push(foundDestination);
        }
        foundDestination = foundDestination.getNext(dir, 1);
      }
    }
    return destinations;
  }
};

// games/dist/games/tafl/brandhub/BrandhubMove.js
var BrandhubMove = class _BrandhubMove extends TaflMove {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_BrandhubMove.from);
  static from(start, end) {
    const validity = TaflMove.isValidDirection(start, end);
    if (validity.isFailure()) {
      return validity.toOtherFallible();
    } else {
      return MGPFallible.success(new _BrandhubMove(start, end));
    }
  }
  getMaximalDistance() {
    return 7;
  }
};

// games/dist/games/tafl/brandhub/BrandhubRules.js
var BrandhubRules = class _BrandhubRules extends TaflRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Brandhub`,
    config: {
      canReturnToCastle: new BooleanConfig(false, TaflRules.CAN_RETURN_TO_CASTLE),
      edgesAreKingsEnnemy: new BooleanConfig(false, TaflRules.EDGE_ARE_KING_S_ENNEMY),
      centralThroneCanSurroundKing: new BooleanConfig(true, TaflRules.CENTRAL_THRONE_CAN_SURROUND_KING),
      kingFarFromHomeCanBeSandwiched: new BooleanConfig(true, TaflRules.KING_FAR_FROM_HOME_CAN_BE_SANDWICHED),
      invaderStarts: new BooleanConfig(true, TaflRules.INVADER_STARTS)
    }
  });
  static get() {
    if (_BrandhubRules.singleton.isAbsent()) {
      _BrandhubRules.singleton = MGPOptional.of(new _BrandhubRules());
    }
    return _BrandhubRules.singleton.get();
  }
  constructor() {
    super(BrandhubMove.from);
  }
  getInitialState(config) {
    const _ = TaflPawn.UNOCCUPIED;
    let I = TaflPawn.PLAYER_ZERO_PAWN;
    let D = TaflPawn.PLAYER_ONE_PAWN;
    let K = TaflPawn.PLAYER_ONE_KING;
    if (config.invaderStarts === false) {
      I = TaflPawn.PLAYER_ONE_PAWN;
      D = TaflPawn.PLAYER_ZERO_PAWN;
      K = TaflPawn.PLAYER_ZERO_KING;
    }
    const board = [
      [_, _, _, I, _, _, _],
      [_, _, _, I, _, _, _],
      [_, _, _, D, _, _, _],
      [I, I, D, K, D, I, I],
      [_, _, _, D, _, _, _],
      [_, _, _, I, _, _, _],
      [_, _, _, I, _, _, _]
    ];
    return new TaflState(board, 0);
  }
  getRulesConfigDescription() {
    return _BrandhubRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/tafl/hnefatafl/HnefataflMove.js
var HnefataflMove = class _HnefataflMove extends TaflMove {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_HnefataflMove.from);
  static from(start, end) {
    const validity = TaflMove.isValidDirection(start, end);
    if (validity.isFailure()) {
      return validity.toOtherFallible();
    } else {
      return MGPFallible.success(new _HnefataflMove(start, end));
    }
  }
  getMaximalDistance() {
    return 11;
  }
};

// games/dist/games/tafl/hnefatafl/HnefataflRules.js
var HnefataflRules = class _HnefataflRules extends TaflRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Hnefatafl`,
    config: {
      canReturnToCastle: new BooleanConfig(true, TaflRules.CAN_RETURN_TO_CASTLE),
      edgesAreKingsEnnemy: new BooleanConfig(true, TaflRules.EDGE_ARE_KING_S_ENNEMY),
      centralThroneCanSurroundKing: new BooleanConfig(false, TaflRules.CENTRAL_THRONE_CAN_SURROUND_KING),
      kingFarFromHomeCanBeSandwiched: new BooleanConfig(false, TaflRules.KING_FAR_FROM_HOME_CAN_BE_SANDWICHED),
      invaderStarts: new BooleanConfig(true, TaflRules.INVADER_STARTS)
    }
  });
  static get() {
    if (_HnefataflRules.singleton.isAbsent()) {
      _HnefataflRules.singleton = MGPOptional.of(new _HnefataflRules());
    }
    return _HnefataflRules.singleton.get();
  }
  constructor() {
    super(HnefataflMove.from);
  }
  getInitialState(config) {
    const _ = TaflPawn.UNOCCUPIED;
    let I = TaflPawn.PLAYER_ZERO_PAWN;
    let D = TaflPawn.PLAYER_ONE_PAWN;
    let K = TaflPawn.PLAYER_ONE_KING;
    if (config.invaderStarts === false) {
      I = TaflPawn.PLAYER_ONE_PAWN;
      D = TaflPawn.PLAYER_ZERO_PAWN;
      K = TaflPawn.PLAYER_ZERO_KING;
    }
    const board = [
      [_, _, _, I, I, I, I, I, _, _, _],
      [_, _, _, _, _, I, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _],
      [I, _, _, _, _, D, _, _, _, _, I],
      [I, _, _, _, D, D, D, _, _, _, I],
      [I, I, _, D, D, K, D, D, _, I, I],
      [I, _, _, _, D, D, D, _, _, _, I],
      [I, _, _, _, _, D, _, _, _, _, I],
      [_, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, I, _, _, _, _, _],
      [_, _, _, I, I, I, I, I, _, _, _]
    ];
    return new TaflState(board, 0);
  }
  getRulesConfigDescription() {
    return _HnefataflRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/tafl/tablut/TablutMove.js
var TablutMove = class _TablutMove extends TaflMove {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_TablutMove.from);
  static from(start, end) {
    const validity = TaflMove.isValidDirection(start, end);
    if (validity.isFailure()) {
      return validity.toOtherFallible();
    } else {
      return MGPFallible.success(new _TablutMove(start, end));
    }
  }
  getMaximalDistance() {
    return 9;
  }
};

// games/dist/games/tafl/tablut/TablutRules.js
var TablutRules = class _TablutRules extends TaflRules {
  static singleton = MGPOptional.empty();
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Tablut`,
    config: {
      canReturnToCastle: new BooleanConfig(true, TaflRules.CAN_RETURN_TO_CASTLE),
      edgesAreKingsEnnemy: new BooleanConfig(true, TaflRules.EDGE_ARE_KING_S_ENNEMY),
      centralThroneCanSurroundKing: new BooleanConfig(false, TaflRules.CENTRAL_THRONE_CAN_SURROUND_KING),
      kingFarFromHomeCanBeSandwiched: new BooleanConfig(false, TaflRules.KING_FAR_FROM_HOME_CAN_BE_SANDWICHED),
      invaderStarts: new BooleanConfig(true, TaflRules.INVADER_STARTS)
    }
  });
  static get() {
    if (_TablutRules.singleton.isAbsent()) {
      _TablutRules.singleton = MGPOptional.of(new _TablutRules());
    }
    return _TablutRules.singleton.get();
  }
  constructor() {
    super(TablutMove.from);
  }
  getInitialState(config) {
    const _ = TaflPawn.UNOCCUPIED;
    let I = TaflPawn.PLAYER_ZERO_PAWN;
    let D = TaflPawn.PLAYER_ONE_PAWN;
    let K = TaflPawn.PLAYER_ONE_KING;
    if (config.invaderStarts === false) {
      I = TaflPawn.PLAYER_ONE_PAWN;
      D = TaflPawn.PLAYER_ZERO_PAWN;
      K = TaflPawn.PLAYER_ZERO_KING;
    }
    const board = [
      [_, _, _, I, I, I, _, _, _],
      [_, _, _, _, I, _, _, _, _],
      [_, _, _, _, D, _, _, _, _],
      [I, _, _, _, D, _, _, _, I],
      [I, I, D, D, K, D, D, I, I],
      [I, _, _, _, D, _, _, _, I],
      [_, _, _, _, D, _, _, _, _],
      [_, _, _, _, I, _, _, _, _],
      [_, _, _, I, I, I, _, _, _]
    ];
    return new TaflState(board, 0);
  }
  getRulesConfigDescription() {
    return _TablutRules.RULES_CONFIG_DESCRIPTION;
  }
};

// games/dist/games/teeko/TeekoMove.js
var TeekoDropMove = class _TeekoDropMove extends MoveCoord {
  static encoder = MoveCoord.getEncoder(_TeekoDropMove.from);
  static from(coord) {
    return new _TeekoDropMove(coord.x, coord.y);
  }
  toString() {
    return "TeekoMove" + this.coord.toString();
  }
  equals(other) {
    if (other instanceof _TeekoDropMove) {
      return super.equals(other);
    } else {
      return false;
    }
  }
};
var TeekoTranslationMove = class _TeekoTranslationMove extends MoveCoordToCoord {
  static encoder = MoveCoordToCoord.getFallibleEncoder(_TeekoTranslationMove.from);
  static from(start, end) {
    if (start.equals(end)) {
      return MGPFallible.failure(RulesFailure.MOVE_CANNOT_BE_STATIC());
    } else {
      return MGPFallible.success(new _TeekoTranslationMove(start, end));
    }
  }
  toString() {
    return "TeekoMove(" + this.getStart().toString() + " -> " + this.getEnd().toString() + ")";
  }
  equals(other) {
    if (other instanceof _TeekoTranslationMove) {
      return super.equals(other);
    } else {
      return false;
    }
  }
};
var TeekoMove;
(function(TeekoMove2) {
  TeekoMove2.encoder = Encoder.disjunction([
    (move) => move instanceof TeekoDropMove,
    (move) => move instanceof TeekoTranslationMove
  ], [
    TeekoDropMove.encoder,
    TeekoTranslationMove.encoder
  ]);
})(TeekoMove || (TeekoMove = {}));

// games/dist/games/teeko/TeekoState.js
var TeekoState = class extends PlayerOrNoneGameStateWithTable {
  static WIDTH = 5;
  isInDropPhase() {
    return this.turn < 8;
  }
};

// games/dist/games/teeko/TeekoRules.js
var TeekoRules = class _TeekoRules extends ConfigurableRules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_TeekoRules.singleton.isAbsent()) {
      _TeekoRules.singleton = MGPOptional.of(new _TeekoRules());
    }
    return _TeekoRules.singleton.get();
  }
  static RULES_CONFIG_DESCRIPTION = new RulesConfigDescription({
    name: () => $localize`Standard Teeko`,
    config: {
      teleport: new BooleanConfig(false, () => $localize`Piece can teleport`)
    }
  }, [{
    name: () => $localize`Teleport Teeko`,
    config: {
      teleport: true
    }
  }]);
  static TEEKO_HELPER = new NInARowHelper(Utils.identity, 4);
  getRulesConfigDescription() {
    return _TeekoRules.RULES_CONFIG_DESCRIPTION;
  }
  getInitialState() {
    const board = TableUtils.create(TeekoState.WIDTH, TeekoState.WIDTH, PlayerOrNone.NONE);
    return new TeekoState(board, 0);
  }
  isLegal(move, state, config) {
    if (state.isInDropPhase()) {
      Utils.assert(move instanceof TeekoDropMove, "Cannot translate in dropping phase !");
      return this.isLegalDrop(move, state);
    } else {
      Utils.assert(move instanceof TeekoTranslationMove, "Cannot drop in translation phase !");
      return this.isLegalTranslation(move, state, config);
    }
  }
  isLegalDrop(move, state) {
    if (state.isNotOnBoard(move.coord)) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.coord));
    }
    if (state.getPieceAt(move.coord).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    return MGPValidation.SUCCESS;
  }
  isLegalTranslation(move, state, config) {
    if (state.isNotOnBoard(move.getStart())) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.getStart()));
    }
    if (state.isNotOnBoard(move.getEnd())) {
      return MGPValidation.failure(CoordFailure.OUT_OF_RANGE(move.getEnd()));
    }
    const translatedPiece = state.getPieceAt(move.getStart());
    if (translatedPiece === state.getCurrentOpponent()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_OPPONENT());
    } else if (translatedPiece.isNone()) {
      return MGPValidation.failure(RulesFailure.MUST_CHOOSE_OWN_PIECE_NOT_EMPTY());
    }
    if (state.getPieceAt(move.getEnd()).isPlayer()) {
      return MGPValidation.failure(RulesFailure.MUST_LAND_ON_EMPTY_SPACE());
    }
    if (config.teleport === false) {
      if (move.getStart().isNeighborWith(move.getEnd()) === false) {
        return MGPValidation.failure(RulesFailure.MUST_MOVE_ON_NEIGHBOR());
      }
    }
    return MGPValidation.SUCCESS;
  }
  applyLegalMove(move, state, _config, _info) {
    if (move instanceof TeekoDropMove) {
      return this.applyLegalDrop(move, state);
    } else {
      return this.applyLegalTranslation(move, state);
    }
  }
  applyLegalDrop(move, state) {
    const newBoard = state.getCopiedBoard();
    newBoard[move.coord.y][move.coord.x] = state.getCurrentPlayer();
    return new TeekoState(newBoard, state.turn + 1);
  }
  applyLegalTranslation(move, state) {
    const newBoard = state.getCopiedBoard();
    newBoard[move.getStart().y][move.getStart().x] = PlayerOrNone.NONE;
    newBoard[move.getEnd().y][move.getEnd().x] = state.getCurrentPlayer();
    return new TeekoState(newBoard, state.turn + 1);
  }
  getGameStatus(node) {
    const state = node.gameState;
    const victoriousCoord = this.getVictoryCoord(state);
    if (victoriousCoord.length > 0) {
      return GameStatus.getVictory(state.getCurrentOpponent());
    } else {
      return GameStatus.ONGOING;
    }
  }
  getLastCoord(move) {
    if (move instanceof TeekoDropMove) {
      return move.coord;
    } else {
      return move.getEnd();
    }
  }
  getSquareInfo(state) {
    const victoriousCoords = [];
    const possibilies = PlayerNumberMap.of(0, 0);
    for (let cx = 0; cx < TeekoState.WIDTH - 1; cx++) {
      for (let cy = 0; cy < TeekoState.WIDTH - 1; cy++) {
        const upLeft = new Coord(cx, cy);
        const upRight = new Coord(cx + 1, cy);
        const downLeft = new Coord(cx, cy + 1);
        const downRight = new Coord(cx + 1, cy + 1);
        const pieces = [
          state.getPieceAt(upLeft),
          state.getPieceAt(upRight),
          state.getPieceAt(downLeft),
          state.getPieceAt(downRight)
        ];
        const neutralCount = ArrayUtils.count(pieces, PlayerOrNone.NONE);
        const zeroCount = ArrayUtils.count(pieces, PlayerOrNone.ZERO);
        const oneCount = ArrayUtils.count(pieces, PlayerOrNone.ONE);
        if (neutralCount < 4) {
          if (zeroCount === 4 || oneCount === 4) {
            victoriousCoords.push(upLeft, upRight, downLeft, downRight);
          } else if (zeroCount > 0) {
            possibilies.add(Player.ZERO, 1);
          } else {
            possibilies.add(Player.ONE, 1);
          }
        }
      }
    }
    return {
      score: possibilies.get(Player.ONE) - possibilies.get(Player.ZERO),
      victoriousCoords
    };
  }
  getVictoryCoord(state) {
    const linesVictories = _TeekoRules.TEEKO_HELPER.getVictoriousCoord(state);
    const squareVictories = this.getSquareInfo(state).victoriousCoords;
    return linesVictories.concat(squareVictories);
  }
};

// games/dist/games/teeko/TeekoHeuristic.js
var TeekoHeuristic = class extends Heuristic {
  getBoardValue(node, _config) {
    const alignmentPossibilities = TeekoRules.TEEKO_HELPER.getBoardValue(node.gameState).metrics[0];
    const squarePossibilities = TeekoRules.get().getSquareInfo(node.gameState);
    return BoardValue.of(squarePossibilities.score + alignmentPossibilities);
  }
};

// games/dist/games/teeko/TeekoMoveGenerator.js
var TeekoMoveGenerator = class extends MoveGenerator {
  getListMoves(node, config) {
    if (node.gameState.isInDropPhase()) {
      return this.getListDrops(node.gameState);
    } else {
      return this.getListTranslations(node.gameState, config);
    }
  }
  getListDrops(state) {
    const moves = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      if (coordAndContent.content.isNone()) {
        const newMove = TeekoDropMove.from(coord);
        moves.push(newMove);
      }
    }
    return moves;
  }
  getListTranslations(state, config) {
    const moves = [];
    const currentPlayer = state.getCurrentPlayer();
    const piecePositions = this.getCoordsContaining(state, currentPlayer);
    for (const start of piecePositions) {
      for (const target of this.getPossibleTargets(state, start, config)) {
        const newMove = TeekoTranslationMove.from(start, target).get();
        moves.push(newMove);
      }
    }
    return moves;
  }
  getPossibleTargets(state, start, config) {
    if (config.teleport) {
      return this.getCoordsContaining(state, PlayerOrNone.NONE);
    } else {
      const possibleTargets = [];
      for (const direction of Ordinal.factory.all) {
        const target = start.getNext(direction);
        if (state.isEmptyAt(target)) {
          possibleTargets.push(target);
        }
      }
      return possibleTargets;
    }
  }
  getCoordsContaining(state, piece) {
    const coords = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      if (coordAndContent.content === piece) {
        coords.push(coordAndContent.coord);
      }
    }
    return coords;
  }
};

// games/dist/games/trexo/TrexoFailure.js
var TrexoFailure = class {
  static NON_NEIGHBORING_SPACES = () => $localize`Those two spaces are not neighbors!`;
  static NO_WAY_TO_DROP_IT_HERE = () => $localize`There is no way to put a piece there!`;
  static CANNOT_DROP_ON_ONLY_ONE_PIECE = () => $localize`You cannot drop on only one piece!`;
  static CANNOT_DROP_PIECE_ON_UNEVEN_GROUNDS = () => $localize`You cannot drop a piece on uneven grounds!`;
};

// games/dist/games/trexo/TrexoState.js
var TrexoPiece = class {
  owner;
  tileId;
  constructor(owner, tileId) {
    this.owner = owner;
    this.tileId = tileId;
  }
  toString() {
    return `TrexoPiece(${this.owner.toString()}, ${this.tileId})`;
  }
};
var TrexoPieceStack = class _TrexoPieceStack {
  pieces;
  static EMPTY = _TrexoPieceStack.of([]);
  static of(pieces) {
    let previousTurn = -1;
    for (const piece of pieces) {
      Utils.assert(previousTurn < piece.tileId, "TrexoPieceStack: dropped turn should be ascending");
      previousTurn = piece.tileId;
    }
    return new _TrexoPieceStack(pieces);
  }
  constructor(pieces) {
    this.pieces = pieces;
  }
  getHeight() {
    return this.pieces.length;
  }
  getOwner() {
    const numberOfPiece = this.pieces.length;
    if (numberOfPiece === 0) {
      return PlayerOrNone.NONE;
    } else {
      const lastPiece = this.pieces[numberOfPiece - 1];
      return lastPiece.owner;
    }
  }
  getUpperTileId() {
    const numberOfPiece = this.pieces.length;
    if (numberOfPiece === 0) {
      return -1;
    } else {
      const lastPiece = this.pieces[numberOfPiece - 1];
      return lastPiece.tileId;
    }
  }
  add(piece) {
    return _TrexoPieceStack.of(this.pieces.concat(piece));
  }
  getPieceAt(z) {
    Utils.assert(z < this.pieces.length, "no element " + z + "in piece!");
    return this.pieces[z];
  }
  isGround() {
    return this.getUpperTileId() === -1;
  }
  toString() {
    return "[" + this.pieces.map((piece) => {
      return "(" + piece.toString() + ")";
    }).join(" ") + "]";
  }
};
var TrexoState = class _TrexoState extends GameStateWithTable {
  static SIZE = 10;
  static isOnBoard(coord) {
    return coord.isInRange(_TrexoState.SIZE, _TrexoState.SIZE);
  }
  static of(board, turn) {
    Utils.assert(board.length === _TrexoState.SIZE, "Invalid board dimensions");
    for (const lines of board) {
      Utils.assert(lines.length === _TrexoState.SIZE, "Invalid board dimensions");
    }
    return new _TrexoState(board, turn);
  }
  drop(coord, player) {
    const newBoard = this.getCopiedBoard();
    const droppedPiece = new TrexoPiece(player, this.turn);
    newBoard[coord.y][coord.x] = newBoard[coord.y][coord.x].add(droppedPiece);
    return new _TrexoState(newBoard, this.turn);
  }
  incrementTurn() {
    return new _TrexoState(this.getCopiedBoard(), this.turn + 1);
  }
  toString() {
    return this.board.map((list) => {
      return "[" + list.map((space) => {
        return "TrexoPieceStack.of(" + space.toString() + ")";
      }).join(", ") + "]";
    }).join("\n,");
  }
  getPieceAtXYZ(x, y, z) {
    const stack = this.getPieceAtXY(x, y);
    return stack.getPieceAt(z);
  }
};

// games/dist/games/trexo/TrexoMove.js
var TrexoMove = class _TrexoMove extends MoveWithTwoCoords {
  static encoder = MoveWithTwoCoords.getFallibleEncoder(_TrexoMove.from);
  static from(zero, one) {
    Utils.assert(TrexoState.isOnBoard(zero), `${zero.toString()} is out of the TrexoBoard!`);
    Utils.assert(TrexoState.isOnBoard(one), `${one.toString()} is out of the TrexoBoard!`);
    const distance = zero.getOrthogonalDistance(one);
    if (distance === 1) {
      return MGPFallible.success(new _TrexoMove(zero, one));
    } else {
      return MGPFallible.failure(TrexoFailure.NON_NEIGHBORING_SPACES());
    }
  }
  constructor(first, second) {
    super(first, second);
  }
  toString() {
    return this.getFirst().toString() + " && " + this.getSecond().toString();
  }
  equals(other) {
    return this.getFirst().equals(other.getFirst()) && this.getSecond().equals(other.getSecond());
  }
  getZero() {
    return this.getFirst();
  }
  getOne() {
    return this.getSecond();
  }
};

// games/dist/games/trexo/TrexoRules.js
var TrexoRules = class _TrexoRules extends Rules {
  static instance = MGPOptional.empty();
  static get() {
    if (_TrexoRules.instance.isAbsent()) {
      _TrexoRules.instance = MGPOptional.of(new _TrexoRules());
    }
    return _TrexoRules.instance.get();
  }
  static getOwner(piece) {
    return piece.getOwner();
  }
  static TREXO_HELPER = new NInARowHelper(_TrexoRules.getOwner, 5);
  static getSquareScore(state, coord) {
    return _TrexoRules.TREXO_HELPER.getSquareScore(state, coord);
  }
  static getVictoriousCoords(state) {
    const victoryOfLastPlayer = [];
    const victoryOfNextPlayer = [];
    const previousPlayer = state.getPreviousPlayer();
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      const pieceOwner = state.getPieceAt(coord).getOwner();
      if (pieceOwner.isPlayer()) {
        const squareScore = _TrexoRules.getSquareScore(state, coord);
        if (BoardValue.isVictoryValue(squareScore)) {
          if (pieceOwner === previousPlayer) {
            victoryOfLastPlayer.push(coord);
          } else {
            victoryOfNextPlayer.push(coord);
          }
        }
      }
    }
    if (victoryOfNextPlayer.length > 0) {
      return victoryOfNextPlayer;
    } else {
      return victoryOfLastPlayer;
    }
  }
  getInitialState() {
    const board = TableUtils.create(TrexoState.SIZE, TrexoState.SIZE, TrexoPieceStack.EMPTY);
    return new TrexoState(board, 0);
  }
  applyLegalMove(move, state, _config, _info) {
    return state.drop(move.getZero(), Player.ZERO).drop(move.getOne(), Player.ONE).incrementTurn();
  }
  isLegal(move, state) {
    if (this.isUnevenGround(move, state)) {
      return MGPValidation.failure(TrexoFailure.CANNOT_DROP_PIECE_ON_UNEVEN_GROUNDS());
    }
    if (this.landsOnOnlyOnePiece(move, state)) {
      return MGPValidation.failure(TrexoFailure.CANNOT_DROP_ON_ONLY_ONE_PIECE());
    }
    return MGPValidation.SUCCESS;
  }
  isUnevenGround(move, state) {
    const zero = state.getPieceAt(move.getZero());
    const one = state.getPieceAt(move.getOne());
    return zero.getHeight() !== one.getHeight();
  }
  landsOnOnlyOnePiece(move, state) {
    const zeroSpace = state.getPieceAt(move.getZero());
    const oneSpace = state.getPieceAt(move.getOne());
    if (zeroSpace.getUpperTileId() === -1 && oneSpace.getUpperTileId() === -1) {
      return false;
    }
    return zeroSpace.getUpperTileId() === oneSpace.getUpperTileId();
  }
  getGameStatus(node) {
    const state = node.gameState;
    const previousPlayer = state.getPreviousPlayer();
    let lastPlayerAligned5 = false;
    for (const coordAndContent of state.getCoordsAndContents()) {
      const coord = coordAndContent.coord;
      const pieceOwner = coordAndContent.content.getOwner();
      if (pieceOwner.isPlayer()) {
        const squareScore = _TrexoRules.getSquareScore(state, coord);
        if (BoardValue.isVictoryValue(squareScore)) {
          if (pieceOwner === previousPlayer) {
            lastPlayerAligned5 = true;
          } else {
            return GameStatus.getDefeat(previousPlayer);
          }
        }
      }
    }
    if (lastPlayerAligned5) {
      return GameStatus.getVictory(previousPlayer);
    }
    return GameStatus.ONGOING;
  }
  getLegalMoves(state) {
    const moves = [];
    for (const coordAndContent of state.getCoordsAndContents()) {
      const upOrleftCord = coordAndContent.coord;
      if (upOrleftCord.x + 1 < TrexoState.SIZE) {
        const rightCoord = new Coord(upOrleftCord.x + 1, upOrleftCord.y);
        moves.push(...this.getPossiblesMoves(state, upOrleftCord, rightCoord));
      }
      if (upOrleftCord.y + 1 < TrexoState.SIZE) {
        const downCoord = new Coord(upOrleftCord.x, upOrleftCord.y + 1);
        moves.push(...this.getPossiblesMoves(state, upOrleftCord, downCoord));
      }
    }
    return moves;
  }
  getPossiblesMoves(state, first, second) {
    const firstStack = state.getPieceAt(first);
    const secondStack = state.getPieceAt(second);
    let tileHidesEntirelyOneTile;
    if (firstStack.isGround()) {
      tileHidesEntirelyOneTile = false;
    } else {
      tileHidesEntirelyOneTile = firstStack.getUpperTileId() === secondStack.getUpperTileId();
    }
    const stacksAreOnUnevenGround = firstStack.getHeight() !== secondStack.getHeight();
    if (tileHidesEntirelyOneTile || stacksAreOnUnevenGround) {
      return [];
    } else {
      return [
        TrexoMove.from(first, second).get(),
        TrexoMove.from(second, first).get()
      ];
    }
  }
};

// games/dist/games/trexo/TrexoAlignmentHeuristic.js
var TrexoAlignmentHeuristic = class extends Heuristic {
  getBoardValue(node, _config) {
    let score = 0;
    const state = node.gameState;
    for (const coordAndContent of state.getCoordsAndContents()) {
      const pieceOwner = coordAndContent.content.getOwner();
      if (pieceOwner.isPlayer()) {
        const squareScore = TrexoRules.getSquareScore(state, coordAndContent.coord);
        score += squareScore;
      }
    }
    return BoardValue.of(score);
  }
};

// games/dist/games/trexo/TrexoMoveGenerator.js
var TrexoMoveGenerator = class extends MoveGenerator {
  rules = TrexoRules.get();
  getListMoves(node, _config) {
    return this.rules.getLegalMoves(node.gameState);
  }
};

// games/dist/games/yinsh/YinshFailure.js
var YinshFailure = class {
  static PLACEMENT_AFTER_INITIAL_PHASE = () => $localize`You cannot put a new ring after the tenth turn.`;
  static NO_MARKERS_IN_INITIAL_PHASE = () => $localize`You cannot put a marker in a ring before placing all of your rings.`;
  static MISSING_CAPTURES = GipfFailure.MISSING_CAPTURES;
  static MOVE_DIRECTION_INVALID = () => $localize`The direction of your move is invalid: a move is made along a straight line.`;
  static CAN_ONLY_CAPTURE_YOUR_MARKERS = () => $localize`You can only capture your own markers.`;
  static SHOULD_SELECT_PLAYER_RING = () => $localize`You must pick one of your own rings to move.`;
  static SHOULD_END_MOVE_ON_EMPTY_SPACE = () => $localize`Your ring must land on an empty space.`;
  static MOVE_SHOULD_NOT_PASS_ABOVE_RING = () => $localize`A ring can only jump over markers or empty spaces, not over another ring.`;
  static MOVE_SHOULD_END_AT_FIRST_EMPTY_SPACE_AFTER_MARKERS = () => $localize`Your ring must land on the first empty space after a group of markers.`;
  static AMBIGUOUS_CAPTURE_COORD = GipfFailure.AMBIGUOUS_CAPTURE_COORD;
  static CAPTURE_SHOULD_TAKE_RING = () => $localize`When you capture markers, you must take one of your ring as well by clicking on it.`;
};

// games/dist/games/yinsh/YinshMove.js
var YinshCapture = class _YinshCapture extends GipfCapture {
  static encoder = Encoder.tuple([Encoder.list(Coord.encoder), MGPOptional.getEncoder(Coord.encoder)], (capture) => [capture.capturedSpaces, capture.ringTaken], (fields) => new _YinshCapture(fields[0], fields[1]));
  static of(start, end, ringTaken = MGPOptional.empty()) {
    const coords = [];
    const dir = HexaDirection.factory.fromMove(start, end).get();
    for (let cur = start; cur.equals(end) === false; cur = cur.getNext(dir)) {
      coords.push(cur);
    }
    coords.push(end);
    return new _YinshCapture(coords, ringTaken);
  }
  ringTaken;
  constructor(captured, ringTaken = MGPOptional.empty()) {
    super(captured);
    if (captured.length !== 5) {
      throw new Error("YinshCapture must capture exactly 5 pieces");
    }
    this.ringTaken = ringTaken;
  }
  setRingTaken(ringTaken) {
    return new _YinshCapture(this.capturedSpaces, MGPOptional.of(ringTaken));
  }
  equals(other) {
    if (super.equals(other) === false)
      return false;
    if (this.ringTaken.equals(other.ringTaken) === false)
      return false;
    return true;
  }
};
var YinshMove = class _YinshMove extends Move {
  initialCaptures;
  start;
  end;
  finalCaptures;
  static encoder = Encoder.tuple([
    Encoder.list(YinshCapture.encoder),
    Coord.encoder,
    MGPOptional.getEncoder(Coord.encoder),
    Encoder.list(YinshCapture.encoder)
  ], (move) => [move.initialCaptures, move.start, move.end, move.finalCaptures], (fields) => new _YinshMove(fields[0], fields[1], fields[2], fields[3]));
  constructor(initialCaptures, start, end, finalCaptures) {
    super();
    this.initialCaptures = initialCaptures;
    this.start = start;
    this.end = end;
    this.finalCaptures = finalCaptures;
  }
  isInitialPlacement() {
    return this.end.isAbsent();
  }
  equals(other) {
    if (this === other)
      return true;
    if (this.start.equals(other.start) === false)
      return false;
    if (this.end.equals(other.end) === false)
      return false;
    if (ArrayUtils.equals(this.initialCaptures, other.initialCaptures) === false)
      return false;
    if (ArrayUtils.equals(this.finalCaptures, other.finalCaptures) === false)
      return false;
    return true;
  }
  toString() {
    return "YinshMove([" + this.capturesToString(this.initialCaptures) + "], " + this.start.toString() + ", " + this.end.toString() + ", [" + this.capturesToString(this.finalCaptures) + "])";
  }
  capturesToString(captures) {
    return captures.map((y) => "[" + y.toString() + "]").join(", ");
  }
};

// games/dist/games/yinsh/YinshPiece.js
var YinshPiece = class _YinshPiece {
  player;
  isRing;
  static encoder = Encoder.tuple([PlayerOrNone.encoder, Encoder.identity()], (piece) => [piece.player, piece.isRing], (fields) => _YinshPiece.of(fields[0], fields[1]));
  static UNREACHABLE = new _YinshPiece(PlayerOrNone.NONE, false);
  static EMPTY = new _YinshPiece(PlayerOrNone.NONE, false);
  static MARKER_ZERO = new _YinshPiece(Player.ZERO, false);
  static MARKER_ONE = new _YinshPiece(Player.ONE, false);
  static MARKERS = PlayerMap.ofValues(_YinshPiece.MARKER_ZERO, _YinshPiece.MARKER_ONE);
  static RING_ZERO = new _YinshPiece(Player.ZERO, true);
  static RING_ONE = new _YinshPiece(Player.ONE, true);
  static RINGS = PlayerMap.ofValues(_YinshPiece.RING_ZERO, _YinshPiece.RING_ONE);
  static of(playerOrNone, isRing) {
    if (playerOrNone.isNone()) {
      return _YinshPiece.EMPTY;
    } else {
      const player = playerOrNone;
      if (isRing) {
        return _YinshPiece.RINGS.get(player);
      } else {
        return _YinshPiece.MARKERS.get(player);
      }
    }
  }
  constructor(player, isRing) {
    this.player = player;
    this.isRing = isRing;
  }
  equals(piece) {
    return this === piece;
  }
  flip() {
    Utils.assert(this.isRing === false, "cannot flip a ring (it should never happen)");
    Utils.assert(this.player.isPlayer(), "cannot flip a non-player piece");
    const player = this.player;
    return _YinshPiece.of(player.getOpponent(), this.isRing);
  }
  toString() {
    switch (this) {
      case _YinshPiece.UNREACHABLE:
        return "NONE";
      case _YinshPiece.EMPTY:
        return "EMPTY";
      case _YinshPiece.MARKER_ZERO:
        return "MARKER_ZERO";
      case _YinshPiece.MARKER_ONE:
        return "MARKER_ONE";
      case _YinshPiece.RING_ZERO:
        return "RING_ZERO";
      default:
        Utils.expectToBe(this, _YinshPiece.RING_ONE);
        return "RING_ONE";
    }
  }
  isReachable() {
    return this !== _YinshPiece.UNREACHABLE;
  }
  isMarker() {
    return this === _YinshPiece.MARKER_ZERO || this === _YinshPiece.MARKER_ONE;
  }
};

// games/dist/games/yinsh/YinshState.js
var YinshState = class _YinshState extends HexagonalGameState {
  sideRings;
  static SIZE = 11;
  constructor(board, sideRings, turn) {
    super(turn, board, _YinshState.SIZE, _YinshState.SIZE, [6, 4, 3, 2, 1], YinshPiece.EMPTY);
    this.sideRings = sideRings;
  }
  isInitialPlacementPhase() {
    return this.turn < 10;
  }
  countScores() {
    if (this.turn < 10) {
      return PlayerNumberMap.of(0, 0);
    } else {
      return this.sideRings;
    }
  }
  equals(other) {
    if (this === other) {
      return true;
    }
    if (this.turn !== other.turn) {
      return false;
    }
    if (this.sideRings.equals(other.sideRings) === false) {
      return false;
    }
    return TableUtils.equals(this.board, other.board);
  }
  getRingCoords(player) {
    const rings = [];
    this.forEachCoord((coord, content) => {
      if (content.isRing && content.player === player) {
        rings.push(coord);
      }
    });
    return rings;
  }
  isOnBoard(coord) {
    if (coord.isNotInRange(this.width, this.height)) {
      return false;
    } else {
      return this.getUnsafe(coord) !== YinshPiece.UNREACHABLE;
    }
  }
  setAtUnsafe(coord, value) {
    const newBoard = TableUtils.copy(this.board);
    newBoard[coord.y][coord.x] = value;
    return new _YinshState(newBoard, this.sideRings, this.turn);
  }
};

// games/dist/games/yinsh/YinshRules.js
var YinshRules = class _YinshRules extends Rules {
  static singleton = MGPOptional.empty();
  static get() {
    if (_YinshRules.singleton.isAbsent()) {
      _YinshRules.singleton = MGPOptional.of(new _YinshRules());
    }
    return _YinshRules.singleton.get();
  }
  getInitialState() {
    const _ = YinshPiece.EMPTY;
    const N = YinshPiece.UNREACHABLE;
    const board = [
      [N, N, N, N, N, N, _, _, _, _, N],
      [N, N, N, N, _, _, _, _, _, _, _],
      [N, N, N, _, _, _, _, _, _, _, _],
      [N, N, _, _, _, _, _, _, _, _, _],
      [N, _, _, _, _, _, _, _, _, _, _],
      [N, _, _, _, _, _, _, _, _, _, N],
      [_, _, _, _, _, _, _, _, _, _, N],
      [_, _, _, _, _, _, _, _, _, N, N],
      [_, _, _, _, _, _, _, _, N, N, N],
      [_, _, _, _, _, _, _, N, N, N, N],
      [N, _, _, _, _, N, N, N, N, N, N]
    ];
    return new YinshState(board, PlayerNumberMap.of(5, 5), 0);
  }
  applyLegalMove(_move, _state, _config, info) {
    const stateWithoutTurn = info;
    return new YinshState(stateWithoutTurn.board, stateWithoutTurn.sideRings, stateWithoutTurn.turn + 1);
  }
  applyCaptures(captures, state) {
    let computedState = state;
    captures.forEach((capture) => {
      computedState = this.applyCapture(capture, computedState);
    });
    return computedState;
  }
  applyCapture(capture, state) {
    const board = this.applyCaptureWithoutTakingRing(state, capture);
    return this.takeRing(new YinshState(board, state.sideRings, state.turn), capture.ringTaken.get());
  }
  takeRing(state, ringTaken) {
    const player = state.getCurrentPlayer();
    const board = state.setAt(ringTaken, YinshPiece.EMPTY).board;
    const sideRings = state.sideRings.getCopy();
    sideRings.add(player, 1);
    return new YinshState(board, sideRings, state.turn);
  }
  applyCaptureWithoutTakingRing(state, capture) {
    capture.forEach((coord) => {
      state = state.setAt(coord, YinshPiece.EMPTY);
    });
    return state.board;
  }
  ringSelectionValidity(state, coord) {
    const player = state.getCurrentPlayer();
    if (state.getPieceAt(coord) === YinshPiece.RINGS.get(player)) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(YinshFailure.CAPTURE_SHOULD_TAKE_RING());
    }
  }
  applyRingMoveAndFlip(start, end, state) {
    const player = state.getCurrentPlayer();
    let newState = state.setAt(start, YinshPiece.MARKERS.get(player));
    newState = newState.setAt(end, YinshPiece.RINGS.get(player));
    const dir = HexaDirection.factory.fromMove(start, end).get();
    for (let coord = start.getNext(dir); coord.equals(end) === false; coord = coord.getNext(dir)) {
      const piece = newState.getPieceAt(coord);
      if (piece !== YinshPiece.EMPTY) {
        newState = newState.setAt(coord, piece.flip());
      }
    }
    return newState;
  }
  isLegal(move, state) {
    if (move.isInitialPlacement()) {
      return this.initialPlacementValidity(state, move.start);
    }
    if (state.isInitialPlacementPhase()) {
      return MGPFallible.failure(YinshFailure.NO_MARKERS_IN_INITIAL_PHASE());
    }
    const initialCapturesValidity = this.capturesValidity(state, move.initialCaptures);
    if (initialCapturesValidity.isFailure()) {
      return initialCapturesValidity.toOtherFallible();
    }
    const stateAfterInitialCaptures = this.applyCaptures(move.initialCaptures, state);
    const moveValidity = this.moveValidity(stateAfterInitialCaptures, move.start, move.end.get());
    if (moveValidity.isFailure()) {
      return moveValidity.toOtherFallible();
    }
    const stateAfterRingMove = this.applyRingMoveAndFlip(move.start, move.end.get(), stateAfterInitialCaptures);
    const finalCapturesValidity = this.capturesValidity(stateAfterRingMove, move.finalCaptures);
    if (finalCapturesValidity.isFailure()) {
      return finalCapturesValidity.toOtherFallible();
    }
    const stateAfterFinalCaptures = this.applyCaptures(move.finalCaptures, stateAfterRingMove);
    const noMoreCapturesValidity = this.noMoreCapturesValidity(stateAfterFinalCaptures);
    if (noMoreCapturesValidity.isFailure()) {
      return noMoreCapturesValidity.toOtherFallible();
    }
    return MGPFallible.success(stateAfterFinalCaptures);
  }
  initialPlacementValidity(state, coord) {
    if (state.isInitialPlacementPhase() === false) {
      return MGPFallible.failure(YinshFailure.PLACEMENT_AFTER_INITIAL_PHASE());
    }
    if (state.getPieceAt(coord) !== YinshPiece.EMPTY) {
      return MGPFallible.failure(RulesFailure.MUST_CLICK_ON_EMPTY_SPACE());
    }
    const player = state.getCurrentPlayer();
    const sideRings = state.sideRings.getCopy();
    sideRings.add(player, -1);
    const newBoard = state.setAt(coord, YinshPiece.of(player, true)).board;
    const newState = new YinshState(newBoard, sideRings, state.turn);
    return MGPFallible.success(newState);
  }
  moveStartValidity(state, start) {
    const player = state.getCurrentPlayer();
    if (state.getPieceAt(start) === YinshPiece.RINGS.get(player)) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(YinshFailure.SHOULD_SELECT_PLAYER_RING());
    }
  }
  moveValidity(state, start, end) {
    const moveStartValidity = this.moveStartValidity(state, start);
    if (moveStartValidity.isFailure()) {
      return moveStartValidity;
    }
    if (state.getPieceAt(end) !== YinshPiece.EMPTY) {
      return MGPValidation.failure(YinshFailure.SHOULD_END_MOVE_ON_EMPTY_SPACE());
    }
    const directionOptional = HexaDirection.factory.fromMove(start, end);
    if (directionOptional.isFailure()) {
      return MGPValidation.failure(YinshFailure.MOVE_DIRECTION_INVALID());
    }
    const direction = directionOptional.get();
    let markersPassed = false;
    for (let cur = start.getNext(direction); cur.equals(end) === false; cur = cur.getNext(direction)) {
      const piece = state.getPieceAt(cur);
      if (piece === YinshPiece.EMPTY) {
        if (markersPassed) {
          return MGPValidation.failure(YinshFailure.MOVE_SHOULD_END_AT_FIRST_EMPTY_SPACE_AFTER_MARKERS());
        }
      } else if (piece.isRing) {
        return MGPValidation.failure(YinshFailure.MOVE_SHOULD_NOT_PASS_ABOVE_RING());
      } else {
        markersPassed = true;
      }
    }
    return MGPValidation.SUCCESS;
  }
  capturesValidity(state, captures) {
    let updatedState = state;
    for (const capture of captures) {
      const validity = this.captureValidity(updatedState, capture);
      if (validity.isFailure()) {
        return validity;
      }
      updatedState = this.applyCapture(capture, updatedState);
    }
    return MGPValidation.SUCCESS;
  }
  captureValidity(state, capture) {
    const player = state.getCurrentPlayer();
    for (const coord of capture.capturedSpaces) {
      if (state.getPieceAt(coord) !== YinshPiece.MARKERS.get(player)) {
        return MGPValidation.failure(YinshFailure.CAN_ONLY_CAPTURE_YOUR_MARKERS());
      }
    }
    if (state.getPieceAt(capture.ringTaken.get()) !== YinshPiece.RINGS.get(player)) {
      return MGPValidation.failure(YinshFailure.CAPTURE_SHOULD_TAKE_RING());
    }
    return MGPValidation.SUCCESS;
  }
  noMoreCapturesValidity(state) {
    const player = state.getCurrentPlayer();
    const linePortions = this.getLinePortionsWithAtLeastFivePiecesOfPlayer(state, player);
    if (linePortions.length === 0) {
      return MGPValidation.SUCCESS;
    } else {
      return MGPValidation.failure(YinshFailure.MISSING_CAPTURES());
    }
  }
  getLinePortionsWithAtLeastFivePiecesOfPlayer(state, player) {
    const linePortions = [];
    state.allLines().forEach((line) => {
      const linePortion = this.getLinePortionWithAtLeastFivePiecesOfPlayer(state, player, line);
      if (linePortion.isPresent()) {
        linePortions.push(linePortion.get());
      }
    });
    return linePortions;
  }
  getLinePortionWithAtLeastFivePiecesOfPlayer(state, player, line) {
    let consecutives = 0;
    const coord = state.getEntranceOnLine(line);
    const dir = line.getDirection();
    let start = coord;
    let cur;
    for (cur = coord; state.isOnBoard(cur); cur = cur.getNext(dir)) {
      const piece = state.getPieceAt(cur);
      if (piece.player === player && piece.isRing === false) {
        if (consecutives === 0) {
          start = cur;
        }
        consecutives += 1;
      } else {
        if (5 <= consecutives) {
          break;
        }
        consecutives = 0;
      }
    }
    if (5 <= consecutives) {
      return MGPOptional.of({ start, end: cur, dir });
    }
    return MGPOptional.empty();
  }
  getPossibleCaptures(state) {
    const player = state.getCurrentPlayer();
    const captures = [];
    this.getLinePortionsWithAtLeastFivePiecesOfPlayer(state, player).forEach((linePortion) => {
      for (let cur = linePortion.start; 5 <= cur.getLinearDistanceToward(linePortion.end); cur = cur.getNext(linePortion.dir)) {
        captures.push(YinshCapture.of(cur, cur.getNext(linePortion.dir, 4)));
      }
    });
    return captures;
  }
  getRingTargets(state, start) {
    const targets = [];
    for (const dir of HexaDirection.factory.all) {
      let pieceSeen = false;
      for (let cur = start.getNext(dir); state.isOnBoard(cur); cur = cur.getNext(dir)) {
        const piece = state.getPieceAt(cur);
        if (piece === YinshPiece.EMPTY) {
          targets.push(cur);
          if (pieceSeen) {
            break;
          }
        } else if (piece.isRing) {
          break;
        } else {
          pieceSeen = true;
        }
      }
    }
    return targets;
  }
  getGameStatus(node) {
    if (node.gameState.isInitialPlacementPhase()) {
      return GameStatus.ONGOING;
    }
    if (3 <= node.gameState.sideRings.get(Player.ZERO)) {
      return GameStatus.ZERO_WON;
    }
    if (3 <= node.gameState.sideRings.get(Player.ONE)) {
      return GameStatus.ONE_WON;
    }
    return GameStatus.ONGOING;
  }
};

// games/dist/games/yinsh/YinshMoveGenerator.js
var YinshMoveGenerator = class extends MoveGenerator {
  getListMoves(node, _config) {
    const moves = [];
    const state = node.gameState;
    if (state.isInitialPlacementPhase()) {
      for (const { coord, content } of state.getCoordsAndContents()) {
        if (content === YinshPiece.EMPTY) {
          moves.push(new YinshMove([], coord, MGPOptional.empty(), []));
        }
      }
    } else {
      const rules = YinshRules.get();
      this.getPossibleCaptureCombinations(state).forEach((initialCaptures) => {
        const stateAfterCapture = rules.applyCaptures(initialCaptures, state);
        this.getRingMoves(stateAfterCapture).forEach((ringMove) => {
          const stateAfterRingMove = rules.applyRingMoveAndFlip(ringMove.start, ringMove.end, stateAfterCapture);
          this.getPossibleCaptureCombinations(stateAfterRingMove).forEach((finalCaptures) => {
            const move = new YinshMove(initialCaptures, ringMove.start, MGPOptional.of(ringMove.end), finalCaptures);
            moves.push(move);
          });
        });
      });
    }
    return moves;
  }
  getPossibleCaptureCombinations(state) {
    const rules = YinshRules.get();
    const possibleCaptures = rules.getPossibleCaptures(state);
    const ringCoords = this.getRingCoords(state);
    return GipfProjectHelper.getPossibleCaptureCombinationsFromPossibleCaptures(possibleCaptures).map((captureCombination) => {
      return Combinatorics.getCombinations(ringCoords, captureCombination.length).map((ringsTaken) => {
        return captureCombination.map((capture, index) => {
          return new YinshCapture(capture.capturedSpaces, MGPOptional.of(ringsTaken[index]));
        });
      });
    }).reduce((accumulator, captures) => {
      return accumulator.concat(captures);
    }, []);
  }
  getRingMoves(state) {
    const rules = YinshRules.get();
    const moves = [];
    for (const start of this.getRingCoords(state)) {
      for (const end of rules.getRingTargets(state, start)) {
        moves.push({ start, end });
      }
    }
    return moves;
  }
  getRingCoords(state) {
    const player = state.getCurrentPlayer();
    const coords = [];
    state.forEachCoord((coord, content) => {
      if (content === YinshPiece.RINGS.get(player)) {
        coords.push(coord);
      }
    });
    return coords;
  }
};

// games/dist/games/yinsh/YinshScoreHeuristic.js
var YinshScoreHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(node, _config) {
    return node.gameState.sideRings.toTable();
  }
};

// games/dist/jscaip/AI/DummyHeuristic.js
var DummyHeuristic = class extends PlayerMetricHeuristic {
  getMetrics(_node, _config) {
    return PlayerNumberTable.ofSingle(0, 0);
  }
};

// games/dist/jscaip/Line.js
var Line = class {
  x1;
  y1;
  x2;
  y2;
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
};

export {
  MGPFallible,
  MGPValidation,
  Utils,
  MGPOptional,
  isJSONPrimitive,
  JSONParser,
  comparableEquals,
  ArrayUtils,
  Set2 as Set,
  MGPMap,
  TimeUtils,
  AbaloneFailure,
  Vector,
  Ordinal,
  Coord,
  HexaDirection,
  Move,
  AbaloneMove,
  AIStats,
  Debug,
  Player,
  PlayerOrNone,
  GameStatus,
  GameNodeStats,
  GameNode,
  FourStatePiece,
  RulesFailure,
  PlayerMap,
  PlayerNumberMap,
  CoordSet,
  TableUtils,
  TableWithPossibleNegativeIndices,
  Table3DUtils,
  FourStatePieceGameStateWithTable,
  AbaloneState,
  AbaloneRules,
  AbaloneMoveGenerator,
  AbaloneScoreHeuristic,
  ApagosFailure,
  ApagosFullBoardHeuristic,
  ApagosMove,
  ApagosState,
  ApagosRules,
  ApagosMoveGenerator,
  ApagosRightmostHeuristic,
  CheckersFailure,
  CheckersMove,
  CheckersPiece,
  CheckersStack,
  EvenCheckersState,
  OddCheckersState,
  BashniRules,
  CheckersControlHeuristic,
  CheckersControlPlusDominationHeuristic,
  CheckersMoveGenerator,
  CheckersScoreHeuristic,
  InternationalCheckersRules,
  LascaRules,
  CoerceoCapturesAndFreedomHeuristic,
  CoerceoFailure,
  CoerceoRegularMove,
  CoerceoTileExchangeMove,
  CoerceoMove,
  CoerceoMoveGenerator,
  CoerceoPiecesTilesFreedomHeuristic,
  Orthogonal,
  TriangularCheckerBoard,
  CoerceoState,
  CoerceoPiecesThreatsTilesHeuristic,
  CoerceoRules,
  ConnectSixFirstMove,
  ConnectSixDrops,
  ConnectSixMove,
  ConnectSixState,
  ConnectSixRules,
  ConnectSixAlignmentHeuristic,
  ConnectSixMoveGenerator,
  ConspirateursState,
  ConspirateursHeuristic,
  ConspirateursMoveDrop,
  ConspirateursMoveSimple,
  ConspirateursMoveJump,
  ConspirateursMove,
  ConspirateursRules,
  ConspirateursMoveGenerator,
  DiaballikDistanceHeuristic,
  DiaballikFailure,
  DiaballikBallPass,
  DiaballikTranslation,
  DiaballikMove,
  DiaballikPiece,
  DiaballikState,
  VictoryCoord,
  DefeatCoords,
  DiaballikRules,
  DiaballikMoveGenerator,
  DiaballikFilteredMoveGenerator,
  DiamFailure,
  DiamPiece,
  DiamMoveDrop,
  DiamMoveShift,
  DiamMoveEncoder,
  DiamState,
  DiamRules,
  DiamMoveGenerator,
  DvonnPieceStack,
  DvonnState,
  DvonnMove,
  DvonnRules,
  DvonnMaxStacksHeuristic,
  DvonnMoveGenerator,
  DvonnScoreHeuristic,
  EncapsuleFailure,
  EncapsulePiece,
  EncapsuleMove,
  EncapsuleSizeToNumberMap,
  EncapsuleState,
  EncapsuleSpace,
  EncapsuleRules,
  EncapsuleMoveGenerator,
  EpaminondasAttackHeuristic,
  EpaminondasFailure,
  EpaminondasMove,
  EpaminondasState,
  EpaminondasRules,
  EpaminondasMoveGenerator,
  EpaminondasPhalanxSizeAndFilterMoveGenerator,
  EpaminondasPieceThenRowDominationThenAlignmentThenRowPresenceHeuristic,
  EpaminondasPositionalHeuristic,
  GipfFailure,
  GipfCapture,
  GipfPlacement,
  GipfMove,
  PointyHexaOrientation,
  FlatHexaOrientation,
  GipfState,
  GipfRules,
  GipfMoveGenerator,
  GipfScoreHeuristic,
  GoMove,
  GoPiece,
  ScoreName,
  GoPhase,
  GoState,
  GobanUtils,
  GoRules,
  GoHeuristic,
  GoMoveGenerator,
  HexagonalGoRules,
  HexagonalGoHeuristic,
  HexagonalGoMoveGenerator,
  TriangularGoRules,
  TriangularGoHeuristic,
  TriangularGoMoveGenerator,
  ZoomedGoRules,
  HexodiaRules,
  HexodiaAlignmentHeuristic,
  HexodiaMove,
  HexodiaMoveGenerator,
  HiveFailure,
  HivePiece,
  HiveDropMove,
  HiveCoordToCoordMove,
  HiveMove,
  HiveSpiderRules,
  HiveState,
  HiveRules,
  HiveHeuristic,
  HiveMoveGenerator,
  KamisadoColor,
  KamisadoPiece,
  KamisadoBoard,
  KamisadoFailure,
  KamisadoState,
  KamisadoMove,
  KamisadoRules,
  KamisadoHeuristic,
  KamisadoMoveGenerator,
  LinesOfActionFailure,
  LinesOfActionState,
  LinesOfActionMove,
  LinesOfActionRules,
  LinesOfActionHeuristic,
  LinesOfActionMoveGenerator,
  LodestoneFailure,
  LodestoneMove,
  LodestonePieceNone,
  LodestonePiecePlayer,
  LodestonePieceLodestone,
  LodestonePressurePlateGroup,
  LodestonePressurePlate,
  LodestoneState,
  LodestoneRules,
  LodestoneMoveGenerator,
  LodestoneScoreHeuristic,
  MancalaDistribution,
  MancalaMove,
  MancalaFailure,
  MancalaState,
  MancalaRules,
  AwaleRules,
  AwaleMoveGenerator,
  BaAwaRules,
  BaAwaMoveGenerator,
  MancalaScoreHeuristic,
  KalahRules,
  KalahMoveGenerator,
  MartianChessPiece,
  MartianChessState,
  MartianChessMove,
  MartianChessMoveGenerator,
  MartianChessRules,
  MartianChessScoreHeuristic,
  P4State,
  P4Rules,
  P4Heuristic,
  P4Move,
  P4MoveGenerator,
  P4OrderedMoveGenerator,
  PentagoState,
  PentagoMove,
  PentagoMoveGenerator,
  PentagoRules,
  PenteState,
  PenteRules,
  PenteAlignmentHeuristic,
  PenteMove,
  PenteMoveGenerator,
  Coord3D,
  PylosCoord,
  PylosFailure,
  PylosHeuristic,
  PylosMoveFailure,
  PylosMove,
  PylosState,
  PylosRules,
  PylosMoveGenerator,
  QuartoPiece,
  QuartoState,
  QuartoRules,
  QuartoHeuristic,
  QuartoMove,
  QuartoMoveGenerator,
  QuebecCastlesTranslation,
  QuebecCastlesDrop,
  QuebecCastlesMove,
  QuebecCastlesRules,
  QuebecCastlesMoveGenerator,
  QuixoState,
  QuixoRules,
  QuixoHeuristic,
  QuixoMove,
  QuixoMoveGenerator,
  ReversiMove,
  ReversiState,
  ReversiHeuristic,
  ReversiMoveGenerator,
  ReversiRules,
  ToricReversiRules,
  SaharaMobilityHeuristic,
  SaharaCapturedThenCapturedFreedomThenAllFreedomsHeuristic,
  SaharaFailure,
  SaharaState,
  SaharaRules,
  SaharaFreedomHeuristic,
  SaharaMove,
  SaharaMoveGenerator,
  SiamFailure,
  SiamMove,
  SiamPiece,
  SiamState,
  SiamRules,
  SiamHeuristic,
  SiamMoveGenerator,
  SixFailure,
  SixState,
  SixRules,
  SixHeuristic,
  SixMove,
  SixMoveGenerator,
  SixFilteredMoveGenerator,
  SquarzHeuristic,
  SquarzMove,
  SquarzMoveGenerator,
  SquarzState,
  SquarzRules,
  TaflPawn,
  TaflPieceHeuristic,
  TaflPieceAndInfluenceHeuristic,
  TaflPieceAndControlHeuristic,
  TaflEscapeThenPieceThenControlHeuristic,
  TaflMoveGenerator,
  RelativePlayer,
  TaflState,
  BrandhubMove,
  BrandhubRules,
  HnefataflMove,
  HnefataflRules,
  TablutMove,
  TablutRules,
  TeekoDropMove,
  TeekoTranslationMove,
  TeekoMove,
  TeekoState,
  TeekoRules,
  TeekoHeuristic,
  TeekoMoveGenerator,
  TrexoFailure,
  TrexoPiece,
  TrexoPieceStack,
  TrexoState,
  TrexoMove,
  TrexoRules,
  TrexoAlignmentHeuristic,
  TrexoMoveGenerator,
  YinshFailure,
  YinshCapture,
  YinshMove,
  YinshPiece,
  YinshState,
  YinshRules,
  YinshMoveGenerator,
  YinshScoreHeuristic,
  MCTS,
  AIInstanceRegistry,
  createMinimaxFromConfig,
  createIterativeDeepeningMinimaxFromConfig,
  createMCTSFromConfig,
  DummyHeuristic,
  Line,
  LocaleUtils
};
//# sourceMappingURL=chunk-IZA66LHK.js.map
