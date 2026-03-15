import { performSearch } from './components/addCardRow.js';
import { getSearchCoords } from './services/locationService.js';
import { moveMapTo } from './renderMap.js';

// 수동 입력 UI 보이기/숨기기 함수(유저가 옵션에서 선택하면 작동하게 뒤에서 사용)
function setManualControlsVisible(visible) {
    const row = document.getElementById('manualLocationRow');
    const autoFields = document.getElementById('autoLocationFields');

    if (!row || !autoFields) return;

    // 1. 수동 입력창 제어 (visible이 true면 보임)
    row.classList.toggle('hidden', !visible);

    // 2. 현재 위치 관련 UI 제어 (visible이 true면 숨김)
    autoFields.classList.toggle('hidden', visible);
}


export function setupLocationControls() {
    const modeSelect = document.getElementById('locationModeSelect');
    const applyBtn = document.getElementById('manualLocationApplyBtn');
    const input = document.getElementById('manualLocationInput');

    // 모드 변경 UI 토글
    modeSelect?.addEventListener('change', async () => {
        const isManual = modeSelect.value === 'manual';
        setManualControlsVisible(isManual);
    });

    // 검색 실행 공통 로직 (버튼 클릭 & 엔터키)
    const execManualSearch = async () => {
        const query = input?.value?.trim();
        if (!query) return alert("위치를 입력해 주세요.");

        try {
            const coords = await getSearchCoords(query);
            console.log(`✅ 검색 성공: ${query} -> (${coords.lat}, ${coords.lng})`);
            moveMapTo(coords.lat, coords.lng);
            await performSearch(coords.lat, coords.lng);
        } catch (e) {
            alert("입력하신 위치를 찾을 수 없습니다.");
        }
    };

    applyBtn?.addEventListener('click', execManualSearch);
    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') execManualSearch();
    });
}



//근방 장소 혼잡도 조회
export async function findNearbyHotspot() {
    const listDiv = document.getElementById('recommendationList');
    const distanceLimit = document.getElementById('distanceSelect').value;
    const congestionLimit = document.getElementById('congestionSelect')?.value;
    const btn = document.getElementById('recommendBtn');

    if (!navigator.geolocation) {
        alert("브라우저가 위치 정보를 지원하지 않습니다.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "🔍 찾는 중...";

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        performSearch(latitude, longitude);
        btn.disabled = false;
        btn.innerText = "추천받기";
    }, () => {
        alert("위치 정보를 가져오는데 실패했습니다.");
        btn.disabled = false;
        btn.innerText = "추천받기";
    });
}

