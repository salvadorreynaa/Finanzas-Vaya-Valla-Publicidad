from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
