// Script principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('D&A Quiz - Application initialisée');
    
    // Animation simple pour les cartes d'accueil
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.classList.add('shadow-lg');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('shadow-lg');
      });
    });
  });