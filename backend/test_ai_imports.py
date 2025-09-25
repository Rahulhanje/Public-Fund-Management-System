#!/usr/bin/env python
"""
Test script to verify all AI dependencies are working correctly
"""

import os
import sys

def test_imports():
    print("Testing AI dependencies...")
    
    try:
        print("1. Testing basic imports...")
        import tempfile
        print("✓ tempfile")
        
        print("2. Testing langchain imports...")
        from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
        print("✓ document_loaders")
        
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        print("✓ text_splitter")
        
        from langchain_community.vectorstores import FAISS
        print("✓ FAISS")
        
        from langchain_huggingface import HuggingFaceEmbeddings
        print("✓ HuggingFaceEmbeddings")
        
        from langchain.chains import RetrievalQA
        print("✓ RetrievalQA")
        
        from langchain_groq import ChatGroq
        print("✓ ChatGroq")
        
        from langchain.prompts import PromptTemplate
        print("✓ PromptTemplate")
        
        print("3. Testing environment variables...")
        from dotenv import load_dotenv
        load_dotenv()
        
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key:
            print(f"✓ GROQ_API_KEY found (length: {len(groq_key)})")
        else:
            print("✗ GROQ_API_KEY not found")
            
        print("\n4. Testing GROQ connection...")
        llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0)  # Working model
        test_response = llm.invoke("Hello, this is a test. Please respond with 'AI system working correctly.'")
        print(f"✓ GROQ response: {test_response.content}")
        
        print("\n5. Testing HuggingFace embeddings...")
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        test_embedding = embeddings.embed_query("test text")
        print(f"✓ HuggingFace embeddings working (vector length: {len(test_embedding)})")
        
        print("\nAll dependencies are working correctly! ✅")
        return True
        
    except Exception as e:
        print(f"\n❌ Error testing dependencies: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)