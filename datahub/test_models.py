import uuid

from django.db import models

GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

MARITAL_STATUS_CHOICES = [
    ('single', 'Single'),
    ('married', 'Married'),
    ('widowed', 'Widowed'),
    ('divorced', 'Divorced'),
]

HOUSEHOLD_TYPE_CHOICES = [
    ('male_headed', 'Male Headed'),
    ('female_headed', 'Female Headed'),
]

HEAD_CHOICES = [
    ('yes', 'Yes'),
    ('no', 'No'),
]

PRODUCTION_TYPE_CHOICES = [
    ('personal_consumption', 'Personal Consumption'),
    ('local_market', 'For Local Market'),
    ('small_holder', 'Small Holder'),
    ('others', 'Others'),
]

LAND_OWNER_CHOICES = [
    ('owner', 'Owner'),
    ('shared', 'Shared'),
    ('rented', 'Rented'),
    ('none', 'None'),
]

CROPS_PRIORITY_CHOICES = [
    ('barley', 'Barley'),
    ('chickpea', 'Chickpea'),
    # Add other crop choices
]

CATEGORY_CHOICES = [
    ('model_farmer', 'Model Farmer'),
    ('middle_farmer', 'Middle Farmer'),
    ('resource_poor_farmer', 'Resource Poor Farmer'),
]
FARMINGTYPE = [('crop_only', 'Crop Only'), ('livestock_only', 'Livestock Only')]


LIVESTOCK_TYPE_CHOICES = [
        ('cattle', 'Cattle'),
        ('calf', 'Calf'),
        ('cow', 'Cow'),
        ('heifer', 'Heifer'),
        ('bull', 'Bull'),
        ('steer', 'Steer'),
        ('sheep', 'Sheep'),
        ('goats', 'Goats'),
        ('poultry', 'Poultry'),
        ('equine', 'Equine'),
        ('honey_bee', 'Honey Bee'),
        ('fish', 'Fish'),
    ]

SUB_LIVESTOCK_CHOICES = [
    # Cattle
    ('local_female_calf', 'Local Female Calf'),
    ('local_male_calf', 'Local Male Calf'),
    ('cross_bred_female_calf', 'Cross Bred Female Calf'),
    ('cross_bred_male_calf', 'Cross Bred Male Calf'),
    ('local_cow', 'Local Cow'),
    ('cross_bred_cow', 'Cross Bred Cow'),
    ('local_heifer', 'Local Heifer'),
    ('cross_bred_heifer', 'Cross Bred Heifer'),
    ('local_bull', 'Local Bull'),
    ('cross_bred_bull', 'Cross Bred Bull'),
    ('local_steer', 'Local Steer'),
    ('cross_bred_steer', 'Cross Bred Steer'),

    # Sheep
    ('lamb_female', 'Lamb (Female)'),
    ('lamb_male', 'Lamb (Male)'),
    ('ewe', 'Ewe (Female Sheep)'),
    ('ram_local', 'Ram Local (Male Sheep)'),

    # Goats
    ('goat_kids_male', 'Goat Kids (Male)'),
    ('goat_kids_female', 'Goat Kids (Female)'),
    ('buck', 'Buck (Male Goat)'),
    ('doe_local', 'Doe Local (Female Goat)'),

    # Poultry
    ('local_breed', 'Local Breed'),
    ('improved_breed_layer', 'Improved Breed Layer Type'),
    ('improved_breed_dual_purpose', 'Improved Breed Dual Purpose Type'),
    ('improved_broiler', 'Improved Broiler Type'),

    # Equine
    ('horse', 'Horse'),
    ('donkey', 'Donkey'),
    ('mule', 'Mule'),

    # Honey Bee
    ('beehive_type', 'Beehive Type'),
    
    # Fish
    ('fish', 'Fish'),
]


CROP_CHOICES = [
    ('barley', 'Barley'),
    ('chickpea', 'Chickpea'),
    ('common_haricon_bean', 'Common Haricon Bean'),
    ('field_pea', 'Field Pea'),
    ('foba_bean', 'Foba Bean'),
    ('ground_nut', 'Ground Nut'),
    ('len_seed', 'Len Seed'),
    ('red_lentile', 'Red Lentile'),
    ('maize', 'Maize'),
    ('niper_seed', 'Niper Seed'),
    ('rape_seed', 'Rape Seed'),
    ('safflower', 'Safflower'),
    ('sesame_seed', 'Sesame Seed'),
    ('sorgum', 'Sorgum'),
    ('sun_flower', 'Sun Flower'),
    ('teff', 'Teff'),
    ('wheat', 'Wheat'),
]
SOIL_CHOICES = [
    ('sand', 'Sand'),
    ('loam', 'Loam'),
    ('black_cotton', 'Black Cotton'),
    # Add other soil type choices
]

