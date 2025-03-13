import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared.module';
import { DatePipe } from '@angular/common';
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
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
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
    this.loadTasks();
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
    if (!this.taskFormGroup || this.taskFormGroup.invalid) return;

    const date = new Date();
    const savedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    const taskData: Task = {
      ...this.taskFormGroup.value,
      createdOn: savedDate
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
      const deleteSub = this.taskService.deleteTask(id.toString()).pipe(
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
    const detailsSub = this.taskService.getTaskById(taskId.toString()).subscribe({
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
