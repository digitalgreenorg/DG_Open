from concurrent.futures import ThreadPoolExecutor
import json
import math
import time
import streamlit as st
from dotenv import load_dotenv
import os
import redis
import pandas as pd
from mysql.connector.pooling import MySQLConnectionPool

st.set_page_config(
        layout="wide",
        initial_sidebar_state="auto",
        page_title="COCO Dashboard",
        page_icon=None,
    )
st.title("COCO Dashboard")
st.markdown(
    r"""
    <style>
    .stDeployButton {
            visibility: hidden;
        }
    </style>
    """, unsafe_allow_html=True
)
# Load environment variables from .env file
load_dotenv()

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))  # Convert port to integer
redis_db = int(os.getenv("REDIS_DB", 0))  # Convert db to integer as well
r = redis.Redis(host=redis_host, port=redis_port, db=redis_db, decode_responses=True)

# Define the query as a string variable
def getMasterQuery(start_date, end_date, country, state, district, block, village, project):
    query = f"""
        SELECT 
            gc.id as country_id, gs.id as state_id, 
            gd.id as district_id, gb.id as geographies_block, gv.id as village_id, 
            ph.id as people_household_id, ph.head_gender as head_gender
        FROM 
            geographies_country gc
            LEFT JOIN geographies_state gs ON gc.id = gs.country_id
            LEFT JOIN geographies_district gd ON gs.id = gd.state_id
            LEFT JOIN geographies_block gb ON gd.id = gb.district_id
            LEFT JOIN geographies_village gv ON gb.id = gv.block_id
            LEFT JOIN programs_project pp ON 1=1
            LEFT JOIN people_household ph ON ph.village_id = gv.id
            LEFT JOIN people_person p ON p.household_id = ph.id
        WHERE 
            ph.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    if project != 'none':
        query += f" AND pp.project_name = '{project}'"                              
    return query

def get_unique_farmers_attended_screenings_query(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT 
        COUNT(DISTINCT pma.person_id) as farmer_attended_screening,
        COUNT(DISTINCT pma.id) as total_screening
    FROM activities_personmeetingattendance as pma
    LEFT JOIN people_person as p ON pma.person_id = p.id
    LEFT JOIN geographies_village gv ON p.village_id = gv.id
    LEFT JOIN geographies_block gb ON gv.block_id = gb.id
    LEFT JOIN geographies_district gd ON gb.district_id = gd.id
    LEFT JOIN geographies_state gs ON gd.state_id = gs.id
    LEFT JOIN geographies_country gc ON gs.country_id = gc.id
    WHERE 
        pma.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    return query
    
def get_unique_farmers_adopting_practice_query(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT 
    COUNT(DISTINCT pap.person_id) as unique_farmers_adopting_practice ,
    COUNT(DISTINCT pap.id) as adoption_by_farmer
    FROM activities_personadoptpractice as pap
    LEFT JOIN people_person as p ON pap.person_id = p.id
    LEFT JOIN geographies_village gv ON p.village_id = gv.id
    LEFT JOIN geographies_block gb ON gv.block_id = gb.id
    LEFT JOIN geographies_district gd ON gb.district_id = gd.id
    LEFT JOIN geographies_state gs ON gd.state_id = gs.id
    LEFT JOIN geographies_country gc ON gs.country_id = gc.id
    WHERE 
        pap.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
        
    return query
    
def get_unique_screenings_query(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT COUNT(DISTINCT scr.id) 
    FROM activities_screening as scr
    LEFT JOIN geographies_village gv ON scr.village_id = gv.id
    LEFT JOIN geographies_block gb ON gv.block_id = gb.id
    LEFT JOIN geographies_district gd ON gb.district_id = gd.id
    LEFT JOIN geographies_state gs ON gd.state_id = gs.id
    LEFT JOIN geographies_country gc ON gs.country_id = gc.id
    WHERE scr.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    return query

def get_videos_shown_in_screenings_query(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT COUNT(DISTINCT svs.video_id) 
    FROM activities_screening_videoes_screened svs
    JOIN activities_screening s ON svs.screening_id = s.id
    LEFT JOIN geographies_village gv ON s.village_id = gv.id
    LEFT JOIN geographies_block gb ON gv.block_id = gb.id
    LEFT JOIN geographies_district gd ON gb.district_id = gd.id
    LEFT JOIN geographies_state gs ON gd.state_id = gs.id
    LEFT JOIN geographies_country gc ON gs.country_id = gc.id
    WHERE s.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    return query

def get_videos_produced_query(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT COUNT(DISTINCT vv.id) 
    FROM videos_video as vv
    LEFT JOIN geographies_village gv ON vv.village_id = gv.id
    LEFT JOIN geographies_block gb ON gv.block_id = gb.id
    LEFT JOIN geographies_district gd ON gb.district_id = gd.id
    LEFT JOIN geographies_state gs ON gd.state_id = gs.id
    LEFT JOIN geographies_country gc ON gs.country_id = gc.id
    WHERE vv.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    return query

def getFarmerGroupReached(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT COUNT(DISTINCT sfgt.persongroup_id) 
    FROM activities_screening_farmer_groups_targeted sfgt
    JOIN people_persongroup pg ON sfgt.persongroup_id = pg.id
    LEFT JOIN geographies_village gv ON pg.village_id = gv.id
    LEFT JOIN geographies_block gb ON gv.block_id = gb.id
    LEFT JOIN geographies_district gd ON gb.district_id = gd.id
    LEFT JOIN geographies_state gs ON gd.state_id = gs.id
    LEFT JOIN geographies_country gc ON gs.country_id = gc.id
    WHERE pg.time_created BETWEEN '{start_date}' AND '{end_date}'
    """  
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"    
    return query  
    

