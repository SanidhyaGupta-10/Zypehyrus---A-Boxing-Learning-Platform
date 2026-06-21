/**
 * Dashboard lives in the legacy HTML app (repo root), not in the React bundle.
 * Vite dev middleware + build copy expose /dashboard.html on the same origin.
 */
export function getDashboardUrl(): string {
    const configured = import.meta.env.VITE_LEGACY_APP_URL as string | undefined;
    if (configured?.trim()) {
        return `${configured.replace(/\/$/, '')}/dashboard.html`;
    }
    return `${window.location.origin}/dashboard.html`;
}

export function redirectToDashboard(): void {
    window.location.assign(getDashboardUrl());
}
