document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate');
    const tableBody = document.getElementById('links-table-body');
    const inputName = document.getElementById('link-name');
    const inputDesc = document.getElementById('link-desc');
    
    const statLinks = document.getElementById('stat-links');
    const statSubs = document.getElementById('stat-subs');
    const tabLiens = document.getElementById('tab-liens');
    const tabSoumissions = document.getElementById('tab-soumissions');

    // Load links from local storage
    let links = JSON.parse(localStorage.getItem('payment_links')) || [];

    function updateStats() {
        const totalLinks = links.length;
        const totalSubs = links.reduce((acc, link) => acc + (link.submissions || 0), 0);
        
        statLinks.textContent = totalLinks;
        statSubs.textContent = totalSubs;
        
        tabLiens.textContent = `Liens (${totalLinks})`;
        tabSoumissions.textContent = `Soumissions (${totalSubs})`;
    }

    function renderLinks() {
        tableBody.innerHTML = '';
        
        if (links.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5" style="text-align:center; padding:3rem; color:#6b7280;">Aucun lien créé.</td>`;
            tableBody.appendChild(tr);
            updateStats();
            return;
        }

        // Reverse so newest is on top
        [...links].reverse().forEach(link => {
            const tr = document.createElement('tr');
            
            // Format Date
            const d = new Date(link.date);
            const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            
            // Name Column
            const tdName = document.createElement('td');
            tdName.innerHTML = `
                <div class="link-name">${link.name || 'Lien sans nom'}</div>
                <div class="link-desc">${link.description || ''}</div>
            `;
            
            // Short link column
            const tdShort = document.createElement('td');
            tdShort.innerHTML = `<span class="short-link">/l/${link.id}</span>`;
            
            // Submissions column
            const tdSubs = document.createElement('td');
            const subCount = link.submissions || 0;
            tdSubs.innerHTML = subCount > 0 ? `<span class="badge-submissions">${subCount}</span>` : `<span style="color: #9ca3af;">0</span>`;
            
            // Date column
            const tdDate = document.createElement('td');
            tdDate.textContent = dateStr;
            
            // Actions column
            const tdActions = document.createElement('td');
            tdActions.className = 'actions';
            
            // Copy
            const btnCopy = document.createElement('button');
            btnCopy.className = 'action-btn';
            btnCopy.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            btnCopy.title = "Copier le lien complet";
            btnCopy.onclick = () => {
                navigator.clipboard.writeText(link.url);
                alert('Lien copié !');
            };
            
            // Open
            const btnOpen = document.createElement('button');
            btnOpen.className = 'action-btn';
            btnOpen.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
            btnOpen.title = "Ouvrir dans un nouvel onglet";
            btnOpen.onclick = () => {
                window.open(link.url, '_blank');
            };
            
            // Delete
            const btnDel = document.createElement('button');
            btnDel.className = 'action-btn';
            btnDel.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
            btnDel.title = "Supprimer";
            btnDel.onclick = () => {
                if(confirm("Voulez-vous vraiment supprimer ce lien ?")) {
                    links = links.filter(l => l.id !== link.id);
                    localStorage.setItem('payment_links', JSON.stringify(links));
                    renderLinks();
                }
            };
            
            tdActions.appendChild(btnCopy);
            tdActions.appendChild(btnOpen);
            tdActions.appendChild(btnDel);
            
            tr.appendChild(tdName);
            tr.appendChild(tdShort);
            tr.appendChild(tdSubs);
            tr.appendChild(tdDate);
            tr.appendChild(tdActions);
            
            tableBody.appendChild(tr);
        });
        
        updateStats();
    }

    btnGenerate.addEventListener('click', () => {
        const uniqueId = Math.random().toString(36).substring(2, 8); // e.g. "LySVHxE"
        
        // Construct the URL dynamically based on where dashboard is hosted
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        const newUrl = `${baseUrl}/form.html?id=${uniqueId}`;
        
        const newLink = {
            id: uniqueId,
            url: newUrl,
            name: inputName.value.trim() || 'Lien généré',
            description: inputDesc.value.trim(),
            submissions: Math.floor(Math.random() * 5), // Simulation of some random submissions for the UI effect
            date: new Date().toISOString()
        };
        
        links.push(newLink);
        localStorage.setItem('payment_links', JSON.stringify(links));
        
        inputName.value = '';
        inputDesc.value = '';
        
        renderLinks();
    });

    renderLinks();
});
