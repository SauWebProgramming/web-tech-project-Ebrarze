
#  ISE-201 Web Teknolojileri Proje Ödevi: 

##  Proje Bilgileri

| **Öğrenci Adı Soyadı** | Zehra Ebrar ERBAĞ |
| **Öğrenci Numarası** | B241200043 |
| **Seçilen Proje** | Seçenek 1: İnteraktif Medya Kitaplığı (SPA) |
| **Canlı Yayın Linki** | <https://sauwebprogramming.github.io/web-tech-project-Ebrarze/>  |
| **GitHub Repository** | <https://github.com/SauWebProgramming/web-tech-project-Ebrarze
> |

##  Projenin Amacı ve Özeti

Bu proje, modern istemci tarafı web teknolojilerini kullanarak dinamik ve interaktif bir Tek Sayfa Uygulaması (Single Page Application - SPA) geliştirmeyi amaçlamaktadır. Uygulama, harici veya yerel bir veri kaynağından film/dizi/kitap/animasyon/dergi bilgilerini çekerek kullanıcıya duyarlı (responsive) bir arayüz sunar.

## Kullanılan Temel Teknolojiler (Zorunlu İsterler)

Proje, tamamen statik HTML, CSS ve JavaScript dosyalarından oluşmuştur ve sunucu taraflı bir dil gerektirmemektedir.

### Front-End Teknolojileri

**HTML5:** Anlamsal etiket kullanımı (<nav>, <main>, <article> vb.) sağlanmıştır.
**CSS3:** Tamamen duyarlı tasarım (Responsive Design) için Media Queries, **CSS Flexbox** ve **CSS Grid** kullanılmıştır.
**Modern JavaScript (ES6+):** `const` ve `let` kullanımı, Arrow Functions $(=>)$ dahil olmak üzere modern JavaScript standartları uygulanmıştır.

### Web API ve Veri Yönetimi

***Asenkron JS:** Veri çekmek için **`fetch()` API** kullanılmış ve **`async/await`** yapısı ile Promise yönetimi sağlanmıştır.
***Veri Kaynağı:** Proje verileri, <Yerel JSON dosyası (data-movies.json)
> kaynağından çekilmiştir.
***Yerel Depolama:** Kullanıcının seçtiği medya listesini saklamak için **`localStorage`** kullanılmıştır.("Favorilerim" işlevi)


##  Zorunlu İşlevlerin Uygulanması

Projede, ödev kılavuzunda belirtilen tüm zorunlu işlevler (Seçenek 1) tam olarak uygulanmıştır:

1.  **Liste/Grid Görünümü:** Çekilen tüm medyalar dinamik olarak oluşturulan kartlar (kartlar) halinde gösterilmiştir.
2.  **Arama ve Filtreleme:** Medyalar, başlığa göre arama, kategoriye ve yıla göre filtreleme özellikleri ile sıralanabilir/süzülebilir. Yıl filtre seçenekleri dinamik olarak veri kaynağından doldurulmuştur.
3.  **Detay Görünümü (SPA):** Bir medya kartına tıklandığında, sayfa yenilenmeden, listenin yerine o medyanın tüm detayları (özet, puan, oyuncular vb.) JavaScript ile dinamik olarak yüklenir (Tam SPA geçişi).
4.  **Favorilerim Yönetimi:** Kullanıcı, istediği medyayı favorilere ekleyebilir; bu tercihler `localStorage`'da saklanır ve ayrı bir Favorilerim sekmesinde listelenir.
5.  **URL Yönetimi:** Görünüm değişimlerinde (Liste, Favoriler, Detay), URL hash yapısı (#home, #favorites, #detail/id) kullanılarak tarayıcının adres çubuğu dinamik olarak güncellenir.

## GitHub ve Versiyonlama

Proje geliştirme süreci, başlangıçtan itibaren Git kullanılarak yönetilmiş ve düzenli, anlamlı commit mesajları ile versiyonlanmıştır.Proje, sorunsuz bir şekilde GitHub Pages üzerinden canlıya alınmıştır