import React, { useState } from 'react';
import CollapsibleSection from '../situational/CollapsibleSection';
import type { Councilor, ListMayor, ProvincialList, DistrictList, RegionalOfficial, RegionalBody, Gender } from '../../types';
import { AddIcon, CopyIcon, DeleteIcon, EditIcon, FacebookIcon, TiktokIcon, WhatsAppIcon } from '../icons';
import Modal from '../common/Modal';

type ModalType = 'OFFICIAL' | 'REGIONAL_COUNCILOR' | 'PROVINCIAL_LIST' | 'DISTRICT_LIST' | 'PROVINCIAL_MAYOR' | 'DISTRICT_MAYOR' | 'PROVINCIAL_COUNCILOR' | 'DISTRICT_COUNCILOR';


// Main Component
// ===================================
interface RegionalBodyTabProps {
    regionalBody: RegionalBody;
    onSave: (newRegionalBody: RegionalBody) => void;
}
const RegionalBodyTab: React.FC<RegionalBodyTabProps> = ({ regionalBody, onSave }) => {
    const [modal, setModal] = useState<{ type: ModalType | null; data: any }>({ type: null, data: {} });

    const openModal = (type: ModalType, data: any = {}) => setModal({ type, data });
    const closeModal = () => setModal({ type: null, data: {} });

    const handleSave = (newBody: RegionalBody) => {
        onSave(newBody);
        closeModal();
    };
    
     const handleDelete = (type: string, ids: any) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

        let newBody = JSON.parse(JSON.stringify(regionalBody));

        switch (type) {
            case 'REGIONAL_COUNCILOR':
                newBody.regionalCouncilors = newBody.regionalCouncilors.filter((c: Councilor) => c.id !== ids.councilorId);
                break;
            case 'PROVINCIAL_LIST':
                newBody.provincialLists = newBody.provincialLists.filter((p: ProvincialList) => p.id !== ids.provinceId);
                break;
            case 'DISTRICT_LIST':
                const provList = newBody.provincialLists.find((p: ProvincialList) => p.id === ids.provinceId);
                if (provList) {
                    provList.districtLists = provList.districtLists.filter((d: DistrictList) => d.id !== ids.districtId);
                }
                break;
            case 'PROVINCIAL_MAYOR':
                 const provForMayor = newBody.provincialLists.find((p: ProvincialList) => p.id === ids.provinceId);
                 if(provForMayor) provForMayor.mayor = null; // Assuming one mayor
                 break;
            case 'DISTRICT_MAYOR':
                const provForDistMayor = newBody.provincialLists.find((p: ProvincialList) => p.id === ids.provinceId);
                if(provForDistMayor){
                    const distList = provForDistMayor.districtLists.find((d: DistrictList) => d.id === ids.districtId);
                    if(distList) distList.mayor = null;
                }
                break;
            case 'PROVINCIAL_COUNCILOR':
                 const provForCouncilor = newBody.provincialLists.find((p: ProvincialList) => p.id === ids.provinceId);
                 if(provForCouncilor) {
                     provForCouncilor.councilors = provForCouncilor.councilors.filter((c: Councilor) => c.id !== ids.councilorId);
                 }
                 break;
            case 'DISTRICT_COUNCILOR':
                 const provForDistCouncilor = newBody.provincialLists.find((p: ProvincialList) => p.id === ids.provinceId);
                 if(provForDistCouncilor){
                     const dist = provForDistCouncilor.districtLists.find((d: DistrictList) => d.id === ids.districtId);
                     if(dist) dist.councilors = dist.councilors.filter((c: Councilor) => c.id !== ids.councilorId);
                 }
                 break;
        }
        onSave(newBody);
    };

    const getModalTitle = () => {
        const { type, data } = modal;
        const isEditing = Object.keys(data).some(key => key.includes('Id') ? data[key] !== undefined : !!data[key]);

        switch(type) {
            case 'OFFICIAL': return 'Editar Plancha Regional';
            case 'REGIONAL_COUNCILOR': return `${isEditing ? 'Editar' : 'Añadir'} Consejero Regional`;
            case 'PROVINCIAL_LIST': return `${isEditing ? 'Editar' : 'Añadir'} Lista Provincial`;
            case 'DISTRICT_LIST': return `${isEditing ? 'Editar' : 'Añadir'} Lista Distrital`;
            case 'PROVINCIAL_MAYOR': return `${isEditing ? 'Editar' : 'Añadir'} Alcalde Provincial`;
            case 'DISTRICT_MAYOR': return `${isEditing ? 'Editar' : 'Añadir'} Alcalde Distrital`;
            case 'PROVINCIAL_COUNCILOR': return `${isEditing ? 'Editar' : 'Añadir'} Regidor Provincial`;
            case 'DISTRICT_COUNCILOR': return `${isEditing ? 'Editar' : 'Añadir'} Regidor Distrital`;
            default: return '';
        }
    }

    const renderModalContent = () => {
        const sharedProps = { regionalBody, onSave: handleSave, onClose: closeModal };
        switch (modal.type) {
            case 'OFFICIAL':
                return <OfficialForm official={modal.data.official} {...sharedProps} />;
            case 'REGIONAL_COUNCILOR':
                return <RegionalCouncilorForm councilor={modal.data.councilor} {...sharedProps} />;
            case 'PROVINCIAL_LIST':
                return <ProvincialListForm province={modal.data.province} {...sharedProps} />;
            case 'DISTRICT_LIST':
                return <DistrictListForm provinceId={modal.data.provinceId} district={modal.data.district} {...sharedProps} />;
            case 'PROVINCIAL_MAYOR':
                return <ListMayorForm provinceId={modal.data.provinceId} mayor={modal.data.mayor} {...sharedProps} />;
            case 'DISTRICT_MAYOR':
                return <ListMayorForm provinceId={modal.data.provinceId} districtId={modal.data.districtId} mayor={modal.data.mayor} {...sharedProps} />;
            case 'PROVINCIAL_COUNCILOR':
                 return <ListCouncilorForm provinceId={modal.data.provinceId} councilor={modal.data.councilor} {...sharedProps} />;
            case 'DISTRICT_COUNCILOR':
                 return <ListCouncilorForm provinceId={modal.data.provinceId} districtId={modal.data.districtId} councilor={modal.data.councilor} {...sharedProps} />;
            default:
                return null;
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Control de Órgano Regional</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Governor & Vice */}
                <div className="bg-surface p-4 rounded-lg shadow-md border border-gray-200">
                    <CollapsibleSection header={<h3 className="text-lg font-semibold text-gray-900">Plancha Regional</h3>} defaultOpen>
                       <div className="space-y-4 mt-2">
                         {[regionalBody.governor, regionalBody.viceGovernor].map(official => (
                           <div key={official.id} className="bg-subtle p-3 rounded-lg relative group">
                                <button onClick={() => openModal('OFFICIAL', { official })} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditIcon className="w-4 h-4" />
                                </button>
                               <p className="text-sm text-primary font-bold">{official.role}</p>
                               <p className="text-gray-900 text-lg font-semibold">{official.name}</p>
                               <DetailItem label="DNI" value={official.dni} isCopiable />
                           </div>
                         ))}
                       </div>
                    </CollapsibleSection>
                </div>

                {/* Regional Councilors */}
                <div className="bg-surface p-4 rounded-lg shadow-md border border-gray-200">
                    <CollapsibleSection 
                        header={<h3 className="text-lg font-semibold text-gray-900">Consejeros Regionales</h3>} 
                        defaultOpen
                        actionButton={<button onClick={() => openModal('REGIONAL_COUNCILOR', {})} className="text-xs bg-primary/80 text-white px-2 py-1 rounded-md hover:bg-primary transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir</button>}
                    >
                        <div className="space-y-3 mt-2">
                            {regionalBody.regionalCouncilors.map(c => <RegionalCouncilorCard key={c.id} councilor={c} onEdit={() => openModal('REGIONAL_COUNCILOR', { councilor: c })} onDelete={() => handleDelete('REGIONAL_COUNCILOR', { councilorId: c.id })}/>)}
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
            
             {/* Provincial Lists */}
            <div className="bg-surface p-4 mt-6 rounded-lg lg:col-span-3 shadow-md border border-gray-200">
                 <CollapsibleSection 
                    header={<h3 className="text-lg font-semibold text-gray-900">Listas Provinciales y Distritales</h3>} 
                    defaultOpen
                    actionButton={<button onClick={() => openModal('PROVINCIAL_LIST', {})} className="text-xs bg-primary/80 text-white px-2 py-1 rounded-md hover:bg-primary transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir Provincia</button>}
                    >
                    <div className="space-y-4 mt-2">
                        {regionalBody.provincialLists.map(provList => (
                            <CollapsibleSection 
                                key={provList.id}
                                header={<div className="flex items-center gap-2"><h4 className="font-semibold text-indigo-600">{provList.provinceName}</h4><button onClick={(e)=>{e.stopPropagation(); openModal('PROVINCIAL_LIST', { province: provList })}} className="text-gray-400 hover:text-gray-800"><EditIcon className="w-3 h-3"/></button></div>}
                                subHeader={`${provList.voters.toLocaleString()} electores`}
                                className="!py-4"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                                    {/* Provincial Section */}
                                    <div className="lg:col-span-5 space-y-3">
                                        <div>
                                            <h5 className="font-bold text-gray-900 mb-2">Alcalde Provincial</h5>
                                            {provList.mayor ? <ListMayorCard mayor={provList.mayor} onEdit={()=>openModal('PROVINCIAL_MAYOR', { provinceId: provList.id, mayor: provList.mayor })} onDelete={()=>handleDelete('PROVINCIAL_MAYOR', {provinceId: provList.id})} /> : <AddEntityButton text="Añadir Alcalde" onClick={() => openModal('PROVINCIAL_MAYOR', { provinceId: provList.id })} />}
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="font-bold text-gray-900">Regidores Provinciales</h5>
                                                <button onClick={() => openModal('PROVINCIAL_COUNCILOR', { provinceId: provList.id })} className="text-xs bg-indigo-500/80 text-white px-2 py-1 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir</button>
                                            </div>
                                            <div className="space-y-2">
                                                {provList.councilors.sort((a, b) => a.number - b.number).map(c => <ListCouncilorCard key={c.id} councilor={c} onEdit={() => openModal('PROVINCIAL_COUNCILOR', { provinceId: provList.id, councilor: c })} onDelete={()=>handleDelete('PROVINCIAL_COUNCILOR', {provinceId: provList.id, councilorId: c.id})} />)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Divider */}
                                    <div className="hidden lg:flex justify-center items-center lg:col-span-1">
                                        <div className="h-full w-px bg-subtle"></div>
                                    </div>

                                    {/* District Section */}
                                    <div className="lg:col-span-6 space-y-3">
                                         <div className="flex justify-between items-center">
                                             <h5 className="font-bold text-gray-900">Listas Distritales</h5>
                                             <button onClick={() => openModal('DISTRICT_LIST', { provinceId: provList.id })} className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir Distrito</button>
                                         </div>
                                        {provList.districtLists.map(distList => (
                                            <CollapsibleSection
                                                key={distList.id}
                                                header={<div className="flex items-center gap-2"><h6 className="font-semibold text-blue-600">{distList.districtName}</h6><button onClick={(e)=>{e.stopPropagation(); openModal('DISTRICT_LIST', { provinceId: provList.id, district: distList })}} className="text-gray-400 hover:text-gray-800"><EditIcon className="w-3 h-3"/></button></div>}
                                                subHeader={`${distList.voters.toLocaleString()} electores`}
                                                className="bg-subtle/50 p-3 rounded-md !border-0"
                                                defaultOpen
                                            >
                                                <div className="space-y-3 pt-2">
                                                     <div>
                                                        <h6 className="font-bold text-sm text-gray-900 mb-2">Alcalde Distrital</h6>
                                                         {distList.mayor ? <ListMayorCard mayor={distList.mayor} onEdit={()=>openModal('DISTRICT_MAYOR', { provinceId: provList.id, districtId: distList.id, mayor: distList.mayor })} onDelete={()=>handleDelete('DISTRICT_MAYOR', {provinceId: provList.id, districtId: distList.id})} /> : <AddEntityButton text="Añadir Alcalde" onClick={() => openModal('DISTRICT_MAYOR', { provinceId: provList.id, districtId: distList.id })} />}
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h6 className="font-bold text-sm text-gray-900">Regidores Distritales</h6>
                                                             <button onClick={() => openModal('DISTRICT_COUNCILOR', { provinceId: provList.id, districtId: distList.id })} className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-colors flex items-center gap-1"><AddIcon className="w-3 h-3"/> Añadir</button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {distList.councilors.sort((a,b)=> a.number - b.number).map(c => <ListCouncilorCard key={c.id} councilor={c} onEdit={() => openModal('DISTRICT_COUNCILOR', { provinceId: provList.id, districtId: distList.id, councilor: c })} onDelete={()=>handleDelete('DISTRICT_COUNCILOR', {provinceId: provList.id, districtId: distList.id, councilorId: c.id})} />)}
                                                        </div>
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
            {modal.type && <Modal isOpen={true} onClose={closeModal} title={getModalTitle()}>{renderModalContent()}</Modal>}
        </div>
    );
};

// Child Components
// ===================================

const DetailItem: React.FC<{ label: string; value: string | number; isCopiable?: boolean }> = ({ label, value, isCopiable }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if(!value) return;
        navigator.clipboard.writeText(value.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="flex justify-between items-center text-sm py-0.5">
            <span className="text-gray-500">{label}:</span>
            <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium text-right">{value}</span>
                {isCopiable && (
                    <button onClick={handleCopy} className="text-gray-400 hover:text-gray-900">
                        {copied ? <span className="text-green-500 text-xs">Copiado</span> : <CopyIcon className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const RegionalCouncilorCard: React.FC<{councilor: Councilor, onEdit:()=>void, onDelete:()=>void}> = ({councilor, onEdit, onDelete}) => (
    <div className="bg-subtle/60 p-3 rounded-lg relative group">
        <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
        </div>
        <p className="font-bold text-gray-900 pr-10">{councilor.name}</p>
        <p className="text-xs text-primary">{councilor.profession}</p>
        <div className="flex flex-wrap gap-2 text-xs mt-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">{councilor.province}</span>
            <span className={`px-2 py-0.5 rounded-full ${councilor.isPrimary ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{councilor.isPrimary ? "Titular" : "Accesitario"}</span>
            <span className={`px-2 py-0.5 rounded-full ${councilor.isAffiliated ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"}`}>{councilor.isAffiliated ? "Afiliado" : "No Afiliado"}</span>
        </div>
        <DetailItem label="DNI" value={councilor.dni} isCopiable/>
        <div className="flex justify-between items-center">
            <DetailItem label="Celular" value={councilor.phone} />
            <a href={`https://wa.me/${councilor.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400"><WhatsAppIcon className="w-5 h-5"/></a>
        </div>
        <div className="flex gap-4 mt-2">
            <a href={councilor.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500"><FacebookIcon className="w-5 h-5" /></a>
            <a href={councilor.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black"><TiktokIcon className="w-5 h-5" /></a>
        </div>
    </div>
);

const ListMayorCard: React.FC<{mayor: ListMayor, onEdit:()=>void, onDelete:()=>void}> = ({mayor, onEdit, onDelete}) => (
    <div className="bg-subtle/60 p-3 rounded-lg relative group">
        <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1 text-gray-500 hover:text-gray-900"><EditIcon className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500"><DeleteIcon className="w-4 h-4" /></button>
        </div>
        <p className="font-semibold text-gray-900 pr-10">{mayor.name}</p>
        <p className="text-xs italic text-gray-600">"{mayor.nickname}"</p>
        <DetailItem label="DNI" value={mayor.dni} isCopiable />
        <DetailItem label="Celular" value={mayor.phone} />
        <DetailItem label="Género" value={mayor.gender} />
        <DetailItem label="Afiliado" value={mayor.isAffiliated ? 'Sí' : 'No'} />
        <div className="flex gap-4 mt-2">
            <a href={mayor.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500"><FacebookIcon className="w-5 h-5" /></a>
            <a href={mayor.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black"><TiktokIcon className="w-5 h-5" /></a>
        </div>
    </div>
);

const ListCouncilorCard: React.FC<{councilor: Councilor, onEdit:()=>void, onDelete:()=>void}> = ({councilor, onEdit, onDelete}) => (
    <div className="bg-white p-2 rounded-md border border-gray-200 flex items-center gap-3 relative group">
        <div className="absolute top-1 right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-800"><EditIcon className="w-3 h-3" /></button>
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500"><DeleteIcon className="w-3 h-3" /></button>
        </div>
        <div className="bg-gray-200 text-gray-700 font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{councilor.number}</div>
        <div className="flex-grow">
            <p className="text-sm font-semibold text-gray-800">{councilor.name}</p>
            <div className="flex items-center gap-4 mt-1">
                 <p className="text-xs text-gray-500">DNI: {councilor.dni}</p>
                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${councilor.isAffiliated ? 'bg-sky-100 text-sky-800' : 'bg-gray-200 text-gray-700'}`}>
                    {councilor.isAffiliated ? "Afiliado" : "No Afiliado"}
                </span>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs">
             <span className={`px-2 py-0.5 rounded-full text-white ${councilor.gender === 'femenino' ? 'bg-pink-500' : 'bg-blue-500'}`}>{councilor.gender.charAt(0).toUpperCase()}</span>
             {councilor.isCommunityQuota && <span className="px-2 py-0.5 rounded-full bg-green-500 text-white">C</span>}
        </div>
    </div>
);

const AddEntityButton: React.FC<{text: string, onClick:()=>void}> = ({text, onClick}) => (
    <button onClick={onClick} className="w-full text-center text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-semibold">
        <AddIcon className="w-4 h-4"/> {text}
    </button>
);


// Forms
// ===================================
interface FormProps {
    regionalBody: RegionalBody;
    onSave: (body: RegionalBody) => void;
    onClose: () => void;
}
const FormButtonRow: React.FC<{onCancel: ()=>void}> = ({onCancel}) => (
    <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancelar</button>
        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md">Guardar</button>
    </div>
);
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`mt-1 block w-full bg-subtle rounded-md p-2 border-gray-300 focus:outline-none focus:ring-primary ${props.className}`} />
);
const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`mt-1 block w-full bg-subtle rounded-md p-2 border-gray-300 focus:outline-none focus:ring-primary ${props.className}`} />
);
const FormLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
    <label className="block text-sm font-medium text-gray-700">{children}</label>
);
const FormCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div className="flex items-center">
        <input type="checkbox" {...props} className="h-4 w-4 text-primary bg-subtle border-gray-300 rounded focus:ring-primary" />
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700">{label}</label>
    </div>
);


const OfficialForm: React.FC<{ official: RegionalOfficial } & FormProps> = ({ official, regionalBody, onSave, onClose }) => {
    const [formData, setFormData] = useState(official);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBody = JSON.parse(JSON.stringify(regionalBody));
        if (newBody.governor.id === formData.id) newBody.governor = formData;
        if (newBody.viceGovernor.id === formData.id) newBody.viceGovernor = formData;
        onSave(newBody);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><FormLabel>Nombre</FormLabel><FormInput type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
            <div><FormLabel>DNI</FormLabel><FormInput type="text" name="dni" value={formData.dni} onChange={handleChange} required /></div>
            <FormButtonRow onCancel={onClose} />
        </form>
    );
};

const RegionalCouncilorForm: React.FC<{ councilor?: Councilor } & FormProps> = ({ councilor, regionalBody, onSave, onClose }) => {
    const [formData, setFormData] = useState(councilor || { name: '', dni: '', phone: '', province: '', profession: '', gender: 'masculino', isAffiliated: false, isPrimary: true, isCommunityQuota: false, facebookUrl: '', tiktokUrl: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBody = JSON.parse(JSON.stringify(regionalBody));
        if (councilor?.id) {
            const index = newBody.regionalCouncilors.findIndex((c: Councilor) => c.id === councilor.id);
            if (index > -1) newBody.regionalCouncilors[index] = { ...newBody.regionalCouncilors[index], ...formData };
        } else {
            newBody.regionalCouncilors.push({ ...formData, id: crypto.randomUUID() });
        }
        onSave(newBody);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><FormLabel>Nombre</FormLabel><FormInput name="name" value={formData.name} onChange={handleChange} required/></div>
                <div><FormLabel>DNI</FormLabel><FormInput name="dni" value={formData.dni} onChange={handleChange} required/></div>
                <div><FormLabel>Celular</FormLabel><FormInput name="phone" value={formData.phone} onChange={handleChange} /></div>
                <div><FormLabel>Provincia a la que postula</FormLabel><FormInput name="province" value={formData.province} onChange={handleChange} /></div>
                <div><FormLabel>Profesión</FormLabel><FormInput name="profession" value={formData.profession} onChange={handleChange} /></div>
                <div><FormLabel>Género</FormLabel><FormSelect name="gender" value={formData.gender} onChange={handleChange}><option value="masculino">Masculino</option><option value="femenino">Femenino</option></FormSelect></div>
                <div><FormLabel>Facebook URL</FormLabel><FormInput name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} /></div>
                <div><FormLabel>TikTok URL</FormLabel><FormInput name="tiktokUrl" value={formData.tiktokUrl} onChange={handleChange} /></div>
                <div className="md:col-span-2 space-y-2">
                    <FormCheckbox label="Es Afiliado" name="isAffiliated" checked={formData.isAffiliated} onChange={handleChange} />
                    <FormCheckbox label="Es Titular (no Accesitario)" name="isPrimary" checked={formData.isPrimary} onChange={handleChange} />
                    <FormCheckbox label="Es Cuota de Comunidad" name="isCommunityQuota" checked={formData.isCommunityQuota} onChange={handleChange} />
                </div>
            </div>
            <FormButtonRow onCancel={onClose} />
        </form>
    );
};

const ProvincialListForm: React.FC<{ province?: ProvincialList } & FormProps> = ({ province, regionalBody, onSave, onClose }) => {
    const [formData, setFormData] = useState({ provinceName: province?.provinceName || '', voters: province?.voters || 0 });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target;
        setFormData(p => ({...p, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBody = JSON.parse(JSON.stringify(regionalBody));
        if(province?.id) {
            const index = newBody.provincialLists.findIndex((p: ProvincialList) => p.id === province.id);
            if(index > -1) newBody.provincialLists[index] = {...newBody.provincialLists[index], ...formData};
        } else {
            newBody.provincialLists.push({ ...formData, id: crypto.randomUUID(), mayor: null, councilors: [], districtLists: []});
        }
        onSave(newBody);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><FormLabel>Nombre de la Provincia</FormLabel><FormInput name="provinceName" value={formData.provinceName} onChange={handleChange} required/></div>
            <div><FormLabel>Población Electoral</FormLabel><FormInput name="voters" type="number" value={formData.voters} onChange={handleChange} required/></div>
            <FormButtonRow onCancel={onClose} />
        </form>
    );
};

const DistrictListForm: React.FC<{ provinceId: string, district?: DistrictList } & FormProps> = ({ provinceId, district, regionalBody, onSave, onClose }) => {
    const [formData, setFormData] = useState({ districtName: district?.districtName || '', voters: district?.voters || 0 });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target;
        setFormData(p => ({...p, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBody = JSON.parse(JSON.stringify(regionalBody));
        const provIndex = newBody.provincialLists.findIndex((p: ProvincialList) => p.id === provinceId);
        if(provIndex === -1) return;

        if(district?.id) {
            const distIndex = newBody.provincialLists[provIndex].districtLists.findIndex((d: DistrictList) => d.id === district.id);
            if(distIndex > -1) newBody.provincialLists[provIndex].districtLists[distIndex] = {...newBody.provincialLists[provIndex].districtLists[distIndex], ...formData};
        } else {
            newBody.provincialLists[provIndex].districtLists.push({ ...formData, id: crypto.randomUUID(), mayor: null, councilors: []});
        }
        onSave(newBody);
    }
    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div><FormLabel>Nombre del Distrito</FormLabel><FormInput name="districtName" value={formData.districtName} onChange={handleChange} required/></div>
            <div><FormLabel>Población Electoral</FormLabel><FormInput name="voters" type="number" value={formData.voters} onChange={handleChange} required/></div>
            <FormButtonRow onCancel={onClose} />
        </form>
    );
}

const ListMayorForm: React.FC<{ provinceId: string, districtId?: string, mayor?: ListMayor } & FormProps> = ({ provinceId, districtId, mayor, regionalBody, onSave, onClose }) => {
    const [formData, setFormData] = useState(mayor || { name: '', nickname: '', dni: '', phone: '', gender: 'masculino', isAffiliated: false, facebookUrl: '', tiktokUrl: ''});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBody = JSON.parse(JSON.stringify(regionalBody));
        const provIndex = newBody.provincialLists.findIndex((p: ProvincialList) => p.id === provinceId);
        if(provIndex === -1) return;

        const mayorData = { ...formData, id: mayor?.id || crypto.randomUUID() };

        if(districtId) { // District Mayor
            const distIndex = newBody.provincialLists[provIndex].districtLists.findIndex((d: DistrictList) => d.id === districtId);
            if(distIndex > -1) newBody.provincialLists[provIndex].districtLists[distIndex].mayor = mayorData;
        } else { // Provincial Mayor
            newBody.provincialLists[provIndex].mayor = mayorData;
        }
        onSave(newBody);
    }

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><FormLabel>Nombres y Apellidos</FormLabel><FormInput name="name" value={formData.name} onChange={handleChange} required/></div>
                <div><FormLabel>Apelativo</FormLabel><FormInput name="nickname" value={formData.nickname} onChange={handleChange} /></div>
                <div><FormLabel>DNI</FormLabel><FormInput name="dni" value={formData.dni} onChange={handleChange} /></div>
                <div><FormLabel>Celular</FormLabel><FormInput name="phone" value={formData.phone} onChange={handleChange} /></div>
                <div><FormLabel>Facebook URL</FormLabel><FormInput name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} /></div>
                <div><FormLabel>TikTok URL</FormLabel><FormInput name="tiktokUrl" value={formData.tiktokUrl} onChange={handleChange} /></div>
                <div><FormLabel>Género</FormLabel><FormSelect name="gender" value={formData.gender} onChange={handleChange}><option value="masculino">Masculino</option><option value="femenino">Femenino</option></FormSelect></div>
                <div className="flex items-end"><FormCheckbox label="Es Afiliado" name="isAffiliated" checked={formData.isAffiliated} onChange={handleChange} /></div>
            </div>
            <FormButtonRow onCancel={onClose} />
        </form>
    );
}

const ListCouncilorForm: React.FC<{ provinceId: string, districtId?: string, councilor?: Councilor } & FormProps> = ({ provinceId, districtId, councilor, regionalBody, onSave, onClose }) => {
    const [formData, setFormData] = useState(councilor || { name: '', dni: '', number: 1, gender: 'masculino', isCommunityQuota: false, isAffiliated: false });
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const finalValue = type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 1 : value);
        setFormData(p => ({ ...p, [name]: finalValue } as any));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBody = JSON.parse(JSON.stringify(regionalBody));
        const provIndex = newBody.provincialLists.findIndex((p: ProvincialList) => p.id === provinceId);
        if(provIndex === -1) return;

        const newCouncilor = { ...formData, id: councilor?.id || crypto.randomUUID() };

        let councilorList: Councilor[] | undefined;

        if(districtId) { // District Councilor
            const distIndex = newBody.provincialLists[provIndex].districtLists.findIndex((d: DistrictList) => d.id === districtId);
            if(distIndex > -1) councilorList = newBody.provincialLists[provIndex].districtLists[distIndex].councilors;
        } else { // Provincial Councilor
            councilorList = newBody.provincialLists[provIndex].councilors;
        }

        if(!councilorList) return;

        if(councilor?.id) {
            const index = councilorList.findIndex(c => c.id === councilor.id);
            if(index > -1) councilorList[index] = newCouncilor as Councilor;
        } else {
            councilorList.push(newCouncilor as Councilor);
        }
        
        onSave(newBody);
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><FormLabel>Nombres y Apellidos</FormLabel><FormInput name="name" value={formData.name} onChange={handleChange} required/></div>
                <div><FormLabel>DNI</FormLabel><FormInput name="dni" value={formData.dni} onChange={handleChange} /></div>
                <div><FormLabel>Número en Lista</FormLabel><FormInput name="number" type="number" value={formData.number} onChange={handleChange} required/></div>
                <div><FormLabel>Género</FormLabel><FormSelect name="gender" value={formData.gender} onChange={handleChange}><option value="masculino">Masculino</option><option value="femenino">Femenino</option></FormSelect></div>
                <div className="flex flex-col justify-end space-y-3 pt-2">
                    <FormCheckbox label="Es Cuota de Comunidad" name="isCommunityQuota" checked={!!formData.isCommunityQuota} onChange={handleChange} />
                    <FormCheckbox label="Es Afiliado" name="isAffiliated" checked={!!formData.isAffiliated} onChange={handleChange} />
                </div>
            </div>
            <FormButtonRow onCancel={onClose} />
        </form>
    );
};

export default RegionalBodyTab;