import pandas as pd
import json
import torch
from sentence_transformers import SentenceTransformer, util
from collections import defaultdict
from tqdm import tqdm
import os
import re
import zipfile

# ============================================================
# CONFIG
# ============================================================
SAMPLE_PER_DATASET = 50000
RANDOM_SEED = 42
OUTPUT_PATH = "skillpath/data/mvc_model.json"

# ============================================================
# Predefined skills to look for (fast keyword extraction for CPU)
# ============================================================
TECH_SKILLS = [
    # Software & Web
    "python", "java", "c++", "c#", "javascript", "typescript", "ruby", "php", "go", "rust", "swift", "kotlin",
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "oracle", "sql server",
    "react", "angular", "vue", "node.js", "express", "django", "flask", "spring", "asp.net", "ruby on rails",
    "html", "css", "sass", "webpack", "git", "next.js", "tailwind", "graphql", "rest api", "grpc",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "gitlab ci", "github actions",
    "ci/cd", "devops", "microservices", "linux", "bash", "powershell", "gitops", "argocd", "datadog", "grafana", "prometheus",
    
    # Data & AI
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "scikit-learn", "pandas",
    "data analysis", "data visualization", "tableau", "power bi", "excel", "statistics", "a/b testing",
    "spark", "hadoop", "kafka", "airflow", "dbt", "snowflake", "bigquery", "looker", "etl", "data modeling",
    "jax", "transformers", "llm", "rlhf", "model monitoring", "mlops",
    
    # Product & Design
    "product management", "agile", "scrum", "kanban", "jira", "confluence", "roadmapping", "user research",
    "wireframing", "prototyping", "design systems", "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "ux research", "user testing", "information architecture", "accessibility", "wcag", "interaction design",
    "motion design", "adobe creative suite",
    
    # Blockchain
    "solidity", "smart contracts", "ethereum", "web3.js", "ethers.js", "defi", "ipfs", "tokenomics", "layer 2", "zero-knowledge proofs",
    
    # Business, Finance & Sales
    "finance", "financial modelling", "vba", "fp&a", "variance analysis", "valuation", "dcf", "erp", "sap",
    "marketing", "seo", "sem", "content marketing", "email marketing", "social media marketing", "google analytics",
    "sales", "b2b", "b2c", "crm", "salesforce", "hubspot", "lead generation", "cold calling", "negotiation",
    "market research", "stakeholder management", "strategy", "project management", "account management",
    "sales forecasting", "bdr", "sdr", "saas sales",
    
    # HR & Legal
    "hris", "talent acquisition", "performance management", "compensation", "benefits", "employee relations",
    "onboarding", "workforce planning", "dei", "labor law", "contract drafting", "corporate law", "compliance",
    "legal research", "litigation", "data privacy", "gdpr", "ccpa", "ats", "boolean search",
    
    # Others
    "communication", "leadership", "problem solving", "teamwork", "time management", "critical thinking",
    "technical writing", "documentation", "swagger", "openapi", "supply chain", "logistics", "procurement",
    "demand forecasting", "clinical analyst", "hipaa", "healthcare analysis", "epr", "epic", "cerner",
]

def sample_df(df, n, seed=RANDOM_SEED):
    """Sample n rows from df, or return all if df is smaller."""
    if len(df) > n:
        return df.sample(n=n, random_state=seed)
    return df

