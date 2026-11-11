
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import {
  FinancialRecord,
  FinancialRecordType
} from '../../core/models/campus.models';

Chart.register(...registerables);

@Component({
  selector: 'app-department-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-budget.html',
  styleUrl: './department-budget.scss'
})
export class DepartmentBudget implements AfterViewInit, OnDestroy {
  @ViewChild('incomeExpenseCanvas')
  incomeExpenseCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('categoryCanvas')
  categoryCanvas!: ElementRef<HTMLCanvasElement>;

  records: FinancialRecord[] = [];

  recordType: FinancialRecordType = 'income';
  category = '';
  amount = 0;
  date = new Date().toISOString().slice(0, 10);
  description = '';

  selectedMonth = new Date().toISOString().slice(0, 7);
  message = '';
  errorMessage = '';

  private readonly storageKey = 'campus-finance-budget-records';

  private incomeExpenseChart?: Chart;
  private categoryChart?: Chart;

  constructor() {
    this.loadRecords();
  }

  ngAfterViewInit(): void {
    this.updateCharts();
  }

  ngOnDestroy(): void {
    this.incomeExpenseChart?.destroy();
    this.categoryChart?.destroy();
  }

  private loadRecords(): void {
    const savedRecords = localStorage.getItem(this.storageKey);

    if (savedRecords) {
      this.records = JSON.parse(savedRecords);
      return;
    }

    // Initial sample data to make the dashboard useful on first opening.
    this.records = [
      {
        id: 'FIN-001',
        type: 'income',
        category: 'Tuition',
        amount: 25000,
        date: `${this.selectedMonth}-02`,
        description: 'Department tuition allocation'
      },
      {
        id: 'FIN-002',
        type: 'income',
        category: 'Cafeteria',
        amount: 8500,
        date: `${this.selectedMonth}-05`,
        description: 'Cafeteria sales'
      },
      {
        id: 'FIN-003',
        type: 'expense',
        category: 'Equipment',
        amount: 4200,
        date: `${this.selectedMonth}-08`,
        description: 'Computer equipment'
      },
      {
        id: 'FIN-004',
        type: 'expense',
        category: 'Maintenance',
        amount: 1800,
        date: `${this.selectedMonth}-10`,
        description: 'Department maintenance'
      },
      {
        id: 'FIN-005',
        type: 'expense',
        category: 'Supplies',
        amount: 950,
        date: `${this.selectedMonth}-12`,
        description: 'Office supplies'
      }
    ];

    this.saveRecords();
  }

  get filteredRecords(): FinancialRecord[] {
    return this.records
      .filter(record =>
        !this.selectedMonth ||
        record.date.startsWith(this.selectedMonth)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  get totalIncome(): number {
    return this.filteredRecords
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);
  }

  get totalExpenses(): number {
    return this.filteredRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);
  }

  get remainingBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  get incomeCount(): number {
    return this.filteredRecords.filter(
      record => record.type === 'income'
    ).length;
  }

  get expenseCount(): number {
    return this.filteredRecords.filter(
      record => record.type === 'expense'
    ).length;
  }

  addRecord(): void {
    if (!this.category.trim()) {
      this.errorMessage = 'Please enter a category.';
      this.message = '';
      return;
    }

    if (!Number.isFinite(this.amount) || this.amount <= 0) {
      this.errorMessage = 'Please enter an amount greater than zero.';
      this.message = '';
      return;
    }

    if (!this.date) {
      this.errorMessage = 'Please select a date.';
      this.message = '';
      return;
    }

    if (!this.description.trim()) {
      this.errorMessage = 'Please enter a description.';
      this.message = '';
      return;
    }

    const newRecord: FinancialRecord = {
      id: `FIN-${Date.now()}`,
      type: this.recordType,
      category: this.category.trim(),
      amount: Number(this.amount),
      date: this.date,
      description: this.description.trim()
    };

    this.records.unshift(newRecord);
    this.saveRecords();

    this.category = '';
    this.amount = 0;
    this.description = '';

    this.message = 'Financial record added successfully.';
    this.errorMessage = '';

    this.updateCharts();
  }

  deleteRecord(recordId: string): void {
    this.records = this.records.filter(
      record => record.id !== recordId
    );

    this.saveRecords();
    this.updateCharts();

    this.message = 'Financial record deleted successfully.';
    this.errorMessage = '';
  }

  changeMonth(): void {
    this.updateCharts();
  }

  downloadReport(): void {
    const report = {
      department: 'Campus Finance',
      reportType: 'Department Budget Report',
      month: this.selectedMonth || 'All months',
      generatedAt: new Date().toISOString(),
      totalIncome: this.totalIncome,
      totalExpenses: this.totalExpenses,
      remainingBalance: this.remainingBalance,
      records: this.filteredRecords
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `department-budget-${this.selectedMonth || 'all'}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  private saveRecords(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.records)
    );
  }

  private updateCharts(): void {
    if (!this.incomeExpenseCanvas || !this.categoryCanvas) {
      return;
    }

    this.incomeExpenseChart?.destroy();
    this.categoryChart?.destroy();

    this.incomeExpenseChart = new Chart(
      this.incomeExpenseCanvas.nativeElement,
      {
        type: 'doughnut',
        data: {
          labels: ['Income', 'Expenses'],
          datasets: [{
            data: [this.totalIncome, this.totalExpenses],
            backgroundColor: ['#258b69', '#e16b62'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }
    );

    const expenseRecords = this.filteredRecords.filter(
      record => record.type === 'expense'
    );

    const categoryTotals = new Map<string, number>();

    expenseRecords.forEach(record => {
      categoryTotals.set(
        record.category,
        (categoryTotals.get(record.category) ?? 0) + record.amount
      );
    });

    this.categoryChart = new Chart(
      this.categoryCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels: Array.from(categoryTotals.keys()),
          datasets: [{
            label: 'Expenses (EGP)',
            data: Array.from(categoryTotals.values()),
            backgroundColor: '#315b91',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }
}
