import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../pages/Login/Login'
import Home from '../pages/Home/Home'
import Menu from '../pages/Menu/Menu'
import Role from '../pages/Role/Role'
import Log from '../pages/Log/Log'
import Dict from '../pages/Dict/Dict'
import Dept from '../pages/Dept/Dept'
import User from '../pages/User/User'
import WxMenu from '../pages/WxMenu/WxMenu'
import WxMenu2 from '../pages/WxMenu/WxMenu2'

import Info from '../pages/Info/Info'
import CollectionUser from '../pages/CollectionUser/CollectionUser'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Login,
      meta: {
        type: ''
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        type: ''
      }
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/home/menu',
          component: Menu,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/role',
          component: Role,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/log',
          component: Log,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/dict',
          component: Dict,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/dept',
          component: Dept,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/user',
          component: User,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/info',
          component: Info,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/collectionUser',
          component: CollectionUser,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/wxMenu',
          component: WxMenu,
          meta: {
            type: 'login'
          }
        },
        {
          path: '/home/wxMenu2/:id',
          component: WxMenu2,
          meta: {
            type: 'login'
          }
        }
      ],
      meta: {
        type: 'login'
      }
    }
  ]
});
