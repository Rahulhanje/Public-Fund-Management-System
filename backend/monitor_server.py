#!/usr/bin/env python
"""
Server monitoring script to check for errors and test functionality
"""

import requests
import time
import json
import os
from datetime import datetime

def check_server_status():
    """Check if the Django server is running"""
    try:
        response = requests.get('http://localhost:8000/', timeout=5)
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Server connection error: {e}")
        return False

def test_document_endpoint():
    """Test the document analysis endpoint with a simple file"""
    try:
        # Create a simple test file
        test_content = """
        Government Project Proposal
        Project Name: Water Infrastructure Upgrade
        Budget: $500,000
        Timeline: 6 months
        Objectives: Replace old pipelines and improve water quality
        Expected Beneficiaries: 10,000 residents
        """
        
        # Create a simple text file for testing
        files = {
            'file': ('test_proposal.txt', test_content, 'text/plain')
        }
        
        print("🧪 Testing document analysis endpoint...")
        response = requests.post('http://localhost:8000/analyze/', files=files, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Document analysis working!")
            print(f"📊 Analysis status: {result.get('status', 'Unknown')}")
            return True
        else:
            print(f"❌ Document analysis failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Document analysis test error: {e}")
        return False

def monitor_server():
    """Monitor server continuously"""
    print("🔍 Starting server monitoring...")
    print("Press Ctrl+C to stop monitoring")
    
    while True:
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Check server status
            server_ok = check_server_status()
            status_emoji = "✅" if server_ok else "❌"
            
            print(f"\n[{timestamp}] {status_emoji} Server Status: {'Running' if server_ok else 'Down'}")
            
            if server_ok:
                print("🌐 Server endpoints:")
                print("   - Main: http://localhost:8000/")
                print("   - Admin: http://localhost:8000/admin/")
                print("   - Document Analysis: http://localhost:8000/analyze/ (POST only)")
                
                # Test document processing every 5th check
                if int(time.time()) % 30 == 0:  # Every 30 seconds
                    test_document_endpoint()
            
            time.sleep(10)  # Check every 10 seconds
            
        except KeyboardInterrupt:
            print("\n👋 Monitoring stopped by user")
            break
        except Exception as e:
            print(f"❌ Monitoring error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    monitor_server()