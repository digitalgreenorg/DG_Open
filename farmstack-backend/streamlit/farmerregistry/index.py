import psycopg2
import streamlit as st
import pandas as pd
import plotly.express as px
from dotenv import load_dotenv
import os
import plotly.graph_objs as go
load_dotenv()

db_name = os.getenv("FR_DB_NAME")
db_user = os.getenv("FR_DB_USER")
db_password = os.getenv("FR_DB_PASSWORD")
db_host = os.getenv("FR_DB_HOST")
db_port = os.getenv("FR_DB_PORT")

# print("db_name-->",db_name,db_user,db_password)
st.set_page_config(
        layout="wide",
        initial_sidebar_state="auto",
        page_title="Farmer Dashboard",
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
    df = pd.read_sql(query, conn, parse_dates=[])
    conn.close()
    return df



st.header("Farmer Registry Dashboard")

query = """
SELECT 
    fr.id AS farmer_id,
    fr.farmer_name,
    fr.father_name,
    fr.grand_father_name,
    fr.gender,
    fr.birth_month,
    fr.birth_year,
    fr.marital_status,
    fr.phone_number,
    fr.email,
    fr.age,
    fr.household_type,
    fr.farmer_category,
    fr.priority_crop_1,
    fr.priority_crop_2,
    fr.priority_crop_3,
    r.id as region_id,
    r.name as region_name,
    z.id as zone_id,
    z.name as zone_name,
    w.id as woreda_id,
    w.name as woreda_name,
    k.id as kebele_id,
    k.name as kebele_name,
    dg.id as devgroup_id,
    dg.group_name AS development_group_name,
    dgt.group_type AS development_group_type,
    fr.farming_type,
    fr.land_ownership,
    fl.gps_coordinates,
    fl.location_of_plot,
    fl.latitude,
    fl.longitude,
    fl.land_certification_number,
    fl.size_of_field,
    fl.soil_type,
    fl.id as farmland_id,
    l.id as livestock_id,
    l.livestock_type,
    flm.count AS livestock_count,
    flm.production_type AS livestock_production_type,
    c.id as crop_id,
    c.crop_type,
    lb.id as breed_id,
    fcv.production_type AS crop_production_type
FROM 
    farmer_registry_farmerregistry AS fr
LEFT JOIN 
    registry_kebele AS k ON fr.kebele_id = k.id
LEFT JOIN 
    registry_woreda AS w ON k.woreda_id = w.id
LEFT JOIN 
    registry_zone AS z ON w.zone_id = z.id
LEFT JOIN 
    registry_region AS r ON z.region_id = r.id
LEFT JOIN 
    farmer_registry_farmland AS fl ON fr.id = fl.farmer_id
LEFT JOIN 
    farmer_registry_developmentgroup AS dg ON k.id = dg.kebele_id
LEFT JOIN 
    farmer_registry_developmentgrouptypes AS dgt ON dg.group_type_id = dgt.id
LEFT JOIN 
    farmer_registry_farmerdevelopmentgroupmap AS fdm ON fr.id = fdm.farmer_id
LEFT JOIN 
    farmer_registry_farmerlivestockbreedmap AS flm ON fl.id = flm.farmland_id
LEFT JOIN 
    farmer_registry_livestockbreed AS lb ON flm.breed_id_id = lb.id
LEFT JOIN 
    farmer_registry_livestock AS l ON lb.livestock_id = l.id
LEFT JOIN 
    farmer_registry_farmercropvarietymap AS fcv ON fl.id = fcv.farmland_id
LEFT JOIN 
    farmer_registry_crop AS c ON fcv.crop_id = c.id;

"""



@st.cache_data
def cached_data(query):
    return fetch_data(query)


df = cached_data(query)

########################################################################################
unique_farmers_count=df['farmer_id'].nunique()
unique_female_farmer_count = df[df['gender'] == 'female']['farmer_id'].nunique()
unique_male_farmer_count = df[df['gender'] == 'male']['farmer_id'].nunique()
# Get the unique count of farmers with farming_type=mixed
unique_mixed_farming_farmer_count = df[df['farming_type'] == 'mixed']['farmer_id'].nunique()
unique_livestock_farming_farmer_count = df[df['farming_type'] == 'livestock_only']['farmer_id'].nunique()
unique_crop_farming_farmer_count = df[df['farming_type'] == 'crop_only']['farmer_id'].nunique()
# st.write(unique_farmers_count,unique_female_farmer_count,unique_male_farmer_count,unique_mixed_farming_farmer_count,unique_livestock_farming_farmer_count,unique_crop_farming_farmer_count)

with open("style.css", "r") as f:
    css = f.read()
st.markdown(f'<style>{css}</style>', unsafe_allow_html=True)
###########################################################################################
col1, col2, col3, col4,col5,col6 = st.columns([1, 1, 1, 1, 1, 1])

with col1:
    st.markdown(f'<div class="card"><div class="title">Total Number of Farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_farmers_count}</div></div>', unsafe_allow_html=True)

with col2:
    st.markdown(f'<div class="card"><div class="title">Number of Female farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_female_farmer_count}</div></div>', unsafe_allow_html=True)

with col3:
    st.markdown(f'<div class="card"><div class="title">Number of Male farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_male_farmer_count}</div></div>', unsafe_allow_html=True)

with col4:
    st.markdown(f'<div class="card"><div class="title">Number of Mixed farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_mixed_farming_farmer_count}</div></div>', unsafe_allow_html=True)

with col5:
    st.markdown(f'<div class="card"><div class="title">Number of Crop farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_crop_farming_farmer_count}</div></div>', unsafe_allow_html=True)

with col6:
    st.markdown(f'<div class="card"><div class="title">Number of LiveStock farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {unique_livestock_farming_farmer_count}</div></div>', unsafe_allow_html=True)

st.markdown("---")
######################################################################################
unique_regions = df[['region_id', 'region_name']].drop_duplicates()
unique_regions_list = unique_regions.to_dict(orient='records')

# print("unique_regions_list---->",unique_regions_list)
# st.write(unique_regions)


unique_zones = df[['region_id','zone_id' ,'zone_name']].drop_duplicates()
unique_zone_list = unique_zones.to_dict(orient='records')

# print("unique_zone_list---->",unique_zone_list)
# st.write(unique_zones)

unique_woreda = df[['zone_id','woreda_id' ,'woreda_name']].drop_duplicates()
unique_woreda_list = unique_woreda.to_dict(orient='records')

# print("unique_woreda_list---->",unique_woreda_list)
# st.write(unique_woreda)

unique_kebele= df[['woreda_id','kebele_id' ,'kebele_name']].drop_duplicates()
unique_kebele_list = unique_kebele.to_dict(orient='records')

unique_gender = df['gender'].unique()
unique_household_type = df['household_type'].unique()
unique_marital_status = df['marital_status'].unique()


unique_gender = ['Select Gender'] + list(unique_gender)
unique_household_type = ['Select Household Type'] + list(unique_household_type)
unique_marital_status = ['Select Marital Status'] + list(unique_marital_status)

unique_livestocks = df[['livestock_id', 'livestock_type']].drop_duplicates()
unique_livestocks_list = unique_livestocks.to_dict(orient='records')


unique_crops = df[['crop_id', 'crop_type']].drop_duplicates()
unique_crops_list = unique_crops.to_dict(orient='records')

placeholders = {
    "Region": "Select Region",
    "Zone": "Select Zone",
    "Woreda": "Select Woreda",
    "Kebele": "Select Kebele",
    "Gender": "Select Gender",
    "Household Type": "Select Household Type",
    "Marital Status": "Select Marital Status",
    "LiveStock":"Select Livestock",
    "Crop":"Select Crop"
}

filters = {
    "Location": unique_regions_list,
    "Zone": unique_zone_list,
    "Woreda": unique_woreda_list,
    "Kebele": unique_kebele_list,
    "LiveStock":unique_livestocks_list,
    "Crop":unique_crops_list
}


col7, col8, col9, col10 = st.columns(4)
with col7:
    selected_region = st.selectbox("Select Region", options=[placeholders["Region"]] + [region['region_name'] for region in filters['Location']])
with col8:
    selected_zone = st.selectbox("Select Zone", options=[placeholders["Zone"]] + [zone['zone_name'] for zone in filters['Zone']])
with col9:
    selected_woreda = st.selectbox("Select Woreda", options=[placeholders["Woreda"]] + [woreda['woreda_name'] for woreda in filters['Woreda']])
with col10:
    selected_kebele = st.selectbox("Select Kebele", options=[placeholders["Kebele"]] + [kebele['kebele_name'] for kebele in filters['Kebele']])
######################################################################################

col1, col2, col3 ,col4,col5= st.columns(5)

with col1:
    selected_gender = col1.selectbox("Select Gender", unique_gender)

with col2:
    selected_household_type = col2.selectbox("Select Household Type", unique_household_type)

with col3:
    selected_marital_status = col3.selectbox("Select Marital Status", unique_marital_status)
with col4:
    selected_livestock = st.selectbox("Select Livestock", options=[placeholders["LiveStock"]] + [livestock['livestock_type'] for livestock in filters['LiveStock']])
with col5:
    selected_crop = st.selectbox("Select Crop", options=[placeholders["Crop"]] + [crop['crop_type'] for crop in filters['Crop']])

#####################################################################################


def calculate_counts(data):
    unique_farmers_count=data['farmer_id'].nunique()
    ###gender
    unique_female_farmer_count = data[data['gender'] == 'female']['farmer_id'].nunique()
    unique_male_farmer_count = data[data['gender'] == 'male']['farmer_id'].nunique()
    
    #####farming_type
    unique_mixed_farming_farmer_count = data[data['farming_type'] == 'mixed']['farmer_id'].nunique()
    unique_livestock_farming_farmer_count = data[data['farming_type'] == 'livestock_only']['farmer_id'].nunique()
    unique_crop_farming_farmer_count = data[data['farming_type'] == 'crop_only']['farmer_id'].nunique()

    ##household_type
    unique_male_household_type_farmer_count = data[data['household_type'] == 'male_headed']['farmer_id'].nunique()
    unique_female_household_type_farmer_count = data[data['household_type'] == 'female_headed']['farmer_id'].nunique()

    ###farmer_category
    rich_farmer_count = data[data['farmer_category'] == 'rich_farmer']['farmer_id'].nunique()
    middle_farmer_count = data[data['farmer_category'] == 'middle_farmer']['farmer_id'].nunique()
    model_farmer_count = data[data['farmer_category'] == 'model_farmer']['farmer_id'].nunique()
    resource_poor_farmer_count = data[data['farmer_category'] == 'resource_poor_farmer']['farmer_id'].nunique()

    ###Livestock count and breed count
    livestock_count=data['livestock_id'].nunique()
    breed_count=data['breed_id'].nunique()
    # youth_df = data[data['development_group_type'] == 'youth_farmers']

    # # Get the unique count of devgroup_id
    # unique_youth_devgroup_count = youth_df['devgroup_id'].nunique()
    unique_youth_devgroup_count = data[data['development_group_type'] == 'youth_farmers']['devgroup_id'].nunique()
    unique_female_devgroup_count = data[data['development_group_type'] == 'female_only']['devgroup_id'].nunique()
    unique_mixed_devgroup_count = data[data['development_group_type'] == 'mixed']['devgroup_id'].nunique()
    # print("Unique count of development groups with type 'youth99':", unique_youth_devgroup_count)

    # Display the counts
    # print(youth_devgroup_counts)
    # mixed_devgroup_counts = (data[data['development_group_type'] == 'mixed'])
    # female_devgroup_counts = (data[data['development_group_type'] == 'female_only'])
    unique_devgroup_count=data['devgroup_id'].nunique()

    farmer_related_data={
        "farmers_count":unique_farmers_count,
        "female_farmer_count":unique_female_farmer_count,
        "male_farmer_count":unique_male_farmer_count,
        "mixed_farming_farmer_count":unique_mixed_farming_farmer_count,
        "livestock_farming_farmer_count":unique_livestock_farming_farmer_count,
        "crop_farming_farmer_count":unique_crop_farming_farmer_count,
        "male_household_type_farmer_count":unique_male_household_type_farmer_count,
        "female_household_type_farmer_count":unique_female_household_type_farmer_count,
        "rich_farmer_count":rich_farmer_count,
        "middle_farmer_count":middle_farmer_count,
        "model_farmer_count":model_farmer_count,
        "resource_poor_farmer_count":resource_poor_farmer_count,
        "livestock_count":livestock_count,
        "breed_count":breed_count,
        "youth_devgroup_counts":unique_youth_devgroup_count,
        "mixed_devgroup_counts":unique_mixed_devgroup_count,
        "female_devgroup_counts":unique_female_devgroup_count,
        "unique_devgroup_count":unique_devgroup_count
    }
    # print("farmer_related_data---->",farmer_related_data)
    ### production type 
    production_types_in_crop = (
        data[data['farming_type'] == 'crop_only']
        .groupby('crop_production_type')['farmer_id']
        .nunique()
        .reset_index()
        .rename(columns={'farmer_id': 'total_farmers'})
    )

    # Filter and count production types for livestock
    production_types_in_livestock = (
        data[data['farming_type'] == 'livestock_only']
        .groupby('livestock_production_type')['farmer_id']
        .nunique()
        .reset_index()
        .rename(columns={'farmer_id': 'total_farmers'})
    )

    # Combine counts
    combine_counts = pd.concat([
        production_types_in_crop.rename(columns={'crop_production_type': 'production_type'}),
        production_types_in_livestock.rename(columns={'livestock_production_type': 'production_type'})
    ])

    # Sum counts for matching production types
    combine_counts = (
        combine_counts
        .groupby('production_type')['total_farmers']
        .sum()
        .reset_index()
    )

    # Convert to dictionary if needed
    combine_counts_dict = combine_counts.set_index('production_type')['total_farmers'].to_dict()

    filtered_df = data.dropna(subset=['development_group_type'])

    # Group by 'development_group_type' and count the number of unique 'farmer_id's
    grouped_counts = filtered_df.groupby('development_group_type')['farmer_id'].nunique()

    # Convert the result to a dictionary
    count_of_farmers_with_dev_groups = grouped_counts.to_dict()

    development_groups_by_region = data.groupby('region_name')['devgroup_id'].nunique().to_dict()

    filtered_df = data[[
        'crop_type',
        'size_of_field',
        'farmer_id'  # Assuming this is the unique identifier for farmers
    ]]

    # Group by crop type, count the number of farmers and sum the field sizes for each crop
    grouped_df = filtered_df.groupby('crop_type').agg(
        num_of_farmers=('farmer_id', 'nunique'),
        total_field_size=('size_of_field', 'sum')
    )

    grouped_df.reset_index(inplace=True)

    grouped_df = grouped_df[grouped_df['total_field_size'].notna() & (grouped_df['total_field_size'] != 0)]

    top_crops = grouped_df.sort_values(by='num_of_farmers', ascending=False).head(5)

    crop_field_sizes_dict = {
        row['crop_type']: f"{row['num_of_farmers']} ({float(row['total_field_size'])} ha)"
        for index, row in top_crops.iterrows()
    }

    # print("crop_field_sizes_dict---->",crop_field_sizes_dict)  
    # print({"development_groups_by_location": development_groups_by_region})
    farmers_count_per_crop = data.groupby('crop_type')['farmer_id'].nunique()
    farmers_count_per_crop = farmers_count_per_crop.sort_values(ascending=False)

    farmers_count_per_crop_dict = farmers_count_per_crop.to_dict()


    farmland_groups = data.groupby(['soil_type', 'farmland_id'])['size_of_field'].sum()

    total_field_size_per_soil_type = farmland_groups.groupby('soil_type').sum()

    total_field_size_per_soil_type = total_field_size_per_soil_type.to_dict()
    # print("df.columns",df.columns)
    crop_production_based_on_location = data.groupby(['region_name', 'crop_type'])['farmer_id'].nunique().reset_index()

    # Convert the DataFrame to the desired dictionary format
    crop_production_dict = {}
    for region, crop, farmer_count in zip(crop_production_based_on_location['region_name'], crop_production_based_on_location['crop_type'], crop_production_based_on_location['farmer_id']):
        if region not in crop_production_dict:
            crop_production_dict[region] = {}
        crop_production_dict[region][crop] = farmer_count

    # Displaying the dictionary
    # print("crop_production_based_on_location:", crop_production_dict)
    livestock_counts = data.groupby('livestock_type')['farmer_id'].nunique().reset_index()

    # Handle the case where livestock_type is null
    livestock_counts['livestock_type'] = livestock_counts['livestock_type'].fillna('null')

    # Convert the result to a dictionary
    livestock_type_with_farmer_counts = dict(zip(livestock_counts['livestock_type'], livestock_counts['farmer_id']))

    # Print the dictionary
    # print("livestock_type_with_farmer_counts--->",livestock_type_with_farmer_counts)

    livestock_df = data[['region_name', 'livestock_type', 'livestock_count']]

    # Initialize an empty dictionary to store livestock data
    livestock_with_location = {}

    # Iterate over the DataFrame rows to populate the dictionary
    for index, row in livestock_df.iterrows():
        region = row['region_name']
        livestock_type = row['livestock_type']
        livestock_count = row['livestock_count']
        if region not in livestock_with_location:
            livestock_with_location[region] = {}
        if livestock_type not in livestock_with_location[region]:
            livestock_with_location[region][livestock_type] = 0
        livestock_with_location[region][livestock_type] += livestock_count

    for region in livestock_with_location:
        if None in livestock_with_location[region]:
            del livestock_with_location[region][None]

    return {
            "farmer_related_data":farmer_related_data,
            "combine_counts_dict":combine_counts_dict,
            "count_of_farmers_with_dev_groups":count_of_farmers_with_dev_groups,
            "development_groups_by_region":development_groups_by_region,
            "crop_field_sizes_dict":crop_field_sizes_dict,
            "farmers_count_per_crop_dict":farmers_count_per_crop_dict,
            "field_size_per_soil_type_dict":total_field_size_per_soil_type,
            "crop_production_based_on_location":crop_production_dict,
            "livestock_type_with_farmer_counts":livestock_type_with_farmer_counts,
            "livestock_with_location":livestock_with_location
            }

result=calculate_counts(df)

##########################################################################################

if selected_region or selected_zone or selected_woreda or selected_kebele or selected_household_type or selected_gender or selected_marital_status or selected_livestock or selected_crop:
    filtered_df = df.copy() 
    if selected_region and selected_region != placeholders["Region"]:
        filtered_df = filtered_df[filtered_df['region_name'] == selected_region]
        # selected_region_id = get_region_id(selected_region)
        # zones_under_selected_region=get_zones_for_region(selected_region_id)
        # print("zones_under_selected_region---->",zones_under_selected_region)


    if selected_zone and selected_zone != placeholders["Zone"]:
        filtered_df = filtered_df[filtered_df['zone_name'] == selected_zone]
        # selected_zone_id = get_zone_id(selected_zone)
        # woreda_under_selected_zone=get_woreda_for_zone(selected_zone_id)
        # print("woreda_under_selected_zone---->",woreda_under_selected_zone)

    if selected_woreda and selected_woreda != placeholders["Woreda"]:
        filtered_df = filtered_df[filtered_df['woreda_name'] == selected_woreda]
        # selected_woreda_id = get_woreda_id(selected_woreda)
        
        # kebele_under_selected_woreda=get_kebele_for_woreda(selected_woreda_id)
        # print("kebele_under_selected_woreda---->",kebele_under_selected_woreda)

    if selected_kebele and selected_kebele != placeholders["Kebele"]:
        filtered_df = filtered_df[filtered_df['kebele_name'] == selected_kebele]

    if selected_gender and selected_gender !="Select Gender":
        filtered_df = filtered_df[filtered_df['gender'] == selected_gender]
    if selected_household_type and selected_household_type !="Select Household Type":
        filtered_df = filtered_df[filtered_df['household_type'] == selected_household_type]  
    if selected_marital_status and selected_marital_status !="Select Marital Status":
        filtered_df = filtered_df[filtered_df['marital_status'] == selected_marital_status]
    if selected_livestock and selected_livestock !="Select Livestock":
        filtered_df = filtered_df[filtered_df['livestock_type'] == selected_livestock]
    if selected_crop and selected_crop !="Select Crop":
        filtered_df = filtered_df[filtered_df['crop_type'] == selected_crop]
    result= calculate_counts(filtered_df)

else:
    result=result


#########################################################################################

st.subheader("Farmer informations")
col16,col17,col18,col19=st.columns([1, 1, 1, 1])
with col16:
    st.markdown(f'<div class="secondarycard"><div class="title">Total Number of Male Farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["male_farmer_count"]}</div></div>', unsafe_allow_html=True)

with col17:
    st.markdown(f'<div class="secondarycard"><div class="title">Number of Female farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["female_farmer_count"]}</div></div>', unsafe_allow_html=True)

with col18:
    st.markdown(f'<div class="secondarycard"><div class="title">Number of Male Head</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["male_household_type_farmer_count"]}</div></div>', unsafe_allow_html=True)

with col19:
    st.markdown(f'<div class="secondarycard"><div class="title">Number of Female Head</div><div class="sub-title"><span class="bullet_green">&#8226;</span>{result["farmer_related_data"]["female_household_type_farmer_count"]}</div></div>', unsafe_allow_html=True)


##########################################################################################

col20, col21 = st.columns(2)
with col20:
    st.subheader("Production type")
    with st.container(border=True):
        combine_counts_dict=result["combine_counts_dict"]
    #     combine_counts_dict = {
    #     'Type A': 3,
    #     'Type B': 2,
    #     'Type C': 2,
    #     'Type D': 1
    # }
        # print("combine_counts_dict---->",combine_counts_dict)
        if combine_counts_dict !={}:
            data = {
                'Production Type': list(combine_counts_dict.keys()),
                'Total Farmers': list(combine_counts_dict.values())
            }
            pd_df = pd.DataFrame(data)
            fig = px.bar(pd_df, x='Production Type', y='Total Farmers')
            st.plotly_chart(fig,use_container_width=True)
        else:
            st.warning("No data available")

with col21:
    st.subheader("Farming type")
    sub_col1, sub_col2 = st.columns(2)
    with sub_col1:
        st.markdown(f'<div class="secondarycard"><div class="title">Number of Crop farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["crop_farming_farmer_count"]}</div></div>', unsafe_allow_html=True)

    with sub_col2:
        st.markdown(f'<div class="secondarycard"><div class="title">Number of LiveStock farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["livestock_farming_farmer_count"]}</div></div>', unsafe_allow_html=True)
    st.markdown(f'<div class="secondarycard"><div class="title">Number of Mixed farmers</div><div class="sub-title"><span class="bullet_green">&#8226;</span>{result["farmer_related_data"]["mixed_farming_farmer_count"]}</div></div>', unsafe_allow_html=True)

#############################################################################################

st.subheader("Farmer category")

col22, col23, col24, col25=st.columns([1,1,1,1])

with col22:
    st.markdown(f'<div class="secondarycard"><div class="title">Model Farmers Count</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["model_farmer_count"]}</div></div>', unsafe_allow_html=True)

with col23:
    st.markdown(f'<div class="secondarycard"><div class="title">Middle Farmers Count</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["middle_farmer_count"]}</div></div>', unsafe_allow_html=True)

with col24:
    st.markdown(f'<div class="secondarycard"><div class="title">Rich Farmers Count</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["rich_farmer_count"]}</div></div>', unsafe_allow_html=True)

with col25:
    st.markdown(f'<div class="secondarycard"><div class="title">Resource Poor Farmers Count</div><div class="sub-title"><span class="bullet_green">&#8226;</span>{result["farmer_related_data"]["resource_poor_farmer_count"]}</div></div>', unsafe_allow_html=True)

st.markdown("---")

##################################################################################################################

st.subheader("Development group informations")
col1,col2,col3,col4=st.columns([1,1,1,1])
col27,col28= st.columns([1,1])


with col1:
    st.markdown(f'<div class="secondarycard" style="margin-bottom: 10px;"><div class="title">Number of development groups</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["unique_devgroup_count"]}</div></div>', unsafe_allow_html=True)
with col2:
    st.markdown(f'<div class="secondarycard" style="margin-bottom: 10px;"><div class="title">No.of Mixed development group</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["mixed_devgroup_counts"]}</div></div>', unsafe_allow_html=True)
with col3:
    st.markdown(f'<div class="secondarycard" style="margin-bottom: 10px;"><div class="title">No.of Youth development group</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["youth_devgroup_counts"]}</div></div>', unsafe_allow_html=True)
with col4:
    st.markdown(f'<div class="secondarycard" style="margin-bottom: 10px;"><div class="title">No.of female development group</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {result["farmer_related_data"]["female_devgroup_counts"]}</div></div>', unsafe_allow_html=True)

with col27:
    try:
        st.subheader("Distribution of Farmers by Development Group Type")
        with st.container(border=True):
            labels = list(result.get("count_of_farmers_with_dev_groups", {}).keys())
            values = list(result.get("count_of_farmers_with_dev_groups", {}).values())

            if labels and values:
                fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.6)])
                fig.update_traces(textposition='inside', textinfo='percent+label')
                fig.update_layout(showlegend=True, legend=dict(
                    yanchor="middle",
                    xanchor="right",
                    x=0.95,
                    y=0.5
                ))

                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("No data available for Distribution of Farmers by Development Group Type.")
    except Exception as e:
        st.error(f"An error occurred: {e}")


