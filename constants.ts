import type { Party, MyActivity, CompetitorActivity, PlannedEvent, Birthday, MediaPost, TrollTarget, RegionalOfficial, Councilor, ProvincialList, RegionalBody, PresidentialCandidate, CoordinatorProvince } from './types';

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
                tiktokUrl: '#',
                rank: 3,
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
                        tiktokUrl: '#',
                        rank: 2,
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
    { id: 'rc-1', name: 'Pedro Castillo', dni: '33445566', facebookUrl: '#', tiktokUrl: '#', gender: 'masculino', isCommunityQuota: false, isAffiliated: true, isPrimary: true, phone: '987654321', province: 'Santa', profession: 'Abogado', number: 1 },
    { id: 'rc-2', name: 'Sofia Vergara', dni: '44556677', facebookUrl: '#', tiktokUrl: '#', gender: 'femenino', isCommunityQuota: true, isAffiliated: false, isPrimary: true, phone: '987654322', province: 'Huaraz', profession: 'Docente', number: 2 },
];
const provincialLists: ProvincialList[] = [
    {
        id: 'pl-1', provinceName: 'Santa', voters: 350000,
        mayor: { id: 'lm-1', name: 'Maria Rodriguez', nickname: 'La Dama de Hierro', dni: '87654321', facebookUrl: '#', tiktokUrl: '#', isAffiliated: false, gender: 'femenino', phone: '911222333' },
        councilors: [{ id: 'pc-1', name: 'Regidor Provincial 1', dni: '55667788', facebookUrl: '#', tiktokUrl: '#', gender: 'masculino', isCommunityQuota: false, isAffiliated: true, isPrimary: true, phone: '944555666', province: 'Santa', profession: '', number: 1 }],
        districtLists: [
            {
                id: 'dl-1', districtName: 'Chimbote', voters: 210000,
                mayor: { id: 'ldm-1', name: 'Carlos Mendoza', nickname: 'El Joven Líder', dni: '11223344', facebookUrl: '#', tiktokUrl: '#', isAffiliated: true, gender: 'masculino', phone: '977888999' },
                councilors: [{ id: 'dc-1', name: 'Regidor Distrital 1', dni: '66778899', facebookUrl: '#', tiktokUrl: '#', gender: 'femenino', isCommunityQuota: false, isAffiliated: true, isPrimary: true, phone: '900111222', province: 'Santa', profession: '', number: 1 }]
            }
        ]
    }
];
export const initialRegionalBody: RegionalBody = { governor, viceGovernor, regionalCouncilors, provincialLists };


export const initialPlannedEvents: PlannedEvent[] = [
    { id: 'plan-1', title: 'Plan de Gobierno: Presentación', date: '20 JULIO 2024', description: 'Presentación del plan de gobierno a la prensa local.', location: 'Casa del Maestro, Huaraz', link: '#' },
    { id: 'plan-2', title: 'Campaña Médica Gratuita', date: '25 JULIO 2024', description: 'Atención médica en diversas especialidades para la comunidad.', location: 'Plaza de Armas, Chimbote', link: '#' }
];

export const initialCoordinatorProvinces: CoordinatorProvince[] = [
    {
        id: 'coord-prov-1',
        name: 'Santa',
        districts: [
            {
                id: 'coord-dist-1',
                name: 'Chimbote',
                coordinators: [
                    { id: 'coord-1', name: 'Miguel Grau', description: 'Responsable de bases', phone: '51999888777' }
                ]
            }
        ]
    },
    {
        id: 'coord-prov-2',
        name: 'Huaraz',
        districts: [
            {
                id: 'coord-dist-2',
                name: 'Huaraz',
                coordinators: [
                    { id: 'coord-2', name: 'Rosa Flores', description: 'Coordinadora de mujeres', phone: '51977666555' }
                ]
            }
        ]
    }
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

const formatForInitialData = (date: Date) => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const initialBirthdays: Birthday[] = [
    { id: 'bday-1', name: 'Laura Martinez', nickname: 'Lau', birthdate: `1990-${formatForInitialData(today)}` },
    { id: 'bday-2', name: 'Roberto Sanchez', nickname: 'Beto', birthdate: `1985-${formatForInitialData(tomorrow)}` },
    { id: 'bday-3', name: 'Carla Diaz', nickname: 'Carly', birthdate: `1992-${formatForInitialData(nextWeek)}` },
    { id: 'bday-4', name: 'Pedro Pascal', nickname: 'Pedrito', birthdate: '1975-04-02' },
];


const getDummyDate = (day: number) => {
  const date = new Date();
  date.setDate(day);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export const initialMediaPosts: MediaPost[] = [
    { id: 'media-1', title: 'Candidato Juan Pérez lidera nueva encuesta regional', publicationDate: getDummyDate(3), sentiment: 'positive', summary: 'Diario Local informa que la intención de voto por Juan Pérez ha subido 5 puntos.', link: '#' },
    { id: 'media-2', title: 'Debate de candidatos provinciales sin un claro ganador', publicationDate: getDummyDate(8), sentiment: 'neutral', summary: 'Analistas consideran que el desempeño de los candidatos fue parejo y no alterará el panorama.', link: '#' },
    { id: 'media-3', title: 'Denuncian irregularidades en financiamiento de Fuerza Andina', publicationDate: getDummyDate(12), sentiment: 'negative', summary: 'Un reportaje televisivo cuestiona el origen de los fondos de la campaña del partido.', link: '#' },
];

export const initialTrollTargets: TrollTarget[] = [
    {
        id: 'target-1',
        name: 'Apoyo a Juan Pérez (Fuerza Andina)',
        trolls: [
            { id: 'troll-1', name: 'El Defensor Andino', platform: 'facebook', description: 'Comparte noticias positivas y ataca a la oposición.', link: '#' },
            { id: 'troll-2', name: 'Verdades Ancash', platform: 'tiktok', description: 'Videos cortos resaltando logros (a veces falsos).', link: '#' },
        ]
    },
    {
        id: 'target-2',
        name: 'Apoyo a Ana Torres (Renovación Popular)',
        trolls: [
            { id: 'troll-3', name: 'Renovación al Poder', platform: 'facebook', description: 'Grupo que organiza ataques coordinados en comentarios.', link: '#' },
        ]
    }
];

export const initialPresidentialCandidates: PresidentialCandidate[] = [
    {
        id: 'pres-1',
        rank: 1,
        candidateName: 'Julio Guzmán',
        candidateDescription: 'Candidato de Lima',
        partyName: 'Partido Morado',
        partySymbolUrl: 'https://picsum.photos/seed/morado/100/100',
        senator: {
            id: 'sen-1',
            name: 'Susel Paredes',
            photoUrl: 'https://picsum.photos/seed/susel/200/200',
            facebookUrl: '#',
            tiktokUrl: '#'
        },
        deputies: [
            {
                id: 'dep-1',
                name: 'Flor Pablo',
                photoUrl: 'https://picsum.photos/seed/flor/200/200',
                facebookUrl: '#',
                tiktokUrl: '#'
            }
        ]
    },
    {
        id: 'pres-2',
        rank: 2,
        candidateName: 'Keiko Fujimori',
        candidateDescription: 'Candidata de Lima',
        partyName: 'Fuerza Popular',
        partySymbolUrl: 'https://picsum.photos/seed/fuerza/100/100',
        senator: null,
        deputies: []
    }
];