import { getCurrentUser } from './auth.js';
import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { renderLoginPage } from './login.js';
import { renderRegisterPage } from './register.js';
import { renderHomePage } from './home.js';
import { renderDashboardPage } from './dashboard.js';
import { renderExamCreationPage } from './createExam.js';
import { renderExamPage } from './exam.js';

// Fonction pour rendre l'application complète
export function renderApp() {
  const rootElement = document.getElementById('root');
  
  // Vider le contenu existant
  rootElement.innerHTML = '';
  
  // Création de la structure de base
  const appContainer = document.createElement('div');
  appContainer.className = 'app-container d-flex flex-column min-vh-100';
  
  // Ajouter la navbar
  const navbarContainer = document.createElement('header');
  appContainer.appendChild(navbarContainer);
  renderNavbar(navbarContainer);
  
  // Conteneur principal pour le contenu
  const mainContainer = document.createElement('main');
  mainContainer.className = 'container py-4 flex-grow-1';
  mainContainer.id = 'main-content';
  appContainer.appendChild(mainContainer);
  
  // Ajouter le footer
  const footerContainer = document.createElement('footer');
  appContainer.appendChild(footerContainer);
  renderFooter(footerContainer);
  
  // Ajouter l'app container au root
  rootElement.appendChild(appContainer);
  
  // Charger la page initiale basée sur l'URL
  loadPage(window.location.hash);
}

// Fonction pour charger la page en fonction de la route
export function loadPage(route) {
  const mainContainer = document.getElementById('main-content');
  mainContainer.innerHTML = '';
  
  // Obtenir l'utilisateur actuel
  const currentUser = getCurrentUser();
  
  // Déterminer quelle page afficher
  switch(route) {
    case '#login':
      renderLoginPage(mainContainer);
      break;
    case '#register':
      renderRegisterPage(mainContainer);
      break;
    case '#dashboard':
      if (currentUser) {
        renderDashboardPage(mainContainer, currentUser);
      } else {
        window.location.hash = '#login';
      }
      break;
    case '#create-exam':
      if (currentUser && currentUser.role === 'professor') {
        renderExamCreationPage(mainContainer);
      } else {
        window.location.hash = '#login';
      }
      break;
    case '#exam':
      if (currentUser) {
        renderExamPage(mainContainer);
      } else {
        window.location.hash = '#login';
      }
      break;
    default:
      renderHomePage(mainContainer);
      break;
  }
}
