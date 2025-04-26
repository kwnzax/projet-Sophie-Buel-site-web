const elements = {
    token: localStorage.getItem('token'),
    login: document.getElementById('login'),
    logout: document.getElementById('logout'),
    edit: document.getElementById('edit'),
    editMode: document.getElementById('editMode'),
    selectCategory: document.getElementById('filters'),
    gallery: document.getElementById('gallery'),
    btnFilter: document.getElementsByClassName('btn'),
    modal: document.querySelector('.modal'),
    modalWorks: document.querySelector('.modalWorks'),
    closeModal: document.getElementById('close'),
    backgroundModal: document.getElementById('background'),
    addWorkBtn: document.getElementById('addWorkBtn'),
    addWorkPage: document.querySelector('.addWorkPage'),
    deleteWorkPage: document.querySelector('.deleteWorkPage'),
    backBtn: document.getElementById('backBtn'),
    workCategory: document.getElementById('workCategory'),
    uploadWork: document.getElementById('addImgBtn'),
    addImg: document.querySelector('.addImg'),
    imgPreview: document.querySelector('.preview'),
    photo: document.querySelector('.photo'),
    addImgForm: document.querySelector('.addImgForm'),
    textInput: document.getElementById('workTitle'),
    selectInput: document.getElementById('workCategory'),
    fileInput: document.getElementById('addImgBtn'),
    sendBtn: document.getElementById('sendBtn')
};

// Gestion de la connexion/déconnexion
elements.logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.reload();
});

if (elements.token) {
    elements.login.style.display = 'none';
    elements.logout.style.display = 'block';
    elements.edit.style.display = 'block';
    elements.editMode.style.display = 'flex';
    elements.selectCategory.style.display = 'none';
} else {
    elements.logout.style.display = 'none';
    elements.login.style.display = 'block';
    elements.login.addEventListener('click', (e) => {
        if (elements.token) {
            e.preventDefault();
            window.location.href = './index.html';
        }
    });
}

// Affichage du mode édition et de la modal
elements.edit.addEventListener('click', (e) => {
    e.preventDefault();
    elements.modal.style.display = 'flex';
    elements.backgroundModal.style.display = 'flex';
    elements.backBtn.style.display = 'none';
});

elements.closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    elements.modal.style.display = 'none';
    elements.backgroundModal.style.display = 'none';
    elements.addWorkPage.style.display = 'none';
    elements.deleteWorkPage.style.display = 'flex';
    elements.textInput.value = '';
    elements.fileInput.value = '';
    elements.photo.style.display = 'flex';
    elements.imgPreview.innerHTML = '';
});

elements.addWorkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    elements.addWorkPage.style.display = 'flex';
    elements.deleteWorkPage.style.display = 'none';
    elements.backBtn.style.display = 'flex';
    checkForm();
});
elements.backBtn.addEventListener('click', () => {
    elements.addWorkPage.style.display = 'none';
    elements.deleteWorkPage.style.display = 'flex';
    elements.backBtn.style.display = 'none';
    elements.textInput.value = '';
    elements.fileInput.value = '';
    elements.photo.style.display = 'flex';
    elements.selectInput.value = '0';
    elements.selectInput.addEventListener('change', checkForm);
    elements.imgPreview.innerHTML = '';
});

// Récupération des filtres
function getFilters() {
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(categories => {
            elements.selectCategory.innerHTML = `<button class="btn" value="0">Tous</button>`;
            categories.forEach(category => {
                const id = category.id;
                const name = category.name;
                elements.selectCategory.innerHTML += `<button class="btn" value="${id}">${name}</button>`;
            });
            document.querySelector('.btn[value="0"]').classList.add('active');
            for (const btn of elements.btnFilter) {
                btn.addEventListener('click', (e) => {
                    for (const otherBtn of elements.btnFilter) {
                        otherBtn.classList.remove('active');
                    }
                    e.target.classList.add('active');
                    const categoryID = e.target.value;
                    getWorks(categoryID);
                    elements.modalWorks.innerHTML = '';
                });
            }
            const defaultOption = document.createElement('option');
            defaultOption.value = '0';
            elements.workCategory.appendChild(defaultOption);
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.innerHTML = category.name;
                elements.workCategory.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error);
            alert('Une erreur est survenue lors du chargement des catégories. Veuillez rafraîchir la page.');
        });
}


