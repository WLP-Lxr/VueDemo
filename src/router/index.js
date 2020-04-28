import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import Login from '@/page/Login'
import Index from '@/page/Index'
import Iframe from '@/page/iframe/iframe'
import Query from '@/page/article/normalquery'
import User from '@/page/user/user'
import View from '@/page/article/view'
import DataBaseTables from '@/page/article/dataBase_tables'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {path: "", component: Index},
        {path:"/articleManage", component:Query},
        {path:"/view", component: View, children:[{path:"/tables", component:DataBaseTables}]},
        {path:"/Iframe/:path", component:Iframe},
        {path:"/user", component:User}
      ]
    }
  ]
})
