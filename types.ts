export type Role = 'Gobernador' | 'Alcalde Provincial' | 'Alcalde Distrital';

export interface Candidate {
    id: string;
    partyId: string;
    role: Role;
    name: string;
    photoUrl: string;
    dni: string;
    nickname: string;
    isAffiliated: boolean;
    facebookUrl: string;
    tiktokUrl: string;
    rank: number;
}

export type Governor = Candidate & { role: 'Gobernador' };
export type Mayor = Candidate & { role: 'Alcalde Provincial' | 'Alcalde Distrital' };


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

// Other types
export interface MyActivity {
    id: string;
    description: string;
    date: string;
    link: string;
}

export interface CompetitorActivity {
    id: string;
    partyId: string;
    description: string;
    link: string;
}

// RegionalBody types
export type Gender = 'masculino' | 'femenino';

export interface RegionalOfficial {
    id: string;
    name: string;
    dni: string;
    role: 'Gobernador' | 'Vicegobernadora';
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
    isPrimary: boolean;
    phone: string;
    province: string;
    profession: string;
    number: number;
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

export interface DistrictList {
    id: string;
    districtName: string;
    voters: number;
    mayor: ListMayor | null;
    councilors: Councilor[];
}

export interface ProvincialList {
    id: string;
    provinceName: string;
    voters: number;
    mayor: ListMayor | null;
    councilors: Councilor[];
    districtLists: DistrictList[];
}

export interface RegionalBody {
    governor: RegionalOfficial;
    viceGovernor: RegionalOfficial;
    regionalCouncilors: Councilor[];
    provincialLists: ProvincialList[];
}

// ActivityPlannerTab types
export interface PlannedEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    link: string;
}

// CoordinatorsTab types
export interface Coordinator {
    id: string;
    name: string;
    description: string;
    phone: string;
}

export interface CoordinatorDistrict {
    id: string;
    name: string;
    coordinators: Coordinator[];
}

export interface CoordinatorProvince {
    id: string;
    name: string;
    districts: CoordinatorDistrict[];
}


// BirthdaysTab types
export interface Birthday {
    id: string;
    name: string;
    nickname: string;
    birthdate: string; // YYYY-MM-DD
}

// MediaTrackingTab types
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface MediaPost {
    id: string;
    title: string;
    publicationDate: string; // YYYY-MM-DD
    sentiment: Sentiment;
    summary: string;
    link: string;
}

// TrollsTab types
export interface TrollAccount {
    id: string;
    name: string;
    platform: 'facebook' | 'tiktok';
    description: string;
    link: string;
}

export interface TrollTarget {
    id: string;
    name: string;
    trolls: TrollAccount[];
}

// Congresales2026 types
export interface CongressionalMember {
    id: string;
    name: string;
    photoUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
}

export interface PresidentialCandidate {
    id: string;
    rank: number;
    candidateName: string;
    candidateDescription: string;
    partyName: string;
    partySymbolUrl: string;
    senator: CongressionalMember | null;
    deputies: CongressionalMember[];
}

// PropagandaTab types
export interface PropagandaItem {
    id: string;
    description: string;
    phone: string;
    externalLink: string;
}

export interface PropagandaDistrict {
    id: string;
    name: string;
    items: PropagandaItem[];
}

export interface PropagandaProvince {
    id: string;
    name: string;
    districts: PropagandaDistrict[];
}

export interface Design {
    id: string;
    title: string;
    previewImageUrl: string;
    dimensions: string;
    type: string;
    featuredPeople: string;
    downloadLink: string;
}