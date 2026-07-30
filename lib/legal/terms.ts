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
 * BBK-LEGAL-TOU-ENFR-1.0 — Conditions générales d’utilisation et de services.
 * Source : BusinessBook_CGU-ToU_EN-FR_Published-Beta_v1.0.docx
 */

const CODE = 'BBK-LEGAL-TOU-ENFR-1.0';

const CHANGE_FR =
    'Première version consolidée et augmentée couvrant l’annuaire, les fiches, la vérification, les avis, les promotions et les espaces professionnels.';
const CHANGE_EN =
    'First consolidated and expanded version covering the directory, listings, verification, reviews, promotions and professional areas.';

const fr: LegalDoc = {
    slug: 'terms',
    code: CODE,
    version: LEGAL_VERSION,
    status: LEGAL_STATUS.fr,
    effectiveDate: LEGAL_EFFECTIVE_DATE.fr,
    title: 'Conditions générales d’utilisation et de services',
    shortTitle: 'Conditions générales',
    subtitle: 'Conditions transversales applicables à l’annuaire BusinessBook',
    purpose: 'Ce que vous acceptez en utilisant BusinessBook, et ce dont chacun répond : Yowyob, l’entreprise inscrite et vous.',
    important: LEGAL_IMPORTANT.fr,
    highlights: [
        {
            title: 'Yowyob n’est pas partie à vos transactions',
            text: 'Devis, paiements, livraisons et prestations se concluent directement avec l’entreprise. Conservez vos contrats, factures et preuves.',
            sectionId: 's19',
        },
        {
            title: 'Un badge n’est pas un agrément',
            text: 'Il atteste un contrôle précis à une date donnée, jamais la solvabilité, la qualité ou une licence réglementaire.',
            sectionId: 's12',
        },
        {
            title: 'Les avis doivent être authentiques',
            text: 'Avis achetés, échangés, automatisés ou déposés par l’entreprise sur elle-même sont interdits et peuvent être retirés.',
            sectionId: 's13',
        },
        {
            title: 'Le service est en bêta publiée',
            text: 'Des fonctions peuvent être expérimentales, restreintes, migrées ou retirées. BusinessBook ne doit pas être votre seul registre.',
            sectionId: 's7',
        },
    ],
    lead: 'Les présentes Conditions constituent le socle contractuel commun de BusinessBook. Toute condition particulière d’abonnement, de campagne, de vérification ou de partenariat complète ce texte selon l’ordre de priorité prévu ci-dessous.',
    references: LEGAL_REFERENCES.fr,
    referencesNote: REFERENCES_NOTE.fr,
    change: CHANGE_FR,
    meta: buildMeta('fr', CODE),
    sections: [
        {
            id: 's1',
            title: '1. Identité de l’éditeur et objet',
            blocks: [
                { type: 'p', text: 'Yowyob Inc. Ltd, société à responsabilité limitée de droit camerounais, au capital social de 1 000 000 FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier sous le numéro RC/YAO/2020/B/1614, NIF M102015282478U, siège social : Carrefour Anguissa, Yaoundé, S/C Yaoundé 1er, Rue 1.121 Djoungolo, Cameroun.' },
                { type: 'p', text: 'BusinessBook est un sous-système numérique de Yowyob destiné à référencer, rechercher, comparer, vérifier et mettre en relation des entreprises, organisations, professionnels et utilisateurs, notamment au Cameroun et en Afrique. Yowyob fournit l’infrastructure d’annuaire, de confiance, de visibilité, de publication, de modération et d’analyse; l’entreprise inscrite demeure responsable de son activité réelle.' },
            ],
        },
        {
            id: 's2',
            title: '2. Définitions',
            blocks: [
                { type: 'p', text: '« Utilisateur » désigne toute personne consultant ou utilisant BusinessBook, avec ou sans compte. « Visiteur » désigne un utilisateur principalement consommateur d’informations. « Professionnel » désigne une entreprise, organisation, entrepreneur, représentant ou administrateur d’une fiche. « Fiche » désigne la page publique associée à une entreprise, un établissement, une marque, un service ou une activité. « Revendication » désigne la procédure permettant d’obtenir le contrôle autorisé d’une fiche. « Badge » désigne un indicateur de vérification, de certification interne, d’abonnement ou de statut affiché par BusinessBook. « Avis » comprend note, commentaire, photo, réponse, signalement ou preuve associée. « Contenu sponsorisé » comprend promotion, campagne, classement ou mise en avant payante. « Cloud Yowyob » désigne les environnements contrôlés ou contractés par Yowyob pour le service.' },
            ],
        },
        {
            id: 's3',
            title: '3. Acceptation, formation du contrat et hiérarchie',
            blocks: [
                { type: 'p', text: 'L’accès au site, la création d’un compte, la revendication ou modification d’une fiche, la publication d’un avis, l’achat d’une option, le lancement d’une campagne ou la poursuite d’utilisation après notification vaut acceptation dans la mesure permise par la loi.' },
                { type: 'p', text: 'Ordre de priorité : (1) droit impératif; (2) contrat ou conditions spéciales signées; (3) bon de commande, devis, formule, campagne ou règle de vérification acceptée; (4) présentes Conditions; (5) documentation et communications générales. Les pages juridiques antérieures sont remplacées pour le même objet à la date d’entrée en vigueur.' },
            ],
        },
        {
            id: 's4',
            title: '4. Éligibilité, capacité et représentation',
            blocks: [
                { type: 'p', text: 'L’utilisateur doit disposer de la capacité juridique requise. Toute personne agissant pour une entreprise garantit être autorisée à l’engager, gérer sa fiche, répondre aux avis et traiter les contacts reçus. Un mineur ne peut créer un compte professionnel, revendiquer une entreprise, acheter une campagne ou publier des données de tiers sans intervention vérifiable de son représentant légal.' },
            ],
        },
        {
            id: 's5',
            title: '5. Comptes, rôles et sécurité',
            blocks: [
                { type: 'p', text: 'Les informations d’inscription doivent être exactes, actuelles et complètes. Les identifiants sont confidentiels. L’organisation doit attribuer des rôles selon le moindre privilège, supprimer rapidement les accès des personnes parties et contrôler les journaux d’activité.' },
                { type: 'p', text: 'Yowyob peut imposer une authentification renforcée, une validation d’adresse électronique ou téléphonique, et des justificatifs d’identité, de mandat, d’immatriculation, d’adresse, de licence, de bénéficiaire effectif ou de paiement lorsque cela est nécessaire à la confiance, à la sécurité ou à la loi.' },
            ],
        },
        {
            id: 's6',
            title: '6. Rôle de Yowyob et indépendance des entreprises',
            blocks: [
                { type: 'p', text: 'Sauf offre expresse contraire, Yowyob agit comme éditeur, opérateur technique, annuaire, intermédiaire numérique, fournisseur de visibilité et environnement de confiance. Yowyob n’est pas automatiquement vendeur, prestataire, employeur, franchiseur, agent, assureur, certificateur réglementaire ou partie aux contrats conclus hors plateforme.' },
                { type: 'p', text: 'Chaque entreprise demeure seule responsable de son existence, licences, qualifications, employés, établissements, produits, prix, taxes, garanties, sécurité, disponibilité, exécution, service après-vente et obligations envers ses clients.' },
            ],
        },
        {
            id: 's7',
            title: '7. Statut Bêta publiée et évolution du service',
            blocks: [
                { type: 'p', text: 'La Bêta publiée est accessible au public tout en restant en amélioration continue. Des fonctions, catégories, badges, métriques, imports, intégrations ou interfaces peuvent être expérimentaux, restreints, modifiés, migrés ou retirés. Yowyob cherche à préserver les engagements payés ou propose une mesure appropriée lorsque le droit l’exige.' },
            ],
        },
        {
            id: 's8',
            title: '8. Consultation, recherche et résultats',
            blocks: [
                { type: 'p', text: 'La recherche peut utiliser mots-clés, catégorie, zone, distance, popularité, pertinence, disponibilité, qualité de fiche, interactions, confiance, préférences ou signaux de campagne. Les résultats ne sont ni exhaustifs ni une recommandation professionnelle personnalisée.' },
                { type: 'p', text: 'L’utilisateur doit vérifier directement les informations importantes, notamment identité, adresse, horaires, devis, prix, qualifications, assurance, disponibilité et conditions contractuelles avant toute décision.' },
            ],
        },
        {
            id: 's9',
            title: '9. Fiches créées avant revendication et sources publiques',
            blocks: [
                { type: 'p', text: 'BusinessBook peut créer ou enrichir une fiche à partir d’informations rendues publiques, de partenaires autorisés, de registres, d’un utilisateur ou de l’entreprise elle-même. Une fiche non revendiquée n’implique ni relation contractuelle ni validation de son contenu.' },
                { type: 'p', text: 'L’entreprise concernée peut demander revendication, correction, mise à jour, limitation ou retrait selon le droit applicable et l’intérêt légitime du public. Yowyob conserve les éléments nécessaires à la preuve et à la prévention des réapparitions abusives.' },
            ],
        },
        {
            id: 's10',
            title: '10. Revendication, propriété administrative et conflits',
            blocks: [
                { type: 'p', text: 'La revendication peut exiger un code, une adresse professionnelle, un domaine, un appel, un document officiel, un mandat ou une autre preuve. Le premier demandeur n’acquiert pas automatiquement un droit définitif.' },
                { type: 'p', text: 'En cas de conflit entre propriétaire, gérant, siège, succursale, franchise, marque, ancien employé ou agence, Yowyob peut suspendre les modifications, demander des pièces, partager les éléments nécessaires entre parties, rétablir une version antérieure ou refuser d’arbitrer une question de propriété complexe qui relève d’une autorité ou juridiction.' },
            ],
        },
        {
            id: 's11',
            title: '11. Exactitude, mise à jour et disponibilité',
            blocks: [
                { type: 'p', text: 'Le Professionnel doit maintenir exacts le nom, statut, adresse, contacts, horaires, catégories, descriptions, prix indicatifs, conditions, licences et médias. Il doit corriger sans délai toute information devenue trompeuse et signaler fermeture, déménagement, changement de contrôle ou usurpation.' },
                { type: 'p', text: 'Les données peuvent provenir de plusieurs sources et comporter un délai de synchronisation. Yowyob peut afficher la date de vérification ou de dernière mise à jour sans garantir que l’information demeure actuelle.' },
            ],
        },
        {
            id: 's12',
            title: '12. Badges, vérification et limites de la certification',
            blocks: [
                { type: 'p', text: 'Un badge signifie uniquement que les contrôles décrits pour ce niveau ont été réalisés à une date donnée, par exemple vérification d’un contact, d’un document ou d’une présence. Il ne garantit pas solvabilité, qualité, sécurité, conformité continue, absence de fraude, résultat commercial ou compétence réglementée.' },
                { type: 'p', text: 'L’entreprise ne doit pas présenter un badge comme agrément public, assurance Yowyob, garantie de performance ou validation absolue. Yowyob peut retirer, suspendre ou requalifier un badge après expiration, changement matériel, information contradictoire, plainte crédible ou défaut de coopération.' },
            ],
        },
        {
            id: 's13',
            title: '13. Avis, notes et authenticité',
            blocks: [
                { type: 'p', text: 'Un avis doit correspondre à une expérience réelle, identifiable par des éléments suffisants, rester pertinent, proportionné et exempt de données sensibles inutiles. Sont interdits les avis achetés, échangés, automatisés, déposés par l’entreprise sur elle-même, par un concurrent sans expérience, ou sous menace d’avantage ou de préjudice.' },
                { type: 'p', text: 'Yowyob peut demander une preuve confidentielle, appliquer un délai, limiter les avis multiples, détecter des anomalies, agréger les notes, marquer un avis, réduire sa visibilité ou le retirer. La mention « vérifié » décrit un contrôle déterminé et non la vérité absolue de chaque affirmation.' },
            ],
        },
        {
            id: 's14',
            title: '14. Droit de réponse, modération et signalement',
            blocks: [
                { type: 'p', text: 'L’entreprise peut répondre de manière professionnelle sans divulguer d’informations confidentielles sur le client. Tout utilisateur peut signaler un contenu illégal, trompeur, hors sujet, menaçant, discriminatoire, diffamatoire, contrefaisant ou révélant des données personnelles.' },
                { type: 'p', text: 'La modération tient compte du contexte, de la liberté d’expression, de l’intérêt du public, des preuves et des risques. Yowyob n’est pas tenu d’effacer une critique simplement défavorable, mais peut préserver une copie restreinte aux fins d’enquête ou de défense.' },
            ],
        },
        {
            id: 's15',
            title: '15. Contenus, photos, logos et droits',
            blocks: [
                { type: 'p', text: 'L’utilisateur conserve ses droits sur les contenus licites qu’il fournit et accorde à Yowyob une licence non exclusive, mondiale, gratuite pendant la durée nécessaire, transférable aux prestataires, pour héberger, adapter techniquement, traduire, indexer, afficher, distribuer, sauvegarder, modérer et promouvoir la fiche ou le service.' },
                { type: 'p', text: 'Le contributeur garantit disposer des droits et autorisations nécessaires sur les logos, marques, photos, personnes, locaux, musiques, textes et bases importés. Il doit éviter les documents d’identité, dossiers médicaux, informations bancaires, enfants identifiables ou images de tiers non nécessaires.' },
            ],
        },
        {
            id: 's16',
            title: '16. Promotions, offres et contenus sponsorisés',
            blocks: [
                { type: 'p', text: 'Une promotion doit préciser l’entreprise, la période, les conditions, limites de stock ou capacité, zones, exclusions, prix, taxes et mécanisme de réclamation lorsque requis. L’entreprise est responsable de l’honneur de son offre et de sa conformité publicitaire.' },
                { type: 'p', text: 'Les placements payants ou sponsorisés doivent être identifiables. Un paiement améliore une visibilité selon la formule achetée mais ne garantit aucun nombre de vues, contact, vente, classement permanent ou retour sur investissement, sauf engagement chiffré expressément accepté.' },
            ],
        },
        {
            id: 's17',
            title: '17. Classements, recommandations et systèmes automatisés',
            blocks: [
                { type: 'p', text: 'BusinessBook peut ordonner ou recommander des fiches à l’aide de règles et modèles tenant compte de pertinence, localisation, complétude, fraîcheur, qualité, activité, signaux de confiance, préférences et sponsoring. Des mesures anti-manipulation peuvent ne pas être divulguées en détail.' },
                { type: 'p', text: 'Yowyob distingue autant que possible le contenu sponsorisé des résultats organiques. Une entreprise ne peut exiger une position déterminée ni manipuler clics, notes, recherches, localisation ou engagement. Les décisions produisant un effet significatif font l’objet des garanties prévues par la loi.' },
            ],
        },
        {
            id: 's18',
            title: '18. Mise en relation et communications externes',
            blocks: [
                { type: 'p', text: 'Les boutons appel, courriel, WhatsApp, itinéraire, site web ou formulaire facilitent un contact mais peuvent ouvrir un service tiers. Dès transmission à l’entreprise ou au tiers, leurs propres conditions et traitements s’appliquent.' },
                { type: 'p', text: 'L’utilisateur doit vérifier le destinataire et ne transmettre que les données nécessaires. Les entreprises ne doivent pas utiliser les coordonnées reçues pour du démarchage sans base légale, revendre les prospects, constituer des listes non annoncées ou contacter une personne au-delà de sa demande raisonnable.' },
            ],
        },
        {
            id: 's19',
            title: '19. Transactions conclues hors BusinessBook',
            blocks: [
                { type: 'p', text: 'Les négociations, devis, réservations, paiements, livraisons et prestations conclus directement entre utilisateurs et entreprises ne lient pas Yowyob, sauf service explicitement fourni par Yowyob. Les parties doivent conserver leurs contrats, factures, preuves et garanties.' },
                { type: 'p', text: 'BusinessBook ne détient pas nécessairement les fonds, ne contrôle pas la prestation et n’est pas responsable d’une fraude ou d’un dommage exclusivement imputable à une partie indépendante. Yowyob peut toutefois coopérer à une enquête et appliquer des mesures de plateforme.' },
            ],
        },
        {
            id: 's20',
            title: '20. Formules, paiements et renouvellements',
            blocks: [
                { type: 'p', text: 'Certaines fonctions peuvent être gratuites, payantes, à l’essai, subventionnées ou tarifées selon fiche, établissement, utilisateur, campagne, volume, durée ou audience. Les prix, taxes, période, renouvellement, limites, moyens de paiement et remboursement sont ceux affichés ou contractés au moment de la commande.' },
                { type: 'p', text: 'Le Professionnel autorise les prélèvements expressément acceptés et doit maintenir des coordonnées de facturation exactes. Une fonctionnalité payante peut être suspendue en cas d’impayé, fraude, opposition abusive ou expiration, sans effacer automatiquement la fiche publique lorsque sa conservation est licite.' },
            ],
        },
        {
            id: 's21',
            title: '21. Utilisations interdites',
            blocks: [
                { type: 'p', text: 'Il est interdit notamment de créer une fausse entreprise; usurper un représentant; acheter ou vendre des avis; publier des contenus illégaux ou dangereux; harceler; collecter massivement les données; contourner les limites; extraire la base; envoyer du spam; introduire du code malveillant; attaquer le service; manipuler classement ou analytics; reproduire l’interface; ou utiliser BusinessBook pour discrimination illicite, fraude ou violation de droits.' },
            ],
        },
        {
            id: 's22',
            title: '22. Extraction, robots, IA et réutilisation des données',
            blocks: [
                { type: 'p', text: 'L’indexation par moteurs autorisés peut être permise selon les directives techniques. Toute extraction systématique, reconstitution de base, surveillance concurrentielle automatisée, entraînement de modèles, enrichissement de courtiers, republication commerciale ou création d’un annuaire substitut nécessite une autorisation écrite, sauf droit impératif.' },
                { type: 'p', text: 'Les extraits ponctuels licites doivent respecter attribution, droits, confidentialité, limites techniques et finalité. Les robots ne doivent pas ignorer les contrôles, simuler des utilisateurs ni dégrader le service.' },
            ],
        },
        {
            id: 's23',
            title: '23. Signalements, enquêtes et coopération',
            blocks: [
                { type: 'p', text: 'Les signalements doivent identifier la fiche ou le contenu, les motifs, droits invoqués et preuves disponibles. Une déclaration mensongère ou abusive peut entraîner des mesures. Yowyob peut contacter les parties, geler une fonctionnalité, demander des pièces, préserver des journaux, corriger, déréférencer, suspendre ou transmettre aux autorités lorsque requis.' },
            ],
        },
        {
            id: 's24',
            title: '24. Propriété intellectuelle de Yowyob',
            blocks: [
                { type: 'p', text: 'Les logiciels, architectures, interfaces, marques, logos, taxonomies, sélections, bases, modèles, textes et graphismes Yowyob sont protégés. L’utilisateur reçoit seulement un droit limité, révocable, non exclusif et non transférable d’utiliser le service selon les présentes Conditions.' },
                { type: 'p', text: 'Il est interdit de décompiler au-delà des exceptions légales, supprimer les mentions, déposer un signe confusant, copier substantiellement l’apparence ou exploiter les retours comme preuve de partenariat. Les suggestions peuvent être utilisées sans obligation de rémunération, sans divulguer d’informations confidentielles.' },
            ],
        },
        {
            id: 's25',
            title: '25. Indexation publique, caches et archivage',
            blocks: [
                { type: 'p', text: 'Une fiche publique, un avis ou une promotion peut être indexé, mis en cache, partagé ou archivé par des tiers hors du contrôle de Yowyob. Une correction ou suppression sur BusinessBook ne provoque pas nécessairement une disparition immédiate des moteurs, navigateurs, réseaux sociaux ou archives.' },
                { type: 'p', text: 'Yowyob applique les balises et demandes raisonnables sous son contrôle. Le demandeur peut devoir contacter séparément un tiers qui conserve une copie indépendante.' },
            ],
        },
        {
            id: 's26',
            title: '26. Données hors du Cloud Yowyob',
            blocks: [
                { type: 'p', text: 'Toute donnée exportée, téléchargée, imprimée, copiée, synchronisée, envoyée par courriel, API ou webhook, enregistrée dans un CRM, tableur, terminal, cloud, sauvegarde ou système partenaire hors du Cloud Yowyob relève de la personne ou organisation qui décide ce traitement externe.' },
                { type: 'p', text: 'Elle doit assurer base légale, transparence, sécurité, accès, chiffrement approprié, exactitude, conservation, suppression, droits, sous-traitants et notification des incidents. Yowyob n’est pas responsable d’un incident exclusivement externe qu’il n’a pas causé; l’export ne supprime ni les droits des personnes ni les obligations liées aux données.' },
            ],
        },
        {
            id: 's27',
            title: '27. Confidentialité, données personnelles et sécurité',
            blocks: [
                { type: 'p', text: 'Chaque partie protège les informations non publiques reçues et limite l’accès aux personnes qui en ont besoin. Les traitements sont détaillés dans l’Avis de confidentialité. Une entreprise recevant une demande ou un prospect agit généralement comme responsable indépendant pour sa réponse et ses traitements ultérieurs.' },
                { type: 'p', text: 'Aucun système n’est invulnérable. Les utilisateurs doivent protéger appareils et identifiants, vérifier les destinataires, limiter les exports, appliquer les mises à jour et signaler rapidement toute compromission à support@yowyob.com et privacy@yowyob.com.' },
            ],
        },
        {
            id: 's28',
            title: '28. Preuve électronique et journaux',
            blocks: [
                { type: 'p', text: 'Sous réserve du droit applicable, comptes, validations, versions de fiche, documents de revendication, horodatages, adresses IP, messages, avis, réponses, signalements, clics, commandes, paiements, consentements et journaux peuvent constituer des éléments de preuve. Ils sont appréciés selon leur intégrité, provenance et contexte.' },
                { type: 'p', text: 'Toute contestation doit être formulée promptement avec les éléments disponibles. Yowyob peut conserver sous restriction ce qui est nécessaire à la prévention de fraude ou à l’établissement, exercice ou défense de droits.' },
            ],
        },
        {
            id: 's29',
            title: '29. Suspension, restriction et clôture',
            blocks: [
                { type: 'p', text: 'Yowyob peut avertir, limiter, déréférencer, suspendre ou clôturer un compte, une fiche, un badge, un avis, une campagne ou une fonctionnalité en cas de violation, risque, impayé, usurpation, plainte crédible, ordre légal, inactivité prolongée ou nécessité technique. En urgence, la mesure peut précéder l’explication.' },
                { type: 'p', text: 'L’utilisateur peut fermer son compte sous réserve des opérations, preuves, obligations et intérêts légitimes en cours. La fermeture d’un compte professionnel ne garantit pas le retrait d’informations professionnelles licitement publiques ou d’avis d’utilisateurs.' },
            ],
        },
        {
            id: 's30',
            title: '30. Disponibilité, sauvegarde et continuité',
            blocks: [
                { type: 'p', text: 'Yowyob vise une disponibilité raisonnable sans garantir un fonctionnement continu, sans erreur, universel ou compatible avec tout terminal. Maintenance, réseau, hébergeur, carte, messagerie, cyberattaque, surcharge ou événement extérieur peuvent perturber le service.' },
                { type: 'p', text: 'Les Professionnels doivent conserver leurs documents sources, contrats, contenus essentiels et preuves de paiement. La Bêta publiée ne doit pas être l’unique registre légal ou opérationnel d’une entreprise.' },
            ],
        },
        {
            id: 's31',
            title: '31. Garanties et responsabilité',
            blocks: [
                { type: 'p', text: 'Dans les limites de la loi, le service est fourni selon sa disponibilité et les engagements expressément acceptés. Yowyob ne garantit pas l’identité, la solvabilité, la conformité continue, la qualité, la disponibilité, la sécurité ou le résultat de chaque entreprise, avis, offre ou transaction indépendante.' },
                { type: 'p', text: 'Chaque partie répond des dommages directs prévisibles causés par sa faute. Les exclusions ou plafonds ne s’appliquent pas lorsqu’ils sont interdits, notamment en cas de dol, faute lourde, atteinte corporelle ou obligation impérative. Les pertes indirectes, perte d’opportunité, de clientèle ou de données externes ne sont indemnisables que lorsque la loi ou un accord le prévoit.' },
            ],
        },
        {
            id: 's32',
            title: '32. Indemnisation professionnelle',
            blocks: [
                { type: 'p', text: 'Dans la mesure permise, le Professionnel garantit Yowyob contre les réclamations de tiers découlant de son activité, d’une fiche trompeuse, d’un contenu sans droits, d’une fausse promotion, d’un avis manipulé, d’un traitement illicite de prospects, d’une absence de licence ou d’une violation des présentes Conditions. Yowyob informe et permet une défense raisonnable; aucun accord ne peut imposer d’obligation non consentie à Yowyob.' },
            ],
        },
        {
            id: 's33',
            title: '33. Force majeure, droit applicable et différends',
            blocks: [
                { type: 'p', text: 'Aucune partie n’est responsable d’un retard dû à un événement raisonnablement hors de son contrôle, sous réserve d’atténuation et d’information. Les Conditions sont régies par le droit camerounais, sans priver un consommateur des protections impératives de son pays.' },
                { type: 'p', text: 'Les parties recherchent d’abord une résolution amiable écrite. À défaut, la juridiction matériellement et territorialement compétente est saisie; toute clause spéciale de médiation ou d’arbitrage valablement acceptée demeure applicable.' },
            ],
        },
        {
            id: 's34',
            title: '34. Modifications, langue et contacts',
            blocks: [
                { type: 'p', text: 'Yowyob peut modifier les Conditions pour refléter la loi, les risques, l’architecture, les services ou les modèles économiques. Les changements importants sont notifiés de manière appropriée et ne réduisent pas rétroactivement un droit acquis sans base valable.' },
                { type: 'p', text: 'Les versions française et anglaise visent le même effet. Pour les opérations principalement camerounaises, la version française prévaut en cas de divergence, sous réserve du droit impératif. Questions : legal@businessbook.cm ou legal@yowyob.com; vie privée : privacy@businessbook.cm ou privacy@yowyob.com; sécurité : support@yowyob.com.' },
            ],
        },
    ],
    annexes: [
        {
            id: 'annex-a',
            title: 'Annexe A — Matrice indicative des responsabilités',
            blocks: [
                {
                    type: 'table',
                    head: ['Acteur', 'Responsabilités principales', 'Limites / contrôles'],
                    rows: [
                        ['Yowyob', 'Infrastructure, sécurité sous son contrôle, règles, modération, transparence, droits et support.', 'Ne remplace pas les contrôles réglementaires propres à l’entreprise.'],
                        ['Entreprise / Professionnel', 'Exactitude, licences, contenus, promotions, services, réponses, prospects et obligations clients.', 'Doit documenter son mandat et corriger rapidement.'],
                        ['Visiteur / Auteur d’avis', 'Usage licite, avis authentique, vérification avant transaction, données minimales.', 'Ne doit pas manipuler, harceler ou publier de données sensibles.'],
                        ['Prestataire technique', 'Traitement selon contrat, confidentialité, sécurité et assistance.', 'Accès limité au besoin et contrôlé.'],
                        ['Tiers de contact ou carte', 'Service externe selon ses propres conditions.', 'Yowyob ne contrôle pas les traitements indépendants après redirection.'],
                    ],
                },
            ],
        },
        {
            id: 'annex-b',
            title: 'Annexe B — Niveaux indicatifs de confiance',
            blocks: [
                {
                    type: 'table',
                    head: ['Indicateur', 'Signification possible', 'Ne signifie pas'],
                    rows: [
                        ['Fiche non revendiquée', 'Information publique ou fournie par un tiers, non administrée par un représentant vérifié.', 'Validation par l’entreprise ou Yowyob.'],
                        ['Fiche revendiquée', 'Contrôle administratif accordé après une procédure déterminée.', 'Propriété absolue, qualité ou licence.'],
                        ['Contact vérifié', 'Téléphone, email ou domaine contrôlé lors du test.', 'Identité complète ou solvabilité.'],
                        ['Document vérifié', 'Document déterminé examiné à une date donnée.', 'Authenticité éternelle ou agrément public.'],
                        ['Entreprise certifiée BusinessBook', 'Critères internes publiés satisfaits au moment du contrôle.', 'Garantie de prestation, assurance ou absence de fraude.'],
                        ['Sponsorisé', 'Visibilité payée ou campagne active.', 'Supériorité objective ou recommandation neutre.'],
                    ],
                },
            ],
        },
    ],
};

