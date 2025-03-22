import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared.module';
import { TaskService } from '../../services/task.service';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { Task } from '../../models/task.model';
import { Type } from '../../models/type.model';
import { Status } from '../../models/status.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showTaskForm = false;
  editingTask: Task | null = null;
  taskFormGroup: FormGroup;
  searchQuery: string = '';
  selectedTask: Task | null = null;
  showTaskDetails = false;
  typeOptions: Type[] = [];
  statusOptions: Status[] = [];
  newType: string = '';
  newStatus: string = '';
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
      createdOn: [
        null,
        [
          Validators.required,
          (control: { value: Date }) => {
            const selectedDate = new Date(control.value);
            const today = new Date();
            return selectedDate > today ? { futureDate: true } : null;
          }
        ]
      ]
    });
  }

  ngOnInit() {
    this.loadTaskTypesAndStatuses();
  }

  loadTaskTypesAndStatuses() {
    const loadSub = forkJoin([
      this.taskService.getTaskTypes(),
      this.taskService.getTaskStatuses()
    ]).subscribe(([types, statuses]) => {
      this.typeOptions = types;
      this.statusOptions = statuses;
      this.loadTasks();
    });
    this.subscriptions.add(loadSub);
  }

  loadTasks() {
    const taskSub = this.taskService.getTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
    this.subscriptions.add(taskSub);
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
      title: task?.title || '',
      description: task?.description || '',
      typeId: task?.typeId || null,
      statusId: task?.statusId || null,
      createdOn: task?.createdOn || null
    });
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  saveTask() {
    if (this.taskFormGroup.invalid) return;

    const taskData = {
      ...this.taskFormGroup.value,
      createdOn: new Date(this.taskFormGroup.get('createdOn')?.value),
      typeId: this.taskFormGroup.get('typeId')?.value,
      statusId: this.taskFormGroup.get('statusId')?.value
    };

    const saveSub = (this.editingTask
        ? this.taskService.editTask(this.editingTask.id, taskData)
        : this.taskService.addTask(taskData)
    ).pipe(
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
    this.selectedTask = this.tasks.find(t => t.id === id) || null;
    this.showTaskDetails = !!this.selectedTask;
  }

  closeTaskDetails() {
    this.selectedTask = null;
    this.showTaskDetails = false;
  }

  addNewType() {
    if (this.newType.trim()) {
      const newTypeName = this.newType.trim();
      const addTypeSub = this.taskService.addNewType(newTypeName).subscribe({
        next: () => {
          this.loadTaskTypesAndStatuses();
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
      const addStatusSub = this.taskService.addNewStatus(newStatusName).subscribe({
        next: () => {
          this.loadTaskTypesAndStatuses();
          this.newStatus = '';
        },
        error: (err) => console.error('Error adding new status:', err)
      });
      this.subscriptions.add(addStatusSub);
    }
  }

  getStatusName(statusId: number): string {
    return this.statusOptions.find(option => option.id === statusId)?.name || 'Unknown';
  }

  getTypeName(typeId: number): string {
    return this.typeOptions.find(option => option.id === typeId)?.name || 'Unknown';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
