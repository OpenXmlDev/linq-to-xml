/**
 * A type that offers a well-defined conversion to a string representation.
 */
export type Stringifyable =
  | string
  | number
  | boolean
  | Date
  | StringifyableObject;

/**
 * Represents objects that can be converted to strings.
 */
export interface StringifyableObject {
  /**
   * Gets the object's string representation.
   *
   * @returns The object's string representation.
   */
  toString(): string;
}
