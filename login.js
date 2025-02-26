document.addEventListener('DOMContentLoaded', function () {
    console.log('Script de login carregado com sucesso!');

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log('Tentando logar com:', { username, password });

        const formData = { username, password };

        try {
            const response = await fetch('http://localhost:3000/acesso', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            console.log('Resposta completa do backend:', response);

            const data = await response.json();

            console.log('Dados do usuário recebidos no login:', data);

            if (response.ok && data.success) {
                console.log('Salvando no localStorage...');
                localStorage.setItem('usuario', JSON.stringify(data));
                localStorage.setItem('codigo_setor_usuario', data.codigo_setor);

                console.log('Setor salvo no localStorage após login:', localStorage.getItem('codigo_setor_usuario'));
                console.log('Role recebido no login:', data.role);

                // Verificar e redirecionar com base no role
                if (data.role === 'admin') {
                    console.log('Redirecionando para painel.html...');
                    window.location.href = 'painel.html';
                } else if (data.role === 'user') {
                    console.log('Redirecionando para meuperfiluser.html...');
                    window.location.href = 'meuperfiluser.html';
                } else {
                    console.error('Erro: Role não configurada corretamente:', data.role);
                    alert('Erro de configuração de acesso.');
                }
            } else {
                console.error('Erro no login:', data.message);
                alert(data.message || 'Usuário ou senha incorretos!');
            }
        } catch (error) {
            console.error('Erro durante o login:', error);
            alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
        }
    });
});
