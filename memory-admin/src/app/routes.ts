import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Details } from './details/details';
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
  { // TODO: remove this route when not needed
    path: 'details/:id',
    component: Details,
    title: 'Details page',
  },
];

export default routeConfig;
