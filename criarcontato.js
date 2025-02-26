document.addEventListener('DOMContentLoaded', function () {
    const criarcontatoForm = document.getElementById('criarcontato');

    criarcontatoForm .addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone1 = document.getElementById('telefone1').value;
        const telefone2 = document.getElementById('telefone2').value;
        const cpf = document.getElementById('cpf').value;
        const opcao1 = document.getElementById('opcao1').value;
        const opcao2 = document.getElementById('opcao2').value;
        
        
        const formData = {
            nome: nome,
            email: email,
            telefone1: telefone1,
            telefone2: telefone2,
            cpf: cpf,
            opcao1: opcao1,
            opcao2: opcao2,

        };

        fetch('http://localhost:3000/api/terceiro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                // Limpar o formulário após o sucesso
                criarcontatoForm.reset();
            } else {
                alert(data.message || 'Erro ao criar Contato');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erro ao criar Contato');
        });
    });
});