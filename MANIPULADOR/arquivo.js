import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dados = path.join(__dirname, "..","BD", "tabela_registros.json");  


export async function listaT() {

    const conteudo = await fs.readFile(dados, "utf-8");
    return JSON.parse(conteudo);
}


export async function salvar(cadastro) {
    await fs.writeFile(dados, JSON.stringify(cadastro, null, 2), "utf-8");
}
