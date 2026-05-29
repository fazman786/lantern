import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════ */
export const C = {
  bg:        "#070C16",
  surf:      "#0D1422",
  surf2:     "#131D30",
  surf3:     "#192240",
  border:    "#1A2840",
  accent:    "#E9A84C",
  accentBg:  "rgba(233,168,76,0.10)",
  text:      "#EDE8DF",
  text2:     "#7B8FA8",
  text3:     "#3A4E64",
  success:   "#3EBF8A",
  danger:    "#E8574A",
  warning:   "#F0A500",
};

export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS  = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ═══════════════════════════════════════════════════════
   CATEGORIES  (escalation injected per-country at runtime)
═══════════════════════════════════════════════════════ */
export const CATS = [
  { id:"debt",       label:"Debt & Bills",       emoji:"💳", color:"#E8574A" },
  { id:"legal",      label:"Legal Letters",       emoji:"⚖️", color:"#8B7EE8" },
  { id:"contract",   label:"Contracts",           emoji:"📋", color:"#E9A84C" },
  { id:"tax",        label:"Tax & Revenue",       emoji:"🧾", color:"#3EBF8A" },
  { id:"benefits",   label:"Benefits & Housing",  emoji:"🏠", color:"#4BA3E8" },
  { id:"employment", label:"Employment",          emoji:"💼", color:"#E87B4B" },
];

