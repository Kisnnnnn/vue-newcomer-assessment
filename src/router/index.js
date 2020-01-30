import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Add from '../views/add.vue';
import List from '../views/list.vue';
import Edit from '../views/edit.vue';
import Detail from '../views/detail.vue';
import MyExam from '../views/my-exam.vue';
import MyCheck from '../views/my-check.vue';
import ExamResult from '../views/exam-result.vue';
import ExamCheck from '../views/exam-check.vue';
import Login from '../views/login.vue';
import RegisterSuccess from '../views/register_success.vue';
import Register from '../views/register.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  name: 'home',
  component: Home,
  children: [{
    path: '',
    redirect: '/list'
  }, {
    path: '/add',
    component: Add
  }, {
    path: '/list',
    component: List
  }, {
    path: '/detail',
    component: Detail
  }, {
    path: '/edit',
    component: Edit
  }, {
    path: '/my-exam',
    component: MyExam
  }, {
    path: '/my-check',
    component: MyCheck
  }, {
    path: '/exam-result',
    component: ExamResult
  }, {
    path: '/exam-check',
    component: ExamCheck
  }]
}, {
  path: '/login',
  name: 'login',
  component: Login
}, {
  path: '/register',
  name: 'register',
  component: Register
}, {
  path: '/registersuccess',
  name: 'registersuccess',
  component: RegisterSuccess
}];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
