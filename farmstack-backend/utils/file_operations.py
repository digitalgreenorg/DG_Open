import json
import logging
import os
import re
import shutil
import threading
from typing import Any

import cssutils
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets

from core.constants import Constants

from .validators import validate_image_type

LOGGER = logging.getLogger(__name__)
import numpy as np
import pandas as pd
from django.conf import settings
from django.core.cache import cache
from rest_framework.response import Response


def remove_files(file_key: str, destination: str):
    """
    Remove files from the file path or destination directory.

    **Parameters**
    ``file_key`` (str): file name or file name without extension
    ``destination`` (str): directory or file path
    """
    try:
        # destination = rf"{destination}" + "/"
        fs = FileSystemStorage(destination)
        with os.scandir(destination) as file_path:
            for file in file_path:
                # deleting file based on file key, that is passed without extension
                if file.is_file() and file.name.split(".")[:-1][0] == file_key:
                    LOGGER.info(f"Deleting file: {destination + file.name}")
                    fs.delete(destination + file.name)
                # deleting file based on file name
                elif file.is_file() and file.name == file_key:
                    LOGGER.info(f"Deleting file: {destination + file.name}")
                    fs.delete(destination + file.name)
    except Exception as error:
        LOGGER.error(error, exc_info=True)


def get_csv_or_xls_files_from_directory(directory: str):
    """
    Return list of dataset files from temporary location for data standardisation.
    Args:
        directory (str): directory path from which list of dataset files will be returned.
    """

    types = (".csv", ".xls", ".xlsx")
    extracted_files = []
    try:
        for root, _, files in os.walk(top=directory):
            for file in files:
                if os.path.splitext(file)[1] in types:
                    extracted_files.append(root + "/" + file)

        return extracted_files
    except Exception as err:
        LOGGER.error(f"Error while extracting files from given temporary location {directory}", err)


def move_directory(source: str, destination: str):
    """
    Move files from location to another on the file system.

    **Parameters**
    ``source`` (str): source directory to be moved
    ``destination`` (str): directory or file path where the source needs to be moved
    """
    try:
        if not os.path.exists(source):
            LOGGER.error(f"{source} not found")
            raise FileNotFoundError(f"{source} not found")
        else:
            # shutil.copyfileobj(source+file.name, destination)
            destination = shutil.move(os.path.join(source), os.path.join(destination))
            LOGGER.info(f"Directory moved: directory {source} moved to {destination}")
            return destination
    except Exception as error:
        LOGGER.error(error, exc_info=True)


def create_directory(directory: str, names: list):
    """
    Create a directory or directories at the destination or skip if exists.

    **Parameters**
    ``directory`` (str): directory name
    ``name`` (list): list of nested directory names to create inside directory
    """
    try:
        print(os.path.join(directory, names[0]))
        if names:
            formatted_names = [re.sub(r'\s+', ' ', name) for name in names]
            directory = os.path.join(directory, *formatted_names, "", "")

        if not os.path.exists(directory):
            os.makedirs(directory)
            LOGGER.info(f"Creating directory: {directory}")
        print("DIRE", directory)
        return directory
    except Exception as error:
        LOGGER.error(error, exc_info=True)


def file_save(source_file, file_name: str, directory: str):
    """
    Save or replace files at the preferred destination or file path.

    **Parameters**
    ``source_file`` (file obj): file obj to be saved
    ``file_name`` (str): file name to be saved
    ``destination`` (str): directory or file path where to save the file
    """
    try:
        with open(directory + file_name, "wb+") as dest_file:
            for chunk in source_file.chunks():
                dest_file.write(chunk)

        LOGGER.info(f"File saved: {directory + file_name}")
    except Exception as error:
        LOGGER.error(error, exc_info=True)
    return file_name


def file_path(destination: str):
    """
    Return file paths and its file names without file extensions.

    **Parameters**
    ``destination`` (str): directory or file path

    **Returns**
    ``file_paths`` (dict): dictionary containing file names & file paths

        ``Example``
        {'key': 'path/to/file.ext'}
    """
    try:
        file_paths = {
            os.path.splitext(os.path.basename(file))[0]: destination + file.name
            for file in os.scandir(destination)
        }
        LOGGER.info(f"file paths: {file_paths}")
        return file_paths
    except Exception as error:
        LOGGER.error(error, exc_info=True)