/* ═══════════════════════════════════════════════════════
   COUNTRY CONFIG
═══════════════════════════════════════════════════════ */
export const COUNTRY_CONFIG = {
  // ── ENGLISH-SPEAKING ──────────────────────────────────
  gb: {
    name:"United Kingdom", flag:"🇬🇧", currency:"£", legalSystem:"England and Wales / UK law",
    escalation:{
      debt:      {name:"StepChange",        url:"https://www.stepchange.org",                        phone:"0800 138 1111",  desc:"Free debt advice"},
      legal:     {name:"Citizens Advice",   url:"https://www.citizensadvice.org.uk",                 phone:"0800 144 8848",  desc:"Free legal guidance"},
      contract:  {name:"Citizens Advice",   url:"https://www.citizensadvice.org.uk",                 phone:"0800 144 8848",  desc:"Free contract advice"},
      tax:       {name:"TaxAid",            url:"https://taxaid.org.uk",                             phone:"0345 120 3779",  desc:"Free tax help"},
      benefits:  {name:"Shelter",           url:"https://www.shelter.org.uk",                        phone:"0808 800 4444",  desc:"Free housing & benefits advice"},
      employment:{name:"ACAS",              url:"https://www.acas.org.uk",                           phone:"0300 123 1100",  desc:"Free employment advice"},
    },
  },
  us: {
    name:"United States", flag:"🇺🇸", currency:"$", legalSystem:"US federal and state law",
    escalation:{
      debt:      {name:"NFCC",              url:"https://www.nfcc.org",                              phone:"1-800-388-2227", desc:"Free credit counselling"},
      legal:     {name:"LSC Legal Aid",     url:"https://www.lsc.gov/about-lsc/what-we-do/find-legal-aid", phone:null,     desc:"Free legal aid locator"},
      contract:  {name:"LSC Legal Aid",     url:"https://www.lsc.gov/about-lsc/what-we-do/find-legal-aid", phone:null,     desc:"Free legal aid locator"},
      tax:       {name:"IRS Helpline",      url:"https://www.irs.gov",                               phone:"1-800-829-1040",desc:"IRS taxpayer assistance"},
      benefits:  {name:"HUD Housing",       url:"https://www.hud.gov/findhelp",                      phone:"1-800-569-4287",desc:"Free housing counselling"},
      employment:{name:"EEOC",              url:"https://www.eeoc.gov",                              phone:"1-800-669-4000",desc:"Employment rights body"},
    },
  },
  au: {
    name:"Australia", flag:"🇦🇺", currency:"A$", legalSystem:"Australian federal and state law",
    escalation:{
      debt:      {name:"National Debt Helpline", url:"https://ndh.org.au",                           phone:"1800 007 007",  desc:"Free financial counselling"},
      legal:     {name:"Law Access NSW",    url:"https://www.lawaccess.nsw.gov.au",                  phone:"1300 888 529",  desc:"Free legal information"},
      contract:  {name:"Consumer Affairs",  url:"https://www.consumerlaw.gov.au",                    phone:null,            desc:"Consumer rights guidance"},
      tax:       {name:"ATO",               url:"https://www.ato.gov.au",                            phone:"13 28 61",      desc:"ATO taxpayer support"},
      benefits:  {name:"Services Australia",url:"https://www.servicesaustralia.gov.au",              phone:"132 300",       desc:"Centrelink & housing help"},
      employment:{name:"Fair Work Ombudsman",url:"https://www.fairwork.gov.au",                      phone:"13 13 94",      desc:"Free employment advice"},
    },
  },
  ca: {
    name:"Canada", flag:"🇨🇦", currency:"CA$", legalSystem:"Canadian federal and provincial law",
    escalation:{
      debt:      {name:"Credit Counselling Canada", url:"https://creditcounsellingcanada.ca",        phone:"1-866-398-5999",desc:"Free debt counselling"},
      legal:     {name:"Legal Aid Canada",  url:"https://www.legalaid.on.ca",                        phone:null,            desc:"Find legal aid near you"},
      contract:  {name:"Legal Aid Canada",  url:"https://www.legalaid.on.ca",                        phone:null,            desc:"Find legal aid near you"},
      tax:       {name:"CRA",               url:"https://www.canada.ca/en/revenue-agency.html",      phone:"1-800-959-8281",desc:"CRA taxpayer services"},
      benefits:  {name:"Service Canada",    url:"https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html", phone:"1-800-622-6232", desc:"Benefits & housing help"},
      employment:{name:"Employment Canada", url:"https://www.canada.ca/en/employment-social-development.html", phone:"1-800-622-6232", desc:"Employment rights"},
    },
  },
  ie: {
    name:"Ireland", flag:"🇮🇪", currency:"€", legalSystem:"Irish law",
    escalation:{
      debt:      {name:"MABS",              url:"https://www.mabs.ie",                               phone:"0818 07 2000",  desc:"Free money advice"},
      legal:     {name:"FLAC",              url:"https://www.flac.ie",                               phone:"1800 906 693",  desc:"Free legal advice centres"},
      contract:  {name:"CCPC",              url:"https://www.ccpc.ie",                               phone:"01 402 5555",   desc:"Consumer rights"},
      tax:       {name:"Revenue",           url:"https://www.revenue.ie",                            phone:"01 738 3663",   desc:"Revenue taxpayer support"},
      benefits:  {name:"Threshold",         url:"https://www.threshold.ie",                          phone:"1800 454 454",  desc:"Free housing advice"},
      employment:{name:"Workplace Relations",url:"https://www.workplacerelations.ie",                phone:"0818 80 80 90", desc:"Free employment guidance"},
    },
  },
  nz: {
    name:"New Zealand", flag:"🇳🇿", currency:"NZ$", legalSystem:"New Zealand law",
    escalation:{
      debt:      {name:"MoneyTalks",        url:"https://www.moneytalks.co.nz",                      phone:"0800 345 123",  desc:"Free financial advice"},
      legal:     {name:"Community Law",     url:"https://communitylaw.org.nz",                       phone:null,            desc:"Free community legal centres"},
      contract:  {name:"Consumer NZ",       url:"https://www.consumer.org.nz",                       phone:null,            desc:"Consumer rights guidance"},
      tax:       {name:"IRD",               url:"https://www.ird.govt.nz",                           phone:"0800 775 247",  desc:"IRD taxpayer support"},
      benefits:  {name:"Tenancy Services",  url:"https://www.tenancy.govt.nz",                       phone:"0800 836 262",  desc:"Housing & tenancy advice"},
      employment:{name:"Employment NZ",     url:"https://www.employment.govt.nz",                    phone:"0800 209 020",  desc:"Free employment guidance"},
    },
  },
  za: {
    name:"South Africa", flag:"🇿🇦", currency:"R", legalSystem:"South African law",
    escalation:{
      debt:      {name:"DebtBusters",       url:"https://www.debtbusters.co.za",                     phone:"0861 663 328",  desc:"Debt counselling"},
      legal:     {name:"Legal Aid SA",      url:"https://legal-aid.co.za",                           phone:"0800 110 110",  desc:"Free legal aid"},
      contract:  {name:"National Consumer Commission", url:"https://www.thencc.org.za",              phone:"012 428 7000",  desc:"Consumer rights"},
      tax:       {name:"SARS",              url:"https://www.sars.gov.za",                           phone:"0800 00 7277",  desc:"SARS tax support"},
      benefits:  {name:"SASSA",             url:"https://www.sassa.gov.za",                          phone:"0800 60 10 11", desc:"Social grants & housing"},
      employment:{name:"CCMA",              url:"https://www.ccma.org.za",                           phone:"0861 16 2762",  desc:"Free employment dispute body"},
    },
  },
  ng: {
    name:"Nigeria", flag:"🇳🇬", currency:"₦", legalSystem:"Nigerian federal and state law",
    escalation:{
      debt:      {name:"CBN Consumer Protection", url:"https://www.cbn.gov.ng",                      phone:"07002255226",   desc:"Central Bank consumer line"},
      legal:     {name:"NBA Legal Aid",     url:"https://nigerianbar.org.ng",                        phone:null,            desc:"Nigerian Bar Association"},
      contract:  {name:"FCCPC",             url:"https://www.fccpc.gov.ng",                          phone:"09-2900000",    desc:"Consumer protection body"},
      tax:       {name:"FIRS",              url:"https://www.firs.gov.ng",                           phone:"0800 102 2500", desc:"Federal Inland Revenue"},
      benefits:  {name:"Ministry of Housing",url:"https://www.housingministry.gov.ng",               phone:null,            desc:"Federal housing ministry"},
      employment:{name:"National Industrial Court", url:"https://www.nicn.gov.ng",                   phone:null,            desc:"Employment rights tribunal"},
    },
  },
  ke: {
    name:"Kenya", flag:"🇰🇪", currency:"KSh", legalSystem:"Kenyan law",
    escalation:{
      debt:      {name:"CBK Consumer Dept", url:"https://www.centralbank.go.ke",                     phone:"254 20 2860000",desc:"Central Bank Kenya"},
      legal:     {name:"Legal Aid Centre",  url:"https://www.nlas.go.ke",                            phone:"0800 723 253",  desc:"National Legal Aid Service"},
      contract:  {name:"CAK",               url:"https://www.consumerprotection.or.ke",              phone:"0800 723 253",  desc:"Consumer protection body"},
      tax:       {name:"KRA",               url:"https://www.kra.go.ke",                             phone:"0800 721 469",  desc:"Kenya Revenue Authority"},
      benefits:  {name:"Ministry of Housing",url:"https://www.housing.go.ke",                        phone:null,            desc:"Kenya housing ministry"},
      employment:{name:"Employment Court",   url:"https://www.employmentcourt.go.ke",                phone:null,            desc:"Employment & Labour Court"},
    },
  },
  gh: {
    name:"Ghana", flag:"🇬🇭", currency:"GH₵", legalSystem:"Ghanaian law",
    escalation:{
      debt:      {name:"Bank of Ghana",     url:"https://www.bog.gov.gh",                            phone:"0800 100 111",  desc:"BOG consumer helpline"},
      legal:     {name:"Legal Aid Commission",url:"https://legalaid.gov.gh",                         phone:"0302 670 218",  desc:"Free legal aid"},
      contract:  {name:"GCC",               url:"https://gcc.gov.gh",                               phone:"0302 685 060",  desc:"Ghana Consumer Commission"},
      tax:       {name:"GRA",               url:"https://gra.gov.gh",                               phone:"0800 900 100",  desc:"Ghana Revenue Authority"},
      benefits:  {name:"SSNIT",             url:"https://www.ssnit.org.gh",                         phone:"0302 781 300",  desc:"Social security & pensions"},
      employment:{name:"NLRC",              url:"https://www.labour.gov.gh",                        phone:null,            desc:"National Labour Commission"},
    },
  },
  // ── MIDDLE EAST ───────────────────────────────────────
  ae: {
    name:"United Arab Emirates", flag:"🇦🇪", currency:"AED", legalSystem:"UAE federal law and emirate-level regulations",
    escalation:{
      debt:      {name:"Al Etihad Credit Bureau", url:"https://www.aecb.gov.ae",                     phone:"600 500 900",   desc:"Credit & debt information"},
      legal:     {name:"Dubai Legal Affairs Dept",url:"https://lad.dubai.gov.ae",                    phone:"800 4444",      desc:"Legal aid & guidance"},
      contract:  {name:"DED Consumer Rights",     url:"https://www.dubaided.gov.ae",                 phone:"600 545 555",   desc:"Dubai consumer protection"},
      tax:       {name:"Federal Tax Authority",   url:"https://tax.gov.ae",                          phone:"600 599 994",   desc:"UAE VAT & tax support"},
      benefits:  {name:"MOHRE",                   url:"https://www.mohre.gov.ae",                    phone:"800 60",        desc:"Ministry of Human Resources"},
      employment:{name:"MOHRE Disputes",          url:"https://www.mohre.gov.ae",                    phone:"800 60",        desc:"Free labour dispute service"},
    },
  },
  sa: {
    name:"Saudi Arabia", flag:"🇸🇦", currency:"SAR", legalSystem:"Saudi Arabian law (Sharia-based)",
    escalation:{
      debt:      {name:"SAMA Consumer Protection",url:"https://www.sama.gov.sa",                     phone:"800 125 6666",  desc:"Saudi Central Bank helpline"},
      legal:     {name:"Ministry of Justice",     url:"https://www.moj.gov.sa",                      phone:"920 001 717",   desc:"MOJ legal guidance"},
      contract:  {name:"NCNC",                    url:"https://www.mc.gov.sa",                       phone:"1900",          desc:"Consumer protection"},
      tax:       {name:"ZATCA",                   url:"https://www.zatca.gov.sa",                    phone:"19993",         desc:"Zakat, Tax & Customs Authority"},
      benefits:  {name:"Ministry of Housing",     url:"https://www.housing.gov.sa",                  phone:"920 002 555",   desc:"Housing support"},
      employment:{name:"HRSD",                    url:"https://www.hrsd.gov.sa",                     phone:"19911",         desc:"Human Resources Ministry"},
    },
  },
  qa: {
    name:"Qatar", flag:"🇶🇦", currency:"QAR", legalSystem:"Qatari law",
    escalation:{
      debt:      {name:"QCB Consumer Protection", url:"https://www.qcb.gov.qa",                      phone:"44456456",      desc:"Qatar Central Bank"},
      legal:     {name:"Ministry of Justice",     url:"https://www.moj.gov.qa",                      phone:"16006",         desc:"Legal guidance & aid"},
      contract:  {name:"MEC Consumer Protection", url:"https://www.mec.gov.qa",                      phone:"16001",         desc:"Consumer rights"},
      tax:       {name:"GTA Qatar",               url:"https://www.gta.gov.qa",                      phone:"16565",         desc:"General Tax Authority"},
      benefits:  {name:"Ashghal",                 url:"https://www.ashghal.gov.qa",                  phone:"16000",         desc:"Housing & public works"},
      employment:{name:"ADLSA",                   url:"https://www.adlsa.gov.qa",                    phone:"16008",         desc:"Labour dispute resolution"},
    },
  },
  bh: {
    name:"Bahrain", flag:"🇧🇭", currency:"BHD", legalSystem:"Bahraini law",
    escalation:{
      debt:      {name:"CBB Consumer Protection", url:"https://www.cbb.gov.bh",                      phone:"17547777",      desc:"Central Bank of Bahrain"},
      legal:     {name:"MOJ Bahrain",             url:"https://www.moj.gov.bh",                      phone:"17531111",      desc:"Ministry of Justice"},
      contract:  {name:"Tamkeen / MoIC",          url:"https://www.moic.gov.bh",                     phone:"80001111",      desc:"Consumer protection body"},
      tax:       {name:"National Bureau for Revenue",url:"https://www.nbr.gov.bh",                   phone:"80001003",      desc:"VAT & tax support"},
      benefits:  {name:"Ministry of Housing",     url:"https://www.housing.gov.bh",                  phone:"80008001",      desc:"Housing support"},
      employment:{name:"LMRA",                    url:"https://www.lmra.gov.bh",                     phone:"17506055",      desc:"Labour Market Regulatory Authority"},
    },
  },
  kw: {
    name:"Kuwait", flag:"🇰🇼", currency:"KWD", legalSystem:"Kuwaiti law",
    escalation:{
      debt:      {name:"CBK Consumer Protection", url:"https://www.cbk.gov.kw",                      phone:"22180000",      desc:"Central Bank of Kuwait"},
      legal:     {name:"Ministry of Justice",     url:"https://www.moj.gov.kw",                      phone:"1800600",       desc:"Legal guidance"},
      contract:  {name:"Consumer Protection Dept",url:"https://www.moci.gov.kw",                     phone:"1801201",       desc:"Consumer protection"},
      tax:       {name:"MOFKW",                   url:"https://www.mof.gov.kw",                      phone:"22495100",      desc:"Ministry of Finance Kuwait"},
      benefits:  {name:"Public Authority for Housing",url:"https://www.housing.gov.kw",              phone:"1840000",       desc:"Housing support"},
      employment:{name:"PACI / MOJ",              url:"https://www.moj.gov.kw",                      phone:"1800600",       desc:"Labour dispute guidance"},
    },
  },
  om: {
    name:"Oman", flag:"🇴🇲", currency:"OMR", legalSystem:"Omani law",
    escalation:{
      debt:      {name:"CBO Consumer Protection", url:"https://www.cbo.gov.om",                      phone:"24777777",      desc:"Central Bank of Oman"},
      legal:     {name:"Ministry of Justice",     url:"https://www.moj.gov.om",                      phone:"24604000",      desc:"Legal guidance"},
      contract:  {name:"Consumer Protection Authority",url:"https://www.cpa.gov.om",                 phone:"80077776",      desc:"Consumer rights"},
      tax:       {name:"Tax Authority Oman",      url:"https://taa.gov.om",                          phone:"24813600",      desc:"Tax Authority"},
      benefits:  {name:"Ministry of Housing",     url:"https://www.moh.gov.om",                      phone:"24696969",      desc:"Housing support"},
      employment:{name:"Ministry of Labour",      url:"https://www.mol.gov.om",                      phone:"80077775",      desc:"Labour dispute resolution"},
    },
  },
  eg: {
    name:"Egypt", flag:"🇪🇬", currency:"EGP", legalSystem:"Egyptian law",
    escalation:{
      debt:      {name:"CBE Consumer Protection", url:"https://www.cbe.org.eg",                      phone:"16789",         desc:"Central Bank of Egypt"},
      legal:     {name:"Ministry of Justice",     url:"https://www.justice.gov.eg",                  phone:"08008880088",   desc:"Legal guidance"},
      contract:  {name:"CPA Egypt",               url:"https://www.cpa.gov.eg",                      phone:"19588",         desc:"Consumer Protection Agency"},
      tax:       {name:"Egyptian Tax Authority",  url:"https://www.eta.gov.eg",                      phone:"16395",         desc:"Tax support"},
      benefits:  {name:"Ministry of Social Solidarity",url:"https://www.moss.gov.eg",                phone:"08008880000",   desc:"Social housing & benefits"},
      employment:{name:"Ministry of Manpower",    url:"https://www.manpower.gov.eg",                 phone:"08008880077",   desc:"Labour relations"},
    },
  },
  // ── ASIA ──────────────────────────────────────────────
  in: {
    name:"India", flag:"🇮🇳", currency:"₹", legalSystem:"Indian law (central and state)",
    escalation:{
      debt:      {name:"RBI Ombudsman",     url:"https://rbi.org.in/Scripts/Complaints.aspx",        phone:"14448",         desc:"RBI banking ombudsman"},
      legal:     {name:"NALSA",             url:"https://nalsa.gov.in",                              phone:"15100",         desc:"Free legal aid — NALSA"},
      contract:  {name:"National Consumer Helpline",url:"https://consumerhelpline.gov.in",           phone:"1800 11 4000",  desc:"Consumer rights helpline"},
      tax:       {name:"Income Tax Helpline",url:"https://www.incometax.gov.in",                     phone:"1800 103 0025", desc:"Income tax support"},
      benefits:  {name:"PM Awas Yojana",    url:"https://pmaymis.gov.in",                            phone:"1800 11 6163",  desc:"Housing scheme helpline"},
      employment:{name:"Labour Helpline",   url:"https://labour.gov.in",                             phone:"1800 11 0088",  desc:"Central labour helpline"},
    },
  },
  sg: {
    name:"Singapore", flag:"🇸🇬", currency:"S$", legalSystem:"Singapore law",
    escalation:{
      debt:      {name:"Credit Counselling Singapore",url:"https://www.ccs.org.sg",                  phone:"1800 225 5227", desc:"Free debt counselling"},
      legal:     {name:"Law Society Pro Bono",url:"https://www.lawsocprobono.org",                   phone:"1800 2255 529", desc:"Free legal guidance"},
      contract:  {name:"CASE",              url:"https://www.case.org.sg",                           phone:"6100 0315",     desc:"Consumer rights body"},
      tax:       {name:"IRAS",              url:"https://www.iras.gov.sg",                           phone:"1800 356 8300", desc:"Inland Revenue Authority"},
      benefits:  {name:"HDB",               url:"https://www.hdb.gov.sg",                            phone:"1800 225 5432", desc:"Housing Development Board"},
      employment:{name:"MOM Helpline",      url:"https://www.mom.gov.sg",                            phone:"6438 5122",     desc:"Ministry of Manpower"},
    },
  },
  ph: {
    name:"Philippines", flag:"🇵🇭", currency:"₱", legalSystem:"Philippine law",
    escalation:{
      debt:      {name:"BSP Consumer Protection",url:"https://www.bsp.gov.ph",                       phone:"(02) 8708 7087",desc:"Bangko Sentral helpline"},
      legal:     {name:"PAO",               url:"https://pao.gov.ph",                                phone:"(02) 929 9010", desc:"Public Attorney's Office — free"},
      contract:  {name:"DTI Consumer Care", url:"https://www.dti.gov.ph",                            phone:"1-384",         desc:"Dept of Trade consumer line"},
      tax:       {name:"BIR",               url:"https://www.bir.gov.ph",                            phone:"(02) 8538 3200",desc:"Bureau of Internal Revenue"},
      benefits:  {name:"DSWD",              url:"https://www.dswd.gov.ph",                           phone:"8888",          desc:"Social welfare & housing"},
      employment:{name:"NLRC",              url:"https://www.nlrc.dole.gov.ph",                      phone:"(02) 8527 2181",desc:"National Labour Relations Commission"},
    },
  },
  my: {
    name:"Malaysia", flag:"🇲🇾", currency:"RM", legalSystem:"Malaysian law",
    escalation:{
      debt:      {name:"AKPK",              url:"https://www.akpk.org.my",                           phone:"1800 88 2575",  desc:"Free debt management"},
      legal:     {name:"Bar Council Legal Aid",url:"https://www.malaysianbar.org.my",                phone:"03-2050 2050",  desc:"Legal aid centres"},
      contract:  {name:"KPDNHEP",           url:"https://www.kpdnhep.gov.my",                        phone:"1800 886 800",  desc:"Consumer protection"},
      tax:       {name:"LHDN / IRB",        url:"https://www.hasil.gov.my",                          phone:"1-800-88-5436", desc:"Inland Revenue Board"},
      benefits:  {name:"KPKT Housing",      url:"https://www.kpkt.gov.my",                           phone:"03-8891 5000",  desc:"Housing & local government"},
      employment:{name:"JTK / JTKSM",       url:"https://www.jtksm.mohr.gov.my",                     phone:"03-8886 5000",  desc:"Labour Dept — free mediation"},
    },
  },
  pk: {
    name:"Pakistan", flag:"🇵🇰", currency:"PKR", legalSystem:"Pakistani law",
    escalation:{
      debt:      {name:"SBP Banking Mohtasib",url:"https://www.sbp.org.pk",                          phone:"111-727-273",   desc:"State Bank ombudsman"},
      legal:     {name:"PILDAT Legal Aid",  url:"https://www.pildat.org",                            phone:null,            desc:"Legal aid resources"},
      contract:  {name:"PCPA",              url:"https://www.moci.gov.pk",                           phone:"0800-12120",    desc:"Consumer protection"},
      tax:       {name:"FBR",               url:"https://www.fbr.gov.pk",                            phone:"051-111-772-772",desc:"Federal Board of Revenue"},
      benefits:  {name:"Ehsaas Programme",  url:"https://ehsaas.nadra.gov.pk",                       phone:"0800-26477",    desc:"Social protection helpline"},
      employment:{name:"NIRC",              url:"https://www.nirc.gov.pk",                           phone:"051-9211574",   desc:"National Industrial Relations Commission"},
    },
  },
  bd: {
    name:"Bangladesh", flag:"🇧🇩", currency:"৳", legalSystem:"Bangladeshi law",
    escalation:{
      debt:      {name:"Bangladesh Bank",   url:"https://www.bb.org.bd",                             phone:"16236",         desc:"Central bank consumer protection"},
      legal:     {name:"National Legal Aid",url:"https://www.nlaso.gov.bd",                          phone:"16430",         desc:"Free legal aid services"},
      contract:  {name:"Directorate of National Consumer Rights",url:"https://www.dncrp.gov.bd",     phone:"16121",         desc:"Consumer rights"},
      tax:       {name:"NBR",               url:"https://www.nbr.gov.bd",                            phone:"16579",         desc:"National Board of Revenue"},
      benefits:  {name:"Ministry of Housing",url:"https://mhpw.gov.bd",                              phone:"02-9512661",    desc:"Housing & public works"},
      employment:{name:"Dept of Labour",    url:"https://dol.gov.bd",                                phone:"16357",         desc:"Labour & employment"},
    },
  },
  jp: {
    name:"Japan", flag:"🇯🇵", currency:"¥", legalSystem:"Japanese law",
    escalation:{
      debt:      {name:"Japan Legal Support Centre",url:"https://www.houterasu.or.jp",               phone:"0570 078374",   desc:"Free legal & debt help"},
      legal:     {name:"Japan Legal Support Centre",url:"https://www.houterasu.or.jp",               phone:"0570 078374",   desc:"Houterasu free legal aid"},
      contract:  {name:"Consumer Affairs Agency",url:"https://www.caa.go.jp",                        phone:"188",           desc:"Consumer hotline"},
      tax:       {name:"NTA",               url:"https://www.nta.go.jp",                             phone:"0570 00 5901",  desc:"National Tax Agency"},
      benefits:  {name:"Ministry of Land & Housing",url:"https://www.mlit.go.jp",                    phone:"0570 000 936",  desc:"Housing consultation"},
      employment:{name:"General Labor Consultation",url:"https://www.mhlw.go.jp",                    phone:"0120 811 610",  desc:"Free labour consultation"},
    },
  },
  hk: {
    name:"Hong Kong", flag:"🇭🇰", currency:"HK$", legalSystem:"Hong Kong law (common law)",
    escalation:{
      debt:      {name:"HKMA Complaint Line",url:"https://www.hkma.gov.hk",                          phone:"2878 1160",     desc:"HKMA consumer complaints"},
      legal:     {name:"Legal Aid Dept",    url:"https://www.lad.gov.hk",                            phone:"2537 7677",     desc:"Free legal aid"},
      contract:  {name:"Consumer Council",  url:"https://www.consumer.org.hk",                       phone:"2929 2222",     desc:"Consumer rights body"},
      tax:       {name:"IRD Hong Kong",     url:"https://www.ird.gov.hk",                            phone:"187 8022",      desc:"Inland Revenue Dept"},
      benefits:  {name:"SWD Housing",       url:"https://www.swd.gov.hk",                            phone:"2343 2255",     desc:"Social Welfare Dept"},
      employment:{name:"Labour Dept",       url:"https://www.labour.gov.hk",                         phone:"2717 1771",     desc:"Free employment advice"},
    },
  },
  // ── EUROPE ────────────────────────────────────────────
  de: {
    name:"Germany", flag:"🇩🇪", currency:"€", legalSystem:"German law",
    escalation:{
      debt:      {name:"Schuldnerberatung",  url:"https://www.schuldnerberatung.de",                 phone:null,            desc:"Free debt counselling"},
      legal:     {name:"Rechtsantragstelle", url:"https://www.bmj.de",                               phone:null,            desc:"Legal aid at local courts"},
      contract:  {name:"Verbraucherzentrale",url:"https://www.verbraucherzentrale.de",               phone:"0900 1 400 400", desc:"Consumer advice centre"},
      tax:       {name:"Finanzamt",          url:"https://www.bzst.de",                              phone:null,            desc:"Local tax office"},
      benefits:  {name:"Mieterschutzverein", url:"https://www.mieterschutzbund.de",                  phone:null,            desc:"Tenant protection association"},
      employment:{name:"Arbeitsgericht",     url:"https://www.bmas.de",                              phone:"030 221911006",  desc:"Labour court & employment rights"},
    },
  },
  fr: {
    name:"France", flag:"🇫🇷", currency:"€", legalSystem:"French law",
    escalation:{
      debt:      {name:"Banque de France",   url:"https://particuliers.banque-france.fr",            phone:"3414",          desc:"Free debt mediation"},
      legal:     {name:"Aide Juridictionnelle",url:"https://www.service-public.fr/particuliers/vosdroits/F18074", phone:null, desc:"Free legal aid"},
      contract:  {name:"DGCCRF",             url:"https://www.economie.gouv.fr/dgccrf",              phone:"3939",          desc:"Consumer rights body"},
      tax:       {name:"Impôts — DGFiP",     url:"https://www.impots.gouv.fr",                       phone:"0809 401 401",  desc:"Tax authority helpline"},
      benefits:  {name:"ANIL",               url:"https://www.anil.org",                             phone:"0970 680 830",  desc:"Housing information"},
      employment:{name:"Conseil de Prud'hommes",url:"https://www.service-public.fr",                 phone:"3939",          desc:"Labour court & employment"},
    },
  },
  es: {
    name:"Spain", flag:"🇪🇸", currency:"€", legalSystem:"Spanish law",
    escalation:{
      debt:      {name:"Banco de España",    url:"https://www.bde.es",                               phone:"900 545 454",   desc:"Consumer complaints helpline"},
      legal:     {name:"Turno de Oficio",    url:"https://www.mjusticia.gob.es",                     phone:"900 150 000",   desc:"Free legal aid"},
      contract:  {name:"OMIC",               url:"https://www.consumo.gob.es",                       phone:"900 200 099",   desc:"Consumer rights body"},
      tax:       {name:"AEAT",               url:"https://www.agenciatributaria.es",                 phone:"901 200 345",   desc:"Tax Agency helpline"},
      benefits:  {name:"SEPE / IMSERSO",     url:"https://www.sepe.es",                              phone:"900 818 900",   desc:"Benefits & housing support"},
      employment:{name:"SMAC",               url:"https://www.mites.gob.es",                         phone:"900 818 900",   desc:"Labour mediation centre"},
    },
  },
  nl: {
    name:"Netherlands", flag:"🇳🇱", currency:"€", legalSystem:"Dutch law",
    escalation:{
      debt:      {name:"NVVK",               url:"https://www.nvvk.nl",                              phone:null,            desc:"Debt restructuring association"},
      legal:     {name:"Juridisch Loket",    url:"https://www.juridischloket.nl",                    phone:"0900 8020",     desc:"Free legal guidance"},
      contract:  {name:"ACM Consuwijzer",    url:"https://www.consuwijzer.nl",                       phone:"088 070 70 70", desc:"Consumer rights body"},
      tax:       {name:"Belastingdienst",    url:"https://www.belastingdienst.nl",                   phone:"0800 0543",     desc:"Tax authority helpline"},
      benefits:  {name:"Huurcommissie",      url:"https://www.huurcommissie.nl",                     phone:"070 373 87 00", desc:"Rent tribunal & housing"},
      employment:{name:"UWV",                url:"https://www.uwv.nl",                               phone:"0900 9294",     desc:"Employment & benefits body"},
    },
  },
  se: {
    name:"Sweden", flag:"🇸🇪", currency:"kr", legalSystem:"Swedish law",
    escalation:{
      debt:      {name:"Kronofogden",        url:"https://www.kronofogden.se",                       phone:"0771 73 73 00", desc:"Debt restructuring agency"},
      legal:     {name:"Rättshjälp",         url:"https://www.domstol.se",                           phone:"0771 73 73 00", desc:"Legal aid scheme"},
      contract:  {name:"Konsumentverket",    url:"https://www.konsumentverket.se",                   phone:"0771 42 33 00", desc:"Consumer rights authority"},
      tax:       {name:"Skatteverket",       url:"https://www.skatteverket.se",                      phone:"0771 567 567",  desc:"Swedish Tax Agency"},
      benefits:  {name:"Hyresgästföreningen",url:"https://www.hyresgastforeningen.se",               phone:"0771 443 443",  desc:"Tenants association"},
      employment:{name:"Arbetsförmedlingen", url:"https://www.arbetsformedlingen.se",                phone:"0771 416 416",  desc:"Employment service"},
    },
  },
  no: {
    name:"Norway", flag:"🇳🇴", currency:"kr", legalSystem:"Norwegian law",
    escalation:{
      debt:      {name:"Gjeldsrådgivning",   url:"https://www.nav.no",                               phone:"55 55 33 33",   desc:"NAV debt counselling"},
      legal:     {name:"Fri rettshjelp",     url:"https://www.saltsalten.no",                        phone:null,            desc:"Free legal aid scheme"},
      contract:  {name:"Forbrukertilsynet",  url:"https://www.forbrukertilsynet.no",                 phone:"23 400 600",    desc:"Consumer authority"},
      tax:       {name:"Skatteetaten",       url:"https://www.skatteetaten.no",                      phone:"800 80 000",    desc:"Norwegian Tax Administration"},
      benefits:  {name:"Husbanken",          url:"https://www.husbanken.no",                         phone:"02540",         desc:"Housing bank & benefits"},
      employment:{name:"Arbeidstilsynet",    url:"https://www.arbeidstilsynet.no",                   phone:"73 19 97 00",   desc:"Labour inspection & rights"},
    },
  },
  ch: {
    name:"Switzerland", flag:"🇨🇭", currency:"CHF", legalSystem:"Swiss law (cantonal & federal)",
    escalation:{
      debt:      {name:"SchuldnerBeratung",  url:"https://www.schulden.ch",                          phone:null,            desc:"Debt counselling directory"},
      legal:     {name:"Unentgeltliche Rechtspflege",url:"https://www.ch.ch/en/legal-aid",           phone:null,            desc:"Free legal aid"},
      contract:  {name:"SKS",               url:"https://www.konsumentenschutz.ch",                  phone:"031 370 24 24", desc:"Consumer protection"},
      tax:       {name:"Eidg. Steuerverwaltung",url:"https://www.estv.admin.ch",                     phone:"058 462 71 06", desc:"Federal Tax Administration"},
      benefits:  {name:"Mieterverband",      url:"https://www.mieterverband.ch",                     phone:"0900 200 024",  desc:"Tenant association"},
      employment:{name:"Seco / RAV",         url:"https://www.seco.admin.ch",                        phone:"0800 700 506",  desc:"State Secretariat for Economic Affairs"},
    },
  },
  pt: {
    name:"Portugal", flag:"🇵🇹", currency:"€", legalSystem:"Portuguese law",
    escalation:{
      debt:      {name:"Banco de Portugal",  url:"https://www.bportugal.pt",                         phone:"707 502 502",   desc:"Central bank consumer line"},
      legal:     {name:"SIEJ",               url:"https://www.dgaj.mj.pt",                           phone:"217 900 450",   desc:"Free legal aid"},
      contract:  {name:"DECO",               url:"https://www.deco.proteste.pt",                     phone:"213 710 240",   desc:"Consumer rights body"},
      tax:       {name:"AT / Portal das Finanças",url:"https://www.portaldasfinancas.gov.pt",        phone:"217 206 707",   desc:"Tax authority"},
      benefits:  {name:"IHRU",               url:"https://www.portaldahabitacao.pt",                 phone:"213 237 000",   desc:"Housing & urban rehab"},
      employment:{name:"ACT",                url:"https://www.act.gov.pt",                           phone:"300 010 100",   desc:"Working conditions authority"},
    },
  },
  be: {
    name:"Belgium", flag:"🇧🇪", currency:"€", legalSystem:"Belgian law",
    escalation:{
      debt:      {name:"OCMW / CPAS",        url:"https://www.ocmw-info-cpas.be",                    phone:null,            desc:"Public welfare centre debt help"},
      legal:     {name:"Pro Deo",            url:"https://www.juridat.be",                           phone:"0800 123 00",   desc:"Free legal aid"},
      contract:  {name:"Test Aankoop",       url:"https://www.testaankoop.be",                       phone:"02 542 32 11",  desc:"Consumer rights body"},
      tax:       {name:"FOD Financiën",      url:"https://financien.belgium.be",                     phone:"0257 257 57",   desc:"Federal tax authority"},
      benefits:  {name:"SLRB / BGHM",       url:"https://slrb-bghm.brussels",                       phone:"02 533 19 11",  desc:"Social housing body"},
      employment:{name:"RVA / ONEM",         url:"https://www.rva.be",                               phone:"02 515 44 44",  desc:"Unemployment & employment"},
    },
  },
  // ── AMERICAS ──────────────────────────────────────────
  mx: {
    name:"Mexico", flag:"🇲🇽", currency:"MXN", legalSystem:"Mexican federal and state law",
    escalation:{
      debt:      {name:"CONDUSEF",           url:"https://www.condusef.gob.mx",                      phone:"800 999 8080",  desc:"Financial consumer protection"},
      legal:     {name:"SEGOB / INJUVE",     url:"https://www.gob.mx/defensoria",                    phone:"800 214 2024",  desc:"Public defender & legal aid"},
      contract:  {name:"PROFECO",            url:"https://www.profeco.gob.mx",                       phone:"800 468 8722",  desc:"Consumer rights body"},
      tax:       {name:"SAT",                url:"https://www.sat.gob.mx",                           phone:"55 627 22 728", desc:"Tax administration service"},
      benefits:  {name:"INFONAVIT",          url:"https://www.infonavit.org.mx",                     phone:"800 008 3900",  desc:"Housing fund"},
      employment:{name:"STPS",               url:"https://www.gob.mx/stps",                          phone:"800 911 7877",  desc:"Labour & Social Welfare"},
    },
  },
  br: {
    name:"Brazil", flag:"🇧🇷", currency:"R$", legalSystem:"Brazilian federal and state law",
    escalation:{
      debt:      {name:"Procon",             url:"https://www.procon.sp.gov.br",                     phone:"151",           desc:"Consumer protection body"},
      legal:     {name:"Defensoria Pública", url:"https://www.dpu.def.br",                           phone:"129",           desc:"Free public defender"},
      contract:  {name:"Procon / Senacon",   url:"https://www.consumidor.gov.br",                    phone:"151",           desc:"Consumer rights"},
      tax:       {name:"Receita Federal",    url:"https://www.gov.br/receitafederal",                phone:"146",           desc:"Federal Revenue Service"},
      benefits:  {name:"Caixa Econômica",    url:"https://www.caixa.gov.br",                         phone:"0800 726 0101", desc:"Housing & social benefits"},
      employment:{name:"MTE",                url:"https://www.gov.br/trabalho",                      phone:"158",           desc:"Ministry of Labour"},
    },
  },
};

