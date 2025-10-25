import React, { useState } from 'react';
import type { Party, Candidate, MyActivity, CompetitorActivity, District, Province } from '../../types';
import PartyColumn from '../situational/PartyColumn';
import ActivityFeed from '../situational/ActivityFeed';
import Modal from '../common/Modal';
import PartyForm from '../situational/PartyForm';
import CandidateForm from '../situational/CandidateForm';
import { AddIcon } from '../icons';

interface SituationalStatusTabProps {
    parties: Party[];
    myActivities: MyActivity[];
    competitorActivities: CompetitorActivity[];
    onSaveParty: (partyData: Party | (Omit<Party, 'id' | 'governor' | 'provinces'> & { type: 'newParty' })) => void;
    onDeleteParty: (partyId: string) => void;
    onSaveCandidate: (candidate: Candidate, isNew: boolean, locationId?: string) => void;
    onDeleteCandidate: (candidateId: string, partyId: string) => void;
    onSaveDistrict: (partyId: string, provinceId: string, district: District) => void;
    onSaveProvince: (partyId: string, province: Province) => void;
    onSaveMyActivity: (activity: MyActivity) => void;
    onDeleteMyActivity: (id: string) => void;
    onSaveCompetitorActivity: (activity: CompetitorActivity) => void;
    onDeleteCompetitorActivity: (id: string) => void;
}

const SituationalStatusTab: React.FC<SituationalStatusTabProps> = ({
    parties,
    myActivities,
    competitorActivities,
    onSaveParty,
    onDeleteParty,
    onSaveCandidate,
    onDeleteCandidate,
    onSaveDistrict,
    onSaveProvince,
    onSaveMyActivity,
    onDeleteMyActivity,
    onSaveCompetitorActivity,
    onDeleteCompetitorActivity
}) => {
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);

    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [candidateModalData, setCandidateModalData] = useState<{ partyId?: string; role?: Candidate['role']; locationId?: string }>({});
    
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<MyActivity | CompetitorActivity | null>(null);
    const [activityType, setActivityType] = useState<'my' | 'competitor' | null>(null);

    const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
    const [districtModalInfo, setDistrictModalInfo] = useState<{ partyId: string; provinceId: string; district?: District } | null>(null);
    
    const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
    const [provinceModalInfo, setProvinceModalInfo] = useState<{ partyId: string; province?: Province } | null>(null);

    // Party Modal Handlers
    const openPartyModal = (party: Party | null = null) => {
        setEditingParty(party);
        setIsPartyModalOpen(true);
    };
    const closePartyModal = () => setIsPartyModalOpen(false);
    const handleSaveParty = (partyData: Party | (Omit<Party, 'id' | 'governor' | 'provinces'> & { type: 'newParty' })) => {
        onSaveParty(partyData);
        closePartyModal();
    };

    // Candidate Modal Handlers
    const openCandidateModal = (candidate: Candidate | null = null, partyId?: string, role?: Candidate['role'], locationId?: string) => {
        setEditingCandidate(candidate);
        setCandidateModalData({ partyId, role, locationId });
        setIsCandidateModalOpen(true);
    };
    const closeCandidateModal = () => setIsCandidateModalOpen(false);
    const handleSaveCandidate = (candidate: Candidate, locationId?: string) => {
        onSaveCandidate(candidate, !editingCandidate, locationId);
        closeCandidateModal();
    };

    // Activity Modal Handlers
    const openActivityModal = (activity: MyActivity | CompetitorActivity | null, type: 'my' | 'competitor') => {
        setEditingActivity(activity);
        setActivityType(type);
        setIsActivityModalOpen(true);
    }
    const closeActivityModal = () => setIsActivityModalOpen(false);
    const handleSaveActivity = (activityData: MyActivity | CompetitorActivity) => {
        if (activityType === 'my') onSaveMyActivity(activityData as MyActivity);
        else onSaveCompetitorActivity(activityData as CompetitorActivity);
        closeActivityModal();
    }

    // District Modal Handlers
    const openDistrictModal = (partyId: string, provinceId: string, district?: District) => {
        setDistrictModalInfo({ partyId, provinceId, district });
        setIsDistrictModalOpen(true);
    };
    const closeDistrictModal = () => setIsDistrictModalOpen(false);
    const handleSaveDistrict = (district: District) => {
        if (districtModalInfo) {
            onSaveDistrict(districtModalInfo.partyId, districtModalInfo.provinceId, district);
        }
        closeDistrictModal();
    };

    // Province Modal Handlers
    const openProvinceModal = (partyId: string, province?: Province) => {
        setProvinceModalInfo({ partyId, province });
        setIsProvinceModalOpen(true);
    };
    const closeProvinceModal = () => setIsProvinceModalOpen(false);
    const handleSaveProvince = (province: Province) => {
        if (provinceModalInfo) {
            onSaveProvince(provinceModalInfo.partyId, province);
        }
        closeProvinceModal();
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start">
            <div className="flex-grow w-full">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Estado Situacional de Candidatos</h2>
                     <button onClick={() => openPartyModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                        <AddIcon className="w-5 h-5"/>
                        Añadir Partido
                    </button>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {parties.map(party => (
                        <PartyColumn 
                            key={party.id}
                            party={party}
                            onEditParty={openPartyModal}
                            onDeleteParty={onDeleteParty}
                            onEditCandidate={(c) => openCandidateModal(c)}
                            onDeleteCandidate={onDeleteCandidate}
                            onAddCandidate={openCandidateModal}
                            onEditDistrict={(provId, dist) => openDistrictModal(party.id, provId, dist)}
                            onAddDistrict={(provId) => openDistrictModal(party.id, provId)}
                            onAddProvince={() => openProvinceModal(party.id)}
                        />
                    ))}
                </div>
            </div>

            <ActivityFeed 
                myActivities={myActivities}
                competitorActivities={competitorActivities}
                parties={parties}
                onAddActivity={openActivityModal}
                onEditActivity={openActivityModal}
                onDeleteMyActivity={onDeleteMyActivity}
                onDeleteCompetitorActivity={onDeleteCompetitorActivity}
            />

            {isPartyModalOpen && (
                <Modal isOpen={isPartyModalOpen} onClose={closePartyModal} title={editingParty ? 'Editar Partido' : 'Añadir Partido'}>
                    <PartyForm party={editingParty || undefined} onSave={handleSaveParty} onClose={closePartyModal} />
                </Modal>
            )}

            {isCandidateModalOpen && (
                 <Modal isOpen={isCandidateModalOpen} onClose={closeCandidateModal} title={editingCandidate ? 'Editar Candidato' : 'Añadir Candidato'}>
                    <CandidateForm 
                        candidate={editingCandidate || undefined}
                        partyId={candidateModalData.partyId}
                        role={candidateModalData.role}
                        locationId={candidateModalData.locationId}
                        onSave={handleSaveCandidate} 
                        onClose={closeCandidateModal} 
                    />
                </Modal>
            )}

            {isActivityModalOpen && (
                <Modal isOpen={isActivityModalOpen} onClose={closeActivityModal} title={editingActivity ? 'Editar Actividad' : 'Añadir Actividad'}>
                   <ActivityForm 
                    activity={editingActivity}
                    activityType={activityType}
                    parties={parties}
                    onSave={handleSaveActivity}
                    onClose={closeActivityModal}
                   />
                </Modal>
            )}
             {isDistrictModalOpen && districtModalInfo && (
                <Modal isOpen={isDistrictModalOpen} onClose={closeDistrictModal} title={districtModalInfo.district ? "Editar Distrito" : "Añadir Distrito"}>
                    <DistrictForm
                        district={districtModalInfo.district}
                        onSave={handleSaveDistrict}
                        onClose={closeDistrictModal}
                    />
                </Modal>
            )}
            {isProvinceModalOpen && provinceModalInfo && (
                <Modal isOpen={isProvinceModalOpen} onClose={closeProvinceModal} title={provinceModalInfo.province ? "Editar Provincia" : "Añadir Provincia"}>
                    <ProvinceForm
                        province={provinceModalInfo.province}
                        onSave={handleSaveProvince}
                        onClose={closeProvinceModal}
                    />
                </Modal>
            )}
        </div>
    );
};

