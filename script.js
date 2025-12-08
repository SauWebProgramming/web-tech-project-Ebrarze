// script.js

// ZORUNLU: const/let kullanımı (ES6+)
let allMedia = []; 
const contentArea = document.getElementById('content-area');

// --- 1. VERİ ÇEKME FONKSİYONU (ZORUNLU: async/await ve fetch) ---
async function fetchMedia() {
    try {
        // Dosya adı: data-movies.json ve fetch() API'si
        const response = await fetch('./data/data-movies.json'); 
        
        // Yanıtın başarılı (OK) olup olmadığını kontrol etme
        if (!response.ok) {
            throw new Error(`HTTP hata kodu: ${response.status}`);
        }
        
        // ZORUNLU: Dönen JSON verisinin işlenmesi
        const media = await response.json(); 
        allMedia = media; 
        
        console.log("Medya verileri başarıyla çekildi:", allMedia);

        // Veri çekildikten sonra listelemeyi ve olay dinleyicilerini başlat
        displayMedia(allMedia); 
        populateYearFilter(allMedia); // Yeni: Yıl filtresini doldur
        attachFilterListeners();
        
    } catch (error) {
        // ZORUNLU: Asenkron hata yakalama
        console.error("Veri çekilirken hata oluştu:", error);
        contentArea.innerHTML = '<p class="error-message">Medya verileri yüklenemedi. Lütfen dosya yolunu veya JSON formatını kontrol edin.</p>';
    }
}


// --- 2. LİSTE OLUŞTURMA FONKSİYONLARI (ZORUNLU: Liste/Grid Görünümü) ---

function createMediaCard(item) {
    const card = document.createElement('article'); // ZORUNLU: Anlamsal HTML
    card.classList.add('media-card', item.type.toLowerCase().replace(' ', '-'));
    card.dataset.id = item.id; 

    let details = '';
    
    // Kitaplara/Dergiye/Animasyona özel bilgileri kontrol etme
    if (item.type === 'Kitap') {
        details = `<p class="card-author">Yazar: <strong>${item.author}</strong></p>`;
    } else if (item.type === 'Dergi') {
        details = `<p class="card-publisher">Yayıncı: <strong>${item.publisher}</strong></p>`;
    } else if (item.type === 'Animasyon' && item.seasons) {
        details = `<p class="card-seasons">Sezon: <strong>${item.seasons}</strong></p>`;
    } else if (item.cast && item.cast.length > 0) {
        // Film/Dizi/Animasyon (uzun metraj) için Oyuncuları göster
        details = `<p class="card-cast">Oyuncular: ${item.cast.slice(0, 2).join(', ')}...</p>`;
    }
    
    card.innerHTML = `
        <div class="card-content">
            <h3>${item.title} (${item.year})</h3>
            <p class="category">Tür: ${item.type} / ${item.category}</p>
            <p class="rating">${item.rating} ⭐</p>
            ${details}
            
            <button class="add-favorite" data-id="${item.id}">
                Favorilere Ekle
            </button>
        </div>
    `;
    return card;
}


function displayMedia(mediaArray) {
    contentArea.innerHTML = ''; // Eski içeriği temizle

    if (mediaArray.length === 0) {
         contentArea.innerHTML = `<h2>Hiç sonuç bulunamadı. Lütfen filtreleri kontrol edin.</h2>`;
         return;
    }

    const listHeader = document.createElement('h2');
    listHeader.textContent = `Listelenen Medyalar (${mediaArray.length} öğe)`;
    contentArea.appendChild(listHeader);
    
    const mediaContainer = document.createElement('div');
    mediaContainer.id = 'media-container';
    mediaContainer.classList.add('media-grid'); // ZORUNLU: CSS Grid için sınıf
    
    // ZORUNLU: Dönen JSON verisinin işlenmesi ve DOM'a basılması
    mediaArray.forEach(item => {
        const card = createMediaCard(item);
        mediaContainer.appendChild(card);
    });

    contentArea.appendChild(mediaContainer);
}


// --- 3. FİLTRELEME MANTIĞI (ZORUNLU: Arama ve Filtreleme) ---

