import React, { useState } from 'react';
import SituationalStatusTab from './components/tabs/SituationalStatusTab';
import RegionalBodyTab from './components/tabs/RegionalBodyTab';
import ActivityPlannerTab from './components/tabs/ActivityPlannerTab';
import CoordinatorsTab from './components/tabs/CoordinatorsTab';
import BirthdaysTab from './components/tabs/BirthdaysTab';
import MediaTrackingTab from './components/tabs/MediaTrackingTab';
import TrollsTab from './components/tabs/TrollsTab';
import Generales2026Tab from './components/tabs/Generales2026Tab';
import PropagandaTab from './components/tabs/PropagandaTab';
// FIX: Import Mayor type
import type { Party, Candidate, MyActivity, CompetitorActivity, Province, District, Birthday, MediaPost, TrollTarget, TrollAccount, RegionalBody, Mayor, PresidentialCandidate, CongressionalMember, CoordinatorProvince, CoordinatorDistrict, Coordinator, PropagandaProvince, PropagandaDistrict, PropagandaItem, Design } from './types';
import { initialParties, initialMyActivities, initialCompetitorActivities, initialBirthdays, initialMediaPosts, initialTrollTargets, initialRegionalBody, initialPresidentialCandidates, initialCoordinatorProvinces, initialPropagandaProvinces, initialDesigns } from './constants';


