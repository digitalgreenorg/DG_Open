
# import requests
# from datetime import datetime, timedelta
# import logging
# from django.db import models
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import serializers
# from django.utils import timezone
# from rest_framework.authentication import BaseAuthentication
# from rest_framework.exceptions import AuthenticationFailed
# from django.core.management.base import BaseCommand
# from django_apscheduler.jobstores import register_events, register_job
# from apscheduler.schedulers.background import BackgroundScheduler
# from django_apscheduler.jobstores import DjangoJobStore
# from django.core.signals import request_finished
# from django.dispatch import receiver
# from apscheduler.triggers.interval import IntervalTrigger
# from apscheduler.triggers.cron import CronTrigger
# LOGGER = logging.getLogger(__name__)


# class Inspection(models.Model):
#     """
#     model for agnext api response
#     """
#     unique_id = models.UUIDField(null=True, blank=True)
#     inspection_date_time = models.DateTimeField(null=True, blank=True)
#     farmer_name = models.CharField(max_length=100, null=True, blank=True)
#     village = models.CharField(max_length=100, null=True, blank=True)
#     block = models.CharField(max_length=100, null=True, blank=True)
#     location_name = models.CharField(max_length=100, null=True, blank=True)
#     warehouse_name = models.CharField(max_length=100, null=True, blank=True)
#     contact_number = models.CharField(max_length=100, null=True, blank=True)
#     mandal_name = models.CharField(max_length=100, null=True, blank=True)
#     buyer_name = models.CharField(max_length=100, null=True, blank=True)
#     grade = models.CharField(max_length=100, null=True, blank=True)
#     quantity_kg = models.CharField(max_length=100, null=True, blank=True)
#     analysis = models.JSONField(null=True, blank=True)
#     created_at = models.DateTimeField(default=timezone.now)  #format YYYY-MM-DD HH:MM:SS.msmsms
    
# # Serializer for the Inspection model
# class InspectionSerializer(serializers.ModelSerializer):
#     inspection_date_time = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Inspection
#         fields = ['unique_id', 'inspection_date_time', 'farmer_name', 'village', 'block', 'location_name', \
#                 'warehouse_name', 'contact_number', 'mandal_name', 'buyer_name', 'grade', 'quantity_kg', 'analysis']
        
#     def get_inspection_date_time(self, obj):
#         return obj.inspection_date_time.strftime("%d-%m-%Y %H:%M") if obj.inspection_date_time else None
 
        
# class FetchAndSaveDataAPIView(APIView):
#     def get(self, request):
#         fetch_and_save_data()
        
#         return Response({"message": "Data fetched and saved successfully"})
    
# def fetch_and_save_data():
#     """
#     method to sync data from 01-01-2023 till date
#     """
#     # print("inside method")
#     base_start_date = datetime(2024, 2, 12) 
#     base_end_date = base_start_date + timedelta(days=1)
#     march_end_date = datetime(2024, 2, 12)  # Last day of June
    
#     # Get today's date
#     # today = datetime.now().date()
#     today = datetime.now()
    
#     while base_end_date <= march_end_date:
#         # Convert dates to string format
#         from_date = base_start_date.strftime("%d-%m-%Y")
#         to_date = base_end_date.strftime("%d-%m-%Y")

#         # Define the API endpoint and parameters
#         url = "https://chilly.qualix.ai/portal/scan/scan-history"
#         params = {
#             "from_date": from_date,
#             "to_date": to_date
#         }
#         headers = {
#             "API-KEY": "9zvtydnon1a6jr3ltzex"
#         }
#         response = requests.get(url, params=params, headers=headers)

#         if response.status_code == 200:
#             data = response.json()
            
#             # Check if scans list is empty
#             if not data.get("scans"):
#                 print(f"No data found for dates: {from_date} to {to_date}")
#                 # Increment dates by 5 days for next iteration
#                 base_start_date += timedelta(days=2)
#                 base_end_date = base_start_date + timedelta(days=1)
#                 continue
            
