document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('chamado');
    const setorSelect = document.getElementById('setorSelect');

    // Função para carregar setores
    async function carregarSetores() {
        try {
            const response = await fetch('http://localhost:3000/api/setores');
            if (response.ok) {
                const setores = await response.json();
                setores.forEach(setor => {
                    const option = document.createElement('option');
                    option.value = setor.codigo_setor;
                    option.textContent = setor.setor;
                    setorSelect.appendChild(option);
                });
            } else {
                console.error('Erro ao carregar setores. Status:', response.status);
            }
        } catch (error) {
            console.error('Erro ao carregar setores:', error);
        }
    }

    carregarSetores();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const titulo = document.getElementById('tituloChamado').value.trim();
        const codigo_setor = setorSelect.value; // Setor destino
        const prioridade = document.getElementById('prioridade').value;
        const data_cadastro = document.getElementById('data').value;
        const descricao = document.getElementById('descricao').value.trim();

        // Pega o setor de origem do localStorage
        const setor_origem = localStorage.getItem('codigo_setor_usuario');

        console.log('Setor de origem:', setor_origem);

        if (!setor_origem) {
            alert('Erro: Setor de origem não identificado. Faça login novamente.');
            console.error('Setor de origem não encontrado no localStorage.');
            return;
        }

        const chamado = {
            titulo,
            setor_origem: parseInt(setor_origem), // Certifica-se de que é um número
            codigo_setor: parseInt(codigo_setor), // Certifica-se de que é um número
            prioridade,
            data_cadastro,
            descricao,
        };

        console.log('Dados enviados para o backend:', chamado);

        try {
            const response = await fetch('http://localhost:3000/api/chamados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chamado),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);

                console.log('Notificando painel sobre o novo chamado...');

                // Notifica o painel para atualizar a tabela
                window.opener?.postMessage({ action: 'atualizarTabela', chamado: data.chamado }, '*');

                // Redireciona de volta ao painel
                window.location.href = "painel.html";
            } else {
                const error = await response.json();
                console.error('Erro ao enviar chamado. Resposta do servidor:', error);
                alert('Erro ao enviar chamado: ' + (error.message || 'Verifique os dados e tente novamente.'));
            }
        } catch (error) {
            console.error('Erro ao enviar o chamado:', error);
            alert('Erro ao enviar o chamado. Por favor, tente novamente.');
        }
    });
});





  
//----------------------//////---------------------------------/FILTRO DE CHAMADO/---------------------------------//-----------------------------------

console.log('JavaScript embutido carregado com sucesso!'); // Log para verificar se o JavaScript foi carregado

// Função para redirecionar para a página de resposta, passando o ID do chamado
function redirecionarParaResposta(idChamado) {
    window.location.href = `responderchamado.html?id=${idChamado}`;
}

// Função para carregar os dados dos chamados e preencher a tabela
async function carregarChamadosAbertos() {
    console.log('Função carregarChamadosAbertos chamada'); // Log para verificar que a função é chamada

    // Recupera o código do setor do usuário logado do localStorage
    const codigoSetorUsuario = localStorage.getItem('codigo_setor_usuario');

    if (!codigoSetorUsuario) {
        alert('Setor do usuário não identificado. Faça login novamente.');
        console.error('Erro: Código do setor do usuário está ausente no localStorage.');
        return;
    }

    console.log('Código do setor do usuário:', codigoSetorUsuario); // Debug do setor do usuário

    try {
        // Faz a requisição ao backend, passando o código do setor do usuário como parâmetro
        const response = await fetch(`http://localhost:3000/api/chamados?codigo_setor_usuario=${codigoSetorUsuario}`);
        console.log('Status da resposta:', response.status); // Log para verificar o status da resposta

        if (!response.ok) throw new Error('Erro ao buscar dados dos chamados');

        const chamados = await response.json();
        console.log('Dados recebidos da API:', chamados); // Log para verificar dados recebidos da API

        const tabelaChamados = document.getElementById('tabelaChamados');
        tabelaChamados.innerHTML = ''; // Limpa a tabela antes de preenchê-la

        // Preenche a tabela com os dados dos chamados filtrados
        chamados.forEach(chamado => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${chamado.id}</td> <!-- Código do Serviço -->
                <td>${chamado.titulo}</td> <!-- Título -->
                <td>${chamado.setor_origem_nome || 'Não especificado'}</td> <!-- Setor de Origem -->
                <td>${chamado.prioridade}</td> <!-- Prioridade -->
                <td>${new Date(chamado.data_cadastro).toLocaleDateString()}</td> <!-- Data de Cadastro -->
                <td>${chamado.descricao}</td> <!-- Descrição -->
                <td><button onclick="redirecionarParaResposta(${chamado.id})">Responder</button></td> <!-- Botão Responder -->
            `;


            tabelaChamados.appendChild(row); // Adiciona a linha à tabela
        });
    } catch (error) {
        console.error('Erro ao carregar chamados:', error); // Log para capturar erros
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarChamadosAbertos);





document.addEventListener('DOMContentLoaded', () => {
    const aplicarFiltroButton = document.getElementById('aplicarFiltro');

    if (aplicarFiltroButton) {
        aplicarFiltroButton.addEventListener('click', async () => {
            const dataCadastro = document.getElementById('dataCadastro').value;
            const nomeSetor = document.getElementById('nomeSetor').value;

            try {
                // Faz a requisição à API
                const response = await fetch(`http://localhost:3000/api/filtrarChamados?data_cadastro=${dataCadastro}&nome_setor=${nomeSetor}`);
                const chamados = await response.json();

                console.log('Dados recebidos da API:', chamados); // Log para debug

                const tabela = document.querySelector('.myTable tbody');
                tabela.innerHTML = ''; // Limpa os dados existentes

                if (chamados.length > 0) {
                    chamados.forEach(chamado => {
                        const dataFormatada = chamado.data_cadastro
                            ? new Date(chamado.data_cadastro).toLocaleDateString('pt-BR')
                            : 'N/A';

                        const row = `
                            <tr>
                                <td>${chamado.chamado_id || 'N/A'}</td>
                                <td>${chamado.titulo || 'N/A'}</td>
                                <td>${chamado.setor_destino || 'N/A'}</td>
                                <td>${chamado.prioridade || 'N/A'}</td>
                                <td>${dataFormatada}</td>
                                <td>${chamado.descricao || 'N/A'}</td>
                                <td><button class="responderButton">Responder</button></td>
                            </tr>
                        `;
                        tabela.insertAdjacentHTML('beforeend', row);
                    });

                    // Adiciona o evento de clique aos botões "Responder"
                    tabela.querySelectorAll('.responderButton').forEach((button, index) => {
                        button.addEventListener('click', () => {
                            const chamado = chamados[index];
                            console.log(`Redirecionando para responder chamado ID: ${chamado.chamado_id}`);
                            // Redireciona para a página de resposta com o ID do chamado na URL
                            window.location.href = `responderchamado.html?id=${chamado.chamado_id}`;
                        });
                    });
                } else {
                    tabela.innerHTML = '<tr><td colspan="7">Nenhum resultado encontrado</td></tr>';
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                alert('Erro ao buscar dados. Por favor, tente novamente.');
            }
        });
    } else {
        console.error('Botão "Aplicar Filtro" não encontrado!');
    }
});

