import React, { createContext, useContext, useState } from 'react';
import './tabs.css';

const TabsContext = createContext();

export const Tabs = ({ value, onValueChange, children, className = '' }) => {
    const [activeTab, setActiveTab] = useState(value);

    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
            <div className={`tabs ${className}`}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className = '' }) => {
    return (
        <div className={`tabs-list ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger = ({ value, children, className = '' }) => {
    const { activeTab, onTabChange } = useContext(TabsContext);
    const isActive = activeTab === value;

    return (
        <button
            className={`tabs-trigger ${isActive ? 'active' : ''} ${className}`}
            onClick={() => onTabChange(value)}
            type="button"
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, children, className = '' }) => {
    const { activeTab } = useContext(TabsContext);
    
    if (activeTab !== value) {
        return null;
    }

    return (
        <div className={`tabs-content ${className}`}>
            {children}
        </div>
    );
};