@echo off
echo 🔧 Fixing AI Document Processing Dependencies
echo =============================================

cd "C:\Users\Admin\Desktop\Engineering 7th sem\Major Project_phase2\Public-Fund-Management-main\backend"

echo.
echo 📦 Installing missing PDF processing libraries...
pip install pypdf==5.4.0
pip install PyPDF2==3.0.1

echo.
echo 🤖 Installing/updating AI libraries...
pip install langchain==0.3.21
pip install langchain-community==0.3.20
pip install langchain-groq==0.3.1
pip install langchain-huggingface==0.1.2

echo.
echo 🔍 Installing vector database libraries...
pip install faiss-cpu==1.10.0
pip install sentence-transformers==3.4.1

echo.
echo ✅ Running dependency test...
python test_document_processing.py

echo.
echo 🎉 Setup complete! Try uploading a document now.
pause