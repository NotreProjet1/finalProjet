import React, { useState } from 'react';
import { TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPublication = () => {
  const [publicationData, setPublicationData] = useState({
    titre: '',
    description: '',
    contenu: '', // Modification : ajout du champ de contenu
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublicationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('titre', publicationData.titre);
      formData.append('description', publicationData.description);
      formData.append('contenu', publicationData.contenu);

      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Authorization': ` ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(`http://localhost:3000/publication/ajouter`, formData, config);

      console.log(response.data);
      toast.success('Cours créé avec succès', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du cours :', error.response.data);
      toast.error('Échec de la création du cours', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <section className="background-radial-gradient overflow-hidden">
      <style>{`
        .background-radial-gradient {
          background-color: hsl(218, 41%, 15%);
          background-image: radial-gradient(650px circle at 0% 0%,
            hsl(218, 41%, 35%) 15%,
            hsl(218, 41%, 30%) 35%,
            hsl(218, 41%, 20%) 75%,
            hsl(218, 41%, 19%) 80%,
            transparent 100%),
            radial-gradient(1250px circle at 100% 100%,
            hsl(218, 41%, 45%) 15%,
            hsl(218, 41%, 30%) 35%,
            hsl(218, 41%, 20%) 75%,
            hsl(218, 41%, 19%) 80%,
            transparent 100%);
        }

        #radius-shape-1 {
          height: 220px;
          width: 220px;
          top: -60px;
          left: -130px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }

        #radius-shape-2 {
          border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
          bottom: -60px;
          right: -110px;
          width: 300px;
          height: 300px;
          background: radial-gradient(#44006b, #ad1fff);
          overflow: hidden;
        }

        .bg-glass {
          background-color: hsla(0, 0%, 100%, 0.9) !important;
          backdrop-filter: saturate(200%) blur(25px);
        }
      `}</style>

      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
              Proposer <br />
              <span style={{ color: 'hsl(218, 81%, 75%)' }}>leurs Publication</span>
            </h1>
            <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
              Un grand merci à nos instructeurs pour leur soutien pédagogique, guidant nos élèves vers la réussite avec expertise et disponibilité.
            </p>
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

            <div className="card bg-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <TextField
                      id="titre"
                      label="Titre"
                      variant="outlined"
                      fullWidth
                      name="titre"
                      value={publicationData.titre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      id="description"
                      label="Description"
                      variant="outlined"
                      fullWidth
                      name="description"
                      value={publicationData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contenu" className="form-label">Contenu</label>
                    <textarea
                      id="contenu"
                      name="contenu"
                      rows="4"
                      value={publicationData.contenu}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <Button type="submit" variant="contained" color="primary" className="submit-button">
                    Ajouter Publication
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default AddPublication;
