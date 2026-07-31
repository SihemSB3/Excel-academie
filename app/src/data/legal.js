// Contenu des pages légales, affichées comme écrans de l'app (voir Legal.jsx).
// Source unique : ne pas dupliquer ailleurs. HTML de confiance (aucune saisie
// utilisateur), rendu via dangerouslySetInnerHTML dans un conteneur stylé.

export const PAGES_LEGALES = {
  cgv: {
    titre: 'Conditions Générales de Vente',
    html: `
      <h2>Article 1 — Identification du vendeur</h2>
      <p>Les produits sont édités et vendus par <strong>L'ART DU DIGITAL</strong>, SASU au capital de 100 €.</p>
      <ul>
        <li>Siège social : 7 Avenue Maximilien de Robespierre, 94400 Vitry-sur-Seine</li>
        <li>RCS 999 164 726 R.C.S. Créteil — SIRET 999 164 726 00013</li>
        <li>N° TVA intracommunautaire : FR93 999 164 726</li>
        <li>Présidente : Sihem Bidhi</li>
        <li>Contact : <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a></li>
      </ul>

      <h2>Article 2 — Objet et champ d'application</h2>
      <p>Les présentes Conditions Générales de Vente (« CGV ») régissent les ventes de produits et services numériques réalisées par L'Art du Digital auprès de tout client agissant en qualité de consommateur (le « Client »). Toute commande implique l'acceptation pleine et entière des présentes CGV. Elles prévalent sur tout autre document. L'Art du Digital se réserve le droit de les modifier ; les CGV applicables sont celles en vigueur à la date de la commande.</p>

      <h2>Article 3 — Produits et services</h2>
      <p>L'Art du Digital propose des produits numériques :</p>
      <ul>
        <li><strong>Excel Académie</strong> — application de formation à Excel, en <strong>abonnement mensuel</strong> ou en <strong>accès à vie</strong> (paiement unique). Un accès gratuit (chapitres 1 et 2) est proposé sans paiement.</li>
        <li><strong>Ebooks</strong> au format numérique (PDF).</li>
      </ul>
      <p>Les caractéristiques essentielles de chaque produit sont décrites sur les pages de vente correspondantes.</p>

      <h2>Article 4 — Prix</h2>
      <p>Les prix sont indiqués en euros <strong>toutes taxes comprises (TTC)</strong>, TVA française (20 %) incluse.</p>
      <table>
        <tr><th>Produit</th><th>Prix TTC</th></tr>
        <tr><td>Excel Académie — accès à vie</td><td>129 €</td></tr>
        <tr><td>Excel Académie — abonnement mensuel</td><td>19,90 € / mois</td></tr>
        <tr><td>Ebooks</td><td>Prix indiqué sur chaque page produit</td></tr>
      </table>
      <p>L'Art du Digital se réserve le droit de modifier ses prix. Les produits sont facturés au tarif en vigueur au moment de la commande. Tout changement de prix de l'abonnement est notifié avant application et n'affecte pas les échéances déjà payées.</p>

      <h2>Article 5 — Commande</h2>
      <p>La commande s'effectue en ligne : le Client sélectionne son produit, utilise ou crée son compte, et valide son paiement. La validation vaut acceptation des CGV et du prix. Un email de confirmation (reçu ou facture) est adressé après paiement.</p>

      <h2>Article 6 — Paiement</h2>
      <p>Le paiement s'effectue en ligne par carte bancaire via notre prestataire sécurisé <strong>Stripe</strong>. Un paiement fractionné peut être proposé selon les moyens disponibles, soumis aux conditions du prestataire concerné. Les données de paiement ne sont ni traitées ni conservées par L'Art du Digital. Le contenu est débloqué après encaissement effectif. En cas de défaut de paiement d'une échéance d'abonnement, l'accès peut être suspendu.</p>

      <h2>Article 7 — Accès et livraison du contenu numérique</h2>
      <p>Les produits étant numériques, la mise à disposition est immédiate : l'accès à Excel Académie est activé sur le compte du Client dès le paiement ; les ebooks sont mis à disposition en téléchargement immédiatement après le paiement. Le Client est responsable de l'exactitude des informations fournies.</p>

      <h2>Article 8 — Durée, renouvellement et résiliation de l'abonnement</h2>
      <p>L'abonnement mensuel est conclu pour un mois, reconduit tacitement chaque mois par prélèvement automatique tant que le Client ne l'a pas résilié. Le Client peut <strong>résilier à tout moment</strong>, sans frais, depuis son espace « Mon compte ». La résiliation met fin aux prélèvements futurs et <strong>maintient l'accès jusqu'au terme de la période déjà payée</strong>, sans remboursement au prorata. L'accès à vie n'est pas un abonnement et n'a pas à être résilié.</p>

      <h2>Article 9 — Droit de rétractation</h2>
      <p>Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose en principe d'un délai de 14 jours pour se rétracter. Toutefois, en application de l'article <strong>L221-28 13°</strong>, ce droit ne peut être exercé pour un contenu numérique fourni sans support matériel dont l'exécution a commencé après accord préalable exprès du Client et renoncement exprès à son droit de rétractation. En validant sa commande et en accédant immédiatement au contenu, le Client <strong>demande expressément l'exécution immédiate</strong> et <strong>reconnaît perdre son droit de rétractation</strong> dès cet accès.</p>

      <h2>Article 10 — Garantie de conformité</h2>
      <p>Le contenu numérique bénéficie de la garantie légale de conformité (articles L224-25-1 et suivants du Code de la consommation). En cas de non-conformité, le Client peut contacter <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>.</p>

      <h2>Article 11 — Responsabilité</h2>
      <p>Excel Académie et les ebooks sont des outils d'entraînement et de formation. L'Art du Digital fournit un contenu soigné, sans garantir un résultat individuel précis. L'accès en ligne peut être momentanément interrompu pour maintenance ou pour une cause extérieure, sans engager la responsabilité de L'Art du Digital.</p>

      <h2>Article 12 — Propriété intellectuelle</h2>
      <p>L'ensemble des contenus (textes, exercices, ebooks, marque, logo, design) est la propriété exclusive de L'Art du Digital. L'achat confère un droit d'usage <strong>strictement personnel et non transférable</strong>. Toute reproduction, partage, revente ou diffusion est interdite et constitue une contrefaçon.</p>

      <h2>Article 13 — Données personnelles</h2>
      <p>Les données personnelles sont traitées conformément au RGPD. Le Client dispose de droits d'accès, de rectification, d'effacement et d'opposition, à exercer à <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>. Détails dans la Politique de confidentialité.</p>

      <h2>Article 14 — Service client et réclamations</h2>
      <p>Pour toute question ou réclamation : <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>.</p>

      <h2>Article 15 — Médiation de la consommation</h2>
      <p>Conformément aux articles L612-1 et suivants du Code de la consommation, le Client consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige, après réclamation écrite auprès de L'Art du Digital. Médiateur compétent : <strong>[nom, adresse et site du médiateur à indiquer]</strong>. Plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a>.</p>

      <h2>Article 16 — Droit applicable et litiges</h2>
      <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité ; à défaut, les tribunaux français sont compétents dans les conditions prévues par le Code de la consommation.</p>
    `,
  },

  confidentialite: {
    titre: 'Politique de confidentialité',
    html: `
      <h2>1. Responsable du traitement</h2>
      <p><strong>L'ART DU DIGITAL</strong>, SASU au capital de 100 €, siège : 7 Avenue Maximilien de Robespierre, 94400 Vitry-sur-Seine — RCS 999 164 726 R.C.S. Créteil. Contact : <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>. Aucun DPO n'est désigné à ce jour.</p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons uniquement les données nécessaires :</p>
      <table>
        <tr><th>Donnée</th><th>Pourquoi</th></tr>
        <tr><td>Prénom, nom</td><td>Personnaliser le compte, permettre le suivi par un formateur (offre pro)</td></tr>
        <tr><td>Adresse email</td><td>Connexion, envoi des reçus/factures, communication liée au service</td></tr>
        <tr><td>Mot de passe</td><td>Authentification (stocké chiffré, jamais en clair)</td></tr>
        <tr><td>Progression (chapitres, quiz, temps)</td><td>Sauvegarder et afficher votre avancement</td></tr>
        <tr><td>Données de paiement</td><td>Traitées directement par Stripe, jamais conservées par nous</td></tr>
      </table>
      <p>Aucune donnée sensible n'est collectée.</p>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Fourniture du service (compte, accès, suivi) : exécution du contrat.</li>
        <li>Gestion des paiements et abonnements : exécution du contrat.</li>
        <li>Émission des reçus/factures et comptabilité : obligation légale.</li>
        <li>Emails liés au service : exécution du contrat.</li>
        <li>Communication commerciale éventuelle : consentement, avec désinscription possible à tout moment.</li>
      </ul>

      <h2>4. Destinataires et sous-traitants</h2>
      <p>Vos données sont traitées par des prestataires techniques agissant pour notre compte :</p>
      <table>
        <tr><th>Prestataire</th><th>Rôle</th><th>Lieu de traitement</th></tr>
        <tr><td>Supabase</td><td>Base de données, comptes, stockage des guides PDF</td><td>Royaume-Uni (Londres)</td></tr>
        <tr><td>Stripe</td><td>Paiements et facturation</td><td>Irlande et États-Unis</td></tr>
        <tr><td>Netlify</td><td>Hébergement de l'application</td><td>États-Unis</td></tr>
        <tr><td>Brevo</td><td>Envoi des emails</td><td>France</td></tr>
      </table>
      <p>Les transferts hors Union européenne sont encadrés : par la <strong>décision d'adéquation</strong> de la Commission européenne en faveur du Royaume-Uni pour Supabase, et par des garanties appropriées (Data Privacy Framework ou clauses contractuelles types) pour les prestataires établis aux États-Unis.</p>
      <p>Les polices de caractères et l'ensemble des ressources de l'application sont servies depuis nos propres serveurs : <strong>aucune donnée n'est transmise à un service tiers lors du simple chargement des pages</strong>. Nous ne vendons ni ne louons vos données.</p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>Compte et progression : tant que le compte est actif. Vous pouvez le supprimer vous-même à tout moment depuis « Mon compte ».</li>
        <li>Données de facturation : 10 ans (obligations comptables).</li>
        <li>Données de prospection éventuelles : 3 ans après le dernier contact.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité.</p>
      <p><strong>Effacement :</strong> vous pouvez supprimer votre compte vous-même, immédiatement et sans passer par nous, depuis l'écran « Mon compte ». La suppression efface votre compte, votre progression et vos résultats. Seules vos factures sont conservées, pendant 10 ans, comme la loi comptable l'impose.</p>
      <p>Pour les autres droits, écrivez à <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>. Vous pouvez introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).</p>

      <h2>7. Cookies</h2>
      <p>Le site et l'application utilisent des cookies strictement nécessaires au fonctionnement (session de connexion). L'ajout de cookies de mesure d'audience ou publicitaires ferait l'objet d'un bandeau de consentement dédié.</p>

      <h2>8. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables (chiffrement des mots de passe, paiements externalisés à un prestataire certifié, accès restreint).</p>

      <h2>9. Contact</h2>
      <p>Pour toute question : <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>.</p>
    `,
  },

  mentions: {
    titre: 'Mentions légales',
    html: `
      <h2>Éditeur</h2>
      <p>Le site et l'application Excel Académie sont édités par <strong>L'ART DU DIGITAL</strong>, SASU au capital de 100 €.</p>
      <ul>
        <li>Siège social : 7 Avenue Maximilien de Robespierre, 94400 Vitry-sur-Seine</li>
        <li>RCS 999 164 726 R.C.S. Créteil — SIRET 999 164 726 00013</li>
        <li>N° TVA intracommunautaire : FR93 999 164 726</li>
        <li>Directrice de la publication : Sihem Bidhi, présidente</li>
        <li>Contact : <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a></li>
      </ul>

      <h2>Hébergement</h2>
      <p>Application Excel Académie : <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis. Base de données, authentification et stockage des guides : <strong>Supabase</strong>, données hébergées au <strong>Royaume-Uni</strong> (Londres). Le site lartdudigital.fr est hébergé par <strong>Hostinger</strong>.</p>

      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble du site et de l'application (contenus, textes, exercices, ebooks, marque, logo, design) est la propriété exclusive de L'Art du Digital et protégé par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est interdite.</p>

      <h2>Données personnelles</h2>
      <p>Le traitement des données personnelles est décrit dans la Politique de confidentialité, accessible depuis le pied de page.</p>

      <h2>Contact</h2>
      <p>Pour toute question : <a href="mailto:contact@lartdudigital.fr">contact@lartdudigital.fr</a>.</p>
    `,
  },
}
