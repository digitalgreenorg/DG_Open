
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

st.header("Telegram BOT Dashboard")

query = """
SELECT 	da.id as da_id, da.name as da_name,da.gender as da_gender, k.id as kebele_id, k.name as kebele_name, 
		w.name as woreda_name, z.name as zone_name, rg.name as region_name, w.id as woreda_id, 
		z.id as zone_id, rg.id as region_id, ofp.gender as gender, 
		p.id as practice_id, a.id as advisory_id, r.id as reach_id, 
		ofp.id as farmer_id,a.label as advisory_label,p.name as practice_name,ad.id as adoption_id,
        r.created_at as created_at, vc.id AS value_chain_id, vc.name AS value_chain_name, vcc.id AS value_chain_category_id, vcc.name AS value_chain_category_name
FROM 
    integration_developmentagent da
INNER JOIN 
    integration_kebele k ON k.id = da.kebele_id
INNER JOIN 
	integration_woreda w ON w.id=k.woreda_id
INNER JOIN 
	integration_zone z ON z.id=w.zone_id
INNER JOIN 
	integration_region rg ON rg.id=z.region_id
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
	core_subpractice s ON a.sub_practice_id=s.id
INNER JOIN 
	core_practice p ON s.practice_id=p.id
LEFT JOIN 
    core_adoption ad ON ad.farmer_id = ofp.id AND ad.advisory_id = r.advisory_id
"""

@st.cache_data
def cached_data(query):
    return fetch_data(query)


df = cached_data(query)
df['created_at'] = pd.to_datetime(df['created_at'])




#########
min_created_at = df['created_at'].min()
max_created_at = df['created_at'].max()

col1, col2 = st.columns(2)

with col1:
    start_date = st.date_input("Start Date", min_value=min_created_at, max_value=max_created_at, value=min_created_at)

with col2:
    end_date = st.date_input("End Date", min_value=min_created_at, max_value=max_created_at, value=max_created_at)
    if end_date < start_date:
        st.error("End Date must be greater than Start Date.")

#Region
unique_regions = df.groupby(['region_id', 'region_name']).size().reset_index(name='count')
unique_regions = unique_regions.drop(columns=['count'])
region_list = unique_regions.to_dict(orient='records')
# print("Unique Regions:", region_list)

#Zone
unique_zones=df.groupby(['region_id','zone_id', 'zone_name']).size().reset_index(name='count')
unique_zones = unique_zones.drop(columns=['count'])
zone_list = unique_zones.to_dict(orient='records')
# print("Unique Zones:", zone_list)

#Woreda
unique_woreda=df.groupby(['zone_id','woreda_id', 'woreda_name']).size().reset_index(name='count')
unique_woreda = unique_woreda.drop(columns=['count'])
woreda_list = unique_woreda.to_dict(orient='records')
# print("Unique Woreda:", len(woreda_list))

#Kebele
unique_kebele=df.groupby(['woreda_id','kebele_id', 'kebele_name']).size().reset_index(name='count')
unique_kebele = unique_kebele.drop(columns=['count'])
kebele_list = unique_kebele.to_dict(orient='records')
# print("Unique Kebele:", len(kebele_list))

#DA
unique_da=df.groupby(['da_id', 'da_name']).size().reset_index(name='count')
unique_da = unique_da.drop(columns=['count'])
da_list = unique_da.to_dict(orient='records')
# print("Unique DA:", len(da_list))

#Advisory
unique_advisory=df.groupby(['advisory_id', 'advisory_label']).size().reset_index(name='count')
unique_advisory = unique_advisory.drop(columns=['count'])
advisory_list = unique_advisory.to_dict(orient='records')
# print("Unique advisory:", len(advisory_list))

#Practice
unique_practice=df.groupby(['practice_id', 'practice_name']).size().reset_index(name='count')
unique_practice = unique_practice.drop(columns=['count'])
practice_list = unique_practice.to_dict(orient='records')
# print("Unique practice:", len(practice_list))

placeholders = {
    "Region": "Select Region",
    "Zone": "Select Zone",
    "Woreda": "Select Woreda",
    "Kebele": "Select Kebele",
    "DA": "Select DA",
    "Advisory": "Select Advisory",
    "Practice": "Select Practice"
}

filters = {
    "Location": region_list,
    "Zone": zone_list,
    "Woreda": woreda_list,
    "Kebele": kebele_list,
    "DA": da_list,
    "Advisory": advisory_list,
    "Practice": practice_list
}


