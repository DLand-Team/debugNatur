import { WIA, withImmerAPI, WithImmerAPI, withImmerAPIInterceptor, withAPI } from './../src/interceptors';
import { thunkMiddleware, ImmerThunkParams } from './../src/index';
import { createStore } from 'natur';
import {
    ThunkParams,
    promiseMiddleware,
    fillObjectRestDataMiddleware,
    shallowEqualMiddleware, 
    filterUndefinedMiddleware,
} from 'natur/dist/middlewares';


const _createStore = () => {
    const state = {
        name: 'tom',
        age: 10,
        deepAge: {
            age: 10,
        },
        todo: [
            {
                name: 'study english',
                status: 0,
                id: 0,
            }
        ]
    };
    type State = typeof state;
    const actions = {
        updateAge: (age: number) => ({setState}: ImmerThunkParams<State>) => {
            return setState(s => {
                s.age = age;
            });;
        },
        withAPIUpdateAge: withAPI((age: number, {setState, getState}: WIA<State>) =>  {
            return setState(s => {
                expect(s).toEqual(getState())
                s.age = age;
            });
        }),
        updateAgeAsync: (age: number) => ({setState}: ImmerThunkParams<State>) => {
            return setState(async s => {
                await new Promise(res => setTimeout(res, 100));
                s.deepAge.age = age;
            });;
        },
        withAPIUpdateAgeNoArg: withAPI(({setState, getState}: WIA<State>) =>  {
            return setState(s => {
                expect(s).toEqual(getState())
                s.age = 0;
            });
        }),
        withAPIUpdateAgeMoreArg: withAPI((age: number, {setState, getState}: WIA<State>) =>  {
            return setState(s => {
                expect(s).toEqual(getState())
                s.age = age;
            });
        }),
        withAPIUpdateAgeLessArg: withAPI((age: number, name: string, {setState, getState}: WIA<State>) =>  {
            return setState(s => {
                expect(s).toEqual(getState())
                expect(name).toEqual(undefined);
                s.age = age;
            });
        }),

        withAPIUpdateAgeErrorNumArg: withAPI((age: number, name: string, {setState, getState}: WIA<State>) =>  {
            return setState(s => {
                s.age = age;
            });
        }),
    }

    return createStore({
        user: {
            state,
            actions,
        }
    }, {}, {
        interceptors: [withImmerAPIInterceptor],
        middlewares: [
            thunkMiddleware, // action支持返回函数，并获取最新数据
            promiseMiddleware, // action支持异步操作
            fillObjectRestDataMiddleware, // 增量更新/覆盖更新
            shallowEqualMiddleware, // 新旧state浅层对比优化
            filterUndefinedMiddleware, // 过滤无返回值的action
        ]
    })
}

let store = _createStore();
beforeEach(() => {
    store = _createStore();
});


test('normal', () => {
    expect(store.getModule('user').state.age).toBe(10);
    store.dispatch('user', 'updateAge', 1);
    expect(store.getModule('user').state.age).toBe(1);
});

test('normal with api', () => {
    expect(store.getModule('user').state.age).toBe(10);
    store.dispatch('user', 'withAPIUpdateAge', 1);
    expect(store.getModule('user').state.age).toBe(1);
})

test('with api with no args', () => {
    expect(store.getModule('user').state.age).toBe(10);
    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeNoArg', 1, 2,3);
    expect(store.getModule('user').state.age).toBe(0);

    store.dispatch('user', 'updateAge', 10);
    expect(store.getModule('user').state.age).toBe(10);
    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeNoArg', 1);
    expect(store.getModule('user').state.age).toBe(0);


    store.dispatch('user', 'updateAge', 10);
    expect(store.getModule('user').state.age).toBe(10);

    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeNoArg');
    expect(store.getModule('user').state.age).toBe(0);
});

test('with api with more args', () => {
    expect(store.getModule('user').state.age).toBe(10);
    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeMoreArg', 1, 2, 3);
    expect(store.getModule('user').state.age).toBe(1);


    store.dispatch('user', 'updateAge', 10);
    expect(store.getModule('user').state.age).toBe(10);


    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeMoreArg', 2);
    expect(store.getModule('user').state.age).toBe(2);

});



test('with api with less args', () => {
    expect(store.getModule('user').state.age).toBe(10);
    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeLessArg', 1);
    expect(store.getModule('user').state.age).toBe(1);


    store.dispatch('user', 'updateAge', 10);
    expect(store.getModule('user').state.age).toBe(10);


    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeLessArg', 1, undefined, undefined, undefined);
    expect(store.getModule('user').state.age).toBe(1);


})




test('with api with error args', () => {
    expect(store.getModule('user').state.age).toBe(10);

    // @ts-ignore
    store.dispatch('user', 'withAPIUpdateAgeErrorNumArg');
    expect(store.getModule('user').state.age).toBe(undefined);

})