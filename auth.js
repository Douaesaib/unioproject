// Gestion de l'authentification

//  Configuration
const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'da_quiz_token';
const USER_KEY = 'da_quiz_user';

//  Fonction pour s'inscrire
async function register(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      // TODO: améliorer le message d’erreur à afficher dans l'UI
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }

    console.log("Inscription réussie :", data);
    return data;

  } catch (error) {
    console.error('Erreur pendant l\'inscription :', error);
    throw error;
  }
}

//  Fonction pour se connecter
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      // TODO: afficher un message d'erreur à l'utilisateur
      throw new Error(data.message || 'Échec de la connexion');
    }

    // Enregistrer les infos dans localStorage
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    console.log("Connexion réussie pour :", data.user.email);
    return data;

  } catch (error) {
    console.error('Erreur de connexion :', error);
    throw error;
  }
}

//  Déconnexion
function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  console.log("Utilisateur déconnecté");
  window.location.href = 'login.html';
}

//  Vérifier l'authentification
function isAuthenticated() {
  return !!getToken();
}

//  Récupérer le token
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

//  Récupérer l'utilisateur actuel
function getCurrentUser() {
  const userString = localStorage.getItem(USER_KEY);
  return userString ? JSON.parse(userString) : null;
}

//  Vérifier le rôle
function hasRole(role) {
  const user = getCurrentUser();
  return user && user.role === role;
}

//  Redirection si pas connecté
function requireAuth() {
  if (!isAuthenticated()) {
    console.warn("Redirection : utilisateur non connecté");
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

//  Redirection selon le rôle
function requireRole(role) {
  if (!requireAuth()) return false;

  if (!hasRole(role)) {
    console.warn("Accès refusé : rôle incorrect");
    window.location.href = '/';
    return false;
  }

  return true;
}

// Événements DOM
document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Mettre le nom d'utilisateur dans la navbar
  const usernameElement = document.getElementById('username');
  if (usernameElement && isAuthenticated()) {
    const user = getCurrentUser();
    if (user) {
      usernameElement.textContent = `${user.firstname} ${user.lastname}`;
    }
  }

  // Affichage conditionnel du menu
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');

  if (authButtons && userMenu) {
    if (isAuthenticated()) {
      authButtons.classList.add('d-none');
      userMenu.classList.remove('d-none');

      const dashboardLink = document.getElementById('dashboard-link');
      const user = getCurrentUser();

      if (dashboardLink && user) {
        // TODO: vérifier si les pages dashboard existent
        if (user.role === 'teacher') {
          dashboardLink.href = 'teacherdashboard.html';
        } else if (user.role === 'student') {
          dashboardLink.href = 'studentdashboard.html';
        }
      }

    } else {
      authButtons.classList.remove('d-none');
      userMenu.classList.add('d-none');
    }
  }
});

