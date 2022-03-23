const ApiRoutes = {
    'APP_URL': 'http://localhost:8000',
    'API_URL': 'http://localhost:8000/api',
    'LOGIN': {
        'POST_LOGIN': '/sanctum/token',
        'GET_ME': '/usuario/dados'
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
    }

};

export default ApiRoutes;