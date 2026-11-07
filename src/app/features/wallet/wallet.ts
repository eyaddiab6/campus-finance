import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WalletTransaction } from '../../core/models/campus.models';
import { WalletService } from '../../core/services/wallet.service';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet {
  private readonly studentId = 'STU001';

  readonly topUpAmount = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
  ]);

  balance = 0;
  spent = 0;
  received = 0;
  transactions: WalletTransaction[] = [];
  message = '';
  error = '';

  constructor(private readonly walletService: WalletService) {
    this.refresh();
  }

  addFunds(): void {
    this.message = '';
    this.error = '';

    if (this.topUpAmount.invalid || this.topUpAmount.value === null) {
      this.topUpAmount.markAsTouched();
      this.error = 'Enter an amount greater than zero.';
      return;
    }

    const successful = this.walletService.topUp(
      this.studentId,
      this.topUpAmount.value,
    );

    if (!successful) {
      this.error = 'We could not add funds to this wallet.';
      return;
    }

    this.message = 'Funds added successfully.';
    this.topUpAmount.reset();
    this.refresh();
  }

  private refresh(): void {
    this.balance = this.walletService.getWallet(this.studentId)?.balance ?? 0;
    const totals = this.walletService.getTotals(this.studentId);
    this.spent = totals.spent;
    this.received = totals.received;
    this.transactions = this.walletService.getTransactions(this.studentId);
  }
}