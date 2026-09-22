# Design Simples no ESM Forum

## Estrutura analisada

No repositório utilizado nesta atividade, as rotas do backend estão definidas diretamente no arquivo `server.js`, enquanto as operações relacionadas às perguntas e respostas estão concentradas no arquivo `modelo.js`. Por esse motivo, a análise de Design Simples foi realizada principalmente sobre esses dois arquivos, que correspondem à implementação atual disponível no repositório.

## Análise do projeto

O ESM Forum possui uma estrutura simples, com o backend desenvolvido em Node.js e Express e o acesso aos dados concentrado no arquivo `modelo.js`. As rotas da aplicação estão definidas no arquivo `server.js`.

A análise desses arquivos mostra que o projeto procura resolver as funcionalidades atuais de forma direta, sem adicionar estruturas/abstrações que ainda não são necessárias.

## Aplicação do princípio YAGNI

O princípio YAGNI (You Aren't Gonna Need It) recomenda que funcionalidades e estruturas sejam implementadas somente quando realmente forem necessárias.

No ESM Forum, esse princípio pode ser observado na forma simples como as operações foram implementadas. Por exemplo, o cadastro de uma pergunta é realizado por uma função pequena e específica:

```javascript
function cadastrar_pergunta(texto) {
  const params = [texto, 1];
  const result = bd.exec(
    'INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta',
    params
  );
  return result.lastInsertRowid;
}

A função executa apenas o necessário para cadastrar uma pergunta e retornar seu identificador, sem adicionar regras ou abstrações que o sistema ainda não utiliza.

Outro exemplo é a obtenção de uma pergunta:

function get_pergunta(id_pergunta) {
  return bd.query(
    'select * from perguntas where id_pergunta = ?',
    [id_pergunta]
  );
}

Nesse caso, a implementação também é direta e possui só a responsabilidade necessária naquele momento.

Características de Design Simples

O código apresenta funções pequenas e com objetivos claros. No arquivo modelo.js, operações como cadastrar perguntas, cadastrar respostas, consultar perguntas e consultar respostas estão separadas em funções específicas.

Além disso, o server.js utiliza essas funções do modelo para atender às requisições HTTP. Por exemplo:

app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.json({id_pergunta: id_pergunta});
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});

A rota recebe a requisição e delega a operação de cadastro para o modelo, evitando colocar diretamente nela o código de acesso ao banco de dados.

Oportunidades de simplificação e melhoria

Apesar de o projeto possuir uma estrutura simples, alguns pontos podem ser melhorados sem aumentar desnecessariamente sua complexidade.

Um exemplo está no tratamento de erros das rotas. Existem vários blocos try/catch semelhantes no server.js. Caso o sistema cresça e novas rotas sejam adicionadas, esse código poderá ficar repetitivo. Uma possível melhoria futura seria centralizar o tratamento de erros em um middleware do Express.

Outro ponto está na função listar_perguntas():

function listar_perguntas() {
  const perguntas = bd.queryAll('select * from perguntas', []);
  perguntas.forEach(pergunta =>
    pergunta['num_respostas'] =
      get_num_respostas(pergunta['id_pergunta'])
  );
  return perguntas;
}

Para cada pergunta encontrada é realizada uma nova consulta para descobrir a quantidade de respostas. Com um volume maior de dados, isso pode gerar várias consultas ao banco. Uma consulta SQL utilizando agregação poderia obter essas informações de maneira mais eficiente.

Entretanto, seguindo o princípio YAGNI e a ideia de Design Simples, essas alterações devem ser realizadas quando houver uma necessidade concreta, evitando aumentar antecipadamente a complexidade de um sistema pequeno.

Conclusão

O ESM Forum apresenta uma implementação enxuta e de fácil compreensão. As funções possuem responsabilidades bem definidas e a solução atual evita abstrações desnecessárias. As melhorias identificadas podem ser aplicadas conforme o sistema evoluir, preservando o princípio de implementar apenas a complexidade necessária para atender aos requisitos existentes.