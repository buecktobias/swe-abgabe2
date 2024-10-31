FROM python:3.10-alpine

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/src

COPY src/ /app/src/

CMD ["python", "./src/main.py"]