#             for scan_data in data.get("scans", []):
#                 # inspection_date_time_str = scan_data.get("inspection_date_time")
#                 # inspection_date_time = datetime.strptime(inspection_date_time_str, "%d-%m-%Y %H:%M")
#                 # Create an Inspection object
#                 inspection = Inspection.objects.create(
#                     unique_id=scan_data.get("unique_id"),
#                     inspection_date_time=datetime.strptime(scan_data.get("inspection_date_time"), "%d-%m-%Y %H:%M"),
#                     # inspection_date_time=inspection_date_time, 
#                     farmer_name=scan_data.get("farmer_name"),
#                     village=scan_data.get("village"),
#                     block=scan_data.get("block"),
#                     location_name=scan_data.get("location_name"),
#                     warehouse_name=scan_data.get("warehouse_name"),
#                     contact_number=scan_data.get("contact_number"),
#                     mandal_name=scan_data.get("mandal_name"),
#                     buyer_name=scan_data.get("buyer_name"),
#                     grade=scan_data.get("grade"),
#                     quantity_kg=scan_data.get("quanity(kg)"),
#                     analysis=scan_data.get("analysis")  # Save analysis as JSON
#                 )
            
#             print(f"Succesfully dumped data from API for dates: {from_date} to {to_date}")
#             # Increment dates by 5 days for next iteration
#             base_start_date += timedelta(days=2)
#             base_end_date = base_start_date + timedelta(days=1)
            
#         else:
#             print(f"Failed to fetch data from API for dates: {from_date} to {to_date}")
#             break

# # Scheduler setup
# scheduler = BackgroundScheduler()

# # Define a signal handler to stop the scheduler when the server is stopped
# @receiver(request_finished)
# def close_scheduler(sender, **kwargs):
#     if scheduler.running:
#         scheduler.shutdown()
    
# scheduler.add_jobstore(DjangoJobStore(), "default")
# register_events(scheduler)

# # Define the job function
# def fetch_data_job():
#     command = Command()
#     command.handle()

# # Define the job wrapper function
# def fetch_data_job_wrapper():
#     fetch_data_job()
    
# # Get the existing job
# existing_job = scheduler.get_job("fetch_data_job")

# # If the job doesn't exist or if it exists but is paused, add/replace it (trigger every 5 minutes)
# # if not existing_job or existing_job.next_run_time is None or existing_job.next_run_time < timezone.now():
# #     scheduler.add_job(
# #         fetch_data_job_wrapper,
# #         trigger=IntervalTrigger(minutes=5),
# #         id="fetch_data_job",
# #         replace_existing=True  # Replace existing job if it exists
# #     )

# # Define the cron expression for weekly recurrence on Sundays at a specific time, for example, every Sunday at 8:00 AM
# cron_expression = '0 8 * * 0'  # Minute: 0, Hour: 8, Day of week: Sunday

# if not existing_job or existing_job.next_run_time is None or existing_job.next_run_time < timezone.now():
#     scheduler.add_job(
#         fetch_data_job_wrapper,
#         trigger=CronTrigger.from_crontab(cron_expression),
#         id="fetch_data_job",
#         replace_existing=True  # Replace existing job if it exists
#     )

# scheduler.start()

# # Django management command to fetch and save data
# class Command(BaseCommand):
#     help = 'Fetches data from external API and saves it to the database'

#     def handle(self, *args, **options):
        
#         last_inspection = Inspection.objects.order_by('-created_at').first()
        
#         # Get today's date
#         today_date = timezone.now().date()
        
#         # Condition 1: Check if the last inserted record is from yesterday
#         if last_inspection and (last_inspection.created_at.date() == today_date - timedelta(days=1) \
#             or last_inspection.created_at.date() == today_date):
#             # self.stdout.write(self.style.WARNING('No need to fetch data from the API as it was already fetched yesterday'))
#             LOGGER.info(f'No need to fetch data from the API as it was already fetched for {today_date - timedelta(days=1)}')
#             print(f'No need to fetch data from the API as it was already fetched for {today_date - timedelta(days=1)}')
#             return
        
#         # Condition 2: Fetch data from the API
#         if last_inspection:
#             # Calculate from_date as the last inserted record's created_at date
#             from_date = last_inspection.created_at.date()
#             to_date = from_date + timedelta(days=1)
            
