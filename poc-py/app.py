import os
import boto3
import logging

from botocore.config import Config
from botocore.exceptions import ClientError


boto_config = Config(
    region_name = os.getenv('REGION'),
    signature_version = 's3v4',
)

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_API_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET'),
    endpoint_url=os.getenv('S3_ENDPOINT'),
    config=boto_config)


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


def upload_file(file_name, bucket, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_name)

    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True


if __name__ == "__main__":
    bucket_name = 'storage-abcd'
    response = upload_file('app.py', bucket_name)
    print(response)

