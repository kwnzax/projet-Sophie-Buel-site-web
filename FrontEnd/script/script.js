
const token = localStorage.getItem('token');
console.log(token);

// Si j'ai un token, je suis authentifié donc j'affiche le mode édition et le logout

// Dans le cas contraire j'affiche le bouton login et je cache le logout et le mode édition


function getFilters(){
    
    fetch('http://localhost:5678/api/categories')
    
    .then(response => {
        return response.json()
    }).then(categories => {
        console.log(categories)
        for(let i = 0; i < categories.length; i++) {

            const sectionFilter = document.querySelector(".filters");
            const btnFilter = document.createElement('button');
            btnFilter.textContent = categories.name;

            sectionFilter.appendChild(btnFilter)
        }
    })
}


getFilters();


function genererProjets(){
    fetch('http://localhost:5678/api/works')

    .then(response => {
        return response.json()
    }).then(projets => {
        for (let i = 0; i < projets.length; i++) {

        const article = projets[i];
        const sectionProjets = document.querySelector(".gallery");
        const projetElement = document.createElement("figure"); 
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const captionElement = document.createElement("figcaption");
        captionElement.innerText = article.title;

        sectionProjets.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(captionElement);
        }
    })
}

genererProjets();