// user.component.ts
import { ChangeDetectionStrategy, Component, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgClass } from '@angular/common';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    NzCheckboxModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  users = signal<User[]>([]);
  showUserForm = false;
  editingUser: User | null = null;
  userFormGroup: FormGroup;
  searchQuery = '';
  selectedUser: User | null = null;
  showUserDetails = false;
  changePassword = false;
  isSubmitting = false;

  private searchTrigger$ = new BehaviorSubject<string>('');

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {
    this.userFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.searchTrigger$.pipe(
      switchMap(query => this.userService.getUsers(query)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: users => this.users.set(users),
      error: err => console.error(err)
    });
  }

  searchUsers(): void {
    this.searchTrigger$.next(this.searchQuery.trim());
  }

  openUserForm(user: User | null = null): void {
    this.editingUser = user;
    this.changePassword = false;
    this.userFormGroup = this.fb.group({
      username: [user?.username ?? '', Validators.required],
      password: [''],
      firstName: [user?.firstName ?? '', Validators.required],
      lastName: [user?.lastName ?? '', Validators.required]
    });
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.editingUser = null;
    this.changePassword = false;
    this.isSubmitting = false;
  }

  saveUser(): void {
    if (this.userFormGroup.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const formValue = {
      ...this.userFormGroup.value,
      id: this.editingUser?.id
    };

    if (this.editingUser && !this.changePassword) {
      formValue.password = this.editingUser.password;
    }

    const userOperation$ = this.editingUser
      ? this.userService.editUser(this.editingUser.id, formValue)
      : this.userService.addUser(formValue);

    userOperation$.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (users) => {
        this.users.set(users);
        this.closeUserForm();
      },
      error: (err) => {
        console.error('Error saving user:', err);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure?')) {
      this.userService.deleteUser(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (users) => {
          this.users.set(users);
        },
        error: (err) => {
          console.error(err);
          this.searchTrigger$.next(this.searchQuery);
        }
      });
    }
  }

  viewUserDetails(userId: number): void {
    this.selectedUser = this.users().find(u => u.id === userId) ?? null;
    this.showUserDetails = !!this.selectedUser;
  }

  closeUserDetails(): void {
    this.showUserDetails = false;
    this.selectedUser = null;
  }
}
