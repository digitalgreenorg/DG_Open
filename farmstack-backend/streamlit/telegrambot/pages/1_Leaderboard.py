import psycopg2
import streamlit as st
import pandas as pd
import plotly.express as px
from dotenv import load_dotenv
import os
import datetime

load_dotenv()

db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
streamlit_cache_ttl = os.getenv("STREAMLIT_CACHE_TTL")

# print("streamlit_cache_ttl--->",streamlit_cache_ttl)
st.set_page_config(
    layout="wide",
    initial_sidebar_state="auto",
    page_title="Telegram BOT Dashboard",
    page_icon=None,
)

def connect_to_database():
    """Connect to the PostgreSQL database."""
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    return conn

def fetch_data(query):
    """Fetch data from the database and return as a DataFrame."""
    conn = connect_to_database()
    df = pd.read_sql(query, conn)
    conn.close()
    return df

query = """
WITH telegram_data AS (
    SELECT 
        details->'data'->'advisory_body'->>'value_chain' AS value_chain_id,
        details->'data'->'advisory_body'->>'sub_practice' AS sub_practice_id,
        COUNT(*) AS count
    FROM 
        core_telegraminteractionlog
    WHERE 
        action = 'ADVISORY_ACCESS_DA'
    GROUP BY 
        details->'data'->'advisory_body'->>'value_chain',
        details->'data'->'advisory_body'->>'sub_practice'
)
SELECT 
    da.id AS da_id, 
    da.name AS da_name,
    da.father_name AS da_father_name,
    da.grand_father_name AS da_grand_father_name,
    da.gender AS da_gender, 
    k.id AS kebele_id, 
    k.name AS kebele_name, 
    w.name AS woreda_name, 
    z.name AS zone_name, 
    rg.name AS region_name, 
    w.id AS woreda_id, 
    z.id AS zone_id, 
    rg.id AS region_id, 
    ofp.gender AS gender, 
    p.id AS practice_id, 
    a.id AS advisory_id, 
    r.id AS reach_id, 
    ofp.id AS farmer_id,
    a.label AS advisory_label,   
    p.name AS practice_name,
    s.name As subpractice_name,
    s.id AS subpractice_id,
    ad.id AS adoption_id,
    r.created_at AS created_at, 
    vc.id AS value_chain_id, 
    vc.name AS value_chain_name, 
    vcc.id AS value_chain_category_id, 
    vcc.name AS value_chain_category_name,
    tg.count AS access_count
FROM 
    integration_developmentagent da
INNER JOIN 
    integration_kebele k ON k.id = da.kebele_id
INNER JOIN 
    integration_woreda w ON w.id = k.woreda_id
INNER JOIN 
    integration_zone z ON z.id = w.zone_id
INNER JOIN 
    integration_region rg ON rg.id = z.region_id
INNER JOIN 
    core_outboundfarmerprofile ofp ON ofp.kebele_id = k.id
INNER JOIN 
    core_reach r ON r.farmer_id = ofp.id
INNER JOIN 
    core_advisory a ON r.advisory_id = a.id
INNER JOIN 
    core_valuechain vc ON a.value_chain_id = vc.id
INNER JOIN 
    core_valuechaincategory vcc ON vc.category_id = vcc.id
INNER JOIN 
    core_subpractice s ON a.sub_practice_id = s.id
INNER JOIN 
    core_practice p ON s.practice_id = p.id
LEFT JOIN 
    core_adoption ad ON ad.farmer_id = ofp.id AND ad.advisory_id = r.advisory_id
LEFT JOIN 
    telegram_data tg ON tg.value_chain_id::uuid = vc.id AND tg.sub_practice_id::uuid = s.id
"""

# @st.cache_data(ttl=int(streamlit_cache_ttl))
def cached_data(query):
    return fetch_data(query)

df = cached_data(query)
df['created_at'] = pd.to_datetime(df['created_at'])
df['DA Full Name'] = df['da_name'] + ' ' + df['da_father_name'] + ' ' + df['da_grand_father_name']

