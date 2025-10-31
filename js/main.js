/* Wait for the page to be fully loaded before running JS */
document.addEventListener('DOMContentLoaded', () => {
  /* ===================================
   * 1. Mobile Menu
   * =================================== */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-active');
      
      if (menuBtn.classList.contains('ri-menu-3-line')) {
        menuBtn.classList.remove('ri-menu-3-line');
        menuBtn.classList.add('ri-close-line');
      } else {
        menuBtn.classList.remove('ri-close-line');
        menuBtn.classList.add('ri-menu-3-line');
      }
    });
  }

  /* ===================================
   * 2. Global Dark Mode Toggle
   * =================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  if (themeToggleBtn && themeToggleIcon) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      themeToggleIcon.classList.remove('ri-sun-line');
      themeToggleIcon.classList.add('ri-moon-line');
    } else {
      themeToggleIcon.classList.remove('ri-moon-line');
      themeToggleIcon.classList.add('ri-sun-line');
    }

    themeToggleBtn.addEventListener('click', () => {
      const root = document.documentElement;
      
      if (root.classList.contains('dark-mode')) {
        root.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeToggleIcon.classList.remove('ri-moon-line');
        themeToggleIcon.classList.add('ri-sun-line');
      } else {
        root.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeToggleIcon.classList.remove('ri-sun-line');
        themeToggleIcon.classList.add('ri-moon-line');
      }
    });
  }

  /* ===================================
   * 3. Lofi Player (Simplified)
   * =================================== */

  // --- 1. DEFINE YOUR TRACKS ---
  const tracks = [
    { title: "Affection (Bollywood Pop)", file: "affection-bollywood-pop-music-410419.mp3" },
    { title: "Cascade Breathe (Future Garage)", file: "cascade-breathe-future-garage-412839.mp3" },
    { title: "Chill Vibes (Lofi Hiphop)", file: "chill-vibes-lofi-chill-hiphop-background-music-304596.mp3" },
    { title: "Coding Night", file: "coding-night-112186.mp3" },
    { title: "Deep Abstract Snowcap", file: "deep-abstract-ambient_snowcap-401656.mp3" },
    { title: "Desire (Bollywood Pop)", file: "desire-bollywood-pop-music-410423.mp3" },
    { title: "Fasana (Bollywood Pop)", file: "fasana-bollywood-pop-music-420353.mp3" },
    { title: "Fighter (Nepalese Hiphop)", file: "fighter-nepalese-hiphop-music-407260.mp3" },
    { title: "Lofi Girl Dreams", file: "lofi-girl-dreams-113883.mp3" },
    { title: "Lofi Hiphop Vlogs", file: "lofi-hiphop-vlogs-music-295447.mp3" },
    { title: "Lofi Chill", file: "lofi-lofi-chill-398290.mp3" },
    { title: "Lofi Relax", file: "lofi-relax-347168.mp3" },
    { title: "Lofi Study Calm", file: "lofi-study-calm-peaceful-chill-hop-112191.mp3" },
    { title: "Retro Lounge", file: "retro-lounge-389644.mp3" },
    { title: "Sajna (Bollywood Pop)", file: "sajna-bollywood-pop-music-410428.mp3" },
    { title: "Saxy Time", file: "saxy-time-174778.mp3" }
  ];

  // --- 2. GET ALL THE ELEMENTS ---
  const lofiAudio = document.getElementById('lofi-audio');
  const lofiBtn = document.getElementById('lofi-btn');
  const lofiIcon = document.getElementById('lofi-icon');
  const lofiStatus = document.getElementById('lofi-status');
  const lofiTime = document.getElementById('lofi-time');
  const lofiPrevBtn = document.getElementById('lofi-prev-btn');
  const lofiNextBtn = document.getElementById('lofi-next-btn');
  const tracksBtn = document.getElementById('lofi-tracks-btn');
  const modal = document.getElementById('lofi-modal');
  const trackList = document.getElementById('lofi-track-list');
  const modalCloseBtn = document.getElementById('lofi-modal-close');

  // --- 3. PLAYER STATE ---
  let isPlaying = false;
  let currentTrackIndex = 0; 

  // --- 4. HELPER FUNCTIONS ---
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateTimestamp() {
    if (lofiAudio && lofiAudio.duration) {
      const currentTime = formatTime(lofiAudio.currentTime);
      const duration = formatTime(lofiAudio.duration);
      if(lofiTime) lofiTime.textContent = `${currentTime} / ${duration}`;
    } else if (lofiAudio) {
      if(lofiTime) lofiTime.textContent = `${formatTime(lofiAudio.currentTime)} / --:--`;
    }
  }

  function updateActiveTrackHighlight() {
    if (!trackList) return;
    const allTracks = trackList.querySelectorAll('li');
    allTracks.forEach(li => {
      li.classList.remove('active-track');
    });
    
    const activeTrackEl = trackList.querySelector(`li[data-index="${currentTrackIndex}"]`);
    if (activeTrackEl) {
      activeTrackEl.classList.add('active-track');
    }
  }

  // --- 5. THE MAIN PLAY FUNCTION ---
  function playTrack(index) {
    if (index < 0) index = tracks.length - 1;
    if (index >= tracks.length) index = 0;
    
    const track = tracks[index];
    lofiAudio.src = `music/${track.file}`;
    lofiAudio.currentTime = 0;
    lofiAudio.onloadedmetadata = () => {
      updateTimestamp();
    }

    lofiAudio.play();
    if(lofiStatus) lofiStatus.textContent = track.title;
    currentTrackIndex = index;
    updateActiveTrackHighlight();
  }

  // --- 6. SAVE & LOAD STATE FUNCTIONS ---
  function saveMusicState() {
    if (!lofiAudio) return;
    const state = {
      index: currentTrackIndex,
      time: lofiAudio.currentTime,
      playing: isPlaying,
    };
    localStorage.setItem('lofiState', JSON.stringify(state));
  }

  function loadMusicState() {
    if (!lofiAudio) return;
    const savedState = JSON.parse(localStorage.getItem('lofiState'));
    
    if (savedState) {
      currentTrackIndex = savedState.index;

      if (currentTrackIndex >= tracks.length) {
        currentTrackIndex = 0;
      }

      const track = tracks[currentTrackIndex];
      lofiAudio.src = `music/${track.file}`;
      if(lofiStatus) lofiStatus.textContent = track.title;
      updateActiveTrackHighlight();

      lofiAudio.onloadedmetadata = () => {
        lofiAudio.currentTime = savedState.time;
        updateTimestamp();
        if (savedState.playing) {
          lofiAudio.play().catch(e => console.warn("Auto-play was blocked."));
        }
      }
    } else {
      // First visit
      const initialTrack = tracks[currentTrackIndex];
      lofiAudio.src = `music/${initialTrack.file}`;
      if(lofiStatus) lofiStatus.textContent = initialTrack.title;
      if(lofiTime) lofiTime.textContent = `0:00 / --:--`;
      updateActiveTrackHighlight();
    }
  }

  // --- 7. INITIALIZE PLAYER & LISTENERS ---
  // A) Core player logic
  if (lofiAudio) {
    if (lofiBtn) {
      lofiBtn.addEventListener('click', () => {
        if (isPlaying) {
          lofiAudio.pause();
        } else {
          lofiAudio.play();
        }
      });
    }

    if (lofiNextBtn) {
      lofiNextBtn.addEventListener('click', () => {
        playTrack(currentTrackIndex + 1);
      });
    }
    
    if (lofiPrevBtn) {
      lofiPrevBtn.addEventListener('click', () => {
        playTrack(currentTrackIndex - 1);
      });
    }

    // Audio events
    lofiAudio.onplay = () => {
      isPlaying = true;
      if(lofiIcon) lofiIcon.classList.replace('ri-play-fill', 'ri-pause-fill');
      saveMusicState();
    };
    lofiAudio.onpause = () => {
      isPlaying = false;
      if(lofiIcon) lofiIcon.classList.replace('ri-pause-fill', 'ri-play-fill');
      saveMusicState();
    };
    lofiAudio.addEventListener('timeupdate', updateTimestamp);
    lofiAudio.addEventListener('loadedmetadata', updateTimestamp);
    lofiAudio.addEventListener('ended', () => {
        if(lofiNextBtn) lofiNextBtn.click(); // Auto-play next
    });

    window.addEventListener('beforeunload', saveMusicState);
  }

  // B) Modal logic
  if (modal && trackList && tracksBtn && modalCloseBtn) {
    tracks.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = track.title;
      li.dataset.index = index;
      trackList.appendChild(li);
    });

    tracksBtn.addEventListener('click', () => {
      modal.classList.add('show');
    });

    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    trackList.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        currentTrackIndex = parseInt(e.target.dataset.index);
        playTrack(currentTrackIndex);
        modal.classList.remove('show');
      }
    });
  }

  // --- 8. INITIAL LOAD ---
  loadMusicState();


  /* ===================================
   * 4. Real-Time Search Filter (Notes Page)
   * =================================== */
  
  const searchInput = document.getElementById('search-bar-input');
  
  // We only add the listener if the search bar exists
  if (searchInput) {
    searchInput.addEventListener('keyup', filterNotes);
  }

  // This is the main filter function
  function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Get ALL cards from the single grid
    const allNoteCards = document.querySelectorAll('#notes-grid-container .note-card');
    
    let notesFound = 0;

    allNoteCards.forEach(card => {
      // Clear previous highlights
      clearHighlights(card);

      // Get all possible text content
      const title = card.querySelector('.title-text')?.textContent.toLowerCase() || '';
      const paragraph = card.querySelector('p')?.textContent.toLowerCase() || '';
      const topics = card.querySelector('.topics')?.textContent.toLowerCase() || '';

      const isMatch = title.includes(searchTerm) || 
                      paragraph.includes(searchTerm) || 
                      topics.includes(searchTerm);
      
      if (isMatch) {
        card.style.display = 'flex'; // Show card
        applyHighlights(card, searchTerm); // Apply highlights
        notesFound++;
      } else {
        card.style.display = 'none'; // Hide card
      }
    });

    // --- Show/Hide Empty Message ---
    const emptyIndicator = document.getElementById('notes-empty');
    if (emptyIndicator) {
      if (notesFound === 0) {
        // No results found anywhere
        emptyIndicator.style.display = 'block';
        emptyIndicator.querySelector('p').textContent = 'No notes match your search.';
      } else {
        emptyIndicator.style.display = 'none';
      }
    }
  }

  function clearHighlights(card) {
    const elements = [
      card.querySelector('.title-text'), 
      card.querySelector('p'), 
      ...card.querySelectorAll('.topics a')
    ];
    elements.forEach(el => {
      if (el && el.innerHTML.includes('<span')) {
        el.innerHTML = el.textContent; // Simple reset to plain text
      }
    });
  }

  function applyHighlights(card, searchTerm) {
    if (searchTerm === '') return;
    const regex = new RegExp(searchTerm, 'gi');
    const elements = [
      card.querySelector('.title-text'), 
      card.querySelector('p'), 
      ...card.querySelectorAll('.topics a')
    ];
    
    elements.forEach(el => {
      // Check if element exists AND its text matches
      if (el && el.textContent.toLowerCase().includes(searchTerm)) {
        el.innerHTML = el.textContent.replace(regex, (match) => `<span class="highlight">${match}</span>`);
      }
    });
  }

