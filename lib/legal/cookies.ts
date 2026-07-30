import {
    buildMeta,
    LEGAL_EFFECTIVE_DATE,
    LEGAL_IMPORTANT,
    LEGAL_REFERENCES,
    LEGAL_STATUS,
    LEGAL_VERSION,
    REFERENCES_NOTE,
} from './common';
import type { LegalDoc, LegalDocSet } from './types';

/**
 * BBK-LEGAL-COOKIES-ENFR-1.0 — Avis cookies, traceurs et publicité.
 * Source : BusinessBook_Cookies_Ads_Notice_EN-FR_Published-Beta_v1.0.docx
 */

const CODE = 'BBK-LEGAL-COOKIES-ENFR-1.0';

const CHANGE_FR =
    'Première version consolidée couvrant cookies, stockage local, cartes, analytics, boutons de contact, campagnes et publicité.';
const CHANGE_EN =
    'First consolidated version covering cookies, local storage, maps, analytics, contact buttons, campaigns and advertising.';

const fr: LegalDoc = {
    slug: 'cookies',
    code: CODE,
    version: LEGAL_VERSION,
    status: LEGAL_STATUS.fr,
    effectiveDate: LEGAL_EFFECTIVE_DATE.fr,
    title: 'Avis cookies, traceurs et publicité',
    shortTitle: 'Cookies et publicité',
    subtitle: 'Technologies, analytics professionnels, promotions et choix des utilisateurs',
    purpose: 'Quelles technologies peuvent lire ou écrire sur votre terminal, à quelles fins, et comment garder la main sur vos choix.',
    important: LEGAL_IMPORTANT.fr,
    highlights: [
        {
            title: 'Les traceurs nécessaires ne demandent pas de consentement',
            text: 'Session, connexion, formulaire, sécurité et mémorisation de votre choix : ils ne créent aucun profil publicitaire.',
            sectionId: 's5',
        },
        {
            title: 'La publicité personnalisée reste un choix',
            text: 'Retargeting et audiences ne sont activés qu’avec la base et le consentement requis. Le refus n’empêche pas les annonces contextuelles.',
            sectionId: 's12',
        },
        {
            title: 'Vos choix se modifient à tout moment',
            text: 'Rouvrez les préférences depuis le pied de page ou le compte. Le retrait vaut pour l’avenir et peut réinitialiser langue et favoris.',
            sectionId: 's20',
        },
        {
            title: 'Les statistiques pro ne révèlent pas votre identité',
            text: 'Une entreprise voit des vues, clics et zones agrégés — pas qui vous êtes, tant que vous n’engagez pas volontairement un contact.',
            sectionId: 's8',
        },
    ],
    lead: 'Cet Avis décrit les technologies susceptibles d’être utilisées dans BusinessBook. Le registre dynamique du gestionnaire de consentement ou des paramètres prévaut pour les noms, fournisseurs, finalités et durées réellement actifs sur un domaine, une version ou un terminal.',
    references: LEGAL_REFERENCES.fr,
    referencesNote: REFERENCES_NOTE.fr,
    change: CHANGE_FR,
    meta: buildMeta('fr', CODE),
    sections: [
        {
            id: 's1',
            title: '1. Objet et portée',
            blocks: [
                { type: 'p', text: 'L’Avis couvre les sites, PWA, applications mobiles, interfaces professionnelles et administratives, pages de fiches, promotions, widgets, cartes, QR codes, emails, notifications et intégrations BusinessBook. Il complète les CGU et l’Avis de confidentialité.' },
                { type: 'p', text: 'Les configurations peuvent varier selon domaine, zone, terminal, compte et fonctionnalité. Une technologie décrite n’est pas nécessairement active partout.' },
            ],
        },
        {
            id: 's2',
            title: '2. Définition des cookies et traceurs',
            blocks: [
                { type: 'p', text: 'Un cookie est un petit fichier ou identifiant enregistré ou lu sur un terminal. Les technologies comparables comprennent stockage local ou de session, IndexedDB, cache PWA, pixel, balise, script, SDK mobile, identifiant publicitaire, empreinte limitée de sécurité, journal serveur, lien balisé et notification push.' },
                { type: 'p', text: 'Elles peuvent maintenir une session, sécuriser un compte, retenir une langue, mémoriser une recherche, fournir un mode hors ligne, afficher une carte, mesurer une audience, attribuer une campagne ou personnaliser une publicité lorsque permis.' },
            ],
        },
        {
            id: 's3',
            title: '3. Responsable et acteurs tiers',
            blocks: [
                { type: 'p', text: 'Yowyob détermine les finalités des traceurs qu’il déploie pour BusinessBook. Certains prestataires agissent pour Yowyob; d’autres — carte, réseau social, messagerie ou publicité — peuvent agir comme responsables indépendants sous leurs propres conditions.' },
                { type: 'p', text: 'Une entreprise intégrant un widget, lien ou campagne BusinessBook dans son environnement est responsable de ses propres traceurs et doit recueillir les choix nécessaires. Le consentement BusinessBook ne couvre pas automatiquement le site de l’entreprise.' },
            ],
        },
        {
            id: 's4',
            title: '4. Catégories de technologies',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Strictement nécessaires : session, authentification, sécurité, répartition de charge, consentement, prévention de fraude, formulaires et fonctions expressément demandées.',
                        'Préférences et fonctionnalité : langue, thème, zone, filtres, favoris, listes récentes, accessibilité, colonnes et personnalisation non publicitaire.',
                        'Audience et performance : pages, événements, erreurs, temps de réponse, parcours, campagnes, appareils et qualité technique.',
                        'Cartes et contenus externes : cartes, itinéraires, vidéos, posts, boutons sociaux et widgets tiers.',
                        'Publicité et mesure marketing : source, attribution, fréquence, conversion, audience, retargeting et personnalisation lorsque utilisés et autorisés.',
                        'Sécurité et anti-abus : automatisation, faux comptes, faux avis, fraude au clic, session, intégrité d’appareil et protection API.',
                    ],
                },
            ],
        },
        {
            id: 's5',
            title: '5. Technologies strictement nécessaires',
            blocks: [
                { type: 'p', text: 'Elles permettent une fonction demandée ou protègent le service : mémoriser le choix de consentement, maintenir la connexion, traiter un formulaire, appliquer un rôle, protéger une revendication, défendre contre une attaque ou synchroniser une PWA.' },
                { type: 'p', text: 'Elles ne servent pas à créer un profil publicitaire indépendant. Elles peuvent fonctionner sans consentement lorsque la loi le permet, tout en restant limitées et décrites. Leur blocage peut empêcher connexion, gestion de fiche, formulaire ou préférence.' },
            ],
        },
        {
            id: 's6',
            title: '6. Préférences, recherche et favoris',
            blocks: [
                { type: 'p', text: 'Avec la base appropriée, BusinessBook peut retenir langue, thème, ville, zone, catégorie, filtre, tri, entreprise favorite, historique local, choix d’affichage et accessibilité. Certaines données restent uniquement sur le terminal.' },
                { type: 'p', text: 'L’utilisateur peut réinitialiser les préférences ou effacer le stockage du site. Cette action peut supprimer favoris locaux, brouillons, état de connexion, consentements ou files de synchronisation non envoyées.' },
            ],
        },
        {
            id: 's7',
            title: '7. Mesure d’audience, diagnostic et performance',
            blocks: [
                { type: 'p', text: 'Sous le choix requis, Yowyob peut mesurer visites, pages, recherches, catégories, clics, erreurs, chargements, sources, appareils, zones approximatives et conversions observables pour améliorer l’ergonomie, la stabilité et la communication.' },
                { type: 'p', text: 'Les événements ne doivent pas contenir mot de passe, pièce d’identité, preuve confidentielle d’avis, message privé complet, paiement complet ou donnée sensible. Yowyob réduit identifiants, adresses IP et durée lorsque possible.' },
            ],
        },
        {
            id: 's8',
            title: '8. Analytics destinés aux professionnels',
            blocks: [
                { type: 'p', text: 'BusinessBook peut fournir à une entreprise des statistiques sur vues de fiche, recherches, clics d’appel, WhatsApp, itinéraire, site web, favoris, sources, zones, périodes et campagnes. Les statistiques sont agrégées ou pseudonymisées lorsque possible.' },
                { type: 'p', text: 'Une vue ou un clic ne signifie pas vente ni prospect qualifié. L’identité d’un Visiteur n’est normalement pas fournie tant qu’il n’initie pas volontairement un contact. L’entreprise ne doit pas réidentifier ni croiser abusivement les rapports.' },
            ],
        },
        {
            id: 's9',
            title: '9. Cartes, géolocalisation et permissions',
            blocks: [
                { type: 'p', text: 'Une carte ou recherche de proximité peut nécessiter coordonnées de fiche, IP approximative ou position précise. La permission du navigateur ou du système d’exploitation est distincte du consentement cookies et peut être retirée dans le terminal.' },
                { type: 'p', text: 'Un fournisseur de carte peut recevoir les informations techniques nécessaires. Le chargement d’un contenu tiers peut être différé jusqu’au choix requis. Sans position précise, l’utilisateur peut généralement saisir une ville ou adresse manuellement.' },
            ],
        },
        {
            id: 's10',
            title: '10. Boutons appel, email, WhatsApp et itinéraire',
            blocks: [
                { type: 'p', text: 'Un clic peut être mesuré comme événement de mise en relation et ouvrir l’application téléphonique, email, WhatsApp, carte ou site de l’entreprise. Le tiers peut alors déposer ses propres traceurs ou recevoir des données selon ses conditions.' },
                { type: 'p', text: 'BusinessBook ne lit pas automatiquement le contenu d’un appel ou message externe. Une URL balisée peut transmettre une source de campagne ou un identifiant limité pour mesurer la conversion, sans inclure de secret ni de donnée sensible.' },
            ],
        },
        {
            id: 's11',
            title: '11. Promotions, sponsoring et publicité contextuelle',
            blocks: [
                { type: 'p', text: 'BusinessBook peut afficher promotions, partenaires, offres ou classements sponsorisés. Le caractère commercial doit être identifiable et ne pas masquer les informations essentielles de l’offre.' },
                { type: 'p', text: 'La publicité contextuelle peut se fonder sur page, catégorie, langue, ville générale ou recherche en cours sans suivi intersite. Le refus de personnalisation n’empêche pas nécessairement les annonces contextuelles ou les promotions propres à la plateforme.' },
            ],
        },
        {
            id: 's12',
            title: '12. Publicité personnalisée, retargeting et audiences',
            blocks: [
                { type: 'p', text: 'Lorsque ces pratiques sont utilisées, elles ne sont activées qu’avec la base et les choix requis. Elles peuvent utiliser pages, catégories, interactions, identifiants pseudonymes, source et segments limités pour adapter ou mesurer des annonces.' },
                { type: 'p', text: 'Yowyob n’utilise pas comme catégories publicitaires ordinaires les pièces de revendication, preuves confidentielles, données de paiement, mots de passe, avis sensibles, localisation précise ou messages privés. Les partenaires doivent respecter les restrictions contractuelles et les choix.' },
            ],
        },
        {
            id: 's13',
            title: '13. Mesure de campagne, attribution et fraude publicitaire',
            blocks: [
                { type: 'p', text: 'Des identifiants ou paramètres peuvent relier une impression, un clic, une visite de fiche, un contact initié ou une action déclarée à une campagne. Les modèles d’attribution sont indicatifs et peuvent utiliser des fenêtres temporelles et règles techniques.' },
                { type: 'p', text: 'Yowyob peut détecter clics automatisés, répétitifs, incitatifs ou frauduleux et les exclure des rapports ou factures. Les impressions, clics et conversions ne garantissent ni vente ni causalité exclusive.' },
            ],
        },
        {
            id: 's14',
            title: '14. Réseaux sociaux et contenus externes',
            blocks: [
                { type: 'p', text: 'Les boutons Facebook, X, Instagram, vidéos, cartes ou publications intégrées peuvent communiquer avec le fournisseur, notamment si l’utilisateur est connecté chez lui. Lorsque requis, le contenu est bloqué jusqu’au consentement ou s’ouvre dans un nouvel onglet.' },
                { type: 'p', text: 'Partager une fiche est une action volontaire. Le réseau social traite ensuite les données selon ses propres règles; Yowyob ne contrôle pas ses cookies, profils ou durées.' },
            ],
        },
        {
            id: 's15',
            title: '15. Emails, SMS, push et pixels',
            blocks: [
                { type: 'p', text: 'Les messages transactionnels peuvent utiliser identifiants techniques ou liens sécurisés pour confirmer compte, revendication, avis, paiement ou incident et mesurer la délivrabilité. Les messages marketing peuvent mesurer ouverture ou clic seulement lorsque la base et l’information requises existent.' },
                { type: 'p', text: 'Le désabonnement marketing ne bloque pas les messages essentiels. Les paramètres du terminal gèrent les notifications push; les liens de préférence gèrent email et SMS commerciaux.' },
            ],
        },
        {
            id: 's16',
            title: '16. PWA, cache, mode hors ligne et synchronisation',
            blocks: [
                { type: 'p', text: 'Une PWA peut stocker ressources, préférences, fiches récemment consultées, brouillons ou files de synchronisation pour fonctionner avec une connexion faible. Les données locales peuvent persister après fermeture de l’onglet.' },
                { type: 'p', text: 'Sur un terminal partagé, l’utilisateur doit se déconnecter et effacer les données locales. Effacer le cache avant synchronisation peut perdre un brouillon; les données sensibles doivent être limitées, chiffrées selon le risque et purgées dès qu’inutiles.' },
            ],
        },
        {
            id: 's17',
            title: '17. Applications mobiles, SDK et identifiants publicitaires',
            blocks: [
                { type: 'p', text: 'Une application mobile peut utiliser des SDK de notification, diagnostic, carte, sécurité, paiement, attribution ou analytics. Le registre de l’application identifie les fournisseurs actifs. Les permissions — localisation, caméra, photos, notifications ou contacts — sont demandées séparément.' },
                { type: 'p', text: 'Les identifiants publicitaires du système ne sont utilisés pour personnalisation que lorsque permis et choisi. L’utilisateur peut les réinitialiser ou restreindre dans les paramètres du terminal.' },
            ],
        },
        {
            id: 's18',
            title: '18. API, journaux serveur et protection anti-abus',
            blocks: [
                { type: 'p', text: 'Les API et serveurs génèrent des journaux même sans cookie : IP, client, clé limitée, heure, route, statut, latence, volume, erreur et corrélation. Ils servent à sécurité, support, audit, quotas et facturation éventuelle.' },
                { type: 'p', text: 'Aucun intégrateur ne doit placer mot de passe, pièce d’identité, message privé, token ou secret dans une URL susceptible d’être journalisée. Les empreintes d’appareil sont limitées à la sécurité et ne doivent pas devenir un suivi publicitaire caché.' },
            ],
        },
        {
            id: 's19',
            title: '19. Recueil et preuve du consentement',
            blocks: [
                { type: 'p', text: 'Lorsque le consentement est requis, le bandeau ou centre de préférences offre accepter, refuser et choisir par finalité avec une facilité comparable. Les options non essentielles ne sont pas précochées et le refus n’entraîne pas de pression trompeuse.' },
                { type: 'p', text: 'Yowyob conserve une preuve limitée : version de l’avis, date, catégories, identifiant de consentement et source. Un nouveau choix est demandé après changement matériel, expiration appropriée, suppression du stockage ou perte de preuve.' },
            ],
        },
        {
            id: 's20',
            title: '20. Modification, retrait et synchronisation des choix',
            blocks: [
                { type: 'p', text: 'L’utilisateur peut rouvrir « Préférences cookies », « Confidentialité » ou « Publicité » depuis le pied de page, le compte ou l’application lorsqu’ils existent. Le retrait n’affecte pas la licéité antérieure.' },
                { type: 'p', text: 'Le choix peut être propre au navigateur ou terminal. Une synchronisation avec le compte peut être proposée sans imposer les traceurs. Bloquer ou effacer tous les cookies peut déconnecter, réinitialiser langue, favoris et consentement.' },
            ],
        },
        {
            id: 's21',
            title: '21. Global Privacy Control, Do Not Track et réglages système',
            blocks: [
                { type: 'p', text: 'Lorsque techniquement et juridiquement applicable, un signal Global Privacy Control valide est interprété comme objection ou refus pour les ventes, partages publicitaires ou publicités ciblées couvertes. Sa portée dépend du territoire, navigateur et connexion.' },
                { type: 'p', text: 'Do Not Track n’a pas de signification uniforme et peut ne pas remplacer le centre de préférences. Les réglages iOS, Android, navigateur et permissions restent applicables aux identifiants et capteurs concernés.' },
            ],
        },
        {
            id: 's22',
            title: '22. Durées et expiration',
            blocks: [
                { type: 'p', text: 'Un cookie de session expire à la fermeture ou fin de session; un cookie persistant à sa date ou suppression. Les durées sont proportionnées : sécurité selon le risque, préférence selon utilité, consentement selon preuve, analytics et publicité aussi courts que raisonnablement possible.' },
                { type: 'p', text: 'Le registre dynamique indique la durée exacte ou le critère. Les identifiants ne doivent pas être artificiellement prolongés à chaque visite sans justification. Les journaux serveur suivent l’Avis de confidentialité.' },
            ],
        },
        {
            id: 's23',
            title: '23. Terminaux partagés et sécurité',
            blocks: [
                { type: 'p', text: 'Sur un ordinateur public ou partagé, ne pas demander de connexion persistante, se déconnecter et supprimer les données du site. Un administrateur d’entreprise doit contrôler les appareils et profils utilisés pour gérer la fiche.' },
                { type: 'p', text: 'Ne transmettez jamais mot de passe, code, document d’identité, token ou secret dans un outil analytics, paramètre URL, pixel ou message social non sollicité.' },
            ],
        },
        {
            id: 's24',
            title: '24. Absence de vente de fichiers et limites publicitaires',
            blocks: [
                { type: 'p', text: 'Yowyob ne vend pas les listes de contacts BusinessBook à des annonceurs. Une campagne ou son reporting ne signifie pas que l’annonceur reçoit les données brutes d’un Visiteur.' },
                { type: 'p', text: 'Les données d’identité, revendication, avis confidentiel, paiement, localisation précise et sécurité ne sont pas utilisées comme segments ordinaires. Toute utilisation exceptionnelle exige compatibilité, minimisation, transparence et choix approprié.' },
            ],
        },
        {
            id: 's25',
            title: '25. Registre dynamique, modifications et contacts',
            blocks: [
                { type: 'p', text: 'Yowyob peut modifier l’Avis et le registre lors d’un changement de fournisseur, technologie, finalité, durée ou loi. Un nouveau choix est présenté lorsque le consentement antérieur devient insuffisant. Le registre opérationnel prévaut sur les exemples de l’annexe.' },
                { type: 'p', text: 'Les versions française et anglaise visent le même effet; le français prévaut pour les opérations principalement camerounaises, sous réserve du droit impératif. Contacts : privacy@businessbook.cm, privacy@yowyob.com, support@yowyob.com et legal@yowyob.com.' },
            ],
        },
    ],
    annexes: [
        {
            id: 'annex-a',
            title: 'Annexe A — Modèle de registre des technologies',
            blocks: [
                {
                    type: 'table',
                    head: ['Nom / fournisseur', 'Catégorie', 'Finalité', 'Données / accès tiers', 'Durée', 'Base / choix'],
                    rows: [
                        ['À renseigner', 'Nécessaire', 'Session, sécurité ou consentement', 'Identifiant limité; prestataire éventuel', 'Session / durée exacte', 'Nécessité / intérêt légitime'],
                        ['À renseigner', 'Préférence', 'Langue, zone, favoris, interface', 'Stockage terminal ou compte', 'Durée exacte', 'Demande / consentement selon loi'],
                        ['À renseigner', 'Analytics', 'Audience, erreurs, performance', 'IP réduite, événement, appareil', 'Durée exacte', 'Consentement ou exemption documentée'],
                        ['À renseigner', 'Carte / externe', 'Carte, itinéraire, média', 'IP, requête, coordonnées', 'Selon fournisseur', 'Consentement ou fonction demandée'],
                        ['À renseigner', 'Publicité', 'Attribution, fréquence, personnalisation', 'Identifiant, segment, événement', 'Durée exacte', 'Consentement / objection applicable'],
                    ],
                },
            ],
        },
    ],
};

