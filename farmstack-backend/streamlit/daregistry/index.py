from dotenv import load_dotenv
import streamlit as st
import psycopg2
import os
import pandas as pd
import plotly.express as px
from streamlit_echarts import st_echarts
load_dotenv()
st.set_page_config(
    layout="wide",
    initial_sidebar_state="auto",
    page_title="DA Registry Dashboard",
    page_icon=None,
)

st.markdown("<h1 class='main_heading'>DA Registry Dashboard</h1>", unsafe_allow_html=True)
st.divider()
def get_database_connection():
    return psycopg2.connect(
        host=os.getenv("DA_DB_HOST"),
        port=os.getenv("DA_DB_PORT"),
        user=os.getenv("DA_DB_USER"),
        password=os.getenv("DA_DB_PASSWORD"),
        database=os.getenv("DA_DB_NAME")
    )

# @st.cache_data
def fetch_data(query, params=None):
    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute(query, params)
    data = cursor.fetchall()
    connection.close()
    return data

def master_query():
    query = """
            SELECT 
                COUNT(da.id) as total_no_of_das,
                COUNT(da.id) / NULLIF(COUNT(DISTINCT k.id), 0) as average_da_per_kebele,
                SUM(CASE WHEN g.name = 'Male' THEN 1 ELSE 0 END) as count_male_da,
                SUM(CASE WHEN g.name = 'Female' THEN 1 ELSE 0 END) as count_female_da,
                COUNT(DISTINCT s.id) as total_specialization,
                COUNT(DISTINCT r.id) as total_regions,
                COUNT(DISTINCT z.id) as total_zones,
                COUNT(DISTINCT w.id) as total_woredas,
                COUNT(DISTINCT k.id) as total_kebeles
            FROM registry_developmentagent da
            JOIN registry_kebele k ON da.kebele_id = k.id
            JOIN registry_woreda w ON k.woreda_id = w.id
            JOIN registry_zone z ON w.zone_id = z.id
            JOIN registry_region r ON z.region_id = r.id
            JOIN registry_gender g ON da.gender_id = g.id
            JOIN registry_educationlevel el ON da.education_level_id = el.id
            JOIN registry_specialization s ON da.specialization_id = s.id
            WHERE 1=1
    """
    return query

# Function to build the master query with filters
def master_query_with_filter(gender_filter, education_level_filter, specialization_filter, region_filter, zone_filter, woreda_filter, kebele_filter):
    query = """
            SELECT 
                COUNT(da.id) as total_no_of_das,
                COUNT(da.id) / NULLIF(COUNT(DISTINCT k.id), 0) as average_da_per_kebele,
                SUM(CASE WHEN g.name = 'Male' THEN 1 ELSE 0 END) as count_male_da,
                SUM(CASE WHEN g.name = 'Female' THEN 1 ELSE 0 END) as count_female_da,
                COUNT(DISTINCT s.id) as total_specialization,
                COUNT(DISTINCT r.id) as total_regions,
                COUNT(DISTINCT z.id) as total_zones,
                COUNT(DISTINCT w.id) as total_woredas,
                COUNT(DISTINCT k.id) as total_kebeles
            FROM registry_developmentagent da
            JOIN registry_kebele k ON da.kebele_id = k.id
            JOIN registry_woreda w ON k.woreda_id = w.id
            JOIN registry_zone z ON w.zone_id = z.id
            JOIN registry_region r ON z.region_id = r.id
            JOIN registry_gender g ON da.gender_id = g.id
            JOIN registry_educationlevel el ON da.education_level_id = el.id
            JOIN registry_specialization s ON da.specialization_id = s.id
            WHERE 1=1
    """
    
    if region_filter != 'none':
        query += f" AND r.name = '{region_filter}'"
    if gender_filter != 'none':
        query += f" AND g.name = '{gender_filter}'"
    if education_level_filter != 'none':
        query += f" AND el.name = '{education_level_filter}'"
    if specialization_filter != 'none':
        query += f" AND s.name = '{specialization_filter}'"
    if zone_filter != 'none':
        query += f" AND z.name = '{zone_filter}'"
    if woreda_filter != 'none':
        query += f" AND w.name = '{woreda_filter}'"
    if kebele_filter != 'none':
        query += f" AND k.name = '{kebele_filter}'"
    
    return query

