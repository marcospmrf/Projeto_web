function carregarDados() {
    // Aqui você pega o ID do usuário após o login. Vamos supor que ele seja 1 por exemplo.
    const userId = 1; // Substitua por um valor real baseado na sessão do usuário

    // Fazer a requisição para buscar os dados
    fetch(`/perfil?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Verifique o que está sendo retornado no console
        document.getElementById('nome').textContent = 'Nome: ' + data.nome;
        document.getElementById('telefone').textContent = 'Número de telefone: ' + data.telefone;
        document.getElementById('email').textContent = 'E-mail: ' + data.email;
        document.getElementById('setor').textContent = 'Setor/Serviço: ' + data.setor;
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });
}

// Chama a função para carregar os dados quando a página for carregada
window.onload = carregarDados;