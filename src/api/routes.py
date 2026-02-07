from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Posts, Comments, Medias, Followers, Characters, CharacterFavorites, Planets, PlanetFavorites, Vehicles, VehicleFavorites
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

CORS(api)

current_user_id = 1


@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars().all()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        response_body['message'] = 'Listado de Usuarios'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Users(email=data.get('email'), password=data.get('password'), is_active=data.get('is_active', True), first_name=data.get('first_name'), last_name=data.get('last_name'))
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Usuario creado'
        return response_body, 201

@api.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def user(user_id):
    response_body = {}
    if request.method == 'GET':
        row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if not row:
            raise APIException("User not found", 404)
        response_body['results'] = row.serialize()
        response_body['message'] = 'Perfil del usuario'
        return response_body, 200
    if request.method == 'PUT':
        row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if not row:
            raise APIException("User not found", 404)
        data = request.json
        for key, value in data.items():
            setattr(row, key, value)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Usuario actualizado'
        return response_body, 200
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if not row:
            raise APIException("User not found", 404)
        for post in row.posts_to:
            db.session.delete(post)
        for comment in row.coments_to:
            db.session.delete(comment)
        for follower in row.followers_to:
            db.session.delete(follower)
        for following in row.following_to:
            db.session.delete(following)
        for fav in row.character_favorites_to:
            db.session.delete(fav)
        for fav in row.planet_favorites_to:
            db.session.delete(fav)
        for fav in row.vehicle_favorites_to:
            db.session.delete(fav)
        db.session.delete(row)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Usuario eliminado'
        return response_body, 200

@api.route('/users/favorites', methods=['GET'])
def user_favorites():
    response_body = {}
    current_user_record = db.session.execute(db.select(Users).where(Users.id == current_user_id)).scalar()
    if not current_user_record:
        response_body['results'] = {"people": [], "planets": [], "vehicles": []}
        response_body['message'] = 'Favoritos del usuario'
        return response_body, 200
    character_favorites_list = db.session.execute(db.select(CharacterFavorites).where(CharacterFavorites.user_id == current_user_id)).scalars().all()
    planet_favorites_list = db.session.execute(db.select(PlanetFavorites).where(PlanetFavorites.user_id == current_user_id)).scalars().all()
    vehicle_favorites_list = db.session.execute(db.select(VehicleFavorites).where(VehicleFavorites.user_id == current_user_id)).scalars().all()
    favorite_characters_data = []
    for character_favorite in character_favorites_list:
        character_record = db.session.execute(db.select(Characters).where(Characters.id == character_favorite.character_id)).scalar()
        if character_record:
            favorite_characters_data.append({
                "uid": character_record.id,
                "name": character_record.name,
                "url": f"/api/people/{character_record.id}"
            })
    favorite_planets_data = []
    for planet_favorite in planet_favorites_list:
        planet_record = db.session.execute(db.select(Planets).where(Planets.id == planet_favorite.planet_id)).scalar()
        if planet_record:
            favorite_planets_data.append({
                "uid": planet_record.id,
                "name": planet_record.name,
                "url": f"/api/planets/{planet_record.id}"
            })
    favorite_vehicles_data = []
    for vehicle_favorite in vehicle_favorites_list:
        vehicle_record = db.session.execute(db.select(Vehicles).where(Vehicles.id == vehicle_favorite.vehicle_id)).scalar()
        if vehicle_record:
            favorite_vehicles_data.append({
                "uid": vehicle_record.id,
                "name": vehicle_record.name,
                "url": f"/api/vehicles/{vehicle_record.id}"
            })
    favorites = {
        "people": favorite_characters_data,
        "planets": favorite_planets_data,
        "vehicles": favorite_vehicles_data
    }
    response_body['results'] = favorites
    response_body['message'] = 'Favoritos del usuario'
    return response_body, 200

@api.route('/posts', methods=['GET', 'POST'])
def posts():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Posts)).scalars().all()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        response_body['message'] = 'Listado de Posts'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        requested_user_id = data.get('user_id')
        user_record = db.session.execute(db.select(Users).where(Users.id == requested_user_id)).scalar()
        if not user_record:
            raise APIException("User not found", 500)
        row = Posts(title=data.get('title'), description=data.get('description'), body=data.get('body'), image_url=data.get('image_url'), user_id=data.get('user_id'))
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Post creado'
        return response_body, 201

@api.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def post(post_id):
    response_body = {}
    if request.method == 'GET':
        row = db.session.execute(db.select(Posts).where(Posts.id == post_id)).scalar()
        if not row:
            raise APIException("Post not found", 404)
        response_body['results'] = row.serialize()
        response_body['message'] = 'Contenido del post'
        return response_body, 200
    if request.method == 'PUT':
        row = db.session.execute(db.select(Posts).where(Posts.id == post_id)).scalar()
        if not row:
            raise APIException("Post not found", 404)
        data = request.json
        for key, value in data.items():
            setattr(row, key, value)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Post actualizado'
        return response_body, 200
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Posts).where(Posts.id == post_id)).scalar()
        if not row:
            raise APIException("Post not found", 404)
        db.session.delete(row)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Post eliminado'
        return response_body, 200

