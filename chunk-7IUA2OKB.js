import {
  Utils
} from "./chunk-KTC3UZQD.js";

// src/app/utils/Debug.ts
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
    } catch {
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
    } catch {
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

export {
  Debug
};
//# sourceMappingURL=chunk-7IUA2OKB.js.map