def files_move(source: str, destination: str):
    """
    Move files from location to another on the file system.

    **Parameters**
    ``source`` (str): source directory or file path from where the file needs to be moved
    ``destination`` (str): directory or file path where to where the file needs to be saved
    """
    try:
        with os.scandir(source) as file_path:
            for file in file_path:
                if file.is_file():
                    # shutil.copyfileobj(source+file.name, destination)
                    shutil.move(os.path.join(source, file.name), os.path.join(destination, file.name))
                    LOGGER.info(f"File moved: {source + file.name}")

    except Exception as error:
        LOGGER.error(error, exc_info=True)


def file_rename(file: str, key: str):
    """
    Returns the desired file name for a file.

    **Parameters**
    ``file_name`` (str): file_name to be converted
    ``key`` (str): key for the file name

    **Returns**
    ``file_name`` (str): desired file name
    """
    try:
        validate_image_type(file)
        file_split = str(file).split(".")

        if not key:
            timestamp = str(timezone.now().timestamp())
            file_to_save = file_split[:-1][0] + "-" + timestamp + "." + file_split[-1]
        elif key:
            file_to_save = key + "." + file_split[-1]
        return file_to_save

    except Exception as error:
        LOGGER.error(error, exc_info=True)


def get_css_attributes(css_path: str, css_attribute: str):
    """
    Returns CSS attribute value of the HTML element.

    **Parameters**
    ``css_path`` (str): CSS file path
    ``css_attribute`` (str): CSS property or attribute

    **Returns**
    ``css_attribute_value`` (str): value of CSS attribute or property
    """
    try:
        with open(css_path) as css:
            sheet = cssutils.css.CSSStyleSheet()
            sheet.cssText = css.read()
            css_attribute_value = sheet.cssRules[0].style[css_attribute]
        return css_attribute_value
    except Exception as error:
        LOGGER.error(error, exc_info=True)


def check_file_name_length(incoming_file_name: str, accepted_file_name_size: int):
    valid = True

    if len(str(incoming_file_name)) > accepted_file_name_size:
        valid = False
    return valid


