/**
 * @author Thomas Barnekow
 * @license MIT
 */

import { XNamespace } from './internal.js';

/** @internal */
class NamespaceDeclaration {
  prefix: string = undefined!;
  ns: XNamespace = undefined!;
  scope: number = undefined!;
  prev: NamespaceDeclaration = undefined!;
}

/** @internal */
export class NamespaceResolver {
  private _scope = 0;
  private _declaration: NamespaceDeclaration | null = null;
  private _rover: NamespaceDeclaration | null = null;

  pushScope(): void {
    this._scope++;
  }

  popScope(): void {
    let d = this._declaration;
    if (d !== null) {
      do {
        d = d.prev;
        if (d.scope !== this._scope) break;

        if (d === this._declaration) {
          this._declaration === null;
        } else {
          this._declaration!.prev = d.prev;
        }

        this._rover = null;
      } while (d !== this._declaration && this._declaration !== null);
    }

    this._scope--;
  }

  add(prefix: string, ns: XNamespace): void {
    const d = new NamespaceDeclaration();
    d.prefix = prefix;
    d.ns = ns;
    d.scope = this._scope;

    if (this._declaration === null) {
      this._declaration = d;
    } else {
      d.prev = this._declaration.prev;
    }

    this._declaration.prev = d;
    this._rover = null;
  }

  addFirst(prefix: string, ns: XNamespace): void {
    const d = new NamespaceDeclaration();
    d.prefix = prefix;
    d.ns = ns;
    d.scope = this._scope;

    if (this._declaration === null) {
      d.prev = d;
    } else {
      d.prev = this._declaration.prev;
      this._declaration.prev = d;
    }

    this._declaration = d;
    this._rover = null;
  }

  // Only elements allow default namespace declarations. The rover
  // caches the last namespace declaration used by an element.
  getPrefixOfNamespace(
    ns: XNamespace,
    allowDefaultNamespace: boolean
  ): string | null {
    if (
      this._rover !== null &&
      this._rover.ns === ns &&
      (allowDefaultNamespace || this._rover.prefix.length > 0)
    ) {
      return this._rover.prefix;
    }

    let d = this._declaration;
    if (d !== null) {
      do {
        d = d.prev;
        if (d.ns === ns) {
          let x = this._declaration!.prev;
          while (x !== d && x.prefix !== d.prefix) {
            x = x.prev;
          }

          if (x === d) {
            if (allowDefaultNamespace) {
              this._rover = d;
              return d.prefix;
            } else if (d.prefix.length > 0) {
              return d.prefix;
            }
          }
        }
      } while (d !== this._declaration);
    }
    return null;
  }
}
