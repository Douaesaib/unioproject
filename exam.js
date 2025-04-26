// Script pour la page d'examen étudiant
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    const user = JSON.parse(localStorage.getItem('D&A Quiz_user') || '{}');
    if (!user.id) {
      window.location.href = 'login.html';
      return;
    }
    
    // Afficher le nom de l'utilisateur
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement && user) {
      userInfoElement.textContent = `${user.firstname} ${user.lastname}`;
    }
    
    // Variables pour stocker les données d'examen
    let examData = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let geolocationData = null;
    
    // Récupérer l'ID de l'examen depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('id');
    
    if (!examId) {
      alert('ID d\'examen non valide.');
      window.location.href = '/';
      return;
    }
    
    // Demande de géolocalisation
    const geolocationRequest = document.getElementById('geolocation-request');
    const enableGeoBtn = document.getElementById('enable-geolocation');
    
    enableGeoBtn.addEventListener('click', function() {
      requestGeolocation();
    });
    
    // Fonction pour demander la géolocalisation
    function requestGeolocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            geolocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp
            };
            
            console.log('Géolocalisation activée:', geolocationData);
            
            // Masquer la demande et charger l'examen
            geolocationRequest.classList.add('d-none');
            loadExam(examId);
          },
          function(error) {
            console.error('Erreur de géolocalisation:', error);
            alert('La géolocalisation est requise pour passer cet examen. Veuillez l\'activer et réessayer.');
          }
        );
      } else {
        alert('Votre navigateur ne prend pas en charge la géolocalisation.');
      }
    }
    
    // Fonction pour charger les données de l'examen
    function loadExam(examId) {
      // Simuler le chargement d'un examen (remplacer par un appel API réel)
      console.log('Chargement de l\'examen:', examId);
      
      // Exemple de données d'examen simulées
      examData = {
        id: examId,
        title: 'Introduction à JavaScript',
        description: 'Concepts de base de JavaScript pour débutants',
        questions: [
          {
            id: 'q1',
            type: 'direct',
            text: 'Qu\'est-ce que JavaScript?',
            media: null,
            expectedAnswer: 'langage de programmation',
            toleranceRate: 10,
            duration: 60,
            points: 20
          },
          {
            id: 'q2',
            type: 'qcm',
            text: 'Lequel des suivants n\'est PAS un type de données primitif en JavaScript?',
            media: null,
            options: [
              { text: 'String', isCorrect: false },
              { text: 'Number', isCorrect: false },
              { text: 'Boolean', isCorrect: false },
              { text: 'Array', isCorrect: true }
            ],
            duration: 30,
            points: 10
          },
          {
            id: 'q3',
            type: 'direct',
            text: 'Comment déclare-t-on une variable en JavaScript avec la syntaxe moderne qui respecte la portée de bloc?',
            media: null,
            expectedAnswer: 'let',
            toleranceRate: 0,
            duration: 45,
            points: 15
          }
        ]
      };
      
      // Initialiser les réponses utilisateur
      userAnswers = Array(examData.questions.length).fill(null);
      
      // Afficher le contenu de l'examen
      document.getElementById('exam-content').classList.remove('d-none');
      document.getElementById('exam-title').textContent = examData.title;
      document.getElementById('total-questions').textContent = examData.questions.length;
      
      // Afficher la première question
      displayQuestion(0);
    }
    
    // Fonction pour afficher une question
    function displayQuestion(index) {
      if (!examData || index >= examData.questions.length) return;
      
      const question = examData.questions[index];
      currentQuestionIndex = index;
      
      // Mettre à jour l'indicateur de question
      document.getElementById('current-question-num').textContent = index + 1;
      
      // Afficher le texte de la question
      document.getElementById('question-text').textContent = question.text;
      
      // Gérer le média de la question
      const mediaContainer = document.getElementById('question-media');
      mediaContainer.innerHTML = '';
      
      if (question.media) {
        // Déterminer le type de média et l'afficher
        const mediaExtension = question.media.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif'].includes(mediaExtension)) {
          mediaContainer.innerHTML = `
            <div class="question-media-container">
              <img src="/uploads/${question.media}" alt="Image de la question">
            </div>
          `;
        } else if (['mp3', 'wav'].includes(mediaExtension)) {
          mediaContainer.innerHTML = `
            <div class="question-media-container">
              <audio controls>
                <source src="/uploads/${question.media}" type="audio/${mediaExtension}">
                Votre navigateur ne prend pas en charge l'audio.
              </audio>
            </div>
          `;
        } else if (['mp4', 'webm'].includes(mediaExtension)) {
          mediaContainer.innerHTML = `
            <div class="question-media-container">
              <video controls>
                <source src="/uploads/${question.media}" type="video/${mediaExtension}">
                Votre navigateur ne prend pas en charge la vidéo.
              </video>
            </div>
          `;
        }
      }
      
      // Afficher le formulaire approprié selon le type de question
      const directQuestionInput = document.getElementById('direct-question-input');
      const qcmQuestionOptions = document.getElementById('qcm-question-options');
      
      if (question.type === 'direct') {
        directQuestionInput.classList.remove('d-none');
        qcmQuestionOptions.classList.add('d-none');
        
        // Pré-remplir avec la réponse précédente si disponible
        const answerTextarea = document.getElementById('direct-answer');
        answerTextarea.value = userAnswers[index] !== null ? userAnswers[index] : '';
        
      } else if (question.type === 'qcm') {
        directQuestionInput.classList.add('d-none');
        qcmQuestionOptions.classList.remove('d-none');
        
        // Générer les options QCM
        qcmQuestionOptions.innerHTML = '';
        
        question.options.forEach((option, optIndex) => {
          const optionId = `option-${optIndex}`;
          const isChecked = userAnswers[index] === optIndex ? 'checked' : '';
          
          const optionHtml = `
            <div class="mb-2">
              <input type="radio" class="option-input d-none" name="qcm-answer" id="${optionId}" value="${optIndex}" ${isChecked}>
              <label for="${optionId}" class="option-label">
                ${option.text}
              </label>
            </div>
          `;
          
          qcmQuestionOptions.innerHTML += optionHtml;
        });
      }
      
      // Démarrer le timer
      startTimer(question.duration);
    }
    
    // Fonction pour démarrer le timer
    let timerInterval;
    function startTimer(duration) {
      const timerElement = document.getElementById('timer');
      let timeLeft = duration;
      
      // Nettoyer l'intervalle précédent si existant
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Afficher le temps initial
      updateTimerDisplay(timeLeft);
      
      // Démarrer le décompte
      timerInterval = setInterval(function() {
        timeLeft--;
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleTimeUp();
        } else {
          updateTimerDisplay(timeLeft);
          
          // Ajouter une classe d'avertissement si moins de 10 secondes
          if (timeLeft <= 10) {
            timerElement.parentElement.classList.add('warning');
          }
        }
      }, 1000);
    }
    
    // Fonction pour mettre à jour l'affichage du timer
    function updateTimerDisplay(seconds) {
      const timerElement = document.getElementById('timer');
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      timerElement.textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      
      // Réinitialiser la classe d'avertissement
      timerElement.parentElement.classList.remove('warning');
    }
    
    // Fonction pour gérer la fin du temps
    function handleTimeUp() {
      alert('Temps écoulé pour cette question!');
      
      // Sauvegarder la réponse actuelle
      saveCurrentAnswer();
      
      // Passer à la question suivante ou terminer l'examen
      moveToNextQuestion();
    }
    
    // Fonction pour enregistrer la réponse actuelle
    function saveCurrentAnswer() {
      const question = examData.questions[currentQuestionIndex];
      
      if (question.type === 'direct') {
        const answerText = document.getElementById('direct-answer').value;
        userAnswers[currentQuestionIndex] = answerText;
        
      } else if (question.type === 'qcm') {
        const selectedOption = document.querySelector('input[name="qcm-answer"]:checked');
        userAnswers[currentQuestionIndex] = selectedOption ? parseInt(selectedOption.value) : null;
      }
      
      console.log('Réponse enregistrée:', userAnswers[currentQuestionIndex]);
    }
    
    // Fonction pour passer à la question suivante
    function moveToNextQuestion() {
      // Arrêter le timer
      clearInterval(timerInterval);
      
      // Passer à la question suivante ou terminer l'examen
      if (currentQuestionIndex < examData.questions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
      } else {
        finishExam();
      }
    }
    
    // Fonction pour terminer l'examen
    function finishExam() {
      // Calculer le score
      const score = calculateScore();
      
      // Afficher les résultats
      document.getElementById('exam-content').classList.add('d-none');
      document.getElementById('exam-results').classList.remove('d-none');
      document.getElementById('final-score').textContent = score;
      
      // Envoyer les résultats au serveur
      submitExamResults(score);
    }
    
    // Fonction pour calculer le score
    function calculateScore() {
      let totalPoints = 0;
      let earnedPoints = 0;
      
      examData.questions.forEach((question, index) => {
        totalPoints += parseInt(question.points);
        
        if (userAnswers[index] !== null) {
          if (question.type === 'direct') {
            // Vérifier la réponse en texte
            const userAnswer = userAnswers[index].toLowerCase().trim();
            const expectedAnswer = question.expectedAnswer.toLowerCase().trim();
            
            // Implémentation simple de la tolérance (remplacer par un algorithme plus sophistiqué)
            if (userAnswer === expectedAnswer) {
              earnedPoints += parseInt(question.points);
            } else if (question.toleranceRate > 0) {
              // Version simplifiée pour la démonstration
              if (expectedAnswer.includes(userAnswer) || userAnswer.includes(expectedAnswer)) {
                earnedPoints += parseInt(question.points);
              }
            }
          } else if (question.type === 'qcm') {
            // Vérifier la réponse QCM
            const selectedOptionIndex = userAnswers[index];
            if (selectedOptionIndex !== null && question.options[selectedOptionIndex].isCorrect) {
              earnedPoints += parseInt(question.points);
            }
          }
        }
      });
      
      // Calculer le pourcentage
      return Math.round((earnedPoints / totalPoints) * 100);
    }
    
    // Fonction pour soumettre les résultats de l'examen
    function submitExamResults(score) {
      const results = {
        examId: examData.id,
        userId: user.id,
        answers: userAnswers,
        score: score,
        geolocation: geolocationData,
        completedAt: new Date().toISOString()
      };
      
      console.log('Résultats de l\'examen à soumettre:', results);
      
      // Simuler l'envoi au serveur (remplacer par un appel API réel)
      setTimeout(() => {
        console.log('Résultats soumis avec succès!');
      }, 1000);
    }
    
    // Gérer le bouton de soumission de réponse
    const submitAnswerBtn = document.getElementById('submit-answer');
    submitAnswerBtn.addEventListener('click', function() {
      // Sauvegarder la réponse
      saveCurrentAnswer();
      
      // Passer à la question suivante
      moveToNextQuestion();
    });
  });
  