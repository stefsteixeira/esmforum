# Implementação Aplicando Princípios SOLID

## Funcionalidade escolhida

A funcionalidade escolhida para implementação foi a **busca de perguntas por palavra-chave**.

O objetivo é permitir que o usuário informe um termo e receba somente as perguntas cujo texto contenha a palavra pesquisada.

A funcionalidade foi implementada no backend do ESM Forum, mantendo a estrutura já existente no projeto.

## Arquivos envolvidos

Para implementar a funcionalidade e aplicar os princípios SOLID, foram utilizados três arquivos:

- `modelo.js`
- `buscaPerguntas.js`
- `server.js`

O arquivo `modelo.js` é responsável pelo acesso aos dados e pela consulta das perguntas.

O arquivo `buscaPerguntas.js` representa o serviço de busca e recebe externamente a dependência responsável por consultar as perguntas.

O arquivo `server.js` recebe as requisições HTTP, configura a dependência utilizada pelo serviço de busca e retorna os resultados ao cliente.

## Implementação no modelo

No arquivo `modelo.js`, foi criada uma função responsável especificamente pela busca de perguntas.

```javascript
function buscar_perguntas(termo) {
  return bd.queryAll(
    'select * from perguntas where texto like ?',
    [`%${termo}%`]
  );
}
```

A função recebe o termo informado pelo usuário e realiza uma consulta no banco de dados utilizando `LIKE`, permitindo encontrar perguntas que contenham o texto pesquisado.

A função também foi exportada pelo módulo para que possa ser utilizada por outros componentes da aplicação.

```javascript
exports.buscar_perguntas = buscar_perguntas;
```

## Serviço de busca e injeção de dependência

Para reduzir o acoplamento da funcionalidade de busca com a implementação concreta do modelo, foi criado o arquivo `buscaPerguntas.js`.

```javascript
function criarBuscaPerguntas(repositorioPerguntas) {
  return function buscarPerguntas(termo) {
    return repositorioPerguntas.buscar_perguntas(termo);
  };
}

module.exports = criarBuscaPerguntas;
```

Esse módulo não importa diretamente `modelo.js` nem o módulo responsável pelo banco de dados.

Em vez disso, a dependência necessária para realizar a busca é recebida pelo parâmetro `repositorioPerguntas`.

No `server.js`, a implementação concreta é fornecida ao serviço durante a configuração da aplicação:

```javascript
const modelo = require('./modelo.js');
const criarBuscaPerguntas = require('./buscaPerguntas.js');

const buscarPerguntas = criarBuscaPerguntas(modelo);
```

Dessa forma, o serviço de busca pode trabalhar com qualquer objeto que disponibilize a operação `buscar_perguntas`, sem precisar conhecer os detalhes de sua implementação.

## Implementação da rota

No arquivo `server.js`, a rota GET disponibiliza a busca:

```javascript
app.get('/perguntas/busca', (req, res) => {
  try {
    const termo = req.query.termo || '';
    const perguntas = buscarPerguntas(termo);
    res.json(perguntas);
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
```

O termo de pesquisa é recebido por meio do parâmetro `termo` da URL.

Um exemplo de utilização é:

```text
http://localhost:5000/perguntas/busca?termo=3%2B3
```

A rota utiliza o serviço de busca e retorna as perguntas encontradas em formato JSON.

## Aplicação do SRP

O princípio da **Responsabilidade Única (Single Responsibility Principle - SRP)** foi aplicado por meio da separação das responsabilidades.

O `server.js` é responsável pelo tratamento da requisição e da resposta HTTP.

O `buscaPerguntas.js` é responsável por executar a operação de busca utilizando uma dependência fornecida externamente.

O `modelo.js` permanece responsável pelo acesso aos dados e pela consulta ao banco.

Dessa forma, responsabilidades relacionadas ao protocolo HTTP, execução da funcionalidade e persistência dos dados permanecem separadas.

## Aplicação do DIP

O **Princípio da Inversão de Dependência (Dependency Inversion Principle - DIP)** foi aplicado de forma explícita por meio de injeção de dependência.

O módulo `buscaPerguntas.js` não cria nem importa diretamente a implementação responsável pelo acesso aos dados. A dependência é recebida externamente:

```javascript
function criarBuscaPerguntas(repositorioPerguntas) {
  return function buscarPerguntas(termo) {
    return repositorioPerguntas.buscar_perguntas(termo);
  };
}
```

No `server.js`, o `modelo` é fornecido ao serviço:

```javascript
const buscarPerguntas = criarBuscaPerguntas(modelo);
```

Com isso, o serviço depende apenas do comportamento esperado de `repositorioPerguntas`, ou seja, da existência da operação `buscar_perguntas`.

Essa abordagem reduz o acoplamento e permite substituir a dependência por outra implementação, inclusive uma implementação mockada em testes, sem alterar a lógica do serviço de busca.

## Aplicação do OCP

O **Princípio Aberto/Fechado (Open/Closed Principle - OCP)** foi considerado ao adicionar a funcionalidade sem remover ou reescrever as funcionalidades existentes.

A busca foi acrescentada por meio de uma nova função no modelo, um serviço específico e uma nova rota no servidor.

As funções existentes de cadastro, listagem de perguntas e respostas continuaram disponíveis.

Dessa forma, o sistema foi estendido com um novo comportamento preservando as funcionalidades que já existiam.

## Teste da funcionalidade

Após a implementação, o servidor foi iniciado localmente na porta 5000.

A nova versão com injeção de dependência iniciou normalmente, sem apresentar erros.

Também foi realizado um teste da rota de busca utilizando um termo presente nas perguntas cadastradas:

```text
/perguntas/busca?termo=3%2B3
```

A aplicação retornou seis perguntas contendo o texto `3+3`, confirmando que a funcionalidade continuou funcionando após a aplicação da injeção de dependência.

Anteriormente, também foi realizado um teste utilizando um termo que não estava presente nas perguntas cadastradas. Nesse caso, a aplicação retornou um array vazio, comportamento esperado para uma busca sem resultados.

## Versionamento

A implementação inicial da busca por palavra-chave foi registrada em um commit específico:

```text
Implementa busca de perguntas por palavra-chave
```

Posteriormente, a implementação foi evoluída para tornar a aplicação do DIP mais explícita por meio de injeção de dependência, mantendo o funcionamento da busca.

Essa evolução também permite registrar separadamente no histórico do Git a aplicação dos princípios de design sobre a funcionalidade já implementada.

## Conclusão

A implementação da busca por palavra-chave adicionou uma nova funcionalidade ao ESM Forum e foi posteriormente estruturada para tornar mais clara a aplicação dos princípios SOLID.

O SRP é aplicado pela separação das responsabilidades entre requisição HTTP, serviço de busca e acesso aos dados. O DIP é aplicado por meio da injeção do repositório utilizado pelo serviço, evitando que `buscaPerguntas.js` dependa diretamente de uma implementação concreta. O OCP é considerado pela extensão do sistema com a nova funcionalidade sem a necessidade de reescrever as operações já existentes.

Com essa organização, a funcionalidade permanece simples, testável e menos acoplada aos detalhes de persistência.