type Tab = 'situational' | 'regional' | 'planner' | 'coordinators' | 'propaganda' | 'birthdays' | 'media' | 'trolls' | 'generales';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('situational');
    
    // Lifted state to App component for persistence across tabs
    const [parties, setParties] = useState<Party[]>(initialParties);
    const [myActivities, setMyActivities] = useState<MyActivity[]>(initialMyActivities);
    const [competitorActivities, setCompetitorActivities] = useState<CompetitorActivity[]>(initialCompetitorActivities);
    const [birthdays, setBirthdays] = useState<Birthday[]>(initialBirthdays);
    const [mediaPosts, setMediaPosts] = useState<MediaPost[]>(initialMediaPosts);
    const [trollTargets, setTrollTargets] = useState<TrollTarget[]>(initialTrollTargets);
    const [regionalBody, setRegionalBody] = useState<RegionalBody>(initialRegionalBody);
    const [presidentialCandidates, setPresidentialCandidates] = useState<PresidentialCandidate[]>(initialPresidentialCandidates);
    const [coordinatorProvinces, setCoordinatorProvinces] = useState<CoordinatorProvince[]>(initialCoordinatorProvinces);
    const [propagandaProvinces, setPropagandaProvinces] = useState<PropagandaProvince[]>(initialPropagandaProvinces);
    const [designs, setDesigns] = useState<Design[]>(initialDesigns);


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
                        // FIX: Cast candidate to Mayor to satisfy the type of province.mayors.
                        province.mayors.push(candidate as Mayor);
                    }
                } else if (candidate.role === 'Alcalde Distrital' && locationId) {
                    for (const province of party.provinces) {
                        const district = province.districts.find((d: District) => d.id === locationId);
                        if (district) {
                            // FIX: Cast candidate to Mayor to satisfy the type of district.mayors.
                            district.mayors.push(candidate as Mayor);
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
                            prov.mayors[mayorIndex] = candidate as Mayor;
                            return;
                        }
                        prov.districts.forEach((dist: District) => {
                            let mayorIndex = dist.mayors.findIndex(m => m.id === candidate.id);
                            if (mayorIndex > -1) {
                                dist.mayors[mayorIndex] = candidate as Mayor;
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

    // Birthday Handlers
    const handleSaveBirthday = (birthday: Birthday) => {
        const exists = birthdays.some(b => b.id === birthday.id);
        if (exists) {
            setBirthdays(birthdays.map(b => b.id === birthday.id ? birthday : b));
        } else {
            setBirthdays([...birthdays, birthday]);
        }
    };
    const handleDeleteBirthday = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cumpleaños?')) {
            setBirthdays(birthdays.filter(b => b.id !== id));
        }
    };
    
    // Media Post Handlers
    const handleSaveMediaPost = (post: MediaPost) => {
        const exists = mediaPosts.some(p => p.id === post.id);
        if (exists) {
            setMediaPosts(mediaPosts.map(p => p.id === post.id ? post : p));
        } else {
            setMediaPosts([...mediaPosts, post]);
        }
    };
    const handleDeleteMediaPost = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            setMediaPosts(mediaPosts.filter(p => p.id !== id));
        }
    };
    
    // Troll Target Handlers
    const handleSaveTrollTarget = (target: TrollTarget) => {
        const exists = trollTargets.some(t => t.id === target.id);
        if (exists) {
            setTrollTargets(trollTargets.map(t => t.id === target.id ? target : t));
        } else {
            setTrollTargets([...trollTargets, target]);
        }
    };
    const handleDeleteTrollTarget = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este objetivo y todas sus cuentas asociadas?')) {
            setTrollTargets(trollTargets.filter(t => t.id !== id));
        }
    };
    
    // Troll Account Handlers
    const handleSaveTroll = (targetId: string, troll: TrollAccount) => {
        setTrollTargets(trollTargets.map(target => {
            if (target.id !== targetId) return target;
            const trollExists = target.trolls.some(t => t.id === troll.id);
            if (trollExists) {
                return { ...target, trolls: target.trolls.map(t => t.id === troll.id ? troll : t) };
            } else {
                return { ...target, trolls: [...target.trolls, troll] };
            }
        }));
    };
    const handleDeleteTroll = (targetId: string, trollId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta cuenta troll?')) {
            setTrollTargets(trollTargets.map(target => {
                if (target.id !== targetId) return target;
                return { ...target, trolls: target.trolls.filter(t => t.id !== trollId) };
            }));
        }
    };

    // Regional Body Handlers
    const handleSaveRegionalBody = (newRegionalBody: RegionalBody) => {
        setRegionalBody(newRegionalBody);
    };

    // Coordinator Handlers
    const handleSaveCoordinatorProvince = (province: CoordinatorProvince) => {
        setCoordinatorProvinces(prev => {
            const exists = prev.some(p => p.id === province.id);
            if (exists) {
                return prev.map(p => p.id === province.id ? province : p);
            }
            return [...prev, province];
        });
    };
    const handleDeleteCoordinatorProvince = (provinceId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta provincia y todos sus coordinadores?')) {
            setCoordinatorProvinces(prev => prev.filter(p => p.id !== provinceId));
        }
    };

    const handleSaveCoordinatorDistrict = (provinceId: string, district: CoordinatorDistrict) => {
        setCoordinatorProvinces(prev => prev.map(prov => {
            if (prov.id !== provinceId) return prov;
            const exists = prov.districts.some(d => d.id === district.id);
            const newDistricts = exists
                ? prov.districts.map(d => d.id === district.id ? district : d)
                : [...prov.districts, district];
            return { ...prov, districts: newDistricts };
        }));
    };
    const handleDeleteCoordinatorDistrict = (provinceId: string, districtId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este distrito y todos sus coordinadores?')) {
            setCoordinatorProvinces(prev => prev.map(prov => {
                if (prov.id !== provinceId) return prov;
                const newDistricts = prov.districts.filter(d => d.id !== districtId);
                return { ...prov, districts: newDistricts };
            }));
        }
    };
    
    const handleSaveCoordinator = (provinceId: string, districtId: string, coordinator: Coordinator) => {
        setCoordinatorProvinces(prev => prev.map(prov => {
            if (prov.id !== provinceId) return prov;
            const newDistricts = prov.districts.map(dist => {
                if (dist.id !== districtId) return dist;
                const exists = dist.coordinators.some(c => c.id === coordinator.id);
                const newCoordinators = exists
                    ? dist.coordinators.map(c => c.id === coordinator.id ? coordinator : c)
                    : [...dist.coordinators, coordinator];
                return { ...dist, coordinators: newCoordinators };
            });
            return { ...prov, districts: newDistricts };
        }));
    };
    const handleDeleteCoordinator = (provinceId: string, districtId: string, coordinatorId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este coordinador?')) {
            setCoordinatorProvinces(prev => prev.map(prov => {
                if (prov.id !== provinceId) return prov;
                const newDistricts = prov.districts.map(dist => {
                    if (dist.id !== districtId) return dist;
                    const newCoordinators = dist.coordinators.filter(c => c.id !== coordinatorId);
                    return { ...dist, coordinators: newCoordinators };
                });
                return { ...prov, districts: newDistricts };
            }));
        }
    };

    // Generales2026 Handlers
    const handleSavePresidentialCandidate = (candidate: PresidentialCandidate) => {
        const exists = presidentialCandidates.some(c => c.id === candidate.id);
        if (exists) {
            setPresidentialCandidates(presidentialCandidates.map(c => c.id === candidate.id ? candidate : c));
        } else {
            setPresidentialCandidates([...presidentialCandidates, candidate]);
        }
    };

    const handleDeletePresidentialCandidate = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este candidato presidencial y su lista?')) {
            setPresidentialCandidates(presidentialCandidates.filter(c => c.id !== id));
        }
    };

    const handleSaveCongressionalMember = (presidentialCandidateId: string, member: CongressionalMember, type: 'senator' | 'deputy') => {
        setPresidentialCandidates(prev => prev.map(p => {
            if (p.id !== presidentialCandidateId) return p;

            const newP = { ...p };
            if (type === 'senator') {
                newP.senator = member;
            } else {
                const deputyExists = newP.deputies.some(d => d.id === member.id);
                if (deputyExists) {
                    newP.deputies = newP.deputies.map(d => d.id === member.id ? member : d);
                } else {
                    newP.deputies = [...newP.deputies, member];
                }
            }
            return newP;
        }));
    };
    
    const handleDeleteCongressionalMember = (presidentialCandidateId: string, memberId: string, type: 'senator' | 'deputy') => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a esta persona de la lista?')) {
            setPresidentialCandidates(prev => prev.map(p => {
                if (p.id !== presidentialCandidateId) return p;

                const newP = { ...p };
                if (type === 'senator') {
                    newP.senator = null;
                } else {
                    newP.deputies = newP.deputies.filter(d => d.id !== memberId);
                }
                return newP;
            }));
        }
    };

    // Propaganda Handlers
    const handleSavePropagandaProvince = (province: PropagandaProvince) => {
        setPropagandaProvinces(prev => {
            const exists = prev.some(p => p.id === province.id);
            if (exists) {
                return prev.map(p => p.id === province.id ? province : p);
            }
            return [...prev, province];
        });
    };
    const handleDeletePropagandaProvince = (provinceId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta provincia y toda su propaganda asociada?')) {
            setPropagandaProvinces(prev => prev.filter(p => p.id !== provinceId));
        }
    };
    const handleSavePropagandaDistrict = (provinceId: string, district: PropagandaDistrict) => {
         setPropagandaProvinces(prev => prev.map(prov => {
            if (prov.id !== provinceId) return prov;
            const exists = prov.districts.some(d => d.id === district.id);
            const newDistricts = exists
                ? prov.districts.map(d => d.id === district.id ? district : d)
                : [...prov.districts, district];
            return { ...prov, districts: newDistricts };
        }));
    };
    const handleDeletePropagandaDistrict = (provinceId: string, districtId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este distrito y toda su propaganda asociada?')) {
             setPropagandaProvinces(prev => prev.map(prov => {
                if (prov.id !== provinceId) return prov;
                const newDistricts = prov.districts.filter(d => d.id !== districtId);
                return { ...prov, districts: newDistricts };
            }));
        }
    };
    const handleSavePropagandaItem = (provinceId: string, districtId: string, item: PropagandaItem) => {
         setPropagandaProvinces(prev => prev.map(prov => {
            if (prov.id !== provinceId) return prov;
            const newDistricts = prov.districts.map(dist => {
                if (dist.id !== districtId) return dist;
                const exists = dist.items.some(i => i.id === item.id);
                const newItems = exists
                    ? dist.items.map(i => i.id === item.id ? item : i)
                    : [...dist.items, item];
                return { ...dist, items: newItems };
            });
            return { ...prov, districts: newDistricts };
        }));
    };
    const handleDeletePropagandaItem = (provinceId: string, districtId: string, itemId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro de propaganda?')) {
             setPropagandaProvinces(prev => prev.map(prov => {
                if (prov.id !== provinceId) return prov;
                const newDistricts = prov.districts.map(dist => {
                    if (dist.id !== districtId) return dist;
                    const newItems = dist.items.filter(i => i.id !== itemId);
                    return { ...dist, items: newItems };
                });
                return { ...prov, districts: newDistricts };
            }));
        }
    };

    // Design Handlers
    const handleSaveDesign = (design: Design) => {
        setDesigns(prev => {
            const exists = prev.some(d => d.id === design.id);
            if (exists) {
                return prev.map(d => d.id === design.id ? design : d);
            }
            return [...prev, design];
        });
    };
    const handleDeleteDesign = (designId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este diseño?')) {
            setDesigns(prev => prev.filter(d => d.id !== designId));
        }
    };


    const renderTabContent = () => {
        switch (activeTab) {
            case 'situational':
                return <SituationalStatusTab 
                            parties={parties}
                            myActivities={myActivities}
                            competitorActivities={competitorActivities}
                            birthdays={birthdays}
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
                return <RegionalBodyTab regionalBody={regionalBody} onSave={handleSaveRegionalBody} />;
            case 'planner':
                return <ActivityPlannerTab />;
            case 'coordinators':
                return <CoordinatorsTab 
                            provinces={coordinatorProvinces}
                            onSaveProvince={handleSaveCoordinatorProvince}
                            onDeleteProvince={handleDeleteCoordinatorProvince}
                            onSaveDistrict={handleSaveCoordinatorDistrict}
                            onDeleteDistrict={handleDeleteCoordinatorDistrict}
                            onSaveCoordinator={handleSaveCoordinator}
                            onDeleteCoordinator={handleDeleteCoordinator}
                        />;
            case 'propaganda':
                return <PropagandaTab 
                            provinces={propagandaProvinces}
                            designs={designs}
                            onSaveProvince={handleSavePropagandaProvince}
                            onDeleteProvince={handleDeletePropagandaProvince}
                            onSaveDistrict={handleSavePropagandaDistrict}
                            onDeleteDistrict={handleDeletePropagandaDistrict}
                            onSaveItem={handleSavePropagandaItem}
                            onDeleteItem={handleDeletePropagandaItem}
                            onSaveDesign={handleSaveDesign}
                            onDeleteDesign={handleDeleteDesign}
                        />;
            case 'birthdays':
                return <BirthdaysTab 
                            birthdays={birthdays}
                            onSaveBirthday={handleSaveBirthday}
                            onDeleteBirthday={handleDeleteBirthday}
                        />;
            case 'media':
                return <MediaTrackingTab 
                            mediaPosts={mediaPosts}
                            onSaveMediaPost={handleSaveMediaPost}
                            onDeleteMediaPost={handleDeleteMediaPost}
                        />;
            case 'trolls':
                return <TrollsTab
                            trollTargets={trollTargets}
                            onSaveTarget={handleSaveTrollTarget}
                            onDeleteTarget={handleDeleteTrollTarget}
                            onSaveTroll={handleSaveTroll}
                            onDeleteTroll={handleDeleteTroll}
                        />;
            case 'generales':
                return <Generales2026Tab
                            presidentialCandidates={presidentialCandidates}
                            onSavePresidentialCandidate={handleSavePresidentialCandidate}
                            onDeletePresidentialCandidate={handleDeletePresidentialCandidate}
                            onSaveCongressionalMember={handleSaveCongressionalMember}
                            onDeleteCongressionalMember={handleDeleteCongressionalMember}
                        />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none whitespace-nowrap ${
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
                    <nav className="flex -mb-px overflow-x-auto">
                        <TabButton tab="situational" label="Estado Situacional" />
                        <TabButton tab="regional" label="Órgano Regional" />
                        <TabButton tab="planner" label="Planificador" />
                        <TabButton tab="coordinators" label="Coordinadores" />
                        <TabButton tab="propaganda" label="Propaganda" />
                        <TabButton tab="birthdays" label="Cumpleaños" />
                        <TabButton tab="media" label="Media Seguimiento" />
                        <TabButton tab="trolls" label="Cuentas Troll" />
                        <TabButton tab="generales" label="Generales 2026" />
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