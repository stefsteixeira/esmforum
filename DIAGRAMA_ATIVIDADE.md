# Diagrama de Atividade

O diagrama de atividade abaixo representa o fluxo da busca de perguntas por palavra-chave no ESM Forum.

```mermaid
flowchart TD
    A([Início]) --> B[Acessar página de perguntas]
    B --> C[Informar palavra-chave]
    C --> D{Campo de busca está vazio?}

    D -- Sim --> E[Exibir todas as perguntas]
    E --> I([Fim])

    D -- Não --> F[Pesquisar perguntas pelo termo]
    F --> G{Foram encontrados resultados?}

    G -- Sim --> H[Exibir perguntas encontradas]
    H --> I

    G -- Não --> J[Informar que não há resultados]
    J --> I
```

## Descrição

O processo começa quando o usuário acessa a página de perguntas e informa uma palavra-chave. Caso o campo de busca esteja vazio, o sistema mantém a exibição das perguntas sem aplicar um filtro. Caso exista um termo de pesquisa, o sistema realiza a busca e verifica se foram encontrados resultados. Quando existem correspondências, as perguntas encontradas são exibidas. Caso contrário, o usuário é informado de que não existem resultados para a pesquisa.