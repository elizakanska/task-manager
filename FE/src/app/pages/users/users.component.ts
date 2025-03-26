import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
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
    NgClass,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  showUserForm = false;
  editingUser: User | null = null;
  userFormGroup: FormGroup;
  searchQuery = '';
  selectedUser: User | null = null;
  showUserDetails = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
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
    const userSub = this.userService.getUsers(query).subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err) => console.error('Error loading users:', err)
    });
    this.subscriptions.add(userSub);
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
      this.userFormGroup.markAllAsTouched();
      return;
    }

    const userData: User = {
      ...this.userFormGroup.value,
      ...(this.editingUser && { id: this.editingUser.id })
    };

    const saveSub = (this.editingUser
        ? this.userService.editUser(this.editingUser.id, userData)
        : this.userService.addUser(userData)
    ).subscribe({
      next: (savedUser) => {
        if (this.editingUser) {
          const index = this.users.findIndex(user => user.id === savedUser.id);
          if (index !== -1) {
            this.users[index] = savedUser;
          }
        } else {
          this.users.push(savedUser);
        }
        this.closeUserForm();
      },
      error: (err) => console.error('Error saving user:', err)
    });

    this.subscriptions.add(saveSub);
  }

  editUser(user: User) {
    this.openUserForm(user);
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      const deleteSub = this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (err) => console.error('Error deleting user:', err)
      });

      this.subscriptions.add(deleteSub);
    }
  }


  viewUserDetails(userId: number) {
    const detailsSub = this.userService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.selectedUser = user;
        this.showUserDetails = true;
      },
      error: (err) => console.error('Error loading user details:', err)
    });

    this.subscriptions.add(detailsSub);
  }

  closeUserDetails() {
    this.showUserDetails = false;
    this.selectedUser = null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
