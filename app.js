<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Nargas Social</title>
    <style>
        .hidden { display: none !important; }
        .instagram-post { border: 1px solid #ccc; margin: 10px 0; padding: 10px; }
        .post-header img { width: 30px; height: 30px; border-radius: 50%; }
        .post-img { max-width: 100%; height: auto; }
    </style>
</head>
<body>

    <!-- TELA DE AUTENTICAÇÃO -->
    <div id="auth-screen">
        <h2>Login / Cadastro</h2>
        <!-- type="button" impede o formulário de recarregar a página -->
        <input type="email" id="email" placeholder="E-mail" required>
        <input type="password" id="password" placeholder="Senha (mínimo 6 caracteres)" required>
        <br><br>
        <button type="button" id="btn-login">Entrar</button>
        <button type="button" id="btn-register">Cadastrar</button>
    </div>

    <!-- TELA PRINCIPAL DO APLICATIVO -->
    <div id="app-screen" class="hidden">
        <header>
            <button id="btn-logout">Sair</button>
            <label>
                <input type="checkbox" id="dark-mode-toggle"> Modo Escuro
            </label>
        </header>

        <!-- Navegação simples entre seções -->
        <nav>
            <button onclick="showSection('feed')">Feed</button>
            <button onclick="showSection('create')">Criar Post</button>
            <button onclick="showSection('profile')">Perfil</button>
        </nav>

        <!-- SEÇÃO: FEED -->
        <div id="feed-section" class="app-section">
            <h3>Feed de Publicações</h3>
            <div id="feed-container"></div>
        </div>

        <!-- SEÇÃO: CRIAR POST -->
        <div id="create-section" class="app-section hidden">
            <h3>Nova Postagem</h3>
            <input type="file" id="post-file" accept="image/*">
            <br><br>
            <textarea id="post-caption" placeholder="Escreva uma legenda..."></textarea>
            <br><br>
            <button id="btn-share">Compartilhar</button>
        </div>

        <!-- SEÇÃO: PERFIL -->
        <div id="profile-section" class="app-section hidden">
            <h3>Seu Perfil</h3>
            <div id="profile-card">
                <img id="profile-avatar" src="" alt="Avatar" style="width: 80px; height: 80px; border-radius: 50%;">
                <p id="profile-name">Carregando...</p>
            </div>
            <hr>
            <h4>Editar Perfil</h4>
            <label>Alterar Foto:</label>
            <input type="file" id="update-avatar-file" accept="image/*">
            <br><br>
            <label>Alterar Nome:</label>
            <input type="text" id="edit-username">
            <button id="btn-save-profile">Salvar Nome</button>
        </div>
    </div>

    <!-- SCRIPTS OBRIGATÓRIOS DO FIREBASE (Versão v8 compatível com seu código) -->
    <script src="https://gstatic.com"></script>
    <script src="https://gstatic.com"></script>
    <script src="https://gstatic.com"></script>

    <!-- O SEU ARQUIVO JAVASCRIPT DEVE VIR DEPOIS DOS SCRIPTS DO FIREBASE -->
    <script src="seu-codigo.js"></script>
</body>
</html>
