export const TipoMenuService = {
    menuMedico: [
        {
            label: 'Connect HMV | Médico',
            items: [
                {
                    label: 'Início', icon: 'pi pi-fw pi-home', to: '/'
                }
            ]
        }
    ],
    menuPaciente: [
        {
            label: 'Connect HMV',
            items: [
                {
                    label: 'Início', icon: 'pi pi-fw pi-home', to: '/'
                },
                {
                    label: 'Questionário de Emergência', icon: 'pi pi-fw pi-plus-circle', to: '/questionario-emergencia'
                },
                {
                    label: 'Hábitos de Saúde', icon: 'pi pi-fw pi-heart-fill', to: '/habitos'
                }
            ]
        }
    ]
}