with col28:
    try:
        st.subheader("Development Groups by Location")
        with st.container(border=True):
            labels = list(result.get("development_groups_by_region", {}).keys())
            values = list(result.get("development_groups_by_region", {}).values())

            if labels and values:
                fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.6)])
                fig.update_traces(textposition='inside', textinfo='percent+label')
                fig.update_layout(showlegend=True,legend=dict(
                        yanchor="middle",
                        xanchor="right", 
                        x=0.9,           
                        y=0.5     
                    ))
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("No data available for Development Groups by Location.")
    except Exception as e:
        st.error(f"An error occurred: {e}")


##########################################################################################
st.markdown("---")
st.subheader("Crop information details")
crop_field_sizes_dict = result["crop_field_sizes_dict"]
num_columns = 5
columns = st.columns(num_columns)

# for i, (crop, size_count) in enumerate(crop_field_sizes_dict.items()):
#     column_index = i % num_columns  
#     with columns[column_index]: 
#         st.markdown(
#             f'<div class="secondarycard" style="margin-bottom: 10px;">'
#             f'<div class="title">{crop.capitalize()}</div>'
#             f'<div class="sub-title"><span class="bullet_green">&#8226;</span> {size_count}</div>'
#             f'</div>',
#             unsafe_allow_html=True
#         )
if crop_field_sizes_dict:
    for i, (crop, size_count) in enumerate(crop_field_sizes_dict.items()):
        column_index = i % num_columns  
        with columns[column_index]: 
            st.markdown(
                f'<div class="secondarycard" style="margin-bottom: 10px;">'
                f'<div class="title">{crop.capitalize()}</div>'
                f'<div class="sub-title"><span class="bullet_green">&#8226;</span> {size_count}</div>'
                f'</div>',
                unsafe_allow_html=True
            )
