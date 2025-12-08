import { useEffect } from 'react';

function cleanupExpiredRoastCache() {
    try {
        const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
        const now = Date.now();
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Removes expired roasts 30 days or older since they are unlikely to be used again
            if (key && key.startsWith('strava_roast_') || key.startsWith('strava_week_roast_')) {
                try {
                    const cached = localStorage.getItem(key);
                    const cacheData = JSON.parse(cached);
                    
                    if (now - cacheData.timestamp > CACHE_DURATION) {
                        keysToRemove.push(key);
                    }
                } catch (err) {
                    // Corrupted entry, remove it
                    keysToRemove.push(key);
                }
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        if (keysToRemove.length > 0) {
            console.log(`Cleaned up ${keysToRemove.length} expired roast(s) from cache`);
        }
    } catch (err) {
        console.error('Error cleaning up expired cache:', err);
    }
}

export default function useRoastCacheCleanup() {
    useEffect(() => {
        cleanupExpiredRoastCache();
    }, []);
}