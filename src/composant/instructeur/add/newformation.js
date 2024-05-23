import React, { useState,useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Input } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../css/addformation.css';
import { Link, useParams, useHistory } from 'react-router-dom'; 
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddFormationForm = () => {
  const { userId } = useParams();
  const history = useHistory(); 
  const [lastFormationId, setLastFormationId] = useState(null);

  const [formationData, setFormationData] = useState({
    titre: '',
    description: '',
    domaine: '',
    prix: '',
    certeficat: '',
    niveaux: '',
    plantFile: null,
  });
  useEffect(() => {
    const fetchLastFormationId = async () => {
      try {
        const response = await axios.get('http://localhost:3000/formationP/getLastFormationId');
        if (response.data.success) {
          setLastFormationId(response.data.lastFormationId);
        } else {
          console.error('Erreur lors de la récupération du dernier ID de formation :', response.data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du dernier ID de formation :', error);
      }
    };

    fetchLastFormationId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormationData((prevData) => ({
      ...prevData,
      plantFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('titre', formationData.titre);
      formData.append('description', formationData.description);
      formData.append('domaine', formationData.domaine);
      formData.append('prix', formationData.prix);
      formData.append('certeficat', formationData.certeficat);
      formData.append('niveaux', formationData.niveaux);
      formData.append('plant', formationData.plantFile);
      formData.append('instructeurfp_id', userId);

      const config = {
        headers: {
          'Authorization': ` ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.post(`http://localhost:3000/formationP/ajouter`, formData, config);
      console.log(response.data);
     

      toast.success('formation créé avec succès', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      history.push(`/AddCoursPayent/${lastFormationId}`);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du formation :', error.response.data);
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
      
      <div className="add-formation-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
       {/* <div className="sidebar" style={{ background: "hsla(0, 0%, 100%, 0.7)", backdropFilter: "blur(30px)", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
  <h3 className="header">Ajouter les cours correspondants</h3>
  <Button variant="contained" color="primary" className="sidebar-button" style={{ marginTop: "20px" ,marginLeft:"40px" }}>
    <Link to="/AddCoursPayent/:formationId" className="text-center text-white" style={{ textDecoration: "none" }}>Ajouter un cours</Link>
  </Button>
</div> */}

      <div className="main-content" style={{background: "hsla(0, 0%, 100%, 0.7)", backdropFilter: "blur(30px)",borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth variant="outlined" required className="form-control" style={{marginTop:"20px"}}>
            <InputLabel htmlFor="domaine-label" >
              Domaine
            </InputLabel>
            <Select
              labelId="domaine-label"
              label="Domaine"
              name="domaine"
              value={formationData.domaine}
              onChange={handleChange}
            >
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" required className="form-control" style={{marginTop:"20px"}}>
            <InputLabel htmlFor="niveaux-label">
              Niveaux
            </InputLabel>
            <Select
              labelId="niveaux-label"
              label="Niveaux"
              name="niveaux"
              value={formationData.niveaux}
              onChange={handleChange}
            >
              <MenuItem value="Beginner">Débutant</MenuItem>
              <MenuItem value="Intermediate">Intermédiaire</MenuItem>
              <MenuItem value="Professional">Professionnel</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Titre"
            variant="outlined"
            fullWidth
            name="titre"
            value={formationData.titre}
            onChange={handleChange}
            required
            className="form-control"
            style={{ marginTop: "20px" }}

          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={formationData.description}
            onChange={handleChange}
            required
            className="form-control"
            style={{ marginTop: "20px" }}

          />

          <TextField
            label="Prix"
            variant="outlined"
            fullWidth
            name="prix"
            value={formationData.prix}
            onChange={handleChange}
            className="form-control"
            style={{ marginTop: "20px" }}

          />
          <TextField
            label="Certificat"
            variant="outlined"
            fullWidth
            name="certeficat"
            value={formationData.certeficat}
            onChange={handleChange}
            required
            className="form-control"
            style={{ marginTop: "20px" }}

          />

          <InputLabel htmlFor="plantFileInput" className="form-label">
            <CloudUploadIcon/> {/* Icône d'upload */}
            Ajouter un fichier pour le Plant de formation 
          </InputLabel>
          <Input
            id="plantFileInput"
            name="plantFile"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="file-input"
            style={{ marginTop: "20px" }}

          />

          <Button type="submit" variant="contained" color="primary" className="submit-button">
            Ajouter Formation
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
    </section>
  );
};

export default AddFormationForm;