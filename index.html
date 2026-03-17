// --- AYARLAR ---
// Kendi Groq API Anahtarını buraya yapıştır.
const API_KEY = "BURAYA_API_ANAHTARINI_YAPISTIR"; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

let currentModel = "oto"; // Varsayılan model

// Kullanılabilir modeller ve ID'leri
const MODELS = {
    hizli: "llama-3.1-8b-instant",
    dusunen: "llama-3.2-11b-vision-preview",
    pro: "llama-3.3-70b-versatile"
};

// --- MODEL SEÇİMİ ---
function setModel(modelName) {
    currentModel = modelName;
    // Tüm butonlardan 'active' sınıfını kaldır
    document.querySelectorAll('.model-buttons button').forEach(btn => btn.classList.remove('active'));
    // Tıklanan butona 'active' sınıfını ekle
    document.getElementById(`btn-${modelName}`).classList.add('active');
}

// --- TEXTAREA OTOMATİK BÜYÜME ---
function autoGrow(element) {
    element.style.height = "auto"; // Yüksekliği sıfırla
    element.style.height = (element.scrollHeight) + "px"; // İçeriğe göre yükseklik ayarla
}

// --- SOHBET FONKSİYONLARI ---

// Mesaj gönderme fonksiyonu
async function talk() {
    const questionInput = document.getElementById("q");
    const question = questionInput.value.trim(); // Boşlukları temizle
    if (!question) return; // Boş mesaj gönderme

    // Kullanıcı mesajını ekle
    addMessage(question, "user");
    questionInput.value = ""; // Giriş alanını temizle
    questionInput.style.height = "auto"; // Textarea yüksekliğini sıfırla

    // Model seçimi mantığı
    let modelId = MODELS.pro; // Varsayılan pro model
    if (currentModel === "hizli") modelId = MODELS.hizli;
    else if (currentModel === "dusunen") modelId = MODELS.dusunen;
    else if (currentModel === "oto") {
        // Oto modunda rastgele hızlı veya pro model seç
        const otoModels = [MODELS.hizli, MODELS.pro];
        modelId = otoModels[Math.floor(Math.random() * otoModels.length)];
    }

    // Yükleniyor (Düşünüyor...) mesajını ekle
    const loadingMessage = addMessage(currentModel === "dusunen" ? "🧠 Düşünüyorum..." : "⚡ Yanıt hazırlıyorum...", "bot");
    loadingMessage.style.opacity = "0.6"; // Hafif şeffaf yap

    try {
        // API İsteği
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${API_KEY}` 
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: "user", content: question }],
                temperature: 0.7 // Yanıt çeşitliliği
            })
        });

        const data = await response.json();
        loadingMessage.remove(); // Yükleniyor mesajını kaldır
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            // API yanıtını ekle
            addMessage(data.choices[0].message.content, "bot");
        } else {
            throw new Error("API'den geçersiz yanıt alındı.");
        }

    } catch (error) {
        console.error("Hata:", error);
        loadingMessage.innerHTML = "❌ Bir hata oluştu, lütfen tekrar deneyin.";
        loadingMessage.style.color = "#ff4444"; // Hata rengi
        loadingMessage.style.opacity = "1";
    }
}

// Sohbet alanına mesaj ekleme fonksiyonu
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `msg ${sender}`;
    // Markdown benzeri yeni satırları <br> ile değiştir (Basit formatlama)
    messageDiv.innerHTML = text.replace(/\n/g, "<br>");
    
    const chatBox = document.getElementById("chat");
    chatBox.appendChild(messageDiv);
    
    // Sohbeti en alta kaydır (Smooth scrolling)
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    return messageDiv; // Eklenen mesaj div'ini döndür (Yükleniyor mesajını silmek için)
}

// --- GİRİŞ (AUTH) FONKSİYONLARI ---

// Misafir olarak giriş yapma
window.enterAsGuest = () => {
    // Giriş ekranını yavaşça gizle
    const authOverlay = document.getElementById('auth-overlay');
    authOverlay.style.opacity = '0';
    setTimeout(() => {
        authOverlay.style.display = 'none';
        document.getElementById('main-app').style.display = 'flex'; // Ana uygulamayı göster
        addMessage("✨ Neuramax'a hoş geldin! Ben senin yapay zeka asistanınım. Sana nasıl yardımcı olabilirim?", "bot");
    }, 500);
};

// Google ile giriş yapma (Callback fonksiyonu)
window.onSignIn = (response) => {
    // JWT Payload'unu çöz (Base64'ten JSON'a)
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    
    // Giriş ekranını gizle ve ana uygulamayı göster
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    // Kullanıcı bilgilerini header'a ekle
    const userHeaderInfo = document.getElementById('user-header-info');
    userHeaderInfo.style.display = 'flex';
    // Sadece adı göster (Varsa given_name, yoksa tam name)
    document.getElementById('u-tag').textContent = payload.given_name || payload.name;
    document.getElementById('user-pfp').src = payload.picture;
    
    // Hoş geldin mesajı ekle
    addMessage(`Merhaba ${payload.given_name || payload.name}! Seni görmek harika. 😊 Senin için ne yapabilirim?`, "bot");
};
