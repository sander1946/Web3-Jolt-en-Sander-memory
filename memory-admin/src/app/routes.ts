import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home | Memory Admin',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Dashboard | Memory Admin',
  },
  {
    path: 'login',
    component: Login,
    title: 'Login | Memory Admin',
  },
];

export default routeConfig;