else:
    st.warning("No data available for crop information details.")

##########################################################################################

col29,col30=st.columns([1,1])
with col29:
    try:
        st.subheader("Farmers count based on the crop type")
        with st.container(border=True):

            labels = list(result.get("farmers_count_per_crop_dict", {}).keys())
            values = list(result.get("farmers_count_per_crop_dict", {}).values())

            if labels and values:
                fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.6)])
                fig.update_traces(textposition='inside', textinfo='percent+label')
                fig.update_layout(showlegend=True, legend=dict(
                        yanchor="middle",
                        xanchor="right", 
                        x=1,           
                        y=0.5     
                    ))

                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("No data available for farmers count based on the crop type.")
    except Exception as e:
        st.error(f"An error occurred: {e}")

########################################################################################


with col30:
    try:
        st.subheader("Total Field Size per Soil Type")
        with st.container(border=True):

            soil_types = list(result["field_size_per_soil_type_dict"].keys())
            total_field_sizes = list(result["field_size_per_soil_type_dict"].values())

            if soil_types and total_field_sizes:
                soil_info = pd.DataFrame({
                    'Soil Type': soil_types,
                    'Total Field Size': total_field_sizes
                })

                fig = px.bar(soil_info, x='Soil Type', y='Total Field Size')

                fig.update_layout(
                    xaxis_title='Soil Type',
                    yaxis_title='Total Field Size (ha)',
                    xaxis_tickangle=-45, 
                    yaxis=dict(type='linear', range=[0, max(total_field_sizes) * 1.1]) 
                )

                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("No data available for total field size per soil type.")
    except Exception as e:
        st.error(f"An error occurred: {e}")


