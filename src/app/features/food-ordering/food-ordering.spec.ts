import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodOrdering } from './food-ordering';

describe('FoodOrdering', () => {
  let component: FoodOrdering;
  let fixture: ComponentFixture<FoodOrdering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodOrdering],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodOrdering);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the food ordering page', () => {
    expect(component).toBeTruthy();
  });

  it('filters menu items by search text', () => {
    component.setSearch('juice');

    expect(component.filteredItems.map(item => item.name)).toEqual([
      'Orange Juice',
    ]);
  });

  it('shows an empty result when no item matches the search', () => {
    component.setSearch('not on the menu');

    expect(component.filteredItems).toEqual([]);
  });

  it('filters menu items by category', () => {
    component.setCategory('Burgers');

    expect(component.filteredItems.map(item => item.name)).toEqual([
      'Beef Burger',
    ]);
  });

  it('adds items, updates quantities, and removes items from the cart', () => {
    const sandwich = component.catalog.find(item => item.id === 'FOOD001')!;

    component.addItem(sandwich);
    expect(component.cart.length).toBe(1);
    expect(component.cartTotal).toBe(85);

    component.changeQuantity('FOOD001', 2);
    expect(component.cartTotal).toBe(170);

    component.removeItem('FOOD001');
    expect(component.cart).toEqual([]);
    expect(component.cartTotal).toBe(0);
  });
});