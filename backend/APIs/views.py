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
            error_msg = str(e)
            print(f"ValueError: {error_msg}")
            logger.error(f"ValueError in document analysis: {error_msg}")
            
            # Check for specific import errors and provide helpful messages
            if "pypdf" in error_msg.lower() or "pdf" in error_msg.lower():
                error_msg = "PDF processing library missing. Please run: pip install pypdf PyPDF2"
            
            return Response(
                {"error": error_msg, "suggestion": "Check if all required packages are installed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            error_msg = str(e)
            print(f"Exception: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            logger.error(f"Exception in document analysis: {error_msg}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            
            # Provide more helpful error messages
            if "pypdf" in error_msg.lower():
                error_msg = "PDF library not found. Please install: pip install pypdf"
            elif "groq" in error_msg.lower():
                error_msg = "GROQ API issue. Check your API key and internet connection."
            elif "huggingface" in error_msg.lower():
                error_msg = "HuggingFace embedding issue. This may be a temporary network problem."
            
            return Response(
                {
                    "error": f"Processing failed: {error_msg}",
                    "type": "system_error",
                    "suggestion": "Please check the server logs and ensure all dependencies are installed"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )