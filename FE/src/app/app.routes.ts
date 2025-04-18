import {Routes} from '@angular/router';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {TasksComponent} from './pages/tasks/tasks.component';
import {UsersComponent} from './pages/users/users.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', component: WelcomeComponent},
  { path: 'tasks', component: TasksComponent},
  { path: 'users', component: UsersComponent},
]
