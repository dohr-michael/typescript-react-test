import * as Rx              from 'rxjs'
import * as moment          from 'moment'
import * as Auth0Lock       from 'auth0-lock'

import {Option, None, Some} from '../../../option'
import Auth0Profile         from '../../models/Auth0Profile'


function clearStorage():IState {
    sessionStorage.removeItem('authUserToken');
    sessionStorage.removeItem('authUserProfile');
    sessionStorage.removeItem('authUserExpiration');
    return {
        authIdToken: None,
        authExpirationDate: None,
        authProfile: None,
    };
}

function readStorage():IState {
    return {
        authIdToken: Option.ofNullable(sessionStorage.getItem('authUserToken')),
        authExpirationDate: Option.ofNullable(sessionStorage.getItem('authUserExpiration')).map(s => moment(s, moment.ISO_8601)),
        authProfile: Option.ofNullable(Auth0Profile.fromJson(sessionStorage.getItem('authUserProfile'))),
    };
}

function saveStorage(idToken:string, expirationDate:moment.Moment, profile:Auth0Profile):IState {
    sessionStorage.setItem('authUserToken', idToken);
    sessionStorage.setItem('authUserProfile', profile.toJson());
    sessionStorage.setItem('authUserExpiration', expirationDate.toISOString());
    return {
        authIdToken: new Some(idToken),
        authExpirationDate: new Some(expirationDate),
        authProfile: new Some(profile),
    };
}

// TODO change that to configuration
const lock = new Auth0Lock('FtJA1PGVZNRuemsAFeoa9vLehOL9Rty3', 'dohrm.eu.auth0.com');

// States, Models and Reducers.

export interface IState {
    authIdToken:Option<string>,
    authExpirationDate:Option<moment.Moment>,
    authProfile:Option<Auth0Profile>
}

export const State:Rx.Observable<IState> = new Rx.BehaviorSubject(readStorage());

export const Actions = {
    open: new Rx.Subject<IState>(),
    auth: new Rx.Subject<IState>(),
    logout: new Rx.Subject<IState>(),
    check: new Rx.Subject<IState>()
};

export const Reducer = Rx.Observable.merge(
    Actions.open.map(() =>
        (state:IState)=> {
            lock.show({
                container: 'login-container',
                connections: ['google-oauth2']
            }, (err:any, p:any, t:string) => {
                if (!err) {
                    const identity = ( p.identities || [] ).find(obj => p.user_id === `${obj.provider}|${obj.user_id}`);
                    const profile = Auth0Profile.fromJsonObj(p);
                    const idToken = t;
                    const expirationDate = moment().add(identity ? identity.expires_in : 30, 'second');
                    Actions.auth.next(saveStorage(idToken, expirationDate, profile));
                }
            });
            return state;
        }
    ),
    Actions.auth.map((newState:IState) =>
        (state:IState) => {
            return Object.assign(state, newState);
        }
    ),
    Actions.logout.map(() =>
        (state:IState)=> {
            return Object.assign(state, clearStorage())
        }
    ),
    Actions.check.map(() =>
        (state:IState)=> {
            const items = readStorage();
            if (items.authIdToken.isEmpty() ||
                items.authProfile.isEmpty() ||
                items.authExpirationDate.isEmpty() ||
                moment().isAfter(items.authExpirationDate.get())) {
                return Object.assign(state, clearStorage());
            } else {
                return Object.assign(state, items)
            }
        }
    )
);