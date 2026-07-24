import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
    title: 'Contact - BusinessBook',
    description: 'Contactez l\'équipe BusinessBook. Nous sommes là pour répondre à vos questions.',
};

const contactInfo = [
    {
        icon: Mail,
        label: 'Email',
        value: 'contact@businessbook.cm',
        href: 'mailto:contact@businessbook.cm',
    },
    {
        icon: Phone,
        label: 'Téléphone',
        value: '+237 6XX XXX XXX',
        href: 'tel:+2376XXXXXXXX',
    },
    {
        icon: MapPin,
        label: 'Adresse',
        value: 'Douala, Cameroun',
    },
    {
        icon: Clock,
        label: 'Horaires',
        value: 'Lun - Ven: 8h - 18h',
    },
];

export default function ContactPage() {
    return (
        <div className="py-12">
            <div className="container-wrapper">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Contactez-nous</h1>
                    <p className="text-muted-foreground">
                        Vous avez une question ou une suggestion ? Notre équipe est là pour vous aider.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-xl font-semibold mb-6">Nos coordonnées</h2>
                        <div className="space-y-4">
                            {contactInfo.map((info, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <info.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">{info.label}</div>
                                        {info.href ? (
                                            <a href={info.href} className="font-medium hover:text-primary transition-colors">
                                                {info.value}
                                            </a>
                                        ) : (
                                            <div className="font-medium">{info.value}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 rounded-xl bg-muted/50">
                            <h3 className="font-semibold mb-2">Support Entreprises</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Pour les questions liées à votre compte entreprise, contactez notre équipe dédiée.
                            </p>
                            <a href="mailto:business@businessbook.cm" className="text-primary font-medium hover:underline">
                                business@businessbook.cm
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-6 rounded-xl border bg-card">
                        <h2 className="text-xl font-semibold mb-6">Envoyez-nous un message</h2>
                        <form className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom</Label>
                                    <Input id="name" placeholder="Votre nom" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="votre@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Sujet</Label>
                                <Input id="subject" placeholder="Sujet de votre message" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Votre message..." rows={5} />
                            </div>
                            <Button type="submit" fullWidth>
                                Envoyer le message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
