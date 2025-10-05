#!/usr/bin/env python
"""
Quick test to verify document processing works
"""

import os
import sys
import tempfile
from io import BytesIO

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def test_pdf_processing():
    """Test PDF processing with a simple test file"""
    try:
        print("🧪 Testing PDF processing...")
        
        # Import our utils
        from APIs.utils import load_document
        
        # Create a simple test PDF content (mock file)
        class MockFile:
            def __init__(self, name, content):
                self.name = name
                self.content = content
                self.size = len(content)
            
            def read(self):
                return self.content
        
        # Test with a simple text file first
        test_content = b"This is a test document for AI verification. Project budget: $500,000. Timeline: 6 months."
        mock_file = MockFile("test.txt", test_content)
        
        print("📄 Loading test document...")
        documents = load_document(mock_file)
        
        if documents and len(documents) > 0:
            print(f"✅ Document loaded successfully!")
            print(f"📊 Content preview: {documents[0].page_content[:100]}...")
            return True
        else:
            print("❌ No documents loaded")
            return False
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_ai_chain():
    """Test the AI processing chain"""
    try:
        print("\n🤖 Testing AI processing chain...")
        
        from APIs.utils import create_rag_system, analyze_document
        from langchain.schema import Document
        
        # Create test documents
        test_docs = [
            Document(
                page_content="Government Project Proposal: Water Infrastructure Upgrade. Budget: $500,000. Timeline: 6 months. Objectives: Replace old pipelines, improve water quality, serve 10,000 residents.",
                metadata={"source": "test.pdf"}
            )
        ]
        
        print("🔗 Creating RAG system...")
        qa_chain = create_rag_system(test_docs)
        
        print("❓ Running test questions...")
        test_questions = [
            "What is the project budget?",
            "What are the main objectives?"
        ]
        
        results = analyze_document(qa_chain, test_questions)
        
        if results and len(results) > 0:
            print("✅ AI analysis completed successfully!")
            for result in results:
                print(f"Q: {result['Question']}")
                print(f"A: {result['Answer'][:100]}...")
                print()
            return True
        else:
            print("❌ No analysis results")
            return False
            
    except Exception as e:
        print(f"❌ Error during AI test: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔍 Testing AI Document Processing System\n")
    
    # Test 1: Document loading
    doc_test = test_pdf_processing()
    
    # Test 2: AI processing
    ai_test = test_ai_chain()
    
    print("\n📋 Test Results:")
    print(f"📄 Document Loading: {'✅ PASS' if doc_test else '❌ FAIL'}")
    print(f"🤖 AI Processing: {'✅ PASS' if ai_test else '❌ FAIL'}")
    
    if doc_test and ai_test:
        print("\n🎉 All tests passed! Your AI document processing is working.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")
    
    return doc_test and ai_test

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)