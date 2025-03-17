import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared.module';
import { TaskManagerService } from '../../services/task.manager.service';
import { Subscription, switchMap } from 'rxjs';
import { Task } from '../../models/task.model';

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
  typeOptions: string[] = [];
  statusOptions: string[] = [];
  newType: string = '';
  newStatus: string = '';
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskManagerService
  ) {
    this.taskFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      type: ['TASK', Validators.required],
      status: ['PENDING', Validators.required],
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
    this.loadTasks();
  }

  loadTaskTypesAndStatuses() {
    const typesSub = this.taskService.getTaskTypes().subscribe({
      next: (data) => {
        this.typeOptions = data;
      },
      error: (err) => console.error('Error loading task types:', err)
    });
    const statusesSub = this.taskService.getTaskStatuses().subscribe({
      next: (data) => {
        this.statusOptions = data;
      },
      error: (err) => console.error('Error loading task statuses:', err)
    });
    this.subscriptions.add(typesSub);
    this.subscriptions.add(statusesSub);
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
    if (this.searchQuery.trim() === '') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  openTaskForm(task: Task | null = null) {
    this.editingTask = task;
    if (task) {
      this.taskFormGroup?.setValue({
        title: task.title,
        description: task.description,
        type: task.type,
        status: task.status,
        createdOn: task.createdOn
      });
    } else {
      this.taskFormGroup?.reset({
        title: '',
        description: '',
        type: 'TASK',
        status: 'PENDING',
        createdOn: null
      });
    }
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  saveTask() {
    if (this.taskFormGroup.invalid) {
      Object.keys(this.taskFormGroup.controls).forEach(key => {
        const control = this.taskFormGroup.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
    const taskData: Task = {
      ...this.taskFormGroup.value,
      createdOn: new Date()
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
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
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

  viewTaskDetails(taskId: number) {
    const detailsSub = this.taskService.getTaskById(taskId).subscribe({
      next: (task: Task) => {
        this.selectedTask = task;
        this.showTaskDetails = true;
      },
      error: (err) => console.error('Error loading task details:', err)
    });

    this.subscriptions.add(detailsSub);
  }

  closeTaskDetails() {
    this.showTaskDetails = false;
    this.selectedTask = null;
  }

  onSearchType(value: string): void {
    this.newType = value;
  }

  onSearchStatus(value: string): void {
    this.newStatus = value;
  }

  addNewType(): void {
    if (this.newType && !this.typeOptions.includes(this.newType)) {
      this.typeOptions.push(this.newType);
      this.taskFormGroup.get('type')?.setValue(this.newType);
      this.newType = '';
    }
  }

  addNewStatus(): void {
    if (this.newStatus && !this.statusOptions.includes(this.newStatus)) {
      this.statusOptions.push(this.newStatus);
      this.taskFormGroup.get('status')?.setValue(this.newStatus);
      this.newStatus = '';
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
