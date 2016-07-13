// Node modules
import * as React                 from 'react'
import * as ReactRouter           from 'react-router'
import {createHashHistory}        from 'history'

import * as Rx                    from 'rxjs'


import * as Auth0                 from './toolkit/auth0'

import * as Rxflux                from './toolkit/rxflux'

// Tools


// App
import './app.scss'


const appHistory = ReactRouter.useRouterHistory(createHashHistory)({queryKey: false});

const Counters = {
    increment$: new Rx.Subject<number>(),
    decrement$: new Rx.Subject<number>(),
};

const initState = new Rx.BehaviorSubject<{counter:number}>({counter: 42});


const acts$ = Rx.Observable.merge(
    Counters.increment$.map(c => (state:{counter:number}) => Object.assign(state, {counter: state.counter + c})),
    Counters.decrement$.map(c => (state:{counter:number}) => Object.assign(state, {counter: state.counter - c}))
);

const state$ = Rxflux.createState(acts$, initState);

type AppContextTypes = {state$:Rx.Observable<Auth0.IState>}

class AppContext extends React.Component<{}, {}> implements React.ChildContextProvider<AppContextTypes> {

    static childContextTypes:React.ValidationMap<any> = {
        state$: React.PropTypes.object
    };

    getChildContext():AppContextTypes {
        return {
            state$: Rxflux.createState(
                Rx.Observable.merge(
                    Auth0.Reducer
                ),
                Rx.Observable.merge(
                    Auth0.State
                ))
        }
    }

    render():JSX.Element {
        return (
            <div>
                { this.props.children }
            </div>
        )
    }
}


class HelloWorld extends React.Component<{counter:number, inc:(e:number)=>void, dec:(e:number)=>void}, {}> {

    render():JSX.Element {
        return <div className="Toto">
            Hello, World
        </div>;
    }
}


export default (
    <AppContext>
        <ReactRouter.Router history={ appHistory }>
            <ReactRouter.Route component={ Auth0.RouteLayout }>
                <ReactRouter.Route component={ HelloWorld } path="/"/>
            </ReactRouter.Route>
        </ReactRouter.Router>
    </AppContext>
)