// Récupération des projets + affichage
function getWorks(categoryID = '0') {
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(works => {
            elements.gallery.innerHTML = '';
            works
                .filter(item => item.categoryId.toString() === categoryID || categoryID === '0')
                .forEach(work => {
                    elements.gallery.innerHTML += `
                        <div class="work">
                            <img src="${work.imageUrl}" alt="${work.title}">
                            <h3>${work.title}</h3>
                        </div>
                    `;
                });
            works.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                figure.setAttribute("class", "miniWork");
                img.setAttribute("src", work.imageUrl);
                img.setAttribute("alt", work.title);
                img.style.width = "80px";
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'trash';
                button.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                button.value = work.id;
                figure.appendChild(button);
                figure.appendChild(img);
                elements.modalWorks.appendChild(figure);
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const workId = button.value;
                    deleteWork(workId);
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des projets:', error);
            elements.gallery.innerHTML = '<p>Une erreur est survenue lors du chargement des projets. Veuillez rafraîchir la page.</p>';
        });
}

// Suppression des projets
async function deleteWork(workId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${elements.token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            elements.modalWorks.innerHTML = '';
            getWorks();
            elements.modal.style.display = 'none';
            elements.backgroundModal.style.display = 'none';

        } catch (error) {
            console.error('Erreur lors de la suppression du projet:', error);
            alert('Une erreur est survenue lors de la suppression du projet. Veuillez réessayer.');
        }
    }
}

// Vérification des fichiers reçus et affichage de l'aperçu
elements.uploadWork.addEventListener('change', previewFile);
function previewFile() {
    const fileExtentionRegex = /\.(jpe?g|png)$/i;
    if (this.length === 0 || !fileExtentionRegex.test(this.files[0].name)) {
        return;
    }
    if (this.size > 4 * 1024 * 1024) {
        alert('Fichier trop volumineux.');
        return;
    }
    const file = this.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (event) => displayImage(event));
    elements.photo.style.display = 'none';
}

function displayImage(event) {
    const image = document.createElement('img');
    image.src = event.target.result;
    elements.imgPreview.appendChild(image);
}

// Vérification du remplissage du formulaire
function checkForm() {
    const isTextFilled = elements.textInput.value.trim() !== '';
    const valueAsNumber = Number(elements.selectInput.value);
    const isSelectChosen = valueAsNumber !== 0;
    const isFileChosen = elements.fileInput.files.length > 0;
    const isFormValid = isTextFilled && isSelectChosen && isFileChosen;
    elements.sendBtn.disabled = !isFormValid;
    elements.sendBtn.style.backgroundColor = '#1D6154';
    if (isFormValid) {
        elements.sendBtn.style.backgroundColor = '#1D6154';
        elements.sendBtn.style.cursor = 'pointer';
    } else {
        elements.sendBtn.style.backgroundColor = '#ccc';
        elements.sendBtn.style.cursor = 'not-allowed';
    }
}

elements.textInput.addEventListener('input', checkForm);
elements.selectInput.addEventListener('change', checkForm);
elements.fileInput.addEventListener('change', checkForm);


// Récupération des données du formulaire et création du nouveau projet
elements.addImgForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${elements.token}`
            },
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }
        elements.modalWorks.innerHTML = '';
        elements.addWorkPage.style.display = 'none';
        elements.deleteWorkPage.style.display = 'block';
        elements.backBtn.style.display = 'none';
        elements.textInput.value = '';
        elements.fileInput.value = '';
        elements.photo.style.display = 'flex';
        elements.imgPreview.innerHTML = '';
        getWorks();
        elements.modal.style.display = 'none';
        elements.backgroundModal.style.display = 'none';

    } catch (error) {
        console.error("Erreur lors de l'ajout du projet:", error);
        alert(`Une erreur est survenue lors de l'ajout du projet: ${error.message}`);
    }
});

getWorks();
getFilters();