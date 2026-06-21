/**
 * Combat Guru — shared technique media & normalization (no external assets required).
 */
(function () {
    const CATEGORY_META = {
        stances: { colors: ['#0f2618', '#1e5030'] },
        punches: { colors: ['#26140f', '#503020'] },
        kicks: { colors: ['#141f26', '#284050'] },
        defense: { colors: ['#1f1426', '#402850'] }
    };

    function escapeXml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function normalizeTechnique(raw, categoryKey) {
        if (!raw) return null;
        const score = Number(
            raw.score ?? raw.effectiveness ?? raw.effectiveness_score ?? 80
        );
        const steps = raw.steps || raw.execution_steps || [];
        return {
            ...raw,
            id: String(raw.id || '').toLowerCase(),
            category: raw.category || categoryKey,
            name: raw.name || raw.title || 'Technique',
            subtitle: raw.subtitle || raw.tagline || '',
            desc: raw.desc || raw.description || '',
            image: raw.image || raw.image_url || '',
            score: Number.isFinite(score) ? score : 80,
            steps: Array.isArray(steps) ? steps : [],
            stats: raw.stats || []
        };
    }

    function placeholderImage(name, categoryKey) {
        const meta = CATEGORY_META[categoryKey] || CATEGORY_META.punches;
        const [c1, c2] = meta.colors;
        const label = escapeXml(name || 'TECHNIQUE');
        const short = label.length > 20 ? label.slice(0, 18) + '…' : label;
        const svg =
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
            `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
            `<stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>` +
            `<rect width="400" height="400" fill="url(#g)"/>` +
            `<circle cx="200" cy="150" r="70" fill="rgba(226,255,59,0.1)" stroke="rgba(226,255,59,0.35)" stroke-width="2"/>` +
            `<text x="200" y="290" text-anchor="middle" fill="#E2FF3B" font-family="system-ui,Arial,sans-serif" font-size="20" font-weight="700">${short}</text>` +
            `</svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    /** Prefer bundled SVG placeholders; real files under /assets/ still work if present. */
    function resolveImage(item, categoryKey) {
        return placeholderImage(item.name, categoryKey);
    }

    function onImageError(img, name, categoryKey) {
        if (!img || img.dataset.fallback === '1') return;
        img.dataset.fallback = '1';
        img.src = placeholderImage(name, categoryKey);
    }

    function truncate(text, max) {
        max = max || 72;
        const t = String(text || '').trim();
        if (!t) return '';
        return t.length <= max ? t : t.slice(0, max - 1) + '…';
    }

    function hydrateCatalog(data) {
        const out = {};
        Object.keys(data || {}).forEach(function (cat) {
            const items = data[cat];
            if (!Array.isArray(items)) return;
            out[cat] = items.map(function (raw) {
                const item = normalizeTechnique(raw, cat);
                item.image = resolveImage(item, cat);
                return item;
            });
        });
        return out;
    }

    function mergeCustomTechniques(combinedData, customList) {
        (customList || []).forEach(function (raw) {
            const cat = raw.category;
            if (!cat || !combinedData[cat]) return;
            const item = normalizeTechnique(raw, cat);
            item.image = resolveImage(item, cat);
            if (!combinedData[cat].some(function (e) { return e.id === item.id; })) {
                combinedData[cat].push(item);
            }
        });
        return combinedData;
    }

    function loadLocalCustom() {
        try {
            return JSON.parse(localStorage.getItem('custom_techniques') || '[]');
        } catch (e) {
            return [];
        }
    }

    window.GuruMedia = {
        CATEGORY_META,
        escapeHtml,
        normalizeTechnique,
        placeholderImage,
        resolveImage,
        onImageError,
        truncate,
        hydrateCatalog,
        mergeCustomTechniques,
        loadLocalCustom,
        CATEGORIES: ['stances', 'punches', 'kicks', 'defense']
    };
})();
