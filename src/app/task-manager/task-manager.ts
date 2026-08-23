import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: Date;
  status: string;
  createdAt: Date;
  completedAt?: Date;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-task-manager',
  styleUrl: './task-manager.css',
  templateUrl: './task-manager.html',
})
export class TaskManager {
  //Core data
  tasks: Task[] = [
    {
      id: 1,
      title: 'Learn Angular',
      description: 'Learn angular from scratch',
      category: 'education',
      priority: 'high',
      dueDate: new Date('2026-09-01'),
      status: 'completed',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Buy Groceries',
      description: 'Purchase milk, breads, eggs, vegetables',
      category: 'shopping',
      priority: 'Medium',
      dueDate: new Date('2026-08-30'),
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Team meeting',
      description: 'Discuss Q1 project roadmap',
      category: 'work',
      priority: 'high',
      dueDate: new Date('2026-08-20'),
      status: 'completed',
      createdAt: new Date(),
    },
  ];

  categories: string[] = [
    'work',
    'personal',
    'shopping',
    'health',
    'finance',
    'education',
    'other',
  ];
  priorities: string[] = ['low', 'medium', 'high', 'urgent'];
  statuses: string[] = ['pending', 'in-progress', 'completed', 'cancelled'];

  //Form data
  newTask: {
    title: string;
    description: string;
    category: string;
    priority: string;
    dueDate: string | Date;
    status: string;
  } = {
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending',
  };

  //Filter controls
  filterStatus: string = 'all';
  filterCategory: string = 'all';
  filterPriority: string = 'all';
  showCompleted: boolean = true;

  //Methods
  getCompletedTasksCount(): number {
    return this.tasks.filter((task) => task.status === 'completed').length;
  }
  getPendingTasksCount(): number {
    return this.tasks.filter((task) => task.status === 'pending').length;
  }
  getOverdueTasksCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.tasks.filter((task) => new Date(task.dueDate) < today && task.status != 'completed')
      .length;
  }
  getCompletionRate(): number {
    if (this.tasks.length == 0) return 0;
    return Math.round((this.getCompletedTasksCount() / this.tasks.length) * 100);
  }

  getProductivityLevel(): string {
    const rate = this.getCompletionRate();
    if (rate >= 80) return 'excellent';
    if (rate >= 60) return 'good';
    if (rate >= 40) return 'needs-improvement';
    return 'poor';
  }

  onFieldFocus(field: string): void {}
  onFieldBlur(field: string): void {}
  addTask(): void {
    if (!this.newTask.title || !this.newTask.category || !this.newTask.dueDate) {
      return;
    }
    const task: Task = {
      id: Date.now(),
      title: this.newTask.title,
      description: this.newTask.description,
      category: this.newTask.category,
      priority: this.newTask.priority,
      dueDate: new Date(this.newTask.dueDate),
      status: this.newTask.status,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    this.clearForm();
  }
  clearForm(): void {
    this.newTask = {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending',
    };
  }

  getFilteredTask(): Task[] {
    let filtered = [...this.tasks];
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter((temp) => temp.status === this.filterStatus);
    }
    if (this.filterCategory !== 'all') {
      filtered = filtered.filter((temp) => temp.category === this.filterCategory);
    }
    if (this.filterPriority !== 'all') {
      filtered = filtered.filter((temp) => temp.priority === this.filterPriority);
    }
    if (this.showCompleted === true) {
      filtered = filtered.filter((temp) => temp.status === 'completed');
    }
    return filtered;
  }

  toggleTaskCompleted(id: number): void {
    const getTaskById = this.tasks.find((temp) => temp.id === id);
    if (getTaskById) {
      if (getTaskById.status === 'completed') {
        getTaskById.status = 'pending';
        delete getTaskById.completedAt;
      } else {
        getTaskById.status = 'completed';
        getTaskById.completedAt = new Date();
      }
    }
  }

  isOverdue(task: Task): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today && task.status != 'completed';
  }
  deleteTask(id: number): void {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
}
