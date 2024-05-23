import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { DownloadOutlined } from '@mui/icons-material';
import { colors } from '@mui/material';

const Tableau = () => {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    fetchInstructeurs();
  }, []);

  const fetchInstructeurs = async () => {
    try {
      const response = await fetch('http://localhost:3000/instructeur/lister');
      if (response.ok) {
        const data = await response.json();
        // Ajouter une propriété id unique à chaque objet de données
        const dataWithIds = data.liste.map((item, index) => ({
          ...item,
          id: index + 1 // Vous pouvez utiliser un mécanisme plus robuste pour générer des IDs uniques
        }));
        setMergedData(dataWithIds);
      } else {
        console.error('Erreur lors de la récupération des instructeurs:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des instructeurs:', error);
    }
  };
  

  const exportToExcel = async () => {
    try {
      const response = await fetch('http://localhost:3000/export/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: mergedData }),
      });

      if (response.ok) {
        // Télécharger le fichier Excel
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Erreur lors de l\'exportation en Excel:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation en Excel:', error);
    }
  };

  const columns = [
    {
      field: 'nomInstructeur',
      headerName: 'Instructeur',
      width: 250,
      valueGetter: (params) => `${params.row.nomInstructeur} ${params.row.prenomInstructeur}`,
    },
    { field: 'titreCours', headerName: 'Titre du Cours', width: 200 , colors: '#036475 '},
    { field: 'titreFormation', headerName: 'Titre de la Formation', width: 200 },
    { field: 'titreRessource', headerName: 'Titre de la Ressource', width: 200 },
  ];

  return (
    <div style={{ height: 400, width: '80%', marginLeft:'180px',  marginBottom:'20px' , marginTop:'120px' }}>
   
      <DataGrid
        rows={mergedData}
        columns={columns}
        components={{
          Toolbar: GridToolbar,
        }} 
      />
    </div>
  );
};

export default Tableau;
