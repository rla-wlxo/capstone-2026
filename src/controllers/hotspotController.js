const axios = require('axios');
const KEY = process.env.SEOUL_API_KEY;

const seoulHotspots = [
    // --- 관광특구 ---
    { name: "강남 MICE 관광특구", lat: 37.5131, lng: 127.0586 },
    { name: "동대문 관광특구", lat: 37.5665, lng: 127.0092 },
    { name: "명동 관광특구", lat: 37.5635, lng: 126.9842 },
    { name: "이태원 관광특구", lat: 37.5345, lng: 126.9946 },
    { name: "잠실 관광특구", lat: 37.5133, lng: 127.1001 },
    { name: "종로·청계 관광특구", lat: 37.5699, lng: 126.9972 },
    { name: "홍대 관광특구", lat: 37.5565, lng: 126.9239 },

    // --- 고궁 및 문화유산 ---
    { name: "경복궁", lat: 37.5796, lng: 126.9770 },
    { name: "광화문·덕수궁", lat: 37.5658, lng: 126.9751 },
    { name: "보신각", lat: 37.5699, lng: 126.9852 },
    { name: "서울 암사동 유적", lat: 37.5600, lng: 127.1308 },
    { name: "창덕궁·종묘", lat: 37.5794, lng: 126.9910 },

    // --- 인구 밀집 지역 (지하철역 주변) ---
    { name: "가산디지털단지역", lat: 37.4812, lng: 126.8827 },
    { name: "강남역", lat: 37.4979, lng: 127.0276 },
    { name: "건대입구역", lat: 37.5404, lng: 127.0692 },
    { name: "고덕역", lat: 37.5549, lng: 127.1551 },
    { name: "고속터미널역", lat: 37.5045, lng: 127.0050 },
    { name: "교대역", lat: 37.4934, lng: 127.0141 },
    { name: "구로디지털단지역", lat: 37.4852, lng: 126.9015 },
    { name: "구로역", lat: 37.5031, lng: 126.8820 },
    { name: "군자역", lat: 37.5571, lng: 127.0795 },
    { name: "대림역", lat: 37.4931, lng: 126.8963 },
    { name: "동대문역", lat: 37.5714, lng: 127.0109 },
    { name: "뚝섬역", lat: 37.5471, lng: 127.0473 },
    { name: "미아사거리역", lat: 37.6133, lng: 127.0298 },
    { name: "발산역", lat: 37.5585, lng: 126.8377 },
    { name: "사당역", lat: 37.4765, lng: 126.9815 },
    { name: "삼각지역", lat: 37.5348, lng: 126.9731 },
    { name: "서울대입구역", lat: 37.4812, lng: 126.9527 },
    { name: "서울식물원·마곡나루역", lat: 37.5670, lng: 126.8293 },
    { name: "서울역", lat: 37.5546, lng: 126.9706 },
    { name: "선릉역", lat: 37.5044, lng: 127.0489 },
    { name: "성신여대입구역", lat: 37.5926, lng: 127.0164 },
    { name: "수유역", lat: 37.6384, lng: 127.0257 },
    { name: "신논현역·논현역", lat: 37.5044, lng: 127.0245 },
    { name: "신도림역", lat: 37.5088, lng: 126.8912 },
    { name: "신림역", lat: 37.4842, lng: 126.9296 },
    { name: "신촌·이대역", lat: 37.5591, lng: 126.9432 },
    { name: "양재역", lat: 37.4841, lng: 127.0346 },
    { name: "역삼역", lat: 37.5006, lng: 127.0363 },
    { name: "연신내역", lat: 37.6189, lng: 126.9208 },
    { name: "오목교역·목동운동장", lat: 37.5244, lng: 126.8754 },
    { name: "왕십리역", lat: 37.5612, lng: 127.0384 },
    { name: "용산역", lat: 37.5298, lng: 126.9647 },
    { name: "이태원역", lat: 37.5344, lng: 126.9936 },
    { name: "장지역", lat: 37.4787, lng: 127.1261 },
    { name: "장한평역", lat: 37.5614, lng: 127.0645 },
    { name: "천호역", lat: 37.5386, lng: 127.1232 },
    { name: "총신대입구(이수)역", lat: 37.4862, lng: 126.9819 },
    { name: "충정로역", lat: 37.5596, lng: 126.9636 },
    { name: "합정역", lat: 37.5494, lng: 126.9123 },
    { name: "혜화역", lat: 37.5821, lng: 127.0019 },
    { name: "홍대입구역(2호선)", lat: 37.5575, lng: 126.9244 },
    { name: "회기역", lat: 37.5894, lng: 127.0578 },
    { name: "신정네거리역", lat: 37.5200, lng: 126.8529 },
    { name: "잠실새내역", lat: 37.5115, lng: 127.0859 },
    { name: "잠실역", lat: 37.5133, lng: 127.1001 },

    // --- 발달 상권 및 골목 상권 ---
    { name: "가락시장", lat: 37.4925, lng: 127.1147 },
    { name: "가로수길", lat: 37.5203, lng: 127.0231 },
    { name: "광장(전통)시장", lat: 37.5701, lng: 126.9993 },
    { name: "김포공항", lat: 37.5587, lng: 126.7944 },
    { name: "노량진", lat: 37.5133, lng: 126.9413 },
    { name: "덕수궁길·정동길", lat: 37.5657, lng: 126.9724 },
    { name: "북촌한옥마을", lat: 37.5829, lng: 126.9835 },
    { name: "서촌", lat: 37.5802, lng: 126.9712 },
    { name: "성수카페거리", lat: 37.5445, lng: 127.0560 },
    { name: "쌍문역", lat: 37.6486, lng: 127.0346 },
    { name: "압구정로데오거리", lat: 37.5274, lng: 127.0393 },
    { name: "여의도", lat: 37.5215, lng: 126.9242 },
    { name: "연남동", lat: 37.5621, lng: 126.9245 },
    { name: "영등포 타임스퀘어", lat: 37.5171, lng: 126.9040 },
    { name: "용리단길", lat: 37.5298, lng: 126.9691 },
    { name: "이태원 앤틱가구거리", lat: 37.5342, lng: 126.9961 },
    { name: "인사동", lat: 37.5717, lng: 126.9860 },
    { name: "창동 신경제 중심지", lat: 37.6531, lng: 127.0474 },
    { name: "청담동 명품거리", lat: 37.5252, lng: 127.0435 },
    { name: "청량리 제기동 일대 전통시장", lat: 37.5806, lng: 127.0441 },
    { name: "해방촌·경리단길", lat: 37.5385, lng: 126.9869 },
    { name: "DDP(동대문디자인플라자)", lat: 37.5665, lng: 127.0092 },
    { name: "DMC(디지털미디어시티)", lat: 37.5772, lng: 126.8913 },
    { name: "북창동 먹자골목", lat: 37.5626, lng: 126.9790 },
    { name: "남대문시장", lat: 37.5591, lng: 126.9776 },
    { name: "익선동", lat: 37.5743, lng: 126.9897 },
    { name: "잠실롯데타워 일대", lat: 37.5137, lng: 127.1044 },
    { name: "송리단길·호수단길", lat: 37.5091, lng: 127.1042 },
    { name: "신촌 스타광장", lat: 37.5557, lng: 126.9369 },

    // --- 공원 및 자연 ---
    { name: "강서한강공원", lat: 37.5862, lng: 126.8143 },
    { name: "고척돔", lat: 37.4981, lng: 126.8671 },
    { name: "광나루한강공원", lat: 37.5488, lng: 127.1239 },
    { name: "광화문광장", lat: 37.5709, lng: 126.9779 },
    { name: "국립중앙박물관·용산가족공원", lat: 37.5238, lng: 126.9804 },
    { name: "난지한강공원", lat: 37.5707, lng: 126.8797 },
    { name: "남산공원", lat: 37.5512, lng: 126.9882 },
    { name: "노들섬", lat: 37.5173, lng: 126.9585 },
    { name: "뚝섬한강공원", lat: 37.5287, lng: 127.0682 },
    { name: "망원한강공원", lat: 37.5559, lng: 126.9020 },
    { name: "반포한강공원", lat: 37.5098, lng: 126.9947 },
    { name: "북서울꿈의숲", lat: 37.6217, lng: 127.0416 },
    { name: "서리풀공원·몽마르뜨공원", lat: 37.4927, lng: 127.0031 },
    { name: "서울광장", lat: 37.5664, lng: 126.9779 },
    { name: "서울대공원", lat: 37.4275, lng: 127.0169 },
    { name: "서울숲공원", lat: 37.5443, lng: 127.0374 },
    { name: "아차산", lat: 37.5518, lng: 127.1022 },
    { name: "양화한강공원", lat: 37.5383, lng: 126.8961 },
    { name: "어린이대공원", lat: 37.5495, lng: 127.0775 },
    { name: "여의도한강공원", lat: 37.5284, lng: 126.9332 },
    { name: "월드컵공원", lat: 37.5677, lng: 126.8854 },
    { name: "응봉산", lat: 37.5484, lng: 127.0315 },
    { name: "이촌한강공원", lat: 37.5175, lng: 126.9701 },
    { name: "잠실종합운동장", lat: 37.5148, lng: 127.0736 },
    { name: "잠실한강공원", lat: 37.5178, lng: 127.0825 },
    { name: "잠원한강공원", lat: 37.5230, lng: 127.0116 },
    { name: "청계산", lat: 37.4452, lng: 127.0567 },
    { name: "청와대", lat: 37.5866, lng: 126.9748 },
    { name: "보라매공원", lat: 37.4919, lng: 126.9192 },
    { name: "서대문독립공원", lat: 37.5743, lng: 126.9594 },
    { name: "안양천", lat: 37.5249, lng: 126.8797 },
    { name: "여의서로", lat: 37.5327, lng: 126.9157 },
    { name: "올림픽공원", lat: 37.5208, lng: 127.1215 },
    { name: "홍제폭포", lat: 37.5794, lng: 126.9354 }
];

