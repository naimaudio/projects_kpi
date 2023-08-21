FROM node:18-alpine

WORKDIR /frontend
COPY ./frontend .
RUN mkdir -p /certificates 
COPY ./certificates /certificates


RUN npm install

RUN npm run build

CMD [ "npm", "run", "preview" ]