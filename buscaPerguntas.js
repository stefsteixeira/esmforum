function criarBuscaPerguntas(repositorioPerguntas) {
  return function buscarPerguntas(termo) {
    return repositorioPerguntas.buscar_perguntas(termo);
  };
}

module.exports = criarBuscaPerguntas;