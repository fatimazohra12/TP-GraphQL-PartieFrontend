import React, { useState } from 'react';
import AddTransaction from '../components/AddTransaction';
import Transactions from '../components/Transactions';

const TransactionsPage = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  return (
    <div className="transactions-page">
      <Transactions />
      <div className="button-group">
        <button
          className="action-button"
          onClick={() => setShowAddTransaction(!showAddTransaction)}
        >
          {showAddTransaction ? 'Masquer' : 'Ajouter'}
        </button>
      </div>
      {showAddTransaction && <AddTransaction />}
    </div>
  );
};

export default TransactionsPage;
