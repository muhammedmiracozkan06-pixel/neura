async function neuraSorgula() {
    const input = document.getElementById("user-input");
    const status = document.getElementById("status");
    const responseArea = document.getElementById("response-text");
    const soru = input.value;

    if (!soru) return;

    // 1. Arama başladığında yazı çıksın
    status.innerText = "İnternet taranıyor... 🔍";
    responseArea.innerText = "Düşünüyorum...";
    input.value = "";

    try {
        // Tavily API bağlantısı
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: "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", // ANAHTARIN BURADA
                query: soru,
                search_depth: "smart",
                include_answer: true
            })
        });

        const data = await response.json();

        // 2. Arama bitti, yazıyı kaldır ve cevabı bas!
        status.innerText = ""; 
        responseArea.innerText = data.answer || "Buna dair net bir bilgi bulamadım kanka.";

    } catch (error) {
        status.innerText = "";
        responseArea.innerText = "Hata oluştu! İnternet bağlantını kontrol et kanka. ❌";
        console.error("Hata:", error);
    }
}
