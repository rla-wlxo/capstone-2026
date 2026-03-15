export let map;
export let markers = [];

//  페이지 로드 시 가장 먼저 호출되는 함수
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

// 실제 카카오 맵을 생성하는 함수
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

/** 지도를 특정 좌표로 이동 (지도 미생성 시 생성) */
export function moveMapTo(lat, lng) {
    if (map) {
        map.setCenter(new kakao.maps.LatLng(lat, lng));
        // 부드럽게 이동하고 싶다면 map.panTo(...) 사용
    } else {
        renderMap(lat, lng);
    }
}

/** 장소 데이터 배열을 받아 마커를 찍고 지도를 맞춤 조절하는 함수 */
export function setMarkersAndBounds(places) {
    if (!map) {
        console.log("지도가 아직 준비되지 않아 0.1초 후 재시도합니다.");
        setTimeout(() => setMarkersAndBounds(places), 100);
        return;
    }

    clearMarkers();
    const bounds = new kakao.maps.LatLngBounds();
    let hasValidCoords = false;

    places.forEach(place => {
        // 1. 좌표 추출 및 확실하게 숫자(Number)로 변환
        const rawLat = place.좌표.lat || place.위도 || place.lat;
        const rawLng = place.좌표.lng || place.경도 || place.lng;
        
        const lat = Number(rawLat);
        const lng = Number(rawLng);

        // 2. 숫자인지, 유효한 값인지 꼼꼼히 체크
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            const position = new kakao.maps.LatLng(lat, lng);
            const marker = new kakao.maps.Marker({
                map: map,
                position: position,
                title: place.장소 || place.placeName
            });
            
            markers.push(marker);
            bounds.extend(position);
            hasValidCoords = true;
        } else {
            console.warn("⚠ 유효하지 않은 좌표 데이터 발견:", place);
        }
    });

    if (hasValidCoords) {
        // 3. 지도가 화면에 그려진 후 정확한 범위를 잡기 위해 약간의 지연을 주거나 relayout 호출
        map.relayout(); 
        map.setBounds(bounds);
        console.log(`✅ ${markers.length}개의 마커 표시 및 범위 조정 완료`);
    } else {
        console.error("❌ 표시할 유효한 좌표가 하나도 없습니다.");
    }
}

/** 기존 마커들을 모두 지우는 함수 */
export function clearMarkers() {
    if (markers) {
        markers.forEach(marker => marker.setMap(null));
    }
    markers = [];
}


// 카카오 맵이 로드될 때까지 기다리는 함수 (아래 함수들에서 사용)
export function waitForKakaoMaps() {
    return new Promise((resolve) => {
        const check = () => {
            if (typeof kakao !== 'undefined' && kakao.maps && typeof kakao.maps.load === 'function') {
                kakao.maps.load(resolve);
                return;
            }
            setTimeout(check, 50);
        };
        check();
    });
}

// 검색 실행 공통 로직
export async function performSearch(lat, lng) {
    const detailPanel = document.getElementById('detailPanel');
    if (detailPanel) {
        detailPanel.classList.add('hidden');
    }
    
    const dist = document.getElementById('distanceSelect')?.value;
    const cong = document.getElementById('congestionSelect')?.value;
    
    // 자동 모드일 때는 거리/혼잡도 필터링 적용, 수동 모드일 때는 위치만 보내서 검색
    if(locationModeSelect.value === 'auto') {
        try {
            const response = await fetch(`/api/recommend?userLat=${lat}&userLng=${lng}&distLimit=${dist}&congestionLimit=${cong}`);
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
    else {  //수동모드
        try {
            const response = await fetch(`/api/search?userLat=${lat}&userLng=${lng}`);
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
}

/** 특정 인덱스의 마커를 위로 띄우거나 원래대로 돌리는 함수 */
export function highlightMarker(index, isHighlighted) {
    const marker = markers[index];
    if (!marker) return;

    const currentPos = marker.getPosition();
    const offset = 0.0005; // 위로 올릴 위도 값 (적절히 조절 가능)

    if (isHighlighted) {
        // 원래 위치를 저장해두지 않았다면 저장 (커스텀 속성 사용)
        if (!marker.originalPos) {
            marker.originalPos = currentPos;
        }
        // 위도(lat)를 살짝 높여서 설정
        const newPos = new kakao.maps.LatLng(marker.originalPos.getLat() + offset, marker.originalPos.getLng());
        marker.setPosition(newPos);
        marker.setZIndex(10); // 다른 마커보다 위에 보이게 설정
    } else {
        // 원래 위치로 복구
        if (marker.originalPos) {
            marker.setPosition(marker.originalPos);
            marker.setZIndex(3);
        }
    }
}