def filter_dataframe_for_dashboard_counties(df: Any, counties: [], sub_counties: [], gender: [], value_chain: [], hash_key: str, filters=False):
    obj = {}
    gender_changes = {'1': 'MALE', '2': 'FEMALE', '1.0': 'MALE', '2.0': 'FEMALE'}
    df['Gender'] = df['Gender'].astype(str).map(gender_changes)
    df['Highest Level of Formal Education'] = df['Highest Level of Formal Education'].map(
        {1: 'None', 2: 'Primary', 3: 'Secondary', 4: 'Certificate', 5: 'Diploma', 6: 'University Degree',
         7: "Post Graduate Degree,Masters and Above"})
    filtered_by_counties = df  # Start with the original DataFrame
    filtered_by_counties_across_county = df  # Start with the original DataFrame
    if len(counties) > 0:
        filtered_by_counties = filtered_by_counties[filtered_by_counties['County'].isin(counties)]

    if len(sub_counties) > 0:
        filtered_by_counties = filtered_by_counties[filtered_by_counties['Sub County'].isin(sub_counties)]

    if len(gender) > 0:
        filtered_by_counties = filtered_by_counties[filtered_by_counties['Gender'].isin(gender)]
        filtered_by_counties_across_county = filtered_by_counties_across_county[
            filtered_by_counties_across_county['Gender'].isin(gender)]

    if len(value_chain) > 0:
        filtered_by_counties = filtered_by_counties[filtered_by_counties[value_chain].notna().any(axis=1)]
        filtered_by_counties_across_county = filtered_by_counties_across_county[filtered_by_counties_across_county[value_chain].notna().any(axis=1)]

    obj["male_count"] = filtered_by_counties['Gender'].value_counts().get('MALE', 0)
    obj["female_count"] = filtered_by_counties['Gender'].value_counts().get('FEMALE', 0)
    obj["farmer_mobile_numbers"] = np.unique(filtered_by_counties['farmer_mobile_number']).size
    obj["gender_by_sub_county"] = filtered_by_counties_across_county.groupby(['Sub County', 'Gender'])[
        'Gender'].count().unstack().to_dict(orient='index')
    farming_practices = {
        "crop_production": filtered_by_counties[filtered_by_counties['Crop Production'] == 1][
            "Gender"].value_counts().to_dict(),
        "livestock_production": filtered_by_counties[filtered_by_counties['Livestock Production'] == 1][
            "Gender"].value_counts().to_dict(),
    }

    financial_livelihood = {
        "relatives": filtered_by_counties[filtered_by_counties['Family'] > 0]["Gender"].value_counts().to_dict(),
        "Other Money Lenders": filtered_by_counties[filtered_by_counties['Other Money Lenders'] > 0][
            "Gender"].value_counts().to_dict(),
        "Micro-finance institution": filtered_by_counties[filtered_by_counties['Micro-finance institution'] > 0][
            "Gender"].value_counts().to_dict(),
        "Self (Salary or Savings)": filtered_by_counties[filtered_by_counties['Self (Salary or Savings)'] > 0][
            "Gender"].value_counts().to_dict(),
    }

    water_sources = {
        "irrigation": filtered_by_counties[filtered_by_counties['Total Area Irrigation'] > 0][
            "Gender"].value_counts().to_dict(),
        "rivers": filtered_by_counties[filtered_by_counties['Natural rivers and stream'] > 0][
            "Gender"].value_counts().to_dict(),
        "water_pan": filtered_by_counties[filtered_by_counties['Water Pan'] > 0]["Gender"].value_counts().to_dict(),
    }

    insurance_information = {
        "insured_crops": filtered_by_counties[filtered_by_counties['Do you insure your crops?'] > 0][
            "Gender"].value_counts().to_dict(),
        "insured_machinery":
            filtered_by_counties[filtered_by_counties['Do you insure your farm buildings and other assets?'] > 0][
                "Gender"].value_counts().to_dict(),
    }

    popular_fertilizer_used = {
        "npk": filtered_by_counties[filtered_by_counties['NPK'] > 0]["Gender"].value_counts().to_dict(),
        "ssp": filtered_by_counties[filtered_by_counties['Superphosphate'] > 0]["Gender"].value_counts().to_dict(),
        "can": filtered_by_counties[filtered_by_counties['CAN'] > 0]["Gender"].value_counts().to_dict(),
        "urea": filtered_by_counties[filtered_by_counties['Urea'] > 0]["Gender"].value_counts().to_dict(),
        "Others": filtered_by_counties[filtered_by_counties['Other'] > 0]["Gender"].value_counts().to_dict(),
    }

    filtered_by_counties['Sum_Columns_Cattle'] = filtered_by_counties[
        ['Other Dual Cattle', 'Cross breed Cattle', 'Cattle boma']].sum(axis=1)
    filtered_by_counties['Sum_Columns_Goats'] = filtered_by_counties[
        ['Small East African Goats', 'Somali Goat', 'Other Goat']].sum(axis=1)
    filtered_by_counties['Sum_Columns_Chickens'] = filtered_by_counties[
        ['Chicken -Indigenous', 'Chicken -Broilers', 'Chicken -Layers']].sum(axis=1)
    filtered_by_counties['Sum_Columns_Ducks'] = filtered_by_counties[['Ducks']].sum(axis=1)
    filtered_by_counties['Sum_Columns_Sheep'] = filtered_by_counties[['Other Sheep']].sum(axis=1)

    gender_grouped_cattle = filtered_by_counties.groupby('Gender')['Sum_Columns_Cattle'].sum()
    gender_grouped_goats = filtered_by_counties.groupby('Gender')['Sum_Columns_Goats'].sum()
    gender_grouped_chicken = filtered_by_counties.groupby('Gender')['Sum_Columns_Chickens'].sum()
    gender_grouped_ducks = filtered_by_counties.groupby('Gender')['Sum_Columns_Ducks'].sum()
    gender_grouped_sheep = filtered_by_counties.groupby('Gender')['Sum_Columns_Sheep'].sum()

    livestock_and_poultry_production = {
        "cows": gender_grouped_cattle.astype(int).to_dict(),
        "goats": gender_grouped_goats.astype(int).to_dict(),
        "chickens":gender_grouped_chicken.astype(int).to_dict(),
        "ducks": gender_grouped_ducks.astype(int).to_dict(),
        "sheep": gender_grouped_sheep.astype(int).to_dict()
    }

    obj["farming_practices"] = farming_practices
    obj["livestock_and_poultry_production"] = livestock_and_poultry_production
    obj["financial_livelihood"] = financial_livelihood
    obj["water_sources"] = water_sources
    obj["insurance_information"] = insurance_information
    obj["popular_fertilizer_used"] = popular_fertilizer_used
    obj["education_level"] = filtered_by_counties.groupby(['Highest Level of Formal Education', 'Gender'])[
        'Gender'].count().unstack().fillna(0).astype(int).to_dict(orient='index')

    obj["total_number_of_records"] = len(filtered_by_counties)
    obj["counties"] = np.unique(filtered_by_counties["County"]).size
    obj["constituencies"] = filtered_by_counties["Constituency"].nunique()
    obj["sub_counties"] = np.unique(filtered_by_counties['Sub County']).size
    if filters:
        convert_columns = ['County', 'Sub County', "Gender"]
        df[convert_columns] = df[convert_columns].astype(str)
        obj["filters"]= {
                "county": df['County'].unique().tolist(),
                "sub_county": df['Sub County'].unique().tolist(),
                # "constituencies": df['Constituency'].unique().tolist(),
                "gender": df['Gender'].unique().tolist()
                }
    else:
        obj["filters"]={}
    obj["type"] = "kiamis"
    cache.set(hash_key, obj, 172800)
    LOGGER.info("Dashboard details added to cache", exc_info=True)
    return obj

