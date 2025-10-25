import React, { useState } from 'react';
import SituationalStatusTab from './components/tabs/SituationalStatusTab';
import RegionalBodyTab from './components/tabs/RegionalBodyTab';
import ActivityPlannerTab from './components/tabs/ActivityPlannerTab';
import CoordinatorsTab from './components/tabs/CoordinatorsTab';
import type { Party, Candidate, MyActivity, CompetitorActivity, Province, District } from './types';
import { initialParties, initialMyActivities, initialCompetitorActivities } from './constants';


type Tab = 'situational' | 'regional' | 'planner' | 'coordinators';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('situational');
    
    // Lifted state to App component for persistence across tabs
    const [parties, setParties] = useState<Party[]>(initialParties);
    const [myActivities, setMyActivities] = useState<MyActivity[]>(initialMyActivities);
    const [competitorActivities, setCompetitorActivities] = useState<CompetitorActivity[]>(initialCompetitorActivities);

    // Party Handlers
    const handleSaveParty = (partyData: Party | (Omit<Party, 'id' | 'governor' | 'provinces'> & { type: 'newParty' })) => {
        if ('type' in partyData && partyData.type === 'newParty') {
            const newParty: Party = {
                id: crypto.randomUUID(),
                name: partyData.name,
                description: partyData.description,
                logoUrl: partyData.logoUrl,
                governor: null,
                provinces: [],
            };
            setParties([...parties, newParty]);
        } else {
            setParties(parties.map(p => p.id === (partyData as Party).id ? (partyData as Party) : p));
        }
    };

    const handleDeleteParty = (partyId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este partido?')) {
            setParties(parties.filter(p => p.id !== partyId));
        }
    };
    
    // Candidate Handlers
    const handleSaveCandidate = (candidate: Candidate, isNew: boolean, locationId?: string) => {
        setParties(currentParties => {
            const newParties = JSON.parse(JSON.stringify(currentParties));
            const party = newParties.find((p: Party) => p.id === candidate.partyId);
            if (!party) return currentParties;

            if (isNew) {
                if (candidate.role === 'Gobernador') {
                    party.governor = candidate;
                } else if (candidate.role === 'Alcalde Provincial' && locationId) {
                    const province = party.provinces.find((p: Province) => p.id === locationId);
                    if (province) {
                        province.mayors.push(candidate);
                    }
                } else if (candidate.role === 'Alcalde Distrital' && locationId) {
                    for (const province of party.provinces) {
                        const district = province.districts.find((d: District) => d.id === locationId);
                        if (district) {
                            district.mayors.push(candidate);
                            break; // Found and added, exit loop
                        }
                    }
                }
            } else { // It's an update
                if (candidate.role === 'Gobernador') {
                    party.governor = candidate;
                } else {
                    party.provinces.forEach((prov: Province) => {
                        let mayorIndex = prov.mayors.findIndex(m => m.id === candidate.id);
                        if (mayorIndex > -1) {
                            prov.mayors[mayorIndex] = candidate;
                            return;
                        }
                        prov.districts.forEach((dist: District) => {
                            let mayorIndex = dist.mayors.findIndex(m => m.id === candidate.id);
                            if (mayorIndex > -1) {
                                dist.mayors[mayorIndex] = candidate;
                            }
                        });
                    });
                }
            }
    
            return newParties;
        });
    };
    
    
    const handleDeleteCandidate = (candidateId: string, partyId: string) => {
         if (window.confirm('¿Estás seguro de que quieres eliminar este candidato?')) {
             setParties(parties.map(p => {
                 if (p.id !== partyId) return p;
                 const newParty = JSON.parse(JSON.stringify(p));
                 if (newParty.governor?.id === candidateId) newParty.governor = null;
                 newParty.provinces.forEach((prov: Party['provinces'][0]) => {
                     prov.mayors = prov.mayors.filter(m => m.id !== candidateId);
                     prov.districts.forEach((dist: Party['provinces'][0]['districts'][0]) => {
                         dist.mayors = dist.mayors.filter(m => m.id !== candidateId);
                     });
                 });
                 return newParty;
             }));
         }
    };

    // Location Handlers
    const handleSaveDistrict = (partyId: string, provinceId: string, district: District) => {
        setParties(currentParties => {
            const newParties = JSON.parse(JSON.stringify(currentParties));
            const party = newParties.find((p: Party) => p.id === partyId);
            if (!party) return currentParties;

            const province = party.provinces.find((p: Province) => p.id === provinceId);
            if (province) {
                const districtIndex = province.districts.findIndex((d: District) => d.id === district.id);
                if (districtIndex > -1) {
                    province.districts[districtIndex] = district; // Update
                } else {
                    province.districts.push(district); // Add
                }
            }
            return newParties;
        });
    };

    const handleSaveProvince = (partyId: string, province: Province) => {
        setParties(currentParties => {
            const newParties = JSON.parse(JSON.stringify(currentParties));
            const party = newParties.find((p: Party) => p.id === partyId);
            if (!party) return currentParties;

            const provinceIndex = party.provinces.findIndex((p: Province) => p.id === province.id);
            if (provinceIndex > -1) {
                party.provinces[provinceIndex] = province; // Update
            } else {
                party.provinces.push(province); // Add
            }
            return newParties;
        });
    };


    // Activity Handlers
    const handleSaveMyActivity = (activity: MyActivity) => {
        const exists = myActivities.some(a => a.id === activity.id);
        if(exists) {
            setMyActivities(myActivities.map(a => a.id === activity.id ? activity : a));
        } else {
            setMyActivities([...myActivities, activity]);
        }
    };
    const handleDeleteMyActivity = (id: string) => {
        setMyActivities(myActivities.filter(a => a.id !== id));
    };
    const handleSaveCompetitorActivity = (activity: CompetitorActivity) => {
        const exists = competitorActivities.some(a => a.id === activity.id);
        if(exists) {
            setCompetitorActivities(competitorActivities.map(a => a.id === activity.id ? activity : a));
        } else {
            setCompetitorActivities([...competitorActivities, activity]);
        }
    };
     const handleDeleteCompetitorActivity = (id: string) => {
        setCompetitorActivities(competitorActivities.filter(a => a.id !== id));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'situational':
                return <SituationalStatusTab 
                            parties={parties}
                            myActivities={myActivities}
                            competitorActivities={competitorActivities}
                            onSaveParty={handleSaveParty}
                            onDeleteParty={handleDeleteParty}
                            onSaveCandidate={handleSaveCandidate}
                            onDeleteCandidate={handleDeleteCandidate}
                            onSaveDistrict={handleSaveDistrict}
                            onSaveProvince={handleSaveProvince}
                            onSaveMyActivity={handleSaveMyActivity}
                            onDeleteMyActivity={handleDeleteMyActivity}
                            onSaveCompetitorActivity={handleSaveCompetitorActivity}
                            onDeleteCompetitorActivity={handleDeleteCompetitorActivity}
                        />;
            case 'regional':
                return <RegionalBodyTab />;
            case 'planner':
                return <ActivityPlannerTab />;
            case 'coordinators':
                return <CoordinatorsTab />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none ${
                activeTab === tab 
                ? 'bg-surface text-primary border-b-2 border-primary' 
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-background min-h-screen text-gray-800 font-sans">
            <header className="bg-surface shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <h1 className="text-2xl font-bold text-primary">BRAVO22</h1>
                    </div>
                    <nav className="flex -mb-px">
                        <TabButton tab="situational" label="Estado Situacional" />
                        <TabButton tab="regional" label="Órgano Regional" />
                        <TabButton tab="planner" label="Planificador" />
                        <TabButton tab="coordinators" label="Coordinadores" />
                    </nav>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-6">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default App;