import logging
import os

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/tmp/'
app.config['S3_BUCKET'] = 'storage-abcd'

CORS(app)

boto_config = Config(
    region_name=os.getenv('REGION'),
    signature_version='s3v4',
)

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_API_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET'),
    endpoint_url=os.getenv('S3_ENDPOINT'),
    config=boto_config)


@app.route("/", methods=['GET'])
def index():
    return render_template("index.html")


@app.route("/api/upload", methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'file is not present'}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(full_path)

    try:
        object_name = file.filename
        s3_client.upload_file(full_path, app.config['S3_BUCKET'], object_name)
    except ClientError as e:
        logging.error(e)
        return jsonify({'success': False, 'error': e}), 500
    finally:
        os.remove(full_path)

    return jsonify({'success': True, 'filename': filename})
