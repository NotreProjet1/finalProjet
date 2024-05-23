import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInputGroup, MDBIcon } from 'mdb-react-ui-kit';

const FormationAdminD = () => {
  const [formations, setFormations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Nombre d'éléments à afficher par page

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/formationP/lister`);
        setFormations(response.data.liste);
      } catch (error) {
        console.error('Erreur lors de la récupération des formations :', error);
      }
    };

    fetchFormations();
  }, []);

  const handleSearchChange = async (value) => {
    setSearchQuery(value);
    // Effectuer une recherche à chaque changement de la valeur de recherche
    try {
      const response = await axios.get(`http://localhost:3000/formationP/searchByDomaine?domaine=${value}`);
      setFormations(response.data.formations || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des formations :', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:3000/formationP/accepter/${id}`);
      setFormations(prevFormations => prevFormations.map(formation =>
        formation.id_fp === id ? { ...formation, accepted: true } : formation
      ));
      localStorage.setItem('acceptedFormations', JSON.stringify([...getAcceptedFormations(), id]));
      toast.success('Formation acceptée avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la formation :', error);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:3000/formationP/refuser/${id}`);
      setFormations(prevFormations => prevFormations.map(formation =>
        formation.id_fp === id ? { ...formation, rejected: true } : formation
      ));
      localStorage.setItem('rejectedFormations', JSON.stringify([...getRejectedFormations(), id]));
      toast.success('Formation refusée avec succès.');
    } catch (error) {
      console.error('Erreur lors du refus de la formation :', error);
    }
  };

  const getAcceptedFormations = () => {
    return JSON.parse(localStorage.getItem('acceptedFormations') || '[]');
  };

  const getRejectedFormations = () => {
    return JSON.parse(localStorage.getItem('rejectedFormations') || '[]');
  };

  // Filtrer les formations en fonction de leur état (non acceptées et non refusées)
  const filteredFormations = formations.filter(formation =>
    !getAcceptedFormations().includes(formation.id_fp) && !getRejectedFormations().includes(formation.id_fp)
  );

  // Pagination - Calcul de l'index de début et de fin pour l'affichage des éléments actuels
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFormations.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const styles = {
    pageBackground: {
      backgroundColor: '#eee',
    }, }
  return (
    <div style={styles.pageBackground}> 
    <div className="Formation-list-admin" style={{ backgroundColor: '#93e2bb', marginTop:'80px' }}>
      <ToastContainer />

      <h1 className="text-center" style={{ color: '#5e4803', fontFamily: 'Pacifico, Cursive', fontSize: '40px' }}>Demande de Formation</h1>

      <div className="d-flex justify-content-center">
        <MDBInputGroup className="w-50">
          <input
            type="text"
            className="form-control h-100"
            placeholder="Rechercher par domaine..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          
          />
          <MDBBtn
            color='primary'
            disabled={searchQuery === ''}
            className="align-items-center h-100"
          >
            <MDBIcon icon='search' size="sm"  className="mr-1 text-white" />
            <span className="align-middle">Rechercher</span>
          </MDBBtn>
        </MDBInputGroup>
      </div>

      <MDBTable align='middle' style={{ borderRadius: '15px', backgroundColor: '#93e2bb' , marginTop :'20px' }}>
        <MDBTableHead>
          <tr>
            <th>Titre</th>
            <th>Domaine</th>
            <th>Niveau</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Instructeur</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentItems.map((formation) => (
            <tr key={formation.id_fp}>
              <td>{formation.titre}</td>
              <td>{formation.domaine}</td>
              <td>{formation.niveaux}</td>
              <td>{formation.description}</td>
              <td>{formation.prix}</td>
              <td>{`${formation.instructeur_prenom} ${formation.instructeur_nom}`}</td>
              <td>
                <MDBBtn color='success' rounded size='sm' onClick={() => handleAccept(formation.id_fp)}>
                  Accepter
                </MDBBtn>
                <MDBBtn color='danger' rounded size='sm' onClick={() => handleReject(formation.id_fp)}>
                  Refuser
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      {/* Pagination */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <MDBBtn color='light' size='sm' onClick={handlePrevPage} disabled={currentPage === 1}>Précédent</MDBBtn>
        <span style={{ margin: '0 10px' }}>{currentPage} / {totalPages}</span>
        <MDBBtn color='light' size='sm' onClick={handleNextPage} disabled={currentPage === totalPages}>Suivant</MDBBtn>
      </div>
    </div> </div>
  );
};

export default FormationAdminD;
