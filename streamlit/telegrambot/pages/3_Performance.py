
import math
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
streamlit_cache_ttl=os.getenv("STREAMLIT_CACHE_TTL")

st.set_page_config(
        layout="wide",
        initial_sidebar_state="auto",
        page_title="Telegram BOT Dashboard",
        page_icon=None,
    )
st.header('Performance')

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


queries={
    "query_1":"""
    SELECT 
        da.details->'data'->>'da' AS da_id,
        da.details->'data'->'advisory_body'->'location'->>'id' AS location_id,
        da.details->'data'->'advisory_body'->'location'->>'name' AS location_level,
        da.created_at as created_at,
        ofp.gender AS gender, 
        dev.id AS dev_id,
        dev.name AS da_name,
        keb.id AS kebele_id,
        keb.name AS kebele_name,
        wor.name AS woreda_name,
        wor.id AS woreda_id,
        zon.name AS zone_name,
        zon.id AS zone_id,
        reg.name AS region_name,
        reg.id AS region_id,
        vc.id AS value_chain_id, 
        vc.name AS value_chain_name, 
        vcc.id AS value_chain_category_id, 
        vcc.name AS value_chain_category_name,
        p.name AS practice_name,
        p.id AS practice_id,
        r.id AS reach_id,
        ad.id AS adoption_id

    FROM 
        core_telegraminteractionlog AS da
    JOIN 
        integration_developmentagent AS dev
    ON 
        da.details->'data'->>'da' = dev.id::text
    INNER JOIN 
        integration_kebele AS keb
    ON 
        dev.kebele_id = keb.id
    INNER JOIN 
        integration_woreda AS wor
    ON 
        keb.woreda_id = wor.id
    INNER JOIN 
        integration_zone AS zon
    ON 
        wor.zone_id = zon.id
    INNER JOIN 
        integration_region AS reg
    ON 
        zon.region_id = reg.id
    INNER JOIN 
    core_outboundfarmerprofile ofp ON ofp.kebele_id = keb.id
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

    WHERE 
        da.action = 'ADVISORY_ACCESS_DA';
""",
"query_2":"""
    SELECT 
        da.details->'data'->>'da' AS da_id,
        da.details->'data'->'advisory_body'->'location'->>'id' AS location_id,
        da.details->'data'->'advisory_body'->'location'->>'name' AS location_level,
        da.created_at as created_at,
        ofp.gender AS gender, 
        dev.id AS dev_id,
        dev.first_name AS da_name,
        keb.id AS kebele_id,
        keb.name AS kebele_name,
        wor.name AS woreda_name,
        wor.id AS woreda_id,
        zon.name AS zone_name,
        zon.id AS zone_id,
        reg.name AS region_name,
        reg.id AS region_id,
        vc.id AS value_chain_id, 
        vc.name AS value_chain_name, 
        vcc.id AS value_chain_category_id, 
        vcc.name AS value_chain_category_name,
        p.name AS practice_name,
        p.id AS practice_id,
        r.id AS reach_id,
        ad.id AS adoption_id

    FROM 
        core_telegraminteractionlog AS da
    JOIN 
        core_outbounddaprofile AS dev
    ON 
        da.details->'data'->>'da' = dev.id::text
    INNER JOIN 
        integration_kebele AS keb
    ON 
        dev.kebele_id = keb.id
    INNER JOIN 
        integration_woreda AS wor
    ON 
        keb.woreda_id = wor.id
    INNER JOIN 
        integration_zone AS zon
    ON 
        wor.zone_id = zon.id
    INNER JOIN 
        integration_region AS reg
    ON 
        zon.region_id = reg.id
    INNER JOIN 
        core_outboundfarmerprofile ofp ON ofp.kebele_id = keb.id
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

    WHERE 
        da.action = 'ADVISORY_ACCESS_DA'
"""
}

# @st.cache_data(ttl=int(streamlit_cache_ttl))
def cached_data(query):
    return fetch_data(query)
query_one_output = cached_data(queries["query_1"])
query_two_output = cached_data(queries["query_2"])


