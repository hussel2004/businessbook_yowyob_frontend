import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import {
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    ChevronRight,
    FileText,
    Mail,
    MapPin,
    Phone,
    Scale,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/i18n/config';
import {
    COMPANY,
    COMPANY_ADDRESS_LINE,
    CONTACT_CHANNELS,
    EXTENSION_CLAUSE,
    PHONE_NUMBERS,
    PLATFORM_SCOPE,
    type LegalBlock,
    type LegalDoc,
    type LegalSection,
} from '@/lib/legal';

/** Renvois d'un document du package vers les deux autres, détectés dans le texte. */
const CROSS_REFS: Record<Locale, { phrase: string; slug: LegalDoc['slug'] }[]> = {
    fr: [
        { phrase: 'Avis de confidentialité', slug: 'privacy' },
        { phrase: 'Avis Cookies & Publicité', slug: 'cookies' },
        { phrase: 'CGU', slug: 'terms' },
    ],
    en: [
        { phrase: 'Privacy Notice', slug: 'privacy' },
        { phrase: 'Cookies & Ads Notice', slug: 'cookies' },
    ],
};

const EMAIL_SOURCE = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}';
const URL_SOURCE = 'https?://[^\\s,;)]+';

type Rewriter = (text: string) => React.ReactNode;

/**
 * Rend cliquables les emails, URL et renvois vers les autres documents du package.
 * Le texte source est statique et sous notre contrôle : aucun HTML n'est injecté.
 */
function createRewriter(currentSlug: LegalDoc['slug'], locale: Locale): Rewriter {
    const refs = CROSS_REFS[locale].filter((ref) => ref.slug !== currentSlug);
    const alternatives = [EMAIL_SOURCE, URL_SOURCE, ...refs.map((ref) => ref.phrase)];
    const pattern = new RegExp(`(${alternatives.join('|')})`, 'gi');

    return (text) =>
        text.split(pattern).map((part, index) => {
            if (!part) return null;

            if (/^https?:\/\//i.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                    >
                        {part}
                    </a>
                );
            }

            if (new RegExp(`^${EMAIL_SOURCE}$`, 'i').test(part)) {
                return (
                    <a key={index} href={`mailto:${part}`} className="text-primary hover:underline">
                        {part}
                    </a>
                );
            }

            const ref = refs.find((candidate) => candidate.phrase.toLowerCase() === part.toLowerCase());
            if (ref) {
                return (
                    <Link key={index} href={`/${ref.slug}`} className="text-primary underline underline-offset-2">
                        {part}
                    </Link>
                );
            }

            return <span key={index}>{part}</span>;
        });
}

