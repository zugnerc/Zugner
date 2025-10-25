import React, { useState } from 'react';
import type { PlannedEvent } from '../../types';
import { initialPlannedEvents } from '../../constants';
import { AddIcon, DeleteIcon, EditIcon, LinkIcon } from '../icons';
import Modal from '../common/Modal';

const ActivityPlannerTab: React.FC = () => {
    const [events, setEvents] = useState<PlannedEvent[]>(initialPlannedEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<PlannedEvent | null>(null);

    const openModal = (event: PlannedEvent | null = null) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingEvent(null);
        setIsModalOpen(false);
    };

    const handleSave = (event: PlannedEvent) => {
        if (editingEvent) {
            setEvents(events.map(e => e.id === event.id ? event : e));
        } else {
            setEvents([...events, { ...event, id: crypto.randomUUID() }]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Planificador de Actividades</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Crear Evento
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map(event => (
                    <div key={event.id} className="bg-surface p-4 rounded-lg flex flex-col justify-between shadow-md border border-gray-200">
                        <div>
                            <p className="text-sm font-bold text-primary">{event.date}</p>
                            <h3 className="text-lg font-semibold text-gray-900 mt-1">{event.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                            <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary"><LinkIcon className="w-5 h-5"/></a>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(event)} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(event.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={editingEvent ? 'Editar Evento' : 'Crear Evento'}>
                    <EventForm event={editingEvent} onSave={handleSave} onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};


const EventForm: React.FC<{event: PlannedEvent | null; onSave: (event: PlannedEvent) => void; onClose: () => void;}> = ({ event, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        id: event?.id || '',
        title: event?.title || '',
        date: event?.date || '',
        description: event?.description || '',
        location: event?.location || '',
        link: event?.link || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    <label className="block text-sm font-medium text-gray-700">Título del Evento</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha (DD MES AAAA)</label>
                    <input type="text" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Enlace</label>
                <input type="text" name="link" value={formData.link} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
}

export default ActivityPlannerTab;