def select_count(index):
    return st.selectbox('Select Ranks:', ['Top 3', 'Top 5', 'Top 10'],key=f"count_{index}")

def select_period(index):
    period = st.selectbox("Select period:", ["Past Week", "Past Month", "Past 3 Months", "Past 6 Months", "Past Year"],key=f"period_{index}")
    today = datetime.date.today()

    if period == "Past Week":
        start_date = today - datetime.timedelta(days=7)
    elif period == "Past Month":
        start_date = today - datetime.timedelta(days=30)
    elif period == "Past 3 Months":
        start_date = today - datetime.timedelta(days=90)
    elif period == "Past 6 Months":
        start_date = today - datetime.timedelta(days=180)
    elif period == "Past Year":
        start_date = today - datetime.timedelta(days=365)
    
    return start_date

column_mapping = {
    'male_reach_count': 'Male Farmers Reached',
    'female_reach_count': 'Female Farmers Reached',
    'total_reach_count': 'Total Farmers Reached',
    'woreda_name': 'Woreda',
    'DA Full Name': 'DA Name',
    'male_adoption_count': 'Male Farmers Adoption',
    'female_adoption_count': 'Female Farmers Adoption',
    'kebele_name': 'Kebele',
    'value_chain_name': 'Value Chain',
    'practice_name': 'Practice',
    'total_adoption_count': 'Total Farmers Adoption',
    'access_count': 'Access Count'
}

today_utc = pd.Timestamp(datetime.date.today(), tz='UTC')
st.header('Leaderboard')
tab1, tab2, tab3 = st.tabs(["Best Performing DAs", "Best Performing Administrative Units", "Popular Contents"])

