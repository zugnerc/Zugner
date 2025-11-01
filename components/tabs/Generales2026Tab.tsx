import React, { useState, useMemo } from 'react';
import type { PresidentialCandidate, CongressionalMember } from '../../types';
import { AddIcon, DeleteIcon, EditIcon, FacebookIcon, TiktokIcon } from '../icons';
import Modal from '../common/Modal';

// Main Tab Component
// ===================================
interface Generales2026TabProps {
    presidentialCandidates: PresidentialCandidate[];
    onSavePresidentialCandidate: (candidate: PresidentialCandidate) => void;
    onDeletePresidentialCandidate: (id: string) => void;
    onSaveCongressionalMember: (presidentialCandidateId: string, member: CongressionalMember, type: 'senator' | 'deputy') => void;
    onDeleteCongressionalMember: (presidentialCandidateId: string, memberId: string, type: 'senator' | 'deputy') => void;
}

const Generales2026Tab: React.FC<Generales2026TabProps> = ({
    presidentialCandidates,
    onSavePresidentialCandidate,
    onDeletePresidentialCandidate,
    onSaveCongressionalMember,
    onDeleteCongressionalMember,
}) => {
    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<PresidentialCandidate | null>(null);

    const [editingMember, setEditingMember] = useState<{ member: CongressionalMember | null; presidentialCandidateId: string; type: 'senator' | 'deputy' } | null>(null);
    
    // Sort candidates by rank
    const sortedCandidates = useMemo(() => {
        return [...presidentialCandidates].sort((a, b) => a.rank - b.rank);
    }, [presidentialCandidates]);

    // Candidate Modal Handlers
    const openCandidateModal = (candidate: PresidentialCandidate | null = null) => {
        setEditingCandidate(candidate);
        setIsCandidateModalOpen(true);
    };
    const closeCandidateModal = () => setIsCandidateModalOpen(false);
    const handleSaveCandidate = (data: Omit<PresidentialCandidate, 'id' | 'senator' | 'deputies'>) => {
        const candidateData: PresidentialCandidate = {
            id: editingCandidate?.id || crypto.randomUUID(),
            senator: editingCandidate?.senator || null,
            deputies: editingCandidate?.deputies || [],
            ...data
        };
        onSavePresidentialCandidate(candidateData);
        closeCandidateModal();
    };

    // Member Modal Handlers
    const openMemberModal = (member: CongressionalMember | null, presidentialCandidateId: string, type: 'senator' | 'deputy') => {
        setEditingMember({ member, presidentialCandidateId, type });
    };
    const closeMemberModal = () => setEditingMember(null);
    const handleSaveMember = (data: Omit<CongressionalMember, 'id'>) => {
        if (!editingMember) return;
        const memberData: CongressionalMember = {
            id: editingMember.member?.id || crypto.randomUUID(),
            ...data
        };
        onSaveCongressionalMember(editingMember.presidentialCandidateId, memberData, editingMember.type);
        closeMemberModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Seguimiento Elecciones Generales 2026</h2>
                <button onClick={() => openCandidateModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Candidato Presidencial
                </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4">
                {sortedCandidates.map(candidate => (
                    <PresidentialCandidateColumn
                        key={candidate.id}
                        candidate={candidate}
                        onEditCandidate={openCandidateModal}
                        onDeleteCandidate={onDeletePresidentialCandidate}
                        onAddMember={openMemberModal}
                        onEditMember={openMemberModal}
                        onDeleteMember={onDeleteCongressionalMember}
                    />
                ))}
            </div>

            {isCandidateModalOpen && (
                <Modal isOpen={isCandidateModalOpen} onClose={closeCandidateModal} title={editingCandidate ? 'Editar Candidato Presidencial' : 'Añadir Candidato Presidencial'}>
                    <PresidentialCandidateForm
                        candidate={editingCandidate}
                        onSave={handleSaveCandidate}
                        onClose={closeCandidateModal}
                    />
                </Modal>
            )}

            {editingMember && (
                <Modal isOpen={!!editingMember} onClose={closeMemberModal} title={editingMember.member ? `Editar ${editingMember.type === 'senator' ? 'Senador' : 'Diputado'}` : `Añadir ${editingMember.type === 'senator' ? 'Senador' : 'Diputado'}` }>
                    <CongressionalMemberForm
                        member={editingMember.member}
                        onSave={handleSaveMember}
                        onClose={closeMemberModal}
                    />
                </Modal>
            )}
        </div>
    );
};


// Column Component
// ===================================
interface ColumnProps {
    candidate: PresidentialCandidate;
    onEditCandidate: (candidate: PresidentialCandidate) => void;
    onDeleteCandidate: (id: string) => void;
    onAddMember: (member: null, candidateId: string, type: 'senator' | 'deputy') => void;
    onEditMember: (member: CongressionalMember, candidateId: string, type: 'senator' | 'deputy') => void;
    onDeleteMember: (candidateId: string, memberId: string, type: 'senator' | 'deputy') => void;
}
const PresidentialCandidateColumn: React.FC<ColumnProps> = ({ candidate, onEditCandidate, onDeleteCandidate, onAddMember, onEditMember, onDeleteMember }) => {
    return (
        <div className="w-80 md:w-96 flex-shrink-0 bg-surface rounded-xl flex flex-col h-full shadow-md border border-gray-200">
            <div className="p-4 border-b border-subtle relative">
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <button onClick={() => onEditCandidate(candidate)} className="p-1 text-gray-400 hover:text-gray-800"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteCandidate(candidate.id)} className="p-1 text-gray-400 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                </div>
                 <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    #{candidate.rank}
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <img src={candidate.partySymbolUrl} alt={`${candidate.partyName} symbol`} className="w-16 h-16 rounded-full object-cover bg-white ring-1 ring-gray-200" />
                    <div>
                        <h4 className="text-sm font-bold text-gray-600">{candidate.partyName}</h4>
                        <h3 className="text-lg font-bold text-gray-900">{candidate.candidateName}</h3>
                        <p className="text-xs text-gray-500 italic">{candidate.candidateDescription}</p>
                    </div>
                </div>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {/* Senator */}
                <div>
                    <h5 className="text-md font-semibold text-secondary mb-2">Senador</h5>
                    {candidate.senator ? (
                         <CongressionalMemberCard 
                            member={candidate.senator} 
                            onEdit={() => onEditMember(candidate.senator!, candidate.id, 'senator')} 
                            onDelete={() => onDeleteMember(candidate.id, candidate.senator!.id, 'senator')}
                         />
                    ) : (
                        <button onClick={() => onAddMember(null, candidate.id, 'senator')} className="w-full text-center text-sm bg-secondary/10 text-secondary px-3 py-2 rounded-md hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2 font-semibold">
                            <AddIcon className="w-4 h-4" /> Añadir Senador
                        </button>
                    )}
                </div>
                {/* Deputies */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-md font-semibold text-indigo-600">Diputados ({candidate.deputies.length}/5)</h5>
                         {candidate.deputies.length < 5 && (
                            <button onClick={() => onAddMember(null, candidate.id, 'deputy')} className="text-xs bg-indigo-500/80 text-white px-2 py-1 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-1">
                                <AddIcon className="w-3 h-3" /> Añadir
                            </button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {candidate.deputies.map(deputy => (
                            <CongressionalMemberCard 
                                key={deputy.id} 
                                member={deputy} 
                                onEdit={() => onEditMember(deputy, candidate.id, 'deputy')} 
                                onDelete={() => onDeleteMember(candidate.id, deputy.id, 'deputy')}
                             />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Card Component
// ===================================
const CongressionalMemberCard: React.FC<{member: CongressionalMember, onEdit: () => void, onDelete: () => void}> = ({ member, onEdit, onDelete }) => (
    <div className="bg-subtle p-3 rounded-lg relative group">
        <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-3">
            <img src={member.photoUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-grow">
                <h4 className="font-semibold text-gray-900 leading-tight">{member.name}</h4>
                 <div className="flex items-center space-x-3 mt-1">
                    <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        <FacebookIcon className="w-5 h-5" />
                    </a>
                    <a href={member.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">
                        <TiktokIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    </div>
);


// Form Components
// ===================================
const PresidentialCandidateForm: React.FC<{candidate: PresidentialCandidate | null, onSave: (data: Omit<PresidentialCandidate, 'id'|'senator'|'deputies'>) => void, onClose: () => void}> = ({ candidate, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        rank: candidate?.rank || 1,
        candidateName: candidate?.candidateName || '',
        candidateDescription: candidate?.candidateDescription || '',
        partyName: candidate?.partyName || '',
        partySymbolUrl: candidate?.partySymbolUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({...prev, [name]: type === 'number' ? parseInt(value) || 1 : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Candidato</label>
                    <input type="text" name="candidateName" value={formData.candidateName} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ranking</label>
                    <input type="number" name="rank" value={formData.rank} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" required min="1" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descripción (e.g. De donde es)</label>
                    <input type="text" name="candidateDescription" value={formData.candidateDescription} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Partido</label>
                    <input type="text" name="partyName" value={formData.partyName} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">URL del Símbolo del Partido</label>
                    <input type="text" name="partySymbolUrl" value={formData.partySymbolUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
                </div>
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md">Guardar</button>
            </div>
        </form>
    );
};

const CongressionalMemberForm: React.FC<{member: CongressionalMember | null, onSave: (data: Omit<CongressionalMember, 'id'>) => void, onClose: () => void}> = ({ member, onSave, onClose }) => {
     const [formData, setFormData] = useState({
        name: member?.name || '',
        photoUrl: member?.photoUrl || '',
        facebookUrl: member?.facebookUrl || '',
        tiktokUrl: member?.tiktokUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">URL de la Foto</label>
                    <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">URL de Facebook</label>
                    <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">URL de TikTok</label>
                    <input type="text" name="tiktokUrl" value={formData.tiktokUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
                </div>
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md">Guardar</button>
            </div>
        </form>
    );
};

export default Generales2026Tab;