const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('pw');


// Ne JAMAIS faire confiance au front, donc vérifier le type email avec un regex, et vérifier le password pour le projet juste vérifier que le champs n'est pas vide


form.addEventListener('submit', event => {
    event.preventDefault()


    const object = {
        email: email.value,
        password: password.value
    }


    console.log(object)

    fetch('http://localhost:5678/api/user/login', {
        method: 'POST',
        headers: { "Content-Type": "application/JSON" },
        body: object
    }).then(response => {
        /*
    
        ... tout un tas d'information de l'api pas forcément utiles
        */
        // On vérifie si l'api retourne un OK (donc un status code 200)
        if (response.ok) {
            return response.json();
        }
    }).then(data => {


        // Sauvegarder le token dans le localstorage

        // Une fois le token sauvegarder on redirige l'utilisateur sur la page index.html

        console.log(data);
        if (data.error) {
            alert("Email ou mot de passe inccorrect"); 
          } else {
            window.open(
              "index.html"
            ); 
          }
    })
    }).catch(err => {
        console.error(err);
})
