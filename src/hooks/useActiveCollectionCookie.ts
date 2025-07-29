import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface ActiveCollectionCookie {
    collectionId: string;
    collectionItemIds: string[];
}

export const useActiveCollectionCookie = () => {
    const [activeCollection, setActiveCollection] = useState<ActiveCollectionCookie | undefined>(undefined);

    useEffect(() => {
        const cookie = Cookies.get('activeCollection');
        if (cookie) {
            try {
                setActiveCollection(JSON.parse(cookie));
            } catch (error) {
                console.error('Error parsing active collection cookie:', error);
                Cookies.remove('activeCollection');
            }
        }
    }, []);

    const createActiveCollection = (collectionId: string, itemId: string | string[]) => {
        const newCollection: ActiveCollectionCookie = {
            collectionId,
            collectionItemIds: Array.isArray(itemId) ? itemId : [itemId]
        };
        Cookies.set('activeCollection', JSON.stringify(newCollection), { expires: 7 }); // 7 gün geçerli
        setActiveCollection(newCollection);
    };

    const updateActiveCollection = (itemId: string) => {
        if (!activeCollection) return;

        if (activeCollection.collectionItemIds.includes(itemId)) {
            console.log('Item already exists in collection:', itemId);
            return;
        }

        const updatedCollection: ActiveCollectionCookie = {
            ...activeCollection,
            collectionItemIds: [...activeCollection.collectionItemIds, itemId]
        };
        Cookies.set('activeCollection', JSON.stringify(updatedCollection), { expires: 7 });
        setActiveCollection(updatedCollection);
    };

    const addMultipleActiveCollection = (collectionId: string, itemIds: string[]) => {
        if (!activeCollection) {
            createActiveCollection(collectionId, itemIds);
            return
        }

        if (activeCollection.collectionItemIds.some(id => itemIds.includes(id))) {
            console.log('Item already exists in collection:', itemIds);
            return;
        }

        const updatedCollection: ActiveCollectionCookie = {
            ...activeCollection,
            collectionItemIds: [...activeCollection.collectionItemIds, ...itemIds]
        };

        if (updatedCollection.collectionItemIds.length === 0) {
            deleteActiveCollection();
            return;
        }

        Cookies.set('activeCollection', JSON.stringify(updatedCollection), { expires: 7 });
        setActiveCollection(updatedCollection);
    }

    const removeFromActiveCollection = (itemId: string) => {
        if (!activeCollection) return;

        const updatedCollection: ActiveCollectionCookie = {
            ...activeCollection,
            collectionItemIds: activeCollection.collectionItemIds.filter(id => id !== itemId)
        };

        if (updatedCollection.collectionItemIds.length === 0) {
            deleteActiveCollection();
            return;
        }

        Cookies.set('activeCollection', JSON.stringify(updatedCollection), { expires: 7 });
        setActiveCollection(updatedCollection);
    };

    const removeMultipleFromActiveCollection = (itemIds: string[]) => {
        if (!activeCollection) return;

        const updatedCollection: ActiveCollectionCookie = {
            ...activeCollection,
            collectionItemIds: activeCollection.collectionItemIds.filter(id => !itemIds.includes(id))
        };

        if (updatedCollection.collectionItemIds.length === 0) {
            deleteActiveCollection();
            return;
        }

        Cookies.set('activeCollection', JSON.stringify(updatedCollection), { expires: 7 });
        setActiveCollection(updatedCollection);
    };

    const deleteActiveCollection = () => {
        Cookies.remove('activeCollection');
        setActiveCollection(undefined);
    };

    const canAddToCart = (collectionId: string): boolean => {
        console.log(activeCollection)
        if (!activeCollection) return true;
        return activeCollection.collectionId === collectionId;
    };

    return {
        activeCollection,
        createActiveCollection,
        updateActiveCollection,
        addMultipleActiveCollection,
        removeFromActiveCollection,
        removeMultipleFromActiveCollection,
        deleteActiveCollection,
        canAddToCart
    };
}; 