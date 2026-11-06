import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPlans } from './meal-plans';

describe('MealPlans', () => {
  let component: MealPlans;
  let fixture: ComponentFixture<MealPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlans],
    }).compileComponents();

    fixture = TestBed.createComponent(MealPlans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
