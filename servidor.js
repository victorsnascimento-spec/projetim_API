import express from "express";
import { listaT, salvar } from "./MANIPULADOR/arquivo.js";
import { gerarNovoID } from "./FUNCOES/funcoes.js";

const app = express(); 
const PORT = 3000;
app.use(express.json());

app.get("/inicio", (req, res) => {
    res.send("Bem-vindo ao Registros de Presença e Saídas de Alunos");
});

app.get("/listaGeral", async (req, res) => {
    try{
        const cadastro = await listaT();
        return res.status(200).json(cadastro);

    }
    catch(error){
        console.log("Erro ao listar atendimentos", error);
        return res.status(500).json({error: "Não foi possível ler os cadastros"})
    }
});


app.get("/listaI/:id", async (req, res) => {
    try {
        const list = await listaT();
        const id = Number(req.params.id)
        const aluno = list.find((alunoS) => (alunoS.id === id))
        return res.status(200).json(aluno);
    }
    catch (error) {
        console.log(`Erro ao listar os alunos: ${error}`);
        res.status(404).json({ error: "Não foi possível encontrar esse aluno." })
    }
});

app.post("/adicionarAlunos", async (req,res) => {
    try {
        const { matricula, nome, turma, data, presente, motivoSaida, minutosFora  } = req.body;
        if (!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios, exceto presente, minutosFora e alertaTempo" })
        }

        const id = await gerarNovoID();

        const novoAluno = {
            id: Number(id),
            matricula,
            nome,
            turma,
            data,
            presente,
            motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: Boolean((alertadetempo) => (minutosFora > 15))
        }
        const cadastro = await listaT();
        cadastro.push(novoAluno);
        await salvar(cadastro);

        return res.status(201).send("Cadastro do aluno realizado com sucesso" )
    }
    catch (error) {
        console.log("Erro ao salvar aluno", error)
        return res.status(500).json
            ({ error: "Não foi possível salvar aluno" })
    }
})

app.put("/alunoAlterado/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const dado = await listaT();

        const alunoExistente = dado.find(
            (aluno) => aluno.id === id
        );
        if (!alunoExistente) {
            return res.status(404).json({ error: "Aluno não encontrado" })
        }
        const {matricula, nome, turma, data, presente, motivoSaida, minutosFora  } = req.body;
        if (!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios"})
        }
        const novoAluno = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: presente,
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: Boolean((alertadetempo) => (minutosFora > 15))
        }

        const dadoAt = dado.map((aluno) =>
            aluno.id === id ? novoAluno : aluno
        );
        await salvar(dadoAt);

        return res.status(200).send("Atendimento atualizado com sucesso")

    }

    catch (error) {
        console.log("Erro ao alterar aluno", error)
        return res.status(500).json
            ({ error: "Não foi possível alterar e salvar cadastro do aluno" })
    }
});

app.delete("/deleteAlunos/:id", async (req, res) => {

    try {
        const id = Number(req.params.id);

        const dado = await  listaT();
        const dadoAt = dado.filter((atendimento) =>
            atendimento.id !== id);

        if (dadoAt.length === dado.lenth) {
            return res.status(404).json({ erro: "Aluno não deletado" })
        }

        

        await salvar(dadoAt);

        return res.status(200).json({ mensagem: "Aluno excluído com sucesso!" });

    }
    catch (error) {
        console.log("Erro ao deletar Aluno", error);
        return res.status(500).json({ error: "Não foi possível deletar o Aluno" });
    }


});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});


app.listen(PORT, () => {
    console.log("Está rodando na porta: ", PORT);
});