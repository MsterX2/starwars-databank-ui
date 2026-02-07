"""
Tests for Comments endpoints.
Covers: GET /comments, POST /comments, DELETE /comments/<id>
"""
import pytest
import time


class TestCommentsList:
    """Tests for GET /comments endpoint."""
    
    def test_get_comments_empty_list(self, api_client):
        """Test GET /comments returns empty list when no comments exist."""
        response = api_client.get('/comments')
        assert response.status_code == 200
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Listado de Comentarios'
        assert isinstance(data['results'], list)
    
    def test_get_comments_with_data(self, api_client, create_test_user, create_test_post):
        """Test GET /comments returns list with created comments."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        
        # Create a comment
        timestamp = int(time.time() * 1000)
        comment_data = {
            'body': f'Test comment {timestamp}',
            'user_id': user['id'],
            'post_id': post['id']
        }
        create_response = api_client.post('/comments', json=comment_data)
        comment_id = create_response.json()['results']['id']
        api_client.track_resource('comments', comment_id)
        
        response = api_client.get('/comments')
        assert response.status_code == 200
        
        data = response.json()
        assert len(data['results']) >= 1
        
        # Verify comment structure
        found_comment = next((c for c in data['results'] if c['id'] == comment_id), None)
        assert found_comment is not None
        assert 'id' in found_comment
        assert 'body' in found_comment
        assert 'user_id' in found_comment
        assert 'post_id' in found_comment
    
    def test_get_comments_structure(self, api_client, create_test_user, create_test_post):
        """Test GET /comments returns correct response structure."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        
        timestamp = int(time.time() * 1000)
        api_client.post('/comments', json={
            'body': f'Structure test {timestamp}',
            'user_id': user['id'],
            'post_id': post['id']
        })
        
        response = api_client.get('/comments')
        data = response.json()
        
        assert 'results' in data
        assert 'message' in data
        assert isinstance(data['results'], list)
        
        if data['results']:
            comment = data['results'][0]
            expected_fields = {'id', 'body', 'user_id', 'post_id'}
            assert set(comment.keys()) == expected_fields


class TestCommentsCreate:
    """Tests for POST /comments endpoint."""
    
    def test_create_comment_success(self, api_client, create_test_user, create_test_post):
        """Test POST /comments creates comment with all required fields."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        timestamp = int(time.time() * 1000)
        
        comment_data = {
            'body': f'Test comment body {timestamp}',
            'user_id': user['id'],
            'post_id': post['id']
        }
        
        response = api_client.post('/comments', json=comment_data)
        assert response.status_code == 201
        
        data = response.json()
        assert 'results' in data
        assert 'message' in data
        assert data['message'] == 'Comentario creado'
        
        result = data['results']
        assert result['body'] == comment_data['body']
        assert result['user_id'] == user['id']
        assert result['post_id'] == post['id']
        assert 'id' in result
        
        api_client.track_resource('comments', result['id'])
    
    def test_create_comment_response_structure(self, api_client, create_test_user, create_test_post):
        """Test POST /comments returns correct response structure."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        timestamp = int(time.time() * 1000)
        
        comment_data = {
            'body': f'Structure test {timestamp}',
            'user_id': user['id'],
            'post_id': post['id']
        }
        
        response = api_client.post('/comments', json=comment_data)
        assert response.status_code == 201
        
        data = response.json()
        assert set(data.keys()) == {'results', 'message'}
        assert data['message'] == 'Comentario creado'
        
        result = data['results']
        expected_fields = {'id', 'body', 'user_id', 'post_id'}
        assert set(result.keys()) == expected_fields
        
        api_client.track_resource('comments', result['id'])
    
    def test_create_comment_invalid_user(self, api_client, create_test_post, create_test_user):
        """Test POST /comments with non-existent user_id."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        timestamp = int(time.time() * 1000)
        
        comment_data = {
            'body': f'Invalid user {timestamp}',
            'user_id': 999999,  # Non-existent user
            'post_id': post['id']
        }
        
        response = api_client.post('/comments', json=comment_data)
        # Should fail due to FK constraint
        assert response.status_code == 500
    
    def test_create_comment_invalid_post(self, api_client, create_test_user):
        """Test POST /comments with non-existent post_id."""
        user = create_test_user()
        timestamp = int(time.time() * 1000)
        
        comment_data = {
            'body': f'Invalid post {timestamp}',
            'user_id': user['id'],
            'post_id': 999999  # Non-existent post
        }
        
        response = api_client.post('/comments', json=comment_data)
        # Should fail due to FK constraint
        assert response.status_code == 500


class TestCommentDelete:
    """Tests for DELETE /comments/<id> endpoint."""
    
    def test_delete_comment_success(self, api_client, create_test_user, create_test_post):
        """Test DELETE /comments/<id> deletes comment successfully."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        timestamp = int(time.time() * 1000)
        
        # Create comment manually to control cleanup
        create_response = api_client.post('/comments', json={
            'body': f'To delete {timestamp}',
            'user_id': user['id'],
            'post_id': post['id']
        })
        comment_id = create_response.json()['results']['id']
        
        response = api_client.delete(f'/comments/{comment_id}')
        assert response.status_code == 200
        
        data = response.json()
        assert data['message'] == 'Comentario eliminado'
        assert data['results'] is None
    
    def test_delete_comment_not_found(self, api_client):
        """Test DELETE /comments/<id> returns 404 for non-existent comment."""
        response = api_client.delete('/comments/999999')
        assert response.status_code == 404
        
        data = response.json()
        assert data['message'] == 'Comment not found'
    
    def test_delete_comment_persistence(self, api_client, create_test_user, create_test_post):
        """Test DELETE /comments/<id> removes comment from database."""
        user = create_test_user()
        post = create_test_post(user_id=user['id'])
        timestamp = int(time.time() * 1000)
        
        create_response = api_client.post('/comments', json={
            'body': f'Persist delete {timestamp}',
            'user_id': user['id'],
            'post_id': post['id']
        })
        comment_id = create_response.json()['results']['id']
        
        # Delete comment
        api_client.delete(f'/comments/{comment_id}')
        
        # Verify comment is gone from list
        response = api_client.get('/comments')
        data = response.json()
        found = any(c['id'] == comment_id for c in data['results'])
        assert not found