col1, col2, col3, col4 = st.columns(4)
with col1:
    selected_region = st.selectbox("Select Region", options=[placeholders["Region"]] + [region['region_name'] for region in filters['Location']])
with col2:
    selected_zone = st.selectbox("Select Zone", options=[placeholders["Zone"]] + [zone['zone_name'] for zone in filters['Zone']])
with col3:
    selected_woreda = st.selectbox("Select Woreda", options=[placeholders["Woreda"]] + [woreda['woreda_name'] for woreda in filters['Woreda']])
with col4:
    selected_kebele = st.selectbox("Select Kebele", options=[placeholders["Kebele"]] + [kebele['kebele_name'] for kebele in filters['Kebele']])


col5, col6, col7 = st.columns(3)
with col5:
    selected_da = st.selectbox("Select DA", options=[placeholders["DA"]] + [da['da_name'] for da in filters['DA']])
with col6:
    selected_advisory = st.selectbox("Select Advisory", options=[placeholders["Advisory"]] + [advisory['advisory_label'] for advisory in filters['Advisory']])
with col7:
    selected_practice = st.selectbox("Select Practice", options=[placeholders["Practice"]] + [practice['practice_name'] for practice in filters['Practice']])


# Function to calculate reach & adoption counts for male and female genders
def calculate_reach_counts(data):

    ############# Reach ##############
    total_reach_count = data['reach_id'].nunique()
    male_reach_count = data[data['gender'] == 'male']['reach_id'].nunique()
    female_reach_count= data[data['gender'] == 'female']['reach_id'].nunique()

    ############ Adoption ############
    total_adoption_count = data['adoption_id'].nunique()
    male_adoption_count = data[data['gender'] == 'male']['adoption_id'].nunique()
    female_adoption_count= data[data['gender'] == 'female']['adoption_id'].nunique()


    ############### DA ##############
    male_das = data[data['da_gender'] == 'Male']['da_id'].nunique()
    female_das = data[data['da_gender'] == 'Female']['da_id'].nunique()
    total_das = data['da_id'].nunique()


    practice_counts = {}
    unique_practices = data['practice_name'].unique()

    for practice in unique_practices:
        practice_df = data[data['practice_name'] == practice]

        male_reach_count_practice = practice_df[(practice_df['gender'] == 'male') & (practice_df['reach_id'])]['reach_id'].nunique()
        female_reach_count_practice = practice_df[(practice_df['gender'] == 'female') & (practice_df['reach_id'])]['reach_id'].nunique()
        male_adoption_count_practice = practice_df[(practice_df['gender'] == 'male') & (practice_df['adoption_id'])]['adoption_id'].nunique()
        female_adoption_count_practice = practice_df[(practice_df['gender'] == 'female') & (practice_df['adoption_id'])]['adoption_id'].nunique()

        
        practice_counts[practice] = {
            'male_reach_count_by_practice': male_reach_count_practice,
            'female_reach_count_by_practice': female_reach_count_practice,
            'male_adoption_count_by_practice': male_adoption_count_practice,
            'female_adoption_count_by_practice': female_adoption_count_practice
        }

    advisory_counts = {}
    unique_advisories = data['advisory_label'].unique()
    for advisory in unique_advisories:
        advisory_df = data[data['advisory_label'] == advisory]
        male_reach_count_advisory = len(advisory_df[(advisory_df['gender'] == 'male') & (~advisory_df['reach_id'].isnull())]['reach_id'].unique())
        female_reach_count_advisory = len(advisory_df[(advisory_df['gender'] == 'female') & (~advisory_df['reach_id'].isnull())]['reach_id'].unique())
        male_adoption_count_advisory = len(advisory_df[(advisory_df['gender'] == 'male') & (~advisory_df['adoption_id'].isnull())]['adoption_id'].unique())
        female_adoption_count_advisory = len(advisory_df[(advisory_df['gender'] == 'female') & (~advisory_df['adoption_id'].isnull())]['adoption_id'].unique())
        
        advisory_counts[advisory] = {
            'male_reach_count': male_reach_count_advisory,
            'female_reach_count': female_reach_count_advisory,
            'male_adoption_count': male_adoption_count_advisory,
            'female_adoption_count': female_adoption_count_advisory
        }
    total_male_farmers = len(data[data['gender'] == 'male'])
    total_female_farmers = len(data[data['gender'] == 'female'])

    data['created_date'] = data['created_at'].dt.date


    male_reach_counts_created_at = data[data['gender'] == 'male'].groupby('created_date')['reach_id'].nunique()
    female_reach_counts_created_at = data[data['gender'] == 'female'].groupby('created_date')['reach_id'].nunique()

    male_adoption_counts_created_at = data[data['gender'] == 'male'].groupby('created_date')['adoption_id'].nunique()
    female_adoption_counts_created_at = data[data['gender'] == 'female'].groupby('created_date')['adoption_id'].nunique()

    time_based_counts={
        "male_reach_counts_created_at":male_reach_counts_created_at,
        "female_reach_counts_created_at":female_reach_counts_created_at,
        "male_adoption_counts_created_at":male_adoption_counts_created_at,
        "female_adoption_counts_created_at":female_adoption_counts_created_at
    }
    unique_regions = data.groupby(['region_id', 'region_name']).size().reset_index(name='count')
    region_counts = {}

    for _, region_row in unique_regions.iterrows():
        region_id = region_row['region_id']
        region_name = region_row['region_name']
        
        region_data = data[data['region_id'] == region_id]
        
        male_reach_count_by_region = region_data[region_data['gender'] == 'male']['reach_id'].nunique()
        female_reach_count_by_region = region_data[region_data['gender'] == 'female']['reach_id'].nunique()
        male_adoption_count_by_region = region_data[region_data['gender'] == 'male']['adoption_id'].nunique()
        female_adoption_count_by_region = region_data[region_data['gender'] == 'female']['adoption_id'].nunique()
        
        region_counts[region_name] = {
            "male_reach_count_by_region": male_reach_count_by_region,
            "female_reach_count_by_region": female_reach_count_by_region,
            "male_adoption_count_by_region": male_adoption_count_by_region,
            "female_adoption_count_by_region": female_adoption_count_by_region
        }
    unique_zones = data.groupby(['zone_id', 'zone_name']).size().reset_index(name='count')
    zone_counts = {}

    for _, zone_row in unique_zones.iterrows():
        zone_id = zone_row['zone_id']
        zone_name = zone_row['zone_name']
        
        zone_data = data[data['zone_id'] == zone_id]
        
        male_reach_count_by_zone = zone_data[zone_data['gender'] == 'male']['reach_id'].nunique()
        female_reach_count_by_zone = zone_data[zone_data['gender'] == 'female']['reach_id'].nunique()
        male_adoption_count_by_zone = zone_data[zone_data['gender'] == 'male']['adoption_id'].nunique()
        female_adoption_count_by_zone = zone_data[zone_data['gender'] == 'female']['adoption_id'].nunique()
        
        zone_counts[zone_name] = {
            "male_reach_count_by_zone": male_reach_count_by_zone,
            "female_reach_count_by_zone": female_reach_count_by_zone,
            "male_adoption_count_by_zone": male_adoption_count_by_zone,
            "female_adoption_count_by_zone": female_adoption_count_by_zone
        }
    unique_woredas = data.groupby(['woreda_id', 'woreda_name']).size().reset_index(name='count')
    woreda_counts = {}

    for _, woreda_row in unique_woredas.iterrows():
        woreda_id = woreda_row['woreda_id']
        woreda_name = woreda_row['woreda_name']
        
        woreda_data = data[data['woreda_id'] == woreda_id]
        
        male_reach_count_by_woreda = woreda_data[woreda_data['gender'] == 'male']['reach_id'].nunique()
        female_reach_count_by_woreda = woreda_data[woreda_data['gender'] == 'female']['reach_id'].nunique()
        male_adoption_count_by_woreda = woreda_data[woreda_data['gender'] == 'male']['adoption_id'].nunique()
        female_adoption_count_by_woreda = woreda_data[woreda_data['gender'] == 'female']['adoption_id'].nunique()
        
        woreda_counts[woreda_name] = {
            "male_reach_count_by_woreda": male_reach_count_by_woreda,
            "female_reach_count_by_woreda": female_reach_count_by_woreda,
            "male_adoption_count_by_woreda": male_adoption_count_by_woreda,
            "female_adoption_count_by_woreda": female_adoption_count_by_woreda
        }
    
    # Get unique kebeles
    unique_kebeles = data.groupby(['kebele_id', 'kebele_name']).size().reset_index(name='count')
    kebele_counts = {}

    for _, kebele_row in unique_kebeles.iterrows():
        kebele_id = kebele_row['kebele_id']
        kebele_name = kebele_row['kebele_name']
        
        kebele_data = data[data['kebele_id'] == kebele_id]
        
        male_reach_count_by_kebele = kebele_data[kebele_data['gender'] == 'male']['reach_id'].nunique()
        female_reach_count_by_kebele = kebele_data[kebele_data['gender'] == 'female']['reach_id'].nunique()
        male_adoption_count_by_kebele = kebele_data[kebele_data['gender'] == 'male']['adoption_id'].nunique()
        female_adoption_count_by_kebele = kebele_data[kebele_data['gender'] == 'female']['adoption_id'].nunique()
        
        kebele_counts[kebele_name] = {
            "male_reach_count_by_kebele": male_reach_count_by_kebele,
            "female_reach_count_by_kebele": female_reach_count_by_kebele,
            "male_adoption_count_by_kebele": male_adoption_count_by_kebele,
            "female_adoption_count_by_kebele": female_adoption_count_by_kebele
        }

    return {
        "total_reach_count": total_reach_count,
        "male_reach_count": male_reach_count,
        "female_reach_count": female_reach_count,
        "male_adoption_count": male_adoption_count,
        "female_adoption_count": female_adoption_count,
        "total_adoption_count": total_adoption_count,
        "male_das":male_das,
        "female_das":female_das,
        "total_das":total_das,
        "practice_counts": practice_counts,
        "advisory_counts": advisory_counts,
        "total_male_farmers": total_male_farmers,
        "total_female_farmers": total_female_farmers,
        "time_based_counts":time_based_counts,
        "zone_counts":zone_counts,
        "woreda_counts":woreda_counts,
        "kebele_counts":kebele_counts,
        "region_counts":region_counts


    }

