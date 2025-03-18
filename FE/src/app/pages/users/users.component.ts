import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared.module';
import { UserService } from '../../services/user.service';
import { Subscription, switchMap } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  showUserForm = false;
  editingUser: User | null = null;
  userFormGroup: FormGroup;
  searchQuery: string = '';
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

  loadUsers() {
    const userSub = this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = [...this.users];
      },
      error: (err) => console.error('Error loading users:', err)
    });
    this.subscriptions.add(userSub);
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  searchUsers() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  openUserForm(user: User | null = null) {
    this.editingUser = user;
    if (user) {
      this.userFormGroup?.setValue({
        username: user.username,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName
      });
    } else {
      this.userFormGroup?.reset();
    }
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
      id: this.editingUser ? this.editingUser.id : 0
    };

    const saveSub = (this.editingUser
        ? this.userService.editUser(this.editingUser.id, userData)
        : this.userService.addUser(userData)
    ).pipe(
      switchMap(() => this.userService.getUsers())
    ).subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
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
    if (confirm("Are you sure you want to delete this user?")) {
      const deleteSub = this.userService.deleteUser(id).pipe(
        switchMap(() => this.userService.getUsers())
      ).subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = [...this.users];
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
