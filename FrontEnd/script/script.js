
const token = localStorage.getItem('token');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const edit = document.getElementById('edit');
const editMode = document.getElementById('editMode');
const selectCategory = document.getElementById('filters');
const gallery = document.getElementById('gallery');
const btnFilter = document.getElementsByClassName('btn');

const modal = document.querySelector('.modal');
const modalWorks = document.querySelector('.modalWorks');
const closeModal = document.getElementById('close');
const backgroundModal = document.getElementById('background');
const addWorkBtn = document.getElementById('addWorkBtn');
const addWorkPage = document.querySelector('.addWorkPage');
const deleteWorkPage = document.querySelector('.deleteWorkPage');
const backBtn = document.getElementById('backBtn');
const workCategory = document.getElementById('workCategory');
const uploadWork = document.getElementById('addImgBtn');
const addImg = document.querySelector('.addImg');
const imgPreview = document.querySelector('.preview');
const photo = document.querySelector('.photo');
const addImgForm = document.querySelector('.addImgForm');
const textInput = document.getElementById('workTitle');
const selectInput = document.getElementById('workCategory');
const fileInput = document.getElementById('addImgBtn');
const sendBtn = document.getElementById('sendBtn');


logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.reload();
})


if (token) {
    login.style.display = 'none';
    logout.style.display = 'block';
    edit.style.display = 'block';
    editMode.style.display = 'flex';
} else {
    logout.style.display = 'none';
    login.style.display = 'block';
}

// affichage du mode edition et de la modal
edit.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
    backgroundModal.style.display = 'flex';
    backBtn.style.display = 'none';
})

closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
    backgroundModal.style.display = 'none';

    addWorkPage.style.display = 'none';
    deleteWorkPage.style.display = 'flex';
})

addWorkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addWorkPage.style.display = 'flex';
    deleteWorkPage.style.display = 'none';
    backBtn.style.display = 'flex';
})

backBtn.addEventListener('click', () => {
    addWorkPage.style.display = 'none';
    deleteWorkPage.style.display = 'flex';
    backBtn.style.display = 'none';
})


// récuperation des filtres
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
                    getWorks(categoryID);
                    modalWorks.innerHTML = '';
                })
            }

            categories.forEach(categories => {
                const option = document.createElement('option')
                option.value = categories.id;
                option.innerHTML = categories.name
                workCategory.appendChild(option)
            })

        })
}

// récuperation des projets + affichage
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
                figure.setAttribute("class", "miniWork")
                img.setAttribute("src", work.imageUrl)
                img.setAttribute("alt", work.title);
                img.style.width = "80px";


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

// suppression des projets
async function deleteWork(workId) {

    if (confirm('Are you sure you want to delete ?')) {
        try {

            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            if (response.ok) {
                modalWorks.innerHTML = ''
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


// vérification des fichiers reçu et affichage de l'apperçu
uploadWork.addEventListener('change', previewFile);

function previewFile() {

    const fileExtentionRegex = /\.(jpe?g|png)$/i;

    if (this.lenght === 0 || !fileExtentionRegex.test(this.files[0].name)) {
        return;
    }

    if (this.size > 4 * 1024 * 1024) {
        alert('Fichier trop volumineux.');
        return;
    }

    const file = this.files[0];
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (event) =>
        displayImage(event));
    photo.style.display = 'none';
}

function displayImage(event) {
    const image = document.createElement('img');
    image.src = event.target.result;
    

    imgPreview.appendChild(image);
}

// vérification du remplissage du form
function checkForm() {
    const isTextFilled = textInput.value.trim() !== '';
    const isSelectChosen = selectInput.value !== '';
    const isFileChosen = fileInput.files.length > 0;

    const isFormValid = isTextFilled && isSelectChosen && isFileChosen;
    sendBtn.disabled = !isFormValid;
}

textInput.addEventListener('input', checkForm);
selectInput.addEventListener('change', checkForm);
fileInput.addEventListener('change', checkForm);


// récuperation des données du form et création du nouveau projet
addImgForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            modalWorks.innerHTML = ''
            addWorkPage.style.display = 'none';
            deleteWorkPage.style.display = 'block';
            backBtn.style.display = 'none';
            textInput.value = '';
            fileInput.value ='';
            photo.style.display = 'flex';
            imgPreview.innerHTML = '';
            getWorks();
        }

        const result = await response.json();
        console.log("reponse de l'api :", result);

    } catch (error) {
        console.error("Erreur :", error);
    }
})


getWorks();
getFilters();
