export const TipoMenuService = {
    menuMedico: [
        {
            label: 'Saluti | Médico',
            items: [
                {
                    label: 'Início', icon: 'pi pi-fw pi-home', to: '/'
                }
            ]
        }
    ],
    menuAtendente: [
        {
            label: 'Saluti | Atendente',
            items: [
                {
                    label: 'Início', icon: 'pi pi-fw pi-home', to: '/'
                }
            ]
        }
    ],
    menuPaciente: [
        {
            label: 'Saluti',
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
