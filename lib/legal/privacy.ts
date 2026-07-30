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
 * BBK-LEGAL-PRIVACY-ENFR-1.0 — Avis de confidentialité et de protection des données.
 * Source : BusinessBook_Privacy_Notice_EN-FR_Published-Beta_v1.0.docx
 */

const CODE = 'BBK-LEGAL-PRIVACY-ENFR-1.0';

const CHANGE_FR =
    'Première version consolidée couvrant les données publiques et indirectes, fiches, revendications, avis, localisation, prospects, analytics et publicité.';
const CHANGE_EN =
    'First consolidated version covering public and indirect data, listings, claims, reviews, location, leads, analytics and advertising.';

const fr: LegalDoc = {
    slug: 'privacy',
    code: CODE,
    version: LEGAL_VERSION,
    status: LEGAL_STATUS.fr,
    effectiveDate: LEGAL_EFFECTIVE_DATE.fr,
    title: 'Avis de confidentialité et de protection des données',
    shortTitle: 'Confidentialité',
    subtitle: 'Traitements applicables à l’annuaire BusinessBook',
    purpose: 'Quelles données BusinessBook traite, pour quelles finalités, avec qui elles sont partagées et comment exercer vos droits.',
    important: LEGAL_IMPORTANT.fr,
    highlights: [
        {
            title: 'Vos droits, et comment les exercer',
            text: 'Accès, rectification, effacement, limitation, opposition, portabilité et retrait du consentement — une demande à privacy@businessbook.cm suffit.',
            sectionId: 's27',
        },
        {
            title: 'Aucune vente de fichiers de contacts',
            text: 'Yowyob ne vend pas de liste de contacts à des annonceurs. Revendication, pièces d’identité et localisation précise ne sont pas des segments publicitaires.',
            sectionId: 's15',
        },
        {
            title: 'Une fiche peut exister avant toute revendication',
            text: 'Elle peut provenir d’informations publiques ou d’un partenaire autorisé. Vous pouvez en demander la source, la correction ou le retrait.',
            sectionId: 's6',
        },
        {
            title: 'Les données exportées sortent de notre contrôle',
            text: 'Un export vers un CRM, un tableur ou un cloud partenaire relève de l’entité qui décide ce traitement — les obligations suivent la donnée.',
            sectionId: 's21',
        },
    ],
    lead: 'Cet Avis explique comment Yowyob collecte, utilise, partage, conserve et protège les données personnelles dans BusinessBook. Il complète les CGU, l’Avis Cookies & Publicité et les informations contextuelles affichées lors de la collecte.',
    references: LEGAL_REFERENCES.fr,
    referencesNote: REFERENCES_NOTE.fr,
    change: CHANGE_FR,
    meta: buildMeta('fr', CODE),
    sections: [
        {
            id: 's1',
            title: '1. Responsable du traitement et contacts',
            blocks: [
                { type: 'p', text: 'Yowyob Inc. Ltd, société à responsabilité limitée de droit camerounais, au capital social de 1 000 000 FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier sous le numéro RC/YAO/2020/B/1614, NIF M102015282478U, siège social : Carrefour Anguissa, Yaoundé, S/C Yaoundé 1er, Rue 1.121 Djoungolo, Cameroun.' },
                { type: 'p', text: 'Pour les traitements dont Yowyob détermine les finalités — comptes communs, annuaire, sécurité, vérification, modération, analytics de plateforme, amélioration, communication Yowyob et gouvernance — Yowyob agit comme responsable du traitement. Contacts : privacy@businessbook.cm et privacy@yowyob.com. Sécurité : support@yowyob.com. Juridique : legal@businessbook.cm et legal@yowyob.com.' },
            ],
        },
        {
            id: 's2',
            title: '2. Portée et rôles de protection des données',
            blocks: [
                { type: 'p', text: 'L’Avis couvre visiteurs, auteurs d’avis, représentants, administrateurs, propriétaires, employés, prospects, contacts figurant dans les fiches et personnes dont les données sont fournies par un tiers.' },
                { type: 'p', text: 'Une entreprise recevant un appel, un message, une demande de devis ou un prospect décide généralement de ses traitements ultérieurs et agit comme responsable indépendant. Yowyob peut agir comme sous-traitant lorsqu’un contrat professionnel lui confie une opération déterminée selon des instructions documentées.' },
            ],
        },
        {
            id: 's3',
            title: '3. Données d’entreprise et données personnelles',
            blocks: [
                { type: 'p', text: 'Le nom d’une société, sa catégorie ou son adresse commerciale ne sont pas toujours des données personnelles. Ils le deviennent ou en contiennent lorsqu’ils identifient un entrepreneur individuel, représentant, employé, propriétaire, numéro personnel, domicile, photographie, avis ou comportement d’une personne physique.' },
                { type: 'p', text: 'BusinessBook applique les principes de protection des données à tout ensemble raisonnablement susceptible d’identifier une personne, y compris par recoupement.' },
            ],
        },
        {
            id: 's4',
            title: '4. Catégories de données traitées',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Compte et identité : prénom, nom, nom d’utilisateur, email, téléphone, mot de passe haché, langue, préférences, statut et rôle.',
                        'Entreprise et fiche : raison sociale, nom commercial, immatriculation, NIF, catégorie, description, adresse, zone, coordonnées, horaires, sites, établissements, dirigeants ou représentants publics.',
                        'Revendication et vérification : mandat, pièce d’identité lorsque nécessaire, document d’entreprise, domaine, code, justificatif d’adresse, licence, date et résultat du contrôle.',
                        'Contenus : avis, notes, réponses, photos, logos, promotions, signalements, preuves et métadonnées.',
                        'Recherche et interaction : requêtes, catégories, filtres, favoris, vues, clics, appels initiés, itinéraires, partages et conversions observables.',
                        'Localisation : ville, zone, coordonnées de fiche, localisation approximative par IP ou précise avec permission.',
                        'Professionnel et commercial : abonnement, facture, campagne, audience, budget, paiement, statut, support et statistiques.',
                        'Technique et sécurité : IP, appareil, navigateur, système, session, journaux, identifiants, erreurs, vitesse, détection d’abus et consentements.',
                        'Communications : emails, formulaires, tickets, messages, notifications, appels ou enregistrements lorsqu’annoncés.',
                        'Données dérivées : score de complétude, confiance, risque, pertinence, popularité, qualité, segment, recommandation et statistiques agrégées.',
                    ],
                },
            ],
        },
        {
            id: 's5',
            title: '5. Sources des données',
            blocks: [
                { type: 'p', text: 'Les données proviennent de la personne, d’un administrateur d’organisation, d’un auteur d’avis, d’une entreprise, d’un partenaire autorisé, d’un registre ou site public, d’un fournisseur de carte, paiement ou identité, d’un terminal, de cookies/SDK, ou d’une autorité.' },
                { type: 'p', text: 'Une personne fournissant des données de tiers doit s’assurer qu’elles sont pertinentes, exactes et licitement communiquées, et informer le tiers au plus tard lors du premier contact lorsque la loi l’exige.' },
            ],
        },
        {
            id: 's6',
            title: '6. Collecte indirecte et fiches non revendiquées',
            blocks: [
                { type: 'p', text: 'BusinessBook peut référencer une entreprise ou un contact professionnel sans collecte directe lorsque l’information a été manifestement rendue publique, reçue licitement ou nécessaire à l’intérêt légitime d’un annuaire fiable. Yowyob documente la source, minimise la donnée et fournit l’information requise dans le délai légal ou applique une exception documentée.' },
                { type: 'p', text: 'La personne peut demander la source, la rectification, la limitation, l’opposition ou le retrait selon le contexte. Une donnée professionnelle publique n’est pas libre de toute protection ni réutilisable sans limite.' },
            ],
        },
        {
            id: 's7',
            title: '7. Données sensibles et à risque élevé',
            blocks: [
                { type: 'p', text: 'BusinessBook n’est pas conçu pour publier santé, opinions politiques, religion, orientation sexuelle, biométrie, génétique, infractions ou autres catégories sensibles. Leur publication est interdite sauf fonction explicite, nécessité légale et garanties renforcées.' },
                { type: 'p', text: 'Les pièces d’identité, signatures, domiciles, coordonnées personnelles, litiges et preuves d’avis sont traités avec minimisation et accès restreint. Une preuve confidentielle ne doit pas être rendue publique avec l’avis.' },
            ],
        },
        {
            id: 's8',
            title: '8. Finalités et bases juridiques',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Contrat ou mesures précontractuelles : créer le compte, gérer la fiche, traiter une revendication, fournir un abonnement, une campagne, le support ou une demande.',
                        'Obligation légale : facturation, fiscalité, sécurité, réponse aux autorités, droits, contentieux et notification des violations.',
                        'Intérêts légitimes après mise en balance : exploiter un annuaire utile, vérifier et actualiser les fiches, prévenir fraude et faux avis, modérer, sécuriser, mesurer, améliorer, défendre des droits et communiquer raisonnablement avec les professionnels.',
                        'Consentement : cookies non nécessaires, publicité personnalisée lorsqu’utilisée, localisation précise facultative, accès optionnel au carnet d’adresses, marketing et certains contenus ou enregistrements.',
                        'Mission d’intérêt public ou intérêts vitaux seulement lorsqu’une loi le prévoit et que le traitement est documenté.',
                    ],
                },
            ],
        },
        {
            id: 's9',
            title: '9. Données obligatoires et conséquences du refus',
            blocks: [
                { type: 'p', text: 'Les champs marqués obligatoires sont nécessaires à l’inscription, la sécurité, la revendication, la facturation ou la prestation demandée. Sans preuve suffisante, le contrôle d’une fiche ou l’attribution d’un badge peut être refusé. Sans contact, Yowyob ne peut répondre à une demande.' },
                { type: 'p', text: 'Les données facultatives améliorent la visibilité ou la personnalisation. Le refus des analytics ou de la publicité non essentielle ne bloque pas les fonctions essentielles. Le refus de la localisation précise permet généralement une saisie manuelle mais peut réduire la recherche de proximité.' },
            ],
        },
        {
            id: 's10',
            title: '10. Publication, visibilité et indexation',
            blocks: [
                { type: 'p', text: 'Les informations de fiche désignées comme publiques peuvent être visibles sans compte et indexées par des moteurs : nom, catégorie, description, coordonnées professionnelles, adresse, horaires, médias, badge, promotions, notes et réponses. L’interface doit distinguer autant que possible les champs publics et privés.' },
                { type: 'p', text: 'Yowyob évite de publier pièce d’identité, preuve confidentielle, email de compte non destiné au public, téléphone privé, données de paiement ou journaux. L’entreprise doit utiliser des contacts professionnels appropriés et ne pas publier le domicile d’une personne sans nécessité et base valable.' },
            ],
        },
        {
            id: 's11',
            title: '11. Avis, pseudonymes et preuves',
            blocks: [
                { type: 'p', text: 'Le nom d’affichage, la note, le texte, la date et certains éléments de profil peuvent être publics. Des données internes — compte, IP, signaux d’intégrité, historique et preuve — peuvent servir à vérifier l’authenticité, lutter contre les abus et résoudre une contestation sans être publiées.' },
                { type: 'p', text: 'Une entreprise ne reçoit pas automatiquement l’identité complète ou la preuve confidentielle de l’auteur. Un partage ciblé peut intervenir avec consentement, nécessité procédurale, obligation légale ou garanties permettant la défense des droits.' },
            ],
        },
        {
            id: 's12',
            title: '12. Revendication, vérification et badges',
            blocks: [
                { type: 'p', text: 'Yowyob utilise les données de revendication pour vérifier le lien entre une personne et l’entreprise, prévenir l’usurpation, attribuer des rôles, résoudre les conflits et réévaluer un badge. Les documents sont accessibles à un nombre limité de personnes et ne doivent pas être utilisés pour la publicité.' },
                { type: 'p', text: 'Le résultat, la date, la méthode ou un niveau de contrôle peut être public; les pièces brutes restent privées sauf nécessité légale. Une vérification expirée ou contradictoire peut entraîner une nouvelle demande.' },
            ],
        },
        {
            id: 's13',
            title: '13. Prospects, appels, WhatsApp et redirections',
            blocks: [
                { type: 'p', text: 'Lorsque l’utilisateur clique sur appel, email, WhatsApp, itinéraire ou site, BusinessBook peut enregistrer l’événement, la fiche et le contexte technique. Le tiers reçoit ensuite les données que l’utilisateur choisit de lui transmettre.' },
                { type: 'p', text: 'L’entreprise devient responsable de sa réponse, CRM, relance, devis et conservation. Elle doit informer le prospect, respecter son choix et ne pas réutiliser les coordonnées pour une finalité incompatible.' },
            ],
        },
        {
            id: 's14',
            title: '14. Destinataires et partages',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Personnel Yowyob autorisé et entités ou équipes ayant besoin d’en connaître.',
                        'Entreprise ou représentant concerné par une revendication, un contact, un avis ou un signalement, dans la mesure nécessaire.',
                        'Prestataires d’hébergement, sécurité, email, SMS, notification, cartographie, paiement, identité, analytics, support, sauvegarde, audit et conseil soumis à des obligations appropriées.',
                        'Partenaires de campagne ou contenus externes lorsque le choix ou la base juridique l’autorise.',
                        'Autorités, juridictions, conseils, assureurs ou parties à une opération sociétaire lorsque la loi, la sécurité ou la défense des droits le justifie.',
                    ],
                },
            ],
        },
        {
            id: 's15',
            title: '15. Absence de vente de données et limites commerciales',
            blocks: [
                { type: 'p', text: 'Yowyob ne vend pas de fichiers de contacts personnels BusinessBook à des annonceurs. La publicité, la mesure ou la transmission volontaire d’une demande à une entreprise ne signifie pas la remise d’une base brute d’utilisateurs.' },
                { type: 'p', text: 'Les données de revendication, pièces d’identité, avis confidentiels, localisation précise, paiement et sécurité ne sont pas utilisées comme catégories publicitaires ordinaires.' },
            ],
        },
        {
            id: 's16',
            title: '16. Cartographie et localisation',
            blocks: [
                { type: 'p', text: 'La recherche peut utiliser une localisation saisie, une zone approximative ou une position précise avec permission du terminal. Les coordonnées d’une entreprise peuvent être géocodées et publiées pour l’itinéraire.' },
                { type: 'p', text: 'Les fournisseurs de carte peuvent recevoir IP, zone, coordonnées ou requête selon leur intégration et agir comme sous-traitants ou responsables indépendants. L’utilisateur peut retirer la permission du terminal; le Professionnel doit vérifier que le marqueur ne révèle pas un domicile injustifié.' },
            ],
        },
        {
            id: 's17',
            title: '17. Analytics professionnels et statistiques',
            blocks: [
                { type: 'p', text: 'Yowyob peut fournir au Professionnel des vues, recherches, clics, sources, zones, périodes, appareils, conversions observables et tendances. Les statistiques sont agrégées ou pseudonymisées lorsque possible et ne révèlent pas normalement l’identité d’un Visiteur qui n’a pas engagé de contact.' },
                { type: 'p', text: 'Le Professionnel ne doit pas tenter de réidentifier, combiner avec des données externes de manière abusive ou utiliser l’analytics pour discrimination illicite.' },
            ],
        },
        {
            id: 's18',
            title: '18. Classement, profilage et décisions automatisées',
            blocks: [
                { type: 'p', text: 'Des traitements automatisés peuvent produire pertinence, recommandation, score de complétude, risque d’abus, détection de faux avis, priorité de modération ou performance de campagne. Ils reposent sur les données et signaux décrits dans cet Avis.' },
                { type: 'p', text: 'Yowyob teste proportionnalité, qualité, biais et sécurité. Lorsqu’une décision exclusivement automatisée produit un effet juridique ou significatif, la personne bénéficie des informations, de l’intervention humaine, de la contestation et des autres garanties exigées par la loi.' },
            ],
        },
        {
            id: 's19',
            title: '19. Communications et marketing',
            blocks: [
                { type: 'p', text: 'Les messages nécessaires concernent sécurité, compte, revendication, avis, paiement, service ou changement juridique. Les communications commerciales Yowyob ou partenaires utilisent consentement ou autre base admise, identifient l’émetteur et offrent un moyen simple d’opposition.' },
                { type: 'p', text: 'Le retrait du marketing n’empêche pas les messages indispensables. Les préférences peuvent être gérées dans le compte, par lien de désinscription ou auprès de privacy@businessbook.cm.' },
            ],
        },
        {
            id: 's20',
            title: '20. Transferts internationaux et hébergement',
            blocks: [
                { type: 'p', text: 'Les données peuvent être hébergées ou accessibles depuis le Cameroun ou un autre pays par Yowyob et ses prestataires. Avant un transfert, Yowyob évalue exigences, destination, nécessité, garanties contractuelles et techniques, ainsi que toute autorisation ou consentement requis.' },
                { type: 'p', text: 'Lorsque la protection du pays destinataire est insuffisante, Yowyob applique des garanties appropriées ou limite le transfert. Une entreprise exportant vers son propre fournisseur est responsable de ce transfert.' },
            ],
        },
        {
            id: 's21',
            title: '21. Données hors du Cloud Yowyob',
            blocks: [
                { type: 'p', text: 'Les exports, téléchargements, impressions, emails, copies, synchronisations, CRM, tableurs, terminaux, clouds, sauvegardes, API ou webhooks externes relèvent de l’entité qui décide ce traitement. Elle doit informer, sécuriser, limiter, conserver seulement le nécessaire, répondre aux droits et notifier les incidents.' },
                { type: 'p', text: 'Yowyob ne contrôle pas les copies, appareils ou sauvegardes partenaires. Il fournit l’assistance prévue, sans répondre d’un incident exclusivement externe non causé par lui. Les obligations suivent les données après export.' },
            ],
        },
        {
            id: 's22',
            title: '22. Durées de conservation',
            blocks: [
                { type: 'p', text: 'Yowyob conserve les données pendant la durée nécessaire aux finalités, au contrat, aux obligations, à la sécurité et à la défense. À l’échéance, elles sont supprimées, anonymisées ou archivées sous accès restreint. Une conservation peut être prolongée par litige, fraude, obligation ou gel légal.' },
                {
                    type: 'list',
                    items: [
                        'Compte actif : durée de la relation; compte fermé : administration, sécurité et délais de prescription applicables.',
                        'Fiche publique : tant que l’entreprise existe, que l’information demeure pertinente ou qu’un intérêt légitime/public justifie la référence, avec révision périodique.',
                        'Revendication et vérification : durée nécessaire au contrôle, à la réévaluation, à la prévention de l’usurpation et aux obligations applicables.',
                        'Avis, réponses et preuves : durée de publication et période de contestation/défense; preuve confidentielle limitée au nécessaire.',
                        'Factures et paiements : durées légales comptables, fiscales et de défense.',
                        'Journaux de sécurité : durée proportionnée aux risques, investigations et détection.',
                        'Consentements et oppositions : durée nécessaire à la preuve et au respect du choix.',
                        'Cookies : selon le registre dynamique, sans renouvellement artificiel.',
                    ],
                },
            ],
        },
        {
            id: 's23',
            title: '23. Qualité, rectification et révision des fiches',
            blocks: [
                { type: 'p', text: 'Yowyob met en œuvre des contrôles, dates de mise à jour, mécanismes de signalement et campagnes de revalidation. L’entreprise doit confirmer périodiquement ses informations. Une correction peut être temporairement différée lorsqu’une contestation nécessite de préserver une version ou une preuve.' },
                { type: 'p', text: 'Yowyob peut comparer des sources, marquer une information comme non confirmée, limiter son affichage ou inviter le public à signaler un changement.' },
            ],
        },
        {
            id: 's24',
            title: '24. Sécurité et confidentialité',
            blocks: [
                { type: 'p', text: 'Mesures proportionnées : gestion des rôles, authentification, journalisation, chiffrement en transit et selon le risque au repos, segmentation, sauvegardes, surveillance, correctifs, tests, secrets, procédures d’incident, formation et gouvernance des prestataires.' },
                { type: 'p', text: 'La sécurité est partagée : mot de passe unique, appareils à jour, contrôle des administrateurs, limitation des exports et signalement immédiat d’un compte, badge, document ou session compromis.' },
            ],
        },
        {
            id: 's25',
            title: '25. Violations de données personnelles',
            blocks: [
                { type: 'p', text: 'Yowyob évalue l’incident, contient sa propagation, préserve les preuves, corrige et documente. Lorsque les conditions légales sont réunies, il notifie l’autorité compétente et les personnes concernées dans les délais applicables avec les informations requises.' },
                { type: 'p', text: 'Les Professionnels et prestataires doivent informer Yowyob sans délai injustifié de tout incident touchant des données BusinessBook et coopérer à l’évaluation, sans communication publique non coordonnée qui aggraverait le risque.' },
            ],
        },
        {
            id: 's26',
            title: '26. Droits des personnes',
            blocks: [
                { type: 'p', text: 'Selon la loi et le contexte : droit à l’information, accès, rectification, effacement, limitation, opposition, portabilité, retrait du consentement, directives applicables après décès, contestation d’une décision automatisée et réclamation auprès de l’autorité ou juridiction compétente.' },
                { type: 'p', text: 'Ces droits ne sont pas absolus. Yowyob peut refuser ou limiter une demande manifestement infondée, excessive, portant atteinte aux droits d’autrui, aux secrets, à la sécurité, à la preuve ou à une obligation de conservation, en motivant sa décision.' },
            ],
        },
        {
            id: 's27',
            title: '27. Exercice des droits et vérification',
            blocks: [
                { type: 'p', text: 'Adressez la demande à privacy@businessbook.cm ou privacy@yowyob.com en précisant compte, fiche, URL, rôle, droit et données concernées. Yowyob peut demander une preuve proportionnée d’identité ou de mandat et ne sollicite pas une copie complète de pièce si une méthode moins intrusive suffit.' },
                { type: 'p', text: 'Lorsque l’entreprise est responsable du traitement demandé, Yowyob peut transmettre ou orienter la personne et coopérer. Les demandes sont tracées et traitées dans le délai légal; les recours disponibles sont indiqués.' },
            ],
        },
        {
            id: 's28',
            title: '28. Enfants et personnes vulnérables',
            blocks: [
                { type: 'p', text: 'BusinessBook ne cible pas les enfants pour les comptes professionnels, campagnes ou avis commerciaux. Un mineur ne doit pas publier de coordonnées, images, localisation ou expérience commerciale sans encadrement approprié.' },
                { type: 'p', text: 'Yowyob peut retirer le contenu, fermer le compte et demander l’intervention d’un représentant légal. Les entreprises doivent éviter toute exploitation commerciale ou profilage illicite de personnes vulnérables.' },
            ],
        },
        {
            id: 's29',
            title: '29. Données anonymisées, statistiques et amélioration',
            blocks: [
                { type: 'p', text: 'Yowyob peut agréger ou anonymiser des données pour statistiques, recherche, planification, qualité, sécurité et développement de services. Une donnée réellement anonymisée n’est plus une donnée personnelle; la pseudonymisation seule ne suffit pas.' },
                { type: 'p', text: 'Les données brutes personnelles, pièces de vérification et messages privés ne sont pas utilisées sans gouvernance pour entraîner un modèle général. Tout usage d’IA doit respecter finalité, minimisation, sécurité, droits, tests et contrats.' },
            ],
        },
        {
            id: 's30',
            title: '30. Modifications, langue et contacts',
            blocks: [
                { type: 'p', text: 'Yowyob peut modifier l’Avis pour refléter une loi, un fournisseur, une architecture, une fonctionnalité ou un traitement. Les changements importants sont signalés par le site, le compte, l’email ou un moyen approprié.' },
                { type: 'p', text: 'Les versions française et anglaise visent le même effet; pour les traitements principalement camerounais, le français prévaut en cas de divergence, sous réserve du droit impératif. Contacts : privacy@businessbook.cm, privacy@yowyob.com, support@yowyob.com et legal@yowyob.com.' },
            ],
        },
    ],
    annexes: [
        {
            id: 'annex-a',
            title: 'Annexe A — Matrice indicative des traitements',
            blocks: [
                {
                    type: 'table',
                    head: ['Activité', 'Données principales', 'Base indicative', 'Destinataires / durée'],
                    rows: [
                        ['Compte', 'Identité, contact, rôle, sécurité', 'Contrat; intérêt légitime; obligation', 'Yowyob/prestataires; relation + obligations'],
                        ['Fiche publique', 'Entreprise, contact pro, adresse, contenus', 'Intérêt légitime; contrat; données publiques', 'Public/moteurs; pertinence + révision'],
                        ['Revendication', 'Mandat, identité, documents, logs', 'Contrat; intérêt légitime; obligation', 'Équipe restreinte; contrôle + défense'],
                        ['Avis et modération', 'Profil, texte, note, preuve, intégrité', 'Contrat; intérêt légitime; obligation', 'Public partiel/modération; publication + contestation'],
                        ['Mise en relation', 'Fiche, événement, message choisi', 'Demande/contrat; intérêt légitime', 'Entreprise et prestataires; besoin + obligations'],
                        ['Campagne et analytics', 'Audience, clics, source, conversion', 'Contrat; consentement/intérêt légitime selon usage', 'Professionnel agrégé/prestataires; campagne + mesure'],
                        ['Sécurité', 'IP, appareil, logs, anomalies', 'Intérêt légitime; obligation', 'Sécurité/autorités si requis; risque + enquête'],
                    ],
                },
            ],
        },
    ],
};

