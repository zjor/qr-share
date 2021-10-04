import json
import boto3
import logging

from botocore.exceptions import ClientError


QUERY_STRING_PARAMETERS_KEY = 'queryStringParameters'
FILENAME_KEY = 'filename'


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

    # Generate a presigned S3 POST URL
    s3_client = boto3.client('s3')
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
    

def getBadRequest(message: str):
    return {
        'statusCode': 400,
        'body': json.dumps(message)
    }


def lambda_handler(event, context):
    
    if QUERY_STRING_PARAMETERS_KEY not in event:
        return getBadRequest(f"Query string is empty. '{FILENAME_KEY}' parameter is required.")

    if FILENAME_KEY not in event[QUERY_STRING_PARAMETERS_KEY]:
        return getBadRequest(f"'{FILENAME_KEY}' parameter is required")
        
    response = create_presigned_post('storage-abcd', event[QUERY_STRING_PARAMETERS_KEY][FILENAME_KEY])
        
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
