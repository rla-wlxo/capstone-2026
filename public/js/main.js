document.getElementById('recommendBtn').addEventListener('click', findNearbyHotspot);

async function findNearbyHotspot() {
    const resultDiv = document.getElementById('result');
    const listDiv = document.getElementById('recommendationList');
    const distanceLimit = document.getElementById('distanceSelect').value;
    
    if (!navigator.geolocation) {
        alert("브라우저가 위치 정보를 지원하지 않습니다.");
        return;
    }

    // 버튼 비활성화 (중복 클릭 방지)
    const btn = document.getElementById('recommendBtn');
    btn.disabled = true;
    btn.innerText = "찾는 중...";

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            // 백엔드 recommend API 호출 (거리 파라미터 추가)
            const response = await fetch(`/api/recommend?userLat=${latitude}&userLng=${longitude}&distLimit=${distanceLimit}`);
            const data = await response.json();

            if (response.ok && data.recommendations.length > 0) {
                resultDiv.style.display = 'block';
                listDiv.innerHTML = ''; // 이전 결과 초기화

                data.recommendations.forEach(place => {
                    const item = document.createElement('div');
                    item.className = 'place-card';
                    item.innerHTML = `
                        <h3>📍 ${place.장소} <small>(${place.거리}km)</small></h3>
                        <p>혼잡도: <span class="congest-${place.혼잡도}">${place.혼잡도}</span></p>
                        <p>${place.상세메시지}</p>
                        <hr>
                    `;
                    listDiv.appendChild(item);
                });
            } else {
                alert("해당 범위 내에 '여유' 또는 '보통'인 장소가 없습니다.");
            }
        } catch (error) {
            console.error("에러 발생:", error);
            alert("서버와 통신 중 에러가 발생했습니다.");
        } finally {
            btn.disabled = false;
            btn.innerText = "내 위치 기반 추천받기";
        }
    }, (error) => {
        alert("위치 정보를 가져오는데 실패했습니다.");
        btn.disabled = false;
        btn.innerText = "내 위치 기반 추천받기";
    });
}