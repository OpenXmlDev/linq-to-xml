/**
 * @author Thomas Barnekow
 * @license MIT
 */

/**
 * Error thrown when an argument is invalid.
 *
 * @augments {Error}
 */
export class ArgumentError extends Error {
  constructor(message?: string, paramName?: string) {
    super(message);

    this.name = 'ArgumentError';
    this.paramName = paramName;

    // Set the stack property.
    // See https://github.com/microsoft/TypeScript/issues/1168#issuecomment-219296751
    this.stack = new Error().stack;

    // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ArgumentError.prototype);
  }

  /**
   * Gets the parameter name.
   */
  public paramName: string | undefined;
}

/**
 * Error thrown when the operation is invalid.
 *
 * @augments {Error}
 */
export class InvalidOperationError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'InvalidOperationError';
    this.stack = new Error().stack;
    Object.setPrototypeOf(this, ArgumentError.prototype);
  }
}
