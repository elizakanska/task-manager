import { ChangeDetectionStrategy, Component, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Status } from '../../models/status.model';
import { Type } from '../../models/type.model';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  selector: 'app-tasks',
  standalone: true,
  styleUrls: ['./tasks.component.scss'],
  templateUrl: './tasks.component.html'
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
  taskTypes = signal<Map<number, Type>>(new Map());
  taskStatuses = signal<Map<number, Status>>(new Map());
  users = signal<User[]>([]);
  newType = '';
  newStatus = '';

  private searchTriggerSubj = new BehaviorSubject<string>('');

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private destroyRef: DestroyRef,
    private router: Router
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
    this.searchTriggerSubj.pipe(
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
        this.taskTypes.set(new Map(types.map(t => [t.id, t])));
        this.taskStatuses.set(new Map(statuses.map(s => [s.id, s])));
        this.users.set(users);
      },
      error: err => console.error('Error loading static data:', err)
    });
  }

  searchTasks(): void {
    this.searchTriggerSubj.next(this.searchQuery.trim());
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
          this.searchTasks();
        }
      });
    }
  }

  viewTaskDetails(taskId: number): void {
    this.selectedTask = this.tasks().find(t => t.id === taskId) ?? null;
    this.selectedTask ? this.showTaskDetails = true : this.router.navigate(['/notfound']);
  }

  closeTaskDetails(): void {
    this.showTaskDetails = false;
    this.selectedTask = null;
  }

  getTypeName(typeId: number): string {
    return this.taskTypes().get(typeId)?.name ?? this.handleMissingType(typeId);
  }

  getStatusName(statusId: number): string {
    return this.taskStatuses().get(statusId)?.name ?? this.handleMissingStatus(statusId);
  }

  private handleMissingType(typeId: number): string {
    console.error(`Type with ID ${typeId} not found in predefined types`);
    return 'INVALID TYPE';
  }

  private handleMissingStatus(statusId: number): string {
    console.error(`Status with ID ${statusId} not found in predefined statuses`);
    return 'INVALID STATUS';
  }

  getAssignedUserName(assignedTo: number | null): string {
    if (assignedTo === null) return 'UNASSIGNED';
    const user = this.users().find(u => u.id === assignedTo);
    return user ? `${user.firstName} ${user.lastName} (${user.username})` : 'UNASSIGNED';
  }

  addNewType(): void {
    const typeName = this.newType.trim();
    if (!typeName) return;

    this.taskService.addNewType(typeName).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (typesArray) => {
        const updatedTypes = new Map(typesArray.map(t => [t.id, t]));
        this.taskTypes.set(updatedTypes);
        this.newType = '';
      },
      error: (err) => console.error('Failed to add type:', err)
    });
  }

  addNewStatus(): void {
    const statusName = this.newStatus.trim();
    if (!statusName) return;

    this.taskService.addNewStatus(statusName).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (statusesArray) => {
        const updatedStatuses = new Map(statusesArray.map(s => [s.id, s]));
        this.taskStatuses.set(updatedStatuses);
        this.newStatus = '';
      },
      error: (err) => console.error('Failed to add status:', err)
    });
  }
}
