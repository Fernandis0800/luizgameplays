// CONFIGURAÇÃO DO BANCO DE DADOS DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCtrZ0OhcUvjGoxdNyodD9BlTCJ3fs63ug",
    authDomain: "://firebaseapp.com",
    databaseURL: "https://firebaseio.com",
    projectId: "nargas",
    storageBucket: "nargas.firebasestorage.app",
    messagingSenderId: "436060024568",
    appId: "1:436060024568:web:d6da7788cb9ba07021550d",
    measurementId: "G-EDG5JGTPX8"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// ELEMENTOS DA INTERFACE
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
let currentUser = null;

// 1. SISTEMA DE CADASTRO E LOGIN
document.getElementById('btn-register').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            database.ref('users/' + user.uid).set({
                username: email.split('@')[0], // Pegando apenas o texto antes do @
                avatar: "https://placeholder.com"
            });
            alert("Conta criada com sucesso!");
        }).catch(error => alert("Erro ao cadastrar: " + error.message));
});

document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert("Erro ao entrar: " + error.message));
});

document.getElementById('btn-logout').addEventListener('click', () => auth.signOut());

// Monitor de estado do Usuário
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        loadUserProfile();
        listenToFeed();
    } else {
        currentUser = null;
        authScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
});

// 2. GERENCIAMENTO DE SEÇÕES DA TELA
function showSection(sectionName) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');
}

// 3. CARREGAR E ATUALIZAR PERFIL
function loadUserProfile() {
    database.ref('users/' + currentUser.uid).on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('profile-name').innerText = data.username;
            document.getElementById('profile-avatar').src = data.avatar;
            document.getElementById('edit-username').value = data.username;
        }
    });
}

// Mudar nome de usuário
document.getElementById('btn-save-profile').addEventListener('click', () => {
    const newName = document.getElementById('edit-username').value;
    database.ref('users/' + currentUser.uid).update({ username: newName });
    alert("Perfil atualizado!");
});

// Converter imagem para Base64
function handleImageUpload(inputElement, callback) {
    const file = inputElement.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    }
}

// Mudar foto de perfil
document.getElementById('update-avatar-file').addEventListener('change', (e) => {
    handleImageUpload(e.target, (base64Image) => {
        database.ref('users/' + currentUser.uid).update({ avatar: base64Image });
    });
});

// Ativador do Modo Escuro
document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

// 4. CRIAR POSTAGEM
document.getElementById('btn-share').addEventListener('click', () => {
    const caption = document.getElementById('post-caption').value;
    const fileInput = document.getElementById('post-file');
    
    handleImageUpload(fileInput, (base64Image) => {
        database.ref('users/' + currentUser.uid).once('value').then(snapshot => {
            const user = snapshot.val();
            const newPostRef = database.ref('posts').push();
            
            newPostRef.set({
                uid: currentUser.uid,
                username: user.username,
                avatar: user.avatar,
                image: base64Image,
                caption: caption,
                timestamp: Date.now()
            });
            
            document.getElementById('post-caption').value = "";
            fileInput.value = "";
            showSection('feed');
        });
    });
});

// 5. CARREGAR FEED EM TEMPO REAL
function listenToFeed() {
    database.ref('posts').orderByChild('timestamp').on('value', snapshot => {
        const feedContainer = document.getElementById('feed-container');
        feedContainer.innerHTML = "";
        let posts = [];
        
        snapshot.forEach(childSnapshot => {
            posts.unshift({ id: childSnapshot.key, ...childSnapshot.val() }); 
        });
        
        posts.forEach(post => {
            const likesCount = post.likes ? Object.keys(post.likes).length : 0;
            let commentsHtml = "";
            
            if (post.comments) {
                Object.values(post.comments).forEach(c => {
                    commentsHtml += `<p><strong>${c.username}:</strong> ${c.text}</p>`;
                });
            }
            
            const postElement = document.createElement('div');
            postElement.className = 'instagram-post';
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.avatar}">
                    <span>${post.username}</span>
                </div>
                <img class="post-img" src="${post.image}">
                <div class="post-actions">
                    <button onclick="likePost('${post.id}')">❤️ ${likesCount} Curtidas</button>
                    <p><strong>${post.username}:</strong> ${post.caption}</p>
                </div>
                <div class="post-comments">
                    <div class="comment-list">${commentsHtml}</div>
                    <input type="text" id="comment-in-${post.id}" placeholder="Adicione um comentário...">
                    <button onclick="addComment('${post.id}')">Postar</button>
                </div>
            `;
            feedContainer.appendChild(postElement);
        });
    });
}

// Sistema de Curtir
function likePost(postId) {
    const likeRef = database.ref(`posts/${postId}/likes/${currentUser.uid}`);
    likeRef.once('value', snapshot => {
        if (snapshot.exists()) {
            likeRef.remove(); 
        } else {
            likeRef.set(true); 
        }
    });
}

// Sistema de Comentários
function addComment(postId) {
    const input = document.getElementById(`comment-in-${postId}`);
    const text = input.value;
    if (text.trim() === "") return;
    
    database.ref('users/' + currentUser.uid).once('value').then(snapshot => {
        const user = snapshot.val();
        database.ref(`posts/${postId}/comments`).push({
            username: user.username,
            text: text
        });
        input.value = "";
    });
}
