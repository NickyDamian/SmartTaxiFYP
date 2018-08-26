import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Menu from '@/components/Menu'
import Test from '@/components/Testing'
import RequestPage from '@/components/Reuse/InTransitStatusPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/r',
      name: 'requestPage',
      component: RequestPage
    }
  ]
})
