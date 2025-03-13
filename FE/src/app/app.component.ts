import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {SharedModule} from './modules/shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCollapsed = false;
  title: 'Task Manager' | undefined;
}
