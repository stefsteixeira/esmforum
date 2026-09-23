# Caso de Uso – Busca de Perguntas por Palavra-chave

## Descrição

Este caso de uso descreve o processo de busca de perguntas no ESM Forum por meio de uma palavra-chave informada pelo usuário.

## Ator

Usuário do ESM Forum.

## Pré-condições

- O sistema deve estar disponível para acesso;
- Devem existir perguntas cadastradas no sistema para que possam ser pesquisadas.

## Fluxo principal

1. O usuário acessa a página de perguntas do ESM Forum.
2. O sistema apresenta um campo de busca.
3. O usuário informa uma palavra-chave ou termo relacionado ao conteúdo que deseja encontrar.
4. O usuário solicita a realização da busca.
5. O sistema pesquisa as perguntas cadastradas utilizando o termo informado.
6. O sistema exibe as perguntas que correspondem ao termo pesquisado.
7. O usuário pode visualizar os resultados encontrados.

## Fluxos alternativos

### Nenhuma pergunta encontrada

1. O usuário realiza uma busca.
2. O sistema não encontra perguntas relacionadas ao termo informado.
3. O sistema informa ao usuário que não foram encontrados resultados para a pesquisa.

### Campo de busca vazio

1. O usuário tenta realizar uma busca sem informar uma palavra-chave.
2. O sistema mantém ou apresenta a listagem de perguntas sem aplicar um filtro de busca.

## Pós-condições

- Quando houver correspondências, as perguntas relacionadas ao termo pesquisado serão apresentadas ao usuário;
- A busca não altera nem remove as perguntas armazenadas no sistema.