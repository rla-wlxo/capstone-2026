const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.SEOUL_API_KEY;

// API가 100% 인식하는 공식 명칭 리스트로 수정
const seoulHotspots = [
    "강남역", "홍대", "성수동 카페거리", "익선동", "명동거리", 
    "가로수길", "압구정로데오거리", "연남동", "이태원 관광특구", 
    "용리단길", "을지로3가역", "광화문광장", "경복궁", 
    "서울숲공원", "잠실 관광특구", "영등포역", "종로3가역"
];

// 1. 개별 장소 혼잡도 확인 (이미지 99ef1b.png 구조 완벽 반영)
app.get('/test/:placeName', async (req, res) => {
    try {
        const placeName = req.params.placeName || "강남역";
        const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/citydata/1/1/${encodeURIComponent(placeName)}`;

        console.log(`요청 시도: ${placeName}`);
        const response = await axios.get(url);

        // 서울시 API는 response.data.CITYDATA 안에 모든 정보가 들어있습니다.
        const cityData = response.data?.CITYDATA;

        if (cityData) {
            const congestionArray = cityData.LIVE_PPLTN_STTS; 
            
            const congestionInfo = (Array.isArray(congestionArray) && congestionArray.length > 0) 
                                   ? congestionArray[0] 
                                   : {};
            res.json({
                장소: cityData.AREA_NM,
                혼잡도: congestionInfo.AREA_CONGEST_LVL || "데이터 없음",
                상세메시지: congestionInfo.AREA_CONGEST_MSG || "상세 정보가 없습니다.",
                인구범위: `${congestionInfo.AREA_PPLTN_MIN} ~ ${congestionInfo.AREA_PPLTN_MAX}명`,
                업데이트시간: congestionInfo.PPLTN_TIME || "확인 불가"
            });
        } else {
            res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("서버 에러:", error.message);
        res.status(500).send("API 호출 중 에러 발생");
    }
});

//api 테스트용(서울시) (강남역 기준)
app.get('/apitest', async (req, res) => {
    try {
        const testPlace = "강남역";
        const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/citydata/1/1/${encodeURIComponent(testPlace)}`;   
        console.log("--- API 호출 시작 ---");
        console.log("호출 URL:", url);

        const response = await axios.get(url);
        res.json({
            message: "데이터 확인 성공!",
            data: response.data.CITYDATA ? "데이터 있음" : "데이터 구조 확인 필요",
            dataRaw: response.data
        });
    } catch (error) {
        console.error("--- 호출 실패 ---");
        console.error("에러 내용:", error.message);
        res.status(500).send("연결 자체가 실패했습니다.");
    }
});

// 2. 랜덤 지능형 다이스 API (통합형)
app.get('/dice', async (req, res) => {
    try {
        // 테스트용으로 가장 확실한 장소인 '강남역' 하나만 찔러봅니다.
        const testPlace = "강남역";
        const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/citydata/1/1/${encodeURIComponent(testPlace)}`;
        
        console.log("--- API 호출 시작 ---");
        console.log("호출 URL:", url);

        const response = await axios.get(url);

        res.json({
            message: "데이터 확인 성공!",
            data: response.data.CITYDATA ? "데이터 있음" : "데이터 구조 확인 필요"
        });

    } catch (error) {
        console.error("--- 호출 실패 ---");
        console.error("에러 내용:", error.message);
        res.status(500).send("연결 자체가 실패했습니다.");
    }
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});