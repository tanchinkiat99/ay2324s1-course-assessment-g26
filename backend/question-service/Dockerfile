FROM node:18
WORKDIR /app

#Install Dependency
COPY package.json .
RUN npm install

# Copy source code into Docker
COPY . ./

EXPOSE 5000

CMD ["node", "src/index.js"]
