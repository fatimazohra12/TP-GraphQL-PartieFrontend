import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/queries';

const AddTransaction = ({ refetch = () => {} }) => {
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('DEPOT');
  const [compteId, setCompteId] = useState('');
  const [compteSolde, setCompteSolde] = useState(null);

  const [addTransaction, { loading, error }] = useMutation(ADD_TRANSACTION, {
    onCompleted: (data) => {
      setCompteSolde(data.addTransaction.compte.solde);
      if (typeof refetch === 'function') {
        refetch(); // Recharge les données après ajout
      } else {
        console.warn('refetch n\'est pas défini ou n\'est pas une fonction');
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des données
    if (!montant || !date || !type || !compteId) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const variables = {
        transactionRequest: {
          montant: parseFloat(montant),
          date,
          type,
          compteId: parseInt(compteId),
        },
      };

      console.log('Variables envoyées :', variables);

      const response = await addTransaction({ variables });
      alert('Transaction ajoutée avec succès!');
      console.log('Nouveau solde du compte:', response.data.addTransaction.compte.solde);

      // Réinitialisation des champs
      setMontant('');
      setDate('');
      setType('DEPOT');
      setCompteId('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la transaction :', err);
      alert('Échec de l\'ajout de la transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une Transaction</h2>

      <div>
        <label>Montant :</label>
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          required
           min="0"
        />
      </div>

      <div>
        <label>Date :</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Type :</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="DEPOT">DEPOT</option>
          <option value="RETRAIT">RETRAIT</option>
        </select>
      </div>

      <div>
        <label>Compte ID :</label>
        <input
          type="number"
          value={compteId}
          onChange={(e) => setCompteId(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-ajouter" disabled={loading}>
        {loading ? 'Ajout en cours...' : 'Ajouter'}
      </button>

      {error && <p style={{ color: 'red' }}>Erreur : {error.message}</p>}

      {compteSolde !== null && (
        <div>
          <h3>Solde du compte après la transaction : {compteSolde}€</h3>
        </div>
      )}
    </form>
  );
};

export default AddTransaction;
