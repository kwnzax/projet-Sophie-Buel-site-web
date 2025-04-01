
const token = localStorage.getItem('token');
const selectCategory = document.getElementById('filters');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const gallery = document.getElementById('gallery');
const edit = document.getElementById('edit');
const editMode = document.getElementById('editMode');
const btnFilter = document.getElementsByClassName('btn');
const worksModal = document.getElementById('worksModal');
const modal = document.querySelector('.modal');
const modalWorks = document.querySelector('.modalWorks')


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


function getWorks(categoryID = '0') {

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
                </div>
                `
                        })

            works.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.setAttribute("src", work.imageUrl)
                img.setAttribute("alt", work.title);
                img.style.width = "100px"

                const button = document.createElement('button');
                button.type = 'button'
                button.className = 'trash'
                button.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
                button.value = work.id

                figure.appendChild(button)
                figure.appendChild(img)

                modalWorks.appendChild(figure)

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const workId = button.value;
                    deleteWork(workId);
                })
            })
        })
}




edit.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
})

async function deleteWork(workId) {

    if (confirm('Are you sure you want to delete')) {
        try {

            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            if (response.ok) {
                modal.innerHTML = ''
                getWorks();
            }

        }
        catch (error) {
            console.error('Error:', error);
        }


    } else {
        console.log('Operation cancelled');
    }
}

getWorks();
getFilters();
