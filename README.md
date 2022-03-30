# HMV APP
[![Build React & Deploy S3](https://github.com/urnauzao/hmv-app/actions/workflows/actions-build-deploy.yml/badge.svg)](https://github.com/urnauzao/hmv-app/actions/workflows/actions-build-deploy.yml)

Aplicação React para o challenge HMV na FIAP.

# Sobre
Este projeto foi desenvolvido com o intuito de agilizar procedimentos de atendimento e agendamentos de consultas em estabelecimentos de saúde. 

# Usuários
Para sanar a dor encontrada no processo de triagem e gerenciamento de pacientes em ambiente hospitalar, foi focado o desenvolvimento de uma solução para atender aos 5 perfis de usuário principais que foram obtidos através de análise e mentorias com profissionais da equipe do Hospital Moinho de Ventos, sendo estes 5 perfis os seguintes:
- Paciente, figura do usuário principal, cujo qual é responsável por acionar emergências, realizar consultas médicas, alimentar com dados sobre sua saúde e anamnese do atendimento.
- Médico, figura responsável por prestar atendimentos a pacientes e dar andamento em agendamento de consultas. 
- Atendente, figura do profissional responsável pelo contato e atendimento ao paciente.
- Socorrista, profissional responsável por prestar serviços de emergência.
- Admin, profissional de um estabelecimento médico dotado de poderes para análise crítica de dados e gestão de estabelecimentos médicos.

## Backend
Já no backend, foi desenvolvimento um API utilizando PHP com Laravel. 
- [Repositório backend](https://github.com/urnauzao/hmv-mock)

## Instalação e execução do projeto:
- Para iniciar, você deve clonar este reposítorio para sua máquina.
- Depois de clonado, você deve executar:
> npm install
Caso tenha erro no comando acima, certifique-se de que o Node.js está está instalado em sua máquin.
- Agora é só executarmos nosso servidor local, para isso execute:
> npm run start

## Ambiente
Para realizar manutenção e atualização de rotas, temos um arquivo centralizado com todas as rotas, este arquivo está neste projeto em 2 versões, uma com rotas para ambiente de desenvolvimento e outra para ambiente de produção.
- [Arquivo de rotas Produção](https://github.com/urnauzao/hmv-app/blob/master/src/ApiRoutes.js)
- [Arquivo de rotas Desenvolvimento](https://github.com/urnauzao/hmv-app/blob/master/src/ApiRoutes.js.dev)
O arquivo que for utilizar para rotas deverá estar com nome ApiRoutes.js

## Postman
Temos um pack de rotas disponível para download e importação no Postman. 
- [Pack Consultas Postman](https://github.com/urnauzao/hmv-app/blob/master/routes_postman_pack.json)


## Rotas Internas
Depedência para gestão de rotas na aplicação
- [React Router Dom v6](https://reactrouter.com/docs/en/v6)

## UI
Afim de agilizar o desenvolvimento do MVP foi utilizado a lib de UI para React.js:
- [Primefaces - Primereact](https://www.primefaces.org/primereact/)

# Vídeo demonstrativo do Sistema
Demonstração em vídeo do sistema e apresentação sobre solução desenvolvida
- [YouTube - Demonstração ](https://youtu.be/Do1ugB8SF0I)
- [YouTube - Tecnologias Utilizadas ](https://youtu.be/dQHKCblRfMY)
- [YouTube - Apresentação ](https://youtu.be/0vAdp5qWiao)

# Equipe responsável pelo Projeto
- [João]("")
- [Samuel](https://www.linkedin.com/in/samuel-arcanjo-61a6a914b/)
- [Vivian]("")
- [Vi]("")
- [Urnau](https://www.linkedin.com/in/urnau/)

