# Análise dos Princípios SOLID no ESM Forum

## Estrutura analisada

O enunciado da atividade menciona a análise das pastas `routes/` e `models/`. Entretanto, na versão do ESM Forum utilizada neste projeto, as rotas da API estão definidas diretamente no arquivo `server.js`, enquanto as operações relacionadas aos dados estão concentradas no arquivo `modelo.js`.

Por esse motivo, a análise foi realizada principalmente sobre esses dois arquivos, considerando a estrutura atualmente disponível no repositório.

## Pontos positivos

### 1. Separação entre rotas e acesso aos dados — Single Responsibility Principle (SRP)

O projeto apresenta uma separação básica entre o tratamento das requisições HTTP, realizado em `server.js`, e as operações relacionadas aos dados, concentradas em `modelo.js`.

Por exemplo, a rota responsável pelo cadastro de uma pergunta não executa diretamente o comando SQL:

```javascript
app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.json({id_pergunta: id_pergunta});
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
```

A operação de persistência é delegada ao modelo:

```javascript
function cadastrar_pergunta(texto) {
  const params = [texto, 1];
  const result = bd.exec(
    'INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta',
    params
  );
  return result.lastInsertRowid;
}
```

Essa divisão se aproxima do **Single Responsibility Principle**, pois evita que a rota também seja responsável diretamente pelo acesso ao banco de dados.

### 2. Possibilidade de substituir a dependência do banco — Dependency Inversion Principle (DIP)

O arquivo `modelo.js` possui a função `reconfig_bd`, utilizada para substituir o módulo de banco de dados durante os testes:

```javascript
function reconfig_bd(mock_bd) {
  bd = mock_bd;
}
```

Essa solução permite que as funções do modelo sejam executadas utilizando uma implementação alternativa do acesso aos dados, como um objeto mockado nos testes.

Embora seja uma implementação simples e ainda possa ser aprimorada com uma abstração mais explícita, ela reduz o acoplamento durante os testes e apresenta uma ideia compatível com o **Dependency Inversion Principle**, pois permite substituir a dependência concreta utilizada pelo modelo.

### 3. Funções pequenas e responsabilidades específicas — Single Responsibility Principle (SRP)

As operações presentes em `modelo.js` são divididas em funções pequenas, cada uma responsável por uma operação específica.

Por exemplo:

```javascript
function get_pergunta(id_pergunta) {
  return bd.query(
    'select * from perguntas where id_pergunta = ?',
    [id_pergunta]
  );
}

function get_respostas(id_pergunta) {
  return bd.queryAll(
    'select * from respostas where id_pergunta = ?',
    [id_pergunta]
  );
}
```

Em vez de existir uma única função responsável por diversas operações, cada função possui um objetivo bem definido. Essa organização facilita a compreensão, manutenção e teste do código e está alinhada ao **Single Responsibility Principle**.

## Oportunidades de melhoria

### 1. Rotas e configuração da aplicação concentradas no mesmo arquivo — Single Responsibility Principle (SRP)

O arquivo `server.js` concentra a configuração do Express, a configuração de CORS, a definição das rotas e a inicialização do servidor.

Por exemplo, no mesmo arquivo são encontradas rotas como:

```javascript
app.get('/', (req, res) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.send(perguntas);
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
```

e também a inicialização do servidor:

```javascript
const port = 5000;
app.listen(port, 'localhost', () => {
  console.log(`ESM Forum rodando em ${port}`)
});
```

À medida que novas funcionalidades forem adicionadas, o arquivo poderá acumular responsabilidades diferentes. Uma melhoria seria separar as rotas e seus controladores da configuração principal da aplicação.

Por exemplo, uma estrutura futura poderia utilizar módulos específicos para perguntas, respostas e outras funcionalidades:

```text
controllers/
routes/
services/
repositories/
```

Essa separação ajudaria a manter cada módulo responsável por uma parte específica do sistema, favorecendo o **Single Responsibility Principle**.

### 2. Dependência direta do módulo de banco de dados — Dependency Inversion Principle (DIP)

Apesar de `reconfig_bd` permitir substituir o banco durante os testes, `modelo.js` inicialmente depende diretamente da implementação concreta localizada em `bd/bd_utils.js`:

```javascript
var bd = require('./bd/bd_utils.js');
```

Isso significa que a camada responsável pelas operações do modelo conhece diretamente o módulo concreto utilizado para acessar o banco.

Uma alternativa seria receber a dependência externamente:

```javascript
function criarModelo(banco) {
  return {
    getPergunta(id_pergunta) {
      return banco.query(
        'select * from perguntas where id_pergunta = ?',
        [id_pergunta]
      );
    }
  };
}
```

Dessa forma, o módulo dependeria de uma interface esperada de acesso aos dados, enquanto a implementação concreta poderia ser fornecida na configuração da aplicação. Essa abordagem reduziria o acoplamento e estaria mais alinhada ao **Dependency Inversion Principle**.

## Conclusão

O ESM Forum possui uma estrutura pequena e simples, com uma separação inicial entre as requisições HTTP e as operações de acesso aos dados. Essa organização já apresenta características relacionadas ao SRP e permite a substituição do banco em testes.

Entretanto, com a inclusão de novas funcionalidades, a concentração das rotas em `server.js` e a dependência direta do módulo de banco podem aumentar o acoplamento. A separação das responsabilidades em módulos específicos e a utilização de dependências fornecidas externamente podem tornar o sistema mais fácil de manter, testar e expandir.

