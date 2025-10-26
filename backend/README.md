# Backend - AI-Powered Document Verification API

[![Django](https://img.shields.io/badge/Django-5.1.7-green.svg)](https://djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.21-purple.svg)](https://langchain.com/)
[![Groq](https://img.shields.io/badge/Groq-0.20.0-orange.svg)](https://groq.com/)

## 🌟 Overview

The backend is a sophisticated Django REST API that provides automated funding approval analysis using **Retrieval Augmented Generation (RAG)** technology. It analyzes government documents to determine if project funding should be approved, rejected, or requires further review.

## 🏗️ Architecture

```
📦 backend/
├── 📁 APIs/                    # Main Django app
│   ├── 📄 models.py           # Database models
│   ├── 📄 views.py            # API endpoints
│   ├── 📄 urls.py             # URL routing
│   ├── 📄 utils.py            # AI/RAG utilities
│   └── 📁 migrations/         # Database migrations
├── 📁 backend/                # Django project settings
│   ├── 📄 settings.py         # Project configuration
│   ├── 📄 urls.py             # Main URL configuration
│   ├── 📄 wsgi.py             # WSGI configuration
│   └── 📄 memory_middleware.py # Custom middleware
├── 📄 manage.py               # Django management script
├── 📄 requirements.txt        # Python dependencies
├── 📄 db.sqlite3             # SQLite database
└── 📄 README.md              # This file
```

## ✨ Features

- **🤖 AI-Powered Document Analysis**: Uses advanced LLM models for intelligent document processing
- **📄 Multi-Format Support**: Handles PDF, DOCX, and TXT files
- **🔍 RAG Technology**: Implements Retrieval Augmented Generation for accurate analysis
- **📊 Vector Database**: Uses FAISS for efficient document embedding storage
- **🔒 Secure API**: RESTful API with proper error handling and validation
- **⚡ Fast Processing**: Optimized document processing pipeline
- **🌐 CORS Enabled**: Cross-origin resource sharing for frontend integration

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **pip** (Python package manager)
- **Groq API Key** (for LLM access)

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/Rahulhanje/Public-Fund-Management-System-.git
cd Public-Fund-Management-System-/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here
DJANGO_SECRET_KEY=your_super_secret_django_key

# Optional (Development)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Database (Optional - uses SQLite by default)
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. Database Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 5. Start Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## 📡 API Documentation

### Main Endpoint

#### Document Analysis
```http
POST /analyze/
Content-Type: multipart/form-data
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | ✅ Yes | Document to analyze (PDF, DOCX, TXT) |
| `custom_questions` | JSON Array | ❌ No | Additional questions about the document |

**Example Request:**
```bash
curl -X POST \
  -F "file=@proposal.pdf" \
  -F "custom_questions=[\"What is the project timeline?\", \"Who are the stakeholders?\"]" \
  http://localhost:8000/analyze/
```

**Response Format:**
```json
{
  "status": "APPROVED|REJECTED|REVIEW",
  "report": {
    "analysis": [
      {
        "Question": "What is the budget amount?",
        "Answer": "The approved budget is $2.5 million."
      }
    ],
    "decision": "Detailed decision reasoning..."
  },
  "cid_hash": "ipfs_content_identifier"
}
```

### Health Check Endpoint
```http
GET /health/
```

Returns server status and system information.

## 🧠 AI/ML Components

### RAG (Retrieval Augmented Generation) Pipeline

1. **📄 Document Loading**
   ```python
   # Supported formats
   - PDF: PyPDFLoader
   - DOCX: Docx2txtLoader  
   - TXT: TextLoader
   ```

2. **✂️ Text Chunking**
   ```python
   RecursiveCharacterTextSplitter(
       chunk_size=1000,
       chunk_overlap=200
   )
   ```

3. **🔢 Embedding Generation**
   ```python
   HuggingFaceEmbeddings(
       model_name="sentence-transformers/all-MiniLM-L6-v2"
   )
   ```

4. **🗄️ Vector Store**
   ```python
   FAISS.from_documents(chunks, embeddings)
   ```

5. **🤖 LLM Integration**
   ```python
   ChatGroq(
       model_name="llama3-70b-8192",
       temperature=0
   )
   ```

### Standard Evaluation Questions

The system evaluates documents using these criteria:

- **💰 Budget Analysis**: Budget approval and expenditure alignment
- **🎯 Objective Assessment**: Project goals and government priority alignment
- **📅 Timeline Evaluation**: Implementation schedule and milestones
- **📊 Deliverables Review**: Expected outcomes and measurable results
- **💸 Fund Utilization**: Detailed breakdown of fund allocation
- **⚠️ Risk Assessment**: Potential issues and mitigation strategies
- **🚨 Red Flag Detection**: Inconsistencies or suspicious elements

### Decision Logic

```python
def determine_approval_status(analysis_results):
    """
    APPROVED: Clear objectives, proper budget alignment, low risk
    REJECTED: Misaligned objectives, budget issues, high risk
    REVIEW: Requires human evaluation for edge cases
    """
```

## 🗄️ Database Models

### Document Model
```python
class DocumentAnalysis(models.Model):
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10)
    analysis_result = models.JSONField()
    status = models.CharField(max_length=20)
    cid_hash = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## 🔧 Configuration

### Django Settings Highlights

```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth', 
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'APIs',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'backend.memory_middleware.MemoryUsageMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ... other middleware
]

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True  # Development only
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Memory Management

Custom middleware monitors memory usage:

```python
class MemoryUsageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Memory monitoring logic
        response = self.get_response(request)
        return response
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python manage.py test

# Run specific tests
python manage.py test APIs.tests

# Test with coverage
pip install coverage
coverage run manage.py test
coverage report
```

### Test Files Available
- `test_ai_imports.py` - AI library imports
- `test_document_processing.py` - Document processing pipeline
- `test_groq_models.py` - Groq API integration

### Example Test
```python
class DocumentAnalysisTestCase(TestCase):
    def test_pdf_analysis(self):
        with open('test_document.pdf', 'rb') as f:
            response = self.client.post('/analyze/', {
                'file': f
            })
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.json())
```

## 🚀 Production Deployment

### 1. Environment Variables
```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:pass@localhost/dbname
GROQ_API_KEY=your_production_groq_key
```

### 2. Database Migration
```bash
python manage.py migrate --settings=backend.settings.production
```

### 3. Static Files Collection
```bash
python manage.py collectstatic --noinput
```

### 4. Gunicorn Deployment
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --timeout 120 \
    --max-requests 1000
```

### 5. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/staticfiles/;
    }
}
```

## 📊 Performance Optimization

### 1. Caching
```python
# Cache embeddings for frequently analyzed documents
from django.core.cache import cache

