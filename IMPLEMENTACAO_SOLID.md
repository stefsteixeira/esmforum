# Implementação Aplicando Princípios SOLID

## Funcionalidade escolhida

A funcionalidade escolhida para implementação foi a **busca de perguntas por palavra-chave**.

O objetivo é permitir que o usuário informe um termo e receba somente as perguntas cujo texto contenha a palavra pesquisada.

A funcionalidade foi implementada no backend do ESM Forum, mantendo a estrutura já existente no projeto.

## Arquivos modificados

Para implementar a funcionalidade, foram modificados dois arquivos:

- `modelo.js`
- `server.js`

O arquivo `modelo.js` ficou responsável pela consulta dos dados, enquanto o `server.js` ficou responsável por receber a requisição HTTP e retornar o resultado ao cliente.

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

A função também foi exportada pelo módulo para que possa ser utilizada pelo servidor.

```javascript
exports.buscar_perguntas = buscar_perguntas;
```

## Implementação da rota

No arquivo `server.js`, foi criada uma rota GET para disponibilizar a busca:

```javascript
app.get('/perguntas/busca', (req, res) => {
  try {
    const termo = req.query.termo || '';
    const perguntas = modelo.buscar_perguntas(termo);
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

A rota chama a função do modelo e retorna as perguntas encontradas em formato JSON.

## Aplicação do SRP

O princípio da **Responsabilidade Única (Single Responsibility Principle - SRP)** foi aplicado por meio da separação das responsabilidades.

A rota definida em `server.js` é responsável por receber a requisição HTTP, obter o termo pesquisado e retornar a resposta.

Já a função `buscar_perguntas`, presente em `modelo.js`, é responsável pelo acesso ao banco de dados e pela realização da consulta.

Dessa forma, a regra de acesso aos dados não precisa ficar diretamente dentro da rota.

## Aplicação do DIP

O **Princípio da Inversão de Dependência (Dependency Inversion Principle - DIP)** pode ser observado na forma como o `server.js` utiliza o módulo `modelo.js`.

A rota não realiza diretamente uma consulta SQL. Em vez disso, ela utiliza:

```javascript
modelo.buscar_perguntas(termo);
```

Assim, a camada responsável pela requisição depende da operação disponibilizada pelo modelo, enquanto os detalhes relacionados ao banco de dados permanecem concentrados no módulo responsável pelo acesso aos dados.

Além disso, o projeto já possui a função `reconfig_bd`, que permite substituir a dependência do banco de dados por uma versão mockada durante os testes, facilitando o desacoplamento e a testabilidade.

## Aplicação do OCP

O **Princípio Aberto/Fechado (Open/Closed Principle - OCP)** foi considerado ao adicionar a funcionalidade sem alterar o comportamento das funcionalidades existentes.

A busca foi acrescentada por meio de uma nova função no modelo e de uma nova rota no servidor. As funções existentes de cadastro, listagem de perguntas e respostas continuaram disponíveis.

Dessa forma, o sistema foi estendido com um novo comportamento sem exigir uma reescrita das funcionalidades já existentes.

## Teste da funcionalidade

Após a implementação, o servidor foi iniciado localmente na porta 5000.

A rota principal continuou retornando normalmente as perguntas existentes.

Também foi realizado um teste da nova rota de busca utilizando um termo presente nas perguntas cadastradas:

```text
/perguntas/busca?termo=3%2B3
```

A aplicação retornou as perguntas correspondentes ao termo pesquisado, confirmando o funcionamento da nova funcionalidade.

Também foi testado um termo que não estava presente nas perguntas cadastradas. Nesse caso, a aplicação retornou um array vazio, comportamento esperado para uma busca sem resultados.

## Versionamento

A implementação foi registrada em um commit específico no Git, separado da documentação e da análise dos princípios SOLID.

Mensagem utilizada no commit:

```text
Implementa busca de perguntas por palavra-chave
```

Essa separação facilita o acompanhamento das alterações realizadas durante o desenvolvimento.

## Conclusão

A implementação da busca por palavra-chave adicionou uma nova funcionalidade ao ESM Forum mantendo a organização simples do projeto.

A separação entre rota e acesso aos dados contribui para a aplicação do SRP, reduz o acoplamento entre a camada HTTP e o banco de dados e facilita futuras extensões da funcionalidade. A implementação também preservou as funcionalidades existentes, permitindo ampliar o sistema sem reestruturar desnecessariamente o código atual.