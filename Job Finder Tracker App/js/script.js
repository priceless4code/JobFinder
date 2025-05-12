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

  // Display jobs in the UI
  function displayJobs(jobsToShow) {
    jobListings.innerHTML = "";
    
    if (jobsToShow.length === 0) {
      emptyState.style.display = "block";
      return;
    }
    
    emptyState.style.display = "none";
    
    jobsToShow.forEach((job) => {
      // Generate random status for demo purposes
      const statuses = ["", "", "", "New", "Applied"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const statusHTML = randomStatus ? 
        `<span class="status-badge status-${randomStatus.toLowerCase()}">${randomStatus}</span>` : '';
      
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        ${statusHTML}
        <h3>${job.title}</h3>
        <p class="job-meta company"><strong>Company:</strong> ${job.company}</p>
        <p class="job-meta location"><strong>Location:</strong> ${job.location}</p>
        <p class="job-meta type"><strong>Type:</strong> ${job.type}</p>
        
        <div class="job-tags">
          <span class="tag">${job.type}</span>
          <span class="tag">${job.location}</span>
        </div>
        
        <button class="apply-btn">Apply Now</button>
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
    });
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
    filterJobs();
  });

  // Reset search from empty state
  resetSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    locationFilter.value = "";
    filterJobs();
  });

  // Fetch Jobs Data
  async function fetchJobs() {
    loading.style.display = "block";
    emptyState.style.display = "none";

    try {
      // First try to fetch from remote API
      try {
        const res = await fetch("https://remoteok.com/api");
        const data = await res.json();

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
          }
        ];
      }
    } catch (error) {
      console.error("Error loading job data:", error);
      emptyState.style.display = "block";
    } finally {
      loading.style.display = "none";
      filterJobs(); // Display all jobs initially
    }
  }

  // Initialize the app
  fetchJobs();
});