# Fetch adoption data
def getAdoptionQuery(start_date, end_date, country, state, district, block, village):
    query = f"""
    SELECT 
        COUNT(DISTINCT pap.id) AS adoption_count,
        MONTH(pap.date_of_adoption) AS month
    FROM 
        activities_personadoptpractice as pap
        LEFT JOIN people_person as p ON pap.person_id = p.id
        LEFT JOIN geographies_village gv ON p.village_id = gv.id
        LEFT JOIN geographies_block gb ON gv.block_id = gb.id
        LEFT JOIN geographies_district gd ON gb.district_id = gd.id
        LEFT JOIN geographies_state gs ON gd.state_id = gs.id
        LEFT JOIN geographies_country gc ON gs.country_id = gc.id    
    WHERE 
        pap.date_of_adoption BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    query += " GROUP BY MONTH(pap.date_of_adoption)"       
    return query

def getScreeningQuery(start_date, end_date, country, state, district, block, village):
    query = f"""
        SELECT 
            COUNT(DISTINCT pma.id) AS screening_count,
            MONTH(pma.time_created) AS month
        FROM 
            activities_personmeetingattendance as pma
            LEFT JOIN people_person as p ON pma.person_id = p.id
            LEFT JOIN geographies_village gv ON p.village_id = gv.id
            LEFT JOIN geographies_block gb ON gv.block_id = gb.id
            LEFT JOIN geographies_district gd ON gb.district_id = gd.id
            LEFT JOIN geographies_state gs ON gd.state_id = gs.id
            LEFT JOIN geographies_country gc ON gs.country_id = gc.id
        WHERE pma.time_created BETWEEN '{start_date}' AND '{end_date}'
        """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    query += " GROUP BY MONTH(pma.time_created)"     
    return query

def getAdoptionQueryByYear(start_date, end_date, country, state, district, block, village):
    query = f"""
        SELECT 
            COUNT(DISTINCT pap.id) AS adoption_count,
            YEAR(pap.date_of_adoption) AS year,
            QUARTER(pap.date_of_adoption) AS quarter
        FROM 
            activities_personadoptpractice as pap
                LEFT JOIN people_person as p ON pap.person_id = p.id
                LEFT JOIN geographies_village gv ON p.village_id = gv.id
                LEFT JOIN geographies_block gb ON gv.block_id = gb.id
                LEFT JOIN geographies_district gd ON gb.district_id = gd.id
                LEFT JOIN geographies_state gs ON gd.state_id = gs.id
                LEFT JOIN geographies_country gc ON gs.country_id = gc.id     
        WHERE 
            pap.date_of_adoption BETWEEN  '{start_date}' AND '{end_date}'
        """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    query += " GROUP BY YEAR(pap.date_of_adoption), QUARTER(pap.date_of_adoption)"    
    return query    
        
def getScreeningQueryByYear(start_date, end_date, country, state, district, block, village):
    query = f"""
        SELECT 
            COUNT(DISTINCT pma.id) AS screening_count,
            YEAR(pma.time_created) AS year,
            QUARTER(pma.time_created) AS quarter
        FROM 
            activities_personmeetingattendance as pma
            LEFT JOIN people_person as p ON pma.person_id = p.id
            LEFT JOIN geographies_village gv ON p.village_id = gv.id
            LEFT JOIN geographies_block gb ON gv.block_id = gb.id
            LEFT JOIN geographies_district gd ON gb.district_id = gd.id
            LEFT JOIN geographies_state gs ON gd.state_id = gs.id
            LEFT JOIN geographies_country gc ON gs.country_id = gc.id
        WHERE 
            pma.time_created BETWEEN '{start_date}' AND '{end_date}'
        """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    query += " GROUP BY YEAR(pma.time_created), QUARTER(pma.time_created)" 
    print(query,"something")
    return query    

def getFarmersAttendingVideoScreeningByGender(start_date, end_date, country, state, district, block, village):
    query = f"""
        SELECT p.gender, COUNT(pma.id) AS attendance_count
        FROM activities_personmeetingattendance pma
        JOIN people_person p ON pma.person_id = p.id
        LEFT JOIN geographies_village gv ON p.village_id = gv.id
        LEFT JOIN geographies_block gb ON gv.block_id = gb.id
        LEFT JOIN geographies_district gd ON gb.district_id = gd.id
        LEFT JOIN geographies_state gs ON gd.state_id = gs.id
        LEFT JOIN geographies_country gc ON gs.country_id = gc.id
        WHERE pma.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    query += " GROUP BY p.gender"    
    return query