reach_and_adoption_counts= calculate_reach_counts(df)


# Function to get the region ID based on the region name
def get_region_id(region_name):
    for region in region_list:
        if region['region_name'] == region_name:
            return region['region_id']
    return None

def get_zone_id(zone_name):
    for zone in zone_list:
        if zone['zone_name'] == zone_name:
            return zone['zone_id']
    return None

def get_woreda_id(woreda_name):
    for woreda in woreda_list:
        if woreda['woreda_name'] == woreda_name:
            return woreda['woreda_id']
    return None

def get_zones_for_region(selected_region_id):
    zones_for_selected_region = [zone['zone_name']for zone in zone_list if zone['region_id'] == selected_region_id]
    return zones_for_selected_region

def get_woreda_for_zone(selected_zone_id):
    woredas_for_selected_zone = [woreda['woreda_name']for woreda in woreda_list if woreda['zone_id'] == selected_zone_id]
    return woredas_for_selected_zone


def get_kebele_for_woreda(selected_woreda_id):
    kebele_for_selected_woreda = [kebele['kebele_name']for kebele in kebele_list if kebele['woreda_id'] == selected_woreda_id]
    return kebele_for_selected_woreda


# Apply filters
if selected_region or selected_zone or selected_woreda or selected_kebele or selected_da or selected_advisory or selected_practice or (start_date and end_date):
    filtered_df = df.copy() 
    if selected_region and selected_region != placeholders["Region"]:
        filtered_df = filtered_df[filtered_df['region_name'] == selected_region]
        selected_region_id = get_region_id(selected_region)
        zones_under_selected_region=get_zones_for_region(selected_region_id)
        # print("zones_under_selected_region---->",zones_under_selected_region)


    if selected_zone and selected_zone != placeholders["Zone"]:
        filtered_df = filtered_df[filtered_df['zone_name'] == selected_zone]
        selected_zone_id = get_zone_id(selected_zone)
        woreda_under_selected_zone=get_woreda_for_zone(selected_zone_id)
        # print("woreda_under_selected_zone---->",woreda_under_selected_zone)

    if selected_woreda and selected_woreda != placeholders["Woreda"]:
        filtered_df = filtered_df[filtered_df['woreda_name'] == selected_woreda]
        selected_woreda_id = get_woreda_id(selected_woreda)
        
        kebele_under_selected_woreda=get_kebele_for_woreda(selected_woreda_id)
        # print("kebele_under_selected_woreda---->",kebele_under_selected_woreda)

    if selected_kebele and selected_kebele != placeholders["Kebele"]:
        filtered_df = filtered_df[filtered_df['kebele_name'] == selected_kebele]

    if selected_da and selected_da != placeholders["DA"]:
        filtered_df = filtered_df[filtered_df['da_name'] == selected_da]
    if selected_advisory and selected_advisory != placeholders["Advisory"]:
        filtered_df = filtered_df[filtered_df['advisory_label'] == selected_advisory]
    if selected_practice and selected_practice != placeholders["Practice"]:
        filtered_df = filtered_df[filtered_df['practice_name'] == selected_practice]
    if start_date and end_date :
        if start_date <= end_date:
            filtered_df = filtered_df[(filtered_df['created_at'].dt.date >= start_date) & (filtered_df['created_at'].dt.date <= end_date)]

    reach_and_adoption_counts= calculate_reach_counts(filtered_df)

