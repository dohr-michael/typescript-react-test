import * as Rx from 'rxjs'


export default function createState<S>(actions: Rx.Observable<(a:S) => S>, initialState: Rx.Observable<S>):Rx.Observable<S> {
    return initialState
        .merge(actions)
        .scan((state:S, reducer:(r:S) => S) => reducer(state))
        .publishReplay(1)
        .refCount();
}