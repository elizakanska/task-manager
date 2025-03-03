import { Routes } from '@angular/router';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {TasksComponent} from './pages/tasks/tasks.component';
import {AddComponent} from './pages/add/add.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', component: WelcomeComponent},
  { path: 'tasks', component: TasksComponent},
  { path: 'add', component: AddComponent},
]