###########################################################################################



# st.write(result["crop_production_based_on_location"])


crop_df = pd.DataFrame(result["crop_production_based_on_location"]).fillna(0).transpose()

try:
    if not crop_df.empty:
        crop_df = crop_df.reset_index().rename(columns={'index': 'Location'})
    else:
        crop_df = None

    st.subheader("Crop Production by Location")
    with st.container(border=True):
        if crop_df is not None:
            crop_fig = px.bar(
                crop_df, 
                x='Location', 
                y=crop_df.columns[1:], 
                barmode='stack', 
                title='Crop Production by Location',
                labels={'value': 'Count', 'variable': 'Crop Type'}
            )
            st.plotly_chart(crop_fig, use_container_width=True)
        else:
            st.warning("No data available for crop production.")
except Exception as e:
    st.error(f"An error occurred: {e}")
#########################################################################################

        # "livestock_count":livestock_count,
        # "breed_count":breed_count,
st.markdown("---")
st.subheader("Livestock details")
col31,col32=st.columns([1,1])
livestock_count = result.get("farmer_related_data", {}).get("livestock_count", 0)
breed_count = result.get("farmer_related_data", {}).get("breed_count", 0)

with col31:
    st.markdown(f'<div class="secondarycard" style="margin-bottom: 10px;"><div class="title">Number of livestock count</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {livestock_count}</div></div>', unsafe_allow_html=True)

