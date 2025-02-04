// script.js

// Обработчик для главной страницы
if (window.location.pathname === "/") {
    document.getElementById('flight-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const origin = document.getElementById('origin').value.toUpperCase();
        const destination = document.getElementById('destination').value.toUpperCase();
        const date = document.getElementById('date').value;

        // Перенаправляем на страницу результатов с параметрами в URL
        window.location.href = `results.html?origin=${origin}&destination=${destination}&date=${date}`;
    });
}

// Обработчик для страницы результатов
if (window.location.pathname.includes("results.html")) {
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const origin = params.get('origin');
        const destination = params.get('destination');
        const date = params.get('date');

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = "<p>Loading...</p>";

        try {
            const response = await fetch(`https://bot-back-i4in.onrender.com/search-flights?origin=${origin}&destination=${destination}&date=${date}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch data");
            }
            const data = await response.json();

            if (data && data.data && data.data.length > 0) {
                let flightsHtml = "";
                data.data.forEach(flight => {
                    const price = flight.price.total;
                    const departure = flight.itineraries[0].segments[0].departure.at;
                    const arrival = flight.itineraries[0].segments[0].arrival.at;
                    const bookingLink = flight.links.booking; // Ссылка для покупки билета

                    flightsHtml += `
                        <div class="flight-item">
                            <p><strong>Price:</strong> $${price}</p>
                            <p><strong>Departure:</strong> ${departure}</p>
                            <p><strong>Arrival:</strong> ${arrival}</p>
                            <p><a href="${bookingLink}" target="_blank">Book Now</a></p>
                        </div>
                    `;
                });
                resultsDiv.innerHTML = flightsHtml;
            } else {
                resultsDiv.innerHTML = "<p>No flights found.</p>";
            }
        } catch (error) {
            console.error("Error:", error);
            resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
}