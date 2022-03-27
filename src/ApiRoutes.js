const ApiRoutes = {
    'APP_URL': 'http://localhost:8000',
    'API_URL': 'http://localhost:8000/api',
    'LOGIN': {
        'POST_LOGIN': '/sanctum/token',
        'GET_ME': '/usuario/dados',
        'POST_REGISTER':'/register'
    },
    'PACIENTE': {
        'GET_METRICS': '/paciente/metricas',
        'POST_CHAMADO_EMERGENCIA': '/paciente/chamado_emergencia'
    },
    'QUESTIONARIO_EMERGENCIA': {
        'GET_NEW_QUESTIONARIO':'/questionario_emergencia/novo',
        'POST_NEW_QUESTIONARIO': '/questionario_emergencia/novo'
    },
    'HABITO_SAUDE': {
        'GET_NEW_HABITO':'/habito_saude/novo',
        'POST_NEW_HABITO': '/habito_saude/novo'
    },
    'ENDERECO': {
        'GET_ALL_MY': '/endereco/meus'
    },
    'MEDICO': {
        'GET_METRICS': '/medico/metricas',
        'GET_QUEST_EMERG_PACIENTE': '/medico/questionario_emergencia',
        'GET_HABITO_SAUDE_PACIENTE': '/medico/habito_saude',
        'GET_HISTORICO_PACIENTE': '/medico/historico',
        'POST_RELATORIO_ATENDIMENTO' : '/medico/relatorio_atendimento'
    },
    'ATENDENTE': {
        'GET_METRICS': '/atendente/metricas',
        'POST_AGENDAMENTO_NEW': '/atendente/agendamento/novo',
        'PUT_AGENDAMENTO_SIT': '/atendente/agendamento/situacao',
        'GET_AGENDAMENTO_DEFINIR_MEDICO': '/atendente/agendamento/definir_medico/',
        'GET_AGENDAMENTO_ESTABELECIMENTOS': '/atendente/agendamento/estabelecimentos',
        'POST_PACIENTE_BUSCAR': '/atendente/paciente/buscar'
    }

};

export default ApiRoutes;