concatenated_output = pd.concat([query_one_output, query_two_output], ignore_index=True)
concatenated_output=concatenated_output.reset_index(drop=True)
concatenated_output['created_at'] = pd.to_datetime(concatenated_output['created_at'])
concatenated_output_for_tab3=concatenated_output.copy()
concatenated_output_for_tab2=concatenated_output.copy()
column_mapping = {
    'male_reach_count': 'Male Farmers Reached',
    'female_reach_count': 'Female Farmers Reached',
    'woreda_name':'Woreda',
    'da_name':'DA Name',
    'male_adoption_count':'Male Farmers Adoption',
    'female_adoption_count':'Female Farmers Adoption',
    'kebele_name' :'Kebele',
    'value_chain_name':'Value Chain',
    'practice_name':'Practice',
    'access_count':'Access Count',
    'value_chain_category_name':'Category',
    'distinct_das':'Distinct DAs',

}

######################################


unique_kebele=concatenated_output.groupby(['woreda_id','kebele_id', 'kebele_name']).size().reset_index(name='count')
unique_kebele = unique_kebele.drop(columns=['count'])
kebele_list = unique_kebele.to_dict(orient='records')

## DAs
unique_da=concatenated_output.groupby(['da_id', 'da_name']).size().reset_index(name='count')
unique_da = unique_da.drop(columns=['count'])
# st.write(len(unique_da))
da_list = unique_da.to_dict(orient='records')

## Practice
unique_practice=concatenated_output.groupby(['practice_id', 'practice_name']).size().reset_index(name='count')
unique_practice = unique_practice.drop(columns=['count'])
# st.write(len(unique_practice))
practice_list = unique_practice.to_dict(orient='records')

#unique value chain
unique_value_chain=concatenated_output.groupby(['value_chain_id', 'value_chain_name']).size().reset_index(name='count')
unique_value_chain = unique_value_chain.drop(columns=['count'])
# st.write(len(unique_value_chain))
value_chain_list = unique_value_chain.to_dict(orient='records')

#unique value chain category 
unique_value_chain_category=concatenated_output.groupby(['value_chain_category_id', 'value_chain_category_name']).size().reset_index(name='count')
unique_value_chain_category = unique_value_chain_category.drop(columns=['count'])
# st.write(len(unique_value_chain_category))
unique_value_chain_category_list = unique_value_chain_category.to_dict(orient='records')

placeholders = {
    "Region": "Select Region",
    "Zone": "Select Zone",
    "Woreda": "Select Woreda",
    "Kebele": "Select Kebele",
    "DA": "Select DA",
    "Advisory": "Select Advisory",
    "Practice": "Select Practice",
    "Value Chain":"Select Value Chain",
    "Value Chain Category":"Select Value Chain Category"
}

filters = {
    "Kebele": kebele_list,
    "DA": da_list,
    "Practice": practice_list,
    "Value Chain":value_chain_list,
    "Value Chain Category":unique_value_chain_category_list
}


# selected_kebele = st.selectbox("Select Kebele", options=[placeholders["Kebele"]] + [kebele['kebele_name'] for kebele in filters['Kebele']])
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

def create_selection_widgets(col, options, placeholder):
    selected = col.selectbox(placeholder, options)
    return selected

def create_multiselect_widgets(col, options, placeholder):
    selected = col.multiselect(placeholder, options)
    return selected

tab1, tab2, tab3 = st.tabs(["Administrative unit performance","DA performance(Woreda level only)","Value chain reports"])

