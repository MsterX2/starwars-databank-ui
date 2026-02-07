import os
# import inspect
from flask_admin import Admin
from .models import db, Users, Posts, Comments, Medias, Followers, Characters, CharacterFavorites, Planets, PlanetFavorites, Vehicles, VehicleFavorites
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin',
                  theme=Bootstrap4Theme(swatch='cerulean'))

    # Dynamically add all models to the admin interface
    # for name, obj in inspect.getmembers(models):
    #     # Verify that the object is a SQLAlchemy model before adding it to the admin.
    #     if inspect.isclass(obj) and issubclass(obj, db.Model):
    #         admin.add_view(ModelView(obj, db.session))
    # admin.add_view(ModelView(obj, db.session)
    admin.add_view(ModelView(Users, db.session))
    admin.add_view(ModelView(Posts, db.session))
    admin.add_view(ModelView(Comments, db.session))
    admin.add_view(ModelView(Medias, db.session))
    admin.add_view(ModelView(Followers, db.session))
    admin.add_view(ModelView(Characters, db.session))
    admin.add_view(ModelView(CharacterFavorites, db.session))
    admin.add_view(ModelView(Planets, db.session))
    admin.add_view(ModelView(PlanetFavorites, db.session))
    admin.add_view(ModelView(Vehicles, db.session))
    admin.add_view(ModelView(VehicleFavorites, db.session))
