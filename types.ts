export type Role = 'Gobernador' | 'Alcalde Provincial' | 'Alcalde Distrital';
export type Gender = 'masculino' | 'femenino' | 'no especificado';

export interface BaseCandidate {
    id: string;
    name: string;
    photoUrl: string;
    dni: string;
    nickname: string;
    isAffiliated: boolean;
    facebookUrl: string;
    tiktokUrl: string;
    partyId: string;
}

export interface Governor extends BaseCandidate {
    role: 'Gobernador';
    rank: number;
}

export interface Mayor extends BaseCandidate {
    role: 'Alcalde Provincial' | 'Alcalde Distrital';
    rank: number;
}

export type Candidate = Governor | Mayor;

export interface District {
    id: string;
    name: string;
    voters: number;
    mayors: Mayor[];
}

export interface Province {
    id: string;
    name: string;
    voters: number;
    mayors: Mayor[];
    districts: District[];
}

export interface Party {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    governor: Governor | null;
    provinces: Province[];
}

// Activity Feed Types
export interface Activity {
    id: string;
    description: string;
    link: string;
}

export interface MyActivity extends Activity {
    date: string;
}

export interface CompetitorActivity extends Activity {
    partyId: string;
}


// Regional Body Types
export interface RegionalOfficial {
    id: string;
    name: string;
    dni: string;
    role: string;
}

export interface Councilor {
    id: string;
    name: string;
    dni: string;
    facebookUrl: string;
    tiktokUrl: string;
    gender: Gender;
    isCommunityQuota: boolean;
    isAffiliated: boolean;
    isPrimary: boolean; // titular o accesitario
    phone: string;
}

export interface ListMayor {
    id: string;
    name: string;
    nickname: string;
    dni: string;
    facebookUrl: string;
    tiktokUrl: string;
    isAffiliated: boolean;
    gender: Gender;
    phone: string;
}

export interface ProvincialList {
    id: string;
    provinceName: string;
    voters: number;
    mayor: ListMayor;
    councilors: Councilor[]; // regidores provinciales
    districtLists: DistrictList[];
}

export interface DistrictList {
    id: string;
    districtName: string;
    voters: number;
    mayor: ListMayor;
    councilors: Councilor[]; // regidores distritales
}


// Planner Types
export interface PlannedEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    link: string;
}

// Coordinator Types
export interface Coordinator {
    id: string;
    name: string;
    nickname: string;
    phone: string;
    province: string;
    district: string;
}