def classify_role(title):
    t = str(title).lower()

    # 1. Executive / C-Suite
    if any(k in t for k in ["chief executive", " ceo", "founder", "co-founder", "cofounder", "managing director", "president"]): return "executive"
    if any(k in t for k in ["chief technology", " cto", "chief architect", "vp engineering", "vp of engineering", "head of engineering"]): return "engineering-leadership"
    if any(k in t for k in ["chief product", " cpo", "vp product", "vp of product", "head of product"]): return "product-leadership"
    if any(k in t for k in ["chief marketing", " cmo", "vp marketing", "head of marketing"]): return "marketing-leadership"
    if any(k in t for k in ["chief financial", " cfo", "vp finance", "head of finance"]): return "finance-leadership"
    if any(k in t for k in ["chief operating", " coo", "vp operations", "head of operations"]): return "operations-leadership"
    if any(k in t for k in ["chief data", " cdo", "chief ai", "vp data", "head of data", "head of ai"]): return "data-leadership"
    if any(k in t for k in ["chief information", " cio", "chief security", " ciso"]): return "it-leadership"
    if any(k in t for k in ["chief people", "chief hr", "vp people", "vp hr", "head of hr", "head of people"]): return "hr-leadership"

    # 2. Highly Specific Niche Roles
    if any(k in t for k in ["machine learning scientist", "ai researcher", "deep learning", "llm researcher", "nlp researcher", "computer vision researcher"]): return "ai-researcher"
    if any(k in t for k in ["machine learning engineer", "ml engineer", "mle", "mlops", "ai engineer", "llm engineer", "generative ai"]): return "ml-engineer"
    if any(k in t for k in ["talent acquisition", "recruiter", "recruiting", "headhunter", "sourcer", "sourcing specialist"]): return "recruiter"
    if any(k in t for k in ["growth hacker", "growth engineer", "growth analyst"]): return "growth-hacker"
    if any(k in t for k in ["solutions architect", "cloud architect", "enterprise architect", "technical architect", "software architect"]): return "solutions-architect"
    if any(k in t for k in ["blockchain", "solidity", "web3", "crypto", "defi", "nft", "smart contract"]): return "blockchain-developer"
    if any(k in t for k in ["game", "unity", "unreal", "game engine", "gameplay", "level designer"]): return "game-developer"
    if any(k in t for k in ["cyber", "security engineer", "security analyst", "infosec", "penetration", "pentester", "red team", "blue team", "soc analyst", "threat intelligence", "vulnerability"]): return "cybersecurity"
    if any(k in t for k in ["robotics", "ros engineer", "automation engineer", "mechatronics"]): return "robotics-engineer"
    if any(k in t for k in ["hardware engineer", "vlsi", "fpga", "asic", "circuit design", "electrical engineer", "electronics engineer"]): return "hardware-engineer"
    if any(k in t for k in ["network engineer", "network administrator", "network architect", "cisco", "juniper", "noc"]): return "network-engineer"
    if any(k in t for k in ["database administrator", "dba", "database engineer", "sql server admin", "oracle dba"]): return "database-admin"

    # 3. Specialized Engineering
    if any(k in t for k in ["mobile", "ios", "android", "swift", "kotlin", "flutter", "react native", "xamarin"]): return "mobile-developer"
    if any(k in t for k in ["frontend", "front-end", "front end", "react", "next.js", "vue", "angular", "svelte", "ui developer", "web developer"]): return "frontend-developer"
    if any(k in t for k in ["backend", "back-end", "back end", "node.js", "go engineer", "django", "rails", "spring", "api developer", "server-side"]): return "backend-developer"
    if any(k in t for k in ["full stack", "fullstack", "full-stack"]): return "fullstack-developer"
    if any(k in t for k in ["devops", "sre", "site reliability", "platform engineer", "infrastructure engineer", "release engineer", "build engineer"]): return "devops"
    if any(k in t for k in ["qa", "quality assurance", "test engineer", "automation engineer", "sdet", "tester", "performance engineer", "load testing"]): return "qa-engineer"
    if any(k in t for k in ["embedded", "firmware", "microcontroller", "rtos", "bare metal", "systems programmer"]): return "embedded-systems"
    if any(k in t for k in ["cloud", "infrastructure", "aws", "azure", "gcp", "google cloud", "kubernetes", "terraform", "ansible"]): return "cloud-infra"
    if any(k in t for k in ["data engineer", "etl", "data pipeline", "analytics engineer", "spark", "airflow", "dbt", "kafka", "flink"]): return "data-engineer"

    # 4. Specialized Business / Management
    if any(k in t for k in ["product manager", "product owner", "product lead", "group product manager", "director of product"]): return "product-manager"
    if any(k in t for k in ["technical program manager", "tpm", "engineering program manager"]): return "technical-program-manager"
    if any(k in t for k in ["scrum master", "agile coach", "agile consultant"]): return "scrum-master"
    if any(k in t for k in ["project manager", "pmp", "program manager", "delivery manager"]): return "project-manager"
    if any(k in t for k in ["operations manager", "operations lead", "biz ops", "business operations", "revenue operations", "revops"]): return "operations-manager"
    if any(k in t for k in ["business analyst", "business systems analyst", "functional analyst"]): return "business-analyst"
    if any(k in t for k in ["financial planning", "finance manager", "finance director", "accounting", "fp&a", "controller", "investment banking", "private equity", "venture capital", "portfolio manager", "actuary"]): return "finance"
    if any(k in t for k in ["risk analyst", "risk manager", "risk officer", "compliance officer", "audit", "auditor"]): return "risk-compliance"
    if any(k in t for k in ["supply chain", "logistics", "procurement", "sourcing manager", "inventory", "warehouse manager", "fulfillment"]): return "supply-chain"

    # 5. Data / Analytics
    if any(k in t for k in ["data analyst", "data scientist", "machine learning", "bi analyst", "business intelligence", "bi developer", "reporting analyst", "quantitative analyst", "quant"]): return "data-professional"

    # 6. Sales
    if any(k in t for k in ["sales engineer", "presales", "pre-sales", "solution engineer"]): return "sales-engineer"
    if any(k in t for k in ["sales manager", "sales director", "vp sales", "head of sales", "sales lead"]): return "sales-manager"
    if any(k in t for k in ["sales", "account executive", "sdr", "bdr", "inside sales", "field sales", "channel sales", "enterprise sales"]): return "sales"

    # 7. Marketing
    if any(k in t for k in ["demand generation", "demand gen", "performance marketing", "paid media", "ppc", "sem", "seo", "email marketing", "marketing automation", "crm marketing"]): return "performance-marketer"
    if any(k in t for k in ["brand manager", "brand strategist", "brand director"]): return "brand-manager"
    if any(k in t for k in ["marketing manager", "marketing director", "vp marketing", "head of marketing", "marketing lead", "marketing", "growth", "social media manager", "community manager"]): return "marketing"

    # 8. Customer-Facing
    if any(k in t for k in ["customer success", "customer success manager", "csm", "account manager"]): return "customer-success"
    if any(k in t for k in ["customer support", "support engineer", "technical support", "helpdesk", "help desk", "it support", "service desk"]): return "support"

    # 9. Consulting / Strategy
    if any(k in t for k in ["management consultant", "strategy consultant", "consultant", "consulting", "strategy analyst", "strategy manager"]): return "consultant"

    # 10. People / HR
    if any(k in t for k in ["hr", "human resources", "people operations", "people partner", "hrbp", "compensation", "benefits", "workforce planning", "learning and development", "l&d", "organizational development"]): return "hr"

    # 11. Legal
    if any(k in t for k in ["legal", "lawyer", "attorney", "counsel", "compliance", "paralegal", "legal ops", "intellectual property", "patent"]): return "legal"

    # 12. Design / Creative
    if any(k in t for k in ["product designer", "ux designer", "ui designer", "ux researcher", "interaction designer", "designer", "ux", "ui", "figma", "visual design"]): return "designer"
    if any(k in t for k in ["content creator", "content writer", "content strategist", "video editor", "copywriter", "editor", "journalist", "blogger"]): return "content-creator"
    if any(k in t for k in ["technical writer", "documentation engineer", "api writer", "documentation specialist"]): return "technical-writer"
    if any(k in t for k in ["motion designer", "graphic designer", "brand designer", "illustrator", "animator", "creative director", "art director"]): return "graphic-designer"

    # 13. Healthcare / Science
    if any(k in t for k in ["healthcare analyst", "clinical analyst", "clinical data", "health informatics", "medical analyst"]): return "healthcare-analyst"
    if any(k in t for k in ["nurse", "physician", "doctor", "clinician", "pharmacist", "therapist", "radiologist", "surgeon"]): return "healthcare-practitioner"
    if any(k in t for k in ["research scientist", "scientist", "bioinformatics", "computational biology", "chemist", "physicist", "lab researcher"]): return "scientist"

    # 14. Education / Training
    if any(k in t for k in ["teacher", "instructor", "professor", "lecturer", "tutor", "curriculum", "e-learning", "learning designer", "trainer", "coach"]): return "educator"

    # 15. IT / System Administration
    if any(k in t for k in ["it manager", "it director", "sysadmin", "system administrator", "systems engineer", "it administrator", "active directory", "endpoint", "it specialist"]): return "it-admin"

    # 16. Generic Fallback
    if any(k in t for k in ["software", "developer", "engineer", "programmer", "coder"]): return "software-engineer"

    return "other"

