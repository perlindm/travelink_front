// script.js

// Функция для получения подсказок
async function fetchSuggestions(query, inputId) {
    const suggestionsList = document.getElementById(`${inputId}-suggestions`);
    suggestionsList.innerHTML = "";

    if (!query) {
        suggestionsList.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`/search-locations?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Не удалось получить подсказки");
        }
        const data = await response.json();

        if (data && data.length > 0) {
            data.forEach(location => {
                const li = document.createElement("li");
                li.textContent = `${location.name} (${location.iataCode})`;
                li.addEventListener("click", () => {
                    document.getElementById(inputId).value = location.iataCode; // Устанавливаем IATA-код
                    suggestionsList.style.display = "none";
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = "block";
        } else {
            suggestionsList.style.display = "none";
        }
    } catch (error) {
        console.error("Ошибка:", error);
        suggestionsList.style.display = "none";
    }
}

// Обработчики для полей ввода
document.getElementById("origin").addEventListener("input", (e) => {
    fetchSuggestions(e.target.value, "origin");
});

document.getElementById("destination").addEventListener("input", (e) => {
    fetchSuggestions(e.target.value, "destination");
});

// Скрываем подсказки при клике вне поля
document.addEventListener("click", (e) => {
    if (!e.target.closest(".suggestions")) {
        document.getElementById("origin-suggestions").style.display = "none";
        document.getElementById("destination-suggestions").style.display = "none";
    }
});

// Обработчик формы
document.getElementById('flight-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const origin = document.getElementById('origin').value.toUpperCase();
    const destination = document.getElementById('destination').value.toUpperCase();
    const date = document.getElementById('date').value;

    // Перенаправляем на страницу результатов с параметрами в URL
    window.location.href = `results.html?origin=${origin}&destination=${destination}&date=${date}`;
});
