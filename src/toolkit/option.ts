import * as _ from 'lodash'

/**
 * Option interface
 */
export abstract class Option<T> {

    static ofNullable<A>(item:A):Option<A> {
        if (!item) {
            return None;
        } else {
            return new Some(item);
        }
    }

    abstract get():T;

    abstract isEmpty():Boolean;

    isDefined():Boolean {
        return !this.isEmpty();
    };

    contains(value:T):Boolean {
        return this.isDefined() && _.isEqual(this.get(), value);
    }

    exists(predicate:(value:T) => Boolean):Boolean {
        return this.isDefined() && predicate(this.get());
    }

    filter(predicate:(value:T) => Boolean):Option<T> {
        return this.isDefined() && predicate(this.get()) ? this : None;
    }


    map<U>(transformer:(value:T) => U):Option<U> {
        return this.isDefined() ? new Some(transformer(this.get())) : None;
    }

    flatMap<U>(transformer:(value:T) => Option<U>):Option<U> {
        return this.isDefined() ? transformer(this.get()) : None;
    }

    getOrElse(other:T):T {
        return this.isDefined() ? this.get() : other;
    }

    orNull():T {
        return this.isDefined() ? this.get() : null;
    }
}

export class Some<T> extends Option<T> {
    value:T;

    constructor(val:T) {
        super();
        this.value = val;
    }

    get():T {
        return this.value;
    }

    isEmpty():Boolean {
        return false;
    }
}

class NoneCls<T> extends Option<T> {
    get<T>():T {
        return undefined;
    }

    isEmpty():Boolean {
        return true;
    }
}

export const None = new NoneCls<any>();