const en: LegalDoc = {
    slug: 'privacy',
    code: CODE,
    version: LEGAL_VERSION,
    status: LEGAL_STATUS.en,
    effectiveDate: LEGAL_EFFECTIVE_DATE.en,
    title: 'Privacy and Personal Data Protection Notice',
    shortTitle: 'Privacy Notice',
    subtitle: 'Processing applicable to the BusinessBook directory',
    purpose: 'What data BusinessBook processes, for which purposes, who it is shared with and how to exercise your rights.',
    important: LEGAL_IMPORTANT.en,
    highlights: [
        {
            title: 'Your rights, and how to use them',
            text: 'Access, rectification, erasure, restriction, objection, portability and consent withdrawal — one request to privacy@businessbook.cm is enough.',
            sectionId: 's27',
        },
        {
            title: 'No sale of contact lists',
            text: 'Yowyob does not sell contact lists to advertisers. Claim data, identity documents and precise location are not advertising segments.',
            sectionId: 's15',
        },
        {
            title: 'A Listing may exist before any claim',
            text: 'It may come from public information or an authorised partner. You can request its source, correction or removal.',
            sectionId: 's6',
        },
        {
            title: 'Exported data leaves our control',
            text: 'An export to a CRM, spreadsheet or partner cloud is controlled by whoever decides that processing — obligations follow the data.',
            sectionId: 's21',
        },
    ],
    lead: 'This Notice explains how Yowyob collects, uses, shares, retains and protects personal data in BusinessBook. It supplements the Terms, the Cookies & Ads Notice and contextual information displayed at collection.',
    references: LEGAL_REFERENCES.en,
    referencesNote: REFERENCES_NOTE.en,
    change: CHANGE_EN,
    meta: buildMeta('en', CODE),
    sections: [
        {
            id: 's1',
            title: '1. Controller and contacts',
            blocks: [
                { type: 'p', text: 'Yowyob Inc. Ltd, a limited liability company incorporated under Cameroonian law, with share capital of XAF 1,000,000, registered with the Trade and Personal Property Credit Register under number RC/YAO/2020/B/1614, Tax Identification Number M102015282478U, registered office at Carrefour Anguissa, Yaoundé, S/C Yaoundé 1er, Rue 1.121 Djoungolo, Cameroon.' },
                { type: 'p', text: 'For processing whose purposes are determined by Yowyob — shared accounts, directory operation, security, verification, moderation, platform analytics, improvement, Yowyob communications and governance — Yowyob acts as controller. Contacts: privacy@businessbook.cm and privacy@yowyob.com. Security: support@yowyob.com. Legal: legal@businessbook.cm and legal@yowyob.com.' },
            ],
        },
        {
            id: 's2',
            title: '2. Scope and data-protection roles',
            blocks: [
                { type: 'p', text: 'This Notice covers Visitors, Reviewers, representatives, administrators, owners, employees, prospects, contacts shown in Listings and persons whose data is supplied by another party.' },
                { type: 'p', text: 'A business receiving a call, message, quotation request or lead generally decides its subsequent processing and acts as an independent controller. Yowyob may act as processor where a professional agreement entrusts a defined operation under documented instructions.' },
            ],
        },
        {
            id: 's3',
            title: '3. Business information and personal data',
            blocks: [
                { type: 'p', text: 'A company name, category or business address is not always personal data. It is, or contains personal data, where it identifies a sole trader, representative, employee, owner, personal number, home address, photograph, Review or behaviour of an individual.' },
                { type: 'p', text: 'BusinessBook applies data-protection principles to information reasonably capable of identifying a person, including by combination.' },
            ],
        },
        {
            id: 's4',
            title: '4. Categories of data processed',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Account and identity: first and last name, username, email, telephone, hashed password, language, preferences, status and role.',
                        'Business and Listing: corporate and trade names, registration, tax number, category, description, address, area, contacts, opening hours, sites, establishments, directors or public representatives.',
                        'Claim and verification: mandate, identity evidence where needed, business document, domain, code, proof of address, licence, check date and result.',
                        'Content: Reviews, ratings, replies, photographs, logos, Promotions, reports, evidence and metadata.',
                        'Search and interaction: queries, categories, filters, favourites, views, clicks, initiated calls, directions, shares and observable conversions.',
                        'Location: city, area, Listing coordinates, approximate IP location or precise location with permission.',
                        'Professional and commercial: subscription, invoice, campaign, audience, budget, payment, status, support and statistics.',
                        'Technical and security: IP, device, browser, operating system, session, logs, identifiers, errors, speed, abuse detection and consent records.',
                        'Communications: emails, forms, tickets, messages, notifications, calls or recordings where announced.',
                        'Derived data: completeness, trust, risk, relevance, popularity, quality, segment, recommendation and aggregate statistics.',
                    ],
                },
            ],
        },
        {
            id: 's5',
            title: '5. Data sources',
            blocks: [
                { type: 'p', text: 'Data may come from the person, an organisation administrator, a Reviewer, a business, an authorised partner, a public register or website, a mapping, payment or identity provider, a device, cookies/SDKs, or an authority.' },
                { type: 'p', text: 'A party providing third-party data must ensure that it is relevant, accurate and lawfully shared and must inform the third party no later than first contact where required.' },
            ],
        },
        {
            id: 's6',
            title: '6. Indirect collection and unclaimed Listings',
            blocks: [
                { type: 'p', text: 'BusinessBook may list a business or professional contact without direct collection where information was manifestly public, lawfully received or necessary to the legitimate interest in a reliable directory. Yowyob documents the source, minimises data and provides required information within the legal period or applies a documented exception.' },
                { type: 'p', text: 'The person may request the source, correction, restriction, objection or removal according to context. Public professional information remains protected and is not unrestricted reusable data.' },
            ],
        },
        {
            id: 's7',
            title: '7. Sensitive and high-risk data',
            blocks: [
                { type: 'p', text: 'BusinessBook is not designed to publish health, political opinions, religion, sexual orientation, biometric, genetic, offence or other sensitive data. Publication is prohibited unless an explicit function, legal necessity and enhanced safeguards apply.' },
                { type: 'p', text: 'Identity documents, signatures, home addresses, personal contacts, disputes and Review evidence receive minimised and restricted treatment. Confidential evidence must not be displayed with a public Review.' },
            ],
        },
        {
            id: 's8',
            title: '8. Purposes and lawful bases',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Contract or pre-contract steps: create an account, manage a Listing, process a Claim, provide a subscription, campaign, support or request.',
                        'Legal obligation: billing, taxation, security, authority responses, rights, disputes and breach notification.',
                        'Legitimate interests after balancing: operate a useful directory, verify and update Listings, prevent fraud and fake Reviews, moderate, secure, measure, improve, defend rights and reasonably communicate with professionals.',
                        'Consent: non-essential cookies, personalised advertising where used, optional precise location, optional address-book access, marketing and certain content or recordings.',
                        'Public-interest task or vital interests only where law provides and processing is documented.',
                    ],
                },
            ],
        },
        {
            id: 's9',
            title: '9. Mandatory data and refusal consequences',
            blocks: [
                { type: 'p', text: 'Fields marked mandatory are required for registration, security, Claim, billing or the requested service. Without adequate evidence, Listing control or a Badge may be refused. Without contact data, Yowyob cannot answer a request.' },
                { type: 'p', text: 'Optional data improves visibility or personalisation. Refusing analytics or non-essential advertising does not block essential functions. Refusing precise location normally permits manual input but may reduce nearby search.' },
            ],
        },
        {
            id: 's10',
            title: '10. Publication, visibility and indexing',
            blocks: [
                { type: 'p', text: 'Listing fields designated public may be visible without an account and indexed by search engines: name, category, description, professional contacts, address, opening hours, media, Badge, Promotions, ratings and replies. The interface should distinguish public and private fields where practicable.' },
                { type: 'p', text: 'Yowyob avoids publishing identity documents, confidential evidence, non-public account email, private telephone, payment details or logs. Businesses should use appropriate professional contacts and must not publish a person’s home without necessity and a valid basis.' },
            ],
        },
        {
            id: 's11',
            title: '11. Reviews, pseudonyms and evidence',
            blocks: [
                { type: 'p', text: 'Display name, rating, text, date and certain profile elements may be public. Internal data — account, IP, integrity signals, history and evidence — may be used to verify authenticity, address abuse and resolve disputes without public disclosure.' },
                { type: 'p', text: 'A business does not automatically receive the Reviewer’s full identity or confidential proof. Targeted disclosure may occur with consent, procedural necessity, legal obligation or safeguards enabling defence of rights.' },
            ],
        },
        {
            id: 's12',
            title: '12. Claims, verification and Badges',
            blocks: [
                { type: 'p', text: 'Yowyob uses Claim data to verify a person’s connection with a business, prevent impersonation, allocate roles, resolve disputes and reassess a Badge. Documents are accessible only to a limited group and are not used for advertising.' },
                { type: 'p', text: 'A result, date, method or verification level may be public; raw documents remain private unless legally necessary. Expired or contradictory verification may trigger a new request.' },
            ],
        },
        {
            id: 's13',
            title: '13. Leads, calls, WhatsApp and redirects',
            blocks: [
                { type: 'p', text: 'When a User clicks call, email, WhatsApp, directions or website, BusinessBook may record the event, Listing and technical context. The third party then receives data the User chooses to send.' },
                { type: 'p', text: 'The business becomes responsible for its reply, CRM, follow-up, quotation and retention. It must inform the prospect, respect choices and avoid incompatible reuse.' },
            ],
        },
        {
            id: 's14',
            title: '14. Recipients and sharing',
            blocks: [
                {
                    type: 'list',
                    items: [
                        'Authorised Yowyob personnel and entities or teams with a need to know.',
                        'The business or representative concerned by a Claim, contact, Review or report, to the necessary extent.',
                        'Hosting, security, email, SMS, push, mapping, payment, identity, analytics, support, backup, audit and advisory providers under appropriate duties.',
                        'Campaign or external-content partners where choice or lawful basis permits.',
                        'Authorities, courts, advisers, insurers or corporate-transaction parties where justified by law, security or legal defence.',
                    ],
                },
            ],
        },
        {
            id: 's15',
            title: '15. No sale of data and commercial limits',
            blocks: [
                { type: 'p', text: 'Yowyob does not sell BusinessBook personal contact lists to advertisers. Advertising, measurement or voluntary transmission of an enquiry to a business does not amount to handing over a raw User database.' },
                { type: 'p', text: 'Claim data, identity documents, confidential Review evidence, precise location, payment and security data are not ordinary advertising categories.' },
            ],
        },
        {
            id: 's16',
            title: '16. Mapping and location',
            blocks: [
                { type: 'p', text: 'Search may use an entered location, approximate area or precise position with device permission. Business coordinates may be geocoded and published for directions.' },
                { type: 'p', text: 'Mapping providers may receive IP, area, coordinates or query according to the integration and may act as processors or independent controllers. Users may revoke device permission; Professionals must ensure a marker does not unjustifiably reveal a home.' },
            ],
        },
        {
            id: 's17',
            title: '17. Professional analytics and statistics',
            blocks: [
                { type: 'p', text: 'Yowyob may provide Professionals with views, searches, clicks, sources, areas, periods, devices, observable conversions and trends. Statistics are aggregated or pseudonymised where possible and do not normally identify a Visitor who has not initiated contact.' },
                { type: 'p', text: 'Professionals must not attempt re-identification, abusively combine data with external sources or use analytics for unlawful discrimination.' },
            ],
        },
        {
            id: 's18',
            title: '18. Ranking, profiling and automated decisions',
            blocks: [
                { type: 'p', text: 'Automated processing may produce relevance, recommendation, completeness, abuse risk, fake-Review detection, moderation priority or campaign performance. It uses the data and signals described here.' },
                { type: 'p', text: 'Yowyob tests proportionality, quality, bias and security. Where a solely automated decision has legal or similarly significant effects, the person receives legally required information, human intervention, challenge and other safeguards.' },
            ],
        },
        {
            id: 's19',
            title: '19. Communications and marketing',
            blocks: [
                { type: 'p', text: 'Necessary messages concern security, account, Claim, Review, payment, service or legal changes. Commercial communications from Yowyob or partners rely on consent or another permitted basis, identify the sender and provide an easy objection mechanism.' },
                { type: 'p', text: 'Marketing withdrawal does not block essential messages. Preferences may be managed through the account, unsubscribe link or privacy@businessbook.cm.' },
            ],
        },
        {
            id: 's20',
            title: '20. International transfers and hosting',
            blocks: [
                { type: 'p', text: 'Data may be hosted or accessed from Cameroon or another country by Yowyob and its providers. Before transfer, Yowyob assesses requirements, destination, necessity, contractual and technical safeguards, and any required authorisation or consent.' },
                { type: 'p', text: 'Where destination protection is insufficient, Yowyob applies appropriate safeguards or limits the transfer. A business exporting data to its own provider is responsible for that transfer.' },
            ],
        },
        {
            id: 's21',
            title: '21. Data outside the Yowyob Cloud',
            blocks: [
                { type: 'p', text: 'External exports, downloads, prints, emails, copies, synchronisations, CRMs, spreadsheets, devices, clouds, backups, APIs or webhooks are controlled by the entity deciding the processing. It must inform, secure, minimise, retain only as needed, honour rights and notify incidents.' },
                { type: 'p', text: 'Yowyob does not control partner copies, devices or backups. It provides agreed assistance but is not responsible for an exclusively external incident it did not cause. Obligations follow the data after export.' },
            ],
        },
        {
            id: 's22',
            title: '22. Retention periods',
            blocks: [
                { type: 'p', text: 'Yowyob retains data for the time needed for purposes, contract, legal duties, security and defence. At expiry, data is deleted, anonymised or archived under restricted access. Litigation, fraud, legal duty or hold may extend retention.' },
                {
                    type: 'list',
                    items: [
                        'Active account: relationship period; closed account: administration, security and applicable limitation periods.',
                        'Public Listing: while the business exists, information remains relevant or a legitimate/public interest supports listing, subject to periodic review.',
                        'Claim and verification: time needed for checking, reassessment, impersonation prevention and applicable duties.',
                        'Reviews, replies and evidence: publication and dispute/defence period; confidential evidence limited to need.',
                        'Invoices and payments: statutory accounting, tax and defence periods.',
                        'Security logs: period proportionate to risks, investigations and detection.',
                        'Consent and objections: time needed to evidence and honour the choice.',
                        'Cookies: dynamic register periods without artificial renewal.',
                    ],
                },
            ],
        },
        {
            id: 's23',
            title: '23. Quality, correction and Listing review',
            blocks: [
                { type: 'p', text: 'Yowyob implements checks, update dates, reporting mechanisms and revalidation campaigns. Businesses must periodically confirm information. Correction may be temporarily delayed where a dispute requires preservation of a version or evidence.' },
                { type: 'p', text: 'Yowyob may compare sources, mark information unconfirmed, reduce display or invite reports of change.' },
            ],
        },
        {
            id: 's24',
            title: '24. Security and confidentiality',
            blocks: [
                { type: 'p', text: 'Proportionate measures include role management, authentication, logging, encryption in transit and risk-based at rest, segmentation, backups, monitoring, patching, testing, secret management, incident procedures, training and provider governance.' },
                { type: 'p', text: 'Security is shared: unique passwords, updated devices, administrator control, restricted exports and immediate reporting of compromised accounts, Badges, documents or sessions.' },
            ],
        },
        {
            id: 's25',
            title: '25. Personal-data breaches',
            blocks: [
                { type: 'p', text: 'Yowyob assesses incidents, contains spread, preserves evidence, remedies and documents decisions. Where legal conditions are met, it notifies the competent authority and affected persons within applicable periods with required information.' },
                { type: 'p', text: 'Professionals and providers must notify Yowyob without undue delay of any incident affecting BusinessBook data and cooperate with assessment, avoiding uncoordinated public statements that increase risk.' },
            ],
        },
        {
            id: 's26',
            title: '26. Data-subject rights',
            blocks: [
                { type: 'p', text: 'Depending on law and context: rights to information, access, rectification, erasure, restriction, objection, portability, consent withdrawal, applicable post-death instructions, challenge of automated decisions, and complaint to the competent authority or court.' },
                { type: 'p', text: 'Rights are not absolute. Yowyob may refuse or restrict a manifestly unfounded or excessive request, or one affecting others’ rights, secrets, security, evidence or a retention duty, while giving reasons.' },
            ],
        },
        {
            id: 's27',
            title: '27. Exercising rights and verification',
            blocks: [
                { type: 'p', text: 'Send requests to privacy@businessbook.cm or privacy@yowyob.com, identifying the account, Listing, URL, role, right and data involved. Yowyob may request proportionate identity or authority evidence and does not seek a full identity document where a less intrusive method suffices.' },
                { type: 'p', text: 'Where the business controls the requested processing, Yowyob may forward or direct the person and cooperate. Requests are logged and handled within the legal period, with available remedies explained.' },
            ],
        },
        {
            id: 's28',
            title: '28. Children and vulnerable persons',
            blocks: [
                { type: 'p', text: 'BusinessBook does not target children for professional accounts, campaigns or commercial Reviews. Minors must not post contacts, images, location or commercial experiences without appropriate supervision.' },
                { type: 'p', text: 'Yowyob may remove content, close accounts and seek a legal representative’s involvement. Businesses must avoid unlawful commercial exploitation or profiling of vulnerable persons.' },
            ],
        },
        {
            id: 's29',
            title: '29. Anonymised data, statistics and improvement',
            blocks: [
                { type: 'p', text: 'Yowyob may aggregate or anonymise data for statistics, research, planning, quality, security and service development. Truly anonymised data is no longer personal; pseudonymisation alone is insufficient.' },
                { type: 'p', text: 'Raw personal data, verification documents and private messages are not used without governance to train a general model. Any AI use must respect purpose, minimisation, security, rights, testing and contracts.' },
            ],
        },
        {
            id: 's30',
            title: '30. Changes, language and contacts',
            blocks: [
                { type: 'p', text: 'Yowyob may amend this Notice for a law, provider, architecture, feature or processing change. Material changes are signalled through the site, account, email or another appropriate means.' },
                { type: 'p', text: 'French and English versions seek the same effect; for processing mainly connected with Cameroon, French prevails in case of inconsistency, subject to mandatory law. Contacts: privacy@businessbook.cm, privacy@yowyob.com, support@yowyob.com and legal@yowyob.com.' },
            ],
        },
    ],
    annexes: [
        {
            id: 'annex-a',
            title: 'Annex A — Indicative processing matrix',
            blocks: [
                {
                    type: 'table',
                    head: ['Activity', 'Main data', 'Indicative basis', 'Recipients / period'],
                    rows: [
                        ['Account', 'Identity, contact, role, security', 'Contract; legitimate interest; legal duty', 'Yowyob/providers; relationship + duties'],
                        ['Public Listing', 'Business, professional contact, address, content', 'Legitimate interest; contract; public data', 'Public/search engines; relevance + review'],
                        ['Claim', 'Authority, identity, documents, logs', 'Contract; legitimate interest; legal duty', 'Restricted team; check + defence'],
                        ['Reviews and moderation', 'Profile, text, rating, evidence, integrity', 'Contract; legitimate interest; legal duty', 'Partial public/moderation; publication + dispute'],
                        ['Connection', 'Listing, event, chosen message', 'Request/contract; legitimate interest', 'Business/providers; need + duties'],
                        ['Campaign and analytics', 'Audience, clicks, source, conversion', 'Contract; consent/legitimate interest by use', 'Aggregated Professional/providers; campaign + measurement'],
                        ['Security', 'IP, device, logs, anomalies', 'Legitimate interest; legal duty', 'Security/authorities if required; risk + investigation'],
                    ],
                },
            ],
        },
        {
            id: 'annex-b',
            title: 'Annex B — External-export governance checklist',
            blocks: [
                {
                    type: 'table',
                    head: ['Control', 'Question to document'],
                    rows: [
                        ['Purpose', 'Why is the export necessary and compatible?'],
                        ['Owner', 'Which entity and named role control the copy?'],
                        ['Destination', 'Which device, CRM, cloud, mailbox, API or provider receives it?'],
                        ['Access', 'Who can read, edit, share or download it?'],
                        ['Security', 'Which encryption, authentication, logs and backup controls apply?'],
                        ['Retention', 'When and how will every copy and backup be deleted?'],
                        ['Rights', 'How can access, correction, objection and erasure be handled?'],
                        ['Incident', 'Who detects, escalates and notifies a breach?'],
                        ['Transfer', 'Does a cross-border transfer require safeguards or approval?'],
                    ],
                },
            ],
        },
    ],
};

export const privacyDoc: LegalDocSet = { fr, en };
