from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import os

# Inicialización de Flask
app = Flask(__name__)

# Configuración de la base de datos (Render define DATABASE_URL como variable de entorno)
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Usuario y contraseña predefinidos
USUARIO = 'vayavalla'
CLAVE = 'palayenti2512'

# -------------------------------
# MODELOS
# -------------------------------

class Movimiento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.String(100))
    cliente = db.Column(db.String(100))
    fecha = db.Column(db.String(20))
    mes = db.Column(db.String(20))
    año = db.Column(db.String(10))
    monto = db.Column(db.Float)
    estado = db.Column(db.String(20))

# -------------------------------
# FUNCIONES Y RUTAS
# -------------------------------

@app.before_first_request
def create_tables():
    try:
        db.create_all()
        print("✅ Tablas creadas correctamente.")
    except Exception as e:
        print(f"❌ Error al crear tablas: {e}")

#
