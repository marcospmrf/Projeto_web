const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const router = express.Router();
const cors = require('cors');

const app = express();
app.use(bodyParser.json());



const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Projeto',
    password: 'postgres',
    port: 5432, 
});


app.post('/acesso', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(`
            SELECT id, nome, email, telefone, codigo_setor, role 
            FROM usuario 
            WHERE username = $1 AND password = $2
        `, [username, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            console.log('Usuário encontrado no login:', user); // Log no backend

            res.json({
                success: true,
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                codigo_setor: user.codigo_setor, // Certifique-se de retornar esse valor
                role: user.role
            });
        } else {
            res.json({ success: false, message: 'Usuário ou senha incorretos!' });
        }
    } catch (error) {
        console.error('Erro no servidor durante o login:', error);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/usuarios', (req, res) => {
    const { nome, email, telefone, cpf, username, password, codigo_setor, role } = req.body;
  
    // Verificação dos campos obrigatórios
    if (!nome || !email || !username || !password || !codigo_setor || !role) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, preencha todos os campos obrigatórios.'
        });
    }
  
    const query = {
        text: 'INSERT INTO usuario (nome, email, telefone, cpf, username, password, codigo_setor, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [nome, email, telefone, cpf, username, password, parseInt(codigo_setor), role],
    };
  
    pool.query(query)
        .then(() => {
            res.status(201).json({ success: true, message: 'Usuário criado com sucesso' });
        })
        .catch(error => {
            console.error('Error creating user:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        });
  });
  

app.post('/setor', (req, res) => {
    const { setor, descricao, role } = req.body;

    const query = {
        text: 'INSERT INTO setor (setor, descricao, role) VALUES ($1, $2, $3)',
        values: [setor, descricao, role],
    };

    pool.query(query)
        .then(() => {
            res.status(201).json({ success: true, message: 'Setor criado com sucesso' });
        })
        .catch(error => {
            console.error('Error creating user:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        });
});


app.get('/api/setores', async (req, res) => {
    try {
        const result = await pool.query('SELECT codigo_setor, setor FROM setor');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar setores:', error);
        res.status(500).json({ message: 'Erro ao buscar setores' });
    }
});

  

app.post('/api/chamados', async (req, res) => {
    const { titulo, setor_origem, codigo_setor, prioridade, data_cadastro, descricao } = req.body;

    console.log('Dados recebidos na requisição:', req.body); // Log dos dados recebidos

    // Verificação de campos obrigatórios
    if (!titulo || setor_origem === null || !codigo_setor || !prioridade || !data_cadastro || !descricao) {
        console.error('Erro: Campos obrigatórios ausentes.');
        console.log('Dados ausentes ou inválidos:', {
            titulo,
            setor_origem,
            codigo_setor,
            prioridade,
            data_cadastro,
            descricao
        });
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO chamado (titulo, setor_origem, codigo_setor, prioridade, data_cadastro, descricao)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [titulo, setor_origem, codigo_setor, prioridade, data_cadastro, descricao];
        console.log('Query preparada para execução:', query, 'Valores:', values);

        const result = await pool.query(query, values);
        console.log('Chamado salvo com sucesso no banco de dados:', result.rows[0]);
        res.status(201).json({ message: 'Chamado salvo com sucesso!', chamado: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar o chamado no banco de dados:', error);
        res.status(500).json({ message: 'Erro ao salvar o chamado. Por favor, tente novamente.' });
    }
});




// Rota de login
app.post('/acesso', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Consulta o usuário no banco de dados
        const query = `
            SELECT id, nome, email, telefone, codigo_setor, role
            FROM usuario
            WHERE username = $1 AND password = $2
        `;
        const result = await pool.query(query, [username, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            console.log("Usuário encontrado:", user); // Log para debug

            // Retorna os dados do usuário, incluindo o setor
            res.json({
                success: true,
                id: user.id,
                nome: user.nome,
                codigo_setor: user.codigo_setor, // Retorna o setor do usuário
                role: user.role,
            });
        } else {
            // Caso o usuário não seja encontrado
            res.json({
                success: false,
                message: 'Usuário ou senha incorretos!',
            });
        }
    } catch (error) {
        console.error('Erro no servidor:', error);

        // Retorna erro genérico para o cliente
        res.status(500).json({
            success: false,
            message: 'Erro no servidor. Tente novamente mais tarde.',
        });
    }
});


app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { telefone, email, password } = req.body;
  
    // Garantir que a senha só seja atualizada se um novo valor for fornecido
    const passwordToUpdate = password ? password : undefined; // Se a senha não for fornecida, não atualiza a senha
  
    // Query para atualizar os dados do usuário
    const query = {
        text: `UPDATE usuario 
               SET telefone = $1, email = $2, password = COALESCE($3, password) 
               WHERE id = $4`,
        values: [
            telefone, 
            email, 
            passwordToUpdate,  // Atualiza a senha apenas se houver valor
            id
        ],
    };
  
    pool.query(query)
        .then(result => {
            if (result.rowCount > 0) {
                res.json({ success: true, message: 'Dados atualizados com sucesso' });
            } else {
                res.status(404).json({ success: false, message: 'Usuário não encontrado' });
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        });
  });
  
//////////////--API IMPRIMI CHAMADO -----------///////////////
app.get('/api/chamados', async (req, res) => {
    const { codigo_setor_usuario } = req.query;

    try {
        const query = `
            SELECT chamado.id, chamado.titulo, setor_origem.setor AS setor_origem_nome, 
                   setor_destino.setor AS setor_destino_nome, chamado.prioridade, 
                   chamado.data_cadastro, chamado.descricao, chamado.status
            FROM chamado
            JOIN setor setor_origem ON chamado.setor_origem = setor_origem.codigo_setor
            JOIN setor setor_destino ON chamado.codigo_setor = setor_destino.codigo_setor
            WHERE (chamado.setor_origem = $1 OR chamado.codigo_setor = $1)
              AND chamado.status = 'aberto';
        `;

        const result = await pool.query(query, [codigo_setor_usuario]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar chamados:', error);
        res.status(500).json({ message: 'Erro ao buscar chamados.' });
    }
});


//================================== ROTA PARA OBTER RESPOSTAS ================================================//

app.post('/responderChamado', async (req, res) => {
    const { id_chamado, texto_resposta } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO resposta (id_chamado, texto_resposta) VALUES ($1, $2) RETURNING *',
            [id_chamado, texto_resposta]
        );

        res.status(200).json({
            message: "Resposta salva com sucesso!",
            resposta: result.rows[0]
        });
    } catch (err) {
        console.error('Erro ao salvar a resposta:', err.message);
        res.status(500).json({ error: "Erro ao salvar a resposta." });
    }
});


//================================== ROTA campo vazio ================================================//

app.get('/api/respostas/:id_chamado', async (req, res) => {
    const { id_chamado } = req.params;

    try {
        const query = `
            SELECT texto_resposta, data_resposta
            FROM resposta
            WHERE id_chamado = $1
            ORDER BY data_resposta ASC;
        `;
        
        const result = await pool.query(query, [id_chamado]);
        res.json(result.rows); // Retorna as respostas em JSON
    } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        res.status(500).json({ message: 'Erro ao buscar respostas' });
    }
});


//------------------------------------------------------------------------------------------------------------------//

app.get('/api/chamados/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT titulo, descricao
            FROM chamado
            WHERE id = $1;
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Retorna o chamado
        } else {
            res.status(404).json({ message: 'Chamado não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar o chamado:', error);
        res.status(500).json({ message: 'Erro ao buscar o chamado' });
    }
});

///////////////=====================================================encerrar chamado===========================================================//////

app.post('/api/encerrarChamado/:id', async (req, res) => {
    const { id } = req.params;

    // Log para verificar o ID recebido
    console.log('ID recebido para encerrar chamado:', id);

    // Verificação se o ID está definido e é um número
    if (!id || isNaN(parseInt(id))) {
        console.error('Erro: ID inválido ou ausente.');
        return res.status(400).json({ success: false, message: 'ID inválido ou ausente.' });
    }

    try {
        const result = await pool.query(
            'UPDATE chamado SET status = $1 WHERE id = $2 RETURNING *',
            ['encerrado', id]
        );

        if (result.rowCount > 0) {
            console.log('Chamado encerrado com sucesso:', result.rows[0]);
            res.json({ success: true, message: 'Chamado encerrado com sucesso!' });
        } else {
            console.log('Chamado não encontrado para encerrar.');
            res.status(404).json({ success: false, message: 'Chamado não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao encerrar chamado:', error);
        res.status(500).json({ success: false, message: 'Erro ao encerrar chamado' });
    }
});


////////////////////=================================================GET ENCERRADO CHAMADO ================================================================///////////////
// Endpoint para buscar chamados encerrados
app.get('/api/chamadosEncerrados', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chamado WHERE status = $1', ['encerrado']);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar chamados encerrados:', error);
        res.status(500).json({ message: 'Erro ao buscar chamados encerrados' });
    }
});

