import pandas as pd
import zipfile
import os

data = []
# 1. A4
try:
    df1 = pd.read_csv('assest/linkedin_jd/postings.csv', usecols=['title', 'description']).dropna()
    print(f'A4: {len(df1)}')
except Exception as e: print('A4 error', e)

# 2. A5
try:
    with zipfile.ZipFile('assest/archive (5).zip') as z:
        df2 = pd.read_csv(z.open('ds_salaries.csv'), usecols=['job_title'])
        df2['description'] = ''
        df2.rename(columns={'job_title': 'title'}, inplace=True)
        print(f'A5: {len(df2)}')
except Exception as e: print('A5 error', e)

# 3. A6
try:
    with zipfile.ZipFile('assest/archive (6).zip') as z:
        df3 = pd.read_csv(z.open('Data Science Jobs Salaries.csv'), usecols=['job_title'])
        df3['description'] = ''
        df3.rename(columns={'job_title': 'title'}, inplace=True)
        print(f'A6: {len(df3)}')
except Exception as e: print('A6 error', e)

# 4. A7
try:
    with zipfile.ZipFile('assest/archive (7).zip') as z:
        df4 = pd.read_csv(z.open('Software Engineer Salaries.csv'), usecols=['Job Title'])
        df4['description'] = ''
        df4.rename(columns={'Job Title': 'title'}, inplace=True)
        print(f'A7: {len(df4)}')
except Exception as e: print('A7 error', e)

# 5. A8
try:
    with zipfile.ZipFile('assest/archive (8).zip') as z:
        df5 = pd.read_csv(z.open('job_postings.csv'), usecols=['job_title', 'skills_required'])
        df5.rename(columns={'job_title': 'title', 'skills_required': 'description'}, inplace=True)
        print(f'A8: {len(df5.dropna())}')
except Exception as e: print('A8 error', e)

# 6. SO
try:
    with zipfile.ZipFile('assest/stack-overflow-developer-survey-2025.zip') as z:
        df6 = pd.read_csv(z.open('survey_results_public.csv'), usecols=['DevType', 'LanguageHaveWorkedWith', 'DatabaseHaveWorkedWith'])
        df6['title'] = df6['DevType']
        df6['description'] = df6['LanguageHaveWorkedWith'].fillna('') + ' ' + df6['DatabaseHaveWorkedWith'].fillna('')
        print(f'SO: {len(df6.dropna(subset=["title"]))}')
except Exception as e: print('SO error', e)

# 7. ONET
try:
    with zipfile.ZipFile('assest/db_30_2_excel.zip') as z:
        df7 = pd.read_excel(z.open('db_30_2_excel/Occupation Data.xlsx'), usecols=['Title', 'Description'])
        df7.rename(columns={'Title': 'title', 'Description': 'description'}, inplace=True)
        print(f'ONET: {len(df7.dropna())}')
except Exception as e: print('ONET error', e)
