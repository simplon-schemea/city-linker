export function hookAttribute<T extends Node, K extends keyof T>(target: T, attributeName: K, callback: (oldValue: T[K] | null, newValue: T[K]) => any, once?: boolean) {
    const observer = new MutationObserver(function (mutations) {
        const [ mutation ] = mutations.filter(value => value.attributeName === attributeName);
        debugger
        if (mutation) {
            callback((mutation.oldValue as unknown as T[K]), target[attributeName]);

            if (once) {
                observer.disconnect();
            }
        }
    });

    observer.observe(target, { attributes: true });

    return observer;
}
