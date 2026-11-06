import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentBudget } from './department-budget';

describe('DepartmentBudget', () => {
  let component: DepartmentBudget;
  let fixture: ComponentFixture<DepartmentBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
