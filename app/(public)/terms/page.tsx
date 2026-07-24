import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Conditions d\'utilisation - BusinessBook',
    description: 'Conditions générales d\'utilisation de la plateforme BusinessBook.',
};

export default function TermsPage() {
    return (
        <div className="py-12">
            <div className="container-wrapper max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-8">
                        Dernière mise à jour : Janvier 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
                        <p className="text-muted-foreground">
                            Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir
                            les conditions d'accès et d'utilisation de la plateforme BusinessBook.
                            En accédant à notre site, vous acceptez sans réserve les présentes CGU.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">2. Services</h2>
                        <p className="text-muted-foreground">
                            BusinessBook est une plateforme en ligne permettant :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>La consultation d'un annuaire d'entreprises camerounaises et africaines</li>
                            <li>L'inscription et la gestion de profils d'entreprises</li>
                            <li>La publication d'avis et de notes sur les entreprises</li>
                            <li>La mise en relation entre entreprises et clients potentiels</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">3. Inscription</h2>
                        <p className="text-muted-foreground">
                            L'inscription sur BusinessBook est gratuite. En créant un compte, vous vous engagez à :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Fournir des informations exactes et à jour</li>
                            <li>Maintenir la confidentialité de vos identifiants</li>
                            <li>Ne pas créer de compte à des fins frauduleuses</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">4. Contenu Utilisateur</h2>
                        <p className="text-muted-foreground">
                            En publiant du contenu sur BusinessBook (avis, photos, descriptions), vous garantissez :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Être l'auteur ou avoir les droits nécessaires</li>
                            <li>Que le contenu est véridique et non diffamatoire</li>
                            <li>Respecter les droits de propriété intellectuelle</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">5. Responsabilités</h2>
                        <p className="text-muted-foreground">
                            BusinessBook agit en tant qu'intermédiaire et ne peut être tenu responsable :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Du contenu publié par les utilisateurs</li>
                            <li>Des transactions entre utilisateurs et entreprises</li>
                            <li>De l'exactitude des informations fournies par les entreprises</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">6. Propriété Intellectuelle</h2>
                        <p className="text-muted-foreground">
                            L'ensemble des éléments de la plateforme (logos, textes, design) sont protégés
                            par les droits de propriété intellectuelle et appartiennent à BusinessBook.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
                        <p className="text-muted-foreground">
                            Pour toute question concernant ces CGU, contactez-nous à :
                            <a href="mailto:legal@businessbook.cm" className="text-primary hover:underline ml-1">
                                legal@businessbook.cm
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
