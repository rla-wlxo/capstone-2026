// public/js/utils/horizontalScroll.js

export function initHorizontalScroll() {
    const scrollContainer = document.getElementById('recommendationList');
    if (!scrollContainer) return;

    // 1. 중복 등록 방지
    if (scrollContainer.dataset.initialized === "true") return;
    scrollContainer.dataset.initialized = "true";

    let isDown = false;
    let startX;
    let scrollLeft;

    // 2. 세로 휠을 가로로 변환 (마우스 휠 유저용)
    scrollContainer.addEventListener('wheel', (evt) => {
        // 만약 가로 스크롤이 가능한 상태(내용물이 더 많음)일 때만 작동
        if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        }
    }, { passive: false });

    // 3. 클릭 드래그 기능 (Swipe)
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.style.cursor = 'grabbing';
        // getBoundingClientRect를 쓰면 offsetLeft보다 더 정확합니다.
        startX = e.pageX - scrollContainer.getBoundingClientRect().left;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // 텍스트 선택 방지
        const x = e.pageX - scrollContainer.getBoundingClientRect().left;
        const walk = (x - startX) * 2; // 스크롤 속도 배율
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
}