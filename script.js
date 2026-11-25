const aulas = [
  {
    id: "primeiras-rodas",
    nome: "Primeiras rodas",
    nivel: "Iniciante",
    descricao: "Equilíbrio, postura e os primeiros deslizes com calma e confiança.",
    duracao: "50 min",
    icone: "01"
  },
  {
    id: "ganhando-fluidez",
    nome: "Ganhando fluidez",
    nivel: "Intermediário",
    descricao: "Curvas, controle de velocidade e transições para seu rolê fluir.",
    duracao: "60 min",
    icone: "02"
  },
  {
    id: "rolê-com-estilo",
    nome: "Rolê com estilo",
    nivel: "Todos os níveis",
    descricao: "Uma prática guiada para curtir o movimento e evoluir no seu ritmo.",
    duracao: "60 min",
    icone: "03"
  }
];

const listaAulas = document.querySelector("#lista-aulas");
const seletorAula = document.querySelector("#aula");
const formulario = document.querySelector("#form-aula");
const campoNome = document.querySelector("#nome");
const mensagem = document.querySelector("#mensagem");
const ultimoPedido = document.querySelector("#ultimo-pedido");
const botaoTema = document.querySelector("#alternar-tema");
const chaveUltimoPedido = "linda-ro-ultimo-pedido";

function mostrarAulas() {
  aulas.forEach(function (aula) {
    const cartao = document.createElement("article");
    cartao.className = "cartao-aula";

    const icone = document.createElement("span");
    icone.className = "aula-icone";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = aula.icone;

    const nivel = document.createElement("p");
    nivel.className = "aula-nivel";
    nivel.textContent = aula.nivel;

    const nome = document.createElement("h3");
    nome.textContent = aula.nome;

    const descricao = document.createElement("p");
    descricao.className = "aula-descricao";
    descricao.textContent = aula.descricao;

    const duracao = document.createElement("span");
    duracao.className = "aula-duracao";
    duracao.textContent = "◷ " + aula.duracao;

    const opcao = document.createElement("option");
    opcao.value = aula.id;
    opcao.textContent = aula.nome + " — " + aula.nivel;

    cartao.append(icone, nivel, nome, descricao, duracao);
    listaAulas.append(cartao);
    seletorAula.append(opcao);
  });
}

function mostrarUltimoPedidoSalvo() {
  let pedido;

  try {
    const salvo = localStorage.getItem(chaveUltimoPedido);
    if (!salvo) {
      return;
    }

    pedido = JSON.parse(salvo);
  } catch (erro) {
    ultimoPedido.textContent = "Não foi possível ler a aula salva neste navegador.";
    return;
  }

  if (!pedido || typeof pedido.nome !== "string" || typeof pedido.aulaNome !== "string") {
    ultimoPedido.textContent = "A aula salva está inválida. Faça uma nova solicitação para atualizar.";
    return;
  }

  const aulaConhecida = aulas.some(function (aula) {
    return aula.id === pedido.aulaId;
  });

  if (!aulaConhecida) {
    ultimoPedido.textContent = "A aula salva está inválida. Faça uma nova solicitação para atualizar.";
    return;
  }

  ultimoPedido.textContent = "Última aula escolhida neste navegador: " + pedido.aulaNome + ", para " + pedido.nome + ".";
}

botaoTema.addEventListener("click", function () {
  if (document.body.classList.contains("modo-noite")) {
    document.body.classList.remove("modo-noite");
    botaoTema.textContent = "Modo noturno";
    botaoTema.setAttribute("aria-pressed", "false");
  } else {
    document.body.classList.add("modo-noite");
    botaoTema.textContent = "Modo claro";
    botaoTema.setAttribute("aria-pressed", "true");
  }
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensagem.classList.remove("erro");

  const nome = campoNome.value.trim();
  const aulaSelecionada = aulas.find(function (aula) {
    return aula.id === seletorAula.value;
  });

  if (nome.length < 2) {
    mensagem.classList.add("erro");
    mensagem.textContent = "Digite seu nome com pelo menos 2 caracteres.";
    campoNome.focus();
    return;
  }

  if (!aulaSelecionada) {
    mensagem.classList.add("erro");
    mensagem.textContent = "Escolha uma aula para continuar.";
    seletorAula.focus();
    return;
  }

  let incentivo;
  if (aulaSelecionada.nivel === "Iniciante") {
    incentivo = "Que legal começar! Vamos com calma, uma volta de cada vez.";
  } else {
    incentivo = "Boa escolha! Cada rolê é uma chance de curtir e evoluir.";
  }

  const pedido = {
    nome: nome,
    aulaId: aulaSelecionada.id,
    aulaNome: aulaSelecionada.nome
  };

  mensagem.textContent = incentivo + " Sua escolha foi registrada neste navegador.";

  try {
    localStorage.setItem(chaveUltimoPedido, JSON.stringify(pedido));
    ultimoPedido.textContent = "Última aula escolhida neste navegador: " + pedido.aulaNome + ", para " + pedido.nome + ".";
  } catch (erro) {
    ultimoPedido.textContent = "A escolha foi registrada na página, mas não pôde ser salva neste navegador.";
  }
});

mostrarAulas();
mostrarUltimoPedidoSalvo();
