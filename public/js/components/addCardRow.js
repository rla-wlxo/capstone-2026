import {map, setMarkersAndBounds,moveMapTo, highlightMarker} from '../renderMap.js';
import { initHorizontalScroll } from '../utils/horizontalScroll.js';
/**
 * 추천 장소 리스트를 UI에 렌더링하는 함수
 * @param {Array} recommendations - 서버에서 받은 장소 데이터 배열
 */
export function renderPlaceList(recommendations) {
    const listDiv = document.getElementById('recommendationList');
    if (!listDiv) return;

    listDiv.innerHTML = ''; // 1. 이전 결과 초기화

    if (!recommendations || recommendations.length === 0) {
        listDiv.innerHTML = '<p class="no-result">주변에 장소가 없습니다.</p>';
        return;
    }

    // 2. 반복문 안에서는 '카드 생성'만 집중!
    recommendations.forEach((place, index) => {
        const item = document.createElement('div');
        item.className = 'place-card';
        
        const lat = place.latitude || place.위도; 
        const lng = place.longitude || place.경도;

        // 1. 카드 자체 클릭 시 이동 (기존 로직 유지)
        item.onclick = () => {
            if (lat && lng && typeof map !== 'undefined') {
                const moveLatLon = new kakao.maps.LatLng(lat, lng);
                map.panTo(moveLatLon);
            }
        };
        
        item.onmouseenter = () => highlightMarker(index, true);
        item.onmouseleave = () => highlightMarker(index, false);

        item.innerHTML = `
            <div class="place-info">
                <h3>${place.장소}</h3>
                <p>거리: <strong>${place.거리}km</strong></p>
                <p>혼잡도: <span class="congest-${place.혼잡도}">${place.혼잡도}</span></p>
                <button class="detail-btn">상세 정보</button>
            </div>
        `;

        // 2. 상세 정보 버튼 이벤트 설정 (중복 제거 및 수정)
        const detailBtn = item.querySelector('.detail-btn');
        detailBtn.onclick = (e) => {
            e.stopPropagation(); // 카드 클릭 이벤트가 중복 발생하지 않도록 차단 
            openDetailPanel(place); // 상세 패널을 열고 지도를 이동시킴 
        };

        listDiv.appendChild(item);
    });

    // 3. 반복문이 다 끝난 뒤 "딱 한 번씩만" 호출 (성능 핵심)
    initHorizontalScroll(); 
    setMarkersAndBounds(recommendations);
}

// 검색 실행 공통 로직
export async function performSearch(lat, lng) {
    const detailPanel = document.getElementById('detailPanel');
    if (detailPanel) {
        detailPanel.classList.add('hidden');
    }
    
    const modeSelect = document.getElementById('locationModeSelect');
    const mode = modeSelect ? modeSelect.value : 'auto';
    const dist = document.getElementById('distanceSelect')?.value;
    const cong = document.getElementById('congestionSelect')?.value;
    
    let url = (mode === 'auto') 
        ? `/api/recommend?userLat=${lat}&userLng=${lng}&distLimit=${dist}&congestionLimit=${cong}`
        : `/api/search?userLat=${lat}&userLng=${lng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.recommendations?.length > 0) {
            renderPlaceList(data.recommendations);
        } else {
            alert('조건에 맞는 장소가 없습니다.');
        }
    } catch (error) {
        console.error("검색 실패:", error);
        alert("데이터를 가져오는 중 오류가 발생했습니다.");
    }
}

// 상세 패널 열기 함수
function openDetailPanel(place) {
    const panel = document.getElementById('detailPanel');
    const title = document.getElementById('detailTitle');
    if (title) title.innerText = place.장소 || "알 수 없는 장소"; 
    document.getElementById('detailTitle').innerText = place.장소;

    const congestionEl = document.getElementById('detailCongestion');
    if (congestionEl) congestionEl.innerText = `혼잡도: ${place.혼잡도}`;  
    const distanceEl = document.getElementById('detailDistance');
    if (distanceEl) distanceEl.innerText = `거리: ${place.거리}km`;
    panel.classList.remove('hidden');

    // 지도 중심 이동
    const lat = place.latitude || place.좌표.lat - 0.025; // 상세 패널이 지도 마커를 가리지 않도록 약간 위로 이동
    const lng = place.longitude || place.좌표.lng; // 상세 패널이 지도 마커를 가리지 않도록 약간 오른쪽으로 이동
    
    console.log(`상세 패널 열기: ${place.장소} (${lat}, ${lng})`);
    if (lat && lng) {
        moveMapTo(lat , lng );
    }
}