def generate_omfp_dashboard(dataset_file, data, hash_key, filters=False):
    if dataset_file.endswith(".xlsx") or dataset_file.endswith(".xls"):
        df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, dataset_file))
    elif dataset_file.endswith(".csv"):
        df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, dataset_file),low_memory=False)
    else:
        return Response(
            "Unsupported file please use .xls or .csv.",
            status=status.HTTP_400_BAD_REQUEST,
        )
    dashboard_details={}
    convert_columns = ['County', 'Sub County', 'Telephone', "Gender", "Primary Value Chain"]
    df[convert_columns] = df[convert_columns].applymap(str) # type: ignore
    df["Gender"] = df["Gender"].str.upper().str.strip()
    df["Sub County"] = df["Sub County"].str.upper().str.strip()
    df["County"] = df["County"].str.upper().str.strip()
    columns_to_find_unique = ["Cohort", "County", 'Sub County', 'Gender']
    unique_values_size = find_unique_values_concurrently(df, columns_to_find_unique)
    try:
        filters = {
                    "cohort": unique_values_size.get("Cohort", {}),
                    "county": unique_values_size.get("County", {}),
                    "sub_county": unique_values_size.get("Sub County", {}),
                    "gender": unique_values_size.get("Gender", {})} if filters else {}
        county_filters = data.get("county", [])
        sub_county_filters = data.get("sub_county", [])
        gender_filters = data.get("gender", [])
        cohort_filters = data.get("cohort", [])

        # default_mask = pd.Series(True, index=df.index)
        if cohort_filters:
            df = df[df['Cohort'].isin(cohort_filters)] 
        if county_filters:
            df = df[df['County'].isin(county_filters)]
        if sub_county_filters:
            df = df[df['Sub County'].isin(sub_county_filters)]
        if gender_filters:
            df = df[df['Gender'].isin(gender_filters)]

        # county_mask = df['County'].isin(county_filters) if county_filters else default_mask
        # sub_county_mask = df['Sub County'].isin(sub_county_filters) if sub_county_filters else default_mask
        # gender_mask = df['Gender'].isin(gender_filters) if gender_filters else default_mask
        # cohort_mask = df['Cohort'].isin(cohort_filters) if cohort_filters else default_mask

        # # Apply filters
        # filtered_df = df[cohort_mask & county_mask & sub_county_mask & gender_mask & cohort_mask]
        columns_to_find_size = ["County", "Sub County", "Telephone"]

        # Create a copy of filtered_df to avoid modifying the original DataFrame
        # filtered_df_copy = filtered_df.copy()

        # Find the number of unique values for the specified columns concurrently
        unique_values_size = find_size_concurrently(df, columns_to_find_size)
        dashboard_details = {
            "total_number_of_records": len(df),
            "counties": unique_values_size.get("County", {}),
            "sub_counties":unique_values_size.get("Sub County", {}),
            "filters":filters,
            "male_count": df['Gender'].value_counts().get('MALE', 0),
            "female_count": df['Gender'].value_counts().get('FEMALE', 0),
            "farmer_mobile_numbers": unique_values_size.get("Telephone", {}),
        }
        dashboard_details["gender_by_sub_county"] =df.groupby(['Sub County', 'Gender'])['Gender'].count().unstack().fillna(0).astype(int).to_dict(orient='index')

        dashboard_details["primary_value_chain_by_sub_county"] = process_column(df, 'Primary Value Chain', 'Sub County')
        dashboard_details["type"] = "omfp"
    except Exception as e:
        LOGGER.error(e, exc_info=True)
        return Response(
            f"Something went wrong, please try again. {e}",
            status=status.HTTP_400_BAD_REQUEST,
        )
    cache.set(hash_key, dashboard_details, 172800)
    LOGGER.info("Dashboard details added to cache", exc_info=True) 
    return Response(
            dashboard_details,
            status=200
        )

