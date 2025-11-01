import React, { useState, useMemo } from 'react';
import type { MediaPost, Sentiment } from '../../types';
import { AddIcon, DeleteIcon, EditIcon, LinkIcon } from '../icons';
import Modal from '../common/Modal';

interface MediaTrackingTabProps {
    mediaPosts: MediaPost[];
    onSaveMediaPost: (post: MediaPost) => void;
    onDeleteMediaPost: (id: string) => void;
}

const MediaTrackingTab: React.FC<MediaTrackingTabProps> = ({ mediaPosts, onSaveMediaPost, onDeleteMediaPost }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<MediaPost | null>(null);

    const openModal = (post: MediaPost | null = null) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingPost(null);
        setIsModalOpen(false);
    };

    const handleSave = (post: MediaPost) => {
        const id = editingPost ? editingPost.id : crypto.randomUUID();
        onSaveMediaPost({ ...post, id });
        closeModal();
    };
    
    const sortedPostsForCurrentMonth = useMemo(() => {
        const now = new Date();
        return mediaPosts
            .filter(post => {
                const postDate = new Date(`${post.publicationDate}T00:00:00`);
                return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
            })
            .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    }, [mediaPosts]);
    
    const currentMonthName = new Date().toLocaleString('es-ES', { month: 'long' });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Medios</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <AddIcon className="w-5 h-5" />
                    Añadir Registro
                </button>
            </div>
            
            <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-primary capitalize mb-4">
                    Registros de {currentMonthName}
                </h3>
                {sortedPostsForCurrentMonth.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedPostsForCurrentMonth.map(post => <MediaPostCard key={post.id} post={post} onEdit={openModal} onDelete={onDeleteMediaPost} />)}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        <p className="font-semibold">No hay registros para el mes actual.</p>
                        <p className="text-sm mt-1">Haz clic en "Añadir Registro" para empezar.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPost ? 'Editar Registro' : 'Añadir Registro'}>
                    <MediaPostForm post={editingPost} onSave={handleSave} onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
};

const sentimentStyles: Record<Sentiment, { border: string; text: string; label: string }> = {
    positive: { border: 'border-green-500', text: 'text-green-600', label: 'A Favor' },
    neutral: { border: 'border-gray-500', text: 'text-gray-600', label: 'Neutral' },
    negative: { border: 'border-red-500', text: 'text-red-600', label: 'En Contra' },
};

const MediaPostCard: React.FC<{post: MediaPost, onEdit: (post: MediaPost) => void, onDelete: (id: string) => void}> = ({ post, onEdit, onDelete }) => {
    const styles = sentimentStyles[post.sentiment];
    const formattedDate = new Date(`${post.publicationDate}T00:00:00`).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${styles.border} relative group flex flex-col justify-between h-full transition-shadow hover:shadow-md`}>
           <div>
                <div className="flex justify-between items-start mb-2">
                    <p className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}>{styles.label}</p>
                    <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{formattedDate}</p>
                </div>

                <h4 className="font-bold text-gray-800 mb-2 pr-12">{post.title}</h4>
                
                {post.summary && <p className="text-sm text-gray-600">{post.summary}</p>}
           </div>

            <div className="flex justify-end items-center mt-4">
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                    <LinkIcon className="w-5 h-5"/>
                </a>
            </div>

            <div className="absolute top-3 right-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => onEdit(post)} className="p-1 text-gray-400 hover:text-gray-800"><EditIcon className="w-4 h-4" /></button>
                <button onClick={() => onDelete(post.id)} className="p-1 text-gray-400 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

const MediaPostForm: React.FC<{post: MediaPost | null; onSave: (post: MediaPost) => void; onClose: () => void;}> = ({ post, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        id: post?.id || '',
        title: post?.title || '',
        publicationDate: post?.publicationDate || new Date().toISOString().split('T')[0],
        sentiment: post?.sentiment || 'neutral' as Sentiment,
        summary: post?.summary || '',
        link: post?.link || '',
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
            <div>
                <label className="block text-sm font-medium text-gray-700">Titular del Medio</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                    <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Opinión</label>
                    <select name="sentiment" value={formData.sentiment} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary">
                        <option value="positive">A Favor</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">En Contra</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción Breve</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Enlace (URL)</label>
                <input type="text" name="link" value={formData.link} onChange={handleChange} className="mt-1 block w-full bg-subtle border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar</button>
            </div>
        </form>
    );
}

export default MediaTrackingTab;