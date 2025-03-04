document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    const categoryFilter = document.getElementById("categoryFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const destinationList = document.getElementById("destinationList");

    // Destination Data
    const destinations = [
        { name: "Maldives", category: "beach", rating: 5, lat: 3.2028, lng: 73.2207, videoID: "W4YfDg-dKzk" },
        { name: "New York", category: "city", rating: 4, lat: 40.7128, lng: -74.0060, videoID: "h3fUgOKFMNU" },
        { name: "Swiss Alps", category: "nature", rating: 5, lat: 46.8182, lng: 8.2275, videoID: "TE_Gf16EGHA" },
        { name: "Machu Picchu", category: "historical", rating: 5, lat: -13.1631, lng: -72.5450, videoID: "oZ90M55mDac" }
    ];

    // Render Destination List
    function renderDestinations() {
        destinationList.innerHTML = "";
        const searchQuery = searchBox.value.toLowerCase();
        const category = categoryFilter.value;
        const rating = parseInt(ratingFilter.value) || 0;

        const filteredDestinations = destinations.filter(dest =>
            (category === "all" || dest.category === category) &&
            (rating === 0 || dest.rating >= rating) &&
            dest.name.toLowerCase().includes(searchQuery)
        );

        filteredDestinations.forEach(dest => {
            const div = document.createElement("div");
            div.classList.add("destination");
            div.innerHTML = `
                <h3>${dest.name}</h3>
                <p>⭐ ${dest.rating}</p>
                <iframe class="video-player youtube-video" src="https://www.youtube.com/embed/${dest.videoID}?enablejsapi=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            `;
            destinationList.appendChild(div);
        });

        attachVideoEventListeners();
    }

    // Ensure Only One Video Plays at a Time
    function attachVideoEventListeners() {
        const videos = document.querySelectorAll(".video-player");
        videos.forEach(video => {
            video.addEventListener("play", () => {
                videos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                });
            });
        });
    }

    // Fix Lazy Loading for Trending Videos
    function loadTrendingVideos() {
        const lazyVideos = document.querySelectorAll(".youtube-video.lazyload");
        lazyVideos.forEach(video => {
            video.src = video.dataset.src;
            video.classList.remove("lazyload");
        });
    }

    // Dark Mode with Local Storage
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    }

    darkModeToggle.addEventListener("click", toggleDarkMode);

    // Apply Dark Mode on Page Load
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // Load Google Map with Markers
    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: { lat: 20, lng: 0 },
        });

        destinations.forEach(dest => {
            new google.maps.Marker({
                position: { lat: dest.lat, lng: dest.lng },
                map,
                title: dest.name
            });
        });
    }

    window.initMap = initMap;

    // Event Listeners
    searchBox.addEventListener("input", renderDestinations);
    categoryFilter.addEventListener("change", renderDestinations);
    ratingFilter.addEventListener("change", renderDestinations);
    
    // Initial Render
    renderDestinations();
    loadTrendingVideos();
});


