import { GenMapsType, Maps, Middleware, State } from "natur";
import produce from "immer";

export interface ImmerThunkParams<S extends any = any, M extends Maps = any> {
  setState(ps: Partial<S> | ((s: S) => any)): S;
  getState(): S;
  getMaps: () => GenMapsType<M, S>;
  /**
   * please use localDispatch instead
   * @deprecated
   * @param moduleNameAndActionName
   * @param params
   */
  dispatch: (moduleNameAndActionName: string, ...params: any) => any;
  localDispatch: (actionName: string, ...params: any) => any;
}

export interface ITP<S extends any = any, M extends Maps = any> extends ImmerThunkParams<S, M> {}

export const thunkMiddleware: Middleware<any> =
  ({ getState, getMaps, dispatch }) =>
  (next) =>
  (record) => {
    if (typeof record.state === "function") {
      const setState = (s: State | ((s: State) => any)) => {
        if (typeof s === "function") {
          return next({
            ...record,
            state: produce(s)(getState()),
          });
        }
        return next({
          ...record,
          state: s,
        });
      };
      const _dispatch = (action: string, ...arg: any[]) => {
        if (/^\w+\/\w+$/.test(action)) {
          const moduleName = action.split("/")[0];
          const actionName = action.split("/").slice(1).join("/");
          return dispatch(moduleName, actionName, ...arg);
        }
        return dispatch(record.moduleName, action, ...arg);
      };
      const localDispatch = (action: string, ...arg: any[]) => {
        return dispatch(record.moduleName, action, ...arg);
      };

      return next({
        ...record,
        state: record.state({
          getState: getState,
          setState,
          getMaps,
          dispatch: _dispatch,
          localDispatch,
        }),
      });
    }
    return next(record);
  };