with tab1:
    today_utc = pd.Timestamp(datetime.date.today(), tz='UTC')
    # selected_kebele = st.multiselect('Select a Kebele', [kebele['kebele_name'] for kebele in kebele_list if kebele['kebele_name'] != 'All'],key="tab1_multiselect",max_selections=5)
    kebele_names = [kebele['kebele_name'] for kebele in kebele_list if kebele['kebele_name'] != 'All']
    default_selection = kebele_names[:5]
    selected_kebele = st.multiselect('Select a Kebele', kebele_names, default=default_selection, key="tab1_multiselect", max_selections=5)

    col1,col2,col3,col4,col5=st.columns(5)

    with col1:
        selected_da = st.selectbox("Select DA", options=[placeholders["DA"]] + [da['da_name'] for da in filters['DA']],key="da_list_tab3")
    with col2:
        selected_practice = st.selectbox("Select Practice", options=[placeholders["Practice"]] + [practice['practice_name'] for practice in filters['Practice']],key="practice_list_tab1")
    with col3:
        selected_value_chain = st.selectbox("Select Value Chain", options=[placeholders["Value Chain"]] + [valuechain['value_chain_name'] for valuechain in filters['Value Chain']],key="value_chain_tab1")
    with col4:
        selected_value_chain_category = st.selectbox("Select Category", options=[placeholders["Value Chain Category"]] + [valuechaincat['value_chain_category_name'] for valuechaincat in filters['Value Chain Category']],key="value_chain_cat_list1")
    with col5:
        start_date=select_period(1)
        start_date_utc = pd.Timestamp(start_date, tz='UTC')
        # st.write(start_date)
    

    def filter_data(df, kebeles, da, practice, value_chain, value_chain_category, start_date):
        df=df.copy()
        if kebeles:
            df = df[df['kebele_name'].isin(kebeles)]
        if da and da != placeholders["DA"]:
            df = df[df['da_name'] == da]
        if practice and practice != placeholders["Practice"]:
            df = df[df['practice_name'] == practice]
        if value_chain and value_chain != placeholders["Value Chain"]:
            df = df[df['value_chain_name'] == value_chain]
        if value_chain_category and value_chain_category != placeholders["Value Chain Category"]:
            df = df[df['value_chain_category_name'] == value_chain_category]
        if start_date:
            start_date_utc = pd.Timestamp(start_date, tz='UTC')
             # Check if datetime is timezone aware
            if df['created_at'].dt.tz is None:
                df['created_at'] = df['created_at'].dt.tz_localize('UTC')
            else:
                df['created_at'] = df['created_at'].dt.tz_convert('UTC')
            df = df[(df['created_at'] >= start_date_utc) & (df['created_at'] <= today_utc)]
        return df
  
# Apply filters
    concatenated_output = filter_data(concatenated_output, selected_kebele, selected_da, selected_practice, selected_value_chain, selected_value_chain_category, start_date)

    distinct_das_df = concatenated_output.drop_duplicates(subset="da_id")

    tab11, tab12 = st.tabs(['List View','Graph View'])
    with tab11:
        grouped_output = concatenated_output.groupby(
            ["kebele_id", "kebele_name", 
            "practice_id", "practice_name", 
            "value_chain_id", "value_chain_name", 
            "value_chain_category_id", "value_chain_category_name"
        ]
        ).agg(
            distinct_das=("da_id", "nunique"),
            access_count=("da_id", "count")
        ).reset_index()
        grouped_output = grouped_output.rename(columns=column_mapping)

        column_to_show=['Kebele','Category','Value Chain','Practice','Distinct DAs','Access Count']
        st.subheader('Advisory Access')

        st.dataframe(grouped_output[column_to_show],width=1000)
        #####un comment it later


        def reach_counts(df):
            male_reach_count = df[df['gender'].str.lower() == 'male']['reach_id'].nunique()
            female_reach_count = df[df['gender'].str.lower() == 'female']['reach_id'].nunique()
            return pd.Series({
                'male_reach_count': male_reach_count,
                'female_reach_count': female_reach_count
            })
        
        # Group by specified columns and apply the custom aggregation function
        grouped_reach_data = concatenated_output.groupby(
            ["kebele_id", "kebele_name", 
            "practice_id", "practice_name", 
            "value_chain_id", "value_chain_name", 
            "value_chain_category_id", "value_chain_category_name"],
            as_index=False  # Ensure not to use group keys as index
        ).apply(reach_counts).reset_index(drop=True)

        # Define column mapping for renaming
        column_mapping = {
            'kebele_name': 'Kebele',
            'value_chain_category_name': 'Category',
            'value_chain_name': 'Value Chain',
            'practice_name': 'Practice',
            'male_reach_count': 'Male Farmers Reached',
            'female_reach_count': 'Female Farmers Reached',
            'male_adoption_count': 'Male Farmers Adoption',
            'female_adoption_count': 'Female Farmers Adoption',
            'region_name':'Region Name',
            'zone_name':'Zone Name',
            'woreda_name':'Woreda',
            'da_name':'DA Name',
            'access_count':'Access Count'
        }


        columns_to_show = ['Kebele', 'Category', 'Value Chain', 'Practice', 'Male Farmers Reached', 'Female Farmers Reached']

        if grouped_reach_data.empty:
            st.subheader("Reach Recorded")
            st.warning("No data available for the selected filters.")
        else:
            grouped_reach_data = grouped_reach_data.rename(columns=column_mapping)
            st.subheader("Reach Recorded")
            st.dataframe(grouped_reach_data[columns_to_show], width=1000)

        #####Graph
        def adoption_counts(df):
            male_adoption_count = df[df['gender'].str.lower() == 'male']['adoption_id'].nunique()
            female_adoption_count = df[df['gender'].str.lower() == 'female']['adoption_id'].nunique()
            return pd.Series({
                'male_adoption_count': male_adoption_count,
                'female_adoption_count': female_adoption_count
            })

        # Group by kebele, practice, value chain, and category, and apply the custom aggregation function
        grouped_adoption_data = concatenated_output.groupby(
            ["kebele_id", "kebele_name", 
            "practice_id", "practice_name", 
            "value_chain_id", "value_chain_name", 
            "value_chain_category_id", "value_chain_category_name"],
            as_index=False 
        ).apply(adoption_counts).reset_index(drop=True)
        grouped_adoption_data = grouped_adoption_data.rename(columns=column_mapping)

        if grouped_adoption_data.empty:
            st.subheader("Adoption Recorded")
            st.warning("No data available for the selected filters.")
        else:
            column_to_show=['Kebele','Category','Value Chain','Practice','Male Farmers Adoption','Female Farmers Adoption']
            # print("grouped_adoption_data----->",grouped_adoption_data)
            st.subheader("Adoption Recorded")
            st.dataframe(grouped_adoption_data[column_to_show],width=1000)

