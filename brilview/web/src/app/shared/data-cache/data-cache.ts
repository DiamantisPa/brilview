import { Subject } from 'rxjs/Subject';


export class DataCache {

    onSetData$: Subject<{key: string, data: any}>;
    onChange$: Subject<void>;
    cache = {};

    constructor() {
        this.onChange$ = new Subject<void>();
        this.onSetData$ = new Subject<{key: string, data: any}>();
    }

    setData(key: string, data: any) {
        this.cache[key] = data;
        this.onSetData$.next({key: key, data: data});
        this.onChange$.next();
    }

    getData(key: string) {
        if (this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        } else {
            return undefined;
        }
    }

    getKeys() {
        return Object.keys(this.cache);
    }

    removeData(key: string) {
        if(this.cache.hasOwnProperty(key)) {
            delete this.cache[key];
            this.onChange$.next();
            return true;
        } else {
            return false;
        }
    }

    clear() {
        const keys = this.getKeys();
        if (keys.length > 0) {
            Object.keys(this.cache).forEach(prop => {
                delete this.cache[prop];
            });
            this.onChange$.next();
        }
    }

    getSize() {
        return Object.keys(this.cache).length;
    }
}