/* ===================================
 * 5. Save/Favorite Toggle (UPGRADED)
 * =================================== */

// This function finds all save icons and adds the click listener
function attachSaveIconListeners() {
    const allSaveIcons = document.querySelectorAll('.save-icon:not([data-listener-attached="true"])');
    
    allSaveIcons.forEach(icon => {
        // Check user's saved notes to set the initial state
        // We'll add this logic later in the dashboard section
        
        icon.addEventListener('click', handleSaveIconClick);
        icon.dataset.listenerAttached = 'true'; // Mark as "processed"
    });
}

// This function handles the *actual* click event
async function handleSaveIconClick(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const icon = e.target;
    const noteId = icon.dataset.noteId;
    
    if (typeof auth === 'undefined' || typeof db === 'undefined') {
        console.error("Auth or DB is not ready.");
        return;
    }
    
    const user = auth.currentUser;

    if (!user) {
        alert("Please log in to save notes!");
        window.location.href = 'login.html';
        return;
    }
    
    if (!noteId) {
        console.error("No note ID found on this icon.");
        return;
    }

    const userDocRef = db.collection('users').doc(user.uid);
    const noteDocRef = db.collection('notes').doc(noteId);
    
    // --- Logic to SAVE a note ---
    if (icon.classList.contains('ri-bookmark-line')) {
        try {
            // Add note to user's saved array
            await userDocRef.update({
                savedNotes: firebase.firestore.FieldValue.arrayUnion(noteId)
            });
            // Increment the note's saveCount
            await noteDocRef.update({
                saveCount: firebase.firestore.FieldValue.increment(1)
            });
            
            // Toggle UI
            icon.classList.remove('ri-bookmark-line');
            icon.classList.add('ri-bookmark-fill');
            icon.classList.add('saved');
            console.log('Note saved!');

        } catch (error) {
            console.error("Error saving note: ", error);
        }
        
    } 
    // --- Logic to UNSAVE a note ---
    else {
        try {
            // Remove note from user's saved array
            await userDocRef.update({
                savedNotes: firebase.firestore.FieldValue.arrayRemove(noteId)
            });
            // Decrement the note's saveCount
            await noteDocRef.update({
                saveCount: firebase.firestore.FieldValue.increment(-1)
            });

            // Toggle UI
            icon.classList.remove('ri-bookmark-fill');
            icon.classList.remove('saved');
            icon.classList.add('ri-bookmark-line');
            console.log('Note unsaved!');

        } catch (error) {
            console.error("Error unsaving note: ", error);
        }
    }
}

  /* ===================================
/* ===================================
 * 6. Dynamic Auth & Profile Management
 * =================================== */
 