function Block({ block, rewrite }: { block: LegalBlock; rewrite: Rewriter }) {
    switch (block.type) {
        case 'p':
            return <p className="text-muted-foreground leading-relaxed">{rewrite(block.text)}</p>;

        case 'note':
            return (
                <div className="flex gap-3 rounded-lg border-l-4 border-warning bg-warning/5 p-4">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-warning" aria-hidden />
                    <p className="text-sm text-muted-foreground leading-relaxed">{rewrite(block.text)}</p>
                </div>
            );

        case 'list':
            return (
                <ul className="space-y-2.5">
                    {block.items.map((item, index) => (
                        <li key={index} className="flex gap-3 text-muted-foreground leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                            <span>{rewrite(item)}</span>
                        </li>
                    ))}
                </ul>
            );

        case 'table':
            return (
                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[36rem] caption-bottom text-sm">
                        <thead className="bg-muted/60">
                            <tr className="border-b">
                                {block.head.map((cell, index) => (
                                    <th key={index} scope="col" className="px-4 py-3 text-left align-top font-semibold">
                                        {cell}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b last:border-0 even:bg-muted/20">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="px-4 py-3 align-top text-muted-foreground">
                                            {rewrite(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
    }
}

function Section({ section, rewrite }: { section: LegalSection; rewrite: Rewriter }) {
    return (
        <section id={section.id} className="scroll-mt-24">
            <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
            <div className="space-y-4">
                {section.blocks.map((block, index) => (
                    <Block key={index} block={block} rewrite={rewrite} />
                ))}
            </div>
        </section>
    );
}

interface LegalDocumentProps {
    doc: LegalDoc;
    /** Les trois documents du package, dans l'ordre de publication. */
    package: LegalDoc[];
}

export async function LegalDocument({ doc, package: docs }: LegalDocumentProps) {
    const t = await getTranslations('legal');
    const locale = (await getLocale()) as Locale;
    const rewrite = createRewriter(doc.slug, locale);
    const related = docs.filter((item) => item.slug !== doc.slug);

    return (
        <div className="pb-16">
            {/* En-tête */}
            <header className="border-b bg-muted/30 py-10">
                <div className="container-wrapper max-w-6xl">
                    <nav aria-label="breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            {t('breadcrumbHome')}
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                        <span className="text-foreground">{doc.shortTitle}</span>
                    </nav>

                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="warning">{doc.status}</Badge>
                        <Badge variant="outline">v{doc.version}</Badge>
                        <span className="font-mono text-xs text-muted-foreground">{doc.code}</span>
                    </div>

                    <h1 className="max-w-3xl text-3xl font-bold md:text-4xl">{doc.title}</h1>
                    <p className="mt-3 max-w-3xl text-muted-foreground">{doc.purpose}</p>
                    <p className="mt-4 text-sm text-muted-foreground">{t('effectiveDate', { date: doc.effectiveDate })}</p>

                    {/* Navigation entre les trois documents du package */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {docs.map((item) => {
                            const isCurrent = item.slug === doc.slug;
                            return (
                                <Link
                                    key={item.slug}
                                    href={`/${item.slug}`}
                                    aria-current={isCurrent ? 'page' : undefined}
                                    className={
                                        isCurrent
                                            ? 'rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground'
                                            : 'rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                                    }
                                >
                                    {item.shortTitle}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            <div className="container-wrapper max-w-6xl">
                {/* Réserve « bêta publiée » */}
                <div className="mt-8 flex gap-3 rounded-lg border-l-4 border-warning bg-warning/5 p-4">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-warning" aria-hidden />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">{t('importantLabel')} </span>
                        {doc.important}
                    </p>
                </div>

                <div className="mt-10 gap-12 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
                    {/* Sommaire */}
                    <aside className="mb-10 lg:mb-0">
                        <div className="lg:sticky lg:top-24">
                            <nav aria-label={t('tableOfContents')} className="rounded-xl border bg-card p-5">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t('tableOfContents')}
                                </h2>
                                <ol className="max-h-[60vh] space-y-1.5 overflow-y-auto pr-1 text-sm">
                                    {[...doc.sections, ...doc.annexes].map((section) => (
                                        <li key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                className="block text-muted-foreground hover:text-primary hover:underline"
                                            >
                                                {section.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <div className="mt-4 rounded-xl border bg-muted/40 p-5">
                                <h2 className="mb-1 text-sm font-semibold">{t('needHelp')}</h2>
                                <p className="mb-3 text-sm text-muted-foreground">{t('needHelpText')}</p>
                                <a href="#contact" className="text-sm font-medium text-primary hover:underline">
                                    {t('seeContacts')}
                                </a>
                            </div>
                        </div>
                    </aside>

                    <main>
                        {/* L'essentiel */}
                        <section aria-labelledby="essentials" className="mb-12">
                            <h2 id="essentials" className="mb-4 text-xl font-semibold">
                                {t('essentials')}
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {doc.highlights.map((highlight) => (
                                    <a
                                        key={highlight.sectionId}
                                        href={`#${highlight.sectionId}`}
                                        className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary"
                                    >
                                        <h3 className="mb-2 font-semibold">{highlight.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{highlight.text}</p>
                                        <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                                            {t('readSection')}
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                        </span>
                                    </a>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground">{t('highlightsDisclaimer')}</p>
                        </section>

                        {/* Texte intégral */}
                        <section aria-labelledby="full-text">
                            <h2 id="full-text" className="mb-4 text-xl font-semibold">
                                {t('fullText')}
                            </h2>
                            <p className="mb-10 rounded-lg border-l-4 border-primary bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                                {rewrite(doc.lead)}
                            </p>
                            <div className="space-y-10">
                                {doc.sections.map((section) => (
                                    <Section key={section.id} section={section} rewrite={rewrite} />
                                ))}
                            </div>
                        </section>

                        {/* Annexes */}
                        {doc.annexes.length > 0 && (
                            <section aria-labelledby="annexes" className="mt-14 border-t pt-10">
                                <h2 id="annexes" className="mb-6 text-xl font-semibold">
                                    {t('annexes')}
                                </h2>
                                <div className="space-y-10">
                                    {doc.annexes.map((section) => (
                                        <Section key={section.id} section={section} rewrite={rewrite} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Périmètre — ramené aux routes réelles de l'application */}
                        <section aria-labelledby="scope" className="mt-14 border-t pt-10">
                            <h2 id="scope" className="mb-2 text-xl font-semibold">
                                {t('scopeTitle')}
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">{t('scopeIntro')}</p>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {PLATFORM_SCOPE.map((platform) => (
                                    <li key={platform.href}>
                                        <Link
                                            href={platform.href}
                                            className="group flex h-full items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary hover:bg-muted/40"
                                        >
                                            <span className="min-w-0">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    {platform.label[locale]}
                                                    <ArrowUpRight
                                                        className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                                                        aria-hidden
                                                    />
                                                </span>
                                                <span className="mt-1 block text-sm text-muted-foreground">
                                                    {platform.description[locale]}
                                                </span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground">{EXTENSION_CLAUSE[locale]}</p>
                        </section>

                        {/* Contacts, orientés par motif */}
                        <section aria-labelledby="contact" id="contact" className="mt-14 scroll-mt-24 border-t pt-10">
                            <h2 id="contact-title" className="mb-2 text-xl font-semibold">
                                {t('contactTitle')}
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">{t('contactIntro')}</p>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {CONTACT_CHANNELS.map((channel) => (
                                    <li key={channel.purpose} className="rounded-xl border p-4">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Mail className="h-4 w-4 text-primary" aria-hidden />
                                            {channel.label[locale]}
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">{channel.description[locale]}</p>
                                        <a
                                            href={`mailto:${channel.email}`}
                                            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                                        >
                                            {channel.email}
                                        </a>
                                        {channel.fallbackEmail && (
                                            <>
                                                <span className="mx-1.5 text-sm text-muted-foreground">{t('or')}</span>
                                                <a
                                                    href={`mailto:${channel.fallbackEmail}`}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {channel.fallbackEmail}
                                                </a>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="flex items-start gap-3 rounded-xl border p-4">
                                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                                    <div>
                                        <div className="text-sm font-medium">{t('phone')}</div>
                                        <div className="mt-1 flex flex-col text-sm">
                                            {PHONE_NUMBERS.map((phone) => (
                                                <a key={phone.href} href={phone.href} className="text-primary hover:underline">
                                                    {phone.display}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-xl border p-4">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                                    <div>
                                        <div className="text-sm font-medium">{t('registeredOffice')}</div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {COMPANY_ADDRESS_LINE}, {COMPANY.address.country[locale]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Fiche technique repliée : l'utilisateur la déplie s'il en a besoin */}
                        <details className="mt-14 rounded-xl border bg-muted/30 open:bg-muted/40">
                            <summary className="cursor-pointer list-none px-5 py-4 font-semibold marker:content-none">
                                <span className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" aria-hidden />
                                    {t('documentInfo')}
                                </span>
                            </summary>

                            <div className="space-y-8 border-t px-5 py-6">
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {t('identification')}
                                    </h3>
                                    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
                                        {doc.meta.map((entry) => (
                                            <div key={entry.label}>
                                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    {entry.label}
                                                </dt>
                                                <dd className="text-sm font-medium">{entry.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">{t('changeLabel')} </span>
                                        {doc.change}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        <Scale className="h-4 w-4" aria-hidden />
                                        {t('referencesTitle')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {doc.references.map((reference, index) => (
                                            <li key={index} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                                                <span>{reference}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-warning bg-warning/5 p-4">
                                        <AlertTriangle className="h-5 w-5 shrink-0 text-warning" aria-hidden />
                                        <p className="text-sm leading-relaxed text-muted-foreground">{doc.referencesNote}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {t('publisherTitle')}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {COMPANY.name} — {COMPANY.form[locale]}, {t('capital')} {COMPANY.capital[locale]}.
                                        {' '}RCCM {COMPANY.rccm} · NIU {COMPANY.taxId}.
                                        {' '}{COMPANY_ADDRESS_LINE}, {COMPANY.address.country[locale]}.
                                    </p>
                                </div>
                            </div>
                        </details>

                        {/* Documents liés */}
                        <section aria-labelledby="related" className="mt-10">
                            <h2 id="related" className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t('relatedDocuments')}
                            </h2>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {related.map((item) => (
                                    <li key={item.slug}>
                                        <Link
                                            href={`/${item.slug}`}
                                            className="group flex h-full items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary hover:bg-muted/40"
                                        >
                                            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                                            <span className="min-w-0">
                                                <span className="block font-medium">{item.title}</span>
                                                <span className="mt-1 block text-sm text-muted-foreground">{item.purpose}</span>
                                            </span>
                                            <ArrowRight
                                                className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                                                aria-hidden
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-6 text-xs text-muted-foreground">{t('languageNotice')}</p>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
