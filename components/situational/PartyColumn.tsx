import React, { useMemo } from 'react';
import type { Party, Candidate, Province, District } from '../../types';
import { EditIcon, DeleteIcon, AddIcon, ChevronDownIcon } from '../icons';
import CandidateCard from './CandidateCard';
import CollapsibleSection from './CollapsibleSection';

interface PartyColumnProps {
    party: Party;
    onEditParty: (party: Party) => void;
    onDeleteParty: (partyId: string) => void;
    onEditCandidate: (candidate: Candidate) => void;
    onDeleteCandidate: (candidateId: string, partyId: string) => void;
    onAddCandidate: (candidate: Candidate | null, partyId: string, role: Candidate['role'], locationId?: string) => void;
    onEditDistrict: (provinceId: string, district: District) => void;
    onAddDistrict: (provinceId: string) => void;
    onAddProvince: () => void;
}

const PartyColumn: React.FC<PartyColumnProps> = ({ party, onEditParty, onDeleteParty, onEditCandidate, onDeleteCandidate, onAddCandidate, onEditDistrict, onAddDistrict, onAddProvince }) => {
    
    const candidateCounts = useMemo(() => {
        let provincial = 0;
        let district = 0;
        party.provinces.forEach(prov => {
            provincial += prov.mayors.length;
            prov.districts.forEach(dist => {
                district += dist.mayors.length;
            });
        });
        return { provincial, district };
    }, [party]);

    const sortedProvinces = useMemo(() => {
        return [...party.provinces].sort((a, b) => b.voters - a.voters);
    }, [party.provinces]);

    return (
        <div className="w-80 md:w-96 flex-shrink-0 bg-surface rounded-xl flex flex-col h-full overflow-hidden shadow-md border border-gray-200">
            <CollapsibleSection
                defaultOpen
                header={
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <img src={party.logoUrl} alt={`${party.name} logo`} className="w-12 h-12 rounded-full object-cover bg-white ring-1 ring-gray-200" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{party.name}</h3>
                                <p className="text-xs text-gray-500 italic">{party.description}</p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-2">
                            <button onClick={(e) => { e.stopPropagation(); onEditParty(party); }} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteParty(party.id); }} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                }
            >
                <div className="text-sm text-gray-700 grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-subtle p-2 rounded-md text-center">
                        <span className="font-bold">{candidateCounts.provincial}</span> Candidatos Provinciales
                    </div>
                    <div className="bg-subtle p-2 rounded-md text-center">
                        <span className="font-bold">{candidateCounts.district}</span> Candidatos Distritales
                    </div>
                </div>
            </CollapsibleSection>

            <div className="flex-grow p-4 pt-0 overflow-y-auto space-y-4">
                {/* Governor */}
                 <CollapsibleSection 
                    header={<h4 className="text-md font-semibold text-secondary">Gobernador</h4>}
                    defaultOpen
                    actionButton={!party.governor ? <button onClick={() => onAddCandidate(null, party.id, 'Gobernador')} className="text-xs bg-primary/80 text-white px-2 py-1 rounded-md hover:bg-primary transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir</button> : null}
                 >
                    {party.governor ? (
                        <CandidateCard 
                            candidate={party.governor} 
                            party={party}
                            onEdit={onEditCandidate} 
                            onDelete={onDeleteCandidate}
                        />
                    ) : (
                        <div className="text-center text-sm text-gray-500 p-4">Sin candidato a gobernador.</div>
                    )}
                 </CollapsibleSection>

                {/* Provincial Mayors */}
                <div className="space-y-2">
                    {sortedProvinces.map(province => (
                         <CollapsibleSection 
                            key={province.id}
                            header={<h4 className="text-md font-semibold text-indigo-600">Provincia: {province.name}</h4>}
                            subHeader={`${province.voters.toLocaleString()} electores`}
                            actionButton={province.mayors.length === 0 ? <button onClick={() => onAddCandidate(null, party.id, 'Alcalde Provincial', province.id)} className="text-xs bg-indigo-500/80 text-white px-2 py-1 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir Alcalde</button> : null}
                         >
                            {province.mayors.length > 0 ? province.mayors.map(mayor => (
                                <CandidateCard 
                                    key={mayor.id} 
                                    candidate={mayor} 
                                    party={party}
                                    onEdit={onEditCandidate} 
                                    onDelete={onDeleteCandidate}
                                    className="mb-2"
                                />
                            )) : <div className="text-center text-sm text-gray-500 py-2">Sin candidato provincial.</div>}
                            
                            {/* District Mayors */}
                            {[...province.districts].sort((a,b)=> b.voters - a.voters).map(district => (
                                 <CollapsibleSection 
                                    key={district.id}
                                    header={
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-sm font-semibold text-blue-600">Distrito: {district.name}</h5>
                                            <button onClick={(e) => { e.stopPropagation(); onEditDistrict(province.id, district);}} className="text-gray-400 hover:text-gray-800"><EditIcon className="w-3 h-3"/></button>
                                        </div>
                                    }
                                    subHeader={`${district.voters.toLocaleString()} electores`}
                                    className="ml-4 mt-2"
                                    actionButton={district.mayors.length === 0 ? <button onClick={() => onAddCandidate(null, party.id, 'Alcalde Distrital', district.id)} className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir Alcalde</button> : null}
                                >
                                    {district.mayors.length > 0 ? district.mayors.map(mayor => (
                                        <CandidateCard 
                                            key={mayor.id}
                                            candidate={mayor}
                                            party={party}
                                            onEdit={onEditCandidate}
                                            onDelete={onDeleteCandidate}
                                        />
                                    )) : <div className="text-center text-xs text-gray-500 py-2">Sin candidato distrital.</div>}
                                 </CollapsibleSection>
                            ))}
                             <div className="ml-4 mt-2">
                                <button onClick={() => onAddDistrict(province.id)} className="w-full text-center text-xs bg-blue-100 text-blue-700 px-2 py-1.5 rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                                    <AddIcon className="w-3 h-3"/> Añadir Distrito
                                </button>
                            </div>
                         </CollapsibleSection>
                    ))}
                </div>
            </div>
             <div className="p-4 pt-0">
                <button onClick={onAddProvince} className="w-full text-center text-sm bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2 font-semibold">
                    <AddIcon className="w-4 h-4"/> Añadir Provincia
                </button>
            </div>
        </div>
    );
};

export default PartyColumn;