def generate_fsp_dashboard(dataset_file, data, hash_key, filters=False):
    if dataset_file.endswith(".xlsx") or dataset_file.endswith(".xls"):
        df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, dataset_file))
    elif dataset_file.endswith(".csv"):
        df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, dataset_file), low_memory=False)
    else:
        return Response(
            "Unsupported file please use .xls or .csv.",
            status=status.HTTP_400_BAD_REQUEST,
        )
    gender_changes = {'1': 'MALE', '2': 'FEMALE', '1.0': 'MALE', '2.0': 'FEMALE'}
    df['Farmer_Sex'] = df['Farmer_Sex'].astype(str).map(gender_changes).fillna('') # type: ignore
    convert_columns = ['County', 'Subcounty', 'Farmer_TelephoneNumebr', "vc", "vc_two", "vc_three"]
    df[convert_columns] = df[convert_columns].applymap(str) # type: ignore
    df["Subcounty"] = df["Subcounty"].str.upper().str.strip()
    df["County"] = df["County"].str.upper().str.strip()
    columns_to_find_unique = ["County", 'Subcounty', 'Farmer_Sex']
    unique_values_size = find_unique_values_concurrently(df, columns_to_find_unique)
    try:
        filters = {
            "county": unique_values_size.get("County", {}),
            "sub_county": unique_values_size.get("Subcounty", {}),
            "gender": unique_values_size.get("Farmer_Sex", {})} if filters else {}
        
        county_filters = data.get("county", [])
        sub_county_filters = data.get("sub_county", [])
        gender_filters = data.get("gender", [])

        if county_filters:
            df = df[df['County'].isin(county_filters)]
        if sub_county_filters:
            df = df[df['Subcounty'].isin(sub_county_filters)]
        if gender_filters:
            df = df[df['Farmer_Sex'].isin(gender_filters)]

        # default_mask = pd.Series(True, index=df.index)
        # county_mask = df['County'].isin(county_filters) if county_filters else default_mask
        # sub_county_mask = df['Subcounty'].isin(sub_county_filters) if sub_county_filters else default_mask
        # gender_mask = df['Farmer_Sex'].isin(gender_filters) if gender_filters else default_mask

        # # Apply filters
        # filtered_df = df[county_mask & sub_county_mask & gender_mask]
        columns_to_find_size = ["County", "Subcounty", "Farmer_TelephoneNumebr"]

        # Create a copy of filtered_df to avoid modifying the original DataFrame
        # filtered_df_copy = filtered_df.copy()

        # Find the number of unique values for the specified columns concurrently
        unique_values_size = find_size_concurrently(df, columns_to_find_size)
        dashboard_details = {
            "total_number_of_records": len(df),
            "counties":unique_values_size.get("County", {}),
            "sub_counties":unique_values_size.get("Subcounty", {}),
            "filters":filters,
            "male_count": df['Farmer_Sex'].value_counts().get('MALE', 0),
            "female_count": df['Farmer_Sex'].value_counts().get('FEMALE', 0),
            "farmer_mobile_numbers": unique_values_size.get("Farmer_TelephoneNumebr", {}),
        }
        dashboard_details["gender_by_sub_county"] =df.groupby(['Subcounty', 'Farmer_Sex'])['Farmer_Sex'].count().unstack().fillna(0).astype(int).to_dict(orient='index')
        
        columns_to_process = ["vc", "vc_two", "vc_three"]
        group_by_column = "Subcounty"

        # Create a copy of filtered_df to avoid modifying the original DataFrame
        # filtered_df_copy = filtered_df.copy()

        # Process the columns concurrently
        result_details = process_columns_concurrently(df, columns_to_process, group_by_column)

        # Update dashboard_details with the results
        dashboard_details["primary_value_chain_by_sub_county"] = result_details.get("vc", {})
        dashboard_details["second_value_chain_by_sub_county"] = result_details.get("vc_two", {})
        dashboard_details["third_value_chain_by_sub_county"] = result_details.get("vc_three", {})
        dashboard_details["type"] = "fsp"
    except Exception as e:
        LOGGER.error(e, exc_info=True)
        return Response(
            f"Something went wrong, please try again. {e}",
            status=status.HTTP_400_BAD_REQUEST,
        )
    cache.set(hash_key, dashboard_details, 172800)
    LOGGER.info("Dashboard details added to cache", exc_info=True) 
    return Response(
            dashboard_details,
            status=200
        )

