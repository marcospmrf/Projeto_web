document.addEventListener('DOMContentLoaded', function () {
    const criarsetorForm = document.getElementById('criarsetor');

    criarsetorForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const setor = document.getElementById('Setor').value;
        const descricao = document.getElementById('descricao').value;
        const role = document.getElementById('role').value;

        
        const formData = {
            setor: setor,
            descricao: descricao,
            role: role

        };

        fetch('http://localhost:3000/setor', {
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
                criarsetorForm.reset();
            } else {
                alert(data.message || 'Erro ao criar Setor');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erro ao criar Setor');
        });
    });
});


document.addEventListener('DOMContentLoaded', async () => {
    const tabela = document.querySelector('#setoresTableBody'); // Tabela para setores
    const aplicarFiltroButton = document.querySelector('#aplicarFiltroButton'); // Botão correto
    const inputNomeSetor = document.querySelector('.custom-text-input_geral1'); // Input para o filtro

    // Verificando se os elementos DOM foram encontrados
    console.log('Tabela:', tabela);
    console.log('Botão aplicar filtro:', aplicarFiltroButton);
    console.log('Input para filtro:', inputNomeSetor);

    // Função para carregar setores
    async function carregarSetores(filtro = '') {
        try {
            console.log('Iniciando busca com filtro:', filtro); // Log para depuração
            const response = await fetch(`http://localhost:3000/api/setorefiltro?nome_setor=${filtro}`);
            
            console.log('Resposta da requisição:', response); // Verifica a resposta HTTP

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`); // Gera erro se a resposta não for OK
            }

            const setores = await response.json();
            console.log('Setores recebidos:', setores); // Log dos setores retornados

            tabela.innerHTML = ''; // Limpa a tabela

            if (setores.length > 0) {
                setores.forEach((setor, index) => {
                    console.log(`Adicionando setor (${index}):`, setor); // Log de cada setor sendo adicionado

                    const row = `
                        <tr>
                            <td>${setor.codigo_setor}</td>
                            <td>${setor.setor}</td>
                            <td>${setor.role}</td>
                            <td>${setor.descricao}</td>
                        </tr>
                    `;
                    tabela.insertAdjacentHTML('beforeend', row);
                });
            } else {
                console.log('Nenhum setor encontrado para o filtro:', filtro); // Log caso nenhum setor seja encontrado
                tabela.innerHTML = '<tr><td colspan="4">Nenhum setor encontrado</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao buscar setores:', error); // Log do erro
            alert('Erro ao buscar setores. Por favor, tente novamente.');
        }
    }

    // Carrega todos os setores ao carregar a página
    console.log('Carregando setores ao inicializar a página...');
    await carregarSetores();

    // Adiciona evento ao botão
    aplicarFiltroButton.addEventListener('click', async () => {
        console.log('Botão de aplicar filtro clicado!'); // Log quando o botão é clicado
        const filtro = inputNomeSetor.value.trim(); // Captura o valor digitado no input
        console.log('Filtro capturado:', filtro); // Log do valor capturado
        await carregarSetores(filtro); // Chama a função com o filtro
    });
});
