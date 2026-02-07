"""
Tests for Star Wars entities endpoints (People, Planets, Vehicles).
Covers CRUD operations for all three entity types.
"""
import pytest
import time


class TestPeopleList:
    """Tests for GET /people endpoint."""
    
    def test_get_people_empty_list(self, api_client):
        """Test GET /people returns empty list when no characters exist."""
        response = api_client.get('/people')
        assert response.status_code == 200
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Listado de Personajes'
        assert isinstance(data['results'], list)
    
    def test_get_people_with_data(self, api_client, create_test_character):
        """Test GET /people returns list with created characters."""
        character = create_test_character()
        
        response = api_client.get('/people')
        assert response.status_code == 200
        
        data = response.json()
        assert len(data['results']) >= 1
        
        found = next((c for c in data['results'] if c['uid'] == character['uid']), None)
        assert found is not None
        assert 'uid' in found
        assert 'name' in found
        assert 'url' in found
    
    def test_get_people_structure(self, api_client, create_test_character):
        """Test GET /people returns correct response structure."""
        create_test_character()
        
        response = api_client.get('/people')
        data = response.json()
        
        assert 'results' in data
        assert 'message' in data
        
        if data['results']:
            character = data['results'][0]
            expected_fields = {'uid', 'name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender', 'url'}
            assert set(character.keys()) == expected_fields


