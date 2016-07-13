import * as Rx              from 'rxjs'
import * as moment          from 'moment'
import * as Auth0Lock       from 'auth0-lock'

import {Option, None, Some} from '../../../option'
import Auth0Profile         from '../../models/Auth0Profile'


function clearStorage():void {
    sessionStorage.removeItem('authUserToken');
    sessionStorage.removeItem('authUserProfile');
    sessionStorage.removeItem('authUserExpiration');
}

function readStorage():[Option<string>, Option<moment.Moment>, Option<Auth0Profile>] {
    const idToken = Option.ofNullable(sessionStorage.getItem('authUserToken'));
    const expirationDate = Option.ofNullable(sessionStorage.getItem('authUserExpiration')).map(s => moment(s, moment.ISO_8601));
    const profile = Option.ofNullable(Auth0Profile.fromJson(sessionStorage.getItem('authUserProfile')));
    return [idToken, expirationDate, profile];
}

function saveStorage(idToken:string, expirationDate:moment.Moment, profile:Auth0Profile):void {
    sessionStorage.setItem('authUserToken', idToken);
    sessionStorage.setItem('authUserProfile', profile.toJson());
    sessionStorage.setItem('authUserExpiration', expirationDate.toISOString());
}

function emptyState():IState {
    clearStorage();
    return {
        authIdToken: None,
        authExpirationDate: None,
        authProfile: None,
    }
}

function populatedState(idToken:string, expirationDate:moment.Moment, profile:Auth0Profile):IState {
    saveStorage(idToken, expirationDate, profile);
    return {
        authIdToken: new Some(idToken),
        authExpirationDate: new Some(expirationDate),
        authProfile: new Some(profile),
    }
}

// TODO change that to configuration
const lock = new Auth0Lock('FtJA1PGVZNRuemsAFeoa9vLehOL9Rty3', 'dohrm.eu.auth0.com');

// States, Models and Reducers.

export interface IState {
    authIdToken:Option<string>,
    authExpirationDate:Option<moment.Moment>,
    authProfile:Option<Auth0Profile>
}

export const State:Rx.Observable<IState> = new Rx.BehaviorSubject(emptyState())

export const Actions = {
    open: new Rx.Subject<IState>(),
    logout: new Rx.Subject<IState>(),
    check: new Rx.Subject<IState>()
};

export const Reducer = Rx.Observable.merge(
    Actions.open.map(() =>
        (state:IState)=> {
            console.log("Auth0#Actions -> open");
            const result = new Rx.BehaviorSubject(state);
            // TODO.
            lock.show({
                container: 'login-container',
                connections: ['google-oauth2']
            }, (err:any, p:any, t:string) => {
                if (!err) {
                    const identity = ( p.identities || [] ).find(obj => p.user_id === `${obj.provider}|${obj.user_id}`);
                    const profile = Auth0Profile.fromJson(p);
                    const idToken = t;
                    const expirationDate = moment().add(identity ? identity.expires_in : 30, 'second');

                    result.next(populatedState(idToken, expirationDate, profile))
                }
            });
            return state;
        }
    ),
    Actions.logout.map(() =>
        (state:IState)=> {
            console.log("Auth0#Actions -> logout");
            return Object.assign(state, emptyState())
        }
    ),
    Actions.check.map(() =>
        (state:IState)=> {
            console.log("Auth0#Actions -> check");
            const items = readStorage();
            if (items[0].isEmpty() || items[1].isEmpty() || items[2].isEmpty() || moment().isAfter(items[1].get())) {
                return Object.assign(state, emptyState());
            } else {
                return Object.assign(state, populatedState(items[0].get(), items[1].get(), items[2].get()))
            }
        }
    )
);