// Fallback for any country not in our list
export const DEFAULT_COUNTRY = {
  name: "International", flag: "🌍", currency: "",
  legalSystem: "local law (guidance may vary by jurisdiction)",
  escalation: {
    debt:       { name:"National debt helpline", url:"https://www.google.com/search?q=free+debt+advice+helpline", phone:null, desc:"Search for local free advice" },
    legal:      { name:"Local legal aid",        url:"https://www.google.com/search?q=free+legal+aid+near+me",   phone:null, desc:"Find free legal aid" },
    contract:   { name:"Local legal aid",        url:"https://www.google.com/search?q=free+legal+aid+near+me",   phone:null, desc:"Find free legal aid" },
    tax:        { name:"National tax authority", url:"https://www.google.com/search?q=national+tax+authority",   phone:null, desc:"Contact your tax authority" },
    benefits:   { name:"Local housing advice",   url:"https://www.google.com/search?q=housing+advice+helpline",  phone:null, desc:"Find local housing help" },
    employment: { name:"Employment tribunal",    url:"https://www.google.com/search?q=employment+rights+advice", phone:null, desc:"Find employment rights help" },
  },
};

export function getCountryConfig(code) {
  return COUNTRY_CONFIG[code?.toLowerCase()] || DEFAULT_COUNTRY;
}

