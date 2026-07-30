import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { COMPANY, COMPANY_ADDRESS_LINE, getContactChannel, PHONE_NUMBERS } from '@/lib/legal';

export const metadata: Metadata = {
    title: 'Contact - BusinessBook',
    description: 'Contactez l\'équipe BusinessBook. Nous sommes là pour répondre à vos questions.',
};

const generalContact = getContactChannel('general');

const contactInfo = [
    {
        icon: Mail,
        label: 'Email',
        value: generalContact.email,
        href: `mailto:${generalContact.email}`,
    },
    {
        icon: Phone,
        label: 'Téléphone',
        value: PHONE_NUMBERS[0].display,
        href: PHONE_NUMBERS[0].href,
        secondary: { value: PHONE_NUMBERS[1].display, href: PHONE_NUMBERS[1].href },
    },
    {
        icon: MapPin,
        label: 'Siège social',
        value: `${COMPANY_ADDRESS_LINE}, ${COMPANY.address.country.fr}`,
    },
    {
        icon: Clock,
        label: 'Horaires',
        value: 'Lun - Ven: 8h - 18h',
    },
];

/** Canaux spécialisés, alignés sur le package légal BusinessBook v1.0. */
const specializedChannels = [
    { ...getContactChannel('legal'), href: '/terms' },
    { ...getContactChannel('privacy'), href: '/privacy' },
    { ...getContactChannel('support'), href: null },
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
                                        {info.secondary && (
                                            <a
                                                href={info.secondary.href}
                                                className="block font-medium hover:text-primary transition-colors"
                                            >
                                                {info.secondary.value}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 rounded-xl bg-muted/50">
                            <h3 className="font-semibold mb-1">Demandes spécifiques</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Ces canaux dédiés traitent plus vite les demandes juridiques, de confidentialité et de sécurité.
                            </p>
                            <ul className="space-y-4">
                                {specializedChannels.map((channel) => (
                                    <li key={channel.purpose}>
                                        <div className="text-sm font-medium">{channel.label.fr}</div>
                                        <p className="text-sm text-muted-foreground">{channel.description.fr}</p>
                                        <a
                                            href={`mailto:${channel.email}`}
                                            className="text-sm text-primary font-medium hover:underline"
                                        >
                                            {channel.email}
                                        </a>
                                        {channel.href && (
                                            <>
                                                <span className="mx-2 text-sm text-muted-foreground">·</span>
                                                <Link href={channel.href} className="text-sm text-primary hover:underline">
                                                    Consulter le document
                                                </Link>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
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
