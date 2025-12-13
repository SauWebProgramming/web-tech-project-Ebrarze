// ===================== GLOBAL DEĞİŞKENLER =====================
let allMedia = [];
const contentArea = document.getElementById("content-area");

// ===================== FAVORİ YÖNETİMİ =====================
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    filterMedia();
}

// ===================== VERİ ÇEKME (ASYNC / AWAIT + FETCH) =====================
async function fetchMedia() {
    try {
        const response = await fetch("./data/data-movies.json");

        if (!response.ok) {
            throw new Error(`HTTP Hata: ${response.status}`);
        }

        const data = await response.json();
        allMedia = data;

        populateYearFilter(allMedia);
        displayMedia(allMedia);
        attachFilterListeners();

    } catch (error) {
        console.error("Veri çekme hatası:", error);
        contentArea.innerHTML = `
            <p class="error-message">
                Medya verileri yüklenemedi. JSON dosyasını kontrol edin.
            </p>`;
    }
}
// ===================== MEDYA KARTI OLUŞTURMA =====================
function createMediaCard(item) {
    const card = document.createElement("article");
    card.classList.add(
        "media-card",
        item.type.toLowerCase().replace(/\s+/g, "-")
    );

    const favorites = getFavorites();
    const isFavorite = favorites.includes(item.id);

    let details = "";

    if (item.type === "Kitap" && item.author) {
        details = `<p><strong>Yazar:</strong> ${item.author}</p>`;
    } else if (item.cast && item.cast.length > 0) {
        details = `<p><strong>Oyuncular:</strong> ${item.cast.slice(0, 2).join(", ")}...</p>`;
    }

    const imageUrl = item.image_url || "https://via.placeholder.com/200x300";

    card.innerHTML = `
        <div class="card-image" style="background-image:url('${imageUrl}')"></div>
        <div class="card-content">
            <h3>${item.title} (${item.year})</h3>
            <p><strong>Tür:</strong> ${item.type} / ${item.category}</p>
            <p><strong>Puan:</strong> ${item.rating} ⭐</p>
            ${details}
            <button class="fav-btn">
                ${isFavorite ? "🗑️ Favoriden Çıkar" : "⭐ Favorilere Ekle"}
            </button>
        </div>
    `;

    card.querySelector(".fav-btn").addEventListener("click", () => {
        toggleFavorite(item.id);
    });

    return card;
}

// ===================== MEDYALARI LİSTELE =====================
function displayMedia(mediaArray) {
    contentArea.innerHTML = "";

    if (mediaArray.length === 0) {
        contentArea.innerHTML = "<h2>Sonuç bulunamadı.</h2>";
        return;
    }

    const header = document.createElement("h2");
    header.textContent = `Listelenen Medyalar (${mediaArray.length})`;
    contentArea.appendChild(header);

    const grid = document.createElement("div");
    grid.classList.add("media-grid");

    mediaArray.forEach(item => {
        const card = createMediaCard(item);
        grid.appendChild(card);
    });

    contentArea.appendChild(grid);
}

// ===================== YIL FİLTRESİ =====================
function populateYearFilter(mediaArray) {
    const yearFilter = document.getElementById("year-filter");
    const years = [...new Set(mediaArray.map(item => item.year))].sort((a, b) => b - a);

    yearFilter.innerHTML = `<option value="Tümü">Yıl (Tümü)</option>`;

    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// ===================== FİLTRELEME =====================
function filterMedia() {
    const type = document.getElementById("media-type-filter").value;
    const year = document.getElementById("year-filter").value;
    const rating = parseFloat(document.getElementById("rating-filter").value);
    const search = document.getElementById("search-input").value.toLowerCase();

    let filtered = allMedia;

    if (type !== "Tümü") {
        filtered = filtered.filter(item => item.type === type);
    }

    if (year !== "Tümü") {
        filtered = filtered.filter(item => item.year.toString() === year);
    }

    if (rating > 0) {
        filtered = filtered.filter(item => item.rating >= rating);
    }

    if (search) {
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(search) ||
            item.summary.toLowerCase().includes(search) ||
            (item.cast && item.cast.join(" ").toLowerCase().includes(search)) ||
            (item.author && item.author.toLowerCase().includes(search))
        );
    }

    displayMedia(filtered);
}

// ===================== EVENT LİSTENER =====================
function attachFilterListeners() {
    document.getElementById("media-type-filter").addEventListener("change", filterMedia);
    document.getElementById("year-filter").addEventListener("change", filterMedia);
    document.getElementById("rating-filter").addEventListener("change", filterMedia);
    document.getElementById("search-input").addEventListener("input", filterMedia);
}

// ===================== FAVORİLER SAYFASI =====================
document.getElementById("favorites-link").addEventListener("click", e => {
    e.preventDefault();

    const favorites = getFavorites();

    if (favorites.length === 0) {
        contentArea.innerHTML = "<h2>Henüz favori eklenmedi.</h2>";
        return;
    }

    const favoriteItems = allMedia.filter(item =>
        favorites.includes(Number(item.id))
    );

    displayMedia(favoriteItems);
});


// ===================== BAŞLAT =====================
fetchMedia();
