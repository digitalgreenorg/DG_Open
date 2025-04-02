
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


queries = {
    "query1": """
    SELECT DISTINCT 
        da.details->'data'->>'da' AS da_id,
        da.details->'data'->'advisory_body'->'location'->>'id' AS location_id,
        da.details->'data'->'advisory_body'->'location'->>'name' AS location_level,
        da.created_at AS created_at,
        dev.id AS dev_id,
        dev.name AS da_name,
        dev.father_name AS da_father_name,
        dev.grand_father_name AS da_grand_father_name,
        dev.gender AS da_gender,
        dev.phone_number AS da_phone_number,
        keb.id AS kebele_id,
        keb.name AS kebele_name,
        wor.name AS woreda_name,
        wor.id AS woreda_id,
        zon.name AS zone_name,
        zon.id AS zone_id,
        reg.name AS region_name,
        reg.id AS region_id

    FROM 
        core_telegraminteractionlog AS da
    JOIN 
        integration_developmentagent AS dev
    ON 
        da.details->'data'->>'da' = dev.id::text
    LEFT JOIN 
        integration_kebele AS keb
    ON 
        dev.kebele_id = keb.id
    LEFT JOIN 
        integration_woreda AS wor
    ON 
        keb.woreda_id = wor.id
    LEFT JOIN 
        integration_zone AS zon
    ON 
        wor.zone_id = zon.id
    LEFT JOIN 
        integration_region AS reg
    ON 
        zon.region_id = reg.id

    WHERE 
        da.action = 'ADVISORY_ACCESS_DA';
     """,

    "query2": """
SELECT DISTINCT 
        da.details->'data'->>'da' AS da_id,
        da.details->'data'->'advisory_body'->'location'->>'id' AS location_id,
        da.details->'data'->'advisory_body'->'location'->>'name' AS location_level,
        da.created_at AS created_at,
        dev.id AS dev_id,
        dev.first_name AS da_name,
        dev.father_name AS da_father_name,
        dev.grand_father_name AS da_grand_father_name,
        dev.sex AS da_gender,
        dev.phone_number AS da_phone_number,
        keb.id AS kebele_id,
        keb.name AS kebele_name,
        wor.name AS woreda_name,
        wor.id AS woreda_id,
        zon.name AS zone_name,
        zon.id AS zone_id,
        reg.name AS region_name,
        reg.id AS region_id

    FROM 
        core_telegraminteractionlog AS da
    JOIN 
        core_outbounddaprofile AS dev
    ON 
        da.details->'data'->>'da' = dev.id::text
    LEFT JOIN 
        integration_kebele AS keb
    ON 
        dev.kebele_id = keb.id
    LEFT JOIN 
        integration_woreda AS wor
    ON 
        keb.woreda_id = wor.id
    LEFT JOIN 
        integration_zone AS zon
    ON 
        wor.zone_id = zon.id
    LEFT JOIN 
        integration_region AS reg
    ON 
        zon.region_id = reg.id

    WHERE 
        da.action = 'ADVISORY_ACCESS_DA'

    """
}

# @st.cache_data(ttl=int(streamlit_cache_ttl))
def cached_data(query):
    return fetch_data(query)

st.header("Engagements")
# user_role = st.selectbox("User Role", ["National User", "Regional User", "Zone User", "Woreda User"])
user_role="Woreda User"
query_one_output = cached_data(queries["query1"])
query_two_output = cached_data(queries["query2"])

concatenated_output = pd.concat([query_one_output, query_two_output], ignore_index=True)
concatenated_output['DA Full Name'] = (concatenated_output['da_name'] + ' ' + 
                                       concatenated_output['da_father_name'] + ' ' + 
                                       concatenated_output['da_grand_father_name'])
# st.write(concatenated_output)
# concatenated_output.index = range(1, len(concatenated_output) + 1)
concatenated_output=concatenated_output.drop_duplicates(subset="da_id")

column_mapping = {
    'DA Full Name': 'DA Name',
    'da_gender': 'Gender',
    'kebele_name': 'Kebele',
    'woreda_name':'Woreda',
    'zone_name': 'Zone',
    'region_name':'Region',
    'da_phone_number':'Phone Number'

}

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
today_utc = pd.Timestamp(datetime.date.today(), tz='UTC')


concatenated_output = concatenated_output.rename(columns=column_mapping)
print(concatenated_output.columns)

if user_role=='National User':
    col1, col2 = st.columns([1, 1])
    with col1:
        start_date = select_period(1)
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    with col2:
        
        selected_region = st.selectbox("Select Region", ["All"] + sorted(concatenated_output["Region"].dropna().unique().tolist()))
    columns_to_show = ["DA Name", "Gender", "Phone Number",'Region','Zone','Woreda','Kebele']
elif user_role=='Regional User':
    col3, col4= st.columns([1, 1])
    with col3:
        start_date = select_period(1)
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    with col4:
        selected_zone = st.selectbox("Select Zone", ["All"] + sorted(concatenated_output["Zone"].dropna().unique().tolist()))
    columns_to_show = ["DA Name", "Gender", "Phone Number",'Zone','Woreda','Kebele']

