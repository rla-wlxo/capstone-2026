import { initMap, findNearbyHotspot } from './map.js';

window.onload = () => {
    initMap();
    const recommendBtn = document.getElementById('recommendBtn');
    if (recommendBtn) {
        // .onclick 보다는 addEventListener를 더 권장합니다 (모듈 환경 안전성)
        recommendBtn.addEventListener('click', findNearbyHotspot);
    }
};