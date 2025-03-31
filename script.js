// API configuration (replace with your actual API key)
const API_KEY = '4115b6bed6c3481eb8150fe164bba676';
const API_URL = 'https://newsapi.org/v2/top-headlines';

// DOM elements
const newsContainer = document.getElementById('news-container');
const categorySelect = document.getElementById('category');
const searchInput = document.getElementById('search');

// Fetch news based on selected category and search query
function fetchNews() {
    const category = categorySelect.value;
    const query = searchInput.value;

    // Show loading state
    newsContainer.innerHTML = '<div class="loading">Loading latest headlines...</div>';

    // Use HTTPS and build URL with parameters
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&pageSize=20&country=us`;

    if (category !== 'general') {
        url += `&category=${category}`;
    }

    if (query) {
        url += `&q=${encodeURIComponent(query)}`;
    }

    // Fetch data from API
    fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0' // Helps bypass some API restrictions
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "error") {
            throw new Error(data.message || "Failed to fetch news");
        }
        displayNews(data.articles);
    })
    .catch(error => {
        newsContainer.innerHTML = `
            <div class="error-message">
                <h3>Could not load news</h3>
                <p>${error.message}</p>
            </div>
        `;
    });
}


// Display news articles
function displayNews(articles) {
    // Clear previous content
    newsContainer.innerHTML = '';
    
    if (articles.length === 0) {
        newsContainer.innerHTML = '<div class="no-results">No articles found. Try a different search or category.</div>';
        return;
    }
    
    // Create article elements
    articles.forEach(article => {
        // Skip articles without required data
        if (!article.title || !article.url) return;
        
        // Create news item element
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        // Get formatted date
        const publishDate = article.publishedAt ? 
            new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : '';
        
        // Create category badge
        const category = categorySelect.options[categorySelect.selectedIndex].text;
        
        // Set article content
        newsItem.innerHTML = `
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" onerror="this.src='placeholder-news.jpg'">` : ''}
            <div class="news-category">${category}</div>
            <div class="news-content">
                <div class="publish-date">${publishDate}</div>
                <h3>${article.title}</h3>
                <p>${article.description || 'Read the full article for details...'}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">Continue Reading</a>
            </div>
        `;
        
        // Add to container
        newsContainer.appendChild(newsItem);
    });
}

// Initial news load when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

// Handle search on Enter key press
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchNews();
    }
});

// Responsive handling
window.addEventListener('resize', () => {
    // Adjust layout if needed based on window size
    const width = window.innerWidth;
    const newsItems = document.querySelectorAll('.news-item');
    
    if (width <= 480) {
        // Additional responsive adjustments if needed
    }
});


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(error => console.log('Service Worker Registration Failed:', error));
}