def get_or_create_embeddings(document_hash):
    embeddings = cache.get(f"embeddings_{document_hash}")
    if not embeddings:
        embeddings = generate_embeddings(document)
        cache.set(f"embeddings_{document_hash}", embeddings, 3600)
    return embeddings
```

### 2. Async Processing
```python
# For large documents, consider async processing
from celery import shared_task

@shared_task
def process_document_async(file_path):
    return analyze_document(file_path)
```

### 3. Database Optimization
```python
# Add database indexes for frequent queries
class Meta:
    indexes = [
        models.Index(fields=['status', 'created_at']),
        models.Index(fields=['file_type']),
    ]
```

## 🔒 Security Considerations

### 1. File Upload Security
```python
# Validate file types and sizes
ALLOWED_FILE_TYPES = ['pdf', 'docx', 'txt']
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file):
    if file.size > MAX_FILE_SIZE:
        raise ValidationError("File too large")
    
    file_type = file.name.split('.')[-1].lower()
    if file_type not in ALLOWED_FILE_TYPES:
        raise ValidationError("Unsupported file type")
```

### 2. API Rate Limiting
```python
# Install django-ratelimit
pip install django-ratelimit

from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/m', method='POST')
def analyze_view(request):
    # Analysis logic
```

### 3. Environment Security
```python
# Use strong secret keys
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# Secure headers
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Groq API Errors
```bash
# Check API key
echo $GROQ_API_KEY

# Test API connection
python test_groq_models.py
```

#### 2. Memory Issues
```bash
# Monitor memory usage
python monitor_server.py

# Adjust chunk sizes in utils.py
chunk_size = 500  # Reduce for lower memory usage
```

#### 3. File Processing Errors
```bash
# Check file permissions
ls -la uploaded_file.pdf

# Test document processing
python test_document_processing.py
```

#### 4. Database Issues
```bash
# Reset database
rm db.sqlite3
python manage.py migrate

# Check migrations
python manage.py showmigrations
```

## 📚 Additional Resources

### Dependencies Explanation

**Core Framework:**
- `Django==5.1.7` - Web framework
- `djangorestframework==3.15.2` - REST API toolkit
- `django-cors-headers==4.7.0` - CORS handling

**AI/ML Libraries:**
- `langchain==0.3.21` - LLM application framework
- `langchain-groq==0.3.1` - Groq integration
- `langchain-huggingface==0.1.2` - HuggingFace integration
- `groq==0.20.0` - Groq API client

**Document Processing:**
- `pypdf==5.4.0` - PDF processing
- `docx2txt==0.8` - DOCX processing
- `faiss-cpu==1.10.0` - Vector similarity search

**Production:**
- `gunicorn==21.2.0` - WSGI HTTP Server
- `whitenoise==6.6.0` - Static file serving

### Useful Scripts

#### Fix Dependencies
```bash
python fix_dependencies.py
```

#### Monitor Server Performance
```bash
python monitor_server.py
```

#### Test AI Setup
```bash
python test_ai_imports.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- Follow PEP 8 for Python code
- Use meaningful variable names
- Add docstrings for functions
- Include type hints where appropriate

## 📄 License

This project is licensed under the MIT License - see the main repository LICENSE file for details.

## 🆘 Support

For backend-specific issues:
- Check the logs: `python manage.py runserver --verbosity 2`
- Review error messages in the Django admin
- Test individual components using the provided test scripts

---

**🔗 Related Documentation:**
- [Main Project README](../README.md)
- [Frontend Documentation](../frontend/README.md)
- [Smart Contracts Documentation](../smart-contracts/README.md)