with col32:
    st.markdown(f'<div class="secondarycard" style="margin-bottom: 10px;"><div class="title">Number of breed count</div><div class="sub-title"><span class="bullet_green">&#8226;</span> {breed_count}</div></div>', unsafe_allow_html=True)

###########################################################################################
col33,col34=st.columns([1,1])
with col33:
    st.subheader("Livestock Counts with farmers count")
    with st.container(border=True):
        try:
            if result.get("livestock_type_with_farmer_counts"):
                labels = list(result["livestock_type_with_farmer_counts"].keys())
                values = list(result["livestock_type_with_farmer_counts"].values())

                if values:
                    fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.6)])
                    fig.update_traces(textposition='inside', textinfo='percent+label')
                    fig.update_layout(showlegend=True, legend=dict(
                            yanchor="middle",
                            xanchor="right", 
                            x=0.9,           
                            y=0.5     
                        ))
                    st.plotly_chart(fig, use_container_width=True)
                else:
                    st.warning("No data available for livestock type with farmer counts.")
            else:
                st.warning("No data available for livestock type with farmer counts.")
        except Exception as e:
            st.error(f"An error occurred: {e}")


#####################################################################################
# with col34:
#     livestock_df = pd.DataFrame(result["livestock_with_location"]).transpose()

#     # Reset index and rename columns if DataFrame is not empty
#     if not livestock_df.empty:
#         livestock_df = livestock_df.reset_index().rename(columns={'index': 'Location'})
#     else:
#         livestock_df = None