// Yeni: Yıl Filtresi seçeneklerini dinamik oluşturma
function populateYearFilter(mediaArray) {
    const yearFilter = document.getElementById('year-filter');
    // Tekrarlanan yılları önlemek için Set kullan
    const years = new Set(mediaArray.map(item => item.year).sort((a, b) => b - a));

    // 'Tümü' seçeneğini korumak için eski seçenekleri sil
    yearFilter.innerHTML = '<option value="Tümü">Yıl (Tümü)</option>'; 
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}


function filterMedia() {
    // 1. Filtre değerlerini al
    const typeFilter = document.getElementById('media-type-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    
    let filteredArray = allMedia;

    // A. Medya Türü Filtresi
    if (typeFilter !== 'Tümü') {
        filteredArray = filteredArray.filter(item => item.type === typeFilter);
    }
    
    // B. Yıl Filtresi
    if (yearFilter !== 'Tümü') {
        // JSON'daki 'year' alanı sayı olduğu için kontrolü sayısal yap
        filteredArray = filteredArray.filter(item => item.year.toString() === yearFilter);
    }

    // C. Arama Filtresi (ZORUNLU: Medyaları isme göre arama)
    if (searchInput) {
        filteredArray = filteredArray.filter(item => 
            // Başlık veya Özet içinde arama
            item.title.toLowerCase().includes(searchInput) ||
            item.summary.toLowerCase().includes(searchInput) ||
            // Oyuncu/Yazar içinde arama (Eğer cast/author varsa)
            (item.cast && item.cast.join(' ').toLowerCase().includes(searchInput)) ||
            (item.author && item.author.toLowerCase().includes(searchInput)) 
        );
    }

    // Filtrelenmiş diziyi ekrana bas
    displayMedia(filteredArray);
}


// --- 4. OLAY DİNLEYİCİLERİNİ BAĞLAMA ---

function attachFilterListeners() {
    // Medya Türü filtresi değiştiğinde
    document.getElementById('media-type-filter').addEventListener('change', filterMedia);
    
    // Yıl filtresi değiştiğinde
    document.getElementById('year-filter').addEventListener('change', filterMedia);
    
    // Arama kutusu değiştiğinde (input)
    document.getElementById('search-input').addEventListener('input', filterMedia);
    
    // *Favorilere Ekle* butonları için dinleyiciyi burada kurmalısınız (sonraki zorunlu adım)
    // document.querySelectorAll('.add-favorite').forEach(button => { /* ... */ });
}

// script.js dosyanızdaki createMediaCard fonksiyonu

function createMediaCard(item) {
    const card = document.createElement('article'); 
    card.classList.add('media-card', item.type.toLowerCase().replace(' ', '-'));
    card.dataset.id = item.id; 

    // Favori yönetimi için eklenen kısım (bir sonraki adım)
    const favorites = getFavorites();
    const isFavorite = favorites.includes(item.id); 

    let details = '';
    // Kitaplar için Yazar, Diğerleri için Oyuncu bilgisini göster (vb. detaylar)
    if (item.type === 'Kitap') {
        details = `<p class="card-author">Yazar: <strong>${item.author}</strong></p>`;
    } else if (item.cast && item.cast.length > 0) {
        details = `<p class="card-cast">Oyuncular: ${item.cast.slice(0, 2).join(', ')}...</p>`;
    }
    
    // image_url alanını kullanma
    const imageUrl = item.image_url || 'https://via.placeholder.com/200x300?text=Poster+Yok'; // Eğer görsel yoksa varsayılan görsel göster
    
    card.innerHTML = `
        <div 
             class="card-image" 
             style="background-image: url('${imageUrl}');">
        </div>

        <div class="card-content">
            <h3>${item.title} (${item.year})</h3>
            <p class="category">Tür: ${item.type} / ${item.category}</p>
            <p class="rating">${item.rating} ⭐</p>
            ${details}
            
            <button class="add-favorite" data-id="${item.id}">
                ${isFavorite ? '🗑️ Favoriden Çıkar' : '⭐️ Favorilere Ekle'}
            </button>
        </div>
    `;
    
    if (isFavorite) {
        card.classList.add('is-favorite'); 
    }
    
    return card;
}