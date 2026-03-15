import { initMap } from './renderMap.js';
import {findNearbyHotspot, setupLocationControls} from './findPlace.js'; 
import { initHorizontalScroll } from './utils/horizontalScroll.js';

window.onload = () => {
    initMap();
    setupLocationControls();
    initHorizontalScroll();


    const recommendBtn = document.getElementById('recommendBtn');
    const closeBtn = document.getElementById('closeDetailBtn');
    const panel = document.getElementById('detailPanel');

    if (recommendBtn) {
        recommendBtn.addEventListener('click', findNearbyHotspot);
    }
   
    if (closeBtn) {
        closeBtn.onclick = () => {
        panel.classList.add('hidden');
    };
}
};