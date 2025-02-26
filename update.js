document.addEventListener('DOMContentLoaded', function () {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        alert('Nenhum usuário logado.');
        return;
    }

    // Preenche os campos com os dados existentes do usuário
    document.getElementById('editarTelefone').value = usuario.telefone || '';
    document.getElementById('editarEmail').value = usuario.email || '';
    // Função para atualizar dados de contato (telefone e email)
    async function atualizarContato() {
        const telefone = document.getElementById('editarTelefone').value;
        const email = document.getElementById('editarEmail').value;
    
        if (!telefone || !email) {
            alert("Por favor, preencha todos os campos de contato.");
            return;
        }
    
        const password = usuario.password; // Mantém a senha atual, já que não foi alterada
    
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telefone: telefone,
                    email: email,
                    password: password  // Envia a senha atual sem modificações
                })
            });
    
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                // Atualiza o localStorage com os novos valores de contato
                usuario.telefone = telefone;
                usuario.email = email;
                localStorage.setItem('usuario', JSON.stringify(usuario));
            } else {
                alert(data.message || 'Erro ao atualizar contato');
            }
        } catch (error) {
            console.error('Erro ao atualizar contato:', error);
            alert('Erro ao atualizar contato.');
        }
    }
    
    async function atualizarSenha() {
        const novaSenha1 = document.getElementById('editarSenha1').value;
        const novaSenha2 = document.getElementById('editarSenha2').value;
    
        if (!novaSenha1 || !novaSenha2) {
            alert("Por favor, preencha ambos os campos de senha.");
            return;
        }
    
        if (novaSenha1 !== novaSenha2) {
            alert('As senhas não coincidem!');
            return;
        }
    
        if (novaSenha1.length < 6) {  // Exemplo de validação de senha mínima
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telefone: usuario.telefone, // mantém os dados atuais de telefone e email
                    email: usuario.email,
                    password: novaSenha1
                })
            });
    
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                // Atualiza a senha no localStorage
                usuario.password = novaSenha1;
                localStorage.setItem('usuario', JSON.stringify(usuario));
            } else {
                alert(data.message || 'Erro ao atualizar senha');
            }
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            alert('Erro ao atualizar senha.');
        }
    }
    
    // Associa as funções aos botões de salvar
    
    document.getElementById('salvarContatoBtn').addEventListener('click', atualizarContato);
    document.getElementById('salvarSenhaBtn').addEventListener('click', atualizarSenha);

});