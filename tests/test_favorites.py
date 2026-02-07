"""
Tests for Favorites endpoints.
Covers: POST/DELETE /favorite/people/<id>, /favorite/planet/<id>, /favorite/vehicle/<id>
"""
import pytest
import time


class TestCharacterFavorites:
    """Tests for /favorite/people/<id> endpoint."""
    
    def test_add_character_favorite_success(self, api_client, create_test_character):
        """Test POST /favorite/people/<id> adds character to favorites."""
        character = create_test_character()
        
        response = api_client.post(f'/favorite/people/{character["uid"]}')
        assert response.status_code == 201
        
        data = response.json()
        assert data['message'] == 'Favorito añadido'
        
        result = data['results']
        assert result['character_id'] == character['uid']
        assert result['user_id'] == 1  # current_user_id
        assert 'id' in result
        
        api_client.track_resource('character_favorites', character['uid'])
    
    def test_add_character_favorite_duplicate(self, api_client, create_test_character):
        """Test POST /favorite/people/<id> with duplicate returns 400."""
        character = create_test_character()
        
        # Add first time
        api_client.post(f'/favorite/people/{character["uid"]}')
        
        # Try to add again
        response = api_client.post(f'/favorite/people/{character["uid"]}')
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'This character is already a favorite'
        
        api_client.track_resource('character_favorites', character['uid'])
    
    def test_delete_character_favorite_success(self, api_client, create_test_character):
        """Test DELETE /favorite/people/<id> removes character from favorites."""
        character = create_test_character()
        
        # Add to favorites first
        api_client.post(f'/favorite/people/{character["uid"]}')
        
        # Remove from favorites
        response = api_client.delete(f'/favorite/people/{character["uid"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Favorito eliminado'
        assert data['results'] is None
    
    def test_delete_character_favorite_not_found(self, api_client, create_test_character):
        """Test DELETE /favorite/people/<id> when not in favorites returns 404."""
        character = create_test_character()
        
        response = api_client.delete(f'/favorite/people/{character["uid"]}')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Favorite not found'
    
    def test_character_favorite_appears_in_user_favorites(self, api_client, create_test_character):
        """Test that added favorite appears in GET /users/favorites."""
        character = create_test_character()
        
        # Add to favorites
        api_client.post(f'/favorite/people/{character["uid"]}')
        
        # Check user favorites
        response = api_client.get('/users/favorites')
        data = response.json()
        
        found = any(
            item['uid'] == character['uid'] and item['name'] == character['name']
            for item in data['results']['people']
        )
        assert found, "Character should appear in user favorites"
        
        api_client.track_resource('character_favorites', character['uid'])


class TestPlanetFavorites:
    """Tests for /favorite/planet/<id> endpoint."""
    
    def test_add_planet_favorite_success(self, api_client, create_test_planet):
        """Test POST /favorite/planet/<id> adds planet to favorites."""
        planet = create_test_planet()
        
        response = api_client.post(f'/favorite/planet/{planet["uid"]}')
        assert response.status_code == 201
        
        data = response.json()
        assert data['message'] == 'Favorito añadido'
        
        result = data['results']
        assert result['planet_id'] == planet['uid']
        assert result['user_id'] == 1
        
        api_client.track_resource('planet_favorites', planet['uid'])
    
    def test_add_planet_favorite_duplicate(self, api_client, create_test_planet):
        """Test POST /favorite/planet/<id> with duplicate returns 400."""
        planet = create_test_planet()
        
        # Add first time
        api_client.post(f'/favorite/planet/{planet["uid"]}')
        
        # Try to add again
        response = api_client.post(f'/favorite/planet/{planet["uid"]}')
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'This planet is already a favorite'
        
        api_client.track_resource('planet_favorites', planet['uid'])
    
    def test_delete_planet_favorite_success(self, api_client, create_test_planet):
        """Test DELETE /favorite/planet/<id> removes planet from favorites."""
        planet = create_test_planet()
        
        # Add to favorites first
        api_client.post(f'/favorite/planet/{planet["uid"]}')
        
        # Remove from favorites
        response = api_client.delete(f'/favorite/planet/{planet["uid"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Favorito eliminado'
        assert data['results'] is None
    
    def test_delete_planet_favorite_not_found(self, api_client, create_test_planet):
        """Test DELETE /favorite/planet/<id> when not in favorites returns 404."""
        planet = create_test_planet()
        
        response = api_client.delete(f'/favorite/planet/{planet["uid"]}')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Favorite not found'


class TestVehicleFavorites:
    """Tests for /favorite/vehicle/<id> endpoint."""
    
    def test_add_vehicle_favorite_success(self, api_client, create_test_vehicle):
        """Test POST /favorite/vehicle/<id> adds vehicle to favorites."""
        vehicle = create_test_vehicle()
        
        response = api_client.post(f'/favorite/vehicle/{vehicle["id"]}')
        assert response.status_code == 201
        
        data = response.json()
        assert data['message'] == 'Favorito añadido'
        
        result = data['results']
        assert result['vehicle_id'] == vehicle['id']
        assert result['user_id'] == 1
        
        api_client.track_resource('vehicle_favorites', vehicle['id'])
    
    def test_add_vehicle_favorite_duplicate(self, api_client, create_test_vehicle):
        """Test POST /favorite/vehicle/<id> with duplicate returns 400."""
        vehicle = create_test_vehicle()
        
        # Add first time
        api_client.post(f'/favorite/vehicle/{vehicle["id"]}')
        
        # Try to add again
        response = api_client.post(f'/favorite/vehicle/{vehicle["id"]}')
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'This vehicle is already a favorite'
        
        api_client.track_resource('vehicle_favorites', vehicle['id'])
    
    def test_delete_vehicle_favorite_success(self, api_client, create_test_vehicle):
        """Test DELETE /favorite/vehicle/<id> removes vehicle from favorites."""
        vehicle = create_test_vehicle()
        
        # Add to favorites first
        api_client.post(f'/favorite/vehicle/{vehicle["id"]}')
        
        # Remove from favorites
        response = api_client.delete(f'/favorite/vehicle/{vehicle["id"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Favorito eliminado'
        assert data['results'] is None
    
    def test_delete_vehicle_favorite_not_found(self, api_client, create_test_vehicle):
        """Test DELETE /favorite/vehicle/<id> when not in favorites returns 404."""
        vehicle = create_test_vehicle()
        
        response = api_client.delete(f'/favorite/vehicle/{vehicle["id"]}')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Favorite not found'


class TestMixedFavorites:
    """Tests for mixed favorites operations."""
    
    def test_add_multiple_favorite_types(self, api_client, create_test_character, create_test_planet, create_test_vehicle):
        """Test adding favorites of different types."""
        character = create_test_character()
        planet = create_test_planet()
        vehicle = create_test_vehicle()
        
        # Add all types
        api_client.post(f'/favorite/people/{character["uid"]}')
        api_client.post(f'/favorite/planet/{planet["uid"]}')
        api_client.post(f'/favorite/vehicle/{vehicle["id"]}')
        
        # Verify all appear in favorites
        response = api_client.get('/users/favorites')
        data = response.json()
        
        assert len(data['results']['people']) >= 1
        assert len(data['results']['planets']) >= 1
        assert len(data['results']['vehicles']) >= 1
        
        # Verify structure of favorite items
        person = data['results']['people'][0]
        assert 'uid' in person
        assert 'name' in person
        assert 'url' in person
        
        planet_fav = data['results']['planets'][0]
        assert 'uid' in planet_fav
        assert 'name' in planet_fav
        assert 'url' in planet_fav
        
        vehicle_fav = data['results']['vehicles'][0]
        assert 'uid' in vehicle_fav
        assert 'name' in vehicle_fav
        assert 'url' in vehicle_fav
        
        api_client.track_resource('character_favorites', character['uid'])
        api_client.track_resource('planet_favorites', planet['uid'])
        api_client.track_resource('vehicle_favorites', vehicle['id'])
    
    def test_favorite_urls_format(self, api_client, create_test_character, create_test_planet, create_test_vehicle):
        """Test that favorite URLs have correct format."""
        character = create_test_character()
        planet = create_test_planet()
        vehicle = create_test_vehicle()
        
        api_client.post(f'/favorite/people/{character["uid"]}')
        api_client.post(f'/favorite/planet/{planet["uid"]}')
        api_client.post(f'/favorite/vehicle/{vehicle["id"]}')
        
        response = api_client.get('/users/favorites')
        data = response.json()
        
        # Check URL formats
        if data['results']['people']:
            person_url = data['results']['people'][0]['url']
            assert person_url.startswith('/api/people/')
        
        if data['results']['planets']:
            planet_url = data['results']['planets'][0]['url']
            assert planet_url.startswith('/api/planets/')
        
        if data['results']['vehicles']:
            vehicle_url = data['results']['vehicles'][0]['url']
            assert vehicle_url.startswith('/api/vehicles/')
        
        api_client.track_resource('character_favorites', character['uid'])
        api_client.track_resource('planet_favorites', planet['uid'])
        api_client.track_resource('vehicle_favorites', vehicle['id'])