####Graph
    with tab12:
        def reach_counts_for_graph(df):
            male_reach_count = df[df['gender'].str.lower() == 'male']['reach_id'].nunique()
            female_reach_count = df[df['gender'].str.lower() == 'female']['reach_id'].nunique()
            return pd.Series({
                'male_reach_count': male_reach_count,
                'female_reach_count': female_reach_count
            }) 
        grouped_reach_data_for_graph = concatenated_output.groupby(
            ["kebele_id", "kebele_name", 
            "practice_id", "practice_name", 
            "value_chain_id", "value_chain_name", 
            "value_chain_category_id", "value_chain_category_name"],
            as_index=False 
        ).apply(reach_counts_for_graph).reset_index(drop=True)
        grouped_reach_data_for_graph = grouped_reach_data_for_graph.rename(columns=column_mapping)
        df_top5 = grouped_reach_data_for_graph

        st.subheader("Advisory Access")
        today_utc = pd.Timestamp(datetime.date.today(), tz='UTC')
        #change here
        filtered_df = concatenated_output[(concatenated_output['created_at'] >= start_date_utc) & (concatenated_output['created_at'] <= today_utc)]
        access_counts = filtered_df.groupby(['kebele_name', 'created_at']).size().reset_index(name='access_count')

        fig = px.line(access_counts, x='created_at', y='access_count', color='kebele_name', markers=True)
        st.plotly_chart(fig,use_container_width=True)

        if grouped_reach_data_for_graph.empty:
            st.subheader("Reach Recorded")
            st.warning("No data available for the selected filters.")
        else:

            fig = px.bar(
                df_top5,
                x='Kebele',
                y=['Male Farmers Reached', 'Female Farmers Reached'],
                # title='Reach Recorded Tab1',
                # labels={'value': 'Reach Count', 'variable': 'Gender'},
                barmode='group',
                # color_discrete_map=color_discrete_map
            )

            # Customize the layout
            fig.update_layout(
                xaxis_title='Kebele',
                yaxis_title='Reach Count',
                legend_title='Gender',
                legend=dict(
                    x=1.0,
                    y=1.0
                )
            )
            st.subheader("Reach Recorded")
            # Display the chart in Streamlit
            st.plotly_chart(fig,use_container_width=True)

        def adoption_counts(df):
            male_adoption_count = df[df['gender'].str.lower() == 'male']['adoption_id'].nunique()
            female_adoption_count = df[df['gender'].str.lower() == 'female']['adoption_id'].nunique()
            return pd.Series({
                'male_adoption_count': male_adoption_count,
                'female_adoption_count': female_adoption_count
            })
        grouped_adoption_data = concatenated_output.groupby(
            ["kebele_id", "kebele_name", 
            "practice_id", "practice_name", 
            "value_chain_id", "value_chain_name", 
            "value_chain_category_id", "value_chain_category_name"],
            as_index=False 
        ).apply(adoption_counts).reset_index(drop=True)
        grouped_adoption_data = grouped_adoption_data.rename(columns=column_mapping)
        df_top5 = grouped_adoption_data

        if grouped_reach_data_for_graph.empty:
            st.subheader("Adoption Recorded")
            st.warning("No data available for the selected filters.")
        else:
            fig = px.bar(
                df_top5,
                x='Kebele',
                y=['Male Farmers Adoption', 'Female Farmers Adoption'],
                # title='Adoption Recorded Tab1',
                # labels={'value': 'Reach Count', 'variable': 'Gender'},
                barmode='group',
                # color_discrete_map=color_discrete_map
            )

            # Customize the layout
            fig.update_layout(
                xaxis_title='Kebele',
                yaxis_title='Adoption Count',
                legend_title='Gender',
                legend=dict(
                    x=1.0,
                    y=1.0
                )
            )

            # Display the chart in Streamlit
            st.subheader("Adoption Recorded")
            st.plotly_chart(fig,use_container_width=True)




