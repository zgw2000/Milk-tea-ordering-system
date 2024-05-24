import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import CustomerScreen from './views/CustomerScreen.vue'
import OperatorScreen from './views/OperatorScreen.vue'
import StatusScreen from './views/StatusScreen.vue'
import LoginScreen from './views/LoginScreen.vue'
import HistoryScreen from './views/HistoryScreen.vue'

const routes = [
  {
    path: "/customer/:customerId",
    component: CustomerScreen,
    props: (route: { params: { customerId: string } }) => ({ customerId: route.params.customerId }),
  },
  {
    path: "/operator/:operatorId",
    component: OperatorScreen,
    props: (route: { params: { operatorId: string } }) => ({ operatorId: route.params.operatorId }),
  },
  {
    path: "/",
    component: StatusScreen,
  },
  {
    path: "/login",
    component: LoginScreen,
  },
  {
    path: "/history/:customerId",
    component:HistoryScreen,
    props: (route: { params: { customerId: string } }) => ({ customerId: route.params.customerId }),
    
  },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})
// helped by chatgpt
// redirect guardian
router.beforeEach((to, _from, next) => {
  const isLoggedIn = checkLoggedIn();
  const userType = getUserType();
  console.log('userType',userType);
  console.log('isLoggedIn',isLoggedIn);
  if (!isLoggedIn && to.path !== '/login') {
    next('/login'); // if it's not logged in and not in the block page, redirect to block page
  } else {
    next(); // continue to redirect
  }
});
// check if user is logged in
const checkLoggedIn=()=> {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'username' && value) {
      return true; // if find the cookie, prove it's logged in
    }
  }
  return false;
}
// get the user type
const  getUserType=()=> {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'userType' && value) {
      return value; // return user type
    }
  }
  return null;
}

createApp(App)
	.use(BootstrapVue as any)
	.use(BootstrapVueIcons as any)
	.use(router)
	.mount('#app')

