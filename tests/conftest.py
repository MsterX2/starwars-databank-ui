"""
Pytest configuration and fixtures for API testing.
Provides base setup, teardown, and utility functions for testing the Flask API.
"""
import pytest
import requests
import time
from typing import Dict, Any, Optional

# Base URL for the API
BASE_URL = "http://localhost:3001/api"


class APITestClient:
    """Test client wrapper for making API requests with automatic cleanup."""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.created_resources = {
            'users': [],
            'posts': [],
            'comments': [],
            'followers': [],
            'characters': [],
            'planets': [],
            'vehicles': [],
            'character_favorites': [],
            'planet_favorites': [],
            'vehicle_favorites': []
        }
    
    def get(self, endpoint: str, **kwargs) -> requests.Response:
        """Make a GET request."""
        return self.session.get(f"{self.base_url}{endpoint}", **kwargs)
    
    def post(self, endpoint: str, json: Optional[Dict] = None, **kwargs) -> requests.Response:
        """Make a POST request."""
        return self.session.post(f"{self.base_url}{endpoint}", json=json, **kwargs)
    
    def put(self, endpoint: str, json: Optional[Dict] = None, **kwargs) -> requests.Response:
        """Make a PUT request."""
        return self.session.put(f"{self.base_url}{endpoint}", json=json, **kwargs)
    
    def delete(self, endpoint: str, **kwargs) -> requests.Response:
        """Make a DELETE request."""
        return self.session.delete(f"{self.base_url}{endpoint}", **kwargs)
    
    def track_resource(self, resource_type: str, resource_id: int):
        """Track a created resource for cleanup."""
        if resource_type in self.created_resources:
            self.created_resources[resource_type].append(resource_id)
    
    def cleanup(self):
        """
        Clean up all created resources in the correct order to respect FK constraints.
        Order: favorites -> followers -> comments -> posts -> users -> characters -> planets -> vehicles
        """
        # Delete favorites first (they reference users and entities)
        for fav_id in self.created_resources['vehicle_favorites']:
            try:
                self.session.delete(f"{self.base_url}/favorite/vehicle/{fav_id}")
            except Exception:
                pass
        
        for fav_id in self.created_resources['planet_favorites']:
            try:
                self.session.delete(f"{self.base_url}/favorite/planet/{fav_id}")
            except Exception:
                pass
        
        for fav_id in self.created_resources['character_favorites']:
            try:
                self.session.delete(f"{self.base_url}/favorite/people/{fav_id}")
            except Exception:
                pass
        
        # Delete followers
        for following_id in self.created_resources['followers']:
            try:
                self.session.delete(f"{self.base_url}/followers/{following_id}")
            except Exception:
                pass
        
        # Delete comments
        for comment_id in self.created_resources['comments']:
            try:
                self.session.delete(f"{self.base_url}/comments/{comment_id}")
            except Exception:
                pass
        
        # Delete posts
        for post_id in self.created_resources['posts']:
            try:
                self.session.delete(f"{self.base_url}/posts/{post_id}")
            except Exception:
                pass
        
        # Delete users
        for user_id in self.created_resources['users']:
            try:
                self.session.delete(f"{self.base_url}/users/{user_id}")
            except Exception:
                pass
        
        # Delete characters
        for char_id in self.created_resources['characters']:
            try:
                self.session.delete(f"{self.base_url}/people/{char_id}")
            except Exception:
                pass
        
        # Delete planets
        for planet_id in self.created_resources['planets']:
            try:
                self.session.delete(f"{self.base_url}/planets/{planet_id}")
            except Exception:
                pass
        
        # Delete vehicles
        for vehicle_id in self.created_resources['vehicles']:
            try:
                self.session.delete(f"{self.base_url}/vehicles/{vehicle_id}")
            except Exception:
                pass
        
        self.session.close()


@pytest.fixture
def api_client():
    """
    Fixture that provides an API test client with automatic cleanup.
    """
    client = APITestClient()
    yield client
    client.cleanup()


@pytest.fixture
def base_url():
    """Fixture that provides the base API URL."""
    return BASE_URL


