# Diagrama de Classes

O diagrama abaixo representa as principais classes envolvidas nas funcionalidades selecionadas para a evolução do ESM Forum.

```mermaid
classDiagram

class Usuario {
    +int id_usuario
    +string nome
}

class Pergunta {
    +int id_pergunta
    +string texto
    +int id_usuario
    +int pontuacao
}

class Resposta {
    +int id_resposta
    +int id_pergunta
    +string texto
}

class Voto {
    +int id_voto
    +int id_usuario
    +int id_pergunta
    +int valor
}

class Notificacao {
    +int id_notificacao
    +int id_usuario
    +int id_pergunta
    +string mensagem
    +boolean lida
}

Usuario "1" --> "0..*" Pergunta : cria
Usuario "1" --> "0..*" Voto : realiza
Usuario "1" --> "0..*" Notificacao : recebe

Pergunta "1" --> "0..*" Resposta : possui
Pergunta "1" --> "0..*" Voto : recebe
Pergunta "1" --> "0..*" Notificacao : gera
```

## Descrição

O usuário pode criar perguntas e realizar votos. Cada pergunta pode possuir várias respostas e receber vários votos. Quando uma nova resposta é adicionada a uma pergunta, uma notificação pode ser gerada para o autor da pergunta.

A funcionalidade de busca utiliza o conteúdo das perguntas existentes para localizar aquelas que correspondem à palavra-chave informada pelo usuário, não sendo necessária a criação de uma classe específica apenas para representar a busca.