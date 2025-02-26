
  async function fetchSetores() {
    try {
      const response = await fetch('http://localhost:3000/api/setores');
      const setores = await response.json();
      const setorSelect = document.getElementById('setorSelect');

      setores.forEach(setor => {
        const option = document.createElement('option');
        option.value = setor.codigo_setor;
        option.textContent = setor.setor;
        setorSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
    }
  }
  // Função para buscar e preencher as opções de contato
  async function fetchContatos() {
    try {
      const response = await fetch('http://localhost:3000/api/contatos');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const contatos = await response.json();
    
      const terceiroSelect = document.getElementById('terceiroSelect');
      contatos.forEach(contato => {
        const option = document.createElement('option');
        option.value = contato.cpf;
        option.textContent = `${contato.nome} - ${contato.cpf}`; // Exibe nome seguido por CPF
        terceiroSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  }

  // Chama as funções de busca ao carregar a página
  fetchSetores();
  fetchContatos();

