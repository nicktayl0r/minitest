const runner = require('./index.js');

const meta = runner();

const withNewRunner = (next) => () => next(runner());

meta('Runners allow assertions', withNewRunner((o) => {
    const expected = ['x', 'y', 'z'];
    const annotation = 'Minimal test organization';

    o(annotation, () => {
        o `x` (1);
        o `y` (1);
        o `z` (1);
    });

    let index = 0;

    o.run((_, context, message) => {
        meta `${index} in bounds` (expected[index]);
        meta `Only one context` (annotation === context);
        meta `Assertions encountered in order` (expected[index] === message);
        ++index;
    });
}));


meta('Exceptions', withNewRunner((o) => {
    try {
        o `a` (1);
        meta `Did not throw when an assertion occurs outside of a test` ();
    } catch (e) {
        meta `Throws (assertion placement)` (e instanceof Error);
    }

    try {
        o('a', () => {});
        o.run();

        meta `Did not throw when given no callback` ();
    } catch (e) {
        meta `Throws (callback)` (e instanceof Error);
    }

    o('a', () => {
        o('b', () => {});
    });

    return o.run((error, context, msg) => {
        if (context === 'a') {
            meta `Counts nested suites as failures` (error);
        }
    });
}));


let last;
meta.run((stackTrace, context, message) => {
    if (last !== context) {
        last = context;
        console.log(context);
    }

    console.log(`  ${stackTrace ? 'F' : 'P'}: ${message}`);
    if (stackTrace) {
        console.log(`  ${stackTrace}`);
    }
});
