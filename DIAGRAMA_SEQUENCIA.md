# Diagrama de Sequência

O diagrama de sequência abaixo representa o processo de busca de perguntas por palavra-chave no ESM Forum.

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant Backend
    participant Modelo
    participant Banco as Banco de Dados

    Usuario->>Frontend: Informa palavra-chave
    Frontend->>Backend: Solicita busca de perguntas
    Backend->>Modelo: buscarPerguntas(termo)
    Modelo->>Banco: Consulta perguntas pelo termo
    Banco-->>Modelo: Retorna perguntas encontradas
    Modelo-->>Backend: Retorna resultados
    Backend-->>Frontend: Envia resultados da busca
    Frontend-->>Usuario: Exibe perguntas encontradas

    alt Nenhuma pergunta encontrada
        Frontend-->>Usuario: Informa que não há resultados
    end
```

## Descrição

O usuário informa uma palavra-chave no frontend, que envia a solicitação de busca ao backend. O backend utiliza o modelo para consultar as perguntas armazenadas no banco de dados. Os resultados são retornados ao frontend e apresentados ao usuário. Caso nenhuma pergunta corresponda ao termo pesquisado, o sistema informa que não foram encontrados resultados.