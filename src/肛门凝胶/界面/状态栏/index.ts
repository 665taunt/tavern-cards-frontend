import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

// 两次等待缺一不可：
//   1. 等 MVU 脚本把 Mvu 全局挂出来（否则下面读不到 stat_data）
//   2. 等本层楼的 stat_data 真正就位
// 直接 mount 会在变量尚未初始化时读到空值，渲染出全默认的面板。
// 楼层切到后台时整体暂停动画，回来再继续，避免多楼层同时空转
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('is-background', document.hidden);
});

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
});