with tab1:
    col1, col2 = st.columns(2)
    with col1:
        counts = select_count(1)
    with col2:
        start_date = select_period(1)
    n_top = int(counts.split()[1]) 
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    filtered_df = df.copy() 
    if 'created_at' in df.columns and not df.empty and pd.api.types.is_datetime64_any_dtype(df['created_at']):
        filtered_df = df[(df['created_at'] >= start_date_utc) & (df['created_at'] <= today_utc)]
    if not filtered_df.empty:
        st.subheader('Best Performing DAs - Farmer Reach')
        da_reach_count = filtered_df.groupby(['DA Full Name', 'woreda_name']).agg(
        male_reach_count=pd.NamedAgg(column='reach_id', aggfunc=lambda x: x[filtered_df.loc[x.index, 'gender'].str.lower() == 'male'].nunique()),
        female_reach_count=pd.NamedAgg(column='reach_id', aggfunc=lambda x: x[filtered_df.loc[x.index, 'gender'].str.lower() == 'female'].nunique())).reset_index()

        da_reach_count['total_reach_count'] = da_reach_count['male_reach_count'] + da_reach_count['female_reach_count']

        top_das = da_reach_count.sort_values(by='total_reach_count', ascending=False).head(n_top)
        top_das = top_das.rename(columns=column_mapping)

        top_das = top_das.reset_index(drop=True)
        top_das.index = range(1, len(top_das) + 1)

        with st.expander('**DAs with the highest number of farmer reach**', expanded=True):
            st.dataframe(top_das, width=1000)


        female_das = filtered_df[filtered_df['da_gender'].str.lower() == 'female']
        female_da_reach_count = female_das.groupby(['DA Full Name', 'woreda_name']).apply(lambda x: pd.Series({
            'male_reach_count': x[x['gender'].str.lower() == 'male']['reach_id'].nunique(),
            'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
        })).reset_index()

        female_da_reach_count['total_reach_count'] = female_da_reach_count['male_reach_count'] + female_da_reach_count['female_reach_count']
        top_3_female_das = female_da_reach_count.sort_values(by='total_reach_count', ascending=False).head(n_top)
        top_3_female_das = top_3_female_das.rename(columns=column_mapping)


        top_3_female_das=top_3_female_das.reset_index(drop=True)
        top_3_female_das.index = range(1, len(top_3_female_das) + 1)
        with st.expander('**Female Champion DA (Female DAs with the highest number of farmer reach)**', expanded=True):
            st.dataframe(top_3_female_das,width=1000)


        # FEMALE FARMER ADVOCATES
        female_farmer_reach = filtered_df[filtered_df['gender'].str.lower() == 'female']
        female_farmer_reach_count = female_farmer_reach.groupby([ 'DA Full Name', 'woreda_name']).apply(lambda x: pd.Series({
            'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
        })).reset_index()

        top_3_female_advocates = female_farmer_reach_count.sort_values(by='female_reach_count', ascending=False).head(n_top)
        top_3_female_advocates = top_3_female_advocates.rename(columns=column_mapping)
        # st.write("**Female Farmer Advocates(DAs with the highest number of female reach)**")
        top_3_female_advocates=top_3_female_advocates.reset_index(drop=True)
        top_3_female_advocates.index = range(1, len(top_3_female_advocates) + 1)
        with st.expander("**Female Farmer Advocates(DAs with the highest number of female reach)**",expanded=True):
            st.dataframe(top_3_female_advocates,width=1000)
        ######################################################
        st.subheader("Best Performing DAs - Farmer Adoption")

        da_adoption_count = filtered_df.groupby(['DA Full Name', 'woreda_name']).apply(lambda x: pd.Series({
            'male_adoption_count': x[x['gender'].str.lower() == 'male']['adoption_id'].nunique(),
            'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
        })).reset_index()

        da_adoption_count['total_adoption_count'] = da_adoption_count['male_adoption_count'] + da_adoption_count['female_adoption_count']

        top_adoption_das = da_adoption_count.sort_values(by='total_adoption_count', ascending=False).head(n_top)
        top_adoption_das = top_adoption_das.rename(columns=column_mapping)

        top_adoption_das = top_adoption_das.reset_index(drop=True)
        top_adoption_das.index = range(1, len(top_adoption_das) + 1)

        with st.expander("**DAs with the highest number of farmer adoption**", expanded=True):
            st.dataframe(top_adoption_das, width=1000)

        female_das = filtered_df[filtered_df['da_gender'].str.lower() == 'female']
        female_da_adoption_count = female_das.groupby([ 'DA Full Name', 'woreda_name']).apply(lambda x: pd.Series({
            'male_adoption_count': x[x['gender'].str.lower() == 'male']['adoption_id'].nunique(),
            'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
        })).reset_index()

        female_da_adoption_count['total_adoption_count'] = female_da_adoption_count['male_adoption_count'] + female_da_adoption_count['female_adoption_count']
        top_3_adoption_female_das = female_da_adoption_count.sort_values(by='total_adoption_count', ascending=False).head(n_top)
        top_3_adoption_female_das=top_3_adoption_female_das.rename(columns=column_mapping)
        # st.write("**FEMALE CHAMPION DA(Female DAs with the highest number of farmer adoption)**")
        top_3_adoption_female_das=top_3_adoption_female_das.reset_index(drop=True)
        top_3_adoption_female_das.index = range(1, len(top_3_adoption_female_das) + 1)
        with st.expander("**Female Champion DA (Female DAs with the highest number of farmer adoption)**",expanded=True):
            st.dataframe(top_3_adoption_female_das,width=1000)
        ######################################################

        female_da_female_adoption_count = female_das.groupby([ 'DA Full Name', 'woreda_name']).apply(lambda x: pd.Series({
            'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
        })).reset_index()

        top_3_advocates = female_da_female_adoption_count.sort_values(by='female_adoption_count', ascending=False).head(n_top)
        top_3_advocates=top_3_advocates.rename(columns=column_mapping)
        top_3_advocates=top_3_advocates.reset_index(drop=True)
        top_3_advocates.index = range(1, len(top_3_advocates) + 1)
        with st.expander('**Female Farmer Advocates (Female DAs with the highest number of farmer adoption)**',expanded=True):
            st.dataframe(top_3_advocates,width=1000)


