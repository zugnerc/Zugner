import React, { useState } from 'react';
import type { Candidate, Party } from '../../types';
import { FacebookIcon, TiktokIcon, EditIcon, DeleteIcon, CopyIcon, CheckCircleIcon, XCircleIcon } from '../icons';

interface CandidateCardProps {
    candidate: Candidate;
    party: Party;
    onEdit: (candidate: Candidate) => void;
    onDelete: (candidateId: string, partyId: string) => void;
    className?: string;
}

const roleColors = {
    'Gobernador': 'ring-secondary',
    'Alcalde Provincial': 'ring-indigo-400',
    'Alcalde Distrital': 'ring-blue-400',
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, party, onEdit, onDelete, className }) => {
    const [dniCopied, setDniCopied] = useState(false);

    const handleCopyDni = () => {
        navigator.clipboard.writeText(candidate.dni);
        setDniCopied(true);
        setTimeout(() => setDniCopied(false), 2000);
    };

    return (
        <div className={`bg-subtle p-3 rounded-lg relative ${className}`}>
            <div className="absolute top-2 right-2 flex items-center space-x-1">
                <button onClick={() => onEdit(candidate)} className="p-1 text-gray-400 hover:text-gray-800 opacity-50 hover:opacity-100 transition-opacity"><EditIcon className="w-4 h-4" /></button>
                <button onClick={() => onDelete(candidate.id, party.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity"><DeleteIcon className="w-4 h-4" /></button>
            </div>
            
            <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                     <img src={candidate.photoUrl} alt={candidate.name} className={`w-16 h-16 rounded-full object-cover ring-2 ${roleColors[candidate.role]}`} />
                     {'rank' in candidate && (
                        <div className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            #{candidate.rank}
                        </div>
                     )}
                </div>
                <div className="flex-grow">
                    <p className="text-xs text-gray-500">{candidate.role}</p>
                    <h4 className="font-semibold text-gray-900 leading-tight">{candidate.name}</h4>
                    <p className="text-sm text-gray-600 italic">"{candidate.nickname}"</p>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                        DNI: {candidate.dni}
                        <button onClick={handleCopyDni} className="ml-2 text-gray-400 hover:text-gray-900">
                            {dniCopied ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src={party.logoUrl} alt={party.name} className="w-5 h-5 rounded-full object-contain bg-white" />
                    <span className="text-xs font-medium text-gray-700">{party.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <a href={candidate.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        <FacebookIcon className="w-5 h-5" />
                    </a>
                    <a href={candidate.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">
                        <TiktokIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
             <div className="mt-2 text-xs flex items-center gap-1.5 text-gray-500">
                {candidate.isAffiliated ? <CheckCircleIcon className="w-4 h-4 text-green-500"/> : <XCircleIcon className="w-4 h-4 text-red-500"/>}
                <span>{candidate.isAffiliated ? "Afiliado" : "No Afiliado"}</span>
            </div>
        </div>
    );
};

export default CandidateCard;