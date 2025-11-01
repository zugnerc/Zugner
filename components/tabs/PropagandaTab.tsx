import React, { useState } from 'react';
import type { PropagandaProvince, PropagandaDistrict, PropagandaItem, Design } from '../../types';
import CollapsibleSection from '../situational/CollapsibleSection';
import { AddIcon, DeleteIcon, EditIcon, LinkIcon, WhatsAppIcon, CopyIcon, CheckCircleIcon, DownloadIcon, DesignsIcon } from '../icons';
import Modal from '../common/Modal';

// PROPS
// ===================================
interface PropagandaTabProps {
    provinces: PropagandaProvince[];
    designs: Design[];
    onSaveProvince: (province: PropagandaProvince) => void;
    onDeleteProvince: (provinceId: string) => void;
    onSaveDistrict: (provinceId: string, district: PropagandaDistrict) => void;
    onDeleteDistrict: (provinceId: string, districtId: string) => void;
    onSaveItem: (provinceId: string, districtId: string, item: PropagandaItem) => void;
    onDeleteItem: (provinceId: string, districtId: string, itemId: string) => void;
    onSaveDesign: (design: Design) => void;
    onDeleteDesign: (designId: string) => void;
}


// Designs Manager Component
// ===================================
const DesignsManager: React.FC<{
    designs: Design[];
    onSave: (design: Design) => void;
    onDelete: (id: string) => void;
}> = ({ designs, onSave, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDesign, setEditingDesign] = useState<Design | null>(null);

    const openModal = (design: Design | null = null) => {
        setEditingDesign(design);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleSave = (design: Design) => {
        onSave(design);
        closeModal();
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-secondary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
                <DesignsIcon className="w-5 h-5" />
                Diseños para Descargar
            </button>

            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black z-20 transition-opacity ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Side Panel */}
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-bkg shadow-2xl transform transition-transform duration-300 ease-in-out z-30 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <header className="p-4 border-b border-subtle flex justify-between items-center bg-surface sticky top-0">
                    <h4 className="font-bold text-gray-800 text-lg">Feed de Diseños</h4>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-gray-500 hover:text-gray-900 transition-colors text-2xl"
                    >
                        &times;
                    </button>
                </header>
                
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {designs.length > 0 ? designs.map(design => (
                        <div key={design.id} className="bg-surface border border-gray-200 rounded-lg overflow-hidden group relative shadow-sm">
                            <img src={design.previewImageUrl} alt={design.title} className="w-full h-48 object-cover bg-gray-100" />
                            
                            <div className="p-3">
                                <h5 className="font-bold text-gray-800 truncate">{design.title}</h5>
                                <div className="text-xs text-gray-500 mt-2 space-y-1">
                                    <p><span className="font-semibold text-gray-600">Tipo:</span> {design.type}</p>
                                    <p><span className="font-semibold text-gray-600">Dimensiones:</span> {design.dimensions}</p>
                                    <p><span className="font-semibold text-gray-600">Aparecen:</span> {design.featuredPeople}</p>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center p-4">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href={design.downloadLink} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-2 text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors font-semibold shadow-lg">
                                        <DownloadIcon className="w-5 h-5" /> Descargar
                                    </a>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 flex items-center gap-1 shadow-lg">
                                        <button onClick={() => openModal(design)} className="p-2 text-gray-700 hover:text-black hover:bg-white/50 rounded-full transition-colors"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => onDelete(design.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-white/50 rounded-full transition-colors"><DeleteIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-sm text-center text-gray-500 py-10">No hay diseños disponibles.</p>}
                </div>

                <footer className="p-4 border-t border-subtle bg-surface sticky bottom-0">
                    <button onClick={() => openModal()} className="w-full text-center text-sm bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 font-semibold">
                        <AddIcon className="w-4 h-4" /> Añadir Nuevo Diseño
                    </button>
                </footer>
            </div>

             {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={editingDesign ? 'Editar Diseño' : 'Añadir Diseño'}>
                    <DesignForm design={editingDesign} onSave={handleSave} onClose={closeModal} />
                </Modal>
            )}
        </>
    );
};


// CARD COMPONENT
// ===================================
const PropagandaCard: React.FC<{ item: PropagandaItem; onEdit: () => void; onDelete: () => void; }> = ({ item, onEdit, onDelete }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!item.phone) return;
        navigator.clipboard.writeText(item.phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 relative group">
            <p className="text-sm text-gray-800 pr-12">{item.description}</p>
            <div className="absolute top-2 right-2 z-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
            </div>
            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                    <a href={`https://wa.me/${item.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="Abrir en WhatsApp" className="text-green-500 hover:text-green-600 flex-shrink-0"><WhatsAppIcon className="w-5 h-5" /></a>
                    <span onClick={handleCopy} className="text-sm text-gray-600 font-mono cursor-pointer">{item.phone}</span>
                     {copied && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                </div>
                <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary"><LinkIcon className="w-5 h-5"/></a>
            </div>
        </div>
    );
};

// FORMS
// ===================================

const NameForm: React.FC<{ initialName?: string; onSave: (name: string) => void; onClose: () => void; label: string; }> = ({ initialName = '', onSave, onClose, label }) => {
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

const PropagandaItemForm: React.FC<{ item?: PropagandaItem; onSave: (data: Omit<PropagandaItem, 'id'>) => void; onClose: () => void; }> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({ description: item?.description || '', phone: item?.phone || '', externalLink: item?.externalLink || '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-subtle rounded-md p-2" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Celular de Contacto (con código de país)</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Enlace Externo (URL)</label>
                <input type="text" name="externalLink" value={formData.externalLink} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md">Guardar</button>
            </div>
        </form>
    );
};

const DesignForm: React.FC<{ design?: Design | null; onSave: (design: Design) => void; onClose: () => void; }> = ({ design, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: design?.title || '',
        previewImageUrl: design?.previewImageUrl || '',
        dimensions: design?.dimensions || '',
        type: design?.type || '',
        featuredPeople: design?.featuredPeople || '',
        downloadLink: design?.downloadLink || ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, id: design?.id || crypto.randomUUID() }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Título</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" required /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">URL de Imagen de Vista Previa</label><input type="text" name="previewImageUrl" value={formData.previewImageUrl} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className="mt-1 block w-full bg-subtle rounded-md p-2" required /></div>
                <div><label className="block text-sm font-medium text-gray-700">Dimensiones (ej: 90cm x 120cm)</label><input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Tipo de Publicidad (ej: Banner)</label><input type="text" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Quienes Aparecen</label><input type="text" name="featuredPeople" value={formData.featuredPeople} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Enlace de Descarga (URL)</label><input type="text" name="downloadLink" value={formData.downloadLink} onChange={handleChange} className="mt-1 block w-full bg-subtle rounded-md p-2" required /></div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md">Guardar</button>
            </div>
        </form>
    );
};

// MAIN TAB COMPONENT
// ===================================
const PropagandaTab: React.FC<PropagandaTabProps> = (props) => {
    const { provinces, designs, onSaveProvince, onDeleteProvince, onSaveDistrict, onDeleteDistrict, onSaveItem, onDeleteItem, onSaveDesign, onDeleteDesign } = props;
    const [modalState, setModalState] = useState<{ type: 'province' | 'district' | 'item' | null; data: any }>({ type: null, data: {} });

    const openModal = (type: 'province' | 'district' | 'item', data: any = {}) => setModalState({ type, data });
    const closeModal = () => setModalState({ type: null, data: {} });
    
    const handleSaveProvince = (name: string) => {
        const province = modalState.data.province;
        onSaveProvince({ id: province?.id || crypto.randomUUID(), name, districts: province?.districts || [] });
        closeModal();
    };
    
    const handleSaveDistrict = (name: string) => {
        const { provinceId, district } = modalState.data;
        onSaveDistrict(provinceId, { id: district?.id || crypto.randomUUID(), name, items: district?.items || [] });
        closeModal();
    };

    const handleSaveItem = (data: Omit<PropagandaItem, 'id'>) => {
        const { provinceId, districtId, item } = modalState.data;
        onSaveItem(provinceId, districtId, { ...data, id: item?.id || crypto.randomUUID() });
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
        } else if (type === 'item') {
            title = data.item ? 'Editar Registro' : 'Añadir Registro';
            content = <PropagandaItemForm item={data.item} onSave={handleSaveItem} onClose={closeModal}/>;
        }

        return <Modal isOpen={true} onClose={closeModal} title={title}>{content}</Modal>;
    };

    return (
         <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Control de Propaganda</h2>
                <DesignsManager designs={designs} onSave={onSaveDesign} onDelete={onDeleteDesign} />
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
                                    <div className="pl-4 mt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {district.items.map((item) => (
                                            <PropagandaCard
                                                key={item.id}
                                                item={item}
                                                onEdit={() => openModal('item', { provinceId: province.id, districtId: district.id, item })}
                                                onDelete={() => onDeleteItem(province.id, district.id, item.id)}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={() => openModal('item', { provinceId: province.id, districtId: district.id })} className="w-full text-center text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2 font-medium mt-3">
                                        <AddIcon className="w-4 h-4" /> Añadir Propaganda
                                    </button>
                                </CollapsibleSection>
                            ))}
                            <button onClick={() => openModal('district', { provinceId: province.id })} className="w-full text-center text-sm bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 font-semibold mt-3">
                                <AddIcon className="w-4 h-4" /> Añadir Distrito
                            </button>
                        </div>
                    </CollapsibleSection>
                ))}
            </div>
             <div className="mt-6">
                <button onClick={() => openModal('province')} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Provincia
                </button>
            </div>

            {renderModal()}
        </div>
    );
};

export default PropagandaTab;