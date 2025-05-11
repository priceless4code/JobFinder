document.addEventListener("DOMContentLoaded", () => {
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
});

// ==== Job Filter/Search Setup ====
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const jobListings = document.querySelector(".job-listings");
const loading = document.getElementById("loading");

let jobs = [];

function displayJobs(filteredJobs) {
  jobListings.innerHTML = "";

  if (filteredJobs.length === 0) {
    jobListings.innerHTML = `<p>No jobs found. Try another search/filter.</p>`;
    return;
  }

  filteredJobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.type}</p>
      <button class="apply-btn">Apply Now</button>
    `;
    jobListings.appendChild(card);
  });
}

function filterJobs() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedType = typeFilter.value;

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm);
    const matchesType = selectedType ? job.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  displayJobs(filtered);
}

searchInput.addEventListener("input", filterJobs);
typeFilter.addEventListener("change", filterJobs);

// ==== Fetch from Remote OK ====
async function fetchJobs() {
  loading.style.display = "block";

  try {
    const res = await fetch("https://remoteok.com/api");
    const data = await res.json();

    jobs = data.slice(1).map((job) => ({
      title: job.position || job.title,
      company: job.company,
      type: job.tags.includes("Full-Time")
        ? "Full-time"
        : job.tags.includes("Part-Time")
        ? "Part-time"
        : job.tags.includes("Internship")
        ? "Internship"
        : "Remote",
      location: job.location || "Remote",
    }));

    displayJobs(jobs);
  } catch (err) {
    jobListings.innerHTML = `<p>Oops! Couldn't load jobs. Try again later.</p>`;
    console.error("Error fetching jobs:", err);
  } finally {
    loading.style.display = "none";
  }
}

fetchJobs();