const en: LegalDoc = {
    slug: 'cookies',
    code: CODE,
    version: LEGAL_VERSION,
    status: LEGAL_STATUS.en,
    effectiveDate: LEGAL_EFFECTIVE_DATE.en,
    title: 'Cookies, Trackers and Advertising Notice',
    shortTitle: 'Cookies and ads',
    subtitle: 'Technologies, professional analytics, promotions and user choices',
    purpose: 'Which technologies may read or write on your device, for what purpose, and how to keep control of your choices.',
    important: LEGAL_IMPORTANT.en,
    highlights: [
        {
            title: 'Necessary trackers need no consent',
            text: 'Session, login, forms, security and remembering your choice — they build no advertising profile.',
            sectionId: 's5',
        },
        {
            title: 'Personalised advertising stays a choice',
            text: 'Retargeting and audiences are activated only with the required basis and consent. Refusal does not block contextual ads.',
            sectionId: 's12',
        },
        {
            title: 'Change your choices at any time',
            text: 'Reopen preferences from the footer or your account. Withdrawal applies going forward and may reset language and favourites.',
            sectionId: 's20',
        },
        {
            title: 'Professional statistics do not reveal your identity',
            text: 'A business sees aggregated views, clicks and areas — not who you are, until you voluntarily initiate contact.',
            sectionId: 's8',
        },
    ],
    lead: 'This Notice describes technologies that may be used in BusinessBook. The dynamic register in the consent manager or settings prevails for the names, providers, purposes and periods actually active on a domain, version or device.',
    references: LEGAL_REFERENCES.en,
    referencesNote: REFERENCES_NOTE.en,
    change: CHANGE_EN,
    meta: buildMeta('en', CODE),
    sections: [
        {
            id: 's1',
            title: '1. Purpose and scope',
            blocks: [
                { type: 'p', text: 'This Notice covers BusinessBook websites, PWAs, mobile apps, professional and administrative interfaces, Listing pages, Promotions, widgets, maps, QR codes, emails, notifications and integrations. It supplements the Terms and Privacy Notice.' },
                { type: 'p', text: 'Configurations may vary by domain, area, device, account and feature. A described technology is not necessarily active everywhere.' },
            ],
        },
        {
            id: 's2',
            title: '2. Cookies and tracker definition',
            blocks: [
                { type: 'p', text: 'A cookie is a small file or identifier stored or read on a device. Comparable technologies include local or session storage, IndexedDB, PWA cache, pixels, tags, scripts, mobile SDKs, advertising identifiers, limited security fingerprints, server logs, tagged links and push notifications.' },
                { type: 'p', text: 'They may maintain a session, secure an account, remember language, retain a search, enable offline use, display a map, measure audience, attribute a campaign or personalise advertising where permitted.' },
            ],
        },
        {
            id: 's3',
            title: '3. Controller and third-party actors',
            blocks: [
                { type: 'p', text: 'Yowyob determines the purposes of trackers it deploys for BusinessBook. Some providers act for Yowyob; others — mapping, social, messaging or advertising services — may act as independent controllers under their own terms.' },
                { type: 'p', text: 'A business embedding a BusinessBook widget, link or campaign in its environment is responsible for its own trackers and required choices. BusinessBook consent does not automatically cover the business website.' },
            ],
        },
        {
            id: 's4',
            title: '4. Technology categories',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Strictly necessary: session, authentication, security, load balancing, consent, fraud prevention, forms and expressly requested functions.',
                        'Preference and functionality: language, theme, area, filters, favourites, recent lists, accessibility, columns and non-advertising personalisation.',
                        'Audience and performance: pages, events, errors, response times, journeys, campaigns, devices and technical quality.',
                        'Maps and external content: maps, directions, videos, posts, social buttons and third-party widgets.',
                        'Advertising and marketing measurement: source, attribution, frequency, conversion, audience, retargeting and personalisation where used and permitted.',
                        'Security and anti-abuse: automation, fake accounts, fake Reviews, click fraud, sessions, device integrity and API protection.',
                    ],
                },
            ],
        },
        {
            id: 's5',
            title: '5. Strictly necessary technologies',
            blocks: [
                { type: 'p', text: 'These enable a requested function or protect the service: remembering consent, maintaining login, handling a form, enforcing a role, protecting a Claim, defending against attack or synchronising a PWA.' },
                { type: 'p', text: 'They do not create an independent advertising profile. They may operate without consent where law permits while remaining limited and described. Blocking may prevent login, Listing management, forms or preferences.' },
            ],
        },
        {
            id: 's6',
            title: '6. Preferences, search and favourites',
            blocks: [
                { type: 'p', text: 'Under the appropriate basis, BusinessBook may remember language, theme, city, area, category, filter, sort, favourite business, local history, display and accessibility. Some data remains only on the device.' },
                { type: 'p', text: 'Users may reset preferences or clear site storage. This can remove local favourites, drafts, login state, consent records or unsent synchronisation queues.' },
            ],
        },
        {
            id: 's7',
            title: '7. Audience measurement, diagnostics and performance',
            blocks: [
                { type: 'p', text: 'Subject to required choice, Yowyob may measure visits, pages, searches, categories, clicks, errors, loading, sources, devices, approximate areas and observable conversions to improve usability, stability and communications.' },
                { type: 'p', text: 'Events must not contain passwords, identity documents, confidential Review evidence, complete private messages, full payment data or sensitive data. Identifiers, IP addresses and retention are reduced where possible.' },
            ],
        },
        {
            id: 's8',
            title: '8. Professional analytics',
            blocks: [
                { type: 'p', text: 'BusinessBook may provide a business with statistics on Listing views, searches, call, WhatsApp, directions, website and favourite clicks, sources, areas, periods and campaigns. Statistics are aggregated or pseudonymised where possible.' },
                { type: 'p', text: 'A view or click is not a sale or qualified lead. Visitor identity is not normally supplied until voluntary contact. Businesses must not re-identify or abusively combine reports.' },
            ],
        },
        {
            id: 's9',
            title: '9. Maps, geolocation and permissions',
            blocks: [
                { type: 'p', text: 'A map or nearby search may require Listing coordinates, approximate IP or precise position. Browser or operating-system permission is separate from cookie consent and can be revoked on the device.' },
                { type: 'p', text: 'A mapping provider may receive necessary technical data. External content may be delayed until required choice. Without precise position, Users may normally enter a city or address manually.' },
            ],
        },
        {
            id: 's10',
            title: '10. Call, email, WhatsApp and directions buttons',
            blocks: [
                { type: 'p', text: 'A click may be measured as a connection event and open telephone, email, WhatsApp, mapping or the business website. The third party may then use its own trackers or receive data under its terms.' },
                { type: 'p', text: 'BusinessBook does not automatically read an external call or message. A tagged URL may carry campaign source or a limited identifier for conversion measurement, but no secret or sensitive data.' },
            ],
        },
        {
            id: 's11',
            title: '11. Promotions, sponsorship and contextual advertising',
            blocks: [
                { type: 'p', text: 'BusinessBook may display Promotions, partners, offers or sponsored rankings. Commercial character must be identifiable and must not obscure essential offer information.' },
                { type: 'p', text: 'Contextual advertising may rely on page, category, language, general city or current query without cross-site tracking. Refusing personalisation does not necessarily block contextual ads or first-party Promotions.' },
            ],
        },
        {
            id: 's12',
            title: '12. Personalised advertising, retargeting and audiences',
            blocks: [
                { type: 'p', text: 'Where these practices are used, they are activated only with the required basis and choices. They may use pages, categories, interactions, pseudonymous identifiers, sources and limited segments to adapt or measure ads.' },
                { type: 'p', text: 'Yowyob does not use Claim documents, confidential evidence, payment data, passwords, sensitive Reviews, precise location or private messages as ordinary ad categories. Partners must follow contractual restrictions and choices.' },
            ],
        },
        {
            id: 's13',
            title: '13. Campaign measurement, attribution and ad fraud',
            blocks: [
                { type: 'p', text: 'Identifiers or parameters may connect an impression, click, Listing visit, initiated contact or declared action with a campaign. Attribution models are indicative and may use time windows and technical rules.' },
                { type: 'p', text: 'Yowyob may detect automated, repetitive, incentivised or fraudulent clicks and exclude them from reports or bills. Impressions, clicks and conversions do not guarantee sales or exclusive causation.' },
            ],
        },
        {
            id: 's14',
            title: '14. Social networks and external content',
            blocks: [
                { type: 'p', text: 'Facebook, X, Instagram buttons, videos, maps or embedded posts may communicate with the provider, especially where the User is logged in there. Where required, content is blocked until consent or opens in a new tab.' },
                { type: 'p', text: 'Sharing a Listing is voluntary. The social network then processes data under its own rules; Yowyob does not control its cookies, profiles or periods.' },
            ],
        },
        {
            id: 's15',
            title: '15. Email, SMS, push and pixels',
            blocks: [
                { type: 'p', text: 'Transactional messages may use technical identifiers or secure links to confirm an account, Claim, Review, payment or incident and measure deliverability. Marketing messages may measure opening or clicking only with the required basis and notice.' },
                { type: 'p', text: 'Marketing unsubscribe does not block essential messages. Device settings control push; preference links control commercial email and SMS.' },
            ],
        },
        {
            id: 's16',
            title: '16. PWA, cache, offline mode and synchronisation',
            blocks: [
                { type: 'p', text: 'A PWA may store resources, preferences, recently viewed Listings, drafts or queues to work under weak connectivity. Local data may persist after the tab closes.' },
                { type: 'p', text: 'On shared devices, Users should sign out and clear local data. Clearing cache before synchronisation can lose a draft; sensitive data should be minimised, risk-appropriately encrypted and purged when unnecessary.' },
            ],
        },
        {
            id: 's17',
            title: '17. Mobile apps, SDKs and advertising identifiers',
            blocks: [
                { type: 'p', text: 'A mobile app may use SDKs for notifications, diagnostics, maps, security, payment, attribution or analytics. The app register identifies active providers. Permissions — location, camera, photos, notifications or contacts — are requested separately.' },
                { type: 'p', text: 'System advertising identifiers are used for personalisation only where permitted and chosen. Users may reset or restrict them in device settings.' },
            ],
        },
        {
            id: 's18',
            title: '18. APIs, server logs and anti-abuse protection',
            blocks: [
                { type: 'p', text: 'APIs and servers generate logs even without cookies: IP, client, limited key, time, route, status, latency, volume, error and correlation. They support security, support, audit, quotas and possible billing.' },
                { type: 'p', text: 'Integrators must not place passwords, identity documents, private messages, tokens or secrets in URLs that may be logged. Device fingerprinting is limited to security and must not become hidden advertising tracking.' },
            ],
        },
        {
            id: 's19',
            title: '19. Obtaining and evidencing consent',
            blocks: [
                { type: 'p', text: 'Where consent is required, the banner or preference centre offers accept, reject and purpose-level choices with comparable ease. Non-essential options are not preselected and refusal is not met with deceptive pressure.' },
                { type: 'p', text: 'Yowyob keeps limited evidence: notice version, date, categories, consent identifier and source. A new choice is requested after material change, appropriate expiry, storage deletion or loss of evidence.' },
            ],
        },
        {
            id: 's20',
            title: '20. Changing, withdrawing and synchronising choices',
            blocks: [
                { type: 'p', text: 'Users may reopen Cookie Preferences, Privacy or Ads settings through the footer, account or app where available. Withdrawal does not affect earlier lawfulness.' },
                { type: 'p', text: 'Choice may be browser- or device-specific. Account synchronisation may be offered without forcing trackers. Blocking or clearing all cookies can sign out the User and reset language, favourites and consent.' },
            ],
        },
        {
            id: 's21',
            title: '21. Global Privacy Control, Do Not Track and system settings',
            blocks: [
                { type: 'p', text: 'Where technically and legally applicable, a valid Global Privacy Control signal is treated as an objection or refusal for covered sale, advertising sharing or targeted advertising. Scope depends on territory, browser and login.' },
                { type: 'p', text: 'Do Not Track has no uniform meaning and may not replace the preference centre. iOS, Android, browser and permission settings continue to apply to relevant identifiers and sensors.' },
            ],
        },
        {
            id: 's22',
            title: '22. Duration and expiry',
            blocks: [
                { type: 'p', text: 'A session cookie expires on closure or session end; a persistent cookie on its date or deletion. Periods are proportionate: security by risk, preference by utility, consent by evidence, and analytics/advertising as short as reasonably possible.' },
                { type: 'p', text: 'The dynamic register states the exact period or criterion. Identifiers should not be artificially renewed on every visit without justification. Server logs follow the Privacy Notice.' },
            ],
        },
        {
            id: 's23',
            title: '23. Shared devices and security',
            blocks: [
                { type: 'p', text: 'On public or shared computers, do not request persistent login, sign out and clear site data. A business administrator should control devices and profiles used for Listing management.' },
                { type: 'p', text: 'Never send passwords, codes, identity documents, tokens or secrets into analytics tools, URL parameters, pixels or unsolicited social messages.' },
            ],
        },
        {
            id: 's24',
            title: '24. No sale of contact lists and advertising limits',
            blocks: [
                { type: 'p', text: 'Yowyob does not sell BusinessBook contact lists to advertisers. A campaign or its reporting does not mean the advertiser receives raw Visitor data.' },
                { type: 'p', text: 'Identity, Claim, confidential Review, payment, precise-location and security data are not ordinary segments. Any exceptional use requires compatibility, minimisation, transparency and appropriate choice.' },
            ],
        },
        {
            id: 's25',
            title: '25. Dynamic register, changes and contacts',
            blocks: [
                { type: 'p', text: 'Yowyob may amend this Notice and register when a provider, technology, purpose, duration or law changes. A new choice is shown where prior consent becomes insufficient. The operational register prevails over annex examples.' },
                { type: 'p', text: 'French and English versions seek the same effect; French prevails for operations mainly connected with Cameroon, subject to mandatory law. Contacts: privacy@businessbook.cm, privacy@yowyob.com, support@yowyob.com and legal@yowyob.com.' },
            ],
        },
    ],
    annexes: [
        {
            id: 'annex-a',
            title: 'Annex A — Technology register template',
            blocks: [
                {
                    type: 'table',
                    head: ['Name / provider', 'Category', 'Purpose', 'Data / third-party access', 'Period', 'Basis / choice'],
                    rows: [
                        ['To complete', 'Necessary', 'Session, security or consent', 'Limited identifier; possible provider', 'Session / exact period', 'Necessity / legitimate interest'],
                        ['To complete', 'Preference', 'Language, area, favourites, interface', 'Device or account storage', 'Exact period', 'Request / consent where required'],
                        ['To complete', 'Analytics', 'Audience, errors, performance', 'Reduced IP, event, device', 'Exact period', 'Consent or documented exemption'],
                        ['To complete', 'Map / external', 'Map, directions, media', 'IP, query, coordinates', 'Provider period', 'Consent or requested function'],
                        ['To complete', 'Advertising', 'Attribution, frequency, personalisation', 'Identifier, segment, event', 'Exact period', 'Consent / applicable objection'],
                    ],
                },
            ],
        },
        {
            id: 'annex-b',
            title: 'Annex B — Implementation and publication checklist',
            blocks: [
                {
                    type: 'table',
                    head: ['Control', 'Required action'],
                    rows: [
                        ['Inventory', 'Scan every domain, app, tag manager, SDK, email tool and embedded content.'],
                        ['Classification', 'Assign category, purpose, provider, controller role, data and duration.'],
                        ['Blocking', 'Prevent non-essential loading before the required choice.'],
                        ['Banner', 'Provide equally clear accept, reject and customise controls.'],
                        ['Register', 'Publish actual names, providers, purposes and expiries.'],
                        ['Evidence', 'Record version, time, source and selected categories only as needed.'],
                        ['Withdrawal', 'Keep preferences accessible and effective without unnecessary friction.'],
                        ['Validation', 'Test browser, mobile, PWA, logged-in/out and shared-device scenarios.'],
                        ['Review', 'Re-scan after every release, provider change or campaign launch.'],
                    ],
                },
            ],
        },
    ],
};

export const cookiesDoc: LegalDocSet = { fr, en };
