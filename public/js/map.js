export let map;

// 1. 페이지 로드 시 가장 먼저 호출되는 함수
export function initMap() {
    // 사용자의 현재 위치를 요청
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude; // 위도
            const lon = position.coords.longitude; // 경도
            
            // 위치를 성공적으로 가져오면 해당 좌표로 지도를 그림
            renderMap(lat, lon);
        }, (error) => {
            console.error("위치 정보를 가져오지 못했습니다. 기본 위치를 사용합니다.");
            renderMap(37.5665, 126.9780); // 실패 시 서울시청
        });
    } else {
        renderMap(37.5665, 126.9780); // 지원하지 않는 브라우저일 때
    }
}

// 2. 실제 카카오 맵을 생성하는 함수
export function renderMap(lat, lon) {
    if (typeof kakao !== 'undefined' && kakao.maps) {
        kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(lat, lon), // 전달받은 좌표로 설정
                level: 3
            };
            map = new kakao.maps.Map(container, options);
            console.log(`✅ 지도 로드 완료 (좌표: ${lat}, ${lon})`);
        });
    } else {
        // 아직 카카오 라이브러리가 로드 전이라면 재시도
        setTimeout(() => renderMap(lat, lon), 100);
    }
}

export async function findNearbyHotspot() {
    const listDiv = document.getElementById('recommendationList');
    const distanceLimit = document.getElementById('distanceSelect').value;
    const btn = document.getElementById('recommendBtn');

    if (!navigator.geolocation) {
        alert("브라우저가 위치 정보를 지원하지 않습니다.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "🔍 찾는 중...";

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const congestionLimit = document.getElementById('congestionSelect').value;
        try {
            // 지도 중심을 내 위치로 이동
            const userLoc = new kakao.maps.LatLng(latitude, longitude);
            map.setCenter(userLoc);

            const response = await fetch(`/api/recommend?userLat=${latitude}&userLng=${longitude}&distLimit=${distanceLimit}&congestionLimit=${congestionLimit}`);
            const data = await response.json();

            if (response.ok && data.recommendations.length > 0) {
                listDiv.innerHTML = ''; // 이전 결과 초기화

                // main.js 내부의 findNearbyHotspot 함수 중 리스트 생성 부분
                data.recommendations.forEach(place => {
                    const item = document.createElement('div');
                    item.className = 'place-card';
                    
                    // 카드 클릭 시 지도를 해당 위치로 이동
                    // main.js 수정 예시
                    item.onclick = () => {
                        // 서버가 주는 필드명이 '위도', '경도'인지 확인하세요!
                        const lat = place.latitude || place.위도; 
                        const lng = place.longitude || place.경도;

                        if (lat && lng) {
                            const moveLatLon = new kakao.maps.LatLng(lat, lng);
                            map.panTo(moveLatLon);
                        }
                    };

                    item.innerHTML = `
                        <h3> ${place.장소}</h3>
                        <p>거리: <strong>${place.거리}km</strong></p>
                        <p>혼잡도: <span class="congest-${place.혼잡도}">${place.혼잡도}</span></p>
                        <p style="font-size:0.85rem; color:#666; margin-top:5px;">${place.상세메시지}</p>
                    `;
                    listDiv.appendChild(item);
                });
            } else {
                alert("해당 범위 내에 조건에 맞는 장소가 없습니다.");
            }
        } catch (error) {
            console.error("에러 발생:", error);
            alert("서버와 통신 중 에러가 발생했습니다.");
        } finally {
            btn.disabled = false;
            btn.innerText = "추천받기";
        }
    }, () => {
        alert("위치 정보를 가져오는데 실패했습니다.");
        btn.disabled = false;
        btn.innerText = "추천받기";
    });
}
