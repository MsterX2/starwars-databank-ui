"""
Tests for Posts endpoints.
Covers: GET /posts, POST /posts, GET /posts/<id>, PUT /posts/<id>, DELETE /posts/<id>
"""
import pytest
import time


class TestPostsList:
    """Tests for GET /posts endpoint."""
    
    def test_get_posts_empty_list(self, api_client):
        """Test GET /posts returns empty list when no posts exist."""
        response = api_client.get('/posts')
        assert response.status_code == 200
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Listado de Posts'
        assert isinstance(data['results'], list)
    
    def test_get_posts_with_data(self, api_client, create_test_user, create_test_post):
        """Test GET /posts returns list with created posts."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        
        response = api_client.get('/posts')
        assert response.status_code == 200
        
        data = response.json()
        assert len(data['results']) >= 1
        
        # Verify post structure
        found_post = next((p for p in data['results'] if p['id'] == post['id']), None)
        assert found_post is not None
        assert 'id' in found_post
        assert 'title' in found_post
        assert 'description' in found_post
        assert 'body' in found_post
        assert 'date' in found_post
        assert 'image_url' in found_post
        assert 'user_id' in found_post
    
    def test_get_posts_structure(self, api_client, create_test_user, create_test_post):
        """Test GET /posts returns correct response structure."""
        user = create_test_user()
        create_test_post(user_id=user['id'])
        
        response = api_client.get('/posts')
        data = response.json()
        
        assert 'results' in data
        assert 'message' in data
        assert isinstance(data['results'], list)
        
        if data['results']:
            post = data['results'][0]
            expected_fields = {'id', 'title', 'description', 'body', 'date', 'image_url', 'user_id'}
            assert set(post.keys()) == expected_fields


class TestPostsCreate:
    """Tests for POST /posts endpoint."""
    
    def test_create_post_success(self, api_client, create_test_user):
        """Test POST /posts creates post with all required fields."""
        user = create_test_user()
        timestamp = int(time.time() * 1000)
        
        post_data = {
            'title': f'Test Post {timestamp}',
            'description': 'Test description',
            'body': 'Test body content',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        }
        
        response = api_client.post('/posts', json=post_data)
        assert response.status_code == 201
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Post creado'
        
        result = data['results']
        assert result['title'] == post_data['title']
        assert result['description'] == post_data['description']
        assert result['body'] == post_data['body']
        assert result['image_url'] == post_data['image_url']
        assert result['user_id'] == user['id']
        assert 'id' in result
        assert 'date' in result  # Auto-generated
        
        api_client.track_resource('posts', result['id'])
    
    def test_create_post_response_structure(self, api_client, create_test_user):
        """Test POST /posts returns correct response structure."""
        user = create_test_user()
        timestamp = int(time.time() * 1000)
        
        post_data = {
            'title': f'Structure Test {timestamp}',
            'description': 'Description',
            'body': 'Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        }
        
        response = api_client.post('/posts', json=post_data)
        assert response.status_code == 201
        
        data = response.json()
        assert set(data.keys()) == {'results', 'message'}
        assert data['message'] == 'Post creado'
        
        result = data['results']
        expected_fields = {'id', 'title', 'description', 'body', 'date', 'image_url', 'user_id'}
        assert set(result.keys()) == expected_fields
        
        api_client.track_resource('posts', result['id'])
    
    def test_create_post_auto_date(self, api_client, create_test_user):
        """Test POST /posts automatically assigns date."""
        user = create_test_user()
        timestamp = int(time.time() * 1000)
        
        post_data = {
            'title': f'Date Test {timestamp}',
            'description': 'Description',
            'body': 'Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        }
        
        response = api_client.post('/posts', json=post_data)
        result = response.json()['results']
        
        assert 'date' in result
        assert result['date'] is not None
        
        api_client.track_resource('posts', result['id'])
    
    def test_create_post_invalid_user(self, api_client):
        """Test POST /posts with non-existent user_id."""
        timestamp = int(time.time() * 1000)
        post_data = {
            'title': f'Invalid User {timestamp}',
            'description': 'Description',
            'body': 'Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': 999999  # Non-existent user
        }
        
        response = api_client.post('/posts', json=post_data)
        # Should fail due to FK constraint
        assert response.status_code == 500


class TestPostDetail:
    """Tests for GET /posts/<id> endpoint."""
    
    def test_get_post_success(self, api_client, create_test_user, create_test_post):
        """Test GET /posts/<id> returns post when exists."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        
        response = api_client.get(f'/posts/{post["id"]}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Contenido del post'
        assert data['results']['id'] == post['id']
        assert data['results']['title'] == post['title']
    
    def test_get_post_not_found(self, api_client):
        """Test GET /posts/<id> returns 404 for non-existent post."""
        response = api_client.get('/posts/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert 'message' in data
        assert data['message'] == 'Post not found'
    
    def test_get_post_invalid_id(self, api_client):
        """Test GET /posts/<id> with invalid ID."""
        response = api_client.get('/posts/invalid')
        assert response.status_code == 404
    
    def test_get_post_zero_id(self, api_client):
        """Test GET /posts/<id> with ID=0."""
        response = api_client.get('/posts/0')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Post not found'


class TestPostUpdate:
    """Tests for PUT /posts/<id> endpoint."""
    
    def test_update_post_success(self, api_client, create_test_user, create_test_post):
        """Test PUT /posts/<id> updates post successfully."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'], title='Original Title')
        
        update_data = {
            'title': 'Updated Title',
            'description': 'Updated Description'
        }
        
        response = api_client.put(f'/posts/{post["id"]}', json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Post actualizado'
        assert data['results']['title'] == 'Updated Title'
        assert data['results']['description'] == 'Updated Description'
        assert data['results']['body'] == post['body']  # Unchanged
    
    def test_update_post_partial(self, api_client, create_test_user, create_test_post):
        """Test PUT /posts/<id> with partial update."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'], title='Original')
        
        update_data = {'title': 'OnlyTitleUpdated'}
        
        response = api_client.post('/posts', json={
            'title': f'Partial Test {int(time.time() * 1000)}',
            'description': 'Original Desc',
            'body': 'Original Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        })
        post_id = response.json()['results']['id']
        api_client.track_resource('posts', post_id)
        
        update_response = api_client.put(f'/posts/{post_id}', json=update_data)
        assert update_response.status_code == 200
        
        data = update_response.json()
        assert data['results']['title'] == 'OnlyTitleUpdated'
        assert data['results']['description'] == 'Original Desc'
    
    def test_update_post_not_found(self, api_client):
        """Test PUT /posts/<id> returns 404 for non-existent post."""
        update_data = {'title': 'Updated'}
        
        response = api_client.put('/posts/999999', json=update_data)
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Post not found'
    
    def test_update_post_empty_payload(self, api_client, create_test_user):
        """Test PUT /posts/<id> with empty payload."""
        user = create_test_user()
        response = api_client.post('/posts', json={
            'title': f'Empty Update {int(time.time() * 1000)}',
            'description': 'Description',
            'body': 'Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        })
        post_id = response.json()['results']['id']
        api_client.track_resource('posts', post_id)
        
        update_response = api_client.put(f'/posts/{post_id}', json={})
        assert update_response.status_code == 200
        
        # Post should remain unchanged
        data = update_response.json()
        assert data['results']['title'] == response.json()['results']['title']


class TestPostDelete:
    """Tests for DELETE /posts/<id> endpoint."""
    
    def test_delete_post_success(self, api_client, create_test_user):
        """Test DELETE /posts/<id> deletes post successfully."""
        user = create_test_user()
        timestamp = int(time.time() * 1000)
        
        # Create post manually
        create_response = api_client.post('/posts', json={
            'title': f'To Delete {timestamp}',
            'description': 'Description',
            'body': 'Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        })
        post_id = create_response.json()['results']['id']
        
        response = api_client.delete(f'/posts/{post_id}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Post eliminado'
        assert data['results'] is None
    
    def test_delete_post_not_found(self, api_client):
        """Test DELETE /posts/<id> returns 404 for non-existent post."""
        response = api_client.delete('/posts/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Post not found'
    
    def test_delete_post_persistence(self, api_client, create_test_user):
        """Test DELETE /posts/<id> removes post from database."""
        user = create_test_user()
        timestamp = int(time.time() * 1000)
        
        create_response = api_client.post('/posts', json={
            'title': f'Persist Delete {timestamp}',
            'description': 'Description',
            'body': 'Body',
            'image_url': 'http://example.com/image.jpg',
            'user_id': user['id']
        })
        post_id = create_response.json()['results']['id']
        
        # Delete post
        api_client.delete(f'/posts/{post_id}')
        
        # Verify post is gone
        response = api_client.get(f'/posts/{post_id}')
        assert response.status_code == 404
