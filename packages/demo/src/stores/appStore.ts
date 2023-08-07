const initState = () => {
  return {
    info:"123"
  };
};

const appStore = {
  // 状态
  state: initState(),
  // 计算属性
  maps: {},
  // 操作
  actions: {},
};

export default appStore;
