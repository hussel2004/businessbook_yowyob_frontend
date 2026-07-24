'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import { Tag, Calendar, Clock, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import type { Promotion } from '@/lib/api/public';
import { getAssetUrl } from '@/lib/api/endpoints';

interface OrgPromotionsProps {
    promotions: Promotion[];
}

function PromotionCard({ promo }: { promo: Promotion }) {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        if (promo.code) {
            navigator.clipboard.writeText(promo.code);
            setCopied(true);
            toast.success('Code copié !');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative w-full md:w-48 h-32 md:h-auto rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {promo.imageUrl ? (
                    <Image
                        src={getAssetUrl(promo.imageUrl) || ''}
                        alt={promo.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-primary/5">
                        <Tag className="h-8 w-8 text-primary/40" />
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <Badge variant="destructive" className="font-bold">
                        {promo.discountType === 'PERCENTAGE' && `-${promo.discountValue}%`}
                        {promo.discountType === 'FIXED_AMOUNT' && `-${promo.discountValue} FCFA`}
                        {promo.discountType === 'BOGO' && '1 Acheté = 1 Offert'}
                        {promo.discountType === 'FREE_ITEM' && 'Produit Offert'}
                        {promo.discountType === 'OTHER' && 'Promo'}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3 py-1">
                <div>
                    <h3 className="font-semibold text-lg">{promo.title}</h3>
                    {promo.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {promo.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Du {format(new Date(promo.startDate), 'dd MMM', { locale: fr })} au {format(new Date(promo.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    {promo.code ? (
                        <div className="flex items-center gap-2 bg-muted/50 p-1.5 pl-3 rounded-lg border border-dashed">
                            <code className="text-sm font-bold text-primary">{promo.code}</code>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={handleCopyCode}
                            >
                                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                    ) : (
                        <div />
                    )}

                    <Button size="sm">Profiter de l'offre</Button>
                </div>
            </div>
        </div>
    );
}

export function OrgPromotions({ promotions }: OrgPromotionsProps) {
    if (promotions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Aucune promotion en cours.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {promotions.map((promo) => (
                <PromotionCard key={promo.id} promo={promo} />
            ))}
        </div>
    );
}
