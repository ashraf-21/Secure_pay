import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

const TransactionList = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2">Transaction ID</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Mode</th>
              <th className="text-left p-2">Amount (₹)</th>
              <th className="text-left p-2">Sender</th>
              <th className="text-left p-2">Receiver</th>
              <th className="text-left p-2">Fraud Status</th>
              <th className="text-left p-2">Score</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transactionId} className="border-b border-border">

                <td className="p-2">{tx.transactionId}</td>

                <td className="p-2">{tx.transactionType}</td>

                <td className="p-2">{tx.transactionMode}</td>

                <td className="p-2">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                </td>

                <td className="p-2">{tx.senderId}</td>

                <td className="p-2">{tx.receiverId}</td>

                <td className="p-2">
                  {tx.isFraud ? (
                    <span className="flex items-center gap-2 text-red-500">
                      <AlertTriangle size={16} />
                      Fraud
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-green-500">
                      <CheckCircle size={16} />
                      Safe
                    </span>
                  )}
                </td>

                <td className="p-2">
                  {(tx.fraudScore * 100).toFixed(1)}%
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TransactionList;  