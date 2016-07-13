import 'reflect-metadata'

/**
 * Decorator to add multi inheritance to a class
 * @param classes
 * @returns {function(Function): void}
 */
export function mixin(classes:Array<Function>) {
    return (constructor:Function):void => {
        classes.forEach(clazz => {
            Object.getOwnPropertyNames(clazz.prototype).forEach(name => {
                constructor.prototype[name] = clazz.prototype[name];
            });
        });
    }
}