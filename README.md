# LINQ to XML for TypeScript

[![codecov](https://codecov.io/gh/OpenXmlDev/linq-to-xml/branch/main/graph/badge.svg?token=43I75GLRHM)](https://codecov.io/gh/OpenXmlDev/linq-to-xml)

In .NET, [LINQ to XML](https://docs.microsoft.com/en-us/dotnet/standard/linq/linq-xml-overview) provides
an in-memory XML programming interface that leverages the .NET Language-Integrated Query (LINQ) Framework.
This package provides a corresponding implementation of LINQ to XML in TypeScript that leverages the
[@tsdotnet/linq](https://github.com/tsdotnet/linq) package, which provides features similar to LINQ.

## Installing

Run `npm install @openxmldev/linq-to-xml` to install the library.

## Documentation

- [API documentation](https://openxmldev.github.io/linq-to-xml)

## Building

Run `nx build linq-to-xml` to build the library.

## Running Unit Tests

Run `nx test linq-to-xml` to execute the unit tests via [Jest](https://jestjs.io).

## Examples

In short words, usage is pretty much identical to .NET, just with some 
[language-specific differences](#language-specific-differences) described further below. Have a
look at the [API documentation](https://openxmldev.github.io/linq-to-xml) to see what is on offer.

### Importing

Simply import the well-known classes from `@openxmldev/linq-to-xml`. For example:

```typescript
import { XAttribute, XElement, XName, XNamespace } from '@openxmldev/linq-to-xml';
```

### Namespaces and Names

Using Office Open XML as an example, the following code snippet shows how namespaces and names can
be declared:

```typescript
class W {
  public static readonly w: XNamespace = XNamespace.get(
    'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  );

  public static get namespaceDeclaration(): XAttribute {
    return new XAttribute(XNamespace.xmlns.getName('w'), W.w.namespaceName);
  }

  public static readonly document: XName = W.w.getName('document');
  public static readonly body: XName = W.w.getName('body');
  public static readonly p: XName = W.w.getName('p');
  public static readonly r: XName = W.w.getName('r');
  public static readonly t: XName = W.w.getName('t');
}

class W14 {
  public static readonly w14: XNamespace = XNamespace.get(
    'http://schemas.microsoft.com/office/word/2010/wordml'
  );

  public static get namespaceDeclaration(): XAttribute {
    return new XAttribute(
      XNamespace.xmlns.getName('w14'),
      W14.w14.namespaceName
    );
  }

  public static readonly docId: XName = W14.w14.getName('docId');
  public static readonly paraId: XName = W14.w14.getName('paraId');
  public static readonly textId: XName = W14.w14.getName('textId');
}
```

The C# language would allow you to create `XNamespace` and `XName` instances as follows,
using implicit conversion operators defined by those classes:

```csharp
XNamespace w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
XName document = w + "document";
XName body = w + "body";
```

This is not possible in TypeScript, so the above would be written as follows, which is exactly what
you would write in C# if you initialized those instances explicitly:

```typescript
const w = XNamespace.get('http://schemas.openxmlformats.org/wordprocessingml/2006/main');
const document = w.getName('document');
const body = w.getName('body');
```

### Elements and Attributes

Using the above names, you could create a super-simple "Hello World!" document as follows:

```typescript
const document =
  new XElement(W.document,
    W.namespaceDeclaration,
    W14.namespaceDeclaration,
    new XElement(W.body,
      new XElement(W.p,
        new XAttribute(W14.paraId, '12345678'),
        new XElement(W.r,
          new XElement(W.t, 'Hello World!')))));
```

### Language-Integrated Query (LINQ)

The following code snippet shows just one simple example of how you might use the LINQ-related
features.

Say you have a document with many paragraphs, all of which have a unique `w14:paraId` attribute.
If you want to get the one and only paragraph having a given `w14:paraId` value, you would first
get the `w:p` descendants of your `w:document` root element and then pick the single `w:p` element
having the desired `w14:paraId` value, if it exists at all.

Here's what you would do in LINQ to XML:

```typescript
const paragraph = document
  .descendants(W.p)
  .singleOrDefault((p) => p.attribute(W14.paraId)?.value === '12345678');
```

The above would give you all descendant `w:p` elemens, including those paragraphs included in
tables. If you wanted to restrict this to just the `w:p` elements that are direct children of
the `w:body` element, here is what you can do:

```typescript
const paragraph = document
  .elements(W.body)
  .elements(W.p)
  .singleOrDefault((p) => p.attribute(W14.paraId)?.value === '12345678');
```

If you wanted to get an array of all `w14:paraId` values for all `w:p` elements, here is what you
would do:

```typescript
const paraIds = document
  .descendants(W.p)
  .attributes(W14.paraId)
  .select((paraId) => paraId.value)
  .toArray();
```

Have a look at the [LinqElements](https://openxmldev.github.io/linq-to-xml/classes/LinqElements.html)
class to see which general (e.g., `singleOrDefault()`, `select()`, `toArray()`) and XML-specific
(e.g., `descendants()`, `elements()`, `attributes()`) LINQ methods are supported by this package.

## Language-specific Differences

### Naming Conventions

In C#, you use pascal case for property and method names. For example, the `XElement` class has the
`Name` and `FirstAttribute` properties and the `Attributes()` and `DescendantsAndSelf()` methods.

In JavaScript and TypeScript, you use camel case for property and method names. For example, the
property and method names corresponding to the above would be `name`, `firstAttribute`,`attributes()`,
and `descendantsAndSelf()`, respectively.

### Default Values

It is important to appreciate the differences between C# vs. JavaScript and TypeScript regarding
the default values used for different types, e.g., as assigned by using the `default` keyword in
C# or when not explicitly initializing fields or variables in JavaScript.

In C#, the `default` values are defined as follows:
- nullable (e.g., `string`) and non-nullable (e.g.,`string?`) reference types: `null`
- nullable value (e.g., `int?`, `bool?`) types: `null`
- non-nullable value types (e.g., `int`, `bool`): `0` and `false`, for example

In JavaScript, there is no `default` keyword. However, the default value for uninitialized fields
or variables is `undefined` in all cases, including `number` or `boolean`, for example.

In TypeScript, you must either explicitly allow `undefined` in the declaration or use the non-null
assertion operator (`!`) to assign `undefined`. At run-time, however, TypeScript is just JavaScript.

Now, let's look at the signature of the well-known `FirstOrDefault()` extension method in C# (based
on the .NET 6 documentation, which just uses `TSource` instead of `T`):

```csharp
public static T? FirstOrDefault<T>(this IEnumerable<T> source);
```

Based on our understanding of the default values, the most natural signature in TypeScript is the
following:

```typescript
firstOrDefault(): T | undefined;
```

The above is also what is offered by the corresponding method of the
[LinqIterable<T>](https://openxmldev.github.io/linq-to-xml/classes/LinqIterable.html#firstOrDefault)
class.

On an _abstract_ level, the C# and TypeScript counterparts behave in the same way. For empty sequences,
they both return the respective default values. Let that sink in for a moment.

On a _concrete_ level, however, the language-specific difference between the default values for 
non-nullable value types in C# (e.g., `int`, `bool`) and the corresponding types in TypeScript
(e.g., `number`, `boolean`) is that:
- in C#, the default values are `0` and `false`, respectively; and
- in TypeScript, the default value is `undefined` in all cases.

Should you want to receive a value other than `undefined` in case the sequence is empty, the following
overload of the [LinqIterable<T>](https://openxmldev.github.io/linq-to-xml/classes/LinqIterable.html#firstOrDefault)
class will come to the rescue:

```typescript
firstOrDefault(defaultValue: T): T;
```

The above overload even corresponds to the following C# overload, which was introduced in .NET 6
(again using `T` instead of `TSource`):

```csharp
public static T FirstOrDefault<T>(this IEnumerable<T> source, T defaultValue);
```
