
 
/*=======================  MODAL =====================================================================*/
  function openModal() {
        document.getElementById('myModal').style.display = 'block';
    }
 
    function closeModal() {
        document.getElementById('myModal').style.display = 'none';
    }

// Modal pagina acessos para editar serviços e add ..........................
    function modalAddEditServico(){
        document.getElementById('myModal2').style.display = 'flex';
    }
 
    function closeModal2() {
        document.getElementById('myModal2').style.display = 'none';
    }
// Modal pagina acessos para editar user e add ..........................

    function modalAddEditUsuario(){
        document.getElementById('myModal3').style.display = 'flex';

    }
    function closeModal3() {
        document.getElementById('myModal3').style.display = 'none';
    }

// Modal pagina chamados para editar  e abrir ocoreencias ..........................

    //function modalAddEditChamados(n ){
        //document.getElementById('modalNovoChamado').style.display = 'flex';
        //console.log(n);
    //}
   // function closeModal4() {
        //document.getElementById('modalNovoChamado').style.display = 'none';
    //}

    function modalAddEditChamados(n) {
        const modal = document.getElementById('myModal3');
        if (modal) {
            modal.style.display = 'flex'; // Ou 'block', dependendo do seu CSS
            console.log("Modal aberto para novo chamado com ID:", n);
        } else {
            console.error("Modal com o ID 'myModal3' não foi encontrado.");
        }
    }
    
    function closeModal4() {
        const modal = document.getElementById('myModal3');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    



// Modal pagina chamados para editar  e abrir ocoreencias ..........................

    function modalAddEditContatos(n ){
        document.getElementById('myModal5').style.display = 'flex';
        console.log(n);
    }
    function closeModal5() {
        document.getElementById('myModal5').style.display = 'none';
    }



/*========================  Funçoes dentro do botao para expandir e ocutar dados ===============================*/

    function abreOpcoesCadastro(div) {
        let retorno = document.querySelector('.' + div); 

        if (retorno.style.display === 'block') {
            retorno.style.display = 'none';
        } else {
            retorno.style.display = 'block';
        }
    }


/*===============   MODAL PARA EDITAR E ABRIR CHAMADOS ================================= */

    function ocutarMostrarOcorrenciaAtendimentoModalOcorrencia(){
        let ocorrencia = document.querySelector('.div_dados_Ocorrencia');
        let atendimento = document.querySelector('.div_dados_atendimento');

        if(ocorrencia.style.display != 'none' ){
            ocorrencia.style.display = 'block';
            atendimento.style.display = 'none';
        } 

        if(ocorrencia.style.display === 'none' ){

            ocorrencia.style.display = 'block';
            atendimento.style.display = 'none';
             
        }
    }

    function ocutarMostrarOcorrenciaAtendimentoModalAtendimento(){
        let ocorrencia = document.querySelector('.div_dados_Ocorrencia');
        let atendimento = document.querySelector('.div_dados_atendimento');
        
         if(atendimento.style.display != 'none' ){
            ocorrencia.style.display = 'none';
            atendimento.style.display = 'block';
        }
        if(atendimento.style.display === 'none' ){
            ocorrencia.style.display = 'none';
            atendimento.style.display = 'block';
             
        }
         
    }
    

/*======================================================================================*/
/*=========      ===     ===== ====        ============================*/
/*========= ==== ===  ==  ==== ==== ==============================*/
/*=========      ===     ===== ====        ========================*/
/*========= ==== === ========= =========== =================*/
/*========= ==== === ========= =====       ====================*/

function fazerRequisicaoPost(){  /*Metodo fecht post*/

    const options = {
        method: 'GET'
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar requisição: ' + response.status);
            }
            return response.json(); 
        })
        .then(data => {
            console.log('Requisição GET bem-sucedida:', data);
              alert(JSON.stringify(data));
            
        })
        .catch(error => {
            console.error('Erro ao enviar requisição GET:', error);
             
        });

}


/*=======================================================*/

function fazerRequisicaoGET(url) {  /*Metodo fecht get*/
    
    const options = {
        method: 'GET'
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar requisição: ' + response.status);
            }
            return response.json(); 
        })
        .then(data => {
            console.log('Requisição GET bem-sucedida:', data);
              alert(JSON.stringify(data));
            
        })
        .catch(error => {
            console.error('Erro ao enviar requisição GET:', error);
             
        });
}

/*=======================================================*//*=======================================================*/


