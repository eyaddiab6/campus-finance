import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Wallet } from './wallet';
import { Auth } from '../../core/services/auth';

describe('Wallet', () => {
  let component: Wallet;
  let fixture: ComponentFixture<Wallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wallet],
    }).compileComponents();

    fixture = TestBed.createComponent(Wallet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not use the demo wallet for a newly registered student', () => {
    const auth = TestBed.inject(Auth);
    auth.register('Second Student', 'another.student@example.com', 'Password123!');
    const separate = TestBed.createComponent(Wallet).componentInstance;
    expect(separate.balance).toBe(0);
    separate.topUpAmount.setValue(100);
    separate.addFunds();
    expect(separate.balance).toBe(0);
    auth.logout();
  });
});