#######################

# tab 2
with tab2:
    concatenated_output=concatenated_output_for_tab2
    today_utc = pd.Timestamp(datetime.date.today(), tz='UTC')
    # selected_kebele = st.multiselect('Select a Kebele', [kebele['kebele_name'] for kebele in kebele_list if kebele['kebele_name'] != 'All'],key="tab2_multiselect",max_selections=5)
    kebele_names = [kebele['kebele_name'] for kebele in kebele_list if kebele['kebele_name'] != 'All']
    default_selection = kebele_names[:5]
    selected_kebele = st.multiselect('Select a Kebele', kebele_names, default=default_selection, key="tab2_multiselect", max_selections=5)  
    col1,col2,col3,col4=st.columns(4)

    with col1:
        selected_da = st.selectbox("Select DA", options=[placeholders["DA"]] + [da['da_name'] for da in filters['DA']],key="da_list_tab1")
    with col2:
        selected_practice = st.selectbox("Select Practice", options=[placeholders["Practice"]] + [practice['practice_name'] for practice in filters['Practice']],key="practice_list_tab3")
    with col3:
        selected_value_chain = st.selectbox("Select Value Chain", options=[placeholders["Value Chain"]] + [valuechain['value_chain_name'] for valuechain in filters['Value Chain']],key="value_chain_list2")
    with col4:
        selected_value_chain_category = st.selectbox("Select Category", options=[placeholders["Value Chain Category"]] + [valuechaincat['value_chain_category_name'] for valuechaincat in filters['Value Chain Category']],key="value_chain_cat_list2")
    # with col5:
    #     start_date=select_period(2)
    #     start_date_utc = pd.Timestamp(start_date, tz='UTC')
    #     st.write(start_date)

    def filter_data_tab2(df, kebeles, da, practice, value_chain, value_chain_category, start_date):
        df=df.copy()
        if kebeles:
            df = df[df['kebele_name'].isin(kebeles)]
        if da and da != placeholders["DA"]:
            df = df[df['da_name'] == da]
        if practice and practice != placeholders["Practice"]:
            df = df[df['practice_name'] == practice]
        if value_chain and value_chain != placeholders["Value Chain"]:
            df = df[df['value_chain_name'] == value_chain]
        if value_chain_category and value_chain_category != placeholders["Value Chain Category"]:
            df = df[df['value_chain_category_name'] == value_chain_category]
        if start_date:
            start_date_utc = pd.Timestamp(start_date, tz='UTC')
                         # Check if datetime is timezone aware
            if df['created_at'].dt.tz is None:
                df['created_at'] = df['created_at'].dt.tz_localize('UTC')
            else:
                df['created_at'] = df['created_at'].dt.tz_convert('UTC')
            df = df[(df['created_at'] >= start_date_utc) & (df['created_at'] <= today_utc)]
        return df
    concatenated_output = filter_data_tab2(concatenated_output, selected_kebele, selected_da, selected_practice, selected_value_chain, selected_value_chain_category, start_date)
    def gender_counts(df):
        male_reach_count = df[df['gender'].str.lower() == 'male']['reach_id'].nunique()
        female_reach_count = df[df['gender'].str.lower() == 'female']['reach_id'].nunique()
        male_adoption_count = df[df['gender'].str.lower() == 'male']['adoption_id'].nunique()
        female_adoption_count = df[df['gender'].str.lower() == 'female']['adoption_id'].nunique()
        access_count = df['da_id'].count()
        return pd.Series({
            'male_reach_count': male_reach_count,
            'female_reach_count': female_reach_count,
            'male_adoption_count': male_adoption_count,
            'female_adoption_count': female_adoption_count,
            'access_count': access_count
        })

    grouped_data = concatenated_output.groupby(['da_name', 'kebele_name'], as_index=False ).apply(gender_counts).reset_index(drop=True)
    tab21, tab22 = st.tabs(['List View','Graph View'])
    with tab21:
        if grouped_data.empty:
            st.subheader("DA performance")
            st.warning("No data available for the selected filters.")
        else:
            grouped_data = grouped_data.rename(columns=column_mapping)
            st.subheader("DA performance")
            st.dataframe(grouped_data,width=1000)
            # fig = px.bar(grouped_data, x='kebele_name', y=['Male Farmers Reached', 'Female Farmers Reached', 'Male Farmers Adoption', 'Female Farmers Adoption', 'Access Count'],
            #              barmode='group', title='DA Performance by Kebele')
            # st.plotly_chart(fig)


    # # Define the color map
    with tab22:
        color_discrete_map = {
            'Male Farmers Reached': '#1F3BB3',
            'Female Farmers Reached': '#80D7D9',
            'Male Farmers Adoption': '#A155B9',
            'Female Farmers Adoption': '#FF6BF9',
            'Access Count': '#34AF16'
        }
        
        if grouped_data.empty:
            st.subheader("DA performance")
            st.warning("No data available for the selected filters.")
        else:
            grouped_data = grouped_data.rename(columns=column_mapping)
            st.subheader("DA performance")
            # st.dataframe(grouped_data,width=1000)
            fig = px.bar(grouped_data, x='Kebele', y=['Male Farmers Reached', 'Female Farmers Reached', 'Male Farmers Adoption', 'Female Farmers Adoption', 'Access Count'],
                        barmode='group')
            st.plotly_chart(fig,use_container_width=True)


