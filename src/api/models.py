from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    email = db.Column(  db.String(), unique=True, nullable=False)
    password = db.Column(  db.String(), unique=False, nullable=False)
    is_active = db.Column(  db.Boolean, unique=False, nullable=False)
    first_name = db.Column(  db.String(80), unique=False, nullable=False)
    last_name = db.Column(  db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.id}: {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "email": self.email,
                "is_active": self.is_active}


class Posts(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    title = db.Column(  db.String(80), unique=True, nullable=False)
    description = db.Column(  db.String(), unique=False, nullable=False)
    body = db.Column(  db.String(), unique=False, nullable=False)
    date = db.Column(  db.DateTime, unique=False, nullable=False,
                       default=datetime.now)
    image_url = db.Column(  db.String(), unique=False, nullable=False)
    user_id = db.Column(  db.Integer, db.ForeignKey("users.id"))
    user_to = db.relationship(  "Users", foreign_keys=[user_id],
                                backref=db.backref("posts_to", lazy="select"))

    def __repr__(self):
        return f'<Post: {self.id} -> {self.title}>'

    def serialize(self):
        return {"id": self.id,
                "title": self.title,
                "description": self.description,
                "body": self.body,
                "date": self.date,
                "image_url": self.image_url,
                "user_id": self.user_id}


class Comments(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    body = db.Column(  db.String(), unique=True, nullable=False)
    user_id = db.Column(  db.Integer, db.ForeignKey("users.id"),
                          unique=False, nullable=False)
    post_id = db.Column(  db.Integer, db.ForeignKey("posts.id"),
                          unique=False, nullable=False)
    user_to = db.relationship(  "Users", foreign_keys=[user_id],
                                backref=db.backref("coments_to", lazy="select"))
    post_to = db.relationship(  "Posts", foreign_keys=[post_id],
                                backref=db.backref("coments_to", lazy="select"))

    def __repr__(self):
        return f'<Comment: {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "body": self.body,
                "user_id": self.user_id,
                "post_id": self.post_id}


class Medias(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    media_type = db.Column(  db.Enum("image", "video", "audio",
                                     name="media_type"),
                             nullable=False)
    url = db.Column(  db.String(), unique=False, nullable=False)
    post_id = db.Column(  db.Integer, db.ForeignKey("posts.id"),
                          unique=False, nullable=False)
    post_to = db.relationship(  "Posts", foreign_keys=[post_id],
                                backref=db.backref("media_to", lazy="select"))

    def __repr__(self):
        return f'<Media {self.id}: {self.media_type}>'

    def serialize(self):
        return {"id": self.id,
                "media_type": self.media_type,
                "url": self.url,
                "post_id": self.post_id}


class Followers(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    following_id = db.Column(  db.Integer, db.ForeignKey("users.id"),
                               unique=False, nullable=False)
    follower_id = db.Column(  db.Integer, db.ForeignKey("users.id"),
                              unique=False, nullable=False)
    user_to = db.relationship(  "Users", foreign_keys=[following_id],
                                backref=db.backref("followers_to", lazy="select"))
    user_from = db.relationship(  "Users", foreign_keys=[follower_id],
                                  backref=db.backref("following_to", lazy="select"))

    def __repr__(self):
        return f'<{self.follower_id} is following {self.following_id}>'

    def serialize(self):
        return {"id": self.id,
                "following_id": self.following_id,
                "follower_id": self.follower_id}


class Characters(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    name = db.Column(  db.String(120), unique=True, nullable=False)
    height = db.Column(  db.String(120), unique=True, nullable=False)
    mass = db.Column(  db.String(120), unique=True, nullable=False)
    hair_color = db.Column(  db.String(120), unique=True, nullable=False)
    skin_color = db.Column(  db.String(120), unique=True, nullable=False)
    eye_color = db.Column(  db.String(120), unique=True, nullable=False)
    birth_year = db.Column(  db.String(120), unique=True, nullable=False)
    gender = db.Column(  db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<Character {self.name}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "height": self.height,
                "mass": self.mass,
                "hair_color": self.hair_color,
                "skin_color": self.skin_color,
                "eye_color": self.eye_color,
                "birth_year": self.birth_year,
                "gender": self.gender}


class CharacterFavorites(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    user_id = db.Column(  db.Integer, db.ForeignKey("users.id"),
                          unique=False, nullable=False)
    character_id = db.Column(  db.Integer, db.ForeignKey("characters.id"),
                               unique=False, nullable=False)
    user_to = db.relationship(  "Users", foreign_keys=[user_id],
                                backref=db.backref("character_favorites_to", lazy="select"))
    characters_to = db.relationship(  "Characters", foreign_keys=[character_id],
                                      backref=db.backref("character_favorites_to", lazy="select"))

    def __repr__(self):
        return (f'<User {self.user_id} has character '
                f'{self.character_id} as favorite character>')

    def serialize(self):
        return {"id": self.id,
                "user_id": self.user_id,
                "character_id": self.character_id}


class Planets(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    name = db.Column(  db.String(), unique=False, nullable=False)
    diameter = db.Column(  db.String(), unique=False, nullable=False)
    rotation_period = db.Column(  db.String(), unique=False, nullable=False)
    orbital_period = db.Column(  db.String(), unique=False, nullable=False)
    gravity = db.Column(  db.String(), unique=False, nullable=False)
    population = db.Column(  db.String(), unique=False, nullable=False)
    climate = db.Column(  db.String(), unique=False, nullable=False)
    terrain = db.Column(  db.String(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Planet {self.id}: {self.name}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "diameter": self.diameter,
                "rotation_period": self.rotation_period,
                "orbital_period": self.orbital_period,
                "gravity": self.gravity,
                "population": self.population,
                "climate": self.climate,
                "terrain": self.terrain}


class PlanetFavorites(db.Model):
    id = db.Column(  db.Integer, primary_key=True)
    user_id = db.Column(  db.Integer, db.ForeignKey("users.id"),
                          unique=False, nullable=False)
    planet_id = db.Column(  db.Integer, db.ForeignKey("planets.id"),
                            unique=False, nullable=False)
    user_to = db.relationship(  "Users", foreign_keys=[user_id],
                                backref=db.backref("planet_favorites_to", lazy="select"))
    planets_to = db.relationship(  "Planets", foreign_keys=[planet_id],
                                   backref=db.backref("planet_favorites_to", lazy="select"))

    def __repr__(self):
        return (f'<User {self.user_id} has planet '
                f'{self.planet_id} as favorite planet>')

    def serialize(self):
        return {"id": self.id,
                "user_id": self.user_id,
                "planet_id": self.planet_id}
