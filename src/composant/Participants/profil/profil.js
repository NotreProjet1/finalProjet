import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import UserProfileModal from './model';
import { FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit';
import { Avatar, Modal, Button } from '@mui/material';

const UserProfilParticipant = () => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [participantData, setParticipantData] = useState(location.state ? location.state.participantData : null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchParticipantData = async (participantId) => {
    try {
      const editedUserDataFromLocalStorage = localStorage.getItem('editedUserData');
      if (editedUserDataFromLocalStorage) {
        localStorage.setItem('participantData', JSON.stringify(editedUserDataFromLocalStorage));

      }
      else {
        const response = await axios.get(`http://localhost:3000/participant/${participantId}`);
        setParticipantData(response.data.participant);
        localStorage.setItem('participantData', JSON.stringify(response.data.participant));

      }
    } catch (error) {
      console.error('Error fetching participant data:', error);
    }
  };
  

  useEffect(() => {
    const storedParticipantData = localStorage.getItem('participantData');
    if (storedParticipantData) {
      setParticipantData(JSON.parse(storedParticipantData));
    }
  }, []);
  const handleUpdateParticipantData = (updatedData) => {
    setParticipantData(updatedData);
    toast.success('Données mises à jour avec succès !', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
  
  const handleAvatarUpload = async (event) => {
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const response = await axios.put(`http://localhost:3000/participant/avatar/${participantData.id_p}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        setParticipantData(response.data.participant);
        localStorage.setItem('participantData', JSON.stringify(response.data.participant));
  
        setIsAvatarModalOpen(false);
  
        // Afficher le message toast
        toast.success('Avatar ajouté avec succès !', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        // Recharger la page après un délai
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error('Veuillez sélectionner un fichier image.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleFileChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleOpenAvatarModal = () => {
    setIsAvatarModalOpen(true);
    setIsProfileModalOpen(false); // Fermer le modal de profil s'il est ouvert
  };
  
  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };
  
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsAvatarModalOpen(false); // Fermer le modal d'avatar s'il est ouvert
  };
  
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  const handleToastMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <section style={{ borderTop: "2px solid #000", borderTopColor: "black", background: 'linear-gradient(to bottom, #00FFFF 10%, white 40%, #00FFFF 60%)' }}>

      <MDBContainer className="py-5" style={{ marginTop: "-30px", }}>
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4" style={{ border: "2px solid #000", borderTopColor: "black", borderRightColor: "black", borderBottomColor: "black", borderLeftColor: "black" }}>
              <MDBBreadcrumbItem active> {participantData && participantData.prenom}  {participantData && participantData.nom ? ` ${participantData.nom}` : ''} Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center" style={{ border: "2px solid #000", borderTopColor: "black", borderRightColor: "black", borderBottomColor: "black", borderLeftColor: "black", borderRadius: "10px" }}>
                <div className="d-flex justify-content-center mb-2">
                  <div className="flex-shrink-0 position-relative">
                    {participantData && participantData.Avatar ? (
                      <>
                        <Avatar src={`http://localhost:3000/uploads/${participantData.Avatar}`} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                        {/* Edit icon */}
                        <div className="edit-icon" onClick={handleOpenAvatarModal}>
                          <FaEdit />
                        </div>
                      </>
                    ) : (
                      <div className="avatar-placeholder">
                        <MDBBtn onClick={handleOpenAvatarModal} style={{ width: '100px', height: '100px', borderRadius: '50%', fontSize: '24px' }}>+</MDBBtn>
                      </div>
                    )}
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0" style={{ border: "2px solid #000", borderTopColor: "black", borderRightColor: "black", borderBottomColor: "black", borderLeftColor: "black" }}>
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fas icon="globe fa-lg text-warning" />
                    <MDBCardText>{participantData && participantData.website}</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                    <MDBCardText>{participantData && participantData.github}</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                    <MDBCardText>{participantData && participantData.twitter}</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                    <MDBCardText>{participantData && participantData.instagram}</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                    <MDBCardText>{participantData && participantData.facebook}</MDBCardText>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4" style={{ border: "2px solid #000", borderTopColor: "black", borderRightColor: "black", borderBottomColor: "black", borderLeftColor: "black" }}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{participantData && participantData.emailP}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>categorie  </MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{participantData && participantData.categorie}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Mobile</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{participantData && participantData.tel}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>domaine</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{participantData && participantData.domaine}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <section style={{ justifyContent: "center", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                  <MDBBtn onClick={handleOpenProfileModal} style={{ marginBottom: "-100px" }}  >Modifier vos donne </MDBBtn>
                </section>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <Modal open={isAvatarModalOpen} onClose={handleCloseAvatarModal}>
          <div className="modal-content" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px" }}>
            <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
            <Button onClick={handleAvatarUpload} variant="contained" color="primary">Envoyer</Button>
          </div>
        </Modal>
        {isProfileModalOpen && (
  <UserProfileModal
    isOpen={isProfileModalOpen} // Corrected
    handleToastMessage={handleToastMessage} // Pass the handleToastMessage function
    onClose={handleCloseProfileModal}
    userData={participantData}
    userId={participantData.id_p}
    updateParticipantData={handleUpdateParticipantData}
    fetchParticipantData={fetchParticipantData}
  />
)}
      </MDBContainer>
      <ToastContainer />
    </section>
  );
};

export default UserProfilParticipant;
