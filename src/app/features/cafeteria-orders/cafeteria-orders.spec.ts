import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CafeteriaOrders } from './cafeteria-orders';

describe('CafeteriaOrders', () => {
  let component: CafeteriaOrders;
  let fixture: ComponentFixture<CafeteriaOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CafeteriaOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(CafeteriaOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
