import React, { useState, useEffect } from 'react';
import type { Party } from '../../types';

interface PartyFormProps {
    party?: Party;
    onSave: (party: Party | (Omit<Party, 'id' | 'governor' | 'provinces'> & { type: 'newParty' })) => void;
    onClose: () => void;
}

const PartyForm: React.FC<PartyFormProps> = ({ party, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoUrl: ''
    });

    useEffect(() => {
        if (party) {
            setFormData({
                name: party.name,
                description: party.description,
                logoUrl: party.logoUrl
            });
        }
    }, [party]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (party) {
            onSave({ ...party, ...formData });
        } else {
            onSave({ ...formData, type: 'newParty' } as any);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Partido</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción (e.g., nuevo o tradicional)</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-subtle border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">URL del Logo</label>
                <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="mt-1 block w-full bg-subtle border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

export default PartyForm;