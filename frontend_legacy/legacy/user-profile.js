document.addEventListener('DOMContentLoaded', () => {
    refreshProfileUI();
    setupAvatarEditing();
});

function refreshProfileUI() {
    const data = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
    const name = data.ring_name || 'FIGHTER';
    const lifestyle = data.lifestyle || 'Varied';
    const persona = data.persona || 'Unknown';
    const goals = data.goals || [];
    const promise = data.promise || data.trigger || 'TO BE UNSTOPPABLE';
    const avatarUrl = data.avatar_url || 'https://i.pravatar.cc/150?u=viktor';

    // --- Stealth Mode Logic ---
    const settings = JSON.parse(localStorage.getItem('app_settings') || '{"notifications":true, "stealth":false}');
    if (settings.stealth) {
        document.body.classList.add('stealth-active');
    } else {
        document.body.classList.remove('stealth-active');
    }

    // --- Dashboard Specific ---
    const dashboardGreeting = document.getElementById('dashboard-greeting');
    if (dashboardGreeting) {
        dashboardGreeting.innerText = `MORNING, ${name}`;
    }

    // --- Profile Page (Settings) Specific ---
    const profileName = document.getElementById('profile-name');
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDetails = document.getElementById('profile-details');

    if (profileName) {
        profileName.innerHTML = `${name}'S<br>PROFILE`;
    }
    if (profileTrigger) {
        profileTrigger.innerText = `PROMISE: ${promise}`;
    }
    if (profileDetails) {
        const goalsHtml = goals.map(g => `<span class="badge-elite" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);">${g}</span>`).join(' ');

        profileDetails.innerHTML = `
            <div class="glass-card ripple" style="padding: 25px; border-radius: 35px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.08);">
                 <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;">
                    <div>
                        <div style="font-size: 0.65rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; display:flex; align-items:center; gap:8px;">
                            IDENTITY <i class="fa-solid fa-pen" style="font-size:0.5rem; cursor:pointer;" onclick="editProfileField('ring_name', 'FIGHTER NAME')"></i>
                        </div>
                        <div style="font-size: 1.5rem; font-weight: 950; color: #fff; font-style: italic;">"${name}"</div>
                    </div>
                     <div style="text-align: right;">
                        <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">PERSONA</div>
                        <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${persona}</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr; gap: 20px;">
                    <div>
                         <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display:flex; align-items:center; gap:8px;">
                            THE FIGHTER'S PROMISE <i class="fa-solid fa-pen" style="font-size:0.5rem; cursor:pointer;" onclick="editProfileField('promise', 'YOUR PROMISE')"></i>
                         </div>
                         <div style="font-size: 1.1rem; font-weight: 900; color: var(--primary); font-style: italic; letter-spacing: -0.5px;">"${promise}"</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">LIFESTYLE</div>
                            <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${lifestyle}</div>
                        </div>
                        <div>
                             <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">LEVEL</div>
                             <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${data.experience_level || 'Novice'}</div>
                        </div>
                        <div>
                             <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">PHONE</div>
                             <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${data.phone_number || '--'}</div>
                        </div>
                    </div>

                    <div>
                         <div style="font-size: 0.6rem; color: #666; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">ACTIVE GOALS</div>
                         <div style="display:flex; flex-wrap:wrap; gap:8px;">${goalsHtml}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Global Header Injection ---
    const heroSubMatches = document.querySelectorAll('.hero-sub-text');
    heroSubMatches.forEach(el => {
        if (el.id === 'dashboard-greeting' || el.id === 'profile-trigger') return;
        const currentText = el.innerText;
        if (!currentText.includes(name)) {
            el.innerHTML = `${currentText} <span style="color: rgba(255,255,255,0.3); margin: 0 5px;">???</span> <span style="color: var(--text-muted);">${name}</span>`;
        }
    });

    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer && !document.getElementById('profile-trigger') && !document.getElementById('dashboard-greeting')) {
        let existingTag = document.getElementById('promise-header-tag');
        if (!existingTag) {
            existingTag = document.createElement('div');
            existingTag.id = 'promise-header-tag';
            existingTag.style.fontSize = '0.55rem';
            existingTag.style.fontWeight = '800';
            existingTag.style.color = 'var(--primary)';
            existingTag.style.opacity = '0.7';
            existingTag.style.textTransform = 'uppercase';
            existingTag.style.marginTop = '5px';
            if (heroContainer.children[1]) heroContainer.children[1].appendChild(existingTag);
        }
        existingTag.innerHTML = `PROMISE: ${promise}`;
    }

    // Update Avatars
    document.querySelectorAll('img').forEach(img => {
        if (img.src.includes('pravatar') || img.src.includes('avatar') || img.hasAttribute('data-profile-avatar')) {
            img.src = avatarUrl;
            img.setAttribute('data-profile-avatar', 'true');
        }
    });
}

function setupAvatarEditing() {
    // Look for profile images and wrap them if needed or just add listeners
    document.querySelectorAll('img').forEach(img => {
        if (img.src.includes('pravatar') || img.src.includes('avatar') || img.hasAttribute('data-profile-avatar')) {
            img.style.cursor = 'pointer';
            img.title = 'Click to change profile image';
            img.onclick = (e) => {
                e.stopPropagation();
                editProfileField('avatar_url', 'IMAGE URL');
            };

            // Add a little edit icon overlay if not present
            const parent = img.parentElement;
            if (parent && !parent.querySelector('.avatar-edit-icon')) {
                parent.style.position = 'relative';
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-camera avatar-edit-icon';
                icon.style.cssText = 'position:absolute; bottom:0; right:0; background:var(--primary); color:#000; width:18px; height:18px; border-radius:50%; font-size:0.6rem; display:flex; align-items:center; justify-content:center; border:2px solid #000; pointer-events:none;';
                parent.appendChild(icon);
            }
        }
    });
}

window.editProfileField = function (key, label) {
    const data = JSON.parse(localStorage.getItem('boxing_onboarding_data') || '{}');
    const currentVal = data[key] || '';
    const newVal = prompt(`ENTER NEW ${label}:`, currentVal);

    if (newVal !== null && newVal.trim() !== "") {
        data[key] = newVal.trim();
        localStorage.setItem('boxing_onboarding_data', JSON.stringify(data));
        refreshProfileUI();
        setupAvatarEditing(); // Re-apply listeners

        // Dispatch event for other pages if needed
        window.dispatchEvent(new Event('storage'));

        if (window.AudioEngine) AudioEngine.playTick();
    }
}
