// Importation des modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialiser l'application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Servir les fichiers HTML et statiques
const path = require('path');
app.use(express.static(path.join(__dirname)));


// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur connecté avec succès !' });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