const quotes = [
  "You don’t need to be perfect. Just consistent.",
  "One step at a time. That's all it takes.",
  "Let's turn that caffeine into knowledge ☕",
  "Don't stop until you're proud.",
  "The secret to getting ahead is getting started.",
  "Slay this study session! 🔥"
];
 
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');
const usernameInput = document.getElementById('username-input');
const profileErrorMsg = document.getElementById('profile-error-msg');
const greetingEl = document.getElementById('dashboard-greeting');
const quoteEl = document.getElementById('dashboard-quote');

// --- This is the only new function you need to add ---
function loadDashboardStats(user, userData) {
    const savedCountEl = document.getElementById('stat-saved-count');
    const uploadsCountEl = document.getElementById('stat-uploads-count');
    const rankEl = document.getElementById('stat-rank');

    // Only run if we are on the dashboard page
    if (!savedCountEl || !uploadsCountEl || !rankEl) {
        return;
    }

    // 1. Set Saved Notes Count
    // (We'll build this feature out later)
    const savedCount = (userData.savedNotes && Array.isArray(userData.savedNotes)) 
                       ? userData.savedNotes.length 
                       : 0;
    savedCountEl.textContent = savedCount;

    // 2. Set Uploads Count (This will work RIGHT NOW!)
    const uploadsCount = userData.uploads || 0;
    uploadsCountEl.textContent = uploadsCount;

    // 3. Set Rank (A fun, simple ranking)
    if (uploadsCount > 10) {
        rankEl.textContent = '#1 🏆';
    } else if (uploadsCount > 5) {
        rankEl.textContent = '#14';
    } else if (uploadsCount > 0) {
        rankEl.textContent = '#42';
    } else {
        rankEl.textContent = 'N/A';
    }
}


