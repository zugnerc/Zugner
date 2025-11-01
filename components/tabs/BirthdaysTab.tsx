import React, { useState, useMemo } from 'react';
import type { Birthday } from '../../types';
import { AddIcon, CakeIcon, DeleteIcon, EditIcon } from '../icons';
import Modal from '../common/Modal';

interface BirthdaysTabProps {
    birthdays: Birthday[];
    onSaveBirthday: (birthday: Birthday) => void;
    onDeleteBirthday: (id: string) => void;
}

const BirthdaysTab: React.FC<BirthdaysTabProps> = ({ birthdays, onSaveBirthday, onDeleteBirthday }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

    const openModal = (birthday: Birthday | null = null) => {
        setEditingBirthday(birthday);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingBirthday(null);
        setIsModalOpen(false);
    };

    const handleSave = (birthday: Birthday) => {
        const id = editingBirthday ? editingBirthday.id : crypto.randomUUID();
        onSaveBirthday({ ...birthday, id });
        closeModal();
    };

    const { today, todaysBirthdays, upcomingBirthdays } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMonth = today.getMonth() + 1;
        const todayDate = today.getDate();

        const todaysBirthdays = birthdays.filter(b => {
            const parts = b.birthdate.split('-');
            if (parts.length < 3) return false;
            const birthMonth = parseInt(parts[1], 10);
            const birthDay = parseInt(parts[2], 10);
            return birthMonth === todayMonth && birthDay === todayDate;
        });

        const getNextBirthdayDate = (birthdateStr: string): Date => {
            // Parse YYYY-MM-DD as local date to avoid timezone issues
            const parts = birthdateStr.split('-').map(part => parseInt(part, 10));
            if (parts.length !== 3 || parts.some(isNaN)) return new Date(); // Fallback
            const birthMonth = parts[1] - 1; // Month is 0-indexed for new Date()
            const birthDay = parts[2];
            
            const currentYear = today.getFullYear();
            let nextBirthday = new Date(currentYear, birthMonth, birthDay);
            
            if (nextBirthday < today) {
                nextBirthday.setFullYear(currentYear + 1);
            }
            return nextBirthday;
        };

        const todaysBirthdaysIds = new Set(todaysBirthdays.map(b => b.id));
        const upcomingBirthdays = birthdays
            .filter(b => !todaysBirthdaysIds.has(b.id))
            .map(b => ({ ...b, nextBirthday: getNextBirthdayDate(b.birthdate) }))
            .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());
        
        return { today, todaysBirthdays, upcomingBirthdays };

    }, [birthdays]);
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    const formatUpcomingDate = (date: Date) => {
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Mañana';
        if (diffDays > 1 && diffDays <= 7) return `En ${diffDays} días`;
        return date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Registro y Recordatorio de Cumpleaños</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Cumpleaños
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Today's Section */}
                <div className="bg-surface p-6 rounded-xl shadow-lg border border-primary/20">
                    <p className="text-sm text-gray-500">Calendario</p>
                    <h3 className="text-2xl font-bold text-primary capitalize">{formatDate(today)}</h3>

                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
                            <CakeIcon className="w-6 h-6 text-secondary"/>
                            Cumpleaños de Hoy
                        </h4>
                        <div className="space-y-3">
                            {todaysBirthdays.length > 0 ? (
                                todaysBirthdays.map(b => (
                                     <div key={b.id} className="bg-primary/10 p-4 rounded-lg flex justify-between items-center group">
                                        <div>
                                            <p className="font-bold text-primary">{b.name}</p>
                                            <p className="text-sm text-primary/80 italic">"{b.nickname}"</p>
                                        </div>
                                         <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(b)} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDeleteBirthday(b.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Nadie cumple años hoy.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upcoming Section */}
                <div className="bg-surface p-6 rounded-xl shadow-md border border-gray-200">
                     <h4 className="font-semibold text-gray-800 mb-4 text-lg">Próximos Cumpleaños</h4>
                     <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {upcomingBirthdays.map(b => (
                            <div key={b.id} className="flex items-start gap-4 group">
                                <div className="text-center flex-shrink-0 w-20">
                                    <p className="font-bold text-secondary">{formatUpcomingDate(b.nextBirthday)}</p>
                                    <p className="text-xs text-gray-500">{b.nextBirthday.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</p>
                                </div>
                                <div className="bg-subtle p-3 rounded-lg flex-grow flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{b.name}</p>
                                        <p className="text-sm text-gray-600 italic">"{b.nickname}"</p>
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(b)} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                                        <button onClick={() => onDeleteBirthday(b.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBirthday ? 'Editar Cumpleaños' : 'Añadir Cumpleaños'}>
                    <BirthdayForm birthday={editingBirthday} onSave={handleSave} onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};


const BirthdayForm: React.FC<{birthday: Birthday | null; onSave: (birthday: Omit<Birthday, 'id'>) => void; onClose: () => void;}> = ({ birthday, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: birthday?.name || '',
        nickname: birthday?.nickname || '',
        birthdate: birthday?.birthdate || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Apelativo</label>
                    <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
                </div>
            </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
}

export default BirthdaysTab;