#             # Loop until today - 1
#             while to_date <= today_date - timedelta(days=1):
#                 # Call API with the calculated date range
#                 url = "https://chilly.qualix.ai/portal/scan/scan-history"
#                 params = {
#                     "from_date": from_date.strftime("%d-%m-%Y"),
#                     "to_date": to_date.strftime("%d-%m-%Y")
#                 }
#                 headers = {
#                     "API-KEY": "9zvtydnon1a6jr3ltzex"
#                 }
#                 response = requests.get(url, params=params, headers=headers)

#                 if response.status_code == 200:
#                     data = response.json()

#                     if not data.get("scans"):
#                         # self.stdout.write(self.style.WARNING('No data found for the specified date range'))
#                         LOGGER.warning(f'No data found for the specified date range: {from_date} to {to_date}')
#                         print(f'No data found for the specified date range: {from_date} to {to_date}')
#                         from_date += timedelta(days=2)
#                         if from_date == today_date - timedelta(days=1):
#                             to_date = from_date
#                         else: 
#                             to_date = from_date + timedelta(days=1)
#                         continue

#                     # Process the data and save it to the database
#                     for scan_data in data.get("scans", []):
#                         inspection = Inspection.objects.create(
#                             unique_id=scan_data.get("unique_id"),
#                             inspection_date_time=datetime.strptime(scan_data.get("inspection_date_time"), "%d-%m-%Y %H:%M"),
#                             farmer_name=scan_data.get("farmer_name"),
#                             village=scan_data.get("village"),
#                             block=scan_data.get("block"),
#                             location_name=scan_data.get("location_name"),
#                             warehouse_name=scan_data.get("warehouse_name"),
#                             contact_number=scan_data.get("contact_number"),
#                             mandal_name=scan_data.get("mandal_name"),
#                             buyer_name=scan_data.get("buyer_name"),
#                             grade=scan_data.get("grade"),
#                             quantity_kg=scan_data.get("quanity(kg)"),
#                             analysis=scan_data.get("analysis")
#                         )

#                     # self.stdout.write(self.style.SUCCESS('Data fetched and saved successfully'))
#                     LOGGER.info(f'Data fetched and saved successfully for date range: {from_date} to {to_date}')
#                     print(f'Data fetched and saved successfully for date range: {from_date} to {to_date}')
#                 else:
#                     # self.stdout.write(self.style.ERROR('Failed to fetch data from the API'))
#                     LOGGER.error(f'Failed to fetch data from the API for date range: {from_date} to {to_date}')
#                     print(f'Failed to fetch data from the API for date range: {from_date} to {to_date}')
                
#                 from_date += timedelta(days=2)
#                 if from_date == today_date - timedelta(days=1):
#                     to_date = from_date
#                 else: 
#                     to_date = from_date + timedelta(days=1)


# class APIKeyAuthentication(BaseAuthentication):
#     """
#     Authentication class for iudx api
#     """
#     def authenticate(self, request):
#         api_key_header = request.headers.get('API-KEY')
#         if api_key_header != 'Idn3WWOVtROvD7mTFKO6':
#             error_data = {
#                 'status': 403,
#                 'error': 'Forbidden',
#                 'message': 'Missing valid API key. Please contact the administrator.'
#             }
#             raise AuthenticationFailed(error_data)

#         return None

# class ScanHistoryAPIView(APIView):
#     """
#     api-end point for iudx
#     """
#     permission_classes = []
#     authentication_classes = [APIKeyAuthentication]
#     def get(self, request):
#         from_date_str = request.query_params.get('from_date')
#         to_date_str = request.query_params.get('to_date')
        
#         from_date = datetime.strptime(from_date_str, '%d-%m-%Y')
#         to_date = datetime.strptime(to_date_str, '%d-%m-%Y')

#         # Check if from_date is less than or equal to to_date
#         if from_date > to_date:
#             return Response({'error': 'from_date cannot be greater than to_date'}, status=400)
        
#         all_inspections = Inspection.objects.all()
#         inspections = all_inspections.filter(inspection_date_time__gte=from_date, 
#                                                  inspection_date_time__lte=to_date)
        
#         serializer = InspectionSerializer(inspections, many=True)
#         response_data = {'scans': serializer.data}
        
#         return Response(response_data)