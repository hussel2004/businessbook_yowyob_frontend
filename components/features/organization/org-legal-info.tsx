'use client';

import { Building, Receipt, Users, Wallet, Calendar, FileText } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface OrgLegalInfoProps {
    organization: {
        legalForm?: string;
        registrationNumber?: string;
        taxNumber?: string;
        yearFounded?: number;
        websiteUrl?: string;
    };
    headquartersAddress?: {
        city?: string;
        neighborhood?: string;
        addressLine1?: string;
    };
}

export function OrgLegalInfo({ organization, headquartersAddress }: OrgLegalInfoProps) {
    const hasLegalInfo = organization.legalForm || organization.registrationNumber ||
        organization.taxNumber || organization.yearFounded;

    if (!hasLegalInfo && !headquartersAddress) return null;

    const infoItems = [
        {
            icon: Building,
            label: 'Forme juridique',
            value: organization.legalForm,
        },
        {
            icon: FileText,
            label: 'Numéro de registre',
            value: organization.registrationNumber,
        },
        {
            icon: Receipt,
            label: 'Numéro fiscal',
            value: organization.taxNumber,
        },
        {
            icon: Calendar,
            label: 'Année de création',
            value: organization.yearFounded?.toString(),
        },
    ].filter(item => item.value);

    if (infoItems.length === 0 && !headquartersAddress) return null;

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="legal-info" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Informations légales
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-2">
                        {infoItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                            >
                                <div className="p-2 rounded-full bg-primary/10 text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                    <p className="font-medium">{item.value}</p>
                                </div>
                            </div>
                        ))}

                        {headquartersAddress && (headquartersAddress.city || headquartersAddress.addressLine1) && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 sm:col-span-2 lg:col-span-1">
                                <div className="p-2 rounded-full bg-primary/10 text-primary">
                                    <Building className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Siège social</p>
                                    <p className="font-medium">
                                        {headquartersAddress.addressLine1 || headquartersAddress.neighborhood || headquartersAddress.city}
                                    </p>
                                    {headquartersAddress.city && headquartersAddress.addressLine1 && (
                                        <p className="text-sm text-muted-foreground">{headquartersAddress.city}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