// 하버사인 공식 (두 좌표 사이의 직선 거리를 km 단위로 계산)
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

exports.getNearbyHotspots = async (req, res) => {
    try {
        // 프론트에서 보낸 유저의 위도, 경도
        const { userLat, userLng } = req.query;

        if (!userLat || !userLng) {
            return res.status(400).json({ message: "위치 정보가 필요합니다." });
        }

        // 모든 장소에 대해 API를 호출 (병렬 처리로 속도 향상)
        const requests = seoulHotspots.map(place => 
            axios.get(`http://openapi.seoul.go.kr:8088/${KEY}/json/citydata/1/1/${encodeURIComponent(place.name)}`)
        );

        const responses = await Promise.all(requests);
        
        // 데이터 정제 및 필터링
        const filteredPlaces = responses
            .map((resp, index) => {
                const cityData = resp.data?.CITYDATA;
                if (!cityData) return null;

                const congestionInfo = cityData.LIVE_PPLTN_STTS?.[0] || {};
                const distance = getDistance(userLat, userLng, seoulHotspots[index].lat, seoulHotspots[index].lng);

                return {
                    장소: cityData.AREA_NM,
                    혼잡도: congestionInfo.AREA_CONGEST_LVL || "데이터 없음",
                    상세메시지: congestionInfo.AREA_CONGEST_MSG || "",
                    거리: distance.toFixed(2), // 소수점 2자리까지
                    좌표: { lat: seoulHotspots[index].lat, lng: seoulHotspots[index].lng }
                };
            })
            .filter(place => place !== null && (place.혼잡도 === "여유" || place.혼잡도 === "보통")) // 여유/보통만 필터링
            .sort((a, b) => a.거리 - b.거리) // 가까운 순 정렬
            .slice(0, 3); // 상위 3개 선정

        res.json({
            count: filteredPlaces.length,
            recommendations: filteredPlaces
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("추천 장소 조회 중 에러 발생");
    }
};


// 1. 개별 장소 혼잡도 확인 로직
exports.getHotspotInfo = async (req, res) => {
    try {
        const placeName = req.params.placeName || "강남역";
        const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/citydata/1/1/${encodeURIComponent(placeName)}`;

        const response = await axios.get(url);
        const cityData = response.data?.CITYDATA;

        if (cityData) {
            const congestionInfo = (cityData.LIVE_PPLTN_STTS && cityData.LIVE_PPLTN_STTS.length > 0) 
                                   ? cityData.LIVE_PPLTN_STTS[0] 
                                   : {};
            res.json({
                장소: cityData.AREA_NM,
                혼잡도: congestionInfo.AREA_CONGEST_LVL || "데이터 없음",
                상세메시지: congestionInfo.AREA_CONGEST_MSG || "상세 정보 없음",
                인구범위: `${congestionInfo.AREA_PPLTN_MIN} ~ ${congestionInfo.AREA_PPLTN_MAX}명`,
                업데이트시간: congestionInfo.PPLTN_TIME || "확인 불가"
            });
        } else {
            res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
        }
    } catch (error) {
        res.status(500).send("API 호출 중 에러 발생");
    }
};

// 2. API 테스트용 로직
exports.apitest = async (req, res) => { 
    const placeName = req.params.placeName || "강남역";
    const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/citydata/1/1/${encodeURIComponent(placeName)}`;
    const response = await axios.get(url);
    const cityData = response.data?.CITYDATA;

    if (cityData) {
        res.json(cityData);
    } else {
        res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }  
}

