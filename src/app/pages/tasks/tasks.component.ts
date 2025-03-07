import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared.module';
import { DatePipe } from '@angular/common';
import { TaskManagerService } from '../../services/task.manager.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  imports: [SharedModule]
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  showTaskForm = false;
  editingTask: any = null;
  taskFormGroup!: FormGroup;
  searchQuery: string = '';
  selectedTask: any;
  showTaskDetails = false;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private taskService: TaskManagerService
  ) {}

  ngOnInit() {
    this.loadTasks();

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

  loadTasks() {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data;
      this.filteredTasks = [...this.tasks];
    }, error => console.error('Error loading tasks:', error));
  }

  trackByTaskId(index: number, task: any): number {
    return task.id;
  }

  searchTasks() {
    if (this.searchQuery.trim() === '') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task =>
        task.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  openTaskForm(task: any = null) {
    this.editingTask = task ?? null;
    this.taskFormGroup.setValue(task ? {
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      createdOn: task.createdOn
    } : {
      title: '',
      description: '',
      type: 'TASK',
      status: 'PENDING',
      createdOn: ''
    });
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  saveTask() {
    if (this.taskFormGroup.invalid) return;

    const date = new Date();
    const savedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    const taskData = {
      ...this.taskFormGroup.value,
      createdOn: savedDate
    };

    if (this.editingTask) {
      this.taskService.editTask(this.editingTask.id, taskData).subscribe(() => {
        this.loadTasks();
        this.closeTaskForm();
      });
    } else {
      this.taskService.addTask(taskData).subscribe(() => {
        this.loadTasks();
        this.closeTaskForm();
      });
    }
  }

  editTask(task: any) {
    this.openTaskForm(task);
  }

  deleteTask(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      this.taskService.deleteTask(id.toString()).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  viewTaskDetails(taskId: number) {
    this.taskService.getTaskById(taskId.toString()).subscribe((task) => {
      this.selectedTask = task;
      this.showTaskDetails = true;
    }, error => console.error('Error loading task details:', error));
  }

  closeTaskDetails() {
    this.showTaskDetails = false;
    this.selectedTask = null;
  }
}
