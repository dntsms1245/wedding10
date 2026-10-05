import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCgCi12iFsXI66YxRYX9NVGmVHVWyukYOU",
  authDomain: "wedding-guestbook-aa1a8.firebaseapp.com",
  projectId: "wedding-guestbook-aa1a8",
  storageBucket: "wedding-guestbook-aa1a8.firebasestorage.app",
  messagingSenderId: "134235611501",
  appId: "1:134235611501:web:b670fde5e83e0516a53a64"
};


// Firebase 시작
const app = initializeApp(firebaseConfig);

// Firestore 연결
const db = getFirestore(app);



// 입력창과 버튼 찾기
const guestNameInput = document.getElementById("guestName");
const guestMessageInput = document.getElementById("guestMessage");
const guestSubmitButton = document.getElementById("guestSubmitButton");


// 마음 남기기 버튼 클릭
guestSubmitButton.addEventListener("click", async function() {

  const name = guestNameInput.value.trim();
  const message = guestMessageInput.value.trim();

  // 이름 또는 메시지가 비어 있으면 중단
  if (name === "" || message === "") {
    alert("이름과 축하 메시지를 모두 입력해주세요.");
    return;
  }

  // 중복 클릭 방지
  guestSubmitButton.disabled = true;
  guestSubmitButton.textContent = "등록 중...";

  try {

    await addDoc(collection(db, "guestbook"), {
      name: name,
      message: message,
      createdAt: serverTimestamp()
    });

    alert("축하 메시지가 등록되었습니다. 🤍");

    // 입력창 비우기
    guestNameInput.value = "";
    guestMessageInput.value = "";

  } catch (error) {

    console.error("방명록 등록 오류:", error);
    alert("메시지 등록 중 오류가 발생했습니다.");

  } finally {

    guestSubmitButton.disabled = false;
    guestSubmitButton.textContent = "마음 남기기";
  }
});



// 방명록 목록 불러오기
const guestbookList = document.getElementById("guestbookList");
const guestbookPagination = document.getElementById("guestbookPagination");

const ITEMS_PER_PAGE = 4;

let guestbookData = [];
let currentPage = 1;


const guestbookQuery = query(
  collection(db, "guestbook"),
  orderBy("createdAt", "desc")
);


// 한 페이지의 방명록 표시
function renderGuestbook() {

  guestbookList.innerHTML = "";

  if (guestbookData.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "첫 축하 메시지를 남겨주세요. 🤍";
    guestbookList.appendChild(emptyMessage);

    guestbookPagination.innerHTML = "";
    return;
  }


  const totalPages = Math.ceil(
    guestbookData.length / ITEMS_PER_PAGE
  );


  // 현재 페이지가 범위를 넘어가는 경우 방지
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }


  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const pageData =
    guestbookData.slice(startIndex, endIndex);


  pageData.forEach(function(data) {

    const item = document.createElement("div");
    item.className = "guestbook-item";


    // 이름 + 날짜를 한 줄에 배치
    const head = document.createElement("div");
    head.className = "guestbook-item-head";


    const name = document.createElement("p");
    name.className = "guestbook-item-name";
    name.textContent = data.name;


    const date = document.createElement("p");
    date.className = "guestbook-item-date";

    if (data.createdAt) {

      const createdDate =
        data.createdAt.toDate();

      date.textContent =
        createdDate.getFullYear() + "." +
        String(
          createdDate.getMonth() + 1
        ).padStart(2, "0") + "." +
        String(
          createdDate.getDate()
        ).padStart(2, "0");

    } else {

      date.textContent = "방금";

    }
    head.appendChild(name);
    head.appendChild(date);


    // 메시지
    const message =
      document.createElement("p");
    message.className =
      "guestbook-item-message";
    message.textContent =
      data.message;


    // 메시지 터치 → 펼치기 / 접기
    message.addEventListener(
      "click",
      function() {
        message.classList.toggle(
          "expanded"
        );

      }
    );


    item.appendChild(head);
    item.appendChild(message);
    guestbookList.appendChild(item);
  });
  renderPagination(totalPages);
}


// 페이지 번호 만들기
function renderPagination(totalPages) {
  guestbookPagination.innerHTML = "";
  if (totalPages <= 1) {
    return;
  }


  // 이전 페이지
  const prevButton =
    document.createElement("button");
  prevButton.textContent = "‹";
  prevButton.disabled =
    currentPage === 1;
  prevButton.addEventListener(
    "click",
    function() {
      currentPage--;
      renderGuestbook();

    }
  );
  guestbookPagination.appendChild(
    prevButton
  );


  // 한 번에 최대 5개 페이지 번호만 표시
  let startPage =
    Math.max(1, currentPage - 2);

  let endPage =
    Math.min(
      totalPages,
      startPage + 4
    );

  if (endPage - startPage < 4) {
    startPage =
      Math.max(1, endPage - 4);
  }


  for (
    let page = startPage;
    page <= endPage;
    page++
  ) {

    const pageButton =
      document.createElement("button");
    pageButton.textContent = page;
    if (page === currentPage) {
      pageButton.classList.add("active");
    }


    pageButton.addEventListener(
      "click",
      function() {
        currentPage = page;
        renderGuestbook();
      }
    );


    guestbookPagination.appendChild(
      pageButton
    );
  }


  // 다음 페이지
  const nextButton =
    document.createElement("button");
  nextButton.textContent = "›";
  nextButton.disabled =
    currentPage === totalPages;
  nextButton.addEventListener(
    "click",
    function() {
      currentPage++;
      renderGuestbook();
    }
  );
  guestbookPagination.appendChild(
    nextButton
  );
}


// Firestore가 바뀔 때마다 갱신
onSnapshot(
  guestbookQuery,
  function(snapshot) {
    guestbookData = [];
    snapshot.forEach(function(doc) {
      guestbookData.push(
        doc.data()
      );
    });
    renderGuestbook();
  }
);
