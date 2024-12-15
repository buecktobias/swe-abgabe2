FROM node:22.9.0-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    gcc \
    g++ \
    libc6-dev \
    git \
    pkg-config \
    curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev && npm install @nestjs/cli && npm cache clean --force

COPY . .

RUN npm run build

RUN mkdir -p log && touch log/server.log

EXPOSE 3000

CMD ["node", "dist/main.js"]
