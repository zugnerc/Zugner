import React from 'react';
import type { MyActivity, CompetitorActivity, Party } from '../../types';
import { LinkIcon, EditIcon, DeleteIcon, AddIcon } from '../icons';

interface ActivityFeedProps {
    myActivities: MyActivity[];
    competitorActivities: CompetitorActivity[];
    parties: Party[];
    onAddActivity: (activity: null, type: 'my' | 'competitor') => void;
    onEditActivity: (activity: MyActivity | CompetitorActivity, type: 'my' | 'competitor') => void;
    onDeleteMyActivity: (id: string) => void;
    onDeleteCompetitorActivity: (id: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
    myActivities, 
    competitorActivities, 
    parties,
    onAddActivity,
    onEditActivity,
    onDeleteMyActivity,
    onDeleteCompetitorActivity
}) => {
    const getParty = (partyId: string) => {
        return parties.find(p => p.id === partyId);
    };

    const ActivityHeader: React.FC<{ title: string; onAdd: () => void;}> = ({ title, onAdd }) => (
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-secondary">{title}</h4>
            <button onClick={onAdd} className="p-1 text-primary hover:text-primary-hover"><AddIcon className="w-5 h-5" /></button>
        </div>
    );

    return (
        <div className="w-full xl:w-96 flex-shrink-0 bg-surface rounded-xl p-4 flex flex-col h-full shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Feed de Actividades</h3>
            
            {/* My Activities */}
            <div className="mb-6">
                <ActivityHeader title="Mis Actividades" onAdd={() => onAddActivity(null, 'my')} />
                <div className="space-y-3">
                    {myActivities.map(activity => (
                        <div key={activity.id} className="bg-subtle p-3 rounded-lg relative group">
                            <p className="text-xs text-primary font-bold">{activity.date}</p>
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-gray-800 pr-10">{activity.description}</p>
                                <a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary ml-2 flex-shrink-0">
                                    <LinkIcon className="w-4 h-4" />
                                </a>
                            </div>
                             <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEditActivity(activity, 'my')} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                                <button onClick={() => onDeleteMyActivity(activity.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Competitor Activities */}
            <div>
                <ActivityHeader title="Actividad de Competencia" onAdd={() => onAddActivity(null, 'competitor')} />
                <div className="space-y-3">
                    {competitorActivities.map(activity => {
                        const party = getParty(activity.partyId);
                        return (
                            <div key={activity.id} className="bg-subtle p-3 rounded-lg relative group">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-800 pr-10">{activity.description}</p>
                                    <a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary ml-2 flex-shrink-0">
                                        <LinkIcon className="w-4 h-4" />
                                    </a>
                                </div>
                                {party && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <img src={party.logoUrl} alt={`${party.name} logo`} className="w-5 h-5 rounded-full object-contain bg-white" />
                                        <span className="text-xs text-gray-600">{party.name}</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEditActivity(activity, 'competitor')} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteCompetitorActivity(activity.id)} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;