import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import RoomList from './views/RoomList.vue'
import RoomWait from './views/RoomWait.vue'
import GamePage from './views/GamePage.vue'
import CreateRoom from './views/CreateRoom.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/createroom',
      name: 'createroom',
      component: CreateRoom
    },
    {
      path: '/roomlist',
      name: 'roomlist',
      component: RoomList
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/gamepage/:id',
      name: 'gamepage',
      component: GamePage
    },
    {
      path: '/roomwait/:id',
      name: 'roomwait',
      component: RoomWait
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
