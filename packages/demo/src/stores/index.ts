import { createStore, createUseInject } from "natur";
import { thunkMiddleware } from "natur-immer";
import {
	fillObjectRestDataMiddleware,
	filterUndefinedMiddleware,
	promiseMiddleware,
	shallowEqualMiddleware,
} from "natur/dist/middlewares";
import appStore from "./appStore";

// MODERATE_AUTO_STORES_1:START
const stores = {
	appStore,
};
// MODERATE_AUTO_STORES_1:END
export const store = createStore(
	stores, // 同步加载模块
	{}, // 懒加载模块
	{
		middlewares: [
			thunkMiddleware,
			promiseMiddleware,
			fillObjectRestDataMiddleware,
			shallowEqualMiddleware,
			filterUndefinedMiddleware,
		],
	} //中间价
);
export const useInject = createUseInject(() => store);
export const useFlatInject = createUseInject(() => store, { flat: true });

// 初始化所有仓库
export const initAllStores = ({
	excludes = [],
}: { excludes?: string[] } = {}) => {
	sessionStorage.clear();
	store.globalResetStates();
};
