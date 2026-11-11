
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Payroll } from './payroll';

describe('Payroll', () => {
  let component: Payroll;
  let fixture: ComponentFixture<Payroll>;

  beforeEach(async () => {
    localStorage.removeItem('campus-finance-payroll-employees');
    localStorage.removeItem('campus-finance-payroll-records');

    await TestBed.configureTestingModule({
      imports: [Payroll],
    }).compileComponents();

    fixture = TestBed.createComponent(Payroll);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.selectedMonth = '2026-11';
    component.filterMonth = '2026-11';
  });

  afterEach(() => {
    localStorage.removeItem('campus-finance-payroll-employees');
    localStorage.removeItem('campus-finance-payroll-records');
  });

  it('should create the Payroll component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees from MockData', () => {
    expect(component.employees.length).toBeGreaterThan(0);
    expect(component.selectedEmployee).toBeTruthy();
  });

  it('should filter employees by name or ID', () => {
    component.searchText = component.employees[0].fullName;

    expect(component.filteredEmployees.length).toBe(1);
  });

  it('should update an employee base salary', () => {
    component.newBaseSalary = 6500;
    component.updateBaseSalary();

    expect(component.selectedEmployee?.baseSalary).toBe(6500);
    expect(component.message).toBe('Base salary updated successfully.');

    const savedEmployees = JSON.parse(
      localStorage.getItem('campus-finance-payroll-employees')!
    );

    expect(savedEmployees[0].baseSalary).toBe(6500);
  });

  it('should reject an invalid base salary', () => {
    component.newBaseSalary = -100;
    component.updateBaseSalary();

    expect(component.errorMessage).toBe(
      'Please enter a valid base salary greater than zero.'
    );
  });

  it('should generate payroll with the correct net salary', () => {
    const baseSalary = component.selectedEmployee!.baseSalary;

    component.allowance = 500;
    component.deductions = 200;
    component.generatePayroll();

    expect(component.records.length).toBe(1);
    expect(component.records[0].netSalary).toBe(baseSalary + 300);
    expect(component.records[0].status).toBe('pending');
    expect(component.message).toBe('Payroll generated successfully.');
  });

  it('should reject negative allowances', () => {
    component.allowance = -100;
    component.generatePayroll();

    expect(component.records.length).toBe(0);
    expect(component.errorMessage).toContain(
      'non-negative numbers'
    );
  });

  it('should reject deductions greater than the total salary', () => {
    const baseSalary = component.selectedEmployee!.baseSalary;

    component.deductions = baseSalary + 1;
    component.generatePayroll();

    expect(component.records.length).toBe(0);
    expect(component.errorMessage).toBe(
      'Deductions cannot exceed the employee total salary.'
    );
  });

  it('should prevent duplicate payroll for the same employee and month', () => {
    component.generatePayroll();
    component.generatePayroll();

    expect(component.records.length).toBe(1);
    expect(component.errorMessage).toBe(
      'Payroll for this employee and month already exists.'
    );
  });

  it('should mark a payroll record as paid', () => {
    component.generatePayroll();

    const record = component.records[0];
    component.markAsPaid(record);

    expect(record.status).toBe('paid');
    expect(component.message).toBe('Payroll marked as paid.');
  });

  it('should calculate total, pending, and paid payroll correctly', () => {
    component.records = [
      {
        id: 'PAY-001',
        employeeId: component.employees[0].id,
        month: '2026-11',
        shiftAllowance: 200,
        deductions: 100,
        netSalary: 6100,
        status: 'pending'
      },
      {
        id: 'PAY-002',
        employeeId: component.employees[0].id,
        month: '2026-11',
        shiftAllowance: 300,
        deductions: 100,
        netSalary: 6200,
        status: 'paid'
      }
    ];

    expect(component.totalPayroll).toBe(12300);
    expect(component.pendingPayroll).toBe(6100);
    expect(component.paidPayroll).toBe(6200);
  });

  it('should return the correct employee name', () => {
    const employee = component.employees[0];

    expect(component.getEmployeeName(employee.id)).toBe(employee.fullName);
  });

  it('should return Unknown employee for an invalid employee ID', () => {
    expect(component.getEmployeeName('INVALID')).toBe('Unknown employee');
  });

  it('should save generated payroll records in localStorage', () => {
    component.generatePayroll();

    const savedRecords = JSON.parse(
      localStorage.getItem('campus-finance-payroll-records')!
    );

    expect(savedRecords.length).toBe(1);
    expect(savedRecords[0].month).toBe('2026-11');
  });
});
