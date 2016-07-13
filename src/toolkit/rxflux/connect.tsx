import * as _     from 'lodash'
import * as React from 'react'
import * as Rx    from 'rxjs'

export default function connect<P,S,A>(selector:(s:A) => S):(c:React.ComponentClass<P & S>) => React.ComponentClass<P> {
    interface InternalContext {
        state$:Rx.Observable<A>
    }
    return (CW:React.ComponentClass<P & S>):React.ComponentClass<P> => {
        return class extends React.Component<P, S> {

            static contextTypes:React.ValidationMap<any> = {
                state$: React.PropTypes.object.isRequired
            };

            context:InternalContext;

            subscription:Rx.Subscription;

            constructor(props:any, context:InternalContext) {
                super(props, context);
            }

            shouldComponentUpdate(nextProps:P, nextState:S, nextContext:any):boolean {
                return !_.isEqual(nextProps, this.props) ||
                    !_.isEqual(nextState, this.state) ||
                    !_.isEqual(nextContext, this.context);
            }

            componentWillMount():void {
                const observer = this.context.state$.map(selector);
                this.subscription = observer
                    .subscribe((s:S) => this.setState(s));
            }

            componentWillUnmount():void {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                }
            }

            render():JSX.Element {
                console.log('rxflux#connect#render');
                return (
                    <CW { ...this.props } { ...this.state }/>
                );
            }
        }
    }
}