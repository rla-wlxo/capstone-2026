import { waitForKakaoMaps } from '../renderMap.js';

/** GPS 현재 위치 좌표 가져오기 */
export function getCurrentCoords() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('GPS 미지원'));
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(err)
        );
    });
}

/** 키워드/주소로 좌표 찾기 */
export async function getSearchCoords(query) {
    await waitForKakaoMaps();
    return new Promise((resolve, reject) => {
        const places = new kakao.maps.services.Places();
        const geocoder = new kakao.maps.services.Geocoder();

        // 키워드 검색 시도
        places.keywordSearch(query, (data, status) => {
            if (status === kakao.maps.services.Status.OK && data[0]) {
                resolve({ lat: Number(data[0].y), lng: Number(data[0].x) });
                return;
            } else {
                // 키워드 실패 시 주소 검색 시도
                geocoder.addressSearch(query, (results, status2) => {
                    if (status2 === kakao.maps.services.Status.OK && results[0]) {
                        resolve({ lat: Number(results[0].y), lng: Number(results[0].x) });
                        return;
                    } else {
                        reject(new Error('검색 결과 없음'));
                    }
                });
            }
        });
    });
}
