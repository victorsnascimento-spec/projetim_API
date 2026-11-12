//trazer a lista
//saber qual é o ultimo ID cadastrado
//somar + 1 para ser o proximo id
//return

import { listaT } from "../MANIPULADOR/arquivo.js";

export async function gerarNovoID() {
    const RegistrosAluno = await listaT();

    //pegar todos os IDs existentes
    const ids = RegistrosAluno.map((aluno) => aluno.id);

    const novoID = Math.max(...ids) + 1;
    return novoID;
}
