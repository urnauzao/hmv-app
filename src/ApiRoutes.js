const ApiRoutes = {
    
    'APP_URL': 'https://d1vg0iaktfp68d.cloudfront.net',
    'API_URL': 'https://d1vg0iaktfp68d.cloudfront.net/fiap-hmv',
    'LOGIN': {
        'POST_LOGIN': '/v1/login', 
        'GET_ME': '/v1/usuarios',   
        'POST_REGISTER': '/v1/usuarios' 
    },
    'PACIENTE': {
        'GET_METRICS': '/v1/metricas/pacientes',                       
        'POST_CHAMADO_EMERGENCIA': '/v1/pacientes/chamados_emergencia' 
    },
    'QUESTIONARIO_EMERGENCIA': {
        'GET_NEW_QUESTIONARIO': '/v1/questionarios-emergencia/perfil',  
        'POST_NEW_QUESTIONARIO': '/v1/questionarios-emergencia/perfil'  
    },
    'HABITO_SAUDE': {
        'GET_NEW_HABITO': '/v1/habito-saude',  
        'POST_NEW_HABITO': '/v1/habito-saude'  
    },
    'ENDERECO': {
        'GET_ALL_MY': '/v1/enderecos' 
    },
    'MEDICO': {
        'GET_METRICS': '/v1/metricas/medicos/',                                        
        'GET_QUEST_EMERG_PACIENTE': '/v1/questionarios-emergencia/medico',             
        'GET_HABITO_SAUDE_PACIENTE': '/v1/habitos-saude/medicos',                     
        'GET_HISTORICO_PACIENTE': '/v1/atendimentos/historicos/pacientes',   
        'POST_RELATORIO_ATENDIMENTO' : '/v1/atendimentos/medicos'             
    },
    'ATENDENTE': {
        'GET_METRICS': '/v1/metricas/atendentes',                                                               
        'POST_AGENDAMENTO_NEW': '/v1/agendamentos/atendentes/',                                        
        'PUT_AGENDAMENTO_SIT': '/v1/agendamentos/atendentes/{agendamento_id}/status/{situacao_id}',                  
        'GET_AGENDAMENTO_DEFINIR_MEDICO': '/v1/agendamentos/{agendamento_id}/medicos/{medico_id}',     
        'GET_AGENDAMENTO_ESTABELECIMENTOS': '/v1/agendamentos/pacientes/{paciente_id}/estabelecimentos/enderecos', 
        'POST_PACIENTE_BUSCAR': '/v1/pacientes/busca'
    }

};

export default ApiRoutes;