else:
    reach_and_adoption_counts=reach_and_adoption_counts



data = reach_and_adoption_counts["time_based_counts"]
df_male = pd.DataFrame(data.get("male_reach_counts_created_at", {}).items(), columns=["Date", "Male Count"])
df_female = pd.DataFrame(data.get("female_reach_counts_created_at", {}).items(), columns=["Date", "Female Count"])
st.subheader("Male vs Female Reach Counts Over Time")
if df_male.empty:
    df_male = pd.DataFrame(columns=["Date", "Male Count"])
if df_female.empty:
    df_female = pd.DataFrame(columns=["Date", "Female Count"])
if df_male.empty and df_female.empty:
    st.warning("No data available for adoption counts over time.")
else:
    df_data_reach = pd.merge(df_male, df_female, on="Date", how="outer")

    df_data_reach.fillna(0, inplace=True)


    with st.container(border=True):
        fig = px.line(df_data_reach, x="Date", y=["Male Count", "Female Count"], title="Male vs Female Reach Counts Over Time")
        fig.update_xaxes(title_text="Date")
        fig.update_yaxes(title_text="Reach Count")
        fig.update_layout(xaxis=dict(range=[min_created_at, max_created_at]))
        st.plotly_chart(fig, use_container_width=True)



data = reach_and_adoption_counts["time_based_counts"]
df_male = pd.DataFrame(data.get("male_adoption_counts_created_at", {}).items(), columns=["Date", "Male Count"])
df_female = pd.DataFrame(data.get("female_adoption_counts_created_at", {}).items(), columns=["Date", "Female Count"])
st.subheader("Male vs Female Adoption Counts Over Time")
if df_male.empty:
    df_male = pd.DataFrame(columns=["Date", "Male Count"])