// Activity Form Component
interface ActivityFormProps {
    activity: MyActivity | CompetitorActivity | null;
    activityType: 'my' | 'competitor' | null;
    parties: Party[];
    onSave: (activity: MyActivity | CompetitorActivity) => void;
    onClose: () => void;
}
const ActivityForm: React.FC<ActivityFormProps> = ({ activity, activityType, parties, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        description: activity?.description || '',
        link: activity?.link || '',
        date: activity && 'date' in activity ? activity.date : '',
        partyId: activity && 'partyId' in activity ? activity.partyId : (parties[0]?.id || '')
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = activity?.id || crypto.randomUUID();
        if(activityType === 'my') onSave({ id, description: formData.description, link: formData.link, date: formData.date });
        else onSave({ id, description: formData.description, link: formData.link, partyId: formData.partyId });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
             {activityType === 'my' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha (e.g., 15 JULIO 2024)</label>
                    <input type="text" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
             )}
             {activityType === 'competitor' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Partido Político</label>
                     <select name="partyId" value={formData.partyId} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required>
                        {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
             )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Enlace (URL)</label>
                <input type="text" name="link" value={formData.link} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

// District Form Component
interface DistrictFormProps {
    district?: District;
    onSave: (district: District) => void;
    onClose: () => void;
}
const DistrictForm: React.FC<DistrictFormProps> = ({ district, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: district?.name || '',
        voters: district?.voters || 0,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const saveData: District = {
            id: district?.id || crypto.randomUUID(),
            mayors: district?.mayors || [],
            ...formData,
        };
        onSave(saveData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Distrito</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Número de Electores</label>
                <input type="number" name="voters" value={formData.voters} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

// Province Form Component
interface ProvinceFormProps {
    province?: Province;
    onSave: (province: Province) => void;
    onClose: () => void;
}
const ProvinceForm: React.FC<ProvinceFormProps> = ({ province, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: province?.name || '',
        voters: province?.voters || 0,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const saveData: Province = {
            id: province?.id || crypto.randomUUID(),
            mayors: province?.mayors || [],
            districts: province?.districts || [],
            ...formData,
        };
        onSave(saveData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Provincia</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Número de Electores</label>
                <input type="number" name="voters" value={formData.voters} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

export default SituationalStatusTab;