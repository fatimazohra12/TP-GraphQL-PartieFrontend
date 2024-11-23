import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE, GET_ALL_COMPTES } from '../graphql/queries';

const AddComptes = () => {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');
  const [dateCreation, setDateCreation] = useState(new Date().toISOString().split('T')[0]); // Format yyyy-MM-dd

  const [saveCompte, { error }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider les données
    if (!solde || isNaN(solde)) {
      alert("Veuillez entrer un solde valide.");
      return;
    }

    try {
      // Appeler la mutation GraphQL
      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde), // Convertir le solde en nombre
            type,
            dateCreation, // La date est déjà au format attendu
          },
        },
      });

      // Réinitialiser les champs du formulaire
      setSolde('');
      setType('COURANT');
      setDateCreation(new Date().toISOString().split('T')[0]); // Réinitialiser la date au format yyyy-MM-dd
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p>Erreur lors de l'ajout du compte : {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="number"
          value={solde}
          onChange={(e) => setSolde(e.target.value)}
          placeholder="Solde"
          required
          min="0"
        />
      </div>


      <div>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="COURANT">COURANT</option>
          <option value="EPARGNE">EPARGNE</option>
        </select>
      </div>

      <div>
        <input
          type="date"
          value={dateCreation}
          onChange={(e) => setDateCreation(e.target.value)} // Permet de modifier la date
          required
        />
      </div>

      <button type="submit" className="btn-ajouter">Ajouter</button>
    </form>
  );
};

export default AddComptes;
