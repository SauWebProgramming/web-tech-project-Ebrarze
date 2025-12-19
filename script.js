// ==================================================
// GLOBAL STATE
// ==================================================
let allMedia = [];
const contentArea = document.getElementById("content-area");

let filterState = {
    search: "",
    type: "Tümü",
    year: "Tümü",
    rating: 0
};

// ==================================================
// FAVORİ YÖNETİMİ
// ==================================================
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    handleRoute(); // state bozulmadan yeniden render
}

// ==================================================
// VERİ ÇEKME
// ==================================================
async function fetchMedia() {
    try {
        const response = await fetch("./data/data-movies.json");
        if (!response.ok) throw new Error("JSON okunamadı");

        allMedia = await response.json();

        populateYearFilter(allMedia);
        attachFilterListeners();

        handleRoute(); // 🔑 ilk render

    } catch (err) {
        console.error(err);
        contentArea.innerHTML = "<p class='error-message'>Veriler yüklenemedi</p>";
    }
}

// ==================================================
// ROUTER (SPA)
// ==================================================
window.addEventListener("hashchange", handleRoute);

function handleRoute() {
    const hash = window.location.hash;

    // 🏠 TÜM MEDYALAR
    if (!hash || hash === "#home") {
        const filtered = applyFilters(allMedia);
        displayMedia(filtered);
        return;
    }

    // ⭐ FAVORİLER
    if (hash === "#favorites") {
        const favIds = getFavorites();
        const favItems = allMedia.filter(item => favIds.includes(item.id));
        const filteredFavs = applyFilters(favItems);

        if (filteredFavs.length === 0) {
            contentArea.innerHTML = "<h2>Sonuç bulunamadı</h2>";
        } else {
            displayMedia(filteredFavs);
        }
        return;
    }

    // 🎬 DETAY
    const [route, id] = hash.replace("#", "").split("/");
    if (route === "detail" && id) {
        showDetail(Number(id));
    }
}

// ==================================================
// FİLTRELEME
// ==================================================
function applyFilters(list) {
    return list.filter(item => {
        const matchSearch =
            !filterState.search ||
            item.title.toLowerCase().includes(filterState.search) ||
            item.summary.toLowerCase().includes(filterState.search) ||
            (item.cast && item.cast.join(" ").toLowerCase().includes(filterState.search)) ||
            (item.author && item.author.toLowerCase().includes(filterState.search));

        const matchType =
            filterState.type === "Tümü" || item.type === filterState.type;

        const matchYear =
            filterState.year === "Tümü" || item.year.toString() === filterState.year;

        const matchRating =
            item.rating >= filterState.rating;

        return matchSearch && matchType && matchYear && matchRating;
    });
}

// ==================================================
// MEDYA LİSTESİ
// ==================================================
function displayMedia(mediaArray) {
    contentArea.innerHTML = "";

    if (mediaArray.length === 0) {
        contentArea.innerHTML = "<h2>Sonuç bulunamadı</h2>";
        return;
    }

    const header = document.createElement("h2");
    header.textContent = `Listelenen Medyalar (${mediaArray.length})`;
    contentArea.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "media-grid";

    mediaArray.forEach(item => {
        grid.appendChild(createMediaCard(item));
    });

    contentArea.appendChild(grid);
}

// ==================================================
// MEDYA KARTI
// ==================================================
function createMediaCard(item) {
    const card = document.createElement("article");
    card.className = "media-card";

    const isFav = getFavorites().includes(item.id);

    card.innerHTML = `
        <div class="card-image">
        <img 
  src="${item.image_url}"
  srcset="
    ${item.image_url} 1x,
    ${item.image_url} 2x
  "
  alt="${item.title}"
>
        </div>
        <div class="card-content">
            <h3>${item.title} (${item.year})</h3>
            <p><strong>Tür:</strong> ${item.type} / ${item.category}</p>
            <p><strong>Puan:</strong> ⭐ ${item.rating}</p>
            <button class="fav-btn">
                ${isFav ? "🗑️ Favoriden Çıkar" : "⭐ Favorilere Ekle"}
            </button>
        </div>
    `;

    card.querySelector(".fav-btn").addEventListener("click", e => {
        e.stopPropagation();
        toggleFavorite(item.id);
    });

    card.addEventListener("click", () => {
        window.location.hash = `detail/${item.id}`;
    });

    return card;
}

// ==================================================
// DETAY SAYFASI
// ==================================================
function showDetail(id) {
    const item = allMedia.find(i => i.id === id);
    if (!item) return;

    contentArea.innerHTML = `
        <div class="detail-view">
            <button class="back-btn">← Geri</button>
            <div class="detail-layout">
                <img src="${item.image_url}">
                <div class="detail-info">
                    <h1>${item.title} (${item.year})</h1>
                    <p><strong>Tür:</strong> ${item.type} / ${item.category}</p>
                    <p><strong>Puan:</strong> ⭐ ${item.rating}</p>
                    <p>${item.summary}</p>
                    ${item.cast ? `<p><strong>Oyuncular:</strong> ${item.cast.join(", ")}</p>` : ""}
                    ${item.author ? `<p><strong>Yazar:</strong> ${item.author}</p>` : ""}
                </div>
            </div>
        </div>
    `;

    document.querySelector(".back-btn").onclick = () => history.back();
}

// ==================================================
// FİLTRE EVENTLERİ
// ==================================================
function attachFilterListeners() {
    document.getElementById("search-input").addEventListener("input", e => {
        filterState.search = e.target.value.toLowerCase();
        handleRoute();
    });

    document.getElementById("media-type-filter").addEventListener("change", e => {
        filterState.type = e.target.value;
        handleRoute();
    });

    document.getElementById("year-filter").addEventListener("change", e => {
        filterState.year = e.target.value;
        handleRoute();
    });

    document.getElementById("rating-filter").addEventListener("change", e => {
        filterState.rating = parseFloat(e.target.value);
        handleRoute();
    });
}

// ==================================================
// YIL FİLTRESİ
// ==================================================
function populateYearFilter(mediaArray) {
    const yearFilter = document.getElementById("year-filter");
    yearFilter.innerHTML = `<option value="Tümü">Yıl (Tümü)</option>`;

    [...new Set(mediaArray.map(i => i.year))]
        .sort((a, b) => b - a)
        .forEach(year => {
            yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
        });
}

// ==================================================
// BAŞLAT
// ==================================================
fetchMedia();
