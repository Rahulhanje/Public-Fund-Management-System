#!/usr/bin/env python
"""
Test different GROQ model names to find supported ones
"""

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

# Common model names that might be available
models_to_test = [
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant", 
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma-7b-it",
    "gemma2-9b-it",
    "llama-3.2-1b-preview",
    "llama-3.2-3b-preview",
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
]

def test_model(model_name):
    try:
        print(f"Testing model: {model_name}")
        llm = ChatGroq(model_name=model_name, temperature=0)
        response = llm.invoke("Hello! Please respond with 'Working'.")
        print(f"✅ {model_name}: {response.content}")
        return True
    except Exception as e:
        print(f"❌ {model_name}: {str(e)[:100]}...")
        return False

if __name__ == "__main__":
    print("Testing GROQ models...\n")
    working_models = []
    
    for model in models_to_test:
        if test_model(model):
            working_models.append(model)
        print()
    
    print(f"\nWorking models: {working_models}")