from flash import flash

app = Flask(__name__)

@app.route('/')
def hello():
    flash('Hello, World!')
