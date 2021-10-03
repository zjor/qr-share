import boto3
import logging

from botocore.exceptions import ClientError


AWS_ACCESS_KEY = 'AKIAVXTQRN7WFPQ3PNBX'
AWS_SECRET_KEY = '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'

s3 = boto3.client(
	's3',
	aws_access_key_id=AWS_ACCESS_KEY,
	aws_secret_access_key=AWS_SECRET_KEY)


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


if __name__ == "__main__":
	response = create_presigned_post('storage-abcd', 'image.jpg')
	print(response)