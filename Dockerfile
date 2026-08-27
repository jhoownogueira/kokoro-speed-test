FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY index.js ./
COPY public ./public

ENV NODE_ENV=production
EXPOSE 9595

CMD ["npm", "start"]
