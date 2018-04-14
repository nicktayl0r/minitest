A minimal (< 25 SLOC, ~630 byte), zero-dependency ES6 annotated test runner with an [ospec][os] aesthetic
and serializable, streamable results. Meant as a building block for a custom JS test toolchain. Run tests
using `npm test`.


## Basic usage

```javascript
const runner = require('minitest');

const o = runner();

// Suite definition.
o('Math', () => {
    // Assertion.
    o `Addition` (1 + 1 === 2);
    o `Multiplication` (1 * 0 === 0);
});

// Callback fires syncronously on each assertion, so this will fire twice.
o.run((stackTrace, context, message) => {
    // stackTrace is a string from most relevant stack trace, otherwise null.
    // context === 'Math' && message === 'Addition',
    // then
    // context === 'Math' && message === 'Multiplication'
});
```


## I hope you like vanilla

`minitest` omits many conventional test runner features by design. There are no hooks like
`.beforeEach()` or `.after()`, no suite nesting/grouping, and no timeouts. This is only a
minimal queue to defer execution of annotated functions. Use closures or decorators to add
features.

```javascript
const o = require('o')();

// Before hook (per test)
const withRandomArray = next => next(Array.from('' + Math.random()).slice(2))

o('Math', withRandomArray((arr) => {
    o `Sum` (arr.reduce((p, c) => p + c));
    o `Product` (arr.reduce((p, c) => p * c));
}));


// Grouping tests via decoration.
o('E2E', () => {
    login();

    goToHomePage(() => {});

    goToHomePage(() => {});

    goToHomePage(() => {});

    logout();
});


o.run(...);
```

[os]: https://www.npmjs.com/package/ospec