// --- Main Auth Logic ---
if (typeof auth !== 'undefined' && typeof db !== 'undefined') {
  auth.onAuthStateChanged((user) => {
    
    if (user) {
      console.log('Auth state: Logged In (user:', user.email, ')');
      document.body.classList.add('logged-in');
      checkUserProfile(user); // This will be the *updated* function below
      
    } else {
      console.log('Auth state: Logged Out');
      document.body.classList.remove('logged-in');
    }
  });
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut().then(() => {
        console.log('User logged out.');
        window.location.href = 'index.html';
      }).catch((error) => console.error('Logout Error:', error));
    });
  }
  
} else {
  console.warn('Firebase Auth or Firestore (`auth`, `db`) is not defined.');
}
 
// --- This is the UPDATED checkUserProfile function ---
// (It now calls your two new functions)
function checkUserProfile(user) {
  if (!user) return;

  const userDocRef = db.collection('users').doc(user.uid);
  
  userDocRef.get().then((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      console.log('Profile found:', userData);
      
      // --- These are the two functions it calls ---
      personalizeDashboard(userData.username); 
      loadDashboardStats(user, userData); // <-- This updates the stats
      
    } else {
      console.log('No profile found. Prompting user to create one.');
      personalizeDashboard(null); 
      if (profileModal) {
        profileModal.classList.add('show');
      }
    }
  }).catch((error) => {
    console.error("Error getting user profile:", error);
  });
}
 
