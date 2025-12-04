// script.js

// Global kapsamda medya verisini tutacak değişken (ES6: const/let kullanımı)
let allMedia = []; 
const contentArea = document.getElementById('content-area');

// --- 1. VERİ ÇEKME FONKSİYONU (ZORUNLU: async/await ve fetch) ---
async function fetchMedia() {
    try {
        // BURASI DÜZELTİLDİ: data/data-movies.json dosyasından 50 öğeyi çek
        const response = await fetch('./data/data-movies.json'); 
        
        // Yanıtın başarılı (OK) olup olmadığını kontrol etme
        if (!response.ok) {
            throw new Error(`HTTP hata kodu: ${response.status}`);
        }
        
        const media = await response.json(); 
        allMedia = media; 
        
        console.log("Medya verileri başarıyla çekildi:", allMedia);

        // Veri çekildikten sonra listelemeyi ve olay dinleyicilerini başlat
        displayMedia(allMedia); 
        attachFilterListeners();
        
    } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        // Hata durumunda kullanıcıya bilgi verme
        contentArea.innerHTML = '<p class="error-message">Medya verileri yüklenemedi. Lütfen dosya yolunu kontrol edin.</p>';
    }
}


// --- 2. LİSTE OLUŞTURMA FONKSİYONLARI (ZORUNLU: Liste/Grid Görünümü) ---

function createMediaCard(item) {
    const card = document.createElement('article'); // Anlamsal HTML
    card.classList.add('media-card', item.type.toLowerCase());
    card.dataset.id = item.id; // Detay sayfası için

    let details = '';
    // Kitaplar için Yazar, Diğerleri için Oyuncu bilgisini göster
    if (item.type === 'Kitap') {
        details = `<p class="card-author">Yazar: <strong>${item.author}</strong></p>`;
    } else if (item.cast && item.cast.length > 0) {
        details = `<p class="card-cast">Oyuncular: ${item.cast.slice(0, 2).join(', ')}...</p>`;
    }
    
    // image özelliği varsayımıyla eklenmiştir, CSS'te stilleyebilirsiniz
    card.innerHTML = `
        <div class="card-image" style="background-image: url('${item.image || 'placeholder.jpg'}');"></div>
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
         contentArea.innerHTML = `<h2>Hiç sonuç bulunamadı.</h2>`;
         return;
    }

    const listHeader = document.createElement('h2');
    listHeader.textContent = `Listelenen Medyalar (${mediaArray.length} öğe)`;
    contentArea.appendChild(listHeader);
    
    const mediaContainer = document.createElement('div');
    mediaContainer.id = 'media-container';
    mediaContainer.classList.add('media-grid'); // CSS Grid için sınıf
    
    mediaArray.forEach(item => {
        const card = createMediaCard(item);
        mediaContainer.appendChild(card);
    });

    contentArea.appendChild(mediaContainer);
}


// --- 3. FİLTRELEME MANTIĞI (ZORUNLU: Arama ve Filtreleme) ---

function filterMedia() {
    // Sadece medya türüne göre filtreleme (Diğer filtreler sonra eklenecek)
    const typeFilter = document.getElementById('media-type-filter').value;
    
    let filteredArray = allMedia;

    if (typeFilter !== 'Tümü') {
        filteredArray = filteredArray.filter(item => item.type === typeFilter);
    }
    
    // Filtrelenmiş diziyi ekrana bas
    displayMedia(filteredArray);
}

// --- 4. OLAY DİNLEYİCİLERİNİ BAĞLAMA ---

function attachFilterListeners() {
    // Medya Türü filtresi değiştiğinde
    document.getElementById('media-type-filter').addEventListener('change', filterMedia);
    
    // Arama kutusu değiştiğinde (sonra eklenecek)
    // document.getElementById('search-input').addEventListener('input', filterMedia);
    
    // Yıl filtresi değiştiğinde (sonra eklenecek)
    // document.getElementById('year-filter').addEventListener('change', filterMedia);
}


// --- UYGULAMAYI BAŞLATMA ---
fetchMedia(); // Uygulama başladığında veriyi çek