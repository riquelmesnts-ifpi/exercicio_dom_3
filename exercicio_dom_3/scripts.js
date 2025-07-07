let tarefas = [];
let idCounter = 1;
let termoPesquisa = "";

const descricaoInput = getById("descricaoTarefa");
const tabelaBody = document.querySelector("#tabelaTarefas tbody");

// FUNÇÕES AUXILIARES 
function getById(id) {
    return document.getElementById(id);
}

function getBotaoClicavel(id, funcao) {
    getById(id).addEventListener('click', funcao);
    return getById(id);
}

getById("pesquisaTarefa").addEventListener("input", () => {
    termoPesquisa = getById("pesquisaTarefa").value.trim().toLowerCase();
    renderizarTabela();
});

let botaoAdicionar = getBotaoClicavel("adicionarBtn", adicionarTarefa);
let botaoOrdenar = getBotaoClicavel("ordenarBtn", ordenarTarefas);

function criarBotao(emoji, titulo, funcao) {
    const botao = document.createElement("button");
    botao.classList.add("icon");
    botao.title = titulo;
    botao.innerText = emoji;
    botao.addEventListener("click", funcao);
    return botao;
}

// PRINCIPAIS FUNÇÕES

function renderizarTabela() {
    tabelaBody.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(tarefa =>
        tarefa.descricao.toLowerCase().includes(termoPesquisa)
    );

    tarefasFiltradas.forEach(tarefa => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.innerText = tarefa.id;

        const tdDescricao = document.createElement("td");
        tdDescricao.innerText = tarefa.descricao;

        const tdInicio = document.createElement("td");
        tdInicio.innerText = tarefa.dataInicio;

        const tdConclusao = document.createElement("td");
        tdConclusao.innerText = tarefa.dataConclusao || "-";

        const tdProgresso = document.createElement("td");
        tdProgresso.innerText = `${tarefa.progresso || 0}%`;

        const tdStatus = document.createElement("td");
        tdStatus.innerText = getStatus(tarefa);
        tdStatus.className = `status ${getStatus(tarefa).toLowerCase().replace(" ", "-")}`;

        const tdAcoes = document.createElement("td");

        if (tarefa.dataConclusao === "") {
            tdAcoes.appendChild(criarBotao("✅", "Concluir", () => concluirTarefa(tarefa.id)));
            tdAcoes.appendChild(criarBotao("✏️", "Editar", () => editarTarefa(tarefa.id)));
            tdAcoes.appendChild(criarBotao("📈", "Atualizar Progresso", () => editarProgresso(tarefa.id)));
            tdAcoes.appendChild(criarBotao("🗑️", "Excluir", () => excluirTarefa(tarefa.id)));
        } else {
            tdAcoes.appendChild(criarBotao("↩️", "Reabrir", () => reabrirTarefa(tarefa.id)));
        }

        tr.appendChild(tdId);
        tr.appendChild(tdDescricao);
        tr.appendChild(tdInicio);
        tr.appendChild(tdConclusao);
        tr.appendChild(tdProgresso);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAcoes);

        tabelaBody.appendChild(tr);
    });
}

function concluirTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;

    tarefa.dataConclusao = new Date().toLocaleString();
    renderizarTabela();
}

function reabrirTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.dataConclusao = "";
        renderizarTabela();
    }
}

function excluirTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa.dataConclusao !== "") {
        alert("Não é possível excluir tarefas já concluídas.");
        return;
    }

    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        tarefas = tarefas.filter(t => t.id !== id);
        renderizarTabela();
    }
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;

    const novaDescricao = prompt("Editar descrição da tarefa:", tarefa.descricao);
    if (novaDescricao !== null) {
        const descricaoFinal = novaDescricao.trim();
        if (descricaoFinal === "") {
            alert("A descrição não pode ser vazia.");
        } else {
            tarefa.descricao = descricaoFinal;
            renderizarTabela();
        }
    }
}

function editarProgresso(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa || tarefa.dataConclusao !== "") {
        alert("A tarefa precisa estar ativa para editar o progresso.");
        return;
    }

    const progresso = prompt("Digite o progresso da tarefa (0 a 100):", tarefa.progresso);
    if (progresso !== null) {
        const valor = parseInt(progresso);
        if (isNaN(valor) || valor < 0 || valor > 100) {
            alert("Por favor, insira um valor válido entre 0 e 100.");
        } else {
            tarefa.progresso = valor;

            if (valor === 100 && tarefa.dataConclusao === "") {
                tarefa.dataConclusao = new Date().toLocaleString();
                alert("Parabéns! A tarefa foi concluída.");
            }

            renderizarTabela();
        }
    }
}

function getStatus(tarefa) {
    if (tarefa.dataConclusao !== "") return "Concluído";
    if (!tarefa.progresso || tarefa.progresso === 0) return "Não iniciado";
    return "Em processo";
}

function ordenarTarefas() {
    tarefas.sort((a, b) => {
        if ((b.progresso || 0) !== (a.progresso || 0)) {
            return (b.progresso || 0) - (a.progresso || 0);
        }
        return a.descricao.localeCompare(b.descricao);
    });
    renderizarTabela();
}

function adicionarTarefa() {
    const descricao = descricaoInput.value.trim();
    if (descricao === "") {
        alert("A descrição da tarefa não pode estar vazia.");
        return;
    }

    const novaTarefa = {
        id: idCounter++,
        descricao: descricao,
        dataInicio: new Date().toLocaleString(),
        dataConclusao: "",
        progresso: 0
    };

    tarefas.push(novaTarefa);
    descricaoInput.value = "";
    renderizarTabela();
}
