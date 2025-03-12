const token = localStorage.getItem('token');
console.log(token);

// Si j'ai un token, je suis authentifié donc j'affiche le mode édition et le logout

// Dans le cas contraire j'affiche le bouton login et je cache le logout et le mode édition


// Etape 1  : 

// Créer les filtres de manière dynamique (Hotel, Objet ...) 
function getFilters(){
    // Faire un appel sur l'api /categories
    // Avec la données retourner on créer les filtres donc une boucle sur chaque objet 
    /*

    {
    "id": 1,
    "name": "Hotel",
    
    }, 
    {
    "id": 2,
    "name": "Objet d'art",
    }, 
    
    */
}