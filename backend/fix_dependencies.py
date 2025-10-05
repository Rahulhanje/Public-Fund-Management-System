#!/usr/bin/env python
"""
Script to fix missing dependencies for AI document processing
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ Successfully installed {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")
        return False

def main():
    print("🔧 Fixing AI dependencies for document processing...")
    
    # Required packages
    packages = [
        "pypdf==5.4.0",
        "PyPDF2==3.0.1", 
        "langchain==0.3.21",
        "langchain-community==0.3.20",
        "langchain-groq==0.3.1",
        "langchain-huggingface==0.1.2",
        "faiss-cpu==1.10.0",
        "sentence-transformers==3.4.1"
    ]
    
    success_count = 0
    for package in packages:
        if install_package(package):
            success_count += 1
    
    print(f"\n📊 Installation Results: {success_count}/{len(packages)} packages installed successfully")
    
    if success_count == len(packages):
        print("✅ All dependencies installed successfully!")
        print("🚀 You can now test document processing again.")
    else:
        print("⚠️  Some packages failed to install. Please check the errors above.")
    
    return success_count == len(packages)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)