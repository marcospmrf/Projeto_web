async function encerrarChamado() {
    const urlParams = new URLSearchParams(window.location.search);
    const idChamado = urlParams.get('id'); // Obter o ID do chamado da URL

    try {
        const response = await fetch(`http://localhost:3000/api/encerrarChamado/${idChamado}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok) {
            alert("Chamado encerrado com sucesso!");
            window.location.href = "painel.html"; // Redireciona para o painel após encerrar
        } else {
            alert("Erro ao encerrar chamado: " + result.message);
        }
    } catch (error) {
        console.error("Erro ao encerrar chamado:", error);
        alert("Erro ao encerrar chamado.");
    }
}
