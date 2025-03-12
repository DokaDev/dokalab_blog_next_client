FROM node:20.13.1
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 
# CMD ["npx", "next", "start"] 