def generate_knfd_dashboard(dataset_file, data, hash_key, filters=False):
    if dataset_file.endswith(".xlsx") or dataset_file.endswith(".xls"):
        df = pd.read_excel(os.path.join(settings.DATASET_FILES_URL, dataset_file))
    elif dataset_file.endswith(".csv"):
        df = pd.read_csv(os.path.join(settings.DATASET_FILES_URL, dataset_file),low_memory=False)
    else:
        return Response(
            "Unsupported file please use .xls or .csv.",
            status=status.HTTP_400_BAD_REQUEST,
        )
    convert_columns = ['County', 'Sub-County', 'Telephone', "Gender", "PrimaryValueChain"]
    df[convert_columns] = df[convert_columns].applymap(str) # type: ignore
    df["Gender"] = df["Gender"].str.upper().str.strip()
    dashboard_details={}
    columns_to_find_unique = ["County", 'Sub-County', 'Gender']
    unique_values_size = find_unique_values_concurrently(df, columns_to_find_unique)
    try:
        filters = {
            "county": unique_values_size.get("County", {}),
            "sub_county": unique_values_size.get("Sub-County", {}),
            "gender": unique_values_size.get("Gender", {})} if filters else {}
        county_filters = data.get("county", [])
        sub_county_filters = data.get("sub_county", [])
        gender_filters = data.get("gender", [])

        if county_filters:
            df = df[df['County'].isin(county_filters)]
        if sub_county_filters:
            df = df[df['Sub-County'].isin(sub_county_filters)]
        if gender_filters:
            df = df[df['Gender'].isin(gender_filters)]

        # default_mask = pd.Series(True, index=df.index)

        # county_mask = df['County'].isin(county_filters) if county_filters else default_mask
        # sub_county_mask = df['Sub-County'].isin(sub_county_filters) if sub_county_filters else default_mask
        # gender_mask = df['Gender'].isin(gender_filters) if gender_filters else default_mask

        # # Apply filters
        # filtered_df = df[county_mask & sub_county_mask & gender_mask]
        
        columns_to_find_size = ["County", "Sub-County", "Telephone"]

        # Create a copy of filtered_df to avoid modifying the original DataFrame
        # filtered_df_copy = filtered_df.copy()

        # Find the number of unique values for the specified columns concurrently
        unique_values_size = find_size_concurrently(df, columns_to_find_size)

        dashboard_details = {
            "total_number_of_records": len(df),
            "counties": unique_values_size.get("County", 0),
            "sub_counties": unique_values_size.get("Sub-County", 0),
            "filters": filters,
            "male_count": df['Gender'].value_counts().get('MALE', 0),
            "female_count": df['Gender'].value_counts().get('FEMALE', 0),
            "farmer_mobile_numbers": unique_values_size.get("Telephone", 0),
        }
        dashboard_details["gender_by_sub_county"] =df.groupby(['Sub-County', 'Gender'])['Gender'].count().unstack().fillna(0).astype(int).to_dict(orient='index')
        dashboard_details["primary_value_chain_by_sub_county"] = process_column(df, "PrimaryValueChain", 'Sub-County')
        dashboard_details["type"] = "knfd"
    except Exception as e:
        LOGGER.error(e, exc_info=True)
        return Response(
            f"Something went wrong, please try again. {e}",
            status=status.HTTP_400_BAD_REQUEST,
        )
    cache.set(hash_key, dashboard_details, 172800)
    LOGGER.info("Dashboard details added to cache", exc_info=True) 
    return Response(
            dashboard_details,
            status=200
        )

