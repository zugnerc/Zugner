import React, { useState, useMemo } from 'react';
import type { Coordinator } from '../../types';
import { initialCoordinators } from '../../constants';
import CollapsibleSection from '../situational/CollapsibleSection';
import { AddIcon, DeleteIcon, EditIcon, WhatsAppIcon } from '../icons';
import Modal from '../common/Modal';

const CoordinatorsTab: React.FC = () => {
    const [coordinators, setCoordinators] = useState<Coordinator[]>(initialCoordinators);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoordinator, setEditingCoordinator] = useState<Coordinator | null>(null);

    const openModal = (coordinator: Coordinator | null = null) => {
        setEditingCoordinator(coordinator);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingCoordinator(null);
        setIsModalOpen(false);
    };

    const handleSave = (coordinator: Coordinator) => {
        if (editingCoordinator) {
            setCoordinators(coordinators.map(c => c.id === coordinator.id ? coordinator : c));
        } else {
            setCoordinators([...coordinators, { ...coordinator, id: crypto.randomUUID() }]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        setCoordinators(coordinators.filter(c => c.id !== id));
    };

    // FIX: Correctly type the initial value for the reduce method. This ensures that TypeScript can infer the correct type for `groupedCoordinators`, resolving the error on `coords.map` where `coords` was previously `unknown`.
    const groupedCoordinators = useMemo(() => {
        return coordinators.reduce((acc, coord) => {
            const key = `${coord.province} > ${coord.district}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(coord);
            return acc;
        }, {} as Record<string, Coordinator[]>);
    }, [coordinators]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Base de Datos de Coordinadores</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Coordinador
                </button>
            </div>
            
            <div className="space-y-4">
                {Object.entries(groupedCoordinators).map(([groupName, coords]) => (
                    <CollapsibleSection key={groupName} header={<h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                            {coords.map(coord => (
                                <div key={coord.id} className="bg-surface p-4 rounded-lg shadow-md border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{coord.name}</h4>
                                            <p className="text-sm italic text-gray-600">"{coord.nickname}"</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(coord)} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(coord.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="text-sm space-y-1 mt-2 text-gray-500">
                                        <div className="flex justify-between items-center pt-2">
                                            <p><strong>Celular:</strong> <span className="text-gray-800">{coord.phone}</span></p>
                                            <a href={`https://wa.me/${coord.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
                                                <WhatsAppIcon className="w-6 h-6" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                ))}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCoordinator ? 'Editar Coordinador' : 'Añadir Coordinador'}>
                    <CoordinatorForm coordinator={editingCoordinator} onSave={handleSave} onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};


const CoordinatorForm: React.FC<{coordinator: Coordinator | null; onSave: (coordinator: Coordinator) => void; onClose: () => void;}> = ({ coordinator, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Coordinator, 'id'>>({
        name: coordinator?.name || '',
        nickname: coordinator?.nickname || '',
        phone: coordinator?.phone || '',
        province: coordinator?.province || '',
        district: coordinator?.district || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: coordinator?.id || '', ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombres y Apellidos</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Apelativo</label>
                    <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Celular</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Provincia</label>
                    <input type="text" name="province" value={formData.province} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Distrito</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
}

export default CoordinatorsTab;