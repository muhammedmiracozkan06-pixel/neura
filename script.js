let isLoading = false;

async function talk() {
    if (isLoading) return;

    const input = document.getElementById("q");
    const statusContainer = document.getElementById("status-container");
    const txt = input.value.trim();
    if (!txt) return;

    isLoading = true;
    input.value = "";
    add(txt, "user");

    // 🔍 Google amcaya soruyoruz yazısı
    const statusDiv = document.createElement("div");
    statusDiv.className = "searching";
    statusDiv.style.color = "#3b82f6";
    statusDiv.style.fontSize = "13px";
    statusDiv.style.marginBottom = "5px";
    statusDiv.innerHTML = "Google verileri taranıyor... ✨🔍";
    statusContainer.appendChild(statusDiv);

    // SENİN TAZE CEPHANELERİN 💎
    const API_KEY = "AIzaSyCOsLPocFBBDOyD1OxUcS8eGj-fBTVGm3o";
    const CX_ID = "407bb5243e1e54e15";

    try {
        // Google Custom Search API bağlantısı
        const r = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(txt)}`);
        const d = await r.json();
        
        statusDiv.remove(); // Yazıyı kaldır

        if (d.items && d.items.length > 0) {
            // Google'ın bulduğu en iyi sonucun açıklamasını veriyoruz
            const cevap = d.items[0].snippet;
            add(cevap, "bot");
            
            // Eğer istersen kaynağı da altına ekleyebiliriz:
            // add("Kaynak: " + d.items[0].link, "bot"); 
        } else {
            add("üzgünüm bu soru ile ilgli internette hiçbirşey yok.", "bot");
        }

    } catch (err) {
        if(statusDiv) statusDiv.remove();
        add("❗ Network error", "bot");
        console.error(err);
    }

    isLoading = false;
}
}