# Function to process a column and create the nested dictionary
def process_column(df, column_name, sub_county):
    # Replace NaN values in the specified column with 'NaN'
    df[column_name].replace(['nan', 'N/A', 'NA', 'NAN', np.nan], 'NaN', inplace=True)

    # Group by 'Sub County' and the specified column, count occurrences, and create a nested dictionary
    result_dict = (
        df[df[column_name] != 'NaN']
        .groupby([sub_county, column_name])[column_name]
        .count()
        .unstack(fill_value=0)
        .astype(int)
        .apply(lambda x: {k: v for k, v in x.items() if v > 0}, axis=1)
        .to_dict()
    )

    return result_dict

def process_column_threaded(df, column_name, sub_county, result_dict):
    df[column_name].replace(['nan', 'N/A', 'NA', 'NAN', np.nan], 'NaN', inplace=True)
    try:
        # Group by 'Sub County' and the specified column, count occurrences, and create a nested dictionary
        result = (
            df[df[column_name] != 'NaN']
            .groupby([sub_county, column_name])[column_name]
            .count()
            .unstack(fill_value=0)
            .astype(int)
            .apply(lambda x: {k: v for k, v in x.items() if v > 0}, axis=1)
            .to_dict()
        )
        LOGGER.info(f"Value chain manipulation completed {column_name}")
        result_dict[column_name] = result
    except Exception as e:
        LOGGER.error(f"Error {e} during value chain, column:{column_name}")
        result_dict[column_name] = ""

    # return result_dict    

def process_columns_concurrently(df, column_names, group_by_column):
    threads = []
    result_dict = {}
    
    for column_name in column_names:
        thread = threading.Thread(target=process_column_threaded, args=(df, column_name, group_by_column, result_dict))
        threads.append(thread)
        thread.start()
    
    # Wait for all threads to finish
    for thread in threads:
        thread.join()
    
    return result_dict

def find_size_threaded(df, column_name, result_dict):
    try:
        unique_values_count = np.unique(df[column_name]).size
        result_dict[column_name] = unique_values_count
    except Exception as e:
        LOGGER.error(f"Error {e} during find size, column:{column_name}")
        result_dict[column_name] = 0

def find_size_concurrently(df, column_names):
    threads = []
    result_dict = {}
    
    for column_name in column_names:
        thread = threading.Thread(target=find_size_threaded, args=(df, column_name, result_dict))
        threads.append(thread)
        thread.start()
    
    # Wait for all threads to finish
    for thread in threads:
        thread.join()
    
    return result_dict

def find_unique_threaded(df, column_name, result_dict):
    try:
        unique_values_count = np.unique(df[column_name])
        result_dict[column_name] = unique_values_count
    except Exception as e:
        LOGGER.error(f"Error {e} during find unique, column:{column_name}")
        result_dict[column_name] = []

def find_unique_values_concurrently(df, column_names):
    threads = []
    result_dict = {}
    
    for column_name in column_names:
        thread = threading.Thread(target=find_unique_threaded, args=(df, column_name, result_dict))
        threads.append(thread)
        thread.start()
    
    # Wait for all threads to finish
    for thread in threads:
        thread.join()
    
    return result_dict