//========================================================================

// Endpoint para buscar o histórico de respostas de um chamado específico
app.get('/api/historicoChamado/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM resposta WHERE id_chamado = $1 ORDER BY data_resposta ASC',
            [id]
        );
        res.json(result.rows); // Retorna as respostas em ordem cronológica
    } catch (error) {
        console.error('Erro ao buscar histórico do chamado:', error);
        res.status(500).json({ message: 'Erro ao buscar histórico do chamado' });
    }
});

////=========================================================================///////////============================================================

// Endpoint para buscar chamados com status 'aberto'
app.get('/api/chamadosAbertos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT chamado.id, chamado.titulo, setor.setor AS nome_setor, chamado.prioridade, chamado.data_cadastro, chamado.descricao
            FROM chamado
            LEFT JOIN setor ON chamado.codigo_setor = setor.codigo_setor
            WHERE chamado.status = 'aberto'
        `);
        res.json(result.rows); // Retorna os chamados com o nome do setor
    } catch (error) {
        console.error('Erro ao buscar chamados abertos:', error);
        res.status(500).json({ message: 'Erro ao buscar chamados abertos' });
    }
});

//---------------------------------------------------------------- APLICAR FILTRO DE CHAMADO -------------------------------------------///

app.get('/api/filtrarChamados', async (req, res) => {
    const { data_cadastro, nome_setor } = req.query;

    console.log('Parâmetros recebidos:', { data_cadastro, nome_setor }); // Log para debug

    try {
        const query = `
            SELECT 
                c.id AS chamado_id,
                c.titulo,
                c.descricao,
                c.data_cadastro,
                c.prioridade,
                c.status,
                s.setor AS setor_destino
            FROM 
                chamado c
            JOIN 
                setor s ON c.codigo_setor = s.codigo_setor
            WHERE 
                ($1::DATE IS NULL OR c.data_cadastro = $1::DATE)
                AND ($2::TEXT IS NULL OR s.setor ILIKE $2)
            ORDER BY 
                c.data_cadastro ASC;
        `;

        const values = [
            data_cadastro || null,
            nome_setor ? `%${nome_setor}%` : null,
        ];

        const result = await pool.query(query, values);

        console.log('Resultados encontrados:', result.rows);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar chamados:', err);
        res.status(500).json({ error: 'Erro ao buscar chamados' });
    }
});


app.get('/api/setorefiltro', async (req, res) => {
    const { nome_setor } = req.query;
    console.log('Filtro recebido no backend:', nome_setor); // Log do filtro recebido

    try {
        let query = 'SELECT * FROM setor';
        const params = [];

        if (nome_setor) {
            query += ' WHERE LOWER(setor) LIKE $1 OR CAST(codigo_setor AS TEXT) LIKE $1';
            params.push(`%${nome_setor.toLowerCase()}%`);
        }

        console.log('Consulta SQL gerada:', query); // Log da consulta gerada
        console.log('Parâmetros da consulta:', params); // Log dos parâmetros passados

        const { rows } = await pool.query(query, params);

        console.log('Resultados da consulta:', rows); // Log dos resultados
        res.json(rows); // Retorna os setores encontrados
    } catch (error) {
        console.error('Erro ao buscar setores no banco:', error); // Log de erro
        res.status(500).json({ error: 'Erro ao buscar setores' });
    }
});



app.get('/api/usuarios2', async (req, res) => {
    const { nome, cpf } = req.query;
    console.log('Parâmetros recebidos no backend:', { nome, cpf });

    try {
        let query = `
            SELECT id, nome, email, telefone, cpf, codigo_setor
            FROM usuario
        `;
        const params = [];

        // Adiciona condições de filtro, se necessário
        if (nome) {
            query += ' WHERE LOWER(nome) LIKE $1';
            params.push(`%${nome.toLowerCase()}%`);
        } else if (cpf) {
            query += ' WHERE cpf LIKE $1';
            params.push(`%${cpf}%`);
        }

        console.log('Consulta SQL gerada:', query);
        console.log('Parâmetros da consulta:', params);

        const { rows } = await pool.query(query, params);
        console.log('Resultados da consulta:', rows);

        res.json(rows); // Retorna os usuários encontrados
    } catch (error) {
        console.error('Erro ao buscar usuários no banco:', error.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});
