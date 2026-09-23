# Padrões de Projeto Existentes

## Introdução

O ESM Forum é uma aplicação de fórum desenvolvida com Node.js e Express no backend. A análise do código mostra que o projeto possui uma estrutura simples, mas apresenta algumas soluções que se aproximam de padrões de projeto conhecidos.

Os padrões apresentados a seguir foram identificados considerando principalmente os arquivos `server.js`, `modelo.js` e os módulos utilizados para acesso ao banco de dados.

## 1. Module Pattern

Um dos padrões mais perceptíveis no projeto é o **Module Pattern**.

No arquivo `modelo.js`, as funções relacionadas às perguntas e respostas são definidas internamente e depois disponibilizadas por meio de `exports`.

Exemplo:

```javascript
exports.reconfig_bd = reconfig_bd;
exports.listar_perguntas = listar_perguntas;
exports.cadastrar_pergunta = cadastrar_pergunta;
exports.cadastrar_resposta = cadastrar_resposta;
exports.get_pergunta = get_pergunta;
exports.get_respostas = get_respostas;
exports.get_num_respostas = get_num_respostas;
```

Com a implementação da funcionalidade de busca, também foi adicionada a exportação da nova operação:

```javascript
exports.buscar_perguntas = buscar_perguntas;
```

Esse formato permite organizar um conjunto de funções relacionadas dentro de um módulo e disponibilizar apenas as operações necessárias para outras partes da aplicação.

O `server.js`, por exemplo, importa esse módulo:

```javascript
const modelo = require('./modelo.js');
```

Assim, o servidor utiliza as operações fornecidas pelo modelo sem precisar possuir toda a lógica de acesso aos dados dentro das próprias rotas.

## 2. Repository como padrão aproximado

O arquivo `modelo.js` também apresenta características semelhantes ao **Repository Pattern**, embora o projeto não possua uma implementação formal desse padrão.

O módulo concentra diversas operações relacionadas ao armazenamento e recuperação de perguntas e respostas, como:

```javascript
function get_pergunta(id_pergunta) {
  return bd.query(
    'select * from perguntas where id_pergunta = ?',
    [id_pergunta]
  );
}
```

Outro exemplo é a busca por respostas:

```javascript
function get_respostas(id_pergunta) {
  return bd.queryAll(
    'select * from respostas where id_pergunta = ?',
    [id_pergunta]
  );
}
```

Dessa maneira, o `server.js` não precisa executar diretamente comandos SQL. As rotas solicitam as informações ao módulo responsável pelos dados.

A estrutura não constitui um Repository completo, pois `modelo.js` também reúne outras responsabilidades. Mesmo assim, existe uma separação básica entre a camada HTTP e as operações de persistência.

## 3. Dependency Injection em testes

Outro comportamento existente no projeto está relacionado à **Dependency Injection**.

No início do arquivo `modelo.js`, o módulo de banco de dados é carregado:

```javascript
var bd = require('./bd/bd_utils.js');
```

Porém, o projeto também possui a função:

```javascript
function reconfig_bd(mock_bd) {
  bd = mock_bd;
}
```

O próprio código indica que essa função é utilizada pelos testes para substituir a implementação real do banco de dados por uma versão mockada.

Isso permite que os testes forneçam uma dependência diferente para o modelo sem precisar utilizar diretamente o banco real durante todas as verificações.

Essa técnica facilita os testes unitários e reduz a dependência da implementação concreta do banco durante a execução dos testes.

## Relação entre os padrões

Os padrões identificados trabalham principalmente na organização e separação das partes da aplicação.

O **Module Pattern** organiza e controla quais funções são disponibilizadas por cada arquivo. A estrutura semelhante ao **Repository Pattern** concentra o acesso aos dados no `modelo.js`. Já a possibilidade de substituir o módulo de banco por um mock utiliza uma forma simples de **Dependency Injection**, favorecendo os testes.

## Conclusão

O ESM Forum não utiliza uma arquitetura complexa nem implementações formais de diversos padrões de projeto. Entretanto, sua estrutura apresenta características de padrões conhecidos que ajudam na organização do código.

O uso de módulos, a concentração das consultas ao banco em uma camada específica e a possibilidade de substituir a dependência do banco durante os testes são exemplos de decisões que contribuem para a manutenção e testabilidade do sistema.