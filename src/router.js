import Vue from 'vue'
import Router from 'vue-router'
import Default from './views/Default'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Default
    }
  ]
})
