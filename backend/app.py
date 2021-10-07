import os
import boto3
import logging

from botocore.exceptions import ClientError
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_API_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET'),
    endpoint_url=os.getenv('S3_ENDPOINT'))


def create_presigned_post(bucket_name, object_name,
                          fields=None, conditions=None, expiration=3600):
    """Generate a presigned URL S3 POST request to upload a file

    :param bucket_name: string
    :param object_name: string
    :param fields: Dictionary of prefilled form fields
    :param conditions: List of conditions to include in the policy
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Dictionary with the following keys:
        url: URL to post to
        fields: Dictionary of form fields and values to submit with the POST
    :return: None if error.
    """

    try:
        response = s3_client.generate_presigned_post(bucket_name,
                                                     object_name,
                                                     Fields=fields,
                                                     Conditions=conditions,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL and required fields
    return response


@app.route("/api/getPreSignedUploadUrl")
def getPreSignedUrl():
    filename = request.args.get('filename')
    response = create_presigned_post('storage-abcd', filename)
    return response