elif user_role=='Zone User':
    col5,col6=st.columns([1,1])
    with col5:
        start_date = select_period(1)
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    with col6:
        selected_woreda = st.selectbox("Select Woreda", ["All"] + sorted(concatenated_output["Woreda"].dropna().unique().tolist()))
    columns_to_show = ["DA Name", "Gender", "Phone Number",'Woreda','Kebele']
elif user_role=='Woreda User':
    col7,col8=st.columns([1,1])
    with col7:
        start_date = select_period(1)
    start_date_utc = pd.Timestamp(start_date, tz='UTC')
    with col8:
        selected_kebele = st.selectbox("Select Kebele", ["All"] + sorted(concatenated_output["Kebele"].dropna().unique().tolist()))
    columns_to_show = ["DA Name", "Gender", "Phone Number",'Kebele']

filtered_df = concatenated_output
filtered_df = filtered_df[(filtered_df['created_at'] >= start_date_utc) & (filtered_df['created_at'] <= today_utc)]
if user_role=='National User':
    if selected_region != "All":
        filtered_df = filtered_df[filtered_df["Region"] == selected_region]
if user_role=='Regional User':
    if selected_zone != "All":
        filtered_df = filtered_df[filtered_df["Zone"] == selected_zone]
if user_role=='Zone User':
    if selected_woreda != "All":
        filtered_df = filtered_df[filtered_df["Woreda"] == selected_woreda]
if user_role=='Woreda User':
    if selected_kebele != "All":
        filtered_df = filtered_df[filtered_df["Kebele"] == selected_kebele]

filtered_df = filtered_df.reset_index(drop=True)
filtered_df.index = range(1, len(filtered_df) + 1)
filtered_df['Gender'] = filtered_df['Gender'].str.lower()
gender_counts = filtered_df['Gender'].value_counts()
st.subheader("Development Agents")
with open("style.css", "r") as f:
    css = f.read()

st.markdown(f'<style>{css}</style>', unsafe_allow_html=True)
col1, col2,col3,col4 = st.columns([1, 1,1,1])
with col1:
    st.markdown(f"<div class='m_card'><div class='title'>Male DAs:</div><div class='sub-title'><span class='bullet_green'>&#8226;</span>{gender_counts.get('male', 0)}</div></div>", unsafe_allow_html=True)
with col2:
    st.markdown(f"<div class='f_card'><div class='title'>Female DAs:</div><div class='sub-title'><span class='bullet_green'>&#8226;</span>{gender_counts.get('female', 0)}</div></div>", unsafe_allow_html=True)

st.write("<br>", unsafe_allow_html=True)
# st.dataframe(filtered_df[columns_to_show], width=1000)
# st.write("<br>", unsafe_allow_html=True)


@st.cache_data
def split_frame(df, batch_size):
    return [df[i:i + batch_size] for i in range(0, len(df), batch_size)]

@st.cache_data
def load_data(data):
    return pd.DataFrame(data)

def make_pretty_table_order_details(dataframe, columns=None):
    if dataframe.empty:
        cols = dataframe.columns
        col_count = len(cols)
        html_table = f"""
            <table border="1" style="width:100%">
                <tr>
                    {''.join([f'<th>{col}</th>' for col in cols])}
                </tr>
                <tr>
                    <td colspan="{col_count}" style="text-align:center">No data available</td>
                </tr>
            </table>
            """
        st.markdown(html_table, unsafe_allow_html=True)
    else:
        st.markdown("""
            <style>
            .container {
                display: flex;
                align-items: center;
            }
            .container > div {
                flex: 1;
            }
            </style>
            """, unsafe_allow_html=True)

        dataset = dataframe.reset_index(drop=True)
        dataset.index = dataset.index + 1

        pagination = st.container()

        bottom_menu = st.columns((2, 1, 1))
        with bottom_menu[2]:
            batch_size = st.selectbox("Page Size", options=[10, 20, 50, 100], key='selectbox1_a')

        total_pages = math.ceil(len(dataset) / batch_size) if len(dataset) > 0 else 1
        if 'current_page_a' not in st.session_state:
            st.session_state.current_page_a = 1

        current_page_a = st.session_state.current_page_a

        col1, col2 = bottom_menu[1].columns(2)
        with col1:
            st.text(" ")
            st.text(" ")
            if current_page_a > 1:
                if st.button("◀️ Prev", key="1_a"):
                    st.session_state.current_page_a -= 1
                    st.experimental_rerun()

        with col2:
            st.text(" ")
            st.text(" ")
            if current_page_a < total_pages:
                if st.button("Next ▶️", key="1_b"):
                    st.session_state.current_page_a += 1
                    st.experimental_rerun()

        with bottom_menu[0]:
            st.markdown(f"Page **{current_page_a}** of **{total_pages}** ")

        pages = split_frame(dataset, batch_size)
        pagination.dataframe(data=pages[current_page_a - 1], use_container_width=True)
filtered_df = load_data(filtered_df[columns_to_show])

filtered_df=filtered_df[columns_to_show]
csv = filtered_df.to_csv(index=False).encode('utf-8')

current_date =datetime.date.today()
table_title = "Development Agents"
file_name = f"{current_date}_{table_title}.csv"
st.download_button(
    label="Download CSV",
    data=csv,
    file_name=file_name,
    mime='text/csv'
)

df=make_pretty_table_order_details(filtered_df[columns_to_show])
st.write("<br>", unsafe_allow_html=True)