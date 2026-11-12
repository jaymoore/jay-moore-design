// Concept sample: a hand-built HTML email for a fictional organization.
// Shown in an iframe and as source on /work/email-samples. Keep the two identical.
export const NEWSLETTER_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>The Larkspur Bulletin, November</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  /* Concept sample. Fictional organization. Image paths are relative for this
     preview; a production send uses absolute https URLs on the sending platform. */
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; display: block; }
  a { color: #1b3a4b; }

  /* Mobile: stack the two story columns, widen padding-sensitive cells. */
  @media only screen and (max-width: 599px) {
    .container { width: 100% !important; }
    .stack { display: block !important; width: 100% !important; max-width: 100% !important; margin-left: 0 !important; }
    .stack-pad { padding: 0 0 24px 0 !important; }
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .fluid { width: 100% !important; height: auto !important; }
    .h1 { font-size: 28px !important; line-height: 34px !important; }
  }

  /* Dark mode: clients that honor prefers-color-scheme get a tuned palette. */
  @media (prefers-color-scheme: dark) {
    .bg-page { background-color: #0f1b22 !important; }
    .bg-card { background-color: #16262f !important; }
    .t-ink { color: #e8eef0 !important; }
    .t-soft { color: #c9d4d9 !important; }
    .t-link { color: #f2b33d !important; }
  }
  [data-ogsc] .bg-card { background-color: #16262f !important; }
  [data-ogsc] .t-ink { color: #e8eef0 !important; }
  [data-ogsc] .t-soft { color: #c9d4d9 !important; }
</style>
</head>
<body class="bg-page" style="margin:0; padding:0; background-color:#f7f3ea;">

<!-- Preheader: shows in the inbox preview line, hidden in the body. -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f7f3ea; opacity:0;">
  Why recovery is a research question, a look inside the community lab, and how to take part in a study.
  &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:#f7f3ea;">
<tr>
<td align="center" style="padding:24px 0;">

<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px; max-width:600px;">

<!-- LOCKED: brand bar -->
<tr>
<td data-region="locked" data-label="Brand bar" style="height:6px; line-height:6px; font-size:6px; background-color:#f2b33d;">&nbsp;</td>
</tr>

<!-- LOCKED: header. Live-text wordmark so the brand survives images-off. -->
<tr>
<td data-region="locked" data-label="Brand bar + header" class="px" style="background-color:#1b3a4b; padding:24px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
  <td style="font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:16px; font-weight:bold; letter-spacing:3px; color:#ffffff; text-transform:uppercase;">
    Larkspur Institute
  </td>
  <td align="right" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:16px; color:#f2b33d;">
    The Bulletin &middot; November
  </td>
  </tr>
  </table>
</td>
</tr>

<!-- EDITABLE: hero image -->
<tr>
<td data-region="editable" data-label="Hero image" style="background-color:#1b3a4b;">
  <img src="/email-samples/hero.png" width="600" height="280" alt="Illustration: a marigold sun rising over a deep blue horizon." class="fluid" style="width:600px; max-width:100%; height:auto;">
</td>
</tr>

<!-- EDITABLE: headline + lead story -->
<tr>
<td data-region="editable" data-label="Headline + lead story" class="bg-card px" style="background-color:#ffffff; padding:40px 40px 8px 40px;">
  <p class="t-soft" style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:16px; letter-spacing:2px; text-transform:uppercase; color:#4a5a63;">Feature</p>
  <h1 class="h1 t-ink" style="margin:0 0 16px 0; font-family:Georgia, 'Times New Roman', serif; font-size:34px; line-height:40px; font-weight:normal; color:#1d2422;">Recovery is a research question</h1>
  <p class="t-soft" style="margin:0 0 16px 0; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:26px; color:#4a5a63;">
    Our sleep and stress team spends most of its time on a question that sounds simple: what helps people bounce back? This month they explain how a study gets designed, who reviews it, and why the first step is always listening to the people it is meant to help.
  </p>
</td>
</tr>

<!-- EDITABLE: primary CTA. Bulletproof button: VML for Outlook, padded link everywhere else. -->
<tr>
<td data-region="editable" data-label="Primary CTA" class="bg-card px" align="left" style="background-color:#ffffff; padding:8px 40px 40px 40px;">
  <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://larkspur.example/bulletin/recovery" style="height:48px; v-text-anchor:middle; width:220px;" arcsize="10%" stroke="f" fillcolor="#f2b33d">
  <w:anchorlock/>
  <center style="color:#1b3a4b; font-family:Arial, sans-serif; font-size:16px; font-weight:bold;">Read the feature</center>
  </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-->
  <a href="https://larkspur.example/bulletin/recovery" style="display:inline-block; background-color:#f2b33d; color:#1b3a4b; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:48px; font-weight:bold; text-decoration:none; padding:0 28px; border-radius:4px; mso-hide:all;">Read the feature</a>
  <!--<![endif]-->
</td>
</tr>

<!-- EDITABLE: story blocks. Two columns on desktop, stacked under 600px. -->
<tr>
<td data-region="editable" data-label="Story blocks" class="bg-card px" style="background-color:#ffffff; padding:0 40px 16px 40px; border-top:1px solid #e6e0d2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
  <td height="32" style="font-size:32px; line-height:32px;">&nbsp;</td>
  </tr>
  <tr>
  <td style="font-size:0; line-height:0;"><!-- font-size:0 removes inline-block whitespace so the gap is exactly 20px, matching the Outlook spacer. -->
  <!--[if mso]><table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"><tr><td width="250" valign="top"><![endif]-->
  <div class="stack" style="display:inline-block; width:250px; vertical-align:top;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td class="stack-pad" style="padding:0 0 16px 0;">
      <img src="/email-samples/story-lab.png" width="250" height="161" alt="Illustration: a grid of lab benches with one highlighted in marigold." class="fluid" style="width:250px; max-width:100%; height:auto;">
      <h2 class="t-ink" style="margin:16px 0 8px 0; font-family:Georgia, 'Times New Roman', serif; font-size:21px; line-height:26px; font-weight:normal; color:#1d2422;">Inside the community lab</h2>
      <p class="t-soft" style="margin:0 0 12px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:23px; color:#4a5a63;">A walk through the new space, from the waiting room to the bench, and the people who run it.</p>
      <a class="t-link" href="https://larkspur.example/bulletin/lab" style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:23px; font-weight:bold; color:#1b3a4b;">Take the tour</a>
    </td></tr>
    </table>
  </div>
  <!--[if mso]></td><td width="20"></td><td width="250" valign="top"><![endif]-->
  <div class="stack" style="display:inline-block; width:250px; vertical-align:top; margin-left:20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td class="stack-pad" style="padding:0 0 16px 0;">
      <img src="/email-samples/story-study.png" width="250" height="161" alt="Illustration: rows of dots with a few highlighted in marigold." class="fluid" style="width:250px; max-width:100%; height:auto;">
      <h2 class="t-ink" style="margin:16px 0 8px 0; font-family:Georgia, 'Times New Roman', serif; font-size:21px; line-height:26px; font-weight:normal; color:#1d2422;">Who can join a study</h2>
      <p class="t-soft" style="margin:0 0 12px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:23px; color:#4a5a63;">What taking part involves, how your information is protected, and how to ask questions first.</p>
      <a class="t-link" href="https://larkspur.example/studies" style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:23px; font-weight:bold; color:#1b3a4b;">See open studies</a>
    </td></tr>
    </table>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  </td>
  </tr>
  </table>
</td>
</tr>

<!-- EDITABLE: event callout -->
<tr>
<td data-region="editable" data-label="Event callout" class="px" style="background-color:#1b3a4b; padding:32px 40px;">
  <p style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:16px; letter-spacing:2px; text-transform:uppercase; color:#f2b33d;">Save the date</p>
  <p style="margin:0 0 8px 0; font-family:Georgia, 'Times New Roman', serif; font-size:24px; line-height:30px; color:#ffffff;">Open Lab Day</p>
  <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:23px; color:#ffffff;">Saturday, March 13, 10 am to 2 pm. Meet the researchers, see the lab, bring your questions. <a href="https://larkspur.example/open-lab" style="color:#f2b33d; font-weight:bold;">RSVP</a></p>
</td>
</tr>

<!-- LOCKED: footer. Legal, address, unsubscribe. -->
<tr>
<td data-region="locked" data-label="Footer" class="px" style="padding:32px 40px;">
  <p class="t-soft" style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#4a5a63;">
    Larkspur Institute for Health Research &middot; 100 Example Way, Anytown
  </p>
  <p class="t-soft" style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#4a5a63;">
    You are receiving this because you subscribed to the Bulletin.
    <a class="t-link" href="https://larkspur.example/preferences" style="color:#1b3a4b;">Email preferences</a> &middot;
    <a class="t-link" href="https://larkspur.example/unsubscribe" style="color:#1b3a4b;">Unsubscribe</a>
  </p>
  <p class="t-soft" style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#4a5a63;">
    Concept sample by Jay Moore. Fictional organization.
  </p>
</td>
</tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->

</td>
</tr>
</table>
</body>
</html>
`;