def extract_skills(text):
    """Extract matching skills from text using regex word boundaries."""
    text = str(text).lower()
    found = []
    for skill in TECH_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            found.append(skill)
    return found


# ============================================================
# LOAD MODEL
# ============================================================
print("=" * 60)
print("SkillPath MVC Model Training Pipeline")
print("=" * 60)
print(f"Target: {SAMPLE_PER_DATASET} samples per dataset")
print()

print("Loading Sentence Transformer for skill normalization...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
print()

# ============================================================
# LOAD ALL 7 DATASETS
# ============================================================
all_frames = []

# --- Dataset 1: LinkedIn Job Descriptions (postings.csv) ---
print("[1/7] Loading LinkedIn Job Descriptions...")
try:
    df1 = pd.read_csv("assest/linkedin_jd/postings.csv", usecols=["title", "description"]).dropna()
    df1 = sample_df(df1, SAMPLE_PER_DATASET)
    df1["source"] = "linkedin_jd"
    all_frames.append(df1)
    print(f"  [OK] {len(df1)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# --- Dataset 2: Data Science Salaries (archive 5) ---
print("[2/7] Loading Data Science Salaries...")
try:
    with zipfile.ZipFile("assest/archive (5).zip") as z:
        df2 = pd.read_csv(z.open("ds_salaries.csv"))
    df2 = df2.rename(columns={"job_title": "title"})
    # Build a synthetic description from available columns
    df2["description"] = df2.apply(
        lambda r: f"{r.get('title','')} {r.get('experience_level','')} {r.get('employment_type','')} {r.get('company_size','')}",
        axis=1
    )
    df2 = df2[["title", "description"]].dropna()
    df2 = sample_df(df2, SAMPLE_PER_DATASET)
    df2["source"] = "ds_salaries"
    all_frames.append(df2)
    print(f"  [OK] {len(df2)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# --- Dataset 3: Data Science Jobs Salaries (archive 6) ---
print("[3/7] Loading Data Science Jobs Salaries...")
try:
    with zipfile.ZipFile("assest/archive (6).zip") as z:
        df3 = pd.read_csv(z.open("Data Science Jobs Salaries.csv"))
    df3 = df3.rename(columns={"job_title": "title"})
    df3["description"] = df3.apply(
        lambda r: f"{r.get('title','')} {r.get('experience_level','')} {r.get('employment_type','')} {r.get('company_size','')}",
        axis=1
    )
    df3 = df3[["title", "description"]].dropna()
    df3 = sample_df(df3, SAMPLE_PER_DATASET)
    df3["source"] = "ds_jobs_salaries"
    all_frames.append(df3)
    print(f"  [OK] {len(df3)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# --- Dataset 4: Software Engineer Salaries (archive 7) ---
print("[4/7] Loading Software Engineer Salaries...")
try:
    with zipfile.ZipFile("assest/archive (7).zip") as z:
        df4 = pd.read_csv(z.open("Software Engineer Salaries.csv"))
    df4 = df4.rename(columns={"Job Title": "title", "Company": "company"})
    df4["description"] = df4.apply(
        lambda r: f"{r.get('title','')} at {r.get('company','')} {r.get('Location','')}",
        axis=1
    )
    df4 = df4[["title", "description"]].dropna()
    df4 = sample_df(df4, SAMPLE_PER_DATASET)
    df4["source"] = "se_salaries"
    all_frames.append(df4)
    print(f"  [OK] {len(df4)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# --- Dataset 5: Job Market Dataset (archive 8) ---
print("[5/7] Loading Job Market Dataset...")
try:
    with zipfile.ZipFile("assest/archive (8).zip") as z:
        df5 = pd.read_csv(z.open("job_postings.csv"))
    df5 = df5.rename(columns={"job_title": "title"})
    # Combine skills_required + industry + experience level into a rich description
    df5["description"] = df5.apply(
        lambda r: f"{r.get('skills_required','')} {r.get('industry','')} {r.get('experience_level','')} {r.get('education_required','')}",
        axis=1
    )
    df5 = df5[["title", "description"]].dropna()
    df5 = sample_df(df5, SAMPLE_PER_DATASET)
    df5["source"] = "job_market"
    all_frames.append(df5)
    print(f"  [OK] {len(df5)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# --- Dataset 6: Stack Overflow Developer Survey 2025 ---
print("[6/7] Loading Stack Overflow Developer Survey 2025...")
try:
    with zipfile.ZipFile("assest/stack-overflow-developer-survey-2025.zip") as z:
        df6 = pd.read_csv(z.open("survey_results_public.csv"), usecols=[
            "DevType", "LanguageHaveWorkedWith", "DatabaseHaveWorkedWith",
            "WebframeHaveWorkedWith", "PlatformHaveWorkedWith"
        ])
    df6 = df6.rename(columns={"DevType": "title"})
    df6 = df6.dropna(subset=["title"])
    # Combine all tech columns into description (semicolon-separated lists become keyword-rich text)
    df6["description"] = df6.apply(
        lambda r: " ".join([
            str(r.get("LanguageHaveWorkedWith", "")),
            str(r.get("DatabaseHaveWorkedWith", "")),
            str(r.get("WebframeHaveWorkedWith", "")),
            str(r.get("PlatformHaveWorkedWith", "")),
        ]),
        axis=1
    )
    df6 = df6[["title", "description"]].dropna()
    df6 = sample_df(df6, SAMPLE_PER_DATASET)
    df6["source"] = "stackoverflow"
    all_frames.append(df6)
    print(f"  [OK] {len(df6)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# --- Dataset 7: O*NET Occupation Data ---
print("[7/7] Loading O*NET Occupation Data...")
try:
    with zipfile.ZipFile("assest/db_30_2_excel.zip") as z:
        df7 = pd.read_excel(z.open("db_30_2_excel/Occupation Data.xlsx"), usecols=["Title", "Description"])
    df7 = df7.rename(columns={"Title": "title", "Description": "description"})
    df7 = df7.dropna()
    df7 = sample_df(df7, SAMPLE_PER_DATASET)
    df7["source"] = "onet"
    all_frames.append(df7)
    print(f"  [OK] {len(df7)} rows loaded")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# ============================================================
# MERGE ALL DATASETS
# ============================================================
print()
print("=" * 60)
combined = pd.concat(all_frames, ignore_index=True)
print(f"Total combined rows: {len(combined)}")
print(f"Sources: {combined['source'].value_counts().to_dict()}")
print("=" * 60)
print()

# ============================================================
# EXTRACT SKILLS & CLASSIFY ROLES
# ============================================================
role_skills = defaultdict(list)
all_extracted_skills = []
role_counts = defaultdict(int)

print("Extracting skills & classifying roles...")
for _, row in tqdm(combined.iterrows(), total=len(combined)):
    role_category = classify_role(row["title"])
    role_counts[role_category] += 1

    extracted = extract_skills(row["description"])

    if extracted:
        role_skills[role_category].extend(extracted)
        all_extracted_skills.extend(extracted)

print()
print("Role distribution:")
for role, count in sorted(role_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {role}: {count}")
print(f"  Total skills extracted: {len(all_extracted_skills)}")
print()

# ============================================================
# NORMALIZE SKILLS WITH EMBEDDINGS
# ============================================================
print("Normalizing skills with semantic similarity...")
unique_skills = list(set(all_extracted_skills))
print(f"  Unique raw skills: {len(unique_skills)}")

if unique_skills:
    embeddings = embed_model.encode(unique_skills, convert_to_tensor=True)
    canonical_map = {}
    used = set()
    SIMILARITY_THRESHOLD = 0.85

    for i in tqdm(range(len(unique_skills))):
        if i in used:
            continue
        canonical_map[unique_skills[i]] = unique_skills[i]
        for j in range(i + 1, len(unique_skills)):
            if j in used:
                continue
            sim = util.cos_sim(embeddings[i], embeddings[j]).item()
            if sim >= SIMILARITY_THRESHOLD:
                canonical_map[unique_skills[j]] = unique_skills[i]
                used.add(j)
        used.add(i)
    canonical_count = len(set(canonical_map.values()))
    print(f"  Canonical skills after normalization: {canonical_count}")
else:
    canonical_map = {}
print()

# ============================================================
# BUILD MVC PROFILES (top 10 skills per role)
# ============================================================
print("Calculating MVC Profiles (Minimum Viable Candidate)...")
mvc_profiles = {}
for role, skills in role_skills.items():
    norm_skills = [canonical_map.get(s, s) for s in skills]

    freq = defaultdict(int)
    for s in norm_skills:
        freq[s] += 1

    sorted_skills = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    top_skills = [{"skill": s[0], "count": s[1]} for s in sorted_skills[:30]]
    mvc_profiles[role] = top_skills

# ============================================================
# SAVE
# ============================================================
os.makedirs("data", exist_ok=True)
with open(OUTPUT_PATH, "w") as f:
    json.dump(mvc_profiles, f, indent=2)

print()
print("=" * 60)
print(f"Training complete! MVC profiles saved to {OUTPUT_PATH}")
print(f"Roles profiled: {list(mvc_profiles.keys())}")
print(f"Total data processed: {len(combined)} rows from {len(all_frames)} datasets")
print("=" * 60)
