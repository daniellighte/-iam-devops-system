FROM node:20-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json ./

RUN npm install --ignore-scripts 2>/dev/null || true && \
    mkdir -p node_modules

COPY . .

USER appuser

EXPOSE 3000

CMD ["node", "-e", "const h=require('http');h.createServer((q,r)=>{r.end(JSON.stringify({status:'ok'}))}).listen(3000)"]
