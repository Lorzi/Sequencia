import {useEffect} from 'react';

/**
 * Allows the resize of the windows and adapt the page with it
 */
export const adjustedZoomValue = () => {
    document.body.style.zoom = (window.innerWidth / 1920).toString();
};

/**
 * Handling window resize and adjust zoom.
 */
export const useAdjustedZoom = () => {
    useEffect(() => {
        adjustedZoomValue();
        window.addEventListener('resize', adjustedZoomValue);
        return () => {
            window.removeEventListener('resize', adjustedZoomValue);
        };
    }, []);
};

