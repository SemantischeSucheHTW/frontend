import Vue from 'vue'
import Router from 'vue-router'
import Default from './views/Default'
import Report from './views/Report'
import NotFound from './views/NotFound'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Default
    },
    {
      path: '/reports/:id',
      name: 'report',
      component: Report
    },
    {
      path: '/404',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    },
  ]
})