class TestPeopleCreate:
    """Tests for POST /people endpoint."""
    
    def test_create_character_success(self, api_client):
        """Test POST /people creates character with all fields."""
        timestamp = int(time.time() * 1000)
        char_data = {
            'name': f'Test Character {timestamp}',
            'height': '180',
            'mass': '80',
            'hair_color': 'brown',
            'skin_color': 'light',
            'eye_color': 'blue',
            'birth_year': '1990',
            'gender': 'male'
        }
        
        response = api_client.post('/people', json=char_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data['message'] == 'Personaje creado'
        
        result = data['results']
        assert result['name'] == char_data['name']
        assert result['height'] == char_data['height']
        assert 'uid' in result
        assert 'url' in result
        assert result['url'] == f"/api/people/{result['uid']}"
        
        api_client.track_resource('characters', result['uid'])
    
    def test_create_character_minimal(self, api_client):
        """Test POST /people with minimal required fields."""
        timestamp = int(time.time() * 1000)
        char_data = {
            'name': f'Minimal Character {timestamp}'
        }
        
        response = api_client.post('/people', json=char_data)
        assert response.status_code == 201
        
        result = response.json()['results']
        assert result['name'] == char_data['name']
        
        api_client.track_resource('characters', result['uid'])
    
    def test_create_character_duplicate_name(self, api_client, create_test_character):
        """Test POST /people with duplicate name fails."""
        character = create_test_character()
        
        char_data = {
            'name': character['name']
        }
        
        response = api_client.post('/people', json=char_data)
        # Should fail due to unique constraint on name
        assert response.status_code == 500


class TestPeopleDetail:
    """Tests for GET /people/<id> endpoint."""
    
    def test_get_person_success(self, api_client, create_test_character):
        """Test GET /people/<id> returns character when exists."""
        character = create_test_character()
        
        response = api_client.get(f'/people/{character["uid"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Personaje encontrado'
        assert data['results']['uid'] == character['uid']
    
    def test_get_person_not_found(self, api_client):
        """Test GET /people/<id> returns 404 for non-existent character."""
        response = api_client.get('/people/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Person not found'


class TestPeopleUpdate:
    """Tests for PUT /people/<id> endpoint."""
    
    def test_update_person_success(self, api_client, create_test_character):
        """Test PUT /people/<id> updates character successfully."""
        character = create_test_character()
        
        update_data = {
            'height': '200',
            'mass': '90'
        }
        
        response = api_client.put(f'/people/{character["uid"]}', json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Personaje actualizado'
        assert data['results']['height'] == '200'
        assert data['results']['mass'] == '90'
    
    def test_update_person_not_found(self, api_client):
        """Test PUT /people/<id> returns 404 for non-existent character."""
        response = api_client.put('/people/999999', json={'height': '200'})
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Person not found'


class TestPeopleDelete:
    """Tests for DELETE /people/<id> endpoint."""
    
    def test_delete_person_success(self, api_client):
        """Test DELETE /people/<id> deletes character successfully."""
        timestamp = int(time.time() * 1000)
        char_data = {
            'name': f'To Delete {timestamp}',
            'height': '180',
            'mass': '80',
            'hair_color': 'brown',
            'skin_color': 'light',
            'eye_color': 'blue',
            'birth_year': '1990',
            'gender': 'male'
        }
        create_response = api_client.post('/people', json=char_data)
        char_id = create_response.json()['results']['uid']
        
        response = api_client.delete(f'/people/{char_id}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Personaje eliminado'
        assert data['results'] is None
    
    def test_delete_person_not_found(self, api_client):
        """Test DELETE /people/<id> returns 404 for non-existent character."""
        response = api_client.delete('/people/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Person not found'


class TestPlanetsList:
    """Tests for GET /planets endpoint."""
    
    def test_get_planets_empty_list(self, api_client):
        """Test GET /planets returns empty list when no planets exist."""
        response = api_client.get('/planets')
        assert response.status_code == 200
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Listado de Planetas'
        assert isinstance(data['results'], list)
    
    def test_get_planets_with_data(self, api_client, create_test_planet):
        """Test GET /planets returns list with created planets."""
        planet = create_test_planet()
        
        response = api_client.get('/planets')
        assert response.status_code == 200
        
        data = response.json()
        assert len(data['results']) >= 1
        
        found = next((p for p in data['results'] if p['uid'] == planet['uid']), None)
        assert found is not None
        assert 'uid' in found
        assert 'name' in found


class TestPlanetsCreate:
    """Tests for POST /planets endpoint."""
    
    def test_create_planet_success(self, api_client):
        """Test POST /planets creates planet with all fields."""
        timestamp = int(time.time() * 1000)
        planet_data = {
            'name': f'Test Planet {timestamp}',
            'diameter': '12000',
            'rotation_period': '24',
            'orbital_period': '365',
            'gravity': '1 standard',
            'population': '1000000',
            'climate': 'temperate',
            'terrain': 'grasslands'
        }
        
        response = api_client.post('/planets', json=planet_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data['message'] == 'Planeta creado'
        
        result = data['results']
        assert result['name'] == planet_data['name']
        assert 'uid' in result
        assert 'url' in result
        assert result['url'] == f"/api/planets/{result['uid']}"
        
        api_client.track_resource('planets', result['uid'])
    
    def test_create_planet_not_found(self, api_client):
        """Test GET /planets/<id> returns 404 for non-existent planet."""
        response = api_client.get('/planets/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Planet not found'
    
    def test_delete_planet_success(self, api_client):
        """Test DELETE /planets/<id> deletes planet successfully."""
        timestamp = int(time.time() * 1000)
        planet_data = {
            'name': f'To Delete {timestamp}',
            'diameter': '12000',
            'rotation_period': '24',
            'orbital_period': '365',
            'gravity': '1 standard',
            'population': '1000000',
            'climate': 'temperate',
            'terrain': 'grasslands'
        }
        create_response = api_client.post('/planets', json=planet_data)
        planet_id = create_response.json()['results']['uid']
        
        response = api_client.delete(f'/planets/{planet_id}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Planeta eliminado'


class TestVehiclesList:
    """Tests for GET /vehicles endpoint."""
    
    def test_get_vehicles_empty_list(self, api_client):
        """Test GET /vehicles returns empty list when no vehicles exist."""
        response = api_client.get('/vehicles')
        assert response.status_code == 200
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Listado de Vehiculos'
        assert isinstance(data['results'], list)
    
    def test_get_vehicles_with_data(self, api_client, create_test_vehicle):
        """Test GET /vehicles returns list with created vehicles."""
        vehicle = create_test_vehicle()
        
        response = api_client.get('/vehicles')
        assert response.status_code == 200
        
        data = response.json()
        assert len(data['results']) >= 1
        
        found = next((v for v in data['results'] if v['id'] == vehicle['id']), None)
        assert found is not None
        assert 'id' in found
        assert 'name' in found


class TestVehiclesCreate:
    """Tests for POST /vehicles endpoint with validations."""
    
    def test_create_vehicle_success(self, api_client):
        """Test POST /vehicles creates vehicle with all required fields."""
        timestamp = int(time.time() * 1000)
        vehicle_data = {
            'name': f'Test Vehicle {timestamp}',
            'model': 'Test Model',
            'manufacturer': 'Test Manufacturer',
            'vehicle_class': 'Test Class'
        }
        
        response = api_client.post('/vehicles', json=vehicle_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data['message'] == 'Vehiculo creado'
        
        result = data['results']
        assert result['name'] == vehicle_data['name']
        assert 'id' in result
        assert 'url' in result
        assert result['url'] == f"/api/vehicles/{result['id']}"
        
        api_client.track_resource('vehicles', result['id'])
    
    def test_create_vehicle_missing_name(self, api_client):
        """Test POST /vehicles without name returns 400."""
        vehicle_data = {
            'model': 'Test Model',
            'manufacturer': 'Test Manufacturer',
            'vehicle_class': 'Test Class'
        }
        
        response = api_client.post('/vehicles', json=vehicle_data)
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'Name is required'
    
    def test_create_vehicle_missing_model(self, api_client):
        """Test POST /vehicles without model returns 400."""
        timestamp = int(time.time() * 1000)
        vehicle_data = {
            'name': f'Test Vehicle {timestamp}',
            'manufacturer': 'Test Manufacturer',
            'vehicle_class': 'Test Class'
        }
        
        response = api_client.post('/vehicles', json=vehicle_data)
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'Model is required'
    
    def test_create_vehicle_missing_manufacturer(self, api_client):
        """Test POST /vehicles without manufacturer returns 400."""
        timestamp = int(time.time() * 1000)
        vehicle_data = {
            'name': f'Test Vehicle {timestamp}',
            'model': 'Test Model',
            'vehicle_class': 'Test Class'
        }
        
        response = api_client.post('/vehicles', json=vehicle_data)
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'Manufacturer is required'
    
    def test_create_vehicle_missing_vehicle_class(self, api_client):
        """Test POST /vehicles without vehicle_class returns 400."""
        timestamp = int(time.time() * 1000)
        vehicle_data = {
            'name': f'Test Vehicle {timestamp}',
            'model': 'Test Model',
            'manufacturer': 'Test Manufacturer'
        }
        
        response = api_client.post('/vehicles', json=vehicle_data)
        assert response.status_code == 400
        
        data = response.json()
        assert data['message'] == 'Vehicle class is required'
    
    def test_create_vehicle_all_validation_errors(self, api_client):
        """Test POST /vehicles with all fields missing."""
        response = api_client.post('/vehicles', json={})
        assert response.status_code == 400
        # Should fail on first missing field (name)
        data = response.json()
        assert 'message' in data


class TestVehiclesDetail:
    """Tests for GET /vehicles/<id> endpoint."""
    
    def test_get_vehicle_success(self, api_client, create_test_vehicle):
        """Test GET /vehicles/<id> returns vehicle when exists."""
        vehicle = create_test_vehicle()
        
        response = api_client.get(f'/vehicles/{vehicle["id"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Vehiculo encontrado'
        assert data['results']['id'] == vehicle['id']
    
    def test_get_vehicle_not_found(self, api_client):
        """Test GET /vehicles/<id> returns 404 for non-existent vehicle."""
        response = api_client.get('/vehicles/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Vehicle not found'


class TestVehiclesDelete:
    """Tests for DELETE /vehicles/<id> endpoint."""
    
    def test_delete_vehicle_success(self, api_client):
        """Test DELETE /vehicles/<id> deletes vehicle successfully."""
        timestamp = int(time.time() * 1000)
        vehicle_data = {
            'name': f'To Delete {timestamp}',
            'model': 'Test Model',
            'manufacturer': 'Test Manufacturer',
            'vehicle_class': 'Test Class'
        }
        create_response = api_client.post('/vehicles', json=vehicle_data)
        vehicle_id = create_response.json()['results']['id']
        
        response = api_client.delete(f'/vehicles/{vehicle_id}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Vehiculo eliminado'
        assert data['results'] is None
    
    def test_delete_vehicle_not_found(self, api_client):
        """Test DELETE /vehicles/<id> returns 404 for non-existent vehicle."""
        response = api_client.delete('/vehicles/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Vehicle not found'
