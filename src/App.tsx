// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://corocoodowuwktyjygin.supabase.co",
  "sb_publishable_EGtulsTAfpETwlR-4Ldplg_-ysE2XMb"
);

const LOGO_URL = "https://althikr.edu.sa/wp-content/uploads/2025/03/DASC_Horizontal-Logo-EN-250x82-1.png";
const API_URL = `${window.location.origin}/api/generate`;

const parseSection = (text, tag) => {
  const re = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, "i");
  const m = text.match(re);
  return m ? m[1].trim() : "";
};

const mdToHtml = (text) => {
  if (!text) return "";
  return text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/^#### (.+)$/gm,"<h4>$1</h4>")
    .replace(/^### (.+)$/gm,"<h3>$1</h3>")
    .replace(/^## (.+)$/gm,"<h2>$1</h2>")
    .replace(/^# (.+)$/gm,"<h1>$1</h1>")
    .replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*([^*\n]+?)\*/g,"<em>$1</em>")
    .replace(/^✔ (.+)$/gm,"<li style='list-style:none'>✔ $1</li>")
    .replace(/^✓ (.+)$/gm,"<li style='list-style:none'>✓ $1</li>")
    .replace(/^[•\-] (.+)$/gm,"<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm,"<li>$1</li>")
    .replace(/^---+$/gm,"<hr/>")
    .replace(/\n{2,}/g,"</p><p>")
    .replace(/\n/g,"<br/>");
};

const makeDASCWord = (fields, sections, isAr=false) => {
  const {subject,grade,cls,unit,lesson,week,topic,instructor,date} = fields;
  const dir = isAr ? "rtl" : "ltr";
  const ff  = isAr ? "'Arial Unicode MS',Arial,sans-serif" : "Calibri,Arial,sans-serif";
  const s   = (tag) => mdToHtml(sections[tag] || "");
  const td  = `border:1pt solid #999;padding:5pt 6pt;vertical-align:top;font-size:10pt;`;
  const hd  = `${td}background:#1a6b42;color:white;font-weight:bold;font-size:9pt;`;
  const sm  = `${td}font-size:9pt;`;

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office'
  xmlns:w='urn:schemas-microsoft-com:office:word'
  xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${topic||"Lesson Plan"}</title>
<style>
  body{font-family:${ff};font-size:10.5pt;color:#111;line-height:1.65;direction:${dir};margin:.8cm 1cm;}
  table{width:100%;border-collapse:collapse;font-size:10pt;}
  td,th{border:1pt solid #999;padding:5pt 6pt;vertical-align:top;}
  p{margin:3pt 0;}ul,ol{margin:3pt 0 3pt 14pt;padding:0;}li{margin:2pt 0;}
  strong{font-weight:bold;}em{font-style:italic;}h3,h4{margin:5pt 0 3pt;font-weight:bold;}
  .title{font-size:13pt;font-weight:bold;color:#1a6b42;text-align:center;
         border-bottom:2pt solid #1a6b42;padding-bottom:5pt;margin-bottom:8pt;}
  .hdr{background:#1a6b42;color:white;font-weight:bold;font-size:9pt;padding:4pt 6pt;}
  .sm{font-size:9pt;}
  .ft{font-size:8pt;color:#666;text-align:center;margin-top:8pt;padding-top:5pt;border-top:1pt solid #ccc;}
</style></head>
<body>

<p class='title'>Lesson Plan adapting the 5Es and Students&#x2019; Centered Approach</p>
<p><strong>Course:</strong> ${subject||""} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Instructor:</strong> ${instructor||""}</p>
<br/>

<table>
  <!-- Row 1: Date / Grade / Class -->
  <tr>
    <td style='${td}width:34%;'><strong>Date:</strong> ${date||new Date().toLocaleDateString()}</td>
    <td style='${td}width:33%;'><strong>Grade:</strong> ${grade||""}</td>
    <td style='${td}width:33%;'><strong>Class:</strong> ${cls||""}</td>
  </tr>

  <!-- Row 2: Unit / Lesson / Topic / Week -->
  <tr>
    <td colspan='3' style='${td}'>
      <strong>Unit:</strong> ${unit||""} &nbsp;&nbsp;&nbsp;
      <strong>Lesson:</strong> ${lesson||""} &nbsp;&nbsp;&nbsp;
      <strong>Topic:</strong> ${topic||""} &nbsp;&nbsp;&nbsp;
      <strong>Week:</strong> ${week||""}
    </td>
  </tr>

  <!-- Row 3: Nested 7-column lesson body -->
  <tr>
    <td colspan='3' style='padding:0;border:1pt solid #999;'>
      <table style='width:100%;border-collapse:collapse;'>

        <!-- Standards row: full width -->
        <tr>
          <td colspan='7' style='${td}'>
            <p><strong><em>Standards:</em></strong> By the end of this lesson, students will be able to:</p>
            <p>${s("STANDARDS")}</p>
          </td>
        </tr>

        <!-- Beginning / Middle / End header row -->
        <tr>
          <td style='${hd}width:3%;'>Beginning</td>
          <td style='${sm}width:3%;'>Engage,<br/>Explore</td>
          <td colspan='2' style='${hd}width:6%;'><em>Middle</em> &nbsp; Explain, Elaborate</td>
          <td style='${td}width:2%;'></td>
          <td colspan='2' style='${hd}width:6%;'><em>End</em> &nbsp; Evaluate</td>
        </tr>

        <!-- Section label row -->
        <tr>
          <td style='${sm}width:22%;'>
            <strong>Introduction</strong><br/>
            <em>Hook, Learning Intentions, Success Criteria, Prior Learning, Vocabulary</em>
          </td>
          <td style='${sm}width:18%;'>
            <strong>Presentation</strong><br/>
            <em>Explicit Skill &amp;/or Strategy Teaching</em>
          </td>
          <td colspan='2' style='${sm}width:20%;'>
            <strong>Guided Practice</strong><br/>
            <em>Small Group/Individual: quality task, monitored by teacher</em>
          </td>
          <td style='${sm}width:18%;'>
            <strong>Independent Practice</strong><br/>
            <em>Monitored by teacher, teaching at point of need</em>
          </td>
          <td colspan='2' style='${sm}width:22%;'>
            <strong>Review</strong><br/>
            <em>Connection back to Learning Intentions &amp; Success Criteria</em>
          </td>
        </tr>

        <!-- CONTENT row: all sections side by side -->
        <tr>

          <!-- Column 1: Introduction -->
          <td style='${td}width:22%;'>
            <p><strong>Hook (Engage):</strong></p>
            <p>${s("HOOK")}</p>
            <br/>
            <p><strong>Learning Intentions:</strong></p>
            <p>${s("LEARNING_INTENTIONS")}</p>
            <br/>
            <p><strong>Success Criteria:</strong></p>
            <p>${s("SUCCESS_CRITERIA")}</p>
            <br/>
            <p><strong>Prior Learning:</strong></p>
            <p>${s("PRIOR_LEARNING")}</p>
            <br/>
            <p><strong>Key Vocabulary (pre-teach with student-friendly definitions):</strong></p>
            <p>${s("VOCABULARY")}</p>
            <br/>
            <p><strong>Transition:</strong></p>
            <p>${s("TRANSITION")}</p>
          </td>

          <!-- Column 2: Presentation -->
          <td style='${td}width:18%;'>
            <p><strong>Presentation (Explain)</strong></p>
            <p>${s("PRESENTATION")}</p>
          </td>

          <!-- Column 3: Guided Practice -->
          <td colspan='2' style='${td}width:20%;'>
            <p><strong>Guided Practice (Elaborate)</strong></p>
            <p>${s("GUIDED_PRACTICE")}</p>
          </td>

          <!-- Column 4: Independent Practice + Assessment + Differentiation -->
          <td style='${td}width:18%;'>
            <p><strong>Independent Practice, Assessment &amp; Differentiation</strong></p>
            <p>${s("INDEPENDENT_PRACTICE")}</p>
            <br/>
            <p><strong>Extension (early finishers):</strong></p>
            <p>${s("EXTENSION")}</p>
            <br/>
            <p><strong>Assessment</strong></p>
            <p><strong>Formal:</strong> ${s("FORMAL_ASSESSMENT")}</p>
            <br/>
            <p><strong>Informal:</strong> ${s("INFORMAL_ASSESSMENT")}</p>
            <br/>
            <p><strong>Differentiation</strong></p>
            <p><strong>Support:</strong> ${s("SUPPORT")}</p>
            <br/>
            <p><strong>Challenge:</strong> ${s("CHALLENGE")}</p>
          </td>

          <!-- Column 5: Review + Closure -->
          <td colspan='2' style='${td}width:22%;'>
            <p><strong>Review (Evaluate)</strong></p>
            <p><strong>Connection back to Learning Intentions:</strong></p>
            <p>${s("REVIEW")}</p>
            <br/>
            <p><strong>Exit Ticket:</strong></p>
            <p>${s("EXIT_TICKET")}</p>
            <br/>
            <p><strong>Closing Discussion:</strong></p>
            <p>${s("CLOSING")}</p>
            <br/>
            <p><strong>Preview next lesson:</strong> ${s("PREVIEW")}</p>
          </td>

        </tr>
      </table>
    </td>
  </tr>

  <!-- Signature row -->
  <tr>
    <td colspan='2' style='${td}padding:8pt;'><strong>Teacher:</strong> ${instructor||""}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
    <td style='${td}padding:8pt;'><strong>Instructional Leader:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
  </tr>

</table>
<p class='ft'>EduBudd &middot; Dar Al-Thikr School &middot; Powered by Claude AI</p>
</body></html>`;
};

const makeDASCPrint = (fields, sections, isAr=false) => {
  const {subject,grade,cls,unit,lesson,week,topic,instructor,date} = fields;
  const dir = isAr ? "rtl" : "ltr";
  const ff  = isAr ? "'Noto Kufi Arabic',Arial" : "'Plus Jakarta Sans',Calibri,Arial";
  const s   = (tag) => mdToHtml(sections[tag] || "");
  const td  = "border:1px solid #999;padding:5px 6px;vertical-align:top;font-size:10px;";
  const hd  = `${td}background:#1a6b42;color:white;font-weight:700;font-size:9px;`;
  const sm  = `${td}font-size:9px;`;

  return `<!DOCTYPE html><html dir='${dir}'>
<head><meta charset='utf-8'><title>${topic||"Lesson Plan"}</title>
<link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&display=swap' rel='stylesheet'>
<style>
  *{box-sizing:border-box;}
  body{font-family:${ff};font-size:10px;color:#111;line-height:1.6;direction:${dir};max-width:1100px;margin:0 auto;padding:14px 18px;}
  table{width:100%;border-collapse:collapse;}
  td{border:1px solid #999;padding:5px 6px;vertical-align:top;font-size:10px;}
  p{margin:2px 0;}ul,ol{margin:2px 0 2px 12px;padding:0;}li{margin:1px 0;}
  strong{font-weight:700;}em{font-style:italic;}h3,h4{margin:4px 0 2px;font-weight:700;font-size:10px;}
  .title{font-size:12px;font-weight:800;color:#1a6b42;text-align:center;border-bottom:2px solid #1a6b42;padding-bottom:4px;margin-bottom:6px;}
  .hd{background:#1a6b42;color:white;font-weight:700;font-size:8.5px;padding:3px 5px;}
  .sm{font-size:8.5px;}
  .ft{font-size:8px;color:#666;text-align:center;margin-top:8px;padding-top:5px;border-top:1px solid #ccc;}
  @media print{body{padding:8px 10px;}@page{margin:1cm;size:A4 landscape;}}
</style></head>
<body>

<p class='title'>Lesson Plan adapting the 5Es and Students&#x2019; Centered Approach</p>
<p style='font-size:10px;margin-bottom:5px;'><strong>Course:</strong> ${subject||""} &nbsp;&nbsp;&nbsp; <strong>Instructor:</strong> ${instructor||""}</p>

<table>
  <tr>
    <td style='width:34%;'><strong>Date:</strong> ${date||new Date().toLocaleDateString()}</td>
    <td style='width:33%;'><strong>Grade:</strong> ${grade||""}</td>
    <td style='width:33%;'><strong>Class:</strong> ${cls||""}</td>
  </tr>
  <tr>
    <td colspan='3'><strong>Unit:</strong> ${unit||""} &nbsp;&nbsp; <strong>Lesson:</strong> ${lesson||""} &nbsp;&nbsp; <strong>Topic:</strong> ${topic||""} &nbsp;&nbsp; <strong>Week:</strong> ${week||""}</td>
  </tr>
  <tr>
    <td colspan='3' style='padding:0;'>
      <table>
        <tr>
          <td colspan='7' style='${td}'>
            <p><strong><em>Standards:</em></strong> By the end of this lesson, students will be able to:</p>
            <p>${s("STANDARDS")}</p>
          </td>
        </tr>
        <tr>
          <td class='hd' style='width:3%;'>Beginning</td>
          <td class='sm' style='width:3%;'>Engage,<br/>Explore</td>
          <td colspan='2' class='hd' style='width:6%;'><em>Middle</em> Explain, Elaborate</td>
          <td style='${td}width:2%;'></td>
          <td colspan='2' class='hd' style='width:6%;'><em>End</em> Evaluate</td>
        </tr>
        <tr>
          <td class='sm' style='width:22%;'><strong>Introduction</strong><br/><em>Hook, LI, SC, Prior Learning, Vocabulary</em></td>
          <td class='sm' style='width:18%;'><strong>Presentation</strong><br/><em>Explicit Skill &amp;/or Strategy Teaching</em></td>
          <td colspan='2' class='sm' style='width:20%;'><strong>Guided Practice</strong><br/><em>Small Group/Individual</em></td>
          <td class='sm' style='width:18%;'><strong>Independent Practice</strong><br/><em>Monitored by teacher</em></td>
          <td colspan='2' class='sm' style='width:22%;'><strong>Review</strong><br/><em>Connection back to LI &amp; SC</em></td>
        </tr>
        <tr>
          <td style='${td}width:22%;'>
            <p><strong>Hook (Engage):</strong></p><p>${s("HOOK")}</p><br/>
            <p><strong>Learning Intentions:</strong></p><p>${s("LEARNING_INTENTIONS")}</p><br/>
            <p><strong>Success Criteria:</strong></p><p>${s("SUCCESS_CRITERIA")}</p><br/>
            <p><strong>Prior Learning:</strong></p><p>${s("PRIOR_LEARNING")}</p><br/>
            <p><strong>Key Vocabulary:</strong></p><p>${s("VOCABULARY")}</p><br/>
            <p><strong>Transition:</strong></p><p>${s("TRANSITION")}</p>
          </td>
          <td style='${td}width:18%;'>
            <p><strong>Presentation (Explain)</strong></p><p>${s("PRESENTATION")}</p>
          </td>
          <td colspan='2' style='${td}width:20%;'>
            <p><strong>Guided Practice (Elaborate)</strong></p><p>${s("GUIDED_PRACTICE")}</p>
          </td>
          <td style='${td}width:18%;'>
            <p><strong>Independent Practice, Assessment &amp; Differentiation</strong></p>
            <p>${s("INDEPENDENT_PRACTICE")}</p><br/>
            <p><strong>Extension:</strong> ${s("EXTENSION")}</p><br/>
            <p><strong>Formal:</strong> ${s("FORMAL_ASSESSMENT")}</p><br/>
            <p><strong>Informal:</strong> ${s("INFORMAL_ASSESSMENT")}</p><br/>
            <p><strong>Support:</strong> ${s("SUPPORT")}</p><br/>
            <p><strong>Challenge:</strong> ${s("CHALLENGE")}</p>
          </td>
          <td colspan='2' style='${td}width:22%;'>
            <p><strong>Review (Evaluate)</strong></p>
            <p><strong>Connection back to LI:</strong></p><p>${s("REVIEW")}</p><br/>
            <p><strong>Exit Ticket:</strong></p><p>${s("EXIT_TICKET")}</p><br/>
            <p><strong>Closing Discussion:</strong></p><p>${s("CLOSING")}</p><br/>
            <p><strong>Preview next lesson:</strong> ${s("PREVIEW")}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan='2' style='padding:6px;'><strong>Teacher:</strong> ${instructor||""}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
    <td style='padding:6px;'><strong>Instructional Leader:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
  </tr>
</table>
<div class='ft'>EduBudd &middot; Dar Al-Thikr School &middot; Powered by Claude AI</div>
<script>window.onload=()=>window.print();</script>
</body></html>`;
};

const exportWord = (content, title, isAr=false) => {
  const dir=isAr?"rtl":"ltr"; const ff=isAr?"'Arial Unicode MS',Arial":"Calibri,Arial";
  const html=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${title}</title>
<style>body{font-family:${ff};font-size:11pt;color:#111;line-height:1.8;direction:${dir};margin:1.2cm 1.5cm;}
h1{font-size:16pt;color:#1a6b42;font-weight:bold;border-bottom:2pt solid #cce4d8;padding-bottom:4pt;margin:0 0 10pt;}
h2{font-size:13pt;color:#1a6b42;font-weight:bold;border-bottom:1pt solid #e8f5ee;padding-bottom:2pt;margin:14pt 0 6pt;}
h3{font-size:11.5pt;color:#1a6b42;font-weight:bold;margin:10pt 0 4pt;}
h4{font-size:11pt;color:#2a5a3a;font-weight:bold;margin:8pt 0 3pt;}
p{margin:0 0 7pt;}li{margin:2pt 0 2pt 14pt;}strong{font-weight:bold;}em{font-style:italic;}
.footer{margin-top:30pt;padding-top:8pt;border-top:1pt solid #cce4d8;font-size:9pt;color:#666;}</style></head>
<body><h1>${title}</h1>${mdToHtml(content)}<div class='footer'>EduBudd · Powered by Claude AI · ${new Date().toLocaleDateString()}</div></body></html>`;
  const blob=new Blob(["\ufeff"+html],{type:"application/msword"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${title}.doc`;a.click();
};

const exportPDF = (content, title, isAr=false) => {
  const dir=isAr?"rtl":"ltr"; const ff=isAr?"'Noto Kufi Arabic',Arial":"'Plus Jakarta Sans',Calibri,Arial";
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html dir='${dir}'><head><meta charset='utf-8'><title>${title}</title>
<link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Kufi+Arabic:wght@400;600;700&display=swap' rel='stylesheet'>
<style>body{font-family:${ff};font-size:13px;color:#111;line-height:1.85;direction:${dir};max-width:820px;margin:0 auto;padding:32px 40px;}
h1{font-size:22px;color:#1a6b42;font-weight:800;border-bottom:3px solid #e8f5ee;padding-bottom:8px;margin:0 0 16px;}
h2{font-size:15px;color:#1a6b42;font-weight:700;border-bottom:2px solid #e8f5ee;padding-bottom:4px;margin:20px 0 8px;}
h3{font-size:13.5px;color:#1a6b42;font-weight:700;margin:14px 0 4px;}
h4{font-size:13px;color:#2a5a3a;font-weight:600;margin:10px 0 3px;}
p{margin:0 0 10px;}li{margin:3px 0;}strong{font-weight:700;}em{font-style:italic;}
.hdr{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #e8f5ee;}
.brand{font-size:20px;font-weight:800;color:#1a6b42;}
.ft{margin-top:40px;padding-top:12px;border-top:1px solid #ccc;font-size:10px;color:#666;text-align:center;}
@media print{body{padding:16px 20px;}@page{margin:1.5cm;size:A4;}}</style></head>
<body><div class='hdr'><div style='width:48px;height:48px;background:#1a6b42;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;'>👨‍🏫</div><div><div class='brand'>EduBudd</div><div style='font-size:11px;color:#666;'>Dar Al-Thikr School</div></div></div>
<h1>${title}</h1>${mdToHtml(content)}
<div class='ft'>EduBudd · Powered by Claude AI · ${new Date().toLocaleDateString()}</div>
<script>window.onload=()=>window.print();</script></body></html>`);
  w.document.close();
};

const exportDASC = (format, fields, sections, isAr=false) => {
  const title = `${fields.topic||"Lesson Plan"} - Grade ${fields.grade||""}`;
  if (format==="word") {
    const html=makeDASCWord(fields,sections,isAr);
    const blob=new Blob(["\ufeff"+html],{type:"application/msword"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${title}.doc`;a.click();
  } else {
    const html=makeDASCPrint(fields,sections,isAr);
    const w=window.open("","_blank");w.document.write(html);w.document.close();
  }
};

const T = {
  en:{
    tagline:"Turn your teaching ideas into brilliant lesson plans — in seconds! ✨",
    chooseMode:"Choose your mode",templateMode:"Template Mode",
    templateDesc:"Upload your school template. AI fills every section and exports it as a filled document.",
    templateTag:"Structured Format",freeMode:"Free Input Mode",
    freeDesc:"Just chat! Describe your lesson and AI builds it from scratch.",
    freeTag:"Quick & Flexible",americanMode:"American Pathway",
    americanDesc:"Dar Al-Thikr's official 5Es template — exported as a professionally filled Word or PDF.",
    americanTag:"Dar Al-Thikr Official",history:"History",signOut:"Sign Out",credits:"credits",
    back:"← Back",continue:"Continue →",generate:"Generate (1 credit)",
    welcome:"Welcome back! 👋",noHistory:"No history yet",
    noHistoryDesc:"Your generated lesson plans will appear here",
    lessonReady:"Lesson Plan Ready ✓",building:"Building your lesson plan…",
    poweredBy:"Powered by Claude AI",describeLesson:"Describe your lesson",
    describeHint:"Tell me the topic, grade, duration, and goals.",
    example:"Example",exampleText:"A 45-min lesson on the water cycle for Grade 5. Include a hands-on activity.",
    followUp:"Follow up or ask to refine…",send:"→",selectFrameworks:"Curriculum Framework(s)",
    selectAll:"Select all that apply",ageLevel:"Age Level",gradeLevel:"Grade Level",
    optional:"— optional",yourTemplate:"Your Template *",uploadTemplate:"📄  Upload Template (.docx / .txt)",
    refFiles:"Reference Files",attachRef:"+  Attach Reference Files",
    signIn:"Sign In",signUp:"Sign Up",email:"Email address",password:"Password",
    fullName:"Full Name",signInBtn:"Sign In →",signUpBtn:"Create Account →",
    pleaseWait:"Please wait…",noAccount:"Don't have an account?",haveAccount:"Already have an account?",
    emailConfirm:"Account created! Check your email.",watchAd:"📺 Watch an Ad",
    watchAdDesc:"Earn 1 free credit · 5 seconds",creditAdded:"✓ Credit added!",watch:"Watch",
    yourCredits:"Your Credits",creditsLeft:"left this week · resets Monday",viewAll:"View all →",
    recentPlans:"📋 Recent Lesson Plans",pastPlan:"Past Lesson Plan",
    lessonSetup:"Lesson Setup",americanSetup:"American Pathway Setup",
    subject:"Subject / Course",subjectHint:"e.g. Wonders McGraw-Hill, Math, Science",
    topic:"Lesson Topic",topicHint:"e.g. Expository Writing, Reading Realistic Fiction",
    classField:"Class",classHint:"e.g. 4A / 4B",unit:"Unit",unitHint:"e.g. Unit 2",
    instructor:"Instructor Name",instructorHint:"Your full name",
    lessonNum:"Lesson Number(s)",lessonNumHint:"e.g. 7, 8, 9",
    week:"Week",weekHint:"e.g. Week 10",
    standardsOptional:"Specific Standards (optional — AI auto-generates if blank)",
    standardsHint:"Leave blank for auto-generation, or paste specific standards",
    duration:"Lesson Duration",outputLang:"Generate lesson plan in:",
    english:"English",arabic:"Arabic",
    generateAmerican:"Generate & Export Filled Template (1 credit)",
    outputFormat:"Export Format",formatChat:"💬 In-App Preview",formatPDF:"📄 PDF",formatWord:"📝 Word (.doc)",
    createAnother:"+ Create Another",exportAs:"Export as:",
    generatedSuccess:"✓ Exported! Check your downloads or print dialog.",
    autoStandards:"Leave blank — AI will auto-identify CCSS standards for your grade and topic.",
  },
  ar:{
    tagline:"حوّل أفكارك التدريسية إلى خطط دروس رائعة — في ثوانٍ! ✨",
    chooseMode:"اختر الوضع",templateMode:"وضع القالب",
    templateDesc:"ارفع قالبك. يملأ الذكاء الاصطناعي كل قسم ويصدره كمستند مكتمل.",
    templateTag:"تنسيق منظم",freeMode:"وضع الإدخال الحر",
    freeDesc:"فقط تحدث! صف درسك ويبنيه الذكاء الاصطناعي من الصفر.",
    freeTag:"سريع ومرن",americanMode:"المسار الأمريكي",
    americanDesc:"قالب دار الذكر الرسمي — يُصدَّر كملف Word أو PDF مملوء احترافياً.",
    americanTag:"دار الذكر الرسمي",history:"السجل",signOut:"خروج",credits:"رصيد",
    back:"→ رجوع",continue:"← متابعة",generate:"إنشاء (رصيد واحد)",
    welcome:"أهلاً بك! 👋",noHistory:"لا يوجد سجل بعد",
    noHistoryDesc:"ستظهر هنا خطط الدروس التي أنشأتها",
    lessonReady:"خطة الدرس جاهزة ✓",building:"جارٍ بناء خطة درسك…",
    poweredBy:"مدعوم بتقنية Claude AI",describeLesson:"صف درسك",
    describeHint:"أخبرني بالموضوع والصف والمدة.",
    example:"مثال",exampleText:"درس مدته 45 دقيقة حول دورة المياه للصف الخامس.",
    followUp:"تابع أو اطلب التعديل…",send:"←",selectFrameworks:"إطار المنهج",
    selectAll:"اختر كل ما ينطبق",ageLevel:"المرحلة العمرية",gradeLevel:"الصف",
    optional:"— اختياري",yourTemplate:"قالبك *",uploadTemplate:"📄  ارفع القالب",
    refFiles:"ملفات مرجعية",attachRef:"+  إرفاق ملفات",
    signIn:"تسجيل الدخول",signUp:"إنشاء حساب",email:"البريد الإلكتروني",
    password:"كلمة المرور",fullName:"الاسم الكامل",signInBtn:"← تسجيل الدخول",
    signUpBtn:"← إنشاء الحساب",pleaseWait:"يرجى الانتظار…",
    noAccount:"ليس لديك حساب؟",haveAccount:"لديك حساب؟",
    emailConfirm:"تم إنشاء الحساب!",watchAd:"📺 شاهد إعلاناً",
    watchAdDesc:"اكسب رصيداً · 5 ثوانٍ",creditAdded:"✓ تمت إضافة الرصيد!",watch:"شاهد",
    yourCredits:"رصيدك",creditsLeft:"متبقٍ هذا الأسبوع",viewAll:"عرض الكل ←",
    recentPlans:"📋 خطط الدروس الأخيرة",pastPlan:"خطة درس سابقة",
    lessonSetup:"إعداد الدرس",americanSetup:"إعداد المسار الأمريكي",
    subject:"المادة / المقرر",subjectHint:"مثال: Wonders، الرياضيات",
    topic:"موضوع الدرس",topicHint:"مثال: الكتابة التوضيحية",
    classField:"الفصل",classHint:"مثال: 4A / 4B",unit:"الوحدة",unitHint:"مثال: الوحدة 2",
    instructor:"اسم المعلم",instructorHint:"اسمك الكامل",
    lessonNum:"رقم الدرس",lessonNumHint:"مثال: 7، 8، 9",
    week:"الأسبوع",weekHint:"مثال: الأسبوع 10",
    standardsOptional:"المعايير (اختياري — يُنشئها الذكاء الاصطناعي تلقائياً)",
    standardsHint:"اتركه فارغاً للإنشاء التلقائي",
    duration:"مدة الدرس",outputLang:"إنشاء خطة الدرس بـ:",
    english:"الإنجليزية",arabic:"العربية",
    generateAmerican:"إنشاء وتصدير القالب المملوء (رصيد واحد)",
    outputFormat:"صيغة التصدير",formatChat:"💬 معاينة في التطبيق",formatPDF:"📄 PDF",formatWord:"📝 Word (.doc)",
    createAnother:"+ خطة جديدة",exportAs:"تصدير بصيغة:",
    generatedSuccess:"✓ تم التصدير!",
    autoStandards:"اتركه فارغاً — سيحدد الذكاء الاصطناعي معايير CCSS تلقائياً.",
  }
};

const FRAMEWORKS=["CCSS","Cambridge","IB","CELTA Style","5Es Model","SIOP","Bloom's Taxonomy","UbD","Montessori","STEAM","General English","Project-Based Learning","Competency-Based","Flipped Classroom"];
const AGE_LEVELS=[
  {label:"Early Childhood",labelAr:"الطفولة المبكرة",sub:"Ages 3–5",subAr:"3–5 سنوات",value:"early_childhood",emoji:"🌱"},
  {label:"Primary",labelAr:"المرحلة الابتدائية",sub:"Ages 6–11",subAr:"6–11 سنة",value:"primary",emoji:"📚"},
  {label:"Middle School",labelAr:"المرحلة الإعدادية",sub:"Ages 12–14",subAr:"12–14 سنة",value:"middle_school",emoji:"🔬"},
  {label:"High School",labelAr:"المرحلة الثانوية",sub:"Ages 15–18",subAr:"15–18 سنة",value:"high_school",emoji:"🎓"},
  {label:"Adult / Higher Ed",labelAr:"البالغون",sub:"18+",subAr:"18+",value:"adult",emoji:"🏛️"},
  {label:"Mixed / Flexible",labelAr:"مختلط",sub:"Open range",subAr:"نطاق مفتوح",value:"mixed",emoji:"♾️"},
];
const GRADE_MAP={
  early_childhood:["Pre-K","Kindergarten"],primary:["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"],
  middle_school:["Grade 7","Grade 8","Grade 9"],high_school:["Grade 10","Grade 11","Grade 12"],
  adult:["Undergraduate","Postgraduate","Professional","N/A"],mixed:["N/A"]
};
const DURATIONS=["30 minutes","45 minutes","60 minutes","90 minutes","2 hours"];
const G={bg:"#f4f9f6",white:"#ffffff",primary:"#1a6b42",accentLight:"#e8f5ee",text:"#0f2018",muted:"#5a7a68",border:"#cce4d8",surface:"#edf6f1",red:"#e05555"};

const injectStyles=()=>{
  if(document.getElementById("lc-s"))return;
  const s=document.createElement("style");s.id="lc-s";
  s.textContent=`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}html,body{height:100%;background:#f4f9f6;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeUp .3s ease both;}.msg{animation:msgIn .25s ease both;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#cce4d8;border-radius:3px;}
textarea:focus,input:focus,select:focus{outline:2px solid #4db87a;outline-offset:1px;}
.mode-card{transition:all .2s;}.mode-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(26,107,66,.12);}
.rc h1{font-size:18px;color:#1a6b42;font-weight:800;border-bottom:3px solid #e8f5ee;padding-bottom:6px;margin:0 0 12px;}
.rc h2{font-size:15px;color:#1a6b42;font-weight:700;border-bottom:2px solid #e8f5ee;padding-bottom:3px;margin:18px 0 6px;}
.rc h3{font-size:13.5px;color:#1a6b42;font-weight:700;margin:12px 0 4px;}
.rc h4{font-size:13px;color:#2a5a3a;font-weight:600;margin:8px 0 3px;}
.rc p{margin:0 0 8px;line-height:1.85;}.rc li{margin:3px 0 3px 18px;list-style:disc;line-height:1.7;}
.rc strong{font-weight:700;color:#0f2018;}.rc em{font-style:italic;}.rc hr{border:none;border-top:1px solid #cce4d8;margin:12px 0;}`;
  document.head.appendChild(s);
};

const TeacherIcon=({size=60,color="#fff"})=>(
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="16" r="9" fill={color}/>
    <path d="M12 46C12 36 48 36 48 46V52H12V46Z" fill={color}/>
    <rect x="6" y="28" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="2"/>
    <line x1="9" y1="33" x2="21" y2="33" stroke={color} strokeWidth="1.5"/>
    <line x1="9" y1="37" x2="17" y2="37" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export default function App() {
  const [windowWidth,setWindowWidth]=useState(window.innerWidth);
  const isDesktop=windowWidth>=768;
  const [lang,setLang]=useState("en");
  const t=T[lang];const isAr=lang==="ar";
  const fontFamily=isAr?"'Noto Kufi Arabic',sans-serif":"'DM Sans',sans-serif";
  const dir=isAr?"rtl":"ltr";
  const [user,setUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [authTab,setAuthTab]=useState("signin");
  const [authEmail,setAuthEmail]=useState("");
  const [authPassword,setAuthPassword]=useState("");
  const [authName,setAuthName]=useState("");
  const [authError,setAuthError]=useState("");
  const [authSubmitting,setAuthSubmitting]=useState(false);
  const [authSuccess,setAuthSuccess]=useState("");
  const [screen,setScreen]=useState("home");
  const [mode,setMode]=useState(null);
  const [frameworks,setFrameworks]=useState([]);
  const [ageLevel,setAgeLevel]=useState(null);
  const [gradeLevel,setGradeLevel]=useState("");
  const [extraFiles,setExtraFiles]=useState([]);
  const [templateFile,setTemplateFile]=useState(null);
  const [credits,setCredits]=useState(0);
  const [showModal,setShowModal]=useState(false);
  const [adTimer,setAdTimer]=useState(null);
  const [adDone,setAdDone]=useState(false);
  const [history,setHistory]=useState([]);
  const [viewingHistory,setViewingHistory]=useState(null);
  const [messages,setMessages]=useState([]);
  const [chatInput,setChatInput]=useState("");
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState("");
  const [outputFormat,setOutputFormat]=useState("chat");
  const [exportSuccess,setExportSuccess]=useState(false);
  const [apSubject,setApSubject]=useState("");
  const [apTopic,setApTopic]=useState("");
  const [apGrade,setApGrade]=useState("");
  const [apClass,setApClass]=useState("");
  const [apUnit,setApUnit]=useState("");
  const [apLesson,setApLesson]=useState("");
  const [apWeek,setApWeek]=useState("");
  const [apStandards,setApStandards]=useState("");
  const [apDuration,setApDuration]=useState("45 minutes");
  const [apOutputLang,setApOutputLang]=useState("en");
  const [apInstructor,setApInstructor]=useState("");
  const [apExportFormat,setApExportFormat]=useState("word");
  const chatEndRef=useRef();const extraRef=useRef();const templateRef=useRef();

  useEffect(()=>{
    injectStyles();
    const hr=()=>setWindowWidth(window.innerWidth);window.addEventListener("resize",hr);
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthLoading(false);if(session?.user)loadData(session.user.id);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{setUser(session?.user??null);if(session?.user)loadData(session.user.id);});
    return()=>{window.removeEventListener("resize",hr);subscription.unsubscribe();};
  },[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const loadData=async(uid)=>{
    try{
      const{data:p}=await supabase.from("profiles").select("*").eq("id",uid).single();
      if(p){const wm=7*24*60*60*1000;if(Date.now()-new Date(p.credits_reset_at).getTime()>wm){await supabase.from("profiles").update({credits:10,credits_reset_at:new Date().toISOString()}).eq("id",uid);setCredits(10);}else setCredits(p.credits);}
      const{data:plans}=await supabase.from("lesson_plans").select("*").eq("user_id",uid).order("created_at",{ascending:false}).limit(20);
      if(plans)setHistory(plans.map(p=>({id:p.id,date:new Date(p.created_at).toLocaleDateString(),title:p.title,content:p.content,frameworks:p.frameworks,ageLevel:p.age_level,gradeLevel:p.grade_level,mode:p.mode})));
    }catch{}
  };
  const saveCredits=async(n)=>{setCredits(n);if(user)await supabase.from("profiles").update({credits:n}).eq("id",user.id);};
  const saveToHistory=async(content,title,modeLabel)=>{
    if(!user)return;
    const{data}=await supabase.from("lesson_plans").insert({user_id:user.id,title:title||content.split("\n")[0].replace(/[#*\[\]]/g,"").trim().slice(0,60),content,frameworks:frameworks.join(", "),age_level:AGE_LEVELS.find(a=>a.value===ageLevel)?.[isAr?"labelAr":"label"]||"",grade_level:gradeLevel,mode:modeLabel||"Free Input"}).select().single();
    if(data){setHistory(prev=>[{id:data.id,date:new Date(data.created_at).toLocaleDateString(),title:data.title,content:data.content,frameworks:data.frameworks,ageLevel:data.age_level,gradeLevel:data.grade_level,mode:data.mode},...prev].slice(0,20));}
  };
  const handleAuth=async(e)=>{e.preventDefault();setAuthError("");setAuthSubmitting(true);setAuthSuccess("");try{if(authTab==="signup"){const{error}=await supabase.auth.signUp({email:authEmail,password:authPassword,options:{data:{full_name:authName}}});if(error)throw error;setAuthSuccess(t.emailConfirm);}else{const{error}=await supabase.auth.signInWithPassword({email:authEmail,password:authPassword});if(error)throw error;}}catch(e){setAuthError(e.message);}finally{setAuthSubmitting(false);}};
  const signOut=async()=>{await supabase.auth.signOut();setUser(null);setCredits(0);setHistory([]);};
  const watchAd=()=>{if(adTimer!==null)return;setAdDone(false);setAdTimer(5);const t2=setInterval(()=>{setAdTimer(p=>{if(p<=1){clearInterval(t2);setAdTimer(null);setAdDone(true);saveCredits(credits+1);return null;}return p-1;});},1000);};
  const toggleFw=fw=>setFrameworks(p=>p.includes(fw)?p.filter(f=>f!==fw):[...p,fw]);
  const readAsText=file=>new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=()=>res("");r.readAsText(file);});
  const buildSystem=async(extra="")=>{
    const fwStr=frameworks.length?frameworks.join(", "):"General curriculum";
    const ai=AGE_LEVELS.find(a=>a.value===ageLevel);
    return `You are an expert lesson plan designer for Dar Al-Thikr School, Jeddah. Frameworks: ${fwStr}.
Student: Age ${ai?`${ai.label} (${ai.sub})`:"Not specified"} | Grade ${gradeLevel||"Not specified"}
${extra?`\nReference:\n${extra}`:""}
Format using ## for main headings, **bold** for labels, and - for bullet lists.`;
  };

  const generateAmericanPathway=async()=>{
    if(credits<=0){setShowModal(true);return;}if(!apSubject||!apTopic)return;
    setScreen("generating");setError("");setExportSuccess(false);
    const oia=apOutputLang==="ar";
    const fields={subject:apSubject,grade:apGrade,cls:apClass,unit:apUnit,lesson:apLesson,week:apWeek,topic:apTopic,duration:apDuration,standards:apStandards,date:new Date().toLocaleDateString(),instructor:apInstructor};
    try{
      const li=oia?"Generate the ENTIRE lesson plan in Arabic with professional educational terminology.":"Generate the entire lesson plan in English.";
      const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:1000,
        system:`You are an expert American Pathway curriculum designer for Dar Al-Thikr School. ${li}
Fill every section with the EXACT delimiters. Be specific, detailed, and classroom-ready.
${apStandards?"":"Automatically identify and include the most relevant CCSS standards for the given grade, subject, and topic."}`,
        messages:[{role:"user",content:`Fill every section for this lesson. Be thorough and specific.

Subject: ${apSubject} | Grade: ${apGrade} | Topic: ${apTopic}
Unit: ${apUnit} | Lesson: ${apLesson} | Week: ${apWeek} | Duration: ${apDuration}
${apStandards?`Provided Standards: ${apStandards}`:`Auto-identify the most relevant CCSS standards for ${apGrade} ${apSubject} on ${apTopic}.`}

[STANDARDS]
${apStandards||`List 4-6 most relevant CCSS codes and full descriptions for ${apGrade} ${apSubject} on the topic: ${apTopic}`}
[/STANDARDS]

[OBJECTIVES]
By the end of this lesson, students will be able to: (3-4 specific measurable objectives)
[/OBJECTIVES]

[HOOK]
Detailed 5-7 minute engaging activity with specific teacher questions and student actions.
[/HOOK]

[LEARNING_INTENTIONS]
• I am learning to [specific intention 1]
• I am learning to [specific intention 2]
• I am learning to [specific intention 3]
[/LEARNING_INTENTIONS]

[SUCCESS_CRITERIA]
✔ I can [measurable criterion 1]
✔ I can [measurable criterion 2]
✔ I can [measurable criterion 3]
[/SUCCESS_CRITERIA]

[PRIOR_LEARNING]
What students already know and bridge question to activate prior knowledge.
[/PRIOR_LEARNING]

[VOCABULARY]
word1 • student-friendly definition | word2 • definition | word3 • definition | word4 • definition | word5 • definition | word6 • definition
[/VOCABULARY]

[TRANSITION]
A specific transition statement bridging the introduction to presentation.
[/TRANSITION]

[PRESENTATION]
Detailed 10-15 min explicit teaching. Include think-aloud, modeling, teacher language, anchor chart content, and check-for-understanding questions.
[/PRESENTATION]

[GUIDED_PRACTICE]
Detailed 10-15 min collaborative activity. Include specific partner/group tasks, graphic organizer details, teacher circulation questions, and discussion prompts.
[/GUIDED_PRACTICE]

[INDEPENDENT_PRACTICE]
Specific independent task with exact instructions and sentence frames where relevant.
[/INDEPENDENT_PRACTICE]

[EXTENSION]
Specific extension task for early finishers that deepens understanding.
[/EXTENSION]

[FORMAL_ASSESSMENT]
How work is collected and evaluated with specific criteria.
[/FORMAL_ASSESSMENT]

[INFORMAL_ASSESSMENT]
Observation and questioning strategies during the lesson.
[/INFORMAL_ASSESSMENT]

[SUPPORT]
Specific scaffolds: sentence frames, visual aids, partner arrangements, labeled diagrams, word banks.
[/SUPPORT]

[CHALLENGE]
Specific higher-order thinking extension for advanced students.
[/CHALLENGE]

[REVIEW]
Self-assessment strategy connecting back to learning intentions and success criteria.
[/REVIEW]

[EXIT_TICKET]
On an index card, students answer:
1. [First specific prompt with sentence frame]
2. [Second specific prompt]
[/EXIT_TICKET]

[CLOSING]
1-2 specific closing discussion questions and teacher wrap-up.
[/CLOSING]

[PREVIEW]
Specific teaser for the next lesson.
[/PREVIEW]`}]})});
      const data=await res.json();if(data.error)throw new Error(data.error.message);
      const aiText=data.content.map(b=>b.text||"").join("\n");
      const tags=["STANDARDS","OBJECTIVES","HOOK","LEARNING_INTENTIONS","SUCCESS_CRITERIA","PRIOR_LEARNING","VOCABULARY","TRANSITION","PRESENTATION","GUIDED_PRACTICE","INDEPENDENT_PRACTICE","EXTENSION","FORMAL_ASSESSMENT","INFORMAL_ASSESSMENT","SUPPORT","CHALLENGE","REVIEW","EXIT_TICKET","CLOSING","PREVIEW"];
      const sections={};tags.forEach(tag=>{sections[tag]=parseSection(aiText,tag);});
      await saveCredits(credits-1);
      await saveToHistory(aiText,`${apTopic} - Grade ${apGrade}`,"American Pathway");
      if(apExportFormat==="word"){exportDASC("word",fields,sections,oia);setExportSuccess(true);setScreen("american");}
      else if(apExportFormat==="pdf"){exportDASC("pdf",fields,sections,oia);setExportSuccess(true);setScreen("american");}
      else{setMessages([{role:"assistant",content:aiText,ts:Date.now(),outputLang:apOutputLang}]);setScreen("result");}
    }catch(e){setError(e.message||"Generation failed.");setScreen("american");}
  };

  const sendChat=async()=>{
    if(!chatInput.trim()||isLoading)return;if(credits<=0){setShowModal(true);return;}
    const um={role:"user",content:chatInput.trim(),ts:Date.now()};
    const nm=[...messages,um];setMessages(nm);setChatInput("");setIsLoading(true);setError("");
    try{
      let ex="";for(const f of extraFiles){const tx=await readAsText(f);ex+=`\n[${f.name}]\n${tx.slice(0,1500)}`;}
      const sys=await buildSystem(ex);const isF=messages.length===0;
      const ln=isAr?"\nGenerate the lesson plan entirely in Arabic.":"";
      const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys+(isF?`\n\nCreate a complete lesson plan:\n## Lesson Overview\n## Learning Objectives\n## Materials & Resources\n## Lesson Sequence (with timing)\n## Assessment Strategies\n## Differentiation & Inclusion\n## Extension / Homework${ln}`:"\n\nRefine based on the teacher's feedback."),messages:nm.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();if(data.error)throw new Error(data.error.message);
      const text=data.content.map(b=>b.text||"").join("\n");
      setMessages([...nm,{role:"assistant",content:text,ts:Date.now()}]);
      if(isF){await saveCredits(credits-1);await saveToHistory(text,"","Free Input");if(outputFormat==="word")exportWord(text,"Lesson Plan",isAr);else if(outputFormat==="pdf")exportPDF(text,"Lesson Plan",isAr);}
    }catch(e){setError(e.message||"Something went wrong.");}finally{setIsLoading(false);}
  };

  const generateTemplate=async()=>{
    if(credits<=0){setShowModal(true);return;}if(!templateFile)return;
    setScreen("generating");setError("");
    try{
      let ex="";for(const f of extraFiles){const tx=await readAsText(f);ex+=`\n[${f.name}]\n${tx.slice(0,1500)}`;}
      const tmpl=await readAsText(templateFile);const sys=await buildSystem(ex);
      const ln=isAr?"\nGenerate all content in Arabic.":"";
      const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys+`\n\nFill in a lesson plan template. Follow its EXACT structure and section order. Fill every field completely with detailed content. Use **bold** for labels, - for lists.${ln}`,messages:[{role:"user",content:`Fill in every section of this template completely:\n\n${tmpl.slice(0,3000)}\n\nMaintain the exact structure. Fill every blank with appropriate detailed content.`}]})});
      const data=await res.json();if(data.error)throw new Error(data.error.message);
      const text=data.content.map(b=>b.text||"").join("\n");
      await saveCredits(credits-1);await saveToHistory(text,`Template: ${templateFile.name}`,"Template");
      if(outputFormat==="word"){exportWord(text,`Lesson Plan - ${templateFile.name.replace(/\.\w+$/,"")}`,isAr);setScreen("input");}
      else if(outputFormat==="pdf"){exportPDF(text,`Lesson Plan - ${templateFile.name.replace(/\.\w+$/,"")}`,isAr);setScreen("input");}
      else{setMessages([{role:"assistant",content:text,ts:Date.now()}]);setScreen("result");}
    }catch(e){setError(e.message||"Generation failed.");setScreen("input");}
  };

  const resetToHome=()=>{setScreen("home");setMode(null);setFrameworks([]);setAgeLevel(null);setGradeLevel("");setExtraFiles([]);setTemplateFile(null);setMessages([]);setChatInput("");setError("");setApSubject("");setApTopic("");setApGrade("");setApClass("");setApUnit("");setApLesson("");setApWeek("");setApStandards("");setApInstructor("");setExportSuccess(false);};

  const maxW=isDesktop?900:480;
  const S={
    app:{fontFamily,background:G.bg,minHeight:"100vh",color:G.text,width:"100%",direction:dir},
    inner:{maxWidth:maxW,margin:"0 auto",minHeight:"100vh",display:"flex",flexDirection:"column"},
    card:{background:G.white,border:`1px solid ${G.border}`,borderRadius:isDesktop?20:16,padding:isDesktop?"24px":"18px"},
    btnPrimary:{background:G.primary,color:"#fff",border:"none",borderRadius:10,padding:isDesktop?"15px 24px":"14px 20px",fontFamily,fontWeight:600,fontSize:isDesktop?16:15,width:"100%",display:"block",cursor:"pointer"},
    btnOutline:{background:"transparent",color:G.primary,border:`1.5px solid ${G.primary}`,borderRadius:10,padding:"10px 18px",fontFamily,fontWeight:600,fontSize:14,cursor:"pointer"},
    btnGhost:{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 18px",fontFamily,fontSize:14,cursor:"pointer"},
    label:{fontSize:12,fontWeight:700,color:G.primary,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:8},
    chip:(on)=>({padding:"7px 14px",borderRadius:20,border:`1.5px solid ${on?G.primary:G.border}`,background:on?G.accentLight:G.white,color:on?G.primary:G.muted,cursor:"pointer",fontSize:13,fontFamily,fontWeight:on?600:400}),
    input:{width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${G.border}`,fontFamily,fontSize:14,color:G.text,background:G.white,direction:dir},
    topBar:{background:G.primary,padding:isDesktop?"16px 32px":"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  };

  const LB=()=><button onClick={()=>setLang(isAr?"en":"ar")} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.4)",borderRadius:20,padding:"4px 12px",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily}}>{isAr?"EN":"عر"}</button>;
  const RC=({content,isAr:ra=false})=><div className="rc" style={{direction:ra?"rtl":"ltr",fontFamily:ra?"'Noto Kufi Arabic',sans-serif":fontFamily}} dangerouslySetInnerHTML={{__html:mdToHtml(content)}}/>;
  const EB=({content,title,isAr:ra=false})=>(<div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
    <button onClick={()=>exportPDF(content,title,ra)} style={{background:"none",border:`1px solid ${G.border}`,borderRadius:8,padding:"6px 12px",color:G.primary,fontSize:12,fontWeight:600,cursor:"pointer"}}>📄 PDF</button>
    <button onClick={()=>exportWord(content,title,ra)} style={{background:"none",border:`1px solid ${G.border}`,borderRadius:8,padding:"6px 12px",color:G.primary,fontSize:12,fontWeight:600,cursor:"pointer"}}>📝 Word</button>
  </div>);
  const FS=({value,onChange})=>(<div style={{...S.card,marginBottom:14}}><span style={S.label}>{t.outputFormat}</span><div style={{display:"flex",gap:8}}>{[["chat",t.formatChat],["pdf",t.formatPDF],["word",t.formatWord]].map(([v,l])=>(<button key={v} onClick={()=>onChange(v)} style={{...S.chip(value===v),flex:1,textAlign:"center",padding:"9px 4px",fontSize:12}}>{l}</button>))}</div></div>);

  if(authLoading)return(<div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/></div>);

  if(!user)return(
    <div style={S.app}><div style={{...S.inner,alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:420}} className="fade">
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:88,height:88,borderRadius:24,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:`0 12px 40px ${G.primary}40`}}><TeacherIcon size={58}/></div>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:34,color:G.primary,marginBottom:8}}>EduBudd</h1>
          <p style={{color:G.muted,fontSize:14,marginBottom:12}}>{t.tagline}</p>
          <img src={LOGO_URL} alt="Dar Al-Thikr" style={{height:34,objectFit:"contain",opacity:.75}} onError={e=>e.target.style.display='none'}/>
        </div>
        <div style={{...S.card,padding:"28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{display:"flex",background:G.surface,borderRadius:10,padding:4,flex:1,marginRight:12}}>
              {["signin","signup"].map(tab=>(<button key={tab} onClick={()=>{setAuthTab(tab);setAuthError("");setAuthSuccess("");}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:authTab===tab?G.white:"transparent",color:authTab===tab?G.primary:G.muted,fontFamily,fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:authTab===tab?"0 1px 4px #00000015":"none"}}>{tab==="signin"?t.signIn:t.signUp}</button>))}
            </div>
            <button onClick={()=>setLang(isAr?"en":"ar")} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"8px 14px",color:G.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily}}>{isAr?"EN":"عر"}</button>
          </div>
          <form onSubmit={handleAuth} style={{display:"flex",flexDirection:"column",gap:12}}>
            {authTab==="signup"&&<input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder={t.fullName} style={S.input} required/>}
            <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder={t.email} style={S.input} required/>
            <input type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder={t.password} style={S.input} required minLength={6}/>
            {authError&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:8,padding:"10px 12px",color:G.red,fontSize:13}}>{authError}</div>}
            {authSuccess&&<div style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:8,padding:"10px 12px",color:G.primary,fontSize:13}}>{authSuccess}</div>}
            <button type="submit" disabled={authSubmitting} style={{...S.btnPrimary,marginTop:4,opacity:authSubmitting?.7:1}}>{authSubmitting?t.pleaseWait:authTab==="signin"?t.signInBtn:t.signUpBtn}</button>
          </form>
          <p style={{textAlign:"center",color:G.muted,fontSize:12,marginTop:16}}>
            {authTab==="signin"?t.noAccount:t.haveAccount}{" "}
            <button onClick={()=>setAuthTab(authTab==="signin"?"signup":"signin")} style={{background:"none",border:"none",color:G.primary,fontWeight:600,cursor:"pointer",fontSize:12,fontFamily}}>{authTab==="signin"?t.signUp:t.signIn}</button>
          </p>
        </div>
      </div>
    </div></div>
  );

  if(screen==="generating")return(<div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{textAlign:"center"}}><div style={{width:52,height:52,borderRadius:"50%",border:`3px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite",margin:"0 auto 20px"}}/><p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:22,color:G.primary}}>{t.building}</p><p style={{color:G.muted,fontSize:13,marginTop:6}}>{t.poweredBy}</p></div></div>);

  if(screen==="result"){
    const lm=messages[messages.length-1];const content=lm?.content||"";const ra=lm?.outputLang==="ar";
    return(<div style={S.app} className="fade"><div style={S.inner}>
      <div style={S.topBar}><button onClick={resetToHome} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button><span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:15}}>{t.lessonReady}</span><LB/></div>
      <div style={{flex:1,padding:isDesktop?"24px 32px":"16px",overflowY:"auto"}}>
        <EB content={content} title="Lesson Plan" isAr={ra}/>
        <div style={{...S.card,marginTop:12}}><RC content={content} isAr={ra}/></div>
        <button onClick={resetToHome} style={{...S.btnPrimary,marginTop:14}}>{t.createAnother}</button>
      </div>
    </div></div>);
  }

  if(viewingHistory)return(<div style={S.app} className="fade"><div style={S.inner}>
    <div style={S.topBar}><button onClick={()=>setViewingHistory(null)} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button><span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:15}}>{t.pastPlan}</span><LB/></div>
    <div style={{flex:1,padding:isDesktop?"24px 32px":"16px",overflowY:"auto"}}>
      <div style={{background:G.accentLight,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,color:G.primary}}>📅 {viewingHistory.date} · {viewingHistory.ageLevel} · {viewingHistory.mode}</div>
      <EB content={viewingHistory.content} title={viewingHistory.title}/>
      <div style={{...S.card,marginTop:12}}><RC content={viewingHistory.content}/></div>
    </div>
  </div></div>);

  if(screen==="history")return(<div style={S.app} className="fade"><div style={S.inner}>
    <div style={S.topBar}><button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button><span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:16}}>{t.history}</span><LB/></div>
    <div style={{flex:1,padding:isDesktop?"24px 32px":"16px",overflowY:"auto"}}>
      {history.length===0?(<div style={{textAlign:"center",padding:"80px 20px",color:G.muted}}><div style={{fontSize:48,marginBottom:16}}>📋</div><p style={{fontWeight:600,fontSize:16}}>{t.noHistory}</p><p style={{fontSize:13,marginTop:6}}>{t.noHistoryDesc}</p></div>):(
        <div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr":"1fr",gap:12}}>
          {history.map(h=>(<div key={h.id} onClick={()=>setViewingHistory(h)} style={{...S.card,cursor:"pointer"}} className="mode-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}><p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:14,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.title||"Lesson Plan"}</p><p style={{fontSize:12,color:G.muted}}>{h.ageLevel} · {h.frameworks?.split(",")[0]}</p></div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}><p style={{fontSize:11,color:G.muted}}>{h.date}</p><span style={{background:G.accentLight,color:G.primary,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:10,display:"inline-block",marginTop:3}}>{h.mode}</span></div>
            </div>
          </div>))}
        </div>
      )}
    </div>
  </div></div>);

  if(screen==="chat"){
    const cs=chatInput.trim().length>2&&!isLoading;
    return(<div style={{...S.app,height:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={S.topBar}>
        <button onClick={resetToHome} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button>
        <div style={{textAlign:"center"}}><p style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?16:14}}>{t.freeMode}</p><p style={{color:"rgba(255,255,255,.7)",fontSize:11}}>{frameworks.slice(0,2).join(", ")} · {AGE_LEVELS.find(a=>a.value===ageLevel)?.[isAr?"labelAr":"label"]}</p></div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}><LB/><button onClick={()=>setShowModal(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:14,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer"}}>⚡{credits}</button></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:isDesktop?"20px 32px":"16px",display:"flex",flexDirection:"column",gap:12,maxWidth:maxW,width:"100%",margin:"0 auto"}}>
        {messages.length===0&&(<div style={{textAlign:"center",padding:"48px 20px",color:G.muted}} className="fade">
          <div style={{width:64,height:64,borderRadius:20,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><TeacherIcon size={40}/></div>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?20:16,color:G.primary,marginBottom:8}}>{t.describeLesson}</p>
          <p style={{fontSize:13,lineHeight:1.7,maxWidth:400,margin:"0 auto"}}>{t.describeHint}</p>
          <div style={{background:G.accentLight,borderRadius:12,padding:"14px",marginTop:20,textAlign:isAr?"right":"left",maxWidth:400,margin:"20px auto 0"}}>
            <p style={{fontSize:12,color:G.primary,fontWeight:600,marginBottom:4}}>{t.example}:</p>
            <p style={{fontSize:12,color:G.muted,lineHeight:1.7}}>{t.exampleText}</p>
          </div>
          <div style={{marginTop:16,maxWidth:400,margin:"16px auto 0"}}>
            <p style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:600}}>{t.exportAs}</p>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>{[["chat",t.formatChat],["pdf",t.formatPDF],["word",t.formatWord]].map(([v,l])=>(<button key={v} onClick={()=>setOutputFormat(v)} style={{...S.chip(outputFormat===v),fontSize:12}}>{l}</button>))}</div>
          </div>
        </div>)}
        {messages.map((m,i)=>(<div key={i} className="msg" style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?(isAr?"flex-start":"flex-end"):(isAr?"flex-end":"flex-start")}}>
          {m.role==="user"?(<div style={{background:G.primary,color:"#fff",borderRadius:isAr?"16px 16px 16px 4px":"16px 16px 4px 16px",padding:"10px 16px",maxWidth:isDesktop?"70%":"82%",fontSize:14,lineHeight:1.6}}>{m.content}</div>):(
            <div style={{maxWidth:isDesktop?"90%":"95%"}}>
              <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:isAr?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:isDesktop?"20px":"14px"}}><RC content={m.content} isAr={m.outputLang==="ar"}/></div>
              <EB content={m.content} title="Lesson Plan" isAr={m.outputLang==="ar"}/>
            </div>
          )}
        </div>))}
        {isLoading&&(<div className="msg" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:G.white,border:`1px solid ${G.border}`,borderRadius:12,width:"fit-content"}}><div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${G.border}`,borderTopColor:G.primary,animation:"spin 1s linear infinite"}}/><span style={{fontSize:13,color:G.muted}}>{t.building}</span></div>)}
        {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"10px 14px",color:G.red,fontSize:13}}>{error}</div>}
        <div ref={chatEndRef}/>
      </div>
      <div style={{background:G.white,borderTop:`1px solid ${G.border}`,padding:isDesktop?"12px 32px 16px":"8px 12px 16px",maxWidth:maxW,width:"100%",margin:"0 auto"}}>
        <input type="file" ref={extraRef} multiple onChange={e=>setExtraFiles([...e.target.files])} style={{display:"none"}}/>
        {extraFiles.length>0&&<p style={{fontSize:11,color:G.primary,marginBottom:6}}>📎 {extraFiles.length} file(s)</p>}
        <div style={{display:"flex",gap:8,alignItems:"flex-end",flexDirection:isAr?"row-reverse":"row"}}>
          <button onClick={()=>extraRef.current.click()} style={{background:G.accentLight,border:"none",borderRadius:10,padding:"10px",color:G.primary,flexShrink:0,fontSize:16,cursor:"pointer"}}>📎</button>
          <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder={messages.length===0?t.describeLesson:t.followUp} style={{flex:1,minHeight:44,maxHeight:140,background:G.surface,border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 12px",fontFamily,fontSize:14,resize:"none",color:G.text,lineHeight:1.5,direction:dir}} rows={1}/>
          <button onClick={sendChat} disabled={!cs} style={{background:cs?G.primary:G.border,border:"none",borderRadius:10,padding:"10px 16px",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0,cursor:"pointer"}}>{t.send}</button>
        </div>
      </div>
    </div>);
  }

  if(screen==="american"){
    const cg=apSubject.trim()&&apTopic.trim();
    return(<div style={S.app} className="fade"><div style={S.inner}>
      <div style={S.topBar}><button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button><span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:15}}>{t.americanSetup}</span><LB/></div>
      <div style={{flex:1,padding:isDesktop?"24px 32px":"16px",overflowY:"auto"}}>
        {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"12px",marginBottom:14,color:G.red,fontSize:13}}>{error}</div>}
        {exportSuccess&&<div style={{background:G.accentLight,border:`1px solid ${G.primary}`,borderRadius:10,padding:"12px",marginBottom:14,color:G.primary,fontSize:13,fontWeight:600}}>{t.generatedSuccess}</div>}
        <div style={{display:isDesktop?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{...S.card,marginBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><span style={S.label}>{t.subject} *</span><input value={apSubject} onChange={e=>setApSubject(e.target.value)} placeholder={t.subjectHint} style={S.input}/></div>
              <div><span style={S.label}>{t.gradeLevel}</span><input value={apGrade} onChange={e=>setApGrade(e.target.value)} placeholder="e.g. Grade 4" style={S.input}/></div>
            </div>
            <span style={S.label}>{t.topic} *</span>
            <input value={apTopic} onChange={e=>setApTopic(e.target.value)} placeholder={t.topicHint} style={{...S.input,marginBottom:10}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><span style={S.label}>{t.instructor}</span><input value={apInstructor} onChange={e=>setApInstructor(e.target.value)} placeholder={t.instructorHint} style={S.input}/></div>
              <div><span style={S.label}>{t.classField}</span><input value={apClass} onChange={e=>setApClass(e.target.value)} placeholder={t.classHint} style={S.input}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div><span style={S.label}>{t.unit}</span><input value={apUnit} onChange={e=>setApUnit(e.target.value)} placeholder={t.unitHint} style={S.input}/></div>
              <div><span style={S.label}>{t.lessonNum}</span><input value={apLesson} onChange={e=>setApLesson(e.target.value)} placeholder={t.lessonNumHint} style={S.input}/></div>
              <div><span style={S.label}>{t.week}</span><input value={apWeek} onChange={e=>setApWeek(e.target.value)} placeholder={t.weekHint} style={S.input}/></div>
            </div>
          </div>
          <div style={{...S.card,marginBottom:14}}>
            <span style={S.label}>{t.duration}</span>
            <select value={apDuration} onChange={e=>setApDuration(e.target.value)} style={{...S.input,marginBottom:10}}>{DURATIONS.map(d=><option key={d}>{d}</option>)}</select>
            <span style={S.label}>{t.standardsOptional}</span>
            <textarea value={apStandards} onChange={e=>setApStandards(e.target.value)} placeholder={t.standardsHint} style={{...S.input,minHeight:70,resize:"vertical",marginBottom:4}}/>
            <p style={{fontSize:11,color:G.muted,marginBottom:12}}>{t.autoStandards}</p>
            <span style={S.label}>{t.outputLang}</span>
            <div style={{display:"flex",gap:8}}>
              {[["en","🇬🇧 "+t.english],["ar","🇸🇦 "+t.arabic]].map(([l,lb])=>(<button key={l} onClick={()=>setApOutputLang(l)} style={{...S.chip(apOutputLang===l),flex:1,textAlign:"center"}}>{lb}</button>))}
            </div>
          </div>
        </div>
        <div style={{...S.card,marginBottom:16}}>
          <span style={S.label}>{t.outputFormat}</span>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            {[["word","📝 Word (.doc)"],["pdf","📄 PDF"],["chat","💬 In-App Preview"]].map(([v,l])=>(<button key={v} onClick={()=>setApExportFormat(v)} style={{...S.chip(apExportFormat===v),flex:1,textAlign:"center",padding:"9px 4px",fontSize:12}}>{l}</button>))}
          </div>
          {apExportFormat!=="chat"&&<p style={{fontSize:11,color:G.primary,fontWeight:600}}>✓ Output will be the filled Dar Al-Thikr 5Es template — exact format, every section populated.</p>}
        </div>
        <button onClick={generateAmericanPathway} disabled={!cg} style={{...S.btnPrimary,opacity:cg?1:.4}}>{t.generateAmerican}</button>
      </div>
    </div></div>);
  }

  if(screen==="setup"){
    const gr=ageLevel?GRADE_MAP[ageLevel]:[];const cc=frameworks.length>0&&ageLevel;
    return(<div style={S.app} className="fade"><div style={S.inner}>
      <div style={S.topBar}><button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button><span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:16}}>{t.lessonSetup}</span><LB/></div>
      <div style={{flex:1,padding:isDesktop?"24px 32px":"16px",overflowY:"auto"}}>
        <div style={{...S.card,marginBottom:14}}><span style={S.label}>{t.selectFrameworks}</span><p style={{fontSize:12,color:G.muted,marginBottom:10}}>{t.selectAll}</p><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{FRAMEWORKS.map(fw=>(<button key={fw} onClick={()=>toggleFw(fw)} style={S.chip(frameworks.includes(fw))}>{fw}</button>))}</div></div>
        <div style={{...S.card,marginBottom:14}}><span style={S.label}>{t.ageLevel}</span><div style={{display:"grid",gridTemplateColumns:isDesktop?"repeat(3,1fr)":"1fr 1fr",gap:10}}>{AGE_LEVELS.map(al=>{const on=ageLevel===al.value;return(<button key={al.value} onClick={()=>{setAgeLevel(al.value);setGradeLevel("");}} style={{padding:"12px",borderRadius:10,border:`1.5px solid ${on?G.primary:G.border}`,background:on?G.accentLight:G.white,textAlign:isAr?"right":"left",cursor:"pointer"}}><div style={{fontSize:20,marginBottom:3}}>{al.emoji}</div><div style={{fontSize:13,fontWeight:600,color:on?G.primary:G.text}}>{isAr?al.labelAr:al.label}</div><div style={{fontSize:11,color:G.muted}}>{isAr?al.subAr:al.sub}</div></button>);})}</div></div>
        {gr.length>0&&(<div style={{...S.card,marginBottom:14}}><span style={S.label}>{t.gradeLevel} <span style={{color:G.muted,textTransform:"none",letterSpacing:0,fontWeight:400}}>{t.optional}</span></span><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{gr.map(g=>(<button key={g} onClick={()=>setGradeLevel(gradeLevel===g?"":g)} style={S.chip(gradeLevel===g)}>{g}</button>))}</div></div>)}
        <FS value={outputFormat} onChange={setOutputFormat}/>
        <button onClick={()=>setScreen(mode===1?"input":"chat")} disabled={!cc} style={{...S.btnPrimary,opacity:cc?1:.4}}>{t.continue}</button>
      </div>
    </div></div>);
  }

  if(screen==="input")return(<div style={S.app} className="fade"><div style={S.inner}>
    <div style={S.topBar}><button onClick={()=>setScreen("setup")} style={{background:"none",border:"none",color:"#fff",fontSize:13,cursor:"pointer"}}>{t.back}</button><span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:16}}>{t.templateMode}</span><div style={{display:"flex",gap:6}}><LB/><button onClick={()=>setShowModal(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",borderRadius:14,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer"}}>⚡{credits}</button></div></div>
    <div style={{flex:1,padding:isDesktop?"24px 32px":"16px",overflowY:"auto"}}>
      {error&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:10,padding:"12px",marginBottom:14,color:G.red,fontSize:13}}>{error}</div>}
      <div style={{...S.card,marginBottom:14}}><span style={S.label}>{t.yourTemplate}</span><input type="file" ref={templateRef} onChange={e=>setTemplateFile(e.target.files[0])} accept=".txt,.doc,.docx" style={{display:"none"}}/><button onClick={()=>templateRef.current.click()} style={{...S.btnOutline,width:"100%",padding:"14px"}}>{templateFile?`✓  ${templateFile.name}`:t.uploadTemplate}</button><p style={{fontSize:11,color:G.muted,marginTop:8}}>Upload your template — AI reads its exact structure and fills every section, then exports the filled document.</p></div>
      <div style={{...S.card,marginBottom:14}}><span style={S.label}>{t.refFiles} <span style={{color:G.muted,textTransform:"none",fontWeight:400}}>{t.optional}</span></span><input type="file" ref={extraRef} multiple onChange={e=>setExtraFiles([...e.target.files])} style={{display:"none"}}/><button onClick={()=>extraRef.current.click()} style={{...S.btnGhost,width:"100%",padding:"12px"}}>{extraFiles.length>0?`📎  ${extraFiles.length}`:t.attachRef}</button></div>
      <FS value={outputFormat} onChange={setOutputFormat}/>
      <button onClick={generateTemplate} disabled={!templateFile} style={{...S.btnPrimary,opacity:templateFile?1:.4}}>{t.generate}</button>
    </div>
  </div></div>);

  const modes=[
    {id:1,icon:"📋",title:t.templateMode,desc:t.templateDesc,tag:t.templateTag,color:G.primary,bg:G.accentLight,onClick:()=>{setMode(1);setScreen("setup");}},
    {id:2,icon:"💬",title:t.freeMode,desc:t.freeDesc,tag:t.freeTag,color:"#2a6eb5",bg:"#e8f0fb",onClick:()=>{setMode(2);setScreen("setup");}},
    {id:3,icon:"🏫",title:t.americanMode,desc:t.americanDesc,tag:t.americanTag,color:"#7a3a9a",bg:"#f3eafc",onClick:()=>{setMode(3);setScreen("american");}},
  ];

  return(<div style={S.app}><div style={S.inner}>
    <div style={{background:G.white,borderBottom:`1px solid ${G.border}`,padding:isDesktop?"16px 32px":"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:isDesktop?44:38,height:isDesktop?44:38,borderRadius:12,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${G.primary}30`}}><TeacherIcon size={isDesktop?28:24}/></div>
        <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:isDesktop?20:17,color:G.primary,lineHeight:1}}>EduBudd</div>{isDesktop&&<div style={{fontSize:11,color:G.muted,marginTop:2}}>AI Lesson Plan Generator</div>}</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>setLang(isAr?"en":"ar")} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:20,padding:"6px 14px",color:G.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily}}>{isAr?"EN":"عر"}</button>
        <button onClick={()=>setScreen("history")} style={{...S.btnGhost,padding:"7px 12px",fontSize:13}}>📋{isDesktop?` ${t.history}`:""}</button>
        <button onClick={()=>setShowModal(true)} style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:10,padding:"7px 12px",color:G.primary,fontSize:13,fontWeight:600,cursor:"pointer"}}>⚡{credits}</button>
        <button onClick={signOut} style={{...S.btnGhost,padding:"7px 12px",fontSize:13}}>{isDesktop?t.signOut:"↗"}</button>
      </div>
    </div>
    <div style={{padding:isDesktop?"48px 32px 32px":"28px 18px 20px",textAlign:"center",background:`linear-gradient(180deg,${G.white} 0%,${G.bg} 100%)`}}>
      <div style={{width:isDesktop?88:68,height:isDesktop?88:68,borderRadius:isDesktop?24:20,background:G.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:`0 12px 40px ${G.primary}40`}}><TeacherIcon size={isDesktop?58:44}/></div>
      <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:isDesktop?42:28,color:G.primary,marginBottom:10}}>EduBudd</h1>
      <p style={{color:G.muted,fontSize:isDesktop?17:14,lineHeight:1.7,maxWidth:isDesktop?520:300,margin:"0 auto 14px"}}>{t.tagline}</p>
      <img src={LOGO_URL} alt="Dar Al-Thikr" style={{height:isDesktop?40:32,objectFit:"contain",opacity:.8}} onError={e=>e.target.style.display='none'}/>
      <p style={{color:G.primary,fontSize:13,marginTop:10,fontWeight:600}}>{t.welcome}</p>
    </div>
    <div style={{padding:isDesktop?"0 32px 40px":"0 16px 32px",flex:1}}>
      <p style={{fontSize:11,color:G.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14,fontWeight:600}}>{t.chooseMode}</p>
      <div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr 1fr":"1fr",gap:isDesktop?16:12,marginBottom:isDesktop?24:16}}>
        {modes.map(m=>(<div key={m.id} onClick={m.onClick} style={{...S.card,cursor:"pointer",display:"flex",flexDirection:isDesktop?"column":"row",gap:14,alignItems:isDesktop?"flex-start":"center"}} className="mode-card">
          <div style={{width:isDesktop?56:48,height:isDesktop?56:48,borderRadius:16,background:m.bg,border:`1px solid ${m.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isDesktop?28:22,flexShrink:0}}>{m.icon}</div>
          <div style={{flex:1}}>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:isDesktop?17:15,color:G.text,marginBottom:6}}>{m.title}</h3>
            <p style={{color:G.muted,fontSize:isDesktop?13.5:13,lineHeight:1.6}}>{m.desc}</p>
            <span style={{display:"inline-block",marginTop:8,background:m.bg,borderRadius:6,padding:"3px 10px",color:m.color,fontSize:11,fontWeight:700}}>{m.tag.toUpperCase()}</span>
          </div>
        </div>))}
      </div>
      {history.length>0&&(<div style={{...S.card,background:G.accentLight,borderColor:G.border}}>
        <p style={{fontSize:12,fontWeight:600,color:G.primary,marginBottom:10}}>{t.recentPlans}</p>
        {history.slice(0,isDesktop?4:2).map(h=>(<div key={h.id} onClick={()=>setViewingHistory(h)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${G.border}`,cursor:"pointer"}}>
          <div style={{flex:1,minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:G.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:isDesktop?280:200}}>{h.title}</p><p style={{fontSize:11,color:G.muted}}>{h.ageLevel} · {h.date}</p></div>
          <span style={{color:G.primary,fontSize:13,flexShrink:0,marginLeft:8}}>→</span>
        </div>))}
        <button onClick={()=>setScreen("history")} style={{background:"none",border:"none",color:G.primary,fontSize:12,fontWeight:600,marginTop:10,padding:0,cursor:"pointer"}}>{t.viewAll}</button>
      </div>)}
    </div>
    {showModal&&(<div style={{position:"fixed",inset:0,background:"#00000070",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowModal(false)}>
      <div style={{...S.card,width:"100%",maxWidth:480,borderRadius:"20px 20px 0 0",padding:"24px 24px 40px",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:20}}>{t.yourCredits}</h3><p style={{color:G.muted,fontSize:13,marginTop:2}}><strong style={{color:G.primary}}>{credits} {t.credits}</strong> {t.creditsLeft}</p></div>
          <button onClick={()=>setShowModal(false)} style={{background:"none",border:"none",color:G.muted,fontSize:24,cursor:"pointer"}}>×</button>
        </div>
        <div style={{background:G.accentLight,border:`1px solid ${G.border}`,borderRadius:12,padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><p style={{fontWeight:600,fontSize:15,marginBottom:3}}>{t.watchAd}</p><p style={{color:G.muted,fontSize:12}}>{t.watchAdDesc}</p>{adDone&&<p style={{color:G.primary,fontSize:12,marginTop:4,fontWeight:600}}>{t.creditAdded}</p>}</div>
            <button onClick={watchAd} disabled={adTimer!==null} style={{background:G.primary,color:"#fff",border:"none",borderRadius:10,padding:"11px 20px",fontFamily,fontWeight:600,fontSize:14,cursor:"pointer"}}>{adTimer!==null?`${adTimer}s…`:t.watch}</button>
          </div>
          {adTimer!==null&&(<div style={{marginTop:12,height:4,borderRadius:2,background:G.border}}><div style={{height:"100%",borderRadius:2,background:G.primary,width:`${((5-adTimer)/5)*100}%`,transition:"width 1s linear"}}/></div>)}
        </div>
      </div>
    </div>)}
  </div></div>);
}
