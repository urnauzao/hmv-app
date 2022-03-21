const ApiRoutes = {
    'APP_URL': 'http://localhost:8000',
    'API_URL': 'http://localhost:8000/api',
    'LOGIN': {
        'POST_LOGIN': '/sanctum/token',
        'GET_ME': '/usuario/dados'
    },
    'PACIENTE': {
        'GET_METRICS': '/paciente/metricas'
    },
    'QUESTIONARIO_EMERGENCIA': {
        'GET_NEW_QUESTIONARIO':'/questionario_emergencia/novo',
        'POST_NEW_QUESTIONARIO': '/questionario_emergencia/novo'
    }
};

export default ApiRoutes;