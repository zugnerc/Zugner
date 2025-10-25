import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from '../icons';

interface CollapsibleSectionProps {
    header: ReactNode;
    subHeader?: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
    actionButton?: ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ header, subHeader, children, defaultOpen = false, className = '', actionButton }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`border-b border-subtle last:border-b-0 py-2 ${className}`}>
            <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-grow">
                    {header}
                    {subHeader && <p className="text-xs text-gray-500">{subHeader}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {actionButton}
                  <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="pt-2">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleSection;