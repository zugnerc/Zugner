import React, { useState, useEffect } from 'react';
import type { Candidate, Governor, Mayor } from '../../types';

interface CandidateFormProps {
    candidate?: Candidate;
    partyId?: string;
    role?: Candidate['role'];
    locationId?: string;
    onSave: (candidate: Candidate, locationId?: string) => void;
    onClose: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ candidate, partyId, role, locationId, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        photoUrl: '',
        dni: '',
        nickname: '',
        isAffiliated: false,
        facebookUrl: '',
        tiktokUrl: '',
        rank: 100
    });

    useEffect(() => {
        if (candidate) {
            setFormData({
                name: candidate.name,
                photoUrl: candidate.photoUrl,
                dni: candidate.dni,
                nickname: candidate.nickname,
                isAffiliated: candidate.isAffiliated,
                facebookUrl: candidate.facebookUrl,
                tiktokUrl: candidate.tiktokUrl,
                rank: 'rank' in candidate ? candidate.rank : 100,
            });
        } else {
            // FIX: Reset form state when adding a new candidate
            setFormData({
                name: '',
                photoUrl: '',
                dni: '',
                nickname: '',
                isAffiliated: false,
                facebookUrl: '',
                tiktokUrl: '',
                rank: 100
            });
        }
    }, [candidate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalRole = candidate?.role || role;
        if (!finalRole) return;
        
        const isNew = !candidate;

        const candidateData: Candidate = {
            id: candidate?.id || crypto.randomUUID(),
            partyId: candidate?.partyId || partyId!,
            role: finalRole,
            name: formData.name,
            photoUrl: formData.photoUrl,
            dni: formData.dni,
            nickname: formData.nickname,
            isAffiliated: formData.isAffiliated,
            facebookUrl: formData.facebookUrl,
            tiktokUrl: formData.tiktokUrl,
            rank: Number(formData.rank)
        };

        onSave(candidateData, isNew ? locationId : undefined);
    };
    
    const finalRole = candidate?.role || role;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">URL de Foto de Perfil</label>
                    <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Apelativo</label>
                    <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
                {finalRole && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Ranking</label>
                        <input type="number" name="rank" value={formData.rank} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                    </div>
                )}
                 <div className="flex items-center col-span-1 md:col-span-2">
                    <input id="isAffiliated" name="isAffiliated" type="checkbox" checked={formData.isAffiliated} onChange={handleChange} className="h-4 w-4 text-primary bg-subtle border-gray-300 rounded focus:ring-primary" />
                    <label htmlFor="isAffiliated" className="ml-2 block text-sm text-gray-700">Es Afiliado</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">URL de Facebook</label>
                    <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">URL de TikTok</label>
                    <input type="text" name="tiktokUrl" value={formData.tiktokUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

export default CandidateForm;