def get_das_by_region():
    query = """
        SELECT 
        COUNT(da.id) as total_no_of_das,
        r."name" as region_name
        FROM registry_developmentagent da
        JOIN registry_kebele k ON da.kebele_id = k.id
        JOIN registry_woreda w ON k.woreda_id = w.id
        JOIN registry_zone z ON w.zone_id = z.id
        JOIN registry_region r ON z.region_id = r.id
        GROUP BY r."name";
    """
    return query

def get_das_by_education_level(gender_filter, education_level_filter, specialization_filter, region_filter, zone_filter, woreda_filter, kebele_filter):
    query = """
    SELECT 
    COUNT(da.id) as total_no_of_das,
    el."name" as education_name
    FROM registry_developmentagent da
    JOIN registry_kebele k ON da.kebele_id = k.id
    JOIN registry_woreda w ON k.woreda_id = w.id
    JOIN registry_zone z ON w.zone_id = z.id
    JOIN registry_region r ON z.region_id = r.id
    JOIN registry_gender g ON da.gender_id = g.id
    JOIN registry_educationlevel el ON da.education_level_id = el.id
    JOIN registry_specialization s ON da.specialization_id = s.id
    WHERE 1=1
    """
    if region_filter != 'none':
        query += f" AND r.name = '{region_filter}'"
    if gender_filter != 'none':
        query += f" AND g.name = '{gender_filter}'"
    if education_level_filter != 'none':
        query += f" AND el.name = '{education_level_filter}'"
    if specialization_filter != 'none':
        query += f" AND s.name = '{specialization_filter}'"
    if zone_filter != 'none':
        query += f" AND z.name = '{zone_filter}'"
    if woreda_filter != 'none':
        query += f" AND w.name = '{woreda_filter}'"
    if kebele_filter != 'none':
        query += f" AND k.name = '{kebele_filter}'"
    query += " GROUP BY el.name"
    return query

def get_das_by_specialisations(gender_filter, education_level_filter, specialization_filter, region_filter, zone_filter, woreda_filter, kebele_filter):
    query = """
    SELECT 
    COUNT(da.id) as total_no_of_das,
    s."name" as spl_name
    FROM registry_developmentagent da
    JOIN registry_kebele k ON da.kebele_id = k.id
    JOIN registry_woreda w ON k.woreda_id = w.id
    JOIN registry_zone z ON w.zone_id = z.id
    JOIN registry_region r ON z.region_id = r.id
    JOIN registry_gender g ON da.gender_id = g.id
    JOIN registry_educationlevel el ON da.education_level_id = el.id
    JOIN registry_specialization s ON da.specialization_id = s.id
    WHERE 1=1
    """
    
    if region_filter != 'none':
        query += f" AND r.name = '{region_filter}'"
    if gender_filter != 'none':
        query += f" AND g.name = '{gender_filter}'"
    if education_level_filter != 'none':
        query += f" AND el.name = '{education_level_filter}'"
    if specialization_filter != 'none':
        query += f" AND s.name = '{specialization_filter}'"
    if zone_filter != 'none':
        query += f" AND z.name = '{zone_filter}'"
    if woreda_filter != 'none':
        query += f" AND w.name = '{woreda_filter}'"
    if kebele_filter != 'none':
        query += f" AND k.name = '{kebele_filter}'"
    query += " GROUP BY s.name"
    return query

# Functions to fetch filter options
def fetch_specializations():
    query = "SELECT DISTINCT name FROM registry_specialization"
    return fetch_data(query)

