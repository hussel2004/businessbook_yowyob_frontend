import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politique de confidentialité - BusinessBook',
    description: 'Politique de confidentialité et protection des données personnelles de BusinessBook.',
};

export default function PrivacyPage() {
    return (
        <div className="py-12">
            <div className="container-wrapper max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-8">
                        Dernière mise à jour : Janvier 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground">
                            BusinessBook s'engage à protéger la vie privée de ses utilisateurs.
                            Cette politique décrit comment nous collectons, utilisons et protégeons
                            vos données personnelles.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">2. Données Collectées</h2>
                        <p className="text-muted-foreground">Nous collectons les données suivantes :</p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Informations d'identification : nom, email, téléphone</li>
                            <li>Données de connexion : adresse IP, appareil, navigateur</li>
                            <li>Contenu utilisateur : avis, photos, messages</li>
                            <li>Données de localisation (si autorisé)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">3. Utilisation des Données</h2>
                        <p className="text-muted-foreground">Vos données sont utilisées pour :</p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Fournir et améliorer nos services</li>
                            <li>Personnaliser votre expérience</li>
                            <li>Communiquer avec vous (notifications, support)</li>
                            <li>Assurer la sécurité de la plateforme</li>
                            <li>Respecter nos obligations légales</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">4. Partage des Données</h2>
                        <p className="text-muted-foreground">
                            Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Les entreprises que vous contactez via la plateforme</li>
                            <li>Nos prestataires techniques (hébergement, analytics)</li>
                            <li>Les autorités légales si requis par la loi</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">5. Cookies</h2>
                        <p className="text-muted-foreground">
                            Nous utilisons des cookies pour améliorer votre expérience.
                            Vous pouvez gérer vos préférences dans les paramètres de votre navigateur.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">6. Vos Droits</h2>
                        <p className="text-muted-foreground">Vous disposez des droits suivants :</p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Accès à vos données personnelles</li>
                            <li>Rectification des données inexactes</li>
                            <li>Suppression de vos données</li>
                            <li>Opposition au traitement</li>
                            <li>Portabilité des données</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">7. Sécurité</h2>
                        <p className="text-muted-foreground">
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger
                            vos données contre tout accès non autorisé, modification ou divulgation.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
                        <p className="text-muted-foreground">
                            Pour toute question relative à cette politique :
                            <a href="mailto:privacy@businessbook.cm" className="text-primary hover:underline ml-1">
                                privacy@businessbook.cm
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
