async function talk() {
    if (isLoading) return;

    const input = document.getElementById("q");
    const statusContainer = document.getElementById("status-container");
    const txt = input.value.trim();
    if (!txt) return;

    isLoading = true;
    input.value = "";
    add(txt, "user");

    const statusDiv = document.createElement("div");
    statusDiv.className = "searching";
    statusDiv.style.color = "#3b82f6";
    statusDiv.innerHTML = "Neura Max Google'a bağlanıyor... 🔍";
    statusContainer.appendChild(statusDiv);

    const API_KEY = "AIzaSyCOsLPocFBBDOyD1OxUcS8eGj-fBTVGm3o";
    const CX_ID = "407bb5243e1e54e15";

    try {
        console.log("Sorgu gönderiliyor: " + txt); // Konsol Takibi

        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(txt)}`;
        const r = await fetch(url);
        
        // Google'dan gelen ham cevabı kontrol edelim
        const d = await r.json();
        console.log("Google'dan gelen ham veri:", d); // F12'de buraya bakacağız!

        statusDiv.remove();

        if (d.items && d.items.length > 0) {
            // İlk sonucu ve açıklamasını al
            const ilkSonuc = d.items[0];
            add(ilkSonuc.snippet, "bot");
            console.log("Başarıyla yazdırıldı!");
        } else if (d.error) {
            // Google bir hata mesajı gönderdiyse
            add("Google Hatası: " + d.error.message, "bot");
            console.error("Hata detayı:", d.error);
        } else {
            add("Google sonuç bulamadı. Belki de 'Tüm Web'de Ara' ayarı kapalıdır kanka? 🧐", "bot");
        }

    } catch (err) {
        if(statusDiv) statusDiv.remove();
        add("❗ Bağlantı kurulamadı. İnternetini veya API kodlarını kontrol et.", "bot");
        console.error("Catch Hatası:", err);
    }

    isLoading = false;
}
