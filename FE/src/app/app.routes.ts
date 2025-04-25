import {Routes} from '@angular/router';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {TasksComponent} from './pages/tasks/tasks.component';
import {UsersComponent} from './pages/users/users.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', component: WelcomeComponent},
  { path: 'tasks', component: TasksComponent},
  { path: 'users', component: UsersComponent},
  { path: 'not-found', component: NotFoundComponent}
]
