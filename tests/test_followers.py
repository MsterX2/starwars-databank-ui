"""
Tests for Followers endpoints.
Covers: GET /followers, POST /followers/<user_id>, DELETE /followers/<user_id>
"""
import pytest
import time


class TestFollowersList:
    """Tests for GET /followers endpoint."""
    
    def test_get_followers_empty_list(self, api_client):
        """Test GET /followers returns empty list when no followers exist."""
        response = api_client.get('/followers')
        assert response.status_code == 200
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Listado de Seguidores'
        assert isinstance(data['results'], list)
    
    def test_get_followers_structure(self, api_client, create_test_user):
        """Test GET /followers returns correct response structure."""
        response = api_client.get('/followers')
        data = response.json()
        
        assert 'results' in data
        assert 'message' in data
        assert isinstance(data['results'], list)
        
        if data['results']:
            follower = data['results'][0]
            expected_fields = {'id', 'following_id', 'follower_id'}
            assert set(follower.keys()) == expected_fields


class TestFollowCreate:
    """Tests for POST /followers/<user_id> endpoint."""
    
    def test_follow_user_success(self, api_client, create_test_user):
        """Test POST /followers/<user_id> creates follow relationship."""
        # Create a user to follow
        user_to_follow = create_test_user(email=f'follow_target_{int(time.time()*1000)}@example.com')
        
        response = api_client.post(f'/followers/{user_to_follow["id"]}')
        assert response.status_code == 201
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Ahora sigues al usuario'
        
        result = data['results']
        assert result['following_id'] == user_to_follow['id']
        assert result['follower_id'] == 1  # current_user_id
        assert 'id' in result
        
        api_client.track_resource('followers', user_to_follow['id'])
    
    def test_follow_user_response_structure(self, api_client, create_test_user):
        """Test POST /followers/<user_id> returns correct response structure."""
        user_to_follow = create_test_user(email=f'follow_struct_{int(time.time()*1000)}@example.com')
        
        response = api_client.post(f'/followers/{user_to_follow["id"]}')
        assert response.status_code == 201
        
        data = response.json()
        assert set(data.keys()) == {'results', 'message'}
        assert data['message'] == 'Ahora sigues al usuario'
        
        result = data['results']
        expected_fields = {'id', 'following_id', 'follower_id'}
        assert set(result.keys()) == expected_fields
        
        api_client.track_resource('followers', user_to_follow['id'])
    
    def test_follow_user_appears_in_list(self, api_client, create_test_user):
        """Test that created follow relationship appears in GET /followers."""
        user_to_follow = create_test_user(email=f'follow_list_{int(time.time()*1000)}@example.com')
        
        # Create follow relationship
        api_client.post(f'/followers/{user_to_follow["id"]}')
        
        # Verify it appears in the list
        response = api_client.get('/followers')
        data = response.json()
        
        found = any(
            f['following_id'] == user_to_follow['id'] and f['follower_id'] == 1
            for f in data['results']
        )
        assert found, "Follow relationship should appear in list"
        
        api_client.track_resource('followers', user_to_follow['id'])


class TestFollowDelete:
    """Tests for DELETE /followers/<user_id> endpoint."""
    
    def test_unfollow_user_success(self, api_client, create_test_user):
        """Test DELETE /followers/<user_id> removes follow relationship."""
        # Create a user to follow and then unfollow
        user_to_unfollow = create_test_user(email=f'unfollow_{int(time.time()*1000)}@example.com')
        
        # First follow
        api_client.post(f'/followers/{user_to_unfollow["id"]}')
        
        # Then unfollow
        response = api_client.delete(f'/followers/{user_to_unfollow["id"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Has dejado de seguir al usuario'
        assert data['results'] is None
    
    def test_unfollow_user_not_following(self, api_client, create_test_user):
        """Test DELETE /followers/<user_id> when not following user."""
        user = create_test_user(email=f'not_following_{int(time.time()*1000)}@example.com')
        
        response = api_client.delete(f'/followers/{user["id"]}')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Follow relationship not found'
    
    def test_unfollow_user_persistence(self, api_client, create_test_user):
        """Test DELETE /followers/<user_id> removes relationship from database."""
        user = create_test_user(email=f'unfollow_persist_{int(time.time()*1000)}@example.com')
        
        # Follow
        api_client.post(f'/followers/{user["id"]}')
        
        # Unfollow
        api_client.delete(f'/followers/{user["id"]}')
        
        # Verify relationship is gone
        response = api_client.get('/followers')
        data = response.json()
        
        found = any(
            f['following_id'] == user['id'] and f['follower_id'] == 1
            for f in data['results']
        )
        assert not found, "Follow relationship should be removed"
    
    def test_unfollow_invalid_user(self, api_client):
        """Test DELETE /followers/<user_id> with non-existent user."""
        response = api_client.delete('/followers/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Follow relationship not found'
