from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Usa la variable de entorno DATABASE_URL de Render
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Usuario y contraseña predefinidos (puedes cambiarlos)
USUARIO = 'vayavalla'
CLAVE = 'palayenti2512'

# Ruta de login
@app.route('/', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        usuario = request.form['username']
        clave = request.form['password']
        if usuario == USUARIO and clave == CLAVE:
            return redirect(url_for('index'))  # Redirige a /index si es correcto
        else:
            error = 'Usuario o contraseña incorrectos.'
    return render_template('login.html', error=error)

# Página principal protegida (index)
@app.route('/index')
def index():
    return render_template('index.html')

# Ruta para la página de movimientos
@app.route('/movimientos')
def movimientos():
    return render_template('movimientos.html')

# Ruta para la página de trabajos
@app.route('/trabajos')
def trabajos():
    return render_template('trabajos.html')

# Clase Movimiento (debe estar fuera de las funciones de ruta)
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

if __name__ == '__main__':
    app.run(debug=True)
