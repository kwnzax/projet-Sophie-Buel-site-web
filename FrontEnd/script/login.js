//verifier si l'utilisateur est deja connecté 
const token = localStorage.getItem('token');
if(token){
    window.location.href = './index.html';
}

const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('pw');

// vérification du login
form.addEventListener('submit', event => {
    event.preventDefault()

    const object = {
        email: email.value,
        password: password.value
    }

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(object)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }else{
            alert('Erreur de connexion mot de passe ou email incorrect');
        }
    }).then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = './index.html';
    }).catch(err => {
        console.error('Error:', err);
    });

})