if df_female.empty:
    df_female = pd.DataFrame(columns=["Date", "Female Count"])
if df_male.empty and df_female.empty:
    st.warning("No data available for adoption counts over time.")
else:
    df_data = pd.merge(df_male, df_female, on="Date", how="outer")

    df_data.fillna(0, inplace=True)

    with st.container(border=True):
        fig = px.line(df_data, x="Date", y=["Male Count", "Female Count"], title="Male vs Female Adoption Counts Over Time")
        fig.update_xaxes(title_text="Date")
        fig.update_yaxes(title_text="Adoption Count")
        fig.update_layout(xaxis=dict(range=[min_created_at, max_created_at]))
        st.plotly_chart(fig, use_container_width=True)



col1, col2 = st.columns(2)

########################### Reach Counts ##########################################

with col1:
    st.subheader("Reach Counts")
    with st.container(border=True):
        reach_data = {
            'Gender': [],
            'Reach Count': []
        }

        male_reach_count = reach_and_adoption_counts.get('male_reach_count', 0)
        female_reach_count = reach_and_adoption_counts.get('female_reach_count', 0)

        if male_reach_count > 0:
            reach_data['Gender'].append(f"Male - {male_reach_count}")
            reach_data['Reach Count'].append(male_reach_count)
        if female_reach_count > 0:
            reach_data['Gender'].append(f"Female - {female_reach_count}")
            reach_data['Reach Count'].append(female_reach_count)

        reach_df = pd.DataFrame(reach_data)

        if not reach_df.empty:
            reach_fig = px.pie(reach_df, values='Reach Count', names='Gender')
            # reach_fig.update_traces(textposition='inside', textinfo='percent')
            st.plotly_chart(reach_fig,use_container_width=True)
        else:
            st.warning("No reach data available.")


