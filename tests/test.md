# Execute all tests
docker exec docker-local-starwars-backend-1 python -m pytest tests/ -v

# Run specific test file
docker exec docker-local-starwars-backend-1 python -m pytest tests/test_users.py -v

# Generate coverage report
docker exec docker-local-starwars-backend-1 python -m pytest tests/ --cov=src
