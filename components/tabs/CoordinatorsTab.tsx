import React, { useState } from 'react';
import type { Coordinator, CoordinatorDistrict, CoordinatorProvince } from '../../types';
import CollapsibleSection from '../situational/CollapsibleSection';
import { AddIcon, DeleteIcon, EditIcon, WhatsAppIcon, CopyIcon, CheckCircleIcon } from '../icons';
import Modal from '../common/Modal';

// Props for the main tab component
interface CoordinatorsTabProps {
    provinces: CoordinatorProvince[];
    onSaveProvince: (province: CoordinatorProvince) => void;
    onDeleteProvince: (provinceId: string) => void;
    onSaveDistrict: (provinceId: string, district: CoordinatorDistrict) => void;
    onDeleteDistrict: (provinceId: string, districtId: string) => void;
    onSaveCoordinator: (provinceId: string, districtId: string, coordinator: Coordinator) => void;
    onDeleteCoordinator: (provinceId: string, districtId: string, coordinatorId: string) => void;
}

// Coordinator Card component
const CoordinatorCard: React.FC<{
    coordinator: Coordinator;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ coordinator, onEdit, onDelete }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!coordinator.phone) return;
        navigator.clipboard.writeText(coordinator.phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 relative group">
            <div className="absolute top-2 right-2 z-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
            </div>
            
            <div className="pr-8">
                <h5 className="font-semibold text-gray-800">{coordinator.name}</h5>
                <p className="text-sm text-gray-500">{coordinator.description}</p>
            </div>

            <div className="flex justify-between items-center mt-3">
                <div 
                    className="flex items-center text-sm text-gray-700 font-medium cursor-pointer group/copy"
                    onClick={handleCopy}
                    title="Copiar número"
                >
                    <span>{coordinator.phone}</span>
                    <div className="ml-2 text-gray-400 group-hover/copy:text-gray-900">
                        {copied ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                    </div>
                </div>
                
                <a 
                    href={`https://wa.me/${coordinator.phone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-500 hover:text-green-600 flex-shrink-0"
                    title="Abrir en WhatsApp"
                >
                    <WhatsAppIcon className="w-6 h-6" />
                </a>
            </div>
        </div>
    );
};

// Main tab component
const CoordinatorsTab: React.FC<CoordinatorsTabProps> = (props) => {
    const { provinces, onSaveProvince, onDeleteProvince, onSaveDistrict, onDeleteDistrict, onSaveCoordinator, onDeleteCoordinator } = props;

    const [modalState, setModalState] = useState<{ type: 'province' | 'district' | 'coordinator' | null; data: any }>({ type: null, data: {} });

    const openModal = (type: 'province' | 'district' | 'coordinator', data: any = {}) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: null, data: {} });
    };
    
    // Handlers to connect forms to props
    const handleSaveProvince = (name: string) => {
        const province = modalState.data.province;
        const newProvince: CoordinatorProvince = {
            id: province?.id || crypto.randomUUID(),
            name,
            districts: province?.districts || [],
        };
        onSaveProvince(newProvince);
        closeModal();
    };
    
    const handleSaveDistrict = (name: string) => {
        const { provinceId, district } = modalState.data;
        const newDistrict: CoordinatorDistrict = {
            id: district?.id || crypto.randomUUID(),
            name,
            coordinators: district?.coordinators || [],
        };
        onSaveDistrict(provinceId, newDistrict);
        closeModal();
    };

    const handleSaveCoordinator = (data: Omit<Coordinator, 'id'>) => {
        const { provinceId, districtId, coordinator } = modalState.data;
        const newCoordinator: Coordinator = {
            id: coordinator?.id || crypto.randomUUID(),
            ...data
        };
        onSaveCoordinator(provinceId, districtId, newCoordinator);
        closeModal();
    };

    const renderModal = () => {
        if (!modalState.type) return null;

        const { type, data } = modalState;
        let title = '';
        let content: React.ReactNode = null;

        if (type === 'province') {
            title = data.province ? 'Editar Provincia' : 'Añadir Provincia';
            content = <NameForm initialName={data.province?.name} onSave={handleSaveProvince} onClose={closeModal} label="Nombre de la Provincia"/>;
        } else if (type === 'district') {
            title = data.district ? 'Editar Distrito' : 'Añadir Distrito';
            content = <NameForm initialName={data.district?.name} onSave={handleSaveDistrict} onClose={closeModal} label="Nombre del Distrito"/>;
        } else if (type === 'coordinator') {
            title = data.coordinator ? 'Editar Coordinador' : 'Añadir Coordinador';
            content = <CoordinatorForm coordinator={data.coordinator} onSave={handleSaveCoordinator} onClose={closeModal}/>;
        }

        return <Modal isOpen={true} onClose={closeModal} title={title}>{content}</Modal>;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Base de Datos de Coordinadores</h2>
                <button onClick={() => openModal('province')} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Provincia
                </button>
            </div>
            
            <div className="space-y-4">
                {provinces.map((province) => (
                    <CollapsibleSection
                        key={province.id}
                        defaultOpen
                        header={
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold text-gray-800">{province.name}</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); openModal('province', { province }); }} className="p-1 text-gray-400 hover:text-gray-800"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteProvince(province.id); }} className="p-1 text-gray-400 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        }
                    >
                        <div className="pl-4 mt-2 space-y-3">
                            {province.districts.map((district) => (
                                <CollapsibleSection
                                    key={district.id}
                                    className="bg-gray-50 p-3 rounded-lg"
                                    header={
                                         <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-semibold text-indigo-700">{district.name}</h4>
                                             <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); openModal('district', { provinceId: province.id, district }); }} className="p-1 text-gray-400 hover:text-gray-800"><EditIcon className="w-4 h-4" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); onDeleteDistrict(province.id, district.id); }} className="p-1 text-gray-400 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="pl-4 mt-2 space-y-2">
                                        {district.coordinators.map((coordinator) => (
                                            <CoordinatorCard
                                                key={coordinator.id}
                                                coordinator={coordinator}
                                                onEdit={() => openModal('coordinator', { provinceId: province.id, districtId: district.id, coordinator })}
                                                onDelete={() => onDeleteCoordinator(province.id, district.id, coordinator.id)}
                                            />
                                        ))}
                                        <button onClick={() => openModal('coordinator', { provinceId: province.id, districtId: district.id })} className="w-full text-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2 font-medium mt-2">
                                            <AddIcon className="w-4 h-4" /> Añadir Coordinador
                                        </button>
                                    </div>
                                </CollapsibleSection>
                            ))}
                            <button onClick={() => openModal('district', { provinceId: province.id })} className="w-full text-center text-sm bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 font-semibold mt-3">
                                <AddIcon className="w-4 h-4" /> Añadir Distrito
                            </button>
                        </div>
                    </CollapsibleSection>
                ))}
            </div>

            {renderModal()}
        </div>
    );
};

// Form for Province/District (Name only)
const NameForm: React.FC<{
    initialName?: string;
    onSave: (name: string) => void;
    onClose: () => void;
    label: string;
}> = ({ initialName = '', onSave, onClose, label }) => {
    const [name, setName] = useState(initialName);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

// Form for Coordinator
const CoordinatorForm: React.FC<{
    coordinator?: Coordinator | null;
    onSave: (data: Omit<Coordinator, 'id'>) => void;
    onClose: () => void;
}> = ({ coordinator, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: coordinator?.name || '',
        description: coordinator?.description || '',
        phone: coordinator?.phone || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombres y Apellidos</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Breve Descripción</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Celular (con código de país, ej: 519...)</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md">Guardar</button>
            </div>
        </form>
    );
};

export default CoordinatorsTab;