with col2:
    st.subheader("Adoption Counts")
    with st.container(border=True):
        adoption_data = {
            'Gender': [],
            'Adoption Count': []
        }

        male_adoption_count = reach_and_adoption_counts.get('male_adoption_count', 0)
        female_adoption_count = reach_and_adoption_counts.get('female_adoption_count', 0)

        if male_adoption_count > 0:
            adoption_data['Gender'].append(f"Male - {male_adoption_count}")
            adoption_data['Adoption Count'].append(male_adoption_count)
        if female_adoption_count > 0:
            adoption_data['Gender'].append(f"Female - {female_adoption_count}")
            adoption_data['Adoption Count'].append(female_adoption_count)

        adoption_df = pd.DataFrame(adoption_data)

        if not adoption_df.empty:
            adoption_fig = px.pie(adoption_df, values='Adoption Count', names='Gender')
            # adoption_fig.update_traces(textposition='inside', textinfo='percent')
            st.plotly_chart(adoption_fig,use_container_width=True)
        else:
            st.warning("No adoption data available.")
 



############################## Development Agent distribution ############################################

das_df = pd.DataFrame({
    'Gender': ['Male', 'Female'],
    'Count': [reach_and_adoption_counts["male_das"], reach_and_adoption_counts["female_das"]]
})

das_df['Gender'] = das_df.apply(lambda x: f"{x['Gender']} - {x['Count']}", axis=1)
with col1:
    st.subheader("Distribution of Development Agents by Gender")
    with st.container(border=True):
        if das_df['Count'].sum() > 0:
            fig_das = px.pie(das_df, values='Count', names='Gender')
            st.plotly_chart(fig_das, use_container_width=True)
        else:
            st.warning("No data available for development agent distribution.")

#################################### Farmers distribution #######################################

farmers_df = pd.DataFrame({
    'Gender': ['Male', 'Female'],
    'Count': [reach_and_adoption_counts["total_male_farmers"], reach_and_adoption_counts["total_female_farmers"]]
})

farmers_df['Gender'] = farmers_df.apply(lambda x: f"{x['Gender']} - {x['Count']}", axis=1)

with col2:
    st.subheader("Distribution of Farmers by Gender")
    with st.container(border=True):
        if farmers_df['Count'].sum() > 0:
            fig_farmers = px.pie(farmers_df, values='Count', names='Gender')
            st.plotly_chart(fig_farmers, use_container_width=True)
        else:
            st.warning("No data available for farmer distribution.")


############################### practice ###########################################

practice_df = pd.DataFrame(reach_and_adoption_counts.get("practice_counts", {})).transpose()

if len(practice_df):
    practice_df = practice_df.reset_index().rename(columns={'index': 'Practice'})
else:
    practice_df = None

st.subheader("Practice Reach and Adoption Counts")
with st.container(border=True):
    if practice_df is not None:
        reach_fig = px.bar(practice_df, x='Practice', y=['male_reach_count_by_practice', 'female_reach_count_by_practice'], barmode='stack', title='Reach Counts by Practice', labels={'value': 'Count', 'variable': 'Gender'})
        st.plotly_chart(reach_fig, use_container_width=True)
    else:
        st.warning("No data available for the selected filter.")

with st.container(border=True):
    if practice_df is not None:
        adoption_fig = px.bar(practice_df, x='Practice', y=['male_adoption_count_by_practice', 'female_adoption_count_by_practice'], barmode='stack', title='Adoption Counts by Practice', labels={'value': 'Count', 'variable': 'Gender'})
        st.plotly_chart(adoption_fig, use_container_width=True)
    else:
        st.warning("No data available for the selected filter.")


############################## Advisory ###################################################

advisory_df = pd.DataFrame(reach_and_adoption_counts.get("advisory_counts", {})).transpose()

if len(advisory_df):
    advisory_df = advisory_df.reset_index().rename(columns={'index': 'Advisory'})
else:
    advisory_df = None

