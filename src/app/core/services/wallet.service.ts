import { Injectable } from '@angular/core';
import { TransactionType, Wallet, WalletTransaction } from '../models/campus.models';
import { MockData } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly transactions: WalletTransaction[] = [];
  private nextTransactionId = 1;

  constructor(private readonly mockData: MockData) {}

  getWallet(studentId: string): Wallet | undefined {
    return this.mockData.wallets.find(wallet => wallet.studentId === studentId);
  }

  getTransactions(studentId: string): WalletTransaction[] {
    const wallet = this.getWallet(studentId);

    if (!wallet) {
      return [];
    }

    return this.transactions
      .filter(transaction => transaction.walletId === wallet.id)
      .sort((first, second) => second.date.localeCompare(first.date));
  }

  getTotals(studentId: string): { spent: number; received: number } {
    const transactions = this.getTransactions(studentId);

    return transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'purchase') {
          totals.spent += transaction.amount;
        } else {
          totals.received += transaction.amount;
        }

        return totals;
      },
      { spent: 0, received: 0 },
    );
  }

  topUp(studentId: string, amount: number): boolean {
    if (!Number.isFinite(amount) || amount <= 0) {
      return false;
    }

    const wallet = this.getWallet(studentId);

    if (!wallet) {
      return false;
    }

    wallet.balance += amount;
    this.addTransaction(wallet, 'top-up', amount, 'Demo wallet top-up');
    return true;
  }

  debit(
    studentId: string,
    amount: number,
    description: string,
  ): boolean {
    if (!Number.isFinite(amount) || amount <= 0) {
      return false;
    }

    const wallet = this.getWallet(studentId);

    if (!wallet || wallet.balance < amount) {
      return false;
    }

    wallet.balance -= amount;
    this.addTransaction(wallet, 'purchase', amount, description);
    return true;
  }

  private addTransaction(
    wallet: Wallet,
    type: TransactionType,
    amount: number,
    description: string,
  ): void {
    this.transactions.push({
      id: `TXN${String(this.nextTransactionId++).padStart(4, '0')}`,
      walletId: wallet.id,
      type,
      amount,
      date: new Date().toISOString(),
      description,
    });
  }
}