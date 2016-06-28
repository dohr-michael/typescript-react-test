/// <reference path="../typings/tsd.d.ts" />

import * as React            from 'react'
import * as ReactRouter      from 'react-router'
import { createHashHistory } from 'history'
import './app.scss'


const appHistory = ReactRouter.useRouterHistory(createHashHistory)({queryKey: false});

interface Toto {
    name ?: string,
    titi: string
}

class HelloWorld extends React.Component<{}, {}> {

    render():JSX.Element {
        const t: Toto = {titi: null};

        return <div className="Toto">Hello, World</div>;
    }
}


export default (
    <ReactRouter.Router history={ appHistory }>
        <ReactRouter.Route component={ HelloWorld } path="/"/>
    </ReactRouter.Router>
)
