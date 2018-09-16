import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Menu from '@/components/Menu'
import Test from '@/components/Testing'
import Histories from '@/components/History'
import Admin from '@/components/Admin'

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
      path: '/history',
      name: 'history',
      component: Histories
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    }
  ]
})
