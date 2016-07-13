/// <reference path="react/react.d.ts" />
/// <reference path="react/react-dom.d.ts" />
/// <reference path="react-router/history.d.ts" />
/// <reference path="react-router/react-router.d.ts" />
/// <reference path="core-js/core-js.d.ts" />
/// <reference path="lodash/lodash.d.ts" />
/// <reference path="moment/moment-node.d.ts" />
/// <reference path="moment/moment.d.ts" />
/// <reference path="auth0.lock/auth0.lock.d.ts" />
/// <reference path="auth0/auth0.d.ts" />

declare module "rxjs" {
    import Rx = require("node_modules/rxjs/Rx")
    export = Rx;
}
