import React, { createContext, useState, useContext } from 'react';

// Create Context
const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <SelectionContext.Provider value={{ selectedItems, setSelectedItems, selectedRows, setSelectedRows }}>
            {children}
        </SelectionContext.Provider>
    );
};

// Custom Hook to use the Context
export const useSelection = () => useContext(SelectionContext);
