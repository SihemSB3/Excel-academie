// Helper d'envoi d'emails transactionnels via Brevo (préfixe _ = pas un endpoint).
// Utilisé par le webhook Stripe pour la confirmation d'annulation d'abonnement.
//
// Variable d'environnement Netlify nécessaire :
//   BREVO_API_KEY   la clé API Brevo (Brevo > SMTP & API > Clés API)
// L'expéditeur contact@lartdudigital.fr doit être un expéditeur validé dans Brevo.

// Liens du cross-sell : à adapter avec les vraies pages produit.
const LIEN_ABONNEMENT = 'https://excelacademie.netlify.app'
const LIEN_EBOOK_EXCEL = 'https://lartdudigital.fr'
const LIEN_EBOOK_SHAOLIN = 'https://lartdudigital.fr'

const templateAnnulation = ({ prenom, dateFin }) => `<!doctype html>
<html lang="fr"><body style="margin:0;background:#EDE6D6;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Ta résiliation est confirmée. Tu gardes l'accès jusqu'au ${dateFin}, et les portes de l'Académie restent ouvertes.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;padding:32px 16px;"><tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;border-collapse:collapse;">
    <tr><td style="background:#0A335D;border-radius:20px 20px 0 0;padding:26px 32px;">
      <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7FE3C8;font-weight:700;">L'Art du Digital</p>
      <p style="margin:4px 0 0;font-size:26px;line-height:1;letter-spacing:1px;text-transform:uppercase;color:#FFFFFF;font-weight:800;">Excel Académie <span style="font-weight:400;">🥋</span></p>
    </td></tr>
    <tr><td style="background:#FFFDF8;padding:36px 32px 8px;">
      <h1 style="margin:0 0 6px;font-size:24px;line-height:1.25;color:#0A335D;font-weight:800;">Ta résiliation est bien confirmée</h1>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#3A4B60;">Bonjour <strong style="color:#0A335D;">${prenom}</strong>,</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:22px;"><tr>
        <td style="background:#F0FAF6;border-left:4px solid #2EBF9A;border-radius:12px;padding:16px 18px;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#1F5E52;font-style:italic;">« Le Shifu respecte ta décision, ${prenom || 'élève'}. L'Académie ne ferme jamais ses portes : quand tu voudras reprendre l'entraînement, elle sera là. »</p>
        </td></tr></table>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#3A4B60;">Ton abonnement mensuel est arrêté. Voici ce que ça change :</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;font-size:15px;line-height:1.5;color:#0A335D;"><span style="color:#2EBF9A;font-weight:800;">✓</span>&nbsp;&nbsp;Tu gardes l'accès complet jusqu'au <strong>${dateFin}</strong>.</td></tr>
        <tr><td style="padding:8px 0;font-size:15px;line-height:1.5;color:#0A335D;border-top:1px solid #EFE9DC;"><span style="color:#2EBF9A;font-weight:800;">✓</span>&nbsp;&nbsp;Plus aucun prélèvement ne sera effectué.</td></tr>
        <tr><td style="padding:8px 0;font-size:15px;line-height:1.5;color:#0A335D;border-top:1px solid #EFE9DC;"><span style="color:#2EBF9A;font-weight:800;">✓</span>&nbsp;&nbsp;Ta progression et tes ceintures restent enregistrées.</td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:10px;"><tr>
        <td style="background:#2EBF9A;border-radius:999px;"><a href="${LIEN_ABONNEMENT}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:800;color:#08243F;text-decoration:none;">Revenir à l'Académie</a></td>
      </tr></table>
      <p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:#8A8371;">Tu peux reprendre un abonnement, ou passer à l'accès à vie, quand tu le souhaites.</p>
    </td></tr>
    <tr><td style="background:#FFFDF8;padding:14px 32px 34px;">
      <p style="margin:26px 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C2691F;font-weight:800;">En attendant, continue ta progression</p>
      <div style="height:2px;background:#F0E6D2;border-radius:2px;margin-bottom:18px;"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px;"><tr>
        <td style="background:#FBF6EC;border:1px solid #EFE3CD;border-radius:14px;padding:16px 18px;">
          <p style="margin:0 0 3px;font-size:16px;font-weight:800;color:#0A335D;">Accès à vie — 129 €</p>
          <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#5A6472;">Les 13 chapitres, les 91 exercices et les guides PDF. Un seul paiement, à toi pour toujours.</p>
          <a href="${LIEN_ABONNEMENT}" style="font-size:14px;font-weight:800;color:#178A72;text-decoration:none;">Débloquer à vie&nbsp;›</a>
        </td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px;"><tr>
        <td style="background:#FBF6EC;border:1px solid #EFE3CD;border-radius:14px;padding:16px 18px;">
          <p style="margin:0 0 3px;font-size:16px;font-weight:800;color:#0A335D;">Ton Guide Excel — 50 €</p>
          <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#5A6472;">Le manuel complet à garder sous la main, formule par formule.</p>
          <a href="${LIEN_EBOOK_EXCEL}" style="font-size:14px;font-weight:800;color:#178A72;text-decoration:none;">Découvrir l'ebook&nbsp;›</a>
        </td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px;"><tr>
        <td style="background:#FBF6EC;border:1px solid #EFE3CD;border-radius:14px;padding:16px 18px;">
          <p style="margin:0 0 3px;font-size:16px;font-weight:800;color:#0A335D;">La méthode Shaolin — 30 €</p>
          <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#5A6472;">Apprendre à apprendre, avec la discipline du kung-fu. L'ebook qui change ta façon de progresser.</p>
          <a href="${LIEN_EBOOK_SHAOLIN}" style="font-size:14px;font-weight:800;color:#178A72;text-decoration:none;">Lire un extrait&nbsp;›</a>
        </td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>
        <td style="background:#0A335D;border-radius:14px;padding:16px 18px;">
          <p style="margin:0 0 3px;font-size:16px;font-weight:800;color:#FFFFFF;">Un site internet + tunnel de vente</p>
          <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#B9CBE0;">Tu veux vendre en ligne, toi aussi ? Je crée ton site et ton tunnel de vente, clé en main. Sur devis.</p>
          <a href="mailto:contact@lartdudigital.fr" style="font-size:14px;font-weight:800;color:#7FE3C8;text-decoration:none;">Demander un devis&nbsp;›</a>
        </td></tr></table>
    </td></tr>
    <tr><td style="background:#0A335D;border-radius:0 0 20px 20px;padding:24px 32px;">
      <p style="margin:0;font-size:14px;font-weight:800;color:#FFFFFF;">L'équipe l'Art du Digital</p>
      <p style="margin:4px 0 0;font-size:13px;"><a href="https://lartdudigital.fr" style="color:#7FE3C8;font-weight:700;text-decoration:none;">lartdudigital.fr</a></p>
      <p style="margin:14px 0 0;font-size:11px;line-height:1.5;color:#8FA6C0;">Tu reçois cet email suite à la résiliation de ton abonnement Excel Académie. Ton accès reste ouvert jusqu'au ${dateFin}.</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`

// Envoie l'email de confirmation d'annulation. Silencieux si la clé Brevo manque.
export async function envoyerEmailAnnulation({ to, prenom, dateFin }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey || !to) return
  const reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: "L'Art du Digital", email: 'contact@lartdudigital.fr' },
      to: [{ email: to }],
      subject: 'Ta résiliation Excel Académie est confirmée',
      htmlContent: templateAnnulation({ prenom: prenom || '', dateFin: dateFin || '' }),
    }),
  })
  if (!reponse.ok) throw new Error(`Brevo ${reponse.status} : ${await reponse.text()}`)
}