@api.route('/comments', methods=['GET', 'POST'])
def comments():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comments)).scalars().all()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        response_body['message'] = 'Listado de Comentarios'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        requested_user_id = data.get('user_id')
        user_record = db.session.execute(db.select(Users).where(Users.id == requested_user_id)).scalar()
        if not user_record:
            raise APIException("User not found", 500)
        requested_post_id = data.get('post_id')
        post_record = db.session.execute(db.select(Posts).where(Posts.id == requested_post_id)).scalar()
        if not post_record:
            raise APIException("Post not found", 500)
        row = Comments(body=data.get('body'), user_id=data.get('user_id'), post_id=data.get('post_id'))
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Comentario creado'
        return response_body, 201

@api.route('/comments/<int:comment_id>', methods=['DELETE'])
def comment(comment_id):
    response_body = {}
    row = db.session.execute(db.select(Comments).where(Comments.id == comment_id)).scalar()
    if not row:
        raise APIException("Comment not found", 404)
    db.session.delete(row)
    db.session.commit()
    response_body['results'] = None
    response_body['message'] = 'Comentario eliminado'
    return response_body, 200

@api.route('/followers', methods=['GET'])
def followers():
    response_body = {}
    rows = db.session.execute(db.select(Followers)).scalars().all()
    results = [row.serialize() for row in rows]
    response_body['results'] = results
    response_body['message'] = 'Listado de Seguidores'
    return response_body, 200

@api.route('/followers/<int:user_id>', methods=['POST', 'DELETE'])
def follow(user_id):
    response_body = {}
    if request.method == 'POST':
        row = Followers(following_id=user_id, follower_id=current_user_id)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Ahora sigues al usuario'
        return response_body, 201
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Followers).where(Followers.following_id == user_id, Followers.follower_id == current_user_id)).scalar()
        if not row:
            raise APIException("Follow relationship not found", 404)
        db.session.delete(row)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Has dejado de seguir al usuario'
        return response_body, 200

@api.route('/people', methods=['GET', 'POST'])
def people():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Characters)).scalars().all()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        response_body['message'] = 'Listado de Personajes'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Characters(**data)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Personaje creado'
        return response_body, 201

@api.route('/people/<int:people_id>', methods=['GET', 'PUT', 'DELETE'])
def person(people_id):
    response_body = {}
    if request.method == 'GET':
        row = db.session.execute(db.select(Characters).where(Characters.id == people_id)).scalar()
        if not row:
            raise APIException("Person not found", 404)
        response_body['results'] = row.serialize()
        response_body['message'] = 'Personaje encontrado'
        return response_body, 200
    if request.method == 'PUT':
        row = db.session.execute(db.select(Characters).where(Characters.id == people_id)).scalar()
        if not row:
            raise APIException("Person not found", 404)
        data = request.json
        for key, value in data.items():
            setattr(row, key, value)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Personaje actualizado'
        return response_body, 200
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Characters).where(Characters.id == people_id)).scalar()
        if not row:
            raise APIException("Person not found", 404)
        db.session.delete(row)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Personaje eliminado'
        return response_body, 200

@api.route('/planets', methods=['GET', 'POST'])
def planets():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Planets)).scalars().all()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        response_body['message'] = 'Listado de Planetas'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Planets(**data)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Planeta creado'
        return response_body, 201

@api.route('/planets/<int:planet_id>', methods=['GET', 'PUT', 'DELETE'])
def planet(planet_id):
    response_body = {}
    if request.method == 'GET':
        row = db.session.execute(db.select(Planets).where(Planets.id == planet_id)).scalar()
        if not row:
            raise APIException("Planet not found", 404)
        response_body['results'] = row.serialize()
        response_body['message'] = 'Planeta encontrado'
        return response_body, 200
    if request.method == 'PUT':
        row = db.session.execute(db.select(Planets).where(Planets.id == planet_id)).scalar()
        if not row:
            raise APIException("Planet not found", 404)
        data = request.json
        for key, value in data.items():
            setattr(row, key, value)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Planeta actualizado'
        return response_body, 200
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Planets).where(Planets.id == planet_id)).scalar()
        if not row:
            raise APIException("Planet not found", 404)
        db.session.delete(row)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Planeta eliminado'
        return response_body, 200

