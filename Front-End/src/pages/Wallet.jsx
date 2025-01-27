import React from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export const Wallet = () => {
  const wallet = {
    balance: 1250.00,
    blocked: 200.00,
    currency: 'USD'
  };

  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 50.00,
      description: 'Package delivery completed',
      date: '2024-03-20',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 35.00,
      description: 'Withdrawal to bank account',
      date: '2024-03-19',
      status: 'completed'
    },
    {
      id: 3,
      type: 'blocked',
      amount: 200.00,
      description: 'Package in transit',
      date: '2024-03-18',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wallet Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <WalletIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Available Balance</p>
                <p className="text-2xl font-semibold text-gray-900">${wallet.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Blocked Amount</p>
                <p className="text-2xl font-semibold text-gray-900">${wallet.blocked.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between space-x-4">
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Add Money
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Transaction History</h2>
          <div className="bg-white shadow-sm rounded-lg">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <li key={transaction.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {transaction.type === 'credit' ? (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowDownRight className="h-5 w-5 text-green-600" />
                          </div>
                        ) : transaction.type === 'debit' ? (
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" /> </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 
                          transaction.type === 'debit' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};