const axios = require('axios');
const KEY = process.env.SEOUL_API_KEY;

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

// 2. 다이스/테스트 로직도 비슷하게 exports 추가 가능...