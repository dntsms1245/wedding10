// =========================
// 카카오톡 공유 SDK
// =========================

if (!Kakao.isInitialized()) {
  Kakao.init("19cd668ef606df91321cf67504fb96d9");  }
const kakaoShareButton = document.getElementById("kakaoShareButton");
kakaoShareButton.addEventListener("click", function() {
  Kakao.Share.sendDefault({
    objectType: "feed",
    
    content: {
      title: "성우 ♥ 원경 결혼합니다",
      description: "2026. 12. 13. SUN 17:00 · 리베라 호텔 3층 몽블랑홀",
      imageUrl:
  "https://dntsms1245.github.io/Wedding/images/share2.jpg?v=3",
      link: {
        mobileWebUrl:
          "https://dntsms1245.github.io/Wedding/",
        webUrl:
          "https://dntsms1245.github.io/Wedding/"
      }
    },
    buttons: [
      {
        title: "청첩장 보러가기",
        link: {
          mobileWebUrl:
            "https://dntsms1245.github.io/Wedding/",
          webUrl:
            "https://dntsms1245.github.io/Wedding/"
        }
      }
    ]
  });
});







const galleryImages = document.querySelectorAll(".gallery img");


// ★ 갤러리 사진 교체 시 버전 +1 //

const GALLERY_VERSION = "3";
galleryImages.forEach(function(image) {
  const originalSrc = image.getAttribute("src");
  image.src = originalSrc + "?v=" + GALLERY_VERSION;
});



const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeButton = document.querySelector(".modal-close");


galleryImages.forEach(function(image) {
  image.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });
  image.setAttribute("draggable", "false");
});


modalImage.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});

modalImage.setAttribute("draggable", "false");
let visibleGalleryImages = [];
let currentGalleryIndex = 0;
let isGalleryModal = false;

galleryImages.forEach(function(image) {
  image.addEventListener("click", function() {



    
    // 현재 화면에 보이는 사진만 가져오기 //
    visibleGalleryImages = Array.from(galleryImages).filter(function(img) {
      return img.offsetParent !== null;
    });
  
    currentGalleryIndex = visibleGalleryImages.indexOf(image);
    isGalleryModal = true;
    modalImage.src = image.src;
    modal.style.display = "flex";
  });
});


// ========================= //
// 갤러리 이미지 저장 방지
// 우클릭 / 길게 누르기 / 드래그 방지
// ========================= //

document.querySelectorAll(".gallery img, .modal-image").forEach(function(image) {

  image.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });

  image.addEventListener("dragstart", function(event) {
    event.preventDefault();
  });

  image.setAttribute("draggable", "false");
});








closeButton.addEventListener("click", function() {
  modal.style.display = "none";
});


modal.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});



const copyButtons = document.querySelectorAll(".copy-button");
copyButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const accountNumber = button.dataset.account;
    navigator.clipboard.writeText(accountNumber);
    button.textContent = "복사완료 ✓";
    setTimeout(function() {
      button.innerHTML = "계좌번호<br>복사";
    }, 1500);
  });
});



const mapContainer = document.getElementById("map");

const mapOptions = {
  center: new kakao.maps.LatLng(37.5665, 126.9780),
  level: 3
};

const map = new kakao.maps.Map(mapContainer, mapOptions);

const geocoder = new kakao.maps.services.Geocoder();

geocoder.addressSearch(
  "서울특별시 강남구 영동대로 737",
  function(result, status) {

    if (status === kakao.maps.services.Status.OK) {

      const coords = new kakao.maps.LatLng(
        result[0].y,
        result[0].x
      );

      const marker = new kakao.maps.Marker({
        map: map,
        position: coords
      });

      const label = document.createElement("div");
label.className = "map-label";
label.textContent = "리베라 호텔";
const customOverlay = new kakao.maps.CustomOverlay({
  position: coords,
  content: label,
  xAnchor: 0.5,
  yAnchor: 1.8
});
customOverlay.setMap(map);

      map.setCenter(coords);
    }});


const galleryMoreButton = document.querySelector(".gallery-more-button");
const galleryExtraImages = document.querySelectorAll(".gallery-extra");

galleryMoreButton.addEventListener("click", function() {

  const isOpen = galleryExtraImages[0].classList.contains("show");

  if (isOpen) {

    galleryExtraImages.forEach(function(image) {
      image.classList.remove("show");
    });

    galleryMoreButton.textContent = "사진 더보기 +";

  } else {

    galleryExtraImages.forEach(function(image) {
      image.classList.add("show");
    });

    galleryMoreButton.textContent = "🤯사진 접기 −";
  }
});



