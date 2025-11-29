import { useState, useEffect } from 'react';
import { BrainDumpList } from '../types';

export function useBrainDumpManager(initialLists: BrainDumpList[]) {
    const [lists, setLists] = useState<BrainDumpList[]>(initialLists);

    const addList = () => {
        const newList: BrainDumpList = {
            id: Math.random().toString(36).substr(2, 9),
            title: `List ${lists.length + 1}`,
            content: ''
        };
        setLists(prev => [...prev, newList]);
    };

    const updateList = (id: string, content: string) => {
        setLists(prev => prev.map(l => l.id === id ? { ...l, content } : l));
    };

    const updateTitle = (id: string, title: string) => {
        setLists(prev => prev.map(l => l.id === id ? { ...l, title } : l));
    };

    const deleteList = (id: string) => {
        setLists(prev => prev.filter(l => l.id !== id));
    };

    return { lists, setLists, addList, updateList, updateTitle, deleteList };
}
