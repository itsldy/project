import './assets/main.css'

import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import { message } from 'ant-design-vue';
import App from './App.vue'

const app = createApp(App);

// 全局注册 Ant Design Vue 组件
app.use(Antd);
// 全局配置 message
app.config.globalProperties.$message = message; 
app.mount('#app');
