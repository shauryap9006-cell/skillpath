import pandas as pd
import json
import torch
from sentence_transformers import SentenceTransformer, util
from collections import defaultdict
from tqdm import tqdm
import os
import zipfile
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# ============================================================
# CONFIG
# ============================================================
SAMPLE_PER_DATASET = 40000  # Increased for 200k target
RANDOM_SEED = 42
OUTPUT_PATH = "skillpath/data/mvc_model.json"

print("Loading NLP models (spaCy and SentenceTransformers)...")
nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def load_data(file_path, desc_col, title_col):
    """Load a dataset with automatic delimiter detection.
    Handles comma, tab, semicolon, and pipe delimited files.
    Returns a DataFrame with only the description and title columns.
    """
    try:
        # Detect delimiter using csv.Sniffer on a sample of the file
        import csv
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            sample = f.read(2048)
        dialect = csv.Sniffer().sniff(sample, delimiters=[",", "\t", ";", "|"])
        sep = dialect.delimiter
        # Read using pandas with the detected separator
        df = pd.read_csv(
            file_path,
            sep=sep,
            on_bad_lines="skip",
            engine="python", # Required for Sniffer
        )
        # Clean column names
        df.columns = [c.strip() for c in df.columns]
        if desc_col not in df.columns or title_col not in df.columns:
            print(f"Skipping {file_path}: Columns not found. Found: {list(df.columns)}")
            return None
        df = df[[desc_col, title_col]].dropna()
        # Limit size for performance
        if len(df) > SAMPLE_PER_DATASET:
            df = df.sample(SAMPLE_PER_DATASET, random_state=RANDOM_SEED)
        return df
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

# Datasets to process (File, Description Column, Title Column)
datasets = [
    ('assest/archive_4/postings.csv', 'description', 'title'),
    ('assest/archive_5/ds_salaries.csv', 'job_title', 'job_title'),
    ('assest/archive_8/software_engineer_salaries.csv', 'job_title', 'job_title'),
    ('assest/so_survey/survey_results_public.csv', 'DevType', 'DevType'),
    ('assest/new1/glassdoor.csv', 'job.description', 'header.jobTitle'),
    ('assest/new2/db_29_0_text/Occupation Data.txt', 'Description', 'Title'),
    ('assest/archive_6/Data Science Jobs Salaries.csv', 'job_title', 'job_title'),
    ('assest/archive_7/Software Engineer Salaries.csv', 'job_title', 'job_title'),
]

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

def extract_nouns(text):
    """Extract technical nouns from text after removing HTML markup."""
    # Remove any HTML tags; fallback to regex if BeautifulSoup unavailable
    try:
        from bs4 import BeautifulSoup
        text = BeautifulSoup(str(text), "html.parser").get_text(separator=" ")
    except Exception:
        import re
        text = re.sub(r"<[^>]+>", " ", str(text))

    # Detect language; process only English text
    try:
        from langdetect import detect
        lang = detect(str(text))
        if lang != "en":
            return ""
    except Exception:
        # If detection fails, proceed with extraction
        pass
    ignore_words = {"experience", "team", "years", "work", "job", "company", "business", "knowledge", "skills", "ability", "understanding", "und", "van", "de", "la", "le", "el", "et", "y", "i", "a", "the"}
    # Process text with spaCy
    doc = nlp(str(text).lower())
    nouns = []
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN", "X"] and not token.is_stop:
            clean_word = token.text.strip()
            if len(clean_word) > 2 and clean_word.isalpha() and clean_word.isascii() and clean_word not in ignore_words:
                nouns.append(clean_word)
    return " ".join(nouns)

# ============================================================
# LOAD ALL DATASETS
# ============================================================
all_frames = []

print("Loading Datasets...")
for file_path, desc_col, title_col in datasets:
    print(f"  Loading: {file_path}...")
    df = load_data(file_path, desc_col, title_col)
    if df is not None:
        # Normalize column names for downstream processing
        df.columns = ['description', 'title']
        print(f"    -> Loaded {len(df)} rows")
        all_frames.append(df)

if not all_frames:
    print("ERROR: No datasets loaded! Check file paths.")
    exit(1)

combined = pd.concat(all_frames, ignore_index=True)
print(f"Total combined rows: {len(combined)}")

# ============================================================
# EXTRACT NOUNS & CLASSIFY
# ============================================================
print("Extracting NLP Noun Chunks (this may take a moment)...")
role_docs = defaultdict(list)
for _, row in tqdm(combined.iterrows(), total=len(combined)):
    role = classify_role(row["title"])
    # Process text
    nouns = extract_nouns(row["description"])
    if nouns:
        role_docs[role].append(nouns)

# ============================================================
# TF-IDF WEIGHTING & SEMANTIC CLUSTERING
# ============================================================
print("Applying TF-IDF and Semantic Clustering...")
mvc_profiles = {}

for role, docs in tqdm(role_docs.items()):
    if len(docs) < 10:
        continue # Not enough data
        
    # 1. TF-IDF to find top distinct skills/n-grams
    vectorizer = TfidfVectorizer(ngram_range=(1,2), max_features=150, min_df=3)
    try:
        tfidf_matrix = vectorizer.fit_transform(docs)
    except:
        continue
        
    sum_scores = np.array(tfidf_matrix.sum(axis=0)).flatten()
    features = vectorizer.get_feature_names_out()
    
    skill_scores = [(features[i], float(sum_scores[i])) for i in range(len(features))]
    skill_scores.sort(key=lambda x: x[1], reverse=True)
    
    # 2. Semantic Clustering (Merge similar concepts)
    unique_skills = [s[0] for s in skill_scores[:80]] # Take top 80 for clustering
    if not unique_skills: continue
    
    embeddings = embed_model.encode(unique_skills, convert_to_tensor=True)
    canonical_map = {}
    used = set()
    
    for i in range(len(unique_skills)):
        if i in used: continue
        canonical_map[unique_skills[i]] = unique_skills[i]
        for j in range(i + 1, len(unique_skills)):
            if j in used: continue
            sim = util.cos_sim(embeddings[i], embeddings[j]).item()
            if sim >= 0.85:
                canonical_map[unique_skills[j]] = unique_skills[i]
                used.add(j)
        used.add(i)
        
    # Aggregate scores for canonical skills
    final_freq = defaultdict(float)
    for skill, score in skill_scores[:80]:
        canonical = canonical_map.get(skill, skill)
        final_freq[canonical] += score
        
    sorted_skills = sorted(final_freq.items(), key=lambda x: x[1], reverse=True)
    mvc_profiles[role] = [{"skill": s[0], "count": int(s[1] * 100)} for s in sorted_skills[:30]]

# ============================================================
# SAVE
# ============================================================
os.makedirs("skillpath/data", exist_ok=True)
with open(OUTPUT_PATH, "w") as f:
    json.dump(mvc_profiles, f, indent=2)

print(f"TF-IDF & NLP Training complete! Saved to {OUTPUT_PATH}")
