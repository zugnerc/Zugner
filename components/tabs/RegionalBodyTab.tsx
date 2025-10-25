import React, { useState } from 'react';
import CollapsibleSection from '../situational/CollapsibleSection';
import { initialRegionalBody } from '../../constants';
import type { Councilor, ListMayor, ProvincialList, DistrictList, RegionalOfficial } from '../../types';
import { AddIcon, CopyIcon, DeleteIcon, EditIcon, FacebookIcon, TiktokIcon, CheckCircleIcon, XCircleIcon, WhatsAppIcon } from '../icons';

const RegionalBodyTab: React.FC = () => {
    const [regionalBody, setRegionalBody] = useState(initialRegionalBody);

    const DetailItem: React.FC<{ label: string; value: string | number; isCopiable?: boolean }> = ({ label, value, isCopiable }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(value.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return (
            <div className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-500">{label}:</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">{value}</span>
                    {isCopiable && (
                        <button onClick={handleCopy} className="text-gray-400 hover:text-gray-900">
                            {copied ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderMayor = (mayor: ListMayor) => (
        <div className="bg-subtle p-3 rounded-lg mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h5 className="font-semibold text-gray-900">{mayor.name}</h5>
                    <p className="text-xs italic text-gray-600">"{mayor.nickname}"</p>
                </div>
                 <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                    <button className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <DetailItem label="DNI" value={mayor.dni} isCopiable />
             <div className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-500">Celular:</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">{mayor.phone}</span>
                    <a href={`https://wa.me/${mayor.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
                        <WhatsAppIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <DetailItem label="Género" value={mayor.gender} />
            <DetailItem label="Afiliado" value={mayor.isAffiliated ? 'Sí' : 'No'} />
            <div className="flex gap-4 mt-2">
                <a href={mayor.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500"><FacebookIcon className="w-5 h-5" /></a>
                <a href={mayor.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black"><TiktokIcon className="w-5 h-5" /></a>
            </div>
        </div>
    );

    const renderCouncilor = (councilor: Councilor) => (
        <div key={councilor.id} className="bg-subtle/50 p-3 rounded-lg flex flex-col gap-1">
             <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-900">{councilor.name}</p>
                    <p className="text-xs text-gray-500">{councilor.isPrimary ? 'Titular' : 'Accesitario'}</p>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
                    <button className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <DetailItem label="DNI" value={councilor.dni} isCopiable />
            <div className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-500">Celular:</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">{councilor.phone}</span>
                    <a href={`https://wa.me/${councilor.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
                        <WhatsAppIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-500">Cuotas:</span>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full text-white ${councilor.gender === 'femenino' ? 'bg-pink-500' : 'bg-blue-500'}`}>{councilor.gender}</span>
                    {councilor.isCommunityQuota && <span className="px-2 py-0.5 text-xs rounded-full bg-green-500 text-white">Comunidad</span>}
                </div>
            </div>
             <div className="flex gap-4 mt-1">
                <a href={councilor.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500"><FacebookIcon className="w-5 h-5" /></a>
                <a href={councilor.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black"><TiktokIcon className="w-5 h-5" /></a>
            </div>
        </div>
    );
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Control de Órgano Regional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Governor & Vice */}
                <div className="bg-surface p-4 rounded-lg shadow-md border border-gray-200">
                    <CollapsibleSection header={<h3 className="text-lg font-semibold text-gray-900">Plancha Regional</h3>} defaultOpen>
                       <div className="space-y-4 mt-2">
                         {[regionalBody.governor, regionalBody.viceGovernor].map(official => (
                           <div key={official.id} className="bg-subtle p-3 rounded-lg">
                               <p className="text-sm text-primary font-bold">{official.role}</p>
                               <p className="text-gray-900 text-lg font-semibold">{official.name}</p>
                               <DetailItem label="DNI" value={official.dni} isCopiable />
                           </div>
                         ))}
                       </div>
                    </CollapsibleSection>
                </div>

                {/* Regional Councilors */}
                <div className="bg-surface p-4 rounded-lg lg:col-span-2 shadow-md border border-gray-200">
                    <CollapsibleSection header={<h3 className="text-lg font-semibold text-gray-900">Consejeros Regionales</h3>} defaultOpen>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                            {regionalBody.regionalCouncilors.map(renderCouncilor)}
                        </div>
                    </CollapsibleSection>
                </div>

                {/* Provincial Lists */}
                <div className="bg-surface p-4 rounded-lg lg:col-span-3 shadow-md border border-gray-200">
                    <CollapsibleSection header={<h3 className="text-lg font-semibold text-gray-900">Listas Provinciales y Distritales</h3>} defaultOpen>
                        <div className="space-y-4 mt-2">
                            {regionalBody.provincialLists.map(provList => (
                                <CollapsibleSection 
                                    key={provList.id}
                                    header={<h4 className="font-semibold text-indigo-600">{provList.provinceName}</h4>}
                                    subHeader={`${provList.voters.toLocaleString()} electores`}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <div className="lg:col-span-1">
                                            <h5 className="font-bold text-gray-900 mb-2">Alcalde Provincial</h5>
                                            {renderMayor(provList.mayor)}
                                            <h5 className="font-bold text-gray-900 mb-2 mt-4">Regidores Provinciales</h5>
                                            <div className="space-y-2">{provList.councilors.map(renderCouncilor)}</div>
                                        </div>
                                        <div className="lg:col-span-2 space-y-3">
                                            <h5 className="font-bold text-gray-900 mb-2">Listas Distritales</h5>
                                            {provList.districtLists.map(distList => (
                                                <CollapsibleSection 
                                                    key={distList.id}
                                                    header={<h6 className="font-semibold text-blue-600">{distList.districtName}</h6>}
                                                    subHeader={`${distList.voters.toLocaleString()} electores`}
                                                    className="bg-subtle/50 p-2 rounded-md"
                                                >
                                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                        <div>
                                                            <h6 className="font-bold text-sm text-gray-900 mb-2">Alcalde Distrital</h6>
                                                            {renderMayor(distList.mayor)}
                                                        </div>
                                                        <div>
                                                            <h6 className="font-bold text-sm text-gray-900 mb-2">Regidores Distritales</h6>
                                                            <div className="space-y-2">{distList.councilors.map(renderCouncilor)}</div>
                                                        </div>
                                                    </div>
                                                </CollapsibleSection>
                                            ))}
                                        </div>
                                    </div>
                                </CollapsibleSection>
                            ))}
                        </div>
                    </CollapsibleSection>
                </div>

            </div>
        </div>
    );
};

export default RegionalBodyTab;