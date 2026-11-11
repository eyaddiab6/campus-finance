
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, PayrollRecord } from '../../core/models/campus.models';
import { MockData } from '../../core/services/mock-data';

interface PayrollEntry extends PayrollRecord {
  status: 'pending' | 'paid';
}

@Component({
  selector: 'app-payroll',
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.scss',
})
export class Payroll {
  employees: Employee[] = [];
  records: PayrollEntry[] = [];

  selectedEmployeeId = '';
  selectedMonth = new Date().toISOString().slice(0, 7);
  allowance = 0;
  deductions = 0;
  newBaseSalary = 0;

  searchText = '';
  filterMonth = new Date().toISOString().slice(0, 7);
  message = '';
  errorMessage = '';

  private readonly employeeStorageKey =
    'campus-finance-payroll-employees';

  private readonly recordsStorageKey =
    'campus-finance-payroll-records';

  constructor(private mockData: MockData) {
    this.loadData();
  }

  private loadData(): void {
    const savedEmployees = localStorage.getItem(this.employeeStorageKey);
    const savedRecords = localStorage.getItem(this.recordsStorageKey);

    this.employees = savedEmployees
      ? JSON.parse(savedEmployees)
      : this.mockData.employees.map(employee => ({ ...employee }));

    this.records = savedRecords ? JSON.parse(savedRecords) : [];

    if (this.employees.length > 0) {
      this.selectedEmployeeId = this.employees[0].id;
      this.newBaseSalary = this.employees[0].baseSalary;
    }
  }

  get selectedEmployee(): Employee | undefined {
    return this.employees.find(
      employee => employee.id === this.selectedEmployeeId
    );
  }

  get filteredEmployees(): Employee[] {
    const search = this.searchText.toLowerCase().trim();

    return this.employees.filter(employee =>
      employee.fullName.toLowerCase().includes(search) ||
      employee.id.toLowerCase().includes(search)
    );
  }

  get filteredRecords(): PayrollEntry[] {
    return this.records.filter(record => {
      const employee = this.employees.find(
        item => item.id === record.employeeId
      );

      const matchesMonth =
        !this.filterMonth || record.month === this.filterMonth;

      const search = this.searchText.toLowerCase().trim();

      const matchesSearch =
        !search ||
        employee?.fullName.toLowerCase().includes(search) ||
        record.employeeId.toLowerCase().includes(search);

      return matchesMonth && matchesSearch;
    });
  }

  get totalPayroll(): number {
    return this.filteredRecords.reduce(
      (total, record) => total + record.netSalary,
      0
    );
  }

  get pendingPayroll(): number {
    return this.filteredRecords
      .filter(record => record.status === 'pending')
      .reduce((total, record) => total + record.netSalary, 0);
  }

  get paidPayroll(): number {
    return this.filteredRecords
      .filter(record => record.status === 'paid')
      .reduce((total, record) => total + record.netSalary, 0);
  }

  getBaseSalary(employeeId: string): number {
    return this.employees.find(employee => employee.id === employeeId)
      ?.baseSalary ?? 0;
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployeeId = employee.id;
    this.newBaseSalary = employee.baseSalary;
    this.message = '';
    this.errorMessage = '';
  }

  updateBaseSalary(): void {
    if (!Number.isFinite(this.newBaseSalary) || this.newBaseSalary <= 0) {
      this.errorMessage =
        'Please enter a valid base salary greater than zero.';
      this.message = '';
      return;
    }

    const employee = this.selectedEmployee;

    if (!employee) {
      this.errorMessage = 'Please select an employee first.';
      return;
    }

    employee.baseSalary = Number(this.newBaseSalary);
    this.saveEmployees();

    this.message = 'Base salary updated successfully.';
    this.errorMessage = '';
  }

  generatePayroll(): void {
    const employee = this.selectedEmployee;

    if (!employee) {
      this.errorMessage = 'Please select an employee.';
      return;
    }

    if (!this.selectedMonth) {
      this.errorMessage = 'Please select a payroll month.';
      return;
    }

    if (
      !Number.isFinite(this.allowance) ||
      !Number.isFinite(this.deductions) ||
      this.allowance < 0 ||
      this.deductions < 0
    ) {
      this.errorMessage =
        'Allowances and deductions must be valid non-negative numbers.';
      return;
    }

    const netSalary =
      employee.baseSalary + Number(this.allowance) - Number(this.deductions);

    if (netSalary < 0) {
      this.errorMessage =
        'Deductions cannot exceed the employee total salary.';
      return;
    }

    const existingRecord = this.records.find(
      record =>
        record.employeeId === employee.id &&
        record.month === this.selectedMonth
    );

    if (existingRecord) {
      this.errorMessage =
        'Payroll for this employee and month already exists.';
      return;
    }

    const record: PayrollEntry = {
      id: `PAY-${Date.now()}`,
      employeeId: employee.id,
      month: this.selectedMonth,
      shiftAllowance: Number(this.allowance),
      deductions: Number(this.deductions),
      netSalary,
      status: 'pending',
    };

    this.records.push(record);
    this.saveRecords();

    this.allowance = 0;
    this.deductions = 0;
    this.filterMonth = this.selectedMonth;

    this.message = 'Payroll generated successfully.';
    this.errorMessage = '';
  }

  markAsPaid(record: PayrollEntry): void {
    record.status = 'paid';
    this.saveRecords();

    this.message = 'Payroll marked as paid.';
    this.errorMessage = '';
  }

  getEmployeeName(employeeId: string): string {
    return this.employees.find(employee => employee.id === employeeId)
      ?.fullName ?? 'Unknown employee';
  }

  downloadMonthlyReport(): void {
    if (!this.filterMonth) {
      this.errorMessage = 'Please select a month for the report.';
      return;
    }

    const monthlyRecords = this.records
      .filter(record => record.month === this.filterMonth)
      .map(record => ({
        ...record,
        employeeName: this.getEmployeeName(record.employeeId),
      }));

    const report = {
      department: 'Campus Finance',
      reportType: 'Monthly Payroll Report',
      month: this.filterMonth,
      generatedAt: new Date().toISOString(),
      totalEmployees: monthlyRecords.length,
      totalPayroll: monthlyRecords.reduce(
        (sum, record) => sum + record.netSalary,
        0
      ),
      records: monthlyRecords,
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `payroll-report-${this.filterMonth}.json`;
    link.click();

    URL.revokeObjectURL(url);

    this.message = 'Monthly JSON report downloaded.';
    this.errorMessage = '';
  }

  private saveEmployees(): void {
    localStorage.setItem(
      this.employeeStorageKey,
      JSON.stringify(this.employees)
    );
  }

  private saveRecords(): void {
    localStorage.setItem(
      this.recordsStorageKey,
      JSON.stringify(this.records)
    );
  }
}
