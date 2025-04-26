// Script pour le formulaire d'inscription
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
  
    if (registerForm) {
      // Pré-remplir le type d'utilisateur depuis l'URL si disponible
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
  
      if (roleParam && (roleParam === 'student' || roleParam === 'teacher')) {
        document.getElementById('userType').value = roleParam;
      }
  
      // Validation du formulaire
      registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
  
        // Récupération des valeurs du formulaire
        const userType = document.getElementById('userType').value;
        const email = document.getElementById('email').value;
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const birthdate = document.getElementById('birthdate').value;
        const gender = document.getElementById('gender').value;
        const institution = document.getElementById('institution').value;
        const field = document.getElementById('field').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
  
        // Validation de base côté client
        if (password !== confirmPassword) {
          alert('Les mots de passe ne correspondent pas.');
          return;
        }
  
        if (password.length < 8) {
          alert('Le mot de passe doit contenir au moins 8 caractères.');
          return;
        }
  
        // Préparation des données à envoyer
        const userData = {
          email,
          firstname,
          lastname,
          birthdate,
          gender,
          institution,
          field,
          password,
          role: userType
        };
  
        try {
          const result = await register(userData);
  
          if (result) {
            alert('Inscription réussie! Vous pouvez maintenant vous connecter.');
            window.location.href = 'login.html';
          } else {
            alert(result.message || 'Erreur lors de l\'inscription.');
          }
  
        } catch (error) {
          console.error('Erreur lors de l\'inscription:', error);
          alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
      });
    }
  });
  