def getFarmersAdoptRateByGender(start_date, end_date, country, state, district, block, village):
    query = f"""
        SELECT p.gender, COUNT(pap.id) AS attendance_count
        FROM activities_personadoptpractice pap
        JOIN people_person p ON pap.person_id = p.id
        LEFT JOIN geographies_village gv ON p.village_id = gv.id
        LEFT JOIN geographies_block gb ON gv.block_id = gb.id
        LEFT JOIN geographies_district gd ON gb.district_id = gd.id
        LEFT JOIN geographies_state gs ON gd.state_id = gs.id
        LEFT JOIN geographies_country gc ON gs.country_id = gc.id
        WHERE pap.time_created BETWEEN '{start_date}' AND '{end_date}'
    """
    if country != 'none':
        query += f" AND gc.country_name = '{country}'"
    if state != 'none':
        query += f" AND gs.state_name = '{state}'"        
    if district != 'none':
        query += f" AND gd.district_name = '{district}'"  
    if block != 'none':
        query += f" AND gb.block_name = '{block}'"
    if village != 'none':
        query += f" AND gv.village_name = '{village}'"
    query += " GROUP BY p.gender"    
    return query


pool = MySQLConnectionPool(
    pool_name="my_pool",
    pool_size=10,
    host=os.getenv("COCO_DB_HOST"),
    user=os.getenv("COCO_DB_USER"),
    password=os.getenv("COCO_DB_PASSWORD"),
    database=os.getenv("COCO_DB_NAME")
)

def fetch_data(query, params=None): 
    query_key = f"{query}:{params}"
    cached_data = r.get(query_key)
    if cached_data:
        print("Returning cached data")
        return json.loads(cached_data)
    start_time = time.time() 
    connection = pool.get_connection() 
    cursor = connection.cursor()
    cursor.execute(query, params)
    data = cursor.fetchall()
    cursor.close() 
    connection.close()
    end_time = time.time() 

    r.setex(query_key, 86400, json.dumps(data))  # Cache for 1 hour, adjust as necessary
    print(f"Query: {query}, Parameters: {params}, Rows Fetched: {len(data)}, Execution Time: {end_time - start_time} seconds")
    return data

# Function to populate dropdown with data
def populate_dropdown(data):
    options = ["none"]
    for item in data:
        options.append(item[0])
    return options

