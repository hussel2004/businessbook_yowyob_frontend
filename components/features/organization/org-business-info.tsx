'use client';

import { Users, Wallet } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface OrgBusinessInfoProps {
    organization: {
        employeeCountRange?: string;
        annualRevenueRange?: string;
        capital?: number;
    };
}

export function OrgBusinessInfo({ organization }: OrgBusinessInfoProps) {
    const hasBusinessInfo = organization.employeeCountRange || organization.annualRevenueRange || organization.capital;

    if (!hasBusinessInfo) return null;

    const infoItems = [
        {
            icon: Users,
            label: "Nombre d'employés",
            value: organization.employeeCountRange,
        },
        {
            icon: Wallet,
            label: "Chiffre d'affaires",
            value: organization.annualRevenueRange,
        },
        {
            icon: Wallet,
            label: 'Capital social',
            value: organization.capital
                ? `${organization.capital.toLocaleString()} FCFA`
                : undefined,
        },
    ].filter(item => item.value);

    if (infoItems.length === 0) return null;

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="business-info" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Informations Commerciales
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
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