with tab2:
    col1, col2 = st.columns(2)
    with col1:
        counts = select_count(2)
    with col2:
        start_date = select_period(2)
    n_top = int(counts.split()[1])
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    filtered_df = df.copy() 
    if 'created_at' in df.columns and not df.empty and pd.api.types.is_datetime64_any_dtype(df['created_at']):
        filtered_df = filtered_df[(filtered_df['created_at'] >= start_date_utc) & (filtered_df['created_at'] <= today_utc)]
    if not filtered_df.empty:
        st.subheader("Best Performing Administative units - Farmer Reach")
        reach_count_sau = filtered_df.groupby(['kebele_id', 'kebele_name']).apply(lambda x: pd.Series({
            'male_reach_count': x[x['gender'].str.lower() == 'male']['reach_id'].nunique(),
            'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
        })).reset_index()
        reach_count_sau['total_reach_count'] = reach_count_sau['male_reach_count'] + reach_count_sau['female_reach_count']
        top_3_sau = reach_count_sau.sort_values(by='total_reach_count', ascending=False).head(n_top)
        top_3_sau = top_3_sau.iloc[:, 1:]
        top_3_sau=top_3_sau.rename(columns=column_mapping)
        top_3_sau=top_3_sau.reset_index(drop=True)
        top_3_sau.index = range(1, len(top_3_sau) + 1)
        with st.expander("**Kebele With Highest Farmer Reach**",expanded=True):
            st.dataframe(top_3_sau,width=1000)

        reach_count_sau_female_only = filtered_df.groupby(['kebele_id', 'kebele_name']).apply(lambda x: pd.Series({
            'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
        })).reset_index()
        reach_count_sau_female_only['female_reach_count'] = reach_count_sau_female_only['female_reach_count'] 
        top_3_sau_advocates= reach_count_sau_female_only.sort_values(by='female_reach_count', ascending=False).head(n_top)
        top_3_sau_advocates=top_3_sau_advocates.iloc[:, 1:]
        top_3_sau_advocates=top_3_sau_advocates.rename(columns=column_mapping)
        top_3_sau_advocates=top_3_sau_advocates.reset_index(drop=True)
        top_3_sau_advocates.index = range(1, len(top_3_sau_advocates) + 1)
        with st.expander("**Female Farmer Advocates Kebele**",expanded=True):
            st.dataframe(top_3_sau_advocates,width=1000)

        st.subheader("Best Performing Administrative Unit- Farmer Adoption")
        adoption_count_sau = filtered_df.groupby(['kebele_id', 'kebele_name']).apply(lambda x: pd.Series({
            'male_adoption_count': x[x['gender'].str.lower() == 'male']['adoption_id'].nunique(),
            'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
        })).reset_index()
        adoption_count_sau['total_adoption_count'] = adoption_count_sau['male_adoption_count'] + adoption_count_sau['female_adoption_count']
        top_3_sau_adoption = adoption_count_sau.sort_values(by='total_adoption_count', ascending=False).head(n_top)
        top_3_sau_adoption=top_3_sau_adoption.iloc[:, 1:]
        top_3_sau_adoption=top_3_sau_adoption.rename(columns=column_mapping)
        top_3_sau_adoption=top_3_sau_adoption.reset_index(drop=True)
        top_3_sau_adoption.index = range(1, len(top_3_sau_adoption) + 1)
        with st.expander("**Kebele With Highest Farmer Adoption**",expanded=True):
            st.dataframe(top_3_sau_adoption,width=1000)

        adoption_count_sau_female_only = filtered_df.groupby(['kebele_id', 'kebele_name']).apply(lambda x: pd.Series({
            'female_adoption_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
        })).reset_index()
        adoption_count_sau_female_only['female_adoption_count'] = adoption_count_sau_female_only['female_adoption_count'] 
        top_3_sau_advocates_adoption= adoption_count_sau_female_only.sort_values(by='female_adoption_count', ascending=False).head(n_top)
        top_3_sau_advocates_adoption=top_3_sau_advocates_adoption.rename(columns=column_mapping)
        top_3_sau_advocates_adoption=top_3_sau_advocates_adoption.iloc[:, 1:]
        top_3_sau_advocates_adoption=top_3_sau_advocates_adoption.reset_index(drop=True)
        top_3_sau_advocates_adoption.index = range(1, len(top_3_sau_advocates_adoption) + 1)
        with st.expander("**Female Farmer Advocates Kebele**",expanded=True):
            st.dataframe(top_3_sau_advocates_adoption,width=1000)
   

