import logging
import sys

class MemoryUsageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process the request
        response = self.get_response(request)
        
        # Log memory usage after request is processed (Windows-compatible)
        try:
            if sys.platform == "win32":
                # On Windows, use psutil if available or skip memory logging
                try:
                    import psutil
                    import os
                    process = psutil.Process(os.getpid())
                    usage = process.memory_info().rss / (1024 * 1024)  # Convert to MB
                    logging.info(f"Memory usage: {usage:.2f} MB for {request.path}")
                except ImportError:
                    # Skip memory logging if psutil is not available
                    logging.info(f"Request processed: {request.path}")
            else:
                # On Unix systems, use resource module
                import resource
                usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
                logging.info(f"Memory usage: {usage/1024:.2f} MB for {request.path}")
        except Exception as e:
            logging.error(f"Memory monitoring error: {e}")
        
        return response