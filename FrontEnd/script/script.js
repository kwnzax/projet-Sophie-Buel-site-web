
const token = localStorage.getItem('token');
const selectCategory = document.getElementById('filters');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const gallery = document.getElementById('gallery');
const edit = document.getElementById('edit')
const editMode = document.getElementById('editMode')
const btnFilter = document.getElementsByClassName('btn')


logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.reload();
})


if (token) {
    /*edit.forEach((element =>{
        element.style.display = 'block'
    }))*/
    
    login.style.display = 'none';
    logout.style.display = 'block';
    edit.style.display = 'block';
    editMode.style.display = 'block';

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
                selectCategory.innerHTML += `<button class="btn" value="${id}">${name}</button>`;
            })

            for (const btn of btnFilter) {
                btn.addEventListener('click', (e) => {
                   
                    const categoryID = e.target.value;
                    getWorks(categoryID)
                })
            }
        })
}


async function getWorks(categoryID = '0') {
    fetch('http://localhost:5678/api/works')

        .then(response => {
            return response.json()
        }).then(works => {

       gallery.innerHTML = '';

       works
       .filter(
        (item) => 
            item.categoryId.toString() === categoryID || categoryID === '0').forEach(works => {
                gallery.innerHTML += `
                <div class="work">
                    <img src="${works.imageUrl}" alt="${works.title}">
                    <h3>${works.title}</h3>
                    <p>${works.description}</p>
                </div>
                `
            })

            getWorksModal(works)
       
        })
}

const modal = document.querySelector('.modalBackground')

edit.addEventListener('click', (e) => {
e.preventDefault();
    modal.style.display = 'flex';
})


function getWorksModal(works) {
    // console.log(works)
}

getWorks();
getFilters();