GROUP_TYPE_CHOICES = [
    ('female_only', 'Female Only'),
    ('youth', 'Youth'),
    ('farmers_group', "Farmers' Group"),
    ('other', 'Other'),
]

CHEMICAL_TYPE_CHOICES = [
    ('powder (grams)', 'Powder (grams)'),
    ('liquid (liter)', 'Liquid (liter)'),
    ('solid (kg)', 'Solid (kg)'), # need Discussion
]

class Season(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seasson = models.CharField(max_length=100)

class CropVeriety(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_type = models.CharField(max_length=50, choices=CROPS_PRIORITY_CHOICES)

class Fertilizer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fertilizer_type = models.CharField(max_length=50, choices=SUB_LIVESTOCK_CHOICES)

class Livestock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    livestock_type = models.CharField(max_length=20, choices=LIVESTOCK_TYPE_CHOICES) 

class SubLivestock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    livestock_id = models.ForeignKey('Livestock', on_delete=models.CASCADE)
    sub_livestock = models.CharField(max_length=50, choices=SUB_LIVESTOCK_CHOICES)

class FarmingType(models.Model): # Need Disussion
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=100) # insert FARMINGTYPE data

class Farmer(models.Model):
    # Choices for various fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kebele_id =  models.ForeignKey("Kebele", on_delete=models.PROTECT) 
    language_id =  models.ForeignKey("Language", on_delete=models.PROTECT) 
    farming_type = models.ArrayField(models.CharField(max_length=30, choices=FARMINGTYPE), size=3) # type: ignore
    farmer_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    grand_father_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    household_type = models.CharField(max_length=20, choices=HOUSEHOLD_TYPE_CHOICES)
    head = models.CharField(max_length=5, choices=HEAD_CHOICES)
    crops_priority = models.ArrayField(models.CharField(max_length=30, choices=CROPS_PRIORITY_CHOICES), size=3) # type: ignore
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, blank=True)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, blank=True)
    production_type = models.CharField(max_length=20, choices=PRODUCTION_TYPE_CHOICES, blank=True)
    land_owner = models.CharField(max_length=20, choices=LAND_OWNER_CHOICES, blank=True)
    sex = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)

    def __str__(self):
        return self.farmer_name
# class FarmerFarmingTypeMap(models.Model):
#     farmer_id = models.ForeignKey(Farmer, on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model    
#     farming_type_id = models.ForeignKey(FarmingType, on_delete=models.CASCADE)

class Farm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer_id = models.ForeignKey(Farmer, on_delete=models.PROTECT)  # Assuming you have a 'Farmer' model    
    land_certificate_number = models.CharField(max_length=100, blank=True, null=True)
    gps_of_farm_land = models.CharField(max_length=100, blank=True, null=True)
    size_of_field = models.CharField(max_length=50)
    soil_type = models.CharField(max_length=20, choices=SOIL_CHOICES)

class FarmerFarmCropMap:
    farm_id = models.ForeignKey("Farm", on_delete=models.PROTECT)
    crop_type = models.ForeignKey("cropVarity", on_delete=models.PROTECT)