const en: LegalDoc = {
    slug: 'terms',
    code: CODE,
    version: LEGAL_VERSION,
    status: LEGAL_STATUS.en,
    effectiveDate: LEGAL_EFFECTIVE_DATE.en,
    title: 'Terms of Use and Services',
    shortTitle: 'Terms of Use',
    subtitle: 'Cross-platform terms applicable to the BusinessBook directory',
    purpose: 'What you accept by using BusinessBook, and who answers for what: Yowyob, the listed business and you.',
    important: LEGAL_IMPORTANT.en,
    highlights: [
        {
            title: 'Yowyob is not a party to your transactions',
            text: 'Quotations, payments, deliveries and services are concluded directly with the business. Keep your contracts, invoices and evidence.',
            sectionId: 's19',
        },
        {
            title: 'A Badge is not an accreditation',
            text: 'It evidences a defined check at a given date — never solvency, quality or a regulatory licence.',
            sectionId: 's12',
        },
        {
            title: 'Reviews must be genuine',
            text: 'Purchased, exchanged, automated or self-authored Reviews are prohibited and may be removed.',
            sectionId: 's13',
        },
        {
            title: 'The service is a published beta',
            text: 'Functions may be experimental, restricted, migrated or withdrawn. BusinessBook must not be your only register.',
            sectionId: 's7',
        },
    ],
    lead: 'These Terms form the common contractual basis of BusinessBook. Specific subscription, campaign, verification or partnership terms supplement them according to the priority order below.',
    references: LEGAL_REFERENCES.en,
    referencesNote: REFERENCES_NOTE.en,
    change: CHANGE_EN,
    meta: buildMeta('en', CODE),
    sections: [
        {
            id: 's1',
            title: '1. Publisher identity and purpose',
            blocks: [
                { type: 'p', text: 'Yowyob Inc. Ltd, a limited liability company incorporated under Cameroonian law, with share capital of XAF 1,000,000, registered with the Trade and Personal Property Credit Register under number RC/YAO/2020/B/1614, Tax Identification Number M102015282478U, registered office at Carrefour Anguissa, Yaoundé, S/C Yaoundé 1er, Rue 1.121 Djoungolo, Cameroon.' },
                { type: 'p', text: 'BusinessBook is a Yowyob digital subsystem designed to list, search, compare, verify and connect businesses, organisations, professionals and users, particularly in Cameroon and Africa. Yowyob provides directory, trust, visibility, publishing, moderation and analytics infrastructure; each listed business remains responsible for its real-world activity.' },
            ],
        },
        {
            id: 's2',
            title: '2. Definitions',
            blocks: [
                { type: 'p', text: '“User” means any person consulting or using BusinessBook, with or without an account. “Visitor” means a User mainly consuming information. “Professional” means a business, organisation, entrepreneur, representative or listing administrator. “Listing” means a public page associated with a business, establishment, brand, service or activity. “Claim” means the process for obtaining authorised control of a Listing. “Badge” means a BusinessBook verification, internal certification, subscription or status indicator. “Review” includes a rating, comment, photograph, reply, report or related evidence. “Sponsored Content” includes a promotion, campaign, paid ranking or visibility boost. “Yowyob Cloud” means environments controlled or contracted by Yowyob for the service.' },
            ],
        },
        {
            id: 's3',
            title: '3. Acceptance, contract formation and hierarchy',
            blocks: [
                { type: 'p', text: 'Accessing the site, creating an account, claiming or editing a Listing, posting a Review, purchasing an option, launching a campaign or continuing use after notice constitutes acceptance to the extent permitted by law.' },
                { type: 'p', text: 'Priority order: (1) mandatory law; (2) signed contract or special terms; (3) accepted order, quotation, plan, campaign or verification rule; (4) these Terms; and (5) general documentation and communications. Earlier legal pages are superseded for the same subject matter from the effective date.' },
            ],
        },
        {
            id: 's4',
            title: '4. Eligibility, capacity and authority',
            blocks: [
                { type: 'p', text: 'The User must have the required legal capacity. A person acting for a business represents that they are authorised to bind it, manage its Listing, reply to Reviews and process received contacts. A minor may not create a professional account, claim a business, purchase a campaign or publish third-party data without verifiable involvement of a legal representative.' },
            ],
        },
        {
            id: 's5',
            title: '5. Accounts, roles and security',
            blocks: [
                { type: 'p', text: 'Registration data must be accurate, current and complete. Credentials are confidential. Organisations must assign least-privilege roles, promptly remove former personnel and monitor activity logs.' },
                { type: 'p', text: 'Yowyob may require stronger authentication, email or telephone validation, and evidence of identity, authority, registration, address, licence, beneficial ownership or payment when needed for trust, security or law.' },
            ],
        },
        {
            id: 's6',
            title: '6. Yowyob’s role and business independence',
            blocks: [
                { type: 'p', text: 'Unless an offer expressly states otherwise, Yowyob acts as publisher, technical operator, directory, digital intermediary, visibility provider and trust environment. Yowyob is not automatically the seller, service provider, employer, franchisor, agent, insurer, regulatory certifier or party to off-platform contracts.' },
                { type: 'p', text: 'Each business remains solely responsible for its existence, licences, qualifications, personnel, premises, products, prices, taxes, warranties, safety, availability, performance, after-sales service and customer obligations.' },
            ],
        },
        {
            id: 's7',
            title: '7. Published Beta status and service evolution',
            blocks: [
                { type: 'p', text: 'The Published Beta is publicly accessible while under continuous improvement. Functions, categories, badges, metrics, imports, integrations or interfaces may be experimental, restricted, changed, migrated or withdrawn. Yowyob seeks to preserve paid commitments or provides an appropriate measure where required by law.' },
            ],
        },
        {
            id: 's8',
            title: '8. Browsing, search and results',
            blocks: [
                { type: 'p', text: 'Search may use keywords, category, area, distance, popularity, relevance, availability, listing quality, interactions, trust, preferences or campaign signals. Results are not exhaustive and are not personalised professional advice.' },
                { type: 'p', text: 'Users must directly verify material information, including identity, address, opening hours, quotation, price, qualifications, insurance, availability and contract terms before making a decision.' },
            ],
        },
        {
            id: 's9',
            title: '9. Pre-claim listings and public sources',
            blocks: [
                { type: 'p', text: 'BusinessBook may create or enrich a Listing from lawfully public information, authorised partners, registers, a User or the business itself. An unclaimed Listing does not imply a contract or validation of its content.' },
                { type: 'p', text: 'The concerned business may request a claim, correction, update, restriction or removal subject to applicable law and the public’s legitimate interest. Yowyob may retain evidence required to prevent fraud and abusive re-publication.' },
            ],
        },
        {
            id: 's10',
            title: '10. Claims, administrative control and disputes',
            blocks: [
                { type: 'p', text: 'A claim may require a code, business address, domain, call, official document, mandate or other evidence. The first applicant does not automatically acquire permanent control.' },
                { type: 'p', text: 'In a dispute among an owner, manager, head office, branch, franchise, brand, former employee or agency, Yowyob may freeze edits, request documents, share necessary material between parties, restore a prior version or decline to determine a complex ownership matter requiring an authority or court.' },
            ],
        },
        {
            id: 's11',
            title: '11. Accuracy, updating and availability',
            blocks: [
                { type: 'p', text: 'Professionals must keep name, status, address, contacts, opening hours, categories, descriptions, indicative prices, terms, licences and media accurate. They must promptly correct misleading information and report closure, relocation, control changes or impersonation.' },
                { type: 'p', text: 'Data may come from several sources and have synchronisation delays. Yowyob may show a verification or update date without guaranteeing that the information remains current.' },
            ],
        },
        {
            id: 's12',
            title: '12. Badges, verification and certification limits',
            blocks: [
                { type: 'p', text: 'A Badge means only that the checks described for that level were completed at a given date, such as verification of a contact, document or presence. It does not guarantee solvency, quality, safety, ongoing compliance, absence of fraud, commercial outcome or regulated competence.' },
                { type: 'p', text: 'A business must not present a Badge as public accreditation, Yowyob insurance, performance guarantee or absolute approval. Yowyob may remove, suspend or reclassify a Badge following expiry, material change, contradictory information, a credible complaint or failure to cooperate.' },
            ],
        },
        {
            id: 's13',
            title: '13. Reviews, ratings and authenticity',
            blocks: [
                { type: 'p', text: 'A Review must relate to a genuine experience supported by sufficient context, remain relevant and proportionate, and avoid unnecessary sensitive data. Purchased, exchanged, automated, self-authored, competitor Reviews without genuine experience, or Reviews obtained through threats or benefits are prohibited.' },
                { type: 'p', text: 'Yowyob may request confidential evidence, apply a delay, limit duplicates, detect anomalies, aggregate ratings, label, reduce visibility or remove a Review. A “verified” label describes a defined check, not the absolute truth of every statement.' },
            ],
        },
        {
            id: 's14',
            title: '14. Right of reply, moderation and reporting',
            blocks: [
                { type: 'p', text: 'A business may reply professionally without disclosing confidential customer information. Users may report unlawful, misleading, irrelevant, threatening, discriminatory, defamatory, infringing or privacy-invasive content.' },
                { type: 'p', text: 'Moderation considers context, expression, public interest, evidence and risk. Yowyob need not remove criticism merely because it is unfavourable, but may preserve a restricted copy for investigation or legal defence.' },
            ],
        },
        {
            id: 's15',
            title: '15. Content, photographs, logos and rights',
            blocks: [
                { type: 'p', text: 'Users retain rights in lawful content they provide and grant Yowyob a non-exclusive, worldwide, royalty-free licence for the necessary period, transferable to processors, to host, technically adapt, translate, index, display, distribute, back up, moderate and promote the Listing or service.' },
                { type: 'p', text: 'Contributors warrant that they hold the required rights and permissions for logos, marks, photographs, persons, premises, music, text and imported databases. Identity documents, medical records, banking information, identifiable children and unnecessary third-party images must not be posted.' },
            ],
        },
        {
            id: 's16',
            title: '16. Promotions, offers and sponsored content',
            blocks: [
                { type: 'p', text: 'A Promotion must state the business, period, conditions, stock or capacity limits, areas, exclusions, prices, taxes and complaint mechanism where required. The business is responsible for honouring the offer and complying with advertising law.' },
                { type: 'p', text: 'Paid or sponsored placement must be identifiable. Payment improves visibility according to the purchased plan but does not guarantee a number of views, contacts, sales, permanent rank or return on investment unless expressly quantified.' },
            ],
        },
        {
            id: 's17',
            title: '17. Rankings, recommendations and automated systems',
            blocks: [
                { type: 'p', text: 'BusinessBook may rank or recommend Listings using rules and models considering relevance, location, completeness, freshness, quality, activity, trust signals, preferences and sponsorship. Anti-manipulation measures may remain partly confidential.' },
                { type: 'p', text: 'Yowyob seeks to distinguish sponsored from organic results. A business cannot demand a particular position or manipulate clicks, ratings, searches, location or engagement. Decisions producing significant effects receive safeguards required by law.' },
            ],
        },
        {
            id: 's18',
            title: '18. Connections and external communications',
            blocks: [
                { type: 'p', text: 'Call, email, WhatsApp, directions, website and form buttons facilitate contact but may open a third-party service. Once data reaches a business or third party, its own terms and processing apply.' },
                { type: 'p', text: 'Users must verify recipients and send only necessary data. Businesses must not use received details for marketing without a lawful basis, resell leads, build undisclosed lists or contact a person beyond the reasonable scope of their request.' },
            ],
        },
        {
            id: 's19',
            title: '19. Transactions concluded outside BusinessBook',
            blocks: [
                { type: 'p', text: 'Negotiations, quotations, bookings, payments, deliveries and services concluded directly between Users and businesses do not bind Yowyob unless Yowyob expressly provides the service. Parties must retain contracts, invoices, evidence and warranties.' },
                { type: 'p', text: 'BusinessBook may not hold funds or control performance and is not responsible for fraud or harm exclusively attributable to an independent party. Yowyob may nevertheless cooperate with investigations and apply platform measures.' },
            ],
        },
        {
            id: 's20',
            title: '20. Plans, payments and renewals',
            blocks: [
                { type: 'p', text: 'Functions may be free, paid, trial-based, subsidised or priced by Listing, establishment, User, campaign, volume, duration or audience. Prices, taxes, period, renewal, limits, payment methods and refunds are those displayed or contracted at order time.' },
                { type: 'p', text: 'Professionals authorise expressly accepted charges and must maintain accurate billing details. A paid function may be suspended for non-payment, fraud, abusive chargeback or expiry without automatically deleting a lawful public Listing.' },
            ],
        },
        {
            id: 's21',
            title: '21. Prohibited uses',
            blocks: [
                { type: 'p', text: 'Prohibited conduct includes creating a fake business; impersonating a representative; buying or selling Reviews; posting unlawful or dangerous content; harassment; mass data collection; bypassing limits; database extraction; spam; malware; attacks; manipulating rank or analytics; copying the interface; or using BusinessBook for unlawful discrimination, fraud or rights violations.' },
            ],
        },
        {
            id: 's22',
            title: '22. Scraping, robots, AI and data reuse',
            blocks: [
                { type: 'p', text: 'Indexing by authorised search engines may be allowed under technical directives. Systematic extraction, database reconstruction, automated competitive monitoring, model training, data-broker enrichment, commercial republication or creation of a substitute directory requires written permission unless mandatory law provides otherwise.' },
                { type: 'p', text: 'Lawful isolated extracts must respect attribution, rights, confidentiality, technical limits and purpose. Robots must not evade controls, simulate Users or degrade the service.' },
            ],
        },
        {
            id: 's23',
            title: '23. Reports, investigations and cooperation',
            blocks: [
                { type: 'p', text: 'Reports should identify the Listing or content, reasons, asserted rights and available evidence. False or abusive notices may lead to action. Yowyob may contact parties, freeze a function, request evidence, preserve logs, correct, delist, suspend or report to authorities where required.' },
            ],
        },
        {
            id: 's24',
            title: '24. Yowyob intellectual property',
            blocks: [
                { type: 'p', text: 'Yowyob software, architecture, interfaces, marks, logos, taxonomies, selections, databases, models, texts and graphics are protected. Users receive only a limited, revocable, non-exclusive and non-transferable right to use the service under these Terms.' },
                { type: 'p', text: 'Users may not decompile beyond legal exceptions, remove notices, register confusing signs, substantially copy appearance or treat feedback as evidence of partnership. Suggestions may be used without payment obligation while preserving confidential information.' },
            ],
        },
        {
            id: 's25',
            title: '25. Public indexing, caches and archives',
            blocks: [
                { type: 'p', text: 'A public Listing, Review or Promotion may be indexed, cached, shared or archived by third parties outside Yowyob’s control. Correction or deletion on BusinessBook may not immediately remove search-engine, browser, social-media or archival copies.' },
                { type: 'p', text: 'Yowyob applies reasonable tags and requests within its control. A requester may need to contact a third party holding an independent copy.' },
            ],
        },
        {
            id: 's26',
            title: '26. Data outside the Yowyob Cloud',
            blocks: [
                { type: 'p', text: 'Data exported, downloaded, printed, copied, synchronised, emailed, sent by API or webhook, or stored in a CRM, spreadsheet, device, cloud, backup or partner system outside the Yowyob Cloud is controlled by the person or organisation deciding that external processing.' },
                { type: 'p', text: 'That party must ensure lawful basis, transparency, security, access control, appropriate encryption, accuracy, retention, deletion, rights handling, processor governance and incident notification. Yowyob is not liable for an exclusively external incident it did not cause; export does not remove data-subject rights or obligations.' },
            ],
        },
        {
            id: 's27',
            title: '27. Confidentiality, personal data and security',
            blocks: [
                { type: 'p', text: 'Each party protects non-public information received and limits access to persons with a need to know. Processing is described in the Privacy Notice. A business receiving an enquiry or lead generally acts as an independent controller for its response and subsequent processing.' },
                { type: 'p', text: 'No system is invulnerable. Users must secure devices and credentials, verify recipients, restrict exports, install updates and promptly report compromise to support@yowyob.com and privacy@yowyob.com.' },
            ],
        },
        {
            id: 's28',
            title: '28. Electronic evidence and logs',
            blocks: [
                { type: 'p', text: 'Subject to law, accounts, confirmations, Listing versions, claim documents, timestamps, IP addresses, messages, Reviews, replies, reports, clicks, orders, payments, consents and logs may constitute evidence and are assessed with integrity, provenance and context.' },
                { type: 'p', text: 'Challenges should be raised promptly with available material. Yowyob may retain restricted evidence needed for fraud prevention or to establish, exercise or defend rights.' },
            ],
        },
        {
            id: 's29',
            title: '29. Suspension, restriction and closure',
            blocks: [
                { type: 'p', text: 'Yowyob may warn, limit, delist, suspend or close an account, Listing, Badge, Review, campaign or function for breach, risk, non-payment, impersonation, credible complaint, legal order, prolonged inactivity or technical necessity. In urgent cases, action may precede explanation.' },
                { type: 'p', text: 'Users may close accounts subject to ongoing operations, evidence, duties and legitimate interests. Closing a professional account does not guarantee removal of lawfully public business information or User Reviews.' },
            ],
        },
        {
            id: 's30',
            title: '30. Availability, backups and continuity',
            blocks: [
                { type: 'p', text: 'Yowyob seeks reasonable availability without guaranteeing continuous, error-free, universal or device-compatible operation. Maintenance, networks, hosting, mapping, messaging, cyberattacks, overload or external events may disrupt service.' },
                { type: 'p', text: 'Professionals must retain source documents, contracts, essential content and payment evidence. The Published Beta must not be the sole legal or operational register of a business.' },
            ],
        },
        {
            id: 's31',
            title: '31. Warranties and liability',
            blocks: [
                { type: 'p', text: 'Within legal limits, the service is provided subject to availability and expressly accepted commitments. Yowyob does not guarantee the identity, solvency, ongoing compliance, quality, availability, safety or outcome of every business, Review, offer or independent transaction.' },
                { type: 'p', text: 'Each party is liable for foreseeable direct harm caused by its fault. Exclusions or caps do not apply where prohibited, including fraud, gross negligence, bodily injury or mandatory duty. Indirect loss, lost opportunity, clientele or externally stored data is recoverable only where law or agreement so provides.' },
            ],
        },
        {
            id: 's32',
            title: '32. Professional indemnity',
            blocks: [
                { type: 'p', text: 'To the extent permitted, Professionals indemnify Yowyob against third-party claims arising from their activity, misleading Listing, unauthorised content, false Promotion, manipulated Review, unlawful lead processing, missing licence or breach of these Terms. Yowyob gives notice and a reasonable defence opportunity; no settlement may impose an unapproved obligation on Yowyob.' },
            ],
        },
        {
            id: 's33',
            title: '33. Force majeure, governing law and disputes',
            blocks: [
                { type: 'p', text: 'Neither party is liable for delay caused by an event reasonably beyond its control, subject to mitigation and notice. These Terms are governed by Cameroonian law without depriving consumers of mandatory protection in their country.' },
                { type: 'p', text: 'Parties first seek written amicable resolution. Failing resolution, the court with subject-matter and territorial jurisdiction may be seized; any validly accepted special mediation or arbitration clause remains effective.' },
            ],
        },
        {
            id: 's34',
            title: '34. Changes, language and contacts',
            blocks: [
                { type: 'p', text: 'Yowyob may amend the Terms to reflect law, risks, architecture, services or business models. Material changes are appropriately notified and do not retroactively reduce an acquired right without valid basis.' },
                { type: 'p', text: 'French and English versions seek the same effect. For operations mainly connected with Cameroon, French prevails in case of inconsistency, subject to mandatory law. Questions: legal@businessbook.cm or legal@yowyob.com; privacy: privacy@businessbook.cm or privacy@yowyob.com; security: support@yowyob.com.' },
            ],
        },
    ],
    annexes: [
        {
            id: 'annex-a',
            title: 'Annex A — Indicative responsibility matrix',
            blocks: [
                {
                    type: 'table',
                    head: ['Actor', 'Main responsibilities', 'Limits / controls'],
                    rows: [
                        ['Yowyob', 'Infrastructure, security under its control, rules, moderation, transparency, rights and support.', 'Does not replace business-specific regulatory checks.'],
                        ['Business / Professional', 'Accuracy, licences, content, promotions, services, replies, leads and customer duties.', 'Must evidence authority and promptly correct information.'],
                        ['Visitor / Reviewer', 'Lawful use, authentic Reviews, verification before transactions, minimum data.', 'Must not manipulate, harass or post sensitive data.'],
                        ['Technical provider', 'Processing under contract, confidentiality, security and assistance.', 'Need-based and controlled access.'],
                        ['Contact or map third party', 'External service under its own terms.', 'Yowyob does not control independent processing after redirection.'],
                    ],
                },
            ],
        },
        {
            id: 'annex-b',
            title: 'Annex B — Indicative trust levels',
            blocks: [
                {
                    type: 'table',
                    head: ['Indicator', 'Possible meaning', 'Does not mean'],
                    rows: [
                        ['Unclaimed Listing', 'Public or third-party data, not administered by a verified representative.', 'Approval by the business or Yowyob.'],
                        ['Claimed Listing', 'Administrative control granted after a defined process.', 'Absolute ownership, quality or licence.'],
                        ['Verified contact', 'Telephone, email or domain controlled at testing time.', 'Complete identity or solvency.'],
                        ['Verified document', 'A defined document reviewed at a given date.', 'Permanent authenticity or public accreditation.'],
                        ['BusinessBook certified business', 'Published internal criteria met at review time.', 'Service guarantee, insurance or absence of fraud.'],
                        ['Sponsored', 'Paid visibility or active campaign.', 'Objective superiority or neutral recommendation.'],
                    ],
                },
            ],
        },
    ],
};

export const termsDoc: LegalDocSet = { fr, en };
