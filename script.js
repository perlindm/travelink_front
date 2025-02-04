let debounceTimer; // Для дебаунса

async function fetchSuggestions(query, inputId) {
    const suggestionsList = document.getElementById(`${inputId}-suggestions`);
    suggestionsList.innerHTML = "";

    if (query.length < 2) {
        suggestionsList.style.display = "none";
        return;
    }

    clearTimeout(debounceTimer); // Очищаем предыдущий таймер

    debounceTimer = setTimeout(async () => {
        try {
            console.log(`Fetching suggestions for query: ${query}`);
            const response = await fetch(`https://bot-back-i4in.onrender.com/search-locations?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Received data:", data);

            if (data.length > 0) {
                data.forEach(location => {
                    const li = document.createElement("li");
                    li.textContent = `${location.name} (${location.iataCode})`;
                    li.dataset.iata = location.iataCode; // Сохраняем IATA-код
                    li.addEventListener("click", () => {
                        document.getElementById(inputId).value = location.name; // Показываем название города
                        document.getElementById(inputId).dataset.iata = location.iataCode; // Сохраняем IATA-код
                        suggestionsList.style.display = "none";
                    });
                    suggestionsList.appendChild(li);
                });
                suggestionsList.style.display = "block";
            } else {
                suggestionsList.style.display = "none";
            }
        } catch (error) {
            console.error("Ошибка при получении подсказок:", error);
            suggestionsList.style.display = "none";
        }
    }, 300); // Дебаунс 300 мс
}

// Обработчики для полей ввода
document.getElementById("origin").addEventListener("input", (e) => {
    fetchSuggestions(e.target.value, "origin");
});

document.getElementById("destination").addEventListener("input", (e) => {
    fetchSuggestions(e.target.value, "destination");
});

// Скрытие подсказок при клике вне списка
document.addEventListener("click", (e) => {
    if (!e.target.closest(".suggestions")) {
        document.getElementById("origin-suggestions").style.display = "none";
        document.getElementById("destination-suggestions").style.display = "none";
    }
});

// Обработчик формы
document.getElementById('flight-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const origin = originInput.dataset.iata || originInput.value.toUpperCase();
    const destination = destinationInput.dataset.iata || destinationInput.value.toUpperCase();
    const date = document.getElementById('date').value;

    if (!origin || !destination || !date) {
        alert("Please fill in all fields.");
        return;
    }

    window.location.href = `results.html?origin=${origin}&destination=${destination}&date=${date}`;
});