# Main function to create the dashboard
def main():
    # Link to external CSS file
    with open("./style.css", "r") as f:
        css = f.read()
    st.markdown(f'<style>{css}</style>', unsafe_allow_html=True)
    col1, col2, col4, col5, col6, col7 = st.columns([1, 1, 1, 1, 1, 1])
    col8, col9, col10, col11 = st.columns([1, 0.5, 1, 1])
    col12, col13, col14, col15 = st.columns([1, 1, 1, 1])
    col16, col17, col18, col19, col20 = st.columns([1, 1, 1, 1, 1])
    col21, col22 = st.columns([1, 1])
    
    # Set default start and end dates
    default_start_date = pd.to_datetime('2021-03-31')
    default_end_date = pd.to_datetime('2024-03-08')

    # Create date range selection
    start_date = col1.date_input("Start Date", value=default_start_date)
    end_date = col2.date_input("End Date", value=default_end_date)

    # selected_country = 'none' 
    selected_state = 'none'
    selected_district = 'none'
    selected_block = 'none'
    selected_village = 'none'
    selected_project = 'none'
    unique_farmers_attended_screenings_query = 0
    total_screening_farmers_query = 0
    unique_farmers_adopting_practice_query = 0
    adoption_by_farmers_query = 0
    unique_screenings_query = 0
    videos_shown_in_screenings_query = 0
    videos_produced_query = 0
    farmer_group_reached_query = 0
    adoption_data = 0
    screening_data = 0
    adoption_year_data = 0
    screening_year_data = 0

    # country_data = fetch_data("SELECT country_name FROM geographies_country", ())
    # country_options = populate_dropdown(country_data)
    # selected_country = col3.selectbox("Country", country_options)

    # if selected_country:
    state_data = fetch_data("SELECT state_name FROM geographies_state WHERE country_id = (SELECT id FROM geographies_country WHERE country_name = 'Ethiopia')")
    state_options = populate_dropdown(state_data)
    selected_state = col4.selectbox("Region", state_options)

    if selected_state:
        district_data = fetch_data("SELECT district_name FROM geographies_district WHERE state_id = (SELECT id FROM geographies_state WHERE state_name = %s)", (selected_state,))
        district_options = populate_dropdown(district_data)
        selected_district = col5.selectbox("Zone", district_options)

        if selected_district:
            block_data = fetch_data("SELECT block_name FROM geographies_block WHERE district_id = (SELECT id FROM geographies_district WHERE district_name = %s)", (selected_district,))
            block_options = populate_dropdown(block_data)
            selected_block = col6.selectbox("Woreda", block_options)

            if selected_block:
                village_data = fetch_data("SELECT village_name FROM geographies_village WHERE block_id = (SELECT id FROM geographies_block WHERE block_name = %s)", (selected_block,))
                village_options = populate_dropdown(village_data)
                selected_village = col7.selectbox("Kebele", village_options)
    
    project_data = fetch_data("SELECT project_name FROM programs_project", ())
    project_options = populate_dropdown(project_data)
    selected_project = col9.selectbox("Project", project_options)
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(fetch_data, getMasterQuery(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village, selected_project)),
            executor.submit(fetch_data, get_unique_farmers_attended_screenings_query(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, get_unique_farmers_adopting_practice_query(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, get_unique_screenings_query(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, get_videos_shown_in_screenings_query(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, get_videos_produced_query(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getFarmerGroupReached(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getAdoptionQuery(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getScreeningQuery(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getAdoptionQueryByYear(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getScreeningQueryByYear(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getFarmersAttendingVideoScreeningByGender(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village)),
            executor.submit(fetch_data, getFarmersAdoptRateByGender(start_date, end_date, "Ethiopia", selected_state, selected_district, selected_block, selected_village))
        ]
        # dashboard_data = [future.result() for future in futures]
        dashboard_data, farmer_screening_data, adoption_by_farmers_data, unique_screenings_query, videos_shown_in_screenings_query, videos_produced_query, farmer_group_reached_query, adoption_data, screening_data, adoption_year_data, screening_year_data, table_data_1, table_data_2 = [future.result() for future in futures]
    unique_farmers_attended_screenings_query, total_screening_farmers_query = farmer_screening_data[0]
    unique_farmers_adopting_practice_query, adoption_by_farmers_query = adoption_by_farmers_data[0]
    
    columns = ['country_id', 'state_id', 'district_id', 'geographies_block', 'village_id',
           'people_household_id', 'head_gender']
    # Create a DataFrame
    df = pd.DataFrame(dashboard_data, columns=columns)

    female_df = df[df['head_gender'] == 'F']
    female_headed_counts = female_df['head_gender'].value_counts()
    female_headed_count = female_headed_counts.get('F', 0) 
  
    unique_household = df['people_household_id'].nunique()
    
    # table_data_1 = fetch_data(getFarmersAttendingVideoScreeningByGender(start_date, end_date, selected_country, selected_state, selected_district, selected_block, selected_village))
    # table_data_2 = fetch_data(getFarmersAdoptRateByGender(start_date, end_date, selected_country, selected_state, selected_district, selected_block, selected_village))
    
    # table 1
    df_table_1 = pd.DataFrame(table_data_1, columns=['gender', 'attendance_count'])

    # Filter gender column to include only 'M' and 'F'
    df_table_1 = df_table_1[df_table_1['gender'].isin(['M', 'F'])]
    male_percentage_rounded = 0.0
    female_percentage_rounded = 0.0
    
    if not df_table_1.empty:
    # Calculate total attendance count
        total_attendance = df_table_1['attendance_count'].sum()

        # Calculate percentage attendance for each gender
        df_table_1['percentage'] = (df_table_1['attendance_count'] / total_attendance) * 100

        # Access male percentage
        male_percentage = df_table_1.loc[df_table_1['gender'] == 'M', 'percentage'].iloc[0]
        male_percentage_rounded = round(male_percentage, 2)
        
        female_percentage = df_table_1.loc[df_table_1['gender'] == 'F', 'percentage'].iloc[0]
        female_percentage_rounded = round(female_percentage, 2)
      
    data_1 = {
    'Gender': ['M', 'F'],
    'Percentage': [male_percentage_rounded, female_percentage_rounded]
    }
    
    df_1 = pd.DataFrame(data_1)
    sorted_df_1 = df_1.sort_values(by='Percentage', ascending=False)
    
    # table 2
    df_table_2 = pd.DataFrame(table_data_2, columns=['gender', 'attendance_count'])

    # Filter gender column to include only 'M' and 'F'
    df_table_2 = df_table_2[df_table_2['gender'].isin(['M', 'F'])]
    male_adopt_percentage_rounded = 0.0
    female_adopt_percentage_rounded = 0.0
    
    if not df_table_2.empty:
    # Calculate total attendance count
        total_attendance = df_table_2['attendance_count'].sum()

        # Calculate percentage attendance for each gender
        df_table_2['percentage'] = (df_table_2['attendance_count'] / total_attendance) * 100

        # Access male percentage
        male_percentage = df_table_2.loc[df_table_2['gender'] == 'M', 'percentage'].iloc[0]
        male_adopt_percentage_rounded = round(male_percentage, 2)
        
        female_percentage = df_table_2.loc[df_table_2['gender'] == 'F', 'percentage'].iloc[0]
        female_adopt_percentage_rounded = round(female_percentage, 2)
      
    data_2 = {
    'Gender': ['M', 'F'],
    'Percentage': [male_adopt_percentage_rounded, female_adopt_percentage_rounded]
    }
    df_2 = pd.DataFrame(data_2)
    sorted_df_2 = df_2.sort_values(by='Percentage', ascending=False)
    
    # unique_farmers_attended_screenings_query = fetch_data(get_unique_farmers_attended_screenings_query(start_date, end_date), (start_date, end_date))
    # total_screening_farmers_query = fetch_data(get_total_screening_farmers_query(start_date, end_date), (start_date, end_date))
    # unique_farmers_adopting_practice_query = fetch_data(get_unique_farmers_adopting_practice_query(start_date, end_date), (start_date, end_date))
    # adoption_by_farmers_query = fetch_data(get_adoption_by_farmers_query(start_date, end_date), (start_date, end_date))
    # unique_screenings_query = fetch_data(get_unique_screenings_query(start_date, end_date), (start_date, end_date))
    # videos_shown_in_screenings_query = fetch_data(get_videos_shown_in_screenings_query(), ())
    # videos_produced_query =fetch_data(get_videos_produced_query(start_date, end_date), (start_date, end_date))
    # farmer_group_reached_query = fetch_data(getFarmerGroupReached(), ())

    # adoption_data = fetch_data(getAdoptionQuery(start_date, end_date), (start_date, end_date))
    # screening_data = fetch_data(getScreeningQuery(start_date, end_date), (start_date, end_date))
    
    # adoption_year_data = fetch_data(getAdoptionQueryByYear(start_date, end_date), (start_date, end_date))
    # screening_year_data = fetch_data(getScreeningQueryByYear(start_date, end_date), (start_date, end_date))
    
    # screening with years
    adoption_year_counts = {}
    screening_year_counts = {}

    # Aggregate counts for each year
    for row in adoption_year_data:
        year = str(row[1])
        if year in adoption_year_counts:
            adoption_year_counts[year] += row[0]
        else:
            adoption_year_counts[year] = row[0]

    for row in screening_year_data:
        year = str(row[1])
        if year in screening_year_counts:
            screening_year_counts[year] += row[0]
        else:
            screening_year_counts[year] = row[0]
    
    # Convert dictionaries to JSON arrays of numbers
    adoption_year_counts_json = json.dumps([count for year, count in adoption_year_counts.items()])
    screening_year_counts_json = json.dumps([count for year, count in screening_year_counts.items()])

    screening_year_max_value = max(json.loads(screening_year_counts_json)) if json.loads(screening_year_counts_json) else 0
    screening_year_rounded_max_value = math.ceil(screening_year_max_value / 100) * 100

    adoption_counts = [0] * 12  # Initialize counts for each month with zeros
    screening_counts = [0] * 12  # Initialize counts for each month with zeros

    for row in adoption_data:
        month_index = int(row[1]) - 1  # Convert month number to index
        adoption_counts[month_index] = row[0]  # Update adoption count for the month

    for row in screening_data:
        month_index = int(row[1]) - 1  # Convert month number to index
        screening_counts[month_index] = row[0]  # Update screening count for the month

    screening_counts_json = json.dumps(screening_counts)
    adoption_counts_json = json.dumps(adoption_counts)
    highest_screening_number =  max(screening_counts)
    screening_monthly_rounded_max_value = math.ceil(highest_screening_number / 100) * 100

    with col8:
        st.markdown(f'<div class="card"><div class="title">Unique number of farmers who attended screenings</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_farmers_attended_screenings_query}</div></div>', unsafe_allow_html=True)
    
    with col10:
        st.write("% of farmers attending video screening, by gender")
        st.dataframe(sorted_df_1, hide_index=True, use_container_width=True)

    with col11:
        st.write("Adoption rate by gender")
        st.dataframe(sorted_df_2, hide_index=True, use_container_width=True)

    with col12:
        st.markdown(f'<div class="card"><div class="title">Count total of all screening farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {total_screening_farmers_query}</div></div>', unsafe_allow_html=True)

    with col13:
        st.markdown(f'<div class="card"><div class="title">Number of Unique farmers adopting at least one practice</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_farmers_adopting_practice_query}</div></div>', unsafe_allow_html=True)

    with col14:
        st.markdown(f'<div class="card"><div class="title">Number of adoption by farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {adoption_by_farmers_query}</div></div>', unsafe_allow_html=True)

    with col15:
        st.markdown(f'<div class="card"><div class="title">Number of unique screenings</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_screenings_query[0][0]}</div></div>', unsafe_allow_html=True)
    
    with col16:
        st.markdown(f'<div class="card"><div class="title">Number of videos shown in screenings</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {videos_shown_in_screenings_query[0][0]}</div></div>', unsafe_allow_html=True)
    
    with col17:
        st.markdown(f'<div class="card"><div class="title">Number of videos produced in selected period and location</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {videos_produced_query[0][0]}</div></div>', unsafe_allow_html=True)     
        
    with col18:
        st.markdown(f'<div class="card"><div class="title">Farmers group reached</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {farmer_group_reached_query[0][0]}</div></div>', unsafe_allow_html=True)     
        
    with col19:
        st.markdown(f'<div class="card"><div class="title">Number of Unique household reached</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_household}</div></div>', unsafe_allow_html=True)     
    with col20:
        st.markdown(f'<div class="card"><div class="title">Number of female-headed household</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {female_headed_count}</div></div>', unsafe_allow_html=True)     
    
    with col21:
        html_content = f"""
    <div id="main" style="width: 100%; height: 300px;background-color: #f0f0f0;"></div>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.1.2/dist/echarts.min.js"></script>
    <script type="text/javascript">
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        var option;
        let screeningData = {screening_counts_json};
        let adoptionData = {adoption_counts_json};
        let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Adjust monthNames array based on the number of values
        let numberOfValues = screeningData.length > adoptionData.length ? screeningData.length : adoptionData.length;
        if (numberOfValues < 12) {{
            monthNames = monthNames.slice(0, numberOfValues);
        }}

        option = {{
            title: {{
                text: 'Unique Farmers in Screening and Adoption by Month',
                top: '3%',
                left: '1%',
            }},
            tooltip: {{
                trigger: 'axis',
                axisPointer: {{
                    type: 'cross',
                    label: {{
                        backgroundColor: '#6a7985'
                    }}
                }}
            }},
            legend: {{
                data: ['Screening', 'Adoption'],
                x: 'right',
                left: '80%',
                top: '3%'
            }},
            toolbox: {{
                feature: {{
                }}
            }},
            grid: {{
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
            }},
            xAxis: [
                {{
                    type: 'category',
                    boundaryGap: false,
                    data: monthNames,
                    axisLabel: {{
                        show: true
                    }},
                    name: 'Month Name',
                    nameLocation: 'center',
                    nameGap: 30
                }}
            ],
            yAxis: [
                {{
                    type: 'value',
                    max: {screening_monthly_rounded_max_value},
                    interval: {math.ceil(screening_monthly_rounded_max_value / 5)},
                    axisLabel: {{
                        show: true
                    }},
                    name: 'Number',
                    nameLocation: 'center',
                    nameGap: 60
                }}
            ],
            series: [
                {{
                    name: 'Screening',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {{}},
                    emphasis: {{
                        focus: 'series'
                    }},
                    data: screeningData
                }},
                {{
                    name: 'Adoption',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {{}},
                    emphasis: {{
                        focus: 'series'
                    }},
                    data: adoptionData
                }},
            ]
        }};

        option && myChart.setOption(option);

        // Resize chart on window resize
        window.addEventListener('resize', function() {{
            myChart.resize();
        }});
    </script>
    """
        st.components.v1.html(html_content, height=400)
    
    with col22:
        html_content_year = f"""
        <div id="main" style="width: 100%; height: 300px;background-color: #f0f0f0;"></div>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.1.2/dist/echarts.min.js"></script>
        <script type="text/javascript">
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;
            let years = {json.dumps(list(adoption_year_counts.keys()))}; // Use years array for xAxis data
            let screeningData = {screening_year_counts_json}; // Pass screening counts as JSON
            let adoptionData = {adoption_year_counts_json}; // Pass adoption counts as JSON
            
            option = {{
                title: {{
                    text: 'Unique Farmers in Screening and Adoption  by Year',
                    top: '3%',
                    left: '1%',
                }},
                tooltip: {{
                    trigger: 'axis',
                    axisPointer: {{
                    type: 'cross',
                    label: {{
                        backgroundColor: '#6a7985'
                    }}
                    }}
                }},
                legend: {{
                    data: ['Screening', 'Adoption'],
                    x: 'right',
                    left: '80%',
                    top: '3%'
                }},
                toolbox: {{
                    feature: {{
                    }}
                }},
                grid: {{
                    left: '5%',
                    right: '5%',
                    bottom: '10%',
                    containLabel: true
                }},
                xAxis: [
                    {{
                    type: 'category',
                    boundaryGap: false,
                    data: years, // Use years array for xAxis data
                    axisLabel: {{
                        show: true
                    }},
                    name: 'Year',
                    nameLocation: 'center', // Center the axis name
                    nameGap: 30
                    }}
                ],
                yAxis: [
                    {{
                    type: 'value',
                    max: {screening_year_rounded_max_value},
                    interval: {math.ceil(screening_year_rounded_max_value / 5)},
                    axisLabel: {{
                        show: true
                    }},
                    name: 'Number',
                    nameLocation: 'center', // Center the axis name
                    nameGap: 60
                    }}
                ],
                series: [
                    {{
                    name: 'Screening',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {{}},
                    emphasis: {{
                        focus: 'series'
                    }},
                    data: screeningData
                    }},
                    {{
                    name: 'Adoption',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {{}},
                    emphasis: {{
                        focus: 'series'
                    }},
                    data: adoptionData
                    }},
                ]
            }};

            option && myChart.setOption(option);

            // Resize chart on window resize
            window.addEventListener('resize', function() {{
                myChart.resize();
            }});
        </script>
        """
        st.components.v1.html(html_content_year, height=400)

if __name__ == "__main__":
    main()