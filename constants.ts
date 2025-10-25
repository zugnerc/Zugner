import type { Party, MyActivity, CompetitorActivity, PlannedEvent, Coordinator } from './types';
import type { RegionalOfficial, Councilor, ProvincialList, DistrictList } from './types';

const PARTIDO_A_ID = 'party-a';
const PARTIDO_B_ID = 'party-b';

export const initialParties: Party[] = [
  {
    id: PARTIDO_A_ID,
    name: 'Fuerza Andina',
    description: 'Partido tradicional',
    logoUrl: 'https://picsum.photos/seed/partidoA/100/100',
    governor: {
      id: 'gov-a',
      partyId: PARTIDO_A_ID,
      role: 'Gobernador',
      name: 'Juan Pérez García',
      photoUrl: 'https://picsum.photos/seed/juanperez/200/200',
      dni: '12345678',
      nickname: 'El Constructor',
      isAffiliated: true,
      facebookUrl: 'https://facebook.com',
      tiktokUrl: 'https://tiktok.com',
      rank: 1,
    },
    provinces: [
      {
        id: 'prov-santa',
        name: 'Santa',
        voters: 350000,
        mayors: [
            {
                id: 'mayor-santa-a',
                partyId: PARTIDO_A_ID,
                role: 'Alcalde Provincial',
                name: 'Maria Rodriguez',
                photoUrl: 'https://picsum.photos/seed/mariarodriguez/200/200',
                dni: '87654321',
                nickname: 'La Dama de Hierro',
                isAffiliated: false,
                facebookUrl: '#',
                tiktokUrl: '#'
            }
        ],
        districts: [
            {
                id: 'dist-chimbote',
                name: 'Chimbote',
                voters: 210000,
                mayors: [
                     {
                        id: 'mayor-chimbote-a',
                        partyId: PARTIDO_A_ID,
                        role: 'Alcalde Distrital',
                        name: 'Carlos Mendoza',
                        photoUrl: 'https://picsum.photos/seed/carlosmendoza/200/200',
                        dni: '11223344',
                        nickname: 'El Joven Líder',
                        isAffiliated: true,
                        facebookUrl: '#',
                        tiktokUrl: '#'
                    }
                ]
            }
        ],
      },
      {
          id: 'prov-huaraz',
          name: 'Huaraz',
          voters: 150000,
          mayors: [],
          districts: []
      }
    ],
  },
   {
    id: PARTIDO_B_ID,
    name: 'Renovación Popular',
    description: 'Partido nuevo',
    logoUrl: 'https://picsum.photos/seed/partidoB/100/100',
    governor: {
      id: 'gov-b',
      partyId: PARTIDO_B_ID,
      role: 'Gobernador',
      name: 'Ana Torres Vega',
      photoUrl: 'https://picsum.photos/seed/anatorres/200/200',
      dni: '88887777',
      nickname: 'La Esperanza',
      isAffiliated: true,
      facebookUrl: '#',
      tiktokUrl: '#',
      rank: 2,
    },
    provinces: [],
  },
];

export const initialMyActivities: MyActivity[] = [
    { id: 'my-1', description: 'Reunión con bases en Huaraz', date: '15 JULIO 2024', link: '#' },
    { id: 'my-2', description: 'Caravana proselitista en Chimbote', date: '18 JULIO 2024', link: '#' },
];

export const initialCompetitorActivities: CompetitorActivity[] = [
    { id: 'comp-1', partyId: PARTIDO_B_ID, description: 'Mitin de cierre de campaña de Renovación Popular.', link: '#' },
    { id: 'comp-2', partyId: PARTIDO_A_ID, description: 'Fuerza Andina realiza pintas en el centro de la ciudad.', link: '#' },
];

const governor: RegionalOfficial = { id: 'reg-gov', name: 'Juan Pérez García', dni: '12345678', role: 'Gobernador' };
const viceGovernor: RegionalOfficial = { id: 'reg-vice', name: 'Luisa Gonzales', dni: '22334455', role: 'Vicegobernadora' };
const regionalCouncilors: Councilor[] = [
    { id: 'rc-1', name: 'Pedro Castillo', dni: '33445566', facebookUrl: '#', tiktokUrl: '#', gender: 'masculino', isCommunityQuota: false, isAffiliated: true, isPrimary: true, phone: '987654321' },
    { id: 'rc-2', name: 'Sofia Vergara', dni: '44556677', facebookUrl: '#', tiktokUrl: '#', gender: 'femenino', isCommunityQuota: true, isAffiliated: false, isPrimary: true, phone: '987654322' },
];
const provincialLists: ProvincialList[] = [
    {
        id: 'pl-1', provinceName: 'Santa', voters: 350000,
        mayor: { id: 'lm-1', name: 'Maria Rodriguez', nickname: 'La Dama de Hierro', dni: '87654321', facebookUrl: '#', tiktokUrl: '#', isAffiliated: false, gender: 'femenino', phone: '911222333' },
        councilors: [{ id: 'pc-1', name: 'Regidor Provincial 1', dni: '55667788', facebookUrl: '#', tiktokUrl: '#', gender: 'masculino', isCommunityQuota: false, isAffiliated: true, isPrimary: true, phone: '944555666' }],
        districtLists: [
            {
                id: 'dl-1', districtName: 'Chimbote', voters: 210000,
                mayor: { id: 'ldm-1', name: 'Carlos Mendoza', nickname: 'El Joven Líder', dni: '11223344', facebookUrl: '#', tiktokUrl: '#', isAffiliated: true, gender: 'masculino', phone: '977888999' },
                councilors: [{ id: 'dc-1', name: 'Regidor Distrital 1', dni: '66778899', facebookUrl: '#', tiktokUrl: '#', gender: 'femenino', isCommunityQuota: false, isAffiliated: true, isPrimary: true, phone: '900111222' }]
            }
        ]
    }
];
export const initialRegionalBody = { governor, viceGovernor, regionalCouncilors, provincialLists };


export const initialPlannedEvents: PlannedEvent[] = [
    { id: 'plan-1', title: 'Plan de Gobierno: Presentación', date: '20 JULIO 2024', description: 'Presentación del plan de gobierno a la prensa local.', location: 'Casa del Maestro, Huaraz', link: '#' },
    { id: 'plan-2', title: 'Campaña Médica Gratuita', date: '25 JULIO 2024', description: 'Atención médica en diversas especialidades para la comunidad.', location: 'Plaza de Armas, Chimbote', link: '#' }
];

export const initialCoordinators: Coordinator[] = [
    { id: 'coord-1', name: 'Miguel Grau', nickname: 'Migue', phone: '51999888777', province: 'Santa', district: 'Chimbote' },
    { id: 'coord-2', name: 'Rosa Flores', nickname: 'Rosita', phone: '51977666555', province: 'Huaraz', district: 'Huaraz' }
];