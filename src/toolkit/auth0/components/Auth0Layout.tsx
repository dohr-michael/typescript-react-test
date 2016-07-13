import * as React     from 'react'
import * as option    from '../../option'
import * as Rxflux    from '../../rxflux'
import * as Auth0Flux from './flux'

//import styles = require('./Auth0Layout.scss');

export class Auth0Layout extends React.Component<{idToken:option.Option<string>, checkAuth:()=>void, openAuth:()=>void}, {}> {


    componentWillMount():void {
        this.props.checkAuth();
    }

    render():JSX.Element {
        console.log('Auth0Layout');
        console.log(this.props);
        if(this.props.idToken.isEmpty()) {
            setTimeout(() => this.props.openAuth(), 0);
            return (
                <div>
                    <div id="login-container"></div>
                </div>
            )
        } else {
            return (
                <div>{ this.props.children }</div>
            )
        }
    }
}

const checkAuth = () => Auth0Flux.Actions.check.next();
const openAuth = () => Auth0Flux.Actions.open.next();

export default Rxflux.connect((s:Auth0Flux.IState) => {
    return {
        idToken: s.authIdToken,
        checkAuth: checkAuth,
        openAuth: openAuth
    }
})(Auth0Layout);



