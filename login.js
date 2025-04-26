// Script pour le formulaire de connexion
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const result = await login(email, password);

        if (result && result.user) {
          if (result.user.role === 'teacher') {
            window.location.href = 'teacherdashboard.html';
          } else if (result.user.role === 'student') {
            window.location.href = 'studentdashboard.html';
          } else {
            alert('Rôle utilisateur inconnu.');
          }
        } else {
          alert('Erreur lors de la connexion.');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Email ou mot de passe incorrect.');
      }
    });
  }
});
