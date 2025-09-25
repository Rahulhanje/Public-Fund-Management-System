from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import process_document
from django.core.files.uploadedfile import UploadedFile
import json
import traceback
import logging

logger = logging.getLogger(__name__)

class DocumentAnalysisView(APIView):
    """
    API endpoint for analyzing government funding documents.
    """
    
    def post(self, request, *args, **kwargs):
        try:
            print("=== DocumentAnalysisView POST Request ===")
            print(f"Request FILES: {request.FILES}")
            print(f"Request data: {request.data}")
            
            # Check if file is in request
            if 'file' not in request.FILES:
                print("Error: No file provided")
                return Response(
                    {"error": "No file provided"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get file from request
            file = request.FILES['file']
            print(f"File received: {file.name}, Size: {file.size}, Type: {file.content_type}")
            
            # Get custom questions if provided
            custom_questions = None
            if 'custom_questions' in request.data:
                try:
                    custom_questions = json.loads(request.data['custom_questions'])
                    print(f"Custom questions: {custom_questions}")
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}")
                    return Response(
                        {"error": "Invalid format for custom_questions"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            print("Starting document processing...")
            # Process document
            result = process_document(file, custom_questions)
            print(f"Processing completed. Result status: {result.get('status', 'Unknown')}")
            
            return Response(result, status=status.HTTP_200_OK)
            
        except ValueError as e:
            print(f"ValueError: {e}")
            logger.error(f"ValueError in document analysis: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Exception: {e}")
            print(f"Traceback: {traceback.format_exc()}")
            logger.error(f"Exception in document analysis: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )