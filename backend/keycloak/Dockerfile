# Use an official Python runtime as a parent image
FROM python:3.10-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "./keycloak_manager.py"]
