
const token = localStorage.getItem('token');
const selectCategory = document.getElementById('filters');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const gallery  = document.getElementById('gallery');
const edit = document.getElementById('edit')

logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.reload();
})


if (token) {
    login.style.display = 'none';
    logout.style.display = 'block';
    edit.style.display = 'flex'

} else {
    logout.style.display = 'none';
    login.style.display = 'block';
}



function getFilters() {
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            return response.json()
        }).then(categories => {

            categories.forEach(category => {
                const id = category.id;
                const name = category.name
                selectCategory.innerHTML += `<option value="${id}">${name}</option>`
            })
        })
}


function getWorks() {
    fetch('http://localhost:5678/api/works')

        .then(response => {
            return response.json()
        }).then(works => {

            // Vider le dom 
            gallery.innerHTML = '';

            for (let i = 0; i < works.length; i++) {

                const article = works[i];
                const sectionWorks = document.querySelector("#gallery");
                const worksElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                imageElement.src = article.imageUrl;
                const captionElement = document.createElement("figcaption");
                captionElement.innerText = article.title;

                sectionWorks.appendChild(worksElement);
                worksElement.appendChild(imageElement);
                worksElement.appendChild(captionElement);
            }

            getWorksModal(works)

        })
}

edit.addEventListener('click', () => {
     
})


function getWorksModal(works){
    console.log(works)
}

getFilters();
getWorks();