@pytest.fixture
def create_test_user(api_client):
    """
    Fixture factory that creates a test user and returns its data.
    """
    def _create_user(email: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        timestamp = int(time.time() * 1000)
        user_data = {
            'email': email or f'test_user_{timestamp}@example.com',
            'password': 'testpassword123',
            'is_active': True,
            'first_name': kwargs.get('first_name', 'Test'),
            'last_name': kwargs.get('last_name', 'User')
        }
        user_data.update(kwargs)
        
        response = api_client.post('/users', json=user_data)
        if response.status_code == 201:
            user = response.json()
            api_client.track_resource('users', user['results']['id'])
            return user['results']
        return None
    
    return _create_user


@pytest.fixture
def create_test_post(api_client, create_test_user):
    """
    Fixture factory that creates a test post and returns its data.
    """
    def _create_post(user_id: Optional[int] = None, **kwargs) -> Dict[str, Any]:
        if user_id is None:
            user = create_test_user()
            user_id = user['id']
        
        timestamp = int(time.time() * 1000)
        post_data = {
            'title': kwargs.get('title', f'Test Post {timestamp}'),
            'description': kwargs.get('description', 'Test description'),
            'body': kwargs.get('body', 'Test body content'),
            'image_url': kwargs.get('image_url', 'http://example.com/image.jpg'),
            'user_id': user_id
        }
        post_data.update(kwargs)
        
        response = api_client.post('/posts', json=post_data)
        if response.status_code == 201:
            post = response.json()
            api_client.track_resource('posts', post['results']['id'])
            return post['results']
        return None
    
    return _create_post


@pytest.fixture
def create_test_character(api_client):
    """
    Fixture factory that creates a test character and returns its data.
    """
    def _create_character(**kwargs) -> Dict[str, Any]:
        timestamp = int(time.time() * 1000)
        char_data = {
            'name': kwargs.get('name', f'Test Character {timestamp}'),
            'height': kwargs.get('height', '180'),
            'mass': kwargs.get('mass', '80'),
            'hair_color': kwargs.get('hair_color', 'brown'),
            'skin_color': kwargs.get('skin_color', 'light'),
            'eye_color': kwargs.get('eye_color', 'blue'),
            'birth_year': kwargs.get('birth_year', '1990'),
            'gender': kwargs.get('gender', 'male')
        }
        char_data.update(kwargs)
        
        response = api_client.post('/people', json=char_data)
        if response.status_code == 201:
            char = response.json()
            api_client.track_resource('characters', char['results']['uid'])
            return char['results']
        return None
    
    return _create_character


@pytest.fixture
def create_test_planet(api_client):
    """
    Fixture factory that creates a test planet and returns its data.
    """
    def _create_planet(**kwargs) -> Dict[str, Any]:
        timestamp = int(time.time() * 1000)
        planet_data = {
            'name': kwargs.get('name', f'Test Planet {timestamp}'),
            'diameter': kwargs.get('diameter', '12000'),
            'rotation_period': kwargs.get('rotation_period', '24'),
            'orbital_period': kwargs.get('orbital_period', '365'),
            'gravity': kwargs.get('gravity', '1 standard'),
            'population': kwargs.get('population', '1000000'),
            'climate': kwargs.get('climate', 'temperate'),
            'terrain': kwargs.get('terrain', 'grasslands')
        }
        planet_data.update(kwargs)
        
        response = api_client.post('/planets', json=planet_data)
        if response.status_code == 201:
            planet = response.json()
            api_client.track_resource('planets', planet['results']['uid'])
            return planet['results']
        return None
    
    return _create_planet


@pytest.fixture
def create_test_vehicle(api_client):
    """
    Fixture factory that creates a test vehicle and returns its data.
    """
    def _create_vehicle(**kwargs) -> Dict[str, Any]:
        timestamp = int(time.time() * 1000)
        vehicle_data = {
            'name': kwargs.get('name', f'Test Vehicle {timestamp}'),
            'model': kwargs.get('model', 'Test Model'),
            'manufacturer': kwargs.get('manufacturer', 'Test Manufacturer'),
            'vehicle_class': kwargs.get('vehicle_class', 'Test Class'),
            'cost_in_credits': kwargs.get('cost_in_credits', '10000'),
            'length': kwargs.get('length', '10'),
            'max_atmosphering_speed': kwargs.get('max_atmosphering_speed', '1000'),
            'crew': kwargs.get('crew', '1'),
            'passengers': kwargs.get('passengers', '4'),
            'cargo_capacity': kwargs.get('cargo_capacity', '100'),
            'consumables': kwargs.get('consumables', '1 month')
        }
        vehicle_data.update(kwargs)
        
        response = api_client.post('/vehicles', json=vehicle_data)
        if response.status_code == 201:
            vehicle = response.json()
            api_client.track_resource('vehicles', vehicle['results']['id'])
            return vehicle['results']
        return None
    
    return _create_vehicle