/* ═══════════════════════════════════════════════════════
   COUNTRY DETECTION  (geolocation → reverse geocode)
═══════════════════════════════════════════════════════ */
export async function detectCountry() {
  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 })
    );
    const { latitude: lat, longitude: lon } = pos.coords;
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const d = await r.json();
    const code = d?.address?.country_code?.toLowerCase();
    return code || null;
  } catch {
    return null;
  }
}

export const FREE_LIMIT = 3;
export const MODEL = "claude-sonnet-4-20250514";

/* ═══════════════════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════════════════ */
export const S = {
  async get(k) {
    try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
  async del(k)    { try { await window.storage.delete(k); }               catch {} },
};

export const monthKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; };

/* ═══════════════════════════════════════════════════════
   FILE TO BASE64
═══════════════════════════════════════════════════════ */
export function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════
   CLAUDE API — INITIAL GUIDANCE
═══════════════════════════════════════════════════════ */
export async function getGuidance(catId, situation, imageData, imageType, countryCode) {
  const cat     = CATS.find(c => c.id === catId);
  const country = getCountryConfig(countryCode);

  const userContent = imageData
    ? [
        { type: "image", source: { type: "base64", media_type: imageType, data: imageData } },
        { type: "text",  text: situation
            ? `The user has uploaded a document and added this note: "${situation}"`
            : "The user has uploaded this document. Please read it carefully." },
      ]
    : [{ type: "text", text: situation }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system:
`You are Lantern — a calm, clear guide helping people navigate overwhelming ${cat.label} situations.
The user is in ${country.name}. All guidance must be based on ${country.legalSystem}. Reference relevant local bodies, laws, rights, and processes specific to ${country.name}.
${imageData ? "The user has uploaded a document (letter, notice, contract etc). Read it carefully and base your guidance on its actual contents." : ""}
Respond ONLY with valid JSON (no markdown fences, no preamble), exactly this shape:
{
  "summary": "2–3 sentence plain-English explanation of what this situation means and how serious it is",
  "urgency": "low",
  "urgencyText": "one short sentence about why this urgency level applies",
  "deadline": null,
  "actionSteps": ["step 1", "step 2", "step 3", "step 4"],
  "professionalQuestions": ["question 1", "question 2", "question 3"],
  "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"],
  "encouragement": "one warm empowering sentence to help the user feel capable of handling this"
}
urgency must be exactly one of: "low" | "medium" | "high"
deadline: if there is a specific deadline mentioned, set this to a short string like "14 days to respond". Otherwise null.`,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  const raw = d.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

/* ═══════════════════════════════════════════════════════
   CLAUDE API — FOLLOW-UP CHAT
═══════════════════════════════════════════════════════ */
export async function getFollowUp(catId, situation, result, chatHistory, userMessage, countryCode) {
  const cat     = CATS.find(c => c.id === catId);
  const country = getCountryConfig(countryCode);

  const messages = [
    {
      role: "user",
      content: `Original situation: "${situation}"\n\nGuidance already given:\n${result.summary}\n\nAction steps: ${result.actionSteps.join("; ")}\n\nThe user now has a follow-up question.`,
    },
    { role: "assistant", content: "I understand. I'm here to help clarify anything from the guidance. What would you like to know?" },
    ...chatHistory.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: `You are Lantern — a calm, plain-English guide helping people in ${country.name} through ${cat.label} situations under ${country.legalSystem}. Answer follow-up questions clearly and concisely. Never give formal legal or financial advice — provide educational guidance only. Keep responses under 200 words.`,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  return d.content.map(b => b.text || "").join("").trim();
}

/* ═══════════════════════════════════════════════════════
   LANTERN SVG ICON
═══════════════════════════════════════════════════════ */
export function Lantern({ size = 48, glow = false }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {glow && (
        <div style={{
          position: "absolute", inset: -size * 0.35, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,168,76,0.22) 0%, transparent 68%)",
          animation: "pulse 2.4s ease-in-out infinite", pointerEvents: "none",
        }} />
      )}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M24 6 L24 12" stroke="#E9A84C" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M21 8.5 C21 7 22 6 24 6 C26 6 27 7 27 8.5" stroke="#E9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M17 14 Q24 11 31 14" stroke="#E9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="15" y="14" width="18" height="22" rx="3" fill="rgba(233,168,76,0.07)" stroke="#E9A84C" strokeWidth="1.4"/>
        <line x1="15" y1="21" x2="15" y2="29" stroke="#E9A84C" strokeWidth="1" opacity="0.45"/>
        <line x1="33" y1="21" x2="33" y2="29" stroke="#E9A84C" strokeWidth="1" opacity="0.45"/>
        <line x1="15" y1="25" x2="33" y2="25" stroke="#E9A84C" strokeWidth="0.6" opacity="0.2"/>
        <ellipse cx="24" cy="26" rx="4.5" ry="6" fill="rgba(233,168,76,0.45)"/>
        <ellipse cx="24" cy="24.5" rx="2.8" ry="4" fill="rgba(255,220,140,0.75)"/>
        <ellipse cx="24" cy="23" rx="1.4" ry="2.2" fill="rgba(255,250,230,0.92)"/>
        <path d="M17 36 Q24 39 31 36" stroke="#E9A84C" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6"/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ACCORDION
═══════════════════════════════════════════════════════ */
export function Accordion({ title, emoji, items, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 18px", background: "none", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{emoji}</span>
          <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{title}</span>
        </div>
        <span style={{
          color: C.text2, fontSize: 16,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", display: "inline-block",
        }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: `1px solid ${C.border}` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: color + "22", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color }}>{i + 1}</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.65 }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   URGENCY HELPERS
═══════════════════════════════════════════════════════ */
export function urgencyColor(u) { return u === "high" ? C.danger : u === "medium" ? C.warning : C.success; }
export function urgencyEmoji(u) { return u === "high" ? "🔴" : u === "medium" ? "🟡" : "🟢"; }

/* ═══════════════════════════════════════════════════════
   DEADLINE BANNER
═══════════════════════════════════════════════════════ */
export function DeadlineBanner({ deadline }) {
  if (!deadline) return null;
  return (
    <div style={{
      background: "rgba(240,165,0,0.12)", border: `1px solid rgba(240,165,0,0.4)`,
      borderRadius: 12, padding: "13px 16px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>⏰</span>
      <div>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.warning, marginBottom: 2 }}>
          Deadline detected
        </div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.5 }}>{deadline}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ESCALATION CARD
═══════════════════════════════════════════════════════ */
export function EscalationCard({ catId, urgency, countryCode }) {
  const country = getCountryConfig(countryCode);
  const e = country.escalation[catId];
  if (!e || urgency === "low") return null;
  const isHigh = urgency === "high";

  return (
    <div style={{
      background: isHigh ? "rgba(232,87,74,0.08)" : "rgba(233,168,76,0.08)",
      border: `1px solid ${isHigh ? "rgba(232,87,74,0.35)" : "rgba(233,168,76,0.3)"}`,
      borderRadius: 14, padding: "18px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{isHigh ? "🚨" : "👋"}</span>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: isHigh ? C.danger : C.accent }}>
          {isHigh ? "Professional help recommended" : "Free help available"}
        </div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, marginBottom: 14, lineHeight: 1.5 }}>
        <strong style={{ color: C.text }}>{e.name}</strong> — {e.desc}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <a href={`tel:${e.phone.replace(/\s/g,"")}`} style={{
          flex: 1, padding: "11px 0", borderRadius: 10, border: `1px solid ${C.border}`,
          background: C.surf2, color: C.text, fontFamily: SANS, fontSize: 13,
          fontWeight: 600, textAlign: "center", textDecoration: "none",
          display: "block",
        }}>📞 {e.phone}</a>
        <a href={e.url} target="_blank" rel="noopener noreferrer" style={{
          flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
          background: isHigh ? C.danger : C.accent,
          color: isHigh ? "#fff" : "#1A0E00",
          fontFamily: SANS, fontSize: 13, fontWeight: 700,
          textAlign: "center", textDecoration: "none", display: "block",
        }}>Visit website →</a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VOICE INPUT
═══════════════════════════════════════════════════════ */
export function VoiceInput({ onTranscript, disabled }) {
  const [state,      setState]      = useState("idle");   // idle | listening | unsupported
  const [interim,    setInterim]    = useState("");
  const recognitionRef = useRef(null);

  const supported = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function start() {
    if (!supported) { setState("unsupported"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-GB";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = e => {
      let newFinal = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) newFinal += t + " ";
        else interimText = t;
      }
      setInterim(interimText);
      if (newFinal.trim()) onTranscript(newFinal.trim());
    };

    rec.onerror = () => { setState("idle"); setInterim(""); };
    rec.onend   = () => { setState("idle"); setInterim(""); };

    recognitionRef.current = rec;
    rec.start();
    setState("listening");
  }

  function stop() {
    recognitionRef.current?.stop();
    setState("idle");
    setInterim("");
  }

  useEffect(() => () => recognitionRef.current?.stop(), []);

  if (!supported) return null;

  const listening = state === "listening";

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={listening ? stop : start}
        disabled={disabled}
        style={{
          width: "100%", padding: "15px 18px", borderRadius: 14,
          background: listening ? "rgba(232,87,74,0.1)" : C.surf,
          border: `1.5px solid ${listening ? C.danger : C.border}`,
          display: "flex", alignItems: "center", gap: 12,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {/* Mic icon / waveform */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: listening ? C.danger : C.surf2,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: listening ? `0 0 0 6px rgba(232,87,74,0.18)` : "none",
          animation: listening ? "pulse 1.6s ease-in-out infinite" : "none",
          transition: "all 0.25s",
        }}>
          {listening ? (
            /* animated bars */
            <div style={{ display: "flex", gap: 2, alignItems: "center", height: 18 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: 3, borderRadius: 2,
                  background: "#fff",
                  animation: `voiceBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                  height: `${[10, 18, 14, 8][i]}px`,
                }}/>
              ))}
            </div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="13" rx="3" fill={C.text2}/>
              <path d="M5 11a7 7 0 0 0 14 0" stroke={C.text2} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <line x1="12" y1="18" x2="12" y2="22" stroke={C.text2} strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="8" y1="22" x2="16" y2="22" stroke={C.text2} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: listening ? C.danger : C.text }}>
            {listening ? "Recording… tap to stop" : "Speak your situation"}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2, lineHeight: 1.4, minHeight: 16 }}>
            {listening
              ? (interim || "Listening…")
              : "Easier than typing — just talk"}
          </div>
        </div>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DOCUMENT UPLOAD PICKER
═══════════════════════════════════════════════════════ */
export function DocumentUpload({ file, onFile, onRemove }) {
  const ref = useRef();

  return (
    <div style={{ marginBottom: 16 }}>
      {!file ? (
        <button
          onClick={() => ref.current.click()}
          style={{
            width: "100%", padding: "16px", borderRadius: 14,
            border: `1.5px dashed ${C.border}`, background: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10,
            transition: "border-color 0.2s, background 0.2s",
          }}
          onPointerDown={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentBg; }}
          onPointerUp={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: 20 }}>📎</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>
              Upload a document
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2 }}>
              Photo of a letter, PDF, or screenshot
            </div>
          </div>
        </button>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: C.surf, border: `1px solid ${C.accent}40`,
          borderRadius: 14, padding: "13px 16px",
        }}>
          <span style={{ fontSize: 22 }}>
            {file.type.startsWith("image") ? "🖼️" : "📄"}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.name}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.success, marginTop: 2 }}>
              ✓ Ready to analyse
            </div>
          </div>
          <button onClick={onRemove} style={{
            background: "none", border: "none", color: C.text3,
            fontSize: 20, cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0,
          }}>×</button>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); e.target.value = ""; }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FOLLOW-UP CHAT
═══════════════════════════════════════════════════════ */
export function FollowUpChat({ catId, situation, result, chatHistory, onNewMessage, countryCode }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (open && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, open, loading]);

  async function send() {
    const msg = input.trim();
    if (!msg) return;
    setInput("");
    setLoading(true);
    onNewMessage({ role: "user", content: msg });
    try {
      const reply = await getFollowUp(catId, situation, result, chatHistory, msg, countryCode);
      onNewMessage({ role: "assistant", content: reply });
    } catch {
      onNewMessage({ role: "assistant", content: "Something went wrong. Please try again." });
    }
    setLoading(false);
  }

  const suggestions = [
    "What does this mean for me?",
    "How long do I have to respond?",
    "Can I ignore this?",
    "What if I can't afford a solicitor?",
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "15px 18px", borderRadius: 14,
          background: C.surf, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>Ask a follow-up</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, marginTop: 1 }}>
              {chatHistory.length > 0 ? `${chatHistory.length} message${chatHistory.length !== 1 ? "s" : ""}` : "Have a question about your guidance?"}
            </div>
          </div>
        </div>
        <span style={{
          color: C.accent, fontSize: 16,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", display: "inline-block",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          background: C.surf2, border: `1px solid ${C.border}`,
          borderTop: "none", borderRadius: "0 0 14px 14px",
          overflow: "hidden",
        }}>
          {/* Messages */}
          <div style={{ maxHeight: 320, overflowY: "auto", padding: "16px 16px 0" }}>
            {chatHistory.length === 0 && (
              <div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, textAlign: "center", marginBottom: 14 }}>
                  Tap a suggestion or type your question
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => setInput(s)} style={{
                      background: C.surf, border: `1px solid ${C.border}`,
                      borderRadius: 20, padding: "7px 13px",
                      fontFamily: SANS, fontSize: 12, color: C.text2, cursor: "pointer",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {chatHistory.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", borderRadius: 12,
                  background: m.role === "user" ? C.accent : C.surf,
                  border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                  fontFamily: SANS, fontSize: 13, lineHeight: 1.6,
                  color: m.role === "user" ? "#1A0E00" : C.text,
                  borderBottomRightRadius: m.role === "user" ? 4 : 12,
                  borderBottomLeftRadius: m.role === "assistant" ? 4 : 12,
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "8px 0 12px" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: C.accent,
                    animation: `dotPulse 1.3s ease-in-out ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px 16px", display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about your situation…"
              style={{
                flex: 1, padding: "12px 14px", borderRadius: 10,
                background: C.surf, border: `1px solid ${C.border}`,
                color: C.text, fontFamily: SANS, fontSize: 14, outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 10, border: "none",
                background: input.trim() && !loading ? C.accent : C.surf2,
                color: input.trim() && !loading ? "#1A0E00" : C.text3,
                fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >↑</button>
          </div>
        </div>
      )}
    </div>
  );
}