st.subheader("Reach Counts by Advisory")
with st.container(border=True):
    if advisory_df is not None:
        reach_fig = px.bar(advisory_df, x='Advisory', y=['male_reach_count', 'female_reach_count'], barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
        st.plotly_chart(reach_fig, use_container_width=True)
    else:
        st.warning("No data available for selected filter.")

st.subheader("Adoption Counts by Advisory")
with st.container(border=True):
    if advisory_df is not None:
        adoption_fig = px.bar(advisory_df, x='Advisory', y=['male_adoption_count', 'female_adoption_count'], barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
        st.plotly_chart(adoption_fig, use_container_width=True)
    else:
        st.warning("No data available for selected filter.")


######################################## Location Based Segregation ######################################


if (selected_region == placeholders["Region"] and 
    selected_zone == placeholders["Zone"] and 
    selected_woreda == placeholders["Woreda"] and 
    selected_kebele == placeholders["Kebele"]):

    region_df = pd.DataFrame(reach_and_adoption_counts.get("region_counts", {})).transpose()
    if not region_df.empty:
        if len(region_df):
            region_df = region_df.reset_index().rename(columns={'index': 'Region'})
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Reach Counts by Region")
            with st.container(border=True):
                reach_fig = px.bar(region_df, x="Region", y=['male_reach_count_by_region', 'female_reach_count_by_region'],
                                   barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                reach_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(reach_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})

        with col2:
            st.subheader("Adoption Counts by Region")
            with st.container(border=True):
                adoption_fig = px.bar(region_df, x="Region", y=['male_adoption_count_by_region', 'female_adoption_count_by_region'],
                                       barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                adoption_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(adoption_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})
    else:
        st.warning("No data available for regions.")


elif (selected_woreda != placeholders["Woreda"] and selected_woreda) or (selected_kebele != placeholders["Kebele"] and selected_kebele) :
    kebele_df = pd.DataFrame(reach_and_adoption_counts.get("kebele_counts", {})).transpose()
    if not kebele_df.empty:
        col1, col2 = st.columns(2)
        if len(kebele_df):
            kebele_df = kebele_df.reset_index().rename(columns={'index': 'Kebele'})

        with col1:
            st.subheader("Reach Counts by Kebele")
            with st.container(border=True):
                reach_fig = px.bar(kebele_df, x="Kebele", y=['male_reach_count_by_kebele', 'female_reach_count_by_kebele'],
                                   barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                reach_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(reach_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})

        with col2:
            st.subheader("Adoption Counts by Kebele")
            with st.container(border=True):
                adoption_fig = px.bar(kebele_df, x="Kebele", y=['male_adoption_count_by_kebele', 'female_adoption_count_by_kebele'],
                                       barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                adoption_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(adoption_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})
    else:
        st.warning("No data available for kebeles.")


elif selected_zone != placeholders["Zone"] and selected_zone :
    woreda_df = pd.DataFrame(reach_and_adoption_counts.get("woreda_counts", {})).transpose()
    if not woreda_df.empty:
        if len(woreda_df):
            woreda_df = woreda_df.reset_index().rename(columns={'index': 'Woreda'})
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Reach Counts by Woreda")
            with st.container(border=True):
                reach_fig = px.bar(woreda_df, x="Woreda", y=['male_reach_count_by_woreda', 'female_reach_count_by_woreda'],
                                   barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                reach_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(reach_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})

        with col2:
            st.subheader("Adoption Counts by Woreda")
            with st.container(border=True):
                adoption_fig = px.bar(woreda_df, x="Woreda", y=['male_adoption_count_by_woreda', 'female_adoption_count_by_woreda'],
                                       barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                adoption_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(adoption_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})
    else:
        st.warning("No data available for woredas.")

elif selected_region != placeholders["Region"] and selected_region :
    zone_df = pd.DataFrame(reach_and_adoption_counts.get("zone_counts", {})).transpose()
    if not zone_df.empty:
        if len(zone_df):
            zone_df = zone_df.reset_index().rename(columns={'index': 'Zone'})
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Reach Counts by Zone")
            with st.container(border=True):
                reach_fig = px.bar(zone_df, x="Zone", y=['male_reach_count_by_zone', 'female_reach_count_by_zone'],
                                barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                reach_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(reach_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})

        with col2:
            st.subheader("Adoption Counts by Zone")
            with st.container(border=True):
                adoption_fig = px.bar(zone_df, x="Zone", y=['male_adoption_count_by_zone', 'female_adoption_count_by_zone'],
                                    barmode='stack', labels={'value': 'Count', 'variable': 'Gender'})
                adoption_fig.update_layout(xaxis=dict(type='category', categoryorder='category ascending'),
                                        xaxis_rangeslider_visible=True)
                st.plotly_chart(adoption_fig, use_container_width=True, style={'width': '100%', 'overflow-x': 'auto'})
    else:
        st.warning("No data available for zones.")
#######################################

