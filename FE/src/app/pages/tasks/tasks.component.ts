import { ChangeDetectionStrategy, Component, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { DatePipe, NgClass } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule,
    NgClass,
    NzSelectModule,
    NzDatePickerModule,
    FormsModule,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  tasks = signal<Task[]>([]);
  showTaskForm = false;
  editingTask: Task | null = null;
  taskFormGroup: FormGroup;
  searchQuery = '';
  selectedTask: Task | null = null;
  showTaskDetails = false;
  isSubmitting = false;
  taskTypes = signal<{ id: number; name: string }[]>([]);
  taskStatuses = signal<{ id: number; name: string }[]>([]);
  users = signal<User[]>([]);
  newType = '';
  newStatus = '';

  private searchTrigger$ = new BehaviorSubject<string>('');

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {
    this.taskFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      createdOn: [new Date(), Validators.required],
      typeId: [null, Validators.required],
      statusId: [null, Validators.required],
      assignedTo: [null]
    });

    this.setupDataStreams();
    this.loadStaticData();
  }

  private setupDataStreams(): void {
    this.searchTrigger$.pipe(
      switchMap(query => this.taskService.getTasks(query)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: tasks => this.tasks.set(tasks),
      error: err => console.error(err)
    });
  }

  private loadStaticData(): void {
    combineLatest([
      this.taskService.getTaskTypes(),
      this.taskService.getTaskStatuses(),
      this.userService.getUsers()
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ([types, statuses, users]) => {
        this.taskTypes.set(types);
        this.taskStatuses.set(statuses);
        this.users.set(users);
      },
      error: err => console.error('Error loading static data:', err)
    });
  }

  searchTasks(): void {
    this.searchTrigger$.next(this.searchQuery.trim());
  }

  openTaskForm(task: Task | null = null): void {
    this.editingTask = task;
    this.taskFormGroup = this.fb.group({
      title: [task?.title ?? '', Validators.required],
      description: [task?.description ?? '', Validators.required],
      createdOn: [task?.createdOn ?? new Date(), Validators.required],
      typeId: [task?.typeId ?? null, Validators.required],
      statusId: [task?.statusId ?? null, Validators.required],
      assignedTo: [task?.assignedTo ?? null]
    });
    this.showTaskForm = true;
  }

  closeTaskForm(): void {
    this.showTaskForm = false;
    this.editingTask = null;
    this.isSubmitting = false;
  }

  saveTask(): void {
    if (this.taskFormGroup.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const formValue = {
      ...this.taskFormGroup.value,
      id: this.editingTask?.id
    };

    const taskOperation$ = this.editingTask
      ? this.taskService.editTask(this.editingTask.id, formValue)
      : this.taskService.addTask(formValue);

    taskOperation$.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (updatedTasks) => {
        this.tasks.set(updatedTasks);
        this.closeTaskForm();
      },
      error: (err) => {
        console.error('Error saving task:', err);
        alert(`Error saving task: ${err.error?.message || err.message}`);
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure?')) {
      this.taskService.deleteTask(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (updatedTasks) => this.tasks.set(updatedTasks),
        error: (err) => {
          console.error(err);
          this.searchTrigger$.next(this.searchQuery.trim());
        }
      });
    }
  }

  viewTaskDetails(taskId: number): void {
    this.selectedTask = this.tasks().find(t => t.id === taskId) ?? null;
    this.showTaskDetails = !!this.selectedTask;
  }

  closeTaskDetails(): void {
    this.showTaskDetails = false;
    this.selectedTask = null;
  }

  getTypeName(typeId: number): string {
    const type = this.taskTypes().find(t => t.id === typeId);
    return type?.name || 'Unknown Type';
  }

  getStatusName(statusId: number): string {
    const status = this.taskStatuses().find(s => s.id === statusId);
    return status?.name || 'Unknown Status';
  }

  getAssignedUserName(assignedTo: number | null): string {
    if (assignedTo === null) return 'UNASSIGNED';
    const user = this.users().find(u => u.id === assignedTo);
    return user ? `${user.firstName} ${user.lastName} (${user.username})` : 'UNASSIGNED';
  }

  addNewType(): void {
    if (!this.newType.trim()) return;
    this.taskService.addNewType(this.newType.trim()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (types) => {
        this.taskTypes.set(types);
        this.newType = '';
      },
      error: (err) => console.error('Failed to add type:', err)
    });

  }

  addNewStatus(): void {
    if (!this.newStatus.trim()) return;
    this.taskService.addNewStatus(this.newStatus.trim()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (statuses) => {
        this.taskStatuses.set(statuses);
        this.newStatus = '';
      },
      error: (err) => console.error('Failed to add status:', err)
    });
  }
}