with tab3:
    col1, col2 = st.columns(2)
    with col1:
        counts = select_count(3)
    with col2:
        start_date = select_period(3)
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    n_top = int(counts.split()[1])
    filtered_df = df.copy() 
    if 'created_at' in df.columns and not df.empty and pd.api.types.is_datetime64_any_dtype(df['created_at']):
        filtered_df = filtered_df[(filtered_df['created_at'] >= start_date_utc) & (filtered_df['created_at'] <= today_utc)]
    if not filtered_df.empty:    
        sorted_df = filtered_df.sort_values(by='access_count', ascending=False)

        top_10_access_counts = sorted_df[['value_chain_name', 'practice_name', 'access_count']]
        top_10_unique_access_counts = top_10_access_counts.drop_duplicates(subset=['value_chain_name', 'practice_name']).head(n_top)
        top_10_unique_access_counts=top_10_unique_access_counts.rename(columns=column_mapping)

        top_10_unique_access_counts=top_10_unique_access_counts.reset_index(drop=True)
        top_10_unique_access_counts.index = range(1, len(top_10_unique_access_counts) + 1)
        st.subheader("**Popular Advisory Content**")
        with st.expander("**Frequently accessed advisories**",expanded=True):
            st.dataframe(top_10_unique_access_counts,width=1000)
        
        # filtered_df = df.copy() 
        if 'created_at' in df.columns and not df.empty and pd.api.types.is_datetime64_any_dtype(df['created_at']):
            filtered_df = filtered_df[(filtered_df['created_at'] >= start_date_utc) & (filtered_df['created_at'] <= today_utc)]

        # Calculate reach count for practices
        practice_reach_count = filtered_df.groupby(['value_chain_name', 'practice_name']).apply(lambda x: pd.Series({
            'male_reach_count': x[x['gender'].str.lower() == 'male']['reach_id'].nunique(),
            'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
        })).reset_index()

        practice_reach_count['total_reach_count'] = practice_reach_count['male_reach_count'] + practice_reach_count['female_reach_count']

        # Top 3 practices with the highest total reach count
        top_3_practices_reach = practice_reach_count.sort_values(by='total_reach_count', ascending=False).head(n_top)
        top_3_practices_reach = top_3_practices_reach.rename(columns=column_mapping)
        top_3_practices_reach = top_3_practices_reach.reset_index(drop=True)
        top_3_practices_reach.index = range(1, len(top_3_practices_reach) + 1)

        # Display the result
        with st.expander("**High Farmer Reach Practices: (Practices with the highest reach count)**", expanded=True):
            st.dataframe(top_3_practices_reach, width=1000)

        # Calculate adoption count for practices
        practice_adoption_count = filtered_df.groupby(['value_chain_name', 'practice_name']).apply(lambda x: pd.Series({
            'male_adoption_count': x[x['gender'].str.lower() == 'male']['adoption_id'].nunique(),
            'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
        })).reset_index()

        practice_adoption_count['total_adoption_count'] = practice_adoption_count['male_adoption_count'] + practice_adoption_count['female_adoption_count']

        # Top 3 practices with the highest total adoption count
        top_3_practices_adoption = practice_adoption_count.sort_values(by='total_adoption_count', ascending=False).head(n_top)
        top_3_practices_adoption = top_3_practices_adoption.rename(columns=column_mapping)
        top_3_practices_adoption = top_3_practices_adoption.reset_index(drop=True)
        top_3_practices_adoption.index = range(1, len(top_3_practices_adoption) + 1)

        # Display the result
        with st.expander("**High Farmer Adoption Practices**", expanded=True):
            st.dataframe(top_3_practices_adoption, width=1000)