const paperButton = document.querySelector(".paper-button");

paperButton.addEventListener("click", function() {
  const paperImage = paperButton.dataset.image;

  modalImage.src = paperImage;
  modal.style.display = "flex";
});





let touchStartX = 0;
let touchCurrentX = 0;
let isAnimating = false;
modalImage.addEventListener("touchstart", function(event) {
  if (!isGalleryModal || isAnimating) return;
  touchStartX = event.touches[0].clientX;
  touchCurrentX = touchStartX;
  // 손가락으로 움직이는 동안에는 애니메이션 끄기
  modalImage.style.transition = "none";
});
modalImage.addEventListener("touchmove", function(event) {
  if (!isGalleryModal || isAnimating) return;
  touchCurrentX = event.touches[0].clientX;
  const moveX = touchCurrentX - touchStartX;
  // 사진이 손가락을 따라 좌우로 움직임
  modalImage.style.transform = `translateX(${moveX}px)`;
});
modalImage.addEventListener("touchend", function() {
  if (!isGalleryModal || isAnimating) return;
  const moveX = touchCurrentX - touchStartX;
  // 50px 이하로 움직였으면 원래 자리로 돌아오기
  if (Math.abs(moveX) < 50) {
    modalImage.style.transition = "transform 0.2s ease";
    modalImage.style.transform = "translateX(0)";
    return;
  }
  isAnimating = true;
  const nextPhoto = moveX < 0;
  // 기존 사진이 옆으로 빠져나감
  modalImage.style.transition =
    "transform 0.22s ease, opacity 0.22s ease";

  modalImage.style.transform =
    nextPhoto
      ? "translateX(-120%)"
      : "translateX(120%)";
  modalImage.style.opacity = "0";
  setTimeout(function() {
    // 다음 / 이전 사진 번호 계산
    if (nextPhoto) {
      currentGalleryIndex++;
      if (currentGalleryIndex >= visibleGalleryImages.length) {
        currentGalleryIndex = 0;
      }
    } else {
      currentGalleryIndex--;
      if (currentGalleryIndex < 0) {
        currentGalleryIndex = visibleGalleryImages.length - 1;
      }
    }
    // 새로운 사진으로 교체
    modalImage.src =
      visibleGalleryImages[currentGalleryIndex].src;
    // 새 사진을 반대편에서 살짝 대기
    modalImage.style.transition = "none";
    modalImage.style.transform =
      nextPhoto
        ? "translateX(60px)"
        : "translateX(-60px)";
    modalImage.style.opacity = "0";
    // 가운데로 부드럽게 등장
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        modalImage.style.transition =
          "transform 0.22s ease, opacity 0.22s ease";
        modalImage.style.transform = "translateX(0)";
        modalImage.style.opacity = "1";
        isAnimating = false;
      });
    });
  }, 220);
});








// =========================
// 이스터에그
// =========================
const easterSpot = document.querySelector(".easter-spot");
const pigEaster = document.querySelector(".pig-easter");
easterSpot.addEventListener("click", function() {
  pigEaster.style.display = "block";
});
pigEaster.addEventListener("click", function() {
  pigEaster.style.display = "none";
});






// =========================
// D-DAY
// =========================

const weddingDate = new Date(2026, 11, 13);

const today = new Date();
today.setHours(0, 0, 0, 0);

const diffTime = weddingDate - today;
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

const ddayNumber = document.getElementById("ddayNumber");

if (diffDays > 0) {
  ddayNumber.textContent = "D-" + diffDays;
} else if (diffDays === 0) {
  ddayNumber.textContent = "D-DAY";
} else {
  ddayNumber.textContent = "♥";}





// =========================
// 웨딩 필름 YouTube 플레이어
// 자동재생 X / 처음에는 음소거
// =========================

const youtubeApiScript = document.createElement("script");
youtubeApiScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeApiScript);
let weddingPlayer;
window.onYouTubeIframeAPIReady = function () {
  weddingPlayer = new YT.Player("weddingPlayer", {
    videoId: "j7MpwQ_DW1k",
    playerVars: {
      autoplay: 0,
      controls: 1,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: function (event) {
        event.target.mute();
      }
    }
  });
};









