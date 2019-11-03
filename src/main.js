// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import axios from 'axios'
import frameHeader from './wibgets/frameHeader.vue';
import './css/style.scss';

//main.js中引入并注册到charts对象上

import echarts from 'echarts'
import {AutoShowTip} from "./js/tools";
echarts.AutoShowTip = AutoShowTip;
Vue.prototype.$echarts = echarts;


//Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.component('frame-header',frameHeader);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