#     # Display the stacked bar chart using Streamlit and Plotly
#     st.subheader("Livestock Counts by Location")
#     with st.container(border=True):
#         try:
#             if livestock_df is not None:
#                 # Determine available livestock types after filtering
#                 available_livestock_types = [col for col in ['cattle', 'poultry', 'equine', 'goat', 'sheep'] if col in livestock_df.columns]

#                 livestock_fig = px.bar(
#                     livestock_df, 
#                     x='Location', 
#                     y=available_livestock_types,  # Use dynamically retrieved livestock types
#                     barmode='stack', 
#                     labels={'value': 'Count', 'variable': 'Livestock Type'}
#                 )
#                 st.plotly_chart(livestock_fig, use_container_width=True)
#             else:
#                 st.warning("No data available for livestock counts.")
#         except ValueError as ve:
#             st.error(f"An error occurred: {ve}. Please check your data consistency.")
#         except Exception as e:
#             st.error(f"An unexpected error occurred: {e}. Please contact support.")

with col34:
    livestock_df = pd.DataFrame(result["livestock_with_location"]).transpose()
    print("livestock_df-->",livestock_df)

    if not livestock_df.empty:
        livestock_df = livestock_df.reset_index().rename(columns={'index': 'Location'})
    st.subheader("Livestock Counts by Location")
    # print("livestock_df--->",livestock_df)
    with st.container(border=True):
        try:
            if livestock_df is not None and not livestock_df.empty:
                if livestock_df.drop(columns=['Location'], errors='ignore').isnull().all().all():  # Check if all values are NaN
                    st.warning("No data available for livestock counts.")
                else:
                    available_livestock_types = [col for col in ['cattle', 'poultry', 'equine', 'goat', 'sheep'] if col in livestock_df.columns]

                    livestock_fig = px.bar(
                        livestock_df, 
                        x='Location', 
                        y=available_livestock_types, 
                        barmode='stack', 
                        labels={'value': 'Count', 'variable': 'Livestock Type'}
                    )
                    st.plotly_chart(livestock_fig, use_container_width=True)
            else:
                st.warning("No data available for livestock counts.")
        except ValueError as ve:
            st.error(f"An error occurred: {ve}. Please check your data consistency.")
        except Exception as e:
            st.error(f"An unexpected error occurred: {e}. Please contact support.")
