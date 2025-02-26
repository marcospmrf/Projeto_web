document.getElementById('aplicarFiltro').addEventListener('click', async () => {
    // Sua lógica aqui
    alert('Botão clicado');
    const dataCadastro = document.getElementById('dataCadastro').value;
    const nomeSetor = document.getElementById('nomeSetor').value;

    try {
        // Faz a requisição para o backend
        const response = await fetch(`/api/chamados?data_cadastro=${dataCadastro}&nome_setor=${nomeSetor}`);
        const chamados = await response.json();

        // Atualiza a tabela com os resultados
        const tabela = document.querySelector('.myTable tbody');
        tabela.innerHTML = ''; // Limpa os dados existentes

        chamados.forEach(chamado => {
            const row = `
                <tr>
                    <td>${chamado.id}</td>
                    <td>${chamado.titulo}</td>
                    <td>${chamado.setor_origem}</td>
                    <td>${chamado.prioridade}</td>
                    <td>${chamado.data_cadastro}</td>
                    <td>${chamado.descricao}</td>
                </tr>
            `;
            tabela.insertAdjacentHTML('beforeend', row);
        });

        if (chamados.length === 0) {
            tabela.innerHTML = '<tr><td colspan="6">Nenhum resultado encontrado</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente.');
    }
});