class FarmerSubLivestockMap(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer_id = models.ForeignKey('Farmer', on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model
    sub_livestock = models.ForeignKey('SubLivestock', on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=0)
class FarmerGroupRegister(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kebele_id =  models.ForeignKey("Kebele", on_delete=models.CASCADE)   # Assuming kebele_id is a string
    group_name = models.CharField(max_length=100)
    group_type = models.CharField(max_length=20, choices=GROUP_TYPE_CHOICES)

    def __str__(self):
        return self.group_name
class FarmerGroupMemberMap(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer_group_id = models.ForeignKey('FarmerGroupRegister', on_delete=models.CASCADE)
    farmer_id = models.ForeignKey('Farmer', on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model

    def __str__(self):
        return f"GroupFarmerMap {self.id}"

SPECIALITY_CHOICES = [
        ('crop', 'Crop'),
        ('livestock', 'Livestock'),
        ('marketing', 'Marketing'),
        ('natural_resources', 'Natural Resources'),
        ('horticulture', 'Horticulture'),
        ('mechanization', 'Mechanization'),
        ('irrigation', 'Irrigation'),
    ]
class DARegistry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    grandfather_name = models.CharField(max_length=100, blank=True)  # Optional field
    phone_number = models.CharField(max_length=20)
    kebele_id =  models.ForeignKey("Kebele", on_delete=models.CASCADE) 
    sex = models.CharField(max_length=10, choices=GENDER_CHOICES)
    speciality = models.CharField(max_length=20, choices=SPECIALITY_CHOICES)
    is_da_leader = models.BooleanField(default=False)

    def __str__(self):
        return self.first_name
TASK_FORMS = [('crop collection', 'crop collection'),
    ('fertilizer collection', 'fertilizer collection'),
    ('adoption', 'adoption'),
    ('post_harvest', 'post_harvest'),
    ('feedback', 'feedback'),

    ]

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    description =  models.CharField(max_length=1000, blank=True)
    content = models.JSONField(default={}, blank=True) 
    kebele_id =  models.ForeignKey("Kebele", on_delete=models.PROTECT)
    speciality = models.CharField(max_length=20, choices=SPECIALITY_CHOICES) 
    forms_title = models.ArrayField(models.CharField(max_length=30, choices=TASK_FORMS), size=5) # type: ignore

    #Example of tasks
    # Crop diversification
    # Improved seed distribution
    # Irrigation and water management
    # Soil health enhancement
    # Pest and disease management
    # Climate-smart agriculture
    # Value-chain development
    # Post-harvest management
    # Livestock management
    # Agricultural extension services
    # Mechanization and technology adoption
    # Market access and value addition
    # Natural resource management
    # Research and innovation
    # Policy advocacy and capacity building
    

class DaTaskMap(models.Model):
    da_register_id = models.ForeignKey('DARegistry', on_delete=models.CASCADE)
    task_id = models.ForeignKey('Task', on_delete=models.CASCADE)
    task_start_date = models.DateTimeField(null=True, blank=True)
    task_end_end = models.DateTimeField(null=True, blank=True)
    status = models.BooleanField(default=False) # Based on end date it has to complted

class FertilizerDemandCollection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer_id = models.ForeignKey('Farmer', on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model
    fertilizer_id = models.ForeignKey('FertilizerType', on_delete=models.CASCADE)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    da_task_map_id = models.ForeignKey('DaTaskMap', on_delete=models.CASCADE)
    amount_requested = models.DecimalField(max_digits=10, decimal_places=2)
    previous_season_consumption = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    chemical_type = models.CharField(max_length=10, choices=CHEMICAL_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10)
class FertilizerPlanned(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fertilizer_id = models.ForeignKey('FertilizerType', on_delete=models.CASCADE)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    da_task_map_id = models.ForeignKey('DaTaskMap', on_delete=models.CASCADE)
    amount_per_fertilizer = models.DecimalField(max_digits=10, decimal_places=2)
    chemical_type = models.CharField(max_length=10, choices=CHEMICAL_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10)
class FertilizerDistribution(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer_id = models.ForeignKey('Farmer', on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model
    fertilizer_id = models.ForeignKey('FertilizerType', on_delete=models.CASCADE)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    da_task_map_id = models.ForeignKey('DaTaskMap', on_delete=models.CASCADE)
    demand_ollection = models.ForeignKey('FertilizerDemandCollection', on_delete=models.CASCADE, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    chemical_type = models.CharField(max_length=10, choices=CHEMICAL_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10)

class CropDemandCollection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    farmer_id = models.ForeignKey('Farmer', on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model
    crop_veriety_id = models.ForeignKey('CropVeriety', on_delete=models.CASCADE)
    da_task_map_id = models.ForeignKey('DaTaskMap', on_delete=models.CASCADE)
    amount_requested = models.DecimalField(max_digits=10, decimal_places=2)
    previous_season_consumption = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    chemical_type = models.CharField(max_length=10, choices=CHEMICAL_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10)
class CropPlanned(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    crop_veriety_id = models.ForeignKey('CropVeriety', on_delete=models.CASCADE)
    da_task_map_id = models.ForeignKey('DaTaskMap', on_delete=models.CASCADE)
    amount_per_crop = models.DecimalField(max_digits=10, decimal_places=2)
    chemical_type = models.CharField(max_length=10, choices=CHEMICAL_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10)
class CropDistribution(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey('Season', on_delete=models.CASCADE)
    farmer_id = models.ForeignKey('Farmer', on_delete=models.CASCADE)  # Assuming you have a 'Farmer' model
    crop_veriety_id = models.ForeignKey('CropVeriety', on_delete=models.CASCADE)
    da_task_map_id = models.ForeignKey('DaTaskMap', on_delete=models.CASCADE)
    demand_ollection = models.ForeignKey('CropDemandCollection', on_delete=models.CASCADE, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    chemical_type = models.CharField(max_length=10, choices=CHEMICAL_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10)
