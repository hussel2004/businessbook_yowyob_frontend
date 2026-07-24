'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Agency } from '@/lib/api/public';

interface AgencyMapProps {
    agency: Agency;
    className?: string;
}

// Helper to handle both "HH:mm" string and [H, m] array
function normalizeTime(time: string | number[] | undefined): { h: number, m: number } | null {
    if (!time) return null;
    if (Array.isArray(time)) {
        return { h: time[0] ?? 0, m: time[1] ?? 0 };
    }
    const parts = String(time).split(':');
    return { h: Number(parts[0]), m: Number(parts[1]) || 0 };
}

function formatTime(time: string | number[] | undefined): string {
    const t = normalizeTime(time);
    if (!t) return '';
    return `${String(t.h).padStart(2, '0')}h${String(t.m).padStart(2, '0')}`;
}

function isOpenNow(hours: any[] | undefined): boolean {
    if (!hours || hours.length === 0) return false;
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = hours.find((h: any) => h.dayOfWeek === currentDay || (currentDay === 0 && h.dayOfWeek === 7));
    if (!todayHours || todayHours.isClosed) return false;

    const start = normalizeTime(todayHours.opensAt);
    const end = normalizeTime(todayHours.closesAt);

    if (!start || !end) return false;

    const openMinutes = start.h * 60 + start.m;
    const closeMinutes = end.h * 60 + end.m;

    return currentTime >= openMinutes && currentTime <= closeMinutes;
}

export default function AgencyMap({ agency, className }: AgencyMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const lat = agency.address?.latitude || 4.0511;
        const lng = agency.address?.longitude || 9.7679;

        const map = L.map(mapContainerRef.current, {
            center: [lat, lng],
            zoom: 15,
            scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const customIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Calculate functionality
        const openingHours = agency.openingHours ?? [];
        const isOpen = isOpenNow(openingHours);
        const today = new Date().getDay();
        const todayHours = openingHours.find((h: any) => h.dayOfWeek === today || (today === 0 && h.dayOfWeek === 7));

        let hoursHtml = '';
        if (todayHours) {
            if (todayHours.isClosed) {
                hoursHtml = '<span class="text-red-600 font-medium">Fermé aujourd\'hui</span>';
            } else {
                hoursHtml = `<span>${formatTime(todayHours.opensAt)} - ${formatTime(todayHours.closesAt)}</span>`;
            }
        }

        const statusHtml = `<span class="font-bold ${isOpen ? 'text-green-600' : 'text-red-600'}">${isOpen ? 'Ouvert' : 'Fermé'}</span>`;

        L.marker([lat, lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
                <div class="space-y-2 min-w-[200px]">
                    <div>
                        <div class="text-sm font-bold text-foreground">${agency.name}</div>
                        <div class="text-xs text-muted-foreground">${agency.address?.streetLine1 || ''}</div>
                    </div>
                    <div class="flex items-center justify-between text-xs border-t pt-2">
                        ${statusHtml}
                        ${hoursHtml}
                    </div>
                </div>
            `);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [agency]);

    return <div ref={mapContainerRef} className={`w-full h-full rounded-lg z-0 ${className || ''}`} />;
}
