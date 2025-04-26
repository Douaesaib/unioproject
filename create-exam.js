// Script pour la création d'examens
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification et le rôle
    const user = JSON.parse(localStorage.getItem('D&A Quiz_user') || '{}');
    if (!user.id || user.role !== 'teacher') {
      window.location.href = 'login.html';
      return;
    }
    
    // Référence aux formulaires
    const examInfoForm = document.getElementById('exam-info-form');
    const directQuestionForm = document.getElementById('direct-question-form');
    const qcmQuestionForm = document.getElementById('qcm-question-form');
    
    // Variables pour stocker les données d'examen
    let currentExam = {
      id: null,
      title: '',
      description: '',
      target: '',
      link: '',
      questions: []
    };
    
    // Gestion du changement de type de question
    const questionTypeRadios = document.querySelectorAll('input[name="question-type"]');
    questionTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'direct') {
          directQuestionForm.classList.remove('d-none');
          qcmQuestionForm.classList.add('d-none');
        } else if (this.value === 'qcm') {
          directQuestionForm.classList.add('d-none');
          qcmQuestionForm.classList.remove('d-none');
        }
      });
    });
    
    // Gestion de l'ajout d'option pour les QCM
    const addOptionBtn = document.getElementById('add-option-btn');
    if (addOptionBtn) {
      addOptionBtn.addEventListener('click', function() {
        const optionsContainer = document.querySelector('#options-container .mb-3');
        const optionItems = optionsContainer.querySelectorAll('.option-item');
        const newItemIndex = optionItems.length + 1;
        
        const newOptionItem = document.createElement('div');
        newOptionItem.className = 'option-item mb-2';
        newOptionItem.innerHTML = `
          <div class="input-group">
            <div class="input-group-text">
              <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Correct answer">
            </div>
            <input type="text" class="form-control" placeholder="Option ${newItemIndex}" required>
            <button type="button" class="btn btn-outline-danger remove-option">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        `;
        
        // Ajouter l'élément et écouter l'événement de suppression
        optionsContainer.appendChild(newOptionItem);
        
        // Activer les boutons de suppression pour toutes les options sauf si moins de 3
        toggleRemoveOptionButtons();
        
        // Écouter l'événement de suppression
        const removeBtn = newOptionItem.querySelector('.remove-option');
        removeBtn.addEventListener('click', function() {
          newOptionItem.remove();
          toggleRemoveOptionButtons();
        });
      });
    }
    
    // Active/désactive les boutons de suppression d'options QCM
    function toggleRemoveOptionButtons() {
      const optionItems = document.querySelectorAll('#options-container .option-item');
      optionItems.forEach(item => {
        const removeBtn = item.querySelector('.remove-option');
        if (optionItems.length <= 2) {
          removeBtn.classList.add('d-none');
        } else {
          removeBtn.classList.remove('d-none');
        }
      });
    }
    
    // Initialiser les boutons de suppression d'options QCM
    toggleRemoveOptionButtons();
    
    // Soumission du formulaire d'information d'examen
    if (examInfoForm) {
      examInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const title = document.getElementById('exam-title').value;
        const description = document.getElementById('exam-description').value;
        const target = document.getElementById('exam-target').value;
        
        // Stocker les valeurs
        currentExam.title = title;
        currentExam.description = description;
        currentExam.target = target;
        currentExam.id = generateExamId();
        currentExam.link = `http://localhost:3000/exam/${currentExam.id}`;
        
        // Afficher le lien unique
        document.getElementById('exam-link').value = currentExam.link;
        
        // Afficher les sections suivantes
        document.getElementById('exam-created').classList.remove('d-none');
        document.getElementById('add-questions-section').classList.remove('d-none');
        document.getElementById('questions-list-section').classList.remove('d-none');
        
        // Désactiver le formulaire d'information
        disableForm(examInfoForm);
      });
    }
    
    // Soumission du formulaire de question directe
    if (directQuestionForm) {
      directQuestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const questionText = document.getElementById('question-text').value;
        const mediaInput = document.getElementById('question-media');
        const mediaFile = mediaInput.files.length > 0 ? mediaInput.files[0].name : null;
        const expectedAnswer = document.getElementById('expected-answer').value;
        const toleranceRate = document.getElementById('tolerance-rate').value;
        const duration = document.getElementById('question-duration').value;
        const points = document.getElementById('question-points').value;
        
        // Créer l'objet question
        const question = {
          id: generateQuestionId(),
          type: 'direct',
          text: questionText,
          media: mediaFile,
          expectedAnswer,
          toleranceRate,
          duration,
          points
        };
        
        // Ajouter à la liste des questions
        addQuestionToList(question);
        
        // Réinitialiser le formulaire
        directQuestionForm.reset();
      });
    }
    
    // Soumission du formulaire de question QCM
    if (qcmQuestionForm) {
      qcmQuestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const questionText = document.getElementById('qcm-question-text').value;
        const mediaInput = document.getElementById('qcm-question-media');
        const mediaFile = mediaInput.files.length > 0 ? mediaInput.files[0].name : null;
        const duration = document.getElementById('qcm-question-duration').value;
        const points = document.getElementById('qcm-question-points').value;
        
        // Récupérer les options
        const optionItems = document.querySelectorAll('#options-container .option-item');
        const options = Array.from(optionItems).map(item => {
          const checkbox = item.querySelector('input[type="checkbox"]');
          const textInput = item.querySelector('input[type="text"]');
          return {
            text: textInput.value,
            isCorrect: checkbox.checked
          };
        });
        
        // Créer l'objet question
        const question = {
          id: generateQuestionId(),
          type: 'qcm',
          text: questionText,
          media: mediaFile,
          options,
          duration,
          points
        };
        
        // Ajouter à la liste des questions
        addQuestionToList(question);
        
        // Réinitialiser le formulaire
        qcmQuestionForm.reset();
        
        // Réinitialiser les options QCM (garder seulement 2)
        const optionsContainer = document.querySelector('#options-container .mb-3');
        while (optionsContainer.children.length > 2) {
          optionsContainer.removeChild(optionsContainer.lastChild);
        }
        
        // Réinitialiser les valeurs des options restantes
        const remainingOptions = optionsContainer.querySelectorAll('.option-item');
        remainingOptions.forEach((item, index) => {
          const checkbox = item.querySelector('input[type="checkbox"]');
          const textInput = item.querySelector('input[type="text"]');
          checkbox.checked = false;
          textInput.value = '';
          textInput.placeholder = `Option ${index + 1}`;
        });
        
        toggleRemoveOptionButtons();
      });
    }
    
    // Fonction pour ajouter une question à la liste
    function addQuestionToList(question) {
      // Ajouter à l'objet examen
      currentExam.questions.push(question);
      
      // Ajouter à la table HTML
      const tbody = document.getElementById('questions-table-body');
      const row = document.createElement('tr');
      
      const typeLabel = question.type === 'direct' ? 'Question directe' : 'QCM';
      
      row.innerHTML = `
        <td>${typeLabel}</td>
        <td>${truncateText(question.text, 50)}</td>
        <td>${question.duration} sec</td>
        <td>${question.points} pts</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="removeQuestion('${question.id}')">
            Supprimer
          </button>
        </td>
      `;
      
      tbody.appendChild(row);
      
      // Fonction pour tronquer le texte long
      function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      }
    }
    
    // Fonction pour supprimer une question
    window.removeQuestion = function(questionId) {
      // Supprimer de l'objet examen
      currentExam.questions = currentExam.questions.filter(q => q.id !== questionId);
      
      // Supprimer de la table HTML
      const tbody = document.getElementById('questions-table-body');
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const deleteButton = row.querySelector('button');
        if (deleteButton && deleteButton.getAttribute('onclick').includes(questionId)) {
          row.remove();
        }
      });
    };
    
    // Fonction pour désactiver un formulaire
    function disableForm(form) {
      const inputs = form.querySelectorAll('input, textarea, select, button');
      inputs.forEach(input => {
        input.setAttribute('disabled', 'disabled');
      });
    }
    
    // Fonction pour copier le lien de l'examen
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function() {
        const linkInput = document.getElementById('exam-link');
        navigator.clipboard.writeText(linkInput.value).then(() => {
          alert('Lien copié dans le presse-papier !');
        }).catch(err => {
          console.error('Erreur lors de la copie :', err);
        });
      });
    }
    
    // Générer un ID unique pour l'examen
    function generateExamId() {
      return 'exam_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Générer un ID unique pour la question
    function generateQuestionId() {
      return 'q_' + Math.random().toString(36).substr(2, 9);
    }
  });