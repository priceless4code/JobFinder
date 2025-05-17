document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Logic
  const toggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  // Theme toggle button click
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    // Save or remove theme in localStorage
    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }
  });

  // Job Search & Filter Implementation
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const typeFilter = document.getElementById("typeFilter");
  const locationFilter = document.getElementById("locationFilter");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const resetSearchBtn = document.getElementById("resetSearch");
  const jobListings = document.querySelector(".job-listings");
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("emptyState");


  let jobs = [];
  let filteredJobs = [];
  let currentPage = 1;
  const jobsPerPage = 6;

  // Display jobs in the UI
  function displayJobs(jobsToShow, page = 1) {
    jobListings.innerHTML = "";
    
    if (jobsToShow.length === 0) {
      emptyState.style.display = "block";
      renderPagination(0);
      return;
    }
    
    emptyState.style.display = "none";
    
    // Calculate pagination
    const startIndex = (page - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const paginatedJobs = jobsToShow.slice(startIndex, endIndex);
    
    paginatedJobs.forEach((job, index) => {
      // Generate random status for demo purposes
      const statuses = ["", "", "", "New", "Applied"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const statusHTML = randomStatus ? 
        `<span class="status-badge status-${randomStatus.toLowerCase()}">${randomStatus}</span>` : '';
      
      // Check if job is favorited
      const isFavorited = localStorage.getItem(`favorite_${job.id}`) === "true";
      const favoriteIcon = isFavorited ? 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
      
      const card = document.createElement("div");
      card.className = "job-card";
      card.style.setProperty("--index", index);
      card.innerHTML = `
        ${statusHTML}
        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-job-id="${job.id}" aria-label="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
          ${favoriteIcon}
        </button>
        <h3>${job.title}</h3>
        <p class="job-meta company"><strong>Company:</strong> ${job.company}</p>
        <p class="job-meta location"><strong>Location:</strong> ${job.location}</p>
        <p class="job-meta type"><strong>Type:</strong> ${job.type}</p>
        
        <div class="job-tags">
          <span class="tag">${job.type}</span>
          <span class="tag">${job.location}</span>
        </div>
        
        <div class="job-actions">
          <button class="apply-btn">Apply Now</button>
        </div>
      `;
      jobListings.appendChild(card);
      
      // Add click event to apply button
      const applyBtn = card.querySelector(".apply-btn");
      applyBtn.addEventListener("click", () => {
        if (job.link) {
          window.open(job.link, '_blank');
        } else {
          alert(`Apply for ${job.title} at ${job.company}`);
        }
      });
      
      // Add click event to favorite button
      const favoriteBtn = card.querySelector(".favorite-btn");
      favoriteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const jobId = favoriteBtn.dataset.jobId;
        const isFavorited = favoriteBtn.classList.contains("favorited");
        
        if (isFavorited) {
          localStorage.removeItem(`favorite_${jobId}`);
          favoriteBtn.classList.remove("favorited");
          favoriteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
          favoriteBtn.setAttribute("aria-label", "Add to favorites");
        } else {
          localStorage.setItem(`favorite_${jobId}`, "true");
          favoriteBtn.classList.add("favorited");
          favoriteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
          favoriteBtn.setAttribute("aria-label", "Remove from favorites");
        }
      });
    });
    
    // Render pagination
    renderPagination(jobsToShow.length);
  }

  // Render pagination controls
  function renderPagination(totalJobs) {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const paginationContainer = document.querySelector(".pagination");
    
    if (!paginationContainer) {
      if (totalPages > 1) {
        const pagination = document.createElement("div");
        pagination.className = "pagination";
        jobListings.after(pagination);
      }
      return;
    }
    
    paginationContainer.innerHTML = "";
    
    if (totalPages <= 1) {
      paginationContainer.remove();
      return;
    }
    
    // Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayJobs(filteredJobs, currentPage);
        window.scrollTo({ top: jobListings.offsetTop - 20, behavior: "smooth" });
      }
    });
    paginationContainer.appendChild(prevButton);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.classList.add("active");
      }
      pageButton.addEventListener("click", () => {
        currentPage = i;
        displayJobs(filteredJobs, currentPage);
        window.scrollTo({ top: jobListings.offsetTop - 20, behavior: "smooth" });
      });
      paginationContainer.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayJobs(filteredJobs, currentPage);
        window.scrollTo({ top: jobListings.offsetTop - 20, behavior: "smooth" });
      }
    });
    paginationContainer.appendChild(nextButton);
  }

  // Filter jobs based on current filters
  function filterJobs() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedLocation = locationFilter.value;

    filteredJobs = jobs.filter((job) => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm);
        
      const matchesType = !selectedType || job.type === selectedType;
      const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);
      
      return matchesSearch && matchesType && matchesLocation;
    });

    currentPage = 1; // Reset to first page when filters change
    displayJobs(filteredJobs);
  }

  // Event listeners for filters
  searchInput.addEventListener("input", filterJobs);
  searchButton.addEventListener("click", filterJobs);
  typeFilter.addEventListener("change", filterJobs);
  locationFilter.addEventListener("change", filterJobs);
  
  // Enter key in search input
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterJobs();
    }
  });

  // Clear all filters
  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    locationFilter.value = "";
    currentPage = 1;
    filterJobs();
  });

  // Reset search from empty state
  resetSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    locationFilter.value = "";
    currentPage = 1;
    filterJobs();
  });

  // Fetch Jobs Data
  async function fetchJobs() {
    loading.style.display = "block";
    emptyState.style.display = "none";
    document.body.setAttribute("aria-busy", "true");

    try {
      // First try to fetch from remote API
      try {
        const response = await fetch("https://remoteok.com/api");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        jobs = data.slice(1).map((job) => ({
          id: job.id || Math.random().toString(36).substring(2, 9),
          title: job.position || job.title,
          company: job.company,
          type: job.tags && job.tags.includes("Full-Time")
            ? "Full-time"
            : job.tags && job.tags.includes("Part-Time")
            ? "Part-time"
            : job.tags && job.tags.includes("Internship")
            ? "Internship"
            : "Remote",
          location: job.location || "Remote",
          link: job.url || job.apply_url
        }));
      } catch (err) {
        console.warn("Error fetching remote jobs, falling back to mock data:", err);
        
        // Fallback to mock data
        jobs = [
          {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Remote",
            type: "Full-time",
            link: "https://techcorp.com/careers/frontend"
          },
          {
            id: 2,
            title: "Backend Engineer",
            company: "DataSystems",
            location: "San Francisco, CA",
            type: "Full-time",
            link: "https://datasystems.com/jobs/backend"
          },
          {
            id: 3,
            title: "UX Designer",
            company: "DesignHub",
            location: "Remote",
            type: "Full-time",
            link: "https://designhub.com/careers"
          },
          {
            id: 4,
            title: "Data Scientist",
            company: "DataCorp",
            location: "New York, NY",
            type: "Full-time",
            link: "https://datacorp.com/jobs"
          },
          {
            id: 5,
            title: "Marketing Intern",
            company: "GrowthMarketing",
            location: "Remote",
            type: "Internship",
            link: "https://growthmarketing.com/internships"
          },
          {
            id: 6,
            title: "Product Manager",
            company: "ProductLabs",
            location: "Hybrid",
            type: "Full-time",
            link: "https://productlabs.io/careers"
          },
          {
            id: 7,
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Remote",
            type: "Full-time",
            link: "https://cloudtech.com/jobs/devops"
          },
          {
            id: 8,
            title: "Customer Support",
            company: "HelpDesk",
            location: "On-site",
            type: "Part-time",
            link: "https://helpdesk.com/join-us"
          },
          {
            id: 9,
            title: "Mobile Developer",
            company: "AppWorks",
            location: "Remote",
            type: "Full-time",
            link: "https://appworks.com/careers"
          },
          {
            id: 10,
            title: "UI Designer",
            company: "PixelPerfect",
            location: "Hybrid",
            type: "Full-time",
            link: "https://pixelperfect.design/jobs"
          }
        ];
      }
    } catch (error) {
      console.error("Error loading job data:", error);
      emptyState.style.display = "block";
      emptyState.innerHTML = `
        <h3>Error Loading Jobs</h3>
        <p>We couldn't load the job listings. Please try again later.</p>
        <button id="retryFetch">Retry</button>
      `;
      
      document.getElementById("retryFetch")?.addEventListener("click", fetchJobs);
    } finally {
      loading.style.display = "none";
      document.body.removeAttribute("aria-busy");
      filterJobs(); // Display all jobs initially
    }
  }

  // Initialize the app
  fetchJobs();
});

// Modal

