import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { Task } from '../../models/task.model';
import { Type } from '../../models/type.model';
import { Status } from '../../models/status.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzFormModule,
    DatePipe,
    ReactiveFormsModule,
    NgClass,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showTaskForm = false;
  editingTask: Task | null = null;
  taskFormGroup: FormGroup;
  searchQuery = '';
  selectedTask: Task | null = null;
  showTaskDetails = false;
  typeOptions: Type[] = [];
  statusOptions: Status[] = [];
  newType = '';
  newStatus = '';
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      typeId: [null, Validators.required],
      statusId: [null, Validators.required],
      createdOn: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    const loadSub = forkJoin([
      this.taskService.getTaskTypes(),
      this.taskService.getTaskStatuses(),
      this.taskService.getTasks()
    ]).subscribe(([types, statuses, tasks]) => {
      this.typeOptions = types;
      this.statusOptions = statuses;
      this.tasks = tasks;
      this.filteredTasks = [...tasks];
    });
    this.subscriptions.add(loadSub);
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  searchTasks() {
    this.filteredTasks = this.searchQuery.trim()
      ? this.tasks.filter(task =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      : [...this.tasks];
  }

  openTaskForm(task: Task | null = null) {
    this.editingTask = task;
    this.taskFormGroup.setValue({
      title: task?.title ?? '',
      description: task?.description ?? '',
      typeId: task?.typeId ?? null,
      statusId: task?.statusId ?? null,
      createdOn: task?.createdOn ?? null
    });
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  saveTask() {
    if (this.taskFormGroup.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const { createdOn, typeId, statusId, ...taskData } = this.taskFormGroup.value;
    const taskPayload = { ...taskData, createdOn: new Date(createdOn), typeId, statusId };

    const taskOperation$ = this.editingTask
      ? this.taskService.editTask(this.editingTask.id, taskPayload)
      : this.taskService.addTask(taskPayload);

    const saveSub = taskOperation$.pipe(
      switchMap(() => this.taskService.getTasks())
    ).subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
        this.closeTaskForm();
      },
      error: (err) => console.error('Error saving task:', err)
    });

    this.subscriptions.add(saveSub);
  }

  editTask(task: Task) {
    this.openTaskForm(task);
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      const deleteSub = this.taskService.deleteTask(id).pipe(
        switchMap(() => this.taskService.getTasks())
      ).subscribe({
        next: (data) => {
          this.tasks = data;
          this.filteredTasks = [...this.tasks];
        },
        error: (err) => console.error('Error deleting task:', err)
      });
      this.subscriptions.add(deleteSub);
    }
  }

  viewTaskDetails(id: number) {
    this.selectedTask = this.tasks.find(t => t.id === id) ?? null;
    this.showTaskDetails = !!this.selectedTask;
  }

  closeTaskDetails() {
    this.selectedTask = null;
    this.showTaskDetails = false;
  }

  addNewType() {
    if (this.newType.trim()) {
      const newTypeName = this.newType.trim();
      const addTypeSub = this.taskService.addNewType(newTypeName).pipe(
        switchMap(() => this.taskService.getTaskTypes())
      ).subscribe({
        next: (types) => {
          this.typeOptions = types;
          this.newType = '';
        },
        error: (err) => console.error('Error adding new type:', err)
      });
      this.subscriptions.add(addTypeSub);
    }
  }

  addNewStatus() {
    if (this.newStatus.trim()) {
      const newStatusName = this.newStatus.trim();
      const addStatusSub = this.taskService.addNewStatus(newStatusName).pipe(
        switchMap(() => this.taskService.getTaskStatuses())
      ).subscribe({
        next: (statuses) => {
          this.statusOptions = statuses;
          this.newStatus = '';
        },
        error: (err) => console.error('Error adding new status:', err)
      });
      this.subscriptions.add(addStatusSub);
    }
  }

  getStatusName(statusId: number): string {
    return this.statusOptions.find(option => option.id === statusId)?.name ?? 'Unknown';
  }

  getTypeName(typeId: number): string {
    return this.typeOptions.find(option => option.id === typeId)?.name ?? 'Unknown';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
