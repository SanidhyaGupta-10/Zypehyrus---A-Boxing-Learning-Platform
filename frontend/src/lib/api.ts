/**
 * Central API client for the ZEPHYR production backend (Cloud Run).
 * Base URL is read from import.meta.env.NEXT_PUBLIC_API_URL (Vite exposes NEXT_PUBLIC_* per vite.config).
 * Direct import.meta.env access is required so Vite can inline values at build time.
 */

const DEFAULT_DEV_URL = 'http://localhost:8080';

export const API_BASE_URL: string = (
    import.meta.env.NEXT_PUBLIC_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    DEFAULT_DEV_URL
).replace(/\/$/, '');

function resolveUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalized}`;
}

export async function apiFetch<T = unknown>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(resolveUrl(path), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`API ${response.status}: ${body || response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export async function checkBackendHealth(): Promise<{ status: string }> {
    return apiFetch<{ status: string }>('/health');
}

export interface SessionAnalysis {
    analysis: {
        feedback: string;
        tip: string;
        score: number;
    };
}

export async function analyzeSession(metrics: Record<string, unknown>): Promise<SessionAnalysis> {
    return apiFetch<SessionAnalysis>('/api/analyze-session', {
        method: 'POST',
        body: JSON.stringify({ metrics }),
    });
}
