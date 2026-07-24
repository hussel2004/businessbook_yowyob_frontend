'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { useLocationStore } from '@/lib/stores/location-store';
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalDescription,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export function LocationPermissionModal() {
    const [open, setOpen] = useState(false);
    const geolocation = useGeolocation();
    const { isLocationSet, hasDismissedPrompt, dismissPrompt } = useLocationStore();

    useEffect(() => {
        // Show modal if:
        // 1. Location is not set yet
        // 2. User hasn't dismissed the prompt previously
        // 3. Permission hasn't been explicitly denied
        // 4. Permission is not already granted (if granted, useGeolocation auto-fetches)
        if (
            !isLocationSet &&
            !hasDismissedPrompt &&
            geolocation.permissionStatus !== 'denied' &&
            geolocation.permissionStatus !== 'granted'
        ) {
            // Add a small delay for better UX
            const timer = setTimeout(() => setOpen(true), 1500);
            return () => clearTimeout(timer);
        } else {
            setOpen(false);
        }
    }, [isLocationSet, hasDismissedPrompt, geolocation.permissionStatus]);

    const handleAllow = () => {
        geolocation.requestLocation();
        setOpen(false);
    };

    const handleDismiss = () => {
        dismissPrompt();
        setOpen(false);
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <ModalTitle>Autoriser la localisation</ModalTitle>
                </div>
                <ModalDescription>
                    Améliorez votre expérience sur BusinessBook
                </ModalDescription>
            </ModalHeader>
            <ModalBody>
                <p className="text-sm text-muted-foreground">
                    Autorisez BusinessBook à utiliser votre position pour vous proposer automatiquement les meilleures entreprises et services à proximité de vous.
                </p>
            </ModalBody>
            <ModalFooter>
                <Button variant="ghost" onClick={handleDismiss}>
                    Non, merci
                </Button>
                <Button onClick={handleAllow}>
                    Autoriser
                </Button>
            </ModalFooter>
        </Modal>
    );
}
