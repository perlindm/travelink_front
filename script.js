let debounceTimer; // Для дебаунса

// Функция для получения подсказок
async function fetchSuggestions(query, inputId) {
    const suggestionsList = document.getElementById(`${inputId}-suggestions`);
    if (!suggestionsList) {
        console.error(`Элемент с id='${inputId}-suggestions' не найден!`);
        return;
    }
    suggestionsList.innerHTML = "";
    if (query.length < 2) {
        suggestionsList.classList.remove("active");
        return;
    }
    clearTimeout(debounceTimer); // Очищаем предыдущий таймер
    debounceTimer = setTimeout(async () => {
        try {
            console.log(`Fetching suggestions for query: ${query}`);
            const response = await fetch(`https://bot-back-i4in.onrender.com/search-locations?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`Ошибка при получении подсказок (Статус: ${response.status})`);
            }
            const data = await response.json();
            console.log("Полученные данные:", data);
            if (data.length > 0) {
                data.forEach(location => {
                    const li = document.createElement("li");
                    li.textContent = `${location.name} (${location.iataCode})`;
                    li.dataset.iata = location.iataCode; // Сохраняем IATA-код
                    li.addEventListener("click", () => {
                        document.getElementById(inputId).value = location.name; // Показываем название города
                        document.getElementById(inputId).dataset.iata = location.iataCode; // Сохраняем IATA-код
                        suggestionsList.classList.remove("active");
                    });
                    suggestionsList.appendChild(li);
                });
                suggestionsList.classList.add("active");
            } else {
                suggestionsList.innerHTML = "<li>Подсказки не найдены</li>";
                suggestionsList.classList.add("active");
            }
        } catch (error) {
            console.error("Ошибка при получении подсказок:", error);
            suggestionsList.innerHTML = `<li>Ошибка: ${error.message}</li>`;
            suggestionsList.classList.add("active");
        }
    }, 300); // Дебаунс 300 мс
}

// Обработчики для полей ввода
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const originSuggestions = document.getElementById("origin-suggestions");
const destinationSuggestions = document.getElementById("destination-suggestions");

if (originInput && originSuggestions) {
    originInput.addEventListener("input", (e) => {
        fetchSuggestions(e.target.value, "origin");
    });
}

if (destinationInput && destinationSuggestions) {
    destinationInput.addEventListener("input", (e) => {
        fetchSuggestions(e.target.value, "destination");
    });
}

// Скрытие подсказок при клике вне списка
document.addEventListener("click", (e) => {
    if (!e.target.closest(".suggestions")) {
        if (originSuggestions) originSuggestions.classList.remove("active");
        if (destinationSuggestions) destinationSuggestions.classList.remove("active");
    }
});

// Обработчик формы
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    if (!searchButton) {
        console.error("Элемент с id='search-button' не найден!");
        return;
    }

    searchButton.addEventListener('click', () => {
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        const origin = originInput.dataset.iata || originInput.value.toUpperCase();
        const destination = destinationInput.dataset.iata || destinationInput.value.toUpperCase();
        const date = document.getElementById('date').value;

        if (!origin || !destination || !date) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        window.location.href = `results.html?origin=${origin}&destination=${destination}&date=${date}`;
    });
});
