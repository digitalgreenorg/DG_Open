from rest_framework_simplejwt.tokens import RefreshToken

# Generic method to create access token(admin/participant/co-steward)
class TestUtils:
    @staticmethod
    def create_token_for_user(user, user_map):
        refresh_token = RefreshToken.for_user(user)
        refresh_token["org_id"] = str(user_map.organization_id) if user_map else None
        refresh_token["map_id"] = str(user_map.id) if user_map else None
        refresh_token["role"] = str(user.role_id)
        refresh_token["onboarded_by"] = str(user.on_boarded_by_id)
        refresh_token.access_token["org_id"] = str(user_map.organization_id) if user_map else None
        refresh_token.access_token["map_id"] = str(user_map.id) if user_map else None
        refresh_token.access_token["role"] = str(user.role_id)
        refresh_token.access_token["onboarded_by"] = str(user.on_boarded_by_id)

        return refresh_token.access_token