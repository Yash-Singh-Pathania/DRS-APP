import logging
import sys
import os

# Create logger
logger = logging.getLogger("drs_app")
logger.setLevel(logging.INFO)

# Create console handler - log to stdout for cloud environments
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)

# Create formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

# Add handlers to logger
logger.addHandler(console_handler)

# Only add file logging in development environments, not in production
if os.environ.get('ENVIRONMENT') == 'development':
    try:
        from logging.handlers import RotatingFileHandler
        # Ensure logs directory exists
        os.makedirs('logs', exist_ok=True)
        
        # Create file handler
        file_handler = RotatingFileHandler(
            "logs/drs_app.log", 
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        logger.warning(f"Could not set up file logging: {e}")

