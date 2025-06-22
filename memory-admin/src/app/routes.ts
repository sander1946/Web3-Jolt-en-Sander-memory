import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Details } from './details/details';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'login',
    component: Login,
    title: 'Login page',
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Details page',
  },
];

export default routeConfig;
