const ApiRoutes = {
    // 'APP_URL': 'http://localhost:8000',
    'APP_URL': 'https://d1vg0iaktfp68d.cloudfront.net',
    // 'API_URL': 'http://localhost:8000/api',
    'API_URL': 'https://d1vg0iaktfp68d.cloudfront.net/fiap-hmv',
    'LOGIN': {
        'POST_LOGIN': '/v1/login', // '/sanctum/token',
        'GET_ME': '/v1/usuarios'   // '/usuario/dados'
    },
    'PACIENTE': {
        'GET_METRICS': '/v1/metricas/pacientes',                       // '/paciente/metricas',
        'POST_CHAMADO_EMERGENCIA': '/v1/pacientes/chamados_emergencia' // '/paciente/chamado_emergencia'
    },
    'QUESTIONARIO_EMERGENCIA': {
        'GET_NEW_QUESTIONARIO': '/v1/questionarios-emergencia/perfil/',  // '/questionario_emergencia/novo',
        'POST_NEW_QUESTIONARIO': '/v1/questionarios-emergencia/perfil/', // '/questionario_emergencia/novo'
    },
    'HABITO_SAUDE': {
        'GET_NEW_HABITO': '/v1/habito-saude',  // '/habito_saude/novo',
        'POST_NEW_HABITO': '/v1/habito-saude', // '/habito_saude/novo'
    },
    'ENDERECO': {
        'GET_ALL_MY': '/v1/enderecos' // '/endereco/meus'
    },
    'MEDICO': {
        'GET_METRICS': '/v1/metricas/medicos/',                                        // '/medico/metricas',
        'GET_QUEST_EMERG_PACIENTE': '/v1/questionarios-emergencia/medico',             // '/medico/questionario_emergencia',
        'GET_HABITO_SAUDE_PACIENTE': '/v1/habitos-saude/medicos/',                     // '/medico/habito_saude',
        'GET_HISTORICO_PACIENTE': '/v1/atendimentos/historicos/pacientes/',   // '/medico/historico',
        'POST_RELATORIO_ATENDIMENTO' : '/fiap-hmv/v1/atendimentos/medicos'             // '/medico/relatorio_atendimento'
    },
    'ATENDENTE': {
        'GET_METRICS': '/v1/metricas/atendentes',                                                               // '/metricas',
        'POST_AGENDAMENTO_NEW': '/v1/agendamentos/atendentes/',                                        // '/agendamento/novo',
        'PUT_AGENDAMENTO_SIT': '/v1/agendamentos/atendentes/{id}/status/{status_id}',                  // '/agendamento/situacao',
        'GET_AGENDAMENTO_DEFINIR_MEDICO': '/v1/agendamentos/{id_agendamento}/medicos/{id_medico}', // '/agendamento/definir_medico/',
        'GET_AGENDAMENTO_ESTABELECIMENTOS': '/v1/agendamentos/pacientes/{id}/estabelecimentos/enderecos'        // '/agendamento/estabelecimentos'
    }

};

export default ApiRoutes;