@api.route('/favorite/people/<int:people_id>', methods=['POST', 'DELETE'])
def handle_people_fav(people_id):
    response_body = {}
    if request.method == 'POST':
        existing_fav = db.session.execute(db.select(CharacterFavorites).where(CharacterFavorites.user_id == current_user_id, CharacterFavorites.character_id == people_id)).scalar()
        if existing_fav:
            raise APIException("This character is already a favorite", 400)
        fav = CharacterFavorites(user_id=current_user_id, character_id=people_id)
        db.session.add(fav)
        db.session.commit()
        response_body['results'] = fav.serialize()
        response_body['message'] = 'Favorito añadido'
        return response_body, 201
    if request.method == 'DELETE':
        fav = db.session.execute(db.select(CharacterFavorites).where(CharacterFavorites.user_id == current_user_id, CharacterFavorites.character_id == people_id)).scalar()
        if not fav:
            raise APIException("Favorite not found", 404)
        db.session.delete(fav)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Favorito eliminado'
        return response_body, 200

@api.route('/favorite/planet/<int:planet_id>', methods=['POST', 'DELETE'])
def handle_planet_fav(planet_id):
    response_body = {}
    if request.method == 'POST':
        existing_fav = db.session.execute(db.select(PlanetFavorites).where(PlanetFavorites.user_id == current_user_id, PlanetFavorites.planet_id == planet_id)).scalar()
        if existing_fav:
            raise APIException("This planet is already a favorite", 400)
        fav = PlanetFavorites(user_id=current_user_id, planet_id=planet_id)
        db.session.add(fav)
        db.session.commit()
        response_body['results'] = fav.serialize()
        response_body['message'] = 'Favorito añadido'
        return response_body, 201
    if request.method == 'DELETE':
        fav = db.session.execute(db.select(PlanetFavorites).where(PlanetFavorites.user_id == current_user_id, PlanetFavorites.planet_id == planet_id)).scalar()
        if not fav:
            raise APIException("Favorite not found", 404)
        db.session.delete(fav)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Favorito eliminado'
        return response_body, 200

@api.route('/vehicles', methods=['GET', 'POST'])
def vehicles():
    response_body = {}
    if request.method == 'GET':
        vehicle_list = db.session.execute(db.select(Vehicles)).scalars().all()
        results = [vehicle.serialize() for vehicle in vehicle_list]
        response_body['results'] = results
        response_body['message'] = 'Listado de Vehiculos'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        if not data.get('name'):
            raise APIException("Name is required", 400)
        if not data.get('model'):
            raise APIException("Model is required", 400)
        if not data.get('manufacturer'):
            raise APIException("Manufacturer is required", 400)
        if not data.get('vehicle_class'):
            raise APIException("Vehicle class is required", 400)
        new_vehicle = Vehicles(**data)
        db.session.add(new_vehicle)
        db.session.commit()
        response_body['results'] = new_vehicle.serialize()
        response_body['message'] = 'Vehiculo creado'
        return response_body, 201

@api.route('/vehicles/<int:vehicle_id>', methods=['GET', 'PUT', 'DELETE'])
def vehicle(vehicle_id):
    response_body = {}
    if request.method == 'GET':
        vehicle = db.session.execute(db.select(Vehicles).where(Vehicles.id == vehicle_id)).scalar()
        if not vehicle:
            raise APIException("Vehicle not found", 404)
        response_body['results'] = vehicle.serialize()
        response_body['message'] = 'Vehiculo encontrado'
        return response_body, 200
    if request.method == 'PUT':
        vehicle = db.session.execute(db.select(Vehicles).where(Vehicles.id == vehicle_id)).scalar()
        if not vehicle:
            raise APIException("Vehicle not found", 404)
        data = request.json
        for key, value in data.items():
            setattr(vehicle, key, value)
        db.session.commit()
        response_body['results'] = vehicle.serialize()
        response_body['message'] = 'Vehiculo actualizado'
        return response_body, 200
    if request.method == 'DELETE':
        vehicle = db.session.execute(db.select(Vehicles).where(Vehicles.id == vehicle_id)).scalar()
        if not vehicle:
            raise APIException("Vehicle not found", 404)
        db.session.delete(vehicle)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Vehiculo eliminado'
        return response_body, 200

@api.route('/favorite/vehicle/<int:vehicle_id>', methods=['POST', 'DELETE'])
def handle_vehicle_fav(vehicle_id):
    response_body = {}
    if request.method == 'POST':
        existing_favorite = db.session.execute(db.select(VehicleFavorites).where(VehicleFavorites.user_id == current_user_id, VehicleFavorites.vehicle_id == vehicle_id)).scalar()
        if existing_favorite:
            raise APIException("This vehicle is already a favorite", 400)
        new_favorite = VehicleFavorites(user_id=current_user_id, vehicle_id=vehicle_id)
        db.session.add(new_favorite)
        db.session.commit()
        response_body['results'] = new_favorite.serialize()
        response_body['message'] = 'Favorito añadido'
        return response_body, 201
    if request.method == 'DELETE':
        favorite = db.session.execute(db.select(VehicleFavorites).where(VehicleFavorites.user_id == current_user_id, VehicleFavorites.vehicle_id == vehicle_id)).scalar()
        if not favorite:
            raise APIException("Favorite not found", 404)
        db.session.delete(favorite)
        db.session.commit()
        response_body['results'] = None
        response_body['message'] = 'Favorito eliminado'
        return response_body, 200

