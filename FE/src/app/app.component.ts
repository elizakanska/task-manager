import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent
} from 'ng-zorro-antd/layout';
import {NzMenuDirective, NzMenuItemComponent} from 'ng-zorro-antd/menu';
import {NzIconDirective} from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, NzLayoutComponent, NzSiderComponent, NzMenuDirective, NzMenuItemComponent, NzIconDirective, NzHeaderComponent, NzContentComponent, NzFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCollapsed = false;
  title: 'Task Manager' | undefined;
}
