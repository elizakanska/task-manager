import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  showUserForm = false;
  editingUser: User | null = null;
  userFormGroup: FormGroup;
  searchQuery: string = '';
  selectedUser: User | null = null;
  showUserDetails = false;
  private subscriptions = new Subscription();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(query: string = '') {
    this.subscriptions.add(
      this.userService.getUsers(query).subscribe({
        next: (data) => (this.users = data),
        error: (err) => console.error('Error loading users:', err)
      })
    );
  }

  searchUsers() {
    this.loadUsers(this.searchQuery.trim());
  }

  openUserForm(user: User | null = null) {
    this.editingUser = user;
    this.userFormGroup.setValue({
      username: user?.username ?? '',
      password: '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? ''
    });
    this.showUserForm = true;
  }

  closeUserForm() {
    this.showUserForm = false;
    this.editingUser = null;
  }

  saveUser() {
    if (this.userFormGroup.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const userOperation$ = this.editingUser
      ? this.userService.editUser(this.editingUser.id, this.userFormGroup.value)
      : this.userService.addUser(this.userFormGroup.value);

    this.subscriptions.add(
      userOperation$.pipe(switchMap(() => this.userService.getUsers())).subscribe({
        next: (data) => {
          this.users = data;
          this.closeUserForm();
        },
        error: (err) => console.error('Error saving user:', err)
      })
    );
  }

  editUser(user: User) {
    this.openUserForm(user);
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.subscriptions.add(
        this.userService.deleteUser(id).pipe(switchMap(() => this.userService.getUsers())).subscribe({
          next: (data) => (this.users = data),
          error: (err) => console.error('Error deleting user:', err)
        })
      );
    }
  }

  viewUserDetails(userId: number) {
    this.subscriptions.add(
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.selectedUser = user;
          this.showUserDetails = true;
        },
        error: (err) => console.error('Error loading user details:', err)
      })
    );
  }

  closeUserDetails() {
    this.showUserDetails = false;
    this.selectedUser = null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
