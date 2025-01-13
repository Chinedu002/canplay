import os
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Set the upload folder and allowed file extensions
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'avi', 'mov', 'mkv'}
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Limit file size to 50MB

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Route for the homepage
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle video upload
@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video-file' not in request.files:
        return redirect(request.url)
    
    video_file = request.files['video-file']
    
    # If no file is selected, return to the page
    if video_file.filename == '':
        return redirect(request.url)
    
    if video_file and allowed_file(video_file.filename):
        filename = secure_filename(video_file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video_file.save(file_path)
        
        # Optionally, you can store the video details (title, description) in a database
        
        return redirect(url_for('home'))
    
    return "File type not allowed", 400

# Route to view uploaded videos (optional, for now just returning the home page)
@app.route('/videos')
def videos():
    video_list = os.listdir(app.config['UPLOAD_FOLDER'])
    return render_template('videos.html', video_list=video_list)

# Running the Flask app
if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Run the app
    app.run(debug=True)
