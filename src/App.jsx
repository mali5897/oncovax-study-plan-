import React, { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Filter,
  FlaskConical,
  GitBranch,
  Layers,
  Pin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PROGRAMS = [
  {
    id: 1,
    code: '01',
    cancer: 'Prostate Cancer',
    candidate: 'Sipuleucel-T (Provenge)',
    target: 'Prostatic acid phosphatase (PAP)',
    platform: 'Cell-Based',
    group: 'advanced',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Approved / Standard Care',
    baselineBottleneck:
      'FDA-approved in 2010 for asymptomatic/minimally symptomatic mCRPC, yielding ~4 months OS gain without tumor shrinkage. Targets only PAP and requires leukapheresis (causing citrate tingling in ~14% and fever/chills in >=15%).',
    improvement:
      'Shift to an off-the-shelf multi-antigen mRNA or peptide booster (PAP + PSMA + PSA) given earlier in biochemical recurrence alongside modern androgen-pathway therapy, eliminating leukapheresis.',
    trialDesign:
      'Randomized Phase 2/3 comparing multi-antigen vaccine + standard hormone therapy vs. hormone therapy + placebo.',
    primaryEndpoint: 'Metastasis-free survival (MFS) and Overall Survival (OS)',
    sideEffectMitigation:
      'Skip leukapheresis citrate exposure via intramuscular injection; premedicate with acetaminophen and antihistamine 30 min pre-dose.',
    timeline: ['PSA Biochemical Recurrence', 'Multi-Antigen mRNA Prime', 'Androgen-Pathway Combo', 'MFS & OS Readout'],
    sourceLabel: 'U.S. FDA — Provenge Q&A',
    sourceUrl:
      'https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/questions-and-answers-provenge',
  },
  {
    id: 2,
    code: '02',
    cancer: 'Melanoma of the Skin',
    candidate: 'Intismeran autogene (mRNA-4157 / V940)',
    target: 'Up to 34 personalized tumor neoantigens',
    platform: 'mRNA / DNA',
    group: 'advanced',
    masterCluster: 'Personalized Neoantigen Basket',
    evidenceStage: 'Positive Phase 3 Add-On',
    baselineBottleneck:
      'Phase 3 INTerpath-001 (2026) cut recurrence or death risk by 42% when added to pembrolizumab after resection, but OS is still maturing, 17.3% failed tissue screening, and manufacturing takes 6–8 weeks.',
    improvement:
      'Integrate liquid-biopsy (ctDNA) neoantigen selection + off-the-shelf bridging shot to cut tissue-screening dropouts, shorten turnaround, and test 5-dose vs. 9-dose duration.',
    trialDesign:
      'Biomarker-stratified Phase 3 extension tracking 5-year OS, ctDNA clearance, and comparison against neoadjuvant checkpoint doublets.',
    primaryEndpoint: '5-year Overall Survival (OS) and ctDNA molecular clearance',
    sideEffectMitigation:
      'Standard mRNA-LNP monitoring; Grade 3+ adverse events were similar to pembrolizumab alone (14.2% vs. 13.4%).',
    timeline: ['Resection + ctDNA Backup', 'Bridging Dose (Wk 1–6)', 'Personalized mRNA + Pembro', '5-Yr OS & ctDNA Gate'],
    sourceLabel: 'TargetedOnc — INTerpath-001',
    sourceUrl:
      'https://www.targetedonc.com/view/interpath-001-individualized-neoantigen-therapy-melanoma-feature',
  },
  {
    id: 3,
    code: '03',
    cancer: 'Acute Myeloid Leukemia (AML)',
    candidate: 'Galinpepimut-S (GPS)',
    target: 'WT1 (Wilms tumor 1) peptides',
    platform: 'Peptide',
    group: 'advanced',
    masterCluster: 'Remission / MRD Maintenance',
    evidenceStage: 'Positive Phase 3 Add-On',
    baselineBottleneck:
      'November 2026 Phase 3 REGAL topline data showed OS benefit (24.0 vs. 14.7 months) as maintenance in second or later remission, but did not test remission induction or first-remission MRD.',
    improvement:
      'Pair WT1 peptides with a second leukemia-associated antigen (e.g., PRAME) and oral hypomethylating maintenance in MRD-positive first complete remission.',
    trialDesign:
      'Randomized Phase 3 in MRD-positive CR1 testing vaccine + oral azacitidine vs. oral azacitidine + placebo.',
    primaryEndpoint: 'Relapse-Free Survival (RFS) and Overall Survival (OS)',
    sideEffectMitigation:
      'Monitor injection-site induration and mild cytopenias; stagger dosing relative to oral maintenance cycles.',
    timeline: ['CR1 + MRD+ Screening', 'WT1 + PRAME Priming', 'Oral Aza Maintenance', 'RFS & OS Readout'],
    sourceLabel: 'TargetedOnc — REGAL Phase 3',
    sourceUrl:
      'https://www.targetedonc.com/view/galinpepimut-s-regal-phase-3-overall-survival-aml',
  },
  {
    id: 4,
    code: '04',
    cancer: 'Pancreatic Adenocarcinoma',
    candidate: 'Camupepimut (ELI-002 7P)',
    target: '7 mutated forms of KRAS',
    platform: 'Peptide',
    group: 'advanced',
    masterCluster: 'KRAS Master Protocol',
    evidenceStage: 'Missed Phase 2/3 Endpoint',
    baselineBottleneck:
      'Randomized Phase 2 AMPLIFY-7P (Oct 2026) did not meet statistical significance for DFS vs. observation (23.8 vs. 21.2 mo; P = 0.5329) despite inducing mKRAS-specific T cells, likely due to dense stromal suppression.',
    improvement:
      'Enroll into the shared KRAS Master Protocol combining lymph-node-targeted mKRAS vaccination with a CD40 agonist or PD-1 inhibitor to remodel stroma and enforce a 6-month ctDNA go/no-go gate.',
    trialDesign:
      'Randomized Phase 2/3 in ctDNA-positive resected pancreatic cancer comparing vaccine + stromal/checkpoint modulator vs. standard observation.',
    primaryEndpoint: '6-month ctDNA clearance and Disease-Free Survival (DFS)',
    sideEffectMitigation:
      'Grade >=3 AEs were low (10.4% in AMPLIFY-7P); add liver-enzyme and cytokine monitoring if paired with CD40/PD-1.',
    timeline: ['Post-Resection ctDNA+', 'mKRAS + CD40/PD-1', '6-Mo ctDNA Go/No-Go', 'DFS & Relapse Biopsy'],
    sourceLabel: '2 Minute Medicine — AMPLIFY-7P',
    sourceUrl:
      'https://www.2minutemedicine.com/camupepimut-did-not-improve-disease-free-survival-versus-observation-in-pancreatic-cancer-in-the-randomized-phase-2-amplify-7p-trial/',
  },
  {
    id: 5,
    code: '05',
    cancer: 'Glioblastoma',
    candidate: 'Rindopepimut (CDX-110)',
    target: 'EGFRvIII deletion mutation',
    platform: 'Peptide',
    group: 'advanced',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Missed Phase 2/3 Endpoint',
    baselineBottleneck:
      'Phase 3 ACT IV failed to improve OS (20.4 vs. 21.1 months) even in EGFRvIII+ tumors because tumors shed EGFRvIII expression and the brain microenvironment suppressed T cells.',
    improvement:
      'Replace single-peptide EGFRvIII with a multi-epitope personalized neoantigen + shared glioma antigen vaccine, with mandatory repeat biopsy at progression to track antigen loss.',
    trialDesign:
      'Randomized Phase 2 comparing multi-target vaccine + temozolomide + PD-1 blockade vs. temozolomide + placebo.',
    primaryEndpoint: '18-month OS and longitudinal antigen-loss biopsy tracking',
    sideEffectMitigation:
      'Prophylactic corticosteroid-sparing edema management so steroids do not blunt vaccine-primed T cells.',
    timeline: ['Maximal Safe Resection', 'Multi-Epitope + TMZ/PD-1', '6-Mo MRI/Immune Gate', '18-Mo OS & Biopsy'],
    sourceLabel: 'PubMed — ACT IV Phase 3',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/28844499/',
  },
  {
    id: 6,
    code: '06',
    cancer: 'Non-Small Cell Lung Cancer (NSCLC)',
    candidate: 'NEO-PV-01 / Personalized Peptides',
    target: 'Patient-specific tumor neoantigens',
    platform: 'Peptide',
    group: 'solid',
    masterCluster: 'Personalized Neoantigen Basket',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Early trials alongside chemotherapy and pembrolizumab detected de novo T-cell responses, but non-randomized designs could not isolate the vaccine’s independent survival effect.',
    improvement:
      'Test personalized mRNA or peptide vaccination as maintenance after first-line chemo-immunotherapy induction in stage IIIB–IV patients, with a bridging shot during sequencing.',
    trialDesign:
      'Randomized Phase 2/3 of maintenance pembrolizumab + vaccine vs. pembrolizumab + placebo.',
    primaryEndpoint: 'Progression-Free Survival (PFS) and Overall Survival (OS)',
    sideEffectMitigation:
      'Standardized pneumonitis and immune-related AE surveillance when layered onto maintenance anti-PD-1.',
    timeline: ['1L Chemo-IO Induction', 'ctDNA Sequencing + Bridge', 'Maintenance Pembro + Vax', 'PFS & OS Readout'],
    sourceLabel: 'PubMed — NEO-PV-01 Phase Ib',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/33064988/',
  },
  {
    id: 7,
    code: '07',
    cancer: 'Small Cell Lung Cancer (SCLC)',
    candidate: 'Ad.p53-DC Vaccine',
    target: 'p53 tumor suppressor protein',
    platform: 'Cell-Based',
    group: 'solid',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Missed Phase 2/3 Endpoint',
    baselineBottleneck:
      'A randomized Phase 2 trial of dendritic cells targeting p53 after chemotherapy did not establish a survival benefit in fast-relapsing SCLC.',
    improvement:
      'Replace p53-only dendritic cells with a multi-antigen SCLC vaccine (DLL3 + p53 + neoantigens) synchronized with standard chemo-immunotherapy maintenance.',
    trialDesign:
      'Randomized Phase 2 in extensive-stage SCLC maintenance with anti-PD-L1 backbone.',
    primaryEndpoint: '12-month Overall Survival (OS) and durable T-cell persistence',
    sideEffectMitigation:
      'Eliminate multi-day apheresis burden by transitioning from DC infusion to off-the-shelf multi-antigen mRNA.',
    timeline: ['Chemo-IO Induction', 'Multi-Antigen Maintenance', '6-Mo ctDNA Gate', '12-Mo OS Readout'],
    sourceLabel: 'PMC6426813 — SCLC Phase 2',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6426813/',
  },
  {
    id: 8,
    code: '08',
    cancer: 'Breast Cancer (HR+/HER2-)',
    candidate: 'Personalized Neoantigen Peptides',
    target: 'Patient-specific tumor neoantigens',
    platform: 'Peptide',
    group: 'solid',
    masterCluster: 'Personalized Neoantigen Basket',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Phase 1 only; hormone-receptor-positive, HER2-negative breast cancers typically carry low mutation loads and sparse T-cell infiltration.',
    improvement:
      'Combine personalized neoantigen peptides with CDK4/6 inhibition + endocrine therapy (which can upregulate antigen presentation) and poly-ICLC adjuvant.',
    trialDesign:
      'Randomized Phase 2 in high-risk HR+/HER2- patients with rising ctDNA.',
    primaryEndpoint: 'ctDNA molecular response rate and PFS',
    sideEffectMitigation:
      'Manage local injection-site erythema and transient flu-like fatigue with pre-dose acetaminophen.',
    timeline: ['Rising ctDNA Detection', 'CDK4/6 + Endocrine Priming', 'Neoantigen + Poly-ICLC', 'ctDNA & PFS Readout'],
    sourceLabel: 'NCI — Personalized Breast Trial',
    sourceUrl:
      'https://www.cancer.gov/research/participate/clinical-trials-search/v?id=NCI-2021-10199',
  },
  {
    id: 9,
    code: '09',
    cancer: 'Clear Cell Kidney Cancer (ccRCC)',
    candidate: 'NeoVax Personalized Peptides',
    target: 'Resected tumor neoantigens',
    platform: 'Peptide',
    group: 'solid',
    masterCluster: 'Personalized Neoantigen Basket',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Phase 1 trial (Feb 2025) produced tumor-specific T-cell responses in all 9 patients with no recurrences at 40.2 months median follow-up, but had no control group.',
    improvement:
      'Add a randomized, placebo-controlled adjuvant arm alongside standard-of-care adjuvant pembrolizumab in high-risk stage III–IV resected ccRCC.',
    trialDesign:
      'Randomized, double-blind Phase 2/3 of vaccine + pembrolizumab vs. placebo + pembrolizumab.',
    primaryEndpoint: 'Disease-Free Survival (DFS)',
    sideEffectMitigation:
      'Low-grade injection reactions and flu-like symptoms were manageable; monitor hepatic enzymes if combined with checkpoint blockade.',
    timeline: ['Nephrectomy + Sequencing', 'Adjuvant Pembro Start', 'NeoVax Boosters', 'DFS & Immune Readout'],
    sourceLabel: 'CancerNetwork — ccRCC Phase 1',
    sourceUrl:
      'https://www.cancernetwork.com/view/personalized-vaccines-elicit-anti-cancer-immune-responses-in-kidney-cancer',
  },
  {
    id: 10,
    code: '10',
    cancer: 'Colorectal Cancer (MSS/MMRp)',
    candidate: 'mKRAS-VAX',
    target: '6 pooled mutant KRAS peptides',
    platform: 'Peptide',
    group: 'solid',
    masterCluster: 'KRAS Master Protocol',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      '13-patient Phase 1 trial (June 2026) paired mKRAS-VAX with nivolumab + ipilimumab in pretreated metastatic MSS CRC, so vaccine-only benefit could not be isolated.',
    improvement:
      'Enroll into the shared KRAS Master Protocol for MRD-positive (ctDNA+) stage II–III resected MSS colorectal cancer where dual CTLA-4/PD-1 toxicity is avoided.',
    trialDesign:
      'Randomized Phase 2 of mKRAS vaccine + single-agent PD-1 vs. standard observation/chemo.',
    primaryEndpoint: '12-month ctDNA clearance and Disease-Free Survival (DFS)',
    sideEffectMitigation:
      'mKRAS-VAX AEs were Grade 1–2; dropping ipilimumab in MRD reduces severe colitis/hepatitis risk.',
    timeline: ['Resected Stage II–III ctDNA+', 'mKRAS-VAX + PD-1', '6-Mo ctDNA Go/No-Go', '12-Mo DFS Readout'],
    sourceLabel: 'PubMed — mKRAS-VAX Phase I',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/42336869/',
  },
  {
    id: 11,
    code: '11',
    cancer: 'Bladder Cancer',
    candidate: 'BCG (NMIBC) / Personalized Vaccine (MIBC)',
    target: 'Local innate activation / Tumor neoantigens',
    platform: 'Local BCG / MIBC',
    group: 'solid',
    masterCluster: 'Personalized Neoantigen Basket',
    evidenceStage: 'Approved / Standard Care',
    baselineBottleneck:
      'Intravesical BCG is established for non-muscle-invasive disease, but BCG-unresponsive cases still recur and post-surgery MIBC vaccines remain experimental.',
    improvement:
      'Pair personalized neoantigen vaccination with standard adjuvant nivolumab in ctDNA+ MIBC post-cystectomy, and test vaccine + BCG in BCG-unresponsive NMIBC.',
    trialDesign:
      'Two-cohort randomized Phase 2/3 stratified by muscle invasion and ctDNA status.',
    primaryEndpoint: 'DFS (MIBC cohort) and 12-month Complete Response (NMIBC cohort)',
    sideEffectMitigation:
      'Standard bladder-irritation management for BCG; standard local injection care for systemic neoantigen vaccine.',
    timeline: ['TURBT / Cystectomy + ctDNA', 'BCG or Nivolumab Backbone', 'Neoantigen Vaccination', 'CR / DFS Readout'],
    sourceLabel: 'MSKCC — BCG Bladder Therapy',
    sourceUrl:
      'https://www.mskcc.org/cancer-care/types/bladder/treatment/bacillus-calmette-guerin-therapy',
  },
  {
    id: 12,
    code: '12',
    cancer: 'Gastroesophageal Cancer',
    candidate: 'Personalized Neoantigen PCV',
    target: 'Post-surgery MRD tumor neoantigens',
    platform: 'Peptide',
    group: 'solid',
    masterCluster: 'Personalized Neoantigen Basket',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Currently in Phase 1 evaluation for patients with molecular residual disease (MRD) after surgery, with no randomized comparator arm.',
    improvement:
      'Standardize rapid post-operative sequencing and pair the personalized vaccine with standard adjuvant nivolumab in ctDNA-positive patients after chemo-radiation.',
    trialDesign:
      'Randomized Phase 2 comparing personalized vaccine + nivolumab vs. nivolumab + placebo.',
    primaryEndpoint: 'ctDNA clearance and Recurrence-Free Survival (RFS)',
    sideEffectMitigation:
      'Nutritional and post-gastrectomy/esophagectomy tolerance monitoring alongside mild Grade 1–2 injection reactions.',
    timeline: ['Chemo-RT + Surgery', 'MRD ctDNA+ Selection', 'PCV + Nivolumab', 'ctDNA & RFS Readout'],
    sourceLabel: 'NCI — MRD Gastroesophageal Trial',
    sourceUrl:
      'https://www.cancer.gov/research/participate/clinical-trials-search/v?id=NCI-2025-00334',
  },
  {
    id: 13,
    code: '13',
    cancer: 'Ovarian, Fallopian & Peritoneal',
    candidate: 'FAROUT (FRalphaDCs)',
    target: 'Folate receptor alpha (FRalpha)',
    platform: 'Cell-Based',
    group: 'solid',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Randomized Phase 2 FAROUT compares FRalpha dendritic cells vs. placebo in stage III–IV disease, requiring resource-heavy autologous cell manufacturing.',
    improvement:
      'Develop an off-the-shelf multi-antigen mRNA or peptide vaccine targeting FRalpha + WT1 + MUC16 to eliminate leukapheresis and pair with PARP-inhibitor maintenance.',
    trialDesign:
      'Randomized Phase 2/3 of multi-antigen vaccine + PARP inhibitor vs. PARP inhibitor + placebo.',
    primaryEndpoint: 'Progression-Free Survival (PFS)',
    sideEffectMitigation:
      'Removing leukapheresis eliminates citrate hypocalcemia; monitor overlapping fatigue with PARP maintenance.',
    timeline: ['Debulking + Platinum Chemo', 'PARP Maintenance Start', 'Multi-Antigen Vaccine', 'PFS Readout'],
    sourceLabel: 'ClinicalTrials.gov — FAROUT',
    sourceUrl: 'https://clinicaltrials.gov/study/NCT06639074',
  },
  {
    id: 14,
    code: '14',
    cancer: 'Endometrial Cancer',
    candidate: 'DECENDO Dendritic-Cell Vaccine',
    target: 'Mucin-1 and Survivin antigens',
    platform: 'Cell-Based',
    group: 'solid',
    masterCluster: 'Remission / MRD Maintenance',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Single-arm Phase 1/2 DECENDO (n=7) combined DCs with carboplatin/paclitaxel in metastatic disease, which cannot separate vaccine benefit from chemotherapy.',
    improvement:
      'Stratify by mismatch-repair (MMR) status and deliver vaccination during post-chemotherapy maintenance alongside PD-1 blockade in MMR-proficient tumors.',
    trialDesign:
      'Randomized Phase 2 in pMMR advanced endometrial cancer maintenance.',
    primaryEndpoint: 'PFS and antigen-specific T-cell expansion',
    sideEffectMitigation:
      'Timing vaccination after chemo nadir preserves white blood cell counts needed for vaccine priming.',
    timeline: ['MMR Stratification', 'Carbo/Taxol Debulking', 'Maintenance Vax + PD-1', 'PFS & T-Cell Readout'],
    sourceLabel: 'PubMed — DECENDO Phase I/II',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/38444861/',
  },
  {
    id: 15,
    code: '15',
    cancer: 'HPV-Positive Cervical Cancer',
    candidate: 'GX-188E (Tirvalimogene Teraplasmid)',
    target: 'HPV-16 and HPV-18 E6/E7 proteins',
    platform: 'mRNA / DNA',
    group: 'solid',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Phase 2 GX-188E + pembrolizumab showed activity in recurrent/advanced cervical cancer regardless of PD-L1 status, but lacked a pembrolizumab-alone control arm.',
    improvement:
      'Run a randomized Phase 3 specifically in PD-L1-low/negative recurrent HPV-16/18+ cervical cancer where checkpoint monotherapy performs poorly.',
    trialDesign:
      'Randomized Phase 3 of E6/E7 DNA/mRNA vaccine + pembrolizumab vs. pembrolizumab + placebo.',
    primaryEndpoint: 'Overall Survival (OS) and Objective Response Rate (ORR)',
    sideEffectMitigation:
      'Well-tolerated in Phase 2; standard electroporation/injection-site care and routine anti-PD-1 toxicity checks.',
    timeline: ['HPV-16/18 + PD-L1 Screen', 'E6/E7 Vax + Pembrolizumab', '6-Mo Tumor/ctDNA Gate', 'OS & ORR Readout'],
    sourceLabel: 'PMC11736335 — GX-188E Phase 2',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11736335/',
  },
  {
    id: 16,
    code: '16',
    cancer: 'Liver Cancer (HCC)',
    candidate: 'Glypican-3 (GPC3) Peptide Vaccine',
    target: 'Glypican-3 (GPC3) oncofetal protein',
    platform: 'Peptide',
    group: 'rare_heme',
    masterCluster: 'Remission / MRD Maintenance',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Early human studies produced GPC3-specific cytotoxic T cells, but stand-alone remission in advanced hepatocellular carcinoma remains unproven.',
    improvement:
      'Deliver GPC3 + AFP multi-peptide vaccination right after radiofrequency ablation or resection (when tumor antigens are released) plus anti-PD-L1/VEGF therapy.',
    trialDesign:
      'Randomized Phase 2 post-ablation/resection in GPC3+ HCC.',
    primaryEndpoint: '2-year Recurrence-Free Survival (RFS)',
    sideEffectMitigation:
      'Careful Child-Pugh liver function monitoring to distinguish hepatic flares from vaccine immune activity.',
    timeline: ['Ablation or Resection', 'GPC3 + AFP Priming', 'Anti-PD-L1/VEGF Combo', '2-Yr RFS Readout'],
    sourceLabel: 'PubMed — GPC3 HCC Trial',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/23243625/',
  },
  {
    id: 17,
    code: '17',
    cancer: 'Medullary Thyroid Cancer (MTC)',
    candidate: 'Calcitonin Dendritic-Cell Vaccine',
    target: 'Calcitonin (and CEA/lysate)',
    platform: 'Cell-Based',
    group: 'rare_heme',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Evidence is limited to small, early-phase studies in this rare thyroid cancer subtype without randomized progression benchmarks.',
    improvement:
      'Combine calcitonin + CEA peptide vaccination with standard RET-targeted therapy (for RET-mutant MTC) during minimal biochemical disease.',
    trialDesign:
      'Multi-center Phase 2 randomized/basket study in biochemically persistent MTC.',
    primaryEndpoint: 'Calcitonin/CEA doubling time and PFS',
    sideEffectMitigation:
      'Transition from intranodal DC injections to standardized subcutaneous peptide/mRNA delivery.',
    timeline: ['RET Mutation Check', 'Calcitonin + CEA Priming', 'RET-Targeted Combo', 'Biomarker & PFS Readout'],
    sourceLabel: 'Clin Cancer Res — MTC DC Study',
    sourceUrl:
      'https://aacrjournals.org/clincancerres/article/10/9/2944/185865/Dendritic-Cell-Vaccination-in-Medullary-Thyroid',
  },
  {
    id: 18,
    code: '18',
    cancer: 'Synovial Sarcoma',
    candidate: 'SYT-SSX Breakpoint Peptide Vaccine',
    target: 'SYT-SSX (SS18-SSX) fusion protein',
    platform: 'Peptide',
    group: 'rare_heme',
    masterCluster: 'Multi-Antigen Upgrade',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'A small Phase 1 trial targeting the SYT-SSX fusion junction saw weak immune responses and continued tumor growth in most patients.',
    improvement:
      'Upgrade to high-potency mRNA or viral-vector delivery encoding SYT-SSX + NY-ESO-1/PRAME with a TLR agonist adjuvant after surgical resection or radiation.',
    trialDesign:
      'Randomized Phase 2 adjuvant/maintenance trial in HLA-matched synovial sarcoma.',
    primaryEndpoint: 'Recurrence-Free Survival (RFS) and tetramer+ T-cell frequency',
    sideEffectMitigation:
      'Monitor local TLR-adjuvant fever/chills with standard antipyretics.',
    timeline: ['HLA Match + Resection', 'mRNA/Vector + TLR Agonist', '6-Mo Immune Gate', 'RFS Readout'],
    sourceLabel: 'PMC3556272 — SYT-SSX Trial',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3556272/',
  },
  {
    id: 19,
    code: '19',
    cancer: 'Follicular Lymphoma',
    candidate: 'BiovaxID Idiotype Vaccine',
    target: 'Patient-specific lymphoma idiotype antibody',
    platform: 'Peptide',
    group: 'rare_heme',
    masterCluster: 'Remission / MRD Maintenance',
    evidenceStage: 'Early Phase 1–2 / Ongoing',
    baselineBottleneck:
      'Phase 3 idiotype studies enrolled patients already in remission and required slow, complex hybridoma protein manufacturing.',
    improvement:
      'Replace hybridoma protein synthesis with rapid mRNA idiotype manufacturing and test in patients reaching complete metabolic response after modern CD20/bispecific induction.',
    trialDesign:
      'Randomized Phase 2/3 consolidation trial vs. standard observation/rituximab maintenance.',
    primaryEndpoint: 'MRD conversion and Progression-Free Survival (PFS)',
    sideEffectMitigation:
      'Monitor B-cell recovery and infection rates when sequenced after anti-CD20 or bispecific therapy.',
    timeline: ['CD20/Bispecific Induction', 'Rapid mRNA Idiotype', 'Remission Consolidation', 'MRD & PFS Readout'],
    sourceLabel: 'PubMed — BiovaxID Review',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/17542746/',
  },
  {
    id: 20,
    code: '20',
    cancer: 'Multiple Myeloma',
    candidate: 'DC/Myeloma Fusion Vaccine',
    target: 'Whole-cell myeloma antigens',
    platform: 'Cell-Based',
    group: 'rare_heme',
    masterCluster: 'Remission / MRD Maintenance',
    evidenceStage: 'Missed Phase 2/3 Endpoint',
    baselineBottleneck:
      'Randomized Phase 2 trial adding DC/myeloma fusion to lenalidomide post-transplant showed immune responses but did not significantly raise 1-year complete response rates.',
    improvement:
      'Sequence vaccination after BCMA CAR-T or bispecific antibody debulking—when myeloma burden is ultra-low—to prevent antigen-negative relapse.',
    trialDesign:
      'Randomized Phase 2 post-BCMA consolidation comparing vaccine + lenalidomide vs. lenalidomide alone.',
    primaryEndpoint: 'Sustained MRD negativity at 12 and 24 months',
    sideEffectMitigation:
      'Coordinate vaccine timing after post-CAR-T lymphodepletion recovery to ensure functional T-cell priming.',
    timeline: ['BCMA CAR-T / Bispecific', 'Lymphocyte Recovery', 'Fusion Vax + Lenalidomide', '12/24-Mo MRD Negativity'],
    sourceLabel: 'PubMed — DC/MM Fusion Phase 2',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/37463058/',
  },
];

const EVIDENCE_CHART_DATA = [
  { name: 'Approved / Std Care', count: 2, color: '#FF2E93' },
  { name: 'Positive Phase 3', count: 2, color: '#38BDF8' },
  { name: 'Missed Ph 2/3', count: 4, color: '#6366F1' },
  { name: 'Early Phase 1–2', count: 12, color: '#2563EB' },
];

const PLATFORM_CHART_DATA = [
  { name: 'Peptide', value: 11, color: '#FF2E93' },
  { name: 'Cell-Based', value: 6, color: '#2563EB' },
  { name: 'mRNA / DNA', value: 2, color: '#38BDF8' },
  { name: 'Local BCG / MIBC', value: 1, color: '#A855F7' },
];

const LEVERS = [
  {
    id: 1,
    title: 'Multi-Antigen & Neoantigen Breadth',
    summary: 'Block tumor escape by targeting 20–34 mutations instead of 1 protein.',
    detail:
      'When a vaccine targets only one protein—like EGFRvIII in glioblastoma (#05) or PAP in prostate cancer (#01)—tumors can survive simply by turning off that single marker. Encoding dozens of patient-specific neoantigens (as in #02 intismeran autogene) forces the immune system to attack multiple independent targets simultaneously.',
  },
  {
    id: 2,
    title: 'Low-Burden Timing (Adjuvant / MRD)',
    summary: 'Vaccinate after surgery or during remission, not against bulky tumors.',
    detail:
      'Large tumors build dense physical and chemical shields faster than T cells can multiply. Intervening right after surgery or during remission—guided by circulating tumor DNA (ctDNA)—gives vaccine-primed T cells a realistic chance to clear microscopic residual cells.',
  },
  {
    id: 3,
    title: 'Rational Checkpoint Pairing',
    summary: 'Release immune brakes while using randomized controls to prove benefit.',
    detail:
      'Even well-trained T cells get shut down by PD-1/PD-L1 signals inside tumors. Pairing vaccines with checkpoint inhibitors unlocks T-cell killing, while randomized add-on or factorial trial arms isolate what the vaccine itself actually contributes.',
  },
  {
    id: 4,
    title: 'Biomarker Stratification & Hard Endpoints',
    summary: 'Replace single-arm immune readouts with ctDNA, RFS, and OS.',
    detail:
      'Several trials (#04, #05, #07, #20) produced strong T-cell signals in blood tests yet failed to extend survival. Upgraded protocols require randomized control groups and clinical endpoints—ctDNA clearance, recurrence-free survival, and overall survival.',
  },
];

const MASTER_UPGRADES = [
  {
    id: 'master',
    tag: 'Architecture',
    title: 'Shared Master Protocols (Basket & Umbrella)',
    desc: 'Group shared targets—such as mutant KRAS (#04 Pancreatic, #10 Colorectal) or personalized post-surgery mRNA (#02, #06, #09, #11, #12)—under common control backbones to pool safety data and accelerate rare-tumor enrollment.',
  },
  {
    id: 'bridging',
    tag: 'Turnaround',
    title: 'ctDNA Backup + Off-the-Shelf Bridging',
    desc: 'In INTerpath-001 (#02), 17.3% of screened patients lacked sufficient tissue and manufacturing took 6–8 weeks. Adding liquid-biopsy ctDNA sequencing and an immediate shared-antigen bridging dose prevents early relapse while custom doses are built.',
  },
  {
    id: 'gates',
    tag: 'Futility Gate',
    title: '6-Month ctDNA Gates & Relapse Biopsies',
    desc: 'Require measurable ctDNA clearance—not just blood T-cell counts—at 6 months before expanding Phase 2 trials to Phase 3, and mandate repeat biopsy at progression to catch antigen-loss escape early.',
  },
  {
    id: 'dosing',
    tag: 'Optimization',
    title: 'Dosing Sequence & Duration Sub-Arms',
    desc: 'Embed randomized sub-arms testing shorter vs. longer schedules (e.g., 5 vs. 9 doses) and vaccine-first vs. checkpoint-first sequencing to lower side effects, clinic visits, and manufacturing cost.',
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState([1, 2, 4]);
  const [expandedLever, setExpandedLever] = useState(1);
  const [activeCompTab, setActiveCompTab] = useState('ingredients');
  const [exportNote, setExportNote] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter((p) => {
      const matchesGroup = stageFilter === 'all' || p.group === stageFilter;
      const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.cancer.toLowerCase().includes(q) ||
        p.candidate.toLowerCase().includes(q) ||
        p.target.toLowerCase().includes(q) ||
        p.masterCluster.toLowerCase().includes(q) ||
        p.improvement.toLowerCase().includes(q);
      return matchesGroup && matchesPlatform && matchesQuery;
    });
  }, [searchQuery, stageFilter, platformFilter]);

  const selectedProgram = useMemo(
    () => PROGRAMS.find((p) => p.id === selectedId) || null,
    [selectedId]
  );

  const pinnedPrograms = useMemo(
    () => PROGRAMS.filter((p) => pinnedIds.includes(p.id)),
    [pinnedIds]
  );

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const handleExportCsv = () => {
    const headers = [
      'Code',
      'Cancer',
      'Candidate',
      'Platform',
      'Master_Cluster',
      'Evidence_Stage',
      'Target',
      'Baseline_Bottleneck',
      'Proposed_Improvement',
      'Trial_Design',
      'Primary_Endpoint',
      'Source_URL',
    ];
    const esc = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const rows = filteredPrograms.map((p) =>
      [
        p.code,
        p.cancer,
        p.candidate,
        p.platform,
        p.masterCluster,
        p.evidenceStage,
        p.target,
        p.baselineBottleneck,
        p.improvement,
        p.trialDesign,
        p.primaryEndpoint,
        p.sourceUrl,
      ]
        .map(esc)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cancer-vaccine-study-plan.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportNote(`Exported ${filteredPrograms.length} protocols to CSV.`);
    setTimeout(() => setExportNote(''), 3500);
  };

  const stageBadgeClass = (stage) => {
    if (stage === 'Approved / Standard Care') return 'badge-pink';
    if (stage === 'Positive Phase 3 Add-On') return 'badge-sky';
    if (stage === 'Missed Phase 2/3 Endpoint') return 'badge-indigo';
    return 'badge-blue';
  };

  return (
    <div className="app-shell">
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #070B19; color: #F8FAFC; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .app-shell { background: radial-gradient(circle at 12% 8%, rgba(255,46,147,0.16), transparent 36%), radial-gradient(circle at 88% 14%, rgba(37,99,235,0.22), transparent 40%), #070B19; color: #F8FAFC; min-height: 100vh; }
        .nav-glass { background: rgba(7, 11, 25, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(56, 189, 248, 0.22); }
        .brand-dot { width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, #FF2E93, #38BDF8); display: inline-block; margin-right: 8px; }
        .nav-link-custom { color: #CBD5E1; text-decoration: none; font-size: 0.88rem; font-weight: 500; padding: 0.4rem 0.7rem; border-radius: 999px; transition: all 0.2s; }
        .nav-link-custom:hover { color: #FFFFFF; background: rgba(255, 46, 147, 0.16); }
        .hero-band { padding: 5rem 0 3.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.15); }
        .hero-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 46, 147, 0.14); border: 1px solid rgba(255, 46, 147, 0.45); color: #FF85C0; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 600; }
        .hero-title { font-size: clamp(2rem, 4.2vw, 3.35rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; color: #FFFFFF; }
        .gradient-text { background: linear-gradient(90deg, #FF2E93 0%, #FF6BB5 40%, #38BDF8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-card { background: linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(30, 58, 138, 0.28)); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 16px; padding: 1.25rem; height: 100%; }
        .stat-num { font-size: 2.1rem; font-weight: 800; line-height: 1; }
        .stat-pink { color: #FF2E93; }
        .stat-sky { color: #38BDF8; }
        .section-pad { padding: 4.25rem 0; border-bottom: 1px solid rgba(148, 163, 184, 0.12); }
        .sec-heading { font-size: clamp(1.5rem, 2.5vw, 2.05rem); font-weight: 700; color: #FFFFFF; margin-bottom: 0.5rem; }
        .sec-sub { color: #94A3B8; max-width: 68ch; margin-bottom: 2rem; }
        .glass-card { background: rgba(15, 23, 42, 0.86); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 16px; padding: 1.35rem; transition: border-color 0.2s; }
        .glass-card:hover { border-color: rgba(255, 46, 147, 0.55); }
        .lever-btn { background: transparent; border: none; color: inherit; width: 100%; text-align: left; padding: 0; }
        .btn-pink { background: linear-gradient(90deg, #FF2E93, #E11D74); color: #FFFFFF; border: none; font-weight: 600; border-radius: 10px; padding: 0.52rem 1.05rem; cursor: pointer; }
        .btn-pink:hover { filter: brightness(1.08); color: #FFFFFF; }
        .btn-blue-outline { background: rgba(37, 99, 235, 0.14); color: #93C5FD; border: 1px solid rgba(56, 189, 248, 0.35); font-weight: 600; border-radius: 10px; padding: 0.45rem 0.9rem; cursor: pointer; }
        .btn-blue-outline.active, .btn-blue-outline:hover { background: #2563EB; color: #FFFFFF; border-color: #38BDF8; }
        .filter-pill { background: rgba(15, 23, 42, 0.9); color: #CBD5E1; border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 999px; padding: 0.38rem 0.9rem; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.18s; }
        .filter-pill.active { background: linear-gradient(90deg, #FF2E93, #2563EB); color: #FFFFFF; border-color: transparent; }
        .badge-pink { background: rgba(255, 46, 147, 0.18); color: #FF85C0; border: 1px solid rgba(255, 46, 147, 0.45); }
        .badge-sky { background: rgba(56, 189, 248, 0.16); color: #7DD3FC; border: 1px solid rgba(56, 189, 248, 0.45); }
        .badge-indigo { background: rgba(99, 102, 241, 0.18); color: #A5B4FC; border: 1px solid rgba(99, 102, 241, 0.45); }
        .badge-blue { background: rgba(37, 99, 235, 0.2); color: #93C5FD; border: 1px solid rgba(37, 99, 235, 0.45); }
        .program-badge { display: inline-block; font-size: 0.74rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
        .input-dark { background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(56, 189, 248, 0.3); color: #F8FAFC; border-radius: 10px; padding: 0.55rem 0.9rem 0.55rem 2.3rem; width: 100%; }
        .input-dark::placeholder { color: #64748B; }
        .input-dark:focus { outline: none; border-color: #FF2E93; box-shadow: 0 0 0 3px rgba(255, 46, 147, 0.2); }
        .modal-backdrop-custom { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.82); backdrop-filter: blur(6px); z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal-panel { background: #0F172A; border: 1px solid rgba(255, 46, 147, 0.45); border-radius: 18px; max-width: 760px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 1.75rem; box-shadow: 0 24px 60px rgba(0,0,0,0.65); }
        .comp-box { background: rgba(30, 58, 138, 0.16); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 14px; padding: 1.25rem; height: 100%; }
        .comp-box p { color: #FF85C0 !important; opacity: 1 !important; }
        .timeline-step { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 10px; padding: 0.65rem 0.75rem; font-size: 0.8rem; color: #E2E8F0; }
        .pin-btn { background: transparent; border: 1px solid rgba(148,163,184,0.3); color: #CBD5E1; border-radius: 8px; padding: 0.28rem 0.55rem; font-size: 0.76rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
        .pin-btn.pinned { background: rgba(255,46,147,0.2); border-color: #FF2E93; color: #FF85C0; }
        .table-dark-custom th { color: #94A3B8; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; border-color: rgba(148,163,184,0.2); }
        .table-dark-custom td { color: #E2E8F0; font-size: 0.86rem; border-color: rgba(148,163,184,0.14); vertical-align: top; }
        .table-dark-custom td:not(:first-child) { color: #FF85C0; }
                .table-dark-custom { --bs-table-bg: transparent; --bs-table-color: #E2E8F0; background-color: transparent !important; }
        .table-dark-custom th, .table-dark-custom td { background-color: transparent !important; }
        a.ext-link { color: #38BDF8; text-decoration: none; font-weight: 500; }
        a.ext-link:hover { color: #FF6BB5; text-decoration: underline; }
      `}</style>


      <nav className="nav-glass sticky-top py-2">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
          <a href="#overview" className="text-white text-decoration-none fw-bold d-flex align-items-center">
            <span className="brand-dot" />
            <span>OncoVax Study Blueprint</span>
          </a>
          <div className="d-flex flex-wrap align-items-center gap-1">
            <a href="#bottlenecks" className="nav-link-custom">Bottlenecks</a>
            <a href="#master-upgrades" className="nav-link-custom">Master Design</a>
            <a href="#evidence" className="nav-link-custom">Evidence Data</a>
            <a href="#deep-dive" className="nav-link-custom">#01 vs #02</a>
            <a href="#protocols" className="nav-link-custom">20 Protocols</a>
            <a href="#compare" className="nav-link-custom">Compare ({pinnedPrograms.length})</a>
            <a href="#lung-standard" className="nav-link-custom">Stage IV Lung</a>
          </div>
        </div>
      </nav>

      <header id="overview" className="hero-band">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="hero-pill mb-3">
                <Sparkles size={15} />
                <span>20-Indication Master Study Blueprint · Nov 2026 Evidence</span>
              </div>
              <h1 className="hero-title mb-3">
                Next-Generation Cancer Vaccines: <span className="gradient-text">From Single Targets to Low-Burden Precision</span>
              </h1>
              <p className="text-light opacity-75 fs-5 mb-4">
                Across 20 human cancer vaccine programs, immune activation alone rarely shrinks bulky tumors. Explore the 4 biological bottlenecks, 4 master-protocol study upgrades, side-by-side protocol comparisons, and randomized trial designs for all 20 indications.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <a href="#protocols" className="btn-pink text-decoration-none d-inline-flex align-items-center gap-2">
                  <span>Explore All 20 Protocols</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#master-upgrades" className="btn-blue-outline text-decoration-none">
                  Master Protocol Architecture
                </a>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-num stat-pink">20</div>
                    <div className="fw-semibold text-white mt-2">Cancer Programs</div>
                    <div className="small text-secondary mt-1">Fact-checked through Nov 2026 trials</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-num stat-sky">4</div>
                    <div className="fw-semibold text-white mt-2">Master Upgrades</div>
                    <div className="small text-secondary mt-1">Basket, ctDNA bridge, 6-mo gate, dosing</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-num stat-sky">2 + 2</div>
                    <div className="fw-semibold text-white mt-2">Approved / Ph 3 Win</div>
                    <div className="small text-secondary mt-1">#01, #11 BCG + #02, #03 REGAL</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-num stat-pink">16</div>
                    <div className="fw-semibold text-white mt-2">Need Redesign</div>
                    <div className="small text-secondary mt-1">4 missed endpoints; 12 early-stage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="bottlenecks" className="section-pad">
        <div className="container">
          <h2 className="sec-heading">Four Biological Bottlenecks &amp; Upgrade Levers</h2>
          <p className="sec-sub">
            Click any lever below to expand the biological mechanism explaining why legacy single-antigen trials stalled—and how upgraded trials fix it.
          </p>
          <div className="row g-3">
            {LEVERS.map((lever) => {
              const isOpen = expandedLever === lever.id;
              return (
                <div key={lever.id} className="col-md-6">
                  <div className="glass-card h-100">
                    <button
                      type="button"
                      className="lever-btn"
                      onClick={() => setExpandedLever(isOpen ? null : lever.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <span className="program-badge badge-pink mb-2">Lever 0{lever.id}</span>
                          <h3 className="h5 fw-bold text-white mb-1">{lever.title}</h3>
                          <p className="small text-info mb-0">{lever.summary}</p>
                        </div>
                        <span className="text-info mt-1">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 small text-light opacity-75">
                        {lever.detail}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="master-upgrades" className="section-pad">
        <div className="container">
          <h2 className="sec-heading d-flex align-items-center gap-2">
            <GitBranch size={26} color="#38BDF8" />
            <span>Master-Protocol &amp; Operational Study Upgrades</span>
          </h2>
          <p className="sec-sub">
            Beyond individual antigens, these four trial-design upgrades solve tissue-screening dropouts, 6–8 week manufacturing delays, and late-stage futility across all 20 indications.
          </p>
          <div className="row g-3">
            {MASTER_UPGRADES.map((u) => (
              <div key={u.id} className="col-md-6 col-lg-3">
                <div className="glass-card h-100" style={{ borderColor: 'rgba(56,189,248,0.28)' }}>
                  <span className="program-badge badge-sky mb-2">{u.tag}</span>
                  <h3 className="h6 fw-bold text-white mb-2">{u.title}</h3>
                  <p className="small text-light opacity-75 mb-0">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="evidence" className="section-pad">
        <div className="container">
          <h2 className="sec-heading">Clinical Evidence &amp; Platform Breakdown</h2>
          <p className="sec-sub">
            Twelve of twenty candidates remain in early Phase 1–2 testing, while four missed late-stage endpoints despite triggering measurable T-cell responses.
          </p>
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="glass-card h-100">
                <h3 className="h6 fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <Activity size={18} color="#FF2E93" />
                  <span>20 Programs by Highest Human Evidence Stage</span>
                </h3>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EVIDENCE_CHART_DATA} layout="vertical" margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis type="number" stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 12 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={130} stroke="#94A3B8" tick={{ fill: '#F8FAFC', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #FF2E93', borderRadius: 10, color: '#FFF' }}
                      />
                      <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                        {EVIDENCE_CHART_DATA.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="glass-card h-100">
                <h3 className="h6 fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <Layers size={18} color="#38BDF8" />
                  <span>Programs by Vaccine Platform (Total = 20)</span>
                </h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PLATFORM_CHART_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={82}
                        paddingAngle={3}
                      >
                        {PLATFORM_CHART_DATA.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #38BDF8', borderRadius: 10, color: '#FFF' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-2 small">
                  {PLATFORM_CHART_DATA.map((item) => (
                    <span key={item.name} className="d-inline-flex align-items-center gap-1 text-light">
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                      {item.name}: <strong>{item.value}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="deep-dive" className="section-pad">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h2 className="sec-heading">Deep Dive: #01 Sipuleucel-T vs. #02 Intismeran Autogene</h2>
              <p className="sec-sub mb-0">
                Comparing the first FDA-approved cell vaccine with the newest 2026 Phase 3 personalized mRNA vaccine.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn-blue-outline ${activeCompTab === 'ingredients' ? 'active' : ''}`}
                onClick={() => setActiveCompTab('ingredients')}
              >
                Ingredients &amp; Formula
              </button>
              <button
                type="button"
                className={`btn-blue-outline ${activeCompTab === 'side_effects' ? 'active' : ''}`}
                onClick={() => setActiveCompTab('side_effects')}
              >
                Side Effects &amp; Causes
              </button>
              <button
                type="button"
                className={`btn-blue-outline ${activeCompTab === 'improvements' ? 'active' : ''}`}
                onClick={() => setActiveCompTab('improvements')}
              >
                How #02 Improves on #01
              </button>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="comp-box">
                <span className="program-badge badge-pink mb-2">#01 · Prostate Cancer (FDA-Approved)</span>
                <h3 className="h5 fw-bold text-white">Sipuleucel-T (Provenge)</h3>
                {activeCompTab === 'ingredients' && (
                  <p className="small text-light opacity-75 mb-0 mt-2">
                    Living autologous immune cells (&gt;=50 million CD54+ antigen-presenting cells) collected via leukapheresis, incubated for ~40 hours with recombinant <strong>PAP-GM-CSF</strong> fusion protein, and suspended in 250 mL Lactated Ringer’s Injection with no preservatives.
                  </p>
                )}
                {activeCompTab === 'side_effects' && (
                  <p className="small text-light opacity-75 mb-0 mt-2">
                    <strong>Fever, chills, fatigue, aches (&gt;=15%):</strong> Caused by cytokine release (TNF-alpha, IL-12, IFN-gamma) as infused cells activate T cells. <strong>Lip/finger tingling:</strong> Caused by citrate blood-thinner binding free calcium during leukapheresis. Rare serious infusion reactions (3.5%).
                  </p>
                )}
                {activeCompTab === 'improvements' && (
                  <p className="small text-light opacity-75 mb-0 mt-2">
                    Relies on a single shared target (PAP) in advanced metastatic disease (~4-month OS gain without tumor shrinkage). Requires 3 blood-filtering sessions and 3 IV infusions over ~1 month.
                  </p>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="comp-box" style={{ borderColor: 'rgba(255,46,147,0.35)' }}>
                <span className="program-badge badge-sky mb-2">#02 · Melanoma (2026 Phase 3 Win)</span>
                <h3 className="h5 fw-bold text-white">Intismeran Autogene (mRNA-4157)</h3>
                {activeCompTab === 'ingredients' && (
                  <p className="small text-light opacity-75 mb-0 mt-2">
                    Synthetic mRNA strand encoding up to <strong>34 tumor-specific neoantigens</strong> identified by comparing tumor DNA vs. blood DNA, encapsulated in microscopic lipid nanoparticles and given as a standard intramuscular shot.
                  </p>
                )}
                {activeCompTab === 'side_effects' && (
                  <p className="small text-light opacity-75 mb-0 mt-2">
                    <strong>Injection-site pain, fever, fatigue:</strong> Similar to standard mRNA vaccines, clearing quickly. No leukapheresis means <strong>zero citrate tingling</strong>. Grade 3+ events (14.2% vs. 13.4%) were driven mainly by pembrolizumab, not the vaccine.
                  </p>
                )}
                {activeCompTab === 'improvements' && (
                  <p className="small text-light opacity-75 mb-0 mt-2">
                    Upgrades from 1 target to 34 patient-specific targets, moves earlier to post-surgery adjuvant care, and pairs with pembrolizumab—cutting recurrence or death risk by <strong>42%</strong> in Phase 3 INTerpath-001.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="protocols" className="section-pad">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
            <div>
              <h2 className="sec-heading">20-Indication Clinical Study Protocol Explorer</h2>
              <p className="sec-sub mb-0">
                Filter by clinical stage or platform, pin up to 3 protocols to compare side-by-side, or click <strong>View Study Plan</strong> for the full trial timeline.
              </p>
            </div>
            <button type="button" className="btn-blue-outline d-inline-flex align-items-center gap-2" onClick={handleExportCsv}>
              <Download size={15} />
              <span>Export Filtered CSV</span>
            </button>
          </div>

          {exportNote && (
            <div className="alert py-2 px-3 small mb-3" style={{ background: 'rgba(56,189,248,0.16)', border: '1px solid #38BDF8', color: '#E0F2FE' }}>
              {exportNote}
            </div>
          )}

          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-5 position-relative">
              <Search size={16} className="position-absolute" style={{ left: 24, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                className="input-dark"
                placeholder="Search cancer, vaccine, master cluster, or endpoint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-7 d-flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All 20' },
                { key: 'advanced', label: '#01–#05 Approved / Ph 3' },
                { key: 'solid', label: '#06–#15 Solid Tumors' },
                { key: 'rare_heme', label: '#16–#20 Rare & Blood' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  className={`filter-pill ${stageFilter === btn.key ? 'active' : ''}`}
                  onClick={() => setStageFilter(btn.key)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
            <span className="small text-secondary d-inline-flex align-items-center gap-1 me-1">
              <Filter size={14} /> Platform:
            </span>
            {['all', 'Peptide', 'Cell-Based', 'mRNA / DNA', 'Local BCG / MIBC'].map((plat) => (
              <button
                key={plat}
                type="button"
                className={`filter-pill ${platformFilter === plat ? 'active' : ''}`}
                onClick={() => setPlatformFilter(plat)}
              >
                {plat === 'all' ? 'All Platforms' : plat}
              </button>
            ))}
            <span className="ms-auto small text-info">
              Showing <strong>{filteredPrograms.length}</strong> of 20 protocols
            </span>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="glass-card text-center py-5">
              <AlertCircle size={28} color="#FF2E93" className="mb-2" />
              <div className="fw-semibold text-white">No protocols match your current filters.</div>
              <button
                type="button"
                className="btn-pink mt-3"
                onClick={() => {
                  setSearchQuery('');
                  setStageFilter('all');
                  setPlatformFilter('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {filteredPrograms.map((prog) => {
                const isPinned = pinnedIds.includes(prog.id);
                return (
                  <div key={prog.id} className="col-md-6 col-xl-4">
                    <div className="glass-card h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                          <span className="fw-bold" style={{ color: '#FF6BB5', fontSize: '0.84rem' }}>
                            #{prog.code} · {prog.platform}
                          </span>
                          <span className={`program-badge ${stageBadgeClass(prog.evidenceStage)}`}>
                            {prog.evidenceStage}
                          </span>
                        </div>
                        <h3 className="h5 fw-bold text-white mb-1">{prog.cancer}</h3>
                        <div className="small text-info fw-medium mb-1">{prog.candidate}</div>
                        <div className="small text-secondary mb-2">Cluster: {prog.masterCluster}</div>
                        <p className="small text-light opacity-75 mb-3">
                          <strong className="text-info">Upgrade:</strong> {prog.improvement}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top border-secondary border-opacity-25">
                        <button
                          type="button"
                          className="btn-pink py-1 px-3 small"
                          onClick={() => setSelectedId(prog.id)}
                        >
                          View Study Plan
                        </button>
                        <button
                          type="button"
                          className={`pin-btn ${isPinned ? 'pinned' : ''}`}
                          onClick={() => togglePin(prog.id)}
                        >
                          <Pin size={12} />
                          <span>{isPinned ? 'Pinned' : 'Compare'}</span>
                        </button>
                        <a
                          href={prog.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ext-link small d-inline-flex align-items-center gap-1"
                        >
                          <span>Source</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="compare" className="section-pad">
        <div className="container">
          <h2 className="sec-heading">Side-by-Side Protocol Comparator (Up to 3)</h2>
          <p className="sec-sub">
            Use the <strong>Compare</strong> button on any card above to pin up to 3 cancer programs and inspect their bottlenecks, master clusters, and endpoints together.
          </p>
          {pinnedPrograms.length === 0 ? (
            <div className="glass-card small text-secondary">
              No protocols pinned yet. Click <strong>Compare</strong> on any protocol card above.
            </div>
          ) : (
            <div className="glass-card table-responsive">
              <table className="table table-dark-custom mb-0">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    {pinnedPrograms.map((p) => (
                      <th key={p.id}>
                        #{p.code} {p.cancer}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-semibold text-info">Candidate</td>
                    {pinnedPrograms.map((p) => (
                      <td key={p.id}>{p.candidate}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-semibold text-info">Master Cluster</td>
                    {pinnedPrograms.map((p) => (
                      <td key={p.id}>{p.masterCluster}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-semibold text-info">Target</td>
                    {pinnedPrograms.map((p) => (
                      <td key={p.id}>{p.target}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-semibold text-info">Upgrade</td>
                    {pinnedPrograms.map((p) => (
                      <td key={p.id}>{p.improvement}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-semibold text-info">Primary Endpoint</td>
                    {pinnedPrograms.map((p) => (
                      <td key={p.id}>{p.primaryEndpoint}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section id="lung-standard" className="section-pad">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <h2 className="sec-heading d-flex align-items-center gap-2">
                <ShieldCheck size={28} color="#FF2E93" />
                <span>Stage IV Lung Cancer Standard &amp; Clinical Safety Guardrails</span>
              </h2>
              <p className="text-light opacity-75 mb-3">
                For stage IV lung cancer, no personalized vaccine has proven it can replace first-line chemotherapy, immunotherapy, or targeted therapy. Establishing replacement requires a randomized Phase 3 trial comparing vaccine monotherapy head-to-head against the best available treatment for that exact lung cancer subtype on overall survival, progression-free survival, and side effects (
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC13418499/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ext-link"
                >
                  PMC13418499
                </a>
                ).
              </p>
              <p className="small text-secondary mb-0">
                All 20 candidates are clinical biologics manufactured under sterile GMP controls—never suitable for home preparation or injection.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="glass-card" style={{ borderColor: 'rgba(56,189,248,0.4)' }}>
                <div className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} color="#38BDF8" />
                  <span>3 Shared Protocol Guardrails</span>
                </div>
                <ul className="small text-light opacity-75 mb-0 ps-3">
                  <li className="mb-1">Pre-infusion acetaminophen &amp; antihistamine prophylaxis</li>
                  <li className="mb-1">Centralized ctDNA screening + bridging vaccine</li>
                  <li>Mandatory randomized standard-of-care control arms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-4">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2 small text-secondary">
          <span>20-Indication Therapeutic Cancer Vaccine Study Blueprint · Grounded in FDA, NCI, PubMed &amp; 2026 Phase 3 Data</span>
          <a href="#overview" className="ext-link">Back to top</a>
        </div>
      </footer>

      {selectedProgram && (
        <div
          className="modal-backdrop-custom"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedId(null)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <div>
                <span className={`program-badge ${stageBadgeClass(selectedProgram.evidenceStage)} mb-2`}>
                  #{selectedProgram.code} · {selectedProgram.platform} · {selectedProgram.masterCluster}
                </span>
                <h3 className="h4 fw-bold text-white mb-1">{selectedProgram.cancer}</h3>
                <div className="text-info fw-semibold">{selectedProgram.candidate}</div>
              </div>
              <button
                type="button"
                className="btn-blue-outline p-2"
                aria-label="Close modal"
                onClick={() => setSelectedId(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <div className="small fw-bold text-info mb-2">Trial Execution Sequence</div>
              <div className="row g-2">
                {selectedProgram.timeline.map((step, idx) => (
                  <div key={idx} className="col-6 col-md-3">
                    <div className="timeline-step h-100">
                      <div className="fw-bold mb-1" style={{ color: '#FF6BB5' }}>Step {idx + 1}</div>
                      <div>{step}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row g-3 small">
              <div className="col-12">
                <div className="p-3 rounded-3" style={{ background: 'rgba(30, 58, 138, 0.22)' }}>
                  <div className="fw-bold text-info mb-1 d-flex align-items-center gap-1">
                    <Target size={15} /> Target &amp; Baseline Bottleneck
                  </div>
                  <div className="text-light mb-1"><strong>Target:</strong> {selectedProgram.target}</div>
                  <div className="text-light opacity-75">{selectedProgram.baselineBottleneck}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 46, 147, 0.12)', border: '1px solid rgba(255,46,147,0.3)' }}>
                  <div className="fw-bold mb-1 d-flex align-items-center gap-1" style={{ color: '#FF85C0' }}>
                    <FlaskConical size={15} /> Proposed Study Improvement
                  </div>
                  <div className="text-white">{selectedProgram.improvement}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <div className="fw-bold text-info mb-1">Trial Design &amp; Endpoint</div>
                  <div className="text-light opacity-75 mb-1">{selectedProgram.trialDesign}</div>
                  <div className="text-white"><strong>Primary Endpoint:</strong> {selectedProgram.primaryEndpoint}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <div className="fw-bold text-info mb-1">Safety &amp; Reaction Mitigation</div>
                  <div className="text-light opacity-75">{selectedProgram.sideEffectMitigation}</div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary border-opacity-25">
              <a
                href={selectedProgram.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link d-inline-flex align-items-center gap-1"
              >
                <span>{selectedProgram.sourceLabel}</span>
                <ExternalLink size={14} />
              </a>
              <button type="button" className="btn-pink" onClick={() => setSelectedId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