// --- This is your original profile form listener (it's correct) ---
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newUsername = usernameInput.value;
    const currentUser = auth.currentUser;
    
    if (!currentUser) return;
    
    if (newUsername.length < 3) {
      profileErrorMsg.textContent = 'Username must be at least 3 characters.';
      profileErrorMsg.style.display = 'block';
      return;
    }
    
    const userDocRef = db.collection('users').doc(currentUser.uid);
    
    // We add `savedNotes` here so the dashboard function works
    userDocRef.set({
      username: newUsername,
      email: currentUser.email,
      uid: currentUser.uid,
      joined: firebase.firestore.FieldValue.serverTimestamp(),
      uploads: 0,
      savedNotes: [] // <-- Add this empty array on profile creation
    })
    .then(() => {
      console.log('Profile created successfully!');
      profileModal.classList.remove('show'); 
      personalizeDashboard(newUsername); 
      // Manually call loadDashboardStats for the new user
      loadDashboardStats(currentUser, { uploads: 0, savedNotes: [] });
    })
    .catch((error) => {
      console.error('Error creating profile:', error);
      profileErrorMsg.textContent = error.message;
      profileErrorMsg.style.display = 'block';
    });
  });
}

// --- This is your original personalizeDashboard function (it's correct) ---
function personalizeDashboard(username) {
  if (greetingEl && quoteEl) {
    
    if (username) {
      greetingEl.textContent = `Hey ${username}, ready to go? 👋`;
    } else {
      greetingEl.textContent = `Welcome to your Dashboard!`;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteEl.textContent = quotes[randomIndex];
  }
}
  /* ===================================
   * 7. Firebase Authentication (Login & Sign Up)
   * =================================== */
  const loginForm = document.getElementById('login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const signupLink = document.getElementById('signup-link');

  if (loginForm && signupLink && typeof auth !== 'undefined') {
    
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = loginForm['email'].value;
      const password = loginForm['password'].value;
      
      loginErrorMsg.style.display = 'none';

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Login Successful:', userCredential.user);
          fireConfettiAndRedirect();
        })
        .catch((error) => {
          console.error('Login Error:', error);
          loginErrorMsg.textContent = "Invalid email or password. Please try again.";
          loginErrorMsg.style.display = 'block';
        });
    });

    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      const email = loginForm['email'].value;
      const password = loginForm['password'].value;
      
      loginErrorMsg.style.display = 'none';
      
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Sign Up Successful:', userCredential.user);
          fireConfettiAndRedirect();
        })
        .catch((error) => {
          console.error('Sign Up Error:', error);
          loginErrorMsg.textContent = error.message;
          loginErrorMsg.style.display = 'block';
        });
    });

  } 

  function fireConfettiAndRedirect() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }

  /* ===================================
   * 8. Scroll Progress Bar
   * =================================== */
  const scrollFill = document.getElementById('scroll-progress-fill');

  window.addEventListener('scroll', () => {
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    const scrollPercent = (scrollTop / documentHeight) * 100;
    
    if (scrollFill) {
      scrollFill.style.width = scrollPercent + '%';
    }
  });

  /* ===================================
   * 9. Show/Hide Password Toggle
   * =================================== */
  
  const passwordInput = document.getElementById('password');
  const passwordToggleIcon = document.getElementById('password-toggle-icon');

  if (passwordInput && passwordToggleIcon) {
    passwordToggleIcon.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggleIcon.classList.remove('ri-eye-line');
        passwordToggleIcon.classList.add('ri-eye-off-line');
      } else {
        passwordInput.type = 'password';
        passwordToggleIcon.classList.remove('ri-eye-off-line');
        passwordToggleIcon.classList.add('ri-eye-line');
      }
    });
  }

  /* ===================================
   * 10. Note Upload Logic (Cloudinary)
   * =================================== */
  
  // --- Your Cloudinary Details ---
  const CLOUD_NAME = "dn3if2l8c";
  const UPLOAD_PRESET = "eowl_notes_unsigned";
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`; // "raw" is for PDFs

  // --- Get all the form elements ---
  const uploadForm = document.getElementById('upload-form');
  const noteTopicInput = document.getElementById('note-topic');
  const noteSectionInput = document.getElementById('note-section');
  const noteFileInput = document.getElementById('note-file');
  const uploadBtn = document.getElementById('upload-btn');
  const errorMsg = document.getElementById('upload-error-msg');
  const successMsg = document.getElementById('upload-success-msg');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressFill = document.getElementById('upload-progress-fill');

  // Check if we are on the upload page and all elements exist
  if (uploadForm && noteTopicInput && noteSectionInput && noteFileInput && uploadBtn && errorMsg && successMsg && progressBar && progressFill) {
    
    // Add the submit event listener
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const topic = noteTopicInput.value;
      const section = noteSectionInput.value;
      const file = noteFileInput.files[0];
      const user = auth.currentUser;

      // --- 1. VALIDATION ---
      if (!user) {
        showError("You must be logged in to upload!");
        return;
      }
      if (!file) {
        showError("You must select a file!");
        return;
      }
      if (file.type !== "application/pdf") {
        showError("File must be a PDF!");
        return;
      }
      
      showLoading(true);

      // --- 2. GET USER'S USERNAME ---
      db.collection('users').doc(user.uid).get().then(doc => {
        if (!doc.exists) {
          throw new Error("User profile not found. Please set up your profile on the dashboard.");
        }
        
        const username = doc.data().username;
        
        // --- 3. UPLOAD FILE TO CLOUDINARY ---
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', UPLOAD_URL, true);

        // Listen for upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            progressFill.style.width = progress + '%';
          }
        });

        // Listen for upload completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            // Success!
            const response = JSON.parse(xhr.responseText);
            const downloadURL = response.secure_url;
            
            // --- 4. SAVE NOTE INFO TO FIRESTORE ---
            saveNoteToFirestore(topic, section, downloadURL, username, user.uid);

          } else {
            console.error('Cloudinary upload error:', xhr.responseText);
            showError("Upload failed. Please try again.");
            showLoading(false);
          }
        });

        // Listen for network errors
        xhr.addEventListener('error', () => {
          console.error('Network error during upload.');
          showError("Network error. Please check your connection.");
          showLoading(false);
        });

        // Send the request
        xhr.send(formData);
        
      }).catch(err => {
        console.error(err);
        showError(err.message);
        showLoading(false);
      });
    });

    // --- Helper function to save to Firestore ---
    function saveNoteToFirestore(topic, section, downloadURL, username, userId) {
      db.collection('notes').add({
        topic: topic,
        section: section,
        fileURL: downloadURL, // This is the new Cloudinary URL
        uploaderName: username,
        uploaderId: userId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        saveCount: 0
      })
      .then((docRef) => { 
        console.log("Note saved to Firestore with ID: ", docRef.id); 
        // --- 5. INCREMENT USER'S UPLOAD COUNT ---
        const userDocRef = db.collection('users').doc(userId);
        return userDocRef.update({
          uploads: firebase.firestore.FieldValue.increment(1)
        });
      })
      .then(() => {
        // --- 6. SUCCESS! ---
        showSuccess("Note uploaded successfully! Redirecting...");
        uploadForm.reset();
        showLoading(false);
        setTimeout(() => {
          window.location.href = 'notes.html';
        }, 2000);
      })
      .catch(err => {
        console.error('Error saving to Firestore or incrementing count:', err);
        showError("Upload succeeded, but failed to save to database. Please contact support.");
        showLoading(false);
      });
    }

    // --- Helper Functions ---
    function showLoading(isLoading) {
      if (isLoading) {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';
      } else {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload & Share';
        progressBar.style.display = 'none';
      }
    }
    function showError(message) {
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
      successMsg.style.display = 'none';
    }
    function showSuccess(message) {
      successMsg.textContent = message;
      successMsg.style.display = 'block';
      errorMsg.style.display = 'none';
    }
  } else {
    console.warn("Could not find all upload form elements. Skipping upload logic.");
  }

/* ===================================
 * 11. Display *Community* Uploaded Notes
 * =================================== */

// Get the elements for the *community* card
const uploadedList = document.getElementById('uploaded-notes-list');
const uploadedLoading = document.getElementById('uploaded-notes-loading');
const uploadedEmpty = document.getElementById('uploaded-notes-empty');

// This function will run on page load
function loadCommunityNotes() {
    // Only run if we are on a page with this list
    if (!uploadedList || !uploadedLoading || !uploadedEmpty) {
      return; 
    }
    
    // Check if Firebase DB is ready
    if (typeof db === 'undefined') {
      console.warn("Firestore (db) is not ready. Retrying community notes...");
      setTimeout(loadCommunityNotes, 500); // Try again
      return;
    }

    db.collection('notes')
      .orderBy('createdAt', 'desc') // Show newest notes first
      .get()
      .then((querySnapshot) => {
        
        uploadedLoading.style.display = 'none'; // Hide loading message

        if (querySnapshot.empty) {
          // --- Show Empty State ---
          uploadedEmpty.style.display = 'block';
        } else {
          // --- Notes Found: Display Links ---
          uploadedEmpty.style.display = 'none';
          let linksHTML = ''; 

          querySnapshot.forEach((doc) => {
            const note = doc.data();
            // Create a link for each note
            linksHTML += `
              <a href="${note.fileURL}" target="_blank" rel="noopener noreferrer">
                ${note.topic || 'Untitled Note'} 
                <i class="ri-external-link-line" style="font-size: 0.8em;"></i>
              </a>
            `;
          });

          // Add all links to the list
          uploadedList.innerHTML += linksHTML;
        }
      })
      .catch((error) => {
        console.error("Error getting community notes: ", error);
        uploadedLoading.style.display = 'none';
        uploadedList.innerHTML = `<p style="color: red; font-style: italic;">Could not load notes.</p>`;
      });
}

// --- Call the function to load the notes ---
loadCommunityNotes();


/* ===================================
 * 13. Custom Cursor Animation (UPGRADED WITH TRAIL)
 * =================================== */
 
// Create the cursor elements
const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

const cursorRing = document.createElement('div');
cursorRing.classList.add('cursor-ring');
document.body.appendChild(cursorRing);

// --- NEW TRAIL CODE START ---
const trailDots = [];
const numDots = 10; // The number of dots in the trail
const positions = [];

// Create and store trail dots
for (let i = 0; i < numDots; i++) {
  const dot = document.createElement('div');
  dot.classList.add('cursor-trail');
  document.body.appendChild(dot);
  trailDots.push(dot);
  // Initialize positions array
  positions.push({ x: 0, y: 0 });
}
// --- NEW TRAIL CODE END ---

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

// Move cursor dot instantly
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

// Animate the ring AND the trail
function animateCursor() {
  // Ring animation logic (existing)
  let deltaX = mouseX - ringX;
  let deltaY = mouseY - ringY;
  ringX += deltaX * 0.2;
  ringY += deltaY * 0.2;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;

  // --- NEW TRAIL LOGIC START ---
  // The first dot in the array follows the mouse
  positions[0].x = mouseX;
  positions[0].y = mouseY;

  // Each subsequent dot follows the one in front of it
  for (let i = numDots - 1; i > 0; i--) {
    positions[i].x = positions[i - 1].x;
    positions[i].y = positions[i - 1].y;
  }

  // Apply styles to all trail dots
  for (let i = 0; i < numDots; i++) {
    const dot = trailDots[i];
    const pos = positions[i];
    
    // Calculate scale and opacity to make the trail fade out
    const scale = (numDots - i) / numDots;
    
    // Apply transform (we subtract half the dot's width to center it)
    dot.style.transform = `translate(${pos.x - 3}px, ${pos.y - 3}px) scale(${scale})`;
    dot.style.opacity = scale;
  }
  // --- NEW TRAIL LOGIC END ---

  requestAnimationFrame(animateCursor);
}

// Start the animation loop
animateCursor();

// Add click animation listeners (existing)
window.addEventListener('mousedown', () => {
  cursorRing.classList.add('click');
});
window.addEventListener('mouseup', () => {
  cursorRing.classList.remove('click');
});

// Find all interactive elements (existing)
const interactiveElements = document.querySelectorAll(
  'a, button, input[type="submit"], .save-icon, .player-btn, #theme-toggle-btn, input[type="file"], .note-card, #dark-mode-card'
);

// Add hover listeners (existing)
interactiveElements.forEach(el => {
  el.addEventListener('mouseover', () => {
    cursorRing.classList.add('grow');
  });
  el.addEventListener('mouseout', () => {
    cursorRing.classList.remove('grow');
  });
});

/* ===================================
 * 15. Interactive Dark Mode Card (NEW)
 * =================================== */

const darkModeCard = document.getElementById('dark-mode-card');
// We don't need to declare themeToggleBtn again, it already exists!

// Only run this if we're on a page with the dark mode card
if (darkModeCard && themeToggleBtn) { // This "if" condition still works perfectly
  darkModeCard.style.cursor = 'pointer'; // Make it look clickable
  
  darkModeCard.addEventListener('click', () => {
    // This just "clicks" your real theme toggle button for you.
    themeToggleBtn.click();
  });
}

}); // <-- FINAL CLOSING BRACKET

