import React, { useState } from 'react';
import type { TrollTarget, TrollAccount } from '../../types';
import { AddIcon, DeleteIcon, EditIcon, LinkIcon, FacebookIcon, TiktokIcon } from '../icons';
import Modal from '../common/Modal';

interface TrollsTabProps {
    trollTargets: TrollTarget[];
    onSaveTarget: (target: TrollTarget) => void;
    onDeleteTarget: (id: string) => void;
    onSaveTroll: (targetId: string, troll: TrollAccount) => void;
    onDeleteTroll: (targetId: string, trollId: string) => void;
}

const TrollsTab: React.FC<TrollsTabProps> = ({
    trollTargets,
    onSaveTarget,
    onDeleteTarget,
    onSaveTroll,
    onDeleteTroll,
}) => {
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [editingTarget, setEditingTarget] = useState<TrollTarget | null>(null);

    const [isTrollModalOpen, setIsTrollModalOpen] = useState(false);
    const [editingTroll, setEditingTroll] = useState<{ troll: TrollAccount | null; targetId: string | null }>({ troll: null, targetId: null });

    // Target Modal Handlers
    const openTargetModal = (target: TrollTarget | null = null) => {
        setEditingTarget(target);
        setIsTargetModalOpen(true);
    };
    const closeTargetModal = () => setIsTargetModalOpen(false);
    const handleSaveTarget = (targetData: Omit<TrollTarget, 'id' | 'trolls'>) => {
        const id = editingTarget ? editingTarget.id : crypto.randomUUID();
        const trolls = editingTarget ? editingTarget.trolls : [];
        onSaveTarget({ ...targetData, id, trolls });
        closeTargetModal();
    };

    // Troll Modal Handlers
    const openTrollModal = (troll: TrollAccount | null, targetId: string) => {
        setEditingTroll({ troll, targetId });
        setIsTrollModalOpen(true);
    };
    const closeTrollModal = () => setIsTrollModalOpen(false);
    const handleSaveTroll = (trollData: Omit<TrollAccount, 'id'>) => {
        if (editingTroll.targetId) {
            const id = editingTroll.troll ? editingTroll.troll.id : crypto.randomUUID();
            onSaveTroll(editingTroll.targetId, { ...trollData, id });
        }
        closeTrollModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Identificación de Cuentas Troll</h2>
                <button onClick={() => openTargetModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Objetivo
                </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4">
                {trollTargets.map(target => (
                    <TrollTargetColumn 
                        key={target.id}
                        target={target}
                        onEditTarget={openTargetModal}
                        onDeleteTarget={onDeleteTarget}
                        onAddTroll={() => openTrollModal(null, target.id)}
                        onEditTroll={(troll) => openTrollModal(troll, target.id)}
                        onDeleteTroll={(trollId) => onDeleteTroll(target.id, trollId)}
                    />
                ))}
            </div>

            {isTargetModalOpen && (
                <Modal isOpen={isTargetModalOpen} onClose={closeTargetModal} title={editingTarget ? 'Editar Objetivo' : 'Añadir Objetivo'}>
                    <TargetForm target={editingTarget} onSave={handleSaveTarget} onClose={closeTargetModal} />
                </Modal>
            )}

            {isTrollModalOpen && (
                 <Modal isOpen={isTrollModalOpen} onClose={closeTrollModal} title={editingTroll.troll ? 'Editar Cuenta Troll' : 'Añadir Cuenta Troll'}>
                    <TrollForm troll={editingTroll.troll} onSave={handleSaveTroll} onClose={closeTrollModal} />
                </Modal>
            )}
        </div>
    );
};

// Column Component
const TrollTargetColumn: React.FC<{
    target: TrollTarget;
    onEditTarget: (target: TrollTarget) => void;
    onDeleteTarget: (id: string) => void;
    onAddTroll: () => void;
    onEditTroll: (troll: TrollAccount) => void;
    onDeleteTroll: (trollId: string) => void;
}> = ({ target, onEditTarget, onDeleteTarget, onAddTroll, onEditTroll, onDeleteTroll }) => {
    return (
        <div className="w-80 md:w-96 flex-shrink-0 bg-surface rounded-xl flex flex-col h-full shadow-md border border-gray-200">
            <div className="p-4 border-b border-subtle">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 pr-2">{target.name}</h3>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                        <button onClick={() => onEditTarget(target)} className="p-1 text-gray-400 hover:text-gray-800"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteTarget(target.id)} className="p-1 text-gray-400 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
            <div className="flex-grow p-4 space-y-3 overflow-y-auto">
                {target.trolls.map(troll => (
                    <TrollCard key={troll.id} troll={troll} onEdit={onEditTroll} onDelete={onDeleteTroll} />
                ))}
            </div>
            <div className="p-4 pt-0">
                <button onClick={onAddTroll} className="w-full text-center text-sm bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 font-semibold">
                    <AddIcon className="w-4 h-4" /> Añadir Cuenta Troll
                </button>
            </div>
        </div>
    );
};


// Card Component
const TrollCard: React.FC<{
    troll: TrollAccount;
    onEdit: (troll: TrollAccount) => void;
    onDelete: (id: string) => void;
}> = ({ troll, onEdit, onDelete }) => {
    return (
        <div className="bg-subtle p-3 rounded-lg relative group">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    {troll.platform === 'facebook' ? <FacebookIcon className="w-5 h-5 text-blue-600" /> : <TiktokIcon className="w-5 h-5 text-black" />}
                    <h4 className="font-semibold text-gray-900 leading-tight">{troll.name}</h4>
                </div>
                 <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(troll)} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(troll.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{troll.description}</p>
            <div className="flex justify-end mt-2">
                <a href={troll.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                    <LinkIcon className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

// Target Form
const TargetForm: React.FC<{
    target: TrollTarget | null;
    onSave: (data: Omit<TrollTarget, 'id' | 'trolls'>) => void;
    onClose: () => void;
}> = ({ target, onSave, onClose }) => {
    const [name, setName] = useState(target?.name || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Objetivo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Apoyo a Candidato X" className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};


// Troll Form
const TrollForm: React.FC<{
    troll: TrollAccount | null;
    onSave: (data: Omit<TrollAccount, 'id'>) => void;
    onClose: () => void;
}> = ({ troll, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: troll?.name || '',
        platform: troll?.platform || 'facebook' as 'facebook' | 'tiktok',
        description: troll?.description || '',
        link: troll?.link || '',
    });
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Cuenta</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Plataforma</label>
                    <select name="platform" value={formData.platform} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary">
                        <option value="facebook">Facebook</option>
                        <option value="tiktok">TikTok</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Enlace al Perfil (URL)</label>
                <input type="text" name="link" value={formData.link} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required/>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
};

export default TrollsTab;