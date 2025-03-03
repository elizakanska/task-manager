import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared.module';
import taskData from '../../../assets/data.json';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('Task Data:', taskData);
    this.tasks = taskData as any[];
    this.filteredTasks = [...this.tasks];

    this.taskFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['TASK', Validators.required],
      status: ['PENDING', Validators.required]
    });
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
    this.taskFormGroup.setValue(task ? { title: task.title, description: task.description, type: task.type, status: task.status } : { title: '', description: '', type: 'TASK', status: 'PENDING' });
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  saveTask() {
    if (this.taskFormGroup.invalid) return;

    if (this.editingTask) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.taskFormGroup.value, id: this.editingTask.id, createdOn: this.editingTask.createdOn };
      }
    } else {
      this.tasks.push({ ...this.taskFormGroup.value, id: Date.now(), createdOn: new Date().toISOString() });
    }

    this.filteredTasks = [...this.tasks];
    this.closeTaskForm();
  }

  editTask(task: any) {
    this.openTaskForm(task);
  }

  deleteTask(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.filteredTasks = [...this.tasks];
    }
  }
}