# tab 3
with tab3:
    concatenated_output=concatenated_output_for_tab3
    
    col1,col2,col3=st.columns(3)

    with col1:
        # selected_kebele = st.multiselect('Select a Kebele', [kebele['kebele_name'] for kebele in kebele_list if kebele['kebele_name'] != 'All'],key="tab3_multiselect",max_selections=5)
        kebele_names = [kebele['kebele_name'] for kebele in kebele_list if kebele['kebele_name'] != 'All']
        default_selection = kebele_names[:5]
        selected_kebele = st.multiselect('Select a Kebele', kebele_names, default=default_selection, key="tab3_multiselect", max_selections=5)
    with col2:
        selected_value_chain = st.selectbox("Select Value Chain", options=[placeholders["Value Chain"]] + [valuechain['value_chain_name'] for valuechain in filters['Value Chain']],key="value_chain_tab3")
    with col3:
        selected_value_chain_category = st.selectbox("Select Category", options=[placeholders["Value Chain Category"]] + [valuechaincat['value_chain_category_name'] for valuechaincat in filters['Value Chain Category']],key="value_chain_cat_list3")


    def filter_data_tab3(df, kebeles, da, practice, value_chain, value_chain_category, start_date):
        df=df.copy()
        if kebeles:
            df = df[df['kebele_name'].isin(kebeles)]
        if da and da != placeholders["DA"]:
            df = df[df['da_name'] == da]
        if practice and practice != placeholders["Practice"]:
            df = df[df['practice_name'] == practice]
        if value_chain and value_chain != placeholders["Value Chain"]:
            df = df[df['value_chain_name'] == value_chain]
        if value_chain_category and value_chain_category != placeholders["Value Chain Category"]:
            df = df[df['value_chain_category_name'] == value_chain_category]
        if start_date:
            start_date_utc = pd.Timestamp(start_date, tz='UTC')
                         # Check if datetime is timezone aware
            if df['created_at'].dt.tz is None:
                df['created_at'] = df['created_at'].dt.tz_localize('UTC')
            else:
                df['created_at'] = df['created_at'].dt.tz_convert('UTC')
            df = df[(df['created_at'] >= start_date_utc) & (df['created_at'] <= today_utc)]
        return df
    concatenated_output = filter_data_tab3(concatenated_output, selected_kebele, selected_da, selected_practice, selected_value_chain, selected_value_chain_category, start_date)

    print("concatenated_output=====",concatenated_output)

    tab31,tab32=st.tabs(["List View","Graph View"])

    with tab31:

        if not concatenated_output.empty:
            value_chain_report_reach_data = concatenated_output.groupby(['kebele_name',  'practice_name']).apply(
                lambda x: pd.Series({
                    'male_reach_count': x[x['gender'].str.lower() == 'male']['reach_id'].nunique(),
                    'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
                })
            ).reset_index()

            # Displaying results
            if not value_chain_report_reach_data.empty:
                st.subheader("Reach")
                value_chain_report_reach_data = value_chain_report_reach_data.rename(columns=column_mapping)
                st.dataframe(value_chain_report_reach_data,width=1000)
            else:
                st.subheader("Reach")
                st.warning("No data available for the selected filters.")
        else:
            st.subheader("Reach")
            st.warning("No data available for the selected filters.")

        if not concatenated_output.empty:
            value_chain_report_adoption_data = concatenated_output.groupby(['kebele_name','practice_name']).apply(
                lambda x: pd.Series({
                    'male_adoption_count': x[x['gender'].str.lower() == 'male']['adoption_id'].nunique(),
                    'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
                })
            ).reset_index()

            if value_chain_report_adoption_data.empty:
                st.subheader("Adoption")
                st.warning("No data available for the selected filters.")
            else:
                # Display the grouped data (for verification)
                st.subheader("Adoption")
                value_chain_report_adoption_data=value_chain_report_adoption_data.rename(columns=column_mapping)
                st.dataframe(value_chain_report_adoption_data,width=1000)
        else:
            st.subheader("Adoption")
            st.warning("No data available for the selected filters.")