def fetch_education_levels():
    query = "SELECT DISTINCT name FROM registry_educationlevel"
    return fetch_data(query)

def fetch_genders():
    query = "SELECT DISTINCT name FROM registry_gender"
    return fetch_data(query)

def fetch_regions():
    query = "SELECT DISTINCT name FROM registry_region"
    return fetch_data(query)

def fetch_zones(region_name):
    query = "SELECT DISTINCT name FROM registry_zone WHERE region_id = (SELECT id FROM registry_region WHERE name = %s)"
    return fetch_data(query, [region_name])

def fetch_woredas(zone_name):
    query = "SELECT DISTINCT name FROM registry_woreda WHERE zone_id = (SELECT id FROM registry_zone WHERE name = %s)"
    return fetch_data(query, [zone_name])

def fetch_kebeles(woreda_name):
    query = "SELECT DISTINCT name FROM registry_kebele WHERE woreda_id = (SELECT id FROM registry_woreda WHERE name = %s LIMIT 1)"
    return fetch_data(query, [woreda_name])

# Helper function to convert fetched data to list of strings
def populate_dropdown(data):
    return ["none"] + [item[0] for item in data]

def main():
    with open("style.css", "r") as f:
        css = f.read()
    st.markdown(f'<style>{css}</style>', unsafe_allow_html=True)
    st.markdown("""
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    """, unsafe_allow_html=True)
    
    master_data = fetch_data(master_query())
    result = master_data[0]
    # Assign the values to descriptive variable names
    total_no_of_das = result[0]
    average_da_per_kebele = result[1]
    count_male_da = result[2]
    count_female_da = result[3]
    total_specialization = result[4]
    total_regions = result[5]
    total_zones = result[6]
    total_woredas = result[7]
    total_kebeles = result[8]

    data = {
        "Gender": ["Male", "Female"],
        "Count": [count_male_da, count_female_da]
    }
    df = pd.DataFrame(data)

    # Calculate total and percentages
    df['Percentage'] = (df['Count'] / df['Count'].sum()) * 100 if df['Count'].sum() > 0 else 0

    # Display results
    percentage_male = df.loc[df['Gender'] == 'Male', 'Percentage'].values[0]
    percentage_female = df.loc[df['Gender'] == 'Female', 'Percentage'].values[0]
    das_by_region = fetch_data(get_das_by_region())
    
    das_by_region_df = pd.DataFrame(das_by_region, columns=['count', 'region'])
    total_count = das_by_region_df['count'].sum()
    das_by_region_df['percentage'] = (das_by_region_df['count'] / total_count * 100).round(2)
    percentages_by_region = {row['region']: f"{row['percentage']}%" for _, row in das_by_region_df.iterrows()}
    
    region_percentages_html = ""
    for region, percentage in percentages_by_region.items():
        region_percentages_html += f'<div class="sub-list-title"><span class="bullet_green">&#8226;</span> {region}: <span class="value_style">{percentage}</span></div>\n'
    
    st.subheader("Total Stats")
    st.markdown(f"""
        <div class="grid_cont">
                <div class="basic_card">
                    <div class="title">Total no. of DAs</div>
                    <div class="sub-title"><span class="bullet_green">&#8226;</span> {total_no_of_das}</div>
                </div>
                <div class="basic_card">
                    <div class="title">Average DA per kebele</div>
                    <div class="sub-title"><span class="bullet_green">&#8226;</span> {average_da_per_kebele}</div>
                </div>
                <div class="basic_card">
                    <div class="title">DA by gender</div>
                    <div class="gender-info"><span class="bullet_green">&#8226;</span> Male: <span class="value_style">{percentage_male:.2f}%</span></div>
                    <div class="gender-info"><span class="bullet_orange">&#8226;</span> Female: <span class="value_style">{percentage_female:.2f}%</span></div>
                </div>
                <div class="basic_card">
                    <div class="title">Total specialisations</div>
                    <div class="sub-title"><span class="bullet_green">&#8226;</span> {total_specialization}</div>
                </div>
                <div class="basic_card">
                    <div class="title">DAs by region</div>
                    <div class="flex_container">
                        <div class="region_percentage_container">{region_percentages_html}</div>
                    </div>
                </div>
                <div class="basic_card">
                    <div class="title">Location stats</div>
                    <div class="basic_card_row">
                        <div class="basic_card_row_item"><span class="bullet_yellow">&#8226;</span> Region: <span class="value_style">{total_regions}</span></div>
                        <div class="basic_card_row_item"><span class="bullet_green">&#8226;</span> Zone: <span class="value_style">{total_zones}</span></div>
                    </div>
                    <div class="basic_card_row">
                        <div class="basic_card_row_item"><span class="bullet_blue">&#8226;</span> Woreda: <span class="value_style">{total_woredas}</span></div>
                        <div class="basic_card_row_item"><span class="bullet_orange">&#8226;</span> Kebele: <span class="value_style">{total_kebeles}</span></div>
                    </div>
                </div>
        </div>
    """, unsafe_allow_html=True)
    st.divider()
    st.subheader("Filter By")
    col21, col22, col23, col24, col25, col26, col27 = st.columns([1, 1, 1, 1, 1, 1, 1])
    
    # Fetch initial filter options
    specializations = populate_dropdown(fetch_specializations())
    education_levels = populate_dropdown(fetch_education_levels())
    genders = populate_dropdown(fetch_genders())
    regions = populate_dropdown(fetch_regions())
    
    # Input filters
    region_filter = col21.selectbox("Region", regions)
    
    if region_filter != 'none':
        zones = populate_dropdown(fetch_zones(region_filter))
    else:
        zones = ["none"]
    zone_filter = col22.selectbox("Zone", zones)

    if zone_filter != 'none':
        woredas = populate_dropdown(fetch_woredas(zone_filter))
    else:
        woredas = ["none"]
    woreda_filter = col23.selectbox("Woreda", woredas)

    if woreda_filter != 'none':
        kebeles = populate_dropdown(fetch_kebeles(woreda_filter))
    else:
        kebeles = ["none"]
    kebele_filter = col24.selectbox("Kebele", kebeles)

    gender_filter = col25.selectbox("Gender", genders)
    education_level_filter = col26.selectbox("Education Level", education_levels)
    specialization_filter = col27.selectbox("Specialization", specializations)
    
    master_data_with_filter = fetch_data(master_query_with_filter(gender_filter, education_level_filter, specialization_filter, region_filter, zone_filter, woreda_filter, kebele_filter))
    filtered_result = master_data_with_filter[0]
    filtered_total_no_of_das = filtered_result[0]
    filtered_average_da_per_kebele = filtered_result[1]
    filtered_count_male_da = filtered_result[2]
    filtered_count_female_da = filtered_result[3]
    filtered_total_regions = filtered_result[5]
    filtered_total_zones = filtered_result[6]
    filtered_total_woredas = filtered_result[7]
    filtered_total_kebeles = filtered_result[8]
    
    filtered_data_obj = {
        "Gender": ["Male", "Female"],
        "Count": [filtered_count_male_da, filtered_count_female_da]
    }
    filtered_df = pd.DataFrame(filtered_data_obj)

    # Calculate total and percentages
    filtered_df['Percentage'] = (filtered_df['Count'] / filtered_df['Count'].sum()) * 100 if filtered_df['Count'].sum() > 0 else 0

    # Display results
    filtered_percentage_male = filtered_df.loc[filtered_df['Gender'] == 'Male', 'Percentage'].values[0]
    filtered_percentage_female = filtered_df.loc[filtered_df['Gender'] == 'Female', 'Percentage'].values[0]
    
    das_by_education_level_data = fetch_data(get_das_by_education_level(gender_filter, education_level_filter, specialization_filter, region_filter, zone_filter, woreda_filter, kebele_filter))
    das_by_specialisations_level_data = fetch_data(get_das_by_specialisations(gender_filter, education_level_filter, specialization_filter, region_filter, zone_filter, woreda_filter, kebele_filter))
    st.divider()
    st.subheader("DA by region")
    st.markdown(f"""
        <div class="grid_cont">
                <div class="basic_card">
                    <div class="title">Total no. of DAs</div>
                    <div class="sub-title"><span class="bullet_green">&#8226;</span> {filtered_total_no_of_das}</div>
                </div>
                <div class="basic_card">
                    <div class="title">Average DA per kebele</div>
                    <div class="sub-title"><span class="bullet_green">&#8226;</span> {filtered_average_da_per_kebele}</div>
                </div>
                <div class="basic_card">
                    <div class="title">DA by gender</div>
                    <div class="gender-info"><span class="bullet_green">&#8226;</span> Male: <span class="value_style">{filtered_percentage_male:.2f}%</span></div>
                    <div class="gender-info"><span class="bullet_orange">&#8226;</span> Female: <span class="value_style">{filtered_percentage_female:.2f}%</span></div>
                </div>
                <div class="basic_card">
                    <div class="title">Location stats</div>
                    <div class="basic_card_row">
                        <div class="basic_card_row_item"><span class="bullet_yellow">&#8226;</span> Region: <span class="value_style">{filtered_total_regions}</span></div>
                        <div class="basic_card_row_item"><span class="bullet_green">&#8226;</span> Zone: <span class="value_style">{filtered_total_zones}</span></div>
                    </div>
                    <div class="basic_card_row">
                        <div class="basic_card_row_item"><span class="bullet_blue">&#8226;</span> Woreda: <span class="value_style">{filtered_total_woredas}</span></div>
                        <div class="basic_card_row_item"><span class="bullet_orange">&#8226;</span> Kebele: <span class="value_style">{filtered_total_kebeles}</span></div>
                    </div>
                </div>
        </div>
    """, unsafe_allow_html=True)
    col1, col2 = st.columns([1, 1])

    das_by_specialisations_level_df = pd.DataFrame(das_by_specialisations_level_data, columns=['Count', 'Specialisations'])
    x_data = das_by_specialisations_level_df['Specialisations'].tolist()
    y_data = das_by_specialisations_level_df['Count'].tolist()
    options = {
        "title": {
            "text": ""
        },
        "tooltip": {},
        "xAxis": {
            "type": "category",
            "data": x_data,
            "axisLabel": {
                "rotate": 90,
                "rich": {
                    "align": "left",
                    "verticalAlign": "top"
                }
            },
            "nameGap": 30
        },
        "yAxis": {
            "type": "value"
        },
        "dataZoom": [
            {
                "type": "slider",
                "height": 68,
                "bottom": 0,
            },
            {
                "type": "inside",
                "start": 0,
                "end": 100
            }
        ],
        "series": [
            {
                "name": "Count",
                "type": "bar",
                "data": y_data
            }
        ]
    }    
    das_by_education_level_df = pd.DataFrame(das_by_education_level_data, columns=['count', 'Education Level'])
    das_by_education_level_df_fig = px.pie(das_by_education_level_df, values='count', names='Education Level', title='')
    with col1:
        st.subheader("DA by specialisations")
        with st.container(border=True):
            st_echarts(options=options, height="450px")     
    with col2:
        st.subheader("DA by education level")
        with st.container(border=True):
            st.plotly_chart(das_by_education_level_df_fig, use_container_width=True)
if __name__ == "__main__":
    main()     

# das_by_specialisations_level_df_fig = px.bar(das_by_specialisations_level_df, y='Specialisations', x='Count', title='') 
# st.plotly_chart(das_by_specialisations_level_df_fig, use_container_width=True)  
