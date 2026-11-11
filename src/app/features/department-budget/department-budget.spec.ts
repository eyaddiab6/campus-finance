
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentBudget } from './department-budget';

describe('DepartmentBudget', () => {
  let component: DepartmentBudget;
  let fixture: ComponentFixture<DepartmentBudget>;

  beforeEach(async () => {
    localStorage.removeItem('campus-finance-budget-records');

    await TestBed.configureTestingModule({
      imports: [DepartmentBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentBudget);
    component = fixture.componentInstance;

    await fixture.whenStable();

    component.selectedMonth = new Date().toISOString().slice(0, 7);
  });

  afterEach(() => {
    fixture.destroy();
    localStorage.removeItem('campus-finance-budget-records');
  });

  it('should create the Department Budget component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the initial sample financial records', () => {
    expect(component.records.length).toBe(5);
  });

  it('should calculate total income correctly', () => {
    expect(component.totalIncome).toBe(33500);
  });

  it('should calculate total expenses correctly', () => {
    expect(component.totalExpenses).toBe(6950);
  });

  it('should calculate the remaining balance correctly', () => {
    expect(component.remainingBalance).toBe(26550);
  });

  it('should count income and expense records correctly', () => {
    expect(component.incomeCount).toBe(2);
    expect(component.expenseCount).toBe(3);
  });

  it('should add a new income record', () => {
    component.recordType = 'income';
    component.category = 'Donations';
    component.amount = 1000;
    component.date = `${component.selectedMonth}-15`;
    component.description = 'Department donation';

    component.addRecord();

    expect(component.records.length).toBe(6);
    expect(component.records[0].category).toBe('Donations');
    expect(component.records[0].amount).toBe(1000);
    expect(component.records[0].type).toBe('income');
    expect(component.message).toBe(
      'Financial record added successfully.'
    );
  });

  it('should add a new expense record', () => {
    component.recordType = 'expense';
    component.category = 'Transport';
    component.amount = 500;
    component.date = `${component.selectedMonth}-15`;
    component.description = 'Department transportation';

    component.addRecord();

    expect(component.records[0].type).toBe('expense');
    expect(component.records[0].amount).toBe(500);
  });

  it('should reject a record without a category', () => {
    component.category = '';
    component.amount = 100;
    component.description = 'Test description';

    component.addRecord();

    expect(component.errorMessage).toBe(
      'Please enter a category.'
    );
    expect(component.records.length).toBe(5);
  });

  it('should reject an invalid amount', () => {
    component.category = 'Equipment';
    component.amount = -100;
    component.description = 'Test description';

    component.addRecord();

    expect(component.errorMessage).toBe(
      'Please enter an amount greater than zero.'
    );
    expect(component.records.length).toBe(5);
  });

  it('should reject a record without a date', () => {
    component.category = 'Equipment';
    component.amount = 100;
    component.date = '';
    component.description = 'Test description';

    component.addRecord();

    expect(component.errorMessage).toBe(
      'Please select a date.'
    );
  });

  it('should reject a record without a description', () => {
    component.category = 'Equipment';
    component.amount = 100;
    component.description = '';

    component.addRecord();

    expect(component.errorMessage).toBe(
      'Please enter a description.'
    );
  });

  it('should delete a financial record', () => {
    const recordId = component.records[0].id;

    component.deleteRecord(recordId);

    expect(component.records.length).toBe(4);
    expect(component.records.some(record => record.id === recordId))
      .toBeFalse();
    expect(component.message).toBe(
      'Financial record deleted successfully.'
    );
  });

  it('should save financial records in localStorage', () => {
    component.category = 'Donations';
    component.amount = 1000;
    component.date = `${component.selectedMonth}-15`;
    component.description = 'Department donation';

    component.addRecord();

    const savedRecords = JSON.parse(
      localStorage.getItem('campus-finance-budget-records')!
    );

    expect(savedRecords.length).toBe(6);
    expect(savedRecords[0].category).toBe('Donations');
  });

  it('should filter records according to the selected month', () => {
    const otherMonth = component.selectedMonth === '2026-10'
      ? '2026-09'
      : '2026-10';

    component.records.push({
      id: 'FIN-TEST',
      type: 'income',
      category: 'Test',
      amount: 1000,
      date: `${otherMonth}-15`,
      description: 'Another month'
    });

    expect(component.filteredRecords.length).toBe(5);
    expect(
      component.filteredRecords.some(record => record.id === 'FIN-TEST')
    ).toBeFalse();
  });
});
