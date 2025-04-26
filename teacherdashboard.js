// Script pour le tableau de bord enseignant
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification et le rôle
    const user = JSON.parse(localStorage.getItem('D&A Quiz_user') || '{}');
    if (!user.id || user.role !== 'teacher') {
      window.location.href = 'login.html';
      return;
    }
    
    // Charger les examens (simulé)
    loadExams();
    
    // Configuration du modal de suppression
    const deleteModal = document.getElementById('deleteExamModal');
    if (deleteModal) {
      const confirmDeleteBtn = document.getElementById('confirm-delete');
      let examToDelete = null;
      
      // Attacher l'événement au bouton de confirmation
      confirmDeleteBtn.addEventListener('click', function() {
        if (examToDelete) {
          deleteExam(examToDelete);
          const modal = bootstrap.Modal.getInstance(deleteModal);
          modal.hide();
        }
      });
      
      // Fonction pour ouvrir le modal avec l'ID de l'examen
      window.openDeleteModal = function(examId) {
        examToDelete = examId;
        const modal = new bootstrap.Modal(deleteModal);
        modal.show();
      };
    }
  });
  
  // Fonction pour charger les examens
  function loadExams() {
    const examsList = document.getElementById('exams-list');
    if (!examsList) return;
    
    // Simuler des données d'examen pour le développement
    const fakeExams = [
      {
        id: '1',
        title: 'Introduction à JavaScript',
        description: 'Concepts de base de JavaScript pour débutants',
        target: '2e année MIP, S4, groupe A',
        link: 'http://localhost:3000/exam/abc123'
      },
      {
        id: '2',
        title: 'Algorithmes et structures de données',
        description: 'Examen sur les algorithmes fondamentaux',
        target: '3e année CS, S6, groupe B',
        link: 'http://localhost:3000/exam/def456'
      }
    ];
    
    // Vider la liste
    examsList.innerHTML = '';
    
    // Afficher chaque examen
    if (fakeExams.length === 0) {
      examsList.innerHTML = `
        <tr class="no-exams-message">
          <td colspan="5" class="text-center">Vous n'avez pas encore créé d'examen.</td>
        </tr>
      `;
    } else {
      fakeExams.forEach(exam => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${exam.title}</td>
          <td>${exam.description}</td>
          <td>${exam.target}</td>
          <td>
            <div class="input-group input-group-sm">
              <input type="text" class="form-control form-control-sm" value="${exam.link}" readonly>
              <button class="btn btn-outline-secondary btn-sm" onclick="copyToClipboard('${exam.link}')">
                Copier
              </button>
            </div>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editExam('${exam.id}')">
              Modifier
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal('${exam.id}')">
              Supprimer
            </button>
          </td>
        `;
        examsList.appendChild(row);
      });
    }
  }
  
  // Fonction pour copier le lien dans le presse-papier
  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Lien copié dans le presse-papier !');
    }).catch(err => {
      console.error('Erreur lors de la copie :', err);
    });
  };
  
  // Fonction pour éditer un examen
  window.editExam = function(examId) {
    console.log('Édition de l\'examen:', examId);
    // Rediriger vers la page d'édition (à implémenter)
    // window.location.href = `/teacher/edit-exam.html?id=${examId}`;
  };
  
  // Fonction pour supprimer un examen
  function deleteExam(examId) {
    console.log('Suppression de l\'examen:', examId);
    
    // Simuler la suppression
    alert('Examen supprimé avec succès !');
    loadExams(); // Recharger la liste
    
    // Décommenter pour l'implémentation réelle
    /*
    fetch(`${API_URL}/exams/${examId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('D&A Quiz_token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Examen supprimé avec succès !');
        loadExams();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la suppression.');
    });
    */
  }