import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentFees } from './student-fees';

describe('StudentFees', () => {
  let component: StudentFees;
  let fixture: ComponentFixture<StudentFees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFees],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