##### from here graph ###

    with tab32:

        if not concatenated_output.empty:
            value_chain_report_reach_data = concatenated_output.groupby(['kebele_name', 'region_name', 'zone_name', 'woreda_name', 'practice_name']).apply(
                lambda x: pd.Series({
                    'male_reach_count': x[x['gender'].str.lower() == 'male']['reach_id'].nunique(),
                    'female_reach_count': x[x['gender'].str.lower() == 'female']['reach_id'].nunique()
                })
            ).reset_index()
            if not value_chain_report_reach_data.empty:
                value_chain_report_reach_data=value_chain_report_reach_data.rename(columns=column_mapping)
                df_top5 = value_chain_report_reach_data
                fig = px.bar(
                    df_top5,
                    x='Kebele',
                    y=['Male Farmers Reached', 'Female Farmers Reached'],
                    # title='Reach Counts by Kebele and Gender (Top 5)',
                    # labels={'value': 'Reach Count', 'variable': 'Gender'},
                    barmode='group',
                    # color_discrete_map=color_discrete_map
                )

                # Customize the layout
                fig.update_layout(
                    xaxis_title='Kebele',
                    yaxis_title='Reach Count',
                    legend_title='Gender',
                    legend=dict(
                        x=1.0,
                        y=1.0
                    )
                )

                # Display the chart in Streamlit
                st.subheader("Reach")
                st.plotly_chart(fig,use_container_width=True)

            else:
                st.subheader("Reach")
                st.warning("No data available for the selected filters.")

        else:
            st.subheader("Reach")
            st.warning("No data available for the selected filters.")


        ###################################################
        if not concatenated_output.empty:
            if not value_chain_report_adoption_data.empty:
            #     value_chain_report_adoption_data = concatenated_output.groupby(['kebele_name', 'region_name', 'zone_name', 'woreda_name', 'practice_name']).apply(
            #     lambda x: pd.Series({
            #         'male_adoption_count': x[x['gender'].str.lower() == 'male']['adoption_id'].nunique(),
            #         'female_adoption_count': x[x['gender'].str.lower() == 'female']['adoption_id'].nunique()
            #     })
            # ).reset_index()
                df_top5 = value_chain_report_adoption_data
                fig = px.bar(
                    df_top5,
                    x='Kebele',
                    y=['Male Farmers Adoption', 'Female Farmers Adoption'],
                    # title='Adoption Counts by Kebele and Gender (Top 5)',
                    # labels={'value': 'Reach Count', 'variable': 'Gender'},
                    barmode='group',
                    # color_discrete_map=color_discrete_map
                )

                # Customize the layout
                fig.update_layout(
                    xaxis_title='Kebele',
                    yaxis_title='Adoption Count',
                    legend_title='Gender',
                    legend=dict(
                        x=1.0,
                        y=1.0
                    )
                )

                # Display the chart in Streamlit
                st.subheader("Adoption")
                st.plotly_chart(fig,use_container_width=True)

            else:
                st.subheader("Adoption")
                st.warning("No data available for the selected filters.")

        else:
            st.subheader("Adoption")
            st.warning("No data available for the selected filters.")
