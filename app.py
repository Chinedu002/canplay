from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

# Set up file upload path
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'avi', 'mov', 'mkv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video-file' not in request.files:
        return redirect(request.url)
    
    video_file = request.files['video-file']
    
    if video_file.filename == '':
        return redirect(request.url)
    
    if video_file and allowed_file(video_file.filename):
        filename = os.path.join(app.config['UPLOAD_FOLDER'], video_file.filename)
        video_file.save(filename)
        return redirect(url_for('home'))
    
    return "File type not allowed", 400

if __name__ == '__main__':
    app.run(debug=True)
